---
name: Control Panel Anomaly Detection & Classification
tools: [PatchCore, EfficientNet, Streamlit, PyTorch, MLOps, Docker]
description: Dual-stage vision pipeline for precise anomaly detection and product classification with a Streamlit-based MLOps dashboard.
external_url: https://github.com/Dexoculus/canon-control-pannel-cls
---

## Overview

Industry-coupled problem-based learning project sponsored by Canon Inc., completed from September to December 2025. The system combines anomaly localization, product classification, experiment management, and deployment tooling in one operator-facing workflow.

## Contributions

- Engineered a dual-stage pipeline integrating PatchCore for anomaly detection and EfficientNet-B0 for product classification.
- Extracted intermediate EfficientNet-B0 features and accelerated K-nearest-neighbor computation with custom PyTorch tensor operations on GPU.
- Built a no-code Streamlit interface covering inspection, augmentation, preprocessing, training, and deployment.
- Added MLOps logging for hardware status, terminal output, and experiment metrics to improve reproducibility and maintainability.
