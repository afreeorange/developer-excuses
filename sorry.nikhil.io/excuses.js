const API_ENDPOINT = "/excuses.json";
let EXCUSES = {};
const suffixEmojis = [
    '🤷‍♂️',
    '🤷‍♀️',
    '🤦‍♀️',
    '🤦‍♂️',
    '🤔',
    '😬',
    '🧐',
    '🤨',
    '😕',
    '🙄',
    '👍',
    '💁‍♀️',
    '💁‍♂️',
];

const randomSuffixEmoji = () => suffixEmojis[(suffixEmojis.length * Math.random()) << 0];

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

        if (Object.keys(EXCUSES).indexOf(excuseHash) !== -1) {
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

window.onload = () => {
    getExcuses().then(e => showExcuse());

    if (window.performance && performance.navigation.type == 1) {

    }
};

window.addEventListener("popstate", e => showExcuse());
document.body.addEventListener("click", e => showExcuse(true));
