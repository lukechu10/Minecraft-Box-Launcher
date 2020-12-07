/**
 * @file Alias in Snowpack for `electron` to retrieve the package from `window.__preload`.
 */

const { remote } = require("electron");

export { remote };
