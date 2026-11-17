---
title: "Electric propulsion and batteries for UAVs (in depth)"
topic: vtol-engineering
competition: none
source_url: https://www.grc.nasa.gov/www/k-12/airplane/propth.html
last_verified: 2026-11-13
owner: research-team
visibility: public
---

## How a propeller makes thrust (momentum view)

All thrust comes from Newton's third law. A propeller aircraft pushes the surrounding air backward, and that air pushes the aircraft forward. NASA Glenn describes the propeller as acting like a rotating wing. If you cut a blade across its length, the cut shape is an airfoil (a wing-shaped cross-section). Blades are usually twisted from hub to tip, so the angle of attack of the airfoils at the tip is lower than at the hub.

Simple momentum theory treats the propeller as an "actuator disk". This is a thin, ideal disk that air passes through. The motor does work on the air, so the pressure jumps suddenly across the disk. The air leaves faster than it arrived. In NASA Glenn's notation:

- Thrust: F = Δp × A, where Δp is the pressure jump and A is the disk area.
- Pressure jump: Δp = ½ρ(Ve² − V0²), where ρ is air density, V0 is the free-stream air speed and Ve is the exit speed far behind the disk.
- Combined: F = ½ρA(Ve² − V0²).

This is an ideal thrust. It does not account for many losses that occur in real propellers. NASA says it gives "a good first cut" for preliminary design. NASA's general thrust equation states the same idea with mass flow rate: thrust is the mass flow times the exit velocity minus the mass flow times the entry velocity, plus a pressure-area term that is usually small. NASA notes that propellers move a large mass of air but change its velocity only a little. Turbojets and rockets accelerate a moderate flow to a much higher exit velocity.

Source: https://www.grc.nasa.gov/www/k-12/airplane/propth.html ; https://www.grc.nasa.gov/www/k-12/airplane/propeller.html ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/thrust-force/

## Propeller size: diameter and pitch

Small UAV propellers are labelled with two numbers separated by an "x", for example "10x5". APC Propellers explains that the first number is the diameter in inches. The second number is the pitch in inches per revolution. Pitch is the distance the propeller would move forward in one turn if it moved through the air like a screw through wood. APC notes that real aircraft speed can be higher than this calculated pitch speed, because blade camber makes the effective pitch higher than the measured pitch.

Diameter sets the disk area A in the momentum equation above. Area grows with the square of diameter: doubling the diameter gives four times the area. A bigger disk can make the same thrust while speeding the air up less. The hover section below explains why that saves power.

Static thrust is the thrust measured while the aircraft is held still. In the NASA actuator-disk equation F = ½ρA(Ve² − V0²), the incoming speed V0 is then zero. As the aircraft moves forward, V0 grows, so the same exit speed gives less thrust. For this reason, a propeller's thrust on a test stand is not the same as its thrust in forward flight.

APC publishes performance data for its propellers. APC says the data are "determined analytically" (calculated, not measured) for sea-level standard-atmosphere conditions: about 15 °C, 29.92 in-Hg pressure and 1.225 kg/m³ air density. APC also lists recommended RPM (revolutions per minute) limits for each propeller type on a separate page. Designers should check that limit before choosing a fast motor.

Source: https://apcprop.com/faq ; https://www.grc.nasa.gov/www/k-12/airplane/propth.html

## Why hovering needs more power than cruising: disk loading

Disk loading (DL) is the rotor thrust divided by the rotor disk area (DL = T/A). Sumeet Kumar's helicopter aerodynamics notes call disk loading "a fundamental attribute of a rotor" that is to be kept low. Ideal momentum theory gives two hover results:

- Induced velocity (the speed the rotor adds to the air): v = √(T / (2ρA))
- Ideal hover power: P = T × v = T^1.5 / √(2ρA)

Power loading is PL = T/P, the thrust produced per watt. A high power loading is better. The notes say real rotors need more power than this ideal value and use an induced power factor of about 1.15 to approximate that.

