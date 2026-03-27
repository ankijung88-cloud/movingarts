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
5.  **SSD Migration (Optional)**: If you want to move your database to a faster SSD partition (e.g., `/mnt/ssd`), run:
    ```bash
    chmod +x backend/scripts/migrate_to_ssd.sh
    sudo ./backend/scripts/migrate_to_ssd.sh
    ```

6.  **Media Upload Setup**:
    ```bash
    # 1. Create uploads directory and set permissions
    chmod +x backend/scripts/upload_setup.sh
    ./backend/scripts/upload_setup.sh

    # 2. Update database schema for media columns
    # Replace 'your_password' with your DB password
    mysql -u root -p'your_password' movingarts_db < backend/scripts/update_schema_media.sql
    ```

## 4. Intuitive Management with WinSCP
To manage files and the database intuitively from your Windows machine:
1.  Follow the [WinSCP Setup Guide](file:///c:/dev/movingarts_theory/winscp_setup.md).
2.  Use the SFTP connection (`3.36.149.255`) with your `.pem` key.
3.  Navigate to `/home/ubuntu/movingarts_theory` to manage project files directly.
