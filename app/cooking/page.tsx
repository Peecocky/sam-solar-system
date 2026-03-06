'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

/* ===== Data ===== */
type Recipe = {
  id: string
  name: string
  nameCn: string
  category: string
  tagline: string
  description: string
  image: string
  steps: string[]
  tips: string
}

const RECIPES: Recipe[] = [
  {
    id: 'steak',
    name: 'Pan-Seared Steak',
    nameCn: '牛排',
    category: 'meat',
    tagline: 'The perfect sear, every time.',
    description:
      'A thick-cut ribeye, kissed by cast iron until the crust shatters and the interior blushes pink. Finished with garlic butter, thyme, and a whisper of flaky salt.',
    image:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    steps: [
      'Bring steak to room temperature for 40 minutes. Pat completely dry with paper towels.',
      'Season generously with coarse salt and cracked black pepper on all sides.',
      'Heat cast iron until smoking. Add high smoke-point oil — avocado or grapeseed.',
      'Sear 3 minutes per side undisturbed. Listen for that deep, crackling sizzle.',
      'Add butter, crushed garlic, and fresh thyme. Baste continuously for 60 seconds.',
      'Rest on a wire rack for 8 minutes. The carryover heat finishes the work.',
    ],
    tips: 'The secret is patience: a dry surface and a screaming hot pan create the Maillard crust.',
  },
  {
    id: 'shrimp',
    name: 'Garlic Butter Shrimp',
    nameCn: '虾仁',
    category: 'seafood',
    tagline: 'Five minutes. Infinite flavor.',
    description:
      'Plump shrimp swimming in a pool of golden garlic butter, bright with lemon zest and a kick of red pepper flakes. Simple enough for Tuesday, elegant enough for Saturday.',
    image:
      'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800&q=80',
    steps: [
      'Devein and butterfly large shrimp. Pat dry — moisture is the enemy of a good sear.',
      'Melt butter over medium-high heat until it foams and smells nutty.',
      'Add thinly sliced garlic, cook 30 seconds until fragrant but not brown.',
      'Add shrimp in a single layer. Cook 90 seconds until edges turn coral pink.',
      'Flip, squeeze half a lemon over the pan, add red pepper flakes.',
      'Remove from heat immediately. The residual heat cooks them through.',
    ],
    tips: 'Overcooked shrimp are rubber. When they curl into a C shape, they\'re perfect. A full O means overdone.',
  },
  {
    id: 'salmon',
    name: 'Miso-Glazed Salmon',
    nameCn: '三文鱼',
    category: 'seafood',
    tagline: 'Umami meets elegance.',
    description:
      'Silky salmon fillets lacquered in a sweet-savory miso glaze, broiled until the edges caramelize and the center stays jewel-toned. Served over steamed rice with pickled ginger.',
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    steps: [
      'Mix white miso, mirin, sake, and brown sugar into a smooth glaze.',
      'Marinate salmon fillets for at least 2 hours, ideally overnight.',
      'Preheat broiler. Line a sheet pan with foil and lightly oil it.',
      'Place salmon skin-side down. Broil 6-8 minutes until glaze bubbles and chars.',
      'The flesh should flake easily but still be slightly translucent at center.',
      'Garnish with sesame seeds and thinly sliced scallion.',
    ],
    tips: 'White miso is milder and sweeter than red. For salmon, it\'s the perfect partner.',
  },
  {
    id: 'milk-tea',
    name: 'Hong Kong Milk Tea',
    nameCn: '奶茶',
    category: 'drinks',
    tagline: 'Silk stocking, silk smooth.',
    description:
      'The legendary pantyhose tea — bold Ceylon black tea, pulled repeatedly through a cloth filter until it achieves that unmistakable velvety body. Sweetened with evaporated milk.',
    image:
      'https://images.unsplash.com/photo-1558857563-b371033873b8?w=800&q=80',
    steps: [
      'Bring water to a rolling boil. Use strong Ceylon or a blend of Assam + Ceylon.',
      'Add tea leaves generously — this should be bold. Boil for 3 minutes.',
      'Pour through a fine cloth strainer into another pot. Then pour back. Repeat 4-6 times.',
      'This "pulling" aerates the tea and creates the signature smooth texture.',
      'Add evaporated milk (not fresh milk) to taste — about 1:3 ratio.',
      'Serve scalding hot, or pour over ice for the iced version.',
    ],
    tips: 'The repeated pulling is what separates good milk tea from great. Don\'t skip it.',
  },
  {
    id: 'pasta',
    name: 'Aglio e Olio',
    nameCn: '蒜油意面',
    category: 'pasta',
    tagline: 'Poverty food. Billionaire flavor.',
    description:
      'The Roman classic stripped to its essence: spaghetti, garlic, olive oil, chili, parsley. Every ingredient has nowhere to hide, so every detail matters.',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    steps: [
      'Cook spaghetti in heavily salted water. Reserve a full cup of pasta water before draining.',
      'Slice garlic paper-thin. Heat olive oil gently — low and slow.',
      'Toast garlic until pale gold, never brown. Add chili flakes off-heat.',
      'Drain pasta 2 minutes early. Finish cooking in the garlic oil with splashes of pasta water.',
      'Toss vigorously — the starch creates a glossy, emulsified sauce.',
      'Finish with fresh parsley and the best olive oil you own.',
    ],
    tips: 'Burnt garlic makes this dish bitter and ruins everything. Gold, never brown.',
  },
]

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'meat', label: 'Meat' },
  { key: 'seafood', label: 'Seafood' },
  { key: 'pasta', label: 'Pasta' },
  { key: 'drinks', label: 'Drinks' },
]

