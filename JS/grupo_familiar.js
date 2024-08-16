//Función que se activa apenas se abre la ventana, hace que se active la función que llama a los datos del Local Storage:
document.addEventListener('DOMContentLoaded', (event) => {
    cargarDesdeLocalStorage();

    mostrar_botones_nombres();
});

// Función para cargar datos desde el Local Storage:
function cargarDesdeLocalStorage() {
    // Obtener y parsear el array "personas" desde localStorage
    const personas_en_JSON = localStorage.getItem('personas');
    personas = JSON.parse(personas_en_JSON);
    console.log('Personas guardadas en localStorage:', personas);

    // Obtener el valor de "monto_final" desde localStorage
    const montoFinal_en_JSON = localStorage.getItem('monto_final');
    monto_final = JSON.parse(montoFinal_en_JSON);
    console.log(`El monto final guardado es de ${monto_final}`);
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
      button.style.boxShadow = '0 0 20px white';
    } else {
      button.style.boxShadow = 'none';
    }
  }
  
// Función para confirmar la unificación de datos
function confirmar_grupo() {
    const botonesSeleccionados = document.querySelectorAll('.btn_clickeado');

    if (botonesSeleccionados.length < 2) {
        alert('Debe al menos marcar 2 personas para unificar los gastos.');
        return; // Detener la ejecución si hay menos de dos personas seleccionadas
    }

    let nombresUnificados = [];
    let pedidosUnificados = {};
    let totalEmpanadas = 0;

    botonesSeleccionados.forEach(boton => {
        const index = parseInt(boton.id.split('_')[1]);
        const persona = personas[index];

        nombresUnificados.push(persona.nombre);
        totalEmpanadas += persona.empanadasPedidas;

        // Unificar pedidos
        for (let [sabor, cantidad] of Object.entries(persona.pedidos)) {
            if (pedidosUnificados[sabor]) {
                pedidosUnificados[sabor] += cantidad;
            } else {
                pedidosUnificados[sabor] = cantidad;
            }
        }
    });

    // Crear nuevo objeto persona unificada
    const nuevaPersona = {
        nombre: nombresUnificados.join(' + '),
        pedidos: pedidosUnificados,
        empanadasPedidas: totalEmpanadas
    };

    // Remover personas unificadas del array original y agregar la nueva persona unificada
    personas = personas.filter((persona, index) => {
        return !Array.from(botonesSeleccionados).some(boton => parseInt(boton.id.split('_')[1]) === index);
    });
    personas.push(nuevaPersona);

    // Actualizar la vista con el nuevo grupo
    mostrar_botones_nombres();

    // Mostrar el resultado en consola
    console.log('Array actualizado de personas:', personas);

    // Aparece el Botón y el Texto de "Continuar"
    document.getElementById('btn_continue').style.display = 'flex';
    document.getElementById('div_continue').style.display = 'flex';

}