// Chatbot functionality with Gen Z fashion assistant responses
class Chatbot {
  constructor() {
    this.isOpen = false;
    this.responses = window.CHATBOT_RESPONSES || {};
    this.conversationHistory = [];
    this.currentContext = 'greeting';
    this.userName = '';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadConversationHistory();
    this.initializeGreeting();
  }

  setupEventListeners() {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const chatbotToggle = document.getElementById('chatbotToggle');
      const chatbotMinimize = document.getElementById('chatbotMinimize');
      const chatbotInput = document.getElementById('chatbotInput');
      const chatbotSend = document.getElementById('chatbotSend');

      if (chatbotToggle) {
        chatbotToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggle();
        });
        
        // Also listen for clicks on the orb inside
        const chatbotOrb = chatbotToggle.querySelector('.chatbot-orb');
        if (chatbotOrb) {
          chatbotOrb.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
          });
        }
      }
      if (chatbotMinimize) {
        chatbotMinimize.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.minimize();
        });
      }

      if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.sendMessage();
          }
        });

        chatbotInput.addEventListener('input', () => {
          this.showTypingIndicator();
        });
      }

      if (chatbotSend) {
        chatbotSend.addEventListener('click', () => {
          this.sendMessage();
        });
      }
    }, 100);

    // Auto-minimize on outside click
    document.addEventListener('click', (e) => {
      const chatbot = document.getElementById('chatbot');
      const chatbotToggle = document.getElementById('chatbotToggle');
      
      if (chatbot && !chatbot.contains(e.target) && 
          chatbotToggle && !chatbotToggle.contains(e.target) && 
          this.isOpen) {
        this.minimize();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.minimize();
    } else {
      this.maximize();
    }
  }

  maximize() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.getElementById('chatbotToggle');
    
    if (chatbotWindow && chatbotToggle) {
      chatbotWindow.classList.remove('hidden');
      this.isOpen = true;
      
      // Animate window appearance
      gsap.from(chatbotWindow, {
        duration: 0.3,
        scale: 0.8,
        opacity: 0,
        transformOrigin: 'bottom right',
        ease: "back.out(1.7)"
      });

      // Pulse toggle button
      gsap.to(chatbotToggle, {
        duration: 0.2,
        scale: 1.1,
        yoyo: true,
        repeat: 1
      });

      // Focus input
      setTimeout(() => {
        const input = document.getElementById('chatbotInput');
        if (input) input.focus();
      }, 300);

      // Add random greeting if conversation is empty
      if (this.conversationHistory.length <= 1) {
        setTimeout(() => {
          this.addBotMessage(this.getRandomResponse('greetings'));
        }, 500);
      }
    }
  }

  minimize() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    
    if (chatbotWindow) {
      gsap.to(chatbotWindow, {
        duration: 0.2,
        scale: 0.8,
        opacity: 0,
        transformOrigin: 'bottom right',
        ease: "power2.in",
        onComplete: () => {
          chatbotWindow.classList.add('hidden');
          this.isOpen = false;
        }
      });
    }
  }

  sendMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    // Add user message
    this.addUserMessage(message);
    input.value = '';

    // Process message and respond
    setTimeout(() => {
      this.processMessage(message);
    }, 500 + Math.random() * 1000); // Random delay for realism
  }

  addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.innerHTML = `
      <div class="message-text">${this.sanitizeMessage(message)}</div>
    `;

    messagesContainer.appendChild(messageElement);
    this.scrollToBottom();

    // Animate message
    gsap.from(messageElement, {
      duration: 0.3,
      opacity: 0,
      x: 20,
      ease: "power2.out"
    });

    // Store in conversation history
    this.conversationHistory.push({
      type: 'user',
      message: message,
      timestamp: Date.now()
    });

    this.saveConversationHistory();
  }

  addBotMessage(message, delay = 0) {
    setTimeout(() => {
      const messagesContainer = document.getElementById('chatbotMessages');
      if (!messagesContainer) return;

      const messageElement = document.createElement('div');
      messageElement.className = 'message bot';
      
      // Process message for special formatting
      const processedMessage = this.processMessageFormatting(message);
      
      messageElement.innerHTML = `
        <div class="message-text">${processedMessage}</div>
      `;

      messagesContainer.appendChild(messageElement);
      this.scrollToBottom();

      // Typing animation
      this.animateTyping(messageElement);

      // Store in conversation history
      this.conversationHistory.push({
        type: 'bot',
        message: message,
        timestamp: Date.now()
      });

      this.saveConversationHistory();
    }, delay);
  }

  animateTyping(messageElement) {
    const textElement = messageElement.querySelector('.message-text');
    const originalText = textElement.textContent;
    
    textElement.textContent = '';
    
    // Animate text appearing character by character
    let i = 0;
    const typeInterval = setInterval(() => {
      textElement.textContent += originalText[i];
      i++;
      
      if (i >= originalText.length) {
        clearInterval(typeInterval);
      }
    }, 30);

    // Animate message entrance
    gsap.from(messageElement, {
      duration: 0.3,
      opacity: 0,
      x: -20,
      ease: "power2.out"
    });
  }

  processMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = '';
    let newContext = this.currentContext;

    // Extract user name if mentioned
    if (lowerMessage.includes('my name is') || lowerMessage.includes("i'm ")) {
      const nameMatch = message.match(/(?:my name is|i'm) (\w+)/i);
      if (nameMatch) {
        this.userName = nameMatch[1];
      }
    }

    // Determine response category
    if (this.containsWords(lowerMessage, ['help', 'what', 'how', 'guide'])) {
      response = this.getRandomResponse('help');
      newContext = 'help';
    } else if (this.containsWords(lowerMessage, ['product', 'item', 'buy', 'purchase', 'cop', 'price'])) {
      response = this.getRandomResponse('products');
      newContext = 'shopping';
    } else if (this.containsWords(lowerMessage, ['style', 'fit', 'look', 'outfit', 'drip', 'fashion'])) {
      response = this.getRandomResponse('styling');
      newContext = 'styling';
    } else if (this.containsWords(lowerMessage, ['size', 'sizing', 'fit'])) {
      response = this.getRandomResponse('sizing');
      newContext = 'sizing';
    } else if (this.containsWords(lowerMessage, ['ship', 'delivery', 'order', 'when'])) {
      response = this.getRandomResponse('shipping');
      newContext = 'shipping';
    } else if (this.containsWords(lowerMessage, ['recommend', 'suggest', 'best', 'good'])) {
      response = this.getRandomResponse('recommendations');
      newContext = 'recommendations';
    } else if (this.containsWords(lowerMessage, ['bye', 'goodbye', 'later', 'peace'])) {
      response = this.getRandomResponse('goodbye');
      newContext = 'goodbye';
    } else if (this.containsWords(lowerMessage, ['thanks', 'thank you', 'thx'])) {
      response = this.getRandomResponse('thanks');
    } else if (this.containsWords(lowerMessage, ['hello', 'hi', 'hey', 'sup', 'yo'])) {
      response = this.getRandomResponse('greetings');
      newContext = 'greeting';
    } else {
      // Default responses based on current context
      response = this.getContextualResponse();
    }

    this.currentContext = newContext;
    this.addBotMessage(response);
  }

  containsWords(message, words) {
    return words.some(word => message.includes(word));
  }

  getRandomResponse(category) {
    const responses = this.responses[category] || this.responses.default;
    const randomIndex = Math.floor(Math.random() * responses.length);
    let response = responses[randomIndex];

    // Replace placeholders
    if (this.userName) {
      response = response.replace('{name}', this.userName);
    }

    return response;
  }

  getContextualResponse() {
    const contextResponses = {
      'greeting': 'default',
      'help': 'help',
      'shopping': 'products',
      'styling': 'styling',
      'sizing': 'sizing',
      'shipping': 'shipping',
      'recommendations': 'recommendations'
    };

    const category = contextResponses[this.currentContext] || 'default';
    return this.getRandomResponse(category);
  }

  processMessageFormatting(message) {
    // Process emojis and special formatting
    return message
      .replace(/:\)/g, '😊')
      .replace(/:\(/g, '😔')
      .replace(/<3/g, '💖')
      .replace(/\bdead\b/g, '💀')
      .replace(/\bfire\b/g, '🔥')
      .replace(/\bdrip\b/g, '💧')
      .replace(/\bmoney\b/g, '💰');
  }

  sanitizeMessage(message) {
    // Basic XSS prevention
    return message
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  showTypingIndicator() {
    // Show that bot is "thinking"
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) {
      indicator.style.display = 'block';
      setTimeout(() => {
        indicator.style.display = 'none';
      }, 2000);
    }
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  initializeGreeting() {
    // Add initial greeting message
    setTimeout(() => {
      if (this.conversationHistory.length === 0) {
        this.addBotMessage("SYBAU king, what fit you looking for today? 💀");
      }
    }, 1000);
  }

  saveConversationHistory() {
    // Keep only last 50 messages to avoid storage bloat
    const recentHistory = this.conversationHistory.slice(-50);
    localStorage.setItem('sephyx_chat_history', JSON.stringify(recentHistory));
  }

  loadConversationHistory() {
    const saved = localStorage.getItem('sephyx_chat_history');
    if (saved) {
      this.conversationHistory = JSON.parse(saved);
      this.restoreMessages();
    }
  }

  restoreMessages() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;

    // Clear existing messages except the initial greeting
    const existingMessages = messagesContainer.querySelectorAll('.message');
    existingMessages.forEach(msg => {
      if (!msg.classList.contains('initial-greeting')) {
        msg.remove();
      }
    });

    // Restore conversation
    this.conversationHistory.forEach(entry => {
      if (entry.type === 'user') {
        this.addUserMessage(entry.message);
      } else {
        this.addBotMessage(entry.message);
      }
    });
  }

  clearConversation() {
    this.conversationHistory = [];
    this.currentContext = 'greeting';
    this.saveConversationHistory();
    
    const messagesContainer = document.getElementById('chatbotMessages');
    if (messagesContainer) {
      messagesContainer.innerHTML = `
        <div class="message bot initial-greeting">
          <div class="message-text">SYBAU king, what fit you looking for today? 💀</div>
        </div>
      `;
    }
  }

  // Analytics
  getConversationStats() {
    return {
      totalMessages: this.conversationHistory.length,
      userMessages: this.conversationHistory.filter(m => m.type === 'user').length,
      botMessages: this.conversationHistory.filter(m => m.type === 'bot').length,
      conversationStarted: this.conversationHistory.length > 0 ? new Date(this.conversationHistory[0].timestamp) : null,
      lastMessage: this.conversationHistory.length > 0 ? new Date(this.conversationHistory[this.conversationHistory.length - 1].timestamp) : null
    };
  }
}

