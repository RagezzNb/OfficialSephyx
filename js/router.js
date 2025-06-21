// Client-side router for single-page navigation
class Router {
  constructor() {
    this.routes = {
      'home': 'home',
      'shop': 'shop',
      'fits': 'fits',
      'vault': 'vault',
      'lookbook': 'lookbook',
      'account': 'account',
      'contact': 'contact'
    };
    
    this.currentRoute = 'home';
    this.pages = {};
    
    // Cache page elements
    this.cachePages();
  }

  cachePages() {
    Object.keys(this.routes).forEach(route => {
      this.pages[route] = document.getElementById(route);
    });
  }

  init() {
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      const route = e.state?.route || 'home';
      this.showPage(route, false);
    });

    // Set initial route
    const hash = window.location.hash.substring(1);
    const initialRoute = this.routes[hash] ? hash : 'home';
    this.navigate(initialRoute, true);
  }

  navigate(route, replace = false) {
    if (!this.routes[route]) {
      console.warn(`Route "${route}" not found`);
      return;
    }

    // Update URL
    const url = route === 'home' ? '/' : `#${route}`;
    
    if (replace) {
      history.replaceState({ route }, '', url);
    } else {
      history.pushState({ route }, '', url);
    }

    // Show page
    this.showPage(route);
  }

  showPage(route, animate = true) {
    const currentPage = this.pages[this.currentRoute];
    const targetPage = this.pages[route];

    if (!targetPage) {
      console.error(`Page element for route "${route}" not found`);
      return;
    }

    // Update current route
    this.currentRoute = route;

    if (animate) {
      // Animate page transition
      this.animatePageTransition(currentPage, targetPage);
    } else {
      // Direct page switch
      this.switchPages(currentPage, targetPage);
    }

    // Trigger page-specific logic
    this.onPageShow(route);
  }

  animatePageTransition(fromPage, toPage) {
    const timeline = gsap.timeline();

    // Fade out current page
    timeline.to(fromPage, {
      duration: 0.3,
      opacity: 0,
      x: -50,
      ease: "power2.in",
      onComplete: () => {
        fromPage.classList.remove('active');
        toPage.classList.add('active');
      }
    });

    // Fade in new page
    timeline.fromTo(toPage, 
      {
        opacity: 0,
        x: 50
      },
      {
        duration: 0.4,
        opacity: 1,
        x: 0,
        ease: "power2.out"
      }
    );

    // Animate page elements
    timeline.from(toPage.querySelectorAll('.page-title, .animate-on-enter'), {
      duration: 0.6,
      y: 30,
      opacity: 0,
      stagger: 0.1,
      ease: "power2.out"
    }, '-=0.2');
  }

  switchPages(fromPage, toPage) {
    fromPage.classList.remove('active');
    toPage.classList.add('active');
  }

  onPageShow(route) {
    // Trigger page-specific initialization
    switch (route) {
      case 'shop':
        window.SephyxApp.shop?.refreshProducts();
        break;
      case 'fits':
        window.SephyxApp.savedFits?.refreshFits();
        break;
      case 'vault':
        window.SephyxApp.vault?.checkAccess();
        break;
      case 'account':
        window.SephyxApp.account?.refreshProfile();
        break;
      case 'lookbook':
        this.initializeLookbook();
        break;
      case 'contact':
        this.initializeContact();
        break;
    }

    // Update page title
    this.updatePageTitle(route);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Refresh scroll triggers
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }

  updatePageTitle(route) {
    const titles = {
      'home': 'SEPHYX - Drip Designed for the Future',
      'shop': 'SEPHYX - Shop',
      'fits': 'SEPHYX - Saved Fits',
      'vault': 'SEPHYX - The Vault',
      'lookbook': 'SEPHYX - Lookbook',
      'account': 'SEPHYX - Account',
      'contact': 'SEPHYX - Contact'
    };

    document.title = titles[route] || 'SEPHYX';
  }

  initializeLookbook() {
    const chapters = document.querySelectorAll('.chapter');
    
    chapters.forEach(chapter => {
      const img = chapter.querySelector('.chapter-bg img');
      
      // Hover effects
      chapter.addEventListener('mouseenter', () => {
        gsap.to(img, {
          duration: 0.5,
          scale: 1.1,
          filter: 'brightness(1.2)',
          ease: "power2.out"
        });
      });
      
      chapter.addEventListener('mouseleave', () => {
        gsap.to(img, {
          duration: 0.5,
          scale: 1,
          filter: 'brightness(0.6)',
          ease: "power2.out"
        });
      });
      
      // Click handler for chapter navigation
      chapter.addEventListener('click', () => {
        const chapterName = chapter.dataset.chapter;
        this.showChapterModal(chapterName);
      });
    });

    // Parallax effect for lookbook
    gsap.registerPlugin(ScrollTrigger);
    
    chapters.forEach(chapter => {
      const img = chapter.querySelector('.chapter-bg img');
      
      gsap.to(img, {
        scrollTrigger: {
          trigger: chapter,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        y: -100,
        ease: "none"
      });
    });
  }

  showChapterModal(chapterName) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    const chapterData = {
      'afterlight': {
        title: 'AFTERLIGHT',
        description: 'Post-apocalyptic elegance meets street rebellion',
        content: `
          <div class="chapter-modal">
            <h2>AFTERLIGHT COLLECTION</h2>
            <p>In the aftermath of digital collapse, style emerges from the shadows. The Afterlight collection captures the raw beauty of survival aesthetics merged with high-fashion sensibilities.</p>
            <div class="chapter-features">
              <div class="feature">
                <h4>DISTRESSED LUXURY</h4>
                <p>Deliberately weathered fabrics that tell stories of resilience</p>
              </div>
              <div class="feature">
                <h4>TECHNICAL UTILITY</h4>
                <p>Hidden pockets and modular components for the new world</p>
              </div>
              <div class="feature">
                <h4>MINIMAL PALETTE</h4>
                <p>Muted tones that blend with urban environments</p>
              </div>
            </div>
          </div>
        `
      },
      'drift': {
        title: 'DRIFT MODE',
        description: 'Ethereal forms in digital landscapes',
        content: `
          <div class="chapter-modal">
            <h2>DRIFT MODE COLLECTION</h2>
            <p>Floating between reality and simulation, the Drift Mode collection embodies the fluidity of digital existence. Flowing silhouettes meet cutting-edge materials.</p>
            <div class="chapter-features">
              <div class="feature">
                <h4>FLUID DYNAMICS</h4>
                <p>Fabrics that move like liquid in zero gravity</p>
              </div>
              <div class="feature">
                <h4>HOLOGRAPHIC ACCENTS</h4>
                <p>Reflective details that shift with light and movement</p>
              </div>
              <div class="feature">
                <h4>WEIGHTLESS COMFORT</h4>
                <p>Ultra-light construction for effortless wear</p>
              </div>
            </div>
          </div>
        `
      },
      'punk': {
        title: 'PUNK.EXE',
        description: 'Raw digital energy in wearable form',
        content: `
          <div class="chapter-modal">
            <h2>PUNK.EXE COLLECTION</h2>
            <p>System overload in fabric form. Punk.exe crashes the fashion matrix with aggressive geometries and electric color bursts that defy conventional design protocols.</p>
            <div class="chapter-features">
              <div class="feature">
                <h4>DIGITAL REBELLION</h4>
                <p>Pixelated patterns and glitch-inspired designs</p>
              </div>
              <div class="feature">
                <h4>NEON INJECTION</h4>
                <p>Electric colors that glow under blacklight</p>
              </div>
              <div class="feature">
                <h4>CHAOS THEORY</h4>
                <p>Asymmetrical cuts that break traditional rules</p>
              </div>
            </div>
          </div>
        `
      }
    };

    const chapter = chapterData[chapterName];
    if (chapter) {
      modalBody.innerHTML = chapter.content;
      modal.classList.add('active');
    }
  }

  initializeContact() {
    // Animate tracking stages
    const stages = document.querySelectorAll('.stage');
    
    stages.forEach((stage, index) => {
      gsap.from(stage, {
        scrollTrigger: {
          trigger: stage,
          start: "top 80%"
        },
        duration: 0.6,
        x: -50,
        opacity: 0,
        delay: index * 0.2,
        ease: "power2.out"
      });
    });

    // Simulate order tracking progression
    let currentStage = 0;
    const progressTracking = () => {
      if (currentStage < stages.length - 1) {
        stages[currentStage].classList.remove('active');
        currentStage++;
        stages[currentStage].classList.add('active');
        
        // Show notification
        const stageText = stages[currentStage].querySelector('.stage-text').textContent;
        window.SephyxApp.showNotification(`Order Update: ${stageText}`, 'info');
      }
    };

    // Progress tracking every 10 seconds (for demo)
    setInterval(progressTracking, 10000);
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  // Method to programmatically trigger page animations
  refreshCurrentPage() {
    const currentPage = this.pages[this.currentRoute];
    if (currentPage) {
      // Re-trigger entrance animations
      const animateElements = currentPage.querySelectorAll('.animate-on-enter');
      
      gsap.from(animateElements, {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }
}

// Add chapter modal styles
const chapterModalStyles = document.createElement('style');
chapterModalStyles.textContent = `
  .chapter-modal {
    padding: var(--spacing-lg);
    max-width: 600px;
  }
  
  .chapter-modal h2 {
    font-family: var(--font-header);
    color: var(--accent-gold);
    margin-bottom: var(--spacing-md);
    font-size: 2rem;
  }
  
  .chapter-modal p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-lg);
  }
  
  .chapter-features {
    display: grid;
    gap: var(--spacing-md);
  }
  
  .feature {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
  }
  
  .feature h4 {
    font-family: var(--font-header);
    color: var(--accent-cyan);
    margin-bottom: var(--spacing-xs);
    font-size: 0.9rem;
  }
  
  .feature p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0;
  }
`;
document.head.appendChild(chapterModalStyles);