In hover, the rotors must carry the whole aircraft weight, so T equals the weight. Small lift rotors have a small total area A, so the power is high. In fixed-wing cruise, the wing carries the weight. ArduPilot's QuadPlane documentation says that once the aircraft reaches AIRSPEED_MIN (or Q_ASSIST_SPEED, if higher), the help from the quad motors decreases over 5 seconds. The aircraft then flies purely as a fixed wing.

**ASSUMED example numbers:** The aircraft has a mass of 5 kg, so T = 49 N in round numbers. Air density ρ = 1.225 kg/m³. The total lift-rotor disk area A = 0.5 m².
- 2ρA = 2 × 1.225 × 0.5 = 1.225, and √1.225 ≈ 1.107.
- T^1.5 = 49 × √49 = 49 × 7 = 343.
- Ideal P ≈ 343 / 1.107 ≈ 310 W.
- With the disk area doubled to 1.0 m²: √2.45 ≈ 1.565, so P ≈ 343 / 1.565 ≈ 219 W.

Real hover power is higher than these ideal values because of losses.

Source: https://kumar-sumeet.github.io/HeliAeroNotes/Lectures/1_MT/MT.html ; https://ardupilot.org/plane/docs/quadplane-flying.html

## Brushless outrunner motors and kV

Most small UAVs use brushless motors. An outrunner is a brushless motor whose outer case spins around fixed windings. MIT's fabrication course notes that outrunners became dominant through their common use in UAVs and quadcopters. MIT also says outrunners need more advanced control; in practice an ESC (electronic speed controller) provides this control. MIT warns that outrunners do not have internal bearings meant to take side loads, such as a tensioned belt.

The kV rating links voltage to speed. MIT describes kV as "relating Volts to RPM, or in the inverse, to Torque". kV is commonly given in RPM per volt. A higher-kV motor spins faster per volt but gives less torque per amp. A lower-kV motor gives more torque per amp. Winding details change these ratings. For outrunners, MIT says diameter is typically linked to the torque constant, because the force pulls farther from the centre.

In practice, the motor, the propeller and the battery voltage must be chosen together. The battery voltage and kV set the motor speed. The propeller's size and pitch set how much torque, and therefore current, is needed at that speed. Measured thrust and current for a given motor and propeller pair should come from the manufacturer's test data or a thrust-stand test, since APC's own propeller data are calculated rather than measured.

Source: https://fab.cba.mit.edu/classes/865.21/topics/mechanical_design/parts/ ; https://apcprop.com/faq

## Protecting the propulsion system in ArduPilot

ArduPilot multicopter and QuadPlane firmware include settings that help the motors, propellers and battery work together:

| Parameter | What the docs say |
|---|---|
| MOT_THST_EXPO | Shapes the throttle-to-thrust curve. Default 0.65. 0 is linear and 1.0 is very curved. ESCs with built-in linearising curves typically need 0 to 0.2. |
| MOT_SPIN_MAX | Default 0.95 (95% of full throttle). It marks where thrust levels off near maximum output. |
| MOT_SPIN_ARM | Motor speed when armed but not flying. Recommended value is (deadzone % + 2)/100, for example 0.09 for a 7% deadzone. |
| MOT_SPIN_MIN | Lowest output in flight. Should be at least 0.03 above MOT_SPIN_ARM, for example 0.12. |
| MOT_BAT_CURR_MAX | Current limit in amps (0 disables it). When exceeded, it can lower throttle to as little as 60% within 1 to 5 seconds. |
| MOT_BAT_VOLT_MAX / MIN | Voltage scaling. Raises control gains as the battery voltage drops. MAX is the full-charge voltage, for example 12.6 V for a 3S pack. |

The docs advise setting the current limit between the battery's burst limit and its absolute upper limit. They suggest the battery failsafe voltage as a good start for MOT_BAT_VOLT_MIN. All QuadPlane parameters start with "Q_", and the VTOL motor settings use "Q_M_" (for example Q_M_SPIN_ARM). Q_M_PWM_MIN and Q_M_PWM_MAX must be set to the range the ESCs expect.

