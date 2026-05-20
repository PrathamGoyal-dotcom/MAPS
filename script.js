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

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone')?.value || '',
        interest: document.getElementById('interest')?.value || '',
        message: document.getElementById('message').value
      };

      fetch('http://localhost:5000/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(data => {
        document.getElementById('formSuccess').classList.add('show');
        e.target.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        setTimeout(() => {
          document.getElementById('formSuccess').classList.remove('show');
        }, 5000);
      })
      .catch(err => {
        console.error('Error:', err);
        btn.innerHTML = 'Error! Try Again';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = originalText; }, 3000);
      });
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
const registerForm = document.getElementById('memberRegisterForm');
const portalLogin = document.getElementById('portalLogin');
const portalRegister = document.getElementById('portalRegister');
const portalDashboard = document.getElementById('portalDashboard');
const portalTitle = document.getElementById('portalTitle');
const portalSubtitle = document.getElementById('portalSubtitle');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const portalLogout = document.getElementById('portalLogout');

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ===== PASSWORD VISIBILITY TOGGLE =====
document.querySelectorAll('.password-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    const icon = btn.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

// ===== PASSWORD STRENGTH CHECKER =====
const regPass = document.getElementById('regPass');
const strengthProgress = document.getElementById('strengthProgress');

if (regPass && strengthProgress) {
  regPass.addEventListener('input', () => {
    const val = regPass.value;
    let strength = 0;
    
    if (val.length >= 6) strength++;
    if (val.match(/[A-Z]/) && val.match(/[0-9]/)) strength++;
    if (val.match(/[^A-Za-z0-9]/)) strength++;
    
    strengthProgress.className = '';
    if (val.length === 0) {
      strengthProgress.style.width = '0';
    } else if (strength === 1) {
      strengthProgress.classList.add('strength-weak');
    } else if (strength === 2) {
      strengthProgress.classList.add('strength-medium');
    } else if (strength >= 3) {
      strengthProgress.classList.add('strength-strong');
    }
  });
}

// Toggle between Login and Register
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

if (showRegister) {
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    portalLogin.style.display = 'none';
    portalRegister.style.display = 'block';
    portalTitle.innerHTML = 'Member <span class="highlight">Registration</span>';
    portalSubtitle.innerHTML = 'Join the MAPS community and start your transformation.';
  });
}

if (showLogin) {
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    portalRegister.style.display = 'none';
    portalLogin.style.display = 'block';
    portalTitle.innerHTML = 'Member <span class="highlight">Login</span>';
    portalSubtitle.innerHTML = 'Access your schedule, book classes, and connect with the community.';
  });
}

// Helper to handle successful login/register
function handleAuthSuccess(user, token) {
  localStorage.setItem('maps_token', token);
  localStorage.setItem('maps_user', JSON.stringify(user));
  
  portalLogin.style.display = 'none';
  portalRegister.style.display = 'none';
  portalDashboard.style.display = 'flex';
  if (portalLogout) portalLogout.style.display = 'inline-block';
  
  portalTitle.innerHTML = `Welcome back, <span class="highlight">${user.username}</span>`;
  portalSubtitle.innerHTML = "Here is your personal dashboard for today.";
  showToast(`Welcome, ${user.username}!`, 'success');
}

// Logout Function
if (portalLogout) {
  portalLogout.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('maps_token');
    localStorage.removeItem('maps_user');
    location.reload(); // Refresh to reset state
  });
}

