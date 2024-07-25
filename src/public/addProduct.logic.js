document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-add-product')
    const titleInput = document.getElementById('title')
    const descriptionInput = document.getElementById('description')
    const codeInput = document.getElementById('code')
    const priceInput = document.getElementById('price')
    const stockInput = document.getElementById('stock')
    const categoryInput = document.getElementById('category')
    const thumbnailInput = document.getElementById('thumbnail')

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const data_del_DOM = {
            title: titleInput.value,
            description: descriptionInput.value,
            code: codeInput.value,
            price: parseFloat(priceInput.value),
            stock: parseInt(stockInput.value, 10),
            category: categoryInput.value,
            thumbnail: thumbnailInput.value,
            status: true
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data_del_DOM),
            })

            if(response.ok){
                Swal.fire({
                    icon: 'success',
                    title: 'Producto agregado correctamente!',
                    text: `El producto ha sido agregado a la base de datos con éxito.`
                }).then(() => {
                    // para vaciar el formulario post sweetalert
                    form.reset()
                })
            } else {
                const errorData = await response.json()
                console.log(`Error: ${errorData.msg}`)
            }
        } catch (error) {
            console.error('Error:', error)
            console.log('error interno en addProduct.logic.js')
        }
    })
})
