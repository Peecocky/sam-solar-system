import imageManifest from './art-image-manifest.json'

export type ArtLink = { label: string; href: string; note?: string }
export type ArtSection = { title: string; text: string; image?: string; caption?: string }
export type ArtProject = {
  slug: string
  eyebrow: string
  title: string
  subtitle: string
  cover: string
  coverAlt: string
  stat: string
  summary: string
  sections: ArtSection[]
  requirements: { label: string; state: 'shown' | 'partial' | 'pending'; detail: string }[]
  links: ArtLink[]
  gallery: string[]
  model?: { label: string; url: string }[]
  modelNote?: string
}

const img = (week: number, number: number) => `/art-course/week-${week}/${String(number).padStart(2, '0')}.webp`
const all = (slug: keyof typeof imageManifest) => imageManifest[slug].map((image) => image.src)
const doc = (week: number): ArtLink => ({
  label: 'Complete process document · DOCX',
  href: `/art-course/week-${week}/source.docx`,
})

export const artProjects: ArtProject[] = [
  {
    slug: 'week-1',
    eyebrow: 'WEEK 01 / FORM & COMMANDS',
    title: 'Architectural Form Study',
    subtitle: 'A small architectural form made from rings, columns and a slotted wall.',
    cover: img(1, 19),
    coverAlt: 'Week 1 architectural form in Fusion 360',
    stat: '74 × 53 × 41.16 mm',
    summary: 'Two concentric circles, Ø50 and Ø40 mm, became a curved shell, a ring of columns and a leaning wall through extrusions, draft, split, patterns and shell operations.',
    sections: [
      { title: 'Starting with a ring', text: 'I sketched two concentric circles on the top plane and selected one quarter of the ring. After extruding it, a 40° Draft with Tangent Chain created the sloping surface.', image: img(1, 5), caption: 'Quarter-ring extrusion and 40° draft.' },
      { title: 'Splitting and supporting', text: 'Split Body separated the upper shell from the base. Circular Pattern repeated one tapered column around the center; Move/Copy placed the resulting columns beneath the shell.', image: img(1, 10), caption: 'The patterned columns support the upper form.' },
      { title: 'Slotted wall', text: 'I added a leaning wall and patterned a rectangular cutting profile. A 6 mm cut made the narrow slots, then I rotated the edge to connect the straight wall with the rounded form.', image: img(1, 20), caption: 'Leaning wall, slots and final edge adjustment.' },
      { title: 'Dimensions and reflection', text: 'The finished size is 74 × 53 × 41.16 mm: every axis exceeds 1.5 inches and fits inside a 3-inch cube. The document records more than five commands, including Sketch, Extrude, Draft, Split Body, Move/Copy, Circular and Rectangular Pattern, Shell and Combine/Cut. Many separate patterned bodies also made the Fusion Browser crowded.', image: img(1, 23), caption: 'The side view records the 41.16 mm height.' },
    ],
    requirements: [
      { label: 'Size range', state: 'shown', detail: '74 × 53 × 41.16 mm: larger than 1.5 inches on all axes and within a 3-inch cube.' },
      { label: 'At least five commands', state: 'shown', detail: 'The process document names more than nine commands and shows their use.' },
      { label: 'Tutorial record', state: 'pending', detail: 'The supplied files do not identify tutorials watched or include a viewing record.' },
    ],
    links: [doc(1)],
    gallery: all('week-1'),
    modelNote: 'No STL or GLB matching this 74 × 53 × 41.16 mm object was found locally. The Fusion screenshots and dimension record are available below.',
  },
  {
    slug: 'week-2',
    eyebrow: 'WEEK 02 / MULTI-PART DESIGN',
    title: 'Sushi Dipping Station',
    subtitle: 'Move the sauce while the sushi stays still.',
    cover: img(2, 31),
    coverAlt: 'Fusion 360 assembly of the sushi dipping station',
    stat: '100 × 100 × 107 mm',
    summary: 'Two interchangeable funnels, two sliding gates and one central scaffold form a five-body station. Sauce passes over the sushi and collects in the lower funnel.',
    sections: [
      { title: 'Sketching the problem', text: 'The first drawings show sashimi sliding off the rice as the sushi is carried to a dish. The design reverses that motion: the sushi rests on a tray while the sauce moves down to it.', image: img(2, 3), caption: 'Sketch of sashimi separating from the rice.' },
      { title: 'Interchangeable funnels', text: 'Each funnel began with a 100 × 100 mm square. Four Ø10 mm corner holes receive the pillars; the interior has a 20° draft and a Ø2 mm drain. A sliding gate is scaled to 0.99 of its slot.', image: img(2, 20), caption: 'One funnel and its sliding gate.' },
      { title: 'Scaffold and assembly', text: 'Four pillars support the perforated sushi tray. The identical upper and lower funnels can be lifted and swapped. The document shows the parts, the assembled object and its 100 × 100 × 107 mm dimensions.', image: img(2, 27), caption: 'Upper funnel, scaffold and lower funnel.' },
    ],
    requirements: [
      { label: 'Two or more fitting parts', state: 'shown', detail: 'Two funnels, two gates and a scaffold; the document explains both sliding and pillar-hole fits.' },
      { label: 'Larger than 8 × 8 × 8 cm', state: 'shown', detail: 'The assembled size is 100 × 100 × 107 mm.' },
      { label: 'Sketches and model', state: 'shown', detail: 'Hand sketches and Fusion process images are available in the full gallery.' },
    ],
    links: [doc(2), { label: 'Funnel component mesh · STL', href: '/art-course/week-2/funnel-component.stl' }],
    gallery: all('week-2'),
    model: [{ label: 'Funnel component', url: '/art-course/week-2/funnel-component.stl' }],
    modelNote: 'The rotatable STL is one funnel component. The complete five-body assembly appears in the process images; no web-viewable mesh of that full assembly was found.',
  },
  {
    slug: 'week-3',
    eyebrow: 'WEEK 03 / FIT & PRINT',
    title: 'Tennis Ball Pea Pod',
    subtitle: 'A pea pod shaped holder for three tennis balls.',
    cover: img(3, 23),
    coverAlt: 'Photo of the printed pea pod holder in hand',
    stat: '3 balls / printed & fit checked',
    summary: 'Inspired by an egg carton, the design places three ball-sized pockets in a row. Narrow openings hold the balls with a light snap, while a hook lets the pod hang.',
    sections: [
      { title: 'Sketches and size basis', text: 'The document cites a tennis-ball diameter of about 69–72 mm. An R37 outer arc and R14 concave transitions create the three-pocket outline. The size was taken from published specifications; no caliper photo of the actual balls was supplied.', image: img(3, 2), caption: 'Sketch of three connected ball pockets.' },
      { title: 'Modeling the fit', text: 'The main form and stem were revolved, then a hook was swept along a curved path. A 33.5 mm radius ball model checked the pocket position. The opening was cut narrower than the ball, with filleted edges and a fish-shaped detail.', image: img(3, 21), caption: 'Final Fusion model with the decorative cutout.' },
      { title: 'Print and physical check', text: 'The document reports that the balls press into the pockets, stay in place and can be removed. The included photos show the printed holder both hanging and held in hand.', image: img(3, 22), caption: 'The printed holder in a hanging test.' },
    ],
    requirements: [
      { label: 'Attachment and snug fit', state: 'shown', detail: 'The holder fits tennis balls; the document and photos record the press fit and removal.' },
      { label: 'How measurements were taken', state: 'partial', detail: 'A published ball size and a Fusion fit check are described. No caliper measurement of the actual object was found.' },
      { label: 'Physical print', state: 'shown', detail: 'The document includes print photos and a physical fit account.' },
    ],
    links: [doc(3), { label: 'Fusion design file · F3D', href: '/art-course/week-3/source.f3d' }, { label: 'Printable mesh · STL', href: '/art-course/week-3/model.stl' }],
    gallery: all('week-3'),
    model: [{ label: 'Pea pod holder', url: '/art-course/week-3/model.stl' }],
  },
  {
    slug: 'week-4',
    eyebrow: 'WEEK 04 / IDEATION & ITERATION',
    title: 'Helmet Ideation',
    subtitle: 'Three helmet concepts converge on a rotating visor.',
    cover: img(4, 2),
    coverAlt: 'Hand sketch of a helmet with a rotating visor',
    stat: '3 concepts / 7 sketches',
    summary: 'Pointed shells, rounded crowns and a beak-shaped visor were compared before selecting a side-pivot mechanism. The sketches explore motion, parts, materials and decoration.',
    sections: [
      { title: 'Three initial concepts', text: 'Concept 1 uses a top-hinged visor and mail. Concept 2 combines a pointed shell and side pivot. Concept 3 uses a rounded shell and beak visor. The chosen direction takes the shell from Concept 2 and the visor from Concept 3.', image: img(4, 1), caption: 'The first of three initial helmet concepts.' },
      { title: 'Structure and materials', text: 'The sketches identify the split shell, side pivots and visor swing. Clear resin with leather or EVA foam lining was proposed at this stage. These are design intentions, not completed physical materials.', image: img(4, 4), caption: 'Top, side and front relationship sketches.' },
      { title: 'Revisiting Week 3', text: 'The notes describe changes to the pea pod holder, including the fish cutout, snap opening and 45° overhangs. Reprint settings are PLA, 0.2 mm layers, three walls, 15% infill and no supports. The document does not include a photo of that reprint or the original classmate feedback.', image: img(4, 7), caption: 'Shell and visor structure sketch.' },
    ],
    requirements: [
      { label: 'Final-project ideation', state: 'shown', detail: 'Seven sketches, concept choices, a written description and reflection against the ten principles of good design.' },
      { label: 'Class feedback and Week 3 reprint', state: 'partial', detail: 'Changes and settings are described, but the original feedback and a reprint photo are missing.' },
    ],
    links: [doc(4), { label: 'Concept Fusion model · F3D', href: '/art-course/week-4/concept-model.f3d', note: 'An early transparent-helmet concept, distinct from the later final design.' }],
    gallery: all('week-4'),
    modelNote: 'The concept model is available as a Fusion F3D download. No web-viewable mesh export matching this Week 4 state was found.',
  },
  {
    slug: 'week-5',
    eyebrow: 'WEEK 05 / PROTOTYPING',
    title: 'Bascinet Prototype',
    subtitle: 'The first Fusion prototype of the shell, opening, visor and hinge.',
    cover: img(5, 9),
    coverAlt: 'Week 5 helmet prototype in Fusion 360',
    stat: '10 mm shell / 300 mm draft height',
    summary: 'This week established the 10 mm shell profile, revolved body, face opening, printable split, lofted visor and hinge arms.',
    sections: [
      { title: 'Shell and print split', text: 'A side profile with a 10 mm wall and draft height of about 300 mm was revolved into the main shell. The face opening was cut from a front sketch, then an angled plane divided the shell for printing.', image: img(5, 4), caption: 'The angled splitting plane across the shell.' },
      { title: 'Lofted visor and hinge', text: 'Two visor profiles on separate planes were lofted into a curved face piece. Hinge arms with bolt holes were added. The notes identify visor clearance against the shell as a test still to be done.', image: img(5, 8), caption: 'Lofted visor and side pivot position.' },
      { title: 'Next iteration', text: 'At the end of Week 5 the prototype still needed a swing-clearance check, hinge details, a height adjustment and surface refinement. The later design and technical drawings appear in the Final Project.', image: img(5, 9), caption: 'Prototype at the end of Week 5.' },
    ],
    requirements: [
      { label: 'Prototype process and revisions', state: 'shown', detail: 'Nine Fusion screenshots document the modeling process and planned changes.' },
      { label: 'Test print', state: 'pending', detail: 'The Week 5 document contains no test-print photo, slicer result or settings.' },
    ],
    links: [doc(5)],
    gallery: all('week-5'),
    modelNote: 'The Week 5 state is documented with Fusion screenshots. Rotatable parts from the later, completed CAD design are on the Final Project page.',
  },
  {
    slug: 'final',
    eyebrow: 'FINAL PROJECT / FUSION 360',
    title: 'Ornate Hinged Helmet',
    subtitle: 'Four separate helmet bodies and a complete modeling record.',
    cover: '/art-course/final/model-view.png',
    coverAlt: 'Fusion 360 view of the ornate hinged helmet',
    stat: '112.5 × 137.6 × 142.3 mm',
    summary: 'A medieval-inspired helmet with a shell, visor and two hinge links. The evidence includes a 111-step Fusion timeline, four technical sheets and notes on design iterations.',
    sections: [
      { title: 'Design iterations', text: 'The Week 4 transparent helmet concept developed into a version with a gold-toned CAD appearance and crown relief. The color is a Fusion appearance, not evidence of a physical material or finish.', image: '/art-course/final/sketch-contact.jpg', caption: 'Sketches, references and design changes.' },
      { title: 'Four printable bodies', text: 'The final visible print bodies are the shell, visor, left hinge and right hinge. Their STL files can be inspected separately below. The browser viewer presents individual parts rather than implying that a physical assembly exists.', image: '/art-course/final/body-contact.jpg', caption: 'Separate bodies recorded in Fusion.' },
      { title: 'Dimensions and drawings', text: 'At Fusion history step 103, the assembled CAD envelope is about 112.5 × 137.6 × 142.3 mm, exceeding 100 mm on every axis. Four A3 sheets show front, side, top and isometric views with critical dimensions for the shell, visor and hinge links.', image: '/art-course/final/technical-sheet-01.png', caption: 'Technical sheet one: helmet shell.' },
      { title: 'Fabrication status', text: 'The supplied record explicitly says that the final object has not been physically printed. Clear resin, leather or EVA foam, sanding, polishing and painting remain plans. Visor clearance, thin relief, overhangs and vents still need process-specific checks.', image: '/art-course/final/model-view.png', caption: 'Current Fusion model view, not a physical print.' },
    ],
    requirements: [
      { label: 'Original Fusion file and multiple parts', state: 'shown', detail: 'Original F3D, four visible print bodies and a 111-step timeline are included.' },
      { label: 'Assembly larger than 100 mm per axis', state: 'shown', detail: 'The Fusion step-103 assembled envelope is about 112.5 × 137.6 × 142.3 mm.' },
      { label: 'Sketches and technical drawings', state: 'shown', detail: 'Design notes, a 111-step process PDF and a four-sheet technical PDF are linked.' },
      { label: 'At least two physical materials', state: 'pending', detail: 'Leather or EVA foam is only proposed; no physical second material is documented.' },
      { label: 'Physical print and finishing', state: 'pending', detail: 'The files explicitly state that the object has not been printed. Sanding, polishing or painting still need to be done and photographed.' },
      { label: 'Printability and fit testing', state: 'partial', detail: 'Separate parts, STL files and process checks exist. Actual clearance and visor motion still need physical testing.' },
    ],
    links: [
      { label: 'Design notes and sketches · PDF', href: '/art-course/final/process-notes.pdf' },
      { label: 'Four technical sheets · PDF', href: '/art-course/final/technical-drawings.pdf', note: 'Prepared from Fusion geometry measurements; not a successful native Fusion Drawing export.' },
      { label: '111-step Fusion timeline · PDF', href: '/art-course/final/fusion-timeline.pdf' },
      { label: 'Original Fusion design · F3D', href: '/art-course/final/original-model.f3d' },
      { label: 'Component drawing source · F3D', href: '/art-course/final/drawing-source.f3d' },
    ],
    gallery: [
      '/art-course/final/sketch-contact.jpg',
      '/art-course/final/body-contact.jpg',
      '/art-course/final/technical-sheet-01.png',
      '/art-course/final/technical-sheet-02.png',
      '/art-course/final/technical-sheet-03.png',
      '/art-course/final/technical-sheet-04.png',
      '/art-course/final/model-view.png',
    ],
    model: [
      { label: 'Helmet shell', url: '/art-course/final/helmet.stl' },
      { label: 'Visor', url: '/art-course/final/visor.stl' },
      { label: 'Left hinge', url: '/art-course/final/hinge-left.stl' },
      { label: 'Right hinge', url: '/art-course/final/hinge-right.stl' },
    ],
    modelNote: 'The four STL bodies rotate independently. The original Fusion file and assembled dimensions are available in the downloads.',
  },
]

export const projectBySlug = Object.fromEntries(artProjects.map((project) => [project.slug, project])) as Record<string, ArtProject>