// Check Session on Load & Handle Registration Redirect
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('maps_token');
  const userStr = localStorage.getItem('maps_user');
  
  if (token && userStr && portalDashboard) {
    try {
      const user = JSON.parse(userStr);
      handleAuthSuccess(user, token);
    } catch (e) {
      localStorage.removeItem('maps_token');
      localStorage.removeItem('maps_user');
    }
  } else if (location.hash === '#register' && showRegister) {
    showRegister.click();
  }
});

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Authenticating...';
    btn.disabled = true;

    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginUser.value.trim(),
        password: loginPass.value
      })
    })
    .then(res => res.json())
    .then(data => {
      btn.innerHTML = originalText;
      btn.disabled = false;

      if (data.token) {
        handleAuthSuccess(data.user, data.token);
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    })
    .catch(err => {
      console.error(err);
      btn.innerHTML = originalText;
      btn.disabled = false;
      showToast('Connection error. Is the server running?', 'error');
    });
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = registerForm.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Creating Account...';
    btn.disabled = true;

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('regUser').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        password: document.getElementById('regPass').value
      })
    })
    .then(res => res.json())
    .then(data => {
      btn.innerHTML = originalText;
      btn.disabled = false;

      if (data.token) {
        handleAuthSuccess(data.user, data.token);
      } else {
        showToast(data.message || 'Registration failed', 'error');
      }
    })
    .catch(err => {
      console.error(err);
      btn.innerHTML = originalText;
      btn.disabled = false;
      showToast('Connection error. Is the server running?', 'error');
    });
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

// ===== SCHEDULE FILTERS (TODAY, TOMORROW, WEEK) =====
const scheduleFilters = document.querySelectorAll('.schedule-filters span');
const scheduleLists = document.querySelectorAll('.schedule-list');

scheduleFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    // Remove active class from all filters
    scheduleFilters.forEach(f => f.classList.remove('active'));
    // Add active class to clicked filter
    filter.classList.add('active');
    
    // Hide all lists
    scheduleLists.forEach(list => list.style.display = 'none');
    // Show targeted list
    const targetId = 'list-' + filter.dataset.filter;
    const targetList = document.getElementById(targetId);
    if (targetList) {
      targetList.style.display = 'block';
    }
  });
});

// ===== MEMBER COMMUNITY CHAT SIMULATION =====
const portalChatForm = document.getElementById('portalChatForm');
const portalChatInput = document.getElementById('portalChatInput');
const portalChatBox = document.getElementById('portalChatBox');
const portalChatTyping = document.getElementById('portalChatTyping');
const portalChatChips = document.getElementById('portalChatChips');

