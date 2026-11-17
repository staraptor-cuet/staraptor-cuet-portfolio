---
title: "Aerodynamics and flight mechanics for small UAVs"
topic: vtol-engineering
competition: none
source_url: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/four-forces-on-an-airplane/
last_verified: 2026-11-13
owner: research-team
visibility: public
---

## The four forces on an aircraft in flight

Four forces act on an aircraft in flight: weight, lift, drag and thrust. NASA Glenn Research Center describes them like this:

- **Weight** always points toward the centre of the Earth.
- **Lift** is the force the aircraft makes to overcome weight.
- **Drag** points along the flight direction but against it. Drag is the air resisting the motion.
- **Thrust** is the force the propulsion system makes to overcome drag. On a small electric UAV, the propellers make the thrust.

When the four forces are balanced, the aircraft cruises at a constant velocity. In flight, the weight and the position of the centre of gravity can change. So the pilot or the autopilot has to keep adjusting the controls to keep the aircraft balanced. NASA calls this balanced state "trimmed."

These four forces are the starting point for every topic below. Drag and the lift-to-drag ratio decide how much thrust and energy a flight needs. Where the forces act, compared with the centre of gravity, decides whether the aircraft holds a steady attitude or tumbles.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/four-forces-on-an-airplane/

## The drag equation

NASA Glenn gives the drag equation as:

**D = Cd × (ρ × V² / 2) × A**

| Symbol | Meaning |
|---|---|
| D | Drag force (newtons) |
| Cd | Drag coefficient, a number with no units |
| ρ (rho) | Air density (kg/m³) |
| V | Airspeed (m/s) |
| A | Reference area (m²) |

The term ρ × V² / 2 is called the **dynamic pressure**. The same term appears in Bernoulli's equation. Speed enters the equation squared, so twice the airspeed gives four times the drag, if Cd stays the same.

The **reference area** can be any area that is easy to measure, such as the wing area or the frontal area. The reported Cd must say which area was used. The drag force itself does not change with this choice. Only the value of the coefficient changes.

The drag coefficient packs several effects into one number: body shape, how the body is tilted to the airflow, air viscosity (the "stickiness" of air) and compressibility. NASA calls this dependence "very complex." For this reason Cd is almost always determined by experiment in a wind tunnel.

**ASSUMED example numbers:** Cd = 0.03, ρ = 1.2 kg/m³, V = 15 m/s, A = 0.5 m².
D = 0.03 × 1.2 × 225 × 0.5 / 2 = 2.025 N. At 30 m/s the drag rises to 8.1 N, four times as much.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/

## Types of drag

NASA Glenn says the total drag coefficient includes four parts:

- **Skin friction drag:** air rubbing along the surface.
- **Form drag:** drag from the shape of the body.
- **Wave drag:** drag linked to shock waves at high speed. Small, slow UAVs do not normally meet it.
- **Induced drag:** drag that exists only because a wing of finite length makes lift.

Aviation texts often group skin friction and form drag under the name parasite drag. This is drag that does not come from making lift. The NASA drag-equation page used here does not give a split between parasite drag and induced drag. It lists all of these as parts of Cd.

**Lift-induced drag in power terms.** MIT course notes on aircraft performance write the power needed to fly as two parts: a "parasite power" part and an "induced power" part. In that equation the parasite part grows with the cube of airspeed. The induced part grows with the square of the load factor and the square of the weight. It falls as airspeed, wing area and aspect ratio go up. So a slow, heavy aircraft spends more of its power on induced drag. A fast aircraft spends more on parasite drag.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/ ; https://ocw.mit.edu/courses/16-885j-aircraft-systems-engineering-fall-2004/8f0df6c49fdf576015894db9b4f72745_aircraft_murman.pdf

## Induced drag and wingtip vortices

A wing that makes lift has higher pressure below it than above it. At the wing tips, air flows around the tip from the high-pressure side to the low-pressure side. NASA Glenn explains that this forms a pair of counter-rotating vortices (swirls of air) at the wing tips. These **wingtip vortices** are strongest near the tips. The flow they cause reduces the wing's effective angle of attack and tilts the wing's aerodynamic force backward. The backward part of that force is called **induced drag**. It exists only on lifting wings of finite span.

NASA gives the induced drag coefficient as:

**Cdi = Cl² / (π × AR × e)**

- Cl is the lift coefficient.
- AR is the aspect ratio.
- e is the efficiency factor. e = 1.0 for an elliptical lift distribution. NASA gives e = 0.7 for a rectangular wing.

