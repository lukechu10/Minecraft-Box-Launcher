import { Task, TaskRuntime, TaskHandle } from "@xmcl/task";

import taskProgressTemplate from "../templates/TaskProgress.pug";
import { ResolvedVersion } from "@xmcl/core";

export default class TaskProgress extends HTMLDivElement {
	private $progress = () => this.getElementsByClassName("ui progress")[0];

	public constructor() {
		super();
	}

	public connectedCallback(): void {
		if (!this.hasChildNodes())
			this.render();
	}

	public render(): void {
		this.innerHTML = taskProgressTemplate();
		$(this.$progress()).progress();
	}

	public addInstallTask(task: Task<ResolvedVersion>, instanceName: string): TaskRuntime<Task.State> {
		const runtime = Task.createRuntime();
		let rootTask: Task.State;

		const handle = runtime.submit(task);

		runtime.on("execute", (task, parentTask) => {
			if (!parentTask) {
				console.log("Install task started");
				rootTask = task;
			}
		});

		let prevMessage: string; // prevent updating the dom when unnecessary
		runtime.on("update", ({ progress, total, message }, taskState) => {
			const path = taskState.path;
			if (path === "install") {
				this.updateUIProgress(taskState, progress, total);
				console.log(`Install task update (${progress}/${total}). Message: ${message}. State:`, taskState);
			}
			else {
				let message: string = `Installing instance ${instanceName}`;
				const pathSplit = path.split(".");
				if (pathSplit[1] === "installVersion")
					message += " (Installing version)";
				else if (pathSplit[1] === "installDependencies") {
					if (pathSplit[2] === "installAssets")
						message += " (Installing assets)";
					else if (pathSplit[2] === "installLibraries")
						message += " (Installing libraries)";
				}
				if (prevMessage !== message) {
					this.updateUIMessage(message);
					prevMessage = message;
				}
			}
		});

		runtime.on("fail", error => {
			this.updateUIError(error);
			if (!handle.isCancelled) handle.cancel();
			console.error("Install task error:", error);
		});

		return runtime;
	}

	private updateUIError(err: any): void {
		// @ts-ignore FIXME: Fomantic UI
		$(this.$progress()).progress("set error", err.toString());
	}

	private updateUIProgress(task: Task.State, progress: number, total?: number): void {
		if (total !== undefined)
			$(this.$progress()).progress("set percent", progress / total * 100);
	}

	private updateUIMessage(msg: string): void {
		$(this.$progress()).progress("set label", msg);
	}
}

customElements.define("task-progress", TaskProgress, { extends: "div" });