// Deterministic HSL gradient avatar generator
function hashAvatarColor(username) {
  const gradients = [
    'linear-gradient(135deg, #FF2D2D, #CC1111)', // Neon Red
    'linear-gradient(135deg, #FF8008, #FFC837)', // Sunset Orange
    'linear-gradient(135deg, #11998e, #38ef7d)', // Emerald Green
    'linear-gradient(135deg, #00c6ff, #0072ff)', // Electric Blue
    'linear-gradient(135deg, #8A2387, #E94057)', // Cosmic Pink/Purple
    'linear-gradient(135deg, #f857a6, #ff5858)', // Neon Rose
    'linear-gradient(135deg, #38bdf8, #0369a1)', // Sky Blue
    'linear-gradient(135deg, #f97316, #c2410c)'  // Burnt Amber
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

// Simulated active gym members/coaches list for lounge dynamics
const simulatedActors = [
  { name: 'Coach Vikram', isCoach: true, responses: {
    leg: "Leg day is mandatory! Make sure to focus on squats and proper knee tracking. See you at 6 AM! 🏋️",
    hiit: "HIIT is perfect for metabolic conditioning. Keep your rest intervals short and push to 90% HR! 🔥",
    diet: "Abs are made in the kitchen! Focus on high protein intake (1.6g-2g per kg bodyweight) and whole foods. 🥩",
    default: "Keep training hard! Squeeze every single rep and focus on that mind-muscle connection! 💪"
  }},
  { name: 'Coach Neha', isCoach: true, responses: {
    yoga: "Great to see interest in flexibility! Morning Yoga helps align breathing, posture, and core recovery. 🧘‍♀️",
    injury: "Listen to your body! If you feel joint pain, substitute with active recovery and mobility stretches. 🩹",
    default: "Consistency is your greatest superpower. Show up today, even if it's just for a recovery session! ✨"
  }},
  { name: 'Coach Arjun', isCoach: true, responses: {
    crossfit: "CrossFit builds ultimate functional power. Form first, speed second. Tomorrow we have heavy deadlifts! 🏋️‍♂️",
    default: "Excuses don't build muscle. Pack your bag, drink your water, and let's get to work! 🚀"
  }},
  { name: 'Ananya (Powerlifter)', isCoach: false, responses: {
    default: "Just hit a new PR on deadlifts today! The energy in the MAPS lounge is absolutely unmatched! 📈"
  }}
];

// Helper to append messages to UI
function appendChatMessage(msg, animate = true) {
  if (!portalChatBox) return;

  const currentUserStr = localStorage.getItem('maps_user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  
  const isMe = currentUser && currentUser.username === msg.username;
  const isCoach = msg.is_coach || msg.username.toLowerCase().includes('coach');
  const avatarColor = msg.avatar_color || hashAvatarColor(msg.username);
  const initials = msg.username.substring(0, 2).toUpperCase();

  // Parse relative/formatted timestamp
  let timestamp = 'Just now';
  if (msg.created_at) {
    const date = new Date(msg.created_at);
    timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Check if message is a system notification
  if (msg.is_system) {
    const sysHTML = `
      <div class="message system" data-msg-id="${msg.id}">
        <span>${msg.message}</span>
      </div>
    `;
    portalChatBox.insertAdjacentHTML('beforeend', sysHTML);
    portalChatBox.scrollTop = portalChatBox.scrollHeight;
    return;
  }

  // Render emoji reaction badges
  let reactionsHTML = '';
  if (msg.reactions && Object.keys(msg.reactions).length > 0) {
    reactionsHTML = `<div class="chat-reactions-display">`;
    for (const [key, count] of Object.entries(msg.reactions)) {
      if (count > 0) {
        const emoji = key === 'thumbs_up' ? '👍' : (key === 'fire' ? '🔥' : (key === 'muscle' ? '💪' : '❤️'));
        reactionsHTML += `<span class="reaction-badge" data-msg-id="${msg.id}" data-reaction="${key}">${emoji} ${count}</span>`;
      }
    }
    reactionsHTML += `</div>`;
  }

  const reactionToolbarHTML = isMe ? '' : `
    <div class="chat-reaction-toolbar">
      <button class="reaction-btn" data-msg-id="${msg.id}" data-reaction="thumbs_up">👍</button>
      <button class="reaction-btn" data-msg-id="${msg.id}" data-reaction="fire">🔥</button>
      <button class="reaction-btn" data-msg-id="${msg.id}" data-reaction="muscle">💪</button>
      <button class="reaction-btn" data-msg-id="${msg.id}" data-reaction="heart">❤️</button>
    </div>
  `;

  const msgHTML = `
    <div class="message ${isMe ? 'me' : ''} ${isCoach ? 'coach' : ''}" data-msg-id="${msg.id}" style="${animate ? '' : 'animation: none;'}">
      <div class="msg-avatar" style="background: ${avatarColor}; color: #fff;">${initials}</div>
      <div class="msg-content">
        <span class="msg-author">
          ${msg.username} 
          ${isCoach ? '<i class="fas fa-check-circle" style="color:var(--accent-primary); font-size:10px;"></i>' : ''} 
          <span style="font-size: 9px; color: var(--text-dim); margin-left: 8px; font-weight: 500;">${timestamp}</span>
        </span>
        <div class="msg-text">
          ${msg.message}
          ${reactionToolbarHTML}
        </div>
        ${reactionsHTML}
      </div>
    </div>
  `;
  
  portalChatBox.insertAdjacentHTML('beforeend', msgHTML);
  portalChatBox.scrollTop = portalChatBox.scrollHeight;
}

// Fetch historical messages from database
function loadLoungeChat() {
  if (!portalChatBox) return;
  
  // Clear hardcoded visual loaders
  portalChatBox.innerHTML = '';

  fetch('http://localhost:5000/api/chat')
    .then(res => res.json())
    .then(messages => {
      if (messages.length === 0) {
        // Append initial warm system message if database is empty
        appendChatMessage({
          id: 0,
          username: 'System',
          message: '✨ Welcome to the MAPS Gym Lounge. Start a conversation with the community!',
          is_system: true
        });
      } else {
        messages.forEach(msg => appendChatMessage(msg, false));
      }
    })
    .catch(err => {
      console.error('Error fetching lounge history:', err);
      showToast('Could not load chat history.', 'error');
    });
}

// Send user message to database
function sendLoungeMessage(text) {
  const currentUserStr = localStorage.getItem('maps_user');
  if (!currentUserStr) {
    showToast('You must be logged in to chat!', 'error');
    return;
  }

  const currentUser = JSON.parse(currentUserStr);
  const payload = {
    username: currentUser.username,
    message: text,
    isCoach: currentUser.username.toLowerCase().includes('coach'),
    avatarColor: hashAvatarColor(currentUser.username)
  };

  fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(savedMsg => {
    appendChatMessage(savedMsg);
    
    // Trigger Context-aware Coach/Member responses
    triggerLoungeInteraction(text);
  })
  .catch(err => {
    console.error('Error sending message:', err);
    showToast('Failed to deliver message.', 'error');
  });
}

// Trigger contextual simulated coach replies
function triggerLoungeInteraction(userText) {
  const normalizedText = userText.toLowerCase();
  
  // Pick random actor
  const actor = simulatedActors[Math.floor(Math.random() * simulatedActors.length)];
  
  // Determine relevant response based on keywords
  let responseText = actor.responses.default;
  for (const [key, response] of Object.entries(actor.responses)) {
    if (normalizedText.includes(key)) {
      responseText = response;
      break;
    }
  }

  // Show typing indicator
  setTimeout(() => {
    if (portalChatTyping) {
      portalChatTyping.querySelector('.typing-text').textContent = `${actor.name} is typing`;
      portalChatTyping.classList.add('show');
      portalChatBox.scrollTop = portalChatBox.scrollHeight;
    }

    // Append persistent actor message after 1.8 seconds typing state
    setTimeout(() => {
      if (portalChatTyping) portalChatTyping.classList.remove('show');
      
      const payload = {
        username: actor.name,
        message: responseText,
        isCoach: actor.isCoach,
        avatarColor: hashAvatarColor(actor.name)
      };

      fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(savedMsg => {
        appendChatMessage(savedMsg);
      })
      .catch(err => console.error(err));
    }, 1800);
  }, 1000);
}

// Handle submitting emoji reactions
function submitReaction(messageId, reactionType) {
  fetch('http://localhost:5000/api/chat/react', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageId, reactionType })
  })
  .then(res => res.json())
  .then(updatedMsg => {
    // Find target message element in UI and update reactions
    const msgElement = document.querySelector(`.message[data-msg-id="${messageId}"]`);
    if (msgElement) {
      let reactionsDisplay = msgElement.querySelector('.chat-reactions-display');
      if (!reactionsDisplay) {
        reactionsDisplay = document.createElement('div');
        reactionsDisplay.className = 'chat-reactions-display';
        msgElement.querySelector('.msg-content').appendChild(reactionsDisplay);
      }
      
      // Render badges insidereactions container
      reactionsDisplay.innerHTML = '';
      for (const [key, count] of Object.entries(updatedMsg.reactions)) {
        if (count > 0) {
          const emoji = key === 'thumbs_up' ? '👍' : (key === 'fire' ? '🔥' : (key === 'muscle' ? '💪' : '❤️'));
          reactionsDisplay.insertAdjacentHTML('beforeend', `<span class="reaction-badge" data-msg-id="${messageId}" data-reaction="${key}">${emoji} ${count}</span>`);
        }
      }
    }
  })
  .catch(err => console.error('Reaction error:', err));
}

// Bind community chat logic if form exists
if (portalChatForm) {
  portalChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = portalChatInput.value.trim();
    if (!text) return;
    
    sendLoungeMessage(text);
    portalChatInput.value = '';
  });

  // Event delegation for quick suggestion chips
  if (portalChatChips) {
    portalChatChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip');
      if (chip) {
        const text = chip.dataset.msg;
        sendLoungeMessage(text);
      }
    });
  }

  // Event delegation for reactions buttons and badges
  portalChatBox.addEventListener('click', (e) => {
    // Click on reaction toolbar buttons
    const btn = e.target.closest('.reaction-btn');
    if (btn) {
      const messageId = parseInt(btn.dataset.msgId);
      const reaction = btn.dataset.reaction;
      submitReaction(messageId, reaction);
      return;
    }

    // Click on reaction badges to increment
    const badge = e.target.closest('.reaction-badge');
    if (badge) {
      const messageId = parseInt(badge.dataset.msgId);
      const reaction = badge.dataset.reaction;
      submitReaction(messageId, reaction);
    }
  });

  // Initialize and load chat once DOM loaded
  window.addEventListener('DOMContentLoaded', () => {
    // Check if token exists to see if user is logged in
    const token = localStorage.getItem('maps_token');
    if (token) {
      loadLoungeChat();
    }
  });

  // Also hook into tab switching to reload chat when tab is opened
  document.querySelectorAll('.portal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.tab === 'chat') {
        loadLoungeChat();
      }
    });
  });

  // Simulated active community lounge background notifications
  const ambientNotificationTexts = [
    "🔥 Rohan just booked CrossFit Open tomorrow!",
    "🧘‍♀️ Neha posted a new yoga breathing sequence.",
    "🏋️ Vikram started a HIIT Burnout session in Zone 1.",
    "⚡ Arjun joined the MAPS Community Lounge.",
    "💪 Ananya hit a new personal record on squat bench!"
  ];

  setInterval(() => {
    // Randomly choose to append an ambient notification if community tab is active
    const activeTab = document.querySelector('.portal-tab.active');
    if (activeTab && activeTab.dataset.tab === 'chat') {
      const isNotification = Math.random() > 0.45;
      if (isNotification) {
        const notifyMsg = ambientNotificationTexts[Math.floor(Math.random() * ambientNotificationTexts.length)];
        appendChatMessage({
          id: Date.now(),
          username: 'System',
          message: notifyMsg,
          is_system: true
        });
      }
    }
  }, 40000); // Trigger every 40 seconds of active lounge session
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

