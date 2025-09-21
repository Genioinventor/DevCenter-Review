// DevCenter Reviews - JavaScript funcional para Netlify

// Datos mock de reseñas para demostración
const mockReviews = [
    {
        id: 1,
        name: "María González",
        rating: 5,
        title: "Excelente ambiente de trabajo",
        content: "DevCenter ha sido fundamental en mi crecimiento profesional. El ambiente colaborativo y las herramientas de vanguardia han hecho que cada proyecto sea una experiencia de aprendizaje única.",
        date: "2024-12-15",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria"
    },
    {
        id: 2,
        name: "Carlos Rodríguez", 
        rating: 4,
        title: "Gran equipo de trabajo",
        content: "La coordinación entre equipos es excepcional. Los procesos están bien definidos y la comunicación es fluida. Solo mejoraría algunos aspectos de la infraestructura técnica.",
        date: "2024-12-10",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos"
    },
    {
        id: 3,
        name: "Ana López",
        rating: 5,
        title: "Innovación constante",
        content: "DevCenter siempre está a la vanguardia de las nuevas tecnologías. Como desarrolladora, me encanta poder trabajar con las últimas herramientas y frameworks del mercado.",
        date: "2024-12-05",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana"
    }
];

// Estadísticas mock
let mockStats = {
    averageRating: 4.8,
    reviewCount: 124
};

// Variables globales
let allReviews = [...mockReviews];
let currentTheme = 'auto';

// Función para navegar entre secciones
function showSection(sectionId) {
    // Ocultar todas las secciones principales
    const allSections = [
        'escribir-resena',
        'reseñas', 
        'estadisticas',
        'perfil'
    ];
    
    allSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.add('hidden');
    });
    
    // Mostrar la sección solicitada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Cargar datos específicos de la sección
    if (sectionId === 'perfil') {
        loadProfileData();
    } else if (sectionId === 'estadisticas') {
        updateStats();
    } else if (sectionId === 'reseñas') {
        renderReviews();
    }
}

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que la API y Config estén cargadas
    if (window.DevCenterAPI && window.DevCenterConfig) {
        initializeApp();
    } else {
        // Esperar a que se carguen los módulos
        window.addEventListener('load', function() {
            if (window.DevCenterAPI && window.DevCenterConfig) {
                initializeApp();
            } else {
                console.warn('⚠️ Módulos no disponibles - usando configuración básica');
                // Aplicar solo las configuraciones disponibles
                if (window.DevCenterConfig) {
                    applyConfigToPage();
                }
            }
        });
    }
});

async function initializeApp() {
    // Aplicar configuraciones iniciales
    applyConfigToPage();
    
    await loadReviewsFromAPI(); // Load data from JSON bin first
    setupFormHandling();
    setupAuthHandling();
    setupProfileHandling();
    checkAuthState();
    setupNavigation();
    setupThemeToggle();
    loadSavedTheme();
    renderReviews();
    updateStats();
}

