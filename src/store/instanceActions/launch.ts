import type { InstanceData } from "../instanceListState";
import { Version, launch } from "@xmcl/core";
import path from "path";
import { remote } from "electron";
import { GAME_INSTALL_PATH } from "./install";
import mkdirp from "mkdirp";

const INSTANCES_PATH = path.join(remote.app.getPath("userData"), "instances");

export async function launchInstance(instance: InstanceData) {
    const version = await Version.parse(GAME_INSTALL_PATH, instance.id);
    console.log("Launching instance", instance, "with version", version);

    const gamePath = path.join(
        INSTANCES_PATH,
        `${instance.name}-${instance.uuid}`
    ); // add uuid to final folder name to prevent name clashes

    // make sure gamePath exists
    mkdirp(gamePath);

    launch({
        gamePath,
        resourcePath: GAME_INSTALL_PATH,
        javaPath: "java", // use java from path
        version,
    });
}
