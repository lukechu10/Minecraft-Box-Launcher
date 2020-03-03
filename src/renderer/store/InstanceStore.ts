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
}

export default new InstanceStore(); // singleton