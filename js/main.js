// Main application initialization and global functionality
class SephyxApp {
  constructor() {
    this.isLoaded = false;
    this.router = null;
    this.shop = null;
    this.savedFits = null;
    this.vault = null;
    this.account = null;
    this.chatbot = null;
    this.particles = null;
    
    this.init();
  }

  async init() {
    // Initialize loader
    this.showLoader();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  onDOMReady() {
    // Initialize all components
    this.initializeComponents();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize animations
    this.initializeAnimations();
    
    // Setup custom cursor
    this.initializeCursor();
    
    // Hide loader after everything is ready
    setTimeout(() => {
      this.hideLoader();
    }, 3000);
  }

  initializeComponents() {
    // Initialize router
    this.router = new Router();
    
    // Initialize wishlist first (needed by shop)
    this.wishlist = window.SephyxWishlist;
    
    // Initialize shop
    this.shop = new Shop();
    
    // Initialize saved fits
    this.savedFits = new SavedFits();
    
    // Initialize vault
    this.vault = new Vault();
    
    // Initialize account
    this.account = new Account();
    
    // Initialize chatbot
    this.chatbot = new Chatbot();
    
    // Initialize particles
    this.particles = new ParticleSystem();
    
    // Initialize cyberpunk features
    this.cyber = window.SephyxCyber;
  }

  setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('href').substring(1);
        this.router.navigate(route);
        this.updateActiveNavLink(link);
      });
    });

    // Hero CTA
    const enterVaultBtn = document.getElementById('enterVaultBtn');
    if (enterVaultBtn) {
      enterVaultBtn.addEventListener('click', () => {
        this.router.navigate('shop');
        this.updateActiveNavLink(document.querySelector('[href="#shop"]'));
      });
    }

    // Cart functionality
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');

    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
      });
    }

    if (cartClose) {
      cartClose.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
      });
    }

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
        cartSidebar.classList.remove('open');
      }
    });

    // Modal functionality
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modals/sidebars
        modal?.classList.remove('active');
        cartSidebar?.classList.remove('open');
        this.chatbot?.minimize();
      }
    });

    // Scroll effects
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Resize handler
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    activeLink.classList.add('active');
  }

  initializeAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Only animate if elements exist
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    if (heroTitle) {
      gsap.from(heroTitle, {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: "power3.out",
        delay: 0.5
      });
    }

    if (heroSubtitle) {
      gsap.from(heroSubtitle, {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power2.out",
        delay: 1
      });
    }

    if (heroCta) {
      gsap.from(heroCta, {
        duration: 0.8,
        scale: 0.8,
        opacity: 0,
        ease: "back.out(1.7)",
        delay: 1.5
      });
    }

    // Animate glitch text if it exists
    const glitchTexts = document.querySelectorAll('.glitch-text-container .glitch-text');
    if (glitchTexts.length > 0) {
      glitchTexts.forEach((text, index) => {
        gsap.from(text, {
          duration: 0.5,
          x: -100,
          opacity: 0,
          ease: "power2.out",
          delay: index * 0.2
        });
      });
    }

    // Animate navigation
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      gsap.from(navbar, {
        duration: 1,
        y: -100,
        ease: "power2.out",
        delay: 0.2
      });
    }

    // Setup scroll-triggered animations
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    // Animate elements on scroll only if they exist
    const animateElements = document.querySelectorAll('.page-title, .product-card, .chapter, .badge');
    
    if (animateElements.length > 0) {
      animateElements.forEach(element => {
        if (element) {
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: "power2.out"
          });
        }
      });
    }

    // Parallax effects
    const parallaxElements = document.querySelectorAll('.hero-bg-img, .chapter-bg img');
    
    parallaxElements.forEach(element => {
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        y: -100,
        ease: "none"
      });
    });
  }

  initializeCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorRing = document.querySelector('.cursor-ring');
    
    if (!cursor || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth cursor movement
    const updateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      requestAnimationFrame(updateCursor);
    };
    
    updateCursor();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .chapter');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(2)';
        cursorRing.style.borderColor = 'var(--accent-cyan)';
      });
      
      element.addEventListener('mouseleave', () => {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.borderColor = 'var(--accent-gold)';
      });
    });

    // Hide cursor on touch devices
    document.addEventListener('touchstart', () => {
      cursor.style.display = 'none';
    });
  }

  showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'flex';
    }
  }

  hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      gsap.to(loader, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
          loader.style.display = 'none';
          this.isLoaded = true;
          this.onAppReady();
        }
      });
    }
  }

  onAppReady() {
    // App is fully loaded and ready
    console.log('🔮 SEPHYX System Online');
    
    // Start particles
    this.particles.start();
    
    // Initialize route
    this.router.init();
    
    // Load saved data
    this.loadSavedData();
    
    // Start background effects
    this.startBackgroundEffects();
  }

  loadSavedData() {
    // Load cart
    this.shop.loadCart();
    
    // Load saved fits
    this.savedFits.loadFits();
    
    // Load account data
    this.account.loadProfile();
    
    // Update cart count
    this.updateCartCount();
  }

  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const cart = this.shop.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  startBackgroundEffects() {
    // Random glitch effects
    setInterval(() => {
      this.triggerRandomGlitch();
    }, 15000);

    // Update countdown timer
    this.updateCountdown();
    setInterval(() => {
      this.updateCountdown();
    }, 60000);
  }

  triggerRandomGlitch() {
    const glitchElements = document.querySelectorAll('.page-title, .hero-title, .nav-logo');
    const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
    
    if (randomElement) {
      randomElement.classList.add('animate-text-glitch');
      setTimeout(() => {
        randomElement.classList.remove('animate-text-glitch');
      }, 500);
    }
  }

  updateCountdown() {
    const countdownTimer = document.getElementById('countdownTimer');
    if (!countdownTimer) return;

    // Calculate time until next "drop" (fictional date)
    const now = new Date();
    const nextDrop = new Date(now.getTime() + (12 * 24 * 60 * 60 * 1000)); // 12 days from now
    const timeLeft = nextDrop - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    countdownTimer.textContent = `${days}D:${hours.toString().padStart(2, '0')}H:${minutes.toString().padStart(2, '0')}M`;
  }

  handleScroll() {
    const scrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    // Update navbar background opacity based on scroll
    if (navbar) {
      const opacity = Math.min(scrollY / 100, 1);
      navbar.style.background = `rgba(26, 26, 26, ${opacity * 0.9})`;
    }
  }

  handleResize() {
    // Update particles on resize
    if (this.particles) {
      this.particles.handleResize();
    }
    
    // Update any responsive animations
    ScrollTrigger.refresh();
  }

  // Utility methods
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      color: var(--text-primary);
      backdrop-filter: blur(20px);
      z-index: 5000;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Storage utilities
  saveToStorage(key, data) {
    try {
      localStorage.setItem(`sephyx_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(`sephyx_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from storage:', error);
      return null;
    }
  }
}

// CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .notification-icon {
    color: var(--accent-gold);
    font-weight: bold;
  }
  
  .notification-success .notification-icon {
    color: #00ff00;
  }
  
  .notification-error .notification-icon {
    color: #ff0000;
  }
`;
document.head.appendChild(notificationStyles);

// Initialize the application
const app = new SephyxApp();

// Export for global access
window.SephyxApp = app;
