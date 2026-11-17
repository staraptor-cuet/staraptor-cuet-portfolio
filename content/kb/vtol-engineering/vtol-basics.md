---
title: "Fixed-Wing VTOL UAV Basics"
topic: vtol-engineering
competition: none
source_url: https://docs.px4.io/main/en/frames_vtol/
last_verified: 2026-11-13
owner: research-team
visibility: public
---

## What a fixed-wing VTOL UAV is

A VTOL (vertical take-off and landing) UAV can take off and land vertically, without a runway. The PX4 autopilot documentation says that VTOL vehicles can fly either as a multicopter or as a fixed-wing vehicle. PX4 says a VTOL vehicle mainly uses multicopter mode for take-off and landing.

The ArduPilot documentation describes a QuadPlane as a combined fixed-wing and multicopter aircraft. ArduPilot lists these benefits of a QuadPlane:

- Vertical take-off and landing.
- Significantly greater speed and range of travel.
- The ability to hover and do copter-like tasks at the destination.

ArduPilot describes VTOL aircraft configurations by three variables:

- Whether the motors are under tilt control or not.
- How many motors there are, from one to 8 or more.
- Whether the aircraft's VTOL stance is horizontal, like a plane in normal flight, or vertical. Aircraft with a vertical stance are called tailsitters.

Source: https://docs.px4.io/main/en/flight_modes_vtol/index.html ; https://docs.px4.io/main/en/frames_vtol/ ; https://ardupilot.org/plane/docs/quadplane-overview.html

## Main VTOL configurations and trade-offs

The PX4 documentation lists three fixed-wing VTOL types. PX4 also states a general trade-off: as mechanical complexity increases, the vehicles become easier to fly, but cost and weight increase.

### Standard VTOL (quadplane)
- A standard VTOL uses separate rotors and flight controls for multicopter flight and for forward flight. It takes off and lands on its belly.
- Pros: it is the easiest type to control, because it has dedicated hover and forward-flight actuators. It can hover. Fuel engines can be used for forward-flight propulsion.
- Cons: the separate hover and forward-flight propulsion systems add weight.

### Tiltrotor
- The rotors swivel 90 degrees to move from multicopter to forward-flight orientation. A tiltrotor takes off and lands on its belly.
- Pros: a tiltrotor is easier to control in hover than a tailsitter, because it has more control authority.
- Cons: the motor tilts need extra actuators, and the tilting mechanism is mechanically complex.
- ArduPilot supports three tilt types: continuous tilt (any angle from straight up to straight forward), binary tilt (fully up or fully forward only) and vectored yaw (left and right rotors tilt separately to control yaw in hover).

### Tailsitter
- The rotors stay permanently in the fixed-wing position. The whole tailsitter takes off and lands on its tail.
- Pros: a tailsitter is simple and robust, with a minimal set of actuators.
- Cons: a tailsitter can be hard to control, especially in wind. The same actuators serve hover and forward flight, so efficiency in one phase is traded against the other.

### Tiltwing
The PX4 and ArduPilot pages used for this file do not describe tiltwing aircraft. Tiltwing details are not confirmed as of 2026-11-13.

Source: https://docs.px4.io/main/en/frames_vtol/ ; https://ardupilot.org/plane/docs/guide-tilt-rotor.html

## Flight phases and transition

A fixed-wing VTOL flight has these phases: vertical take-off, forward transition, wing-borne cruise, back transition, and vertical landing. In PX4, the pilot can start a transition with an RC switch, or PX4 can start one automatically in missions or other auto modes.

### Forward transition (hover to wing-borne flight)
In ArduPilot QuadPlane, the VTOL motors keep supplying lift and stability until the aircraft reaches the AIRSPEED_MIN airspeed. After that, VTOL motor output fades over Q_TRANSITION_MS, which is 5,000 ms (5 s) by default. If Q_TRANS_FAIL is not zero, the transition is cancelled when that time passes before AIRSPEED_MIN is reached. Q_TRANS_FAIL is 0 (no timeout) by default.

An ArduPilot tiltrotor tilts its motors to Q_TILT_MAX to build forward airspeed. An ArduPilot tailsitter pitches its nose down; Q_TAILSIT_ANGLE sets how far the nose must pitch down before the transition to forward flight is complete.

### Back transition (wing-borne flight to hover)
In ArduPilot, forward thrust stops immediately. Pitch is limited to 0 degrees at first. Over Q_BACKTRANS_MS, the limit relaxes to the smaller of Q_A_ANGLE_MAX and PTCH_LIM_MAX_DEG.

In PX4, the controller pitches the nose up when braking falls short of the expected deceleration (VT_B_DEC_MSS). The back transition ends when the horizontal speed reaches multicopter cruise speed or when VT_B_TRANS_DUR runs out, whichever comes first. During this period, PX4 controls only altitude, not position, so some drift can occur.

### Why transition is the risky phase
- ArduPilot warns that an immediate stall will occur without enough airspeed.
- A downwind transition with a short transition time and no airspeed sensor can stall a non-tailsitter.
- ArduPilot warns that battery sag below 3.0 V per cell (LiPo) and resulting battery damage is possible.
- ArduPilot notes that the aircraft can gain altitude while it decelerates during a back transition.

Source: https://ardupilot.org/plane/docs/quadplane-transitions.html ; https://ardupilot.org/plane/docs/guide-tailsitter.html ; https://docs.px4.io/main/en/config_vtol/vtol_back_transition_tuning.html ; https://docs.px4.io/main/en/frames_vtol/

## Lift, wing loading and stall speed

NASA Glenn's Beginner's Guide to Aeronautics gives the lift equation:

