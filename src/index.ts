import App from "./App.svelte";
import "./global.css";

var app = new App({
    target: document.body,
});

export default app;

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if ((import.meta as any).hot) {
    (import.meta as any).hot.accept();
    (import.meta as any).hot.dispose(() => {
        app.$destroy();
    });
}
