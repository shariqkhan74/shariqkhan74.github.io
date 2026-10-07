// 1. Dynamic Copyright Year
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Header Scroll Effect
const mainHeader = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
}, { passive: true });

// 3. Mobile Navigation Drawer Toggle
const navToggle = document.getElementById('navToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileMenu() {
  mobileDrawer.classList.add('open');
  mobileBackdrop.classList.add('open');
  mobileDrawer.setAttribute('aria-hidden', 'false');
  mobileBackdrop.setAttribute('aria-hidden', 'false');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileDrawer.classList.remove('open');
  mobileBackdrop.classList.remove('open');
  mobileDrawer.setAttribute('aria-hidden', 'true');
  mobileBackdrop.setAttribute('aria-hidden', 'true');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  if (mobileDrawer.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

if (drawerCloseBtn) {
  drawerCloseBtn.addEventListener('click', closeMobileMenu);
}
mobileBackdrop.addEventListener('click', closeMobileMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// 4. Active Section Highlight on Scroll (ScrollSpy)
const sections = document.querySelectorAll('section[id]');
const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .mobile-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const currentId = entry.target.getAttribute('id');

      desktopNavLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileNavLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(sec => sectionObserver.observe(sec));

// 5. Scroll Reveal Elements Animation
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// 6. Animate Progress Bars on Scroll into View
const metricsPanel = document.getElementById('metricsPanel');
const progressFills = document.querySelectorAll('.progress-fill');

if (metricsPanel) {
  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressFills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-percentage') || '80%';
          fill.style.width = targetWidth;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  progressObserver.observe(metricsPanel);
}

// 7. Project Filtering Mechanism
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filterVal = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (filterVal === 'all' || cardCategory === filterVal) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 250);
      }
    });
  });
});

// 8. Custom Toast Notification Helper
function showToast(message, duration = 3500) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 9. Copy to Clipboard Functionality
function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopyText(text, successMsg);
    });
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    prompt('Copy to clipboard:', text);
  }
  textArea.remove();
}

// 10. Contact Form Handler (Client validation + mailto redirect)
function handleFormSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subjectVal = subjectInput.value.trim() || 'Portfolio Project Inquiry';
  const message = messageInput.value.trim();

  if (!name || !email || !message) {
    showToast('Please fill out all required fields.');
    return false;
  }

  showToast('Opening your email client...');

  const emailSubject = encodeURIComponent(`[Portfolio Contact] ${subjectVal} - from ${name}`);
  const emailBody = encodeURIComponent(`Hello Mohd Shariq,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent from Portfolio Website`);

  setTimeout(() => {
    window.location.href = `mailto:shariqkhan435@gmail.com?subject=${emailSubject}&body=${emailBody}`;
  }, 500);

  return false;
}