L = CL × (rho × V² / 2) × S

| Symbol | Meaning | Unit |
|---|---|---|
| L | lift force | N |
| rho | air density | kg/m³ |
| V | velocity (airspeed) | m/s |
| S | wing area (NASA writes it as A) | m² |
| CL | lift coefficient: one number that covers the effects of body shape, inclination, air viscosity and compressibility; in general found by experiment | none |

NASA calls the term rho × V² / 2 the dynamic pressure.

### Wing loading and stall speed (derived from the lift equation, not quoted from NASA)
Wing loading is W / S: the aircraft weight W (in N) divided by the wing area S. In level flight, lift equals weight. Setting L = W and CL = CLmax (the maximum lift coefficient) and solving the lift equation for V gives the stall speed:

Vstall = sqrt(2W / (rho × S × CLmax))

A higher wing loading or a lower CLmax gives a higher stall speed.

### Worked example (ASSUMED numbers, not any real aircraft)
- Assumed: mass 10 kg, so W = 10 × 9.81 = 98.1 N. Wing area S = 0.8 m². CLmax = 1.2. Air density rho = 1.225 kg/m³.
- Wing loading = 98.1 / 0.8 = 122.6 N/m² (about 12.5 kg/m²).
- Vstall = sqrt(196.2 / (1.225 × 0.8 × 1.2)) = sqrt(196.2 / 1.176) = sqrt(166.8) ≈ 12.9 m/s.

This matters for a quadplane because ArduPilot keeps the VTOL motors supplying lift until the AIRSPEED_MIN airspeed is reached, and warns of an immediate stall without enough airspeed.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/ ; https://ardupilot.org/plane/docs/quadplane-transitions.html

## Airfoils and the Eppler E205

NASA Glenn's lift-equation page says the lift coefficient CL depends on body shape and inclination (as well as air viscosity and compressibility), and that CL is in general found by experiment. A wing's cross-section shape (airfoil) is part of that body shape.

The UIUC Airfoil Coordinates Database (hosted at m-selig.ae.illinois.edu) holds coordinates for approximately 1,650 airfoils (Version 2.0). The database's entry for the Eppler E205 reads "Eppler E205 low Reynolds number airfoil". The E205 entry provides:

- a coordinate file (e205.dat);
- a plot image (e205.gif);
- a link labelled "Low Reynolds number data".

The Eppler E205's maximum thickness and camber values are not confirmed as of 2026-11-13.

Source: https://m-selig.ae.illinois.edu/ads/coord_database.html ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/

## Endurance and range basics for electric VTOL aircraft

An electric VTOL aircraft's flight time depends on how much battery energy it carries and how much electrical power it draws. The formulas below are general definitions, not quoted from a cited page.

### Simple energy-budget formulas
- Battery energy (Wh) = nominal voltage (V) × capacity (Ah).
- Usable energy (Wh) = battery energy × usable fraction. ArduPilot warns that LiPo battery sag below 3.0 V per cell can damage the battery, so batteries should not be fully drained.
- Endurance (h) = usable energy (Wh) / average power (W).
- Range (m) = endurance (s) × cruise airspeed (m/s), assuming no wind.

### Hover and transition cost
ArduPilot names significantly greater speed and range as benefits a QuadPlane has over a multicopter. ArduPilot also warns about battery sag during transition. Keeping hover and transition time short helps endurance.

### Example (ASSUMED numbers, not any real aircraft)
- Battery: 22.2 V × 10 Ah = 222 Wh. Usable fraction 80% gives 177.6 Wh.
- Cruise power 200 W: endurance = 177.6 / 200 = 0.888 h, about 53 min. At 20 m/s, range ≈ 3,197 s × 20 m/s ≈ 63.9 km.
- Hover power 1,500 W: endurance = 177.6 / 1,500 = 0.118 h, about 7.1 min.

These are idealised estimates. They ignore wind, climbs, transitions and reserves.

Source: https://ardupilot.org/plane/docs/quadplane-overview.html ; https://ardupilot.org/plane/docs/quadplane-transitions.html

## Glossary of VTOL UAV terms

- **Quadplane:** in ArduPilot, a combined fixed-wing and multicopter aircraft. The PX4 "standard VTOL" uses separate rotors for multicopter flight and forward flight.
- **Tailsitter:** a VTOL aircraft whose rotors stay in the fixed-wing position and which takes off and lands on its tail (PX4).
- **Tiltrotor:** a VTOL aircraft whose rotors swivel 90 degrees between multicopter and forward-flight orientation (PX4).
- **Transition:** the change from multicopter flight to fixed-wing flight (forward transition) or back (back transition).
- **Lift coefficient (CL):** a number that covers the effects of body shape, inclination, air viscosity and compressibility on lift (NASA).
- **Dynamic pressure:** density times the square of the velocity divided by two (NASA).
- **Stall:** ArduPilot warns that a transition without sufficient airspeed causes an immediate stall.
- **CG (centre of gravity):** the ArduPilot tailsitter guide notes that too much weight in the belly or on the back can make a tailsitter lean in hover.
- **Fail-safe:** an automatic response to a fault. If a failsafe occurs during an ArduPilot QuadPlane VTOL take-off, the aircraft immediately switches to QLAND mode.

Source: https://docs.px4.io/main/en/frames_vtol/ ; https://ardupilot.org/plane/docs/quadplane-overview.html ; https://ardupilot.org/plane/docs/quadplane-transitions.html ; https://ardupilot.org/plane/docs/guide-tailsitter.html ; https://ardupilot.org/plane/docs/quadplane-flying.html ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/
