import { pageEndpoints } from "../app.js";
import { post, put } from "../data/api.js";
import { endpoints, getMoneyRecords } from "../data/auth.js";
import { getTransactions, paypalGetAccessToken } from "../data/paypalAPI.js";
import { html, render } from '../lib/lib.js';
import { getUserData } from "../utils/utils.js";

//console.log(await getTransactions());



const row = (record,onDelete,ctx) => html`
            <tr>
                <td>
                    ${record.details}
                </td>
                <td>
                    ${record.amount}
                </td>
                <td class="record-row">
                    ${record.operation}
                    <button @click=${(e)=>onDelete(record.uniqueId,ctx)}>Delete</button>
                </td>
                <td>Date: ${record.formattedDate}</td>
            </tr>
`

const homeTemplate = (records,ctx, status = "No records.",onDelete) =>
    html`
<section id="home">
    
    ${status === "Loading" ? html`<h1>${status}</h1>` : records ? html`
    <h1>Total: ${records.reduce((total, record) => total + Number(record.operation + record.amount), 0)}</h1>
    <table id="table">
        <thead>
            <th id="detailsHeader">Details
            <button class="sort-btn" @click="${(e)=>sortByDetails(e,ctx)}">
                Sort <i class="fa-solid fa-arrow-down-a-z"></i>
            </button>
            </th>
            <th id="amountHeader">Amount
                <button class="sort-btn" @click="${(e)=>sortByAmount(e,ctx)}">
                    Sort <i class="fa-solid fa-arrow-down-1-9"></i>
                </button>
            </th>
            <th id="operationHeader">Operation
                <button class="sort-btn" @click="${(e)=>sortByOperation(e,ctx)}">
                    Sort <i class="fa-solid fa-sort"></i>
                </button>
            </th>
        </thead>
        <tbody>
            ${records.map((record)=>row(record,onDelete,ctx))}
        </tbody>
    </table>
    <span id='paypalBtn'></span>

    `: html`<h1>${status}</h1>`
    }
    </section>
    `





function sortByAmount(e,ctx) {
    clearHighlithed();
    if ([...e.target.classList].includes('fa-arrow-down-1-9') || [...e.target.classList].includes('fa-arrow-down-9-1')) {
        if([...e.target.classList].includes('fa-arrow-down-9-1')){
            e.target.classList.toggle("fa-arrow-down-1-9");
            e.target.classList.toggle("fa-arrow-down-9-1");
            moneyRecords.sort((a,b)=>Number(a.amount)-Number(b.amount))
            ctx.render(homeTemplate(moneyRecords,ctx,null,onDelete));
        }else{
            e.target.classList.toggle("fa-arrow-down-9-1");
            e.target.classList.toggle("fa-arrow-down-1-9");
            moneyRecords.sort((a,b)=>Number(b.amount)-Number(a.amount))
            ctx.render(homeTemplate(moneyRecords,ctx,null,onDelete));
        }
    } else {
        if (e.target.querySelector("i")) {
            e.target.querySelector("i").click();
        }
    }
}

function sortByTime(){
    moneyRecords.sort((a,b)=>a.formattedDate.localeCompare(b.formattedDate));
}
function sortByDetails(e,ctx) {
    clearHighlithed();
    if ([...e.target.classList].includes('fa-arrow-down-a-z') || [...e.target.classList].includes('fa-arrow-down-z-a')) {
        if([...e.target.classList].includes('fa-arrow-down-z-a')){
            e.target.classList.toggle("fa-arrow-down-a-z");
            e.target.classList.toggle("fa-arrow-down-z-a");
            moneyRecords.sort((a,b)=>a.details.localeCompare(b.details))
            ctx.render(homeTemplate(moneyRecords,ctx,null,onDelete));
        }else{
            e.target.classList.toggle("fa-arrow-down-z-a");
            e.target.classList.toggle("fa-arrow-down-a-z");
            moneyRecords.sort((a,b)=>b.details.localeCompare(a.details))
            ctx.render(homeTemplate(moneyRecords,ctx,null,onDelete));
        }
    } else {
        if (e.target.querySelector("i")) {
            e.target.querySelector("i").click();
        }
    }
}

function sortByOperation(e,ctx){
    clearHighlithed();

    function sortFunc(a,b){
        if(a.operation.localeCompare(b.operation)==0){
           return a.amount.localeCompare(b.operation);
        }else{
            return a.operation.localeCompare(b.operation)
        }
    }
    if(moneyRecords[0].operation==="+"){
        moneyRecords.sort((a,b)=>sortFunc(a,b))
    }else{
        moneyRecords.sort((a,b)=>sortFunc(b,a))
    }

    
    ctx.render(homeTemplate(moneyRecords,ctx,null,onDelete));
    const plusRow = [...document.querySelectorAll("tr")].find(x=>x.innerText.includes("+"));
    if(plusRow){
        plusRow.classList.add("highlighted")
    }
    const minusRow = [...document.querySelectorAll("tr")].find(x=>x.outerText.includes("-"));
    if(minusRow){
        minusRow.classList.add("highlighted")
    }
}
function clearHighlithed(){
    const highlightedElements = document.querySelectorAll(".highlighted");
highlightedElements.forEach(element => {
  element.classList.remove("highlighted");
});
}
export let moneyRecords=[];

  

export async function homePage(ctx) {
    ctx.render(homeTemplate([],ctx, `Loading`));
    if(moneyRecords.length==0){
        moneyRecords = await getMoneyRecords();
    }else{
        sortByTime();
        checkIfIsEmpty();
    }
    paypal.use( ['login'], function (login) {
        login.render ({
          "appid":"ASWgptaJ7XcbrfeGyHMdxWimT7EKERTpy7VHZP6wB2eYk8Pkop5cbU9-F6cNvtkq-_3B-7scpDsOogv_",
          "scopes":"openid",
          "containerid":"paypalBtn",
          "responseType":"code id_Token",
          "locale":"en-us",
          "buttonType":"CWP",
          "buttonShape":"pill",
          "buttonSize":"lg",
          "fullPage":"true",
          "returnurl":"http://theconfederacy.site"
        });
      }); 
    
    ctx.render(homeTemplate(moneyRecords,ctx,null,onDelete));
    

}
function checkIfIsEmpty(){
    const table = document.querySelector("table")
const tbody = document.querySelector("tbody")
const firstHeader = table.querySelector('#detailsHeader');
const thirdHeader = table.querySelector('#operationHeader');

if (!tbody || tbody.rows.length === 0) {
  firstHeader.classList.add("rounded-headers-left-bottom")
  thirdHeader.classList.add("rounded-headers-right-bottom")
}else{
    firstHeader.classList.remove("rounded-headers-left-bottom")
    thirdHeader.classList.remove("rounded-headers-right-bottom")
}   
}
async function onDelete(recordDetails,ctx){
    const index = moneyRecords.findIndex(a=>a.uniqueId===recordDetails);
    if(index!=-1){
        moneyRecords.splice(index,1);
        await put(endpoints.create + getUserData().objectId,{"moneyInfo":moneyRecords});
        ctx.render(homeTemplate(moneyRecords,ctx,null,onDelete));
        const link = document.querySelector('link[rel="stylesheet"]');
        link.href = link.href + '?v=' + new Date().getTime();
        checkIfIsEmpty();
    }
}