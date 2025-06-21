// Vault functionality with password protection and exclusive content
class Vault {
  constructor() {
    this.isUnlocked = false;
    this.correctPassword = '2025streetwear';
    this.countdownEndTime = null;
    this.countdownInterval = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkStoredAccess();
    this.initializeCountdown();
  }

  setupEventListeners() {
    const vaultPassword = document.getElementById('vaultPassword');
    const vaultUnlock = document.getElementById('vaultUnlock');

    if (vaultPassword) {
      vaultPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.attemptUnlock();
        }
      });

      // Add typing effect
      vaultPassword.addEventListener('input', (e) => {
        this.addGlitchEffect(e.target);
      });
    }

    if (vaultUnlock) {
      vaultUnlock.addEventListener('click', () => {
        this.attemptUnlock();
      });
    }

    // Download buttons
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleDownload(btn.textContent);
      });
    });
  }

  attemptUnlock() {
    const passwordInput = document.getElementById('vaultPassword');
    const enteredPassword = passwordInput?.value || '';

    if (enteredPassword === this.correctPassword) {
      this.unlockVault();
    } else {
      this.showAccessDenied();
    }
  }

  unlockVault() {
    this.isUnlocked = true;
    this.saveAccessStatus();
    
    const vaultLocked = document.getElementById('vaultLocked');
    const vaultContent = document.getElementById('vaultContent');
    
    // Animate unlock sequence
    const timeline = gsap.timeline();
    
    // Glitch effect on unlock
    timeline.to(vaultLocked, {
      duration: 0.2,
      skewX: 5,
      repeat: 3,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Fade out locked screen
    timeline.to(vaultLocked, {
      duration: 0.5,
      opacity: 0,
      scale: 0.8,
      ease: "power2.in",
      onComplete: () => {
        vaultLocked.style.display = 'none';
        vaultContent.classList.remove('hidden');
      }
    });

    // Fade in vault content
    timeline.from(vaultContent, {
      duration: 0.8,
      opacity: 0,
      y: 50,
      ease: "power2.out"
    });

    // Animate vault elements
    timeline.from(vaultContent.querySelectorAll('.page-title, .vault-countdown, .preview-item, .download-btn'), {
      duration: 0.6,
      opacity: 0,
      y: 30,
      stagger: 0.1,
      ease: "power2.out"
    }, '-=0.4');

    this.playUnlockSound();
    window.SephyxApp.showNotification('🔓 VAULT ACCESS GRANTED', 'success');
    this.startVaultEffects();
  }

  showAccessDenied() {
    const passwordInput = document.getElementById('vaultPassword');
    const unlockBtn = document.getElementById('vaultUnlock');
    
    // Shake animation
    gsap.to([passwordInput, unlockBtn], {
      duration: 0.1,
      x: -10,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Flash red border
    passwordInput.style.borderColor = '#ff0000';
    setTimeout(() => {
      passwordInput.style.borderColor = '';
    }, 1000);

    // Clear input
    passwordInput.value = '';
    passwordInput.placeholder = 'ACCESS DENIED - TRY AGAIN';
    
    window.SephyxApp.showNotification('❌ INVALID PASSCODE', 'error');
    
    // Add failed attempt effect
    this.addFailedAttemptEffect();
  }

  addFailedAttemptEffect() {
    const vaultLock = document.querySelector('.vault-lock');
    
    // Create glitch overlay
    const glitchOverlay = document.createElement('div');
    glitchOverlay.className = 'glitch-overlay';
    glitchOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent, rgba(255, 0, 0, 0.1), transparent);
      pointer-events: none;
      opacity: 0;
    `;
    
    vaultLock.style.position = 'relative';
    vaultLock.appendChild(glitchOverlay);
    
    gsap.to(glitchOverlay, {
      duration: 0.3,
      opacity: 1,
      repeat: 3,
      yoyo: true,
      onComplete: () => {
        vaultLock.removeChild(glitchOverlay);
      }
    });
  }

  addGlitchEffect(element) {
    element.style.textShadow = '2px 0 #ff0000, -2px 0 #00ffff';
    setTimeout(() => {
      element.style.textShadow = '';
    }, 100);
  }

  checkStoredAccess() {
    const storedAccess = localStorage.getItem('sephyx_vault_access');
    const storedTime = localStorage.getItem('sephyx_vault_time');
    
    if (storedAccess === 'granted' && storedTime) {
      const accessTime = new Date(storedTime);
      const now = new Date();
      const hoursSinceAccess = (now - accessTime) / (1000 * 60 * 60);
      
      // Access expires after 24 hours
      if (hoursSinceAccess < 24) {
        this.isUnlocked = true;
        this.showUnlockedVault();
      }
    }
  }

  showUnlockedVault() {
    const vaultLocked = document.getElementById('vaultLocked');
    const vaultContent = document.getElementById('vaultContent');
    
    vaultLocked.style.display = 'none';
    vaultContent.classList.remove('hidden');
    
    this.startVaultEffects();
  }

  saveAccessStatus() {
    localStorage.setItem('sephyx_vault_access', 'granted');
    localStorage.setItem('sephyx_vault_time', new Date().toISOString());
  }

  initializeCountdown() {
    // Set countdown end time (fictional future date)
    if (!this.countdownEndTime) {
      const now = new Date();
      this.countdownEndTime = new Date(now.getTime() + (12 * 24 * 60 * 60 * 1000)); // 12 days from now
    }
    
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const countdownTimer = document.getElementById('countdownTimer');
    if (!countdownTimer) return;

    const now = new Date();
    const timeLeft = this.countdownEndTime - now;

    if (timeLeft <= 0) {
      countdownTimer.textContent = '00D:00H:00M';
      this.handleCountdownEnd();
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    countdownTimer.textContent = `${days.toString().padStart(2, '0')}D:${hours.toString().padStart(2, '0')}H:${minutes.toString().padStart(2, '0')}M`;
    
    // Add pulsing effect when time is low
    if (timeLeft < 24 * 60 * 60 * 1000) { // Less than 24 hours
      countdownTimer.classList.add('animate-neon-flicker');
    }
  }

  handleCountdownEnd() {
    window.SephyxApp.showNotification('🚀 NEW DROP AVAILABLE!', 'success');
    
    // Reset countdown for next drop
    const now = new Date();
    this.countdownEndTime = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
  }

  startVaultEffects() {
    // Add mysterious hover effects to preview items
    const previewItems = document.querySelectorAll('.preview-item');
    
    previewItems.forEach((item, index) => {
      // Floating animation
      gsap.to(item, {
        duration: 3 + (index * 0.5),
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Hover reveal effect
      item.addEventListener('mouseenter', () => {
        const blackout = item.querySelector('.preview-blackout');
        gsap.to(blackout, {
          duration: 0.3,
          opacity: 0.3,
          ease: "power2.out"
        });
      });

      item.addEventListener('mouseleave', () => {
        const blackout = item.querySelector('.preview-blackout');
        gsap.to(blackout, {
          duration: 0.3,
          opacity: 0.9,
          ease: "power2.out"
        });
      });
    });

    // Add particle effects
    this.createVaultParticles();
  }

  createVaultParticles() {
    const vaultContent = document.getElementById('vaultContent');
    if (!vaultContent) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'vault-particle';
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--accent-gold);
        border-radius: 50%;
        opacity: 0.6;
        pointer-events: none;
        z-index: -1;
      `;
      
      vaultContent.appendChild(particle);
      
      // Random position
      gsap.set(particle, {
        x: Math.random() * vaultContent.offsetWidth,
        y: Math.random() * vaultContent.offsetHeight
      });
      
      // Floating animation
      gsap.to(particle, {
        duration: 8 + Math.random() * 4,
        x: `+=${(Math.random() - 0.5) * 200}`,
        y: `+=${(Math.random() - 0.5) * 200}`,
        opacity: Math.random() * 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }

  handleDownload(type) {
    // Simulate download process
    const downloads = {
      'DOWNLOAD WALLPAPERS': {
        name: 'SEPHYX_Wallpaper_Pack.zip',
        size: '45.2 MB',
        description: 'Cyberpunk wallpaper collection'
      },
      'AR FILTER PACK': {
        name: 'SEPHYX_AR_Filters.zip',
        size: '12.8 MB',
        description: 'Instagram AR filter collection'
      }
    };

    const download = downloads[type];
    if (!download) return;

    // Create download simulation
    this.simulateDownload(download);
  }

  simulateDownload(download) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
      <div class="download-modal">
        <div class="download-icon">📦</div>
        <h2>PREPARING DOWNLOAD</h2>
        <div class="download-info">
          <div class="download-name">${download.name}</div>
          <div class="download-size">${download.size}</div>
          <div class="download-desc">${download.description}</div>
        </div>
        
        <div class="download-progress">
          <div class="download-bar">
            <div class="download-fill" id="downloadFill"></div>
          </div>
          <div class="download-percent" id="downloadPercent">0%</div>
        </div>
        
        <div class="download-note">
          This is a demo - no actual file will be downloaded
        </div>
      </div>
    `;

    modal.classList.add('active');

    // Animate progress bar
    const downloadFill = document.getElementById('downloadFill');
    const downloadPercent = document.getElementById('downloadPercent');
    
    gsap.to(downloadFill, {
      duration: 3,
      width: '100%',
      ease: "power2.out",
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        downloadPercent.textContent = `${progress}%`;
      },
      onComplete: () => {
        setTimeout(() => {
          modal.classList.remove('active');
          window.SephyxApp.showNotification(`${download.name} ready!`, 'success');
        }, 1000);
      }
    });
  }

  playUnlockSound() {
    // Create audio context for unlock sound effect
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Silent fail if audio context is not supported
    }
  }

  checkAccess() {
    // Method called when vault page is accessed
    if (!this.isUnlocked) {
      const passwordInput = document.getElementById('vaultPassword');
      if (passwordInput) {
        passwordInput.focus();
      }
    }
  }

  // Clean up intervals when not needed
  destroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}

// Add vault-specific styles
const vaultStyles = document.createElement('style');
vaultStyles.textContent = `
  .vault-particle {
    animation: vault-float 8s ease-in-out infinite;
  }
  
  @keyframes vault-float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
      opacity: 0.8;
    }
  }
  
  .glitch-overlay {
    animation: vault-glitch 0.1s ease-in-out;
  }
  
  @keyframes vault-glitch {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
  
  .download-modal {
    text-align: center;
    padding: var(--spacing-xl);
    max-width: 400px;
  }
  
  .download-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-md);
    color: var(--accent-gold);
  }
  
  .download-modal h2 {
    font-family: var(--font-header);
    color: var(--accent-cyan);
    margin-bottom: var(--spacing-lg);
  }
  
  .download-info {
    margin-bottom: var(--spacing-lg);
  }
  
  .download-name {
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    color: var(--text-primary);
  }
  
  .download-size {
    color: var(--accent-gold);
    margin-bottom: var(--spacing-xs);
  }
  
  .download-desc {
    color: var(--text-muted);
    font-size: 0.9rem;
  }
  
  .download-progress {
    margin-bottom: var(--spacing-lg);
  }
  
  .download-bar {
    width: 100%;
    height: 6px;
    background: var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: var(--spacing-sm);
  }
  
  .download-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, var(--accent-gold), var(--accent-cyan));
    border-radius: inherit;
  }
  
  .download-percent {
    font-family: var(--font-header);
    color: var(--accent-gold);
  }
  
  .download-note {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-style: italic;
  }
  
  .countdown-timer.animate-neon-flicker {
    animation: neonFlicker 1s ease-in-out infinite;
  }
`;
document.head.appendChild(vaultStyles);
