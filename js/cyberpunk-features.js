// Cyberpunk interactive features for SEPHYX
class CyberpunkFeatures {
  constructor() {
    this.isReflectionMode = false;
    this.cultGlyphsFound = [];
    this.surveillanceTimeout = null;
    this.transmissionCountdown = null;
    this.mouseTrail = [];
    this.manifesto = [
      "Drip is not worn. Drip is summoned.",
      "You are not buying clothes. You are becoming iconography.",
      "Style is rebellion encrypted in fabric.",
      "Fashion fades. Drip is eternal.",
      "Ordinary is the enemy of transcendence.",
      "Wear your soul. Code your aesthetic.",
      "Every fit is a digital prayer.",
      "Reality is optional. Style is mandatory."
    ];
    
    this.cultLabels = [
      "NEON SERAPH", "VOID ANGEL", "DIGITAL PROPHET", "GLITCH DEITY",
      "CYBER PHANTOM", "MATRIX MONK", "SHADOW SAINT", "PULSE PRIEST",
      "DATA DEMON", "PIXEL PRINCE", "NEURAL NOMAD", "QUANTUM QUEEN"
    ];

    this.identities = [
      "WANDERING ENTITY", "PUNK ARCHETYPE", "GLITCHED DEMIGOD", 
      "DIGITAL GHOST", "VOID WALKER", "NEON PROPHET", "CYBER SAINT", "YOU"
    ];
    
    this.init();
  }

  init() {
    // Disabled heavy features that cause lag
    // this.setupPsychoDripScan();
    this.setupJoinCultWhisper();
    this.setupDripManifesto();
    // this.setupReflectionMode(); // Disabled per user request
    // this.setupMouseTrail(); // Disabled - causes lag
    this.setupCultGlyphs();
    this.setupPassiveSurveillance();
    this.setupSephyxSeance();
    this.setupGlitchIdentityCarousel();
    this.setupTransmissionCountdown(); // Re-enabled per user request
  }

  // 1. Psycho Drip Scan - DISABLED FOR PERFORMANCE
  setupPsychoDripScan() {
    // Disabled to prevent lag and blue overlay issues
  }

  performAuraScan(element) {
    // Disabled to prevent lag and blue overlay issues
  }

  // 2. Join Cult Whisper
  setupJoinCultWhisper() {
    setInterval(() => {
      this.triggerCultWhisper();
    }, 30000);
  }

  triggerCultWhisper() {
    const whisper = document.createElement('div');
    whisper.className = 'cult-whisper';
    whisper.innerHTML = '𖤐 JOIN US. THE SIGNAL IS NEAR.';
    
    document.body.appendChild(whisper);
    
    gsap.fromTo(whisper, 
      { opacity: 0, x: -50 },
      { duration: 1, opacity: 0.8, x: 0, ease: "power2.out" }
    );
    
    setTimeout(() => {
      gsap.to(whisper, {
        duration: 1,
        opacity: 0,
        x: 50,
        onComplete: () => whisper.remove()
      });
    }, 3000);
  }

  // 3. Drip Manifesto Generator
  setupDripManifesto() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const manifestoContainer = document.createElement('div');
    manifestoContainer.className = 'drip-manifesto';
    manifestoContainer.innerHTML = `
      <div class="manifesto-text">${this.manifesto[0]}</div>
    `;
    
