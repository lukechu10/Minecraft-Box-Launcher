import Store = require("electron-store");
import { InstanceSave } from "./InstanceSave";

export default class InstanceStore extends Store {
	constructor() {
		super({
			name: "instances",
			accessPropertiesByDotNotation: true,
			defaults: {
				instances: []
			},
			schema: {
				instances: {
					type: "array",
					// TODO: Improve schema to check for InstanceSave structure
				}
			}
		});
	}
	/**
     * Get list of instances
     */
	get all(): InstanceSave[] {
		let instances = this.get("instances") as Array<InstanceSave>;
		for (let i = 0; i < instances.length; i++) {
			Object.setPrototypeOf(instances[i], InstanceSave.prototype);
		}
		return instances;
	}
	/**
     * Add a new instance to the store
     * @param item Instance to be added
     */
	addInstance(item: InstanceSave): void {
		// TODO: check for name already exists
		const result = this.all.find(obj => obj.name == item.name);
		if (result !== undefined) throw Error("An instance with this name already exists!");
		else this.set("instances", this.get("instances").concat(item));
	}
	/**
     * Deletes an instance by name
     * @throws {Error} if no instance is found
     */
	deleteInstance(name: string) {
		const index: number = this.all.findIndex(obj => obj.name == name);
		if (index == -1) throw Error("An instance with this name does not exist");
		const temp = Array.from(this.all);
		temp.splice(index, 1);
		this.set("instances", temp);
	}
	/**
	 * Replace instance with new instance
	 * @param name
	 */
	setInstance(name: string, newValue: InstanceSave): void {
		const i = this.all.findIndex(obj => obj.name == name);
		const temp = this.all;
		temp[i] = newValue;
		console.log(temp);
		this.set("instances", temp);
	}
	/**
	 * Find an instance by name
	 * @param name of instance
	 */
	findFromName(name: string): InstanceSave | undefined {
		return this.all.find(obj => obj.name == name);
	}
}