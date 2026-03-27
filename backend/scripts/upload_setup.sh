#!/bin/bash

# Setup Uploads Directory for MovingArts
# Run from the project root (movingarts_theory)

UPLOAD_DIR="backend/uploads"

if [ ! -d "$UPLOAD_DIR" ]; then
    echo "Creating uploads directory..."
    mkdir -p "$UPLOAD_DIR"
    chmod 777 "$UPLOAD_DIR" # Ensure web server can write
    echo "Directory created at $UPLOAD_DIR"
else
    echo "Uploads directory already exists."
fi

# Link to SSD if needed (Example)
# ln -s /mnt/ssd/uploads backend/uploads
