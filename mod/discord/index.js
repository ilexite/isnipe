const api = require("../../src/api");
const util = require("../../src/util");

const tokens = require("./tokenlist");
const dcapi = require("./api");

const path = require("node:path");

const messages = [
	"Running with %d slaves and %d masters",
	"Successfully redeemed code %s in %fms on account %s" + util.fmt("bell"),
	"Failed to redeem code %s in %fms",
];

class Discord extends api.baseClass {
	constructor(sd, config) {
		super("discord", "Discord Nitro", "A Discord Nitro sniper module");

		this.sd = sd;
		this.config = config;

		this.which = 0;

		this.cache = [];
	}

	getTokens(type) {
		return tokens.readFile(
			path.resolve(
				__dirname,
				"..",
				"..",
				this.config.discord.tokens[type],
			),
		);
	}

	async redeem(code) {
		if (this.cache.includes(code)) return;

		const start = performance.now();

		const result = await this.masters[this.which].redeem(code);

		const time = Math.floor((performance.now() - start) * 100) / 100;

		this.cache.push(code);

		if (result.success) {
			this.logfmt(1, code, time, which);

			which++;
			which %= this.masters.length;
		} else {
			this.logfmt(2, code, time);
		}
	}

	logfmt(format, ...args) {
		const message = util.cfmt(messages[format], ...args);
		this.log(message);
	}

	async start() {
		this.active = true;
		this.log("Started!");

		this.slaves = (await this.getTokens("slaves")).map(
			token => new dcapi.Socket(token, this),
		);

		this.masters = (await this.getTokens("masters"))
			.map(token => new dcapi.REST(token, this))
			.filter(async master => await master.good());

		this.logfmt(0, this.slaves.length, this.masters.length);
	}

	stop() {
		return new Promise(resolve => {
			this.active = false;
			this.log("Stopped!");

			resolve();
		});
	}
}

module.exports = Discord;
