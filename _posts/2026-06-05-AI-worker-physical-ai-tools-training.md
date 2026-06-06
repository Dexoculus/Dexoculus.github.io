---
title: Training guide for Physical AI tools
tags: [Robotis, AI worker, Physical AI tools, Robotics]
style: fill
color: info
description: A training guide for physical ai tools.
external_url: 
---

# Training guide for Physical AI tools

We suppose that you already setup Physical AI tools on Ubuntu 24.04. If not, please refer to [Setup guide for Physical AI tools](_posts\2026-06-05-AI-worker-physical-ai-tools-setup.md).

## Enter the docker container
In `physical-ai-tools` directory, run the following command to enter the docker container:
```bash
./docker/container.sh enter
```
## Build the package
```bash
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
```

## Prepare datasets
Place the dataset in `physical_ai_tools/docker/huggingface/lerobot` directory.

## Train Policy

### Launch Physical AI Server
After enter the physical-ai-tools container, launch the physical ai server by running the following command:
```bash
ai_server
```
### Open Web UI

Open `http://localhost` in your browser.

![Training Web UI](public/assets/images/posts/Robotis_AI_worker_training_UI.png)

configure the training configs using web UI and start training.<br>
The results are saved in `physical_ai_tools(project root)/lerobot/outputs/train/` directory.