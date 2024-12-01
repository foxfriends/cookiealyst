set quiet

default: dev
fix: fmt (lint "fix")

export CONCURRENTLY_KILL_OTHERS := "true"
export CONCURRENTLY_PAD_PREFIX := "true"
export CONCURRENTLY_PREFIX_COLORS := "auto"

export DATABASE_URL := `if [ -f .env ]; then rg '^DATABASE_URL="?([^"]*)"?$' -r '$1' .env; fi`
export SHADOW_DATABASE_URL := `if [ -f .env ]; then rg '^SHADOW_DATABASE_URL="?([^"]*)"?$' -r '$1' .env; fi`
export ROOT_DATABASE_URL := `if [ -f .env ]; then rg '^ROOT_DATABASE_URL="?([^"]*)"?$' -r '$1' .env; fi`

database_name := if DATABASE_URL != "" { file_stem(DATABASE_URL) } else { "" }
shadow_database_name := if SHADOW_DATABASE_URL != "" { file_stem(SHADOW_DATABASE_URL) } else { "" }

dev: up
    npx concurrently --names "sveltekit,migrate" \
        "npx vite dev --host" \
        "npx graphile-migrate watch"

init: get
    cp .env.example .env.local
    if [ ! -f .env ]; then ln -s .env.local .env; fi
    just up

get:
    npm install

up: && migrate
    docker compose up -d --wait
    docker compose exec postgres psql {{DATABASE_URL}} -c "" || docker compose exec postgres psql {{ROOT_DATABASE_URL}} -c 'CREATE DATABASE {{database_name}}'
    docker compose exec postgres psql {{SHADOW_DATABASE_URL}} -c "" || docker compose exec postgres psql {{ROOT_DATABASE_URL}} -c 'CREATE DATABASE {{shadow_database_name}}'

down:
    docker compose down

stop:
    docker compose stop

build:
    npx svelte-kit sync
    npx vite build

clean:
    rm -rf .svelte-kit build .eslintcache

lint mode="check":
    npx eslint . {{ if mode == "fix" { "--fix" } else { "--cache" } }}

fmt:
    npx prettier --write . --cache

migrate:
    npx graphile-migrate migrate --forceActions

migration:
    npx prettier migrations -w
    npx graphile-migrate commit

_pre-commit:
    npx graphile-migrate status

[confirm]
reset:
    npx graphile-migrate reset --erase
