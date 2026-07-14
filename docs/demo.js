window.addEventListener('DOMContentLoaded', () => {
  const pet = document.querySelector('#inline-pet');
  document.querySelector('#wave')?.addEventListener('click', () => pet?.play('waving', { loop: false, returnTo: 'idle' }));
  document.querySelector('#zoomies')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    await pet?.zoomies();
    button.disabled = false;
    button.removeAttribute('aria-busy');
  });
});
