const path = require("node:path");

const root = path.resolve(__dirname, "..");

module.exports = {
	configFile: path.join(root, "cfg", "isnipe.ini"),
};

