// Add at the top of content.js

const CLASSNAME = 'ease-word-highlighter-span';

let intervalId = null;

// Modify the main execution block
// content.js
(async function() {
  try {
    const {config} = await chrome.storage.local.get('config');
    if (!config?.wordHighlights) return;



    let intervalId = null;
    const runHighlights = () => {
      document.querySelectorAll(CLASSNAME).forEach(el => el.remove());
      const sortedWords = [...config.wordHighlights].sort((a, b) => 
        b.word.length - a.word.length
      );
      highlightWords({...config, wordHighlights: sortedWords});
    };

    // Initial runs with delays
    const delays = config.rescanDelays || [0];
    delays.forEach((delay, index) => {
      setTimeout(() => {
        runHighlights();
        // Start periodic after last delay
        if (index === delays.length - 1 && config.rescanInterval) {
          intervalId = setInterval(runHighlights, config.rescanInterval);
        }
      }, delay);
    });

    // Cleanup on page unload
    window.addEventListener('unload', () => {
      clearInterval(intervalId);
    });

  } catch (error) {
    console.error('Error:', error);
  }
})();

// Add class to highlight spans in highlightWords function
// Modify the span creation line to:


// (async function() {
//   try {
//     const {config} = await chrome.storage.local.get('config');
//     if (!config) return;
    
//     // Keep original processing code below
//     const sortedWordHighlights = [...config.wordHighlights].sort((a, b) => b.word.length - a.word.length);
//     let fixedConfig = {...config}
//     fixedConfig.wordHighlights = sortedWordHighlights
//     highlightWords(fixedConfig);
//   } catch (error) {
//     console.error('Error loading config:', error);
//   }
// })();


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightWords(config) {
  // Existing highlighting logic with emoji support
  // Modify the config iteration line to:
  config.wordHighlights.forEach(({ word, color, emoji, position }) => {
    let pattern;
    if (emoji) {
      const escapedWord = escapeRegExp(word);
      const escapedEmoji = escapeRegExp(emoji);
      
      switch(position) {
        case 'start':
          pattern = `(?<!${escapedEmoji})${escapedWord}`;
          break;
        case 'end':
          pattern = `${escapedWord}(?!${escapedEmoji})`;
          break;
        default: // replace
          pattern = escapedWord;
      }
    } else {
      pattern = escapeRegExp(word);
    }

    const regex = new RegExp(pattern, 'g');

    // Find all text nodes in the document
    const treeWalker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip certain elements
          const tagName = node.parentNode.tagName.toLowerCase();
          return ['script', 'style', 'textarea', 'noscript'].includes(tagName)
            ? NodeFilter.FILTER_SKIP
            : NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    while (treeWalker.nextNode()) textNodes.push(treeWalker.currentNode);

    textNodes.forEach(textNode => {
      const content = textNode.nodeValue;
      if (!regex.test(content)) return;

      const parent = textNode.parentNode;
      const newNodes = [];
      let lastIndex = 0;

      content.replace(regex, (match, offset) => {
        // Add preceding text
        if (offset > lastIndex) {
          newNodes.push(
            document.createTextNode(content.slice(lastIndex, offset))
          );
        }

        // Create highlight span
        const span = document.createElement('span');
        // span.style.backgroundColor = color;
        // span.textContent = match;
        span.style.backgroundColor = color;
        if (color && color.toLowerCase() !== 'no') {
          span.style.backgroundColor = color;
        }

        // With:
        if (emoji) {
          span.textContent = {
            replace: emoji,
            start: emoji + match,
            end: match + emoji,
            no: match
          }[position || 'no'];
        } else {
          span.textContent = match;
        }
        newNodes.push(span);

        lastIndex = offset + match.length;
        return match;
      });

      // Add remaining text
      if (lastIndex < content.length) {
        newNodes.push(document.createTextNode(content.slice(lastIndex)));
      }

      // Replace original text node
      newNodes.forEach(node => parent.insertBefore(node, textNode));
      parent.removeChild(textNode);
    });
  });

 // Semantic highlighting


    // Add semantic highlighting if enabled
  try {
    if (config.semanticHighlighting?.enabled) {
      applySemanticHighlighting(config);
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
}


// Helper functions
function evaluateXPath(xpath) {
  const results = [];
  const snapshot = document.evaluate(xpath, document, null, 
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0; i < snapshot.snapshotLength; i++) {
    results.push(snapshot.snapshotItem(i));
  }
  return results;
}

function getColorForWord(word, palette) {
  const hash = Array.from(word).reduce((acc, char) => 
    acc + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

function applySemanticHighlighting(config) {
const palette = config.semanticHighlighting.colorPalette;
    const nodes = evaluateXPath(config.semanticHighlighting.selector);
    
    nodes.forEach(node => {
      const text = node.textContent;
      const words = text.match(/\b\w+\b/g) || [];
      
      words.forEach(word => {
        const color = getColorForWord(word, palette);
        node.innerHTML = node.innerHTML.replace(
          new RegExp(escapeRegExp(word), 'g'),
          `<span style="background:${color}">${word}</span>`
        );
      });
    });
}