---
title: AI Worker Policy Deployment Guide
tags: [Robotis, AI worker, Physical AI tools, Robotics]
description: A practical guide to deploying a trained policy on the ROBOTIS AI Worker platform.
external_url: 
---

This guide assumes that Physical AI Tools is already configured on Ubuntu 24.04. Otherwise, begin with the [Physical AI Tools setup guide](/note/ai-worker-physical-ai-tools-setup/).

## Put trained Policy into AI worker PC (UPC)
Copy your trained policy from your PC to `~/physical_ai_tools/lerobot/outputs/train/` directory in AI worker UPC.

(If you don't have permission to write to the UPC folder, apply the following command to the folder)
```bash
sudo chmod -R 777 <folder directory>
```

## Run the Follower node
In Robot PC, enter the `ai_worker` container:
```bash
cd ~/ai_worker/docker && ./container.sh enter
```

Run only follower node
```bash
## In the AI Worker container on the robot PC
ffw_sg2_follower_ai
```

### Run inference

Enter the `physical_ai_tools` container:
```bash
cd ~/physical_ai_tools/docker && ./container.sh enter
```

Launch the AI server:
```bash 
## In the Physical AI Tools container
ai_server
```

