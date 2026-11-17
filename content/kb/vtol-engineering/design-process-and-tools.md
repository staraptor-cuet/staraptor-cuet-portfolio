---
title: "How a UAV is designed, analysed and tested"
topic: vtol-engineering
competition: none
source_url: https://www.nasa.gov/reference/3-0-nasa-program-project-life-cycle/
last_verified: 2026-11-13
owner: research-team
visibility: public
---

## Mission requirements are the starting point

The design of an aircraft, including a small UAV (uncrewed aerial vehicle), starts with requirements, not with a shape. A requirement is a clear statement of what the system must do, such as carry a given payload, fly a given distance or take off vertically. NASA's systems engineering guidance tells teams to first set stakeholder expectations. Stakeholders are the people who will use, pay for or judge the system. The guidance then asks one question: "Are we building the right product for our users and other stakeholders?"

In NASA's process, early studies produce a draft set of key high-level requirements. A later phase refines that draft into baseline requirements. A baseline is an agreed version that is only changed through a controlled process. NASA also separates two checks:

- **Verification** asks whether the product meets its written requirements.
- **Validation** asks whether the product serves its intended purpose.

NASA notes that design changes cost more the later they happen. Checking requirements early is therefore cheaper than fixing the aircraft after it is built.

Source: https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/

## Design stages: conceptual, preliminary and detailed

NASA divides a project into phases. Each phase decides different things.

| NASA phase | Name | What is decided |
|---|---|---|
| Pre-Phase A | Concept Studies | A broad range of ideas and alternatives |
| Phase A | Concept and Technology Development | Whether the system is feasible, the final concept and system-level requirements |
| Phase B | Preliminary Design and Technology Completion | Preliminary designs and an initial project baseline, with risks reduced |
| Phase C | Final Design and Fabrication | The detailed design, then building the hardware and writing the software |
| Phase D | Assembly, Integration and Test, Launch | Putting the system together, then verifying and validating it |
| Phase E | Operations and Sustainment | Running the mission |
| Phase F | Closeout | Retiring the system and analysing the data |

Engineers often call these stages conceptual design, preliminary design and detailed design. For a small UAV, the conceptual stage compares overall layouts. The preliminary stage sizes the wing, the motors and the battery. The detailed stage defines every part well enough to manufacture it. NASA describes the design as maturing at each phase, and work at one level of the system is repeated at higher and lower levels.

Source: https://www.nasa.gov/reference/3-0-nasa-program-project-life-cycle/ ; https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/

## Design reviews: SRR, PDR, CDR and readiness reviews

A design review is a formal meeting where other people check the design before work moves on. NASA uses a series of named reviews:

- **SRR (System Requirements Review)** takes place in Phase A. After the SRR, the requirements are placed under formal configuration control. Configuration control means that changes must be recorded and approved.
- **PDR (Preliminary Design Review)** ends Phase B. The PDR shows how the requirements have been turned into designs. Design issues should be resolved before final design begins. NASA's verification plan is baselined at the PDR.
- **CDR (Critical Design Review)** takes place in Phase C. A CDR for each end item should happen before fabrication or coding starts.
- **TRR (Test Readiness Review), ORR (Operational Readiness Review) and FRR (Flight Readiness Review)** take place in Phase D, before testing and flight.

The main idea is simple. Each review is a gate. Problems found at a gate are cheaper to fix than problems found after parts are made or after a flight.

Source: https://www.nasa.gov/reference/3-0-nasa-program-project-life-cycle/ ; https://www.nasa.gov/reference/6-0-crosscutting-technical-management/

## Trade studies

A trade study compares several design options against the same criteria and picks the best balance. NASA calls design trade studies "an important part of the systems engineering process." Their aim is to find designs that best balance cost and effectiveness. NASA also says systems engineering is about tradeoffs and compromises. It needs a broad view across disciplines, not the view of a single discipline.

For a fixed-wing VTOL (vertical take-off and landing) UAV, typical trade-study questions include:

