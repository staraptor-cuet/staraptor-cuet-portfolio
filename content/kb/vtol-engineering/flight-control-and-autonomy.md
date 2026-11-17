---
title: "Flight control, estimation and autonomy (in depth)"
topic: vtol-engineering
competition: none
source_url: https://ardupilot.org/plane/docs/flight-modes.html
last_verified: 2026-11-13
owner: research-team
visibility: public
---

## Control loops and PID control in plain words

A control loop is a repeating cycle. The autopilot measures what the aircraft is doing, compares it with what it should be doing (the "demand" or "setpoint"), and moves the motors or control surfaces to shrink the difference (the "error"). In ArduPilot Plane's tuning guide, nav_roll is the roll demand and roll is the measured response, and the two are compared.

Most autopilot loops use some form of PID control. PID stands for Proportional, Integral, Derivative. Each term is a "gain" that sets how strongly the loop reacts:

| Term | ArduPilot Plane example | What it does |
|---|---|---|
| P (proportional) | RLL2SRV_P, PTCH2SRV_P | The main gain. Too low gives a slow response. Too high causes oscillation or overshoot. |
| I (integral) | RLL2SRV_I, PTCH2SRV_I | Removes a steady offset between demand and response. IMAX limits how much aileron (in centi-degrees) the integrator can control. |
| D (derivative) | RLL2SRV_D, PTCH2SRV_D | Adds damping, which means it slows oscillations down. |

PX4 uses the same idea in a "cascade", which is a chain of loops one inside the other. For a multicopter, the PX4 documentation describes a position P controller that commands a velocity, a velocity PID controller that commands an acceleration, an attitude P controller, and an inner rate controller (K-PID type). The rate controller works on how fast the aircraft rotates.

Source: https://ardupilot.org/plane/docs/roll-pitch-controller-tuning.html ; https://docs.px4.io/main/en/flight_stack/controller_diagrams

## How the autopilot estimates attitude and position (EKF)

The autopilot cannot see the aircraft directly. It must estimate its position, velocity and orientation from sensors. ArduPilot does this with an Extended Kalman Filter (EKF). An EKF is a mathematical method that combines many noisy measurements into one best estimate.

According to the ArduPilot documentation, the EKF uses:

