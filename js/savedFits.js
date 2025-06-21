// Saved Fits functionality for outfit combinations and wishlist
class SavedFits {
  constructor() {
    this.savedFits = [];
    this.currentFit = null;
    
    this.init();
  }

  init() {
    this.loadFits();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const randomizeBtn = document.getElementById('randomizeBtn');
    const saveFitBtn = document.getElementById('saveFitBtn');
    const copyDripBtn = document.getElementById('copyDripBtn');

    if (randomizeBtn) {
      randomizeBtn.addEventListener('click', () => {
        this.randomizeFit();
      });
    }

    if (saveFitBtn) {
      saveFitBtn.addEventListener('click', () => {
        this.saveFit();
      });
    }

    if (copyDripBtn) {
      copyDripBtn.addEventListener('click', () => {
        this.copyDripString();
      });
    }
  }

  randomizeFit() {
    const products = window.PRODUCTS || [];
    if (products.length === 0) return;

    // Filter products by category
    const hoodies = products.filter(p => p.category === 'hoodies');
    const tees = products.filter(p => p.category === 'tees');
    const accessories = products.filter(p => p.category === 'accessories');

    // Generate random fit (3 pieces)
    const randomFit = [];
    
    // Add one from each category if available
    if (hoodies.length > 0) {
      randomFit.push(hoodies[Math.floor(Math.random() * hoodies.length)]);
    }
    if (tees.length > 0) {
      randomFit.push(tees[Math.floor(Math.random() * tees.length)]);
    }
    if (accessories.length > 0) {
      randomFit.push(accessories[Math.floor(Math.random() * accessories.length)]);
    }

    // If we don't have enough variety, fill with random products
    while (randomFit.length < 3 && randomFit.length < products.length) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      if (!randomFit.find(item => item.id === randomProduct.id)) {
        randomFit.push(randomProduct);
      }
    }

    this.currentFit = {
      id: Date.now(),
      name: this.generateFitName(),
      items: randomFit,
      createdAt: new Date().toISOString()
    };

