import { images } from '../utils/articleImages.js';
import showToast from '../components/showToast.js';

let isDataModified = false;

function sanitizeInput(input) {
    // Remove backslashes and double quotes, and allow alphanumerics and punctuation
    return input.replace(/["\\]/g, '');
}

document.getElementById('title').addEventListener('input', function() {
  this.value = sanitizeInput(this.value);
  document.getElementById('preview-title').innerText = this.value || 'Title will appear here...';
  isDataModified = true;
});

document.getElementById('author').addEventListener('input', function() {
  this.value = sanitizeInput(this.value);
  document.getElementById('preview-author').innerText = this.value || 'Author';
  isDataModified = true;
});

document.getElementById('caption').addEventListener('input', function() {
  this.value = sanitizeInput(this.value);
  document.getElementById('preview-caption').innerText = this.value || 'Image caption...';
  isDataModified = true;
});

document.getElementById('description').addEventListener('input', function() {
  this.value = sanitizeInput(this.value);
  document.getElementById('preview-description').innerText = this.value || 'Article text...';
  isDataModified = true;
});

document.getElementById('imageSelect').addEventListener('change', function() {
  const selectedImage = this.options[this.selectedIndex].value;
  document.getElementById('preview-image').src = selectedImage;
  isDataModified = true;
});

document.getElementById('isDraft').addEventListener('change', function() {
  const draftNotice = document.querySelector('.draft-notice');
  if (this.checked) {
    draftNotice.style.display = 'block';
  } else {
    draftNotice.style.display = 'none';
  }
  isDataModified = true;
});

// Initialize the image dropdown
images.forEach(img => {
    let option = new Option(img.alt, img.src);
    imageSelect.appendChild(option);
});

document.getElementById('copyToClipboard').addEventListener('click', function() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const imageOption = images.find(img => img.src === document.getElementById('imageSelect').value);
    const caption = document.getElementById('caption').value;
    const description = document.getElementById('description').value.trim();
    const isDraft = document.getElementById('isDraft').checked;
    
    let dateValue = document.getElementById('date').value;
    let date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      date = new Date();
      dateValue = date.toISOString().slice(0, 16);
      document.getElementById('date').value = dateValue;
    }
    const dateArray = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()];
    const paragraphs = description.split(/\n+/);

    let scriptCommand = '[\n  [\n';
    scriptCommand += `    ["title","${sanitizeInput(title)}"],\n`;
    scriptCommand += `    ["meta",["${sanitizeInput(author)}",[${dateArray.join(',')}],"GMT"]],\n`;
    scriptCommand += `    ["image",["${imageOption.texturePath}","${sanitizeInput(caption)}"]],\n`;

    paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim()) {
            scriptCommand += `    ["text","${sanitizeInput(paragraph.trim())}"]${index === paragraphs.length - 1 ? '' : ','}\n`;
        }
    });

    if (isDraft) {
        scriptCommand += '    ,["draft",[]]\n';
    }

    scriptCommand += '  ]\n] call BIS_fnc_showAANArticle;';

    navigator.clipboard.writeText(scriptCommand).then(() => {
        showToast('Script copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

document.getElementById('date').value = new Date().toISOString().slice(0, 16);

window.addEventListener('beforeunload', function (e) {
  if (!isDataModified) {
    return undefined;
  }
  // Compatibility management for different browsers
  const confirmationMessage = 'It looks like you have been editing something. ' +
                              'If you leave before saving, your changes will be lost.';

  (e || window.event).returnValue = confirmationMessage; // For IE and Firefox
  return confirmationMessage; // For Safari and Chrome
});

addSubtitleRow();