import { Program } from ".";
import { Config } from "./config";

interface Metadata {
	id: string;
	name: string;
	version: string;
	description?: string;
	author?: string;
}

/**
 * Modules should always extend from this class.
 */
export class Module {
	meta: Metadata;
	program: Program;
	config: Config;

	private isRunning = false;

	constructor(program: Program, config: Config, meta: Metadata) {
		this.program = program;
		this.config = config;
		this.meta = meta;
	}

	public get running() {
		return this.isRunning;
	}

	private set running(value: boolean) {
		this.isRunning = value;
	}

	public get sharedData() {
		return this.program.sharedData;
	}

	public log(text: string) {
		console.log(`[${this.meta.id}] ${text}`);
	}

	public start() {
		this.log("Started.");
	}

	public async _start() {
		this.running = true;
		this.start();
	}

	public async stop() {
		this.log("Stopped.");
	}

	public async _stop() {
		this.running = false;
		await this.stop();
	}
}

export { Program, Config };
