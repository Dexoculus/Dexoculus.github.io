---
name: GELLO WebUI for Robot Learning Workflows
tools: [GELLO, UR5, FastAPI, Next.js, LeRobot, Python, TypeScript]
featured: true
featured_order: 3
description: A browser-based operational layer that unifies robot teleoperation, demonstration review, and learned-policy deployment.
---

## Overview

GELLO WebUI is a full-stack interface for operating a UR5 robot-learning workflow from a browser. It brings practice, demonstration collection, dataset review, and policy deployment into one application rather than exposing each stage as a separate command-line process.

The system combines a FastAPI backend for hardware and model services with a Next.js frontend for operator interaction, live camera views, status monitoring, and dataset inspection.

## Problem

A robot-learning experiment crosses several operational boundaries:

- connecting the robot, GELLO leader, and cameras;
- practicing before recording;
- starting, stopping, discarding, and finalizing episodes;
- reviewing collected trajectories;
- selecting a trained checkpoint;
- starting and stopping physical inference safely.

When these operations are spread across scripts, it is easy for configuration and state to drift between collection and deployment. The WebUI provides a shared state model and a single operational entry point.

## Architecture

~~~mermaid
flowchart LR
    L["launch_ui.py"] --> B["FastAPI backend"]
    L --> F["Next.js frontend"]
    F -->|"REST and MJPEG"| B
    B --> T["Teleoperation service"]
    B --> C["Curation service"]
    B --> D["Deployment service"]
    T --> H["UR5, GELLO, cameras"]
    C --> DS["LeRobot datasets"]
    D --> P["ACT and other policy checkpoints"]
~~~

A single Python launcher starts the backend, waits for its health check, starts the frontend, and monitors both processes. The frontend uses same-origin API requests, which Next.js proxies to FastAPI.

## Workflow modules

### Practice and collection

The teleoperation module connects the UR5, GELLO leader, and cameras; provides live MJPEG streams; and manages practice or recording sessions. Operators can stop and save an episode, discard it, or finalize the dataset.

### Dataset review

The curation module lists local datasets and episodes, streams recorded camera views, and stores review metadata such as scores and tags separately from the underlying training data.

### Policy deployment

The deployment module discovers available models and checkpoints, loads the selected policy, exposes live inference state, and provides explicit start, stop, home, and disconnect operations.

## Reliability decisions

- A teleoperation state machine separates idle, warm-up, recording, saving, and error states.
- Shared state is guarded while the recording loop runs in a background thread.
- Invalid state transitions return explicit HTTP errors.
- Hardware and inference failures are surfaced to the UI instead of remaining only in terminal logs.
- High-frequency status endpoints are separated from control operations.
- The launcher performs backend health checks before exposing the frontend workflow.

## My contributions

- Structured the application into teleoperation, curation, and deployment domains.
- Integrated UR5, GELLO, camera streaming, LeRobot data, and policy inference behind FastAPI services.
- Built the browser workflow with Next.js and reusable operator components.
- Implemented a single-command launcher and cross-process health monitoring.
- Documented the architecture so the backend/frontend pattern can be reused for other robot platforms.

## Scope and limitations

The current application is intended for a controlled local robotics network. Its polling-based status path and permissive development CORS settings should be replaced with authenticated, production-oriented networking before remote or multi-user deployment.

## Related note

See [GELLO WebUI Architecture and Setup](/note/gello-webui-architecture-and-setup/) for installation, launch, service boundaries, and operational endpoints.