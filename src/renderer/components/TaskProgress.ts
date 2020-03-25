import { Task, TaskRuntime, TaskHandle } from "@xmcl/task";

import taskProgressTemplate from "../templates/TaskProgress.pug";
import { ResolvedVersion } from "@xmcl/core";

export default class TaskProgress extends HTMLDivElement {
	private $progress = () => this.getElementsByClassName("ui progress")[0];

	public constructor() {
		super();
	}

	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		this.innerHTML = taskProgressTemplate();
		$(this.$progress()).progress();
	}

	public addInstallTask(task: Task<ResolvedVersion>): TaskRuntime<Task.State> {
		const runtime = Task.createRuntime();
		let rootTask: Task.State;

		const handle = runtime.submit(task);

		runtime.on("execute", (task, parentTask) => {
			if (!parentTask) {
				console.log("Install task started");
				rootTask = task;
			}
		});

		runtime.on("update", ({ progress, total, message }, taskState) => {
			let path = taskState.path;
			if (path === "install") {
				this.updateUIProgress(taskState, progress, total);
				console.log(`Install task update (${progress}/${total}). Message: ${message}. State:`, taskState);
			}
			else {
				console.log(taskState.path);
				this.updateUIMessage(`Installing... (Path: ${taskState.path})`);
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
			$(this.$progress()).progress("set percent", progress / total);
	}

	private updateUIMessage(msg: string): void {
		$(this.$progress()).progress("set label", msg);
	}
}

customElements.define("task-progress", TaskProgress, { extends: "div" });
