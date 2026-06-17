---
name: Box Depalletizing System
tools: [YOLOv8, 3D Perception, RB5-850, Python, PyTorch, Blender]
featured: true
featured_order: 2
video: /assets/video/box_depal_demo.mp4
description: 3D vision-based box detection and pose estimation system utilizing YOLOv8 on depth maps for robotic depalletizing.
external_url: https://github.com/Dexoculus/box_depalletizing
---

## Overview

Industry-coupled problem-based learning project sponsored by CMES Robotics, completed from March to June 2025. The system estimates grasp targets and end-effector orientation from depth imagery for robotic box depalletizing.

## Contributions

- Built a real-time 3D perception pipeline using YOLOv8m on depth maps while preserving robustness across box textures and lighting conditions.
- Developed a scalable augmentation workflow combining manual polygon annotations with synthetic depth data generated in Blender.
- Computed surface normals from depth topography and transformed them into target coordinates and 6-DoF quaternion orientations.
- Integrated perception output with an RB5-850 collaborative robot and a teaching-based explicit path-planning workflow.
