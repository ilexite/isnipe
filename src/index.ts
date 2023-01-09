import { EventEmitter } from "node:events";
import { resolve } from "node:path";

import { updateConfig, Config } from "./config";
import { Indexable } from "./util";
import { Module } from "./api";
import { modules as dir } from "./paths";

export class Program {
	config: Indexable<Config> = {};
	modules: Module[] = [];

	sharedData: Indexable<any> = {
		events: new EventEmitter(),
	};

	async run() {
		this.config = await updateConfig();
		this.initModules();

		process.on("SIGINT", () => this.cleanExit());
		process.on("SIGTERM", () => this.cleanExit());
	}

	async initModules() {
		let mods = [];
		let ids: string[] = [];
		let configs: Config[] = [];

		for await (const [id, config] of Object.entries(this.config)) {
			if (!config.enabled) continue;
			if (ids.includes(id)) continue;

			ids.push(id);
			mods.push(import(resolve(dir, id)));
			configs.push(config);
		}

		this.modules = (await Promise.all(mods)).map(
			(module, idx) => new module.default(this, configs[idx]),
		);

		this.modules.forEach(module => !module.running && module._start());
	}

	async cleanExit() {
		console.log("Quitting...");

		this.modules.forEach(
			async module => module.running && (await module._stop()),
		);

		process.exit(0);
	}
}

const program = new Program();
program.run();