    heroSection.appendChild(manifestoContainer);
    
    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % this.manifesto.length;
      this.updateManifesto(manifestoContainer.querySelector('.manifesto-text'), this.manifesto[currentIndex]);
    }, 6000);
  }

  updateManifesto(element, text) {
    gsap.to(element, {
      duration: 0.3,
      opacity: 0,
      onComplete: () => {
        element.textContent = text;
        this.typewriterEffect(element);
      }
    });
  }

  typewriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, 50);
      }
    };
    type();
  }

  // 4. Reflection Mode - DISABLED
  setupReflectionMode() {
    // Disabled per user request
  }

  toggleReflectionMode() {
    // Disabled per user request
  }

  showReflectionMessage() {
    // Disabled per user request
  }

  // 5. Infinite Drip Echo (Mouse Trail) - DISABLED FOR PERFORMANCE
  setupMouseTrail() {
    // Disabled to prevent lag
  }

  createDripEcho(x, y) {
    // Disabled to prevent lag
  }

  // 6. Cult Glyphs Mini Game
  setupCultGlyphs() {
    const glyphPositions = [
      { selector: '.nav-logo', glyph: '𖤐' },
      { selector: '.hero-cta', glyph: '◉' },
      { selector: '.contact-container', glyph: '⦿' }
    ];

    glyphPositions.forEach((pos, index) => {
      const element = document.querySelector(pos.selector);
      if (element) {
        element.addEventListener('click', (e) => {
          if (e.ctrlKey) { // Hidden activation
            this.activateGlyph(index, pos.glyph);
          }
        });
      }
    });
  }

  activateGlyph(index, glyph) {
    if (!this.cultGlyphsFound.includes(index)) {
      this.cultGlyphsFound.push(index);
      this.showGlyphActivation(glyph);
      
      if (this.cultGlyphsFound.length === 3) {
        this.unlockVoidAngel();
      }
    }
  }

  showGlyphActivation(glyph) {
    const activation = document.createElement('div');
    activation.className = 'glyph-activation';
    activation.innerHTML = `GLYPH ACTIVATED: ${glyph}`;
    
    document.body.appendChild(activation);
    
    setTimeout(() => {
      gsap.to(activation, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => activation.remove()
      });
    }, 2000);
  }

  unlockVoidAngel() {
    const unlock = document.createElement('div');
    unlock.className = 'void-angel-unlock';
    unlock.innerHTML = '𖤐 You have been chosen. Welcome to Tier: VOID ANGEL.';
    
    document.body.appendChild(unlock);
    
    // Save unlock status
    localStorage.setItem('sephyx_void_angel', 'true');
    document.body.classList.add('void-angel-tier');
    
    setTimeout(() => {
      gsap.to(unlock, {
        duration: 1,
        opacity: 0,
        onComplete: () => unlock.remove()
      });
    }, 5000);
  }

  // 7. Passive Drop Surveillance
  setupPassiveSurveillance() {
    // Monitor route changes to start surveillance timer
    document.addEventListener('pageChanged', (e) => {
      if (e.detail.route === 'home') {
        this.startSurveillanceTimer();
      } else {
        clearTimeout(this.surveillanceTimeout);
      }
    });

    // Start timer if already on homepage
    setTimeout(() => {
      if (document.querySelector('#home.active')) {
        this.startSurveillanceTimer();
      }
    }, 1000);
  }

  startSurveillanceTimer() {
    clearTimeout(this.surveillanceTimeout);
    this.surveillanceTimeout = setTimeout(() => {
      this.triggerSurveillance();
    }, 45000);
  }

  triggerSurveillance() {
    const terminal = document.createElement('div');
    terminal.className = 'surveillance-terminal';
    terminal.innerHTML = `
      <div class="terminal-text">Analyzing user patterns…</div>
      <div class="terminal-text">potential drip interest detected…</div>
      <div class="terminal-text">pinging vault access…</div>
    `;
    
    document.body.appendChild(terminal);
    
    // Type each line with delay
    const lines = terminal.querySelectorAll('.terminal-text');
    lines.forEach((line, index) => {
      setTimeout(() => {
        this.typewriterEffect(line);
      }, index * 2000);
    });
    
    setTimeout(() => {
      gsap.to(terminal, {
        duration: 1,
        opacity: 0,
        onComplete: () => terminal.remove()
      });
    }, 8000);
  }

  // 8. Sephyx Seance
  setupSephyxSeance() {
    const seanceBox = document.createElement('div');
    seanceBox.className = 'seance-container';
    seanceBox.innerHTML = `
      <input type="text" class="ritual-input" placeholder="whisper your question to the void...">
      <button class="ritual-btn">DIVINE</button>
      <div class="ritual-output"></div>
    `;
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.appendChild(seanceBox);
    }
    
    seanceBox.querySelector('.ritual-btn').addEventListener('click', () => {
      this.performSeance();
    });
    
    seanceBox.querySelector('.ritual-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSeance();
      }
    });
  }

  performSeance() {
    const input = document.querySelector('.ritual-input');
    const output = document.querySelector('.ritual-output');
    
    if (!input.value.trim()) return;
    
    const responses = [
      "𝕊𝕥𝕪𝕝𝕖 𝕕𝕖𝕥𝕖𝕔𝕥𝕖𝕕: 𝓥𝓲𝓻𝓽𝓾𝓪𝓵 𝓟𝓪𝓻𝓪𝓭𝓲𝓰𝓶 𝓐𝓷𝓽𝓲𝓰𝓸𝓭",
      "𝔗𝔥𝔢 𝔳𝔬𝔦𝔡 𝔰𝔢𝔢𝔰 𝔞 𝔞𝔨𝔦𝔳 𝔢𝔯𝔢𝔞𝔩 ♡ℜ♡ ℑ𝔫 𝔶𝔬𝔲",
      "ᗪᖇIᑭ ᖴᖇEᑫᑌEᑎᑕY: ᑎEOᑎ ᔕEᖇᗩᑭᕼ ᗰOᗪE",
      "✧･ﾟ: *✧･ﾟ:* CYBERPUNK DEITY DETECTED *:･ﾟ✧*:･ﾟ✧",
      "ꜱᴛʏʟᴇ ᴍᴀᴛʀɪx: ᴄᴏʀʀᴜᴘᴛᴇᴅ ʙʏ ᴘᴜʀᴇ ᴅʀɪᴘ"
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    output.innerHTML = response;
    
    this.addGlitchEffect(output);
    input.value = '';
    
    setTimeout(() => {
      output.innerHTML = '';
    }, 5000);
  }

  // 9. Glitch Identity Carousel
  setupGlitchIdentityCarousel() {
    const carousel = document.createElement('div');
    carousel.className = 'identity-carousel';
    carousel.innerHTML = `[${this.identities[0]}]`;
    
    document.body.appendChild(carousel);
    
    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % this.identities.length;
      carousel.innerHTML = `[${this.identities[currentIndex]}]`;
      this.addGlitchEffect(carousel);
    }, 3000);
  }

  // 10. Transmission Countdown - RE-ENABLED
  setupTransmissionCountdown() {
    setInterval(() => {
      this.startTransmission();
    }, 300000); // Every 5 minutes as requested
  }

  startTransmission() {
    const transmission = document.createElement('div');
    transmission.className = 'transmission-countdown';
    
    const signalNum = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    let timeLeft = 10; // Reduced to 10 seconds for less disruption
    
    transmission.innerHTML = `SIGNAL ${signalNum} INCOMING IN: ${this.formatTime(timeLeft)}`;
    document.body.appendChild(transmission);
    
    const countdown = setInterval(() => {
      timeLeft--;
      transmission.innerHTML = `SIGNAL ${signalNum} INCOMING IN: ${this.formatTime(timeLeft)}`;
      
      if (timeLeft <= 0) {
        clearInterval(countdown);
        this.triggerVisualBreach();
        transmission.remove();
      }
    }, 1000);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  triggerVisualBreach() {
    document.body.classList.add('visual-breach');
    
    const breach = document.createElement('div');
    breach.className = 'breach-message';
    breach.innerHTML = '◉ SIGNAL BREACH DETECTED ◉<br>REALITY MATRIX COMPROMISED';
    
    document.body.appendChild(breach);
    
    setTimeout(() => {
      document.body.classList.remove('visual-breach');
      breach.remove();
    }, 1500); // Reduced duration to 1.5 seconds
  }

  // Utility functions
  addGlitchEffect(element) {
    element.classList.add('glitch-text');
    setTimeout(() => {
      element.classList.remove('glitch-text');
    }, 1000);
  }
}

