import "./components/NewInstanceModal";
import NewInstanceModal from "./components/NewInstanceModal";
import { AuthModal } from "./components/AuthModal";

export * from "./controllers/SettingsModal";

/**
 * Shows new instance window
 * @deprecated
 */
export function newInstance(): void {
	(document.getElementById("modal-newInstance") as NewInstanceModal).render();
}

/**
 * Shows modal that appears over page
 */
export function showLoginModal(): void {
	document.querySelector<AuthModal>("#modal-login")!.showModal();
}
