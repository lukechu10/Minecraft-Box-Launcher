import { Installer } from "@xmcl/installer";
import Store from "electron-store";

window.__preload = {
    Installer,
    // @ts-expect-error
    Store
};
