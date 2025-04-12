output "port" {
  value = docker_container.cookiealyst.ports[0].external
}
