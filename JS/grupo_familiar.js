// Función que se activa apenas se abre la ventana, hace que se active la función que llama a los datos del Local Storage:
document.addEventListener('DOMContentLoaded', (event) => {
    cargarDesdeLocalStorage();
    resetear_array();
    mostrar_botones_nombres();
});

// Función para cargar datos desde el Local Storage:
function cargarDesdeLocalStorage() {
    const personas_en_JSON = localStorage.getItem('personas');
    personas = JSON.parse(personas_en_JSON);

    const montoFinal_en_JSON = localStorage.getItem('monto_final');
    monto_final = JSON.parse(montoFinal_en_JSON);
    console.log(`El monto final guardado es de $${monto_final.toFixed(2)}`);
}

// Nueva función para resetear el array de personas
function resetear_array() {
    personas.forEach(persona => {
        delete persona.pedidos;
        delete persona.resumenPedido;
        persona.gasto = 0; // Añadir el objeto "gasto" con valor 0
    });

    repartir_gastos(); // Esta función le asigna los costos de lo que gastó cada Persona.
}

function repartir_gastos() {
    let totalEmpanadasPedidas = personas.reduce((total, persona) => total + (persona.empanadasPedidas || 0), 0);
    let costo_por_empanada = monto_final / totalEmpanadasPedidas;
    console.log(`El costo por empanada es de $${costo_por_empanada.toFixed(2)}`);

    personas.forEach(persona => {
        persona.gasto = (persona.empanadasPedidas || 0) * costo_por_empanada;
    });

    console.log('Array de personas indicando sus Gastos:', personas);
}

//------------------------------------------------------------------------------------------------------------------
// PAGINA 1

// Función para mostrar los nombres en botones
function mostrar_botones_nombres() {
    const divGrupo = document.getElementById('div_botones_con_nombres');
    divGrupo.innerHTML = ''; // Limpiar contenido previo
  
    personas.forEach((persona, index) => {
        const button = document.createElement('button');
        button.textContent = persona.nombre;
        button.id = `btn_${index}`;
        button.classList.add('btn_nombre');
        button.onclick = () => seleccionarBoton(button);
  
        divGrupo.appendChild(button);
    });
}
  
// Función para seleccionar/deseleccionar un botón
function seleccionarBoton(button) {
    button.classList.toggle('btn_clickeado');
    if (button.classList.contains('btn_clickeado')) {
        button.classList.add('seleccionado'); // Le añade la clase "seleccionado"
        button.style.boxShadow = '0 0 20px white';
    } else {
        button.classList.remove('seleccionado'); // Quita la clase "seleccionado"
        button.style.boxShadow = 'none';
    }
}
  
// Función para confirmar la unificación de datos
function confirmar_grupo() {
    const botonesSeleccionados = document.querySelectorAll('.btn_clickeado');

    if (botonesSeleccionados.length < 2) {
        alert('Deben marcarse a 2 personas para unificar los Gastos.');
        return; // Detiene la ejecución si hay menos de dos personas seleccionadas
    }

    let nombresUnificados = [];
    let totalGastoUnificado = 0;
    let totalEmpanadasUnificadas = 0;

    botonesSeleccionados.forEach(boton => {
        const index = parseInt(boton.id.split('_')[1]);
        const persona = personas[index];

        nombresUnificados.push(persona.nombre);
        totalGastoUnificado += persona.gasto;
        totalEmpanadasUnificadas += persona.empanadasPedidas;  // Sumar las empanadas pedidas
    });

    // Formatear la pregunta con los nombres de las personas seleccionadas
    const nombresFormateados = nombresUnificados.length === 2
        ? `${nombresUnificados.join(' y ')}`
        : `${nombresUnificados.slice(0, -1).join(', ')} y ${nombresUnificados.slice(-1)}`;

    if (confirm(`Desea formar un grupo con ${nombresFormateados}?`)) {
        // Crear nuevo objeto persona unificada
        const nuevaPersona = {
            nombre: nombresFormateados,
            gasto: totalGastoUnificado,
            empanadasPedidas: totalEmpanadasUnificadas,
            grupoFamiliar: true // Asignar grupoFamiliar a true para la persona unificada
        };

        // Remueve a las personas cuando estaban en solitario y agrega a la persona como persona unificada.
        personas = personas.filter((persona, index) => {
            return !Array.from(botonesSeleccionados).some(boton => parseInt(boton.id.split('_')[1]) === index);
        });
        personas.push(nuevaPersona);

        // Actualiza la interfaz mostrando los botones con los nombres (añadiendo el nombre del grupo familiar):
        mostrar_botones_nombres();

        // Muestra por Consola como quedó el Array "personas".
        console.log('Grupo Familiar conformado exitosamente:', personas);

        // Actualizar el texto del botón y del div para la conformación de nuevos grupos
        document.getElementById('btn_conformar_grupo').textContent = 'Conformar nuevo grupo';
        document.getElementById('texto_conformar_grupo').textContent = 'Seleccione a las personas que conformarían otro nuevo grupo Familiar';

        // Aparece el Botón y el Texto de "Continuar"
        document.getElementById('btn_continue').style.display = 'flex';
        document.getElementById('div_continue').style.display = 'flex';
    }
}


