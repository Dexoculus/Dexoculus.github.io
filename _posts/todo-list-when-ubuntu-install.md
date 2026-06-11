---
title: Ubuntu 24.04 Installation Checklist
tags: [Linux, Ubuntu]
description: A concise checklist for configuring a fresh Ubuntu 24.04 installation.
external_url: 
---

Update package info
```bash
sudo apt-get update
```

Upgrade packages
```bash
sudo apt-get upgrade
```

Install Nvidia drivers
```bash
sudo ubuntu-drivers install
```

Install UV
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

