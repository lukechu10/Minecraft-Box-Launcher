import { Task, TaskRuntime, TaskHandle } from "@xmcl/task";

import taskProgressTemplate from "../templates/TaskProgress.pug";
import { ResolvedVersion } from "@xmcl/core";

export default class TaskProgress extends HTMLDivElement {
	private $progress = (): Element => this.getElementsByClassName("ui progress")[0];

	/*
	iterable returns tasks in order of insertion.
	1st task is always the task that is rendered
	*/
	private tasks: Map<Task<Record<string, any>>, TaskRuntime> = new Map();

	private addTask(task: Task<Record<string, any>>, runtime: TaskRuntime<Task.State>): void {
		this.tasks.set(task, runtime);
		if (this.tasks.size === 1) {
			// only 1 task in queue means there were no tasks before
			$(this).transition("fly up in");
		}
	}

	private removeTask(task: Task<Record<string, any>>): void {
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

		runtime.on("update", ({ progress, total, message }, taskState) => {
			if (rootNode === taskState) {
				console.log(`Install task update (${progress}/${total}). Message: ${message}. State:`, taskState);
			}
			if (task === this.tasks.keys().next().value) {// if task currently being rendered
				if (taskState.path === "install.installDependencies.installAssets") {
					let curPercent: number;
					if (total !== undefined) {
						curPercent = Math.floor(progress / total * 100);
						this.updateUIMessage(message, curPercent);
					}
					else { // set progress to pulsulating indeterminate effect
						this.updateUIMessage(message, -1);
					}
				}
				else this.updateUIMessage(message);
			}
		});

		runtime.on("fail", error => {
			this.updateUIError(error);
			if (!handle.isCancelled) handle.cancel();
			console.error("Install task error:", error);
			// show error for a 5 seconds
			setTimeout(() => { this.removeTask(task); }, 5000);
		});

		runtime.on("finish", (res, state) => {
			if (state.path === "install") {
				if (task === this.tasks.keys().next().value) // if task currently being rendered
					this.updateUISuccess(instanceName);
				// show success for 5 seconds or 1.5 second if another task pending
				setTimeout(() => { this.removeTask(task); }, this.tasks.size > 1 ? 1500 : 5000);
			}
		});

		return runtime;
	}

	private updateUIError(err: any): void {
		// @ts-ignore FIXME: Fomantic UI
		$(this.$progress()).progress("set error", err.toString());
	}

	/**
	 * Update progress bar message
	 * @param percent percentage of task finished. Pass `-1` for indeterminate pulsulating effect
	 * @param fileName name of file being downloaded
	 */
	private updateUIMessage(fileName?: string, percent?: number): void {
		if (fileName !== undefined) {
			const msg = `File: ${fileName} `;
			$(this.$progress()).progress("set label", msg);
		}
		// set right label
		const rightLabel = document.querySelector<HTMLDivElement>("#progress-label-right");
		if (rightLabel !== null)
			if (this.tasks.size > 1)
				rightLabel.textContent =
					`(${this.tasks.size - 1} more task${this.tasks.size > 2 ? "s" : ""} in progress) `;
			else
				rightLabel.textContent = "";
		
		if (percent === -1)
			this.$progress().classList.add("indeterminate");
		else if (percent !== undefined) {
			this.$progress().classList.remove("indeterminate");
			$(this.$progress()).progress("set percent", percent);
		}
	}

	private updateUISuccess(instanceName: string): void {
		// @ts-ignore FIXME: Fomantic UI
		$(this.$progress()).progress("set success", `Successfully installed instance ${instanceName}`);
	}
}

customElements.define("task-progress", TaskProgress, { extends: "div" });
