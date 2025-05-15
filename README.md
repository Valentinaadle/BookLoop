# BookLoop - Sistema de Gestión de Biblioteca

Este proyecto es un sistema de gestión de biblioteca que permite administrar libros, préstamos y usuarios.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### Backend (/backend)
- API REST construida con Node.js y Express
- Base de datos MySQL con Sequelize ORM
- Autenticación de usuarios
- Integración con Google Books API

### Frontend (/frontend)
- Interfaz de usuario construida con React
- Diseño responsive
- Gestión de estado con React Hooks
- Integración con la API del backend

## Requisitos

- Node.js v14 o superior
- MySQL 8.0
- npm o yarn

## Configuración

1. Backend:
```bash
cd backend
npm install
# Crear archivo .env con las variables de entorno necesarias
npm start
```

2. Frontend:
```bash
cd frontend
npm install
# Crear archivo .env con las variables de entorno necesarias
npm start
```

## Variables de Entorno

### Backend (.env)
```
DB_NAME=bookloop
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Características

- Búsqueda de libros usando Google Books API
- Gestión de inventario de libros
- Sistema de préstamos
- Autenticación de usuarios
- Interfaz intuitiva y responsive

## Desarrollo

El proyecto usa:
- ESLint para linting
- Prettier para formateo de código
- Husky para hooks de git

## Licencia

MIT
