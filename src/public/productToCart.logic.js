document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.boton-agregar-carrito');

    const cartDataElement = document.getElementById('cart-data');
    const cartId = cartDataElement ? cartDataElement.getAttribute('data-cart-id') : null;
    console.log("Cart ID en logic:", cartId);

    if (!cartId) {
        console.error('No se encontró cartId. Asegúrate de que el cartId esté correctamente inyectado en el HTML.');
        return;
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            // Verifica el `e.target` para asegurar que es el botón correcto
            const productId = e.currentTarget.getAttribute('data-product-id');
            console.log("Product ID:", productId);

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: 1 })
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto agregado al carrito!',
                        text: `El producto ha sido agregado al carrito con éxito.`
                    }).then(() => {
                        // Actualizar la interfaz en lugar de recargar la página
                        updateCartUI(data);
                    });

                    console.log(data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Error al agregar el producto: ${data.error}`
                    });
                    console.error('Error al agregar el producto:', data.error);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error al agregar el producto: ${error.message}`
                });
                console.error('Error al agregar el producto:', error);
            }
        });
    });
});
