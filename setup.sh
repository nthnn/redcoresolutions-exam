sudo apt update
sudo apt install curl php-cli php-mbstring git unzip

ROOT_DIR=$(pwd)

log() {
    echo -e "\033[1;32m[SETUP] $1\033[0m"
}

log "Starting Backend Setup..."
cd "$ROOT_DIR/backend"

if [ ! -f .env ]; then
    log "Creating .env from .env.example..."
    cp .env.example .env
fi

log "Installing PHP dependencies..."
if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader
else
    php "../composer.phar" install --no-dev --optimize-autoloader
fi

log "Generating application key..."
php artisan key:generate

log "Generating JWT secret..."
php artisan jwt:secret --force

log "Initializing SQLite database..."
touch database/database.sqlite

log "Running database migrations..."
php artisan migrate --force

log "Installing backend frontend dependencies (Vite)..."
npm install

log "Starting Frontend Setup..."
cd "$ROOT_DIR/frontend"

if [ -f .env.example ] && [ ! -f .env ]; then
    log "Creating frontend .env from .env.example..."
    cp .env.example .env
fi

log "Installing frontend dependencies..."
npm install

log "Setup complete! Project is ready."
