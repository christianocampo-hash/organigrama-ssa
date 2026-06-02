async function init() {
    try {
        console.log('Iniciando carga de datos...');
        const response = await fetch('./data.json');
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        document.getElementById('nombre-institucion').textContent = data.institucion;
        document.getElementById('descripcion-organigrama').textContent = data.descripcion;
        
        const container = document.getElementById('organigrama-container');
        const treeDiv = document.createElement('div');
        treeDiv.className = 'tree';
        
        const ul = document.createElement('ul');
        ul.appendChild(createNode(data.organigrama));
        treeDiv.appendChild(ul);
        container.appendChild(treeDiv);
        
    } catch (error) {
        console.error('Error:', error);
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
