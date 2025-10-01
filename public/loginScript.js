// loginScript.js
document.addEventListener('DOMContentLoaded', () => {
  const adminBtn = document.getElementById('adminBtn');
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const closeLogin = document.getElementById('closeLogin');
  const mainTitle = document.getElementById('mainTitle');

  let isAdmin = false; // estado de sesión en memoria (no persistente)

  // Mostrar modal
  function openLogin() {
    loginModal.classList.remove('hidden');
    loginModal.setAttribute('aria-hidden', 'false');
    // eliminar mensaje de error previo
    removeError();
    // enfocar campo usuario
    const userInput = document.getElementById('usuario');
    if (userInput) userInput.focus();
  }

  // Cerrar modal
  function closeLoginModal() {
    loginModal.classList.add('hidden');
    loginModal.setAttribute('aria-hidden', 'true');
  }

  // Actualizar UI segun estado admin
  function updateUIForAdmin() {
    if (isAdmin) {
      adminBtn.textContent = 'Cerrar Sesión';
      adminBtn.setAttribute('aria-pressed', 'true');
    } else {
      adminBtn.textContent = 'Admin';
      mainTitle.textContent = 'Catálogo de Departamentos';
      adminBtn.removeAttribute('aria-pressed');
    }
  }

  // Mostrar mensaje de error dentro del formulario
  function showError(message) {
    let err = loginForm.querySelector('.login-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'login-error';
      err.style.color = 'red';
      err.style.marginTop = '8px';
      err.style.fontSize = '14px';
      loginForm.insertBefore(err, loginForm.querySelector('.btn-primary'));
    }
    err.textContent = message;
  }

  function removeError() {
    const err = loginForm.querySelector('.login-error');
    if (err) err.remove();
  }

  // Evento principal del botón admin (abrir modal o cerrar sesión)
  adminBtn.addEventListener('click', () => {
    if (!isAdmin) {
      openLogin();
    } else {
      // Cerrar sesión
      isAdmin = false;
      updateUIForAdmin();
      // opcional: mensaje de feedback
      // alert('Sesión cerrada');
    }
  });

  // Cerrar modal con botón cancelar
  closeLogin.addEventListener('click', () => {
    closeLoginModal();
  });

  // Cerrar modal si se hace click fuera del contenido (overlay)
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });

  // Envío del formulario (validación)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    removeError();

    const usuario = (document.getElementById('usuario').value || '').trim();
    const password = document.getElementById('password').value || '';

    // Credenciales fijas
    if (usuario === 'admin' && password === '1234') {
      isAdmin = true;
      updateUIForAdmin();
      closeLoginModal();
      loginForm.reset();
    } else {
      showError('Usuario o contraseña incorrectos.');
    }
  });

  // Inicializar estado en la UI
  updateUIForAdmin();
});
