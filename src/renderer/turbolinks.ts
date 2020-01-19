import Turbolinks from "turbolinks"; // TODO: replace with stable build once 5.3.0 has been release (for typescript)

Turbolinks.start();

document.addEventListener("turbolinks:load", () => {
	// remove cache to prevent js from loading twice
	// FIXME: should work without clearing cache
	Turbolinks.clearCache();
});
