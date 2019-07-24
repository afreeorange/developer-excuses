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
        console.log(window.location.hash);
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
    document.getElementById("excuse").innerText = excuse + " " + suffixEmoji;
    document.title = "I'm Sorry; " + excuse;

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
    });
};

window.addEventListener("popstate", e => showExcuse());
document
    .getElementById("excuse")
    .addEventListener("click", e => showExcuse(true));
document
    .getElementById("show-list")
    .addEventListener("click", e => toggleList());
