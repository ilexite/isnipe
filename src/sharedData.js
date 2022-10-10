class SharedData {
	constructor() {
		this.data = {};
	}

	get(key) {
		return this.data[key];
	}

	set(key, val) {
		this.data[key] = val;
		return this.data[key];
	}
}

module.exports = SharedData;
