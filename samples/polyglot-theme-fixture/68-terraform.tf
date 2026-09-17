terraform {
  required_version = ">= 1.8.0"
}

variable "region" { type = string, default = "eu-west-1" }
resource "local_file" "fixture" { filename = "${path.module}/ready.txt", content = var.region }
