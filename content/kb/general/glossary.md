---
title: "Glossary of UAV, VTOL and aerospace terms"
topic: general
competition: none
source_url: https://ardupilot.org/copter/docs/common-glossary.html
last_verified: 2026-11-13
owner: research-team
visibility: public
---

## Aircraft types and configurations

- **UAV (Unmanned Aerial Vehicle)**: An aircraft that flies with no pilot on board. A drone can be flown by hand or can fly itself (autonomously).
- **UAS (Unmanned Aircraft System)**: The UAV together with everything else needed to fly it, such as the ground station, the radio controller and the data-processing systems.
- **RPAS (Remotely Piloted Aircraft System)**: An abbreviation listed by Traficom, the Finnish transport and communications agency, next to UAS and UA (Unmanned Aircraft).
- **MAV (Micro Air Vehicle)**: A small UAV.
- **Multicopter (multirotor)**: A drone that lifts itself with several rotors. A multicopter can hover precisely and take off vertically, but its flights are shorter and usually slower.
- **Fixed wing**: An aircraft whose wings do not move to make lift. A fixed-wing drone flies farther and faster than a multicopter, but it cannot hover and is harder to fly and land.
- **VTOL (Vertical Take-Off and Landing)**: A hybrid that takes off and hovers like a multicopter and then changes (transitions) to forward flight like an aeroplane.
- **QuadPlane**: ArduPilot's name for a combined fixed-wing and multicopter aircraft. A QuadPlane can have from one to 8 or more lift motors.
- **Tiltrotor**: A VTOL aircraft that moves between hover and forward flight by tilting one or more rotors. After the tilt, the rotors push the aircraft forward instead of up. ArduPilot treats a tiltrotor as a special type of QuadPlane.
- **Tailsitter**: A VTOL aircraft that rotates its whole fuselage, including the autopilot, to switch between hover and forward flight. Some tailsitters land on their tails. Others ("belly landers") land flat on their bellies, which improves stability in wind.

Source: https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/plane/docs/quadplane-overview.html ; https://ardupilot.org/plane/docs/guide-tilt-rotor.html ; https://ardupilot.org/plane/docs/guide-tailsitter.html ; https://ardupilot.org/copter/docs/common-glossary.html ; https://traficom.fi/en/unmanned-aviation/abbreviations-and-definitions

## Wing geometry

- **Airfoil**: The cross-section shape of a wing. Its shape and its angle to the air decide how much lift the wing makes.
- **Leading edge**: The front edge of the wing.
- **Trailing edge**: The back edge of the wing.
- **Chord (c)**: The distance from the leading edge to the trailing edge. On a tapered wing, the chord changes along the span.
- **Span (s)**: The distance from one wing tip to the other.
- **Wing area (A)**: The area of the wing's outline as seen from above (the planform). It is not the total surface area of the wing.
- **Aspect ratio (AR)**: The square of the span divided by the wing area, AR = s² / A. For a rectangular wing this becomes span divided by chord, AR = s / c.
- **Camber**: The largest distance between the chord line and the mean camber line. Camber measures how curved the airfoil is.
- **Dihedral**: The angle between the wing and the local horizontal. Wings are given dihedral to help roll stability.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/wing-geometry-interactive/

## Aerodynamic forces and flow

