//funcion que saca el precio total del carrito.
export function totalCarrito(array_productos){
    let total = 0
    for (const producto of array_productos){
        total += (producto.quantity * producto.product.price)
    }
    return total
}