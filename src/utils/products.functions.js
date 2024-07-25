//funcion que valida si los campos pasados en el body son validos para el product model.
export function validarCampos(campos){
    const campos_validos = ['title', 'description', 'category', 'stock', 'price', 'thumbnail', 'code', 'status']
    for (let campo of campos) {
        if (!campos_validos.includes(campo)) {
            console.log(`Error: el campo ${campo} no es valido.`)
            return false
        }
    }
    return true
}