import calculateSubtitleDuration from '../utils/calculateSubtitleDuration.js';
import showToast from '../components/showToast.js';

let autoSet = false;
let isDataModified = false;

function addSubtitleRow(beforeIndex = null, afterIndex = null, {speaker, text, duration} = {}) {
  const list = document.getElementById('subtitleList');
  const row = document.createElement('div');
  row.className = 'subtitle-row';
  row.innerHTML = `
      <input type="number" placeholder="Duration (s)" ${duration !== undefined ? `value="${duration}" ` : ''}step="0.1" class="duration-input" ${autoSet ? 'disabled' : ''}>
      <input type="text" placeholder="Speaker Name" ${speaker ? `value="${speaker}" ` : ''}class="speaker-name-input">
      <input type="text" placeholder="Subtitle Text" ${text ? `value="${text}" ` : ''}class="subtitle-text">
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

document.getElementById('import').addEventListener('click', function() {
  document.getElementById('importDialog').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
  document.getElementById('importDialog').style.display = 'none';
});

document.getElementById('confirmImport').addEventListener('click', function() {
  const importText = document.getElementById('importText').value;
  try {
      if (document.querySelector('.subtitle-row') && !confirm('This will overwrite existing subtitles. Continue?')) {
          return;
      }
      importSubtitles(importText);
      document.getElementById('importDialog').style.display = 'none';
      document.getElementById('importText').value = ''; // Clear textarea after import
  } catch (e) {
      alert('Failed to import subtitles: ' + e.message);
  }
});

function importSubtitles(script) {
  const match = script.match(/\[\s*\[(.*?)\]\s*spawn BIS_fnc_EXP_camp_playSubtitles;/s);
  if (!match) throw new Error('Invalid script format.');
  const subtitleList = document.getElementById('subtitleList');
  subtitleList.innerHTML = ''; // Clear existing subtitles

  const entries = match[1].split('],');
  let previousTime = 0;

  entries.forEach((entry, index) => {
      if (!entry.trim()) return;
      const cleanedEntry = entry.replace(/[\[\]']+/g, '').trim();
      const parts = cleanedEntry.split(',').map(part => part.trim().replace(/"/g, ''));
      if (parts.length < 3) throw new Error('Entry format error.');

      const speaker = parts[0];
      const text = parts[1];
      const currentTime = parseFloat(parts[2]);
      const duration = index === 0 ? 1.5 : currentTime - previousTime;

      console.log(currentTime)

      addSubtitleRow(null, null, {speaker, text, duration});
      previousTime = currentTime;
  });

  // Set default duration for the last subtitle
  const lastDurationInput = subtitleList.querySelector('.duration-input:last-child');
  if (lastDurationInput) lastDurationInput.value = 5.0;
}

// Initial call to populate the first subtitle row
addSubtitleRow();
