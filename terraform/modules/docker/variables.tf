# Common variables
variable "name" {
  type = string
}

variable "expose" {
  type    = bool
  default = true
}

variable "port" {
  type     = number
  nullable = true
  default  = null
}

variable "networks" {
  type = list(object({
    name = string
  }))
  default = []
}

variable "restart" {
  type    = string
  default = "unless-stopped"
}

variable "log_driver" {
  type    = string
  default = "local"
}

variable "log_opts" {
  type    = map(string)
  default = {}
}

# Default variables
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

# Config variables
variable "data_dir" {
  type     = string
  default  = null
  nullable = true
}

variable "images_dir" {
  type = string
}
