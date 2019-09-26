import { Auth } from '@xmcl/minecraft-launcher-core';

export async function login(username: string, password: string): Promise<string> {
    const authFromMojang: Auth = await Auth.Yggdrasil.login({ username, password }); // official login
    const accessToken: string = authFromMojang.accessToken;
    return accessToken;
}