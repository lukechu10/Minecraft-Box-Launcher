/**
 * @file Alias in Snowpack for `@xmcl/installer` to retrieve the package from `window.__preload`.
 */
export const Installer: typeof import("@xmcl/installer").Installer = (window as any)
    .__preload.Installer;
