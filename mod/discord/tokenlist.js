const fs = require("node:fs/promises");

async function readFile(path) {
	const raw = await fs.readFile(path, "utf8");
	return raw.replace(/;.*$/gm, " ").split(/\s+/).filter(Boolean);
}

module.exports = { readFile };
