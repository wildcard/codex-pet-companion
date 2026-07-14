window.addEventListener('DOMContentLoaded', () => {
  const pet = document.querySelector('#inline-pet');
  document.querySelector('#wave')?.addEventListener('click', () => pet?.play('waving', { loop: false, returnTo: 'idle' }));
});
