const registerForm = document.getElementById('registerForm')

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const first_name = document.getElementById('first_name').value
    const last_name = document.getElementById('last_name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const age = document.getElementById('age').value

    const userData = {
        first_name,
        last_name,
        email,
        password,
        age
    }

    try{
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })

        const data = await response.json()

        if(response.ok){
            // aca creo el carrito.
            const newCartResponse = await fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const newCart = await newCartResponse.json()

            // aca se lo asigno al usuario
            const userResponse = await fetch(`/api/users/${data._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart: newCart._id })
            })

            if(userResponse.ok){
                Swal.fire({
                    title: 'Usuario registrado y carrito creado!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/';
                })
            }else{
                throw new Error('Error al asociar carrito al usuario')
            }
        }else{
            throw new Error(data.message || 'Error al registrar usuario')
        }
    }catch(error){
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
})