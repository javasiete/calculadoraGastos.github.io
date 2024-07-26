//Función que se activa apenas se abre la ventana, hace que se active la función que llama a los datos del Local Storage:
document.addEventListener('DOMContentLoaded', (event) => {
    cargarDesdeLocalStorage();
});

// Función para cargar datos desde el Local Storage:
function cargarDesdeLocalStorage() {
    const personas_en_JSON = localStorage.getItem('personas');
    personas = JSON.parse(personas_en_JSON);

    personas.forEach(persona => {
        persona.gasto = parseFloat(persona.gasto);
    });

    console.log('Array "personas" cargado desde localStorage:', personas);

    personas.forEach(persona => {
        delete persona.pedidos;
        delete persona.resumenPedido;
    });

    div_inicial_con_texto();
}

//------------------------------------------------------------------------------------------------------------------
// PAGINA 1

// Función para formatear los números según los requisitos
function formatearDinero(valor) {
    return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

// Textos iniciales que muestran Quienes deben por el momento (Div inicial)
function div_inicial_con_texto(){
    let mensaje1 = ''; 
    let mensaje2 = ''; 

    personas.forEach(persona => {
        if (persona.deudora === false) {
            let valor_positivo = Math.abs(persona.gasto);
            mensaje1 += `A ${persona.nombre} le deben ${formatearDinero(valor_positivo)}.<br>`;
        }
    });

    personas.forEach(persona => {
        if (persona.deudora === true) {
            mensaje2 += `${persona.nombre} debe ${formatearDinero(persona.gasto)}.<br>`;
        }
    });

    document.getElementById('div_inicial_leDeben').innerHTML = mensaje1;
    document.getElementById('div_inicial_deudores').innerHTML = mensaje2;
}

function ir_pagina_2(){
    crear_tablas_de_gastos_extras();
    document.getElementById('pagina_1').style.display = 'none';
    document.getElementById('pagina_2').style.display = 'flex';
}

//------------------------------------------------------------------------------------------------------------------
// PAGINA 2

function crear_tablas_de_gastos_extras() {
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');

    personas.forEach(persona => {
        let row = document.createElement('tr');

        let cell1 = document.createElement('td');
        cell1.innerText = persona.nombre;
        row.appendChild(cell1);

        let cell2 = document.createElement('td');
        let input = document.createElement('input');
        input.type = 'number';
        input.step = '0.01';
        input.value = '0,00';
        input.id = `gasto_extra_${persona.nombre}`;
        input.className = "input_centrado";

        input.addEventListener('focus', function() {
            this.value = '';
        });

        input.addEventListener('keypress', function(event) {
            if (event.key === '.') {
                alert('Utilice las comas "," para indicar los centavos. Gracias.');
                event.preventDefault();
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
function sumar_gastos_extras() {
    let mensaje = 'Los gastos extras son de:\n\n';

    personas.forEach(persona => {
        let input = document.getElementById(`gasto_extra_${persona.nombre}`);
        let valor = input.value.replace(',', '.');

        persona.gastoExtra = parseFloat(valor) || 0;

        if (persona.gastoExtra > 0) {
            mensaje += `${persona.nombre} gastó ${formatearDinero(persona.gastoExtra)}.\n`;
        }
    });

    mensaje += '\n¿Confirma estos gastos?';

    if (confirm(mensaje)) {
        ir_pagina_3();
    }
}

function ir_pagina_3(){
    document.getElementById('pagina_2').style.display = 'none';
    document.getElementById('pagina_3').style.display = 'flex';

    transicion();
    datosFinales();
    textoResumen();
    textoFinal();

    console.log(personas);
}

//------------------------------------------------------------------------------------------------------------------
// PAGINA 3

let gastoExtrafinal = 0.0;
let division = 0.0;

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

function datosFinales() {
    personas.forEach(persona => {
        persona.gasto = persona.gasto + persona.gastoParcial;

        if (persona.gasto <= 0.05 && persona.gasto >= -0.05) {
            persona.gasto = 0;
        }

        persona.deudora = persona.gasto > 0;
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
        if (persona.deudora) {
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

    deudores.forEach((deudor) => {
        let deudorTexto = '';

        acreedores.forEach(acreedor => {
            if (deudor.gasto > 0 && acreedor.gasto < 0) {
                let pago = Math.min(deudor.gasto, Math.abs(acreedor.gasto));
                deudor.gasto -= pago;
                acreedor.gasto += pago;

                if (deudor.gasto <= 0.05 && deudor.gasto >= -0.05) {
                    deudor.gasto = 0;
                }
                if (acreedor.gasto <= 0.05 && acreedor.gasto >= -0.05) {
                    acreedor.gasto = 0;
                }

                if (deudor.gasto === 0 && acreedor.gasto < 0) {
                    deudorTexto += `${deudor.nombre} le pagó ${formatearDinero(pago)} a ${acreedor.nombre}. Ahora ${deudor.nombre} ya no le debe más a nadie. Y a ${acreedor.nombre} aún le deben ${formatearDinero(Math.abs(acreedor.gasto))}.<br>`;
                } else if (deudor.gasto > 0 && acreedor.gasto === 0) {
                    deudorTexto += `${deudor.nombre} le pagó los ${formatearDinero(pago)} a ${acreedor.nombre} que le debían y ahora a ${acreedor.nombre} no le deben más nada. A ${deudor.nombre} aún le faltan pagar ${formatearDinero(deudor.gasto)}.<br>`;
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


