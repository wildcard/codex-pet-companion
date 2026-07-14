window.addEventListener('DOMContentLoaded', () => {
  const pet = document.querySelector('#inline-pet');
  document.querySelector('#wave')?.addEventListener('click', () => pet?.play('waving', { loop: false, returnTo: 'idle' }));
  document.querySelector('#roam')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Kavana is joining…';
    const started = await pet?.startRoaming();
    if (started) button.remove();
    else {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = 'Try roaming again';
    }
  });
});
