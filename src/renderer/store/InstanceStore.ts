import Store from "electron-store";
import fs from "fs-extra";
import path from "path";
import { remote } from "electron";
const app = remote.app;
import { InstanceSave } from "./InstanceSave";

/**
 * Returns the path for minecraft saves/logs/configs for a specific instance
 * @param name name of instance
 * TODO: remove duplicate in InstanceController.ts
 */
export const MinecraftSavePath = (name: string) => { return path.join(app.getPath("userData"), "./instances/", name); };

export default class InstanceStore extends Store {
	public constructor() {
		super({
			name: "instances",
			accessPropertiesByDotNotation: true,
			defaults: {
				instances: []
			},
			schema: {
				instances: {
					type: "array"
					// TODO: Improve schema to check for InstanceSave structure
				}
			}
		});
	}
	/**
     * Get list of instances
     */
	public get all(): InstanceSave[] {
		const instances = this.get("instances") as Array<InstanceSave>;
		for (const instance of instances) {
			Object.setPrototypeOf(instance, InstanceSave.prototype);
		}
		return instances;
	}
	/**
     * Add a new instance to the store
     * @param item Instance to be added
     */
	public addInstance(item: InstanceSave): void {
		// TODO: check for name already exists
		const result = this.all.find(obj => obj.name == item.name);
		if (result !== undefined) throw Error("An instance with this name already exists!");
		else this.set("instances", this.get("instances").concat(item));
	}
	/**
     * Deletes an instance by name
     * @throws {Error} if no instance is found
     */
	public deleteInstance(name: string): void {
		const index: number = this.all.findIndex(obj => obj.name == name);
		if (index == -1) throw Error("An instance with this name does not exist");
		const temp = Array.from(this.all);
		temp.splice(index, 1);
		this.set("instances", temp);
	}
	/**
	 * Replace instance with new instance. If name is changed, renames the instance folder
	 * @param name
	 */
	public async setInstance(name: string, newValue: InstanceSave): Promise<void> {
		const i = this.all.findIndex(obj => obj.name == name);

		const temp = this.all;
		temp[i] = newValue;
		console.log(temp);
		// name changed?
		if (name !== newValue.name) {
			// rename folder
			fs.renameSync(MinecraftSavePath(name), MinecraftSavePath(newValue.name));
		}
		this.set("instances", temp);
	}
	/**
	 * Find an instance by name
	 * @param name of instance
	 * @returns value of instance or undefined if not found
	 */
	public findFromName(name: string): InstanceSave | undefined {
		return this.all.find(obj => obj.name == name);
	}
}
