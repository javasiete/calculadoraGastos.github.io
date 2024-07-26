let cantidadPersonas = 0;
let personas = [];
let contador = 1;
let pedidoActual = 1;
let empanadas_pedidas_totales = 0;
let resumenGlobal = {};
let personaModificadaIndice = 0;

// Lista de sabores de empanadas
const saboresEmpanadas = [
    'carne_cortada_cuchillo', 'carne_suave', 'carne_picante', 'pollo', 'pollo_con_salsa', 
    'jamon_y_queso', 'verdura', 'calabaza', 'caprese', 'humita', '4_quesos', 
    'roquefort_y_jamon', 'queso_y_cebolla', 'dulce_de_leche', 'cantinpalo', 'atun', 
    'queso_al_verdeo', 'salchicha_y_cheddar', 'cheese_burger', 'ciruela_panceta_y_queso'
];

function validarNumero(input) {
    if (input.value < 1) input.value = 1;
    if (input.value > 20) input.value = 20;
}

function detectarEnterInicial(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        mostrarFormulario();
    }
}

function mostrarFormulario() {
    const numeroInput = document.getElementById('numero').value;
    if (!numeroInput) {
        alert("Debe digitar un número para continuar.");
        return;
    }
    cantidadPersonas = parseInt(numeroInput);
    document.getElementById('pagina_1').style.display = 'none';
    document.getElementById('pagina_2').style.display = 'flex';
    actualizarFormulario();
}

function actualizarFormulario() {
    const indice = document.getElementById('indice');
    const nombreInput = document.getElementById('nombre');
    if (contador <= cantidadPersonas) {
        const textoIndice = contador < cantidadPersonas 
            ? `${contador}/${cantidadPersonas}: Ingrese el Nombre` 
            : `${contador}/${cantidadPersonas}: Ingrese el último Nombre`;
        indice.innerText = textoIndice;
        nombreInput.value = '';
        nombreInput.focus();
    }
}

function detectarEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        registrarPersona();
    }
}

function registrarPersona() {
    const nombre = document.getElementById('nombre').value;
    if (nombre.trim() !== '') {
        // Crear un objeto persona con nombre y un array de sabores con cantidades inicializadas en 0
        let persona = {
            nombre: nombre,
            resumenPedido: saboresEmpanadas.reduce((acc, sabor) => {
                acc[sabor] = 0;
                return acc;
            }, {})
        };
        personas.push(persona);
        contador++;
        if (contador <= cantidadPersonas) {
            actualizarFormulario();
        } else {
            console.log('Personas registradas:', personas);
            
            const pagina2 = document.getElementById('pagina_2');
            pagina2.style.display = 'none';

            document.getElementById('pagina_3').style.display = 'flex';
        }
    } else {
        alert('Por favor, ingrese un nombre.');
    }
}

// ----------------------------------------------------------------------------------------------------
// Guardar en Local Storage

function guardarEnLocalStorage() {
    const personasJSON = JSON.stringify(personas);
    localStorage.setItem('personas', personasJSON);
    console.log('Array "personas" guardado en localStorage.');
}


// ----------------------------------------------------------------------------------------------------
// Ir a las PAGINAS correspondientes:

function seccion_empanadas() {
    guardarEnLocalStorage()
    window.location.href = './seccion_empanadas.html';
}

function seccion_calculadora_de_gastos() {
    guardarEnLocalStorage()
    window.location.href = './calculadora_de_gastos.html';
}

// ----------------------------------------------------------------------------------------------------

function actualizarNumeroDePedido() {
    const numeroDePedidoDiv = document.getElementById('numero_de_pedido');
    numeroDePedidoDiv.innerText = `Pedido ${pedidoActual}/${cantidadPersonas}`;
}

function sumar(tipo) {
    const input = document.getElementById(`total_${tipo}`);
    let valor = parseInt(input.value);
    if (valor < 99) {
        valor++;
        input.value = valor;
    }
}

function restar(tipo) {
    const input = document.getElementById(`total_${tipo}`);
    let valor = parseInt(input.value);
    if (valor > 0) {
        valor--;
        input.value = valor;
    }
}

