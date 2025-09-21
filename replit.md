# DevCenter Reviews

## Overview

DevCenter Reviews is a web-based review platform specifically designed for developers to share their experiences working at DevCenter. The application allows users to submit, view, and interact with reviews about the development environment, tools, and workplace culture. Built as a progressive web app, it features a modern responsive design with automatic dark/light theme detection and offline capabilities.

## Recent Changes: Latest modifications with dates
- **2025-09-21**: Created centralized configuration system - Added config.js file for easy customization of API keys, images, text content, themes, and UI settings. Allows users to modify the application from a single file without touching core code. Enhanced security by removing API keys from client-side code
- **2025-09-21**: Major text legibility and UX improvements - Enhanced color contrast with solid backgrounds, improved login/register form styling, added interactive loading buttons ("Iniciando sesión...", "Creando cuenta..."), optimized glassmorphism effects for better readability
- **2025-09-20**: Major UI/UX improvements - Enhanced navigation with main navigation bar, improved user dashboard with action cards, moved logout to profile settings, optimized CSS themes for automatic light/dark mode detection
- **2025-09-20**: Integrated JSONBin.io with Spanish field structure (`resenas`) for seamless data loading and saving

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript for lightweight performance
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features when available
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox
- **Enhanced Navigation**: Main navigation bar with quick access to reviews and statistics, plus dashboard with prominent action cards
- **Theme System**: Automatic dark/light mode detection based on user preferences with manual override capability, optimized CSS variables for seamless theme switching
- **Component-based Structure**: Modular JavaScript functions for different UI components (reviews, forms, navigation)

### Data Management
- **JSONBin.io Integration**: Uses JSONBin.io as the primary data storage solution for reviews and user data
- **Offline-first Approach**: Local storage fallback with automatic synchronization when online
- **Mock Data System**: Built-in fallback data for development and offline scenarios
- **Data Persistence**: Separate bins for different data types (reviews, users, user profiles)

### Authentication & User Management
- **Simple Authentication**: Basic user system without complex backend infrastructure
- **Local Storage**: User session management using browser local storage
- **Profile System**: User profiles with avatar generation using DiceBear API

### API Architecture
- **RESTful Design**: Clean API structure using JSONBin.io endpoints
- **Error Handling**: Graceful degradation when external services are unavailable
- **Rate Limiting Awareness**: Built-in handling for API rate limits
- **Security**: Access key-based authentication for JSONBin.io operations

### Performance Optimizations
- **Font Loading**: Preconnect to Google Fonts with display swap for better loading performance
- **CSS Architecture**: Modular CSS with CSS custom properties for theming
- **Critical CSS**: Inline critical styles to prevent FOUC (Flash of Unstyled Content)
- **Lazy Loading**: Components load as needed to improve initial page load

## External Dependencies

### Data Storage
- **JSONBin.io**: Primary data storage service for reviews, user data, and application state
  - Bin ID: `68cc9c4043b1c97be947a6ff` for reviews storage
  - Public visibility for read operations
  - Access key authentication for write operations

### Design & Assets
- **Google Fonts**: Inter font family for consistent typography
- **DiceBear API**: Avatar generation service for user profile pictures
  - Uses avataaars style with seed-based generation for consistent avatars

### Browser APIs
- **Web Storage API**: LocalStorage for offline data caching and user session management
- **Network Information API**: Online/offline detection for progressive enhancement
- **Intersection Observer**: For scroll-based animations and lazy loading
- **CSS Custom Properties**: For dynamic theming and design system implementation

### Development Tools
- **Netlify**: Hosting platform for static site deployment
- **Modern Browser Features**: ES6+ JavaScript features, CSS Grid, Flexbox
- **Progressive Web App**: Service worker ready architecture for offline functionality