import { html } from '../lib/lib.js';
import { login } from '../data/auth.js';
import { createSubmitHandler } from '../utils/utils.js';
import { pageEndpoints } from '../app.js';

// TODO change with actual view

export const loginTemplate = (onLogin) => html`
<section id="login">
    <div class="form">
        <form class="login-form" @submit="${onLogin}">
            <label id="loginPageLabel" for="login">Login form</label>
            <!-- <label for="username">Username:</label> -->
            <input type="text" id="username" name="username" required placeholder="username">

            <!-- <label for="password">Password:</label> -->
            <input type="password" id="password" name="password" required placeholder="password">

            <button type="submit">Log In</button>
            <p class="message">Not registered? <a href="/register">Create an account</a></p>
        </form>
    </div>
</section>
`;

export function loginPage(ctx) {
    ctx.render(loginTemplate(createSubmitHandler(onLogin)));

    async function onLogin({ username, password }, form) {
        if (username == '' || password == '') {
            return alert('All fields are required');
        }
        const res = await login(username, password);
        console.log(res);
        form.reset();
        ctx.page.redirect(pageEndpoints.home);
    }
}