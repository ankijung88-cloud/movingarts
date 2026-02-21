# AWS Lightsail Deployment Guide (Ubuntu)

Follow these steps to set up your new `Ubuntu-1` instance for the MovingArts project.

## 1. Firewall Configuration (AWS Console)
1.  Log in to the **AWS Lightsail Console**.
2.  Click on your instance: **Ubuntu-1**.
3.  Go to the **Networking** tab.
4.  Under **IPv4 Firewall**, click **Add rule**.
5.  Add the following rules:
    *   **Application**: Custom, **Protocol**: TCP, **Port**: `5000` (Backend API)
    *   **Application**: MySQL/Aurora, **Protocol**: TCP, **Port**: `3306` (Database - if you need remote access)
6.  Click **Create**.

## 2. Environment Setup (Via SSH)
Connect to your server using the orange **"Connect using SSH"** button in the Lightsail console, then run these commands:

### A. System Update
```bash
sudo apt update && sudo apt upgrade -y
```

### B. Install Node.js (v20)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
# Verify: node -v
```

### C. Install MySQL Server
```bash
sudo apt install -y mysql-server
# Start and enable:
sudo systemctl start mysql
sudo systemctl enable mysql
```

### D. MySQL Initial Setup
```bash
# Log in to MySQL
sudo mysql

# Inside MySQL terminal, run:
CREATE DATABASE movingarts_db;
-- Replace 'your_password' with the one in your .env
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
EXIT;
```

### E. Process Manager (PM2)
To keep your backend running forever:
```bash
sudo npm install -g pm2
```

## 3. Deployment
1.  **Clone your code**: `git clone <your-repo-url>`
2.  **Install dependencies**:
    ```bash
    cd <project-folder>/backend
    npm install
    ```
3.  **Setup .env**: `nano .env` (Paste your environment variables)
4.  **Run with PM2**:
    ```bash
    pm2 start src/server.ts --name "movingarts-api" --interpreter npx ts-node
    ```
