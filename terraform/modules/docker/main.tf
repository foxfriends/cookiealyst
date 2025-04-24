terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.7.1"
    }
  }
}

locals {
  image         = "${var.image_name}:${var.image_version}"
  load_image    = "${var.load_image_name}:${var.image_version}"
  migrate_image = "${var.migrate_image_name}:${var.image_version}"
  database_name = "cookiealyst"
  database_user = "cookiealyst"
  database_url  = "postgresql://${local.database_user}:${random_password.postgres_password.result}@postgres:5432/${local.database_name}"
  internal_port = 3000
}

data "docker_registry_image" "cookiealyst" {
  name = local.image
}

resource "docker_image" "cookiealyst" {
  name          = local.image
  pull_triggers = [data.docker_registry_image.cookiealyst.sha256_digest]
}

resource "docker_container" "cookiealyst" {
  image   = docker_image.cookiealyst.image_id
  name    = var.name
  restart = var.restart

  dynamic "ports" {
    for_each = var.expose ? [var.port] : []

    content {
      internal = local.internal_port
      external = ports.value
    }
  }

  volumes {
    container_path = "/app/static/images"
    host_path      = var.images_dir
    read_only      = true
  }

  network_mode = "bridge"

  networks_advanced {
    name = docker_network.internal.name
  }

  dynamic "networks_advanced" {
    for_each = var.networks
    iterator = net

    content {
      name = net.value["name"]
    }
  }

  healthcheck {
    test         = ["CMD", "curl", "-f", "localhost:${local.internal_port}/health"]
    interval     = "5s"
    retries      = 2
    start_period = "1s"
    timeout      = "500ms"
  }

  env = [
    "DATABASE_URL=${local.database_url}",
    "PORT=${local.internal_port}",
  ]

  depends_on = [
    docker_container.migrate,
    docker_container.load,
  ]
}
