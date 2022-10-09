const paths = require("./paths");

const fs = require("node:fs/promises");
const fss = require("node:fs");
const path = require("node:path");

const ini = require("ini");

async function main() {
	if (!fss.existsSync(paths.configFile)) {
		console.error(`Config file not found at ${paths.configFile}.`);
		return;
	};

	const config = await preprocess(await readini(paths.configFile));

	console.log(config);
}

async function readini(file) {
	return ini.parse(await fs.readFile(file, "utf8"));
}

async function preprocess(obj) {
	let copy = obj;

	for (const [key, val] of Object.entries(obj)) {
		if (key == "include") copy = {
			...await readini(val),
			...obj,
		};

		if (val instanceof Object) copy[key] = preprocess(val);
	}

	return copy;
}

main();

