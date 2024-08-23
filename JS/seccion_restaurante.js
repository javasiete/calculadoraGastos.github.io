// Función que se activa apenas se abre la ventana, hace que se active la función que llama a los datos del Local Storage:
document.addEventListener('DOMContentLoaded', (event) => {
    cargarDesdeLocalStorage();
    crear_inputs_para_items();
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
// PAGINA 1

