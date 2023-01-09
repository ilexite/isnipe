import os from "node:os";
import { Module, Program, Config } from "../api";

export default class Dump extends Module {
	constructor(program: Program, config: Config) {
		super(program, config, {
			id: "dump",
			name: "Dump",
			version: "0.0.1",
			description: "Dump system info.",
			author: "ilexite",
		});
	}

	public override start() {
		this.log("isnipe config:");
		JSON.stringify(this.program.config, null, 2)
			.split("\n")
			.forEach(line => this.log(line));

		this.log("system info:");
		this.log(`os: ${os.platform()}`);
		this.log(`arch: ${os.arch()}`);
		this.log(`kernel: ${os.version()}`);

		this.log("");
		this.log("dump complete.");
	}
}
