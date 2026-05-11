// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
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
  if (e.key === 'ArrowLeft') btnPrev.click();
  if (e.key === 'ArrowRight') btnNext.click();
});

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

// ===== AI CHATBOT =====
const aiToggle = document.getElementById('aiToggle');
const aiWindow = document.getElementById('aiWindow');
const aiClose = document.getElementById('aiClose');
const aiForm = document.getElementById('aiForm');
const aiInput = document.getElementById('aiInput');
const aiMessages = document.getElementById('aiMessages');

if (aiToggle && aiWindow) {
  aiToggle.addEventListener('click', () => {
    aiWindow.classList.add('open');
    aiInput.focus();
  });
  
  aiClose.addEventListener('click', () => {
    aiWindow.classList.remove('open');
  });
  
  // Basic FAQ AI Logic
  const getAIResponse = (input) => {
    const text = input.toLowerCase();
    if (text.includes('hour') || text.includes('time')) return "We are open 24/7! Our trainers are available from 6 AM to 10 PM daily.";
    if (text.includes('price') || text.includes('cost') || text.includes('fee')) return "Our plans start at ₹2,999/month for Basic, and go up to ₹7,999/month for Ultimate Elite. Check our Pricing section for details!";
    if (text.includes('trial') || text.includes('free')) return "Yes, we offer a 3-day free trial. You can book it by filling out the contact form below.";
    if (text.includes('location') || text.includes('where')) return "We are located in the heart of the city. You can find our exact address on the map below!";
    if (text.includes('hi') || text.includes('hello')) return "Hello there! How can I help you crush your fitness goals today?";
    return "I'm still learning! If you have specific questions I can't answer, please use the Contact form and our team will get back to you shortly.";
  };
  
  aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = aiInput.value.trim();
    if (!text) return;
    
    // Add User Message
    const userMsg = `<div class="ai-message user">${text}</div>`;
    aiMessages.insertAdjacentHTML('beforeend', userMsg);
    aiInput.value = '';
    aiMessages.scrollTop = aiMessages.scrollHeight;
    
    // Show typing indicator
    const typingHTML = `<div class="ai-typing show" id="typingIndicator">Typing...</div>`;
    aiMessages.insertAdjacentHTML('beforeend', typingHTML);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    
    // Simulate AI response delay
    setTimeout(() => {
      document.getElementById('typingIndicator').remove();
      const responseText = getAIResponse(text);
      const botMsg = `<div class="ai-message bot">${responseText}</div>`;
      aiMessages.insertAdjacentHTML('beforeend', botMsg);
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }, 1500);
  });
}
