// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ===== SCROLL ANIMATIONS (INTERSECTION OBSERVER) =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
let currentIndex = 0;

function updateLightboxContent(index) {
  if (!lightboxImg || !lightboxTitle) return;
  const item = galleryItems[index];
  const img = item.querySelector('img').src;
  const title = item.dataset.title;
  
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = img;
    lightboxTitle.textContent = title;
    lightboxImg.style.opacity = '1';
  }, 200);
}

if (lightbox) {
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      currentIndex = i;
      updateLightboxContent(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; 
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300); 
  }

  const lightboxClose = document.getElementById('lightboxClose');
  if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  const btnPrev = document.getElementById('lightboxPrev');
  if(btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent(currentIndex);
    });
  }

  const btnNext = document.getElementById('lightboxNext');
  if(btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightboxContent(currentIndex);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && btnPrev) btnPrev.click();
    if (e.key === 'ArrowRight' && btnNext) btnNext.click();
  });
}

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    
    const fields = [
      { el: document.getElementById('name'), check: v => v.trim().length > 0 },
      { el: document.getElementById('email'), check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { el: document.getElementById('message'), check: v => v.trim().length > 0 }
    ];
    
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    document.getElementById('formSuccess').classList.remove('show');

    fields.forEach(({ el, check }) => {
      if (!el) return;
      if (!check(el.value)) { 
        el.closest('.form-group').classList.add('error'); 
        valid = false; 
      }
    });

    if (valid) {
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        document.getElementById('formSuccess').classList.add('show');
        e.target.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        setTimeout(() => {
          document.getElementById('formSuccess').classList.remove('show');
        }, 5000);
      }, 1000);
    }
  });
}

// ===== NEWSLETTER =====
const newsletterForm = document.querySelector('.newsletter-form form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Subscribed! ✓';
    btn.style.backgroundColor = 'var(--green)';
    
    setTimeout(() => { 
      btn.textContent = originalText; 
      btn.style.backgroundColor = '';
      e.target.reset(); 
    }, 3000);
  });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 150; 
  
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});

// ===== WOW FACTOR: CUSTOM CURSOR & CARD GLOW =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateCursor() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;
    
    outlineX += distX * 0.15; // Smooth easing
    outlineY += distY * 0.15;
    
    cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover states to interactive elements
  const interactables = document.querySelectorAll('a, button, .gallery-item, input, textarea, select');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Card Glow Tracker
const glowCards = document.querySelectorAll('.glow-card');
glowCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ===== MEMBER LOGIN SIMULATION =====
const loginForm = document.getElementById('memberLoginForm');
const portalLogin = document.getElementById('portalLogin');
const portalDashboard = document.getElementById('portalDashboard');
const portalTitle = document.getElementById('portalTitle');
const portalSubtitle = document.getElementById('portalSubtitle');
const loginUser = document.getElementById('loginUser');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Authenticating...';
    btn.disabled = true;
    
    setTimeout(() => {
      const username = loginUser.value.trim() || 'Member';
      portalLogin.style.display = 'none';
      portalDashboard.style.display = 'flex';
      
      portalTitle.innerHTML = `Welcome back, <span class="highlight">${username}</span>`;
      portalSubtitle.innerHTML = "Here is your personal dashboard for today.";
      
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1200);
  });
}

// ===== MEMBER PORTAL TABS =====
const portalTabs = document.querySelectorAll('.portal-tab');
const portalPanes = document.querySelectorAll('.portal-pane');

portalTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all
    portalTabs.forEach(t => t.classList.remove('active'));
    portalPanes.forEach(p => p.classList.remove('active'));
    
    // Add active class to clicked
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ===== MEMBER COMMUNITY CHAT SIMULATION =====
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const communityChat = document.getElementById('communityChat');

