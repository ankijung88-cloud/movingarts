#!//bin/bash

# MySQL Data Migration to SSD Script for Ubuntu (MovingArts Project)
# WARNING: This script will stop MySQL and move data. Run with sudo.

# 1. Configuration
NEW_DATA_DIR="/mnt/ssd/mysql" # REPLACE THIS with your actual SSD mount path
OLD_DATA_DIR="/var/lib/mysql"

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

echo "--- Starting MySQL Migration to $NEW_DATA_DIR ---"

# 2. Stop MySQL
systemctl stop mysql
if [ $? -ne 0 ]; then
    echo "Failed to stop MySQL. Aborting."
    exit 1
fi

# 3. Create new directory and copy data
mkdir -p "$NEW_DATA_DIR"
chown mysql:mysql "$NEW_DATA_DIR"
chmod 750 "$NEW_DATA_DIR"

echo "Copying data (this may take a while)..."
rsync -av "$OLD_DATA_DIR/" "$NEW_DATA_DIR"

# 4. Backup config and update path
CONFIG_FILE="/etc/mysql/mysql.conf.d/mysqld.cnf"
cp "$CONFIG_FILE" "${CONFIG_FILE}.bak"
sed -i "s|datadir.*=.*$OLD_DATA_DIR|datadir = $NEW_DATA_DIR|g" "$CONFIG_FILE"

# 5. Handle AppArmor (Ubuntu specific)
# This is crucial, otherwise MySQL will fail to start.
APPARMOR_FILE="/etc/apparmor.d/tunables/alias"
if ! grep -q "alias $OLD_DATA_DIR/ -> $NEW_DATA_DIR/," "$APPARMOR_FILE"; then
    echo "Updating AppArmor aliases..."
    echo "alias $OLD_DATA_DIR/ -> $NEW_DATA_DIR/," >> "$APPARMOR_FILE"
    systemctl restart apparmor
fi

# 6. Start MySQL
echo "Starting MySQL..."
systemctl start mysql

# 7. Verification
if systemctl is-active --quiet mysql; then
    echo "SUCCESS: MySQL is running with the new data directory."
    echo "New path configured in $CONFIG_FILE"
    echo "Verify in MySQL using: SHOW VARIABLES LIKE 'datadir';"
else
    echo "FAILURE: MySQL failed to start. Check 'journalctl -xeu mysql' for errors."
    echo "You may need to revert changes in $CONFIG_FILE and AppArmor."
fi