// Add chatbot-specific styles
const chatbotStyles = document.createElement('style');
chatbotStyles.textContent = `
  .chatbot-orb {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  
  .message {
    margin-bottom: var(--spacing-sm);
    animation: messageSlideIn 0.3s ease-out;
  }
  
  @keyframes messageSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .message-text {
    word-wrap: break-word;
    line-height: 1.4;
  }
  
  .typing-indicator {
    display: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--glass-bg);
    border-radius: var(--radius-md);
    color: var(--text-muted);
    font-style: italic;
    margin-bottom: var(--spacing-sm);
  }
  
  .typing-indicator::after {
    content: '...';
    animation: dots 1.5s steps(4, end) infinite;
  }
  
  .chatbot-window::-webkit-scrollbar {
    width: 4px;
  }
  
  .chatbot-window::-webkit-scrollbar-track {
    background: var(--glass-bg);
  }
  
  .chatbot-window::-webkit-scrollbar-thumb {
    background: var(--accent-gold);
    border-radius: 2px;
  }
  
  .chatbot-messages::-webkit-scrollbar {
    width: 4px;
  }
  
  .chatbot-messages::-webkit-scrollbar-track {
    background: var(--glass-bg);
  }
  
  .chatbot-messages::-webkit-scrollbar-thumb {
    background: var(--accent-gold);
    border-radius: 2px;
  }
  
  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }
`;
document.head.appendChild(chatbotStyles);
