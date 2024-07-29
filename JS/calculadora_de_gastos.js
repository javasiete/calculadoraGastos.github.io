// Función que se activa apenas se abre la ventana, hace que se active la función que llama a los datos del Local Storage:
document.addEventListener('DOMContentLoaded', (event) => {
    cargarDesdeLocalStorage();
    crear_tablas_de_gastos_extras();
});

// Función para cargar datos desde el Local Storage:
function cargarDesdeLocalStorage() {
    const personas_en_JSON = localStorage.getItem('personas');
    personas = JSON.parse(personas_en_JSON);
    console.log('Array "personas" cargado desde localStorage:', personas);
}

// Función para formatear los valores monetarios
function formatearDinero(valor) {
    if (isNaN(valor)) return '$0,00';
    // Convertir a valor con dos decimales y reemplazar punto por coma para centavos
    return `$${valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

// Función para parsear los valores monetarios del input
function parsearValor(valor) {
    // Reemplazar las comas y puntos usados como separadores de miles por nada
    valor = valor.replace(/\./g, ''); // Primero eliminamos puntos usados como separadores de miles
    valor = valor.replace(',', '.'); // Convertimos la coma de centavos a punto

    // Convertir a número flotante
    return parseFloat(valor) || 0;
}

//------------------------------------------------------------------------------------------------------------------
// PAGINA 2

// Función para crear la tabla de gastos extras
function crear_tablas_de_gastos_extras() {
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');

    personas.forEach(persona => {
        let row = document.createElement('tr');

        // Columna 1: Nombre de la persona
        let cell1 = document.createElement('td');
        cell1.innerText = persona.nombre;
        row.appendChild(cell1);

        // Columna 2: Input para escribir valores
        let cell2 = document.createElement('td');
        let input = document.createElement('input');
        input.type = 'text'; // Cambiado a texto para manejar mejor las entradas con comas y puntos
        input.value = ''; // Inicialmente vacío
        input.id = `gasto_extra_${persona.nombre}`;
        input.className = "input_centrado";

        // Evento para prevenir el uso de puntos en el input
        input.addEventListener('input', function(e) {
            if (this.value.includes('.')) {
                this.value = this.value.replace(/\./g, ''); // Eliminar el punto
                alert("Utilice las comas ',' para indicar los centavos. Gracias.");
            }
        });

        cell2.appendChild(input);
        row.appendChild(cell2);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    document.getElementById('div_mencionar_gastos').appendChild(table);
}
// Función para sumar los gastos extras

// Función para verificar los gastos extras y generar el mensaje de confirmación
function verificarGastosExtras() {
    let personasConGastos = [];
    let mensaje = '';

    personas.forEach(persona => {
        let input = document.getElementById(`gasto_extra_${persona.nombre}`);
        let monto = parsearValor(input.value);

        if (monto > 0) {
            personasConGastos.push({ nombre: persona.nombre, monto: monto });
        }
    });

    if (personasConGastos.length === 0) {
        alert("Para continuar y poder hacer la cuenta, primero alguien debió haber hecho algún gasto. Coloca un valor en alguno de los campos vacíos.");
        return null; // No hay gastos, no seguir adelante
    } else if (personasConGastos.length === 1) {
        let persona = personasConGastos[0];
        mensaje = `${persona.nombre} fue la única persona quien compró algo y gastó ${formatearDinero(persona.monto)}.`;
    } else {
        mensaje = "Personas que hicieron compras:\n\n";
        personasConGastos.forEach(persona => {
            mensaje += `${persona.nombre} gastó ${formatearDinero(persona.monto)}.\n`;
        });
    }

    return mensaje;
}

// Función para sumar los gastos extras y confirmar los gastos
function sumar_gastos_extras() {
    let mensaje = verificarGastosExtras();

    if (mensaje && confirm(mensaje + '\n\n¿Confirma?')) {
        personas.forEach(persona => {
            let input = document.getElementById(`gasto_extra_${persona.nombre}`);
            let valor = parsearValor(input.value);

            persona.gastoExtra = valor;
        });

        ir_pagina_3();
    }
}

function ir_pagina_3() {
    document.getElementById('pagina_2').style.display = 'none';
    document.getElementById('pagina_3').style.display = 'flex';

    textoCadauno();
    transicion();
    datosFinales();
    textoResumen();
    textoFinal();

    textoCadauno();
    mostrar_detalle_gastado(); // Llamada a la función para mostrar el detalle de los gastos
    console.log(personas);
}

//------------------------------------------------------------------------------------------------------------------
// PAGINA 3

// Variables globales
let gastoExtrafinal = 0.0;
let division = 0.0;

// Función para realizar la transición de gastos
function transicion() {
    personas.forEach(persona => {
        gastoExtrafinal += parseFloat(persona.gastoExtra);
    });

    division = gastoExtrafinal / personas.length;

    personas.forEach(persona => {
        persona.gastoParcial = persona.gastoExtra - division;
        persona.gastoParcial = -persona.gastoParcial;
    });
}

// Función datosFinales para actualizar los valores de persona.gastos y persona.deudora
function datosFinales() {
    personas.forEach(persona => {
        persona.gasto = persona.gastoParcial;

        if (persona.gasto <= 0) {
            persona.deudora = false;
        } else {
            persona.deudora = true;
        }
    });
}

//--------------------------------------------------------------------------------------------------------
function textoResumen() {
    let mensaje1 = '';
    let mensaje2 = '';

    personas.forEach(persona => {
        if (!persona.deudora) {
            let valor_positivo = Math.abs(persona.gasto);
            mensaje1 += `A ${persona.nombre} le deben ${formatearDinero(valor_positivo)}.<br>`;
        }
    });

    personas.forEach(persona => {
        if (persona.deudora && Math.abs(persona.gasto) >= 0.05) {
            mensaje2 += `${persona.nombre} debe ${formatearDinero(persona.gasto)}.<br>`;
        }
    });

    document.getElementById('div_final_1_leDeben').innerHTML = mensaje1;
    document.getElementById('div_final_1_deudores').innerHTML = mensaje2;
}
//------------------------------------------------------------------------------------------------------

function textoFinal() {
    let mensajeFinal = '';

    let deudores = personas.filter(persona => persona.gasto > 0);
    let acreedores = personas.filter(persona => persona.gasto < 0);

    deudores.forEach((deudor, deudorIndex) => {
        let deudorTexto = '';

        acreedores.forEach(acreedor => {
            if (deudor.gasto > 0 && acreedor.gasto < 0) {
                let pago = Math.min(deudor.gasto, Math.abs(acreedor.gasto));
                deudor.gasto -= pago;
                acreedor.gasto += pago;

                if (Math.abs(deudor.gasto) < 0.05 && Math.abs(acreedor.gasto) < 0.05) {
                    deudor.gasto = 0;
                    acreedor.gasto = 0;
                    deudorTexto += `${deudor.nombre} le pagó ${formatearDinero(pago)} a ${acreedor.nombre}. Ahora ambos han saldado sus cuentas.<br>`;
                } else if (deudor.gasto === 0 && acreedor.gasto < 0) {
                    deudorTexto += `${deudor.nombre} le pagó ${formatearDinero(pago)} a ${acreedor.nombre}. Ahora ${deudor.nombre} ya no le debe más a nadie. Y a ${acreedor.nombre} aún le deben ${formatearDinero(Math.abs(acreedor.gasto))}.<br>`;
                } else if (deudor.gasto > 0 && acreedor.gasto === 0) {
                    deudorTexto += `${deudor.nombre} le pagó ${formatearDinero(pago)} a ${acreedor.nombre} que le debían y ahora a ${acreedor.nombre} no le deben más nada. A ${deudor.nombre} aún le faltan pagar ${formatearDinero(deudor.gasto)}.<br>`;
                } else if (deudor.gasto === 0 && acreedor.gasto === 0) {
                    deudorTexto += `${deudor.nombre} le pagó ${formatearDinero(pago)} a ${acreedor.nombre}. Ahora ambos han saldado sus cuentas.<br>`;
                }
            }
        });

        if (deudorTexto) {
            mensajeFinal += deudorTexto + '<br><br>';
        }
    });

    document.getElementById('div_final_2').innerHTML = mensajeFinal;
}

// Función textoCadauno para mostrar el gastoParcial
function textoCadauno() {
    let gastoParcial = division.toFixed(2);
    let mensaje = `En total se gastaron ${formatearDinero(gastoExtrafinal)}. Por lo que a cada uno le corresponden ${formatearDinero(division)}.`;

    document.getElementById('cadaUno').innerHTML = mensaje;
}

// Función para mostrar el detalle de lo gastado por cada persona
function mostrar_detalle_gastado() {
    let mensajeDetalles = '';

    personas.forEach(persona => {
        if (persona.gastoExtra > 0) {
            mensajeDetalles += `${persona.nombre} gastó ${formatearDinero(persona.gastoExtra)}.<br>`;
        }
    });

    // Mostrar el mensaje en el div correspondiente
    document.getElementById('detalle_de_lo_gastado').innerHTML = mensajeDetalles;
}

