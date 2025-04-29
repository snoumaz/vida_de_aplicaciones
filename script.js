// ==========
// Mejoras aplicadas:
// 1. Evitar clics adicionales mientras se ejecuta setTimeout.
// 2. Validar que el número de colores sea suficiente para el número de cuadrados.
// 3. Usar variables locales para evitar problemas de alcance.
// ==========

const squaresContainer = document.querySelector("#squares");
const numberOfSquares = 32;
let i = 0;
let square1, square2;
let clickCount = 0;
let score = 0;

document.querySelector("#score").style.visibility = "hidden";
const playAgainBtn = document.querySelector("button");
playAgainBtn.style.visibility = "hidden";
playAgainBtn.addEventListener("click", playAgain);

let colors = [
    "#33ff33", "#33ff33", "#ff944d", "#ff944d", "#80ccff", "#80ccff",
    "#ffff66", "#ffff66", "#ff4dff", "#ff4dff", "#ff1a1a", "#ff1a1a",
    "#dddddd", "#dddddd", "#000099", "#000099", "#66ffcc", "#66ffcc",
    "#cc99ff", "#cc99ff", "#ff6666", "#ff6666", "#6699ff", "#6699ff",
];

// Validar que hay suficientes colores para el número de cuadrados
if (colors.length < numberOfSquares) {
    const requiredPairs = numberOfSquares / 2;
    while (colors.length < numberOfSquares) {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
        if (!colors.includes(randomColor)) {
            colors.push(randomColor, randomColor); // Agregar un par de colores
        }
    }
}

function selectColor() {
    const random = Math.floor(Math.random() * colors.length);
    const selected = colors[random];
    colors.splice(random, 1);
    return selected;
}

// Crear los cuadrados
for (let i = 0; i < numberOfSquares; i++) {
    const square = document.createElement("li");
    let color = selectColor();
    square.setAttribute("data-color", color);
    squaresContainer.appendChild(square);
}

const squares = document.querySelectorAll("li");
for (const square of squares) {
    square.addEventListener("click", squareClicked);
}

function squareClicked() {
    if (clickCount >= 2 || this === square1) return;

    clickCount++;
    this.style.background = this.getAttribute("data-color");

    if (clickCount === 1) {
        square1 = this;
    } else {
        square2 = this;
        checkMatch();
    }
}

function checkMatch() {
    const match = square1.getAttribute("data-color") === square2.getAttribute("data-color");

    if (!match) {
        disableClicks();
        square1.classList.add("shake");
        square2.classList.add("shake");
        setTimeout(() => {
            noMatch();
            enableClicks();
        }, 500);
    } else {
        isMatch();
        checkGameEnded();
    }
}

function noMatch() {
    square1.style.background = "";
    square2.style.background = "";
    square1.classList.remove("shake");
    square2.classList.remove("shake");
    resetSelection();
}

function isMatch() {
    score++;
    document.querySelector("#score").innerText = score;
    document.querySelector("#score").style.visibility = "visible";

    square1.classList.add("pop");
    square2.classList.add("pop");
    square1.style.border = "none";
    square2.style.border = "none";
    square1.removeEventListener("click", squareClicked);
    square2.removeEventListener("click", squareClicked);

    resetSelection();
}

function resetSelection() {
    square1 = null;
    square2 = null;
    clickCount = 0;
}

function disableClicks() {
    squares.forEach(square => square.style.pointerEvents = "none");
}

function enableClicks() {
    squares.forEach(square => square.style.pointerEvents = "auto");
}

function checkGameEnded() {
    const target = numberOfSquares / 2;
    if (score === target) {
        playAgainBtn.style.visibility = "visible";
    }
}

function playAgain() {
    window.location.reload();
}