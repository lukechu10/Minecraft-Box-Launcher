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
		$(this.$progress).progress();
	}

	public addInstallTask(task: Task<ResolvedVersion>): void {
		const runtime = Task.createRuntime();
		let rootTask: Task.State;

		runtime.on("execute", (task, parentTask) => {
			if (parentTask) {
				rootTask = task;
			}
		});

		runtime.on("update", ({ progress, total, message }, taskState) => {
			let path = taskState.path;
			this.updateUIProgress(taskState, progress, total);
		});

		runtime.on("fail", error => {
			this.updateUIError(error);
		});

		const handle = runtime.submit(task);
	}

	private updateUIError(err: any) {
		// @ts-ignore FIXME: Fomantic UI feature
		$(this.$progress).progress("set error", err.toString());
	}

	private updateUIProgress(task: Task.State, progress: number, total?: number) {
		if (total !== undefined)
			$(this.$progress).progress("set percent", progress / total);
	}
}

customElements.define("task-progress", TaskProgress, { extends: "div" });
