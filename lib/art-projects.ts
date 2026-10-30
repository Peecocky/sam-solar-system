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
    links: [doc(1), { label: 'Fusion cloud design · F3D', href: '/art-course/week-1/model.f3d' }, { label: 'Fusion mesh · STL', href: '/art-course/week-1/model.stl' }],
    gallery: all('week-1'),
    model: [{ label: 'Week 1 Fusion model', url: '/art-course/week-1/model.stl' }],
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
    links: [doc(2), { label: 'Five-part Fusion design · F3D', href: '/art-course/week-2/alternate.f3d' }, { label: 'Five-part Fusion mesh · STL', href: '/art-course/week-2/alternate.stl' }, { label: 'Funnel component mesh · STL', href: '/art-course/week-2/funnel-component.stl' }],
    gallery: all('week-2'),
    model: [{ label: 'Five-part station', url: '/art-course/week-2/alternate.stl' }, { label: 'Funnel component', url: '/art-course/week-2/funnel-component.stl' }],
    modelNote: 'The station mesh comes from the open Fusion file “hw2” and includes extended sliding gates. The source document records the closed assembly dimensions as 100 × 100 × 107 mm.',
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
    links: [doc(3), { label: 'Fusion cloud design · F3D', href: '/art-course/week-3/fusion-model.f3d' }, { label: 'Printable mesh · STL', href: '/art-course/week-3/model.stl' }],
    gallery: all('week-3'),
    model: [{ label: 'Pea pod holder', url: '/art-course/week-3/fusion-model.stl' }],
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
    links: [doc(4), { label: 'Documented concept · F3D', href: '/art-course/week-4/concept-model.f3d' }, { label: 'Related helmet study · F3D', href: '/art-course/week-4/fusion-concept.f3d' }],
    gallery: all('week-4'),
    model: [{ label: 'Related helmet study', url: '/art-course/week-4/fusion-concept.stl' }],
    modelNote: 'The rotatable mesh is the separate Fusion cloud file “another helmet”, a related concept study. The original Week 4 sketches and documented concept F3D are linked below.',
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
    links: [doc(5), { label: 'Week 5 Fusion design · F3D', href: '/art-course/week-5/model.f3d' }, { label: 'Week 5 Fusion mesh · STL', href: '/art-course/week-5/model.stl' }],
    gallery: all('week-5'),
    model: [{ label: 'Patterning prototype', url: '/art-course/week-5/model.stl' }],
    modelNote: 'The mesh was exported from the Fusion cloud file “week 5 patterning”. The original document below shows the earlier shell and visor steps.',
  },
  {
    slug: 'final',
    eyebrow: 'FINAL PROJECT / FUSION 360',
    title: 'Ornate Hinged Helmet',
    subtitle: 'A printed, assembled helmet with a fabric crest and a documented Fusion model.',
    cover: '/art-course/final-original/03.webp',
    coverAlt: 'Physical helmet with a black visor, white shell and red fabric crest',
    stat: '112.5 × 137.6 × 142.3 mm',
    summary: 'A medieval-inspired helmet with a shell, visor, two hinges, nut and bolts. The original documentation shows the physical print, red fabric crest, cotton cushion, sanding, drawings and modeling process.',
    sections: [
      { title: 'Sketch to object', text: 'The original project document starts with a helmet drawing and photographs the finished black, white and red object. The later Fusion notes show how the shell, visor and decorative crown relief were developed.', image: '/art-course/final-original/01.webp', caption: 'Original helmet sketch.' },
      { title: 'Six documented parts', text: 'The documentation identifies the helmet, visor, left and right hinges, nut and bolts. The parts are shown apart before assembly, and the browser viewer includes the available printable mesh exports, including bolts.', image: '/art-course/final-original/08.webp', caption: 'Printed parts laid out before assembly.' },
      { title: 'Dimensions and drawings', text: 'The Fusion CAD envelope is about 112.5 × 137.6 × 142.3 mm, exceeding 100 mm on every axis. The original project includes helmet, nut and bolt drawings; a separate four-sheet technical set records the CAD shell, visor and hinges.', image: '/art-course/final-original/09.webp', caption: 'Original technical drawing of the helmet and components.' },
      { title: 'Printing, materials and finish', text: 'The original documentation shows a print in progress and the assembled object. It lists black and white PLA, cotton for the head cushion, red fabric and thread for the crest, and sanding as post-processing. The physical photos provide evidence of a built object; detailed clearance measurements are not recorded.', image: '/art-course/final-original/03.webp', caption: 'The assembled physical helmet with fabric crest.' },
    ],
    requirements: [
      { label: 'Original Fusion file and multiple parts', state: 'shown', detail: 'The original F3D, printable bodies, nut and bolts documentation, and a 111-step timeline are linked.' },
      { label: 'Assembly larger than 100 mm per axis', state: 'shown', detail: 'The Fusion step-103 assembled envelope is about 112.5 × 137.6 × 142.3 mm.' },
      { label: 'Sketches and technical drawings', state: 'shown', detail: 'The original DOCX contains sketches, component drawings and physical photos; separate helmet, nut and bolt PDFs are linked.' },
      { label: 'At least two physical materials', state: 'shown', detail: 'The original project names black and white PLA, cotton, red fabric and thread; the assembled photo shows the fabric crest.' },
      { label: 'Physical print and finishing', state: 'shown', detail: 'The original document shows printed components, a print in progress and the assembled object; it records sanding as post-processing.' },
      { label: 'Printability and fit testing', state: 'partial', detail: 'The component layout and assembled print show fabrication. The source does not record measured clearance or a visor-motion test.' },
    ],
    links: [
      { label: 'Original final documentation · DOCX', href: '/art-course/final/original-documentation.docx' },
      { label: 'Original helmet drawing · PDF', href: '/art-course/final/helmet-drawing.pdf' },
      { label: 'Original nut drawing · PDF', href: '/art-course/final/nut-drawing.pdf' },
      { label: 'Original bolt drawing · PDF', href: '/art-course/final/bolt-view.pdf' },
      { label: 'Design notes and sketches · PDF', href: '/art-course/final/process-notes.pdf' },
      { label: 'Four technical sheets · PDF', href: '/art-course/final/technical-drawings.pdf', note: 'Prepared from Fusion geometry measurements; not a successful native Fusion Drawing export.' },
      { label: '111-step Fusion timeline · PDF', href: '/art-course/final/fusion-timeline.pdf' },
      { label: 'Original Fusion design · F3D', href: '/art-course/final/original-model.f3d' },
      { label: 'Fusion cloud assembly · F3D', href: '/art-course/final/fusion-assembly.f3d' },
      { label: 'Fusion bolt design · F3D', href: '/art-course/final/fusion-bolt.f3d' },
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
      { label: 'Assembled Fusion model', url: '/art-course/final/fusion-assembly.stl' },
      { label: 'Helmet shell', url: '/art-course/final/helmet.stl' },
      { label: 'Visor', url: '/art-course/final/visor.stl' },
      { label: 'Left hinge', url: '/art-course/final/hinge-left.stl' },
      { label: 'Right hinge', url: '/art-course/final/hinge-right.stl' },
      { label: 'Bolt + nut', url: '/art-course/final/fusion-bolt.stl' },
      { label: 'Threaded bolt', url: '/art-course/final/bolt-detail.stl' },
      { label: 'Bolt · unthreaded draft', url: '/art-course/final/bolt.stl' },
    ],
    modelNote: 'Select a component to rotate its STL mesh. “Bolt + nut” is exported from the Fusion file “bolt for the final helmet”; the threaded bolt and unthreaded draft are earlier bolt meshes. The original document below shows the separate printed parts and assembled object.',
  },
]

export const projectBySlug = Object.fromEntries(artProjects.map((project) => [project.slug, project])) as Record<string, ArtProject>
