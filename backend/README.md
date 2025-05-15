# BookLoop Backend

Backend para la aplicación BookLoop desarrollado con Node.js, Express y MySQL.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8.0 recomendado)
- npm o yarn

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env en la raíz del proyecto con las siguientes variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=bookloop
DB_PORT=3306
```

4. Asegúrate de crear la base de datos en MySQL:
```sql
CREATE DATABASE bookloop;
```

## Desarrollo

Para ejecutar en modo desarrollo:
```bash
npm run dev
```

## Producción

Para ejecutar en producción:
```bash
npm start
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/      # Configuraciones
│   ├── controllers/ # Controladores
│   ├── models/      # Modelos de datos (Sequelize)
│   ├── routes/      # Rutas de la API
│   ├── middleware/  # Middlewares
│   └── index.js     # Punto de entrada
├── .env
├── .gitignore
└── package.json
``` 