// ===== CLASS & PLAN BOOKING SYSTEM & CHECKOUT =====
const checkoutModal = document.getElementById('checkoutModal');
const checkoutSection = document.getElementById('checkoutSection');
const closeCheckout = document.getElementById('closeCheckout');
const cancelCheckout = document.getElementById('cancelCheckout');
const checkoutClassName = document.getElementById('checkoutClassName');
const checkoutBasePrice = document.getElementById('checkoutBasePrice');
const checkoutTax = document.getElementById('checkoutTax');
const checkoutTotal = document.getElementById('checkoutTotal');
const paymentForm = document.getElementById('paymentForm');
const payName = document.getElementById('payName');
const payEmail = document.getElementById('payEmail');

let activeBookingBtn = null;
let currentPrice = 0;

document.addEventListener('click', (e) => {
  // Handle Class Booking
  if (e.target.classList.contains('book-class-btn')) {
    const btn = e.target;
    const isBooked = btn.classList.contains('btn-orange');
    
    if (!isBooked) {
      activeBookingBtn = btn;
      const className = btn.closest('.schedule-item').querySelector('h4').textContent;
      
      // Instant Booking logic
      btn.classList.remove('btn-white');
      btn.classList.add('btn-orange');
      btn.innerHTML = '<i class="fas fa-check"></i> Booked';
      
      // Animation effect
      btn.style.transform = 'scale(1.1)';
      setTimeout(() => btn.style.transform = '', 200);
      
      showToast(`Successfully booked ${className}!`, 'success');

      // Notify backend of booking (simulated with 0 amount)
      const user = JSON.parse(localStorage.getItem('maps_user')) || { username: 'Guest', email: 'guest@example.com' };
      fetch('http://localhost:5000/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user,
          className: className,
          amount: 0,
          status: 'Booked (Instant)'
        })
      }).catch(err => console.error('Booking Notification Error:', err));

      activeBookingBtn = null;
    } else {
      btn.classList.remove('btn-orange');
      btn.classList.add('btn-white');
      btn.innerHTML = 'Book';
      showToast('Booking cancelled.', 'info');
    }
  }

  // Handle Membership Plan Purchase
  if (e.target.classList.contains('plan-buy-btn')) {
    const btn = e.target;
    activeBookingBtn = btn;
    const planName = btn.dataset.plan;
    currentPrice = parseInt(btn.dataset.price);
    openCheckout(planName, currentPrice);
  }
});

