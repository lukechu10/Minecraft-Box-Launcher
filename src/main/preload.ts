import { Installer } from "@xmcl/installer";
import Store from "electron-store";

// @ts-expect-error
window.__preload = {
    Installer,
    Store
};
