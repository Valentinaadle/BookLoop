const User = require('./User');
const Book = require('./Book');
const Profile = require('./Profile');
const Category = require('./Category');
const Role = require('./Role');
const Transaction = require('./Transaction');
const Review = require('./Review');
const Image = require('./Image');

// Establecer relaciones
User.hasOne(Profile);
Profile.belongsTo(User);

// Relación: Un usuario tiene un rol
User.belongsTo(Role, { foreignKey: 'role_id' }); // Cada usuario pertenece a un rol
Role.hasMany(User, { foreignKey: 'role_id' });   // Un rol puede tener muchos usuarios

// Relación: Un libro pertenece a un usuario vendedor
Book.belongsTo(User, { as: 'seller', foreignKey: 'seller_id' }); // Cada libro tiene un vendedor
User.hasMany(Book, { as: 'booksForSale', foreignKey: 'seller_id' }); // Un usuario puede vender muchos libros

// Relación: Un libro pertenece a una categoría
Book.belongsTo(Category, { foreignKey: 'category_id' }); // Cada libro tiene una categoría
Category.hasMany(Book, { foreignKey: 'category_id' });   // Una categoría puede tener muchos libros

// Relación: Un libro tiene muchas imágenes
Book.hasMany(Image, { foreignKey: 'book_id' }); // Un libro puede tener muchas imágenes
Image.belongsTo(Book, { foreignKey: 'book_id' }); // Cada imagen pertenece a un libro

// Relación: Una transacción tiene un vendedor y un comprador
Transaction.belongsTo(User, { as: 'seller', foreignKey: 'seller_id' }); // Vendedor
Transaction.belongsTo(User, { as: 'buyer', foreignKey: 'buyer_id' });   // Comprador
User.hasMany(Transaction, { as: 'sales', foreignKey: 'seller_id' });    // Un usuario puede ser vendedor en muchas transacciones
User.hasMany(Transaction, { as: 'purchases', foreignKey: 'buyer_id' }); // Un usuario puede ser comprador en muchas transacciones

// Relación: Una transacción pertenece a un libro
Transaction.belongsTo(Book, { foreignKey: 'book_id' }); // Cada transacción es por un libro
Book.hasMany(Transaction, { foreignKey: 'book_id' });   // Un libro puede estar en muchas transacciones

// Relación: Una review pertenece a una transacción
Review.belongsTo(Transaction, { foreignKey: 'transaction_id' }); // Cada review es de una transacción
Transaction.hasMany(Review, { foreignKey: 'transaction_id' });   // Una transacción puede tener muchas reviews

// Relación: Una review pertenece a un comprador
Review.belongsTo(User, { as: 'buyer', foreignKey: 'buyer_id' }); // Cada review la hace un comprador
User.hasMany(Review, { as: 'reviewsByBuyer', foreignKey: 'buyer_id' }); // Un usuario puede hacer muchas reviews

// Relación: Una review pertenece a un libro
Review.belongsTo(Book, { foreignKey: 'book_id' }); // Cada review es sobre un libro
Book.hasMany(Review, { foreignKey: 'book_id' });   // Un libro puede tener muchas reviews

// Exportar modelos
module.exports = {
  User,
  Book,
  Profile,
  Category,
  Role,
  Transaction,
  Review,
  Image
}; 