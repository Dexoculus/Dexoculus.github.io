---
name: Single-Arm Imitation Learning for Dynamic Assembly
tools: [ACT, LeRobot, GELLO, UR5, ROS 2, Docker]
featured: true
featured_order: 2
image: /assets/images/projects/single-arm-dynamic-assembly.png
description: Real-world ACT experiments for dynamic conveyor assembly, sequential manipulation, and task-specific generalization on a UR5.
---

## Overview

This project documents a series of real-world single-arm imitation-learning experiments conducted in June and July 2026. The main task required a UR5 to track a moving gear on a conveyor, grasp it, and place it onto a target axle using an ACT policy trained from GELLO demonstrations.

The study expanded beyond a single deployment run. It examined how camera coverage, action-chunk settings, demonstration composition, recovery examples, checkpoint selection, and targeted edge-case data affect physical manipulation behavior.

## Research questions

- How should demonstrations cover spatial variation when the target moves continuously?
- How does ACT's action horizon affect delayed feedback and grasp timing?
- Can small, targeted datasets repair a specific failure without recollecting the full task?
- When do recovery demonstrations help, and when do they introduce unwanted behavior?
- How well does the learned behavior transfer across layouts, object colors, and object variants?

## System

- **Robot:** UR5 single-arm manipulator
- **Teleoperation:** GELLO
- **Policy:** Action Chunking Transformer
- **Training and data:** LeRobot
- **Primary task:** track a moving gear, grasp it from a conveyor, and insert it onto an axle
- **Additional studies:** two-stage gear assembly and shoe-packing with different bundle types

## Dynamic conveyor experiment

The initial protocol divided the conveyor into three gear positions and collected 20 demonstrations per position, for 60 episodes. A second phase added two intermediate positions and expanded the dataset to 110 episodes.

The first deployments revealed that the issue was not simply dataset size:

1. A chunk size of 50 responded too slowly for the moving object.
2. A chunk size of 25 produced better tracking and grasp behavior in the initial trials.
3. The original camera view did not cover the left side of the conveyor reliably.
4. After changing the camera view, the earlier demonstrations were discarded and 50 episodes were recollected under the corrected observation setup.
5. Additional demonstrations targeted center positions, conveyor-speed changes, recovery behavior, two gear colors, and multi-object edge cases.

This progression treated data collection as an iterative systems experiment: diagnose a failure, identify whether it comes from sensing, timing, or data coverage, then change only the relevant part of the pipeline.

## Findings

### Observation design

A camera blind spot delayed gear detection and produced a position-dependent grasp failure. Recollecting the dataset after fixing the view was more effective than trying to compensate only through additional training.

### Action horizon and timing

Shortening the initial ACT chunk from 50 to 25 improved response to the moving target in the observed trials. Later experiments continued to tune chunk size and the number of executed actions to balance responsiveness and motion stability.

### Demonstration behavior transfers to the policy

Recovery demonstrations caused the gripper to close earlier than desired in some deployments. Removing retry-heavy trajectories produced more stable grasp timing. Likewise, demonstrations that continuously tracked the object encouraged tracking behavior at deployment, even when waiting for the object could be more reliable.

### Targeted data can repair local failures

Experiments on a separate two-stage gear-assembly task compared full-sequence dataset sizes from 100 to 394 episodes. In these runs, configurations containing at least 200 full-sequence episodes completed the sequence more reliably than smaller configurations. Adding 20 examples of a particular edge case was sufficient to produce the intended response in the tested case, although smaller 5- and 10-episode conditions were not evaluated.

### More training was not always better

For the final conveyor edge cases, the 100k-step checkpoint behaved more reliably than the 300k-step checkpoint. This is treated as an overfitting hypothesis rather than a proven causal diagnosis and motivates checkpoint-level evaluation instead of selecting the final training step automatically.

## Additional transfer task

A related packing experiment trained on 120 demonstrations of inserting a bundle into a shoe and evaluated three bundle types over 10 trials each.

| Bundle condition | Successes | Observed success rate |
| --- | ---: | ---: |
| Training bundle | 9 / 10 | 90% |
| Larger paper bundle | 8 / 10 | 80% |
| Plastic shipping bundle | 5 / 10 | 50% |

Most failures occurred at contact: the bundle caught on the shoe opening, was grasped poorly, or was pulled back out before the gripper opened fully. The result illustrates that visual similarity alone does not guarantee transfer when object compliance and contact dynamics change.

## My contributions

- Designed and executed staged GELLO demonstration protocols.
- Trained and deployed ACT policies through LeRobot.
- Diagnosed failures involving camera coverage, action timing, dataset imbalance, and demonstration style.
- Curated targeted datasets for spatial, temporal, and multi-object edge cases.
- Compared checkpoints and policy settings on physical manipulation tasks.
- Documented success and failure modes to guide the next collection cycle.

## Related note

The cross-experiment lessons are summarized in [Designing Demonstration Datasets for ACT](/note/designing-demonstration-datasets-for-act/).