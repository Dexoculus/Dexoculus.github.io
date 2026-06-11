---
title: Training Guide for Physical AI Tools
tags: [Robotis, AI worker, Physical AI tools, Robotics]
description: A guide to preparing datasets and training policies with Physical AI Tools.
external_url: 
---

This guide assumes that Physical AI Tools is already configured on Ubuntu 24.04. Otherwise, begin with the [Physical AI Tools setup guide](/note/ai-worker-physical-ai-tools-setup/).

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

![Training Web UI](/assets/images/posts/Robotis_AI_worker_training_UI.png)

configure the training configs using web UI and start training.<br>
The results are saved in `physical_ai_tools(project root)/lerobot/outputs/train/` directory.
