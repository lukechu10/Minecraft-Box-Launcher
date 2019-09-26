import ElectronStore = require('electron-store');
import { Auth } from '@xmcl/minecraft-launcher-core';

const instancesData = new ElectronStore();

/**
 * Sends a request Yggdrasil auth server and stores the returned data
 * @param username Minecraft email
 * @param password Minecraft password
 */
export async function login(username: string, password: string): Promise<Auth> {
    const authFromMojang: Auth = await Auth.Yggdrasil.login({ username, password }); // official login
    // const accessToken: string = authFromMojang.accessToken;
    return authFromMojang;
}

/**
 * Shows modal that appears over page
 */
export function showLoginModal() {
    $("")
}