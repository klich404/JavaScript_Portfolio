const keys = [ //teclas del teclado
    [
        ["1", "!"],
        ["2", "@"],
        ["3", "#"],
        ["4", "$"],
        ["5", "%"],
        ["6", "&"],
        ["7", "/"],
        ["8", "("],
        ["9", ")"],
        ["0", "="],
        ["'", "?"],
        ["¿", "¡"]
    ],
    [
        ["q", "Q"],
        ["w", "W"],
        ["e", "E"],
        ["r", "R"],
        ["t", "T"],
        ["y", "Y"],
        ["u", "U"],
        ["i", "I"],
        ["o", "O"],
        ["p", "P"],
        ["+", "*"],
        ["}", "]"]
    ],
    [
        ["MAYUS", "MAYUS"],
        ["a", "A"],
        ["s", "S"],
        ["d", "D"],
        ["f", "F"],
        ["g", "G"],
        ["h", "H"],
        ["j", "J"],
        ["k", "K"],
        ["l", "L"],
        ["ñ", "Ñ"],
        ["{", "["]
    ],
    [
        ["SHIFT", "SHIFT"],
        ["<", ">"],
        ["z", "Z"],
        ["x", "X"],
        ["c", "C"],
        ["v", "V"],
        ["b", "B"],
        ["n", "N"],
        ["m", "M"],
        [",", ";"],
        [".", ":"],
        ["-", "_"]
    ],
    [["SPACE", "SPACE"]]
];

let mayus = false; //tecla mayuscula
let shift = false; //tecla shift
let current = null; //tecla oprimida

renderKeyboard(); //renderiza el teclado deseado

function renderKeyboard() {
    const keyboardContainer = document.querySelector('#keyboard-container'); //contenedor del teclado
    let empty = `<div class="key-empty"></div>`; //tecla invisible (para la estetica)

    const layers = keys.map((layer) => { //recorre las lineas del teclado
        return layer.map((key) => { //recorre las teclas de la linea
            if(key[0] == 'SHIFT') { //asigna la shift al boton del teclado
                return `<button class="key key-shift ${shift? 'activated' : ''}">${key[0]}</button>`;
            }
            if (key[0] == 'MAYUS') {//asigna la mayus al boton del teclado
                return `<button class="key key-mayust ${mayus? 'activated' : ''}">${key[0]}</button>`;
            }
            if (key[0] == 'SPACE') {//asigna la space al boton del teclado
                return `<button class="key key-space"></button>`;
            }

            return `
                <button class="key key-normal">
                    ${
                        shift
                            ? key[1] //si shift es true muestra las letras en mayuscula y los caracteres especiales
                            : mayus && //si mayus es true muestra las letras en mayuscula pero deja los numeros
                                key[0].toLowerCase().charCodeAt(0) > 97 &&
                                key[0].toLowerCase().charCodeAt(0) <= 122
                            ? key[1]
                            : key[0] //si shift y mayus son false muestra las letras en minuscula y deja los numeros
                    }
                </button>
            `;
        });
    });

    layers[0].push(empty); //añade la tecla invisible al inicio
    layers[1].unshift(empty); //añade la tecla invisible al final

    const htmllayers = layers.map((layer) => {
        return layer.join(''); //vuelve los arreglos de las letras en un solo string
    });

    keyboardContainer.innerHTML = ""; //borra el contenido de keyboardContainer

    htmllayers.forEach((layer) => {
        keyboardContainer.innerHTML += `<div class="layer">${layer}</div>`; //renueva el contenido de keyboardContainer con las letras del teclado
    });

    document.querySelectorAll('.key').forEach((key) => { //recorre las letras
        key.addEventListener('click', (e) => { //si clickean la letra:
            if(current) {
                if(key.textContent == 'SHIFT') { //si oprimen shift:
                    shift = !shift; //si esta activado se desactiva y viceversa
                } else if(key.textContent == 'MAYUS') { //si oprimen mayus:
                    mayus = !mayus; //si esta activado se desactiva y viceversa
                } else if(key.textContent == '') { //si oprimen space:
                    current.value += " "; //añade un espacio a la cadena actual
                } else {
                    current.value += key.textContent.trim(); //añade una la letra clickeada a la cadena actual (trim borra los espacios que tienen las letras por defecto)
                    if(shift) {
                        shift = false; //si shift esta activado se desactiva
                    }
                }
                renderKeyboard(); //renderiza el teclado
                current.focus(); //el puntero estara en la cadena actual
            }
        });
    });
}

document.querySelectorAll("input").forEach((input) => {
    input.addEventListener('focusin', (e) => {
        current = e.target; //cada que se clickee una letra se volvera a hacer focus en input
    });
});