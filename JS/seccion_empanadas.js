let personas = []; // Array global para almacenar las personas y sus pedidos
let personaActualIndex = 0; // Índice de la persona actual


//Función que se activa apenas se abre la ventana, hace que se active la función que llama a los datos del Local Storage:
document.addEventListener('DOMContentLoaded', (event) => {
    // Código para cargar datos del localStorage
    cargarDesdeLocalStorage();
});

// Función para cargar datos desde el Local Storage:
function cargarDesdeLocalStorage() {
    const personasJSON = localStorage.getItem('personas');
    if (personasJSON) {
        personas = JSON.parse(personasJSON);
        // Reiniciar pedidos a 0 pero conservar nombres
        personas.forEach(persona => {
            persona.pedidos = {}; // Reinicia los pedidos
        });
        console.log('Array "personas" cargado desde localStorage:', personas);
        actualizarInterfaz();
    }
}

// Función para actualizar la interfaz de usuario
function actualizarInterfaz() {
    const totalPersonas = personas.length;
    const personaActual = personas[personaActualIndex];
    
    if (totalPersonas > 0) {
        document.getElementById('numero_de_pedido').textContent = `Pedido ${personaActualIndex + 1}/${totalPersonas}`;
        document.getElementById('nombre_del_usuario').textContent = personaActual.nombre;
    }
    
    // Mostrar el total de empanadas y el detalle en la interfaz
    mostrarTotales();
    mostrarDetallesFinales();
}

// Función para sumar empanadas
function sumar(sabor) {
    const input = document.getElementById(`total_${sabor}`);
    input.value = parseInt(input.value) + 1;
}

// Función para restar empanadas
function restar(sabor) {
    const input = document.getElementById(`total_${sabor}`);
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
    }
}

// Función para finalizar el pedido de la Pagina_2:
function fin_del_pedido() {
    const personaActual = personas[personaActualIndex];
    
    // Obtener los valores de los inputs
    const sabores = [
        'carne_cortada_cuchillo', 'carne_suave', 'carne_picante', 'pollo',
        'pollo_con_salsa', 'jamon_y_queso', 'caprese', 'humita', 'verdura',
        '4_quesos', 'roquefort_y_jamon', 'queso_y_cebolla', 'dulce_de_leche',
        'cantinpalo', 'atun', 'calabaza', 'queso_al_verdeo', 'salchicha_y_cheddar',
        'cheese_burger', 'ciruela_panceta_y_queso'
    ];
    
    personaActual.pedidos = {};
    let totalEmpanadas = 0;
    
    sabores.forEach(sabor => {
        const cantidad = parseInt(document.getElementById(`total_${sabor}`).value);
        if (cantidad > 0) {
            personaActual.pedidos[sabor] = cantidad;
            totalEmpanadas += cantidad;
        }
    });
    
    if (totalEmpanadas > 0) {
        // Mostrar resumen del pedido en una ventana emergente
        const detallePedido = sabores
            .filter(sabor => personaActual.pedidos[sabor])
            .map(sabor => `${personaActual.pedidos[sabor]} de ${sabor.replace(/_/g, ' ')}`)
            .join(', ');
        
        const mensaje = `Pediste: ${detallePedido}`;
        if (confirm(`${mensaje}\n¿Deseas confirmar el pedido?`)) {
            // Actualizar el Local Storage
            localStorage.setItem('personas', JSON.stringify(personas));
            
            // Resetear los inputs
            sabores.forEach(sabor => document.getElementById(`total_${sabor}`).value = 0);
            
            // Pasar a la siguiente persona
            personaActualIndex++;
            if (personaActualIndex < personas.length) {
                actualizarInterfaz();
                document.getElementById('nombre_del_usuario').focus();
                // Mover el enfoque a la parte superior de la página
                window.scrollTo(0, 0);
            } else {
                // Mostrar resumen final
                mostrarTotales();
                mostrarDetallesFinales();
                mostrarListadoFinal(); // Mostrar el listado final de todos los pedidos
                
                // Abre y Cierra Paginas:
                document.getElementById('pagina_2').style.display = 'none';
                document.getElementById('pagina_3').style.display = 'flex';
                
                window.scrollTo(0, 0); // Mover el enfoque a la parte superior de la página
            }
        }
    } else {
        alert('No has seleccionado ninguna empanada.');
    }
}