Cl is squared in this formula. So induced drag rises quickly when the wing works hard, for example at low speed or in a tight turn.

**ASSUMED example numbers:** Cl = 0.5, e = 0.7.
- AR = 8: Cdi = 0.25 / (3.1416 × 8 × 0.7) = 0.25 / 17.59 = 0.0142.
- AR = 12: Cdi = 0.25 / 26.39 = 0.0095.

To reduce induced drag, wing tips are often bent upward to form **winglets**. Richard Whitcomb of NASA Langley studied winglets for this purpose.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/induced-drag-coefficient/

## Lift-to-drag ratio and gliding

The **lift-to-drag ratio (L/D)** is lift divided by drag. It also equals Cl divided by Cd. NASA Glenn calls L/D an aerodynamic efficiency factor for the aircraft.

What a high L/D gives:

- **Glide:** In an unpowered glide, the tangent of the glide angle equals D/L. A higher L/D means a shallower glide. From the same height, the aircraft covers more ground.
- **Range:** NASA says designers of gliders and cruising aircraft want a high L/D to get the most distance. A high-L/D aircraft can also carry a large payload for a long time over a long distance.

**ASSUMED example numbers:** A UAV with L/D = 10 loses power at 100 m height in still air.
- Glide angle: tan(angle) = 1/10, so the angle is about 5.7 degrees.
- Ground distance ≈ height × L/D = 100 × 10 = 1,000 m.

With L/D = 15, the same glide would cover about 1,500 m. The NASA page gives no typical L/D values, so none are listed here.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-to-drag-ratio/

## Aspect ratio and wing geometry terms

NASA Glenn defines these wing terms:

- **Span (s):** the distance from one wing tip to the other.
- **Chord:** the distance from the leading edge (front) to the trailing edge (back) of the wing. On modern aircraft the chord can change along the span.
- **Aspect ratio (AR):** the span squared divided by the wing area: AR = s² / A. For a rectangular wing, this equals span divided by chord. High-aspect-ratio wings are long and slender, like those of high-performance gliders.
- **Sweep:** on most modern aircraft, the leading and trailing edges may be angled backward. This is called sweep.
- **Dihedral:** the upward angle of the wings from the root to the tips. NASA says dihedral is added for roll stability: a wing with some dihedral tends to return to level after a small roll disturbance.

NASA states that a higher aspect ratio gives lower drag, a higher lift-to-drag ratio and a better glide angle. This agrees with the induced drag formula, where AR is in the denominator.

MIT course notes define the **mean aerodynamic chord (MAC)** as the root-mean-square average chord. For most wings, the MAC is very close to the simple average chord, which is wing area divided by span (c = S/b). Lengthwise positions such as the centre of gravity and the neutral point are usually measured from the leading edge of the MAC.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/wing-geometry/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/induced-drag-coefficient/ ; https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/ffbff8a4985ee6ea819afb90c40834e3_spl8.pdf

## Reynolds number and low-speed small aircraft

The **Reynolds number (Re)** compares inertial forces with viscous forces in a flow. Inertial forces resist changes in motion. Viscous forces come from the "stickiness" of the air. NASA Glenn gives:

**Re = ρ × V × L / μ**, or **Re = V × L / ν**, where ν = μ / ρ.

- ρ is the air density.
- V is the speed.
- L is a length scale. For a wing, this is usually the chord.
- μ is the dynamic viscosity.
- ν is the kinematic viscosity.

NASA's guidance on what the number means:

- At a high Re (on the order of 10 million), viscous forces are small, and the flow can be treated as nearly inviscid (without viscosity).
- At a low Re (on the order of 100), viscous forces must be taken into account.

Re is proportional to speed times length. A small UAV has both a short chord and a low speed, so its Reynolds number is much lower than that of a full-size aircraft. Viscous effects then matter more.

**ASSUMED example numbers:**
- Small UAV: V = 15 m/s, chord = 0.25 m, so V × L = 3.75 m²/s.
- Airliner: V = 250 m/s, chord = 5 m, so V × L = 1,250 m²/s.

In the same air, the airliner's Re is 1,250 / 3.75 ≈ 333 times larger.

Source: https://www.grc.nasa.gov/www/k-12/airplane/reynolds.html

## Angle of attack and stall

The **angle of attack** is the angle between the wing's chord line and the direction of flight. NASA Glenn explains:

- For thin airfoils at small angles, within about ±10 degrees, lift is directly proportional to the angle of attack.
- For thin airfoils at subsonic speed and small angles, the lift coefficient is Cl = 2π × a, where a is the angle in radians. **ASSUMED example numbers:** a = 5 degrees = 0.0873 rad gives Cl ≈ 6.283 × 0.0873 ≈ 0.55.
- Beyond this small-angle range, the link between angle and lift becomes much more complicated. Real lift coefficients come from wind tunnel tests and computer analysis.

**Stall:** At high angles, the **boundary layer** (the thin layer of slow air next to the surface) can lift off or "separate" from the wing. The wing then behaves as if it had a different shape. NASA says boundary-layer separation explains why wings "abruptly lose lift at high angles." This sudden loss of lift is called a stall.

NASA's example shows two airfoils of the same shape. The one at 10 degrees is not stalled. The one at 20 degrees is stalled. The exact stall angle is very hard to predict mathematically, so it is usually found in wind tunnel tests. It depends on the airfoil, so no single stall angle applies to every wing.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/foilinc/

## The three axes: roll, pitch and yaw

NASA Glenn explains that an aircraft rotates about its **centre of gravity**, the average location of its mass. Three axes pass through the centre of gravity, and each axis is perpendicular to the other two.

| Motion | Axis | What moves | Main control surface |
|---|---|---|---|
| Roll | Points toward the nose | Wing tips go up and down | Ailerons |
| Pitch | Points toward the right wing tip | Nose goes up and down | Elevator |
| Yaw | Points toward the bottom of the aircraft, perpendicular to the wings | Nose goes left and right | Rudder |

Control surfaces push on the air at points away from the centre of gravity. The resulting forces create torques (turning moments) that rotate the aircraft about these axes.

**Ailerons** are hinged surfaces on the outer part of each wing. They usually move in opposite directions: when one aileron goes up, the other goes down. The lowered aileron increases lift on its wing. The raised aileron reduces lift on the other wing. The unequal lift rolls the aircraft. NASA notes that an aircraft turns because of the bank created by the ailerons, not because of the rudder.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aircraft-rotations/ ; https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ailerons/

## Flaps, slats and spoilers

NASA Glenn describes these high-lift and lift-dumping devices:

- **Flaps** sit on the trailing edge (back) of the wing. **Slats** sit on the leading edge (front). Both slide out on tracks in the wing.
- Moving the flaps backward and the slats forward increases the wing area.
- Tilting the slat's leading edge and the flap's trailing edge downward increases the effective curve (camber) of the airfoil and increases lift.
- Airspeed is low during takeoff and landing. Flaps and slats are used in these phases to keep lift high at low speed.
- An extended flap has a large surface facing backward. This adds drag, which helps slow the aircraft for landing.
- **Spoilers** are panels raised on top of the wing after touchdown. They reduce lift and add drag to slow the aircraft further.

The NASA page does not give numbers for how much flaps lower the landing speed, so none are given here.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/flaps-and-slats/

## Centre of pressure and aerodynamic centre

NASA Glenn defines the **centre of pressure** as the average location of the pressure acting on a body. It plays the same role for air pressure that the centre of gravity plays for weight. The aerodynamic force (lift and drag) can be treated as acting through the centre of pressure.

When the angle of attack changes, the pressure at every point on the airfoil changes. So the centre of pressure moves. Early aircraft designers struggled because the amount of this movement, and sometimes even its direction, was different for each design. The pressure pattern also creates a twisting torque. A flying airfoil that is not held in some way would flip over.

To avoid working with a moving point, engineers apply the aerodynamic force at the **aerodynamic centre**. At this point, the twisting moment stays nearly constant as the angle of attack changes. For most low-speed airfoils, the aerodynamic centre is about a quarter of the chord back from the leading edge. For supersonic airfoils, it is nearer the half-chord point.

NASA states that knowing where the centre of pressure is located is needed to trim an aircraft. It is also needed to make model rockets and kites stable.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/center-of-pressure/

## Static stability, neutral point and static margin

**Pitch stability** is an aircraft's natural tendency to hold its angle of attack and airspeed. MIT Unified Engineering notes say that the horizontal tail's size and position, together with the centre of gravity (CG) position, are the main factors controlling pitch stability.

- Moving the CG forward increases stability. The aircraft resists changes in angle of attack and speed more strongly.
- Moving the CG backward decreases stability.
- One particular CG position gives neutral stability. This position is called the **neutral point (NP)**.

The **static margin (S.M.)** measures the gap between the two points:

