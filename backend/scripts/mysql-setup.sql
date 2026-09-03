-- Cria o banco e o usuário que o backend usa (bate com backend/.env).
-- Rode como admin do MySQL/MariaDB, ex:
--
--   sudo systemctl start mariadb
--   sudo mysql < backend/scripts/mysql-setup.sql
--
-- Idempotente: pode rodar de novo sem erro.

CREATE DATABASE IF NOT EXISTS english_course
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'english_course'@'localhost' IDENTIFIED BY 'english_course';
CREATE USER IF NOT EXISTS 'english_course'@'127.0.0.1' IDENTIFIED BY 'english_course';

GRANT ALL PRIVILEGES ON english_course.* TO 'english_course'@'localhost';
GRANT ALL PRIVILEGES ON english_course.* TO 'english_course'@'127.0.0.1';

FLUSH PRIVILEGES;