- **Lift**: The force that holds an aircraft up against its weight. Lift acts at a right angle to the direction of the airflow.
- **Drag**: The aerodynamic force that resists an aircraft's motion through the air. Drag acts opposite to the direction of motion.
- **Thrust**: The force that moves an aircraft through the air. It comes from engines, motors or propellers.
- **Angle of attack**: The angle between the airfoil's chord line and the flight direction. For thin airfoils, lift is directly proportional to this angle for small angles, within about ±10 degrees.
- **Stall**: A sudden loss of lift at a high angle of attack. It happens when the air layer next to the wing (the boundary layer) separates from the surface. Engineers usually find the stall point by wind-tunnel testing.
- **Lift-to-drag ratio (L/D)**: Lift divided by drag. It measures aerodynamic efficiency. A higher L/D gives a shallower glide and needs less thrust in cruise, so the aircraft can fly farther.
- **Aerodynamic centre**: The point on an airfoil where the aerodynamic moment stays the same when the angle of attack changes. On most low-speed airfoils it is one quarter of the chord back from the leading edge.
- **Reynolds number (Re)**: A number with no units that compares inertial forces with viscous forces in a flow, Re = ρ·V·L / μ. Here ρ is air density, V is speed, L is a length (such as the chord) and μ is viscosity. At very high values (around 10 million) viscous forces are small. At low values (around 100) viscous forces must be taken into account.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/what-is-lift/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/what-is-drag/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/what-is-thrust/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/foilinc/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-to-drag-ratio/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aerodynamic-center/ ; https://www.grc.nasa.gov/www/k-12/airplane/reynolds.html

## Control surfaces and flight mechanics

- **Roll, pitch and yaw**: The three ways an aircraft rotates. Roll tips the wings from side to side. Pitch moves the nose up and down. Yaw swings the nose left and right.
- **Aileron**: The hinged outer part of each wing. Ailerons roll the aircraft.
- **Elevator**: The hinged part of the horizontal stabilizer (the small horizontal tail wing). The elevator controls pitch.
- **Rudder**: The hinged part of the vertical stabilizer (the upright tail fin). The rudder controls yaw.
- **Elevon**: A control surface on delta-wing ("elevon") planes. The autopilot mixes roll and pitch commands into each elevon's movement.
- **Flaps**: Surfaces that move down during take-off and landing so the wing makes more lift.
- **Spoilers**: Small plates that disturb the airflow over the wing. They reduce lift and help slow the aircraft for landing.
- **Centre of gravity (CG)**: The average location of an object's weight. In flight, an aircraft rotates about its centre of gravity.
- **Thrust-to-weight ratio (F/W)**: Thrust divided by weight. It is directly proportional to the aircraft's acceleration. If the ratio is above 1 and drag is small, the aircraft can accelerate straight up.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/airplane-parts-function/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/center-of-gravity/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/thrust-to-weight-ratio/ ; https://ardupilot.org/plane/docs/guide-elevon-plane.html

## Speed and altitude

- **Airspeed**: How fast the aircraft moves through the air. A pitot tube sensor measures it.
- **Ground speed**: How fast the aircraft moves over the ground. Drones usually get ground speed from GPS.
- **Airspeed vs ground speed check**: ArduPilot can disable the airspeed sensor if the ground speed stays lower than the reported airspeed for a few seconds. This check uses the expected maximum wind speed, set with the parameter ARSPD_WIND_MAX.
- **Pitot tube**: A tube that points into the airstream and is used to measure static and total air pressure. Airspeed is worked out from the pressure difference. Airspeed changes with the square root of that pressure, so small pressure changes near zero give large speed swings.
- **Airspeed sensor use**: ArduPilot says an airspeed sensor helps in windy conditions, slow flight and autonomous landings. ArduPilot does not recommend it for most new users because it needs extra tuning.
- **AGL (Above Ground Level)**: Altitude measured from the ground below the aircraft.
- **Relative (home) altitude**: In ArduPilot missions, altitude is measured from the launch point (home). A waypoint set to 100 m is flown 100 m above home.

Source: https://ardupilot.org/plane/docs/airspeed.html ; https://ardupilot.org/copter/docs/common-glossary.html ; https://ardupilot.org/planner/docs/common-planning-a-mission-with-waypoints-and-events.html

## Propulsion and electrical

