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
        casilla.style.fontSize = "40px";
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
                const stringCandidatos = filtrarCandidatos(fila, columna, casilla, `<span class="candidato-oculto">_</span>`);
                casilla.style.fontSize = "20px";
                casilla.innerHTML = stringCandidatos;
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

function filtrarCandidatos(fila, columna, casilla, texto){
    const numeroCasilla = "." + casilla.classList[1]
    agregarCandidatosCasillaGrande(numeroCasilla);

    listaCandidatos.push(...sudokuEnLista[fila]);

    for (let i = 0; i < sudokuEnLista.length; i++) {
        listaCandidatos.push(sudokuEnLista[i][columna]);
    }

    listaCandidatos.sort()
    listaCandidatos = [...new Set(listaCandidatos)];
    listaCandidatos = listaCandidatos.filter(numero => numero !== 0 && !Number.isNaN(numero));
    listaCandidatos = totalPosibles.map(numero => listaCandidatos.includes(numero) ? texto : numero);   
    const stringCandidatos = listaCandidatos.join(" ");
    return stringCandidatos;
}

function agregarCandidatosCasillaGrande(clase){
    const casillasGrandes = document.querySelectorAll(clase);
    casillasGrandes.forEach(casilla => {
        if (casilla.textContent.length > 0) listaCandidatos.push(Number(casilla.textContent))
    });
}

btnCompletarSudoku.addEventListener("click", () => {
    for (let i = 0; i < sudokuEnLista.length; i++) {
        for (let e = 0; e < sudokuEnLista.length; e++) {
            if (sudokuEnLista[i][e] === 0){
                const fila = i;
                const columna = e;
                const casilla = document.querySelector(`.casilla[data-fila="${fila}"][data-columna="${columna}"]`);
                const stringCandidatos = filtrarCandidatos(fila, columna, casilla, "*");
                casilla.style.fontSize = "20px";
                casilla.textContent = stringCandidatos;
                listaCandidatos = [];
            }
        }
    }
    resolverSudoku();
});

function resolverSudoku(){
    for (let i = 0; i < 81; i++) {
        casillas.forEach(casilla => {
            if (casilla.textContent.length > 1){
                const listaNumerosCandidatos = casilla.textContent.split(" ").filter(elemento => elemento !== "*").map(Number);
                if (listaNumerosCandidatos.length === 1){
                    const fila = Number(casilla.dataset.fila);
                    const columna = Number(casilla.dataset.columna);
                    casilla.style.fontSize = "40px";
                    casilla.textContent = listaNumerosCandidatos[0];
                    eliminarCandidatosCasillaGrande(casilla, listaNumerosCandidatos[0]);
                    eliminarCandidatosVerticalesHorizontales(fila, columna, listaNumerosCandidatos[0]);
                }
            }
        });

        casillas.forEach(casilla => {
            const numeroCasillaGrande = casilla.classList[1];
            const elementosCasillaGrande = document.querySelectorAll("." + numeroCasillaGrande)
            colocarElementoDistinto(elementosCasillaGrande, casilla);
        });

        casillas.forEach(casilla => {
            const columna = casilla.dataset.columna;
            const elementosMismaColumna = document.querySelectorAll(`.casilla[data-columna="${columna}"]`);
            colocarElementoDistinto(elementosMismaColumna, casilla);
        });

        casillas.forEach(casilla => {
            const fila = casilla.dataset.fila;
            const elementosMismaFila = document.querySelectorAll(`.casilla[data-fila="${fila}"]`);
            colocarElementoDistinto(elementosMismaFila, casilla);
        });

        casillas.forEach(casilla => {
            const numeroCasillaGrande = casilla.classList[1];
            const elementosCasillaGrande = document.querySelectorAll("." + numeroCasillaGrande)
            eliminarCandidatosRepetidos(elementosCasillaGrande, casilla)
        });

        casillas.forEach(casilla => {
            const columna = casilla.dataset.columna;
            const elementosMismaColumna = document.querySelectorAll(`.casilla[data-columna="${columna}"]`);
            eliminarCandidatosRepetidos(elementosMismaColumna, casilla)
        });

        casillas.forEach(casilla => {
            const fila = casilla.dataset.fila;
            const elementosMismaFila = document.querySelectorAll(`.casilla[data-fila="${fila}"]`);
            eliminarCandidatosRepetidos(elementosMismaFila, casilla)
        });
    }
}