Source: https://ardupilot.org/copter/docs/motor-thrust-scaling.html ; https://ardupilot.org/copter/docs/set-motor-range.html ; https://ardupilot.org/copter/docs/current-limiting-and-voltage-scaling.html ; https://ardupilot.org/plane/docs/quadplane-parameters.html

## ESCs and analogue protocols: PWM, OneShot, OneShot125

An ESC (electronic speed controller) takes battery power and a command signal from the autopilot. It drives the brushless motor at the commanded power. ArduPilot sets the command protocol with MOT_PWM_TYPE, and a reboot is needed after changing it.

- **PWM (MOT_PWM_TYPE = 0, default):** a repeating pulse, typically 1000 µs for zero power to 2000 µs for full power. Pulses are usually sent at 50 to 490 Hz. RC_SPEED sets the rate (default 490 Hz).
- **OneShot (1):** has a fixed frame rate equal to the autopilot's main loop rate. ArduPilot says it gives little advantage over regular PWM.
- **OneShot125 (2):** pulse widths are divided by 8, which allows faster communication from the autopilot to the ESC.

On autopilots with an I/O co-processor (IOMCU), the 8 MAIN outputs support only normal PWM and OneShot. OneShot125 must use the AUX outputs on those boards. Groups of outputs that share a hardware timer must use the same configuration. ArduPilot warns that damage can occur if the ESC does not support the selected configuration.

Source: https://ardupilot.org/copter/docs/common-brushless-escs.html

## DShot digital protocol and ESC telemetry

DShot is a digital ESC protocol. ArduPilot lists these advantages over PWM:

- Commands are checksum-protected, so corrupted commands can be detected.
- Clock timing differences between the ESC and the autopilot do not affect flight.
- No ESC calibration is needed.

| Variant | ArduPilot note |
|---|---|
| DShot150 | Recommended for larger aircraft with long signal wires, because lower rates resist cable noise better |
| DShot300 | Middle option; preferred, with DShot600, for bidirectional DShot |
| DShot600 | Recommended for most vehicles and the most widely tested |
| DShot1200 | Newest option, with less testing history |

Higher rates are more sensitive to noise. Telemetry is the ESC sending data back to the autopilot. In ArduPilot, ESC telemetry is tied to BLHeli32 and AM32 ESC firmware. Bidirectional DShot is supported only on BLHeli32 and AM32 ESCs. Some DShot ESCs with other firmware do not support telemetry, so the ESC manual should be checked. Reversible (3D) ESCs are supported for Plane and Rover, but Copter does not currently support them. With DShot, the SERVOx_MIN, MAX and TRIM values are ignored, and the output range is always 1000 to 2000.

Source: https://ardupilot.org/copter/docs/common-dshot-escs.html

## Powering the autopilot and servos: power module and BEC

A power module sits between the flight battery and the rest of the aircraft. ArduPilot says it supplies a steady 5 V or so to a Pixhawk autopilot. It also lets the autopilot measure the main battery's voltage and/or current.

A BEC (battery elimination circuit) is a small voltage regulator that makes a low, steady voltage for servos or electronics from the main battery. ArduPilot states that Pixhawk does not supply power to its servo rail. That rail is typically powered by an ESC or by a separate source such as a BEC.

A 5 V BEC on the servo rail can also act as backup power for the autopilot. In that case ArduPilot says a Zener diode (part 1N5339) must be added to keep the rail under 5.7 V. Without it, a digital servo can cause voltage spikes that reboot the Pixhawk in flight. The servo rail can run servos that need up to 10.5 V, but then the rail cannot power Pixhawk and the Zener must not be used. Pixhawk draws power from the power module, the servo rail and USB in that order, and switches automatically to the next source if the main one fails.

Source: https://ardupilot.org/copter/docs/common-powering-the-pixhawk.html

## QuadPlane lift motors, motor order and the forward motor

