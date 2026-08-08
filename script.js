const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffaa55);
scene.fog = new THREE.Fog(0xffaa55, 90, 380);

let isDaytime = true;
const DAY_SKY_COLOR = 0xffaa55;
const NIGHT_SKY_COLOR = 0x0a1a2a;
const DAY_FOG_COLOR = 0xffaa55;
const NIGHT_FOG_COLOR = 0x0a1a2a;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffddaa, 0.85);
directionalLight.position.set(70, 100, 40);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -200;
directionalLight.shadow.camera.right = 200;
directionalLight.shadow.camera.top = 200;
directionalLight.shadow.camera.bottom = -200;
directionalLight.shadow.bias = -0.001;
scene.add(directionalLight);

const fillLight = new THREE.DirectionalLight(0xffffee, 0.25);
fillLight.position.set(-50, 40, -20);
scene.add(fillLight);

const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(500, 32, 32),
    new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x2266cc) },
            bottomColor: { value: new THREE.Color(0xffaa55) },
            offset: { value: 33 },
            exponent: { value: 0.6 }
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `,
        side: THREE.BackSide
    })
);
scene.add(skyDome);

const groundSize = 1000;
const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, 1, 1);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xdbb070, roughness: 1.0, metalness: 0.0,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const innerRadius = 80;
const outerRadius = 120;
const trackMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333, roughness: 0.85,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1
});

const trackGeo = new THREE.RingGeometry(innerRadius, outerRadius, 128);
trackGeo.rotateX(-Math.PI / 2);
trackGeo.scale(1, 1, 1.8);
const track = new THREE.Mesh(trackGeo, trackMaterial);
track.receiveShadow = true;
scene.add(track);

const lineMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffcc00, polygonOffset: true, polygonOffsetFactor: -2,
});
const lineGeo = new THREE.RingGeometry((innerRadius + outerRadius)/2 - 0.5, (innerRadius + outerRadius)/2 + 0.5, 128, 1, 0, Math.PI * 2);
lineGeo.rotateX(-Math.PI / 2);
lineGeo.scale(1, 1, 1.8);
const line = new THREE.Mesh(lineGeo, lineMaterial);
scene.add(line);

const createStartFinishLine = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; ctx.fillRect(0,0,256,256);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 128, 128); ctx.fillRect(128, 128, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 2);
    
    const sfMat = new THREE.MeshStandardMaterial({ map: tex, polygonOffset: true, polygonOffsetFactor: -3 });
    const sfGeo = new THREE.PlaneGeometry(outerRadius - innerRadius, 10);
    const sf = new THREE.Mesh(sfGeo, sfMat);
    sf.rotation.x = -Math.PI / 2;
    sf.position.set(100, 0, 0); 
    scene.add(sf);
};
createStartFinishLine();

const createRoute66Sign = () => {
    const signGroup = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 0.2), new THREE.MeshStandardMaterial({color: 0x5c4033, roughness: 0.9}));
    pole.position.y = 2; pole.castShadow = true; signGroup.add(pole);
    
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; ctx.fillRect(0,0,256,256);
    ctx.lineWidth = 10; ctx.strokeRect(15,15,226,226);
    ctx.fillStyle = 'black'; ctx.textAlign = 'center';
    ctx.font = 'bold 50px Arial'; ctx.fillText('ROUTE', 128, 100);
    ctx.font = 'bold 100px Arial'; ctx.fillText('66', 128, 200);
    
    const boardMat = new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas), roughness: 0.8 });
    const board = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), boardMat);
    board.position.set(0, 3.5, 0.11);
    const boardBack = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    boardBack.position.set(0, 3.5, -0.11); boardBack.rotation.y = Math.PI;

    signGroup.add(board); signGroup.add(boardBack);
    signGroup.position.set(125, 0, -30); 
    signGroup.rotation.y = -Math.PI / 2;
    scene.add(signGroup);
};
createRoute66Sign();

const fans = [];
const createFan = (x, z) => {
    const fanGroup = new THREE.Group();

    const shirtColors = [0xcc0000, 0x00cc00, 0x0033cc, 0xffcc00, 0xeeeeee];
    const color = shirtColors[Math.floor(Math.random() * shirtColors.length)];

    const bodyMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 });
    const bodyGeo = new THREE.BoxGeometry(0.6, 1.2, 0.4);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;
    fanGroup.add(body);

    const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.6 }); 
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.45;
    head.castShadow = true;
    fanGroup.add(head);

    fanGroup.position.set(x, 0, z);
    fanGroup.lookAt(0, 0, 0); 
    
    fanGroup.userData = { baseY: 0, jumpOffset: Math.random() * Math.PI * 2, speed: 8 + Math.random() * 4 };
    
    scene.add(fanGroup);
    fans.push(fanGroup);
};

for (let i = 0; i < 300; i++) {
    const angle = Math.random() * Math.PI * 2;
    const isOutside = Math.random() > 0.5;
    const radius = isOutside ? (outerRadius + 3 + Math.random() * 12) : (innerRadius - 3 - Math.random() * 12);
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 1.8;
    
    createFan(x, z);
}

function buildCar(bodyColor, rimColorHex, isPlayer = false) {
    const carGroup = new THREE.Group();
    const wheels = [];
    const wheelRims = [];
    
    const carBodyWidth = 2.0; const carBodyHeight = 0.9; const carBodyLength = 4.0;
    const carBodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.1, metalness: 0.3 });
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(carBodyWidth, carBodyHeight, carBodyLength), carBodyMat);
    carBody.castShadow = true; carBody.receiveShadow = true;
    carGroup.add(carBody);
    
    const carTopWidth = carBodyWidth * 0.85; const carTopHeight = carBodyHeight * 0.7; const carTopLength = carBodyLength * 0.55;
    const carTop = new THREE.Mesh(new THREE.BoxGeometry(carTopWidth, carTopHeight, carTopLength), carBodyMat);
    carTop.position.set(0, carBodyHeight/2 + carTopHeight/2 - 0.1, -carBodyLength * 0.1);
    carTop.castShadow = true; carBody.add(carTop);
    
    const winMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.9 });
    const wsGeo = new THREE.PlaneGeometry(carTopWidth * 0.8, carTopHeight * 0.8);
    const windshield = new THREE.Mesh(wsGeo, winMat);
    windshield.position.set(0, 0.1, carTopLength/2 * 0.95); windshield.rotation.x = -Math.PI * 0.06; carTop.add(windshield);
    const rearWin = new THREE.Mesh(wsGeo, winMat);
    rearWin.position.set(0, 0.1, -carTopLength/2 * 0.95); rearWin.rotation.x = Math.PI * 0.06; carTop.add(rearWin);
    
    const swGeo = new THREE.PlaneGeometry(carTopLength * 0.8, carTopHeight * 0.6);
    const lWin = new THREE.Mesh(swGeo, winMat); lWin.position.set(-carTopWidth/2 - 0.01, 0, 0); lWin.rotation.y = -Math.PI/2; carTop.add(lWin);
    const rWin = new THREE.Mesh(swGeo, winMat); rWin.position.set(carTopWidth/2 + 0.01, 0, 0); rWin.rotation.y = Math.PI/2; carTop.add(rWin);

    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(carBodyWidth * 0.9, 0.1, 0.4), carBodyMat);
    spoiler.position.set(0, carBodyHeight/2 + 0.1, -carBodyLength/2 + 0.2);
    carBody.add(spoiler);
    
    const wRad = 0.4; const wWid = 0.3;
    const wMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: rimColorHex, roughness: 0.2, metalness: 0.5 });
    const wGeo = new THREE.CylinderGeometry(wRad, wRad, wWid, 24); wGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(wRad * 0.6, wRad * 0.6, wWid + 0.01, 10); rimGeo.rotateZ(Math.PI / 2);
    
    const wPos = [
        { x: carBodyWidth/2 + wWid/2, y: -carBodyHeight/2 + wRad, z: carBodyLength/2 - wRad*1.3 },
        { x: -carBodyWidth/2 - wWid/2, y: -carBodyHeight/2 + wRad, z: carBodyLength/2 - wRad*1.3 },
        { x: carBodyWidth/2 + wWid/2, y: -carBodyHeight/2 + wRad, z: -carBodyLength/2 + wRad*1.3 },
        { x: -carBodyWidth/2 - wWid/2, y: -carBodyHeight/2 + wRad, z: -carBodyLength/2 + wRad*1.3 }
    ];
    wPos.forEach(pos => {
        const wheel = new THREE.Mesh(wGeo, wMat); wheel.position.set(pos.x, pos.y, pos.z); wheel.castShadow = true;
        const rim = new THREE.Mesh(rimGeo, rimMat); wheel.add(rim);
        wheelRims.push(rim); wheels.push(wheel); carBody.add(wheel);
    });

    if(isPlayer) {
        const boltGroup = new THREE.Group();
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 0.05), new THREE.MeshBasicMaterial({color: 0xffcc00}));
        b1.rotation.z = -Math.PI / 8; boltGroup.add(b1);
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.05), new THREE.MeshBasicMaterial({color: 0xffcc00}));
        b2.position.set(0.6, -0.3, 0); b2.rotation.z = -Math.PI / 8; boltGroup.add(b2);

        const leftBolt = boltGroup.clone();
        leftBolt.position.set(-carBodyWidth/2 - 0.02, 0, 0); leftBolt.rotation.y = -Math.PI/2;
        carBody.add(leftBolt);
        const rightBolt = boltGroup.clone();
        rightBolt.position.set(carBodyWidth/2 + 0.02, 0, 0); rightBolt.rotation.y = Math.PI/2;
        carBody.add(rightBolt);
    }

    const hlLMat = new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffffee, emissiveIntensity: 0 });
    const hlL = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.2), hlLMat);
    hlL.position.set(-carBodyWidth*0.3, carBodyHeight*0.1, carBodyLength/2+0.01); carBody.add(hlL);
    
    const hlRMat = new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffffee, emissiveIntensity: 0 });
    const hlR = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.2), hlRMat);
    hlR.position.set(carBodyWidth*0.3, carBodyHeight*0.1, carBodyLength/2+0.01); carBody.add(hlR);

    const tlLMat = new THREE.MeshStandardMaterial({ color: 0xff1111, emissive: 0xff1111, emissiveIntensity: 0 });
    const tlL = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.18), tlLMat);
    tlL.position.set(-carBodyWidth*0.35, carBodyHeight*0.1, -carBodyLength/2-0.01); tlL.rotation.y = Math.PI; carBody.add(tlL);
    
    const tlRMat = new THREE.MeshStandardMaterial({ color: 0xff1111, emissive: 0xff1111, emissiveIntensity: 0 });
    const tlR = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.18), tlRMat);
    tlR.position.set(carBodyWidth*0.35, carBodyHeight*0.1, -carBodyLength/2-0.01); tlR.rotation.y = Math.PI; carBody.add(tlR);

    const beamGeo = new THREE.CylinderGeometry(0.1, 1.5, 10, 12); beamGeo.rotateX(Math.PI/2);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    
    const lBeam = new THREE.Mesh(beamGeo, beamMat); lBeam.position.set(-carBodyWidth*0.3, carBodyHeight*0.1, carBodyLength/2+5); lBeam.visible = false; carBody.add(lBeam);
    const rBeam = new THREE.Mesh(beamGeo, beamMat); rBeam.position.set(carBodyWidth*0.3, carBodyHeight*0.1, carBodyLength/2+5); rBeam.visible = false; carBody.add(rBeam);
    
    const ptL = new THREE.PointLight(0xffffee, 0.5, 20); ptL.position.set(-carBodyWidth*0.3, carBodyHeight*0.1, carBodyLength/2); ptL.visible = false; carBody.add(ptL);
    const ptR = new THREE.PointLight(0xffffee, 0.5, 20); ptR.position.set(carBodyWidth*0.3, carBodyHeight*0.1, carBodyLength/2); ptR.visible = false; carBody.add(ptR);

    const lights = {
        materials: [hlLMat, hlRMat, tlLMat, tlRMat],
        objects: [lBeam, rBeam, ptL, ptR]
    };
    
    return { mesh: carGroup, carBody, wheels, wheelRims, lights };
}

const playerData = buildCar(0xcc0000, 0xcc0000, true);
const car = playerData.mesh;
const carBody = playerData.carBody;
const wheels = playerData.wheels;
const wheelRims = playerData.wheelRims;
car.position.set(100, 0.5, 0);
car.rotation.y = Math.PI;
scene.add(car);

const botColors = [0x0033cc, 0x00cc00, 0x555555]; 
const targetSpeedsKmh = [136, 138, 140]; 

const bots = botColors.map((color, index) => {
    const b = buildCar(color, 0x222222, false);
    scene.add(b.mesh);
    
    const laneOffset = (Math.random() - 0.5) * 18; 
    const linearSpeed = targetSpeedsKmh[index] / 120; 
    const angularSpeed = linearSpeed / ((100 + laneOffset) * 1.456); 

    return {
        ...b,
        angle: -0.05 + (index * -0.1), 
        laneOffset: laneOffset,
        angularSpeed: angularSpeed,
        linearSpeed: linearSpeed
    };
});

const allCars = [playerData, ...bots];

let camAngleX = Math.PI; 
let camAngleY = 0.3; 
let isDragging = false;
let previousTouch = null;

const onDragMove = (deltaX, deltaY) => {
    camAngleX -= deltaX * 0.01;
    camAngleY += deltaY * 0.01;
    camAngleY = Math.max(0.05, Math.min(Math.PI / 2.2, camAngleY)); 
};

renderer.domElement.addEventListener('mousedown', () => isDragging = true);
renderer.domElement.addEventListener('mouseup', () => isDragging = false);
renderer.domElement.addEventListener('mouseleave', () => isDragging = false);
renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) onDragMove(e.movementX, e.movementY);
});
renderer.domElement.addEventListener('touchstart', (e) => { previousTouch = e.touches[0]; }, {passive: false});
renderer.domElement.addEventListener('touchend', () => { previousTouch = null; });
renderer.domElement.addEventListener('touchmove', (e) => {
    if (previousTouch) {
        const touch = e.touches[0];
        onDragMove(touch.clientX - previousTouch.clientX, touch.clientY - previousTouch.clientY);
        previousTouch = touch;
    }
}, {passive: false});

const isPointOnTrack = (x, z) => {
    const dist = Math.sqrt(x*x + (z/1.8)*(z/1.8)); 
    return dist > 60 && dist < 140; 
};

const createCactusAt = (x, z, scale = 1) => {
    const cg = new THREE.Group();
    const cMat = new THREE.MeshStandardMaterial({ color: 0x4B6E4B, roughness: 0.9 });
    const th = (Math.random() * 2 + 2) * scale;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3*scale, 0.3*scale, th, 8), cMat);
    trunk.position.y = th / 2; trunk.castShadow = true; cg.add(trunk);
    cg.position.set(x, 0, z); cg.rotation.y = Math.random() * Math.PI * 2; scene.add(cg);
};
for (let i = 0; i < 200; i++) {
    const tx = (Math.random() - 0.5) * 600; const tz = (Math.random() - 0.5) * 800; 
    if(!isPointOnTrack(tx, tz)) createCactusAt(tx, tz, 0.8 + Math.random() * 0.4);
}

const createRock = (x, z, scale) => {
    const rGeo = new THREE.DodecahedronGeometry(1, 1);
    const r = new THREE.Mesh(rGeo, new THREE.MeshStandardMaterial({ color: 0x9e6c4f, roughness: 1.0 }));
    r.scale.set(scale, scale * (0.6 + Math.random() * 0.6), scale * (0.7 + Math.random() * 0.5));
    r.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    r.position.set(x, scale * 0.5, z); r.castShadow = true; r.receiveShadow = true; scene.add(r);
};
for (let i = 0; i < 150; i++) {
    const rx = (Math.random() - 0.5) * 600; const rz = (Math.random() - 0.5) * 800; 
    if(!isPointOnTrack(rx, rz)) createRock(rx, rz, Math.random() * 1.5 + 0.5);
}

const sunMoon = new THREE.Mesh(new THREE.SphereGeometry(15, 16, 16), new THREE.MeshBasicMaterial({color: 0xffaa00, transparent: true, opacity: 0.9}));
sunMoon.position.set(300, 60, -300);
scene.add(sunMoon);


const controls = { accelerate: false, brake: false, steerLeft: false, steerRight: false };
let speed = 0;
const maxSpeed = 1.18333; 
const maxReverseSpeed = 0.35;
const acceleration = 0.02;
const brakingForce = 0.045;
const reverseAcceleration = 0.015;
const friction = 0.98;
const steeringSpeed = 0.035;
const wheelRotationSpeed = 0.15;
let isTransitioning = false;

const toggleAllCarLights = (isNight) => {
    const emissiveForce = isNight ? 1.0 : 0;
    allCars.forEach(carData => {
        carData.lights.materials.forEach(mat => mat.emissiveIntensity = emissiveForce);
        carData.lights.objects.forEach(obj => obj.visible = isNight);
    });
};

const toggleDayNight = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    const targetSkyColor = isDaytime ? NIGHT_SKY_COLOR : DAY_SKY_COLOR;
    const targetFogColor = isDaytime ? NIGHT_FOG_COLOR : DAY_FOG_COLOR;
    const startSkyColor = isDaytime ? DAY_SKY_COLOR : NIGHT_SKY_COLOR;
    const startFogColor = isDaytime ? DAY_FOG_COLOR : NIGHT_FOG_COLOR;
    
    toggleAllCarLights(isDaytime);
    
    const targetAmbientIntensity = isDaytime ? 0.2 : 0.65;
    const startAmbientIntensity = isDaytime ? 0.65 : 0.2;
    const targetDirectionalIntensity = isDaytime ? 0.1 : 0.85;
    const startDirectionalIntensity = isDaytime ? 0.85 : 0.1;
    sunMoon.material = isDaytime ? new THREE.MeshBasicMaterial({color: 0xdddddd}) : new THREE.MeshBasicMaterial({color: 0xffaa00});
    
    const startTime = Date.now();
    function updateTransition() {
        const progress = Math.min((Date.now() - startTime) / 2000, 1);
        scene.background = new THREE.Color(startSkyColor).lerp(new THREE.Color(targetSkyColor), progress);
        scene.fog.color = new THREE.Color(startFogColor).lerp(new THREE.Color(targetFogColor), progress);
        ambientLight.intensity = startAmbientIntensity + (targetAmbientIntensity - startAmbientIntensity) * progress;
        directionalLight.intensity = startDirectionalIntensity + (targetDirectionalIntensity - startDirectionalIntensity) * progress;
        
        if (progress < 1) {
            requestAnimationFrame(updateTransition);
        } else { 
            isDaytime = !isDaytime; 
            isTransitioning = false; 
        }
    }
    updateTransition();
};

document.getElementById('time-toggle').addEventListener('click', toggleDayNight);

document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'arrowup': case 'w': controls.accelerate = true; break;
        case 'arrowdown': case 's': controls.brake = true; break;
        case 'arrowleft': case 'a': controls.steerLeft = true; break;
        case 'arrowright': case 'd': controls.steerRight = true; break;
    }
});
document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'arrowup': case 'w': controls.accelerate = false; break;
        case 'arrowdown': case 's': controls.brake = false; break;
        case 'arrowleft': case 'a': controls.steerLeft = false; break;
        case 'arrowright': case 'd': controls.steerRight = false; break;
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    fans.forEach(fan => {
        const jumpPhase = Math.sin(time * fan.userData.speed + fan.userData.jumpOffset);
        fan.position.y = fan.userData.baseY + Math.abs(jumpPhase) * 0.4;
    });

    if (controls.accelerate) speed = Math.min(maxSpeed, speed + acceleration);
    else if (controls.brake) speed = speed > 0 ? Math.max(0, speed - brakingForce) : Math.max(-maxReverseSpeed, speed - reverseAcceleration);
    else {
        speed = speed > 0 ? Math.max(0, speed * friction) : Math.min(0, speed * friction);
        if (Math.abs(speed) < 0.005) speed = 0;
    }
    
    let steerDirection = 0;
    if (controls.steerLeft) steerDirection = 1;
    if (controls.steerRight) steerDirection = -1;
    const steerAdjust = speed !== 0 ? Math.max(0.15, 1 - Math.abs(speed / maxSpeed) * 0.75) : 1;
    
    if (speed !== 0) {
        car.rotation.y += steeringSpeed * steerDirection * steerAdjust;
        carBody.rotation.z = THREE.MathUtils.lerp(carBody.rotation.z, -steerDirection * Math.abs(speed) * 0.15, 0.1);
    } else carBody.rotation.z = THREE.MathUtils.lerp(carBody.rotation.z, 0, 0.1);

    car.position.x += Math.sin(car.rotation.y) * speed;
    car.position.z += Math.cos(car.rotation.y) * speed;
    
    wheels.forEach(w => w.rotation.x -= speed * wheelRotationSpeed);
    wheelRims.forEach((r, i) => r.rotation.x = wheels[i].rotation.x);

    bots.forEach(bot => {
        bot.angle -= bot.angularSpeed; 
        const r = 100 + bot.laneOffset;
        const x = Math.cos(bot.angle) * r;
        const z = Math.sin(bot.angle) * r * 1.8;
        
        const nextX = Math.cos(bot.angle - 0.1) * r;
        const nextZ = Math.sin(bot.angle - 0.1) * r * 1.8;
        
        bot.mesh.position.set(x, 0.5, z);
        bot.mesh.lookAt(nextX, 0.5, nextZ);
        
        bot.wheels.forEach(w => w.rotation.x -= bot.linearSpeed * wheelRotationSpeed);
        bot.wheelRims.forEach(wr => wr.rotation.x -= bot.linearSpeed * wheelRotationSpeed);
    });

    const camRadius = 15; 
    const cx = Math.sin(camAngleX) * Math.cos(camAngleY) * camRadius;
    const cy = Math.sin(camAngleY) * camRadius + 1; 
    const cz = Math.cos(camAngleX) * Math.cos(camAngleY) * camRadius;
    
    const offset = new THREE.Vector3(cx, cy, cz);
    offset.applyQuaternion(car.quaternion); 
    
    const targetCameraPosition = car.position.clone().add(offset);
    camera.position.lerp(targetCameraPosition, 0.15); 
    camera.lookAt(car.position.x, car.position.y + 1.0, car.position.z);
    
    document.getElementById('speedometer').textContent = `${(Math.abs(speed) * 120).toFixed(0)} km/h`;
    document.getElementById('speed-fill').style.width = `${(Math.abs(speed) / maxSpeed) * 100}%`;
    
    renderer.render(scene, camera);
}
animate();