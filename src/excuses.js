import TextScramble from "./scramble";
import excuses from "./excuses.json";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const scrambler = new TextScramble($(".excuse-text"));
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
  "💁‍♂️",
];

const randomSuffixEmoji = () =>
  suffixEmojis[(suffixEmojis.length * Math.random()) << 0];

const randomExcuse = excuses => {
  const keys = Object.keys(excuses);
  const randomKey = keys[(keys.length * Math.random()) << 0];

  return [randomKey, excuses[randomKey]];
};

const showErrorState = () => {
  $(".loading").style.display = "none";
  $(".oh-crap").style.display = "table-cell";

  return false;
};

const showExcuse = forceRefresh => {
  let excuse;
  let hash;
  const suffixEmoji = randomSuffixEmoji();

  if (window.location.hash && forceRefresh !== true) {
    const excuseHash = window.location.hash.split("#")[1];

    if (Object.keys(excuses).indexOf(excuseHash) === -1) {
      [hash, excuse] = randomExcuse(excuses);
    } else {
      excuse = excuses[excuseHash];
      hash = excuseHash;
    }
  } else {
    [hash, excuse] = randomExcuse(excuses);
  }

  history.pushState(null, null, "#" + hash);

  $(".loading").style.display = "none";
  $(".reaction").innerText = "";
  document.title = "I'm Sorry; " + excuse;

  scrambler.setText(excuse).then(() => {
    $(".reaction").innerText = suffixEmoji;
  });

  return true;
};

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

const toggleSearch = e => {
  e && e.stopPropagation();

  if (
    !$(".list-wrapper").style.display ||
    $(".list-wrapper").style.display === "none"
  ) {
    $(".list-wrapper").style.display = "block";
    $(".search").select();
  } else {
    $(".list-wrapper").style.display = "none";
  }
};

const searchFor = (term, links) => {
  const _term = term.toLowerCase();

  for (let i = 0; i < links.length; i++) {
    if (!links[i].innerHTML.toLowerCase().includes(_term)) {
      links[i].parentElement.style.display = "none";
    } else {
      links[i].parentElement.style.display = "list-item";
    }
  }
};

const generateExcuses = () => {
  setTimeout(() => showExcuse(), 750);

  const list = $(".list");
  Object.keys(excuses).map(hash =>
    list.appendChild(createListItem(createHTMLLink(excuses[hash], hash))),
  );

  const excuseLinks = $$(".excuse-link");
  for (let i = excuseLinks.length - 1; i >= 0; i--) {
    excuseLinks[i].addEventListener("click", () => showSearch());
  }

  $(".search").addEventListener("keyup", e =>
    searchFor(e.target.value, excuseLinks),
  );
};

document.onkeydown = e => {
  e = e || window.event;
  let isEscape = false;

  if ("key" in e) {
    isEscape = e.key === "Escape" || e.key === "Esc";
  } else {
    isEscape = e.keyCode === 27;
  }

  if (isEscape) {
    closeSearch();
  }
};

window.addEventListener("popstate", e => showExcuse());
$(".wrapper").addEventListener("click", e => showExcuse(true));
$(".close").addEventListener("click", e => toggleSearch(e));
$(".show-list").addEventListener("click", e => toggleSearch());

generateExcuses();
