document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-login');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al iniciar sesión');
            }

            Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Redirigiendo...',
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                window.location.href = '/';
            });

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error en la comunicación con el servidor.',
            });
        }
    });
});