export default function CookingPage() {
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeRecipe, setActiveRecipe] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const filteredRecipes =
    activeCategory === 'all'
      ? RECIPES
      : RECIPES.filter((r) => r.category === activeCategory)

  const selectedRecipe = RECIPES.find((r) => r.id === activeRecipe)

  function scrollToRecipe(id: string) {
    setActiveRecipe(id)
    setDrawerOpen(false)
    setTimeout(() => {
      document.getElementById(`recipe-${id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 300)
  }

  /* ===== Intersection observer for scroll reveals ===== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.15 }
    )

    const cards = document.querySelectorAll('.recipe-card')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [filteredRecipes])

  return (
    <>
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

        /* Drawer */
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

        /* Top bar */
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

        /* Hero */
        .hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
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
        }
        .hero .scroll-hint {
          position: absolute;
          bottom: 48px;
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 3px;
          animation: float 2s ease-in-out infinite;
          z-index: 2;
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

        /* Recipe cards */
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
          object-fit: cover;
          border-radius: 4px;
          filter: brightness(0.85) contrast(1.05);
          transition: filter 0.4s;
        }
        .recipe-card:hover .card-image {
          filter: brightness(0.95) contrast(1.08);
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

        /* Steps */
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

        /* Divider */
        .section-divider {
          width: 40px;
          height: 1px;
          background: var(--accent);
          margin: 0 auto 160px;
          opacity: 0.3;
        }
      `}</style>

      <div className="cooking-page">
        {/* Drawer overlay */}
        <div
          className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Drawer */}
        <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
          <h2>Menu</h2>

          <div style={{ marginBottom: 24 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`cat-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
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

        {/* Top bar */}
        <div className="top-bar">
          <button className="menu-btn" onClick={() => setDrawerOpen(!drawerOpen)}>
            Menu
          </button>
          <div className="logo">Sam&apos;s Kitchen</div>
          <button className="back-btn" onClick={() => router.push('/')}>
            ← Solar System
          </button>
        </div>

        {/* Hero */}
        <div className="hero">
          <h1>
            Sam&apos;s
            <br />
            Kitchen
          </h1>
          <p>A personal collection of recipes</p>
          <div className="scroll-hint">scroll to explore ↓</div>
        </div>

        {/* Recipe cards */}
        <div className="recipes-container" ref={contentRef}>
          {RECIPES.map((recipe, idx) => (
            <div key={recipe.id} id={`recipe-${recipe.id}`}>
              <div className="recipe-card">
                <img
                  className="card-image"
                  src={recipe.image}
                  alt={recipe.name}
                  loading="lazy"
                />
                <div className="card-meta">
                  <span className="num">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="cat-label">{recipe.category}</span>
                </div>
                <h2>{recipe.name}</h2>
                <div className="tagline">{recipe.tagline}</div>
                <div className="desc">{recipe.description}</div>

                <ol className="steps">
                  {recipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                <div className="tip">💡 {recipe.tips}</div>
              </div>

              {idx < RECIPES.length - 1 && <div className="section-divider" />}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
