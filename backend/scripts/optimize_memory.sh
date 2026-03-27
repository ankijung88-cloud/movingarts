#!/bin/bash

# 1GB RAM Instance Memory Optimization Script for Ubuntu
# WARNING: Run with sudo.

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

echo "--- Starting Memory Optimization ---"

# 1. Add 2GB SWAP File (Crucial for 1GB RAM instances)
if [ ! -f /swapfile ]; then
    echo "Creating 2GB SWAP file..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    echo "SWAP file created and activated."
else
    echo "SWAP file already exists."
fi

# 2. Tune MySQL for Low Memory
echo "Tuning MySQL (mysqld.cnf)..."
MYSQL_CONF="/etc/mysql/mysql.conf.d/mysqld.cnf"
if [ -f "$MYSQL_CONF" ]; then
    # Backup
    cp "$MYSQL_CONF" "${MYSQL_CONF}.mem.bak"
    
    # Apply conservative memory settings
    # Reduce InnoDB buffer pool to 256MB (default might be too high)
    sed -i "/\[mysqld\]/a innodb_buffer_pool_size = 256M\nkey_buffer_size = 16M\nmax_connections = 50\ntmp_table_size = 16M\nmax_heap_table_size = 16M" "$MYSQL_CONF"
    
    echo "Restarting MySQL to apply changes..."
    systemctl restart mysql
else
    echo "MySQL config not found at $MYSQL_CONF. Please check manually."
fi

# 3. Check current status
echo "--- Optimization Complete ---"
free -h
swapon --show
systemctl status mysql --no-pager
