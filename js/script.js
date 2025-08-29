

let pantallaValor = document.getElementById("calculo")
let pantallaResultado = document.getElementById("resultado")

let historial = [];
let numero = 1; 

const historialGuardado = JSON.parse(localStorage.getItem("historial"));
const numeroGuardado = localStorage.getItem("numero");

if (historialGuardado && historialGuardado.length > 0) {
    historial.push(
        ...historialGuardado.map(
            (o) => new Operacion(o.id, o.expresion, o.resultado, o.time)
        )
    );

    if (numeroGuardado) {
        numero = Number(numeroGuardado);
    }

    actualizarHistorial();
} else {
    fetch("./data/historial.json")
    .then(response => response.json())
    .then(data => {
        console.log("Historial de ejemplo cargado desde JSON:", data);

        data.forEach(item => {
            historial.push(new Operacion(item.id, item.expresion, item.resultado, item.time));
        });

        localStorage.setItem("historial", JSON.stringify(historial));
        localStorage.setItem("numero", historial.length + 1);

        numero = historial.length + 1;
        actualizarHistorial();
      })
    .catch(error => console.error("Error cargando JSON:", error));
}


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


function Operacion(id, expresion, resultado, time = new Date().toLocaleString()) {
    this.id = id;
    this.expresion = expresion;
    this.resultado = resultado;
    this.time = time;
}


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
        historial.length = 0
        numero = 1

        localStorage.removeItem("historial");
        localStorage.removeItem("numero");

        actualizarHistorial();
    }
}



function Resultado() {
    let operacion = pantallaValor.textContent.trim();
    if (operacion === "") {
        return;
    }

    let resultado
    try {
        resultado = math.evaluate(operacion);
    } catch (error) {
        pantallaResultado.textContent = "Operacion Invalida";
        return;
    }

    if(!isFinite(resultado) || isNaN(resultado)) {
        pantallaResultado.classList.add("error");
        pantallaResultado.textContent = "No se puede dividir por cero";
        return;
    }

    pantallaResultado.classList.remove("error");

    pantallaResultado.textContent = resultado;

    const nuevaOperacion = new Operacion(numero++, operacion, resultado)
    historial.push(nuevaOperacion);
    localStorage.setItem("historial", JSON.stringify(historial));
    localStorage.setItem("numero", numero);
    actualizarHistorial();
}



function actualizarHistorial() {
    const contenedor = document.getElementById("operaciones");
    contenedor.innerHTML = "";

    historial.forEach((item) => {
        const p = document.createElement("p");
        p.textContent = `${item.id}. ${item.expresion} = ${item.resultado}\nFecha: ${item.time}`;
        contenedor.appendChild(p);
    })

    contenedor.scrollTop = contenedor.scrollHeight;
}
