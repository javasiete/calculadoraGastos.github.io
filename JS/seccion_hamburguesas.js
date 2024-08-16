// Función que se activa apenas se abre la ventana, hace que se active la función que llama a los datos del Local Storage:
document.addEventListener('DOMContentLoaded', (event) => {
    cargarDesdeLocalStorage();
    crear_tabla_montos_hamburguesas();
});

// Función para cargar datos desde el Local Storage y limpiar los elementos innecesarios:
function cargarDesdeLocalStorage() {
    const personas_en_JSON = localStorage.getItem('personas');
    personas = JSON.parse(personas_en_JSON) || [];

    // Eliminar "pedidos" y "resumenPedido" de cada objeto persona
    personas.forEach(persona => {
        delete persona.pedidos;
        delete persona.resumenPedido;
    });

    console.log('Array "personas" cargado y limpiado desde localStorage:', personas);
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

// Función para crear la TABLA de Gastos de lo que costó cada Hamburguesa:
function crear_tabla_montos_hamburguesas() {
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');

    personas.forEach(persona => {
        let row = document.createElement('tr');

        // Columna 1: Checkbutton para seleccionar una persona
        let cell1 = document.createElement('td');
        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'persona_seleccionada'; // Para que solo se pueda seleccionar una opción
        radio.value = persona.nombre;
        cell1.appendChild(radio);
        row.appendChild(cell1);

        // Columna 2: Nombre de la persona
        let cell2 = document.createElement('td');
        cell2.innerText = persona.nombre;
        row.appendChild(cell2);

        // Columna 3: Input para escribir valores
        let cell3 = document.createElement('td');
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

        cell3.appendChild(input);
        row.appendChild(cell3);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    document.getElementById('div_con_la_tabla').appendChild(table);
}

// Función para determinar quién fue la persona seleccionada, capturar y ajustar los montos
function ir_pagina_3() {
    let seleccionados = document.querySelector('input[name="persona_seleccionada"]:checked');
    let inputsCompletos = true;

    // Validar que todos los inputs de montos estén completos
    personas.forEach(persona => {
        let inputValor = document.getElementById(`gasto_extra_${persona.nombre}`).value.trim();
        if (inputValor === '' || isNaN(parsearValor(inputValor))) {
            inputsCompletos = false;
        }
    });

    // Mostrar alertas según sea necesario
    if (!inputsCompletos) {
        alert("Debe colocar los montos de las Hamburguesas para poder continuar.");
        return;
    }

    if (!seleccionados) {
        alert("Debe marcar a la persona que pagó el Pedido de las Hamburguesas para poder continuar.");
        return;
    }

    // Si todas las validaciones pasan, proceder con la lógica de cálculo
    let personaSeleccionada = seleccionados.value;
    let totalGastos = 0;

    // Capturar los montos ingresados y almacenarlos en el objeto persona
    personas.forEach(persona => {
        let inputValor = parsearValor(document.getElementById(`gasto_extra_${persona.nombre}`).value);
        if (persona.nombre === personaSeleccionada) {
            persona.gasto = 0; // El gasto de la persona seleccionada se inicializa en 0
        } else {
            persona.gasto = inputValor; // Guardar el gasto de las demás personas
            totalGastos += inputValor; // Sumar los gastos de las demás personas
        }
    });

    // Asignar el gasto negativo a la persona seleccionada
    personas.forEach(persona => {
        if (persona.nombre === personaSeleccionada) {
            persona.gasto = -totalGastos;
        }
    });

    // Asignar el valor de "deudora" basado en el gasto
    personas.forEach(persona => {
        persona.deudora = persona.gasto > 0;
    });

    // Mostrar el objeto personas en el console log
    console.log("Objeto personas actualizado:", personas);
    console.log(`Quien pagó por las hamburguesas fue ${personaSeleccionada}`);

    guardarEnLocalStorage();
    window.location.href = './registro_de_gastos_c_hamburguesas.html';
}

// ----------------------------------------------------------------------------------------------------
// Guardar en Local Storage

function guardarEnLocalStorage() {
    const personasJSON = JSON.stringify(personas);
    localStorage.setItem('personas', personasJSON);
    console.log('Array "personas" guardado en localStorage.');
}