// Función para aplicar configuraciones a la página
function applyConfigToPage() {
    try {
        // Aplicar título de la aplicación
        const appTitle = window.getConfig('app.title');
        if (appTitle) {
            document.title = appTitle;
            const logoText = document.querySelector('.logo');
            if (logoText) {
                const logoTextElement = logoText.childNodes[logoText.childNodes.length - 1];
                if (logoTextElement.nodeType === Node.TEXT_NODE) {
                    logoTextElement.textContent = ' ' + appTitle;
                }
            }
        }

        // Aplicar descripción meta
        const appDescription = window.getConfig('app.description');
        if (appDescription) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.content = appDescription;
            }
        }

        // Aplicar textos del hero
        const heroTitle = window.getConfig('content.hero.title');
        const heroSubtitle = window.getConfig('content.hero.subtitle');
        
        const h1Element = document.querySelector('.hero h1');
        if (h1Element && heroTitle) {
            h1Element.textContent = heroTitle;
        }
        
        const heroSubtitleElement = document.querySelector('.hero p');
        if (heroSubtitleElement && heroSubtitle) {
            heroSubtitleElement.textContent = heroSubtitle;
        }

        // Aplicar imágenes por defecto
        const configHeroImage = window.getConfig('images.heroImage');
        const defaultAvatar = window.getConfig('images.defaultUserAvatar');
        
        const userAvatarElements = document.querySelectorAll('.user-avatar, #user-avatar');
        userAvatarElements.forEach(avatar => {
            if (avatar.src.includes('image_') && defaultAvatar) {
                avatar.src = defaultAvatar;
            }
        });

        // Aplicar configuración de formularios
        const placeholders = window.getConfig('forms.placeholders');
        if (placeholders) {
            Object.entries(placeholders).forEach(([key, value]) => {
                const input = document.getElementById(key);
                if (input) {
                    input.placeholder = value;
                }
            });
        }

        // Aplicar textos de autenticación
        const authTitle = window.getConfig('content.auth.loginTitle');
        const authSubtitle = window.getConfig('content.auth.loginSubtitle');
        
        const authTitleEl = document.querySelector('#login .section-title');
        if (authTitleEl && authTitle) {
            authTitleEl.textContent = authTitle;
        }
        
        const authSubtitleEl = document.querySelector('#login p');
        if (authSubtitleEl && authSubtitle) {
            authSubtitleEl.textContent = authSubtitle;
        }

        // Aplicar imagen hero
        const configuredHeroImage = window.getConfig('images.heroImage');
        const heroImgElement = document.querySelector('.hero img, .workspace-image');
        if (heroImgElement && configuredHeroImage) {
            heroImgElement.src = configuredHeroImage;
        }

        // Aplicar opciones de rating
        const ratingOptions = window.getConfig('forms.ratingOptions');
        const ratingSelect = document.getElementById('rating');
        if (ratingSelect && ratingOptions) {
            // Limpiar opciones existentes excepto la primera (placeholder)
            const firstOption = ratingSelect.firstElementChild;
            ratingSelect.innerHTML = '';
            ratingSelect.appendChild(firstOption);
            
            // Agregar nuevas opciones
            ratingOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                ratingSelect.appendChild(optionElement);
            });
        }

        // Log para desarrollo
        if (window.getConfig('development.enableDebugLogs')) {
            console.log('✅ Configuraciones aplicadas a la página');
        }
    } catch (error) {
        console.error('❌ Error aplicando configuraciones:', error);
    }
}

// Función para generar avatar usando configuración
function generateAvatar(seed) {
    const baseUrl = window.getConfig('api.dicebear.baseUrl');
    const style = window.getConfig('api.dicebear.style');
    const backgroundColor = window.getConfig('api.dicebear.backgroundColor');
    
    return `${baseUrl}?seed=${seed}&backgroundColor=${backgroundColor}`;
}

// Manejo del formulario de reseñas
function setupFormHandling() {
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleFormSubmit);
    }
}

// Manejo de autenticación
function setupAuthHandling() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const navLogin = document.getElementById('nav-login');
    
    // Event listeners para formularios
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Event listeners para botones de navegación
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginForm);
    }
    
    if (navLogin) {
        navLogin.addEventListener('click', showLoginForm);
    }
    
    // Event listener para logout desde header (si existe)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Event listener para logout desde perfil
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                handleLogout();
            }
        });
    }
    
    // Event listeners para cambiar entre login y registro
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthForm('register');
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthForm('login');
        });
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Verificar que el usuario esté autenticado
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showAuthRequiredMessage();
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Mostrar mensaje de enviando
    showSendingMessage();
    
    // Cambiar el botón a estado de carga
    submitBtn.textContent = '📤 Enviando reseña...';
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const newReview = {
        name: currentUser.name, // Usar el nombre del usuario autenticado
        rating: parseInt(formData.get('rating')),
        title: formData.get('title'),
        content: formData.get('content')
    };
    
    try {
        // Agregar la nueva reseña usando la API
        const addedReview = await window.DevCenterAPI.reviews.addReview(newReview);
        
        // Agregar al array local
        allReviews.unshift(addedReview);
        
        // Actualizar estadísticas
        updateStats();
        
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Limpiar formulario
        e.target.reset();
        
        // Renderizar las reseñas actualizadas
        renderReviews();
        
        // Guardar también en localStorage para mantener consistencia
        await saveReviewsToStorage();
        
        // Restaurar el botón
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        
    } catch (error) {
        console.error('Error guardando reseña:', error);
        
        // Ocultar mensaje de enviando y mostrar feedback
        hideSendingMessage();
        
        // Fallback al método anterior si falla la API
        const fallbackReview = {
            id: allReviews.length + 1,
            ...newReview,
            date: new Date().toISOString().split('T')[0],
            avatar: currentUser.profileImage || generateAvatar(currentUser.name || currentUser.id)
        };
        
        allReviews.unshift(fallbackReview);
        updateStats();
        showSuccessMessage();
        e.target.reset();
        renderReviews();
        await saveReviewsToStorage();
        
    } finally {
        // Asegurar que el botón siempre se restaure
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
}