A quadplane has separate lift motors for hover and a forward motor for cruise. ArduPilot sets the lift layout with Q_FRAME_CLASS: 1 quad, 2 hexa, 3 octa, 4 octaquad, 5 Y6, 7 tri, 10 tailsitter. Q_FRAME_TYPE sets the arrangement: 0 plus, 1 X, 2 V, 3 H (plus some special values).

After Q_ENABLE = 1, the parameter list must be refreshed. Outputs 1 to 4 stay as the plane's control surfaces, so lift motors usually start at output 5. For a quad X frame:

| Output | Position | Spin |
|---|---|---|
| 5 | Front right | CCW |
| 6 | Rear left | CCW |
| 7 | Front left | CW |
| 8 | Rear right | CW |

The rule is that motors turn in towards the fuselage, and H frames reverse all directions. Only the lift motor outputs should normally run at 400 Hz. SERVOn_FUNCTION values 33 to 40 map Motor 1 to Motor 8 when a non-standard order is needed. On a tricopter quadplane, a servo set to function 39 tilts the rear motor sideways for yaw, limited by Q_M_YAW_SV_ANGLE to prevent propeller strikes.

In hover modes (QSTABILIZE, QACRO, QHOVER), an RC channel set to option 209 gives a separate throttle input to the forward motor, up to Q_FWD_MANTHR_MAX. When the aircraft switches from fixed-wing flight to QHOVER, the quad motors start at once and hold height, and the forward motor stops.

Source: https://ardupilot.org/plane/docs/quadplane-frame-setup.html ; https://ardupilot.org/plane/docs/quadplane-flying.html ; https://ardupilot.org/plane/docs/quadplane-parameters.html

## Lithium battery chemistries for UAVs: LiPo and Li-ion

Most electric UAVs use lithium batteries. Battery University (Cadex) lists several lithium-ion chemistries:

| Chemistry | Nominal (V/cell) | Full (V/cell) | Specific energy (Wh/kg) |
|---|---|---|---|
| LCO (cobalt) | 3.60 | 4.20 | 150–200 |
| NMC | 3.60–3.70 | 4.20 (some 4.30) | 150–220 |
| LMO (manganese) | 3.70 | 4.20 | 100–150 |
| LFP (iron phosphate) | 3.20–3.30 | 3.65 | 90–120 |
| NCA | 3.60 | 4.20 | 200–260 |
| LTO (titanate) | 2.40 | 2.85 | 50–80 |

Specific energy is the energy stored per kilogram. Lithium polymer (LiPo) cells use gelled electrolyte to make them conductive at room temperature. LiPo cells are often pouch cells, sealed in flexible foil instead of a hard case. Battery University says a foil enclosure cuts weight by more than 20% compared with a hard shell. LiPo offers slightly higher specific energy and can be made thinner than conventional Li-ion. However, gas build-up during charge can make pouch cells swell, and foil-packed cells may be less durable than cylindrical cells.

Battery University also describes a trade-off between two cell types. The protection circuit of Li-ion "energy cells" keeps them from discharging above 1C. "Power cells" can tolerate discharge rates of up to 10C but hold less. Drone makers favour high-capacity energy cells for the most energy per weight. RC hobbyists discharge packs at around 30C and accept short pack life.

Source: https://batteryuniversity.com/article/bu-205-types-of-lithium-ion ; https://batteryuniversity.com/article/bu-206-lithium-polymer-substance-or-hype ; https://batteryuniversity.com/article/bu-402-what-is-c-rate ; https://batteryuniversity.com/article/bu-501-basics-about-discharging

## Cell voltage limits and series/parallel notation

Each lithium cell has a safe voltage window. For LCO, NMC, LMO and NCA, Battery University gives a typical operating range of 3.0 to 4.2 V per cell (LFP is 2.5 to 3.65 V). Charging should end when the charge current falls to 0.05C (C-rate is explained in the next section).

PX4's battery guidance uses 3.7 V nominal per cell for both LiPo and Li-ion. For the "empty" setting per cell, PX4 suggests:

| | Conservative (no load) | Realistic minimum under load | Risk of damage under load |
|---|---|---|---|
| LiPo | 3.7 V | 3.5 V | 3.0 V |
| Li-ion | 3.0 V | 2.7 V | 2.5 V |

