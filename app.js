/* =========================================================
   1. CARGA DE DATOS
   Edita organigrama.json para cambiar nombres, cargos y fotos.
   ========================================================= */
const chart = document.querySelector('#org-chart');
const dialog = document.querySelector('#person-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogRole = document.querySelector('#dialog-role');
const dialogName = document.querySelector('#dialog-name');
const dialogPhoto = document.querySelector('#dialog-photo');
const dialogNote = document.querySelector('#dialog-note');
const placeholder = 'https://placehold.co/600x600/e4f2f4/17324d?text=Foto+pendiente';

const dataSource = window.ORGANIGRAMA_DATA
  ? Promise.resolve(window.ORGANIGRAMA_DATA)
  : fetch('organigrama.json').then(response => {
      if (!response.ok) throw new Error('No se pudo cargar organigrama.json');
      return response.json();
    });

dataSource
  .then(data => renderOrgChart(data))
  .catch(error => {
    chart.innerHTML = `<p class="load-error"><strong>No se pudo cargar la información.</strong><br>Abre esta página desde un servidor local para permitir la lectura del archivo JSON.</p>`;
    console.error(error);
  });

/* =========================================================
   2. CONSTRUCCIÓN DE NODOS
   ========================================================= */
function createNode(id, people, variant = '') {
  const person = people[id];
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `org-node ${variant ? `is-${variant}` : ''}`;
  button.dataset.personId = id;
  button.setAttribute('aria-label', `Ver responsable de ${person.role}`);
  button.innerHTML = `<span class="node-title">${escapeHtml(person.role)}</span><span class="node-hint">Ver responsable</span>`;
  return button;
}

function renderOrgChart(data) {
  const tree = document.createElement('div');
  tree.className = 'org-tree';
  const people = data.people;

  const rootLevel = document.createElement('div');
  rootLevel.className = 'tree-level';
  rootLevel.append(createNode('director', people, 'root'));
  tree.append(rootLevel);

  const advisorLevel = document.createElement('div');
  advisorLevel.className = 'tree-level';
  data.levels.find(level => level.type === 'advisors').nodes.forEach(id => advisorLevel.append(createNode(id, people, 'advisor')));
  tree.append(advisorLevel);

  const supportLevel = document.createElement('div');
  supportLevel.className = 'tree-level';
  data.levels.find(level => level.type === 'support').nodes.forEach(id => supportLevel.append(createNode(id, people)));
  tree.append(supportLevel);

  const subdirectionLevel = document.createElement('div');
  subdirectionLevel.className = 'tree-level';
  data.levels.find(level => level.type === 'subdirections').branches.forEach(branch => {
    const branchWrap = document.createElement('div');
    branchWrap.className = 'tree-branch';
    branchWrap.append(createNode(branch.head, people, 'subdirector'));
    if (branch.children.length) {
      const children = document.createElement('div');
      children.className = 'branch-children';
      branch.children.forEach(id => children.append(createNode(id, people)));
      branchWrap.append(children);
    }
    subdirectionLevel.append(branchWrap);
  });
  tree.append(subdirectionLevel);
  chart.replaceChildren(tree);
  chart.addEventListener('click', event => {
    const node = event.target.closest('[data-person-id]');
    if (node) openPerson(data.people[node.dataset.personId], data.meta);
  });
}

/* =========================================================
   3. FICHA DE RESPONSABLE
   ========================================================= */
function openPerson(person, meta) {
  dialogTitle.textContent = person.name || 'Nombre por completar';
  dialogRole.textContent = person.role;
  dialogName.textContent = person.name || 'Nombre por completar';
  dialogNote.textContent = person.note || 'Puedes editar este registro en organigrama.json.';
  dialogPhoto.src = person.photo || meta.photoPlaceholder || placeholder;
  dialogPhoto.alt = `Fotografía de ${person.name || 'la persona responsable'}`;
  dialogPhoto.onerror = () => { dialogPhoto.src = meta.photoPlaceholder || placeholder; };
  dialog.showModal();
}

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

/* =========================================================
   4. CONTROLES DE TAMAÑO DE TEXTO
   ========================================================= */
const sizes = { decrease: 0.9, reset: 1, increase: 1.15 };
let currentScale = Number(localStorage.getItem('org-font-scale')) || 1;
function applyFontScale() {
  document.documentElement.style.setProperty('--base-size', `${16 * currentScale}px`);
  localStorage.setItem('org-font-scale', currentScale);
}
document.querySelectorAll('[data-font]').forEach(button => button.addEventListener('click', () => {
  const action = button.dataset.font;
  if (action === 'reset') currentScale = 1;
  if (action === 'increase') currentScale = Math.min(1.5, +(currentScale + .1).toFixed(2));
  if (action === 'decrease') currentScale = Math.max(.85, +(currentScale - .1).toFixed(2));
  applyFontScale();
}));
applyFontScale();

/* =========================================================
   5. UTILIDADES
   ========================================================= */
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);
}