    this.displayCurrentFit();
    this.animateRandomization();
  }

  generateFitName() {
    const adjectives = [
      'Shadow', 'Neon', 'Cyber', 'Digital', 'Phantom', 'Electric', 'Chrome', 'Matrix',
      'Void', 'Pulse', 'Glitch', 'Binary', 'Neural', 'Pixel', 'Quantum', 'Synthetic'
    ];
    
    const nouns = [
      'Drift', 'Flow', 'Vibe', 'Wave', 'Mode', 'State', 'Phase', 'Code',
      'Signal', 'Frequency', 'Protocol', 'System', 'Core', 'Drive', 'Link', 'Grid'
    ];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adj} ${noun}`;
  }

  displayCurrentFit() {
    // Create or update current fit display
    let currentFitDisplay = document.querySelector('.current-fit-display');
    
    if (!currentFitDisplay) {
      currentFitDisplay = document.createElement('div');
      currentFitDisplay.className = 'current-fit-display';
      
      const fitsContainer = document.querySelector('.fits-container');
      const savedFitsGrid = document.getElementById('savedFitsGrid');
      fitsContainer.insertBefore(currentFitDisplay, savedFitsGrid);
    }

    if (this.currentFit) {
      currentFitDisplay.innerHTML = `
        <div class="current-fit">
          <h3>GENERATED FIT: ${this.currentFit.name}</h3>
          <div class="current-fit-items">
            ${this.currentFit.items.map(item => `
              <div class="current-fit-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="current-fit-item-info">
                  <div class="current-fit-item-name">${item.name}</div>
                  <div class="current-fit-item-price">QR ${item.price}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="current-fit-total">
            TOTAL: QR ${this.currentFit.items.reduce((sum, item) => sum + item.price, 0)}
          </div>
        </div>
      `;
    } else {
      currentFitDisplay.innerHTML = `
        <div class="no-current-fit">
          <div class="no-fit-icon">🎲</div>
          <div class="no-fit-text">Generate a random fit to get started</div>
        </div>
      `;
    }
  }

  animateRandomization() {
    const currentFitDisplay = document.querySelector('.current-fit-display');
    if (!currentFitDisplay) return;

    // Glitch effect during randomization
    gsap.to(currentFitDisplay, {
      duration: 0.1,
      skewX: 2,
      repeat: 5,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Scale in new fit
    gsap.from(currentFitDisplay.querySelectorAll('.current-fit-item'), {
      duration: 0.6,
      scale: 0.8,
      opacity: 0,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 0.5
    });

    window.SephyxApp.showNotification(`Generated "${this.currentFit.name}" fit!`, 'success');
  }

  saveFit() {
    if (!this.currentFit) {
      window.SephyxApp.showNotification('Generate a fit first!', 'error');
      return;
    }

    // Check if fit already exists
    const existingFit = this.savedFits.find(fit => fit.id === this.currentFit.id);
    if (existingFit) {
      window.SephyxApp.showNotification('Fit already saved!', 'info');
      return;
    }

    this.savedFits.push({...this.currentFit});
    this.saveFitsToStorage();
    this.renderSavedFits();
    
    window.SephyxApp.showNotification(`Saved "${this.currentFit.name}" to your collection!`, 'success');
  }

  copyDripString() {
    if (!this.currentFit) {
      window.SephyxApp.showNotification('Generate a fit first!', 'error');
      return;
    }

    const dripString = this.generateDripString(this.currentFit);
    
    navigator.clipboard.writeText(dripString).then(() => {
      window.SephyxApp.showNotification('Drip string copied to clipboard!', 'success');
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = dripString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      window.SephyxApp.showNotification('Drip string copied!', 'success');
    });
  }

  generateDripString(fit) {
    const items = fit.items.map(item => item.name.toLowerCase()).join(' + ');
    const total = fit.items.reduce((sum, item) => sum + item.price, 0);
    
    return `🔥 ${fit.name.toUpperCase()} 🔥
${items}
Total drip damage: QR ${total}
#SEPHYX #DrippedOut #CyberFashion`;
  }

  removeFit(fitId) {
    this.savedFits = this.savedFits.filter(fit => fit.id !== fitId);
    this.saveFitsToStorage();
    this.renderSavedFits();
    
    window.SephyxApp.showNotification('Fit removed from collection', 'info');
  }

  loadFitsToCart(fit) {
    if (!window.SephyxApp.shop) return;
    
    fit.items.forEach(item => {
      window.SephyxApp.shop.addToCart(item, 1, 'M');
    });
    
    window.SephyxApp.showNotification(`Added "${fit.name}" items to cart!`, 'success');
  }

  renderSavedFits() {
    const savedFitsGrid = document.getElementById('savedFitsGrid');
    if (!savedFitsGrid) return;

    if (this.savedFits.length === 0) {
      savedFitsGrid.innerHTML = `
        <div class="no-saved-fits">
          <div class="no-fits-icon">💾</div>
          <div class="no-fits-text">No saved fits yet</div>
          <div class="no-fits-subtext">Generate and save some drip combinations</div>
        </div>
      `;
      return;
    }

    savedFitsGrid.innerHTML = '';
    
    this.savedFits.forEach((fit, index) => {
      const fitElement = this.createSavedFitElement(fit);
      savedFitsGrid.appendChild(fitElement);
      
      // Animate entrance
      gsap.from(fitElement, {
        duration: 0.6,
        opacity: 0,
        y: 30,
        delay: index * 0.1,
        ease: "power2.out"
      });
    });
  }

  createSavedFitElement(fit) {
    const fitElement = document.createElement('div');
    fitElement.className = 'saved-fit hover-lift';
    
    fitElement.innerHTML = `
      <div class="fit-header">
        <div class="fit-name">${fit.name}</div>
        <div class="fit-date">${this.formatDate(fit.createdAt)}</div>
      </div>
      
      <div class="fit-preview">
        ${fit.items.slice(0, 3).map(item => `
          <div class="fit-preview-item">
            <img src="${item.image}" alt="${item.name}">
          </div>
        `).join('')}
      </div>
      
      <div class="fit-items">
        ${fit.items.map(item => `
          <div class="fit-item">${item.name}</div>
        `).join('')}
      </div>
      
      <div class="fit-total">
        TOTAL: QR ${fit.items.reduce((sum, item) => sum + item.price, 0)}
      </div>
      
      <div class="fit-actions">
        <button class="fit-btn load-to-cart-btn" data-fit-id="${fit.id}">ADD TO CART</button>
        <button class="fit-btn copy-fit-btn" data-fit-id="${fit.id}">COPY</button>
        <button class="fit-btn remove-fit-btn" data-fit-id="${fit.id}">REMOVE</button>
      </div>
    `;

    // Add event listeners
    const loadBtn = fitElement.querySelector('.load-to-cart-btn');
    const copyBtn = fitElement.querySelector('.copy-fit-btn');
    const removeBtn = fitElement.querySelector('.remove-fit-btn');

    loadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.loadFitsToCart(fit);
    });

    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dripString = this.generateDripString(fit);
      navigator.clipboard.writeText(dripString).then(() => {
        window.SephyxApp.showNotification('Fit copied to clipboard!', 'success');
      });
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.animateRemoval(fitElement, () => {
        this.removeFit(fit.id);
      });
    });

    return fitElement;
  }

  animateRemoval(element, callback) {
    gsap.to(element, {
      duration: 0.4,
      scale: 0.8,
      opacity: 0,
      ease: "power2.in",
      onComplete: callback
    });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  }

  saveFitsToStorage() {
    localStorage.setItem('sephyx_saved_fits', JSON.stringify(this.savedFits));
  }

  loadFits() {
    const saved = localStorage.getItem('sephyx_saved_fits');
    if (saved) {
      this.savedFits = JSON.parse(saved);
    }
    
    this.renderSavedFits();
    this.displayCurrentFit();
  }

  refreshFits() {
    this.renderSavedFits();
    this.displayCurrentFit();
  }

  // Analytics and insights
  getFitStats() {
    const stats = {
      totalFits: this.savedFits.length,
      averageValue: 0,
      mostUsedCategory: null,
      totalValue: 0
    };

    if (this.savedFits.length === 0) return stats;

    // Calculate total and average value
    const allItems = this.savedFits.flatMap(fit => fit.items);
    stats.totalValue = allItems.reduce((sum, item) => sum + item.price, 0);
    stats.averageValue = Math.round(stats.totalValue / this.savedFits.length);

    // Find most used category
    const categoryCount = {};
    allItems.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    stats.mostUsedCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );

    return stats;
  }
}

