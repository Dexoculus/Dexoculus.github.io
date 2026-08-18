---
title: Designing Demonstration Datasets for ACT
description: Practical findings on dataset coverage, action horizons, recovery examples, camera consistency, and checkpoint selection from real-world ACT experiments.
tags: [Robot Learning, Imitation Learning, ACT, LeRobot, GELLO, UR5]
featured: false
---

# Designing Demonstration Datasets for ACT

Real-world behavior cloning often fails for reasons that are not visible in the training loss. These notes summarize recurring findings from single-arm ACT experiments involving sequential assembly, a moving conveyor, and contact-rich packing.

The observations are specific to the tested tasks and should be treated as experimental guidance rather than universal thresholds.

## 1. Preserve the full task sequence

In a two-stage gear-assembly task, adding demonstrations of only the first stage improved coverage but did not reliably teach the policy to continue into the second stage.

| Dataset | Total episodes | Composition |
| --- | ---: | --- |
| D-1 | 394 | 100 horizontal + 294 vertical |
| D-2 | 294 | 100 horizontal + 194 vertical |
| D-3 | 200 | 100 horizontal + 100 vertical |
| D-4 | 100 | 50 horizontal + 50 vertical |

In these runs, datasets containing at least 200 full-sequence examples completed the two-stage behavior more reliably. Partial trajectories were useful as supplements, not replacements for end-to-end demonstrations.

## 2. Use targeted edge-case data

Adding 20 demonstrations of a specific edge case produced the desired response for that tested configuration. This suggests that local coverage gaps can sometimes be repaired without recollecting the entire dataset.

However, the 5- and 10-example conditions were not evaluated, so 20 should not be interpreted as a general minimum.

## 3. Demonstration style becomes policy behavior

The policy reproduced details that were incidental to task success:

- recovery-heavy trajectories encouraged early gripper closure;
- continuous object tracking in demonstrations encouraged tracking at deployment;
- fixed place positions produced poor response when the target area moved.

Before collecting more data, decide which behaviors should actually be imitated. Recovery examples may need their own labels, sampling strategy, or policy stage rather than being mixed indiscriminately with nominal demonstrations.

## 4. Observation consistency comes before scale

A conveyor experiment initially failed more often at the center and left side. Inspection showed that the camera view did not cover the conveyor consistently. The dataset was recollected after adjusting the view.

Recommended pre-collection checks:

- rigidly fix camera brackets;
- record camera pose and field of view;
- confirm visibility at every planned object position;
- keep observation keys and image orientation identical across collection and deployment;
- run a short deployment test before scaling collection.

## 5. Tune the action horizon for task dynamics

For a moving conveyor target, an ACT chunk size of 25 responded more effectively than 50 in the initial trials. A longer open-loop segment delayed correction, while overly frequent replanning could reduce motion precision in the static assembly task.

Chunk size and executed action steps should therefore be selected against task dynamics, not copied from a default configuration.

## 6. Evaluate checkpoints, not only the final step

In one set of conveyor edge cases, the 100k-step checkpoint behaved more reliably than the 300k-step checkpoint. The observation is consistent with overfitting, but it does not by itself prove mode collapse or identify a single causal mechanism.

A safer selection procedure is to evaluate fixed checkpoints on the same scenarios and log:

- task and subtask success;
- failure category;
- grasp and place timing;
- collision or drop events;
- behavior on unseen layouts.

## 7. Separate perception from contact robustness

In a three-color pick-and-place experiment, the policy often moved toward objects in unseen arrangements, suggesting that it recognized the target, but grasp success degraded outside the demonstrated spatial range. In the shoe-packing experiment, success also fell as bundle geometry and compliance changed.

These cases distinguish visual localization from manipulation robustness: reaching the correct region does not guarantee a successful grasp, insertion, or release.

## Practical collection loop

1. Define task success and failure categories.
2. Collect a small but spatially balanced pilot dataset.
3. Train and deploy early.
4. Attribute failures to observation, timing, data coverage, or contact.
5. Add only the demonstrations needed to test that diagnosis.
6. Compare checkpoints and configurations under the same test cases.
7. Preserve successful and failed rollout videos alongside the experiment record.

## Related project

See [Single-Arm Imitation Learning for Dynamic Assembly](/projects/single-arm-imitation-learning-for-dynamic-assembly/) for the project-level system and experiment record.