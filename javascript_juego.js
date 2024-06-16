// Lista de Palabras
var paises = [
  //A
  'Abogado', 'Aceite', 'África', 'Agente', 'Agua', 'Águila', ' Aguja', 'Agujero', 'Aire', 'Alemania', 'Algodón', 'Alianza',
  'Ambulancia', 'América', 'Ángel', 'Anillo', 'Antártida', 'Antorcha', 'Araña', 'Archivo', 'Arco', 'Argentina', 'Artículo', 
  'As', 'Atlántida', 'Azteca', 
  //B
  'Baile', 'Bala', 'Ballena', 'Banana', 'Banco', 'Banda', 'Baño', 'Barco', 'Barra', 'Batería', 'Berlín', 'Bermudas', 'Bicho',
  'Blanco', 'Bloque', 'Boca', 'Bola', 'Bolsa', 'Bomba', 'Bosque', 'Bota', 'Botella', 'Botón', 'Brazo', 'Bruja', 
  //C
  'Caballero', 'Caballo', 'Cabreza', 'Cabina', 'Cabo', 'Cactus', 'Cadena', 'Caja', 'Cama', 'Cámara', 'Cambio', 'Campana',
  'Campo', 'Canal', 'Canguro', 'Canto', 'Caña', 'Capa', 'Capital', 'Caqui', 'Cara', 'Caravana', 'Carga', 'Carrera', 'Carro',
  'Carta', 'Casco', 'Casino', 'Caza', 'Cementerio', 'Centauro', 'Centro', 'Cervantes', 'Checo', 'Chocolate', 'Choque', 'Chuleta',
  'Científico', 'Cinta', 'Cinturón', 'Círculo', 'Clase', 'Coche', 'Cocinero', 'Coco', 'Código', 'Cola', 'Cólera','Colombia', 'Columna', 
  'Cometa', 'Compás', 'Concierto', 'Conejo', 'Contrabandista', 'Copa', 'Corazón', 'Corneta', 'Corona', 'Corredor', 'Corriente',
  'Corte', 'Cresta', 'Cromo', 'Cruz', 'Cuadro', 'Cuarto', 'Cubierta', 'Cubo', 'Cuchillo', 'Cuello', 'Cuerda', 'Cuerno', 'Cura',
  //D
  'Dama', 'Delta', 'Destino', 'Día', 'Diamante', 'Diana', 'Diario', 'Diente', 'Dinosaurio', 'Disco', 'Don', 'Dragón','Duende',
  //E
  'Egipto', 'Embajada', 'Emperador', 'Enano', 'Enfermedad', 'Enfermera', 'Enlace', 'Escorpión', 'Espacio', 'Espía', 'Estación', 
  'Estadio', 'Estado', 'Estrella', 'Estudio', 'Etiqueta', 'Europa', 'Extraterrestre', 
  //F
  'Falda', 'Fantasma', 'Faro', 'Ficha', 'Fiesta', 'Figura', 'Flauta', 'Flecha', 'Foso', 'Francia', 'Frente', 'Fuego', 'Fuente', 
  'Fuerza', 'Furgoneta',
  //G
  'Gancho', 'Gato', 'Genio', 'Gigante', 'Golfo', 'Golondrina', 'Golpe', 'Goma', 'Góndola', 'Gota', 'Grado', 'Granada', 'Grano',
  'Grecia', 'Grifo', 'Guante', 'Guardia', 'Guerra', 'Gusano',
  //H
  'Helado', 'Helicóptero', 'Hielo', 'Hierba', 'Hoja', 'Holywood', 'Horca', 'Hospital', 'Hotel',
  //I
  'Iglesia', 'Imán', 'India', 'Índice', 'Inglaterra', 'Italia', 'Jarra', 'Judía', 'Juicio',
  //K
  'Kiwi',
  //L
  'Ladrón', 'Lago Ness', 'Láser', 'Látigo', 'Lengua', 'León', 'Libra', 'Lima', 'Limusina', 'Línea', 'Lista', 'Llama', 'Llave',
  'Lomo', 'Londres', 'Luna', 'Luz',
  //M
  'Maestro', 'Magia', 'Malta', 'Mancha', 'Mando', 'Manga', 'Mango', 'Mano', 'Manzana', 'Mañana', 'Marca', 'Mancha', 'Marfil',
  'Masa', 'Máscara', 'Mazo', 'Médico', 'Mercurio', 'Mesa', 'Metro', 'México', 'Micro', 'Miel', 'Millonario', 'Mina', 'Misil',
  'Modelo', 'Módulo', 'Monitor', 'Mono', 'Mortero','Moscú', 'Motor', 'Muelle', 'Muerte', 'Muñeca', 'Muurcielágo', 'Muro',
  //N
  'Naranja', 'Nave', 'Nieve', 'Nilo', 'Ninja', 'Noche', 'Nudo', 'Nueva York', 'Negro',
  //O
  'Obra', 'Ojo', 'Ola', 'Olimpo', 'Ópera', 'Orden', 'Órgano', 'Ornitorrinco', 'Oro', 'Oso',
  //P
  'Playstation', 'Pala', 'Palma', 'Pantalla', 'Papel', 'Paracaídas', 'Pase', 'Paso', 'Pasta', 'Pastel', 'Pavo', 'Pekín', 'Película', 'Pelotón', 'Pendiente',
  'Perro', 'Pez', 'Pico', 'Pie', 'Pieza', 'Pila', 'Piloto', 'Pingüino', 'Pinta', 'Piña', 'Pirámide', 'Pirata', 'Pista', 'Pistola', 'Placa', 'Plano', 'Planta',
  'Playa', 'Plomo', 'Pluma', 'Policía', 'Polo', 'Portada', 'Portero', 'Potro', 'Prensa', 'Prima', 'Princesa', 'Puente', 'Puerto', 'Pulpo', 'Pulso', 'Punta',
  //Q
  'Quinela',
  //R
  'Radio', 'Rascacielo', 'Ratón', 'Rayo', 'Red', 'Regla', 'Reina', 'Reserva', 'Revolución', 'Rey', 'Robot', 'Rojo', 'Roma', 'Ronda', 'Rosa',' Ruleta', 
  //S
  'Sable', 'Sáhara', 'Salsa','Satélite', 'Saturno', 'Señal', 'Serie', 'Serpiente', 'Sierra', 'Silla', 'Sirena', 'Sobre', 'Soldado', 'Submarinista', 'Suerte',
  'Superhéroe',
  //T
  'Tabla', 'Taco', 'Tacto', 'Talón', 'Tanque', 'Tapa', 'Tarde', 'Teclado', 'Teatro', 'Telescopio', 'Testigo', 'Tiempo', 'Tienda', 'Tierra', 'Tokio', 'Topo',
  'Torre', 'Trama', 'Tronco', 'Tubería', 'Tubo',
  //U
  'Unicornio',
  //V
  'Vacío', 'Vampiro', 'Vela', 'Veneno', 'Venus', 'Vestido', 'Vida', 'Vidrio', 'Viento', 
  //W

  //X

  //Y
  'Yema',
  //Z
  'Zanahoria', 'Zapato'




];

