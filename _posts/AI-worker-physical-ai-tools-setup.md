---
title: Physical AI Tools Setup for AI Worker
tags: [Robotis, AI worker, Physical AI tools, Robotics]
featured: true
featured_order: 1
description: A setup guide for running Physical AI Tools on the ROBOTIS AI Worker platform.
---

# Setup Guide for Physical AI tools
Last updated: 2026-06-05 (For Physical AI tools version 0.8.3)

## Prerequisites
- Ubuntu 24.04 LTS
- CUDA-enabled Nvidia GPU
- Nvidia GPU Driver (recommended: `nvidia-driver-570-server-open` for CUDA 12.8)

### Install X11 server utilities
The script is trying to use xhost to grant the Docker container permission to display a GUI on your host screen. Install the X11 server utilities by running:
```bash
sudo apt update
sudo apt install -y x11-xserver-utils
```

### Install Docker
> Reference: https://docs.docker.com/engine/install/ubuntu/

Docker provides a convenience script at https://get.docker.com/ to install Docker into development environments non-interactively.<br>
Here, we install Docker by using convenience script:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Add your user to the docker group so you don't have to prefix everything with `sudo`.
```bash
sudo usermod -aG docker $USER
```

For the group changes to take effect, your terminal session needs to refresh. You can either log out and log back into your Ubuntu account, or run this command to apply the group changes instantly to your current shell:
```bash
newgrp docker
```

### Install Nvidia Container Toolkit
Install the prerequisites for the instructions below:
```bash
sudo apt-get update && sudo apt-get install -y --no-install-recommends \
   ca-certificates \
   curl \
   gnupg2
```

Then, configure the production repository:
```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
```

Optionally, configure the repository to use experimental packages:
```bash
sudo sed -i -e '/experimental/ s/^#//g' /etc/apt/sources.list.d/nvidia-container-toolkit.list
```

Update the packages list from the repository:
```bash
sudo apt-get update
```

Install the NVIDIA Container Toolkit packages:
```bash
export NVIDIA_CONTAINER_TOOLKIT_VERSION=1.19.1-1
  sudo apt-get install -y \
      nvidia-container-toolkit=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      nvidia-container-toolkit-base=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container-tools=${NVIDIA_CONTAINER_TOOLKIT_VERSION} \
      libnvidia-container1=${NVIDIA_CONTAINER_TOOLKIT_VERSION}
```

Configure the container runtime:
```bash
sudo nvidia-ctk runtime configure --runtime=docker
```

Restart the Docker daemon:
```bash
sudo systemctl restart docker
```

## Installation

### Clone the Repository
```bash
git clone -b jazzy https://github.com/ROBOTIS-GIT/physical_ai_tools.git --recursive
cd physical-ai-tools
```

### Start the container
Use the container.sh helper script to start the container:
```bash
./docker/container.sh start
```

### Enter the docker container
In `physical-ai-tools` directory, run the following command to enter the docker container:
```bash
./docker/container.sh enter
```

### Build the package
```bash
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
```

### Launch Physical AI Server
After enter the physical-ai-tools container and build the package, launch the physical ai server by running the following command:
```bash
ai_server
```
### Open Web UI

Open `http://localhost` in your browser.<br>
Then you can see the following web UI.

![UI_home](/assets/images/posts/ai_worker/robotis_ai_worker_ui_home1.png)

To begin managing AI worker platform, select the appropriate robot type in `Robot Type Selection` section, and click `Set Robot Type` button. In this case, we select `ffw_sg2_rev1`.

![Robot_Type_Selection](/assets/images/posts/ai_worker/robotis_ai_worker_ui_home2.png)

Then you can see `Robot type set to ffw_sg2_rev1` and Ui state will be change to `Connected`.

![Robot_Type_Set_to_ffw_sg2_rev1](/assets/images/posts/ai_worker/robotis_ai_worker_ui_home3.png)

Now you are ready to use the AI worker platform.

