// Local files
const paths = require("./paths");
const bootstrapper = require("./bootstrapper");
const SharedData = require("./sharedData");

const package = require("../package.json");

// Node modules
const fs = require("node:fs/promises");
const fss = require("node:fs");
const path = require("node:path");
const os = require("node:os");

// NPM modules
const ini = require("ini");
const { Command } = require("commander");

// Commander stuff; responsible for command-line arguments
const program = new Command();

program
	.name(package.name)
	.description(package.description)
	.version(package.version);

program
	.command("dump")
	.description("Dump data. Useful for debugging.")
	.action(() => dump());

program
	.command("run")
	.description("You know what it does.")
	.action(() => main());

program.parse();

// Entry point; assuming `run` command is used.
async function main() {
	const sd = new SharedData();
	const config = await preprocess(await readini(paths.configFile));

	// Get modules
	let mods = await bootstrapper.startup(sd, config);
	sd.set("modules", mods);

	// Start enabled modules
	for (const mod of sd.get("modules")) {
		if (!config[mod.id]?.enabled) continue;
		mod.start();
	}

	const stop = async () => {
		console.log("Quitting...");

		for (const mod of sd.get("modules")) if (mod.active) await mod.stop();

		process.exit(0);
	};

	process.on("SIGINT", stop); // Ctrl+C
	process.on("SIGTERM", stop); // `kill`, `pkill`, `killall`
}

// Debug info
async function dump() {
	// Environment info
	console.log("== Begin Info ==");
	console.log("Version: %s", package.version);
	console.log("OS: %s", os.platform());
	console.log("Arch: %s", os.arch());
	console.log("Kernel: %s", os.version());
	console.log("== End Info ==");

	const config = await preprocess(await readini(paths.configFile));

	// Config as one object
	console.log("== Begin Config ==");
	console.log(config);
	console.log("== End Config ==");
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

// Replace `include = file.ini` with `file.ini`'s contents
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
