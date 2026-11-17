---
title: "Drones in the real world, and how students get started"
topic: general
competition: none
source_url: https://www.easa.europa.eu/en/the-agency/faqs/drones-uas
last_verified: 2026-11-13
owner: research-team
visibility: public
---

## What the words drone, UAS and RPAS mean

People use several words for aircraft that fly with no pilot on board. The European Union Aviation Safety Agency (EASA) is the aviation safety authority of the European Union. EASA describes an "unmanned aircraft" as an aircraft that operates, or is designed to operate, on its own (autonomously) or under remote control, with no pilot on board. This includes radio-controlled flying models such as powered fixed-wing planes, helicopters and gliders, with or without an on-board camera.

- **Drone**: the everyday word for an unmanned aircraft. EASA uses "drone" and UAS interchangeably.
- **UAS (unmanned aircraft system)**: the drone plus the equipment used to control and operate it, such as the command unit.
- **RPAS (remotely piloted aircraft system)**: a subcategory of UAS in which a remote pilot flies the aircraft. EASA notes that fully autonomous UAS are included in the broader UAS category.
- **RPA (remotely piloted aircraft)**: the aircraft part of an RPAS. The International Civil Aviation Organization (ICAO), the United Nations agency for civil aviation, has an RPAS Panel. The panel coordinates and develops standards, procedures and guidance so that RPA can be integrated into airspace and aerodromes (airports) used by other aircraft.

The US Geological Survey (USGS) uses "uncrewed aircraft systems" with the same abbreviation, UAS.

Source: https://www.easa.europa.eu/en/the-agency/faqs/drones-uas ; https://www.icao.int/safety/UA/Pages/default.aspx ; https://www.usgs.gov/programs/national-land-imaging-program/science/national-uncrewed-systems-office

## Main drone types that open-source autopilots support

Drones come in several basic body types. Open-source autopilots are free flight-control programs whose code anyone can read and change. Two of them, PX4 and ArduPilot, list the types they fly, and these lists give a useful overview.

| Type | What it is | Listed by |
|---|---|---|
| Multirotor (multicopter) | Lifts and steers with several fixed propellers | PX4, ArduPilot Copter |
| Traditional helicopter | One main rotor, or two rotors | PX4, ArduPilot Copter |
| Fixed-wing | A wing gives lift in forward flight, like an aeroplane | PX4, ArduPilot Plane |
| VTOL hybrid | Takes off and lands vertically, then flies on a wing | PX4, ArduPilot Plane (QuadPlane) |
| Rover | Ground vehicle | PX4, ArduPilot |

ArduPilot calls one VTOL hybrid a QuadPlane: "a combined fixed wing and multicopter aircraft." A QuadPlane also functions as a conventional fixed-wing plane. The IMechE UAS Challenge, a student competition, accepts a fixed-wing aircraft, quadcopter, glider or other design. This shows that more than one configuration can do the same job.

Source: https://docs.px4.io/main/en/ ; https://ardupilot.org/copter/docs/introduction.html ; https://ardupilot.org/plane/docs/quadplane-support.html ; https://www.imeche.org/events/challenges/uas-challenge

## Medical delivery by drone: Zipline

Zipline is a drone delivery company. Zipline's first operations were in Rwanda, and the company says it has served local communities since 2016. Zipline now also makes deliveries in places that include Accra (Ghana) and Dallas and Rowlett (Texas, USA). Zipline's own page reports:

