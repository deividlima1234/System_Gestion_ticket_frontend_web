# 🎫 Sistema de Gestión de Tickets

![Status](https://img.shields.io/badge/Status-En_Desarrollo-yellow)
![Version](https://img.shields.io/badge/Versión-0.1.0-blue)
![License](https://img.shields.io/badge/Licencia-MIT-green)

Una plataforma moderna, robusta y elegante para la gestión eficiente de incidencias y soporte técnico. Diseñada con un enfoque "Mobile First" y una estética "Dark Mode" premium, esta aplicación optimiza el flujo de trabajo entre usuarios y equipos de soporte.

---

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad
- **Login Seguro**: Sistema de autenticación robusto con manejo de tokens JWT.
- **Protección de Rutas**: Middleware de frontend para proteger vistas sensibles.
- **Persistencia de Sesión**: Manejo inteligente de la sesión del usuario.

### 🎫 Gestión Integral de Tickets
- **Creación de Tickets**: Interfaz intuitiva para reportar incidencias con prioridad y descripción detallada.
- **Seguimiento en Tiempo Real**: Visualización del estado (Abierto, En Progreso, Resuelto, Cerrado) y prioridad.
- **Filtrado y Búsqueda**: Herramientas avanzadas para localizar tickets rápidamente.
- **Detalle Profundo**: Vista detallada de cada ticket con historial y metadatos.

### 👥 Administración de Usuarios (Role-Based)
- **Panel de Administración**: Acceso exclusivo para administradores.
- **Gestión de Roles**: Control granular de permisos (Admin, Soporte, Usuario).
- **CRUD de Usuarios**: Funcionalidades completas para crear, leer, actualizar y eliminar usuarios.

### 👤 Perfil de Usuario
- **Gestión de Cuenta**: Actualización de información personal.
- **Seguridad**: Funcionalidad para cambio de contraseña seguro.

### 🎨 Experiencia de Usuario (UX/UI)
- **Diseño Moderno**: Interfaz oscura elegante con acentos de color semánticos.
- **Responsive Design**: Totalmente adaptable a móviles, tablets y escritorio.
- **Feedback Visual**: Skeletons de carga, notificaciones toast y transiciones suaves.

---

## 🛠️ Stack Tecnológico

Este proyecto utiliza las tecnologías más modernas del ecosistema React para garantizar rendimiento y escalabilidad:

| Categoría | Tecnología | Versión | Descripción |
|-----------|------------|---------|-------------|
| **Core** | [React](https://react.dev/) | ^19.2.0 | Biblioteca principal de UI |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | ~5.9.3 | Tipado estático robusto |
| **Build Tool** | [Vite](https://vitejs.dev/) | ^7.2.4 | Entorno de desarrollo ultrarrápido |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) | ^4.1.18 | Framework de utilidades CSS |
| **Estado Server** | [TanStack Query](https://tanstack.com/query) | ^5.90.12 | Gestión de estado asíncrono y caché |
| **Routing** | [React Router](https://reactrouter.com/) | ^7.10.1 | Enrutamiento del lado del cliente |
| **Iconos** | [Lucide React](https://lucide.dev/) | ^0.561.0 | Iconografía moderna y ligera |
| **HTTP Client** | [Axios](https://axios-http.com/) | ^1.13.2 | Cliente HTTP basado en promesas |

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior (o yarn/pnpm equivalente)

---

## 🔧 Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu entorno local:

1.  **Clonar el Repositorio**
    ```bash
    git clone https://github.com/deividlima1234/System_Gestion_ticket_frontend_web.git
    cd System_Gestion_ticket_frontend_web
    ```

2.  **Instalar Dependencias**
    ```bash
    npm install
    ```

3.  **Configuración de Variables de Entorno**
    El proyecto actualmente utiliza una configuración base en `src/services/api.ts`.
    *API Base URL:* `https://system-gestion-ticket-backend.onrender.com/api/v1`

4.  **Ejecutar Servidor de Desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en: `http://localhost:5173`

---

## 📜 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

- `npm run dev`: Inicia el servidor de desarrollo con HMR (Hot Module Replacement).
- `npm run build`: Compila la aplicación para producción en la carpeta `dist`.
- `npm run lint`: Ejecuta ESLint para encontrar y arreglar problemas en el código.
- `npm run preview`: Sirve localmente la versión de producción construida.

---

## 📂 Estructura del Proyecto

La estructura de directorios está organizada para la escalabilidad:

```
src/
├── assets/          # Recursos estáticos (imágenes, fuentes)
├── components/      # Componentes de UI reutilizables
│   ├── common/      # Botones, inputs, modales genéricos
│   ├── layout/      # Layouts de página, sidebar, navbar
│   ├── tickets/     # Componentes específicos de tickets
│   └── users/       # Componentes específicos de usuarios
├── context/         # Contextos de React (AuthContext, etc.)
├── hooks/           # Custom Hooks reutilizables
├── pages/           # Vistas principales (Rutas)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── TicketsPage.tsx
│   └── ...
├── services/        # Capa de comunicación con API (Axios)
│   ├── api.ts       # Configuración base de Axios
│   ├── auth.ts      # Servicios de autenticación
│   └── ...
├── types/           # Definiciones de tipos TypeScript globales
├── utils/           # Funciones de utilidad y helpers
├── App.tsx          # Configuración principal y rutas
└── main.tsx         # Punto de entrada de la aplicación
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto:

1.  Haz un Fork del repositorio.
2.  Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3.  Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

<div align="center">
  <sub>Desarrollado con ❤️ por Eddam_code.</sub>
</div>
