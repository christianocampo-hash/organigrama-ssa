# Instrucciones para el Organigrama Institucional

Para que el archivo `index.html` pueda leer correctamente el archivo `data.json`, los navegadores modernos requieren por seguridad que los archivos se sirvan a través de un **servidor web** (no basta con hacer doble clic en el archivo desde tu carpeta).

## Cómo ejecutarlo localmente:

### Opción A: Usando Visual Studio Code (Recomendado)
1. Abre la carpeta del proyecto en VS Code.
2. Instala la extensión **"Live Server"**.
3. Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

### Opción B: Usando Python (Si lo tienes instalado)
1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta: `python -m http.server 8000`
3. Abre en tu navegador: `http://localhost:8000`

### Opción C: Subirlo a un Hosting
Si lo subes a un servidor real (como GitHub Pages, Netlify o el servidor de tu institución), funcionará automáticamente sin problemas.

---
**Nota sobre el archivo JSON:**
Cada vez que edites `data.json`, asegúrate de que el formato sea correcto (comas, llaves, etc.). Si el formato es inválido, el organigrama no se mostrará.
