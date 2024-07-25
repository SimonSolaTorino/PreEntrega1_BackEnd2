document.querySelectorAll('.cart-item-remove').forEach(button => {
    button.addEventListener('click', async (e) => {
        const productId = e.target.getAttribute('data-id')
        const cartId = document.querySelector('#cart-id').getAttribute('data-cart-id')
        try {
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'DELETE',
            })
            const data = await response.json()
            if (data.msg === 'Producto eliminado del carrito') {
                // Eliminar el producto del DOM
                const cartItem = e.target.closest('.cart-item')
                cartItem.remove()
                
                // Actualizar el precio total del carrito si está disponible en la respuesta
                if (data.total_price !== undefined) {
                    document.querySelector('.cart-total h4').textContent = `Precio Total del Carrito: $${data.total_price}`
                }
            } else {
                console.error('Error al eliminar el producto:', data.error)
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error)
        }
    })
})