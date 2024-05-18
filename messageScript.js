document.addEventListener("DOMContentLoaded", function() {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
        document.getElementById("userInfo").textContent = `Bienvenido, ${userData.nombre_completo}`;
    } else {
        document.getElementById("userInfo").textContent = "Información del usuario no disponible.";
    }
});

document.getElementById("messageForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const contenido = document.getElementById("contenido").value;

    try {
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        const usuarioId = userData ? userData.id : null;
        
        if (!usuarioId) {
            throw new Error('Error al obtener el ID del usuario');
        }

        const response = await fetch('http://localhost:3002/message/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario_id: usuarioId, contenido: contenido })
        });
        
        if (!response.ok) {
            throw new Error('Error al enviar el mensaje');
        }
        
        const messageData = await response.json();
        document.getElementById("message").textContent = messageData.mensaje;
    } catch (error) {
        document.getElementById("message").textContent = error.message;
    }
});

