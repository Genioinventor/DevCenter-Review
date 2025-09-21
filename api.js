// DevCenter Reviews - API para JSON bin
// Sistema de almacenamiento persistente usando JSON bin

// Configuración base de la API
const JSON_BIN_CONFIG = {
    baseURL: 'https://api.jsonbin.io/v3',
    headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$T9JNKL.CKGpxmMKnezehF.Syu388j3.OKXpK03rZ1yBjyKkkR6RHO',
        'X-Access-Key': '$2a$10$.nQ.uG0/J/vI4ixoUxK/deluru7qVGIfU5gDLcv7X3s8fjzJhzC8G'
    }
};

// IDs de bins específicos para diferentes datos
const BIN_IDS = {
    reviews: '68cc9c4043b1c97be947a6ff', // Bin original para reviews
    users: '68d03bc343b1c97be94a869d', // Nuevo bin con usuarios de DevCenter
    userProfiles: null // Se creará para perfiles de usuario
};

// Clase principal para manejar la API de JSON bin
class JSONBinAPI {
    constructor() {
        this.isOnline = navigator.onLine;
        this.setupOfflineHandling();
    }

    // Configurar manejo offline
    setupOfflineHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Obtener headers para las requests
    getHeaders(includeAuth = true) {
        return { ...JSON_BIN_CONFIG.headers };
    }

