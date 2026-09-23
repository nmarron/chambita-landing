(() => {
  'use strict';
  const url = new URL(window.location.href);
  const match = /^\/invite\/([a-z0-9]{8})\/?$/i.exec(url.pathname);
  // Query form is available for hosts that cannot rewrite /invite/CODE.
  const queryCode = /^\/invite(?:\.html)?\/?$/.test(url.pathname)
    ? url.searchParams.get('code') : null;
  const candidate = match ? match[1] : queryCode;
  const code = candidate && /^[a-z0-9]{8}$/i.test(candidate) ? candidate.toUpperCase() : null;
  if (!code) {
    document.getElementById('invalid-code').hidden = false;
    return;
  }
  const input = document.getElementById('invite-code');
  const status = document.getElementById('copy-status');
  input.value = code;
  document.getElementById('invitation').hidden = false;
  document.getElementById('installed').hidden = false;
  document.getElementById('open-app').href = `chambita://invite/${code}`;
  document.getElementById('install-help').textContent =
    'Copia el código, descarga la app y pégalo al crear tu cuenta. También puedes volver al mensaje y tocar la invitación después de instalar.';
  document.getElementById('copy-code').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code);
      status.textContent = 'Código copiado. Pégalo al crear tu cuenta.';
    } catch {
      input.focus();
      input.select();
      input.setSelectionRange(0, code.length);
      status.textContent = 'Mantén presionado el código o usa el menú para copiarlo.';
    }
  });
})();
