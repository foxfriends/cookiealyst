set quiet
set dotenv-load

default: dev
fix: fmt (lint "fix")

export CONCURRENTLY_KILL_OTHERS := "true"
export CONCURRENTLY_PAD_PREFIX := "true"
export CONCURRENTLY_PREFIX_COLORS := "auto"

DATABASE_URL := env_var("DATABASE_URL")
SHADOW_DATABASE_URL := env_var("SHADOW_DATABASE_URL")
ROOT_DATABASE_URL := env_var("ROOT_DATABASE_URL")

database_name := if DATABASE_URL != "" { file_stem(DATABASE_URL) } else { "" }
shadow_database_name := if SHADOW_DATABASE_URL != "" { file_stem(SHADOW_DATABASE_URL) } else { "" }

dev: up
    NODE_ENV=development npx svelte-kit sync
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

load:
    npx tsx ./src/scripts/load-cookies.ts < cookies.toml

down:
    docker compose down

stop:
    docker compose stop

build:
    NODE_ENV=production npx svelte-kit sync
    NODE_ENV=production npx vite build

clean:
    rm -rf .svelte-kit build .eslintcache

lint mode="check":
    npx eslint . {{ if mode == "fix" { "--fix" } else { "--cache" } }}

fmt:
    npx prettier --write . --cache

check:
    npm run check

migrate:
    npx graphile-migrate migrate --forceActions

migration:
    npx prettier migrations -w
    npx graphile-migrate commit

unmigration:
    npx graphile-migrate uncommit

_pre-commit:
    npx graphile-migrate status

[confirm]
reset:
    npx graphile-migrate reset --erase
