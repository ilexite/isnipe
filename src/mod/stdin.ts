import { Module, Program, Config } from "../api";

export default class StandardInput extends Module {
	constructor(program: Program, config: Config) {
		super(program, config, {
			id: "stdin",
			name: "Standard Input",
			version: "0.0.1",
			description: "Control the program through the console.",
			author: "ilexite",
		});
	}

	private functions: Record<string, [string, () => void]> = {
		q: ["Quit", () => this.program.cleanExit()],
		h: ["Show help", () => this.showHelp()],
		m: ["List active modules", () => this.listMods()],
		c: ["Clear screen", () => console.clear()],
	};

	public override start() {
		if (!process.stdin.isTTY) {
			this.log("This module is only supported in a TTY environment.");
			this._stop();
		}

		this.sharedData.stdinFunctions = this.functions;

		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.setEncoding("utf8");

		this.showHelp();
		this.log("More commands may appear in help menu later.");

		process.stdin.on("data", data => this.process(data));
	}

	private showHelp() {
		const functions: { [key: string]: [string, () => void] } =
			this.sharedData.stdinFunctions;

		for (const [key, [desc]] of Object.entries(functions))
			this.log(`[${key}] ${desc}`);
	}

	private listMods() {
		this.log("Currently active modules:");
		this.program.modules
			.map(module => `- ${module.meta.name} [${module.meta.id}]`)
			.forEach(line => this.log(line));
	}

	private process(data: Buffer): void {
		if (data.length > 1)
			return void data.forEach(char => this.process(Buffer.from([char])));

		const char = data.toString();

		this.functions[char]?.[1]();
	}

	public override async stop() {
		if (process.stdin.isTTY) process.stdin.setRawMode(false);
		this.log("Stopped.");
	}
}
