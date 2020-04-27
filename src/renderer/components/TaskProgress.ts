import { Task, TaskRuntime, TaskHandle } from "@xmcl/task";

import type { ResolvedVersion } from "@xmcl/core";
import { LitElement, customElement, TemplateResult, html, property } from "lit-element";

@customElement("task-progress")
export default class TaskProgress extends LitElement {
	protected createRenderRoot(): this { return this; }

	private $progress = (): Element => this.getElementsByClassName("ui progress")[0];

	@property({ type: String }) private message = "";
	@property({ type: String }) private rightMessage = "";

	protected render(): TemplateResult {
		return html`
			<div class="ui container">
				<div class="ui segment">
					<div class="ui olive active progress">
						<div class="bar">
							<div class="progress"></div>
						</div>
						<label class="label" style="text-align: left">${this.message}</label>
						<label id="progress-label-right">${this.rightMessage}</label>
					</div>
				</div>
			</div>
		`;
	}

	/*
	iterable returns tasks in order of insertion.
	1st task is always the task that is rendered
	*/
	private tasks: Map<Task<object>, TaskRuntime> = new Map();

	private addTask(task: Task<object>, runtime: TaskRuntime<Task.State>): void {
		this.tasks.set(task, runtime);
		if (this.tasks.size === 1) {
			// only 1 task in queue means there were no tasks before
			$(this).transition("fly up in");
		}
	}

	private removeTask(task: Task<object>): void {
		this.tasks.delete(task);
		if (this.tasks.size === 0) {
			// hide progress bar
			$(this).transition("fly up out");
		}
	}

	public connectedCallback(): void {
		super.connectedCallback();
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

	private updateUIError(err: Error | string): void {
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
			this.message = msg;
		}
		// set right label
		if (this.tasks.size > 1)
			this.rightMessage =
				`(${this.tasks.size - 1} more task${this.tasks.size > 2 ? "s" : ""} in progress) `;
		else
			this.rightMessage = "";

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
