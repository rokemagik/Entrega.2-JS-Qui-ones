

let pantallaValor = document.getElementById("calculo")
let pantallaResultado = document.getElementById("resultado")

let historial = [];

let numero = 1; 

let botones = document.querySelectorAll("button")
botones.forEach(function(boton) {
    boton.addEventListener("click", () => {

        let botonValor = boton.dataset.valor;
        let botonAccion = boton.dataset.accion;
        let botonOperacion = boton.dataset.operacion;

        if(botonValor) {
            if(pantallaValor.textContent.length <= 21) {
                pantallaValor.textContent += botonValor
            }
        } else if(botonAccion) {
            switch(boton.dataset.accion) {
                case "clear":
                    Clear();
                    break
                case "delete":
                    Delete();
                    break
                case "delete-historial":
                    DeleteHistorial();
                    break
                case "igual":
                    Resultado();
                    break
            }
        } else if(botonOperacion) {
            if(pantallaValor.textContent.length <= 21) {
                pantallaValor.textContent += botonOperacion;
            }
        } else {
            alert("Opcion no Valida");
        }
    })
})

function Clear() {
    if(pantallaValor.textContent.length || pantallaResultado.textContent.length) {
        pantallaValor.textContent = "";
        pantallaResultado.textContent = "";
    }
}

function Delete() {
    if (pantallaValor.textContent.length) {
        pantallaValor.textContent = pantallaValor.textContent.slice(0, -1);
    }
}

function DeleteHistorial() {
    if (historial.length >= 1) {
        historial = []
        numero = 1
    }
    actualizarHistorial();
}

function Resultado() {
    let operacion = pantallaValor.textContent;
    let resultado = math.evaluate(operacion);

    pantallaResultado.textContent = resultado;

    historial.push(`${numero++}. ${operacion} = ${resultado}`);
    actualizarHistorial();
}

function actualizarHistorial() {
    const contenedor = document.getElementById("operaciones");
    contenedor.innerHTML = "";

    historial.forEach((item) => {
        const p = document.createElement("p");
        p.textContent = item;
        contenedor.appendChild(p);
    })

    contenedor.scrollTop = contenedor.scrollHeight;
}