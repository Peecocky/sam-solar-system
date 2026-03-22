'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BirthdayGate from '@/components/BirthdayGate'

type Recipe = {
  id: string
  name: string
  nameCn: string
  category: string
  tagline: string
  description: string
  photoLabel: string
  accent: string
  steps: string[]
  tips: string
}

const RECIPES: Recipe[] = [
  {
    id: 'tea',
    name: 'Tea Ceremony Lite',
    nameCn: '泡茶',
    category: 'ritual',
    tagline: 'Kitchen boot-up, but with better manners.',
    description:
      'This is the opening scene. Water gets heated, leaves get respected, and the kitchen agrees to behave itself for the next ten minutes.',
    photoLabel: 'Photo slot reserved for tea evidence',
    accent: '#d4a574',
    steps: [
      'Boil water like it is the start button for the whole room.',
      'Let the tea leaves feel selected, not dumped.',
      'Wait just long enough to look patient and mildly superior.',
      'Pour with the confidence of someone who absolutely meant to do this.',
    ],
    tips: '泡茶在这里不是配角，它是整页的开机动画。',
  },
  {
    id: 'sushi',
    name: 'First-Time Sushi',
    nameCn: '寿司',
    category: 'seafood',
    tagline: 'First cooking attempt, zero fear, questionable proportions.',
    description:
      'A debut project with the sort of confidence usually reserved for people who have done this before. Rice, seaweed, structure, and a level of optimism that deserves applause.',
    photoLabel: 'Photo slot reserved for sushi debut',
    accent: '#e8b17c',
    steps: [
      'Prepare rice while pretending texture control is easy.',
      'Convince the fillings to stay in formation.',
      'Roll the whole thing with beginner-level courage.',
      'Slice and pray for geometry.',
    ],
    tips: '朋友圈版首秀很重要，因为证据链完整。',
  },
  {
    id: 'shrimp',
    name: 'Shrimp Labor Division',
    nameCn: '剥虾',
    category: 'seafood',
    tagline: 'Manual processing first, shrimp rice later.',
    description:
      'Every shrimp passes through the hands-on department before graduating into the rice plan. It is less glamorous than it sounds and far more honest.',
    photoLabel: 'Photo slot reserved for shrimp work shift',
    accent: '#d9996f',
    steps: [
      'Peel each shrimp without filing a formal complaint.',
      'Keep the line moving even if morale is low.',
      'Transfer the survivors into the shrimp-rice operation.',
      'Act like this was always the plan.',
    ],
    tips: '虾负责鲜，Sam 负责工时。',
  },
  {
    id: 'crab',
    name: 'King Crab Surgery',
    nameCn: '剥蟹',
    category: 'seafood',
    tagline: 'Small scissors, large responsibility.',
    description:
      'This is not ordinary prep. This is careful shell extraction with the attitude of a tiny seafood surgeon who refuses to panic.',
    photoLabel: 'Photo slot reserved for king crab surgery',
    accent: '#c97a6d',
    steps: [
      'Bring in the small scissors and suspend all recklessness.',
      'Locate a path through the shell that does not create tragedy.',
      'Extract edible parts with impressive seriousness.',
      'Pretend this level of focus is normal behavior.',
    ],
    tips: '工具很小，但项目是帝王级难度。',
  },
  {
    id: 'salmon',
    name: 'Salmon and Soy',
    nameCn: '三文鱼解冻和蘸酱油',
    category: 'seafood',
    tagline: 'A study in patience and not overdoing the soy sauce.',
    description:
      'The real work here is restraint. Good salmon does not need drama, just decent thawing judgment and a soy sauce cameo instead of a monologue.',
    photoLabel: 'Photo slot reserved for salmon protocol',
    accent: '#d4907f',
    steps: [
      'Let the salmon return at a civilized pace.',
      'Do not rush the thawing like a villain.',
      'Prepare soy sauce as support staff, not main cast.',
      'Serve once the texture stops looking offended.',
    ],
    tips: '真正的技术不是猛，而是知道什么时候该等一下。',
  },
  {
    id: 'surf-clam',
    name: 'Surf Clam Precision',
    nameCn: '北极贝清洁与刺身切割',
    category: 'knife-work',
    tagline: 'Seafood spa treatment followed by disciplined slicing.',
    description:
      'This chapter is for meticulous cleaning, neat sashimi cuts, and the kind of concentration that makes nearby people instinctively quieter.',
    photoLabel: 'Photo slot reserved for surf clam precision',
    accent: '#c8a36d',
    steps: [
      'Clean everything until even suspicion is removed.',
      'Trim with the confidence of someone under imaginary inspection.',
      'Slice into sashimi with straight edges and zero nonsense.',
      'Admire the order before anybody eats it.',
    ],
    tips: '这不是随手切两刀，这是给北极贝做毕业答辩。',
  },
  {
    id: 'milk',
    name: 'Hot Milk',
    nameCn: '热牛奶',
    category: 'ritual',
    tagline: 'The soft ending every dramatic kitchen deserves.',
    description:
      'No chaos, no knives, no shell fragments. Just a warm cup that closes the day like a polite period at the end of a very long sentence.',
    photoLabel: 'Photo slot reserved for hot milk ending',
    accent: '#d9c2a1',
    steps: [
      'Heat the milk without turning it into foam theater.',
      'Stop before the pot starts feeling ambitious.',
      'Pour, hold, and let the room become noticeably calmer.',
      'End scene.',
    ],
    tips: '有些人做硬菜，有些人负责把世界调回温柔模式。',
  },
]

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'seafood', label: 'Seafood' },
  { key: 'ritual', label: 'Ritual' },
  { key: 'knife-work', label: 'Knife Work' },
]

