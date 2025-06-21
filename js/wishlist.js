// Wishlist functionality for SEPHYX website
class Wishlist {
  constructor() {
    this.wishlistItems = [];
    this.storageKey = 'sephyx_wishlist';
    
    this.init();
  }

  init() {
    this.loadWishlist();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event delegation for heart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('wishlist-heart') || 
          e.target.closest('.wishlist-heart')) {
        const heartBtn = e.target.classList.contains('wishlist-heart') ? 
                        e.target : e.target.closest('.wishlist-heart');
        const productId = heartBtn.dataset.productId;
        this.toggleWishlist(productId, heartBtn);
      }
    });
  }

  toggleWishlist(productId, heartElement) {
    const product = window.PRODUCT_UTILS.getProductById(productId);
    if (!product) return;

    const isInWishlist = this.isInWishlist(productId);
    
    if (isInWishlist) {
      this.removeFromWishlist(productId);
      this.updateHeartDisplay(heartElement, false);
      window.SephyxApp.showNotification(`${product.name} removed from wishlist`, 'info');
    } else {
      this.addToWishlist(product);
      this.updateHeartDisplay(heartElement, true);
      window.SephyxApp.showNotification(`${product.name} added to wishlist`, 'success');
    }
  }

  addToWishlist(product) {
    if (!this.isInWishlist(product.id)) {
      this.wishlistItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        addedAt: Date.now()
      });
      this.saveWishlist();
    }
  }

  removeFromWishlist(productId) {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.saveWishlist();
  }

  isInWishlist(productId) {
    return this.wishlistItems.some(item => item.id === productId);
  }

  updateHeartDisplay(heartElement, isActive) {
    if (isActive) {
      heartElement.classList.add('active');
      heartElement.innerHTML = '💖';
    } else {
      heartElement.classList.remove('active');
      heartElement.innerHTML = '🤍';
    }

    // Add animation
    gsap.to(heartElement, {
      duration: 0.3,
      scale: 1.3,
      yoyo: true,
      repeat: 1,
      ease: "back.out(1.7)"
    });
  }

  getWishlistCount() {
    return this.wishlistItems.length;
  }

  getWishlistItems() {
    return [...this.wishlistItems];
  }

  clearWishlist() {
    this.wishlistItems = [];
    this.saveWishlist();
    this.updateAllHearts();
  }

  updateAllHearts() {
    // Update all heart buttons on the page
    const heartButtons = document.querySelectorAll('.wishlist-heart');
    heartButtons.forEach(heart => {
      const productId = heart.dataset.productId;
      const isActive = this.isInWishlist(productId);
      this.updateHeartDisplay(heart, isActive);
    });
  }

  saveWishlist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlistItems));
  }

  loadWishlist() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.wishlistItems = JSON.parse(saved);
    }
  }

  // Export wishlist data
  exportWishlist() {
    const wishlistData = {
      items: this.wishlistItems,
      exportDate: new Date().toISOString(),
      totalItems: this.wishlistItems.length
    };
    
    const dataStr = JSON.stringify(wishlistData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sephyx_wishlist.json';
    link.click();
    
    URL.revokeObjectURL(url);
    window.SephyxApp.showNotification('Wishlist exported!', 'success');
  }
}

// Add wishlist-specific styles
const wishlistStyles = document.createElement('style');
wishlistStyles.textContent = `
  .wishlist-heart {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    z-index: 10;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }
  
  .wishlist-heart:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
  
  .wishlist-heart.active {
    background: rgba(255, 20, 147, 0.8);
    box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
  }
  
  .product-card {
    position: relative;
  }
  
  .instagram-link {
    display: inline-block;
    margin-top: var(--spacing-sm);
    color: var(--accent-cyan);
    text-decoration: none;
    font-family: var(--font-header);
    font-weight: 600;
    transition: all 0.3s ease;
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--accent-cyan);
    border-radius: var(--radius-sm);
    background: rgba(0, 255, 255, 0.1);
  }
  
  .instagram-link:hover {
    background: var(--accent-cyan);
    color: var(--primary-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
  }
  
  .wishlist-indicator {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    backdrop-filter: blur(20px);
    z-index: 1000;
    transition: all 0.3s ease;
  }
  
  .wishlist-count {
    color: var(--accent-gold);
    font-family: var(--font-header);
    font-weight: 600;
  }
`;
document.head.appendChild(wishlistStyles);

// Initialize wishlist when DOM is ready
if (typeof window !== 'undefined') {
  window.SephyxWishlist = new Wishlist();
}