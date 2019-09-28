"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const minecraft_launcher_core_1 = require("@xmcl/minecraft-launcher-core");
const store = __importStar(require("./store"));
function login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const authFromMojang = yield minecraft_launcher_core_1.Auth.Yggdrasil.login({ username, password });
        store.auth.set(authFromMojang);
        store.auth.set("loggedIn", true);
        return authFromMojang;
    });
}
exports.login = login;
function showLoginModal() {
    $("#login-modal").modal({
        onDeny: () => {
        }
    }).modal('show');
}
exports.showLoginModal = showLoginModal;
function updateLoginStatus() {
    if (store.auth.get("loggedIn", false) == false) {
        $("#login-status").html("Log in");
        $("#login-status").attr("onclick", "auth.showLoginModal()");
    }
    else {
        $("#login-status").html(store.auth.get("profiles")[0].name);
        $("#login-status").attr("onclick", "");
    }
}
exports.updateLoginStatus = updateLoginStatus;
//# sourceMappingURL=authentication.js.map