// Función para mostrar el total de empanadas
function mostrarTotales() {
    const totalEmpanadas = personas.reduce((total, persona) => {
        return total + Object.values(persona.pedidos || {}).reduce((suma, cantidad) => suma + cantidad, 0);
    }, 0);
    
    document.getElementById('muestra_total_de_empanadas').textContent = `Se pidieron en total ${totalEmpanadas} empanadas.`;
}

// Función para mostrar el detalle de los pedidos
function mostrarDetallesFinales() {
    const sabores = [
        'carne_cortada_cuchillo', 'carne_suave', 'carne_picante', 'pollo',
        'pollo_con_salsa', 'jamon_y_queso', 'caprese', 'humita', 'verdura',
        '4_quesos', 'roquefort_y_jamon', 'queso_y_cebolla', 'dulce_de_leche',
        'cantinpalo', 'atun', 'calabaza', 'queso_al_verdeo', 'salchicha_y_cheddar',
        'cheese_burger', 'ciruela_panceta_y_queso'
    ];
    
    let detalleEmpanadas = {};
    sabores.forEach(sabor => {
        detalleEmpanadas[sabor] = personas.reduce((total, persona) => {
            return total + (persona.pedidos[sabor] || 0);
        }, 0);
    });
    
    let listadoEmpanadas = Object.keys(detalleEmpanadas)
        .filter(sabor => detalleEmpanadas[sabor] > 0)
        .map(sabor => `${detalleEmpanadas[sabor]} de ${sabor.replace(/_/g, ' ')}`)
        .join('<br>'); // Usa <br> para separar los sabores en líneas nuevas
    
    document.getElementById('muestra_sabores_pedidas').innerHTML = listadoEmpanadas;
}

// Función para mostrar el listado final de pedidos
function mostrarListadoFinal() {
    const listadoFinal = personas.map(persona => {
        const totalEmpanadas = Object.values(persona.pedidos || {}).reduce((total, cantidad) => total + cantidad, 0);
        const detallePedidos = Object.entries(persona.pedidos || {})
            .map(([sabor, cantidad]) => `${cantidad} de ${sabor.replace(/_/g, ' ')}`)
            .join(', ');

        return `${persona.nombre} pidió ${totalEmpanadas} empanada${totalEmpanadas > 1 ? 's' : ''} (${detallePedidos}).`;
    }).join('<br>'); // Usa <br> para separar los pedidos en líneas nuevas
    
    document.getElementById('listado_final').innerHTML = listadoFinal;
}

// Función para modificar el pedido
function modificar_pedido() {
    const botonesConNombres = document.getElementById("pagina_usuarios");
    botonesConNombres.innerHTML = ''; // Limpiar cualquier botón existente
    
    personas.forEach((persona, index) => {
        if (Object.keys(persona.pedidos).length > 0) { // Solo personas con pedidos
            const boton = document.createElement("button");
            boton.className = "boton_nombre_usuario";
            boton.textContent = persona.nombre;
            boton.onclick = () => mostrarFormularioModificacion(index);
            botonesConNombres.appendChild(boton);
        }
    });
    
    document.getElementById('div_pagina_usuarios').style.display = "flex";
    document.getElementById("pagina_3").style.display = "none";
}

// Función para mostrar el formulario de modificación
function mostrarFormularioModificacion(index) {
    const persona = personas[index];
    document.getElementById("rehacer_pedido").style.display = "flex";
    document.getElementById("nombre_de_persona_que_reclamo").textContent = `Pedido de ${persona.nombre}`;
    
    // Actualizar los valores de los inputs con el pedido de la persona
    const sabores = [
        'carne_cortada_cuchillo', 'carne_suave', 'carne_picante', 'pollo',
        'pollo_con_salsa', 'jamon_y_queso', 'caprese', 'humita', 'verdura',
        '4_quesos', 'roquefort_y_jamon', 'queso_y_cebolla', 'dulce_de_leche',
        'cantinpalo', 'atun', 'calabaza', 'queso_al_verdeo', 'salchicha_y_cheddar',
        'cheese_burger', 'ciruela_panceta_y_queso'
    ];
    
    sabores.forEach(sabor => {
        const input = document.getElementById(`total_${sabor}_2`);
        input.value = persona.pedidos[sabor] || 0;
    });
    
    console.log("Entre a Modificar el Pedido");
    personaActualIndex = index;
    document.getElementById('div_pagina_usuarios').style.display = "none";
    document.getElementById('rehacer_pedido').style.display = "flex";
}