// Add saved fits styles
const savedFitsStyles = document.createElement('style');
savedFitsStyles.textContent = `
  .current-fit-display {
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
  }
  
  .current-fit h3 {
    font-family: var(--font-header);
    color: var(--accent-gold);
    margin-bottom: var(--spacing-md);
    text-align: center;
  }
  
  .current-fit-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }
  
  .current-fit-item {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    text-align: center;
  }
  
  .current-fit-item img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-xs);
  }
  
  .current-fit-item-name {
    font-size: 0.9rem;
    margin-bottom: var(--spacing-xs);
    color: var(--text-primary);
  }
  
  .current-fit-item-price {
    font-size: 0.8rem;
    color: var(--accent-cyan);
    font-weight: 600;
  }
  
  .current-fit-total {
    text-align: center;
    font-family: var(--font-header);
    font-size: 1.2rem;
    color: var(--accent-gold);
    font-weight: 700;
  }
  
  .no-current-fit {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-muted);
  }
  
  .no-fit-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
  
  .no-fit-text {
    font-size: 1.1rem;
  }
  
  .saved-fit {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
  }
  
  .fit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }
  
  .fit-name {
    font-family: var(--font-header);
    font-weight: 600;
    color: var(--accent-gold);
  }
  
  .fit-date {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  
  .fit-preview {
    display: flex;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-md);
    justify-content: center;
  }
  
  .fit-preview-item {
    width: 50px;
    height: 50px;
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  
  .fit-preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .fit-items {
    margin-bottom: var(--spacing-md);
  }
  
  .fit-item {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
  }
  
  .fit-total {
    font-family: var(--font-header);
    font-weight: 600;
    color: var(--accent-cyan);
    text-align: center;
    margin-bottom: var(--spacing-md);
  }
  
  .fit-actions {
    display: flex;
    gap: var(--spacing-xs);
  }
  
  .fit-btn {
    flex: 1;
    padding: var(--spacing-xs);
    font-size: 0.8rem;
  }
  
  .no-saved-fits {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-muted);
  }
  
  .no-fits-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
  
  .no-fits-text {
    font-size: 1.1rem;
    margin-bottom: var(--spacing-xs);
  }
  
  .no-fits-subtext {
    font-size: 0.9rem;
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    .current-fit-items {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
    
    .fit-actions {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(savedFitsStyles);