**S.M. = (x_np − x_cg) / c**

Here x_np and x_cg are the positions of the neutral point and the CG, measured from the leading edge of the mean aerodynamic chord, and c is the average chord.

- A negative S.M. means the CG is behind the neutral point. The aircraft is then unstable in pitch and very hard or impossible to control. So the neutral point is treated as the practical rearmost CG limit.
- A very large S.M. causes large pitch trim changes whenever the airspeed changes.
- The notes recommend a small positive S.M. of **+0.05 to +0.15**.

**ASSUMED example numbers:** mean chord = 0.30 m, neutral point = 0.12 m, CG = 0.09 m.
S.M. = (0.12 − 0.09) / 0.30 = 0.10. This is inside the recommended range.

Source: https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/ffbff8a4985ee6ea819afb90c40834e3_spl8.pdf

## Tail sizing: horizontal and vertical stabilisers

MIT Unified Engineering notes give simple rules for sizing the two tail surfaces.

**Horizontal tail.** The size of the horizontal tail and its distance from the CG mainly set where the neutral point is. Its effectiveness is measured by the **horizontal tail volume coefficient**:

**Vh = (Sh × ℓh) / (S × c)**

- Sh is the horizontal tail area.
- ℓh is the distance from the CG to the tail's average quarter-chord point.
- S is the wing area, and c is the average chord.

Well-behaved aircraft typically have Vh between **0.30 and 0.60**. If Vh is too small, three problems appear:
- Pitch behaviour becomes very sensitive to the CG position.
- The aircraft resists gusts and other upsets poorly.
- The nose tends to "wander" in pitch, which makes precise control hard.

**Vertical tail.** The main job of the vertical tail is **yaw damping**, which makes side-to-side yaw swings die out. It also gives yaw stability. Its effectiveness is measured by:

**Vv = (Sv × ℓv) / (S × b)**

Here Sv is the vertical tail area, ℓv is its distance from the CG, and b is the wing span. Typical values are **0.02 to 0.05**. If Vv is too small, the aircraft tends to "wallow" in a yaw oscillation called **Dutch roll** when the pilot gives rudder or aileron inputs.

One common design approach is to copy the Vh and Vv values of an existing aircraft that is known to fly well.

Source: https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/ffbff8a4985ee6ea819afb90c40834e3_spl8.pdf

## Dihedral and spiral stability

**Spiral stability** describes what an aircraft does with its bank angle when no one touches the controls. MIT Unified Engineering notes explain:

- A spirally unstable aircraft keeps increasing its bank angle at some rate and needs constant attention.
- A spirally stable aircraft rolls back upright by itself.

The notes use the **spiral parameter B** (named after Blaine Rawdon of Douglas Aircraft):

**B = (ℓv × Υ) / (b × CL)**, with the dihedral angle Υ in degrees.

| B value | Behaviour |
|---|---|
| B > 5 | Spirally stable |
| B = 5 | Spirally neutral |
| B < 5 | Spirally unstable |

The dihedral angle is the main design setting used to adjust B. Spiral stability is not a hard requirement, and most aircraft are in fact spirally unstable. Level flight is then kept by the pilot or by a wing-levelling autopilot, as long as the instability is slow enough. The notes say that a radio-controlled aircraft that flies stably "hands-off" must be spirally stable. A small instability (B = 3 to 4) does not cause major problems for an experienced pilot.

On aircraft with only a rudder and an elevator, the rudder creates a sideslip, and the sideslip combines with dihedral to roll the aircraft. For enough roll authority, the notes give **Vv × B = 0.10 to 0.20**. The 0.10 value likely gives marginal roll control; 0.20 gives very effective control.

Source: https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/ffbff8a4985ee6ea819afb90c40834e3_spl8.pdf

## Turns, bank angle and load factor

In a level turn, the aircraft banks so that part of its lift pulls it around the circle. MIT aircraft performance notes give:

- Vertical balance: W = L × cos(φ), where φ is the bank angle.
- **Load factor: n = L / W = 1 / cos(φ)**, measured in "g's".
- Turn radius: **R = V² / (g × √(n² − 1))**.
- Turn rate: ω = g × √(n² − 1) / V.

The same notes write the flight speed as V = √(2 × n × W / (ρ × S × CL)). At the maximum lift coefficient, this means the stall speed rises by a factor of √n when the wing carries n times the weight. Aerospaceweb gives an example consistent with this: a minimum speed of 120 knots at 1 g rises to 360 knots at 9 g. Aerospaceweb also notes that a 60-degree bank in a level turn gives 2 g, that the minimum flying speed begins to rise rapidly beyond that, and that it approaches infinity as the bank approaches 90 degrees.

