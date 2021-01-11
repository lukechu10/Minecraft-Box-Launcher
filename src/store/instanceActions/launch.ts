import { launch, Version } from "@xmcl/core";
import { lookupByName } from "@xmcl/user";
import { remote } from "electron";
import mkdirp from "mkdirp";
import path from "path";
import { get } from "svelte/store";
import { authState } from "../authState";
import type { InstanceData } from "../instanceListState";
import { GAME_INSTALL_PATH } from "./install";

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

    let user = get(authState).accounts[0];

    return await launch({
        gamePath,
        resourcePath: GAME_INSTALL_PATH,
        javaPath: "java", // use java from path
        version,
        // Authentication
        accessToken: user.accessToken,
        gameProfile: await lookupByName(user.selectedProfile.name),
    });
}
