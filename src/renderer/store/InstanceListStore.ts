import Store from "electron-store";
import { InstanceData } from "./InstanceData";
import Instance from "../Instance";

class InstanceListStore {
	public store: Store<{ instances: InstanceData[] }>;
	public constructor() {
		this.store = new Store<{ instances: InstanceData[] }>({
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
			watch: true,
			serialize: obj => JSON.stringify(obj, (key, value) => {
				// remove isInstalling field
				if (key === "isInstalling") return undefined;
				else return value;
			})
		});

		// get initial data from store
		const instanceDataList: InstanceData[] = this.store.get("instances");
		// add isInstalling field and add Instance prototype
		this.instances = instanceDataList.map<Instance>(instance => new Instance({
			...instance,
			isInstalling: false
		}));
	}

	public instances: Instance[] = [];

	/**
	 * Save data to store
	 */
	public syncToStore() {
		this.store.set("instances", this.instances); // Instance prototype should be removed when syncing to store
	}

	/**
	 * Attempts to find an instance by name
	 * @param name name of instance
	 * @returns value of instance of `null` if no instance matching name exists
	 */
	public findInstanceName(name: string): InstanceData | null {
		const findRes = this.store.get("instances").find(obj => obj.name === name);
		return findRes === undefined ? null : findRes;
	}

	/**
	 * Replace instance with `name` by `instance`.
	 * @param name name of instance
	 * @param instance instance data
	 */
	public modifyInstance(name: string, instance: Instance): void {
		const i = this.instances.findIndex(obj => obj.name === name);
		if (i === -1) throw new Error("An instance with this name does not exist");
		this.instances[i] = instance;
	}

	public deleteInstance(name: string): void {
		const i = this.instances.findIndex(obj => obj.name === name);
		if (i === -1) throw new Error("An instance with this name does not exist");
		this.instances.splice(i, 1);
	}
}

export default new InstanceListStore(); // singleton
