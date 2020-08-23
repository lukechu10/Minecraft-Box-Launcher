import { EventEmitter } from "events";
import type { Version } from "@xmcl/installer/minecraft";
import type { ChildProcess } from "child_process";

/**
 * Represents one output or error from the process
 */
export interface ProcessMessage {
	message: string;
	type: "out" | "err";
}

/**
 * Manages a running instance.
 * An InstanceProcess attaches event handlers to stdout and stderr and saves the output to logs
 */
export class InstanceProcess extends EventEmitter {
	public process: ChildProcess | null;
	public log: ProcessMessage[] = [];
	public isRunning = false;

	public constructor(process: ChildProcess) {
		super();
		this.process = process;
		this.isRunning = true;
		this.attachEventHandlers();
	}

	private attachEventHandlers(): void {
		this.process!.stdout.on("data", chunk => {
			this.log.push({ message: chunk.toString(), type: "out" });
			this.emit("data");
		});
		this.process!.stderr.on("data", chunk => {
			this.log.push({ message: chunk.toString(), type: "err" });
			this.emit("data");
		});

		this.process!.on("close", () => {
			this.isRunning = false;
			this.emit("close");
		}).on("error", err => {
			this.log.push({ message: err.message, type: "err" });
			this.emit("data");
		});
	}

	public on(event: "data" | "close", listener: () => void): this {
		super.on(event, listener);
		return this;
	}
}

/**
 * InstanceSave without methods
 */
export interface InstanceData extends Version {
	/**
	 * Name of instance
	 */
	name: string;
	/**
	 * UUID v4 to identify the instance
	 */
	uuid: string;
	/**
     * Instance version
     */
	id: string;
	/**
     * Mojang release or snapshot (vanilla only)
     */
	type: string;
	/**
     * Type of client
     */
	clientType: "vanilla" | "forge";
	/**
	 * Format: `new Date().toISOString()` or `"never"` if never played
	 */
	lastPlayed: string | "never";
	/**
	 * Date version was released
	 */
	releaseTime: string;
	url: string;
	/**
	 * Version binaries are completely installed
	 */
	installed: boolean;
	/**
	 * True if current instance is being installed
	 */
	isInstalling: boolean;
	/**
	 * Process for running instance
	 */
	process?: InstanceProcess;
	time: string;
}
