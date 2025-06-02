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
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bookloop
DB_PORT=3306
PORT=5000

EMAIL_USER=bookloopUNSTA@gmail.com
EMAIL_PASSWORD=yazmwcyximpxwgdv
JWT_SECRET=un_secreto_largo_y_seguro

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

# 🛠️ Guía completa de instalación y puesta en marcha de BookLoop

---

## 1. Instalar XAMPP, MySQL y phpMyAdmin

1. **Descargar XAMPP**  
   - Ve a [https://www.apachefriends.org/es/index.html](https://www.apachefriends.org/es/index.html) y descarga XAMPP para tu sistema operativo.

2. **Instalar XAMPP**  
   - Ejecuta el instalador y sigue los pasos recomendados.

3. **Iniciar los servicios necesarios**  
   - Abre el panel de control de XAMPP.
   - Haz clic en **Start** en **MySQL** (y en **Apache** si quieres usar phpMyAdmin).

4. **Abrir phpMyAdmin**  
   - Ve a [http://localhost/phpmyadmin](http://localhost/phpmyadmin) en tu navegador.

---

2. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

3. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 3. Configurar variables de entorno

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bookloop
DB_PORT=3306
PORT=5000

EMAIL_USER=bookloopUNSTA@gmail.com
EMAIL_PASSWORD=yazmwcyximpxwgdv
JWT_SECRET=un_secreto_largo_y_seguro
```

2. **Frontend (`frontend/.env`)**  
   Crea un archivo `.env` en la carpeta `frontend`:

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

---

## 4. Importar la base de datos con todos los libros

> **IMPORTANTE:**  
> Para que todos tengan los mismos libros y datos de prueba, es necesario importar el archivo `bookloop.sql` que se encuentra en la raíz del proyecto.

### Pasos para importar la base de datos:

1. Abre **phpMyAdmin** y asegúrate de que el servicio MySQL esté corriendo en XAMPP.
2. Crea una base de datos vacía llamada **`bookloop`** (o el nombre que uses en tu `.env`).
3. Selecciona la base de datos recién creada y ve a la pestaña **"Importar"**.
4. Haz clic en **"Seleccionar archivo"** y elige el archivo `bookloop.sql`.
5. Haz clic en **"Continuar"**.
6. ¡Listo! Ahora tienes todos los libros y datos de prueba en tu entorno local.

---

## 5. Arrancar el backend

1. **Desde la carpeta backend:**
   ```bash
   cd backend
   npx nodemon src/index.js
   ```
   o
   ```bash
   node src/index.js
   ```

   - El backend debe mostrar:  
     `Conexión a la base de datos establecida correctamente.`  
     `Base de datos sincronizada.`  
     `Servidor corriendo en el puerto 5000`

---

## 6. Arrancar el frontend

1. **Desde la carpeta frontend:**
   ```bash
   cd frontend
   npm start
   ```
   - Esto abrirá la app en [http://localhost:3000](http://localhost:3000)

---

## 7. Notas importantes

- **No ejecutar el backend legacy (`backend/app.js`).**  
  Solo usar el backend de `backend/src/index.js`.

- **Si hay problemas de rutas 404 en la búsqueda:**  
  Asegúrate de que la ruta `/search-db` esté antes de `/:id` en `bookRoutes.js`.

- **Si se agregan nuevas dependencias:**  
  Recordar correr `npm install` en la carpeta correspondiente.

- **Para agregar libros:**  
  Usar la funcionalidad de la app o cargar datos manualmente en la base de datos.

---


## 9. Comando rápido para levantar todo

```bash
# En una terminal
cd backend
npx nodemon src/index.js

# En otra terminal
cd frontend
npm start
```

http://192.168.1.30/phpmyadmin

856127940CFE1ED2

---

## 10. Npm Install nuevos
```
npm install axios
npm install nodemailer
npm install multer


#archivo .env del backend 

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=bookloop
   DB_PORT=3306

   # Server Configuration
   PORT=5000

   # Email Configuration
   EMAIL_USER=itsbookloop@gmail.com
   EMAIL_PASSWORD=gcnsizqqkkgwydib


## 10. Para importar la BD en PHP my admin

En phpMyAdmin, selecciona la base de datos bookloop en el panel izquierdo.
Haz clic en la pestaña “Operaciones”.
Busca la opción “Eliminar la base de datos (DROP)” y haz clic en “Eliminar la base de datos”.
Confirma la eliminación.
Crea una nueva base de datos con el mismo nombre (bookloop).
Selecciona la base de datos recién creada.
Ve a la pestaña “Importar” y sube el archivo .sql.

