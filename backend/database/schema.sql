CREATE TABLE rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    seriousness_level ENUM('ridiculous', 'absurd', 'why?!'),
    enforced_by VARCHAR(255), -- e.g. "Grandma", "The HOA", "Self-Guilt"
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