- rate gyroscopes (measure rotation speed),
- accelerometers (measure acceleration),
- compass (measures heading from the Earth's magnetic field),
- GPS (measures position and velocity),
- airspeed sensor,
- barometer (measures air pressure, which gives altitude).

It can also use optional sensors such as optical flow and laser rangefinders.

Because the EKF fuses all available measurements, it is better able to reject measurements with significant errors, so one faulty sensor affects the aircraft less.

ArduPilot recommends EKF3, which is now the default. Autopilots with 1 MB of memory support only EKF3. Each IMU (inertial measurement unit, holding gyros and accelerometers) gets its own EKF "core", so two IMUs can run two cores in parallel. Only the core reporting the best health is used at any moment. EK3_IMU_MASK selects which IMUs are used: 1 uses the first IMU, 2 only the second, and 3 runs two cores.

Source: https://ardupilot.org/copter/docs/common-apm-navigation-extended-kalman-filter-overview.html

## EKF failure behaviour

An EKF can become unhealthy. This can happen if sensor data is inconsistent, or if the EKF stops using GPS even though the GPS reports a 3D lock. ArduPilot has defined fallbacks for this case.

- In Plane and Rover, ArduPilot falls back from the EKF to DCM, a simpler attitude estimator.
- There is no fallback from EKF3 to EKF2.

QuadPlane (ArduPilot's quadplane VTOL firmware) has its own EKF failsafe rules for VTOL modes:

- In AUTO mode while flying in a VTOL mode, an EKF failure switches the aircraft to QLAND, which is a vertical landing.
- In the position-controlled VTOL modes QLOITER, QRTL, QLAND and QAUTOTUNE, it switches to QHOVER. In QHOVER, the throttle stick sets climb or descent rate.

Position-holding modes depend on a good position estimate, so without one the aircraft is moved to a mode that does not hold position.

Source: https://ardupilot.org/copter/docs/common-apm-navigation-extended-kalman-filter-overview.html ; https://ardupilot.org/plane/docs/quadplane-flying.html

## Fixed-wing flight modes in ArduPilot Plane

A flight mode is a setting that decides how much of the flying the autopilot does and how much the pilot does. ArduPilot Plane gives these short descriptions:

| Mode | What it does |
|---|---|
| MANUAL | Stick movements pass straight to the control surfaces (passthrough). |
| FBWA (Fly-By-Wire A) | Roll and pitch follow stick input, up to set limits. |
| FBWB | Like FBWA, but with automatic height and speed control. |
| CRUISE | Like FBWB, but also tracks the ground course (direction over the ground). |
| AUTO | Follows the uploaded mission. |
| RTL (Return To Launch) | Returns to and circles home or a rally point. |
| LOITER | Circles the point where the mode was selected. |
| CIRCLE | Turns the aircraft gently. |
| GUIDED | Circles a point chosen from the ground control station. |
| TAKEOFF | Takes off automatically to a set altitude, then loiters at a distance from takeoff until the mode is changed. |
| AUTOTUNE | Like FBWA, but learns attitude tuning while flying. |

The VTOL (Q) modes are described in the QuadPlane documentation.

Source: https://ardupilot.org/plane/docs/flight-modes.html

## VTOL (Q) flight modes in ArduPilot QuadPlane

QuadPlane modes start with "Q". They use the lifting motors like a multicopter. The ArduPilot QuadPlane documentation includes these:

- **QHOVER**: the throttle stick sets climb or descent rate. Mid-stick holds altitude.
- **QLOITER**: holds position. The pilot repositions the aircraft with the pitch and roll sticks.
- **QSTABILIZE** and **QACRO**: other pilot-controlled VTOL modes.
- **QLAND**: vertical landing mode.
- **QRTL**: return and vertical landing mode.

With Q_RTL_MODE = 1, a failsafe RTL transitions to QRTL and lands at the rally point or home. With Q_RTL_MODE = 2, the aircraft makes a fixed-wing approach, loiters down to altitude, and then performs a QRTL.

QAUTOTUNE (mode number 22) tunes the VTOL controller automatically. The ArduPilot page marks QAUTOTUNE as deprecated. It is available only in custom firmware builds, and the page points users to VTOL QUICKTUNE instead.

In the documentation's typical test flight, the pilot sets throttle back to about 50% for hover after switching to QHOVER.

Source: https://ardupilot.org/plane/docs/quadplane-flying.html ; https://ardupilot.org/plane/docs/qautotune-mode.html

## Airspeed and altitude control with TECS

In fixed-wing flight, ArduPilot uses TECS (Total Energy Control System) to control height and airspeed together. TECS treats flight as an energy problem:

- **Potential energy** = mass × gravity × height.
- **Kinetic energy** = ½ × mass × speed².
- Drag constantly removes energy, and thrust must replace it.

TECS splits the job between two controls:

- **Throttle keeps the total energy at the demanded level**, offsetting drag.
- **Pitch shifts energy between height and speed.** Lowering the nose trades height for speed. Raising it trades speed for height.

Important parameters:

| Parameter | Meaning |
|---|---|
| TECS_SPDWEIGHT | 0.0 means pitch controls height and ignores speed. 1.0 (default) weighs height and speed equally. 2.0 means pitch controls speed only (used for gliders). |
| TECS_CLMB_MAX | Best climb rate (m/s) the aircraft can achieve at THR_MAX and cruise airspeed. |
| TECS_SINK_MIN / TECS_SINK_MAX | Sink rate with throttle at THR_MIN at cruise speed / steepest descent rate the controller will use. Too large a maximum can cause over-speed on descent. |
| TECS_TIME_CONST | Response speed in seconds. Smaller is faster; larger is slower. |
| AIRSPEED_MIN / AIRSPEED_CRUISE / AIRSPEED_MAX | The speed range TECS works within. |

Without an airspeed sensor, pitch controls height entirely and throttle is derived from the demanded pitch. ArduPilot and PX4 both advise tuning the pitch (attitude) loop before tuning TECS.

Source: https://ardupilot.org/plane/docs/tecs-total-energy-control-system-for-speed-height-tuning-guide.html ; https://docs.px4.io/main/en/flight_stack/controller_diagrams

## Path following with the L1 controller

To follow a line between waypoints or fly a loiter circle, ArduPilot Plane uses the L1 navigation controller. The L1 controller was introduced in Plane 2.72.

Tuning mostly uses one parameter, NAVL1_PERIOD:

- A lower NAVL1_PERIOD makes navigation more aggressive, with sharper corners.
- A higher NAVL1_PERIOD makes navigation gentler.
- If turns are too slow, the guide says to reduce it by 5.
- If the plane weaves after a turn, the guide says to increase it by 1 or 2.

The ArduPilot page gives two different default values, 20 and 17, in different places. Check the parameter list for your firmware version.

A second parameter, NAVL1_DAMPING, has a default of 0.75. The guide suggests changing it in steps of 0.05 when tuning for maximum performance, and says a value below 0.6 is unlikely to be needed.

Source: https://ardupilot.org/plane/docs/navigation-tuning.html

## Transitions between hover and forward flight

A transition is the change between VTOL flight (lift from rotors) and fixed-wing flight (lift from the wing). In ArduPilot QuadPlane, a forward transition starts when a fixed-wing mode is selected.

**Forward transition (VTOL to fixed wing):**

1. If the new mode is MANUAL or ACRO, the VTOL motors stop at once. ArduPilot warns that too low an airspeed then causes an immediate stall.
2. In other fixed-wing modes, the VTOL motors keep providing lift until airspeed reaches AIRSPEED_MIN (or the airspeed estimate, without a sensor).
3. After that, VTOL power fades out over Q_TRANSITION_MS. The default is 5000 ms (5 s).

Q_TRANS_FAIL sets a time limit for reaching AIRSPEED_MIN. The default is 0, which means no limit. If it is set and the limit is exceeded, the transition is cancelled and the action in Q_TRANS_FAIL_ACT runs.

**Back transition (fixed wing to VTOL):** By default the forward motor stops in VTOL modes, unless Q_VFWD_GAIN is nonzero. When changing to a position-holding mode such as QLOITER, pitch is limited to 0 degrees at first, and the limit is relaxed over Q_BACKTRANS_MS. ArduPilot warns that transitions can draw very high current, and BATT_WATT_MAX can limit power.

Source: https://ardupilot.org/plane/docs/quadplane-transitions.html

## Assisted fixed-wing flight (Q_ASSIST)

Q_ASSIST lets the VTOL motors help a QuadPlane while it flies as a fixed-wing aircraft, for stability and lift.

| Parameter | Meaning |
|---|---|
| Q_ASSIST_SPEED | If airspeed drops below this value, the VTOL motors help with lift and stability. The default is 0, which causes a pre-arm warning. A value of -1 turns assistance off and removes the warning. |
| Q_ASSIST_ANGLE | Attitude error in degrees. Above this, assistance starts even at a good airspeed. |
| Q_ASSIST_ALT | Height above ground. Below this, assistance starts if the VTOL motors are not already running. 0 turns this off. |
| Q_ASSIST_DELAY | Delay before assistance starts after a threshold is crossed. |

The angle and altitude triggers work only when Q_ASSIST_SPEED is positive.

Assistance is never given in MANUAL, ACRO or TRAINING modes. An RC switch with RCx_OPTION = 82 can force assistance off (below 1200 µs) or on (above 1800 µs).

When airspeed reaches AIRSPEED_MIN (or Q_ASSIST_SPEED, if higher), the QuadPlane flying guide says the motor help fades out over 5 seconds. After that, the aircraft flies purely as a fixed wing.

Source: https://ardupilot.org/plane/docs/assisted_fixed_wing_flight.html ; https://ardupilot.org/plane/docs/quadplane-flying.html

## Tuning with AUTOTUNE

Tuning means choosing the controller gains so that the aircraft responds quickly without oscillating. ArduPilot recommends AUTOTUNE where possible for fixed-wing roll and pitch.

**How AUTOTUNE works:** The aircraft flies like FBWA. The pilot makes sharp, rapid stick movements. The autopilot watches the response and adjusts the FF, P, I and D values. Without a ground station or OSD (on-screen display) to monitor the tune, the documentation advises at least 20 rapid movements per axis, preferably more. Stopping before all axes finish can leave the aircraft flying poorly.

**AUTOTUNE_LEVEL** sets how sharp the tune is. Each level has a maximum target rate:

| Level | 1 | 2 | 3 | 4 | 5 | 6 (default) | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Rate (deg/s) | 20 | 30 | 40 | 50 | 60 | 75 | 90 | 120 | 160 | 210 | 300 |

ArduPilot calls level 6 a medium tune for beginner to intermediate pilots. It does not recommend levels above 7 until a first tune has been done at a lower level.

P and D are saved when an axis finishes. FF and I are saved when the pilot leaves AUTOTUNE. Leaving partway through an axis restores that axis's original values.

Source: https://ardupilot.org/plane/docs/automatic-tuning-with-autotune.html

## Why tuning is done step by step

ArduPilot's manual tuning guide (archived for firmware 4.1 and earlier) changes one gain at a time in small steps:

1. **Before tuning:** the aircraft should be trimmed, with radio calibration, airspeed calibration and levelling done, and the HUD should match the model's motion.
2. **Roll:** raise RLL2SRV_P in 0.1 steps. Raise D in 0.01 steps until oscillation appears, then halve it. Raise I in 0.05 steps until overshoot or oscillation, then halve it.
3. **Pitch:** tune PTCH2SRV_P, D and I the same way. Adjust PTCH2SRV_RLL (default 1.0) in small steps so the aircraft holds height in banked turns; values outside 0.7 to 1.4 suggest another problem.
4. **Yaw damper:** tune it after roll and pitch.
5. **Sideslip controller:** only after the yaw damper.

Order matters because outer loops depend on inner loops. TECS performs well only when the pitch loop is already tuned.

For the VTOL side, QAUTOTUNE commonly took 3 to 5 minutes per axis. To save the gains, the pilot had to land while still in QAUTOTUNE and disarm without changing mode. Changing mode stopped the tune immediately.

Source: https://ardupilot.org/plane/docs/roll-pitch-controller-tuning.html ; https://ardupilot.org/plane/docs/qautotune-mode.html ; https://ardupilot.org/plane/docs/tecs-total-energy-control-system-for-speed-height-tuning-guide.html

## Pre-arm checks and arming

**Arming** turns on the motors. Until a plane is armed, the throttle does nothing.

ArduPilot Plane can be armed in three ways:

- hold the rudder stick fully right with throttle fully down for 3 seconds,
- press the arm button in the ground control station,
- use an RC switch set with RCx_OPTION.

Plane will not arm in RTL, QRTL or QLAND. After landing, it disarms by itself after 20 seconds on the ground. LAND_DISARMDELAY controls this delay. Disarming is unconditional: if done in flight, all motors disarm.

**Pre-arm checks** are built-in tests that block arming if something is wrong. Examples:

- "GPS x: Bad fix": the GPS does not have a good lock.
- "Compasses inconsistent": two compasses disagree.
- "3D Accel calibration needed": the accelerometers are not calibrated.
- "RC not calibrated": the radio is not calibrated.
- "Battery below minimum arming voltage": the battery voltage is below BATT_ARM_VOLT.

The first failed check is shown in red on the ground station HUD. ARMING_SKIPCHK can skip checks, but ArduPilot says never to disable arming checks except for bench testing, and to fix the cause first.

Source: https://ardupilot.org/plane/docs/arming-your-plane.html ; https://ardupilot.org/plane/docs/common-prearm-safety-checks.html

## Mission planning workflow and the MAVLink mission protocol

A mission is a list of numbered commands, such as waypoints, loiters and landings, that the autopilot runs in AUTO mode. The upload uses the MAVLink mission protocol. MAVLink is the message standard that ground stations and autopilots use to talk to each other.

1. The ground station sends MISSION_COUNT with the number of items.
2. The vehicle asks for each item in turn with MISSION_REQUEST_INT.
3. The ground station replies with MISSION_ITEM_INT.
4. After the last item, the vehicle sends MISSION_ACK.

A new mission should be fully uploaded and accepted before the old one is replaced. The protocol handles three separate plan types: the flight mission, the geofence and the rally points. Latitude and longitude are sent as whole numbers equal to degrees × 10^7 (for example, 69.69 becomes 696900000). The default timeout is 1500 ms for general responses and 250 ms for plan items, with up to 5 retries. During flight, MISSION_CURRENT and MISSION_ITEM_REACHED report progress.

Source: https://mavlink.io/en/services/mission.html

## Simulation: SITL and hardware-in-the-loop

**SITL (Software In The Loop)** runs ArduPilot as a native program on an ordinary computer, with no flight hardware. A built-in physics model for each vehicle type supplies simulated sensor data, and optional simulated sensors include lidars and optical flow sensors. External simulators can replace the built-in physics, for example JSBSim, Gazebo or Webots.

The SITL helper script sim_vehicle.py starts MAVProxy, a command-line ground station. MAVProxy forwards MAVLink to ground stations on UDP port 14550. Extra serial ports (TCP 5762 and 5763) can connect another ground station, a companion computer or a simulated peripheral.

PX4 defines two kinds of simulation:

- **SITL:** the flight stack runs on a computer.
- **HITL (Hardware In The Loop):** simulation firmware runs on a real flight controller board.

PX4 recommends Gazebo for new projects and also offers SIH, a lightweight simulator that runs inside PX4.

**Why simulate first:** PX4 calls simulation a quick, easy and safe way to test changes before flying a real vehicle.

Source: https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html ; https://docs.px4.io/main/en/simulation/

## Flight logs and what they are used for

ArduPilot records "dataflash" logs. They are stored on an SD card or a dataflash chip, or streamed over a high-speed MAVLink telemetry port (typically 921600 baud). By default, logs are created after the first arming.

Each log contains:

- the software version and board type,
- the parameter values at the start of the flight,
- flight data such as GPS and IMU.

LOG_BITMASK chooses which messages are recorded.

Logs can be downloaded in Mission Planner with "Download DataFlash Log Via Mavlink". Mission Planner's "Review a Log" tool can then graph and filter the data. MAVExplorer, part of MAVProxy, is another analysis tool.

Uses described by ArduPilot include replaying logs to check fixes for EKF/AHRS issues, and pausing or resuming logging with an RC switch during tuning. The roll tuning guide compares demanded roll (nav_roll) with actual roll. During transitions, the airspeed used is logged as CTUN.As.

Source: https://ardupilot.org/plane/docs/common-downloading-and-analyzing-data-logs-in-mission-planner.html ; https://ardupilot.org/plane/docs/quadplane-transitions.html ; https://ardupilot.org/plane/docs/roll-pitch-controller-tuning.html

## RTK GPS and why precision matters

RTK (Real-Time Kinematics) improves GPS accuracy by sending the aircraft's GPS receiver live correction data. ArduPilot gives these accuracy figures:

| Setup | Accuracy |
|---|---|
| Normal GPS (u-blox M8N) | 3–5 m |
| With SBAS, where available | about 1 m |
| F9P receiver with RTK corrections | centimetre level |

**Base station:** The corrections come from a fixed GPS. If its location is not known, it does a "survey-in", averaging its own position. u-blox suggests 5 m or less, 2 m is common, and the survey usually runs for 60 seconds at the target accuracy.

**Corrections:** The correction data is RTCM data. It can reach the aircraft in three ways:

- from a local base station through the ground station over MAVLink,
- from an internet NTRIP service through the ground station,
- by radio directly to the aircraft's GPS.

NTRIP accuracy falls by roughly 1–1.5 cm for each 10 km of distance. A base within about 100 km should be used.

The receiver reports "RTK float" while it uses corrections without full precision, and "RTK fixed" at the highest precision.

Source: https://ardupilot.org/plane/docs/common-rtk-correction.html

## Companion-computer control paths

A companion computer is a second onboard computer that works alongside the autopilot. ArduPilot says it connects to the autopilot using MAVLink and receives data such as GPS position for onboard decisions, for example triggering a camera at set coordinates. It can also preprocess data from advanced sensors and control lights or auxiliary servos. ArduPilot lists software including MAVSDK, DroneKit, Pymavlink, BlueOS and Rpanion-server.

- **MAVSDK** is a collection of libraries for MAVLink systems. It gives access to telemetry and lets a program control missions and movement. It is written mainly in C++, with production wrappers for Swift, Python and Java.
- **MAVROS** is the ROS package that connects ROS to ArduPilot. ArduPilot's example launches it with an fcu_url and uses its utilities to set the mode and arm.
- **ROS 2:** ArduPilot says ROS can extend the autopilot with technologies that run on more powerful computers. It asks users to make sure the vehicle works well in modes such as GUIDED and AUTO first.

In PX4, **Offboard mode** lets an external computer send position, velocity or attitude setpoints. PX4 needs a continuous stream of about 2 Hz. If the stream stops for longer than COM_OF_LOSS_T, PX4 leaves Offboard mode and runs a failsafe. Fixed-wing aircraft need position setpoints.

Source: https://ardupilot.org/dev/docs/companion-computers.html ; https://mavsdk.mavlink.io/main/en/index.html ; https://ardupilot.org/dev/docs/ros-connecting.html ; https://ardupilot.org/dev/docs/ros2.html ; https://docs.px4.io/main/en/flight_modes/offboard

## Lua scripting on the autopilot

ArduPilot can run small programs written in the Lua language on the flight controller. Several scripts can run at once. They can monitor and change the vehicle state, execute MAVLink commands and talk to DroneCAN devices. Each script runs in its own "sandbox", a protected environment with a fixed budget of instructions per run. Scripts run at low priority, so they are not guaranteed to run on a reliable schedule.

**Setup:**

- Set SCR_ENABLE = 1, then refresh or reboot.
- Copy .lua files to the APM/scripts folder on the SD card.
- The autopilot needs at least 2 MB of flash memory and about 80 kB of RAM. Scripting is not available on F4-based boards.

ArduPilot publishes sample scripts for Plane, Copter and Rover, plus "applets" (ready-made scripts) and "drivers" (scripts that support new peripherals).

**Warnings:** If scripts run out of memory or panic, all scripts stop. If this happens before arming, a pre-arm failure is raised. Setting SCR_HEAP_SIZE too high can stop other features, such as the EKF, from starting. Checksum checks (SCR_LD_CHECKSUM, SCR_RUN_CHECKSUM) can block arming if a script is missing or changed.

Source: https://ardupilot.org/plane/docs/common-lua-scripts.html

## Common autonomy tasks built from mission commands

Many student UAV competitions ask for tasks like the ones below. Each can be built from documented ArduPilot Plane mission commands. Competition rules differ, so check the rulebook of the specific event.

| Task | Mission commands | Key parameters |
|---|---|---|
| Vertical take-off | NAV_VTOL_TAKEOFF | Target altitude, by default as a climb above the current altitude. |
| Switch to wing-borne flight | DO_VTOL_TRANSITION | Param1 = 4 for fixed wing, 3 for VTOL. |
| Waypoint laps | NAV_WAYPOINT plus DO_JUMP | Param2 of NAV_WAYPOINT is the acceptance radius in metres. DO_JUMP repeats a section a set number of times (-1 = forever). A mission allows up to 15 jump commands. |
| Loiter circles | NAV_LOITER_TURNS or NAV_LOITER_TIME | Number of turns or seconds. A negative value flies counter-clockwise, positive clockwise. |
| Speed change | DO_CHANGE_SPEED | Target speed in m/s. Takes effect only with a healthy airspeed sensor in use. |
| Payload drop | DO_SET_SERVO | Servo number and PWM value in µs, typically 1000–2000. |
| Vertical landing | NAV_VTOL_LAND | Landing latitude and longitude. Param1 = 1 forces a fixed-wing spiral approach. |
| Return home | NAV_RETURN_TO_LAUNCH | Goes to home or the nearest rally point, then loiters. |

For landing on a visual target, external control from a companion computer can use ArduPilot GUIDED mode or PX4 Offboard mode, as described in the companion-computer section.

Source: https://ardupilot.org/plane/docs/common-mavlink-mission-command-messages-mav_cmd.html
