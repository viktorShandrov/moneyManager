import { html } from '../lib/lib.js';



export const layoutTemplate = (userData, content) => html`
<header>
    <a id="logo" href="/"><img id="logo-img" src="./images/logo.jpg" alt="" /></a>
    <nav>
        ${userData ? html`
        <div class="user">
            <a class="navBtn" href="/home">Home</a>
            <a class="navBtn" href="/create">Create Offer</a>
            <a class="navBtn" href="/logout">Logout</a>
        </div>` : html`
        <div class="guest">
            <a class="navBtn" href="/login">Login</a>
            <a class="navBtn" href="/register">Register</a>
        </div>`}
    </nav>
</header>
<main>${content}</main>
`;