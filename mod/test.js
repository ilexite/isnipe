const api = require("../src/api");

class Test extends api.baseClass {
	constructor(sd, config) {
		super("test", "Test", "A test module");

		this.sd = sd;
		this.config = config;
	}

	start() {
		this.active = true;
		this.log("Started!");

		setInterval(() => this.log("Test"), 1000);
	}

	stop() {
		return new Promise(resolve => {
			this.active = false;
			this.log("Stopped!");

			resolve();
		});
	}
}

module.exports = Test;
