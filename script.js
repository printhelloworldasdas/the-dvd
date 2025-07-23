// Configuración
let config = {
    logoWidth: 15,
    logoHeight: 15,
    hitboxSize: 35, // Hitbox cuadrada
    speed: 1.25
};

// Variables de animación
let posX = 0;
let posY = 0;
let velX = 0;
let velY = 0;
let dvdLogo = document.getElementById('dvd-logo');
let container = document.getElementById('container');

// Cargar configuración guardada
function loadConfig() {
    const savedConfig = localStorage.getItem('dvdBounceConfig');
    if (savedConfig) {
        Object.assign(config, JSON.parse(savedConfig));
        applyConfig();
    }
}

// Guardar configuración
function saveConfig() {
    localStorage.setItem('dvdBounceConfig', JSON.stringify(config));
}

// Aplicar configuración
function applyConfig() {
    // Tamaño del logo
    document.documentElement.style.setProperty('--logo-width', config.logoWidth + 'px');
    document.documentElement.style.setProperty('--logo-height', config.logoHeight + 'px');
    
    // Actualizar controles
    document.getElementById('logo-width').value = config.logoWidth;
    document.getElementById('logo-height').value = config.logoHeight;
    document.getElementById('hitbox-size').value = config.hitboxSize;
    document.getElementById('speed').value = config.speed;
}

// Inicializar
function init() {
    loadConfig();
    
    // Posición y velocidad inicial aleatoria
    resetPosition();
    
    // Iniciar animación
    animate();
    
    // Mostrar/ocultar panel con Ctrl+C
    document.addEventListener('keydown', (e) => {
        if (e.key === 'c' && e.ctrlKey) {
            document.getElementById('config-panel').classList.toggle('show');
        }
    });
    
    // Botón Guardar
    document.getElementById('save-btn').addEventListener('click', () => {
        config.logoWidth = parseInt(document.getElementById('logo-width').value) || 150;
        config.logoHeight = parseInt(document.getElementById('logo-height').value) || 150;
        config.hitboxSize = parseInt(document.getElementById('hitbox-size').value) || 150;
        config.speed = parseInt(document.getElementById('speed').value) || 5;
        
        applyConfig();
        saveConfig();
        
        // Ajustar velocidad manteniendo la dirección
        velX = (velX > 0 ? 1 : -1) * config.speed;
        velY = (velY > 0 ? 1 : -1) * config.speed;
    });
    
    // Botón Cerrar
    document.getElementById('close-btn').addEventListener('click', () => {
        document.getElementById('config-panel').classList.remove('show');
    });
    
    // Botón Reiniciar
    document.getElementById('reset-btn').addEventListener('click', () => {
        resetPosition();
    });
}

// Reiniciar posición
function resetPosition() {
    posX = Math.random() * (container.clientWidth - config.hitboxSize);
    posY = Math.random() * (container.clientHeight - config.hitboxSize);
    
    velX = (Math.random() > 0.5 ? 1 : -1) * config.speed;
    velY = (Math.random() > 0.5 ? 1 : -1) * config.speed;
}

// Bucle de animación
function animate() {
    // Actualizar posición
    posX += velX;
    posY += velY;
    
    // Detección de colisiones con hitbox cuadrada
    if (posX + config.hitboxSize > container.clientWidth || posX < 0) {
        velX = -velX;
    }
    
    if (posY + config.hitboxSize > container.clientHeight || posY < 0) {
        velY = -velY;
    }
    
    // Aplicar posición
    dvdLogo.style.left = posX + 'px';
    dvdLogo.style.top = posY + 'px';
    
    // Continuar animación
    requestAnimationFrame(animate);
}

// Iniciar cuando la página cargue
window.onload = init;
