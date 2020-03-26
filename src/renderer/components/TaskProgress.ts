import { Task, TaskRuntime, TaskHandle } from "@xmcl/task";

import taskProgressTemplate from "../templates/TaskProgress.pug";
import { ResolvedVersion } from "@xmcl/core";

export default class TaskProgress extends HTMLDivElement {
	private $progress = () => this.getElementsByClassName("ui progress")[0];

	/*
	iterable returns tasks in order of insertion.
	1st task is always the task that is rendered
	*/
	private tasks: Map<Task<Object>, TaskRuntime> = new Map();

	private addTask(task: Task<Object>, runtime: TaskRuntime<Task.State>) {
		this.tasks.set(task, runtime);
		if (this.tasks.size === 1) {
			// only 1 task in queue means there were no tasks before
			$(this).transition("fly up in");
		}
	}

	private removeTask(task: Task<Object>) {
		this.tasks.delete(task);
		if (this.tasks.size === 0) {
			// hide progress bar
			$(this).transition("fly up out");
		}
	}

	public constructor() {
		super();
	}

	public connectedCallback(): void {
		if (!this.hasChildNodes())
			this.render();
	}

	public render(): void {
		this.innerHTML = taskProgressTemplate();
		$(this.$progress()).progress({
			label: "percent"
		});
		this.style.visibility = "hidden";
	}

	public addInstallTask(task: Task<ResolvedVersion>, instanceName: string): TaskRuntime<Task.State> {
		const runtime = Task.createRuntime();
		let rootNode: Task.State;

		const handle: TaskHandle<ResolvedVersion, Task.State> = runtime.submit(task);

		runtime.on("execute", (node, parentTask) => {
			if (!parentTask) {
				console.log("Install task started");
				rootNode = node;
				this.addTask(task, runtime);
			}
		});

		let prevMessage: string; // prevent updating the dom when unnecessary
		runtime.on("update", ({ progress, total, message }, taskState) => {
			if (rootNode === taskState) {
				this.updateUIProgress(taskState, progress, total);
				console.log(`Install task update (${progress}/${total}). Message: ${message}. State:`, taskState);
			}
			// let msgStr: string = `Installing instance ${instanceName}`;
			// const pathSplit = taskState.path.split(".");
			// if (pathSplit[1] === "installVersion")
			// 	msgStr += " (Installing version) ";
			// else if (pathSplit[1] === "installDependencies") {
			// 	if (pathSplit[2] === "installAssets")
			// 		msgStr += " (Installing assets) ";
			// 	else if (pathSplit[2] === "installLibraries")
			// 		msgStr += " (Installing libraries) ";
			// }
			// if (message !== undefined)
			// 	// msgStr += message + " ";
			// 	// only update if task being rendered is the top task in map
			// 	if (this.tasks.keys().next().value === task && prevMessage !== msgStr) {
			// 		this.updateUIMessage(msgStr, message);
			// 		prevMessage = msgStr;
			// 	}
			this.updateUIMessage(message);

		});

		runtime.on("fail", error => {
			this.updateUIError(error);
			if (!handle.isCancelled) handle.cancel();
			console.error("Install task error:", error);
			// show error for a 5 seconds
			setTimeout(() => { this.removeTask(task); }, 5000);
		});

		runtime.on("finish", (res, state) => {
			if (state.path === "install")
				// show success for 5 seconds or 1.5 second if another task pending
				setTimeout(() => { this.removeTask(task); }, this.tasks.size > 1 ? 1500 : 5000);
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

	private updateUIMessage(fileName?: string): void {
		let msg = `File: ${fileName ?? "loading..."} `;
		$(this.$progress()).progress("set label", msg);
		// set right label
		const rightLabel = document.querySelector<HTMLDivElement>("#progress-label-right");
		if (rightLabel !== null)
			if (this.tasks.size > 1)
				rightLabel.textContent =
					`(${this.tasks.size - 1} more task${this.tasks.size > 2 ? "s" : ""} in progress) `;
	}
}

customElements.define("task-progress", TaskProgress, { extends: "div" });