function openCheckout(name, price) {
  updateCheckoutUI(name, price);
  
  if (checkoutModal) {
    checkoutModal.classList.add('active');
  } else if (checkoutSection) {
    checkoutSection.style.display = 'block';
    checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Trigger reveal manually if observer didn't catch it
    const revealEl = checkoutSection.querySelector('.reveal');
    if (revealEl) revealEl.classList.add('active');
  }
}

function updateCheckoutUI(name, price) {
  if (checkoutClassName) checkoutClassName.textContent = name;
  if (checkoutBasePrice) checkoutBasePrice.textContent = `₹${price.toLocaleString()}`;
  
  const tax = Math.round(price * 0.18);
  const total = price + tax;
  
  if (checkoutTax) checkoutTax.textContent = `₹${tax.toLocaleString()}`;
  if (checkoutTotal) checkoutTotal.textContent = `₹${total.toLocaleString()}`;
  
  const user = JSON.parse(localStorage.getItem('maps_user'));
  if (user) {
    if (payName) payName.value = user.username;
    if (payEmail) payEmail.value = user.email;
  }
}

if (closeCheckout) {
  closeCheckout.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
  });
}

if (cancelCheckout) {
  cancelCheckout.addEventListener('click', () => {
    if (checkoutSection) {
      checkoutSection.style.display = 'none';
      document.getElementById('membership').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ===== PAYMENT METHOD TOGGLE =====
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
const cardPaymentFields = document.getElementById('cardPaymentFields');
const upiPaymentFields = document.getElementById('upiPaymentFields');
const payCardNumber = document.getElementById('payCardNumber');
const payCardExpiry = document.getElementById('payCardExpiry');
const payCardCvv = document.getElementById('payCardCvv');
const payUpiId = document.getElementById('payUpiId');

if (paymentMethods.length > 0) {
  paymentMethods.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'upi') {
        if(cardPaymentFields) cardPaymentFields.style.display = 'none';
        if(upiPaymentFields) upiPaymentFields.style.display = 'block';
        
        if(payCardNumber) payCardNumber.removeAttribute('required');
        if(payCardExpiry) payCardExpiry.removeAttribute('required');
        if(payCardCvv) payCardCvv.removeAttribute('required');
        if(payUpiId) payUpiId.setAttribute('required', 'true');
      } else {
        if(cardPaymentFields) cardPaymentFields.style.display = 'block';
        if(upiPaymentFields) upiPaymentFields.style.display = 'none';
        
        if(payCardNumber) payCardNumber.setAttribute('required', 'true');
        if(payCardExpiry) payCardExpiry.setAttribute('required', 'true');
        if(payCardCvv) payCardCvv.setAttribute('required', 'true');
        if(payUpiId) payUpiId.removeAttribute('required');
      }
    });
  });
}