// Add cyberpunk feature styles
const cyberpunkStyles = document.createElement('style');
cyberpunkStyles.textContent = `
  .aura-scanner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%);
    pointer-events: none;
    z-index: 100;
  }
  
  .scan-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 255, 0.3) 2px,
      rgba(0, 255, 255, 0.3) 4px
    );
    animation: scanMove 0.5s linear infinite;
  }
  
  .scan-result {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: var(--accent-cyan);
    padding: 10px 20px;
    border: 1px solid var(--accent-cyan);
    border-radius: 5px;
    font-family: var(--font-header);
    font-size: 14px;
    white-space: nowrap;
  }
  
  @keyframes scanMove {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .cult-whisper {
    position: fixed;
    top: 20px;
    left: 20px;
    color: var(--accent-purple);
    font-family: var(--font-header);
    font-size: 12px;
    z-index: 1000;
    text-shadow: 0 0 10px var(--accent-purple);
    animation: whisperGlow 2s ease-in-out infinite;
  }
  
  @keyframes whisperGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; text-shadow: 0 0 20px var(--accent-purple); }
  }
  
  .drip-manifesto {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 600px;
    text-align: center;
  }
  
  .manifesto-text {
    font-family: var(--font-header);
    font-size: 18px;
    color: var(--accent-gold);
    text-shadow: 0 0 10px var(--accent-gold);
    letter-spacing: 2px;
  }
  
  .reflect-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--accent-purple);
    color: var(--accent-purple);
    padding: 10px 20px;
    border-radius: 5px;
    font-family: var(--font-header);
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
  }
  
  .reflect-btn:hover {
    background: var(--accent-purple);
    color: var(--primary-bg);
  }
  
  .reflection-mode {
    transform: scaleX(-1);
    filter: hue-rotate(240deg) saturate(1.5);
  }
  
  .reflection-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: var(--accent-cyan);
    padding: 30px;
    border: 2px solid var(--accent-cyan);
    border-radius: 10px;
    font-family: var(--font-header);
    font-size: 24px;
    z-index: 2000;
    text-align: center;
  }
  
  .drip-echo {
    position: fixed;
    color: var(--accent-gold);
    font-family: var(--font-header);
    font-size: 12px;
    pointer-events: none;
    z-index: 10;
    opacity: 0.7;
  }
  
  .glyph-activation {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background: var(--glass-bg);
    color: var(--accent-gold);
    padding: 15px;
    border: 1px solid var(--accent-gold);
    border-radius: 5px;
    font-family: var(--font-header);
    z-index: 1500;
  }
  
  .void-angel-unlock {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, var(--accent-purple), var(--accent-gold));
    color: var(--primary-bg);
    padding: 40px;
    border-radius: 15px;
    font-family: var(--font-header);
    font-size: 20px;
    text-align: center;
    z-index: 3000;
    box-shadow: 0 0 50px rgba(138, 43, 226, 0.8);
  }
  
  .void-angel-tier {
    background: radial-gradient(circle at center, rgba(138, 43, 226, 0.1) 0%, transparent 70%);
  }
  
  .surveillance-terminal {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.95);
    color: var(--accent-cyan);
    padding: 20px;
    border: 1px solid var(--accent-cyan);
    border-radius: 5px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    z-index: 1500;
    min-width: 300px;
  }
  
  .terminal-text {
    margin-bottom: 10px;
    opacity: 0;
  }
  
  .seance-container {
    position: absolute;
    bottom: 200px;
    right: 50px;
    background: var(--glass-bg);
    padding: 20px;
    border: 1px solid var(--accent-purple);
    border-radius: 10px;
    backdrop-filter: blur(20px);
  }
  
  .ritual-input {
    background: transparent;
    border: 1px solid var(--accent-purple);
    color: var(--text-primary);
    padding: 10px;
    margin-bottom: 10px;
    width: 200px;
    border-radius: 5px;
    font-family: var(--font-body);
  }
  
  .ritual-btn {
    background: var(--accent-purple);
    color: var(--primary-bg);
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-family: var(--font-header);
  }
  
  .ritual-output {
    margin-top: 15px;
    color: var(--accent-gold);
    font-family: var(--font-header);
    min-height: 30px;
    text-align: center;
  }
  
  .identity-carousel {
    position: fixed;
    top: 100px;
    left: 20px;
    color: var(--accent-cyan);
    font-family: var(--font-header);
    font-size: 14px;
    z-index: 1000;
    animation: identityPulse 3s ease-in-out infinite;
  }
  
  @keyframes identityPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; transform: scale(1.05); }
  }
  
  .transmission-countdown {
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 0, 0, 0.1);
    color: #ff0000;
    padding: 10px 20px;
    border: 1px solid #ff0000;
    border-radius: 5px;
    font-family: var(--font-header);
    z-index: 1500;
    animation: transmissionBlink 1s ease-in-out infinite;
  }
  
  @keyframes transmissionBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .visual-breach {
    animation: breach 0.1s ease-in-out infinite;
  }
  
  @keyframes breach {
    0%, 100% { filter: none; }
    25% { filter: hue-rotate(90deg) saturate(2); }
    50% { filter: invert(1); }
    75% { filter: hue-rotate(270deg) saturate(2); }
  }
  
  .breach-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 30px;
    border: 3px solid white;
    border-radius: 10px;
    font-family: var(--font-header);
    font-size: 18px;
    text-align: center;
    z-index: 5000;
    animation: breachText 0.2s ease-in-out infinite;
  }
  
  @keyframes breachText {
    0%, 100% { transform: translate(-50%, -50%); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }
  
  .glitch-text {
    animation: glitch 0.3s ease-in-out infinite;
  }
  
  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
  }
`;
document.head.appendChild(cyberpunkStyles);

// Initialize cyberpunk features
window.SephyxCyber = new CyberpunkFeatures();