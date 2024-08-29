// Función que se activa apenas se abre la ventana, hace que se active la función que llama a los datos del Local Storage:
document.addEventListener('DOMContentLoaded', (event) => {
    cargarDesdeLocalStorage();
    crear_tabla_con_inputs();
});

// Función para cargar datos desde el Local Storage y limpiar los elementos innecesarios:
function cargarDesdeLocalStorage() {
    const personas_en_JSON = localStorage.getItem('personas');
    personas = JSON.parse(personas_en_JSON) || [];

    // Eliminar "pedidos" y "resumenPedido" de cada objeto persona:
    personas.forEach(persona => {
        delete persona.pedidos;
        delete persona.resumenPedido;
    });

    // Añadimos el elemento "gasto" desde la funcion que creamos abajo:
    aniadir_elemento_gasto(personas, gasto);

    console.log('Array "personas" cargado y limpiado desde localStorage:', personas);
}

// Función para añadir el objeto "gasto" a cada persona en el array Personas:
let gasto = 0;
function aniadir_elemento_gasto(personas, gasto) {
    personas.forEach(persona => {
        persona.gasto = gasto;
    });
}

//------------------------------------------------------------------------------------------------------------------
// PAGINA 1

// Botones de "mostrar y esconder" la Info de la Tabla:
function mostrar_info_aclaracion() {
    // Ocultar el botón con id "boton_flechita_on"
    document.getElementById("boton_flechita_on").style.display = "none";

    // Mostrar el div con id "info_aclaracion" y el botón con id "boton_flechita_off"
    document.getElementById("info_aclaracion").style.display = "flex";
    document.getElementById("boton_flechita_off").style.display = "flex";
}

function esconder_info_aclaracion() {
    // Mostrar el botón con id "boton_flechita_on"
    document.getElementById("boton_flechita_on").style.display = "flex";

    // Ocultar el div con id "info_aclaracion" y el botón con id "boton_flechita_off"
    document.getElementById("info_aclaracion").style.display = "none";
    document.getElementById("boton_flechita_off").style.display = "none";
}

// Array para almacenar los platillos
let platillos = [];

// Función para crear la tabla con los primeros inputs
function crear_tabla_con_inputs() {
    const div = document.getElementById('inputs_creados');
    const table = document.createElement('table');

    // Crear la primera fila (encabezado)
    const headerRow = document.createElement('tr');
    const cantidadHeader = document.createElement('th');
    cantidadHeader.innerText = 'Cant.';
    const itemHeader = document.createElement('th');
    itemHeader.innerText = 'Item';
    const costoHeader = document.createElement('th');
    costoHeader.innerText = 'Costo';
    const compartidaHeader = document.createElement('th');
    compartidaHeader.innerText = 'Compartida';

    headerRow.appendChild(cantidadHeader);
    headerRow.appendChild(itemHeader);
    headerRow.appendChild(costoHeader);
    headerRow.appendChild(compartidaHeader);
    table.appendChild(headerRow);

    // Crear la segunda fila con los inputs iniciales
    aniadir_input_nuevo(table);

    // Agregar la tabla al div
    div.appendChild(table);
}

