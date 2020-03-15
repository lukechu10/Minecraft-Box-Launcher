import Store from "electron-store";
import { InstanceData } from "./InstanceData";

class InstanceStore extends Store<{ instances: InstanceData[] }> {
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
			},
			watch: true
		});
	}

	/**
	 * Add a new instance to the store
	 * @param item Instance to be added
	 * @throws {Error} if instance already exists
	 */
	public addInstance(item: InstanceData): void {
		const findRes = this.get("instances").find(obj => obj.name == item.name);
		if (findRes !== undefined) throw Error("An instance with this name already exists!");
		else this.set("instances", this.get("instances").concat(item)); // add instance to instances array
	}

	/**
	 * Attempts to find an instance by name
	 * @param name name of instance
	 * @returns value of instance of `null` if no instance matching name exists
	 */
	public findInstance(name: string): InstanceData | null {
		const findRes = this.get("instances").find(obj => obj.name === name);
		return findRes === undefined ? null : findRes;
	}

	/**
	 * Replace instance with `name` by `instance`.
	 * @param name name of instance
	 * @param instance instance data
	 */
	public modifyInstance(name: string, instance: InstanceData): void {
		const i = this.get("instances").findIndex(obj => obj.name === name);
		if (i === -1) throw new Error("An instance with this name does not exist");
		const temp = this.get("instances");
		temp[i] = instance;
		this.set("instances", temp);
	}

	public deleteInstance(name: string): void {
		const temp = this.get("instances");
		const i = temp.findIndex(obj => obj.name === name);
		if (i === -1) throw new Error("An instance with this name does not exist");
		temp.splice(i, 1);
		this.set("instances", temp);
	}
}

export default new InstanceStore(); // singleton
