---
title: "Small electric VTOL UAV systems: hardware, software and analysis tools"
topic: vtol-engineering
competition: none
source_url: https://ardupilot.org/plane/
last_verified: 2026-11-13
owner: research-team
visibility: public
---

## The autopilot (flight controller)

A flight controller is the autopilot hardware of a drone. The PX4 documentation says flight controllers are "the autopilot hardware onto which PX4 firmware is uploaded." The flight controller reads the sensors and sends commands to the motors and control surfaces.

### Pixhawk as an open hardware standard
Pixhawk is a set of open hardware standards. The Pixhawk-Standards repository says the standards provide "readily available hardware specifications and guidelines for drone systems development." The Pixhawk Special Interest Group develops the standards. The Dronecode Foundation coordinates them. The listed Pixhawk standards include:

| ID | Standard |
|---|---|
| DS-009 | Pixhawk Connector Standard |
| DS-010 | Pixhawk Autopilot Bus Standard |
| DS-012 | Pixhawk Autopilot v6X Standard |
| DS-014 | Pixhawk Payload Bus Standard |
| DS-018 | Pixhawk Autopilot v6C Standard |

### ArduPilot and PX4
ArduPilot and PX4 are two open-source autopilot software projects. The ArduPilot Plane documentation groups the boards it supports as "Open Hardware" (for example CubePilot Cube Orange, Holybro Pixhawk 6X and CUAV V5 Plus), "Closed Hardware" (for example Mateksys H743-Wing) and "Linux-Based" boards. ArduPilot lists factors for choosing a board, including sensor redundancy, number of outputs, number of UARTs, physical size and expense. ArduPilot says controller prices range from about $25 to much more, depending on features. PX4 describes itself as an open-source autopilot flight stack that runs on the NuttX real-time operating system. PX4 supports multicopters, fixed-wing aircraft, VTOL aircraft and other vehicle types. A QuadPlane in ArduPilot is "a combined fixed wing and MultiCopter aircraft."

Source: https://docs.px4.io/main/en/flight_controller/ ; https://github.com/pixhawk/Pixhawk-Standards ; https://ardupilot.org/plane/docs/common-autopilots.html ; https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/plane/docs/quadplane-overview.html

## Sensors on a VTOL UAV autopilot

A small UAV autopilot uses several sensors to work out its attitude, height and position. The PX4 documentation says PX4 "minimally requires a gyroscope, accelerometer, magnetometer (compass) and barometer."

- **IMU (gyroscope and accelerometer):** these sensors measure rotation and acceleration. The ArduPilot documentation says that for multicopters and QuadPlanes "virtually all vibrations originate from the motor's rotational frequency". ArduPilot also says that to the autopilot, vibration noise "looks like any other disturbance". Harmonic notch filters are used to remove this motor noise.
- **Barometer:** this sensor measures air pressure. The autopilot uses it to estimate altitude.
- **GPS/GNSS:** PX4 says a GNSS or other global position source is needed to enable all automatic modes. ArduPilot gives a 3D precision of about 2.5 m with a clear sky view and about 26 m with extreme multipath (for example between buildings). ArduPilot says "only clear sky view is safe enough for Auto missions." ArduPilot says RTK can give centimetre- or millimetre-level precision and suits slow-moving or stationary work such as surveying.
- **Compass (magnetometer):** this sensor gives heading. PX4 notes that an external compass can be made less sensitive to electromagnetic interference than the internal one.
- **Airspeed sensor:** ArduPilot Plane uses a pitot tube that measures both static and total pressure. ArduPilot says an airspeed sensor can help in windy conditions, slow flight and autonomous landings, but is "not recommended for most new users". PX4 says airspeed sensors are highly recommended for fixed-wing and VTOL vehicles. ArduPilot says to fit a loose pitot cover during power-up and remove it before flight.

Source: https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/plane/docs/airspeed.html ; https://ardupilot.org/plane/docs/common-gps-how-it-works.html ; https://ardupilot.org/plane/docs/common-imu-notch-filtering.html

## Ground control, radio links and fail-safes

### Ground control stations
- **Mission Planner** is ground station software for ArduPilot, created by Michael Oborne. Its listed features include point-and-click entry of waypoints, fences and rally points on a map, autopilot parameter configuration, log download and analysis, and software-in-the-loop (SITL) simulation.
- **QGroundControl** "provides full flight control and vehicle setup for PX4 or ArduPilot powered vehicles." QGroundControl runs on Windows, macOS, Linux, Android and iOS. Its features include mission planning, a flight map, video streaming and flight log download.

### MAVLink and telemetry radios
MAVLink is "a very lightweight messaging protocol for communicating with drones (and between onboard drone components)." MAVLink 1 has 8 bytes of overhead per packet. MAVLink 2 has 12 bytes. ArduPilot says most pure telemetry radios, such as SiK radios, connect to the autopilot through a serial UART using MAVLink 1 or 2. ArduPilot notes that some RC systems also carry telemetry.

