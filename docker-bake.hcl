group "default" {
    targets = ["cookiealyst-migrate", "cookiealyst-load", "cookiealyst"]
}

target "image-metadata-action" {}
target "migrate-metadata-action" {}
target "load-metadata-action" {}

target "cookiealyst" {
  inherits = ["image-metadata-action"]
  dockerfile = "Dockerfile"
  target = "release"
}

target "cookiealyst-migrate" {
  inherits = ["migrate-metadata-action"]
  dockerfile = "Dockerfile"
  target = "migrate"
}

target "cookiealyst-load" {
  inherits = ["load-metadata-action"]
  dockerfile = "Dockerfile"
  target = "load"
}
