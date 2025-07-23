// Configuración inicial
const defaultConfig = {
    logoWidth: 150,
    logoHeight: 150,
    hitboxSize: 150,
    speed: 5,
    imageUrl: 'dvd-logo.png'
};

// Estado de la aplicación
let state = {
    config: {...defaultConfig},
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 0},
    elements: {
        logo: null,
        container: null,
        configPanel: null,
        inputs: {
            logoWidth: null,
            logoHeight: null,
            hitboxSize: null,
            speed: null,
            imageUrl: null
        },
        buttons: {
            save: null,
            close: null,
            reset: null
        }
    }
};

// Inicialización
function init() {
    // Obtener elementos del DOM
    state.elements.logo = document.getElementById('dvd-logo');
    state.elements.container = document.getElementById('container');
    state.elements.configPanel = document.getElementById('config-panel');
    
    // Obtener inputs
    state.elements.inputs.logoWidth = document.getElementById('logo-width');
    state.elements.inputs.logoHeight = document.getElementById('logo-height');
    state.elements.inputs.hitboxSize = document.getElementById('hitbox-size');
    state.elements.inputs.speed = document.getElementById('speed');
    state.elements.inputs.imageUrl = document.getElementById('image-url');
    
    // Obtener botones
    state.elements.buttons.save = document.getElementById('save-btn');
    state.elements.buttons.close = document.getElementById('close-btn');
    state.elements.buttons.reset = document.getElementById('reset-btn');
    
    // Cargar configuración guardada
    loadConfig();
    
    // Configurar eventos
    setupEvents();
    
    // Iniciar animación
    resetPosition();
    animate();
}

// Cargar configuración
function loadConfig() {
    const savedConfig = localStorage.getItem('dvdBounceConfig');
    if (savedConfig) {
        state.config = {...defaultConfig, ...JSON.parse(savedConfig)};
    }
    applyConfig();
}

// Guardar configuración
function saveConfig() {
    localStorage.setItem('dvdBounceConfig', JSON.stringify(state.config));
}

// Aplicar configuración al DOM
function applyConfig() {
    // Aplicar tamaño del logo
    document.documentElement.style.setProperty('--logo-width', state.config.logoWidth + 'px');
    document.documentElement.style.setProperty('--logo-height', state.config.logoHeight + 'px');
    
    // Aplicar imagen
    if (state.config.imageUrl) {
        document.documentElement.style.setProperty('--logo-image', `url('${state.config.imageUrl}')`);
    }
    
    // Actualizar controles
    state.elements.inputs.logoWidth.value = state.config.logoWidth;
    state.elements.inputs.logoHeight.value = state.config.logoHeight;
    state.elements.inputs.hitboxSize.value = state.config.hitboxSize;
    state.elements.inputs.speed.value = state.config.speed;
    state.elements.inputs.imageUrl.value = state.config.imageUrl || '';
}

// Configurar eventos
function setupEvents() {
    // Mostrar/ocultar panel de configuración
    document.addEventListener('keydown', (e) => {
        if (e.key === 'c' && e.ctrlKey) {
            state.elements.configPanel.classList.toggle('show');
        }
    });
    
    // Botón Guardar
    state.elements.buttons.save.addEventListener('click', () => {
        state.config = {
            logoWidth: Math.max(1, parseInt(state.elements.inputs.logoWidth.value) || defaultConfig.logoWidth),
            logoHeight: Math.max(1, parseInt(state.elements.inputs.logoHeight.value) || defaultConfig.logoHeight),
            hitboxSize: Math.max(1, parseInt(state.elements.inputs.hitboxSize.value) || defaultConfig.hitboxSize),
            speed: Math.max(0.1, parseFloat(state.elements.inputs.speed.value) || defaultConfig.speed),
            imageUrl: state.elements.inputs.imageUrl.value.trim() || defaultConfig.imageUrl
        };
        
        applyConfig();
        saveConfig();
        
        // Ajustar velocidad manteniendo la dirección
        state.velocity.x = (state.velocity.x > 0 ? 1 : -1) * state.config.speed;
        state.velocity.y = (state.velocity.y > 0 ? 1 : -1) * state.config.speed;
    });
    
    // Botón Cerrar
    state.elements.buttons.close.addEventListener('click', () => {
        state.elements.configPanel.classList.remove('show');
    });
    
    // Botón Reiniciar
    state.elements.buttons.reset.addEventListener('click', resetPosition);
}

// Reiniciar posición
function resetPosition() {
    state.position = {
        x: Math.random() * (state.elements.container.clientWidth - state.config.hitboxSize),
        y: Math.random() * (state.elements.container.clientHeight - state.config.hitboxSize)
    };
    
    state.velocity = {
        x: (Math.random() > 0.5 ? 1 : -1) * state.config.speed,
        y: (Math.random() > 0.5 ? 1 : -1) * state.config.speed
    };
}

// Bucle de animación
function animate() {
    // Actualizar posición
    state.position.x += state.velocity.x;
    state.position.y += state.velocity.y;
    
    // Detección de colisiones
    if (state.position.x + state.config.hitboxSize > state.elements.container.clientWidth || state.position.x < 0) {
        state.velocity.x = -state.velocity.x;
    }
    
    if (state.position.y + state.config.hitboxSize > state.elements.container.clientHeight || state.position.y < 0) {
        state.velocity.y = -state.velocity.y;
    }
    
    // Aplicar posición
    state.elements.logo.style.left = state.position.x + 'px';
    state.elements.logo.style.top = state.position.y + 'px';
    
    // Continuar animación
    requestAnimationFrame(animate);
}

// Iniciar cuando la página cargue
window.onload = init;
