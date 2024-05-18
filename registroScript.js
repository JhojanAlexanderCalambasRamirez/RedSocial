document.getElementById("registrationForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Evitar que se envíe el formulario de forma predeterminada
  
  // Obtener datos del formulario
  const nombre_completo = document.getElementById("nombre_completo").value;
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;



  // Hacer solicitud POST para registrar un nuevo usuario
  fetch('http://localhost:3001/auth/users', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          
      },
      body: JSON.stringify({ nombre_completo, usuario, password, rol })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error al registrar el usuario');
      }
      return response.json();
  })
  .then(data => {
      // Mostrar mensaje de éxito
      document.getElementById("message").textContent = "Usuario registrado exitosamente";
  })
  .catch(error => {
      // Mostrar mensaje de error
      document.getElementById("message").textContent = error.message;
  });
});