- more than 3,000,000 deliveries
- more than 150,000,000 miles flown
- more than 75,000 lives saved (Zipline's own claim)

Zipline's technology page describes its delivery drone:

- speed up to 70 mph (about 113 km/h), on a direct path that avoids ground traffic
- up to 155 miles (about 249 km) round trip on a single charge
- holds position at up to 300 feet (about 91 m) above the ground
- lowers a pod to deliver the order; the page also describes orders that descend from above
- insulated pods that keep hot food hot and cold items cold
- the drone navigates itself, finds efficient routes and avoids obstacles, with no pilot on board

Zipline builds its hardware at its headquarters in South San Francisco, California.

Source: https://www.zipline.com/about ; https://www.zipline.com/technology

## Tiltrotor delivery and survey drone: Wingcopter 198

Wingcopter is a drone maker. Its Wingcopter 198 is a tiltrotor: the motors tilt up to lift the drone vertically, then tilt forward for fast flight on the wing. Published figures for the Wingcopter 198:

| Parameter | Value |
|---|---|
| Maximum range | 94 km |
| Speed | 90 km/h |
| Payload | 4.7 kg |
| Motors | 8 motors with 8 electronic speed controllers (ESCs) |
| Batteries | 2 hot-swap smart batteries |

The eight motors, eight ESCs and two batteries give "power-train redundancy." Redundancy means that a spare part can take over if one part fails. The flight control system also has redundant sensors, such as dual airspeed sensors. Wingcopter describes the Wingcopter 198 as suited to cargo delivery and surveying. Wingcopter says the Wingcopter 198 is optimised for beyond-visual-line-of-sight (BVLOS) flights, where the drone flies farther than the pilot can see. A triple-drop option, which would deliver up to three packages to separate places on one flight, is in development.

UNICEF reports that on 25 October 2018 the government of Vanuatu awarded commercial contracts to Swoop Aero and Wingcopter. The contracts were to trial drone delivery of vaccines to remote islands while keeping the vaccines at 2–8 °C.

Source: https://wingcopter.com/wingcopter-198 ; https://www.unicef.org/innovation/drones

## Neighbourhood delivery: Wing

Wing is a drone delivery service that works with retail partners. Wing's "how it works" page gives the following facts:

- Cruise speed is around 60 mph (about 97 km/h).
- Round-trip range is up to 12 miles (about 19 km).
- Flights take a few minutes.
- Store staff hang the package on a pickup station hook, then return to their work.
- Partners can offer drone delivery in their existing ordering experience through the Wing API (application programming interface, a way for software systems to talk to each other).
- The system needs no major construction, overhauls or extensive training.

Wing's page does not describe the aircraft layout or the payload mass, so this knowledge base gives no figures for them.

Source: https://wing.com/how-it-works

## UNICEF and humanitarian drone programmes

UNICEF, the United Nations children's agency, explores three drone uses:

- **Imagery**: aerial pictures that help prepare for and respond to emergencies.
- **Transport**: vaccine delivery and transport to remote areas, including cargo that must stay at a set temperature.
- **Connectivity**: better network access for hard-to-reach communities.

The Government of Malawi and UNICEF launched the Malawi Drone Testing Corridor in June 2017. The corridor covers more than 5,000 km² and allows flights up to 400 m above ground level. UNICEF calls it the only dedicated unmanned flight testing space in Africa. It is used to test imagery, connectivity and transport ideas. Kazakhstan has two drone testing corridors, in the North and South of the country.

The UNICEF Innovation Fund offers up to US$100,000 in equity-free seed investment to for-profit technology start-ups. The start-up must be registered in a UNICEF programme country and have a working drone prototype or service that is open-source, or be willing to make it open-source.

WeRobotics supports the Flying Labs Network, a network in Africa, Latin America, the Caribbean and Asia-Pacific. Flying Labs teams use drones, geospatial data (data tied to places on a map) and AI for social good. Examples on the WeRobotics page include Philippines Flying Labs work on getting medical supplies to remote areas, and drone use in farming.

Source: https://www.unicef.org/innovation/drones ; https://werobotics.org/flying-labs

## Mapping, environmental monitoring and disaster response: USGS

The US Geological Survey (USGS) set up the National Uncrewed Systems Office (NUSO) on 8 May 2008. NUSO is part of the National Land Imaging Program. NUSO evaluates drone platforms and sensors, develops data processing techniques and gives operational support to the remote pilots of the US Department of the Interior. Its examples show what survey drones do:

- **Restoration monitoring**: three years of drone lidar and photogrammetry recorded a meadow restoration at Ackerson Meadow in Yosemite. Lidar is a laser scanner that measures distances to build 3D maps. Photogrammetry builds 3D models from many overlapping photos.
- **Water quality**: hyperspectral drone flights mapped algal blooms in Williams Fork and Willow Creek Reservoirs in Colorado. A hyperspectral camera records many narrow colour bands.
- **Hazards**: drones assessed landslide damage after Hurricane Helene and imaged the 2022 Mauna Loa eruption.
- **Rivers and wetlands**: surveys tracked river channel change and mapped wood jams on the upper Cache la Poudre River.
- **Minerals**: radiometric surveys covered mine waste, and gamma-ray spectrometer calibration flights were made at Grand Junction, Colorado.
- **Atmosphere**: small drones measured methane flux at a fen in Interior Alaska.
- **Wildlife**: radio tracking tags for monarch butterflies were range-tested on a drone.

Source: https://www.usgs.gov/programs/national-land-imaging-program/science/national-uncrewed-systems-office

## Agriculture

In 2018 the Food and Agriculture Organization of the United Nations (FAO) and the International Telecommunication Union (ITU) published "E-agriculture in Action: Drones for Agriculture." The book is the second title in the E-agriculture in Action series. It contains ten case studies, covering topics such as drone regulations and good practice, rice area mapping, crop insurance, community forest monitoring and Internet of Things applications.

The FAO lists these agricultural drone uses:

- cropping
- early warning systems
- plant monitoring
- pest control
- animal tracking
- forest and environmental monitoring

FAO has used drones in the Philippines for disaster risk reduction and climate change adaptation. In Myanmar, FAO worked with the Ministry of Agriculture, Livestock and Irrigation to improve disaster preparedness with geospatial technology.

The publication also names a challenge: many developing countries lack the laws and policy frameworks needed to regulate drone use.

Source: https://www.fao.org/e-agriculture/news/new-publication-fao-itu-e-agriculture-action-drones-agriculture

## A short history of VTOL flight: Harrier and tiltrotor

VTOL means vertical take-off and landing.

**Vectored thrust jets.** Michel Wibault, from France, proposed swivelling the exhaust nozzles to point the jet thrust in different directions. This removed the need for several separate lift engines. Stanley Hooker and Gordon Lewis of Bristol Aero-Engines conceived the Pegasus engine with four swivelling nozzles. In 1957 Hawker started the P.1127 programme. The P.1127 made its first untethered flight on 19 November 1960 and its first transition from cruise to vertical flight on 12 September 1961. In 1962 Germany, Great Britain and the United States agreed to fund nine aircraft, named Kestrels, and their flight tests began in 1964. Great Britain formed its first Harrier squadron in 1969. The US Marine Corps adopted the Harrier as the AV-8A in 1971.

**Tiltrotors.** In 1973 the US Army and NASA started the XV-15 as a "proof of concept" programme. Bell Helicopter Textron built two aircraft in 1977. Each had two Lycoming T-53 turboshaft engines linked by a cross-shaft and three-bladed rotors 25 ft (about 7.6 m) in diameter. NASA flew the XV-15 at Dryden in 1980 and 1981. NASA calls the XV-15 the primary influence on Bell's V-22, "the first production tilt rotor."

Source: https://airandspace.si.edu/collection-objects/hawker-siddeley-xv-6a-kestrel-fga-mk-1/nasm_A19740943000 ; https://www.nasa.gov/aeronautics/nasa-aircraft/xv-15-tiltrotor/

## Advanced air mobility, air taxis and drone traffic management

NASA describes Advanced Air Mobility (AAM) as "bringing the movement of people and goods off the ground, on demand, and into the sky." The planned system covers low-altitude passenger transport, cargo delivery and public service uses. NASA delivers data to guide industry's development of electric air taxis and drones, and it helps the US Federal Aviation Administration (FAA) integrate these aircraft safely into national airspace.

NASA also ran a research project called UAS Traffic Management (UTM). UTM studied how small drones could safely use low-altitude airspace beyond visual line of sight. NASA tested the ideas in field demonstrations with partners from the FAA, industry and academia. The project has concluded, and NASA keeps its page for historical reference.

ICAO names UAS Traffic Management and advanced air mobility among the technologies it follows, and ICAO has an Advanced Air Mobility Study Group.

Source: https://www.nasa.gov/mission/advanced-air-mobility/ ; https://www.nasa.gov/directorates/armd/aosp/utm/ ; https://www.icao.int/safety/UA/Pages/default.aspx

## How drone rules are organised: the EU example

Each country sets its own drone rules. The European Union shows one common structure. EASA sorts flights into three categories by risk: the open category (low risk), the specific category (medium risk) and the certified category (high risk).

The open category has three subcategories:

- **A1**: flying over uninvolved people should be avoided; no flight over assemblies of people.
- **A2**: no flight over uninvolved people; keep 30 m away from them horizontally (5 m with low-speed mode).
- **A3**: keep 150 m from uninvolved people and urban areas.

| Class label | Maximum mass | Subcategory |
|---|---|---|
| C0 | 250 g | A1 (or A3) |
| C1 | 900 g | A1 (or A3) |
| C2 | 4 kg | A2 (or A3) |
| C3 | 25 kg | A3 |
| C4 | 25 kg | A3 |

All open-category flights stay below 120 m.

Other EU rules:

- **Registration**: registration of drone operators and certified drones became mandatory on 31 December 2020. It is required for C1 to C4, and for C0 only when the drone has a camera or sensor and is not a toy.
- **Pilot competence**: reading the user manual (C0); an online A1/A3 training and exam (C1, C3, C4); C2 adds practical self-training and a further theory exam.
- **Minimum age**: 16 (no minimum for toys). A State may lower it to 12 within that State.
- **Remote identification**: most open-category drones need a remote ID system, with limited exceptions.

These limits apply in the EU only.

Source: https://www.easa.europa.eu/en/domains/drones-air-mobility/operating-drone/open-category-low-risk-civil-drones ; https://www.easa.europa.eu/en/the-agency/faqs/drones-uas

## International student UAV competitions

University teams around the world design and fly drones in competitions. The table uses facts from each competition's official page.

| Competition | Organiser | What teams do |
|---|---|---|
| Design/Build/Fly (DBF) | American Institute of Aeronautics and Astronautics (AIAA) | 2,000+ students and 100+ teams take part each year. The 31st event is planned for 15–18 April 2027 in Tucson, Arizona. |
| Student Unmanned Aerial Systems (SUAS) | RoboNation (since 2023); held every year since 2002 | Example tasks: autonomous waypoint flight, obstacle avoidance, object detection and air delivery. Teams also write a technical design report. The event is held at Skyway Range, Tulsa, Oklahoma, and is set for 1–4 October 2027. |
| UAS Challenge | Institution of Mechanical Engineers (IMechE), UK | Undergraduate and postgraduate teams build a UAS of at most 10 kg take-off mass. The UAS flies waypoints autonomously and completes a simulated aid mission. Teams start in October and the fly-off is the following July. |

DBF entrants must meet eligibility rules that include AIAA student membership. DBF's page names aerodynamics, structures, propulsion and controls among the team roles.

Source: https://aiaa.org/dbf ; https://www.suas-competition.org/ ; https://www.imeche.org/events/challenges/uas-challenge

## How a student can start learning: simulators and open-source autopilots

A student can learn a lot before touching real hardware.

- **PX4** is an open-source autopilot for multirotors, fixed-wing aircraft, VTOLs, helicopters, rovers and more. PX4 source code is released under the BSD 3-Clause licence, which allows free use, modification and sharing. The Dronecode Foundation hosts the project. PX4 can be tried in simulation with no hardware needed. PX4 supports the Gazebo simulator for quadcopters, VTOLs (standard, tailsitter, tiltrotor), planes and rovers. It also has SIH, a simulator that covers quad, hex, plane, tailsitter, standard VTOL and rover.
- **SITL (software in the loop)** means the autopilot runs as a program on a computer while a simulator models the aircraft.
- **ArduPilot SITL** builds the ArduPilot autopilot as an ordinary program for Linux or Windows. It can simulate multirotors, fixed-wing aircraft, ground vehicles and underwater vehicles, and it can use JSBSim, Gazebo or Webots as external simulators.
- **Ground control stations** are programs that show a drone's data and send commands. QGroundControl can connect to PX4.

When moving to hardware, ArduPilot describes two paths: a ready-to-fly vehicle or a self-built one. Builders then follow the "First Time Setup" and "First Flight" guides. ArduPilot warns that "autonomous vehicles are potentially dangerous!"

Source: https://docs.px4.io/main/en/ ; https://docs.px4.io/main/en/simulation/ ; https://ardupilot.org/dev/docs/sitl-simulator-software-in-the-loop.html ; https://ardupilot.org/copter/docs/introduction.html

## Free courses for aerospace basics

MIT OpenCourseWare publishes the course materials of the Massachusetts Institute of Technology (MIT) free online. Its 16.01 "Unified Engineering I, II, III, & IV" (Fall 2005 to Spring 2006) is an undergraduate course from MIT's Department of Aeronautics and Astronautics. It covers:

- materials and structures
- computing
- fluid mechanics
- thermodynamics
- propulsion
- signals and systems

The course aims to give a solid understanding of the basic disciplines of aerospace engineering and shows how they connect. The materials carry a Creative Commons BY-NC-SA 4.0 licence, which allows non-commercial reuse with credit.

edX lists a course "DelftX: Introduction to Aeronautical Engineering." The edX page that was checked did not show the topics, cost or length, so learners should read the current listing before enrolling.

The PX4 and ArduPilot documentation sites are also free to read.

Source: https://ocw.mit.edu/courses/16-01-unified-engineering-i-ii-iii-iv-fall-2005-spring-2006/ ; https://www.edx.org/learn/aeronautical-engineering/delft-university-of-technology-introduction-to-aeronautical-engineering ; https://docs.px4.io/main/en/

## Skills used in a student UAV team

Student drone competitions ask teams to cover both engineering and non-engineering work.

AIAA Design/Build/Fly names aerodynamics, structures, propulsion and controls among its team roles. DBF teams also submit a proposal and a design report. SUAS judges a technical design report, a proof-of-flight-readiness video and a mission demonstration that assesses flight performance and safety. SUAS tasks include autonomous waypoint flight, obstacle avoidance, object detection, classification and localisation (computer vision), and payload drops. At the IMechE UAS Challenge fly-off, teams demonstrate efficiency, manoeuvrability and sustainability and give formal presentations.

In general terms, the skills these competitions call for include:

- **Aerodynamics and structures**: wing and airframe design.
- **Propulsion and electronics**: motors, batteries and wiring.
- **Controls and embedded software**: autopilot set-up and programming of small onboard computers.
- **Computer vision**: finding and identifying objects in camera images.
- **Technical writing**: proposals, design reports and documentation.
- **Presentation and project management**: meeting deadlines across the competition cycle.

Source: https://aiaa.org/dbf ; https://www.suas-competition.org/ ; https://www.imeche.org/events/challenges/uas-challenge

## Careers that use these skills

The US Bureau of Labor Statistics (BLS) says aerospace engineers "design, develop, and test aircraft, spacecraft, satellites, and missiles." They also create and test prototypes, assess whether proposals are technically and financially feasible, and inspect malfunctioning or damaged products to find the source of problems.

- **Education**: most positions need a bachelor's degree in aerospace engineering or a related field. BLS suggests high school students take chemistry, physics and maths. Cooperative education programmes and internships give practical experience.
- **Specialties**: aeronautical engineers work with aircraft. Astronautical engineers work on spacecraft.
- **Important qualities BLS lists**: analytical skills, business knowledge, communication, maths (especially calculus and trigonometry), problem-solving and teamwork.

Drone work also appears in science agencies and humanitarian work. USGS NUSO supports Department of the Interior remote pilots and scientists. UNICEF and WeRobotics Flying Labs use drones for health logistics and local problem solving.

Source: https://www.bls.gov/ooh/architecture-and-engineering/aerospace-engineers.htm ; https://www.usgs.gov/programs/national-land-imaging-program/science/national-uncrewed-systems-office ; https://werobotics.org/flying-labs
