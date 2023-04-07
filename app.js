
import { page,render } from './lib/lib.js';
import { getUserData, logout } from './utils/utils.js';
import { createPage } from './views/create.js';
import { homePage } from './views/home.js';
import { layoutTemplate } from './views/layout.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';


export const pageEndpoints = {
    dashboard: '/dashboard',
    create: '/create',
    details: '/details/:id',
    edit: '/edit/:id',
    login: '/login',
    register: '/register',
    logout: '/logout',
    home: '/home',
}

const root = document.body

page(decorateContext);



page('/index.html', ()=>{
    if(getUserData()){
        page.redirect('/home');
    }else{
        page.redirect('/login');
    }
});
page("/node_modules/*",pageEndpoints.home)
page(pageEndpoints.create, createPage);
page(pageEndpoints.logout, logoutAction)
page(pageEndpoints.login, loginPage);
page(pageEndpoints.register, registerPage);
page(pageEndpoints.home, homePage);
page.start();



function decorateContext(ctx, next) {

    ctx.render = renderView;
    next();
}

function renderView(content) {
    const userData = getUserData();

    render(layoutTemplate(userData, content), root);
}

function logoutAction(ctx) {
    Parse.User.logOut();
    logout();
    ctx.page.redirect(pageEndpoints.login);
}