- **Brushless motor (BLDC)**: The type of motor most PX4 and larger ArduPilot vehicles use. The flight controller drives each brushless motor through an ESC.
- **Kv**: A motor rating in revolutions per minute per volt (RPM/V). It is the motor's speed for each volt with no propeller load. ASSUMED example numbers: a 1000 Kv motor at 10 V spins about 1000 × 10 = 10,000 RPM with no load. With a propeller fitted, the real speed is lower.
- **ESC (Electronic Speed Controller)**: Takes a signal from the flight controller and sets how much power goes to the motor. Swapping any two of the three ESC-to-motor wires reverses the motor's direction.
- **BEC (Battery Eliminator Circuit)**: A voltage regulator that gives a steady 5 V to RC equipment, the autopilot and other onboard electronics. A BEC is often built into an ESC. Some opto-isolated ESCs do not provide BEC power and need a separate 5 V source.
- **PWM (Pulse Width Modulation)**: A signal that drives servos and ESCs, one signal per channel. The pulse width is usually between 1000 and 2000 microseconds. PWM is ArduPilot's default output type.
- **OneShot**: A family of pulse-based ESC protocols that ArduPilot and PX4 support alongside PWM. PX4 says OneShot and DShot give much lower latency than standard PWM.
- **DShot**: A digital ESC protocol in which the values sent to the ESC are checksum-protected (a checksum is an error check). DShot ESCs need no calibration. The speeds are DShot150, 300, 600 and 1200 (kbaud). ArduPilot recommends DShot600 for most vehicles and DShot150 for long signal cables on large aircraft.
- **Bi-directional DShot**: A form of DShot in which the ESC also sends telemetry, such as motor RPM, back to the autopilot. ArduPilot supports it only on BLHeli32 and AM32 ESCs.
- **DroneCAN ESC**: An ESC controlled over the CAN data bus. ArduPilot supports ESC telemetry from BLHeli and DroneCAN/CAN ESCs.
- **PDB (Power Distribution Board)**: A board that shares battery power between the ESCs of a multicopter.

Source: https://docs.px4.io/main/en/peripherals/esc_motors.html ; https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/copter/docs/common-dshot-escs.html ; https://ardupilot.org/plane/docs/common-esc-guide.html ; https://ardupilot.org/copter/docs/common-glossary.html ; https://ardupilot.org/copter/docs/connect-escs-and-motors.html ; https://tytorobotics.com/blogs/articles/how-to-calculate-motor-poles-and-brushless-motor-kv

## Batteries

- **LiPo (Lithium Polymer) battery**: The main power source for most drones. A LiPo can deliver high current for its capacity (a high C rating), but it stores less energy for its weight than Li-ion.
- **Li-ion (Lithium-ion) battery**: A battery with higher energy density than a LiPo, but with lower discharge rates and higher cost.
- **LiPo vs Li-ion voltage**: Near empty, a 6S LiPo pack and a 6S Li-ion pack can differ by about 3 V. This difference affects how much thrust you can expect.
- **Capacity (mAh)**: The charge a battery holds, in milliamp-hours.
- **C rating**: A multiple of the battery's stated capacity that gives a safe discharge current. Example from PX4: a 2000 mAh battery rated 10C can safely and continuously give 2 A × 10 = 20 A.
- **Watt-hours (Wh)**: The stored energy, equal to nominal voltage × capacity in amp-hours. Example from PX4: one 3.7 V, 5 Ah cell holds 3.7 × 5 = 18.5 Wh. Three such cells hold 3 × 18.5 = 55.5 Wh (PX4 rounds this to 55 Wh).
- **Series and parallel cells**: Packs are built by joining cells in series (to raise voltage) and in parallel (to raise capacity), as needed. A label such as "6S" describes the number of cells in series.
- **Power module**: A part that connects the battery and supplies power separately to the flight controller and the ESCs.

Source: https://docs.px4.io/main/en/power_systems/battery_chemistry.html ; https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/copter/docs/common-glossary.html

## Autopilot and sensors