- Which VTOL layout to use, for example a quadplane or a tailsitter. The knowledge base covers the layouts in another file.
- Which battery size to use. A larger battery gives more energy but adds weight.
- Which wing area to use. A larger wing lowers stall speed but adds weight and drag.
- Which material and manufacturing method to use.

A trade study usually lists the options in a table, scores each option against the requirements, and records why the winner was chosen. NASA's process repeats this work as the design matures, so an early choice can be revisited if new data shows that it was wrong.

Source: https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/

## Weight estimation and the weight budget

A weight budget is a list of every component with its mass. The total must stay below the limit that the wing and the lift motors can carry. The ArduPilot guide to building a QuadPlane says the frame must carry the extra lifting motors and power system, plus any payload. It also says the lifting motors need enough power for the total airframe weight, plus the extra downward load that the wing causes in a horizontal VTOL stance.

The same ArduPilot page recommends eCalc for choosing motors, ESCs (electronic speed controllers), batteries and propellers. It notes that brushless motors vary widely in power-to-weight ratio, so motor choice affects the weight budget. eCalc is a web tool that has offered its services since 2004. It simulates electric drives made of a motor, ESC, battery and propeller. Its calculators include:

- **propCalc** for airplane propulsion
- **xcopterCalc** for multirotors
- **cgCalc** for the centre of gravity, neutral point and aerodynamic centre
- **w&bCalc** for weight and balance

The eCalc home page gives no measured accuracy figures. Its results are therefore estimates that a thrust test should confirm.

Source: https://ardupilot.org/plane/docs/quadplane-building.html ; https://www.ecalc.ch/

## Choosing wing area

Another file in this knowledge base gives the lift formula, wing loading (weight divided by wing area) and stall speed (the slowest speed at which the wing can hold the aircraft up). Designers use those relations in the opposite direction. They first choose the stall speed they need and the maximum lift coefficient of the wing. With the weight from the weight budget, they then calculate the smallest wing area that meets that stall speed.

This step links the weight budget, the airfoil choice and the wing size. If the weight grows, the required wing area grows. A larger maximum lift coefficient from a different airfoil lets the wing be smaller. For this reason, wing sizing is repeated whenever the weight estimate or the airfoil data changes, in line with NASA's description of a design that matures step by step. eCalc's cgCalc can calculate the centre of gravity, the neutral point (NP) and the aerodynamic centre (AC) of an airplane before its first flight, and it supports wings made of up to five panels.

Source: https://www.ecalc.ch/ ; https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/

## Airfoil selection: databases, XFOIL and polars

An airfoil is the cross-section shape of a wing. Designers often start from published shapes. The UIUC Airfoil Coordinates Database, credited to Michael Selig at the University of Illinois at Urbana-Champaign, lists about 1,650 airfoils (Version 2.0). Its files use the Selig ".dat" format. The first line holds the name. The coordinates then run from the upper-surface trailing edge, around the leading edge, to the lower-surface trailing edge.

XFOIL is a program by Mark Drela, with Harold Youngren also credited, for designing and analysing subsonic airfoils. It is released under the GNU GPL licence. XFOIL can run viscous analysis, which includes friction, or inviscid analysis, which leaves friction out. It models transition (where smooth airflow turns turbulent), laminar separation bubbles, limited trailing-edge separation, and lift and drag slightly beyond the maximum lift coefficient. It accepts fixed or varying Reynolds and Mach numbers.

A **polar** is a set of results for one airfoil at one Reynolds number. It lists the lift coefficient, drag coefficient and pitching moment over a range of angles of attack. XFOIL can save several polars and plot them together, so designers can compare airfoils.

Source: https://m-selig.ae.illinois.edu/ads/coord_database.html ; https://web.mit.edu/drela/Public/web/xfoil/

## 3D aerodynamic tools: XFLR5, OpenVSP and CFD

Airfoil results describe a 2D section only. A full wing or aircraft needs 3D tools.

