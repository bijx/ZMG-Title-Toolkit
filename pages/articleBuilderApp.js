import { images } from '../utils/articleImages.js';
import showToast from '../components/showToast.js';

document.getElementById('title').addEventListener('input', function() {
  document.getElementById('preview-title').innerText = this.value || 'Title will appear here...';
});

document.getElementById('author').addEventListener('input', function() {
  document.getElementById('preview-author').innerText = this.value || 'Author';
});

document.getElementById('date').addEventListener('input', function() {
  document.getElementById('preview-date').innerText = this.value || 'Date/Time';
});

document.getElementById('imageSelect').addEventListener('change', function() {
  const selectedImage = this.options[this.selectedIndex].value;
  document.getElementById('preview-image').src = selectedImage;
});

document.getElementById('caption').addEventListener('input', function() {
  document.getElementById('preview-caption').innerText = this.value || 'Image caption...';
});

document.getElementById('description').addEventListener('input', function() {
  document.getElementById('preview-description').innerText = this.value || 'Article text...';
});

document.getElementById('isDraft').addEventListener('change', function() {
  const draftNotice = document.querySelector('.draft-notice');
  if (this.checked) {
      draftNotice.style.display = 'block';
  } else {
      draftNotice.style.display = 'none';
  }
});

// Initialize image dropdown
const imageSelect = document.getElementById('imageSelect');


images.forEach(img => {
  let option = new Option(img.alt, img.src);
  imageSelect.appendChild(option);
});

document.getElementById('copyToClipboard').addEventListener('click', function() {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const dateInput = document.getElementById('date').value;
  const selectedImageIndex = document.getElementById('imageSelect').selectedIndex;
  const imageDetails = images[selectedImageIndex];
  const caption = document.getElementById('caption').value;
  const description = document.getElementById('description').value;
  const isDraft = document.getElementById('isDraft').checked;

  // Format the date as an array [yyyy, mm, dd, hh, mm]
  const date = new Date(dateInput);
  const formattedDate = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes()
  ];

  // Split the description into paragraphs by new lines
  const paragraphs = description.split(/\n+/).filter(p => p);

  // Build the script array
  let scriptArray = [
      ["title", title],
      ["meta", [author, formattedDate, "GMT"]],
      ["image", [imageDetails.texturePath, caption]],
      ...paragraphs.map(paragraph => ["text", paragraph])
  ];

  if (isDraft) {
      scriptArray.push(["draft", []]);
  }

  const scriptCommand = JSON.stringify([scriptArray]) + ' call BIS_fnc_showAANArticle;';

  // Copy to clipboard
  navigator.clipboard.writeText(scriptCommand).then(() => {
      showToast('Script copied to clipboard!');
  }).catch(err => {
      console.error('Failed to copy text: ', err);
  });
});
