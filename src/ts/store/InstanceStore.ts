import Store = require("electron-store");
import InstanceSave from "../instance/InstanceSave";

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
    get instances(): InstanceSave[] {
        return this.get("instances") as InstanceSave[];
    }
    /**
     * Add a new instance to the store
     * @param item Instance to be added
     */
    addInstance(item: InstanceSave): void {
        // TODO: check for name already exists
        const result = this.instances.find(obj => obj.name == item.name);
        if (result !== undefined) throw Error("An instance with this name already exists!");
        else this.set("instances", this.get("instances").concat(item));
    }
    /**
     * Deletes an instance by name
     * @throws {Error} if no instance is found
     */
    deleteInstance(name: string) {
        // FIXME: fix .splice
        const index: number = this.instances.findIndex(obj => obj.name == name);
        console.log(index)
        if (index == -1) throw Error("An instance with this name does not exist");
        const temp = Array.from(this.instances);
        console.log(temp.splice(index))
        this.set("instances", temp);
    }
}