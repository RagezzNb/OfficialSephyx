// Shop functionality with product management and cart operations
class Shop {
  constructor() {
    this.products = [];
    this.cart = [];
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.productsPerPage = 12;
    
    this.init();
  }

  init() {
    this.loadProducts();
    this.setupEventListeners();
    this.loadCart();
  }

  loadProducts() {
    // Products are loaded from data/products.js
    this.products = window.PRODUCTS || [];
    this.renderProducts();
  }

  setupEventListeners() {
    // Filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.setFilter(chip.dataset.filter);
        this.updateActiveFilter(chip);
      });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.showCheckout();
      });
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.renderProducts();
  }

  updateActiveFilter(activeChip) {
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.remove('active');
    });
    activeChip.classList.add('active');
  }

  getFilteredProducts() {
    if (this.currentFilter === 'all') {
      return this.products;
    }
    return this.products.filter(product => product.category === this.currentFilter);
  }

  renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filteredProducts = this.getFilteredProducts();
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    // Clear existing products with animation
    gsap.to(productsGrid.children, {
      duration: 0.3,
      opacity: 0,
      y: 20,
      stagger: 0.05,
      onComplete: () => {
        productsGrid.innerHTML = '';
        this.renderProductCards(productsToShow, productsGrid);
      }
    });
  }

  renderProductCards(products, container) {
    products.forEach((product, index) => {
      const productCard = this.createProductCard(product);
      container.appendChild(productCard);
      
      // Animate card entrance
      gsap.from(productCard, {
        duration: 0.6,
        opacity: 0,
        y: 30,
        delay: index * 0.1,
        ease: "power2.out"
      });
    });
    
    // Update wishlist hearts after rendering
    setTimeout(() => {
      if (window.SephyxWishlist) {
        window.SephyxWishlist.updateAllHearts();
      }
    }, 100);
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card hover-tilt hover-glow animate-on-enter';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <button class="wishlist-heart" data-product-id="${product.id}">🤍</button>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">QR ${product.price}</div>
        <div class="product-category">${product.category}</div>
      </div>
      <div class="product-overlay">
        <button class="quick-view-btn" data-product-id="${product.id}">QUICK VIEW</button>
      </div>
    `;

    // Add event listeners
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-view-btn')) {
        this.showProductModal(product);
      }
    });

    // Hover effects
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        duration: 0.3,
        y: -10,
        rotationX: 5,
        rotationY: 5,
        boxShadow: "0 20px 40px rgba(0, 255, 255, 0.2)",
        ease: "power2.out"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        duration: 0.3,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        boxShadow: "none",
        ease: "power2.out"
      });
    });

    return card;
  }

  showProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
      <div class="product-modal">
        <div class="product-modal-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-modal-info">
          <h2 class="product-modal-name">${product.name}</h2>
          <div class="product-modal-price">QR ${product.price}</div>
          <div class="product-modal-category">${product.category.toUpperCase()}</div>
          
          <div class="product-details">
            <h4>MATERIALS</h4>
            <p>${product.materials || 'Premium synthetic blend, moisture-wicking technology'}</p>
            
            <h4>STYLING TIPS</h4>
            <p>${product.styling || 'Perfect for layering with tactical accessories. Pairs well with dystopian aesthetics.'}</p>
            
            <h4>BUNDLE IDEAS</h4>
            <p>${product.bundle || 'Combine with our cyber-tech accessories for maximum impact.'}</p>
          </div>
          
          <div class="product-options">
            <div class="size-selector">
              <label>SIZE:</label>
              <select id="productSize">
                <option value="S">S</option>
                <option value="M" selected>M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            
            <div class="quantity-selector">
              <label>QUANTITY:</label>
              <div class="quantity-controls">
                <button class="quantity-btn" id="decreaseQty">-</button>
                <span id="productQuantity">1</span>
                <button class="quantity-btn" id="increaseQty">+</button>
              </div>
            </div>
          </div>
          
          <button class="add-to-cart-btn" id="addToCartBtn" data-product-id="${product.id}">
            ADD TO CART
          </button>
        </div>
      </div>
    `;

    // Setup modal event listeners
    this.setupModalEventListeners(product);
    
    modal.classList.add('active');
  }

  setupModalEventListeners(product) {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityDisplay = document.getElementById('productQuantity');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    let quantity = 1;
    
    decreaseBtn?.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
      }
    });
    
    increaseBtn?.addEventListener('click', () => {
      if (quantity < 10) {
        quantity++;
        quantityDisplay.textContent = quantity;
      }
    });
    
    addToCartBtn?.addEventListener('click', () => {
      const size = document.getElementById('productSize')?.value || 'M';
      this.addToCart(product, quantity, size);
    });
  }

  addToCart(product, quantity = 1, size = 'M') {
    const existingItem = this.cart.find(item => 
      item.id === product.id && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: quantity,
        category: product.category
      });
    }

    this.saveCart();
    this.updateCartDisplay();
    this.updateCartCount();
    
    // Show notification
    window.SephyxApp.showNotification(`Added ${product.name} to cart`, 'success');
    
    // Close modal
    document.getElementById('productModal').classList.remove('active');
  }

  removeFromCart(productId, size) {
    this.cart = this.cart.filter(item => 
      !(item.id === productId && item.size === size)
    );
    
    this.saveCart();
    this.updateCartDisplay();
    this.updateCartCount();
    
    window.SephyxApp.showNotification('Item removed from cart', 'info');
  }

  updateCartQuantity(productId, size, newQuantity) {
    const item = this.cart.find(item => 
      item.id === productId && item.size === size
    );
    
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(productId, size);
      } else {
        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
      }
    }
  }

  getCart() {
    return this.cart;
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems) {
      cartItems.innerHTML = '';
      
      if (this.cart.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <div class="empty-cart-text">Your cart is empty</div>
            <div class="empty-cart-subtext">Add some drip to get started</div>
          </div>
        `;
      } else {
        this.cart.forEach(item => {
          const cartItem = this.createCartItemElement(item);
          cartItems.appendChild(cartItem);
        });
      }
    }
    
    if (cartTotal) {
      cartTotal.textContent = `TOTAL: QR ${this.getCartTotal()}`;
    }
  }

  createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-details">Size: ${item.size}</div>
        <div class="cart-item-price">QR ${item.price}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" data-action="decrease" data-id="${item.id}" data-size="${item.size}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" data-action="increase" data-id="${item.id}" data-size="${item.size}">+</button>
          <button class="remove-btn" data-id="${item.id}" data-size="${item.size}">×</button>
        </div>
      </div>
    `;

    // Add event listeners
    const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
    const increaseBtn = cartItem.querySelector('[data-action="increase"]');
    const removeBtn = cartItem.querySelector('.remove-btn');

    decreaseBtn.addEventListener('click', () => {
      this.updateCartQuantity(item.id, item.size, item.quantity - 1);
    });

    increaseBtn.addEventListener('click', () => {
      this.updateCartQuantity(item.id, item.size, item.quantity + 1);
    });

    removeBtn.addEventListener('click', () => {
      this.removeFromCart(item.id, item.size);
    });

    return cartItem;
  }

  updateCartCount() {
    if (window.SephyxApp && window.SephyxApp.updateCartCount) {
      window.SephyxApp.updateCartCount();
    }
  }

  showCheckout() {
    if (this.cart.length === 0) {
      window.SephyxApp.showNotification('Your cart is empty', 'error');
      return;
    }

    const checkoutText = this.generateCheckoutText();
    
    // Create checkout modal
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
      <div class="checkout-modal">
        <h2>CHECKOUT</h2>
        <div class="checkout-summary">
          <h3>ORDER SUMMARY</h3>
          ${this.cart.map(item => `
            <div class="checkout-item">
              <span>${item.name} (${item.size}) x${item.quantity}</span>
              <span>QR ${item.price * item.quantity}</span>
            </div>
          `).join('')}
          <div class="checkout-total">
            <strong>TOTAL: QR ${this.getCartTotal()}</strong>
          </div>
        </div>
        
        <div class="checkout-form">
          <h3>DELIVERY INFO</h3>
          <textarea class="checkout-text" readonly>${checkoutText}</textarea>
          <button class="copy-checkout-btn" id="copyCheckoutBtn">COPY ORDER TEXT</button>
          <p class="checkout-note">Copy this text and send it to us via Instagram DM</p>
        </div>
      </div>
    `;

    // Setup copy functionality
    const copyBtn = document.getElementById('copyCheckoutBtn');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(checkoutText).then(() => {
        window.SephyxApp.showNotification('Order text copied to clipboard!', 'success');
      });
    });

    modal.classList.add('active');
  }

  generateCheckoutText() {
    const items = this.cart.map(item => 
      `- '${item.name.toLowerCase()}', size ${item.size} x${item.quantity}`
    ).join('\n');
    
    return `yo SEPHYX — I'm ready to drip:
${items}
total: QR ${this.getCartTotal()}

Name: 
Phone: 
Address: `;
  }

  saveCart() {
    localStorage.setItem('sephyx_cart', JSON.stringify(this.cart));
  }

  loadCart() {
    const savedCart = localStorage.getItem('sephyx_cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.updateCartDisplay();
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartDisplay();
    this.updateCartCount();
  }

  refreshProducts() {
    this.renderProducts();
  }
}

// Add checkout modal styles
const checkoutStyles = document.createElement('style');
checkoutStyles.textContent = `
  .product-modal {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
    align-items: start;
  }
  
  .product-modal-image img {
    width: 100%;
    border-radius: var(--radius-md);
  }
  
  .product-modal-name {
    font-family: var(--font-header);
    font-size: 1.5rem;
    color: var(--accent-gold);
    margin-bottom: var(--spacing-sm);
  }
  
  .product-modal-price {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--accent-cyan);
    margin-bottom: var(--spacing-xs);
  }
  
  .product-modal-category {
    font-size: 0.8rem;
    color: var(--text-muted);
    letter-spacing: 1px;
    margin-bottom: var(--spacing-lg);
  }
  
  .product-details h4 {
    font-family: var(--font-header);
    color: var(--accent-gold);
    margin: var(--spacing-md) 0 var(--spacing-xs) 0;
    font-size: 0.9rem;
  }
  
  .product-details p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: var(--spacing-sm);
  }
  
  .product-options {
    margin: var(--spacing-lg) 0;
    display: flex;
    gap: var(--spacing-lg);
    align-items: end;
  }
  
  .size-selector label,
  .quantity-selector label {
    display: block;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-xs);
  }
  
  .size-selector select {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
  }
  
  .quantity-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .add-to-cart-btn {
    width: 100%;
    background: linear-gradient(45deg, var(--accent-gold), var(--accent-cyan));
    border: none;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    font-family: var(--font-header);
    font-weight: 700;
    color: var(--primary-bg);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .add-to-cart-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
  }
  
  .empty-cart {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-muted);
  }
  
  .empty-cart-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
  
  .empty-cart-text {
    font-size: 1.1rem;
    margin-bottom: var(--spacing-xs);
  }
  
  .empty-cart-subtext {
    font-size: 0.9rem;
    opacity: 0.7;
  }
  
  .checkout-modal {
    padding: var(--spacing-lg);
    max-width: 500px;
  }
  
  .checkout-modal h2 {
    font-family: var(--font-header);
    color: var(--accent-gold);
    margin-bottom: var(--spacing-lg);
  }
  
  .checkout-summary {
    margin-bottom: var(--spacing-lg);
  }
  
  .checkout-summary h3 {
    color: var(--accent-cyan);
    margin-bottom: var(--spacing-md);
    font-size: 1rem;
  }
  
  .checkout-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs) 0;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9rem;
  }
  
  .checkout-total {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 2px solid var(--accent-gold);
    text-align: right;
    font-size: 1.1rem;
  }
  
  .checkout-form h3 {
    color: var(--accent-cyan);
    margin-bottom: var(--spacing-md);
    font-size: 1rem;
  }
  
  .checkout-text {
    width: 100%;
    height: 120px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    color: var(--text-primary);
    font-family: var(--font-header);
    font-size: 0.9rem;
    margin-bottom: var(--spacing-md);
    resize: none;
  }
  
  .copy-checkout-btn {
    width: 100%;
    background: var(--accent-gold);
    border: none;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    font-family: var(--font-header);
    font-weight: 600;
    color: var(--primary-bg);
    cursor: pointer;
    margin-bottom: var(--spacing-md);
  }
  
  .checkout-note {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-align: center;
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    .product-modal {
      grid-template-columns: 1fr;
    }
    
    .product-options {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-md);
    }
  }
`;
document.head.appendChild(checkoutStyles);