function eliminarCandidatosRepetidos(elementosMismoParadigma){
    const listaRepetidos = [];
    let diccionarioNuevaInfo = {};
    const listaCandidatosElementos = [];
    let diccionarioDatos = {};

    elementosMismoParadigma.forEach(casilla => {
        if (casilla.textContent.length > 1){
            diccionarioDatos.idCasilla = casilla.id;
            diccionarioDatos.stringCasilla = casilla.textContent;
            listaCandidatosElementos.push(diccionarioDatos);
            diccionarioDatos = {};
        }
    });
    listaCandidatosElementos.forEach(elemento => {
        if (!diccionarioNuevaInfo[elemento.stringCasilla]) {
            diccionarioNuevaInfo[elemento.stringCasilla] = [];
        }
        diccionarioNuevaInfo[elemento.stringCasilla].push(elemento.idCasilla);
        Object.entries(diccionarioNuevaInfo).forEach(([stringCasilla, ids]) => {
            const listaa = stringCasilla.split(" ").filter(elemento => elemento !== "*").map(Number)
            if (ids.length > 1){
                if (ids.length === listaa.length){
                    listaRepetidos.push(...listaa)
                    delete diccionarioNuevaInfo[stringCasilla];
                }
            }
        });
    });

    Object.entries(diccionarioNuevaInfo).forEach(([stringCasilla, ids]) => {
        listaRepetidos.forEach(numero => {
            ids.forEach(casillaEspecifica => {
                const casilla = document.getElementById(casillaEspecifica);
                casilla.textContent = casilla.textContent.replace(numero, "*");
            });
        });
    });
}

function colocarElementoDistinto(listaElemento, casilla){
    let numeroDistinto = null;
    let idCasillaNumeroDistinto = null;

    const listaCandidatosElementos = [];
    let diccionarioDatos = {};
    listaElemento.forEach(casillita => {
        if (casillita.textContent.length > 1){
            diccionarioDatos.idCasilla = casillita.id;
            diccionarioDatos.stringCasilla = casillita.textContent;
            listaCandidatosElementos.push(diccionarioDatos);
            diccionarioDatos = {};
        }
    });

    totalPosibles.forEach(numero => {
        let contadorNumeros = 0;
        let idCasilla = null;
        listaCandidatosElementos.forEach(elemento => {
            const listaStringElemento = elemento.stringCasilla.split(" ").filter(elemento => elemento !== "*").map(Number);
            if (listaStringElemento.includes(numero)){
                contadorNumeros ++;
                idCasilla = elemento.idCasilla;
            }
        });
        if (contadorNumeros === 1) {
            numeroDistinto = numero;
            idCasillaNumeroDistinto = idCasilla;
        }
    });
    if (numeroDistinto !== null && idCasillaNumeroDistinto !== null){
        if (casilla.id === idCasillaNumeroDistinto){
            const fila = Number(casilla.dataset.fila);
            const columna = Number(casilla.dataset.columna);
            casilla.style.fontSize = "40px";
            casilla.textContent = numeroDistinto;
            eliminarCandidatosCasillaGrande(casilla, numeroDistinto);
            eliminarCandidatosVerticalesHorizontales(fila, columna, numeroDistinto);
        }
    }
}

function eliminarCandidatosCasillaGrande(casilla, numero){
    const numeroCasillaGrande = casilla.classList[1];
    const elementosCasillaGrande = document.querySelectorAll("." + numeroCasillaGrande)
    elementosCasillaGrande.forEach(casillaChica => {
        if (casillaChica.textContent.length > 1){
            casillaChica.textContent = casillaChica.textContent.replace(numero, "*");
        }
    });
}

function eliminarCandidatosVerticalesHorizontales(fila, columna, numero){
    casillas.forEach(casilla => {
        if (Number(casilla.dataset.columna) === columna){
            if (casilla.textContent.length > 1){
                casilla.textContent = casilla.textContent.replace(numero, "*");
            }
        }

        if (Number(casilla.dataset.fila) === fila){
            if (casilla.textContent.length > 1){
                casilla.textContent = casilla.textContent.replace(numero, "*");
            }
        }
    });
}















function print(string){
    console.log(string);
    
}