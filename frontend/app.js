async function explainCommand() {
  const command = document.getElementById('commandInput').value.trim();
  const resultEl = document.getElementById('result');
  if (!command) {
    alert('Please enter a command');
    return;
  }
  resultEl.textContent = 'Loading...';

  // Replace YOUR_SERVER_IP with your backend server's actual IP address or hostname
  const SERVER_IP = '65.0.193.14';
  const SERVER_PORT = '5000'; // Change if your backend runs on a different port

  try {
    const response = await fetch(`http://${SERVER_IP}:${SERVER_PORT}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });

    if (!response.ok) throw new Error('Failed to get explanation');

    const data = await response.json();

    let html = `<div class="explain-container">`;
    html += `<div class="command-title">${command}</div>`;
    html += `<div class="command-description"><strong>Description:</strong> ${data.description}</div>`;

    if (data.flags.length > 0) {
      html += `<h3>Flags and Options:</h3>`;
      data.flags.forEach(item => {
        html += `<div class="breakdown-block"><span class="flag">${item.flag}</span><span class="desc">${item.explanation}</span></div>`;
      });
    }

    if (data.usage.length > 0) {
      html += `<h3>Usage Examples:</h3><pre class="usage-examples">${data.usage.join('\n')}</pre>`;
    }

    html += `</div>`;
    resultEl.innerHTML = html;
  } catch (error) {
    resultEl.textContent = 'Error: ' + error.message;
  }
}
