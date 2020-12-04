/**
 * @file Alias in Snowpack for `electron-store` to retrieve the package from `window.__preload`.
 */
const Store: import("electron-store") = (window as any).__preload.Store;

export default Store;
