import calculateSubtitleDuration from './utils/calculateSubtitleDuration.js';
import showToast from './components/showToast.js';

let autoSet = false;
let isDataModified = false;

function addSubtitleRow(beforeIndex = null, afterIndex = null) {
  const list = document.getElementById('subtitleList');
  const row = document.createElement('div');
  row.className = 'subtitle-row';
  row.innerHTML = `
      <input type="number" placeholder="Duration (s)" step="0.1" class="duration-input" ${autoSet ? 'disabled' : ''}>
      <input type="text" placeholder="Speaker Name" class="speaker-name-input">
      <input type="text" placeholder="Subtitle Text" class="subtitle-text">
      <button class="action-button green-button add-before"><i class="material-icons">expand_less</i></button>
      <button class="action-button green-button add-after"><i class="material-icons">expand_more</i></button>
      <button class="action-button red-button delete"><i class="material-icons">delete</i></button>
  `;

  setupRowButtons(row);
  preventLineBreaks(row);

  if (beforeIndex !== null) {
      list.insertBefore(row, list.children[beforeIndex]);
  } else if (afterIndex !== null) {
      list.insertBefore(row, list.children[afterIndex + 1] || null);
  } else {
      list.appendChild(row);
  }
}

function setupRowButtons(row) {
  row.querySelector('.add-before').addEventListener('click', function() {
      addSubtitleRow(Array.prototype.indexOf.call(row.parentNode.children, row));
      isDataModified = true;
  });
  row.querySelector('.add-after').addEventListener('click', function() {
      addSubtitleRow(null, Array.prototype.indexOf.call(row.parentNode.children, row));
      isDataModified = true;
  });
  row.querySelector('.delete').addEventListener('click', function() {
      row.parentNode.removeChild(row);
      isDataModified = true; 
  });
}

function preventLineBreaks(row) {
  const inputs = row.querySelectorAll('input[type="text"]');
  inputs.forEach(input => {
      input.addEventListener('keypress', function(event) {
          if (event.key === "Enter") {
              event.preventDefault();
          }
      });
  });
}

document.getElementById('copyToClipboard').addEventListener('click', function() {
  const script = generateScript();
  navigator.clipboard.writeText(script).then(() => {
      showToast('Script copied to clipboard.');
  });
});

document.getElementById('export').addEventListener('click', function() {
  const script = generateScript();
  downloadScript(script);
  showToast('Script exported.');
});

function generateScript() {
  const autoSetDuration = document.getElementById('autoSetDuration').checked;
  const rows = document.querySelectorAll('.subtitle-row');
  let totalTime = 0;
  let script = '[\n';

  rows.forEach((row, index) => {
      const speaker = row.querySelector('.speaker-name-input').value.trim();
      const text = row.querySelector('.subtitle-text').value.trim().replace(/[\r\n]+/g, ' '); // Removes line breaks
      let duration = parseFloat(row.querySelector('.duration-input').value);
      if (autoSetDuration) {
          duration = calculateSubtitleDuration(text);
          duration = Math.round(duration * 100) / 100; // Ensures max two decimal places
      }
      script += `\t["${speaker}", "${text}", ${totalTime}]${index < rows.length - 1 ? ',' : ''}\n`;
      totalTime += duration;
  });

  script += `] spawn BIS_fnc_EXP_camp_playSubtitles;\n\nsleep ${totalTime};\nBIS_fnc_EXP_camp_playSubtitles_terminate = true;\n`;
  return script;
}

function downloadScript(script) {
  const blob = new Blob([script], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'script.sqf';
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('addSubtitle').addEventListener('click', function() {
  addSubtitleRow();
  isDataModified = true;
});

document.getElementById('clearAll').addEventListener('click', function() {
  if (confirm("Are you sure you want to clear all subtitles?")) {
      document.getElementById('subtitleList').innerHTML = '';
  }
});

document.getElementById('autoSetDuration').addEventListener('change', function() {
  autoSet = this.checked;
  const durations = document.querySelectorAll('.duration-input');
  durations.forEach(input => input.disabled = autoSet);
});

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

// Initial call to populate the first subtitle row
addSubtitleRow();