Packs are built from many cells. Battery University explains that cells in series add their voltages while capacity stays the same. Cells in parallel add capacity (Ah) while voltage stays the same. "4S2P" means four cells in series and two in parallel. Battery University's example: four 3.6 V cells in series give 14.4 V nominal. Its 2S2P example uses 3.6 V, 3400 mAh cells (about 12.24 Wh each), giving 7.2 V, 6800 mAh and about 48.96 Wh.

A pack is limited by its weakest cell. In series, a weak cell drains first, is stressed by the stronger cells and pulls the pack voltage down. In parallel, a shorted cell drains energy from the other cells and causes a fire hazard.

Source: https://batteryuniversity.com/article/bu-205-types-of-lithium-ion ; https://docs.px4.io/main/en/config/battery.html ; https://batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations

## Capacity, energy and C-rate

Capacity is the charge a battery holds, given in ampere-hours (Ah) or milliampere-hours (mAh); 1000 mAh = 1 Ah. Energy in watt-hours (Wh) is voltage × capacity. Battery University's example cell is 3.6 V × 3.4 Ah ≈ 12.24 Wh.

The C-rate expresses current relative to capacity. Battery University defines 1C as the current at which a fully charged battery rated at 1 Ah provides 1 A for one hour. To get the current in amps, multiply the C-rate by the capacity in Ah. For a 1 Ah battery:

| C-rate | Current | Time to empty |
|---|---|---|
| 0.5C | 0.5 A | 2 h |
| 1C | 1 A | 1 h |
| 2C | 2 A | 30 min |
| 5C | 5 A | about 12 min |

The same C-rate scales with size: a 2 Ah battery at 1C gives 2 A. A higher C-rate empties the battery faster. Battery University notes that charge current above 1C shortens the life of LCO and NMC cells.

Source: https://batteryuniversity.com/article/bu-402-what-is-c-rate ; https://batteryuniversity.com/article/bu-302-series-and-parallel-battery-configurations ; https://batteryuniversity.com/article/bu-205-types-of-lithium-ion

## Internal resistance and voltage sag

Every cell has internal resistance. When current flows, some voltage is lost inside the cell, so the voltage at the terminals drops under load. This drop is called voltage sag. PX4 notes that a typical LiPo has about 5 mΩ (milliohms) of internal resistance per cell, but the value varies with discharge rating, age and cell health.

Battery University says heavy current lowers the battery voltage, so the cut-off voltage is often set lower under heavy load. Very cold conditions also lower voltage and raise internal resistance. Roughly 95% of the energy has been used when the cut-off voltage is reached.

Sag makes voltage-only battery estimates unreliable. PX4 handles this with load compensation, set by BAT1_R_INTERNAL:

- −1: estimate the resistance in real time.
- A positive value: use that fixed resistance instead of the estimate.
- 0: turn compensation off.

PX4 recommends setting the "full" voltage per cell to 4.05 V, slightly below the true maximum. If it is set too high, the estimate stays at 100% for the first minutes of flight. ArduPilot has a related option, BATT_FS_VOLTSRC, which selects whether the battery failsafe uses raw voltage or sag-corrected voltage.

Source: https://docs.px4.io/main/en/config/battery.html ; https://batteryuniversity.com/article/bu-501-basics-about-discharging ; https://ardupilot.org/copter/docs/failsafe-battery.html

## Estimating flight time (worked example)

A first estimate of flight time is the usable capacity divided by the average current. This follows from the C-rate definition: at 1C a battery lasts about 1 hour. Sources suggest leaving a margin. ArduPilot suggests a low-capacity failsafe at about 20% of full capacity. PX4 suggests entering about 90% of the advertised capacity.

**ASSUMED example numbers:** a 4S, 5000 mAh LiPo (5.0 Ah), 3.7 V nominal per cell. The plan uses 80% of the capacity and keeps 20% in reserve.

