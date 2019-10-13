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
					items: [
						{
							type: "object"
						}
					]
				}
			}
		});
    }
    /**
     * Get list of instances
     */
    get instances(): InstanceSave {
        return this.get("instances") as InstanceSave;
    }
    /**
     * Add a new instance to the store
     * @param item Instance to be added
     */
    addInstance(item: InstanceSave) {
        this.set("instances", this.get("instances").concat(item));
    }
}