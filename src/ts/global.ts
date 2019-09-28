import * as store from './store'
import { login, updateLoginStatus } from './authentication';

// initiate form
$(() => {
    updateLoginStatus();
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
    } as any);

    // login button
    $("#login-btn").click(async (event: JQuery.Event) => {
        event.preventDefault();
        $("#login-form").form("validate form");
        if ($("#login-form").form("is valid")) {
            try {
                // send request to Yggsdrasil auth server
                await login($("#username-field").val() as string, $("#password-field").val() as string);

                // login successfull
                $("#login-modal").modal("hide");
            }
            catch (e) {
                $("#login-errors-container").css("display", "block");
                // if invalid credentials
                if (e.statusCode == 403) {
                    $("#login-errors").html("Invalid username or password!");
                }
                else {
                    $("#login-errors").html("An unknown error occured: " + e);
                }
            }
        }
    });
});