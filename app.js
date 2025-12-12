// Load cards OR create 3 starter cards
let cards = JSON.parse(localStorage.getItem("flashcards"));

if (!cards || cards.length === 0) {
    cards = [
        { q: "What is HTML?", a: "The structure of a webpage.", status: "unknown" },
        { q: "What is CSS?", a: "The styling of a webpage.", status: "unknown" },
        { q: "What is JavaScript?", a: "The logic of a webpage.", status: "unknown" }
    ];
    
    localStorage.setItem("flashcards", JSON.stringify(cards));
}

const cardsList = document.getElementById("cardsList");
const qInput = document.getElementById("qInput");
const aInput = document.getElementById("aInput");
const cardForm = document.getElementById("cardForm");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const themeToggle = document.getElementById("themeToggle");

// Study mode
let studyIndex = 0;
let studySide = "front";
const studyPanel = document.getElementById("studyPanel");
const studyCard = document.getElementById("studyCard");
const studyProgress = document.getElementById("studyProgress");

function renderCards() {
    cardsList.innerHTML = "";

    const q = search.value.toLowerCase();
    const f = filter.value;

    cards
        .filter(c =>
            (c.q.toLowerCase().includes(q) || c.a.toLowerCase().includes(q)) &&
            (f === "all" || c.status === f)
        )
        .forEach((card, i) => {
            const el = document.createElement("div");
            el.className = "card";

            el.innerHTML = `
                <div class="card-inner">
                    <div class="side front">${card.q}</div>
                    <div class="side back">${card.a}</div>
                </div>
            `;

            el.addEventListener("click", () => {
                el.classList.toggle("flipped");
            });

            el.addEventListener("contextmenu", e => {
                e.preventDefault();
                cards.splice(i, 1);
                save();
            });

            cardsList.appendChild(el);
        });
}

function save() {
    localStorage.setItem("flashcards", JSON.stringify(cards));
    renderCards();
}

cardForm.addEventListener("submit", e => {
    e.preventDefault();

    cards.push({
        q: qInput.value,
        a: aInput.value,
        status: "unknown"
    });

    qInput.value = "";
    aInput.value = "";

    save();
});

search.addEventListener("input", renderCards);
filter.addEventListener("change", renderCards);

themeToggle.addEventListener("click", () => {
    let mode = document.body.dataset.theme;
    let next = mode === "light" ? "dark" : "light";
    document.body.dataset.theme = next;
    themeToggle.textContent = next === "light" ? "Light" : "Dark";
});

// Study mode
document.getElementById("startStudy").addEventListener("click", () => {
    studyPanel.classList.remove("hidden");
    studyIndex = 0;
    studySide = "front";
    updateStudy();
});

function updateStudy() {
    studyProgress.textContent = `${studyIndex + 1} / ${cards.length}`;
    studyCard.textContent = studySide === "front"
        ? cards[studyIndex].q
        : cards[studyIndex].a;
}

document.getElementById("flipStudy").addEventListener("click", () => {
    studySide = studySide === "front" ? "back" : "front";
    updateStudy();
});

document.getElementById("nextCard").addEventListener("click", () => {
    studyIndex = (studyIndex + 1) % cards.length;
    studySide = "front";
    updateStudy();
});

document.getElementById("prevCard").addEventListener("click", () => {
    studyIndex = (studyIndex - 1 + cards.length) % cards.length;
    studySide = "front";
    updateStudy();
});

renderCards();