// Asignar países aleatorios a los divs
asignarPaisesAleatorios();

// Función para asignar palabras aleatorias a los divs
function asignarPaisesAleatorios() {
  var paisesDisponibles = paises.slice(); // Copia de la lista de países original
  
  // Recorrer cada PALABRA y asignar una palabra al AZAR
  for (var i = 1; i <= 399; i++) {
    var divPais = document.getElementById('pais' + i);
    var paisAleatorio = obtenerItemAleatorio(paisesDisponibles);
    divPais.textContent = paisAleatorio;
  }
}

// Función para obtener un ítem aleatorio y único de un array
function obtenerItemAleatorio(array) {
  var indice = Math.floor(Math.random() * array.length);
  return array.splice(indice, 1)[0];
}

// Función para cambiar el color del div (país)
function cambiarColor(idDiv) {
  var divPais = document.getElementById(idDiv);
  var colores = ['rojo', 'azul', 'amarillo', 'gris']; // Lista de colores
  
  // Obtener el color actual del div (país)
  var colorActual = divPais.classList.item(1); // La clase que empieza en el índice 1 es el color actual
  
  // Eliminar todas las clases de color antes de aplicar la nueva
  divPais.classList.remove('rojo', 'azul', 'amarillo', 'gris');
  
  // Obtener el índice del próximo color en la lista
  var indice = colores.indexOf(colorActual) + 1;
  if (indice >= colores.length) {
    indice = 0; // Volver al primer color si ya estamos en el último
  }
  
  // Aplicar el próximo color al div (país)
  divPais.classList.add(colores[indice]);
}