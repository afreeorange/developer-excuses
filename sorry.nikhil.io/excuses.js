class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = "!<>-_\\/[]{}—=+*^?#_______";
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const _from = oldText[i] || "";
            const to = newText[i] || "";
            const start = Math.floor(Math.random() * 15);
            const end = start + Math.floor(Math.random() * 25);
            this.queue.push({ _from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = "";
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { _from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="filler"> ${char}</span>`;
            } else {
                output += _from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const scrambler = new TextScramble(document.querySelector("#excuse-text"));
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
    document.querySelector("#loading").style.display = "none";
    document.querySelector("#oh-crap").style.display = "table-cell";

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

    document.querySelector("#loading").style.display = "none";
    document.title = "I'm Sorry; " + excuse;
    document.querySelector("#reaction").innerText = '';

    scrambler.setText(excuse).then(() => {
        document.querySelector("#reaction").innerText = suffixEmoji;
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
    const vis = document.querySelector("#list-wrapper").style.visibility;

    if (vis === "visible") {
        document.querySelector("#list-wrapper").style.visibility = "hidden";
    } else {
        document.querySelector("#list-wrapper").style.visibility = "visible";
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

        const list = document.querySelector("#list");
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
            .querySelector("#search")
            .addEventListener("keyup", e =>
                searchFor(e.target.value, excuseLinks)
            );
    });
};

window.addEventListener("popstate", e => showExcuse());
document
    .querySelector("#excuse")
    .addEventListener("click", e => showExcuse(true));
document
    .querySelector("#show-list")
    .addEventListener("click", e => toggleList());
