function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#4CAF50';
  toast.style.color = 'white';
  toast.style.padding = '10px';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = '1000';
  toast.style.opacity = '0';
  document.body.appendChild(toast);
  setTimeout(() => {
      toast.style.transition = 'opacity 0.5s';
      toast.style.opacity = '1';
  }, 100);

  setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 600);
  }, 6000);
}

export default showToast;