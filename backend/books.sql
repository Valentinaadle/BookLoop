CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    imageUrl VARCHAR(500),
    price DECIMAL(10,2),
    stock INT DEFAULT 0,
    details TEXT,
    authorBio TEXT,
    language VARCHAR(50),
    pages INT,
    publishYear INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 