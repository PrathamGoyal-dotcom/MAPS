// Demo UI — Minimal interface to test the chatbot engine
// This is NOT production UI. Your team will replace this with their own frontend.

(function () {
  const messagesEl = document.getElementById("chat-messages");
  const inputEl = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const typingEl = document.getElementById("typing-indicator");
  const debugPanel = document.getElementById("debug-panel");
  const debugToggle = document.getElementById("debug-toggle");
  const micBtn = document.getElementById("mic-btn");
  const voiceToggle = document.getElementById("voice-toggle");
  const cameraBtn = document.getElementById("camera-btn");
  const cameraOverlay = document.getElementById("camera-overlay");
  const cameraFeed = document.getElementById("camera-feed");
  const cameraCanvas = document.getElementById("camera-canvas");
  const cameraPreview = document.getElementById("camera-preview");
  const cameraStatus = document.getElementById("camera-status");
  const cameraCaptureBtn = document.getElementById("camera-capture");
  const cameraRetakeBtn = document.getElementById("camera-retake");
  const cameraAnalyzeBtn = document.getElementById("camera-analyze");
  const cameraCloseBtn = document.getElementById("camera-close");
  const cameraUpload = document.getElementById("camera-upload");

  let debugMode = false;
  let voiceOutputEnabled = false;
  let isRecording = false;
  let recognition = null;
  let cameraStream = null;

  // ─── Initialize chatbot ───
  GymChatBot.init({
    typingDelay: 600,
    enableContext: true,
    enableSuggestions: true,
    onTypingStart: function () {
      typingEl.classList.add("active");
      scrollToBottom();
    },
    onTypingEnd: function () {
      typingEl.classList.remove("active");
    }
  });

  // Show welcome message
  const welcome = GymChatBot.getWelcomeMessage();
  appendBotMessage(welcome.text, welcome.suggestions);

  // Initialize food analyzer model in background
  if (typeof FoodAnalyzer !== 'undefined') {
    FoodAnalyzer.init();
  }

  // ─── Speech Recognition Setup ───
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = function () {
      isRecording = true;
      micBtn.classList.add("recording");
      inputEl.placeholder = "🎤 Listening...";
      inputEl.value = "";
    };

    recognition.onresult = function (event) {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Show live transcript in input
      inputEl.value = finalTranscript || interimTranscript;

      // Auto-send when final result is received
      if (finalTranscript) {
        setTimeout(function () {
          handleSend();
        }, 300);
      }
    };

    recognition.onerror = function (event) {
      isRecording = false;
      micBtn.classList.remove("recording");
      inputEl.placeholder = "Type or tap 🎤 to talk...";

      if (event.error === "not-allowed") {
        appendBotMessage("🎤 **Microphone access denied.** Please allow microphone access in your browser settings to use voice input.", []);
      } else if (event.error !== "aborted") {
        appendBotMessage("🎤 Sorry, I couldn't hear you clearly. Try again or type your question.", []);
      }
    };

    recognition.onend = function () {
      isRecording = false;
      micBtn.classList.remove("recording");
      inputEl.placeholder = "Type or tap 🎤 to talk...";
    };
  } else {
    // Browser doesn't support speech recognition
    micBtn.style.display = "none";
  }

  // ─── Speech Synthesis (Text-to-Speech) ───
  function speakText(text) {
    if (!voiceOutputEnabled || !window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Clean text for speech (remove markdown, emojis, special chars)
    const cleanText = text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/[•❌💪🏋️🥗📅💊🎯💡🔥🧠🏆📝📋📊🎫🏷️🕐🍗🍱⚖️🤔🤯💯🏃🎬⚠️🔢👋😊]/gu, "")
      .replace(/\[video:[^\]]+\]/g, "")
      .replace(/\[image:[^\]]+\]/g, "")
      .replace(/\n/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    // Split long text into chunks (synthesis has a ~200 char limit in some browsers)
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    const chunks = [];
    let current = "";

    for (const sentence of sentences) {
      if ((current + sentence).length > 180) {
        if (current) chunks.push(current.trim());
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current) chunks.push(current.trim());

    // Speak each chunk in sequence
    chunks.forEach(function (chunk, i) {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = "en-US";

      // Try to pick a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(function (v) {
        return v.lang.startsWith("en") && v.name.includes("Google");
      }) || voices.find(function (v) {
        return v.lang.startsWith("en") && !v.localService;
      }) || voices.find(function (v) {
        return v.lang.startsWith("en");
      });

      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    });
  }

  // ─── Event Listeners ───
  sendBtn.addEventListener("click", handleSend);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Mic button — click to toggle recording
  micBtn.addEventListener("click", function () {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      // Stop any current speech before listening
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      recognition.start();
    }
  });

  // Voice toggle — enable/disable TTS
  voiceToggle.addEventListener("click", function () {
    voiceOutputEnabled = !voiceOutputEnabled;
    voiceToggle.classList.toggle("active", voiceOutputEnabled);
    voiceToggle.title = voiceOutputEnabled ? "Voice responses ON" : "Voice responses OFF";

    if (!voiceOutputEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  });

  debugToggle.addEventListener("click", function () {
    debugMode = !debugMode;
    debugPanel.classList.toggle("visible", debugMode);
    debugToggle.textContent = debugMode ? "Hide Debug" : "Debug";
  });

  // ─── Send Message ───
  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    appendUserMessage(text);
    inputEl.value = "";
    inputEl.focus();

    // Send to chatbot
    GymChatBot.send(text).then(function (result) {
      appendBotMessage(result.text, result.suggestions);

      // Auto-open camera if triggerCamera flag is set
      if (result.triggerCamera) {
        openCamera();
      }

      // Speak the response
      speakText(result.text);

      // Debug info
      if (debugMode) {
        debugPanel.innerHTML = "<strong>Last NLP Result:</strong><br>" +
          "Intent: " + result.intent + "<br>" +
          "Confidence: " + (result.confidence * 100).toFixed(0) + "%<br>" +
          "Entities: " + JSON.stringify(result.entities, null, 1) + "<br>" +
          "Context: " + JSON.stringify(GymChatBot.getContext().lastTopic);
      }
    });
  }

  // ─── Render Messages ───
  function appendUserMessage(text) {
    const div = document.createElement("div");
    div.className = "message user";
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function appendBotMessage(text, suggestions) {
    const div = document.createElement("div");
    div.className = "message bot";
    div.innerHTML = renderMarkdownLite(text);

    // Add suggestions
    if (suggestions && suggestions.length > 0) {
      const sugDiv = document.createElement("div");
      sugDiv.className = "suggestions";
      suggestions.forEach(function (s) {
        const btn = document.createElement("button");
        btn.textContent = s;
        btn.addEventListener("click", function () {
          inputEl.value = s;
          handleSend();
        });
        sugDiv.appendChild(btn);
      });
      div.appendChild(sugDiv);
    }

    messagesEl.appendChild(div);
    scrollToBottom();
  }

  // ─── Markdown rendering with media support ───
  function renderMarkdownLite(text) {
    // First handle tables (before other replacements)
    text = text.replace(/((?:^\|.+\|$\n?)+)/gm, function (tableBlock) {
      const rows = tableBlock.trim().split("\n").filter(function (r) { return r.trim(); });
      if (rows.length < 2) return tableBlock;

      let html = "<table>";
      rows.forEach(function (row, i) {
        // Skip separator row (|---|---|)
        if (/^\|[\s\-:]+\|$/.test(row.replace(/\|/g, "|"))) return;
        if (/^[\|\s\-:]+$/.test(row)) return;

        const cells = row.split("|").filter(function (c) { return c.trim(); });
        const tag = i === 0 ? "th" : "td";
        html += "<tr>" + cells.map(function (c) {
          return "<" + tag + ">" + c.trim() + "</" + tag + ">";
        }).join("") + "</tr>";
      });
      html += "</table>";
      return html;
    });

    return text
      // Video embeds: [video:URL]
      .replace(/\[video:(https?:\/\/[^\]]+)\]/g, '<div class="video-embed"><iframe src="$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>')
      // Image embeds: [image:URL]
      .replace(/\[image:(https?:\/\/[^\]]+)\]/g, '<div class="image-embed"><img src="$1" alt="Exercise reference" loading="lazy"></div>')
      // Bold **text**
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic *text*
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Bullet points
      .replace(/^[•\-]\s+(.+)$/gm, "<li>$1</li>")
      // Numbered lists
      .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
      // Wrap consecutive <li> in <ul>
      .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
      // Line breaks
      .replace(/\n/g, "<br>");
  }

  function scrollToBottom() {
    setTimeout(function () {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 50);
  }

  // Load voices (some browsers load them async)
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = function () {
      window.speechSynthesis.getVoices();
    };
  }

  // ─── CAMERA / FOOD SCANNER ───
  cameraBtn.addEventListener("click", function () {
    openCamera();
  });

  cameraCloseBtn.addEventListener("click", function () {
    closeCamera();
  });

  cameraCaptureBtn.addEventListener("click", function () {
    capturePhoto();
  });

  cameraRetakeBtn.addEventListener("click", function () {
    retakePhoto();
  });

  cameraAnalyzeBtn.addEventListener("click", function () {
    analyzePhoto();
  });

  cameraUpload.addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (ev) {
        cameraFeed.style.display = "none";
        cameraPreview.src = ev.target.result;
        cameraPreview.style.display = "block";
        cameraCaptureBtn.style.display = "none";
        cameraRetakeBtn.style.display = "inline-block";
        cameraAnalyzeBtn.style.display = "inline-block";
        cameraStatus.textContent = "📸 Photo loaded! Click 'Analyze Calories' to continue.";
      };
      reader.readAsDataURL(file);
    }
  });

  async function openCamera() {
    cameraOverlay.classList.add("active");
    cameraFeed.style.display = "block";
    cameraPreview.style.display = "none";
    cameraCaptureBtn.style.display = "inline-block";
    cameraRetakeBtn.style.display = "none";
    cameraAnalyzeBtn.style.display = "none";
    cameraStatus.textContent = "Initializing camera...";

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      cameraFeed.srcObject = cameraStream;
      cameraStatus.textContent = "📷 Point your camera at the food and tap Capture!";
    } catch (err) {
      console.error("Camera error:", err);
      cameraStatus.textContent = "❌ Camera not available. Try uploading a photo instead.";
      cameraFeed.style.display = "none";
    }
  }

  function closeCamera() {
    cameraOverlay.classList.remove("active");
    if (cameraStream) {
      cameraStream.getTracks().forEach(function (track) { track.stop(); });
      cameraStream = null;
    }
  }

  function capturePhoto() {
    const ctx = cameraCanvas.getContext("2d");
    cameraCanvas.width = cameraFeed.videoWidth;
    cameraCanvas.height = cameraFeed.videoHeight;
    ctx.drawImage(cameraFeed, 0, 0);

    cameraPreview.src = cameraCanvas.toDataURL("image/jpeg");
    cameraFeed.style.display = "none";
    cameraPreview.style.display = "block";
    cameraCaptureBtn.style.display = "none";
    cameraRetakeBtn.style.display = "inline-block";
    cameraAnalyzeBtn.style.display = "inline-block";
    cameraStatus.textContent = "📸 Photo captured! Click 'Analyze Calories' to continue.";
  }

  function retakePhoto() {
    cameraFeed.style.display = "block";
    cameraPreview.style.display = "none";
    cameraCaptureBtn.style.display = "inline-block";
    cameraRetakeBtn.style.display = "none";
    cameraAnalyzeBtn.style.display = "none";
    cameraStatus.textContent = "📷 Point your camera at the food and tap Capture!";
  }

  async function analyzePhoto() {
    cameraStatus.textContent = "🔍 Analyzing food... (this may take a moment)";
    cameraAnalyzeBtn.disabled = true;

    try {
      // Ensure the preview image is loaded
      const img = cameraPreview;
      if (!img.complete) {
        await new Promise(function (resolve) { img.onload = resolve; });
      }

      const result = await FoodAnalyzer.analyzeImage(img);

      // Close camera and show result in chat
      closeCamera();

      // Show the captured image in chat
      appendUserMessage("📸 [Food photo scanned]");
      appendBotMessage(result.text, result.suggestions);
      speakText(result.text);

    } catch (err) {
      console.error("Analysis error:", err);
      cameraStatus.textContent = "❌ Analysis failed. Try again or type the food name.";
    }

    cameraAnalyzeBtn.disabled = false;
  }

})();
