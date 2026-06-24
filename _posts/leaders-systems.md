---
title: Nvidia Omniverse
tags: [Physical AI]
description: Leaders Systems Physical AI Education Day 1.
---

# Nvidia Omniverse

## 전체 구조

```text
OpenUSD
-> Omniverse
-> Isaac Sim
-> Isaac Lab
```

* OpenUSD

  * 3D scene description 포맷 / 데이터 모델
  * 단순 3D 파일 포맷이라기보단, 여러 asset / layer / override를 조합해서 scene을 만드는 구조
  * 협업, 대규모 scene 구성, asset 재사용에 초점

* Omniverse

  * OpenUSD 기반의 산업용 digital twin / AI simulation 플랫폼
  * physical AI simulation을 위한 library + microservice 묶음에 가까운 듯
  * simulation application을 만들기 위한 기반 플랫폼 느낌

* Isaac Sim

  * 시뮬레이터
  * robot, sensor, physics, ROS/ROS2 bridge, synthetic data 등을 다룸

* Isaac Lab

  * Isaac Sim 위에서 RL / IL 학습 돌리기 위한 프레임워크
  * 기존 Isaac Gym -> Isaac Lab

---

## OpenUSD

OpenUSD: 협업에 중점을 둔 3D Scene Description 포맷

`.usd` 파일 하나가 아니라, 여러 파일과 layer를 조합해서 최종 scene을 만드는 시스템.

핵심 키워드:

```text
Stage
Layer
Prim
Property
Composition Arc
Opinion
LIVRPS
```

---

## Stage

Stage는 최종적으로 compose된 scene.

여러 USD 파일, layer, reference, payload 등을 전부 합쳐서 사용자가 보는 최종 scene view.

```text
여러 layer / asset / reference
→ composition
→ Stage
```
실제로 시뮬레이터나 renderer가 보는 scene.

---

## Layer

Layer는 USD scene description의 저장 단위.

하나의 layer 안에 prim, property, metadata 등이 들어갈 수 있음.

e.g.,

```text
base_robot.usd
material_override.usd
sensor_setup.usd
task_scene.usd
```

이런 식으로 여러 layer를 나눠두고, 나중에 합성해서 최종 scene을 만들 수 있음.

USD의 장점
하나의 파일을 직접 수정하는 게 아니라, layer를 쌓아서 override할 수 있음.

---

## Prim

Prim은 USD scene graph의 기본 node.

로봇, 링크, 조인트, 카메라, 조명, 테이블, 물체 등이 전부 prim으로 표현될 수 있음.

```text
/World
/World/Robot
/World/Robot/base_link
/World/Robot/left_arm
/World/Table
/World/Camera
```

---

## Property

Property는 prim이 가지고 있는 실제 데이터.

크게 두 종류.

```text
Attribute
Relationship
```

* Attribute

  * 위치, 회전, 색상, 질량, 속도 같은 값

* Relationship

  * 다른 prim을 가리키는 관계
  * e.g., material binding, target 등

대충 이런 느낌.

```text
/World/Robot.translation
/World/Camera.focalLength
/World/Cube.physics:mass
```

---

## Opinion

USD에서는 여러 layer가 같은 값에 대해 서로 다른 주장을 할 수 있음.

e.g.,

```text
base.usd:
  cube color = red

override.usd:
  cube color = blue
```

이때 각각의 값 주장을 Opinion이라 함.

최종적으로 어떤 opinion이 이기는지는 composition rule에 의해 결정.

Opinion: 어떤 layer나 arc가 특정 prim/property에 대해 주장하는 값

---

## Composition Arc

Composition Arc는 USD scene을 합성하는 방식.

대표적으로:

```text
Local
Inherits
VariantSet
Reference
Payload
Specializes
```

줄여서 LIVRPS (리버피스?)라고 한다 함.

적용 우선순위 순서:

```text
Local
Inherits
VariantSet
Reference
Payload
Specializes
```

요즘은 Relocates까지 포함해서 LIVERPS라고도 하는 듯함, 일단 기본은 LIVRPS.

---

## Local Opinions

Local opinion은 현재 layer stack에 직접 작성된 값.

예를 들어 현재 layer에서 직접:

```text
/World/Cube.size = 2
```

라고 쓰면 이게 local opinion.

그래서 variant에서 값을 바꿔도 local opinion이 더 강해서 안 먹는 경우가 생길 수 있음.
USD 처음 볼 때 헷갈릴 포인트.

---

## Inherits

Inherits는 공통 속성을 여러 prim에 상속시키는 방식.

OOP의 class 상속과 유사.

e.g.,

```text
TreeBase
-> PineTree
-> OakTree
```

공통 material, scale, physics property 같은 걸 base 쪽에 두고 여러 asset이 가져다 쓰는 식.

---

## VariantSet

VariantSet은 하나의 prim에 대해 여러 선택지를 두는 방식.

e.g.,

```text
Robot Variant
- with_gripper
- with_suction
- with_camera
```
or
```text
Material Variant
- metal
- plastic
- rubber
```

하나의 asset을 여러 버전으로 관리하고, scene에서는 그중 하나를 선택하는 구조.


---

## Reference

Reference는 외부 USD asset을 현재 scene에 가져오는 방식.

e.g.,

```text
warehouse.usd
-> robot.usd reference
-> table.usd reference
-> bin.usd reference
```

asset을 모듈화하고 재사용할 때 중요.

---

## Payload

