(() => {

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
        const end = start + Math.floor(Math.random() * 30);
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

  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const scrambler = new TextScramble($(".excuse-text"));
  const API_ENDPOINT = "/excuses.json";
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
  let EXCUSES = {};

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

    $(".loading").style.display = "none";
    $(".reaction").innerText = "";
    document.title = "I'm Sorry; " + excuse;

    scrambler.setText(excuse).then(() => {
      $(".reaction").innerText = suffixEmoji;
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
    const vis = $(".list-wrapper").style.visibility;

    if (vis === "visible") {
      $(".list-wrapper").style.visibility = "hidden";
    } else {
      $(".list-wrapper").style.visibility = "visible";
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

      const list = $(".list");
      Object.keys(excuses).map(hash =>
        list.appendChild(createListItem(createHTMLLink(excuses[hash], hash))),
      );

      const excuseLinks = $$(".excuse-link");
      for (let i = excuseLinks.length - 1; i >= 0; i--) {
        excuseLinks[i].addEventListener("click", () => toggleList());
      }

      $(".search").addEventListener("keyup", e =>
        searchFor(e.target.value, excuseLinks),
      );
    });
  };

  document.onkeydown = e => {
    e = e || window.event;
    let isEscape = false;

    if ("key" in e) {
      isEscape = e.key === "Escape" || e.key === "Esc";
    } else {
      isEscape = e.keyCode === 27;
    }

    if (isEscape && $(".list-wrapper").style.visibility == "visible") {
      $(".list-wrapper").style.visibility = "hidden";
    }
  };

  window.addEventListener("popstate", e => showExcuse());
  $(".wrapper").addEventListener("click", e => showExcuse(true));
  $(".show-list").addEventListener("click", e => toggleList());

})();