**ASSUMED example numbers:** bank angle 45 degrees, V = 15 m/s, wings-level stall speed 10 m/s, g = 9.81 m/s².
- n = 1 / cos(45°) = 1 / 0.7071 = 1.414 g
- R = 225 / (9.81 × √(2.0 − 1)) = 225 / 9.81 = 22.9 m
- Stall speed in the turn = 10 × √1.414 = 10 × 1.189 = 11.9 m/s

At a 60-degree bank, n = 1 / 0.5 = 2.0 g, and the stall speed becomes 10 × 1.414 = 14.1 m/s. That is very close to the 15 m/s flying speed in this example.

Source: https://ocw.mit.edu/courses/16-885j-aircraft-systems-engineering-fall-2004/8f0df6c49fdf576015894db9b4f72745_aircraft_murman.pdf ; https://aerospaceweb.org/question/performance/q0146.shtml

## Sideslip in turns and aileron use

A turning wing does not meet the air at the same speed along its whole span. MIT Unified Engineering notes explain that in a turn, the outer wing tip moves faster than the inner tip. The relative speed changes in a straight line across the span. The faster outer wing makes more lift. This creates a rolling moment that tends to increase the bank angle and steepen the turn.

The notes also give the bank angle needed for a steady level turn:

**φ = arctan(V² / (g × R))**, where R is the turn radius.

How aircraft cancel this inward rolling moment:

- On most aircraft, a very slight outward aileron deflection cancels it.
- An aircraft without ailerons can cancel it only with a steady sideslip, with the nose pointing slightly outside the turn circle. The sideslip angle needed is inversely proportional to the dihedral angle. With less dihedral, a larger sideslip is needed.
- Sideslip produces drag. In a slow turn at a high lift coefficient, the dihedral must be large enough to keep this sideslip small.

**ASSUMED example numbers:** V = 15 m/s, R = 30 m, g = 9.81 m/s².
V² / (g × R) = 225 / 294.3 = 0.765, so φ = arctan(0.765) ≈ 37.4 degrees.

Source: https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/ffbff8a4985ee6ea819afb90c40834e3_spl8.pdf

## Ground effect

**Ground effect** is the change in a wing's aerodynamic behaviour when the wing flies close to the ground. A NASA Langley wind-tunnel study (NASA TN D-926, 1961) of thick, highly cambered rectangular wings of low aspect ratio tested aspect ratios of 1, 2, 4 and 6. It found that as the ground got closer, the wings showed:

- an increase in lift-curve slope (more lift gained for each degree of angle of attack)
- a reduction in induced drag
- a higher lift-to-drag ratio, because of the lower induced drag

The same study found that the lift coefficient at 0 degrees angle of attack stayed nearly constant. The results generally agreed with Wieselsberger's ground-effect theory.

The induced drag section above links induced drag to the wingtip vortices. Ground effect reduces induced drag, so a wing near the ground can need less power to fly. That NASA abstract gives no height-to-span thresholds, so no fixed height for the onset of ground effect is given here.

Source: https://ntrs.nasa.gov/citations/19980231058

## Gusts, upsets and small aircraft

Wind gusts and other disturbances upset the attitude of an aircraft. The design rules above decide how a small aircraft responds:

- **Pitch:** MIT notes say that if the horizontal tail volume coefficient Vh is too small, the aircraft resists gusts and other upsets poorly. It also wanders in pitch attitude. With a positive static margin, the aircraft's natural response after a nose-up or nose-down upset returns it toward trimmed flight. With a negative static margin, the upset grows.
- **Yaw:** A vertical tail volume coefficient Vv that is too small leads to Dutch roll oscillation after rudder or aileron inputs.
- **Roll:** A spirally unstable aircraft keeps increasing its bank angle. An autopilot or a pilot must then hold the wings level.
- **Stall margin in manoeuvres:** A turn or pull-up that raises the load factor also raises the stall speed by √n. This leaves less margin at low speed.

The sources used for this file give no numbers for gust loads on small UAVs, so none are stated here.

Source: https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/ffbff8a4985ee6ea819afb90c40834e3_spl8.pdf ; https://ocw.mit.edu/courses/16-885j-aircraft-systems-engineering-fall-2004/8f0df6c49fdf576015894db9b4f72745_aircraft_murman.pdf
