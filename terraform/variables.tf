variable "cloudflare_api_token" {
  description = "Cloudflare API Token with Pages and DNS edit permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Custom domain name"
  type        = string
  default     = "tiga2000.com"
}
