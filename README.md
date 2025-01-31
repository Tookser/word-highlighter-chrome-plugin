# Word Highlighter Chrome Extension  

edit config before use.

## (ru) Подсветка слов (word-highlighter)

Расширение для Chrome «Подсветка слов»

Автоматически отмечает слова цветами/эмодзи на веб-страницах

- Основные возможности

    - Работает без перезагрузки страницы

    - Поддерживает динамический контент

    - Выбор доменов для работы плагина

    - Проверка формата настроек

- В планах:

    - Нечувствительность к регистру    

    - Выбор доменов, на которых применяются правила
    
    - Тестирование семантического выделения
    
    - Более приятный GUI

    - Рефакторинг

(разработано с использованием LLM)


## (en) word-highlighter

Automatically marks specifical words by colors and/or emoji on webpages.

- Key Features

    - No page reload needed

    - Works with dynamic content

    - Hosts selection

    - JSON config validation

- Ongoing feature

    - Case insensitivity
    
    - Testing of XPath semantic selection
    
    - More neat GUI

    - Refactoring

(developed with support of LLM).

## Configuration File default (delete comment before use or modificate default)

(comments)

```json
{
  "domains": ["en.wikipedia.org", "ru.wikipedia.org"], // domains (Optional)
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
```

- [Test it on English Wikipedia (Hello, World! page)](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program)  