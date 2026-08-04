function createModal(content) {
    modalbg.style.display = "grid";
    modal.innerHTML = `
        <div>
            ${content}
        </div>
    `;
    
    window.onclick = function(e) {
        if (e.target === modalbg) {
            closeModal();
        }
    }
    lucide.createIcons();
}

function closeModal() {
    modalbg.style.display = "none";
    modal.innerHTML = "";
}

async function saveFile(textContent, name) {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `${name.replaceAll(" ", "_")}.json`,
      types: [{
        description: 'JSON Files',
        accept: {
          'application/json': ['.json'],
        },
      }],
    });

    const writable = await handle.createWritable();

    await writable.write(textContent);
    await writable.close();
    createModal(`
        <h3>File saved successfully!</h3>
        <p>If you wish, you can request that this file should be added to the <code>data/</code> folder on the <a href="https://github.com/Temi-Tade/Skaylar">GitHub repository</a> for public use, once added it will become part if the "Datasets" on Skaylar</p>
    `);
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error saving file:', err);
    }
  }
}

export { createModal, closeModal, saveFile }