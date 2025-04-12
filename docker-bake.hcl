group "default" {
    targets = ["cookiealyst-migrate", "cookiealyst-load", "cookiealyst"]
}

target "cookiealyst" {
  dockerfile = "Dockerfile"
  target = "release"
}

target "cookiealyst-migrate" {
  dockerfile = "Dockerfile"
  target = "migrate"
}

target "cookiealyst-load" {
  dockerfile = "Dockerfile"
  target = "load"
}
