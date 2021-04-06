"use strict";
window.onload = init;

/* Global Variable */
let search;
let typeSearch;

//variables for the keys
const searchKey="mr7721searchNameKey";
const typeKey="mr7721amiiboSeriesKey";

//variables for local storage
const storedSearch=localStorage.getItem(searchKey);
const storedType=localStorage.getItem(typeKey);

//ititalizes the data and saves the local storage data
function init() {
    document.querySelector("#search").onclick = getData;

    search = document.querySelector("#searchterm");
    typeSearch = document.querySelector("#type");

    //setting the previous seach, to the search 
    if(storedSearch){
        search.value=storedSearch;
    }

    //setting previous card search, to current
    if(storedType){
        typeSearch.value=storedType;
    }

    search.onchange=e=>{localStorage.setItem(searchKey,e.target.value);};
    typeSearch.onchange=e=>{localStorage.setItem(typeKey,e.target.value)};

}

//sets up the searched data. Creates the URL that will be used to find the 
//  data in the API key
function getData() {
    // 1 - main entry point to web service
    const SERVICE_URL = "https://www.amiiboapi.com/api/amiibo/?character=";

    // No API Key required!

    // 2 - build up our URL string
    // not necessary for this service endpoint
    let url = SERVICE_URL;

    // 3 - parse the user entered term we wish to search
    // not necessary for this service endpoint
    let term = document.querySelector("#searchterm").value.trim();
    term = encodeURIComponent(term);
    url += term;

    //gets the type of the amiibo
    let type = document.querySelector("#type").value;
    url += "&type=" + type;
   
    // 4 - update the UI
    document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;

    // 5 - create a new XHR object
    let xhr = new XMLHttpRequest();

    // 6 - set the onload handler
    xhr.onload = dataLoaded;

    // 7 - set the onerror handler
    xhr.onerror = dataError;

    // 8 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

//throws an error message to the console
function dataError(e) {
    console.log("An error occurred");
}

//loads in data that will be read out to the page with the results
function dataLoaded(e) {
    // 1 - e.target is the xhr object
    let xhr = e.target;

    // 2 - xhr.responseText is the JSON file we just downloaded
    //console.log(xhr.responseText);

    // 3 - turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    let results = obj.amiibo;
    let bigString = "<p><i>Here are your Amiibo character result(s)!</i></p>";

    // 4 - if there is an array of results, loop through them
    for (let i = 0; i < results.length; i++) {
        let firstResult = results[i];
        let name = results[i].name;
        let series = results[i].gameSeries;
        /* let amiiboSeries = result.amiiboSeries; */

        let line = `<div class = 'result'><img src="${firstResult.image}" title="${firstResult.character}" />`;
        line += `<p>Character: ${name}</p>`;
        line += `<p>Game Series: ${series}</p>`;
        line += `</div>`;

        bigString += line;
    }

    // 5 - display final results to user
    document.querySelector("#content").innerHTML = bigString;
}