- **Autopilot**: The "brain" of a drone. It is flight software running on flight-controller hardware and controls the vehicle automatically.
- **Flight controller (FC)**: The circuit board that runs the autopilot software. Sensors and actuators (motors and servos) connect to it.
- **Firmware**: Software stored in memory that stays saved without power. It defines how a device behaves. PX4 is open-source autopilot firmware that runs on the NuttX real-time operating system.
- **IMU (Inertial Measurement Unit)**: A sensor package of accelerometers and gyroscopes. Software combines their readings to work out the aircraft's orientation (attitude).
- **Gyroscope (gyro)**: Measures how fast the aircraft rotates. Gyro readings slowly drift over time, so they are combined with accelerometer data.
- **Accelerometer**: Measures acceleration, including the direction of gravity, along the x, y and z axes.
- **Magnetometer (compass)**: Senses the Earth's magnetic field to find heading (yaw). Most GNSS modules include one. Magnets or magnetised metal on the airframe cause "hard iron" errors, which can mostly be corrected with constant offsets.
- **Barometer**: A pressure sensor that the autopilot uses for altitude. PX4 needs at least a gyroscope, an accelerometer, a magnetometer and a barometer.
- **AHRS (Attitude Heading Reference System)**: The IMU plus software that estimates the aircraft's orientation and heading.

Source: https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/copter/docs/common-glossary.html ; https://docs.px4.io/main/en/gps_compass/

## Estimation and control

- **GNSS (Global Navigation Satellite System)**: Satellite positioning such as GPS, GLONASS, Galileo, BeiDou and QZSS. PX4 needs GNSS (or another global position source) for all automatic modes.
- **SBAS / WAAS**: Satellite-based correction systems (WAAS is one) that improve GPS accuracy. ArduPilot says SBAS can bring accuracy to the 1 m range.
- **RTK (Real-Time Kinematics)**: A method that sends correction data (RTCM messages) to the drone's GPS receiver. ArduPilot gives normal GPS accuracy as 3–5 m (u-blox M8N generation). RTK can give centimetre accuracy.
- **NMEA**: Plain-text messages (sentences) that a GPS module sends with position and related data.
- **Kalman filter**: An algorithm that combines sensor readings into one real-time estimate of the aircraft's state.
- **EKF (Extended Kalman Filter)**: ArduPilot's estimator for position, velocity and orientation. It combines data from the gyroscopes, accelerometers, compass, GPS, airspeed sensor and barometer. It can also use optical flow and laser rangefinders.
- **INS (Inertial Navigation System)**: Estimates position from motion sensors. After a first GPS fix, an INS can keep estimating position from speed and motion (dead reckoning).
- **PID (Proportional-Integral-Derivative)**: A control method that makes the sensor-to-motor control loops more accurate and reduces over-correction.
- **Inner and outer loop**: The inner loop is the stabilization function and must run very often. The outer loop handles navigation and can tolerate delays.

Source: https://docs.px4.io/main/en/gps_compass/ ; https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/copter/docs/common-rtk-correction.html ; https://ardupilot.org/copter/docs/common-apm-navigation-extended-kalman-filter-overview.html ; https://ardupilot.org/copter/docs/common-glossary.html

## Navigation, autonomy and safety functions

- **Flight mode**: An operating state that sets how much the autopilot automates. Autonomous modes need no pilot input. Manual modes take pilot input with autopilot help.
- **Waypoint**: A location the vehicle flies to during a mission.
- **Mission**: An ordered list of commands, such as take-off, waypoints, loiters and landing, that the vehicle flies in AUTO mode.
- **Home**: For Copter, Plane and Rover, the location where the vehicle was armed. Return-to-launch uses home.
- **RTL (Return to Launch)**: A mode that flies the aircraft back to home or a rally point. A plane then circles there.
- **Loiter**: In ArduPilot Plane, a mode that circles the point where the mode was switched on.
- **Geofence**: A virtual boundary around the flying area. In ArduPilot Plane 4.1 and later this can be a home-centred cylinder and/or inclusion and exclusion zones; older firmware used a polygon with minimum and maximum altitude. The parameter FENCE_ACTION defaults to 0, which disables the fence. Set to 1, the plane flies to a return point on a breach. Set to 2, it only reports the breach to the ground station.
- **Arming**: Arming powers the motors and actuators. Disarming turns them off. Before arming, the autopilot runs pre-arm checks on its sensors, GPS, logging and compass. It refuses to arm if any check fails.
- **Fail-safe**: A set of actions that protect and recover the vehicle when something goes wrong, such as a low battery or loss of the radio-control link.
- **Offboard mode**: A PX4 mode in which a ground station or companion computer controls the vehicle.

