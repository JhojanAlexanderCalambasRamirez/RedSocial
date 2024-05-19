document.addEventListener("DOMContentLoaded", function() {
    getUsersAndDisplay();

    document.getElementById('followAllButton').addEventListener('click', followAllUsers);
});

async function getUsersAndDisplay() {
    try {
        const response = await fetch('http://localhost:3001/auth/users');
        if (!response.ok) {
            throw new Error('Error al obtener la lista de usuarios');
        }
        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Limpiar la lista antes de llenarla
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.nombre_completo} (${user.usuario})`;

            const followButton = document.createElement('button');
            followButton.textContent = 'Seguir';
            followButton.addEventListener('click', function() {
                followUser(user.id);
            });

            listItem.appendChild(followButton);
            userList.appendChild(listItem);
        });

        await updateFollowingList();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('userList').textContent = 'Error al cargar la lista de usuarios';
    }
}

async function getUsers() {
    try {
        const response = await fetch('http://localhost:3001/auth/users');
        if (!response.ok) {
            throw new Error('Error al obtener la lista de usuarios');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function followUser(userId) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            throw new Error('Usuario no autenticado');
        }

        const response = await fetch('http://localhost:3003/relationship/follow/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuarioP_id: currentUser.id, usuarioS_id: userId })
        });

        if (!response.ok) {
            throw new Error(`Error al seguir al usuario: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        alert('Usuario seguido exitosamente');

        await updateFollowingList();
    } catch (error) {
        console.error('Error al seguir al usuario:', error.message);
        alert('Error al seguir al usuario');
    }
}

async function followAllUsers() {
    try {
        const users = await getUsers();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Usuario no autenticado');
            return;
        }

        for (const user of users) {
            try {
                await followUser(user.id);
            } catch (error) {
                console.error('Error al seguir al usuario:', error);
            }
        }

        await updateFollowingList();
    } catch (error) {
        console.error('Error al seguir a todos los usuarios:', error);
    }
}

async function updateFollowingList() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            throw new Error('Usuario no autenticado');
        }

        const response = await fetch(`http://localhost:3003/relationship/following/${currentUser.id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la lista de usuarios seguidos');
        }

        const followingUsers = await response.json();
        const followingList = document.getElementById('followingList');
        followingList.innerHTML = ''; // Limpiar la lista antes de volver a llenarla

        for (const following of followingUsers) {
            const userResponse = await fetch(`http://localhost:3001/auth/users/${following.usuarioS_id}`);
            if (!userResponse.ok) {
                throw new Error('Error al obtener datos del usuario seguido');
            }

            const user = await userResponse.json();
            const listItem = document.createElement('li');
            listItem.textContent = `${user.nombre_completo} (${user.usuario})`;

            // Agregar los mensajes del usuario seguido
            const messagesResponse = await fetch(`http://localhost:3003/relationship/following/${currentUser.id}/messages`);
            if (!messagesResponse.ok) {
                throw new Error('Error al obtener los mensajes del usuario seguido');
            }

            const messages = await messagesResponse.json();
            const messagesList = document.createElement('ul');

            messages.forEach(message => {
                if (message.usuario_id === user.id) {
                    const messageItem = document.createElement('li');
                    messageItem.textContent = message.contenido;
                    messagesList.appendChild(messageItem);
                }
            });

            listItem.appendChild(messagesList);
            followingList.appendChild(listItem);
        }

        alert('Lista de usuarios seguidos y sus mensajes actualizada exitosamente');
    } catch (error) {
        console.error('Error al actualizar la lista de usuarios seguidos:', error);
        alert('Error al actualizar la lista de usuarios seguidos');
    }
}