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
            mensaje1 += `A ${persona.nombre} le deben $${formatearDinero(valor_positivo)} por la compra de las Empanadas.<br>`;
        }
    });

    personas.forEach(persona => {
        if (persona.deudora === true) {
            let verbo = persona.grupoFamiliar ? 'deben' : 'debe';
            mensaje2 += `${persona.nombre} ${verbo} $${formatearDinero(persona.gasto)}.<br>`;
        }
    });

    document.getElementById('div_inicial_leDeben').innerHTML = mensaje1;
    document.getElementById('div_inicial_deudores').innerHTML = mensaje2;
}

// Funcion para ir a la Pagina_2 que se activa al apretar el Botón:
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
        input.value = '0.00'; // Cambié ',' a '.' para el valor inicial.
        input.id = `gasto_extra_${persona.nombre}`;
        input.className = "input_centrado";

        input.addEventListener('focus', function() {
            if (this.value === '0.00') {
                this.value = '';
            }
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = '0.00';
            }
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

// Función para formatear el dinero con miles separados por puntos y centavos con comas
function formatearDinero(monto) {
    return monto.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Función para verificar los gastos extras y generar el mensaje de confirmación
function verificarGastosExtras() {
    let personasConGastos = [];
    let mensaje = '';

    personas.forEach(persona => {
        let input = document.getElementById(`gasto_extra_${persona.nombre}`);
        let monto = parseFloat(input.value.replace(',', '.')) || 0;

        if (monto > 0) {
            personasConGastos.push({ nombre: persona.nombre, monto: monto });
        }
    });

    if (personasConGastos.length === 0) {
        mensaje = "Al final nadie más compró algo y no hubieron Gastos extras.";
    } else if (personasConGastos.length === 1) {
        let persona = personasConGastos[0];
        mensaje = `${persona.nombre} fue la única persona quien compró y gastó $${formatearDinero(persona.monto)}.`;
    } else {
        mensaje = "Los Gastos extras fueron de:\n\n";
        personasConGastos.forEach(persona => {
            mensaje += `${persona.nombre} gastó $${formatearDinero(persona.monto)}.\n`;
        });
    }

    return mensaje;
}

// Función para sumar los gastos extras y confirmar los gastos
function sumar_gastos_extras() {
    let mensaje = verificarGastosExtras();

    if (confirm(mensaje + '\n\n¿Confirma?')) {
        personas.forEach(persona => {
            let input = document.getElementById(`gasto_extra_${persona.nombre}`);
            let valor = input.value.replace(',', '.');

            persona.gastoExtra = parseFloat(valor) || 0;
        });

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
            mensaje1 += `A ${persona.nombre} le deben $${formatearDinero(valor_positivo)}.<br>`;
        }
    });

    personas.forEach(persona => {
        if (persona.deudora) {
            let verbo = persona.grupoFamiliar ? 'deben' : 'debe';
            mensaje2 += `${persona.nombre} ${verbo} $${formatearDinero(persona.gasto)}.<br>`;
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

    deudores.forEach((deudor, index) => {
        let deudorTexto = '';

        acreedores.forEach(acreedor => {
            if (deudor.gasto > 0 && acreedor.gasto < 0) {
                let pago = Math.min(deudor.gasto, Math.abs(acreedor.gasto));
                deudor.gasto -= pago;
                acreedor.gasto += pago;

                // Redondeo a cero si la diferencia es muy pequeña
                if (Math.abs(deudor.gasto) <= 0.05) {
                    deudor.gasto = 0;
                }
                if (Math.abs(acreedor.gasto) <= 0.05) {
                    acreedor.gasto = 0;
                }

                let sujetoDeudor = deudor.nombre;

                // Verificar si ambas cuentas están saldadas
                if (deudor.gasto === 0 && acreedor.gasto === 0) {
                    if (deudor.grupoFamiliar) {
                        deudorTexto += `${sujetoDeudor} le pagaron $${formatearDinero(pago)} a ${acreedor.nombre}. Y ahora ambas cuentas están saldadas.<br>\n`;
                    } else {
                        deudorTexto += `${sujetoDeudor} le pagó $${formatearDinero(pago)} a ${acreedor.nombre}. Y ahora ambas cuentas están saldadas.<br>\n`;
                    }
                } else {
                    if (deudor.grupoFamiliar) {
                        if (acreedor.gasto === 0) {
                            deudorTexto += `${sujetoDeudor} le pagaron $${formatearDinero(pago)} a ${acreedor.nombre}. Ahora a ${acreedor.nombre} ya no le deben más.<br>\n`;
                        } else {
                            deudorTexto += `${sujetoDeudor} le pagaron $${formatearDinero(pago)} a ${acreedor.nombre}. Ahora a ${acreedor.nombre} aún le deben $${formatearDinero(Math.abs(acreedor.gasto))}.\n`;
                        }
                    } else {
                        if (deudor.gasto === 0) {
                            deudorTexto += `${sujetoDeudor} le pagó $${formatearDinero(pago)} a ${acreedor.nombre}. Ahora ${sujetoDeudor} ya no le debe más a nadie. `;
                            if (acreedor.gasto === 0) {
                                deudorTexto += `Y ahora a ${acreedor.nombre} no le deben más.\n`;
                            } else if (acreedor.gasto < 0) {
                                deudorTexto += `Y a ${acreedor.nombre} aún le están debiendo $${formatearDinero(Math.abs(acreedor.gasto))}.\n`;
                            }
                        } else {
                            deudorTexto += `${sujetoDeudor} le pagó $${formatearDinero(pago)} a ${acreedor.nombre}.`;
                            if (acreedor.gasto === 0) {
                                deudorTexto += ` Y ahora a ${acreedor.nombre} no le deben más.<br>`;
                            } else {
                                deudorTexto += ` Ahora a ${acreedor.nombre} aún le deben $${formatearDinero(Math.abs(acreedor.gasto))}.\n`;
                            }
                        }
                    }
                }
            }
        });

        // Añadir dos <br> solo si hay texto para este deudor
        if (deudorTexto) {
            mensajeFinal += (index > 0 ? '<br><br>' : '') + deudorTexto + '<br>';
        }
    });

    const divFinalTexto = document.getElementById('div_final_texto');
    if (divFinalTexto) {
        divFinalTexto.innerHTML = mensajeFinal;
    } else {
        console.error('Elemento div_final_texto no encontrado');
    }
}