Source: https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/plane/docs/flight-modes.html ; https://ardupilot.org/plane/docs/geofencing.html ; https://ardupilot.org/plane/docs/arming-your-plane.html ; https://ardupilot.org/planner/docs/common-planning-a-mission-with-waypoints-and-events.html

## Communication and ground station

- **RC (Radio Control)**: A ground transmitter and an onboard receiver that send the pilot's control commands.
- **PPM (Pulse Position Modulation)**: A single pulse train that carries several RC channels from the receiver to the autopilot.
- **GCS (Ground Control Station)**: Software on the ground that shows telemetry and the aircraft's status and can send commands in flight. QGroundControl is one example.
- **Telemetry**: A two-way radio link. It sends flight data down from the aircraft and sends commands or setting changes up to it.
- **MAVLink**: A very lightweight messaging protocol for drones and their onboard parts. The overhead is 8 bytes per packet for MAVLink 1 and 12 bytes for MAVLink 2. Up to 255 systems can share one network.
- **Companion computer**: A separate onboard computer for higher-level control, networking and computer vision. It usually runs Linux and talks to the autopilot through MAVSDK or ROS 2.
- **FPV (First-Person View)**: Flying by watching live video from an onboard camera, usually through goggles.
- **OSD (On-Screen Display)**: Telemetry shown on top of the live video.
- **POI (Point of Interest)**: A spot that the aircraft keeps its camera pointed at.
- **C2**: The abbreviation for "Command and Control" in Traficom's list of unmanned aviation terms.

Source: https://docs.px4.io/main/en/getting_started/px4_basic_concepts.html ; https://ardupilot.org/copter/docs/common-glossary.html ; https://mavlink.io/en/ ; https://traficom.fi/en/unmanned-aviation/abbreviations-and-definitions

## Simulation and testing

- **SITL (Software In The Loop)**: Runs Plane, Copter or Rover autopilot code as a normal program on a PC, with no flight-controller hardware.
- **HITL / HIL (Hardware In The Loop)**: Runs the normal autopilot firmware on a real flight controller while a simulator supplies the sensor data.
- **SITL vs HITL**: HITL tests most of the flight code on the real board. SITL runs more of the normal system code path, using drivers that supply simulated data.
- **Bootloader**: A small program stored in the processor's non-volatile memory that lets a PC load new firmware onto it.
- **Similarity matching**: If two experiments (for example a wind-tunnel model and a full aircraft) have matching values of a similarity parameter such as the Reynolds number, the relative importance of the forces is modelled correctly.

Source: https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html ; https://docs.px4.io/main/en/simulation/hitl.html ; https://ardupilot.org/copter/docs/common-glossary.html ; https://www.grc.nasa.gov/www/k-12/airplane/reynolds.html

## Operations and regulation terms

Traficom, the Finnish transport and communications agency, lists these abbreviations used in unmanned aviation:

- **VLOS**: Visual Line Of Sight.
- **BVLOS**: Beyond Visual Line Of Sight.
- **UA**: Unmanned Aircraft.
- **RP**: Remote Pilot.
- **DAA**: Detect And Avoid.
- **MTOM**: Maximum Take Off Mass.

ArduPilot's glossary adds two US terms:

- **PIC (Pilot In Command)**: Refers to the US aviation authority (FAA) rule that UAVs flown under the recreational exemption must stay under a pilot's direct control.
- **COA (Certificate of Authorization)**: An FAA approval for a specific UAV flight in the United States.

Source: https://traficom.fi/en/unmanned-aviation/abbreviations-and-definitions ; https://ardupilot.org/copter/docs/common-glossary.html
