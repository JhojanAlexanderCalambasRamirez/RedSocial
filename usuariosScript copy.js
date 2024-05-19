document.addEventListener("DOMContentLoaded", function() {
    getUsersAndDisplay();
    document.getElementById('followAllButton').addEventListener('click', followAllUsers);
});

async function getUsersAndDisplay() {
    try {
        const users = await getUsers();
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear the list before filling it

        for (const user of users) {
            const listItem = document.createElement('li');
            listItem.textContent = `${user.nombre_completo} (${user.usuario})`;

            const messagesList = document.createElement('ul');
            listItem.appendChild(messagesList);

            const messages = await getMessagesByUserId(user.id);
            messages.forEach(message => {
                const messageItem = document.createElement('li');
                messageItem.textContent = message.contenido;
                messagesList.appendChild(messageItem);
            });

            userList.appendChild(listItem);
        }

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

async function getMessagesByUserId(userId) {
    try {
        const response = await fetch(`http://localhost:3002/message/messages/${userId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los mensajes del usuario');
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
        followingList.innerHTML = ''; // Clear the list before filling it

        for (const following of followingUsers) {
            const userResponse = await fetch(`http://localhost:3001/auth/users/${following.usuarioS_id}`);
            if (!userResponse.ok) {
                throw new Error('Error al obtener datos del usuario seguido');
            }

            const user = await userResponse.json();
            const userItem = document.createElement('div');
            userItem.textContent = `${user.nombre_completo} (${user.usuario}):`;

            const messagesList = document.createElement('ul');
            userItem.appendChild(messagesList);

            const messages = await getMessagesByUserId(user.id);
            messages.forEach(message => {
                const messageItem = document.createElement('li');
                messageItem.textContent = message.contenido;
                messagesList.appendChild(messageItem);
            });

            followingList.appendChild(userItem);
        }

        alert('Lista de mensajes bajo usuarios seguidos actualizada exitosamente');
    } catch (error) {
        console.error('Error al actualizar la lista de mensajes bajo usuarios seguidos:', error);
        alert('Error al actualizar la lista de mensajes bajo usuarios seguidos');
    }
}
