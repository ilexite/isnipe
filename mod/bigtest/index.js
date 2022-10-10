const api = require("../../src/api");

const { getText } = require("./textGenerator");

class BigTest extends api.baseClass {
	constructor(sd, config) {
		super("bigtest", "Big Test", "A bigger test module");

		this.sd = sd;
		this.config = config;
	}

	start() {
		this.active = true;
		this.log("Started!");

		setInterval(() => {
			this.info(getText());
			setTimeout(() => this.log(getText()), 250);
			setTimeout(() => this.warning(getText()), 500);
			setTimeout(() => this.error(getText()), 750);
		}, 1000);
	}

	stop() {
		return new Promise(resolve => {
			this.active = false;
			this.log("Stopped!");

			resolve();
		});
	}
}

module.exports = BigTest;