// Función para actualizar el pedido
function pedido_actualizado() {
    const personaActual = personas[personaActualIndex];
    
    // Obtener los valores de los inputs
    const sabores = [
        'carne_cortada_cuchillo', 'carne_suave', 'carne_picante', 'pollo',
        'pollo_con_salsa', 'jamon_y_queso', 'caprese', 'humita', 'verdura',
        '4_quesos', 'roquefort_y_jamon', 'queso_y_cebolla', 'dulce_de_leche',
        'cantinpalo', 'atun', 'calabaza', 'queso_al_verdeo', 'salchicha_y_cheddar',
        'cheese_burger', 'ciruela_panceta_y_queso'
    ];
    
    personaActual.pedidos = {};
    let totalEmpanadas = 0;
    
    sabores.forEach(sabor => {
        const cantidad = parseInt(document.getElementById(`total_${sabor}_2`).value);
        if (cantidad > 0) {
            personaActual.pedidos[sabor] = cantidad;
            totalEmpanadas += cantidad;
        }
    });
    
    if (totalEmpanadas > 0) {
        mostrarTotales();
        mostrarDetallesFinales();
        mostrarListadoFinal();
        document.getElementById('rehacer_pedido').style.display = "none";
        document.getElementById('div_pagina_usuarios').style.display = "none";
        document.getElementById('pagina_3').style.display = "flex";
        document.getElementById('nombre_de_persona_que_reclamo').textContent = '';
    } else {
        alert('No has seleccionado ninguna empanada.');
    }

    document.getElementById('rehacer_pedido').style.display = "none";   
}

// Función para mostrar el formulario de modificación
function pagina_4() {
    
    document.getElementById("pagina_4").style.display = "flex";
    document.getElementById('pagina_3').style.display = "none";

}

// Función para mostrar el formulario de modificación
function regresar_pagina_3() {
    
    document.getElementById("pagina_3").style.display = "flex";
    document.getElementById('div_pagina_usuarios').style.display = "none";

}

//---------------------------------------------------------------------------------------------------------
// El codigo de arriba funciona bien. No modificarlo.
//---------------------------------------------------------------------------------------------------------
//A partir de la Pagina 4:

// Variable para almacenar lo que salieron el TOTAL de las empanadas:
let monto_final = 0; //Lo llame "monto_final"

