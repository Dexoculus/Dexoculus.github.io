---
title: "LeRobot Setup Guide"
tags: [Huggingface, LeRobot, Setup]
description: "A step-by-step setup guide for Hugging Face LeRobot, including CUDA-enabled PyTorch installation using uv."
---

# Setup Guide for Hugging Face LeRobot
Last updated: 2026-05-06 (For LeRobot version 0.5.2)

> Reference:
    - https://huggingface.co/docs/lerobot/installation
    - https://github.com/huggingface/lerobot

## Environment & Versions
- OS: Windows 11, Linux (Ubuntu 24.04.4 LTS)
- Package Manager: `uv`

## Clone Repository
```bash
git clone https://github.com/huggingface/lerobot.git
cd lerobot
```

## Setup Virtual Environment
Python 3.12 is recommended for LeRobot.
```bash
uv venv --python 3.12
```

After the virtual environment is created, activate it.
```bash
### Linux/macOS
source .venv/bin/activate
### Windows PowerShell
.venv\Scripts\activate
```

## Install PyTorch
If you install LeRobot directly, PyTorch might be installed without CUDA support.
For GPU-accelerated training and inference, install PyTorch with CUDA support first.
```bash
uv pip install torch==2.10.0 torchvision==0.25.0 torchaudio==2.10.0 --index-url https://download.pytorch.org/whl/cu128
```

Install LeRobot from source:
```bash
uv pip install -e ".[dataset, training]"
```
