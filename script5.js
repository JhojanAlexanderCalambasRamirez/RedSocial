document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar que se envíe el formulario de forma predeterminada
    
    // Obtener datos del formulario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Hacer solicitud POST para iniciar sesión
    fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario: username, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }
        return response.json();
    })
    .then(data => {
        // Obtener el ID del usuario que ha iniciado sesión
        const userId = data.id;

        // Hacer solicitud GET para obtener información del usuario
        return fetch(`http://localhost:3001/auth/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener datos del usuario');
        }
        return response.json();
    })
    .then(currentUser => {
        if (!currentUser) {
            throw new Error('Usuario no encontrado');
        }

        // Guardar información del usuario actual en el almacenamiento local
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Redirigir a la página correspondiente según el rol
        if (currentUser.rol === 'usuario') {
            window.location.href = 'usuario.html';
        } else if (currentUser.rol === 'administrador') {
            window.location.href = 'administrador.html';
        } else {
            throw new Error('Rol desconocido');
        }
    })
    .catch(error => {
        // Mostrar mensaje de error
        document.getElementById("message").textContent = error.message;
    });
});