// Función para formatear el valor del monto en el formato deseado
function formatearMonto(monto) {
    return monto.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Función para actualizar el monto final
function actualizarMontoFinal() {
    const montoTotalInput = document.getElementById('monto_total');
    let valor = montoTotalInput.value.replace(',', '.');
    valor = parseFloat(valor);
    if (valor > 0) {
        monto_final = valor;
    } else {
        monto_final = 0;
    }
    montoTotalInput.value = formatearMonto(monto_final);
}

// Función para la página de grupo familiar
function pagina_5_grupofamiliar() {
    actualizarMontoFinal();
    if (monto_final > 0) {

        sumar_empanadas();
        console.log(`El monto del total de empanadas es de ${monto_final}`);

        guardandoInfo();

        window.location.href = './grupo_familiar.html';

    } else {
        alert('El monto debe ser mayor a $0 y no puede ser un número negativo.');
    }
}

//Esta funcion añade el objeto "empanadasPedidas" a los elementos "persona".
function sumar_empanadas() {
    personas.forEach(persona => {
      let totalEmpanadas = 0;
  
      for (const cantidad of Object.values(persona.pedidos)) {
        totalEmpanadas += cantidad;
      }
  
      persona.empanadasPedidas = totalEmpanadas;
    });
}

//Guardar esa info en LocalStorage:

function guardandoInfo(){
    // Guardar el array "personas" en localStorage
    localStorage.setItem('personas', JSON.stringify(personas));

    // Guardar la variable "monto_final" en localStorage
    localStorage.setItem('monto_final', monto_final.toString());
}

//-----------------------------------------------------------------------------




// Función para la página de cálculo por persona
function pagina_6_cadaUno() {
    actualizarMontoFinal();
    if (monto_final > 0) {
        if (confirm(`Se gastó un total de $${formatearMonto(monto_final)}. \n¿Desea calcular cuánto debe cada uno?`)) {
            // Ocultar la página actual y mostrar la página de cálculo por persona
            document.getElementById('pagina_4').style.display = 'none';
            document.getElementById('pagina_5_cadaUno').style.display = 'flex';

            // Calcular el precio por unidad de empanada
            const totalEmpanadas = personas.reduce((total, persona) => {
                return total + Object.values(persona.pedidos || {}).reduce((suma, cantidad) => suma + cantidad, 0);
            }, 0);

            const precio_unidad_empanada = (monto_final / totalEmpanadas).toFixed(2);

            // Calcular el gasto de cada persona y actualizar la interfaz
            personas.forEach(persona => {
                const totalEmpanadasPersona = Object.values(persona.pedidos || {}).reduce((suma, cantidad) => suma + cantidad, 0);
                persona.gasto = (totalEmpanadasPersona * precio_unidad_empanada).toFixed(2);
            });

            // Mostrar el listado de gastos finales
            const listadoGastoFinalDiv = document.getElementById('listado_gasto_final');
            listadoGastoFinalDiv.innerHTML = `<h3>Cada empanada costó $${formatearMonto(parseFloat(precio_unidad_empanada))}</h3>`;
            listadoGastoFinalDiv.innerHTML += personas.map(persona => {
                const totalEmpanadasPersona = Object.values(persona.pedidos || {}).reduce((suma, cantidad) => suma + cantidad, 0);
                const empanadasText = totalEmpanadasPersona === 1 ? 'empanada' : 'empanadas';
                return `${persona.nombre} pidió ${totalEmpanadasPersona} ${empanadasText}, debe $${formatearMonto(parseFloat(persona.gasto))}`;
            }).join('<br>');
        }
    } else {
        alert('El monto debe ser mayor a $0 y no puede ser un número negativo.');
    }
}

function finalizar_programa() {
    if (confirm("¿Desea reiniciar todo el Programa y volver a la Página Inicial?")) {
        window.location.href = './index.html';
    }
}

function programa_excel() {
    document.getElementById('pagina_5_cadaUno').style.display = 'none';
    document.getElementById('pagina_6_cadaUno').style.display = 'flex';

    // Crear los Botones con los Nombres de las Personas:
    const divQuienPagoEmpanadas = document.getElementById('div_quien_pago_empanadas');
    divQuienPagoEmpanadas.innerHTML = ''; // Limpiar cualquier botón existente
    
    personas.forEach(persona => {
        const boton = document.createElement('button'); //Creo el button y le asigno el nombre variable "boton".
        boton.className = 'boton_nombre_usuario'; //Le asigno la Clase que quiero que tenga el boton.
        boton.textContent = persona.nombre; //Añado el texto que tenga el boton (en este caso persona.nombre)
        boton.onclick = () => seleccionarPersonaQuePago(persona.nombre); //Añado la función que se activará al hacer click.
        divQuienPagoEmpanadas.appendChild(boton);
    });
}

function seleccionarPersonaQuePago(nombre) {
    if (confirm(`¿${nombre} fue quien pagó los $${formatearMonto(monto_final)} del pedido por las Empanadas?`)) {
        const persona = personas.find(p => p.nombre === nombre);
        if (persona) {
            // Realizar la cuenta: total_empanadas - (persona.gasto)
            persona.gasto = (monto_final - parseFloat(persona.gasto)).toFixed(2);
            // Convertir el valor a negativo
            persona.gasto = (-persona.gasto).toFixed(2);

            // Controlar el valor de persona.gasto y establecer persona.deudora
            persona.deudora = persona.gasto > 0;

            // Actualizar la persona en el array personas
            const index = personas.findIndex(p => p.nombre === persona.nombre);
            if (index !== -1) {
                personas[index] = persona;
            } else {
                personas.push(persona);
            }

            // Guardar los datos actualizados en localStorage
            localStorage.setItem('personasData', JSON.stringify(personas));

            // Mostrar el mensaje en console log
            personas.forEach(persona => {
                // Actualizar el estado deudora según el gasto
                if (persona.gasto <= 0) {
                    persona.deudora = false;
                } else {
                    persona.deudora = true;
                }

                const deudoraStatus = persona.deudora ? 'es deudora' : 'no es deudora';
                console.log(`${persona.nombre} ${deudoraStatus} con un gasto de $${formatearMonto(parseFloat(persona.gasto))}`);
            });

            const personas_en_JSON = JSON.stringify(personas);
            localStorage.setItem('personas', personas_en_JSON);
            console.log('Array "personas" guardado en localStorage.');

            // Te lleva a la Pagina de Registro de Gastos:
            window.location.href = './registro_de_gastos.html';
        }
    }
}

// Agregar el evento para prevenir el uso de puntos en el input del monto total
document.getElementById('monto_total').addEventListener('keydown', function(event) {
    if (event.key === '.') {
        event.preventDefault();
        alert('Utilice las comas "," para indicar los centavos. Gracias.');
    }
});