    // Función genérica para hacer requests
    async makeRequest(endpoint, options = {}) {
        if (!this.isOnline) {
            throw new Error('Sin conexión a internet. Los datos se guardarán localmente.');
        }

        try {
            const response = await fetch(`${JSON_BIN_CONFIG.baseURL}${endpoint}`, {
                headers: this.getHeaders(),
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en API request:', error);
            throw error;
        }
    }

    // Leer datos de un bin
    async readBin(binId) {
        try {
            const data = await this.makeRequest(`/b/${binId}/latest`);
            return data.record;
        } catch (error) {
            console.warn(`Error leyendo bin ${binId}:`, error.message);
            // Fallback a localStorage si falla la API
            return this.getFromLocalStorage(`bin_${binId}`);
        }
    }

    // Actualizar datos de un bin
    async updateBin(binId, data) {
        try {
            const response = await this.makeRequest(`/b/${binId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            
            // También guardar en localStorage como backup
            this.saveToLocalStorage(`bin_${binId}`, data);
            console.log(`Datos actualizados en bin ${binId} ✅`);
            return true;
        } catch (error) {
            console.warn(`Error actualizando bin ${binId}:`, error.message);
            // Guardar en localStorage si falla la API
            this.saveToLocalStorage(`bin_${binId}`, data);
            this.markForSync(`bin_${binId}`, data);
            
            // Si no hay claves configuradas, mostrar mensaje informativo
            if (error.message.includes('401') || error.message.includes('403')) {
                console.info('💡 Para guardar en JSON bin, configura las claves API en window.DEVCENTER_CONFIG');
            }
            
            return false;
        }
    }

    // Crear un nuevo bin
    async createBin(data, name = 'DevCenter Data') {
        try {
            const response = await this.makeRequest('/b', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    ...this.getHeaders(),
                    'X-Bin-Name': name
                }
            });
            return response.metadata.id;
        } catch (error) {
            console.error('Error creando bin:', error);
            throw error;
        }
    }

    // Funciones de localStorage para fallback
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Error guardando en localStorage:', error);
        }
    }

    getFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Error leyendo de localStorage:', error);
            return null;
        }
    }

    // Marcar datos para sincronización cuando vuelva la conexión
    markForSync(key, data) {
        const syncQueue = this.getFromLocalStorage('sync_queue') || [];
        syncQueue.push({ key, data, timestamp: Date.now() });
        this.saveToLocalStorage('sync_queue', syncQueue);
    }

    // Sincronizar datos offline cuando vuelva la conexión
    async syncOfflineData() {
        const syncQueue = this.getFromLocalStorage('sync_queue') || [];
        const failedSync = [];
        
        for (const item of syncQueue) {
            try {
                const binId = item.key.replace('bin_', '');
                const success = await this.updateBin(binId, item.data);
                if (success) {
                    console.log(`Sincronizado: ${item.key}`);
                } else {
                    failedSync.push(item);
                }
            } catch (error) {
                console.error(`Error sincronizando ${item.key}:`, error);
                failedSync.push(item);
            }
        }
        
        // Solo limpiar los items que se sincronizaron exitosamente
        this.saveToLocalStorage('sync_queue', failedSync);
        
        if (failedSync.length === 0) {
            console.log('Todos los datos sincronizados ✅');
        } else {
            console.warn(`${failedSync.length} items pendientes de sincronización`);
        }
    }
}

// Funciones específicas para reviews
class ReviewsAPI extends JSONBinAPI {
    constructor() {
        super();
        this.binId = BIN_IDS.reviews;
    }

    async getAllReviews() {
        try {
            console.log('Iniciando carga de reviews desde JSONBin...');
            const data = await this.readBin(this.binId);
            console.log('Datos recibidos de JSONBin:', data);
            
            // Verificar si existe la estructura 'resenas' (formato del usuario)
            if (data && data.resenas) {
                console.log('Cargando reseñas desde estructura "resenas"', data.resenas.length, 'reseñas encontradas');
                const reviews = this.convertResenasToReviews(data.resenas);
                console.log('Reseñas convertidas:', reviews);
                return reviews;
            }
            
            // El bin actual contiene proyectos, necesitamos adaptar para reviews
            if (data && data.projects) {
                console.log('Convirtiendo proyectos a reviews');
                // Convertir proyectos a formato de reviews para compatibilidad
                return this.convertProjectsToReviews(data.projects);
            }
            
            console.log('No se encontraron resenas ni proyectos, usando formato reviews estándar');
            return data?.reviews || [];
        } catch (error) {
            console.error('Error obteniendo reviews:', error);
            // Fallback a localStorage
            return this.getFromLocalStorage('devCenterReviews') || [];
        }
    }

    async saveReviews(reviews) {
        try {
            const existingData = await this.readBin(this.binId) || {};
            
            // Convertir reviews al formato 'resenas' para mantener consistencia
            const resenas = this.convertReviewsToResenas(reviews);
            
            const updatedData = {
                ...existingData,
                resenas: resenas,
                lastUpdated: new Date().toISOString()
            };
            
            return await this.updateBin(this.binId, updatedData);
        } catch (error) {
            console.error('Error guardando reviews:', error);
            return false;
        }
    }

    async addReview(review) {
        const reviews = await this.getAllReviews();
        
        // Generar un ID único similar al formato usado en el JSONBin del usuario
        const newId = `uuid-${reviews.length + 1}`;
        
        const newReview = {
            id: newId,
            ...review,
            date: new Date().toISOString().split('T')[0],
            avatar: review.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name || Date.now()}`
        };
        
        reviews.unshift(newReview);
        const success = await this.saveReviews(reviews);
        
        // Si falla el guardado remoto, asegurar backup local
        if (!success) {
            this.saveToLocalStorage('devCenterReviews', reviews);
            console.warn('Reseña guardada solo localmente. Se sincronizará cuando esté disponible la conexión.');
        }
        
        return newReview;
    }

    // Convertir estructura 'resenas' del usuario al formato esperado por la app
    convertResenasToReviews(resenas) {
        return resenas.map((resena) => ({
            id: resena.id,
            name: resena.nombre,
            rating: resena.estrellas,
            title: resena.titulo_resena,
            content: resena.descripcion_resena,
            date: resena.hora ? resena.hora.split('T')[0] : new Date().toISOString().split('T')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${resena.nombre || resena.id}`
        }));
    }

    // Convertir formato interno de reviews al formato 'resenas' para JSONBin
    convertReviewsToResenas(reviews) {
        return reviews.map((review) => ({
            id: review.id,
            nombre: review.name,
            hora: review.date ? `${review.date}T${new Date().toTimeString().split(' ')[0]}-06:00` : new Date().toISOString(),
            titulo_resena: review.title,
            descripcion_resena: review.content,
            estrellas: review.rating
        }));
    }

    // Convertir proyectos existentes a formato de reviews
    convertProjectsToReviews(projects) {
        return projects.map((project, index) => ({
            id: index + 1,
            name: `Usuario de ${project.title}`,
            rating: 5, // Rating por defecto
            title: `Excelente experiencia con ${project.title}`,
            content: project.description,
            date: project.dateAdded?.split('T')[0] || '2024-12-01',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.id}`
        }));
    }
}

// Funciones específicas para usuarios
class UsersAPI extends JSONBinAPI {
    constructor() {
        super();
        this.binId = BIN_IDS.users;
    }

    async getAllUsers() {
        if (!this.binId) {
            console.warn('Bin de usuarios no configurado');
            return this.getFromLocalStorage('devCenter_users') || [];
        }
        
        try {
            const data = await this.readBin(this.binId);
            // Usar la estructura 'usuarios' del nuevo JSON BIN
            return data?.usuarios || [];
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            return this.getFromLocalStorage('devCenter_users') || [];
        }
    }

    async saveUsers(users) {
        if (!this.binId) {
            console.error('No se puede guardar: Bin de usuarios no configurado');
            this.saveToLocalStorage('devCenter_users', users);
            return false;
        }

        const updatedData = {
            usuarios: users,
            lastUpdated: new Date().toISOString()
        };
        
        return await this.updateBin(this.binId, updatedData);
    }

    async registerUser(userData) {
        const users = await this.getAllUsers();
        
        // Verificar si el usuario ya existe por usuario o email
        const existingUser = users.find(user => 
            user.usuario === userData.usuario || user.correo_electronico === userData.correo_electronico
        );
        if (existingUser) {
            throw new Error('El usuario o email ya existe');
        }

        const newUser = {
            id: `uuid-${users.length + 1}`,
            usuario: userData.usuario,
            correo_electronico: userData.correo_electronico,
            contrasena: userData.contrasena, // Guardar en texto plano para mantener consistencia con el bin
            creado_en: new Date().toISOString()
        };

        users.push(newUser);
        await this.saveUsers(users);
        return {
            id: newUser.id,
            name: newUser.usuario,
            email: newUser.correo_electronico,
            avatar: 'Imágenes/profile-avatar.png',
            profileImage: 'Imágenes/profile-avatar.png',
            createdAt: newUser.creado_en
        };
    }

    async loginUser(usuario, contrasena) {
        const users = await this.getAllUsers();
        console.log('Verificando login...');
        
        // Buscar usuario por usuario y contraseña
        const user = users.find(u => u.usuario === usuario && u.contrasena === contrasena);
        
        if (user) {
            // Crear objeto de sesión con la estructura esperada por la app
            const sessionUser = {
                id: user.id,
                name: user.usuario,
                email: user.correo_electronico,
                avatar: 'Imágenes/profile-avatar.png',
                profileImage: 'Imágenes/profile-avatar.png',
                createdAt: user.creado_en || new Date().toISOString()
            };
            
            this.saveToLocalStorage('current_user', sessionUser);
            localStorage.setItem('currentUser', JSON.stringify(sessionUser)); // Para compatibilidad
            console.log('Login exitoso para:', sessionUser.name);
            return sessionUser;
        }
        
        throw new Error('Credenciales incorrectas');
    }

    getCurrentUser() {
        return this.getFromLocalStorage('current_user');
    }

    logout() {
        localStorage.removeItem('current_user');
    }

    // Hash simple para contraseñas (en producción usar una librería dedicada)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit integer
        }
        return hash.toString(36);
    }
}

// Instancias globales
const reviewsAPI = new ReviewsAPI();
const usersAPI = new UsersAPI();

// Exportar para uso global
window.DevCenterAPI = {
    reviews: reviewsAPI,
    users: usersAPI,
    JSONBinAPI,
    BIN_IDS
};

console.log('DevCenter API cargada correctamente ✅');
console.log('Usa window.DevCenterAPI para interactuar con JSON bin');

// Configuración de ejemplo (se puede definir antes de cargar el script)
if (typeof window !== 'undefined' && !window.DEVCENTER_CONFIG) {
    window.DEVCENTER_CONFIG = {
        // accessKey: 'tu_access_key_aqui' // Descomentar y agregar cuando esté disponible
    };
}