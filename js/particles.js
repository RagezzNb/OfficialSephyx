// Particle system for background effects and ambient animations
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.particleCount = 50;
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    this.isRunning = false;
    
    this.mouse = {
      x: 0,
      y: 0,
      moved: false
    };
    
    this.init();
  }

  init() {
    this.createCanvas();
    this.setupEventListeners();
    this.createParticles();
  }

  createCanvas() {
    // Remove existing canvas if any
    const existingCanvas = document.getElementById('particlesCanvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particlesCanvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.moved = true;
      
      // Reset mouse moved flag after a delay
      setTimeout(() => {
        this.mouse.moved = false;
      }, 100);
    });

    // Page visibility API to pause/resume
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  resize() {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Adjust particle count based on screen size
    const area = window.innerWidth * window.innerHeight;
    this.particleCount = Math.min(100, Math.max(30, Math.floor(area / 25000)));
    
    // Recreate particles if needed
    if (this.particles.length !== this.particleCount) {
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height));
    }
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.animate();
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      particle.update(this.mouse);
      particle.draw(this.ctx);
    });
    
    // Draw connections between nearby particles
    this.drawConnections();
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  drawConnections() {
    const maxDistance = 120;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;
          
          this.ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  // Create burst effect
  createBurst(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const particle = new Particle(this.canvas.width, this.canvas.height);
      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() - 0.5) * 8;
      particle.vy = (Math.random() - 0.5) * 8;
      particle.life = 60; // Temporary particles
      particle.isBurst = true;
      
      this.particles.push(particle);
    }
    
    // Remove burst particles after they fade
    setTimeout(() => {
      this.particles = this.particles.filter(p => !p.isBurst || p.life > 0);
    }, 2000);
  }

  // Handle resize
  handleResize() {
    this.resize();
  }

  // Destroy particle system
  destroy() {
    this.pause();
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// Individual Particle class
class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.reset();
    
    // Particle properties
    this.size = Math.random() * 3 + 1;
    this.originalSize = this.size;
    this.color = this.getRandomColor();
    this.opacity = Math.random() * 0.5 + 0.3;
    this.originalOpacity = this.opacity;
    
    // Physics
    this.friction = 0.98;
    this.gravity = 0.001;
    
    // Special properties
    this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    this.twinklePhase = Math.random() * Math.PI * 2;
    
    this.life = -1; // Infinite life by default
    this.isBurst = false;
  }

  reset() {
    this.x = Math.random() * this.canvasWidth;
    this.y = Math.random() * this.canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.targetX = this.x;
    this.targetY = this.y;
  }

  getRandomColor() {
    const colors = ['#00ffff', '#ffd700', '#8a2be2', '#ffffff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(mouse) {
    // Mouse interaction
    if (mouse.moved) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        this.vx -= (dx / distance) * force * 0.5;
        this.vy -= (dy / distance) * force * 0.5;
      }
    }
    
    // Apply physics
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Boundary collision
    this.handleBoundaries();
    
    // Twinkling effect
    this.twinklePhase += this.twinkleSpeed;
    this.opacity = this.originalOpacity + Math.sin(this.twinklePhase) * 0.3;
    this.size = this.originalSize + Math.sin(this.twinklePhase * 0.5) * 0.5;
    
    // Handle burst particles
    if (this.isBurst && this.life > 0) {
      this.life--;
      this.opacity = (this.life / 60) * this.originalOpacity;
      this.size = this.originalSize * (this.life / 60);
    }
    
    // Random drift
    if (Math.random() < 0.01) {
      this.vx += (Math.random() - 0.5) * 0.1;
      this.vy += (Math.random() - 0.5) * 0.1;
    }
  }

  handleBoundaries() {
    if (this.x < 0) {
      this.x = 0;
      this.vx = Math.abs(this.vx);
    } else if (this.x > this.canvasWidth) {
      this.x = this.canvasWidth;
      this.vx = -Math.abs(this.vx);
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.vy = Math.abs(this.vy);
    } else if (this.y > this.canvasHeight) {
      this.y = this.canvasHeight;
      this.vy = -Math.abs(this.vy) * 0.8; // Bounce with energy loss
    }
  }

  draw(ctx) {
    ctx.save();
    
    // Create gradient for particle
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add inner glow
    ctx.globalAlpha = Math.max(0, this.opacity * 0.5);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// Matrix rain effect (alternative particle system)
class MatrixRain {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.drops = [];
    this.chars = '01SEPHYX$#@%&*()[]{}';
    this.isActive = false;
    
    this.init();
  }

  init() {
    this.createCanvas();
    this.setupDrops();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'matrixCanvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.1;
      display: none;
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.setupDrops();
  }

  setupDrops() {
    const columns = Math.floor(this.canvas.width / 20);
    this.drops = [];
    
    for (let i = 0; i < columns; i++) {
      this.drops[i] = {
        y: Math.random() * this.canvas.height,
        speed: Math.random() * 3 + 1
      };
    }
  }

  start() {
    this.isActive = true;
    this.canvas.style.display = 'block';
    this.animate();
  }

  stop() {
    this.isActive = false;
    this.canvas.style.display = 'none';
  }

  animate() {
    if (!this.isActive) return;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '15px monospace';
    
    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * 20;
      const y = this.drops[i].y;
      
      this.ctx.fillText(char, x, y);
      
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i].y = 0;
      }
      
      this.drops[i].y += this.drops[i].speed;
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Static particles for non-canvas fallback
class StaticParticles {
  constructor() {
    this.container = null;
    this.particles = [];
    this.particleCount = 30;
    
    this.init();
  }

  init() {
    this.container = document.getElementById('bgParticles');
    if (!this.container) return;
    
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      // Random animation delay
      particle.style.animationDelay = Math.random() * 6 + 's';
      
      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      this.container.appendChild(particle);
      this.particles.push(particle);
    }
  }

  destroy() {
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }
}

// Export the main particle system
window.ParticleSystem = ParticleSystem;
window.MatrixRain = MatrixRain;
window.StaticParticles = StaticParticles;
