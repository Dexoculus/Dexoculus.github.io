---
name: Hand-held Camera Display State Classification
tools: [MobileNetV3-Small, Cloudflare Tunnels, Python, PyTorch]
image: /assets/images/projects/hand-held-camera.png
description: Lightweight vision pipeline for resource-constrained edge devices with real-time inference via Cloudflare Tunnels.
external_url: https://github.com/Dexoculus/hand-held-camera-display-state-classifiation
---

## Overview

Industry-coupled problem-based learning project sponsored by Canon Inc., completed from March to June 2025. The system classifies camera display states from a hand-held smartphone video stream and targets low-latency operation on constrained devices.

## Contributions

- Engineered a lightweight vision pipeline with MobileNetV3-Small for low-latency edge inference.
- Designed targeted augmentation for hand-held artifacts including occlusion, motion blur, and sensor noise.
- Built a secure real-time inference path through Cloudflare Tunnels over HTTPS, allowing direct smartphone camera ingestion during field tests.
- Delivered a responsive mobile-first interface for on-site technicians and end-to-end model serving.
