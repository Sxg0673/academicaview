const form = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${CONFIG.API_USUARIOS}/api/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            mensaje.textContent = "Inicio de sesión exitoso";
            mensaje.className = "mensaje exito";

            sessionStorage.setItem('usuario', JSON.stringify(data.usuario));

            setTimeout(() => {
                if (data.usuario.rol === 'profesor') {
                    history.replaceState(null, '', 'dashboard-profesor.html');
                    window.location.replace('dashboard-profesor.html');
                } else {
                    history.replaceState(null, '', 'dashboard-estudiante.html');
                    window.location.replace('dashboard-estudiante.html');
                }
            }, 800);

        } else {
            mensaje.textContent = data.error || "Error en el login";
            mensaje.className = "mensaje error";
        }

    } catch (error) {
        mensaje.textContent = "Error de conexión con el servidor";
        mensaje.className = "mensaje error";
        console.error(error);
    }
});