### Fail-safes in ArduPilot Plane
A fail-safe is an automatic action the autopilot takes when something goes wrong. ArduPilot Plane has these fail-safes:
- **RC fail-safe:** triggers after signal loss longer than RC_FS_TIMEOUT (default 1 s). The default long fail-safe action is RTL (Return to Launch).
- **GCS fail-safe:** enabled with FS_GCS_ENABL; triggers when MAVLink heartbeats from the ground station stop.
- **Battery fail-safe:** triggers on low voltage or low remaining capacity. Actions include RTL, Land and QLAND (QuadPlane only). This fail-safe needs a working power module.

Source: https://ardupilot.org/planner/ ; https://docs.qgroundcontrol.com/master/en/qgc-user-guide/ ; https://mavlink.io/en/ ; https://ardupilot.org/plane/docs/common-telemetry-landingpage.html ; https://ardupilot.org/plane/docs/apms-failsafe-function.html

## Propulsion and power

### Motors and ESCs
The ArduPilot documentation says "Most ArduPilot vehicles use brushless motors controlled by brushless motor ESCs." PX4 says an electronic speed controller (ESC) "converts a signal from the flight controller to an appropriate level of power delivered to the motor". ArduPilot says a PWM ESC uses pulses of about 1000 µs to 2000 µs for zero to full power, usually at about 50 Hz to 490 Hz. PX4 lists PWM, OneShot, DShot and DroneCAN among supported ESC protocols. ArduPilot warns that damage can occur if the ESC does not support the selected configuration. On a QuadPlane, ArduPilot says only the vertical lift outputs normally should run at the high PWM rate of 400 Hz. Motor kV rating, propeller selection and hover thrust-to-weight ratio: Not confirmed as of 2026-11-13.

### LiPo batteries
PX4 gives these LiPo battery values:

| Item | PX4 documentation |
|---|---|
| Nominal cell voltage | 3.7 V |
| "Full" setting | 4.05 V per cell (QGroundControl default) |
| Empty, under load ("real" minimum) | 3.5 V per cell |
| Damage risk | 3.0 V per cell under load |

PX4 warns that setting the empty voltage too low can damage the battery through deep discharge and the vehicle may crash. Meaning of the C-rating: Not confirmed as of 2026-11-13.

### Power module
ArduPilot says a power module measures battery voltage and current in real time. Most power modules also supply stable power to the autopilot.

Source: https://ardupilot.org/plane/docs/common-brushless-escs.html ; https://docs.px4.io/main/en/peripherals/esc_motors.html ; https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://docs.px4.io/main/en/config/battery.html ; https://ardupilot.org/plane/docs/common-powermodule-landingpage.html ; https://ardupilot.org/plane/docs/quadplane-frame-setup.html

## Autonomous missions: waypoints, VTOL take-off and landing, geofence

An autonomous mission is a list of commands that the autopilot flies by itself. PX4 says some of its autonomous modes "execute pre-programmed missions." Mission Planner and QGroundControl both let users plan missions with waypoints on a map.

### VTOL mission commands in ArduPilot (QuadPlane)
- **NAV_VTOL_TAKEOFF:** the only parameter is the altitude above the take-off point where take-off is complete. The latitude and longitude are ignored.
- **NAV_VTOL_LAND:** uses an altitude of zero and the latitude and longitude of the landing point. By default the aircraft stays in fixed-wing flight at its current altitude until it is close to the landing point, then transitions to VTOL and lands.
- **DO_VTOL_TRANSITION:** a parameter of 3 changes the aircraft to VTOL mode. A parameter of 4 changes it to fixed-wing mode.

### Geofence in ArduPilot Plane
A geofence is a virtual boundary for the flight area. ArduPilot says Plane 4.1 and later uses a home-centred cylindrical fence and/or inclusion and exclusion fences. FENCE_ALT_MIN and FENCE_ALT_MAX set the altitude floor and ceiling in metres. FENCE_ACTION sets what happens on a breach. On the ArduPilot geofencing page, 0 disables the fence, 1 makes the plane fly to the return point, and 2 only reports the breach to the ground station. That page is marked as archived, so check the current ArduPilot fence documentation before use.

Source: https://ardupilot.org/plane/docs/quadplane-auto-mode.html ; https://ardupilot.org/plane/docs/geofencing.html ; https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html

## Companion computers and computer vision for precision landing

### Companion computer
A companion computer is a second computer on the aircraft that talks to the flight controller. ArduPilot says it is "typically a small ARM-based Single Board Computer." Hardware examples listed by ArduPilot include the Raspberry Pi, NVIDIA TX1 and TX2, and ModalAI VOXL2. Listed software includes BlueOS, DroneKit, MAVSDK, Pymavlink and Rpanion-server. PX4 says a companion computer provides "higher level command and control", such as networking and computer vision.

### Fiducial markers
A fiducial marker is a printed pattern that a camera can find and measure. The AprilTag project calls AprilTag "a visual fiducial system." AprilTag software can compute the precise 3D position of a tag with respect to the camera. AprilTags hold much smaller data payloads than QR codes (4 to 12 bits). The AprilTag page says this lets them be detected more robustly and from longer ranges. ArUco details: Not confirmed as of 2026-11-13.

