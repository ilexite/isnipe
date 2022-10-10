const api = require("./api");
const paths = require("./paths");

const fs = require("node:fs/promises");
const path = require("node:path");

async function startup(sd, config) {
	const modpaths = (await fs.readdir(paths.mods)).map(mod =>
		path.join(paths.mods, mod),
	);

	let mods = [];

	for (const path of modpaths) {
		const Mod = require(path);

		if (!path instanceof api.baseClass) {
			console.error(
				`Module at ${path} is not an instance of api.baseClass.`,
			);

			continue;
		}

		mods.push(new Mod(sd, config));
	}

	return mods;
}

module.exports = {
	startup,
};
