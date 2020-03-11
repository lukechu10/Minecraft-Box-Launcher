import { AuthenticationController } from "./controllers/AuthenticationController";

import "./components/NewInstanceModal";
import NewInstanceModal from "./components/NewInstanceModal";
import { AuthModal } from "./components/AuthModal";

export * from "./controllers/SettingsModal";

/**
 * Shows new instance window
 * @deprecated
 */
export function newInstance(): void {
	// $("#modal-newInstance").replaceWith(newInstanceModal({ name }));
	// $("#modal-newInstance").modal({
	// 	closable: false
	// }).modal("show");

	// NewInstanceController.attachEvents(); // attach events
	(document.getElementById("modal-newInstance") as NewInstanceModal).render();
}

/**
 * Shows modal that appears over page
 */
export function showLoginModal(): void {
	(document.getElementById("modal-login") as AuthModal).render();
}
