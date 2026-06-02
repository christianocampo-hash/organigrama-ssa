document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderHeader(data);
            renderOrganigrama(data.organigrama);
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
});

function renderHeader(data) {
    document.getElementById('nombre-institucion').textContent = data.institucion;
    document.getElementById('descripcion-organigrama').textContent = data.descripcion;
}

function renderOrganigrama(rootNode) {
    const container = document.getElementById('organigrama-container');
    const treeDiv = document.createElement('div');
    treeDiv.className = 'tree';
    
    const ul = document.createElement('ul');
    ul.appendChild(createNodeElement(rootNode));
    treeDiv.appendChild(ul);
    container.appendChild(treeDiv);
}

function createNodeElement(nodeData) {
    const li = document.createElement('li');
    
    const divNode = document.createElement('div');
    divNode.className = 'node';
    
    const nombre = document.createElement('span');
    nombre.className = 'nombre';
    nombre.textContent = nodeData.nombre;
    
    const puesto = document.createElement('span');
    puesto.className = 'puesto';
    puesto.textContent = nodeData.puesto;
    
    divNode.appendChild(nombre);
    divNode.appendChild(puesto);
    li.appendChild(divNode);
    
    if (nodeData.subordinados && nodeData.subordinados.length > 0) {
        const ul = document.createElement('ul');
        nodeData.subordinados.forEach(sub => {
            ul.appendChild(createNodeElement(sub));
        });
        li.appendChild(ul);
    }
    
    return li;
}
