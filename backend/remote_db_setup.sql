-- Remote DB Access Setup for Lightsail
-- Run these commands in your MySQL terminal as root

-- 1. Create a database user that can connect from anywhere (for testing/remote server)
-- Replace 'your_password' with the actual password in your .env
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON movingarts_db.* TO 'root'@'%';
FLUSH PRIVILEGES;

-- 2. Modify MySQL Config to allow remote binds
-- Usually located at /etc/mysql/mysql.conf.d/mysqld.cnf
-- Set bind-address = 0.0.0.0
