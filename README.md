# Sistema de Gestión de Tickets

Una plataforma moderna y robusta para la gestión eficiente de incidencias y soporte técnico. Diseñada para optimizar el flujo de trabajo entre usuarios y equipos de soporte, ofreciendo una experiencia de usuario premium con una interfaz oscura y elegante.

## 🚀 Características Principales

### 🎫 Gestión de Tickets
- **Creación y Seguimiento**: Los usuarios pueden reportar incidencias detalladas y seguir su estado en tiempo real.
- **Clasificación**: Organización por prioridad (Baja, Media, Alta, Crítica) y estado (Abierto, En Progreso, Resuelto, Cerrado).
- **Interfaz Intuitiva**: Listados claros y tarjetas de detalle con toda la información relevante.

### 💬 Comunicación en Tiempo Real
- **Chat Integrado**: Sistema de comentarios tipo chat en cada ticket para una comunicación fluida.
- **Scroll Inteligente**: Contenedor de mensajes optimizado con auto-scroll y diseño limpio.
- **Historial Completo**: Registro de todas las interacciones y actualizaciones.

### 👥 Gestión de Usuarios (Admin)
- **Panel de Administración**: Control total sobre los usuarios registrados.
- **Roles y Permisos**: Sistema de roles (Admin, Soporte, Usuario) para controlar el acceso a funcionalidades.
- **CRUD Completo**: Crear, editar y eliminar usuarios con facilidad.

### 👤 Perfil de Usuario
- **Personalización**: Actualización de información personal y credenciales de acceso.
- **Seguridad**: Cambio de contraseña seguro y validado.

### 🎨 Experiencia de Usuario (UX/UI)
- **Diseño Moderno**: Interfaz "Dark Mode" por defecto, utilizando una paleta de colores profesional.
- **Responsive**: Totalmente adaptable a dispositivos móviles y de escritorio.
- **Feedback Visual**: Notificaciones, estados de carga (skeletons) y transiciones suaves.

## 🛠️ Stack Tecnológico

Este proyecto está construido con las últimas tecnologías web para garantizar rendimiento, escalabilidad y mantenibilidad:

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/) (PostCSS)
- **Estado y Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Enrutamiento**: [React Router 7](https://reactrouter.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Utilidades**: `clsx`, `tailwind-merge`

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

## 🔧 Instalación y Uso

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/deividlima1234/System_Gestion_ticket_frontend_web.git
    cd system-gestion-ticket-frontend-web
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

4.  **Construir para producción**
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables (UI, Layout, Features)
├── context/         # Contextos de React (Auth, Theme, etc.)
├── pages/           # Vistas principales de la aplicación
├── services/        # Lógica de comunicación con la API
├── types/           # Definiciones de tipos TypeScript
├── utils/           # Funciones de utilidad
├── App.tsx          # Configuración de rutas principal
└── index.css        # Estilos globales y configuración de Tailwind
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para discutir cambios mayores.

---

Desarrollado con ❤️ por Deivid_code.
