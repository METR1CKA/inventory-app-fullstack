function openEditModal(data) {
    Object.keys(data).forEach((key) => {
        const field = data[key]
        const inputElement = document.getElementById(field.element)
        if (inputElement) {
            inputElement.value = field.value
        }
    })
}
