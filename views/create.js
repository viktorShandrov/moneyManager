

import { html } from '../lib/lib.js';
import { pageEndpoints } from "../app.js";
import { create } from "../data/auth.js";
import { createSubmitHandler } from "../utils/utils.js";
import { moneyRecords } from './home.js';

const createTemplate = (onSubmit) => html`
<form id="create-form" @submit=${onSubmit}>
<input type="text" name="details" placeholder="details" >
<input type="number" name="amount" placeholder="amount" >
<select name="operation">
    <option value="-">-</option>
    <option value="+">+</option>
</select>
<button>Submit</button>
</form>
`

export async function createPage (ctx){
    


    ctx.render(createTemplate(createSubmitHandler(onCreate)))
    async function onCreate({ details, amount , operation }, form) {
        const uniqueId = await generateHash()+getRandomNumber(1,200)

        const currentDate = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        const formattedDate = currentDate.toLocaleDateString('bg-BG', options);

        await create(details, amount,operation,uniqueId,formattedDate);
        if(moneyRecords.length>0){
            moneyRecords.push({ uniqueId, details, amount , operation,formattedDate });
        }
        
        form.reset();
        ctx.page.redirect(pageEndpoints.home);
    }
}

async function generateHash(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }