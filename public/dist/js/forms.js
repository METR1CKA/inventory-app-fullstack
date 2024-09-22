const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
})

function showOverlay(modalId) {
    const modal = document.getElementById(modalId)
    const overlay = document.createElement('div')
    overlay.className = 'overlay'
    overlay.innerHTML = '<i class="fas fa-2x fa-sync fa-spin"></i>'
    modal.querySelector('.modal-content').appendChild(overlay)
}

function hideOverlay(modalId) {
    const modal = document.getElementById(modalId)
    const overlay = modal.querySelector('.overlay')
    if (overlay) {
        overlay.remove()
    }
}

function openEditModal(data) {
    const { modal_id, ..._data } = data

    for (let key in _data) {
        let field = _data[key]
        let inputElement = document.getElementById(field.element)
        if (inputElement) {
            inputElement.value = field.value
        }
    }

    showOverlay(modal_id)
    setTimeout(() => {
        hideOverlay(modal_id)
    }, 950)
}