# BookLoop Backend

## Instalación y configuración de Supabase

Para que el backend funcione correctamente y puedas trabajar con imágenes, usuarios y libros, necesitas tener Supabase instalado y configurado en tu entorno local. Sigue estos pasos:

### 1. Instalar dependencias (incluyendo Supabase)

```bash
cd backend
npm install
npm install @supabase/supabase-js
```

### 2. Crear el archivo `.env` en la carpeta `backend`

Copia y pega este contenido en un archivo llamado `.env` dentro de la carpeta `backend`:

```env
SUPABASE_URL=https://tdsbsdsexuhilidpwpcl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkc2JzZHNleHVoaWxpZHB3cGNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ0ODU0MiwiZXhwIjoyMDY2MDI0NTQyfQ.5KkZAFdvoSHz9XRVkvtzHIM4SnE6jykDJGj0uqZTdzs

# Server Configuration
PORT=5000

# Email Configuration
EMAIL_USER=itsbookloop@gmail.com
EMAIL_PASSWORD=gcnsizqqkkgwydib
```

### 3. Verifica la conexión en `backend/src/config/db.js`

El archivo debe tener algo así para conectar con Supabase:

```js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
module.exports = supabase;
```

### 4. ¡Listo!

Ahora puedes iniciar el backend y trabajar normalmente. Si tus compañeros clonan el repo, solo deben seguir estos pasos para tener todo funcionando.

---


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