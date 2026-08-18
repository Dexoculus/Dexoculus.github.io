---
title: GELLO WebUI Architecture and Setup
description: Installation and architecture guide for a FastAPI and Next.js interface covering GELLO teleoperation, LeRobot dataset review, and policy deployment.
tags: [GELLO, UR5, FastAPI, Next.js, LeRobot, Robotics]
featured: false
---

# GELLO WebUI Architecture and Setup

This note describes the local development setup and service boundaries of a browser-based interface for GELLO teleoperation, dataset review, and learned-policy deployment.

## Prerequisites

- Python 3.12
- uv
- Node.js 24
- npm
- a supported PyTorch/CUDA environment when GPU inference is required
- UR5, GELLO, and camera drivers for hardware operation

Keep CUDA and PyTorch versions aligned with the workstation driver rather than copying a wheel index without checking compatibility.

## Python environment

From the project root:

~~~bash
uv venv --python 3.12
~~~

Activate it when interactive inspection is needed:

~~~bash
# Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\activate
~~~

Install the application and hardware dependencies:

~~~bash
uv pip install -r requirements.txt
uv pip install -e .
uv pip install -e third_party/DynamixelSDK/python
~~~

Install the project's required LeRobot and CUDA-enabled PyTorch versions according to its lock file or environment specification.

## Frontend environment

Install Node.js and then install the frontend dependencies:

~~~bash
cd frontend
npm install
cd ..
~~~

## Launch

The launcher starts FastAPI and Next.js together:

~~~bash
uv run launch_ui.py
~~~

With another Python environment manager:

~~~bash
python launch_ui.py
~~~

Open http://127.0.0.1:3000/. FastAPI documentation is available locally at http://127.0.0.1:8000/docs.

## Process model

~~~mermaid
sequenceDiagram
    participant L as Launcher
    participant B as FastAPI
    participant F as Next.js
    L->>B: Start backend
    L->>B: Poll health check
    B-->>L: 200 OK
    L->>F: Start frontend
    loop Watchdog
        L->>B: Check process
        L->>F: Check process
    end
~~~

The frontend sends same-origin API requests. Next.js rewrites them to the FastAPI service, while camera feeds use MJPEG streams that browsers can render directly.

## Backend domains

### Teleoperation

Typical operations include:

- connect the robot, GELLO leader, and cameras;
- enter practice mode;
- start, stop, or discard an episode;
- finalize a LeRobot dataset;
- inspect joints, frame count, and connection state;
- stream camera images.

### Curation

The review service exposes dataset and episode metadata, recorded camera streams, and separate curation metadata such as tags, notes, and quality scores.

### Deployment

The deployment service discovers checkpoints, loads a selected policy, starts or stops inference, returns the robot home, and reports inference state and rate.

## Teleoperation state machine

~~~mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Warmup: start
    Warmup --> Recording: ready
    Warmup --> Error: hardware failure
    Recording --> Saving: stop
    Recording --> Idle: discard
    Saving --> Idle: saved
    Error --> Idle: reset
~~~

Explicit states prevent save, discard, or disconnect operations from running against an invalid hardware state.

## Operational checks

Before collecting data:

1. Confirm that the backend health endpoint responds.
2. Verify the selected robot address and camera list.
3. Check that practice mode moves the intended joints.
4. Confirm camera orientation and frame rate.
5. Record and discard a short test episode.
6. Reopen the saved episode through the review page.
7. Only then begin the full collection session.

Before deployment:

1. Confirm that observation keys match the training dataset.
2. Verify state and action ordering.
3. Check normalization statistics and checkpoint type.
4. Test home and stop operations before inference.
5. Keep the physical emergency stop accessible.

## Development limitations

The documented configuration is for a trusted local development network. Permissive CORS, unauthenticated control routes, and automatic development-server behavior are not appropriate for an internet-exposed robot.

## Related project

See [GELLO WebUI for Robot Learning Workflows](/projects/gello-webui-for-robot-learning-workflows/) for the project-level motivation, architecture, and contributions.