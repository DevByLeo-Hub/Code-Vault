const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

const opts = {
    charSize: 30, 
    charSpacing: 35, 
    
    fireworkPrevPoints: 10,
    fireworkBaseLineWidth: 5, 
    fireworkAddedLineWidth: 8,
    fireworkBaseReachTime: 30, 
    fireworkAddedReachTime: 30,
    
    fireworkCircleBaseSize: 20, 
    fireworkCircleAddedSize: 10,
    fireworkCircleBaseTime: 30, 
    fireworkCircleAddedTime: 30,
    fireworkCircleFadeBaseTime: 10, 
    fireworkCircleFadeAddedTime: 5,
    
    fireworkBaseShards: 5, 
    fireworkAddedShards: 5,
    fireworkShardPrevPoints: 3, 
    fireworkShardBaseVel: 4, 
    fireworkShardAddedVel: 2,
    fireworkShardBaseSize: 3, 
    fireworkShardAddedSize: 3,
    
    gravity: 0.1, 
    upFlow: -0.15, 
    
    balloonSpawnTime: 20,
    balloonBaseInflateTime: 10,
    balloonAddedInflateTime: 10,
    balloonBaseSize: 8, 
    balloonAddedSize: 4
};


const sequence = [
    { text: "HAPPY",       spawnDelay: 180, waitTime: 380, yOffset: -30 }, // Nasce e espera bastante
    { text: "MOTHER DAY",  spawnDelay: 550, waitTime: 250, yOffset: 30 },  // Nasce depois, espera menos (para subir quase junto). Delay longo para a pausa.
    
    { text: "TO MY",       spawnDelay: 180, waitTime: 380, yOffset: -30 }, 
    { text: "LOVELY MOM!", spawnDelay: 550, waitTime: 250, yOffset: 30 }
];

let tick = 0;
let currentString = 0;
let spawnTimer = 0; 
let letters = [];

function Shard(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = opts.fireworkShardBaseSize + Math.random() * opts.fireworkShardAddedSize;
    this.prevPoints = [];
    this.alive = true;
}

Shard.prototype.step = function() {
    this.prevPoints.push({ x: this.x, y: this.y });
    if (this.prevPoints.length > opts.fireworkShardPrevPoints) {
        this.prevPoints.shift();
    }
    this.x += this.vx;
    this.y += this.vy;
    this.vy += opts.gravity; 
    if (this.y > h || this.x < 0 || this.x > w) {
        this.alive = false;
    }
};

Shard.prototype.draw = function() {
    ctx.lineWidth = this.size;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    if (this.prevPoints.length > 0) {
        ctx.moveTo(this.prevPoints[0].x, this.prevPoints[0].y);
        for (let i = 1; i < this.prevPoints.length; i++) {
            ctx.lineTo(this.prevPoints[i].x, this.prevPoints[i].y);
        }
        ctx.lineTo(this.x, this.y);
    }
    ctx.stroke();
};

function Letter(char, targetX, targetY, waitTime) {
    this.char = char;
    this.targetX = targetX;
    this.targetY = targetY;
    
    this.x = w / 2;
    this.y = h + 10; 
    
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
    
    this.reachTime = opts.fireworkBaseReachTime + Math.random() * opts.fireworkAddedReachTime | 0;
    this.contemplateWaitTime = waitTime; 
    
    this.lineWidth = opts.fireworkBaseLineWidth + Math.random() * opts.fireworkAddedLineWidth;
    
    this.prevPoints = [];
    this.tick = 0;
    this.phase = 'firework';
    
    this.circleSize = 0;
    this.circleFinalSize = opts.fireworkCircleBaseSize + Math.random() * opts.fireworkCircleAddedSize;
    this.circleTime = opts.fireworkCircleBaseTime + Math.random() * opts.fireworkCircleAddedTime | 0;
    this.circleFadeTime = opts.fireworkCircleFadeBaseTime + Math.random() * opts.fireworkCircleFadeAddedTime | 0;
    
    this.shards = [];
    
    this.balloonSpawnTime = Math.random() * opts.balloonSpawnTime | 0;
    this.inflating = false;
    this.inflateTime = opts.balloonBaseInflateTime + Math.random() * opts.balloonAddedInflateTime | 0;
    this.balloonSize = 0;
    this.balloonFinalSize = opts.balloonBaseSize + Math.random() * opts.balloonAddedSize;
    
    this.vy = 0;
    this.balloonVx = (Math.random() - 0.5) * 1.5; 
    this.balloonCurve = (Math.random() - 0.5) * 0.02; 
}

