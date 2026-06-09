---
title: Guide for deploy policy on AI worker platoform
tags: [Robotis, AI worker, Physical AI tools, Robotics]
description: A guide for deploy policy on AI worker platoform.
external_url: 
---

# Guide for deploy policy on AI worker platoform
We suppose that you already setup Physical AI tools on Ubuntu 24.04. If not, please refer to [Setup guide for Physical AI tools](./_posts/AI-worker-physical-ai-tools-setup.md).

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
# In Robot PC, AI worker container
ffw_sg2_follower_ai
```

## Run Inference

Enter the `physical_ai_tools` container:
```bash
cd ~/physical_ai_tools/docker && ./container.sh enter
```

Launch the AI server:
```bash 
# In physical_ai_tools container
ai_server
```

