/**
 * Script para migrar imágenes locales de /uploads/profiles (usuarios) y /uploads (libros)
 * a Supabase Storage, actualizando la base de datos con la nueva URL pública.
 * No migra imágenes externas (Google Books, etc) ni URLs ya migradas.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Configuración Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const PROFILE_UPLOADS_DIR = path.resolve(__dirname, '../../uploads/profiles');
const BOOK_UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
const PROFILE_BUCKET = 'profile-photos';
const BOOK_BUCKET = 'book-images';

const REST_API_URL = `${SUPABASE_URL}/rest/v1`;
const HEADERS = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

function isLocalImage(url) {
  if (!url) return false;
  return url.startsWith('/uploads') || (!url.startsWith('http://') && !url.startsWith('https://'));
}

function isSupabaseUrl(url) {
  return url && url.includes('.supabase.co/storage/v1/object/public/');
}

async function migrateProfilePhotos() {
  console.log('Migrando fotos de perfil...');
  // Traer usuarios con photo_url local
  const usersRes = await axios.get(`${REST_API_URL}/users?select=id,photo_url&photo_url=not.is.null`, { headers: HEADERS });
  for (const user of usersRes.data) {
    const { id, photo_url } = user;
    if (!isLocalImage(photo_url) || isSupabaseUrl(photo_url)) {
      continue; // Saltear imágenes externas o ya migradas
    }
    const localPath = path.join(PROFILE_UPLOADS_DIR, path.basename(photo_url));
    if (!fs.existsSync(localPath)) {
      console.warn(`No se encontró la imagen local de perfil para usuario ${id}: ${localPath}`);
      continue;
    }
    const fileBuffer = fs.readFileSync(localPath);
    const fileName = `profile_${id}_${Date.now()}${path.extname(localPath)}`;
    const { error } = await supabase.storage.from(PROFILE_BUCKET).upload(fileName, fileBuffer, { upsert: true });
    if (error) {
      console.error(`Error subiendo foto de perfil de usuario ${id}:`, error.message);
      continue;
    }
    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;
    // Actualizar en DB por API REST
    await axios.patch(
      `${REST_API_URL}/users?id=eq.${id}`,
      { photo_url: publicUrl },
      { headers: HEADERS }
    );
    console.log(`Usuario ${id}: migrada a ${publicUrl}`);
  }
}

async function migrateBookImages() {
  console.log('Migrando imágenes de libros...');
  // Traer imágenes locales
  const imagesRes = await axios.get(`${REST_API_URL}/images?select=image_id,image_url&image_url=not.is.null`, { headers: HEADERS });
  for (const img of imagesRes.data) {
    const { image_id, image_url } = img;
    if (!isLocalImage(image_url) || isSupabaseUrl(image_url)) {
      continue; // Saltear imágenes externas o ya migradas
    }
    // Ignorar imágenes de perfil
    if (image_url.includes('/profiles/')) continue;
    const localPath = path.join(BOOK_UPLOADS_DIR, path.basename(image_url));
    if (!fs.existsSync(localPath)) {
      console.warn(`No se encontró la imagen local de libro para image_id ${image_id}: ${localPath}`);
      continue;
    }
    const fileBuffer = fs.readFileSync(localPath);
    const fileName = `book_${image_id}_${Date.now()}${path.extname(localPath)}`;
    const { error } = await supabase.storage.from(BOOK_BUCKET).upload(fileName, fileBuffer, { upsert: true });
    if (error) {
      console.error(`Error subiendo imagen de libro ${image_id}:`, error.message);
      continue;
    }
    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage.from(BOOK_BUCKET).getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;
    // Actualizar en DB por API REST
    await axios.patch(
      `${REST_API_URL}/images?image_id=eq.${image_id}`,
      { image_url: publicUrl },
      { headers: HEADERS }
    );
    console.log(`Imagen ${image_id}: migrada a ${publicUrl}`);
  }
}

async function main() {
  try {
    await migrateProfilePhotos();
    await migrateBookImages();
    console.log('¡Migración completada!');
    process.exit(0);
  } catch (err) {
    console.error('Error general en la migración:', err);
    process.exit(1);
  }
}

main();
