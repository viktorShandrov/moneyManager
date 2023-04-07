
import { clearUserData, getUserData, setUserData } from '../utils/utils.js';
import { get, post,put } from './api.js';

export const endpoints = {
    login: '/users',
    register: '/users',
    logout: '/users',
    create:"/users/"
};


export async function login(username, password) {
    const result = await Parse.User.logIn(username,password)
    //const result = await post(endpoints.login, { username, password });
    setUserData(result);
}

export async function register(username, email, password) {
    const result = await post(endpoints.register, { username,email, password });
    setUserData(result);
}
export async function create(details,amount , operation,uniqueId,formattedDate) {
    let moneyInfo = await getMoneyRecords();
    

    if(moneyInfo){
        moneyInfo.push({details,amount , operation,uniqueId,formattedDate})
    }else{
        moneyInfo=[{details,amount , operation,uniqueId,formattedDate}]
    }
    await put(endpoints.create + getUserData().objectId,{moneyInfo:moneyInfo});
}
export async function getMoneyRecords() {
    return (await get(endpoints.create + getUserData().objectId)).moneyInfo;
}

export async function del(){

}

export async function logout() {
    get(endpoints.logout);
    clearUserData();
}