if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Add user message
    const msgHTML = `
      <div class="message me">
        <div class="msg-content">
          <div class="msg-author">You</div>
          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;
    communityChat.insertAdjacentHTML('beforeend', msgHTML);
    chatInput.value = '';
    communityChat.scrollTop = communityChat.scrollHeight;
    
    // Simulate someone replying after 2 seconds
    setTimeout(() => {
      const replyHTML = `
        <div class="message">
          <div class="msg-avatar" style="background: var(--green);">N</div>
          <div class="msg-content">
            <div class="msg-author">Neha (Coach)</div>
            <div class="msg-text">Awesome! Keep pushing hard! 💪</div>
          </div>
        </div>
      `;
      communityChat.insertAdjacentHTML('beforeend', replyHTML);
      communityChat.scrollTop = communityChat.scrollHeight;
    }, 2000);
  });
}

// ===== AI CHATBOT (POWERED BY NLP ENGINE & TENSORFLOW) =====
const aiToggle = document.getElementById('aiToggle');
const aiWindow = document.getElementById('aiWindow');
const aiClose = document.getElementById('aiClose');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');
const aiMessages = document.getElementById('aiMessages');
const aiTyping = document.getElementById('aiTyping');

// Feature Elements
const aiMicBtn = document.getElementById('aiMicBtn');
const aiVoiceToggle = document.getElementById('aiVoiceToggle');
const aiCameraBtn = document.getElementById('aiCameraBtn');
const aiCameraModal = document.getElementById('aiCameraModal');
const aiCameraClose = document.getElementById('aiCameraClose');
const aiCameraFeed = document.getElementById('aiCameraFeed');
const aiCameraCanvas = document.getElementById('aiCameraCanvas');
const aiCameraPreview = document.getElementById('aiCameraPreview');
const aiCameraStatus = document.getElementById('aiCameraStatus');
const aiCameraCapture = document.getElementById('aiCameraCapture');
const aiCameraRetake = document.getElementById('aiCameraRetake');
const aiCameraAnalyze = document.getElementById('aiCameraAnalyze');

let voiceEnabled = false;
let stream = null;

if (aiToggle && aiWindow && typeof GymChatBot !== 'undefined') {
  // Initialize the engine
  GymChatBot.init({
    typingDelay: 200,
    enableContext: true,
    enableSuggestions: true,
    onTypingStart: function () {
      aiTyping.classList.add('show');
      aiMessages.scrollTop = aiMessages.scrollHeight;
    },
    onTypingEnd: function () {
      aiTyping.classList.remove('show');
    }
  });

  aiToggle.addEventListener('click', () => {
    aiWindow.classList.add('open');
    aiInput.focus();
  });
  
  aiClose.addEventListener('click', () => {
    aiWindow.classList.remove('open');
    if (stream) stopCamera();
  });
  
  // Voice Output Toggle
  aiVoiceToggle.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    aiVoiceToggle.style.color = voiceEnabled ? '#00e676' : '';
  });
  
  function speak(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/[*_]/g, '');
    const msg = new SpeechSynthesisUtterance(cleanText);
    msg.rate = 1.0;
    msg.pitch = 1.0;
    window.speechSynthesis.speak(msg);
  }

  // Voice Input (SpeechRecognition)
  let recognition;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      aiMicBtn.classList.add('recording');
      aiInput.placeholder = "Listening...";
    };
    
    recognition.onresult = (e) => {
      aiInput.value = e.results[0][0].transcript;
      aiForm.dispatchEvent(new Event('submit'));
    };
    
    recognition.onerror = () => {
      aiMicBtn.classList.remove('recording');
      aiInput.placeholder = "Type or ask...";
    };
    
    recognition.onend = () => {
      aiMicBtn.classList.remove('recording');
      aiInput.placeholder = "Type or ask...";
    };
    
    aiMicBtn.addEventListener('click', () => {
      if (aiMicBtn.classList.contains('recording')) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    aiMicBtn.style.display = 'none';
  }

  // Camera Overlay Logic
  aiCameraBtn.addEventListener('click', async () => {
    aiCameraModal.classList.add('active');
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      aiCameraFeed.srcObject = stream;
      aiCameraFeed.style.display = 'block';
      aiCameraPreview.style.display = 'none';
      aiCameraCapture.style.display = 'block';
      aiCameraRetake.style.display = 'none';
      aiCameraAnalyze.style.display = 'none';
      aiCameraStatus.textContent = "Point camera at food and capture.";
    } catch (err) {
      aiCameraStatus.textContent = "Camera access denied or unavailable.";
      aiCameraCapture.style.display = 'none';
    }
  });
  
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    aiCameraModal.classList.remove('active');
  }
  
  aiCameraClose.addEventListener('click', stopCamera);
  
  aiCameraCapture.addEventListener('click', () => {
    aiCameraCanvas.width = aiCameraFeed.videoWidth;
    aiCameraCanvas.height = aiCameraFeed.videoHeight;
    aiCameraCanvas.getContext('2d').drawImage(aiCameraFeed, 0, 0);
    aiCameraPreview.src = aiCameraCanvas.toDataURL('image/jpeg');
    
    aiCameraFeed.style.display = 'none';
    aiCameraPreview.style.display = 'block';
    
    aiCameraCapture.style.display = 'none';
    aiCameraRetake.style.display = 'block';
    aiCameraAnalyze.style.display = 'block';
    aiCameraStatus.textContent = "Photo captured! Ready to analyze.";
  });
  
  aiCameraRetake.addEventListener('click', () => {
    aiCameraFeed.style.display = 'block';
    aiCameraPreview.style.display = 'none';
    aiCameraCapture.style.display = 'block';
    aiCameraRetake.style.display = 'none';
    aiCameraAnalyze.style.display = 'none';
    aiCameraStatus.textContent = "Point camera at food and capture.";
  });
  
  aiCameraAnalyze.addEventListener('click', async () => {
    aiCameraStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing with MobileNet...';
    aiCameraAnalyze.disabled = true;
    aiCameraRetake.disabled = true;
    
    try {
      const result = await FoodAnalyzer.analyzeImage(aiCameraPreview);
      stopCamera();
      
      const userMsg = document.createElement('div');
      userMsg.className = 'ai-message user';
      userMsg.innerHTML = `<img src="${aiCameraPreview.src}" style="width:100%;border-radius:8px;margin-bottom:8px;"> Scan this food.`;
      aiMessages.insertBefore(userMsg, aiTyping);
      aiMessages.scrollTop = aiMessages.scrollHeight;
      
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message bot';
      botMsg.innerHTML = renderMarkdownLite(result.text);
      aiMessages.insertBefore(botMsg, aiTyping);
      aiMessages.scrollTop = aiMessages.scrollHeight;
      
      speak(result.text);
      
    } catch (e) {
      aiCameraStatus.textContent = "Analysis failed. Try again.";
    } finally {
      aiCameraAnalyze.disabled = false;
      aiCameraRetake.disabled = false;
    }
  });

  // Markdown lite renderer for the smooth UI
  function renderMarkdownLite(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^[•\-]\s+(.+)$/gm, "<li>$1</li>")
      .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
      .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul style='padding-left:20px;margin:8px 0;'>$1</ul>")
      .replace(/\[video:(https?:\/\/[^\]]+)\]/g, '<div class="video-embed"><iframe src="$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>')
      .replace(/\[image:(https?:\/\/[^\]]+)\]/g, '<div class="image-embed"><img src="$1" alt="Reference" loading="lazy"></div>')
      .replace(/\n/g, "<br>");
  }

  aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = aiInput.value.trim();
    if (!text) return;
    
    // Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message user';
    userMsg.textContent = text;
    aiMessages.insertBefore(userMsg, aiTyping);
    
    aiInput.value = '';
    aiMessages.scrollTop = aiMessages.scrollHeight;
    
    // Send to GymChatBot engine
    GymChatBot.send(text).then(function(result) {
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message bot';
      botMsg.innerHTML = renderMarkdownLite(result.text);
      
      // Render Suggestions if any
      if (result.suggestions && result.suggestions.length > 0) {
        const suggsDiv = document.createElement('div');
        suggsDiv.className = 'ai-suggestions';
        result.suggestions.forEach(s => {
          const btn = document.createElement('button');
          btn.className = 'suggestion-chip';
          btn.textContent = s;
          btn.onclick = () => { aiInput.value = s; aiForm.dispatchEvent(new Event('submit')); };
          suggsDiv.appendChild(btn);
        });
        botMsg.appendChild(suggsDiv);
      }
      
      aiMessages.insertBefore(botMsg, aiTyping);
      aiMessages.scrollTop = aiMessages.scrollHeight;
      
      speak(result.text);
    });
  });
}

// ===== PRELOADER & SCROLL PROGRESS =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => { preloader.classList.add('hide'); }, 800);
  }
});

const scrollProgressBar = document.getElementById('scrollProgressBar');
window.addEventListener('scroll', () => {
  if (scrollProgressBar) {
    const scrollPos = document.documentElement.scrollTop;
    const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollVal = Math.round((scrollPos * 100) / calcHeight);
    scrollProgressBar.style.width = scrollVal + "%";
  }
});

// ===== HERO VIDEO PARALLAX =====
const heroVideoBg = document.querySelector('.hero-video-bg');
window.addEventListener('scroll', () => {
  if (heroVideoBg) {
    const scrollY = window.scrollY;
    heroVideoBg.style.transform = `translateY(${scrollY * 0.4}px)`;
  }
});

// ===== FITNESS CALCULATOR =====
const calcWeight = document.getElementById('calcWeight');
const calcHeight = document.getElementById('calcHeight');
const calcAge = document.getElementById('calcAge');
const calcActivity = document.getElementById('calcActivity');

const valWeight = document.getElementById('valWeight');
const valHeight = document.getElementById('valHeight');
const valAge = document.getElementById('valAge');

const calcCalories = document.getElementById('calcCalories');
const calcProtein = document.getElementById('calcProtein');
const calcCarbs = document.getElementById('calcCarbs');
const calcFats = document.getElementById('calcFats');

function updateCalculator() {
  if (!calcWeight) return;
  
  const weight = parseFloat(calcWeight.value);
  const height = parseFloat(calcHeight.value);
  const age = parseFloat(calcAge.value);
  const activity = parseFloat(calcActivity.value);
  
  valWeight.textContent = weight;
  valHeight.textContent = height;
  valAge.textContent = age;
  
  // Mifflin-St Jeor Equation (Average for male/female mix)
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  const tdee = Math.round(bmr * activity);
  
  calcCalories.textContent = tdee.toLocaleString();
  
  // Macro Split (Roughly 30% P, 40% C, 30% F)
  const protein = Math.round((tdee * 0.3) / 4);
  const carbs = Math.round((tdee * 0.4) / 4);
  const fats = Math.round((tdee * 0.3) / 9);
  
  calcProtein.textContent = protein + 'g';
  calcCarbs.textContent = carbs + 'g';
  calcFats.textContent = fats + 'g';
}

if (calcWeight) {
  [calcWeight, calcHeight, calcAge, calcActivity].forEach(el => {
    el.addEventListener('input', updateCalculator);
  });
  updateCalculator();
}

// ===== DYNAMIC PRICING TOGGLE =====
const pricingToggle = document.getElementById('pricingToggle');
const priceVals = document.querySelectorAll('.price-val');
const labelMonthly = document.getElementById('labelMonthly');
const labelAnnually = document.getElementById('labelAnnually');

if (pricingToggle) {
  pricingToggle.addEventListener('change', (e) => {
    const isAnnual = e.target.checked;
    
    labelMonthly.classList.toggle('active', !isAnnual);
    labelAnnually.classList.toggle('active', isAnnual);
    
    priceVals.forEach(el => {
      el.classList.add('updating');
      setTimeout(() => {
        const val = isAnnual ? el.dataset.annual : el.dataset.monthly;
        el.textContent = parseInt(val).toLocaleString();
        el.classList.remove('updating');
      }, 300);
    });
  });
}

// ===== INTERACTIVE FLOORPLAN =====
const floorplanZones = document.querySelectorAll('.floorplan-map .zone');
const fpPreviewImg = document.getElementById('fpPreviewImg');
const fpOverlayText = document.getElementById('fpOverlayText');

if (floorplanZones.length > 0) {
  floorplanZones.forEach(zone => {
    zone.addEventListener('mouseenter', () => {
      const src = zone.dataset.preview;
      const text = zone.textContent;
      
      fpPreviewImg.style.opacity = '0.5';
      setTimeout(() => {
        fpPreviewImg.src = src;
        fpOverlayText.textContent = text;
        fpPreviewImg.style.opacity = '1';
      }, 150);
    });
  });
}