- **XFLR5** is described on its project page as "an analysis tool for airfoils, wings and planes" and as "a potential flow solver." Potential-flow methods leave out most friction effects, which makes them fast. XFLR5 is licensed under GPLv3.
- **OpenVSP** is described as "a parametric aircraft geometry tool." This means the 3D model is built from engineering parameters such as span and sweep. OpenVSP comes from NASA and was released as open source on 10 January 2012 under the NASA Open Source Agreement 1.3. Its tools include VSPAERO, which performs "vortex lattice or panel method based aerodynamic and flight dynamic analysis." Other tools calculate mass properties, such as the centre of gravity and moment of inertia, and estimate parasite drag from wetted area and skin friction.
- **CFD (computational fluid dynamics)** solves the flow equations on a fine 3D mesh. CFD can capture viscous effects and complex flow, but it costs much more computer time.

Designers usually run the fast vortex-lattice or panel tools many times during preliminary design. They then use CFD on a few final shapes.

Source: https://sourceforge.net/projects/xflr5/ ; https://openvsp.org/learn.shtml ; https://en.wikipedia.org/wiki/OpenVSP

## A CFD workflow step by step

A typical CFD study in a tool such as Ansys Fluent or OpenFOAM follows these steps:

1. **Clean up the geometry.** Remove small details that do not affect the flow.
2. **Define the domain.** This is the volume of air around the aircraft that the solver will model.
3. **Mesh the domain.** Split the domain into small cells.
4. **Set boundary conditions.** These describe the flow at the inlet, at the outlet and on the walls.
5. **Choose a turbulence model.** Fluent offers Spalart-Allmaras, k-epsilon (Standard, RNG, Realizable), k-omega (Standard, GEKO, BSL, SST), transition models, Reynolds Stress, SAS, DES and LES. LES is available only for 3D cases. Standard wall functions are the default near-wall option.
6. **Run the solver** until the solution converges, which means the results stop changing.
7. **Post-process.** Read lift, drag and pressure plots from the solution.
8. **Check mesh independence.** Refine the mesh and confirm that the results do not change.
9. **Validate.** Compare the results with test data.

OpenFOAM is free, open-source CFD software, developed mainly by OpenCFD Ltd since 2004. OpenCFD Ltd is wholly owned by Keysight. A new version is released every six months, in June and December.

Source: https://ansyshelp.ansys.com/public/Views/Secured/corp/v242/en/flu_ug/flu_ug_sec_turb_setup.html ; https://www.openfoam.com/

## Modelling propellers and rotors in CFD

Ansys Fluent offers several ways to model rotating parts such as propellers.

- **Single Reference Frame (SRF):** The whole domain rotates with one frame. With a constant frame speed, the flow can be solved as steady.
- **Multiple Reference Frame (MRF):** Only selected cell zones rotate. Ansys calls MRF "a steady-state approximation". The mesh stays fixed, so the rotor is effectively frozen in one position, and the method is also called the "frozen rotor approach." Ansys says MRF should not be used when strong transient rotor-stator interaction matters.
- **Sliding mesh:** The rotating zone moves at every time step, joined to the rest of the mesh by an interface. Sliding mesh requires a transient (time-dependent) analysis. Ansys advises not to change the time step by more than 20% when using second-order time accuracy.
- **Fan boundary condition:** The fan is treated as infinitely thin. The pressure rise across it is set as a function of velocity. In 3D, swirl velocities can be added to the fan surface.

The choice is a trade-off. MRF is faster. Sliding mesh captures time-dependent effects at a higher computing cost.

Source: https://ansyshelp.ansys.com/public/Views/Secured/corp/v251/en/flu_ug/flu_ug_sec_move_overview.html ; https://ansyshelp.ansys.com/public/Views/Secured/corp/v242/en/flu_th/flu_th_sec_mrf.html ; https://ansyshelp.ansys.com/public/Views/Secured/corp/v242/en/flu_ug/flu_ug_sec_slide_set_solve.html ; https://www.afs.enea.it/project/neptunius/docs/fluent/html/ug/node254.htm

## Structural analysis with finite elements (FEA)

FEA (finite element analysis) splits a part into many small elements and calculates how the whole part responds to loads. A load is a force that acts on the part, such as wing lift or motor thrust. The Ansys Mechanical "Static Structural" analysis determines "the displacements, stresses, strains, and forces" in a part. Displacement means how far the part moves or bends. Stress is internal force per unit area, and strain is the relative stretch of the material. A static analysis assumes steady loads that vary slowly with time, without significant inertia or damping effects.

