import Store = require("electron-store");

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
    
    get instances() {
        return this.get("instances");
    }
}