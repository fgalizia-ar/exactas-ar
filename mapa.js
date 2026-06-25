// mapa.js - Matriz de coordenadas locales 3D (X, Y, Z)
const MAPA_CAMPUS = {
    // Coordenadas en metros relativas al inicio (0,0,0) -> ENTRADA_47
    // X: Izquierda(-) / Derecha(+)
    // Y: ALTURA (Planta Baja = 0, Primer Piso = 5.3 metros)
    // Z: Adelante(-) / Atrás(+)
    nodos: {
        // --- PLANTA BAJA (Y = 0) ---
        "ENTRADA_47":       { x: 0,  y: 0, z: 0 },
        "PASILLO_1":        { x: 0,  y: 0, z: -8 },
        "ESQUINA_IZQ":      { x: 0,  y: 0, z: -8 }, // Ajustado sutilmente según tu mapeo
        "AULA_101":         { x: -6, y: 0, z: -14 },
        "AULA_102":         { x: 10, y: 0, z: -8 },
        "BASE_ESCALERA":    { x: 0,  y: 0, z: -12 }, 
        "ENTRADA_48":       { x: 0,  y: 0, z: -50 },

        // --- PRIMER PISO (Y = 5.3) ---
        "ENTRADA_PUENTE":   { x: 0, y: 5.3, z: 0 },
        "P1_1":             { x: 0, y: 5.3, z: -2.5 },
        "BANYO_S_GENERO":   { x: 2, y: 5.3, z: -2.5 },
        
        "P1_2":             { x: 0, y: 5.3, z: -5.5 },
        "PASTEUR":          { x: 2, y: 5.3, z: -5.5 },
        "INORGANICA":       { x: -2, y: 5.3, z: -5.5 },
        
        "P1_3":             { x: 0, y: 5.3, z: -16 },
        "ESCALERA_1_P1":    { x: -2, y: 5.3, z: -16 }, // El desembarco real de la escalera de PB
        
        "P1_4":             { x: 0, y: 5.3, z: -28 },
        "VUCETICH":         { x: 2, y: 5.3, z: -28 },
        
        "P1_5":             { x: 0, y: 5.3, z: -30 },
        "INTRODUCCION":     { x: -2, y: 5.3, z: -30 },
        
        "P1_6":             { x: 0, y: 5.3, z: -32 },
        "LAB_CHICO":        { x: 2, y: 5.3, z: -32 },
        
        "P1_7":             { x: 0, y: 5.3, z: -44 },
        "ESCALERA_2_P1":    { x: -2, y: 5.3, z: -44 },
        
        "P1_8":             { x: 0, y: 5.3, z: -46 },
        "ASCENSOR_P1":      { x: 2, y: 5.3, z: -46 },
        
        "P1_9":             { x: 0, y: 5.3, z: -50 },
        "ORGANICA_SUP":     { x: 2, y: 5.3, z: -50 },
        "ANALITICA_1":      { x: -2, y: 5.3, z: -50 },
        "SALIDA_EMERGENCIA_P1": { x: 0, y: 5.3, z: -55 }  
    },

    // Conexiones físicas transitables (Estructura de Espina Dorsal Corregida)
    conexiones: [
        // Planta Baja
        { desde: "ENTRADA_47",    hasta: "PASILLO_1" },
        { desde: "PASILLO_1",     hasta: "ESQUINA_IZQ" },
        { desde: "ESQUINA_IZQ",   hasta: "AULA_101" },
        { desde: "PASILLO_1",     hasta: "AULA_102" },
        { desde: "PASILLO_1",     hasta: "BASE_ESCALERA" },
        { desde: "BASE_ESCALERA", hasta: "ENTRADA_48" },

        // Conexión vertical (Une PB con Primer Piso en la primera escalera)
        { desde: "BASE_ESCALERA", hasta: "ESCALERA_1_P1" },

        // Primer Piso - Espina Dorsal y Ramificaciones
        { desde: "ENTRADA_PUENTE", hasta: "P1_1" },
        { desde: "P1_1",           hasta: "P1_2" },
        { desde: "P1_1",           hasta: "BANYO_S_GENERO" },
        
        { desde: "P1_2",           hasta: "P1_3" },
        { desde: "P1_2",           hasta: "PASTEUR" },
        { desde: "P1_2",           hasta: "INORGANICA" },
        
        { desde: "P1_3",           hasta: "P1_4" },
        { desde: "P1_3",           hasta: "ESCALERA_1_P1" }, // Conecta pasillo alto a la escalera
        
        { desde: "P1_4",           hasta: "P1_5" },
        { desde: "P1_4",           hasta: "VUCETICH" },
        
        { desde: "P1_5",           hasta: "P1_6" },
        { desde: "P1_5",           hasta: "INTRODUCCION" }, // Corregido acento
        
        { desde: "P1_6",           hasta: "P1_7" },
        { desde: "P1_6",           hasta: "LAB_CHICO" },
        
        { desde: "P1_7",           hasta: "P1_8" },
        { desde: "P1_7",           hasta: "ESCALERA_2_P1" },
        
        { desde: "P1_8",           hasta: "P1_9" },
        { desde: "P1_8",           hasta: "ASCENSOR_P1" },
        
        { desde: "P1_9",           hasta: "SALIDA_EMERGENCIA_P1" },
        { desde: "P1_9",           hasta: "ANALITICA_1" },
        { desde: "P1_9",           hasta: "ORGANICA_SUP" }
    ]
};

// Función geométrica para calcular la distancia euclidiana 3D
function calcularDistancia3D(nodoA, nodoB) {
    const dx = nodoB.x - nodoA.x;
    const dy = nodoB.y - nodoA.y; 
    const dz = nodoB.z - nodoA.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ALGORITMO DE DIJKSTRA 3D
function encontrarCaminoOptimo(origen, destino) {
    const nodos = MAPA_CAMPUS.nodos;
    const conexiones = MAPA_CAMPUS.conexiones;
    let distancias = {}; let previos = {}; let noVisitados = new Set();
    for (let nodo in nodos) { distancias[nodo] = Infinity; previos[nodo] = null; noVisitados.add(nodo); }
    distancias[origen] = 0;
    while (noVisitados.size > 0) {
        let nodoActual = null;
        for (let nodo of noVisitados) { if (nodoActual === null || distancias[nodo] < distancias[nodoActual]) nodoActual = nodo; }
        if (distancias[nodoActual] === Infinity || nodoActual === destino) break;
        noVisitados.delete(nodoActual);
        let vecinos = [];
        for (let conexion of conexiones) {
            if (conexion.desde === nodoActual && noVisitados.has(conexion.hasta)) vecinos.push(conexion.hasta);
            else if (conexion.hasta === nodoActual && noVisitados.has(conexion.desde)) vecinos.push(conexion.desde);
        }
        for (let vecino of vecinos) {
            let distanciaAlternativa = distancias[nodoActual] + calcularDistancia3D(nodos[nodoActual], nodos[vecino]);
            if (distanciaAlternativa < distancias[vecino]) { distancias[vecino] = distanciaAlternativa; previos[vecino] = nodoActual; }
        }
    }
    let camino = []; let paso = destino;
    if (previos[paso] || paso === origen) { while (paso !== null) { camino.unshift(paso); paso = previos[paso]; } }
    return { ruta: camino, distanciaTotal: distancias[destino] };
}