// Script para reemplazar camelCase por snake_case en todo el proyecto
// Úsalo con: node scripts/replaceCamelToSnake.js

const fs = require('fs');
const path = require('path');

// Mapea aquí los campos a reemplazar (agrega todos los que uses en tu BD)
const replacements = [
  // --- IDs y claves foráneas ---
  { camel: /userId/g, snake: 'user_id' },
  { camel: /UserId/g, snake: 'user_id' },
  { camel: /profileId/g, snake: 'profile_id' },
  { camel: /ProfileId/g, snake: 'profile_id' },
  { camel: /bookId/g, snake: 'book_id' },
  { camel: /BookId/g, snake: 'book_id' },
  { camel: /categoryId/g, snake: 'category_id' },
  { camel: /CategoryId/g, snake: 'category_id' },
  { camel: /imagesId/g, snake: 'images_id' },
  { camel: /ImagesId/g, snake: 'images_id' },
  { camel: /isbnCode/g, snake: 'isbn_code' },
  { camel: /transactionId/g, snake: 'transaction_id' },
  { camel: /TransactionId/g, snake: 'transaction_id' },
  { camel: /buyerId/g, snake: 'buyer_id' },
  { camel: /BuyerId/g, snake: 'buyer_id' },
  { camel: /sellerId/g, snake: 'seller_id' },
  { camel: /SellerId/g, snake: 'seller_id' },
  { camel: /reviewId/g, snake: 'review_id' },
  { camel: /ReviewId/g, snake: 'review_id' },
  { camel: /roleId/g, snake: 'role_id' },
  { camel: /RoleId/g, snake: 'role_id' },
  { camel: /imageId/g, snake: 'image_id' },
  { camel: /ImageId/g, snake: 'image_id' },
  { camel: /wishlistId/g, snake: 'wishlist_id' },
  { camel: /WishlistId/g, snake: 'wishlist_id' },
  { camel: /solicitudId/g, snake: 'solicitud_id' },
  { camel: /SolicitudId/g, snake: 'solicitud_id' },
  { camel: /reviewId/g, snake: 'review_id' },
  { camel: /ReviewId/g, snake: 'review_id' },
  { camel: /categoryId/g, snake: 'category_id' },
  { camel: /CategoryId/g, snake: 'category_id' },
  { camel: /roleId/g, snake: 'role_id' },
  { camel: /RoleId/g, snake: 'role_id' },
  { camel: /transactionId/g, snake: 'transaction_id' },
  { camel: /TransactionId/g, snake: 'transaction_id' },
  // --- Fechas y timestamps ---
  { camel: /createdAt/g, snake: 'created_at' },
  { camel: /CreatedAt/g, snake: 'created_at' },
  { camel: /updatedAt/g, snake: 'updated_at' },
  { camel: /UpdatedAt/g, snake: 'updated_at' },
  { camel: /reviewDate/g, snake: 'review_date' },
  { camel: /ReviewDate/g, snake: 'review_date' },
  { camel: /transactionDate/g, snake: 'transaction_date' },
  { camel: /TransactionDate/g, snake: 'transaction_date' },
  { camel: /publishedDate/g, snake: 'publisheddate' },
  { camel: /PublishedDate/g, snake: 'publisheddate' },
  { camel: /publicationDate/g, snake: 'publication_date' },
  { camel: /PublicationDate/g, snake: 'publication_date' },
  { camel: /createdat/g, snake: 'createdat' },
  { camel: /updatedat/g, snake: 'updatedat' },
  // --- Campos de libros ---
  { camel: /isbn/g, snake: 'isbn' },
  { camel: /isbnCode/g, snake: 'isbn_code' },
  { camel: /googlebooksid/g, snake: 'googlebooksid' },
  { camel: /title/g, snake: 'title' },
  { camel: /authors/g, snake: 'authors' },
  { camel: /description/g, snake: 'description' },
  { camel: /pageCount/g, snake: 'pagecount' },
  { camel: /PageCount/g, snake: 'pagecount' },
  { camel: /imageUrl/g, snake: 'imageurl' },
  { camel: /ImageUrl/g, snake: 'imageurl' },
  { camel: /coverImageUrl/g, snake: 'coverimageurl' },
  { camel: /CoverImageUrl/g, snake: 'coverimageurl' },
  { camel: /categories/g, snake: 'categories' },
  { camel: /language/g, snake: 'language' },
  { camel: /averageRating/g, snake: 'averagerating' },
  { camel: /AverageRating/g, snake: 'averagerating' },
  { camel: /publisher/g, snake: 'publisher' },
  { camel: /Publisher/g, snake: 'publisher' },
  { camel: /price/g, snake: 'price' },
  { camel: /Price/g, snake: 'price' },
  { camel: /status/g, snake: 'status' },
  { camel: /quantity/g, snake: 'quantity' },
  { camel: /available/g, snake: 'available' },
  // --- Reviews ---
  { camel: /experienceRate/g, snake: 'experience_rate' },
  { camel: /bookRate/g, snake: 'book_rate' },
  { camel: /sellerRate/g, snake: 'seller_rate' },
  { camel: /comment/g, snake: 'comment' },
  // --- Roles y categorías ---
  { camel: /roleName/g, snake: 'role_name' },
  { camel: /categoryName/g, snake: 'category_name' },
  // --- Imágenes ---
  { camel: /imageUrl/g, snake: 'image_url' },
  { camel: /ImageUrl/g, snake: 'image_url' },
  // --- Wishlist y solicitudes ---
  { camel: /wishlistId/g, snake: 'wishlist_id' },
  { camel: /WishlistId/g, snake: 'wishlist_id' },
  // --- Perfiles ---
  { camel: /codigoPostal/g, snake: 'codigopostal' },
  { camel: /CodigoPostal/g, snake: 'codigopostal' },
  { camel: /direccion/g, snake: 'direccion' },
  { camel: /Direccion/g, snake: 'direccion' },
  { camel: /telefono/g, snake: 'telefono' },
  { camel: /Telefono/g, snake: 'telefono' },
  { camel: /ciudad/g, snake: 'ciudad' },
  { camel: /Ciudad/g, snake: 'ciudad' },
  { camel: /pais/g, snake: 'pais' },
  { camel: /Pais/g, snake: 'pais' },
  // --- Usuarios ---
  { camel: /username/g, snake: 'username' },
  { camel: /email/g, snake: 'email' },
  { camel: /password/g, snake: 'password' },
  { camel: /nombre/g, snake: 'nombre' },
  { camel: /apellido/g, snake: 'apellido' },
  { camel: /bio/g, snake: 'bio' },
  { camel: /photoUrl/g, snake: 'photo_url' },
  { camel: /PhotoUrl/g, snake: 'photo_url' },
  { camel: /role/g, snake: 'role' },
  { camel: /activo/g, snake: 'activo' },
  { camel: /intereses/g, snake: 'intereses' },
  // --- Otros ---
  { camel: /message/g, snake: 'message' },
  { camel: /Message/g, snake: 'message' },
  { camel: /id/g, snake: 'id' },
  { camel: /Id/g, snake: 'id' },
  // Puedes seguir agregando más campos según tu modelo
];

const EXCLUDE_DIRS = ['node_modules', 'build', 'dist', '.next', '.git'];
const VALID_EXTS = ['.js', '.jsx', '.ts', '.tsx'];

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        walk(fullPath, filelist);
      }
    } else {
      if (VALID_EXTS.includes(path.extname(file))) {
        filelist.push(fullPath);
      }
    }
  });
  return filelist;
}

function backupFile(filePath) {
  const backupPath = filePath + '.bak';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let replaced = false;
  replacements.forEach(({ camel, snake }) => {
    if (camel.test(content)) {
      content = content.replace(camel, snake);
      replaced = true;
    }
  });
  if (replaced) {
    backupFile(filePath);
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const files = walk(rootDir);
  let changed = [];
  files.forEach(file => {
    if (replaceInFile(file)) {
      changed.push(file);
    }
  });
  if (changed.length) {
    console.log('Archivos modificados:');
    changed.forEach(f => console.log('  -', f));
    console.log('\n¡Listo! Se hicieron backups con extensión .bak.');
  } else {
    console.log('No se encontraron ocurrencias para reemplazar.');
  }
}

main();