### Precision landing in ArduPilot
ArduPilot supports precision landing through MAVLink LANDING_TARGET messages sent from a companion computer. ArduPilot names AprilTag as an example fiducial marker system for this setup. The IR-LOCK sensor and beacon, used with a rangefinder, is another option. A user sets PLND_ENABLED = 1 and chooses the target source with PLND_TYPE (1 = MAVLink LANDING_TARGET, 2 = IR-LOCK, 0 = disabled). ArduPilot notes that noisy rangefinder data degrades performance.

Source: https://ardupilot.org/dev/docs/companion-computers.html ; https://ardupilot.org/copter/docs/precision-landing-and-loiter.html ; https://april.eecs.umich.edu/software/apriltag ; https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html

## Payload release with a servo gripper

A payload release mechanism holds a load and lets it go on command. In ArduPilot, a simple release mechanism can be a servo set up as a "gripper." The ArduPilot servo gripper setup steps are:

- Assign a servo output to the gripper with SERVOx_FUNCTION = 28. On Plane, "any unused output may be used."
- Set GRIP_ENABLE = 1, refresh parameters, then set GRIP_TYPE = 1 (servo gripper) and reboot the autopilot.
- Set the PWM positions: GRIP_GRAB (closed), GRIP_RELEASE (open) and GRIP_NEUTRAL.
- For manual control, assign a transmitter switch with RCx_OPTION = 19 (Gripper).
- For release in an AUTO mission, use the DO_GRIPPER command. A value of 0 opens the gripper (drop) and 1 closes it (grab).

ArduPilot says that if the autopilot cannot power the servos, an external BEC or an ESC that can provide 5 V should be used.

Source: https://ardupilot.org/plane/docs/common-gripper-servo.html

## Airframe materials: LW-PLA and PETG

Small UAV airframes are often 3D printed. Two common filaments are LW-PLA and PETG. The figures below come from colorFabb's product pages.

### colorFabb LW-PLA (lightweight foaming PLA)
| Property | Value |
|---|---|
| Foaming | Starts at about 230 °C; volume can grow nearly 3 times |
| Weight saving | Up to 65% compared with regular PLA |
| Density | 1.21–1.43 g/cm³ unfoamed; about 0.40–0.48 g/cm³ fully foamed |
| Glass transition | 55 °C |
| Print temperature | 195–260 °C |
| Bed temperature | 50–60 °C (heated bed optional) |

colorFabb calls LW-PLA the best filament for printing RC planes. colorFabb also notes that LW-PLA oozes during travel moves.

### colorFabb PETG (Economy)
| Property | Value |
|---|---|
| Print temperature | 235–255 °C |
| Bed temperature | 70–80 °C |
| Density | 1.28 g/cm³ |
| Glass transition | 70 °C |

For stronger PETG parts, colorFabb recommends the least fan cooling needed, for best layer adhesion.

Properties of carbon-fibre rods and glass-fibre composites: Not confirmed as of 2026-11-13.

Source: https://colorfabb.com/lw-pla-natural ; https://colorfabb.com/petg-economy-black

## CFD and Ansys Fluent in plain words

Computational fluid dynamics (CFD) is "the science of using computers to predict liquid and gas flows." CFD is based on the conservation of mass, momentum and energy. The Navier-Stokes equations are partial differential equations that describe the motion of fluids. In CFD, the flow domain is split into small cells (a mesh), and the equations are solved in each cell. CFD gives flow properties such as temperature, pressure, velocity and density. Ansys says CFD makes it possible "to model the airflow around aircraft to predict lift and drag."

Ansys Fluent is commercial CFD software from Ansys. The Fluent product page says Fluent "simulates fluid flow phenomena". The page lists physics models including turbulence, single-phase and multiphase flow, combustion, battery modelling and fluid-structure interaction. Ansys Fluent has CPU solvers for flows from low speed to hypersonic, and it also has a native GPU solver.

Definition of a pressure contour plot and reasons for analysing rotor–airframe interaction in hover: Not confirmed as of 2026-11-13.

Source: https://ansys.synopsys.com/simulation-topics/what-is-computational-fluid-dynamics ; https://ansys.synopsys.com/products/fluids/ansys-fluent

## Flying legally and safely

Drone rules are different in each country. Anyone planning to fly a UAV should check the current rules with the national civil aviation authority before flying. This knowledge base does not state any specific drone rule.

- **Bangladesh:** Civil Aviation Authority of Bangladesh (CAAB), https://www.caab.gov.bd/. On 2026-11-13, the CAAB website had a UAS/Drone section under its Regulator menu. That section listed a draft "ANO on UAS/Drone", a circular for UAV/drone and a flight application form. Because the ANO is marked as a draft, its content is not summarised here.
- **Türkiye:** Directorate General of Civil Aviation (Sivil Havacılık Genel Müdürlüğü, SHGM). The address https://web.shgm.gov.tr did not load on 2026-11-13, so the SHGM website address and its drone pages are Not confirmed as of 2026-11-13.

Source: https://www.caab.gov.bd/ ; https://web.shgm.gov.tr
