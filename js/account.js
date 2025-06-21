// Account management with mock profile system and loyalty badges
class Account {
  constructor() {
    this.profile = {
      username: '',
      bio: '',
      avatar: '👤',
      styleTokens: ['CYBERPUNK', 'STREETWEAR', 'MINIMALIST'],
      loyaltyLevel: 0,
      joinDate: new Date().toISOString(),
      interactions: 0,
      purchases: 0
    };
    
    this.loyaltyBadges = [
      {
        id: 'starter',
        name: 'STREET STARTER',
        icon: '🔰',
        requirement: 0,
        description: 'Welcome to the cult'
      },
      {
        id: 'dealer',
        name: 'DRIP DEALER',
        icon: '💎',
        requirement: 10,
        description: '10+ interactions with the system'
      },
      {
        id: 'saint',
        name: 'SEPHYX SAINT',
        icon: '👑',
        requirement: 25,
        description: 'Ultimate street credibility'
      }
    ];
    
    this.init();
  }

  init() {
    this.loadProfile();
    this.setupEventListeners();
    this.updateLoyaltyStatus();
  }

  setupEventListeners() {
    const usernameInput = document.getElementById('username');
    const bioInput = document.getElementById('bio');
    const avatarChangeBtn = document.querySelector('.avatar-change');

    if (usernameInput) {
      usernameInput.addEventListener('input', (e) => {
        this.updateProfile('username', e.target.value);
        this.addInteraction();
      });
      
      usernameInput.addEventListener('blur', () => {
        this.saveProfile();
      });
    }

    if (bioInput) {
      bioInput.addEventListener('input', (e) => {
        this.updateProfile('bio', e.target.value);
      });
      
      bioInput.addEventListener('blur', () => {
        this.saveProfile();
      });
    }

    if (avatarChangeBtn) {
      avatarChangeBtn.addEventListener('click', () => {
        this.changeAvatar();
      });
    }

    // Badge hover effects
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        this.showBadgeInfo(badge);
      });
      
      badge.addEventListener('mouseleave', () => {
        this.hideBadgeInfo();
      });
    });
  }

  updateProfile(field, value) {
    this.profile[field] = value;
    this.updateProfileDisplay();
  }

  updateProfileDisplay() {
    const usernameInput = document.getElementById('username');
    const bioInput = document.getElementById('bio');
    const avatarImg = document.querySelector('.avatar-img');

    if (usernameInput && usernameInput.value !== this.profile.username) {
      usernameInput.value = this.profile.username;
    }

    if (bioInput && bioInput.value !== this.profile.bio) {
      bioInput.value = this.profile.bio;
    }

    if (avatarImg) {
      avatarImg.textContent = this.profile.avatar;
    }

    // Update avatar frame based on loyalty level
    this.updateAvatarFrame();
  }

  updateAvatarFrame() {
    const avatarFrame = document.getElementById('avatarFrame');
    if (!avatarFrame) return;

    // Remove existing frame classes
    avatarFrame.classList.remove('starter-frame', 'dealer-frame', 'saint-frame');

    // Add frame based on loyalty level
    const currentBadge = this.getCurrentBadge();
    avatarFrame.classList.add(`${currentBadge.id}-frame`);

    // Add glow effect for saint level
    if (currentBadge.id === 'saint') {
      avatarFrame.classList.add('animate-glow');
    }
  }

  changeAvatar() {
    const avatars = ['👤', '🤖', '👽', '🦾', '🔮', '⚡', '🌐', '💀', '🎭', '🔥'];
    const currentIndex = avatars.indexOf(this.profile.avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    
    this.profile.avatar = avatars[nextIndex];
    this.updateProfileDisplay();
    this.saveProfile();
    this.addInteraction();

    // Animate avatar change
    const avatarImg = document.querySelector('.avatar-img');
    if (avatarImg) {
      gsap.to(avatarImg, {
        duration: 0.3,
        scale: 1.2,
        rotation: 360,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.set(avatarImg, { rotation: 0 });
        }
      });
    }

    window.SephyxApp.showNotification('Avatar updated!', 'success');
  }

  addInteraction() {
    this.profile.interactions++;
    this.updateLoyaltyStatus();
    
    // Trigger random achievements
    if (this.profile.interactions % 5 === 0) {
      this.triggerAchievement();
    }
  }

  addPurchase() {
    this.profile.purchases++;
    this.addInteraction();
    this.saveProfile();
  }

  updateLoyaltyStatus() {
    const oldLevel = this.profile.loyaltyLevel;
    const newLevel = this.calculateLoyaltyLevel();
    
    if (newLevel > oldLevel) {
      this.profile.loyaltyLevel = newLevel;
      this.showLoyaltyUpgrade(newLevel);
    }
    
    this.updateBadgeDisplay();
  }

  calculateLoyaltyLevel() {
    const totalActivity = this.profile.interactions + (this.profile.purchases * 3);
    
    if (totalActivity >= 25) return 2; // Saint
    if (totalActivity >= 10) return 1; // Dealer
    return 0; // Starter
  }

  getCurrentBadge() {
    return this.loyaltyBadges[this.profile.loyaltyLevel];
  }

  updateBadgeDisplay() {
    const badges = document.querySelectorAll('.badge');
    
    badges.forEach((badgeElement, index) => {
      const badge = this.loyaltyBadges[index];
      const isUnlocked = index <= this.profile.loyaltyLevel;
      
      badgeElement.classList.toggle('unlocked', isUnlocked);
      badgeElement.classList.toggle('locked', !isUnlocked);
      
      if (isUnlocked) {
        badgeElement.style.opacity = '1';
        badgeElement.style.filter = 'none';
      } else {
        badgeElement.style.opacity = '0.3';
        badgeElement.style.filter = 'grayscale(100%)';
      }
    });
  }

  showLoyaltyUpgrade(newLevel) {
    const newBadge = this.loyaltyBadges[newLevel];
    
    // Create upgrade notification
    const upgradeModal = document.createElement('div');
    upgradeModal.className = 'loyalty-upgrade-modal';
    upgradeModal.innerHTML = `
      <div class="upgrade-content">
        <div class="upgrade-icon">${newBadge.icon}</div>
        <h2>LOYALTY UPGRADE!</h2>
        <div class="upgrade-badge-name">${newBadge.name}</div>
        <div class="upgrade-description">${newBadge.description}</div>
        <button class="upgrade-close">ACKNOWLEDGE</button>
      </div>
    `;
    
    document.body.appendChild(upgradeModal);
    
    // Animate upgrade modal
    gsap.from(upgradeModal, {
      duration: 0.6,
      scale: 0.8,
      opacity: 0,
      ease: "back.out(1.7)"
    });
    
    // Close button
    upgradeModal.querySelector('.upgrade-close').addEventListener('click', () => {
      gsap.to(upgradeModal, {
        duration: 0.3,
        scale: 0.8,
        opacity: 0,
        onComplete: () => {
          document.body.removeChild(upgradeModal);
        }
      });
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(upgradeModal)) {
        upgradeModal.querySelector('.upgrade-close').click();
      }
    }, 5000);
    
    window.SephyxApp.showNotification(`Upgraded to ${newBadge.name}!`, 'success');
  }

  triggerAchievement() {
    const achievements = [
      '🎯 Profile Explorer',
      '⚡ Quick Fingers',
      '🔥 Style Master',
      '💫 Interaction King',
      '🌟 Cult Member'
    ];
    
    const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
    window.SephyxApp.showNotification(`Achievement: ${randomAchievement}`, 'success');
  }

  showBadgeInfo(badgeElement) {
    const badgeData = badgeElement.dataset.badge;
    const badge = this.loyaltyBadges.find(b => b.id === badgeData);
    
    if (!badge) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'badge-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-title">${badge.name}</div>
      <div class="tooltip-desc">${badge.description}</div>
      <div class="tooltip-req">Requires: ${badge.requirement} activity points</div>
    `;
    
    badgeElement.appendChild(tooltip);
    
    gsap.from(tooltip, {
      duration: 0.3,
      opacity: 0,
      y: 10,
      ease: "power2.out"
    });
  }

  hideBadgeInfo() {
    const tooltips = document.querySelectorAll('.badge-tooltip');
    tooltips.forEach(tooltip => {
      gsap.to(tooltip, {
        duration: 0.2,
        opacity: 0,
        y: -10,
        onComplete: () => {
          tooltip.remove();
        }
      });
    });
  }

  generateDripDiary() {
    const events = [
      { date: 'TODAY', event: 'Joined the cult', type: 'milestone' },
      { date: '1 DAY AGO', event: 'First vault access', type: 'achievement' },
      { date: '3 DAYS AGO', event: 'Profile customized', type: 'activity' },
      { date: '1 WEEK AGO', event: 'Discovered SEPHYX', type: 'milestone' }
    ];
    
    // Add dynamic events based on user activity
    if (this.profile.interactions > 5) {
      events.unshift({ date: 'RECENTLY', event: 'Style explorer activated', type: 'achievement' });
    }
    
    if (this.profile.loyaltyLevel > 0) {
      events.unshift({ date: 'RECENTLY', event: `Became ${this.getCurrentBadge().name}`, type: 'milestone' });
    }
    
    return events;
  }

  updateDripDiary() {
    const timeline = document.querySelector('.diary-timeline');
    if (!timeline) return;
    
    const events = this.generateDripDiary();
    timeline.innerHTML = '';
    
    events.forEach((event, index) => {
      const eventElement = document.createElement('div');
      eventElement.className = `timeline-item timeline-${event.type}`;
      eventElement.innerHTML = `
        <div class="timeline-date">${event.date}</div>
        <div class="timeline-event">${event.event}</div>
      `;
      
      timeline.appendChild(eventElement);
      
      // Animate timeline items
      gsap.from(eventElement, {
        duration: 0.5,
        opacity: 0,
        x: -20,
        delay: index * 0.1,
        ease: "power2.out"
      });
    });
  }

  getProfileStats() {
    const daysSinceJoining = Math.floor((new Date() - new Date(this.profile.joinDate)) / (1000 * 60 * 60 * 24));
    
    return {
      username: this.profile.username || 'Anonymous',
      loyaltyBadge: this.getCurrentBadge().name,
      daysSinceJoining,
      totalInteractions: this.profile.interactions,
      totalPurchases: this.profile.purchases,
      styleTokens: this.profile.styleTokens.length
    };
  }

  saveProfile() {
    localStorage.setItem('sephyx_profile', JSON.stringify(this.profile));
  }

  loadProfile() {
    const saved = localStorage.getItem('sephyx_profile');
    if (saved) {
      this.profile = { ...this.profile, ...JSON.parse(saved) };
    }
    
    this.updateProfileDisplay();
    this.updateBadgeDisplay();
    this.updateDripDiary();
  }

  refreshProfile() {
    this.updateProfileDisplay();
    this.updateBadgeDisplay();
    this.updateDripDiary();
  }

  // Export profile data
  exportProfile() {
    const profileData = {
      ...this.profile,
      stats: this.getProfileStats(),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sephyx_profile.json';
    link.click();
    
    URL.revokeObjectURL(url);
    window.SephyxApp.showNotification('Profile exported!', 'success');
  }
}

// Add account-specific styles
const accountStyles = document.createElement('style');
accountStyles.textContent = `
  .starter-frame {
    border-color: var(--accent-gold) !important;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  
  .dealer-frame {
    border-color: var(--accent-cyan) !important;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
  }
  
  .saint-frame {
    border-color: var(--accent-purple) !important;
    box-shadow: 0 0 30px rgba(138, 43, 226, 0.6);
    animation: saintGlow 2s ease-in-out infinite alternate;
  }
  
  @keyframes saintGlow {
    from {
      box-shadow: 0 0 30px rgba(138, 43, 226, 0.6);
    }
    to {
      box-shadow: 0 0 50px rgba(138, 43, 226, 0.8);
    }
  }
  
  .badge.unlocked {
    transform: scale(1.05);
    cursor: pointer;
  }
  
  .badge.locked {
    cursor: not-allowed;
  }
  
  .badge {
    position: relative;
    transition: all 0.3s ease;
  }
  
  .badge:hover.unlocked {
    transform: scale(1.1) translateY(-5px);
  }
  
  .badge-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--secondary-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    min-width: 200px;
    z-index: 1000;
    backdrop-filter: blur(20px);
  }
  
  .tooltip-title {
    font-family: var(--font-header);
    color: var(--accent-gold);
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
  }
  
  .tooltip-desc {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
  }
  
  .tooltip-req {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  
  .loyalty-upgrade-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5000;
  }
  
  .upgrade-content {
    background: var(--secondary-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    text-align: center;
    max-width: 400px;
    backdrop-filter: blur(20px);
  }
  
  .upgrade-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-md);
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  .upgrade-content h2 {
    font-family: var(--font-header);
    color: var(--accent-gold);
    margin-bottom: var(--spacing-md);
  }
  
  .upgrade-badge-name {
    font-family: var(--font-header);
    font-size: 1.2rem;
    color: var(--accent-cyan);
    margin-bottom: var(--spacing-sm);
  }
  
  .upgrade-description {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
  }
  
  .upgrade-close {
    background: linear-gradient(45deg, var(--accent-gold), var(--accent-cyan));
    border: none;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-family: var(--font-header);
    font-weight: 600;
    color: var(--primary-bg);
    cursor: pointer;
  }
  
  .timeline-milestone {
    border-left: 3px solid var(--accent-gold);
  }
  
  .timeline-achievement {
    border-left: 3px solid var(--accent-cyan);
  }
  
  .timeline-activity {
    border-left: 3px solid var(--text-muted);
  }
  
  .timeline-item {
    padding-left: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    border-left: 3px solid var(--border-color);
  }
`;
document.head.appendChild(accountStyles);
