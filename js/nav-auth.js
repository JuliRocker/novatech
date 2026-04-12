// Actualiza el bloque #acciones-auth según sesión (localStorage)

(function () {
  const STORAGE_SESION = 'novatech_sesion';

  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderAccionesAuth() {
    const wrap = document.getElementById('acciones-auth');
    if (!wrap) return;

    const raw = localStorage.getItem(STORAGE_SESION);
    if (raw) {
      try {
        const u = JSON.parse(raw);
        const nombre = u.nombre || u.email || 'Usuario';
        wrap.innerHTML =
          '<span class="nav-usuario" title="' +
          escapeHtml(u.email || '') +
          '">Hola, ' +
          escapeHtml(nombre) +
          '</span>' +
          '<button type="button" class="button button--nav" id="btn-cerrar-sesion">Cerrar sesión</button>';
        const btn = document.getElementById('btn-cerrar-sesion');
        if (btn) {
          btn.addEventListener('click', function () {
            localStorage.removeItem(STORAGE_SESION);
            window.location.reload();
          });
        }
        return;
      } catch (e) {
        localStorage.removeItem(STORAGE_SESION);
      }
    }

    wrap.innerHTML =
      '<a href="sesion.html" class="button button--nav">Iniciar sesión</a>' +
      '<a href="sesion.html?registro=1" class="btn-login btn-login--nav">Regístrate</a>';
  }

  document.addEventListener('DOMContentLoaded', renderAccionesAuth);

  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_SESION) renderAccionesAuth();
  });
})();
