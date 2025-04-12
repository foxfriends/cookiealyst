group "default" {
    targets = ["cookiealyst-migrate", "cookiealyst-load", "cookiealyst"]
}

target "docker-metadata-action" {}

target "cookiealyst" {
  inherits = ["docker-metadata-action"]
  dockerfile = "Dockerfile"
  target = "release"
}

target "cookiealyst-migrate" {
  inherits = ["docker-metadata-action"]
  dockerfile = "Dockerfile"
  target = "migrate"
}

target "cookiealyst-load" {
  inherits = ["docker-metadata-action"]
  dockerfile = "Dockerfile"
  target = "load"
}