// Función para añadir una nueva fila a la tabla
function aniadir_input_nuevo(table) {
    if (!table) {
        console.error('Tabla no encontrada o no pasada correctamente.');
        return;
    }

    const newRow = document.createElement('tr');

    // Celda para la cantidad
    const cantidadCell = document.createElement('td');
    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.className = 'input_cantidad';
    cantidadInput.value = 1;
    cantidadInput.min = 1;
    cantidadCell.appendChild(cantidadInput);

    // Celda para el nombre del item
    const itemCell = document.createElement('td');
    const itemInput = document.createElement('input');
    itemInput.type = 'text';
    itemInput.className = 'input_item';
    itemCell.appendChild(itemInput);

    // Celda para el costo
    const costoCell = document.createElement('td');
    const costoInput = document.createElement('input');
    costoInput.type = 'number';
    costoInput.className = 'input_centrado';
    costoCell.appendChild(costoInput);

    // Celda para la opción de compartida
    const compartidaCell = document.createElement('td');
    const compartidaRadio = document.createElement('input');
    compartidaRadio.type = 'radio';
    compartidaRadio.className = 'input_centrado';
    compartidaRadio.name = 'compartida_' + (platillos.length); // Nombre único para cada fila
    compartidaCell.appendChild(compartidaRadio);

    newRow.appendChild(cantidadCell);
    newRow.appendChild(itemCell);
    newRow.appendChild(costoCell);
    newRow.appendChild(compartidaCell);
    table.appendChild(newRow);

    // Agregar un objeto vacío al array platillos para la nueva fila
    platillos.push({ cantidad: 1, item: '', costo: '', compartido: false });

    // Guardar datos en el array platillos cuando los inputs cambian
    cantidadInput.addEventListener('input', () => {
        const index = Array.from(table.getElementsByTagName('tr')).indexOf(newRow) - 1; // Restar 1 para excluir el encabezado
        platillos[index].cantidad = cantidadInput.value;
    });

    itemInput.addEventListener('input', () => {
        const index = Array.from(table.getElementsByTagName('tr')).indexOf(newRow) - 1; // Restar 1 para excluir el encabezado
        platillos[index].item = itemInput.value;
    });

    costoInput.addEventListener('input', () => {
        const index = Array.from(table.getElementsByTagName('tr')).indexOf(newRow) - 1; // Restar 1 para excluir el encabezado
        platillos[index].costo = costoInput.value;
    });

    compartidaRadio.addEventListener('change', () => {
        const index = Array.from(table.getElementsByTagName('tr')).indexOf(newRow) - 1; // Restar 1 para excluir el encabezado
        platillos[index].compartido = compartidaRadio.checked;
    });

    // Mostrar el botón escondido si hay más de una fila
    if (table.rows.length > 2) { // Considera la fila de encabezado
        document.getElementById('boton_escondido').style.display = 'block';
    }
}

// Función para eliminar la última fila de la tabla
function eliminar_fila_tabla() {
    const table = document.querySelector('#inputs_creados table');
    if (table.rows.length > 2) { // Mantener al menos una fila más el encabezado
        table.deleteRow(-1);
        platillos.pop(); // Eliminar el último elemento del array

        // Ocultar el botón si solo queda una fila
        if (table.rows.length === 2) {
            document.getElementById('boton_escondido').style.display = 'none';
        }
    }
}

// Función para validar si hay inputs vacíos
function validarInputs() {
    let inputsValidos = true; // Asumimos que todos los inputs son válidos al principio

    // Iterar sobre todos los inputs de la tabla
    document.querySelectorAll('#inputs_creados input[type="text"], #inputs_creados input[type="number"]').forEach(input => {
        if (input.value.trim() === '') { // Comprobamos si el valor es vacío
            inputsValidos = false; // Si encontramos un input vacío, lo marcamos como inválido
        }
    });

    return inputsValidos; // Devolvemos el estado de validez de los inputs
}

// Función para mostrar el array en console.log y cambiar de página
function pagina_2() {
    if (!validarInputs()) { // Si los inputs no son válidos
        alert('No puede haber camposs vacíos. Por favor, complete todos los campos antes de continuar.');
        return; // Evitar que continúe con la siguiente acción si hay campos vacíos
    }

    console.log(platillos);

    // Ocultar "pagina_1" y mostrar "pagina_2"
    document.getElementById('pagina_1').style.display = 'none';
    document.getElementById('pagina_2').style.display = 'flex';

    // Activar la función para mostrar items uno por uno
    mostrar_items_uno_por_uno();
}



//------------------------------------------------------------------------------------------------------------------
// PAGINA 2
let indexPlatillo = 0;

// Función para mostrar los platillos uno por uno
function mostrar_items_uno_por_uno() {
    if (indexPlatillo < platillos.length) {
        const platillo = platillos[indexPlatillo];
        const divConPlatillo = document.getElementById('div_con_platillo');
        const divIndicador = document.getElementById('div_indicador');
        const divBotonesNombres = document.getElementById('div_mostrando_botones_con_nombre');
        const botonVerOtroPlato = document.getElementById('ver_otro_plato');

        // Mostrar el platillo actual
        divConPlatillo.innerText = `Item ${indexPlatillo + 1}/${platillos.length}: ${platillo.item}`;

        // Limpiar botones anteriores si los hubiera
        divBotonesNombres.innerHTML = '';

        // Verificar las condiciones para mostrar el texto correcto en div_indicador
        if (platillo.cantidad == 1 && platillo.compartido === true) {
            divIndicador.innerText = "Seleccionar a las personas que pidieron este item y Registrarlo.";
            mostrar_botones_seleccion_personas();
        } else if (platillo.cantidad == 1 && platillo.compartido === false) {
            divIndicador.innerText = "Seleccionar quien fue la persona que pidió este item y Registrarlo.";
            mostrar_botones_seleccion_personas_unica();
        } else if (platillo.cantidad > 1 && platillo.compartido === false) {
            divIndicador.innerText = "Indicar la cantidad de consumiciones que tuvo cada persona sobre este item.";
            funcion_cantidad_consumisiones_por_persona(platillo.cantidad); // Pasar la cantidad a la función
        }

        // Cambiar el texto del botón si es el último pedido
        if (indexPlatillo === platillos.length - 1) {
            botonVerOtroPlato.innerText = "Registrar último Pedido";
        } else {
            botonVerOtroPlato.innerText = "Registrar Pedido";
        }
    }
}

