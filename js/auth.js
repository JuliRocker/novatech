// Formularios de sesion.html (demo local: localStorage; sin servidor)

(function () {
  const STORAGE_USUARIOS = 'novatech_usuarios';
  const STORAGE_SESION = 'novatech_sesion';

  function mostrarMensaje(el, texto, tipo) {
    if (!el) return;
    el.textContent = texto || '';
    el.className = 'auth-mensaje' + (tipo ? ' auth-mensaje--' + tipo : '');
    el.hidden = !texto;
  }

  function getUsuarios() {
    try {
      const raw = localStorage.getItem(STORAGE_USUARIOS);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function guardarUsuarios(list) {
    localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(list));
  }

  function seleccionarTab(esRegistro) {
    const tabLogin = document.querySelector('[data-auth-tab="login"]');
    const tabReg = document.querySelector('[data-auth-tab="registro"]');
    const panelLogin = document.getElementById('auth-panel-login');
    const panelReg = document.getElementById('auth-panel-registro');
    if (!tabLogin || !tabReg || !panelLogin || !panelReg) return;

    tabLogin.classList.toggle('auth-tab--active', !esRegistro);
    tabReg.classList.toggle('auth-tab--active', esRegistro);
    panelLogin.hidden = esRegistro;
    panelReg.hidden = !esRegistro;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const msg = document.getElementById('auth-mensaje');
    const params = new URLSearchParams(window.location.search);
    const quiereRegistro = params.get('registro') === '1';

    seleccionarTab(quiereRegistro);

    document.querySelectorAll('[data-auth-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mostrarMensaje(msg, '');
        seleccionarTab(btn.getAttribute('data-auth-tab') === 'registro');
        try {
          history.replaceState({}, '', btn.getAttribute('data-auth-tab') === 'registro'
            ? 'sesion.html?registro=1'
            : 'sesion.html');
        } catch (e) {}
      });
    });

    var sesionActiva = document.getElementById('auth-sesion-activa');
    if (localStorage.getItem(STORAGE_SESION)) {
      try {
        var u0 = JSON.parse(localStorage.getItem(STORAGE_SESION));
        if (sesionActiva && u0) {
          sesionActiva.hidden = false;
          var nombre0 = u0.nombre || u0.email || '';
          document.getElementById('auth-sesion-nombre').textContent = nombre0;
          var cardEl = document.querySelector('.auth-card');
          if (cardEl) cardEl.hidden = true;
          var sub = document.querySelector('.auth-main .subtitulo');
          if (sub) sub.hidden = true;
          var tit = document.querySelector('.auth-titulo-pagina');
          if (tit) tit.hidden = true;
        }
      } catch (e) {}
      document.getElementById('btn-auth-ir-inicio') &&
        document.getElementById('btn-auth-ir-inicio').addEventListener('click', function () {
          window.location.href = 'index.html';
        });
      document.getElementById('btn-auth-cerrar-aqui') &&
        document.getElementById('btn-auth-cerrar-aqui').addEventListener('click', function () {
          localStorage.removeItem(STORAGE_SESION);
          window.location.reload();
        });
    }

    var formLogin = document.getElementById('form-login');
    if (formLogin) {
      formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        mostrarMensaje(msg, '');
        var email = (document.getElementById('login-email').value || '').trim().toLowerCase();
        var pass = document.getElementById('login-password').value || '';
        if (!email || !pass) {
          mostrarMensaje(msg, 'Completa correo y contraseña.', 'error');
          return;
        }
        var usuarios = getUsuarios();
        var u = usuarios.find(function (x) {
          return x.email && x.email.toLowerCase() === email;
        });
        if (!u || u.password !== pass) {
          mostrarMensaje(msg, 'Correo o contraseña incorrectos.', 'error');
          return;
        }
        localStorage.setItem(STORAGE_SESION, JSON.stringify({
          nombre: u.nombre,
          email: u.email
        }));
        window.location.href = 'index.html';
      });
    }

    var formReg = document.getElementById('form-registro');
    if (formReg) {
      formReg.addEventListener('submit', function (e) {
        e.preventDefault();
        mostrarMensaje(msg, '');
        var nombre = (document.getElementById('reg-nombre').value || '').trim();
        var email = (document.getElementById('reg-email').value || '').trim().toLowerCase();
        var pass = document.getElementById('reg-password').value || '';
        var pass2 = document.getElementById('reg-password2').value || '';
        if (nombre.length < 2) {
          mostrarMensaje(msg, 'Indica un nombre válido.', 'error');
          return;
        }
        if (!email || email.indexOf('@') < 0) {
          mostrarMensaje(msg, 'Indica un correo electrónico válido.', 'error');
          return;
        }
        if (pass.length < 6) {
          mostrarMensaje(msg, 'La contraseña debe tener al menos 6 caracteres.', 'error');
          return;
        }
        if (pass !== pass2) {
          mostrarMensaje(msg, 'Las contraseñas no coinciden.', 'error');
          return;
        }
        var usuarios = getUsuarios();
        if (usuarios.some(function (x) {
          return x.email && x.email.toLowerCase() === email;
        })) {
          mostrarMensaje(msg, 'Ese correo ya está registrado.', 'error');
          return;
        }
        usuarios.push({
          nombre: nombre,
          email: email,
          password: pass
        });
        guardarUsuarios(usuarios);
        mostrarMensaje(msg, 'Cuenta creada. Ya puedes iniciar sesión.', 'ok');
        formReg.reset();
        seleccionarTab(false);
        try {
          history.replaceState({}, '', 'sesion.html');
        } catch (e2) {}
      });
    }
  });
})();
