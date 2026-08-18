---
name: Imitation Learning for Pick and Place Tasks
tools: [LeRobot, ACT, Diffusion Policy, ROS 2, Docker, ROBOTIS FFW-SG2]
featured: true
featured_order: 1
video: /assets/video/projects/robotic_manipulation.mp4
description: An end-to-end imitation-learning workflow for real-world pick-and-place, from teleoperated demonstrations to policy deployment on a physical robot.
---

## Overview

This industry-coupled project, sponsored by CMES Robotics and completed from September to December 2025, investigated how an imitation-learning workflow could be adapted to an industrial pick-and-place task on the ROBOTIS AI Worker FFW-SG2 platform.

The work covered the full path from human demonstrations to physical deployment rather than policy training in isolation: teleoperation, dataset preparation, model training, robot integration, and evaluation under environmental variation.

## Problem

Industrial manipulation requires more than a policy that performs well on a fixed demonstration setup. The system must preserve consistent observation and action conventions across data collection, training, and deployment while remaining usable under changes in lighting and object placement.

This project focused on building that end-to-end workflow and identifying the practical failure modes that appear when a learned policy is transferred to physical hardware.

## System and workflow

1. Collected 200 human-demonstration episodes through teleoperation.
2. Curated the demonstrations into a LeRobot-compatible training dataset.
3. Trained ACT and Diffusion Policy baselines.
4. Integrated the trained policies with the robot software stack using ROS 2 and Docker.
5. Deployed the policies on the physical FFW-SG2 platform.
6. Evaluated behavior under changes in lighting and the surrounding environment.

## Contributions

- Customized Hugging Face LeRobot and ROBOTIS Physical AI Tools for the target robot and task.
- Built the data-to-deployment workflow used to move from teleoperated demonstrations to physical inference.
- Trained and deployed both Action Chunking Transformer and Diffusion Policy models.
- Tested policy robustness beyond the exact demonstration conditions and documented deployment failures encountered on the real system.

## What I learned

The project showed that policy architecture is only one part of real-world robot learning. Observation consistency, action semantics, timing, camera placement, and deployment infrastructure can dominate performance once a policy leaves the training environment.

It also exposed a limitation of pure behavior cloning: small errors can accumulate during a long manipulation sequence, while the policy has no explicit mechanism for recovering from states that are underrepresented in the demonstrations. This observation motivated the ongoing [Residual RL for Robot Manipulation](/projects/residual-rl-for-robot-manipulation/) study, which asks whether a learned residual policy can improve an ACT baseline without relearning the task from scratch.

## Resources

- [Project repository](https://github.com/HYU-Internship2-2025H2/HYU-Internship2-2025H2)