Ansys Mechanical includes stress safety tools.

- **Maximum Equivalent Stress tool:** This tool uses the von Mises (distortion-energy) theory for ductile materials, which bend before they break. If failure means yielding, the design goal is to keep the maximum equivalent stress below the material's yield strength. By default, the limit is the tensile yield strength.
- **Output:** Each safety tool can report a safety factor, a safety margin or a stress ratio. In plain words, the safety factor shows how many times stronger the part is than the calculated stress.
- **Brittle materials:** Ansys recommends the Maximum Tensile Stress or Mohr-Coulomb tools and advises against a yield limit, because most brittle materials have no well-defined yield strength.
- **Stress near holes and notches:** Results there depend on how those details are modelled, so engineering judgement is needed.

Source: https://ansyshelp.ansys.com/public/Views/Secured/corp/v251/en/wb2_help/wb2h_structstaticAN.html ; https://ansyshelp.ansys.com/public/views/secured/corp/v251/en/wb_sim/ds_MaxEquiSST.html

## CAD, design for manufacture and version control

CAD (computer-aided design) software builds the exact 3D model from which parts are made. Onshape is one example. It is a cloud platform that combines CAD with PDM (product data management) and runs in a web browser with no installation. Its tools include:

- parts, assemblies, drawings, sheet metal and surfacing
- CAM (programs for machining parts), simulation and rendering
- integrated version control with branching and merging, release management and bills of materials

Students and educators can create free accounts.

Design for manufacture means shaping each part so that it can be built with the method the team will actually use. Version control keeps a record of every change, who made it and why. NASA's process applies the same idea at project level: after the SRR, the requirements go under formal configuration control. Later changes are then tracked and approved, not made silently. A clear version history also lets a team match each tested aircraft to the exact design files used to build it.

Source: https://www.onshape.com/en/ ; https://www.nasa.gov/reference/6-0-crosscutting-technical-management/

## Weight and balance: checking the centre of gravity

The centre of gravity (CG) is the average location of an object's weight. NASA explains that the CG is found by multiplying each piece of weight by its distance from a reference line, adding the products, and dividing by the total weight. Aircraft rotate about their CG in flight, so the position of the CG controls how the aircraft trims and rotates.

**ASSUMED example numbers.** Distances are measured from the nose.

| Item | Mass (kg) | Distance (m) | Mass × distance (kg·m) |
|---|---|---|---|
| Wing and fuselage | 2.0 | 0.40 | 0.80 |
| Battery | 1.0 | 0.20 | 0.20 |
| Payload | 0.5 | 0.30 | 0.15 |
| Tail | 0.5 | 1.00 | 0.50 |
| **Total** | **4.0** | | **1.65** |

CG = 1.65 ÷ 4.0 = 0.4125 m behind the nose.

ArduPilot's plane guide gives a rough rule of thumb: the CG is about one-third of the way back from the front of the wing. If unsure, the guide says to err towards nose-heavy. A nose-heavy plane may struggle to take off and climb but is usually stable. A tail-heavy plane may be very unstable and crash shortly after take-off. After the first flight, the pitch integrator in the log (PIDP.I) shows whether the plane needed constant up elevator (positive values, pointing to nose-heavy balance or wrong trim) or constant down elevator (negative values, pointing to tail-heavy balance or wrong trim) to stay level.

Source: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/center-of-gravity/ ; https://ardupilot.org/plane/docs/guide-center-of-gravity.html

## Ground tests before the first flight

ArduPilot lists several checks that are done on the ground.

