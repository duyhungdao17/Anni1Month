const giftContainer = document.getElementById('giftContainer');
const giftBox = document.getElementById('giftBox');
const boxBody = document.getElementById('boxBody');

const imageList = [];
const gifList = [
  'https://i.pinimg.com/originals/bc/33/f3/bc33f3bc72f43ca1045b7c4f98dc760d.gif',
  'https://i.pinimg.com/originals/33/76/db/3376dbdfc1b6e8b71a2ea7353e4fc0f2.gif',
  'https://i.pinimg.com/originals/6a/ec/ee/6aecee875e4844f34a1539054bf8aa8a.gif',
  'https://i.pinimg.com/originals/1d/ea/fb/1deafb64c0c0c1c64700548be28c1a0f.gif',
  'https://i.pinimg.com/originals/c2/22/bf/c222bf9ed4b952db2259dd39f98a97a1.gif',
  'https://i.pinimg.com/originals/5c/f8/49/5cf849f45bad6a929714a2409b51d75f.gif',
  'https://i.pinimg.com/originals/45/c9/a6/45c9a6bc85a1af62e70b1da357d1a3cb.gif',
  'https://i.pinimg.com/originals/74/7d/d5/747dd59381484e52d37fb5ed2988115a.gif',
  'https://i.pinimg.com/originals/ae/4d/b2/ae4db26185faa3877723c5914dd91523.gif'
];

for (let i = 1; i <= 36; i++) {
  if (Math.random() < 0.3) {
    imageList.push(`./style/image/her${i}.jpg`);
  } else {
    const gif = gifList[Math.floor(Math.random() * gifList.length)];
    imageList.push(gif);
  }
}

// Tạo container chứa từng chữ
const mess = document.createElement('div');
mess.classList.add('message-container');
giftContainer.appendChild(mess);

const message = "Happy Anniversary 1 Month, Babe 🥰";
const words = message.split(' ');
const wordElements = [];

words.forEach(word => {
  const span = document.createElement('span');
  span.textContent = word;
  mess.appendChild(span);
  wordElements.push(span);
});

function showMessageLettersSequentially() {
  mess.style.opacity = '1';
  wordElements.forEach((span, i) => {
    setTimeout(() => {
      span.style.opacity = '1';
      span.style.animation = `bounceUpDown 1.2s ease-in-out ${i * 0.1}s infinite`;
      if (i === wordElements.length - 1) {
        setTimeout(() => {
          dropFallingIcons();
        }, 800);
      }

    }, i * 500);
  });
}


function shootImagesFromBottomToRandomTarget(callback) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let index = 0;

  const interval = setInterval(() => {
    if (index >= imageList.length) {
      clearInterval(interval);
      if(callback) callback();
      return;
    }

    const img = document.createElement('img');
    img.src = imageList[index];
    img.classList.add('lava');

    const baseSize = Math.min(screenWidth * 0.1, 150);
    img.style.width = `${baseSize}px`;

    const startX = screenWidth / 2;
    const startY = screenHeight;

    const targetX = Math.random() * screenWidth;
    const targetY = Math.random() * (screenHeight / 2);

    const dx = targetX - startX;
    const dy = targetY - startY;

    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;
    img.style.transform = `translate(-50%, -50%)`;

    const midX = dx / 2;
    const peakY = dy * 0.6;

    img.animate([
      { transform: `translate(-50%, -50%) translate(0, 0) scale(0.2)`, opacity: 0.5 },
      { transform: `translate(-50%, -50%) translate(${midX}px, ${peakY}px) scale(1)`, opacity: 1 },
      { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(1.2)`, opacity: 0 }
    ], {
      duration: 4000,
      easing: 'ease-out',
      fill: 'forwards'
    });

    document.body.appendChild(img);
    setTimeout(() => img.remove(), 2500);

    index++;
  }, 700);
}

giftBox.addEventListener('click', () => {
  giftContainer.classList.add('open');
  const audio = document.getElementById('bg-music');
  audio.volume = 0.3;    
  audio.play(); 

  setTimeout(() => {
    giftContainer.classList.add('drop');
  }, 1500);

  setTimeout(() => {
    startFireworks();
    shootImagesFromBottomToRandomTarget(() => {
      showMessageLettersSequentially();
    });
  }, 3500);

  // Tạo nhiều trái tim tỏa ra từ đầu
  for (let i = 0; i < 100; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = '💖';

    const angle = Math.random() * 2 * Math.PI;
    const distance = 150 + Math.random() * 50;
    const x = Math.cos(angle) * distance + 'px';
    const y = Math.sin(angle) * distance + 'px';

    heart.style.setProperty('--x', x);
    heart.style.setProperty('--y', y);
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.transform = 'translate(-50%, -50%)';

    giftContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 1600);
  }
});

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let cw, ch;

function resize() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Firework {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = distance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while(this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 5;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 8;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if(this.targetRadius < 8) this.targetRadius += 0.3;
    this.speed *= this.acceleration;

    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = distance(this.sx, this.sy, this.x + vx, this.y + vy);

    if(this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while(this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 0.7;
    this.hue = random(0, 360);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if(this.alpha <= 0) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.stroke();
  }
}

function createParticles(x, y) {
  let particleCount = 30;
  while(particleCount--) {
    particles.push(new Particle(x, y));
  }
}

function distance(aX, aY, bX, bY) {
  const dx = bX - aX;
  const dy = bY - aY;
  return Math.sqrt(dx * dx + dy * dy);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

let fireworks = [];
let particles = [];
let animationFrameId;

function loop() {
  animationFrameId = requestAnimationFrame(loop);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  if(fireworks.length < 5) {
    fireworks.push(new Firework(
      cw / 2,
      ch,
      random(100, cw - 100),
      random(50, ch / 2)
    ));
  }
}

function startFireworks() {
  if(!animationFrameId) {
    loop();
  }
}

function stopFireworks() {
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  fireworks = [];
  particles = [];
  ctx.clearRect(0, 0, cw, ch);
}

function dropFallingIcons() {
  const icons = ['💞', '💏', '🎈', '💑', '💝', '😘', '🤗', '🥰', '😍'];

  const interval = setInterval(() => {
    const icon = document.createElement('div');
    icon.textContent = icons[Math.floor(Math.random() * icons.length)];
    icon.style.position = 'fixed';
    icon.style.left = `${Math.random() * 100}vw`;
    icon.style.top = `-5vh`;
    icon.style.fontSize = `${Math.random() * 2 + 1.5}rem`;
    icon.style.pointerEvents = 'none';
    icon.style.userSelect = 'none';
    icon.style.zIndex = '9999';
    icon.style.opacity = 0.9;

    icon.style.animation = 'fall 4s linear forwards';
    document.body.appendChild(icon);

    setTimeout(() => icon.remove(), 4000);
  }, 200);
}

// CSS animation
const style = document.createElement('style');
style.textContent = `
@keyframes fall {
  to {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0;
  }
}
`;
document.head.appendChild(style);
