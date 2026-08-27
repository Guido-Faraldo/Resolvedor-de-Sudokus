const botonesNumeros = document.querySelectorAll(".btn-numero");
const casillas = document.querySelectorAll(".casilla");
const btnBorrarCasilla = document.getElementById("btn-borrar-casilla");
const btnBorrarTodo = document.getElementById("btn-borrar-todo");
const btnCompletarSudoku = document.getElementById("btn-completar-sudoku");
const btnAnotarPosibles = document.getElementById("btn-anotar-posibles");
let casillaSeleccionada = null;
let casillaGrande = null;
const totalPosibles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const sudokuInicial = [ [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
const sudokuEnLista = JSON.parse(localStorage.getItem("sudokuEnLista")) || sudokuInicial;
let listaCandidatos = [];

casillas.forEach(casilla => {
    const numeroGuardado = localStorage.getItem(casilla.id);
    casilla.textContent = numeroGuardado;

    casilla.addEventListener("click", () => {
        if (casillaSeleccionada){
            casillaSeleccionada.classList.remove("seleccionada");
        }
        casillaSeleccionada = casilla;
        casillaSeleccionada.classList.add("seleccionada");
    });
});

botonesNumeros.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!casillaSeleccionada) return;
        actualizarSudoku(casillaSeleccionada, boton.textContent);
        console.log(sudokuEnLista)
    });
});

btnBorrarCasilla.addEventListener("click", () => {
    if (casillaSeleccionada) {
        casillaSeleccionada.textContent = "";
        localStorage.setItem(casillaSeleccionada.id, "");
        const fila = Number(casillaSeleccionada.dataset.fila);
        const columna = Number(casillaSeleccionada.dataset.columna);
        sudokuEnLista[fila][columna] = 0;
    }
    localStorage.setItem("sudokuEnLista", JSON.stringify(sudokuEnLista));
});

btnBorrarTodo.addEventListener("click", () => {
    if (casillaSeleccionada){
            casillaSeleccionada.classList.remove("seleccionada");
            casillaSeleccionada = null;
        }
    casillas.forEach(casilla => {
        casilla.textContent = "";
        localStorage.setItem(casilla.id, "");
    });

    for (let i = 0; i < sudokuEnLista.length; i++) {
        for (let e = 0; e < sudokuEnLista.length; e++) {
            sudokuEnLista[i][e] = 0;
        }
    }

    localStorage.setItem("sudokuEnLista", JSON.stringify(sudokuEnLista));
});


document.addEventListener("keydown", (evento) => {
    if (!casillaSeleccionada) return;
    if (evento.key >= "1" && evento.key <= "9") {
        actualizarSudoku(casillaSeleccionada, evento.key);
    }
});

btnAnotarPosibles.addEventListener("click", () =>{
    for (let i = 0; i < sudokuEnLista.length; i++) {
        for (let e = 0; e < sudokuEnLista.length; e++) {
            if (sudokuEnLista[i][e] === 0){
                const fila = i;
                const columna = e;
                const casilla = document.querySelector(`.casilla[data-fila="${fila}"][data-columna="${columna}"]`);
                const stringCandidatos = filtrarCandidatos(fila, columna, casilla);
                casilla.style.fontSize = "20px";
                casilla.textContent = stringCandidatos;
                listaCandidatos = [];
            }
        }
    }
});

function actualizarSudoku(casilla, numero){
    casilla.textContent = numero;
    const fila = Number(casilla.dataset.fila);
    const columna = Number(casilla.dataset.columna);
    sudokuEnLista[fila][columna] = Number(numero);
    localStorage.setItem("sudokuEnLista", JSON.stringify(sudokuEnLista));
    localStorage.setItem(casilla.id, numero);
}

function filtrarCandidatos(fila, columna, casilla){
    const numeroCasilla = "." + casilla.classList[1]
    agregarCandidatosCasillaGrande(numeroCasilla);

    listaCandidatos.push(...sudokuEnLista[fila]);

    for (let i = 0; i < sudokuEnLista.length; i++) {
        listaCandidatos.push(sudokuEnLista[i][columna]);
    }

    listaCandidatos.sort()
    listaCandidatos = [...new Set(listaCandidatos)];
    listaCandidatos = listaCandidatos.filter(numero => numero !== 0);
    listaCandidatos = totalPosibles.map(numero => listaCandidatos.includes(numero) ? "*" : numero);
    if(casilla.id === "casilla-55")console.log(listaCandidatos);
    
    const stringCandidatos = listaCandidatos.join(" ");

    return stringCandidatos;
}

function agregarCandidatosCasillaGrande(clase){
    const casillasGrandes = document.querySelectorAll(clase);
    casillasGrandes.forEach(casilla => {
        if (casilla.textContent.length > 0) listaCandidatos.push(Number(casilla.textContent))
    });
}

