import { config as dir } from "./paths";
import { Index } from "./util";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { decode } from "ini";

let config = {};

export type Config = {
	enabled: boolean;
	[key: Index]: any;
};

export async function updateConfig() {
	const raw = await readRaw(resolve(dir, "isnipe.ini"));
	const data = await postProcess(raw);

	return (config = data);
}

export function getConfig() {
	return config;
}

async function readRaw(path: string) {
	const raw = await readFile(path, "utf8");
	const parsed = decode(raw);

	return parsed;
}

async function postProcess(data: Record<string, any>) {
	let copy = Object.assign({}, data);

	for (const [key, val] of Object.entries(data)) {
		if (key == "include") {
			copy = {
				...(await readRaw(resolve(dir, val))),
				...data,
			};
		}

		if (typeof val == "object") copy[key] = await postProcess(val);
	}

	delete copy.include;
	return copy;
}
