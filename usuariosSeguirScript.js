document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('followAllButton').addEventListener('click', followAllUsers);

    // Resto del código para obtener la lista de usuarios y mostrarlos en userList
});

async function followAllUsers() {
    const users = await getUsers();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Usuario no autenticado');
        return;
    }

    const usuarioS = currentUser.id;
    
    for (const user of users) {
        const usuarioP = user.id;
        try {
            await followUser(usuarioP, usuarioS);
            const followingList = document.getElementById('followingList');
            const listItem = document.createElement('li');
            listItem.textContent = `${user.nombre_completo} (${user.usuario})`;
            followingList.appendChild(listItem);
        } catch (error) {
            console.error('Error al seguir al usuario:', error);
        }
    }

    alert('Todos los usuarios seguidos exitosamente');
}

// Funciones getUsers(), followUser() y resto del código necesarias
