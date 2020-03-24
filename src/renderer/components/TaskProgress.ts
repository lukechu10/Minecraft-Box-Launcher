import { Task, TaskRuntime, TaskHandle } from "@xmcl/task";

import taskProgressTemplate from "../templates/TaskProgress.pug";
import { ResolvedVersion } from "@xmcl/core";

export default class TaskProgress extends HTMLDivElement {
	public constructor() {
		super();
	}

	public connectedCallback(): void {
		this.render();
	}

	public render(): void {
		this.innerHTML = taskProgressTemplate();
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
			this.updateTaskUI(taskState, progress, total);
		});

		const handle = runtime.submit(task);
	}

	private updateTaskUI(task: Task.State, progress: number, total?: number) {

	}
}

customElements.define("task-progress", TaskProgress, { extends: "div" });
