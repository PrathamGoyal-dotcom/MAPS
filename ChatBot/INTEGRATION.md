# Gym Chatbot — Integration Guide

## Quick Start

### 1. Include the Scripts

Add these scripts to your HTML page (order matters):

```html
<script src="data/knowledge-base.js"></script>
<script src="js/nlp-engine.js"></script>
<script src="js/context-manager.js"></script>
<script src="js/gym-chatbot.js"></script>
```

### 2. Initialize

```javascript
GymChatBot.init({
  typingDelay: 500,          // ms before responding (0 = instant)
  enableContext: true,        // multi-turn conversation tracking
  enableSuggestions: true     // include quick-reply suggestions in responses
});
```

### 3. Send Messages

```javascript
// Async (with typing delay)
const result = await GymChatBot.send("What workout should I do as a beginner?");
console.log(result.text);         // Bot's response text
console.log(result.suggestions);  // ["Beginner cardio plan", "Intermediate workout", ...]
console.log(result.intent);       // "workout_plan"
console.log(result.confidence);   // 0.8
console.log(result.entities);     // { experience: ["beginner"] }

// Sync (instant, no delay)
const result = GymChatBot.sendSync("Show me your membership plans");
```

---

## API Reference

### `GymChatBot.init(options)`
Initialize the chatbot. Call once at startup.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `typingDelay` | number | 500 | Milliseconds to wait before responding |
| `enableContext` | boolean | true | Track conversation context for follow-ups |
| `enableSuggestions` | boolean | true | Include suggestion chips in responses |
| `onMessage` | function | null | Callback fired when bot responds |
| `onTypingStart` | function | null | Callback fired when typing indicator should show |
| `onTypingEnd` | function | null | Callback fired when typing indicator should hide |
| `onError` | function | null | Callback fired on errors |

### `GymChatBot.send(message)` → `Promise<Response>`
Send a user message and get a response (async, respects typingDelay).

### `GymChatBot.sendSync(message)` → `Response`
Send a user message and get an instant response (no delay).

### `GymChatBot.getWelcomeMessage()` → `{ text, suggestions }`
Get the initial greeting message to display when the chat opens.

### `GymChatBot.resetConversation()`
Clear conversation context and history. Use when starting a new session.

### `GymChatBot.getContext()` → `object`
Get the current conversation context (last topic, user level, user goal, etc).

### `GymChatBot.getHistory()` → `array`
Export the full conversation history for analytics or persistence.

### `GymChatBot.configure(options)`
Update configuration after initialization.

### `GymChatBot.debug(text)` → `object`
Run text through the NLP engine only (returns intent, entities, confidence). Useful for debugging.

---

## Response Object

Every `send()` and `sendSync()` call returns:

```javascript
{
  text: "Bot's response with **markdown** formatting",
  suggestions: ["Quick reply 1", "Quick reply 2"],
  intent: "workout_plan",
  confidence: 0.8,
  entities: { experience: ["beginner"], muscle_group: ["chest"] },
  timestamp: 1715456789000
}
```

### Text Formatting
The `text` field uses lightweight markdown:
- `**bold**` for headings and emphasis
- `*italic*` for subtle text
- `•` or `-` for bullet points
- `\n` for line breaks
- Emojis for visual cues (💪🏋️🥗📅💊)

Your frontend should parse this into HTML/JSX as needed.

---

## Supported Intents

| Intent | Example Queries |
|--------|----------------|
| `greeting` | "hi", "hello", "hey there" |
| `goodbye` | "bye", "see ya", "thanks bye" |
| `workout_plan` | "give me a workout plan", "training routine" |
| `muscle_group` | "chest exercises", "how to train legs" |
| `experience_level` | "I'm a beginner", "advanced workout" |
| `nutrition` | "what should I eat", "bulking diet", "macros" |
| `supplements` | "what supplements should I take", "creatine" |
| `hydration` | "how much water", "staying hydrated" |
| `tdee` | "calculate my calories", "what's my TDEE" |
| `membership` | "membership plans", "how much to join" |
| `cancellation` | "cancel my membership" |
| `freeze` | "freeze my account", "pause membership" |
| `guest_pass` | "bring a friend", "day pass" |
| `discount` | "student discount", "any deals" |
| `schedule` | "gym hours", "when do you open" |
| `peak_hours` | "when is it busy", "best time to go" |
| `classes` | "yoga class", "what classes today", "HIIT schedule" |
| `exercise_form` | "squat form", "how to deadlift properly" |
| `first_day` | "first time at gym", "what to bring" |
| `personal_trainer` | "do you have trainers" |
| `equipment` | "what equipment do you have" |
| `etiquette` | "gym rules", "gym etiquette" |
| `general_faq` | "locker info", "parking", "WiFi", "age limit" |
| `followup` | "tell me more", "what else" |
| `thanks` | "thank you", "that's helpful" |

---

## Integration Examples

### React
```jsx
import { useEffect, useRef, useState } from 'react';

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    GymChatBot.init({ typingDelay: 400 });
    const welcome = GymChatBot.getWelcomeMessage();
    setMessages([{ from: 'bot', ...welcome }]);
  }, []);

  async function handleSend(text) {
    setMessages(prev => [...prev, { from: 'user', text }]);
    const response = await GymChatBot.send(text);
    setMessages(prev => [...prev, { from: 'bot', ...response }]);
  }

  return (/* your JSX here */);
}
```

### Vue
```javascript
export default {
  data() {
    return { messages: [] };
  },
  mounted() {
    GymChatBot.init({ typingDelay: 400 });
    this.messages.push({ from: 'bot', ...GymChatBot.getWelcomeMessage() });
  },
  methods: {
    async sendMessage(text) {
      this.messages.push({ from: 'user', text });
      const response = await GymChatBot.send(text);
      this.messages.push({ from: 'bot', ...response });
    }
  }
};
```

### Vanilla JS (Event-Driven)
```javascript
GymChatBot.init({
  onMessage: function(result) {
    renderBotMessage(result.text, result.suggestions);
  },
  onTypingStart: function() {
    showTypingIndicator();
  },
  onTypingEnd: function() {
    hideTypingIndicator();
  }
});

// Then just call:
GymChatBot.send(userInput);
```

---

## Customizing the Knowledge Base

Edit `data/knowledge-base.js` to update:
- **Membership plans & pricing** — `KnowledgeBase.membership`
- **Gym hours** — `KnowledgeBase.schedule.gymHours`
- **Classes** — `KnowledgeBase.schedule.classes`
- **FAQ answers** — `KnowledgeBase.faq`
- **Workout plans** — `KnowledgeBase.workouts`
- **Nutrition info** — `KnowledgeBase.nutrition`

The chatbot reads from this object at runtime — changes are reflected immediately.

---

## File Structure

```
data/knowledge-base.js    → All gym domain knowledge (editable)
js/nlp-engine.js           → NLP: tokenizer, intent classifier, entity extractor
js/context-manager.js      → Multi-turn conversation state tracking
js/gym-chatbot.js          → Main API entry point (GymChatBot)
```

All files are vanilla JS with no dependencies. Compatible with any frontend framework.
