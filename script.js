async function init() {
    try {
        // Añadimos un timestamp para evitar que el navegador use una versión en caché del JSON
        const response = await fetch('data.json?t=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Actualizar cabecera
        document.getElementById('nombre-institucion').textContent = data.institucion;
        document.getElementById('descripcion-organigrama').textContent = data.descripcion;
        
        // Generar organigrama
        const container = document.getElementById('organigrama-container');
        container.innerHTML = ''; // Limpiar contenedor
        
        const treeDiv = document.createElement('div');
        treeDiv.className = 'tree';
        
        const ul = document.createElement('ul');
        ul.appendChild(createNode(data.organigrama));
        treeDiv.appendChild(ul);
        container.appendChild(treeDiv);
        
    } catch (error) {
        console.error('Error al cargar el organigrama:', error);
        document.getElementById('nombre-institucion').textContent = "Error al cargar datos";
        document.getElementById('descripcion-organigrama').textContent = "Asegúrese de que el archivo data.json existe y se está ejecutando en un servidor web.";
    }
}

function createNode(nodeData) {
    const li = document.createElement('li');
    const div = document.createElement('div');
    div.className = 'node';
    div.innerHTML = `<span class="nombre">${nodeData.nombre}</span>
                     <span class="puesto">${nodeData.puesto}</span>`;
    li.appendChild(div);
    
    if (nodeData.subordinados && nodeData.subordinados.length > 0) {
        const ul = document.createElement('ul');
        nodeData.subordinados.forEach(sub => {
            ul.appendChild(createNode(sub));
        });
        li.appendChild(ul);
    }
    return li;
}

document.addEventListener('DOMContentLoaded', init);
