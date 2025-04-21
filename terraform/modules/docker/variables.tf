variable "name" {
  type = string
}

variable "image_name" {
  type    = string
  default = "ghcr.io/foxfriends/cookiealyst"
}

variable "migrate_image_name" {
  type    = string
  default = "ghcr.io/foxfriends/cookiealyst-migrate"
}

variable "load_image_name" {
  type    = string
  default = "ghcr.io/foxfriends/cookiealyst-load"
}

variable "image_version" {
  type    = string
  default = "main"
}

variable "bridge_network_name" {
  type    = string
  default = "bridge"
}

variable "data_dir" {
  type     = string
  default  = null
  nullable = true
}

variable "images_dir" {
  type = string
}

variable "restart" {
  type    = string
  default = "unless-stopped"
}
