const util = require("./util");

// All modules must inherit this class
class baseClass {
	constructor(id, name, description) {
		this.id = id;
		this.name = name;
		this.description = description;

		this.active = false;
	}

	log(message) {
		console.log(`i [${this.id}] ${message}`);
	}

	info(message) {
		this.log(message);
	}

	warning(message) {
		console.error(
			`${util.fmt("yellow")}w [${this.id}] ${message}${util.fmt(
				"reset",
			)}`,
		);
	}

	error(message) {
		console.error(
			`${util.fmt("red")}e [${this.id}] ${message}${util.fmt("reset")}`,
		);
	}

	dbg(message) {
		console.log(`d [${this.id}] ${message}`);
	}

	start() {
		this.active = true;
		this.error(`Module '${this.name}' has no start() method`);
	}

	stop() {
		return new Promise(resolve => {
			this.active = false;
			this.error(`Module '${this.name}' has no stop() method`);

			resolve();
		});
	}
}

module.exports = {
	baseClass,
};
