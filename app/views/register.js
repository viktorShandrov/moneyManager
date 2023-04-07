import { html } from '../lib/lib.js';
import { register } from '../data/auth.js';
import { createSubmitHandler } from '../utils/utils.js';
import { pageEndpoints } from '../app.js';


export const registerTemplate = (onRegister) => html`
<section id="register">
    <div class="form">
        <form class="login-form" @submit=${onRegister}>
        <label id="registerPageLabel" for="register">Register form</label>
            <input	type="text"	name="username"	id="register-username"	placeholder="username" />  
            <input type="text" name="email" id="register-email" placeholder="email" />
            <input type="password" name="password" id="register-password" placeholder="password" />
            <input type="password" name="re-password" id="repeat-password" placeholder="repeat password" />
            <button type="submit">Register</button>
            <p class="message">Already registered? <a href="/login">Login</a></p>
        </form>
    </div>
</section>
`;

export function registerPage(ctx) {
    ctx.render(registerTemplate(createSubmitHandler(onRegister)));


    async function onRegister({ username,email, password, ['re-password']: repass }, form) {
        if (email == '' || password == '') {
            return alert('All fields are required');
        }

        if (password != repass) {
            return alert('Passwords don\'t match');
        }

        await register(username,email, password);
        form.reset();
        ctx.page.redirect(pageEndpoints.home);
    }
}