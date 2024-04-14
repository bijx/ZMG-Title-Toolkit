document.getElementById('addSubtitle').addEventListener('click', function() {
  addSubtitleRow();
});

function addSubtitleRow(beforeIndex = null, afterIndex = null) {
  const list = document.getElementById('subtitleList');
  const row = document.createElement('div');
  row.className = 'subtitle-row';
  row.innerHTML = `
      <input type="number" placeholder="Duration (s)" step="0.1" class="duration-input">
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
  });
  row.querySelector('.add-after').addEventListener('click', function() {
      addSubtitleRow(null, Array.prototype.indexOf.call(row.parentNode.children, row));
  });
  row.querySelector('.delete').addEventListener('click', function() {
      row.parentNode.removeChild(row);
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
  const rows = document.querySelectorAll('.subtitle-row');
  let totalTime = 0;
  let script = '[\n';

  rows.forEach((row, index) => {
      const speaker = row.querySelector('.speaker-name-input').value.trim();
      const text = row.querySelector('.subtitle-text').value.trim().replace(/[\r\n]+/g, ' '); // Removes line breaks
      const duration = parseFloat(row.querySelector('.duration-input').value);
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


// Initial call to populate the first subtitle row
addSubtitleRow();
