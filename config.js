// DevCenter Reviews - Archivo de Configuración
// Edita este archivo para personalizar la aplicación

window.DevCenterConfig = {
    // ==============================================
    // CONFIGURACIÓN DE LA APLICACIÓN
    // ==============================================
    
    app: {
        title: "DevCenter Reviews",
        description: "DevCenter Reviews: El centro de desarrollo líder que impulsa la innovación tecnológica. Comparte tu experiencia y ayuda a otros desarrolladores.",
        version: "1.0.0",
        author: "DevCenter Team"
    },

    // ==============================================
    // API KEYS Y CONFIGURACIONES EXTERNAS
    // ==============================================
    
    api: {
        // JSONBin.io configuración
        jsonbin: {
            binId: "68cc9c4043b1c97be947a6ff",
            // NOTA: No incluir accessKey aquí por seguridad
            // Configurar en el servidor o usar bin público
            baseUrl: "https://api.jsonbin.io/v3/b/"
        },
        
        // DiceBear API para avatares
        dicebear: {
            baseUrl: "https://api.dicebear.com/7.x/avataaars/svg",
            style: "avataaars", // Cambiar a: avataaars, personas, initials, etc.
            backgroundColor: "transparent"
        },
        
        // Google Fonts
        fonts: {
            primary: "Inter", // Fuente principal
            weights: "300;400;500;600;700" // Pesos de fuente
        }
    },

    // ==============================================
    // IMÁGENES Y RECURSOS POR DEFECTO
    // ==============================================
    
    images: {
        // Imagen por defecto del workspace/hero
        heroImage: "attached_assets/image_1758403617129.png",
        
        // Imagen por defecto del perfil de usuario
        defaultUserAvatar: "attached_assets/image_1758403617129.png",
        
        // Logo de la aplicación (puedes cambiar por una imagen personalizada)
        logoIcon: `<svg viewBox="0 0 24 24">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>`,
        
        // Imágenes de placeholders
        placeholders: {
            workspace: "attached_assets/image_1758403433692.png",
            team: "attached_assets/image_1758401977424.png",
            loading: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='20' fill='%236366f1' opacity='0.3'/></svg>"
        }
    },

    // ==============================================
    // TEXTOS Y CONTENIDO EDITABLE
    // ==============================================
    
    content: {
        // Textos del hero/inicio
        hero: {
            title: "DevCenter Reviews",
            subtitle: "En esta página puedes calificar y compartir tu experiencia con los servicios de DevCenter.",
            welcomeMessage: "¡Bienvenido de vuelta! 👋"
        },
        
        // Textos de autenticación
        auth: {
            loginTitle: "🔐 Acceso a DevCenter",
            loginSubtitle: "Inicia sesión o crea tu cuenta para acceder a DevCenter Reviews",
            registerSuccess: "¡Cuenta creada exitosamente! Bienvenido",
            loginSuccess: "¡Bienvenido de vuelta",
            logoutMessage: "Sesión cerrada correctamente"
        },
        
        // Textos de secciones
        sections: {
            reviews: {
                title: "⭐ Reseñas de la Comunidad",
                subtitle: "Descubre lo que otros desarrolladores están diciendo sobre DevCenter"
            },
            writeReview: {
                title: "✨ Escribir Nueva Reseña",
                subtitle: "Comparte tu experiencia con DevCenter",
                successMessage: "🎉 ¡Gracias por tu reseña! Tu opinión es muy valiosa para nosotros."
            },
            stats: {
                title: "📄 Estadísticas",
                averageLabel: "Calificación Promedio",
                countLabel: "Total Reseñas",
                userReviewsLabel: "Mis Reseñas"
            }
        },
        
        // Mensajes de error y estado
        messages: {
            loading: "Cargando...",
            error: "Ha ocurrido un error. Inténtalo de nuevo.",
            noReviews: "No hay reseñas disponibles aún.",
            networkError: "Error de conexión. Verifica tu internet."
        }
    },

    // ==============================================
    // CONFIGURACIÓN DE COLORES Y TEMA
    // ==============================================
    
    theme: {
        // Colores primarios (se aplicarán como CSS custom properties)
        colors: {
            primary: "#6366f1",
            secondary: "#f59e0b",
            success: "#10b981",
            warning: "#f59e0b",
            danger: "#ef4444",
            info: "#3b82f6"
        },
        
        // Tema por defecto: 'light', 'dark', 'auto'
        defaultTheme: "auto",
        
        // Permitir cambio de tema
        allowThemeToggle: true
    },

    // ==============================================
    // CONFIGURACIÓN DE CARACTERÍSTICAS
    // ==============================================
    
    features: {
        // Habilitar/deshabilitar funcionalidades
        enableOfflineMode: true,
        enableThemeToggle: true,
        enableUserProfiles: true,
        enableImageUpload: true,
        enableReviewRating: true,
        enableReviewComments: false, // Para futuras funcionalidades
        
        // Límites
        maxReviewLength: 500,
        maxTitleLength: 100,
        maxImagesPerUser: 10,
        reviewsPerPage: 6
    },

    // ==============================================
    // CONFIGURACIÓN DE FORMULARIOS
    // ==============================================
    
    forms: {
        // Placeholders de inputs
        placeholders: {
            "name": "Ingresa tu nombre completo",
            "register-email": "tu@example.com", 
            "login-usuario": "Ingresa tu usuario",
            "register-usuario": "Ingresa un nombre",
            "title": "Ej: Excelente experiencia de desarrollo",
            "content": "Comparte los detalles de tu experiencia con DevCenter...",
            "login-contrasena": "Contraseña",
            "register-password": "Contraseña segura"
        },
        
        // Validaciones
        validation: {
            minPasswordLength: 3,
            requireEmail: true,
            requireUsername: true
        },
        
        // Opciones del selector de calificación
        ratingOptions: [
            { value: "5", label: "⭐⭐⭐⭐⭐ Excelente" },
            { value: "4", label: "⭐⭐⭐⭐ Muy bueno" },
            { value: "3", label: "⭐⭐⭐ Bueno" },
            { value: "2", label: "⭐⭐ Regular" },
            { value: "1", label: "⭐ Necesita mejorar" }
        ]
    },

    // ==============================================
    // CONFIGURACIÓN DE DESARROLLO
    // ==============================================
    
    development: {
        // Habilitar logs de debug
        enableDebugLogs: true,
        
        // Mostrar información de desarrollo
        showVersionInfo: false,
        
        // Datos de prueba (para desarrollo)
        useMockData: false,
        
        // Configuración de localStorage
        storageKeys: {
            user: "devCenter_currentUser",
            reviews: "devCenter_reviews",
            theme: "devCenter_theme",
            userImages: "devCenter_userImages"
        }
    }
};