- Pack nominal voltage: 4 × 3.7 V = 14.8 V.
- Stored energy: 14.8 V × 5.0 Ah = 74 Wh.
- Usable charge: 0.8 × 5.0 Ah = 4.0 Ah.
- Hover at an assumed 40 A average: 4.0 Ah ÷ 40 A = 0.1 h = 6 minutes. The discharge rate is 40 A ÷ 5.0 Ah = 8C.
- Cruise at an assumed 12 A average: 4.0 Ah ÷ 12 A ≈ 0.333 h ≈ 20 minutes.

In this assumed example, the same battery lasts more than three times longer in cruise than in hover. This shows why a VTOL aircraft keeps hover time short. Real results will differ because of voltage sag, temperature, wind and battery age, so flight logs should be used to correct the estimate.

Source: https://batteryuniversity.com/article/bu-402-what-is-c-rate ; https://ardupilot.org/copter/docs/failsafe-battery.html ; https://docs.px4.io/main/en/config/battery.html

## Battery monitoring and battery failsafe in ArduPilot

ArduPilot's battery failsafe triggers in two ways:

- **Voltage:** the battery stays below BATT_LOW_VOLT for more than 10 seconds. The default is 10.5 V; BATT_LOW_TIMER changes the time.
- **Capacity:** remaining capacity falls below BATT_LOW_MAH, which ArduPilot suggests setting to about 20% of capacity. For a 5000 mAh pack that is 1000.

Setting a threshold to 0 disables that check. A second, critical level uses BATT_CRT_VOLT and BATT_CRT_MAH. BATT_FS_LOW_ACT and BATT_FS_CRT_ACT choose the action:

| Value | Action |
|---|---|
| 0 | Warn only |
| 1 | Land |
| 2 | RTL (return to launch), or Land if no good position estimate |
| 3 | SmartRTL, else RTL, else Land |
| 4 | SmartRTL, else Land |
| 5 | Terminate (disarm motors) – called dangerous, rarely used |
| 6 | Jump to nearest DO_LAND_START, or RTL |
| 7 | Brake, or Land |

ArduPilot suggests RTL (2) for the low level and Land (1) for the critical level. Once triggered, the battery failsafe cannot be reset until the autopilot reboots, although the pilot can regain control by changing flight mode. PX4 combines load-compensated voltage with current integration; current integration cannot work alone and needs a fully charged battery at each boot.

Source: https://ardupilot.org/copter/docs/failsafe-battery.html ; https://docs.px4.io/main/en/config/battery.html

## Charging, storage and fire safety for lithium batteries

The University of Maryland drone lab's LiPo rules include:

- Follow the original manufacturer's charging instructions.
- Charge only inside a fire-resistant container.
- Check that the charger has sensed the battery correctly.
- Do not overcharge or excessively discharge batteries.
- Inspect batteries for damage before each use.
- Do not use damaged or bulging (swollen) batteries; dispose of them promptly.
- Keep batteries away from sharp objects.
- Connect with correct polarity.
- Do not mix battery types, or new and old batteries.
- Buy only from reputable manufacturers or suppliers.
- If a battery will sit unused for more than 14 days, use the charger's storage setting (3.7–3.8 V per cell).
- Store Li-Po batteries in a fire-resistant Li-Po bag or box, inside a flammable storage cabinet.

Battery University gives storage advice for Li-ion. Store at about 40% charge, which is about 3.82 V per cell at room temperature after resting. Storing at 3.7 V also gives long life for most Li-ion. Li-ion should never drop below about 2 V per cell, and a voltage near 2.50 V per cell can put the cell into sleep mode. Cells held below 2.00 V per cell for more than a week should be discarded. The recommended storage temperature for most batteries is 15 °C.

Storage charge matters. In Battery University's table for Li-cobalt, after one year at 25 °C, cells stored at 40% charge kept about 96% of their capacity. Cells stored at 100% kept about 80%.

Source: https://facilities.robotics.umd.edu/dronelab/safety/batteries.html ; https://batteryuniversity.com/article/bu-702-how-to-store-batteries
