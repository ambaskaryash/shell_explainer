// Object defining categories and sample commands per category
const commandSamples = {
  linux: [
    "ls -lh",
    "grep -i error filename",
    "tar czvf archive.tar.gz folder/",
  ],
  windows: [
    "dir /A:H",
    "ipconfig /all",
    "tasklist",
  ],
  macos: [
    "brew install wget",
    "defaults write com.apple.finder AppleShowAllFiles YES",
    "open -a Safari",
  ],
  devops: [
    "docker ps",
    "kubectl get pods",
    "ansible all -m ping",
  ],
  network: [
    "ping google.com",
    "traceroute github.com",
    "netstat -tulnp",
  ],
};

// Function to display sample commands as buttons for the selected category
function showCategory(cat) {
  const cmds = commandSamples[cat] || [];
  const container = document.getElementById("category-commands");
  container.innerHTML = cmds
    .map(
      cmd =>
        `<button class="cmd-sample" onclick="selectSample('${cmd.replace(
          /'/g,
          "\\'"
        )}')">${cmd}</button>`
    )
    .join(" ");
}

// Function to fill the input box with the selected sample command and trigger explanation
function selectSample(cmd) {
  document.getElementById("commandInput").value = cmd;
  explainCommand();
}

// Existing explainCommand function to fetch and display the command explanation from the backend
async function explainCommand() {
  const command = document.getElementById("commandInput").value.trim();
  const resultEl = document.getElementById("result");
  if (!command) {
    alert("Please enter a command");
    return;
  }
  resultEl.textContent = "Loading...";

  // Backend server IP and port for API calls
  const SERVER_IP = "localhost";
  const SERVER_PORT = "5000"; // Change if your backend runs on a different port

  try {
    const response = await fetch(`http://${SERVER_IP}:${SERVER_PORT}/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) throw new Error("Failed to get explanation");

    const data = await response.json();

    let html = `<div class="explain-container">`;
    html += `<div class="command-title">${command}</div>`;
    html += `<div class="command-description"><strong>Description:</strong> ${data.description}</div>`;

    if (data.flags.length > 0) {
      html += `<h3>Flags and Options:</h3>`;
      data.flags.forEach((item) => {
        html += `<div class="breakdown-block"><span class="flag">${item.flag}</span><span class="desc">${item.explanation}</span></div>`;
      });
    }

    if (data.usage.length > 0) {
      html += `<h3>Usage Examples:</h3><pre class="usage-examples">${data.usage.join(
        "\n"
      )}</pre>`;
    }

    html += `</div>`;
    resultEl.innerHTML = html;
  } catch (error) {
    resultEl.textContent = "Error: " + error.message;
  }
}
