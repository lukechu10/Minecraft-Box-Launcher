// import { MinecraftLocation, MinecraftFolder } from "@xmcl/util";

export default interface InstanceSave {
    /**
     * Name of instance
     */
    name: string,
    /**
     * Mojang either release or snapshot
     */
    id?: string,
    /**
     * name of version (human readable)
     */
    type: string
}