export default function CookingPage() {
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const contentRef = useRef<HTMLDivElement>(null)

  const filteredRecipes =
    activeCategory === 'all'
      ? RECIPES
      : RECIPES.filter((recipe) => recipe.category === activeCategory)

  function scrollToRecipe(id: string) {
    setDrawerOpen(false)
    setTimeout(() => {
      document.getElementById(`recipe-${id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 250)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.12 }
    )

    const cards = document.querySelectorAll('.recipe-card')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [filteredRecipes])

  return (
    <BirthdayGate backHref="/" prompt="When is Sam's birthday?">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .cooking-page {
          --bg: #0c0a09;
          --text: #faf8f5;
          --muted: #a8a29e;
          --accent: #d4a574;
          --accent2: #c2410c;
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 900;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 340px;
          background: #1a1614;
          border-right: 1px solid rgba(212, 165, 116, 0.15);
          z-index: 950;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 60px 32px 32px;
          overflow-y: auto;
        }
        .drawer.open {
          transform: translateX(0);
        }

        .drawer h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 400;
          letter-spacing: 3px;
          color: var(--accent);
          margin-bottom: 32px;
          text-transform: uppercase;
        }

        .drawer .cat-btn {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          color: var(--muted);
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 10px 0;
          cursor: pointer;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .drawer .cat-btn.active,
        .drawer .cat-btn:hover {
          color: var(--accent);
        }

        .drawer .recipe-link {
          display: block;
          padding: 14px 16px;
          margin: 4px 0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .drawer .recipe-link:hover {
          background: rgba(212, 165, 116, 0.08);
          border-color: rgba(212, 165, 116, 0.15);
        }
        .drawer .recipe-link .rname {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: var(--text);
        }
        .drawer .recipe-link .rcn {
          font-size: 12px;
          color: var(--muted);
          margin-top: 2px;
          letter-spacing: 1px;
        }

        .top-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 800;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
          background: linear-gradient(
            to bottom,
            rgba(12, 10, 9, 0.95) 0%,
            transparent 100%
          );
        }

        .menu-btn {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text);
          padding: 10px 20px;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s;
          border-radius: 2px;
        }
        .menu-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: var(--text);
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 13px;
          letter-spacing: 2px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .back-btn:hover {
          color: var(--accent);
        }

        .hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          padding: 0 24px;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(transparent, var(--bg));
        }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 400;
          letter-spacing: 8px;
          margin: 0;
          line-height: 1.1;
        }
        .hero p {
          color: var(--muted);
          font-size: 14px;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-top: 20px;
          max-width: 760px;
          line-height: 1.8;
        }
        .hero .scroll-hint {
          position: absolute;
          bottom: 48px;
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 3px;
          animation: float 2s ease-in-out infinite;
          z-index: 2;
          text-transform: uppercase;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        .recipes-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 32px 120px;
        }

        .recipe-card {
          margin-bottom: 160px;
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .recipe-card.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .recipe-card .card-image {
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 28%),
            linear-gradient(135deg, rgba(212, 165, 116, 0.18), rgba(37, 26, 19, 0.86));
          transition: filter 0.4s;
        }
        .recipe-card .card-image:hover {
          filter: brightness(1.03);
        }
        .recipe-card .card-image::before {
          content: '';
          position: absolute;
          inset: 18px;
          border: 1px dashed rgba(212, 165, 116, 0.25);
        }
        .recipe-card .card-image::after {
          content: '';
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%);
          top: -30px;
          right: -30px;
        }

        .placeholder-meta {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          z-index: 1;
        }

        .placeholder-meta strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          letter-spacing: 1px;
          margin-bottom: 10px;
          color: white;
        }

        .placeholder-meta span {
          display: block;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255,255,255,0.68);
        }

        .recipe-card .card-meta {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-top: 28px;
          margin-bottom: 8px;
        }
        .recipe-card .card-meta .num {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 400;
          color: rgba(212, 165, 116, 0.25);
          line-height: 1;
        }
        .recipe-card .card-meta .cat-label {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--accent);
        }

        .recipe-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 400;
          margin: 8px 0 4px;
          line-height: 1.2;
        }
        .recipe-card .tagline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: var(--muted);
          font-size: 18px;
          margin-bottom: 20px;
        }
        .recipe-card .desc {
          color: #d6d3d1;
          font-size: 15px;
          line-height: 1.8;
          max-width: 700px;
        }

        .steps {
          margin-top: 40px;
          padding-left: 0;
          list-style: none;
          counter-reset: step;
        }
        .steps li {
          counter-increment: step;
          position: relative;
          padding: 16px 0 16px 48px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          font-size: 14px;
          line-height: 1.7;
          color: #d6d3d1;
        }
        .steps li::before {
          content: counter(step);
          position: absolute;
          left: 0;
          top: 16px;
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: rgba(212, 165, 116, 0.35);
        }

        .recipe-card .tip {
          margin-top: 24px;
          padding: 20px 24px;
          background: rgba(212, 165, 116, 0.06);
          border-left: 2px solid var(--accent);
          font-size: 13px;
          line-height: 1.7;
          color: var(--muted);
          font-style: italic;
          border-radius: 0 4px 4px 0;
        }

        .section-divider {
          width: 40px;
          height: 1px;
          background: var(--accent);
          margin: 0 auto 160px;
          opacity: 0.3;
        }
      `}</style>

      <div className="cooking-page">
        <div
          className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
          onClick={() => setDrawerOpen(false)}
        />

        <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
          <h2>Menu</h2>

          <div style={{ marginBottom: 24 }}>
            {CATEGORIES.map((category) => (
              <button
                key={category.key}
                className={`cat-btn ${activeCategory === category.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 16,
            }}
          >
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-link"
                onClick={() => scrollToRecipe(recipe.id)}
              >
                <div className="rname">{recipe.name}</div>
                <div className="rcn">{recipe.nameCn}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-bar">
          <button className="menu-btn" onClick={() => setDrawerOpen(!drawerOpen)}>
            Menu
          </button>
          <div className="logo">Sam&apos;s Kitchen</div>
          <button className="back-btn" onClick={() => router.push('/')}>
            Back to Solar System
          </button>
        </div>

        <div className="hero">
          <h1>
            Sam&apos;s
            <br />
            Kitchen
          </h1>
          <p>
            The old layout is back. The content is still your seven kitchen incidents,
            just presented with the original editorial recipe-book styling and reserved
            photo space for when the real evidence arrives.
          </p>
          <div className="scroll-hint">scroll to explore</div>
        </div>

        <div className="recipes-container" ref={contentRef}>
          {filteredRecipes.map((recipe, index) => (
            <div key={recipe.id} id={`recipe-${recipe.id}`}>
              <div className="recipe-card">
                <div
                  className="card-image"
                  style={{
                    background: `radial-gradient(circle at top right, rgba(255,255,255,0.12), transparent 28%), linear-gradient(135deg, ${recipe.accent}33, rgba(21, 16, 13, 0.94))`,
                  }}
                >
                  <div className="placeholder-meta">
                    <div>
                      <strong>{recipe.name}</strong>
                      <span>{recipe.photoLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="card-meta">
                  <span className="num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="cat-label">{recipe.category}</span>
                </div>
                <h2>{recipe.name}</h2>
                <div className="tagline">{recipe.tagline}</div>
                <div className="desc">{recipe.description}</div>

                <ol className="steps">
                  {recipe.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>

                <div className="tip">{recipe.tips}</div>
              </div>

              {index < filteredRecipes.length - 1 && (
                <div className="section-divider" />
              )}
            </div>
          ))}
        </div>
      </div>
    </BirthdayGate>
  )
}
