const paths = require("./paths");
const bootstrapper = require("./bootstrapper");
const SharedData = require("./sharedData");

const fs = require("node:fs/promises");
const fss = require("node:fs");
const path = require("node:path");

const ini = require("ini");

async function main() {
	const sd = new SharedData();
	const config = await preprocess(await readini(paths.configFile));

	let mods = await bootstrapper.startup(sd, config);
	sd.set("modules", mods);

	for (const mod of sd.get("modules")) {
		if (!config[mod.id]?.enabled) continue;
		mod.start();
	}

	const stop = async () => {
		console.log("Quitting...");

		for (const mod of sd.get("modules")) if (mod.active) await mod.stop();

		process.exit(0);
	};

	process.on("SIGINT", stop);
	process.on("SIGTERM", stop);
}

async function readini(file) {
	if (!fss.existsSync(paths.configFile)) {
		console.error(`Config file not found at ${paths.configFile}.`);
		return;
	}

	return ini.parse(
		await fs.readFile(path.resolve(paths.config, file), "utf8"),
	);
}

async function preprocess(obj) {
	let copy = obj;

	for (const [key, val] of Object.entries(obj)) {
		if (key == "include") {
			delete copy[key];

			copy = {
				...(await readini(val)),
				...obj,
			};
		}

		if (typeof val == "object") copy[key] = await preprocess(val);
	}

	return copy;
}

main();