//------------------------------------------------------------------------------------------------------------------
// PAGINA 2

// Se activa cuando el usuario clickea que en Continuar luego de que ya forma el GrupoFamiliar:
function pagina_2() {

    // Hacemos que se muestre el contenido de la PAG_2:
    document.getElementById('pagina_1').style.display = 'none';
    document.getElementById('pagina_2').style.display = 'flex';

    // Mostramos el costo por empanada en el h3
    const costo_por_empanada = monto_final / personas.reduce((total, persona) => total + (persona.empanadasPedidas || 0), 0);
    const costoPorEmpanadaFormateado = costo_por_empanada.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('texto_costo_por_empanadas').textContent = `Cada empanada costó $${costoPorEmpanadaFormateado}.`;

    // Mostramos lo que debe cada persona en el div
    const divCadaUnoDebe = document.getElementById('texto_cada_uno_debe');
    divCadaUnoDebe.innerHTML = ''; // Limpiamos contenido previo

    personas.forEach(persona => {
        const gastoFormateado = persona.gasto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const cantidadEmpanadas = persona.empanadasPedidas || 0;
        const textoEmpanada = cantidadEmpanadas === 1 ? 'empanada' : 'empanadas';
        const verboPidio = persona.grupoFamiliar ? 'pidieron' : 'pidió';
        const verboDebe = persona.grupoFamiliar ? 'deben' : 'debe';
        const texto = document.createElement('p');
        texto.textContent = `${persona.nombre} ${verboPidio} ${cantidadEmpanadas} ${textoEmpanada}, ${verboDebe} $${gastoFormateado}.`;
        divCadaUnoDebe.appendChild(texto);
    });
}

// Función que se activa cuando apretamos el Botón "División de Gastos" (en PAG.2):
function ir_a_pagina_3() {
    // Acá hacemos que la Pag_3 se muestre, y la Pag_2 desaparezca:
    document.getElementById('pagina_2').style.display = 'none';
    document.getElementById('pagina_3').style.display = 'flex';

    crear_div_quien_pago_empanadas(); // Función que crea los botones para indicar quien pagó.
}

//------------------------------------------------------------------------------------------------------------------
// PAGINA 3

// Función para CREAR los botones de quién pagó las empanadas:
function crear_div_quien_pago_empanadas() {
    const divGrupo = document.getElementById('div_quien_pago_empanadas');
    divGrupo.innerHTML = ''; // Limpiar contenido previo
  
    personas.forEach((persona, index) => {
        const button = document.createElement('button');
        button.textContent = persona.nombre;
        button.id = `pago_btn_${index}`;
        button.classList.add('btn_nombre');
        button.onclick = () => confirmar_pago_responsable(persona);
  
        divGrupo.appendChild(button);
    });
}

// Función para confirmar el pago del responsable y asignar el gasto
function confirmar_pago_responsable(personaResponsable) {
    const montoFinalFormateado = monto_final.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const confirmacion = confirm(`${personaResponsable.nombre} fue quien pagó los $${montoFinalFormateado} por el pedido de Empanadas?`);

    if (confirmacion) {
        // Le asigna el gasto a la persona responsable del pago por las Empanadas:
        asignar_gasto(personaResponsable);

        //Los datos se pasan a la proxima pagina asi:
        //Los deudores tienen: gasto=Positivo y deudora=true.
        //El que pago tiene: gasto=Negativo y deudora=false.

        // Guardamos en LocalStorage antes de pasar de página web:
        guardarEnLocalStorage();

        // Te lleva a la pagina de Registro de Gastos:
        window.location.href = './registro_de_gastos.html';
    }
}

// Función para asignarle el Gasto a la Persona que pagó las empanadas:
function asignar_gasto(personaResponsable) {
    const gastoPrevio = personaResponsable.gasto;
    personaResponsable.gasto = gastoPrevio - monto_final;

    // Cambiar estado de deudora y gasto de todas las personas
    personas.forEach(persona => {
        if (persona === personaResponsable) {
            // La persona que pagó es deudora=FALSE y su gasto lo pongo en positivo (y luego a negativo).
            persona.deudora = false;
            persona.gasto = Math.abs(persona.gasto); // Aca creo que esta en positivo.
            //Pero aca la paso a NEGATIVO:
            persona.gasto = -persona.gasto;
        } else {
            // Las demás personas son deudora=TRUE y su gasto es positivo.
            persona.deudora = true;
            persona.gasto = Math.abs(persona.gasto);
        }
    });

    console.log('Personas actualizadas:', personas);
}

// Función para guardar datos en el Local Storage:
function guardarEnLocalStorage() {
    const personas_en_JSON = JSON.stringify(personas);
    localStorage.setItem('personas', personas_en_JSON);
    
    const montoFinal_en_JSON = JSON.stringify(monto_final);
    localStorage.setItem('monto_final', montoFinal_en_JSON);
}
