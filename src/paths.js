const path = require("node:path");

const root = path.resolve(__dirname, "..");

module.exports = {
	config: path.join(root, "cfg"),
	configFile: path.join(root, "cfg", "isnipe.ini"),

	mods: path.join(root, "mod"),
};
