document.addEventListener('DOMContentLoaded', init);

// Add default config as a constant
const DEFAULT_CONFIG = {
  "wordHighlights": [
    {
      "word": "Hello",       // Exact match (case-sensitive!)
      "color": "#FF0000",     // Hex code / CSS name / "no"
      "emoji": "👋",          // Optional emoji
      "position": "replace"   // "replace"/"start"/"end"/"no"
    },
    {
      "word": "World",         // Emoji without color
      "emoji": "🌍",           // Uses default font color
      "position": "start"
    },
    {
      "word": "program",      // Color without emoji
      "color": "gold"          // no "emoji" or no "position" -> no emoji
    },
    {
      "word": "programming",  // Emoji at start
      "emoji": "📙",
      "position": "start"
    },
    {
      "word": "language",  // Emoji in the end
      "emoji": "🔤",
      "position": "end"
    }
  ],
  "semanticHighlighting": {   // DIDN't tested Auto-coloring feature
    "enabled": false,         // true/false
    "selector": "//p",        // XPath for target elements
    "colorPalette": [         // Auto-assigned colors (hash word, then select by hash from this list)
      "#FF6B6B", 
      "#4ECDC4"
    ]
  },
  "rescanDelays": [0, 500],   // Initial scans (ms)
  "rescanInterval": 3000      // Periodic scans (ms)
  // in this example we scan after pageload, then after 500ms, then every 3 seconds (3000 ms)
}

async function init() {
  const configTextarea = document.getElementById('config');
  const status = document.getElementById('status');

  // Load current config
  const {config} = await chrome.storage.local.get('config');
  
  // Fix: Properly format existing config
  configTextarea.value = config 
    ? JSON.stringify(config, null, 2)  // Format existing config
    : JSON.stringify(DEFAULT_CONFIG, null, 2);  // Format default config

  // Save button
  document.getElementById('save').addEventListener('click', async () => {
    try {
      const config = JSON.parse(configTextarea.value);
      await chrome.storage.local.set({config});
      status.textContent = '✓ Saved! Changes apply to new pages';
      setTimeout(() => status.textContent = '', 2000);
    } catch (e) {
      status.textContent = '✖ Invalid JSON: ' + e.message;
    }
  });

  // Reset button
  document.getElementById('reset').addEventListener('click', () => {
    configTextarea.value = JSON.stringify(DEFAULT_CONFIG, null, 2);
    status.textContent = 'Default config restored. Click Save to apply.';
  });
}