# BookLoop Backend

## Instalación y configuración de Supabase

Para que el backend funcione correctamente y puedas trabajar con imágenes, usuarios y libros, necesitas tener Supabase instalado y configurado en tu entorno local. Sigue estos pasos:

### 1. Instalar dependencias (incluyendo Supabase)

```bash
cd backend
npm install
npm install @supabase/supabase-js
```

### 3. Verifica la conexión en `backend/src/config/db.js`

El archivo debe tener algo así para conectar con Supabase:

```js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
module.exports = supabase;

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