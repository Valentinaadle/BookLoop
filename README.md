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

1. **Backend (`backend/.env`)**  
   Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido (ajusta los valores si tu usuario/contraseña de MySQL son distintos):

   ```
DB_HOST=192.168.192.145
DB_USER=bookloop_remote
DB_PASSWORD=BookLoop2024!   
DB_NAME=bookloop
DB_PORT=3306
PORT=5000
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

## 8. ¿Qué hacer si la base de datos ya existe?

- Si ya tienes la base de datos `bookloop` con los datos, **no es necesario crearla ni importarla de nuevo**.
- Solo asegúrate de que el nombre en tu archivo `.env` coincida con el de la base de datos.

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

## 🔒 Acceso remoto seguro a phpMyAdmin/MySQL usando ZeroTier

### 1. Instalar ZeroTier

- Ve a [https://www.zerotier.com/download/](https://www.zerotier.com/download/) y descarga el instalador para tu sistema operativo.
- Instala ZeroTier normalmente (siguiente, siguiente, finalizar).

### 2. Unirse a la red de ZeroTier

- Abre la aplicación ZeroTier (icono amarillo cerca del reloj).
- Haz clic derecho en el icono y selecciona **"Join Network..."**.
- Ingresa este Network ID:  
  ```
  856127940CFE1ED2
  ```
- Haz clic en **Join**.

### 3. Ser autorizado en la red

- Avísale al dueño de la red (quien creó la red en my.zerotier.com) que te conectaste.
- El dueño debe entrar a [https://my.zerotier.com/](https://my.zerotier.com/), seleccionar la red y marcar la casilla **"Auth"** al lado de tu dispositivo para autorizarte.

### 4. Ver tu IP virtual de ZeroTier

- Una vez autorizado, haz clic derecho en el icono de ZeroTier, selecciona la red y busca la **IP virtual** (empieza con `10.`, `172.` o `192.168.`).
- El dueño del servidor debe pasar su IP virtual a los demás.

### 5. Acceder a phpMyAdmin/MySQL

- Para entrar a phpMyAdmin desde el navegador, usa la IP virtual del dueño:
  ```
  http://IP_VIRTUAL_DEL_DUEÑO/phpmyadmin
  ```
  (Por ejemplo: `http://192.168.192.145/phpmyadmin`)


### 6. Notas importantes

- Todos deben tener ZeroTier encendido y conectados a la misma red.
- Si no puedes acceder, revisa que estés autorizado en la web de ZeroTier y que el firewall permita el acceso.
- Solo los dispositivos autorizados en la web de ZeroTier podrán entrar.