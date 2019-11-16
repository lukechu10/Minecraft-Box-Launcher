import { Auth } from "@xmcl/auth";

import { ApplicationStore } from "../../universal/store";
import { Render } from "../Render";

export namespace AuthenticationController {
    /**
     * Sends a request Yggdrasil auth server and stores the returned data
     * @param username Minecraft email
     * @param password Minecraft password
     */
    export async function login(username: string, password: string): Promise<Auth> {
        const authFromMojang: Auth = await Auth.Yggdrasil.login({ username, password }); // official login
        // save data to electron store
        ApplicationStore.auth.set(authFromMojang);
        ApplicationStore.auth.set("loggedIn", true);
        Render.updateLoginStatus("login");
        return authFromMojang;
    }
    /**
     * Logouts user and resets store
     */
    export async function logout(): Promise<void> {
        ApplicationStore.auth.clear();
        ApplicationStore.auth.set("loggedIn", false);
        Render.updateLoginStatus("logout");
        return;
    }
}