// Función para mostrar botones para seleccionar personas (caso de platillo compartido)
function mostrar_botones_seleccion_personas() {
    const divBotonesNombres = document.getElementById('div_mostrando_botones_con_nombre');
    divBotonesNombres.innerHTML = ''; // Limpiar cualquier contenido previo en el div

    personas.forEach((persona, i) => {
        const botonPersona = document.createElement('button');
        botonPersona.id = `btn_nombre_${i}`;
        botonPersona.className = 'btn_nombre';
        botonPersona.innerText = persona.nombre;
        botonPersona.onclick = () => toggleSeleccion(botonPersona);
        divBotonesNombres.appendChild(botonPersona);
    });
}

// Función para mostrar botones de selección única (caso de cantidad = 1 y no compartido)
function mostrar_botones_seleccion_personas_unica() {
    const divBotonesNombres = document.getElementById('div_mostrando_botones_con_nombre');
    divBotonesNombres.innerHTML = ''; // Limpiar cualquier contenido previo en el div

    personas.forEach((persona, i) => {
        const botonPersona = document.createElement('button');
        botonPersona.id = `btn_nombre_${i}`;
        botonPersona.className = 'btn_nombre';
        botonPersona.innerText = persona.nombre;
        botonPersona.onclick = () => seleccionar_unica_persona(botonPersona);
        divBotonesNombres.appendChild(botonPersona);
    });
}

// Función para alternar la selección de personas (platillo compartido)
function toggleSeleccion(boton) {
    boton.classList.toggle('seleccionado');
}

// Función para seleccionar solo una persona (cantidad = 1 y no compartido)
function seleccionar_unica_persona(boton) {
    const botones = document.querySelectorAll('.btn_nombre');
    botones.forEach(btn => btn.classList.remove('seleccionado'));
    boton.classList.add('seleccionado');
}

// Función unificada para mostrar el siguiente platillo y calcular los gastos
function ver_otro_plato() {
    const platillo = platillos[indexPlatillo];

    if (platillo.cantidad == 1 && platillo.compartido === true) {
        // Caso de platillo compartido
        const botonesSeleccionados = document.querySelectorAll('.btn_nombre.seleccionado');
        
        if (botonesSeleccionados.length === 1) {
            const nombrePersona = botonesSeleccionados[0].innerText;
            const confirmacion = confirm(`Debería seleccionar a más personas porque este es un item compartido. ¿Desea registrar que ${nombrePersona} se hace cargo por sí sola?`);

            if (confirmacion) {
                const persona = personas.find(p => p.nombre === nombrePersona);
                persona.gasto += parseFloat(platillo.costo);
                console.log(`${nombrePersona} se ha hecho cargo de ${platillo.costo}.`);
            } else {
                return; // No avanzar si se cancela
            }
        } else {
            const costoPorPersona = platillo.costo / botonesSeleccionados.length;

            botonesSeleccionados.forEach(boton => {
                const nombrePersona = boton.innerText;
                const persona = personas.find(p => p.nombre === nombrePersona);
                persona.gasto += parseFloat(costoPorPersona);
            });
        }

    } else if (platillo.cantidad == 1 && platillo.compartido === false) {
        // Caso de platillo no compartido
        const botonSeleccionado = document.querySelector('.btn_nombre.seleccionado');
        if (botonSeleccionado) {
            const nombrePersona = botonSeleccionado.innerText;
            const persona = personas.find(p => p.nombre === nombrePersona);
            persona.gasto += parseFloat(platillo.costo);
        }

    } else if (platillo.cantidad > 1 && platillo.compartido === false) {
        let pedidosTotales = 0;
        let platillosTotales = parseFloat(platillo.cantidad); // Asegúrate de que platillo.cantidad es el valor correcto

        console.log("platillosTotales (cantidad):", platillosTotales); // Verifica el valor de platillosTotales

        // Sumar el valor de todos los inputs
        document.querySelectorAll('input[id^="input_cantidad_consumido_por_persona"]').forEach(input => {
            pedidosTotales += parseFloat(input.value) || 0; // Sumando valores de los inputs
        });

        console.log("la suma de los inputs da:", pedidosTotales);

        // Validar si los totales son iguales
        if (pedidosTotales === platillosTotales) {
            console.log("Son iguales");

            personas.forEach((persona, i) => {
                const inputCantidad = document.getElementById('input_cantidad_consumido_por_persona_' + i);
                
                // Verificar si el inputCantidad existe
                if (inputCantidad) {
                    const cantidadConsumida = Number(inputCantidad.value); // Obtener el valor del input como número
                    const gasto = cantidadConsumida * platillo.costo; // Calcular el gasto
                    persona.gasto += parseFloat(gasto);
                } else {
                    console.warn(`El input con id 'input_cantidad_consumido_por_persona_${i}' no existe.`);
                }
            });
        } else if (pedidosTotales < platillosTotales) {
            let faltan = platillosTotales - pedidosTotales;
            alert(`Error. Se pidieron ${platillosTotales} en total. Faltan ${faltan} items más que añadir.`);
            return; // Salir de la función para no avanzar al siguiente platillo
        } else {
            let sobran = pedidosTotales - platillosTotales;
            alert(`Error. Se pidieron ${platillosTotales} en total. Sobran ${sobran} items más que debe quitar.`);
            return; // Salir de la función para no avanzar al siguiente platillo
        }
    }

    // Avanzar al siguiente platillo
    indexPlatillo++;
    if (indexPlatillo < platillos.length) {
        mostrar_items_uno_por_uno();
    } else {
        // Se activa la funcion que muestra la pagina 3:
        cuenta_final();
        mostrar_pagina_3();
        
    }

    // Mostrar el console.log de personas
    console.log(personas);
}