Payload는 Reference랑 비슷한데, 무거운 asset을 필요할 때만 load/unload할 수 있게 하는 방식.

Reference = 외부 asset을 가져옴<br>
Payload   = 외부 asset을 가져오되, 로딩 제어 가능


공장, 창고, 도시 단위 digital twin처럼 scene이 클 때 최적화에 중요하게 쓰임.

---

## Specializes

Specializes는 가장 약한 fallback/default 느낌.

다른 강한 opinion이 없으면 기본값처럼 적용되는 구조인듯 함.

e.g.,

```text
BaseMaterial
-> RoughPlastic specializes BaseMaterial
```

주의: `Specialized`보다는 composition arc 이름으로는 **Specializes**.

---

# Omniverse 구성요소

Omniverse는 OpenUSD만 있는 게 아니라, OpenUSD 기반으로 실제 simulation app을 만들기 위한 여러 구성요소를 포함함.

```text
OpenUSD
-> Omniverse
    - Kit
    - Nucleus
    - Connectors
    - Simulation / PhysX
    - RTX Renderer
-> Isaac Sim
-> Isaac Lab
```

---

## Kit

Kit은 Omniverse application을 만들기 위한 SDK / framework.

Omniverse 앱들은 여러 extension을 조합해서 만들어지는 구조인 듯.

```text
Kit
-> Extension 조합
-> App
```

Isaac Sim도 결국 Kit 기반 application이라고 보면 됨.

---

## Nucleus

Nucleus는 Omniverse의 asset database / collaboration engine.

여러 사람이 같은 USD scene을 공유하거나, 여러 tool에서 같은 asset을 동기화할 때 사용.

다만 개인이 Isaac Sim만 로컬에서 돌리는 수준이면 당장 깊게 안 봐도 될 듯.

상용 배포 단계거나 협업시 사용?

---

## Connectors

Connectors는 외부 툴과 Omniverse/OpenUSD를 연결하는 것.

예:

```text
Maya
Blender
Unreal
Revit
CAD
```

기존 3D/CAD tool에서 만든 데이터를 USD로 가져오거나, Omniverse와 연결하는 통로.

---

## RTX Renderer

RTX Renderer는 Omniverse의 rendering 쪽.

단순히 예쁜 화면용만은 아님.

로봇 시뮬레이션에서는:

```text
camera sensor simulation
synthetic data generation
domain randomization
material / lighting variation
```

이런 쪽과 연결됨.

특히 vision 기반 robot learning이면 렌더링 품질도 꽤 중요해질 수 있음.

---

## Simulation / PhysX

물리 시뮬레이션 계층.

```text
rigid body
collision
joint
articulation
sensor
physics material
```

이런 것 담당.

OpenUSD scene 위에 물리 속성을 붙이고, 그걸 시뮬레이션하는 구조.

---

# Isaac Sim

Isaac Sim은 Omniverse 기반 로봇 시뮬레이터.

Omniverse가 범용 digital twin / simulation 플랫폼이라면, Isaac Sim은 그중에서 로봇에 특화된 버전.

주요 기능:

```text
URDF / MJCF import
robot articulation
joint control
physics simulation
camera / LiDAR / IMU sensor
ROS / ROS2 bridge
synthetic data generation
software-in-the-loop testing
hardware-in-the-loop testing
```

로봇을 ROS와 연결해서 테스트하려면 Isaac Sim을 쓰는 게 맞음.

정리하면:

```text
로봇 필요 없음
→ Omniverse / OpenUSD / Kit 중심

로봇 필요함
→ Isaac Sim

로봇 학습까지 필요함
→ Isaac Lab
```

---

# Isaac Gym → Isaac Lab

Isaac Gym은 예전 NVIDIA의 GPU 기반 RL용 simulator.

GPU 위에서 physics simulation과 policy training을 같이 돌려서 빠른 병렬 학습을 가능하게 한 게 핵심.

그런데 현재는 Isaac Gym 계열이 Isaac Lab으로 넘어왔다고 보면 됨.

대략:

```text
Isaac Gym
IsaacGymEnvs
OmniIsaacGymEnvs
Orbit
→ Isaac Lab
```

즉, 새로 시작한다면 Isaac Gym을 직접 파기보다는 Isaac Lab으로 가는 게 맞음.

---

# Isaac Lab

Isaac Lab은 Isaac Sim 기반 robot learning framework.


```text
RL environment 구성
IL / demonstration collection
domain randomization
parallel environment training
actuator model
sensor observation 구성
policy training
sim-to-real 실험
```

```text
Isaac Sim = 로봇이 움직이는 시뮬레이션 월드
Isaac Lab = 그 월드에서 policy를 학습시키는 프레임워크
```

---

# 내 목적 기준 정리

내가 하려는 건 단순히 3D scene을 만드는 게 아니라:

```text
robot setup
ROS 사용
kinematics / control
simulation
imitation learning
RL
sim-to-real 가능성 확인
```

이쪽임.

그러면 Omniverse 자체를 깊게 파기보다는, 실습 진입점은 Isaac Sim + Isaac Lab이 맞는 듯.

OpenUSD / Omniverse는 배경지식으로 가져가고, 실제 프로젝트는 아래 순서가 자연스러움.

```text
1. Isaac Sim 설치
2. 기본 robot 불러오기
3. URDF / MJCF import 확인
4. ROS2 bridge 연결
5. 간단한 pick-and-place scene 구성
6. camera / joint / action interface 확인
7. Isaac Lab에서 task 환경 구성
8. RL 또는 IL 실험
```
