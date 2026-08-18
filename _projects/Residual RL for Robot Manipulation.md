---
name: Residual RL for Robot Manipulation
tools: [Residual RL, PPO, ACT, LeRobot, Cyclo Lab, Isaac Lab, ROBOTIS FFW-SG2]
featured: false
video: /assets/video/projects/residual-rl-sim-demo.mp4
description: Ongoing study of whether a PPO residual policy can improve an ACT pick-and-place baseline in simulation.
---

## Overview

This is an ongoing study started in August 2026. It investigates whether a reinforcement-learning policy can correct an imitation-learning policy during manipulation rather than learning the full task from scratch.

The current scope is deliberately narrow: a simulated FFW-SG2 pick-and-place task in Cyclo Lab, an ACT base policy trained from demonstrations, and a PPO policy that learns only a bounded residual action.

> **Status — in progress:** the simulation and demonstration pipeline are operational, and an ACT baseline has been trained. Reliable simulation deployment and the residual PPO training pipeline are still under development. No performance-improvement claim is made at this stage.

## Research question

Can a PPO residual policy improve the success and recovery behavior of a fixed ACT policy under controlled object-position variation?

The planned controller has the form

$$
a_t = \operatorname{clip}\left(a_t^{\mathrm{ACT}} + \alpha a_t^{\mathrm{PPO}}\right),
$$

where the ACT parameters remain frozen and $\alpha$ limits how much the residual policy may alter the base action.

## Experimental scope

- **Environment:** `Cyclo-Real-Pick-Place-FFW-SG2-v0`
- **Task:** pick and place a single challenging object into a basket
- **Base policy:** ACT trained on 30 simulated demonstrations
- **Residual policy:** PPO, with bounded residual actions
- **Variation:** randomized object position with fixed robot and camera initialization
- **Primary metric:** task success rate

The task was reduced from six objects to one difficult object so that the study could isolate policy correction from multi-object reward design and dataset scale.

## Progress

### Completed

- Installed and launched the Cyclo Lab simulation environment.
- Connected the leader device to the simulator through Zenoh and verified robot operation.
- Extended the collection path with wrist-camera observations.
- Updated the dataset conversion path for LeRobot v3.
- Collected 30 simulation demonstrations for the selected object.
- Trained an ACT policy with batch size 8, chunk size 50, and 50 action steps.

### In progress

- Resolving deployment and control-rate consistency issues for repeatable ACT inference in simulation.
- Establishing the ACT-only baseline before residual training.
- Defining the PPO observation, reward, termination, and residual-action bounds.

### Planned

- Freeze the ACT policy and train the PPO residual policy.
- Evaluate ACT, ACT with a zero residual, and ACT with a learned residual under identical seeds.
- Run the learned residual policy across three training seeds.
- Analyze success, grasp, placement, collision, drop, and unstable-action failures.

## Evaluation protocol

Each policy will be evaluated with the same initial-condition seeds and without exploration noise. The planned report separates task-level success from the mechanisms behind failure.

| Metric | Purpose |
| --- | --- |
| Task success rate | Primary comparison between the base and residual policies |
| Grasp and place success | Locate the stage where a rollout fails |
| Drop and collision counts | Measure unsafe or unstable correction behavior |
| Episode return and steps | Track learning quality and execution efficiency |
| Residual action norm | Check whether the residual remains a correction rather than replacing ACT |

Results will be added only after the ACT baseline, zero-residual control, and learned-residual evaluations can be reproduced under the same protocol.

## Motivation

Behavior cloning can reproduce demonstrated behavior efficiently, but compounding error may move the robot into states that are poorly represented in the dataset. Residual RL offers a structured way to preserve a useful base policy while learning corrections for interaction dynamics and recovery.

This study is informed by [Residual Reinforcement Learning for Robot Control](https://residualrl.github.io/), while applying the residual-policy idea to an ACT-based manipulation pipeline.