const api = require("../../src/api");
const util = require("../../src/util");

const tokens = require("./tokenlist");
const dcapi = require("./api");

const path = require("node:path");

// Messages which are printed when something happens
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

		// Which master redeems the code. Incremented every time a valid code is
		// redeemed
		this.which = 0;

		// Cache of codes which are tried. This hopes to stop us from redeeming
		// the same code more than once.
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
		// Do nothing if this code has been tried already.
		if (this.cache.includes(code)) return;

		const start = performance.now();

		// Redeem the code
		const result = await this.masters[this.which].redeem(code);

		// Calculate time (2 decimal points)
		const time = Math.floor((performance.now() - start) * 100) / 100;

		// Add the code to the cache
		this.cache.push(code);

		if (result.success) {
			// Print success message
			this.logfmt(1, code, time, which);

			// Increment `which`. If which exceeds the number of masters, revert
			// to 0
			which++;
			which %= this.masters.length;
		} else {
			// Print failure message
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

		// Create a socket client for each slave
		this.slaves = (await this.getTokens("slaves")).map(
			token => new dcapi.Socket(token, this),
		);

		// Create a REST client for each master
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