- **Pre-arm safety checks:** These checks stop the motors from arming if calibration, sensor, battery, GPS, radio or configuration problems are found. ArduPilot says to never disable arming checks except for bench testing.
- **Control-surface check:** Before every flight, switch to FBWA mode and tilt and pitch the plane by hand. Confirm that the ailerons and elevator move in the correct direction.
- **Motor order and direction:** For a default QuadPlane Quad-X, outputs 5 to 8 drive motors 1 to 4. Motors 1 and 3 spin counter-clockwise and motors 2 and 4 clockwise. As a rule of thumb, the motors turn in towards the fuselage, except on an H frame.
- **Radio fail-safe bench test:** Turn off the transmitter and confirm that the flight mode changes to the short fail-safe action, then to the long fail-safe action. Normal throttle movement to idle must not trigger a fail-safe. For ground tests of electric planes, ArduPilot advises removing the propeller where possible.
- **Thrust and battery sizing:** For each motor, propeller and battery combination, eCalc gives estimates that can be compared with thrust-stand measurements. ArduPilot advises keeping the thrust expo setting (Q_M_THST_EXPO) no higher than 0.75 unless thrust-stand data for the actual motor, ESC and propeller supports a higher value.

Source: https://ardupilot.org/plane/docs/common-prearm-safety-checks.html ; https://ardupilot.org/plane/docs/starting-up-and-calibrating-arduplane.html ; https://ardupilot.org/plane/docs/quadplane-frame-setup.html ; https://ardupilot.org/plane/docs/apms-failsafe-function.html ; https://ardupilot.org/plane/docs/quadplane-vtol-tuning-process.html

## Flight-test progression for a VTOL aircraft

ArduPilot's VTOL tuning process builds up step by step:

1. **Low hover.** Fly in QSTABILIZE, with the pilot and any spectators at a safe distance. Raise the throttle slowly and set the aircraft back down at first lift-off. Then hover at about 1 m and make about 5° roll and pitch inputs. Land at any oscillation. ArduPilot calls the first take-off the most dangerous stage.
2. **Initial tune.** If the aircraft oscillates, cut the roll and pitch rate P, I and D gains by 50% and repeat.
3. **Altitude-hold check.** Climb to 5 m, switch to QHOVER and hover for at least 30 seconds. The learned hover throttle (Q_M_THST_HOVER) should be roughly 0.3 to 0.6. Higher values suggest the aircraft has too little thrust.
4. **Filters and fine tuning.** Log a 2-minute hover with no pilot input to set the notch filter, which removes vibration from the sensor data. Then tune manually, then use QUICKTUNE or QAUTOTUNE. QAUTOTUNE needs about 5 to 8 minutes per axis, and ArduPilot does not recommend it without at least 8 minutes of vertical-flight battery.
5. **Transition.** Start at a safe altitude and fly in a straight, steady line. Use an airspeed sensor if possible. Do not use MANUAL mode as a bail-out, because it stops the VTOL motors at once, and an immediate stall follows if the airspeed is too low. The VTOL motors keep lifting until AIRSPEED_MIN is reached, then ramp down over Q_TRANSITION_MS (5000 ms, or 5 seconds, by default).
6. **Missions.** Fly missions only after the steps above are stable.

The aircraft also needs the conventional Plane first-flight and tuning steps.

Source: https://ardupilot.org/plane/docs/quadplane-vtol-tuning-process.html ; https://ardupilot.org/plane/docs/quadplane-transitions.html ; https://ardupilot.org/plane/docs/quadplane-support.html

## Design reports and documentation

A design report records the requirements, the trade studies, the analysis, the test results and the reasons behind each decision. NASA's process makes this kind of record the input to every review. The PDR shows how the requirements became designs. The CDR checks the detailed design before fabrication. The readiness reviews check that the system is ready for testing and flight. Each review needs written evidence, not only the finished hardware.

The same logic explains why reviewers and judges of engineering projects ask for written reports. A report lets someone outside the team check that:

- the aircraft meets its requirements (verification)
- the aircraft suits its purpose (validation)
- the analysis was checked, for example by mesh-independence studies in CFD and safety factors in FEA
- risks were identified before flight

Good documentation also means version-controlled CAD files and baselined requirements, so every number in a report traces back to a specific design version and a specific test.

Source: https://www.nasa.gov/reference/3-0-nasa-program-project-life-cycle/ ; https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/ ; https://www.onshape.com/en/