// ==============================================
// FUNCIONES DE CONFIGURACIÓN
// ==============================================

// Función para obtener configuración
window.getConfig = function(path) {
    const keys = path.split('.');
    let value = window.DevCenterConfig;
    
    for (const key of keys) {
        value = value?.[key];
    }
    
    return value;
};

// Función para actualizar configuración
window.setConfig = function(path, newValue) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let obj = window.DevCenterConfig;
    
    for (const key of keys) {
        obj = obj[key];
    }
    
    obj[lastKey] = newValue;
    
    // Log para desarrollo
    if (window.getConfig('development.enableDebugLogs')) {
        console.log(`📝 Configuración actualizada: ${path} = ${newValue}`);
    }
};

// Función para aplicar tema personalizado
window.applyCustomTheme = function() {
    try {
        const colors = window.getConfig('theme.colors');
        const root = document.documentElement;
        
        if (colors) {
            // Aplicar colores usando los nombres que usa styles.css
            Object.entries(colors).forEach(([key, value]) => {
                root.style.setProperty(`--${key}`, value);
            });
            console.log('🎨 Tema personalizado aplicado');
        }
    } catch (error) {
        console.error('❌ Error aplicando tema:', error);
    }
};

// ==============================================
// INICIALIZACIÓN
// ==============================================

// Log inmediato al cargar el script
console.log('🔧 DevCenter Config cargado correctamente ✅');

// Aplicar configuraciones al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('⚙️ Aplicando configuraciones...');
    
    // Aplicar tema personalizado si está habilitado
    if (window.getConfig && window.getConfig('theme.colors')) {
        window.applyCustomTheme();
    }
    
    // Mostrar información de versión en desarrollo
    if (window.getConfig && window.getConfig('development.showVersionInfo')) {
        console.log(`📱 ${window.getConfig('app.title')} v${window.getConfig('app.version')}`);
    }
});

// Exportar configuración para uso global
console.log('🔧 DevCenter Config cargado correctamente ✅');
console.log('📋 Usa window.DevCenterConfig para acceder a las configuraciones');
console.log('🛠️ Usa window.getConfig("path.to.config") para obtener valores');
console.log('⚙️ Usa window.setConfig("path.to.config", value) para cambiar valores');