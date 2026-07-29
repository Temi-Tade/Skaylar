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