// Funciones de autenticación
async function handleLogin(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Cambiar el botón a estado de carga
    submitBtn.textContent = 'Iniciando sesión...';
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const usuario = formData.get('usuario');
    const contrasena = formData.get('contrasena');
    
    try {
        const user = await window.DevCenterAPI.users.loginUser(usuario, contrasena);
        console.log('Usuario logueado:', user.name);
        
        // Actualizar UI
        updateAuthUI();
        
        // Ocultar formulario de login
        hideLoginForm();
        
        // Mostrar mensaje de éxito y mostrar las secciones del usuario
        const welcomeMsg = window.getConfig('content.auth.loginSuccess');
        showAuthMessage(welcomeMsg + ', ' + user.name + '!', 'success');
        
        // Mostrar todas las secciones después del login
        setTimeout(() => {
            showUserSections();
        }, 1500);
        
    } catch (error) {
        console.error('Error en login:', error);
        showAuthMessage('Credenciales incorrectas. Inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar el botón a su estado original
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
    const originalText = submitBtn.textContent;
    
    const formData = new FormData(e.target);
    const usuario = formData.get('usuario');
    const correo_electronico = formData.get('correo_electronico');
    const contrasena = formData.get('contrasena');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validar que las contraseñas coincidan
    if (contrasena !== confirmPassword) {
        showAuthMessage('Las contraseñas no coinciden', 'error');
        return;
    }
    
    // Cambiar el botón a estado de carga
    submitBtn.textContent = 'Creando cuenta...';
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    try {
        const newUser = await window.DevCenterAPI.users.registerUser({
            usuario,
            correo_electronico,
            contrasena
        });
        
        console.log('Usuario registrado:', newUser.name);
        
        // Automáticamente hacer login con la nueva estructura
        await window.DevCenterAPI.users.loginUser(usuario, contrasena);
        
        // Actualizar UI
        updateAuthUI();
        
        // Ocultar formulario
        hideLoginForm();
        
        // Mostrar mensaje de éxito y mostrar las secciones del usuario
        const registerMsg = window.getConfig('content.auth.registerSuccess');
        showAuthMessage(registerMsg + ', ' + newUser.name + '!', 'success');
        
        // Mostrar todas las secciones después del registro
        setTimeout(() => {
            showUserSections();
        }, 1500);
        
    } catch (error) {
        console.error('Error en registro:', error);
        showAuthMessage(error.message || 'Error creando la cuenta. Inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar el botón a su estado original
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
    }
}

function handleLogout() {
    window.DevCenterAPI.users.logout();
    updateAuthUI();
    const logoutMsg = window.getConfig('content.auth.logoutMessage');
    showAuthMessage(logoutMsg, 'success');
    console.log('Usuario deslogueado');
    
    // Hacer scroll hacia arriba para mostrar el formulario de login
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkAuthState() {
    const currentUser = getCurrentUser();
    updateAuthUI();
    
    if (currentUser) {
        console.log('Usuario autenticado:', currentUser.name);
    }
}

function getCurrentUser() {
    return window.DevCenterAPI ? window.DevCenterAPI.users.getCurrentUser() : null;
}

function updateAuthUI() {
    const currentUser = getCurrentUser();
    const userMenu = document.getElementById('user-menu');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const authRequiredMessage = document.getElementById('auth-required-message');
    const nameField = document.getElementById('name');
    const loginSection = document.getElementById('login');
    
    if (currentUser) {
        // Usuario logueado - mostrar info del usuario y ocultar login
        if (userMenu) userMenu.classList.remove('hidden');
        if (userAvatar) userAvatar.src = currentUser.profileImage || 'attached_assets/seguidor_318-792186_1758398295162.png';
        if (userName) userName.textContent = currentUser.name;
        if (authRequiredMessage) authRequiredMessage.classList.add('hidden');
        if (loginSection) loginSection.classList.add('hidden');
        
        // Ocultar campo de nombre en el formulario (usar el del usuario)
        if (nameField && nameField.parentElement) {
            nameField.parentElement.style.display = 'none';
        }
        
        // Mostrar todas las secciones del usuario
        showUserSections();
        
        // Actualizar UI del perfil
        updateProfileUI();
    } else {
        // Usuario no logueado - mostrar formulario de login y ocultar resto
        if (userMenu) userMenu.classList.add('hidden');
        if (authRequiredMessage) authRequiredMessage.classList.remove('hidden');
        if (loginSection) loginSection.classList.remove('hidden');
        
        // Mostrar campo de nombre en el formulario
        if (nameField && nameField.parentElement) {
            nameField.parentElement.style.display = '';
        }
        
        // Ocultar todas las secciones del usuario
        hideUserSections();
        
        // Ocultar sección de perfil y mostrar mensaje de auth requerida
        hideProfileSection();
    }
}

function showLoginForm() {
    const loginSection = document.getElementById('login');
    if (loginSection) {
        loginSection.classList.remove('hidden');
        loginSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideLoginForm() {
    const loginSection = document.getElementById('login');
    if (loginSection) {
        loginSection.classList.add('hidden');
    }
}

function toggleAuthForm(formType) {
    const loginContainer = document.getElementById('login-form-container');
    const registerContainer = document.getElementById('register-form-container');
    const title = document.querySelector('#login .section-title');
    
    if (formType === 'register') {
        if (loginContainer) loginContainer.classList.add('hidden');
        if (registerContainer) registerContainer.classList.remove('hidden');
        if (title) title.textContent = 'Crear Cuenta';
    } else {
        if (loginContainer) loginContainer.classList.remove('hidden');
        if (registerContainer) registerContainer.classList.add('hidden');
        if (title) title.textContent = 'Iniciar Sesión';
    }
}

function showAuthRequiredMessage() {
    const authMessage = document.getElementById('auth-required-message');
    if (authMessage) {
        authMessage.classList.remove('hidden');
        authMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

function showAuthMessage(message, type = 'info') {
    // Crear elemento de mensaje temporal
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type === 'error' ? 'error-message' : 'success-message'}`;
    messageDiv.textContent = message;
    
    // Insertar al inicio del main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(messageDiv, main.firstChild);
        
        // Hacer scroll al mensaje
        messageDiv.scrollIntoView({ behavior: 'smooth' });
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}

// Funciones de perfil e imágenes
function setupProfileHandling() {
    const navPerfil = document.getElementById('nav-perfil');
    const profileSettingsForm = document.getElementById('profile-settings-form');
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const imageUpload = document.getElementById('image-upload');
    const uploadArea = document.getElementById('upload-area');
    
    // Event listeners para navegación al perfil
    if (navPerfil) {
        navPerfil.addEventListener('click', showProfileSection);
    }
    
    // Event listeners para configuración de perfil
    if (profileSettingsForm) {
        profileSettingsForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Event listeners para cambio de avatar
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = handleAvatarChange;
            input.click();
        });
    }
    
    // Event listeners para subida de imágenes
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => imageUpload.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        uploadArea.addEventListener('dragleave', handleDragLeave);
    }
}

function showProfileSection() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showAuthRequiredMessage();
        return;
    }
    
    const profileSection = document.getElementById('perfil');
    if (profileSection) {
        profileSection.classList.remove('hidden');
        profileSection.scrollIntoView({ behavior: 'smooth' });
        loadProfileData();
    }
}

function showUserSections() {
    // Mostrar navegación del usuario
    const userNav = document.getElementById('user-navigation');
    if (userNav) userNav.classList.remove('hidden');
    
    // Mostrar la primera sección por defecto (escribir reseña)
    showSection('escribir-resena');
    
    // Mostrar formulario de reseñas
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) reviewForm.classList.remove('hidden');
}

function hideUserSections() {
    // Ocultar navegación del usuario
    const userNav = document.getElementById('user-navigation');
    if (userNav) userNav.classList.add('hidden');
    
    // Ocultar todas las secciones del usuario
    const sections = [
        document.getElementById('escribir-resena'),
        document.getElementById('reseñas'),
        document.getElementById('estadisticas'),
        document.getElementById('perfil')
    ];
    
    sections.forEach(section => {
        if (section) section.classList.add('hidden');
    });
    
    // Ocultar formulario de reseñas
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) reviewForm.classList.add('hidden');
}

function hideProfileSection() {
    const profileSection = document.getElementById('perfil');
    const profileContent = document.getElementById('profile-content');
    const profileAuthRequired = document.getElementById('profile-auth-required');
    
    if (profileSection) {
        if (getCurrentUser()) {
            profileSection.classList.add('hidden');
        } else {
            if (profileContent) profileContent.classList.add('hidden');
            if (profileAuthRequired) profileAuthRequired.classList.remove('hidden');
        }
    }
}

function updateProfileUI() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const profileContent = document.getElementById('profile-content');
    const profileAuthRequired = document.getElementById('profile-auth-required');
    
    if (profileContent) profileContent.classList.remove('hidden');
    if (profileAuthRequired) profileAuthRequired.classList.add('hidden');
}

function loadProfileData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Actualizar información del perfil
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileJoinedDate = document.getElementById('profile-joined-date');
    const profileAvatarDisplay = document.getElementById('profile-avatar-display');
    const profileNameEdit = document.getElementById('profile-name-edit');
    const profileEmailEdit = document.getElementById('profile-email-edit');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileJoinedDate) {
        const joinedDate = new Date(currentUser.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        profileJoinedDate.textContent = joinedDate;
    }
    if (profileAvatarDisplay) {
        profileAvatarDisplay.src = currentUser.profileImage || 'attached_assets/seguidor_318-792186_1758398295162.png';
    }
    
    // Rellenar formulario de edición
    if (profileNameEdit) profileNameEdit.value = currentUser.name;
    if (profileEmailEdit) profileEmailEdit.value = currentUser.email;
    
    // Cargar imágenes del usuario
    loadUserImages();
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const formData = new FormData(e.target);
    const newName = formData.get('name');
    
    try {
        // Actualizar usuario en la API
        const users = await window.DevCenterAPI.users.getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            await window.DevCenterAPI.users.saveUsers(users);
            
            // Actualizar sesión local
            const updatedUser = { ...currentUser, name: newName };
            window.DevCenterAPI.users.logout();
            localStorage.setItem('current_user', JSON.stringify(updatedUser));
            
            // Actualizar UI
            updateAuthUI();
            loadProfileData();
            
            showAuthMessage('Perfil actualizado correctamente', 'success');
        }
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        showAuthMessage('Error al actualizar el perfil', 'error');
    }
}

function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
        const imageData = event.target.result;
        await updateUserAvatar(imageData);
    };
    reader.readAsDataURL(file);
}

async function updateUserAvatar(imageData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    try {
        // Actualizar usuario en la API
        const users = await window.DevCenterAPI.users.getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].profileImage = imageData;
            await window.DevCenterAPI.users.saveUsers(users);
            
            // Actualizar sesión local
            const updatedUser = { ...currentUser, profileImage: imageData };
            localStorage.setItem('current_user', JSON.stringify(updatedUser));
            
            // Actualizar UI
            updateAuthUI();
            loadProfileData();
            
            showAuthMessage('Foto de perfil actualizada', 'success');
        }
    } catch (error) {
        console.error('Error actualizando avatar:', error);
        showAuthMessage('Error al actualizar la foto de perfil', 'error');
    }
}

function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(processImageFile);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    files.filter(file => file.type.startsWith('image/')).forEach(processImageFile);
}

function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const imageData = event.target.result;
        addUserImage(imageData, file.name);
    };
    reader.readAsDataURL(file);
}

function addUserImage(imageData, filename) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Obtener imágenes existentes del usuario
    const userImages = getUserImages();
    
    // Agregar nueva imagen
    const newImage = {
        id: Date.now(),
        src: imageData,
        filename: filename,
        uploadedAt: new Date().toISOString()
    };
    
    userImages.push(newImage);
    
    // Guardar en localStorage
    localStorage.setItem(`user_images_${currentUser.id}`, JSON.stringify(userImages));
    
    // Recargar galería
    loadUserImages();
    
    showAuthMessage('Imagen agregada correctamente', 'success');
}

function getUserImages() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    try {
        const images = localStorage.getItem(`user_images_${currentUser.id}`);
        return images ? JSON.parse(images) : [];
    } catch (error) {
        console.warn('Error cargando imágenes del usuario:', error);
        return [];
    }
}

function loadUserImages() {
    const userImages = getUserImages();
    const imagesGrid = document.getElementById('user-images');
    
    if (!imagesGrid) return;
    
    if (userImages.length === 0) {
        imagesGrid.innerHTML = '<p style="text-align: center; color: var(--muted-foreground);">No tienes imágenes subidas aún.</p>';
        return;
    }
    
    imagesGrid.innerHTML = userImages.map(image => `
        <div class="image-item">
            <img src="${image.src}" alt="${image.filename}">
            <div class="image-actions">
                <button onclick="setAsProfileImage('${image.src}')" title="Usar como foto de perfil">👤</button>
                <button onclick="deleteUserImage(${image.id})" title="Eliminar">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function setAsProfileImage(imageSrc) {
    await updateUserAvatar(imageSrc);
}

function deleteUserImage(imageId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const userImages = getUserImages();
    const filteredImages = userImages.filter(img => img.id !== imageId);
    
    localStorage.setItem(`user_images_${currentUser.id}`, JSON.stringify(filteredImages));
    loadUserImages();
    
    showAuthMessage('Imagen eliminada', 'success');
}

function showSuccessMessage() {
    // Ocultar mensaje de enviando si está visible
    hideSendingMessage();
    
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }
}

function showSendingMessage() {
    // Ocultar otros mensajes primero
    hideAllMessages();
    
    const sendingMessage = document.getElementById('sending-message');
    if (sendingMessage) {
        sendingMessage.classList.remove('hidden');
        sendingMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideSendingMessage() {
    const sendingMessage = document.getElementById('sending-message');
    if (sendingMessage) {
        sendingMessage.classList.add('hidden');
    }
}

function hideAllMessages() {
    const successMessage = document.getElementById('success-message');
    const sendingMessage = document.getElementById('sending-message');
    
    if (successMessage) successMessage.classList.add('hidden');
    if (sendingMessage) sendingMessage.classList.add('hidden');
}

// Renderizar reseñas dinámicamente
function renderReviews() {
    const reviewsGrid = document.querySelector('#reviews-grid');
    if (!reviewsGrid) return;
    
    // Limpiar el grid de reseñas
    reviewsGrid.innerHTML = '';
    
    if (allReviews.length === 0) {
        reviewsGrid.innerHTML = `
            <div class="loading-message">
                <p>📝 Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!</p>
            </div>
        `;
        return;
    }
    
    // Mostrar las reseñas más recientes (máximo 6 para el grid)
    const recentReviews = allReviews.slice(0, 6);
    
    recentReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsGrid.appendChild(reviewElement);
    });
    
    // Mostrar botón "Ver más" si hay más reseñas
    const showMoreBtn = document.getElementById('show-more-reviews');
    if (showMoreBtn) {
        if (allReviews.length > 6) {
            showMoreBtn.classList.remove('hidden');
            showMoreBtn.onclick = () => showAllReviews();
        } else {
            showMoreBtn.classList.add('hidden');
        }
    }
}

function createReviewElement(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    // Create review header with title and rating
    const reviewHeader = document.createElement('div');
    reviewHeader.className = 'review-header';
    
    const title = document.createElement('h3');
    title.className = 'review-title';
    title.textContent = review.title || 'Sin título';
    
    const rating = document.createElement('div');
    rating.className = 'review-rating';
    rating.textContent = '⭐'.repeat(review.rating);
    
    reviewHeader.appendChild(title);
    reviewHeader.appendChild(rating);
    
    // Create author info
    const author = document.createElement('div');
    author.className = 'review-author';
    author.textContent = `Por ${review.name}`;
    
    // Create review content
    const content = document.createElement('p');
    content.className = 'review-content';
    content.textContent = review.content;
    
    // Assemble the card
    reviewCard.appendChild(reviewHeader);
    reviewCard.appendChild(author);
    reviewCard.appendChild(content);
    
    return reviewCard;
}

function showAllReviews() {
    const reviewsGrid = document.querySelector('#reviews-grid');
    if (!reviewsGrid) return;
    
    // Limpiar el grid
    reviewsGrid.innerHTML = '';
    
    // Mostrar todas las reseñas
    allReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsGrid.appendChild(reviewElement);
    });
    
    // Ocultar el botón "Ver más"
    const showMoreBtn = document.getElementById('show-more-reviews');
    if (showMoreBtn) {
        showMoreBtn.classList.add('hidden');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Actualizar estadísticas
function updateStats() {
    if (allReviews.length === 0) return;
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    mockStats.averageRating = (totalRating / allReviews.length);
    mockStats.reviewCount = allReviews.length;
    
    // Actualizar en la interfaz usando selectores estables
    const ratingElements = document.querySelectorAll('.rating-number, [data-rating="average"]');
    ratingElements.forEach(el => {
        el.textContent = mockStats.averageRating.toFixed(1);
    });
    
    const countElements = document.querySelectorAll('[data-rating="count"]');
    countElements.forEach(el => {
        el.textContent = `basado en ${mockStats.reviewCount} reseñas`;
    });
    
    // No fallback needed - relying on stable data attributes only
}

// Navegación suave
function setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Evitar error si el href es solo "#"
            if (targetId === '#') {
                return;
            }
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Manejo del tema
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (currentTheme === 'auto') {
        currentTheme = 'light';
        setTheme('light');
        themeToggle.textContent = '☀️';
        themeToggle.title = 'Cambiar a tema oscuro';
    } else if (currentTheme === 'light') {
        currentTheme = 'dark';
        setTheme('dark');
        themeToggle.textContent = '🌙';
        themeToggle.title = 'Cambiar a tema automático';
    } else {
        currentTheme = 'auto';
        setTheme('auto');
        themeToggle.textContent = '🌓';
        themeToggle.title = 'Cambiar tema';
    }
    
    localStorage.setItem('theme', currentTheme);
}

function setTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.style.setProperty('--background', '#0a0a0a');
        root.style.setProperty('--foreground', '#fafafa');
        root.style.setProperty('--card', '#1a1a1a');
        root.style.setProperty('--card-foreground', '#fafafa');
        root.style.setProperty('--border', '#27272a');
        root.style.setProperty('--muted', '#18181b');
        root.style.setProperty('--muted-foreground', '#a1a1aa');
    } else if (theme === 'light') {
        root.style.setProperty('--background', '#ffffff');
        root.style.setProperty('--foreground', '#0a0a0a');
        root.style.setProperty('--card', '#ffffff');
        root.style.setProperty('--card-foreground', '#0a0a0a');
        root.style.setProperty('--border', '#e4e4e7');
        root.style.setProperty('--muted', '#f4f4f5');
        root.style.setProperty('--muted-foreground', '#71717a');
    } else {
        // Auto - resetear a CSS media queries
        ['--background', '--foreground', '--card', '--card-foreground', '--border', '--muted', '--muted-foreground'].forEach(prop => {
            root.style.removeProperty(prop);
        });
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (savedTheme && savedTheme !== 'auto') {
        currentTheme = savedTheme;
        setTheme(savedTheme);
        
        if (themeToggle) {
            if (savedTheme === 'light') {
                themeToggle.textContent = '☀️';
                themeToggle.title = 'Cambiar a tema oscuro';
            } else if (savedTheme === 'dark') {
                themeToggle.textContent = '🌙';
                themeToggle.title = 'Cambiar a tema automático';
            }
        }
    }
}

// Almacenamiento local y remoto
async function saveReviewsToStorage() {
    try {
        // Intentar guardar en JSON bin API primero
        if (window.DevCenterAPI) {
            const success = await window.DevCenterAPI.reviews.saveReviews(allReviews);
            if (success) {
                console.log('Reviews guardadas en JSON bin ✅');
            }
        }
        
        // Siempre guardar en localStorage como backup
        localStorage.setItem('devCenterReviews', JSON.stringify(allReviews));
        localStorage.setItem('devCenterStats', JSON.stringify(mockStats));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
    }
}

async function loadReviewsFromAPI() {
    try {
        if (window.DevCenterAPI) {
            const apiReviews = await window.DevCenterAPI.reviews.getAllReviews();
            if (apiReviews && apiReviews.length > 0) {
                allReviews = apiReviews;
                
                // Actualizar cache local inmediatamente para experiencia offline consistente
                localStorage.setItem('devCenterReviews', JSON.stringify(allReviews));
                
                console.log('Reseñas cargadas desde JSON bin ✅');
                return;
            }
        }
        
        // Fallback a localStorage si la API no está disponible
        loadReviewsFromStorage();
    } catch (error) {
        console.warn('Error cargando desde API, usando localStorage:', error);
        loadReviewsFromStorage();
    }
}

function loadReviewsFromStorage() {
    try {
        const savedReviews = localStorage.getItem('devCenterReviews');
        const savedStats = localStorage.getItem('devCenterStats');
        
        if (savedReviews) {
            allReviews = JSON.parse(savedReviews);
        }
        
        if (savedStats) {
            mockStats = JSON.parse(savedStats);
        }
    } catch (e) {
        console.warn('No se pudo cargar desde localStorage:', e);
    }
}

// Cargar datos guardados ya se maneja en initializeApp()

// Funciones de utilidad
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Detectar preferencias del sistema
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Escuchar cambios en las preferencias del sistema
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
        if (currentTheme === 'auto') {
            // El CSS maneja automáticamente los cambios cuando está en modo auto
            console.log('Sistema cambió a tema:', e.matches ? 'oscuro' : 'claro');
        }
    });
}

// Exportar funciones para uso en la consola (desarrollo)
if (typeof window !== 'undefined') {
    window.DevCenterReviews = {
        addReview: async (review) => {
            const newReview = {
                id: allReviews.length + 1,
                date: new Date().toISOString().split('T')[0],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
                ...review
            };
            
            allReviews.unshift(newReview);
            renderReviews();
            updateStats();
            await saveReviewsToStorage();
            
            return newReview;
        },
        getAllReviews: () => allReviews,
        getStats: () => mockStats,
        setTheme: setTheme,
        resetData: async () => {
            allReviews = [...mockReviews];
            mockStats = { averageRating: 4.8, reviewCount: 124 };
            renderReviews();
            updateStats();
            await saveReviewsToStorage();
        }
    };
}

console.log('DevCenter Reviews cargado correctamente ✅');
console.log('Usa window.DevCenterReviews para interactuar con la aplicación desde la consola');