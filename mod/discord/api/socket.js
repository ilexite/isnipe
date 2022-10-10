const { EventEmitter } = require("node:events");

// Finds nitro codes in messages
const regex = require("../util/regex");

const WebSocket = require("ws");
const erlpack = require("erlpack");

class Socket {
	constructor(token, sniper) {
		this.token = token;
		this.sniper = sniper;

		this.events = new EventEmitter();
		this.session = {}; // Stores session info

		this.events.on("message", msg => {
			// seq should be incremented, but we want to avoid reconnecting.
			this.session.seq = msg.s;
			this.events.emit(msg.t ?? msg.op, msg.d);
		});

		this.events.on("close", code => {
			clearInterval(this.session.beater);

			switch (code) {
				case 4004: // Authentication failed
				case 4008: // Rate limited
				case 4011: // Sharding required
				case 4012: // Invalid API version
				case 4013: // Invalid intents
				case 4014: // Disallowed intents
					this.sniper.error(
						`Socket closed with code ${code}. Not reconnecting.`,
					);

					break;

				default:
					this.sniper.error(
						`Socket closed with code ${code}. Reconnecting.`,
					);

					this.connect();
					break;
			}
		});

		// 10 = HELLO
		// Identify the client
		this.events.on(10, msg => this.ident(msg));

		// Client is ready, store some useful info.
		this.events.on("READY", msg => {
			this.session.id = msg.session_id;
			this.user = msg.user;
			this.session.readymsg = msg;
		});

		// Check for message events where codes could appear
		this.events.on("MESSAGE_CREATE", msg => this.processMessage(msg));
		this.events.on("MESSAGE_UPDATE", msg => this.processMessage(msg));

		// Connect to the gateway
		this.connect();
	}

	connect() {
		this.ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=etf");

		// WebSocket events have to be added again when we reconnect.

		this.ws.on("message", msg =>
			this.events.emit("message", erlpack.unpack(msg)),
		);

		this.ws.on("open", () => this.events.emit("open"));
		this.ws.on("close", code => this.events.emit("close", code));
	}

	send(data) {
		// Only send data when the socket is open
		if (this.ws.readyState == WebSocket.OPEN)
			this.ws.send(erlpack.pack(data));
	}

	ident(msg) {
		this.session.hbint = msg.heartbeat_interval;

		// Send heartbeats when required
		this.session.beater = setInterval(() => {
			this.send({
				op: 1,
				d: this.session.seq,
			});
		}, this.session.hbint);

		this.send(
			this.session.id == undefined
				? {
						op: 2, // IDENTIFY
						d: {
							token: this.token,
							properties: {},
							presence: {
								status: "offline",
							},
						},
				  }
				: {
						op: 6, // RESUME
						d: {
							token: this.token,
							session_id: this.session.id,
							seq: this.session.seq,
						},
				  },
		);
	}

	// Check for any codes in messages
	processMessage(msg) {
		if (!msg.content) return;

		const nitros = new Set(
			[...msg.content.matchAll(regex)].map(i => i.groups.code),
		);

		if (!nitros.size) return;

		for (const nitro of nitros) this.sniper.redeem(nitro);
	}
}

module.exports = Socket;