function fin_del_pedido() {
    const sabores = document.querySelectorAll('.input_total');
    let resumen = "Pediste:\n";
    let totalEmpanadas = 0;
    let pedidoUsuario = {};

    sabores.forEach(sabor => {
        const cantidad = parseInt(sabor.value);
        if (cantidad > 0) {
            const tipo = sabor.id.replace('total_', '');
            resumen += `${cantidad} de ${tipo.replace(/_/g, ' ')}\n`;
            pedidoUsuario[tipo] = cantidad;
            totalEmpanadas += cantidad;
        }
    });

    if (totalEmpanadas > 0) {
        const confirmar = confirm(resumen + "\n¿Desea finalizar el pedido?");
        if (confirmar) {
            personas[pedidoActual - 1].resumenPedido = pedidoUsuario;
            empanadas_pedidas_totales += totalEmpanadas;

            actualizarResumenGlobal();

            pedidoActual++;
            if (pedidoActual <= cantidadPersonas) {
                document.getElementById('pedido__del_usuario_nombre').innerText = personas[pedidoActual - 1].nombre;
                actualizarNumeroDePedido();
                limpiarInputs();
                window.scrollTo(0, 0);
            } else {
                document.getElementById('pagina_4_empanadas').style.display = 'none';
                mostrarResumenTotal();
                mostrarPedidosEnConsola();
                alert("Se han completado todos los pedidos.");
            }
        }
    } else {
        alert("Debe pedir al menos una empanada.");
    }
}

function limpiarInputs() {
    const inputs = document.querySelectorAll('.input_total');
    inputs.forEach(input => {
        input.value = 0;
    });
}

function mostrarResumenTotal() {
    document.getElementById('pagina_5_empanadas').style.display = 'flex';

    // Mostrar el total de empanadas pedidas
    const totalDiv = document.getElementById('muestra_total_de_empanadas');
    totalDiv.innerText = `Se pidieron ${empanadas_pedidas_totales} empanadas.`;

    // Mostrar el listado de empanadas pedidas
    const listadoDiv = document.getElementById('listado_empanadas_pedidas');
    listadoDiv.innerHTML = '';
    for (let tipo in resumenGlobal) {
        if (resumenGlobal[tipo] > 0) {
            const item = document.createElement('div');
            item.innerText = `${resumenGlobal[tipo]} de ${tipo.replace(/_/g, ' ')}`;
            listadoDiv.appendChild(item);
        }
    }

    // Mostrar el detalle de lo que cada uno pidió
    const listadoFinalDiv = document.getElementById('listado_final');
    listadoFinalDiv.innerHTML = '';

    personas.forEach(persona => {
        const totalPersona = Object.values(persona.resumenPedido).reduce((acc, val) => acc + val, 0);
        const pedidoPersona = document.createElement('div');
        pedidoPersona.innerText = `${persona.nombre} pidió en total ${totalPersona} empanadas (${formatearPedido(persona.resumenPedido)}).`;
        listadoFinalDiv.appendChild(pedidoPersona);

        // Agregar espacio de 10px entre los pedidos de cada persona
        const espacio = document.createElement('div');
        espacio.style.height = '10px';
        listadoFinalDiv.appendChild(espacio);
    });
}

function formatearPedido(resumenPedido) {
    return Object.entries(resumenPedido)
        .map(([tipo, cantidad]) => `${cantidad} de ${tipo.replace(/_/g, ' ')}`)
        .join(', ');
}

function mostrarPedidosEnConsola() {
    console.log("Pedidos completos:");
    personas.forEach((persona, index) => {
        console.log(`Persona ${index + 1}: ${persona.nombre}`);
        Object.keys(persona.resumenPedido).forEach(sabor => {
            console.log(`  ${sabor}: ${persona.resumenPedido[sabor]}`);
        });
    });
    console.log(`Se han pedido un total de ${empanadas_pedidas_totales} empanadas.`);
}

// Botón para rehacer el pedido
function rehacer_pedido() {
    const confirmar = confirm("¿Está seguro de que desea rehacer el pedido?");
    if (confirmar) {
        pedidoActual = 1;
        empanadas_pedidas_totales = 0;
        resumenGlobal = {};
        personas.forEach(persona => {
            persona.resumenPedido = saboresEmpanadas.reduce((acc, sabor) => {
                acc[sabor] = 0;
                return acc;
            }, {});
        });
        mostrarFormulario();
        document.getElementById('pagina_1').style.display = 'flex';
        document.getElementById('pagina_6').style.display = 'none';
    }
}