Letter.prototype.step = function() {
    this.tick++;
    
    if (this.phase === 'firework') {
        this.prevPoints.push({ x: this.x, y: this.y });
        if (this.prevPoints.length > opts.fireworkPrevPoints) {
            this.prevPoints.shift();
        }
        
        let progress = this.tick / this.reachTime;
        let armonic = Math.sin(progress * (Math.PI / 2));
        
        this.x = w / 2 + (this.targetX - w / 2) * progress;
        this.y = h + 10 + (this.targetY - (h + 10)) * armonic;
        
        if (this.tick >= this.reachTime) {
            this.phase = 'contemplate';
            this.tick = 0;
            this.x = this.targetX;
            this.y = this.targetY;
            
            let shardCount = opts.fireworkBaseShards + Math.random() * opts.fireworkAddedShards | 0;
            let angleOffset = Math.random() * Math.PI * 2;
            for (let i = 0; i < shardCount; i++) {
                let angle = angleOffset + (i / shardCount) * Math.PI * 2;
                let vel = opts.fireworkShardBaseVel + Math.random() * opts.fireworkShardAddedVel;
                this.shards.push(new Shard(this.x, this.y, Math.cos(angle) * vel, Math.sin(angle) * vel, this.color));
            }
        }
    } 
    else if (this.phase === 'contemplate') {
        for (let i = this.shards.length - 1; i >= 0; i--) {
            this.shards[i].step();
            if (!this.shards[i].alive) {
                this.shards.splice(i, 1);
            }
        }
        
        if (this.tick > this.contemplateWaitTime) {
            this.phase = 'balloon';
            this.tick = 0;
        }
    } 
    else if (this.phase === 'balloon') {
        if (this.tick >= this.balloonSpawnTime && !this.inflating) {
            this.inflating = true;
            this.tick = 0;
            this.vy = 0;
        }
        
        if (this.inflating) {
            if (this.tick <= this.inflateTime) {
                this.balloonSize = this.balloonFinalSize * (this.tick / this.inflateTime);
            } else {
                this.vy -= 0.15; 
                this.balloonVx += this.balloonCurve; 
                
                this.x += this.balloonVx; 
                this.y += this.vy + opts.upFlow; 
                
                if (this.y < -150) {
                    this.phase = 'done';
                }
            }
        }
    }
};

Letter.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    
    if (this.phase === 'firework') {
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (this.prevPoints.length > 0) {
            ctx.moveTo(this.prevPoints[0].x, this.prevPoints[0].y);
            for (let i = 1; i < this.prevPoints.length; i++) {
                ctx.lineTo(this.prevPoints[i].x, this.prevPoints[i].y);
            }
            ctx.lineTo(this.x, this.y);
        }
        ctx.stroke();
    } 
    else if (this.phase === 'contemplate') {
        if (this.tick < this.circleTime) {
            this.circleSize = this.circleFinalSize * (this.tick / this.circleTime);
            ctx.globalAlpha = 1;
        } else if (this.tick < this.circleTime + this.circleFadeTime) {
            this.circleSize = this.circleFinalSize;
            ctx.globalAlpha = 1 - ((this.tick - this.circleTime) / this.circleFadeTime);
        } else {
            ctx.globalAlpha = 0;
        }
        
        if (ctx.globalAlpha > 0) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.circleSize, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        
        for (let i = 0; i < this.shards.length; i++) {
            this.shards[i].draw();
        }
        
        ctx.font = `bold ${opts.charSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char, this.x, this.y);
    }
    else if (this.phase === 'balloon') {
        if (this.inflating) {
            let r = this.balloonSize;
            let stringLength = 35; 
            
            let bx = this.x; 
            let by = this.y - opts.charSize / 2 - stringLength;
            
            ctx.fillStyle = this.color;
            ctx.font = `bold ${opts.charSize}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.char, this.x, this.y);

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - opts.charSize / 2 + 5); 
            ctx.lineTo(bx, by);
            ctx.stroke();
            
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.bezierCurveTo(bx - r * 1.15, by, bx - r * 1.15, by - r * 2.5, bx, by - r * 2.5);
            ctx.bezierCurveTo(bx + r * 1.15, by - r * 2.5, bx + r * 1.15, by, bx, by);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx - r * 0.2, by + r * 0.25);
            ctx.lineTo(bx + r * 0.2, by + r * 0.25);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.ellipse(bx - r * 0.35, by - r * 1.6, r * 0.2, r * 0.3, Math.PI / 5, 0, Math.PI * 2);
            ctx.fill();
            
        } else {
            ctx.fillStyle = this.color;
            ctx.font = `bold ${opts.charSize}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.char, this.x, this.y);
        }
    }
};

function spawnString() {
    if (currentString >= sequence.length) {
        currentString = 0;
    }
    
    let seq = sequence[currentString];
    currentString++;
    
    spawnTimer = seq.spawnDelay;
    
    let text = seq.text;
    let totalWidth = (text.length - 1) * opts.charSpacing;
    let startX = w / 2 - totalWidth / 2;
    let y = h / 2 + seq.yOffset; 
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] !== ' ') {
            letters.push(new Letter(text[i], startX + i * opts.charSpacing, y, seq.waitTime));
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    
    tick++;
    if (tick >= spawnTimer) {
        tick = 0;
        spawnString();
    }
    
    for (let i = letters.length - 1; i >= 0; i--) {
        letters[i].step();
        letters[i].draw();
        
        if (letters[i].phase === 'done') {
            letters.splice(i, 1);
        }
    }
}

spawnString();
animate();