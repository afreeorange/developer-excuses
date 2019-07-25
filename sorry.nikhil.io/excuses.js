// https://github.com/Recidvst/scrambling-letters
var Scrambler=function(){"use strict";function t(t,e){return n(t)||o(t,e)||f()}function e(t){return r(t)||a(t)||i()}function r(t){if(Array.isArray(t)){for(var e=0,r=new Array(t.length);e<t.length;e++)r[e]=t[e];return r}}function n(t){if(Array.isArray(t))return t}function a(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function o(t,e){var r=[],n=!0,a=!1,o=void 0;try{for(var i,f=t[Symbol.iterator]();!(n=(i=f.next()).done)&&(r.push(i.value),!e||r.length!==e);n=!0);}catch(t){a=!0,o=t}finally{try{n||null==f.return||f.return()}finally{if(a)throw o}}return r}function i(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function f(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function u(t,e){return new Promise(function(r,n){if(void 0===t&&n("Target element is undefined"),"true"!==t.getAttribute("data-scramble-active")){e.beforeEach&&e.beforeEach(t),t.setAttribute("data-scramble-active","true"),t.classList.add("scrambling");var a,o=t.innerHTML,i=[],f=e.speed?e.speed:100,u=t.textContent.split(""),c=u,d=t.textContent.split(""),b=!1;h(e.text)?a=x(e.text):t.getAttribute("data-scramble-text")&&""!==t.getAttribute("data-scramble-text")&&(a=x(t.getAttribute("data-scramble-text"))),a&&(b=!0,u=a.truth,d=a.newLetters,c=a.startText);var v=function(){if(c.map(function(e,r){return!(" \t\n\r\v".indexOf(e)>-1)&&(d[r]=g(),!0===i[r]&&(d[r]=u[r]),t.textContent=d.join(""),!0)}),y(d,u)){if(t.innerHTML=o,b){var n=t.children[0];n&&""!==n?n.textContent=d.join(""):t.textContent=d.join("")}clearInterval(m),t.setAttribute("data-scramble-active","false"),t.classList.remove("scrambling"),e.afterEach&&e.afterEach(t),r(t)}};!function(t){if(t&&s(t))for(var r=0;r<=t.length;r++)!function(t){setTimeout(function(){i[t]=!0},A(l(e),e.random,e.speed))}(r)}(c),v();var m=setInterval(function(){v()},f)}else n("Animation already triggered")})}function c(t){if(!m(t))return!1;var r=p(t,l(t)),n=e(l(r)?document.querySelectorAll(r.target):document.querySelectorAll(r)),a=[];if(n.forEach(function(t){var e=u(t,r);a.push(e)}),!(a.length>0))return!1;r.beforeAll&&r.beforeAll(n),Promise.all(a).then(function(t){r.afterAll&&r.afterAll(t)}).catch(function(t){r.errorHandler&&r.errorHandler(t)})}var l=function(t){return!!t&&t.constructor===Object},s=function(t){return!!t&&t.constructor===Array},d=function(t){return"boolean"==typeof t},b=function(t){return"function"==typeof t},v=function(t){return Number.isInteger(t)},h=function(t){return!(!t||""===t||!("string"==typeof t||t instanceof String))},m=function(t){return!s(t)&&!d(t)&&"number"!=typeof t&&"function"!=typeof t&&void 0!==t},g=function(t,e){var r=t||1,n=e||!1,a=Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,r);return" \t\n\r\v".indexOf(a)<0&&!0!==n&&a},A=function(e,r,n){var a=e||!1,o=n||100;if(a&&s(r)&&r.length>1){var i=t(r,2),f=i[0],u=i[1];if((n>=u||o>=u)&&(o=u-1),u-=o,f>u&&(f=u),v(f)&&v(u))return Math.floor(Math.random()*(u-f))+f}return Math.floor(1999*Math.random())+1e3},p=function(t,e){var r=e||!1,n={target:"[data-scrambler]",random:[1e3,3e3],speed:100,text:!1,beforeEach:!1,afterEach:!1,beforeAll:!1,afterAll:!1,errorHandler:!1};return t&&r&&(n.target=void 0!==t.target?t.target:"[data-scrambler]",n.random=void 0!==t.random?t.random:[1e3,3e3],n.speed=void 0!==t.speed?t.speed:100,n.text=void 0!==t.text&&t.text,n.beforeEach=!(void 0===t.beforeEach||!b(t.beforeEach))&&t.beforeEach,n.afterEach=!(void 0===t.afterEach||!b(t.afterEach))&&t.afterEach,n.beforeAll=!(void 0===t.beforeAll||!b(t.beforeAll))&&t.beforeAll,n.afterAll=!(void 0===t.afterAll||!b(t.afterAll))&&t.afterAll,n.errorHandler=!(void 0===t.errorHandler||!b(t.errorHandler))&&t.errorHandler),n},y=function(t,e){return!(t.length!==e.length||!t.every(function(t,r){return t===e[r]}))},x=function(t){if(!t||void 0===t||!("string"==typeof t||t instanceof String))return!1;var e,r=t,n=r.split(""),a=r.split(""),o=[];return n.forEach(function(t,e){" \t\n\r\v".indexOf(n[e])>-1?o.push(" "):o.push(g())}),e=o,{truth:n,newLetters:a,startText:e}};return function(){return c}()}();

const API_ENDPOINT = "/excuses.json";
let EXCUSES = {};
const suffixEmojis = [
    "🤷‍♂️",
    "🤷‍♀️",
    "🤦‍♀️",
    "🤦‍♂️",
    "🤔",
    "😬",
    "🧐",
    "🤨",
    "😕",
    "🙄",
    "👍",
    "💁‍♀️",
    "💁‍♂️"
];

const randomSuffixEmoji = () =>
    suffixEmojis[(suffixEmojis.length * Math.random()) << 0];

const randomExcuse = excuses => {
    const keys = Object.keys(excuses);
    const randomKey = keys[(keys.length * Math.random()) << 0];

    return [randomKey, excuses[randomKey]];
};

const showErrorState = () => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("oh-crap").style.display = "table-cell";

    return false;
};

const showExcuse = forceRefresh => {
    let excuse;
    let hash;
    const suffixEmoji = randomSuffixEmoji();

    if (window.location.hash && forceRefresh !== true) {
        const excuseHash = window.location.hash.split("#")[1];

        if (Object.keys(EXCUSES).indexOf(excuseHash) === -1) {
            [hash, excuse] = randomExcuse(EXCUSES);
        } else {
            excuse = EXCUSES[excuseHash];
            hash = excuseHash;
        }
    } else {
        [hash, excuse] = randomExcuse(EXCUSES);
    }

    history.pushState(null, null, "#" + hash);

    document.getElementById("loading").style.display = "none";
    document.getElementById("excuse").innerText = excuse;
    document.title = "I'm Sorry; " + excuse;

    Scrambler({
        target: '#excuse',
        random: [500, 1250],
        speed: 75,
        afterAll: (elements) => {
          document.getElementById("excuse").innerText += " " + suffixEmoji;
        }
    });

    return true;
};

const getExcuses = () =>
    fetch(API_ENDPOINT, { cache: "force-cache" })
        .then(response => {
            if (!response.ok) {
                showErrorState();
            } else {
                return response.json();
            }
        })
        .then(excuses => {
            EXCUSES = excuses;
            return EXCUSES;
        })
        .catch(e => {
            showErrorState();
        });

const createHTMLLink = (text, url) => {
    let a = document.createElement("a");
    a.appendChild(document.createTextNode(text));
    a.setAttribute("href", `/#${url}`);
    a.setAttribute("class", "excuse-link");

    return a;
};

const createListItem = child => {
    let li = document.createElement("li");
    li.appendChild(child);

    return li;
};

const toggleList = () => {
    const vis = document.getElementById("list-wrapper").style.visibility;

    if (vis === "visible") {
        document.getElementById("list-wrapper").style.visibility = "hidden";
    } else {
        document.getElementById("list-wrapper").style.visibility = "visible";
    }
};

const searchFor = (term, links) => {
    const _term = term.toLowerCase();

    for (i = 0; i < links.length; i++) {
        if (!links[i].innerHTML.toLowerCase().includes(_term)) {
            links[i].parentElement.style.display = "none";
        } else {
            links[i].parentElement.style.display = "list-item";
        }
    }
};

window.onload = () => {
    getExcuses().then(excuses => {
        showExcuse();

        const list = document.getElementById("list");
        Object.keys(excuses).map(hash =>
            list.appendChild(
                createListItem(createHTMLLink(excuses[hash], hash))
            )
        );

        const excuseLinks = document.querySelectorAll(".excuse-link");
        for (let i = excuseLinks.length - 1; i >= 0; i--) {
            excuseLinks[i].addEventListener("click", () => toggleList());
        }

        document
            .getElementById("search")
            .addEventListener("keyup", e =>
                searchFor(e.target.value, excuseLinks)
            );
    });
};

window.addEventListener("popstate", e => showExcuse());
document
    .getElementById("excuse")
    .addEventListener("click", e => showExcuse(true));
document
    .getElementById("show-list")
    .addEventListener("click", e => toggleList());