if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = paymentForm.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing Payment...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      if (checkoutModal) checkoutModal.classList.remove('active');
      if (checkoutSection) checkoutSection.style.display = 'none';
      
      paymentForm.reset();
      
      const user = JSON.parse(localStorage.getItem('maps_user')) || {
        username: payName?.value || 'Guest',
        email: payEmail?.value || 'guest@example.com'
      };
      const itemName = checkoutClassName.textContent;

      fetch('http://localhost:5000/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user,
          className: itemName,
          amount: currentPrice + Math.round(currentPrice * 0.18),
          status: 'Completed'
        })
      }).catch(err => console.error('Notification Error:', err));

      if (activeBookingBtn) {
        if (activeBookingBtn.classList.contains('book-class-btn')) {
          activeBookingBtn.classList.remove('btn-white');
          activeBookingBtn.classList.add('btn-orange');
          activeBookingBtn.innerHTML = '<i class="fas fa-check"></i> Booked';
        } else {
          showToast(`Welcome to ${itemName}!`, 'success');
        }
        
        activeBookingBtn.style.transform = 'scale(1.1)';
        setTimeout(() => activeBookingBtn.style.transform = '', 200);
        
        showToast('Payment successful! Transaction complete.', 'success');
        activeBookingBtn = null;
      }
    }, 2000);
  });
}
