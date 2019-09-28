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
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./authentication");
$(() => {
    authentication_1.updateLoginStatus();
    $("#login-form").form({
        fields: {
            username: {
                identifier: 'username',
                rules: [{
                        type: 'email',
                        prompt: 'Invalid email'
                    }]
            },
            password: {
                identifier: 'password',
                type: 'minLength[1]',
                prompt: 'Please enter your password'
            }
        }
    });
    $("#login-btn").click((event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        $("#login-form").form("validate form");
        if ($("#login-form").form("is valid")) {
            try {
                yield authentication_1.login($("#username-field").val(), $("#password-field").val());
                $("#login-modal").modal("hide");
            }
            catch (e) {
                $("#login-errors-container").css("display", "block");
                if (e.statusCode == 403) {
                    $("#login-errors").html("Invalid username or password!");
                }
                else {
                    $("#login-errors").html("An unknown error occured: " + e);
                }
            }
        }
    }));
});
//# sourceMappingURL=global.js.map