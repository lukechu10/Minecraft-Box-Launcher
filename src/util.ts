// @ts-nocheck

// File to export preloaded modules as ESM
export const Installer: import("@xmcl/installer").Installer =
    window.__preload.Installer;
export const Store: import("electron-store") = window.__preload.Store;
