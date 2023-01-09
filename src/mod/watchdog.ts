import { watch } from "node:fs/promises";

import { config as dir } from "../paths";
import { Module, Program, Config } from "../api";
import { getConfig, updateConfig } from "../config";

/**
 * fs.watch is unstable.
 * This module often reports updates multiple times.
 */
export default class Watchdog extends Module {
	ac = new AbortController();

	constructor(program: Program, config: Config) {
		super(program, config, {
			id: "watchdog",
			name: "Watchdog",
			version: "0.0.1",
			description: "Watches for config updates.",
			author: "ilexite",
		});
	}

	public override async start() {
		this.log(`Watching for changes in ${dir}...`);

		for await (const event of watch(dir, { signal: this.ac.signal })) {
			if (event.eventType != "change") return;
			console.dir(event);

			this.log("Updating config...");

			updateConfig();
			this.program.config = getConfig();
		}
	}

	public override async stop() {
		this.ac.abort();
		this.log("Stopped.");
	}
}
