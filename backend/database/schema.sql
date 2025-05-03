-- Drop tables if they already exist (for reset purposes)
DROP TABLE IF EXISTS entities;
DROP TABLE IF EXISTS users;

-- Create Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create Entities table with foreign key reference to Users
CREATE TABLE entities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (name) VALUES 
  ('Alice'),
  ('Bob'),
  ('Charlie');

-- Insert sample entities
INSERT INTO entities (title, description, category, created_by) VALUES
  ('No Talking Rule', 'No talking during silent study sessions.', 'Discipline', 1),
  ('Homework Deadline', 'All homework must be submitted before 8 PM.', 'Academic', 2),
  ('Respect Policy', 'Always show respect to peers and teachers.', 'Behavior', 3),
  ('Library Quiet Zone', 'Maintain silence in library areas.', 'Discipline', 1),
  ('Teamwork Encouraged', 'Work together on class projects.', 'Collaboration', 2);