// Este es el ejemplo donde se pidieron 4 bebidas y se indica cuántas consumió cada uno.
function funcion_cantidad_consumisiones_por_persona(cantidadPlatillo) {
    const divBotonesNombres = document.getElementById('div_mostrando_botones_con_nombre');
    divBotonesNombres.innerHTML = ''; // Limpiar cualquier contenido previo en el div

    const tablaPersonas = document.createElement('table'); // Crear una tabla

    personas.forEach((persona, i) => {
        const fila = document.createElement('tr');

        const celdaNombre = document.createElement('td');
        celdaNombre.innerText = persona.nombre;
        fila.appendChild(celdaNombre);

        const celdaInput = document.createElement('td');
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.id = `input_cantidad_consumido_por_persona_${i}`; // Usar el índice para identificar el input
        inputCantidad.min = 0; // Asegurar que no se pueda ingresar un valor negativo
        inputCantidad.className = 'input_cantidad'; // Le añade la CLASE al input

        celdaInput.appendChild(inputCantidad);
        fila.appendChild(celdaInput);

        tablaPersonas.appendChild(fila); // Agregar la fila a la tabla
    });

    divBotonesNombres.appendChild(tablaPersonas); // Agregar la tabla al div
}


// Función para formatear números como moneda en pesos argentinos
function formatearAPesos(valor) {
    return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

// Hace la cuenta final:
function cuenta_final() {
    let total_gastado = 0;

    // Sumar el gasto total de todas las personas
    personas.forEach(persona => {
        total_gastado += persona.gasto;
    });

    // Formatear el total gastado a moneda argentina
    const total_gastado_formateado = total_gastado.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });

    // Mostrar el total gastado en el div con id="resumen_total_gastado"
    const divResumenTotal = document.getElementById('resumen_total_gastado');
    divResumenTotal.innerText = `Total Gastado: ${total_gastado_formateado}.`;

    // Mostrar el gasto de cada persona en el div con id="resumen_por_persona"
    const divResumenPorPersona = document.getElementById('resumen_por_persona');
    divResumenPorPersona.innerHTML = ''; // Limpiar el contenido previo

    personas.forEach(persona => {
        const gasto_formateado = persona.gasto.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        });

        const p = document.createElement('p');
        p.innerText = `${persona.nombre} gastó ${gasto_formateado}.`;
        divResumenPorPersona.appendChild(p);
    });
}




//Habilita que la Pagina 3 aparezca en pantalla:
function mostrar_pagina_3(){
    document.getElementById('pagina_3').style.display = 'flex';
    document.getElementById('pagina_2').style.display = 'none';
}