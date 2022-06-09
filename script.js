const ground = document.querySelector(".playGround");
const player = document.querySelector("#player");
const fireDiv = document.querySelector('.fireworksDiv');
const fireworks = new Fireworks(fireDiv, {delay: { min: 10, max: 15 }})


const Col = 7,Row = 6;
let field , row , col , checkExceedingRange = 0;;
let tab= new Array(4);

let table = new Array(Col);     // stworzenie tablicy wypełnionej zerami które potem zastępuje nazwą zawodnika
for (let i = 0; i < Row; i++) {
    table[i] = new Array(Col);
    for (let k = 0; k < Col; k++) {
        table[i][k] = 0;
    }
}

//sprawdzanie wyodrębnione
function check(oneEl, secondEl, thirdEl, fourthEl) {
    if ((oneEl == secondEl) && (secondEl == thirdEl) && (thirdEl == fourthEl) && (fourthEl != 0)) {
        return true;
    } else {
        return false;
    }
}
// czyczczenie planszy z pamieci klikniec oraz z tytulu i nazwy gracza
function clearBoard() {
    field.forEach(i => i.removeEventListener("click", clickedField));
    player.parentElement.remove();
};

// wygrana
function gameWin(one, two, three, four, player) {

    clearBoard();

    tab[0] = one[1] + one[0] * Col; //obliczanie numeru wygranego z 42 pozycji
    tab[1] = two[1] + two[0] * Col;
    tab[2] = three[1] + three[0] * Col;
    tab[3] = four[1] + four[0] * Col;
    fireworks.start();  //start efektu z api
    document.querySelector("#message").innerHTML = `Gracz ${player} Wygrał grę!</br><input type="button" class="button" value="Zagraj ponownie" onClick="location.reload();" />`;

    tab.forEach(i => field[i].style.backgroundColor = "#ffffff"); //przeglądnięcie 42 miesjsc w poszukiwaniu zwycięskich i pomalowaniu je na biało

};
// remis
function gameDraw() {
    clearBoard();
    document.querySelector("#message").innerHTML = `Remis!!!</br><input type="button" class="button" value="Zagraj ponownie" onClick="location.reload();" />`;
};
//Sprawdzenie
function lookingVictory() {
    // pion
    for (let i = 0; i < Row - 3; i++) {
        for (let k = 0; k < Col; k++) {
            if (check(table[i][k], table[i + 1][k], table[i + 2][k], table[i + 3][k])) {
                gameWin([i, k], [i + 1, k], [i + 2, k], [i + 3, k],table[i][k]); //przesyłamy gracza, pole, pole nad, pole nad...
                return;
            };
        };
    };
    //poziom
    for (let i = 0; i < Row; i++) {
        for (let k = 0; k < Col - 3; k++) {
            if (check(table[i][k], table[i][k + 1], table[i][k + 2], table[i][k + 3])) {
                gameWin([i, k], [i, k + 1], [i, k + 2], [i, k + 3],table[i][k],);
                return;
            };
        };
    };
    // ukos z prawa do lewa /
    for (let i = 3; i < Row; i++) {
        for (let k = 0; k < Col - 3; k++) {
            if (check(table[i][k], table[i - 1][k + 1], table[i - 2][k + 2], table[i - 3][k + 3])) {
                gameWin([i, k], [i - 1, k + 1], [i - 2, k + 2], [i - 3, k + 3],table[i][k],);
                return;
            };
        };
    };
    // ukos z lewa do prawa \
    for (let i = 0; i < Row - 3; i++) {
        for (let k = 0; k < Col - 3; k++) {
            if (check(table[i][k], table[i + 1][k + 1], table[i + 2][k + 2], table[i + 3][k + 3])) {
                gameWin([i, k], [i + 1, k + 1], [i + 2, k + 2], [i + 3, k + 3],table[i][k],);
                return;
            };
        };
    };
    // remis
    checkExceedingRange += 1; //naliczenie czy przypadkiem nie osiągneliśy remisu
    if (checkExceedingRange == 42) {
        gameDraw()
    };
};

function clickedField(item) {

    col = item.target.getAttribute("id") % Col; //zapisanie numeru kolumny nad która klikneliśmy

    if (table[Row - 1][col] == 0) { //sprawdzenie czy doł tej kolumny jest pusty bo przecież w css odwracamy wyświetlanie całej tablicy
                          //tak naprawde spawdzamy góre
        for (let i = 0; i < Row; i++) {
            if (table[i][col] == 0) {
                row = i; //pozyskujemy miejsce do zapisu nazwy
                table[row][col] = player.innerText; //zapisujemy czyje jest pole wpisujac tam jego nazwe
                break;
            };
        };
        
        if (player.innerText == 'Player Red') {
            field[col+row * Col ].style.backgroundColor = "#ff0000"; //pokolorowanie pola dla gracza one
        } else {
            field[col+row * Col].style.backgroundColor = "#ffd700"; //pokolorowanie pola dla gracza second
        }
        lookingVictory(); //sprawdzenie zwyciestwa

        if (player.innerText === 'Player Red') { //przełączenie gracza
            player.innerText = "Player Yellow";
        } else {
            player.innerText = "Player Red";
        }
    };
};

function createBoard() {
    for (let i = 0; i < 42; i++) {
        ground.innerHTML += `<div class="circle" id="${i}"><div>` //stworzenie pustych pól
    };
    field=document.querySelectorAll(".circle"); //zapisanie do tablicy wszystkich "pustych" pól przez dopisanie
    field.forEach(i => i.addEventListener("click", clickedField)); //nasłuchiwanie kliknięcia i wywołnie funkcji
};

function startGame() {
    createBoard();
};

window.onload = function() {
    startGame();
  };
