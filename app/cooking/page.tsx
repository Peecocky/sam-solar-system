import Image from 'next/image'
import Link from 'next/link'
import styles from './kitchen.module.css'

const recipes = [
  {
    id: 'salmon',
    number: '01',
    name: '莳萝三文鱼黑麦吐司',
    english: 'Dill Salmon on Rye',
    time: '25 MIN',
    serves: 'SERVES 2',
    image: '/kitchen/nordic-salmon.png',
    note: '冷、酸、咸与奶油感的平衡。适合周末早午餐。',
    ingredients: ['黑麦面包 2 片', '烟熏或腌三文鱼 160g', '小土豆 250g', '酸奶油 80g', '甜菜根 1 个', '柠檬 1 个', '莳萝、盐、黑胡椒'],
    steps: [
      '烤箱预热至 210°C。小土豆拌橄榄油与盐，烤 20–25 分钟至边缘金黄。',
      '酸奶油加入半个柠檬汁、莳萝碎、盐和黑胡椒，搅匀后冷藏 10 分钟。',
      '黑麦面包两面轻烤。先抹莳萝酸奶油，再将三文鱼松散折叠铺上。',
      '配烤土豆、甜菜根与柠檬角装盘，最后补少量莳萝和黑胡椒。',
    ],
  },
  {
    id: 'mushroom',
    number: '02',
    name: '野菌开放式三明治',
    english: 'Woodland Mushroom Toast',
    time: '20 MIN',
    serves: 'SERVES 2',
    image: '/kitchen/mushroom-toast.png',
    note: '焦香蘑菇、酸奶油和快速腌黄瓜，味道厚重但收尾清爽。',
    ingredients: ['酸种面包 2 片', '混合蘑菇 300g', '黄瓜 1 根', '酸奶油 60g', '苹果醋 2 汤匙', '黄油 20g', '百里香、盐、黑胡椒'],
    steps: [
      '黄瓜刨薄片，加入苹果醋、一撮糖与盐，抓匀后静置 15 分钟。',
      '蘑菇擦净并撕成大小不一的块。热锅先干煸至水分蒸发，再加入黄油。',
      '放百里香、盐和黑胡椒，将蘑菇煎到深金棕色；面包同时烤脆。',
      '蘑菇堆在吐司上，加一勺酸奶油与腌黄瓜，趁热食用。',
    ],
  },
  {
    id: 'cardamom',
    number: '03',
    name: '北欧豆蔻结面包',
    english: 'Cardamom Knots',
    time: '2 H 30 MIN',
    serves: 'MAKES 8',
    image: '/kitchen/cardamom-buns.png',
    note: '外层微脆、内部柔软，豆蔻香比肉桂更明亮。',
    ingredients: ['高筋面粉 360g', '牛奶 180ml', '黄油 90g', '细砂糖 65g', '即发酵母 5g', '豆蔻籽 2 茶匙', '鸡蛋 1 个、盐 3g'],
    steps: [
      '温牛奶与酵母混合。加入面粉、35g 糖、鸡蛋和盐，揉成团后分次揉入 45g 软化黄油。',
      '盖好发酵约 60 分钟至两倍大。其余黄油与糖、现磨豆蔻拌成馅。',
      '面团擀成长方形，抹馅后对折，切成 8 条；每条扭转后绕成结。',
      '二次发酵 30 分钟，刷蛋液，200°C 烤 12–15 分钟。出炉后撒豆蔻糖。',
    ],
  },
]

export default function CookingPage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a href="#top" className={styles.brand}>SAM&apos;S KITCHEN</a>
        <nav>
          <a href="#menu">Menu</a>
          <a href="#recipes">Recipes</a>
          <Link href="/">Orbit ↗</Link>
        </nav>
      </header>

      <section className={styles.hero} id="top">
        <Image
          src="/kitchen/nordic-salmon.png"
          alt="Nordic salmon rye toast with potatoes and beetroot"
          fill
          sizes="100vw"
          priority
        />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p>SEASON · LATE SUMMER / 2026</p>
          <h1>Sam&apos;s<br />Kitchen</h1>
          <div>
            <span>SHANGHAI · HOME TABLE</span>
            <p>北欧式的克制，家常菜的温度。每道菜都有清楚步骤，也允许临场发挥。</p>
          </div>
        </div>
        <a className={styles.scroll} href="#menu">TODAY&apos;S MENU ↓</a>
      </section>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>A SMALL NOTE</p>
        <h2>少一点装饰，<br />多一点真正好吃。</h2>
        <p className={styles.introText}>
          这里不是精确到克的实验室，而是一份可以跟着做的私人菜单。酸味负责提亮，
          香草负责连接，火候负责留下记忆。
        </p>
      </section>

      <section className={styles.menu} id="menu">
        <header className={styles.sectionTitle}>
          <p>THE MENU</p>
          <h2>Three courses,<br />one quiet table.</h2>
        </header>

        <div className={styles.menuGrid}>
          {recipes.map((recipe) => (
            <a className={styles.menuCard} href={`#${recipe.id}`} key={recipe.id}>
              <div className={styles.cardImage}>
                <Image src={recipe.image} alt={recipe.name} fill sizes="(max-width: 760px) 100vw, 33vw" />
                <span>{recipe.number}</span>
              </div>
              <div className={styles.cardCopy}>
                <small>{recipe.time} · {recipe.serves}</small>
                <h3>{recipe.name}</h3>
                <p>{recipe.english}</p>
                <b aria-hidden="true">VIEW RECIPE ↘</b>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.recipes} id="recipes">
        {recipes.map((recipe, recipeIndex) => (
          <article className={styles.recipe} id={recipe.id} key={recipe.id}>
            <div className={styles.recipeImage}>
              <Image src={recipe.image} alt={recipe.name} fill sizes="(max-width: 800px) 100vw, 50vw" />
              <span>{recipe.number} / 03</span>
            </div>
            <div className={styles.recipeBody}>
              <p className={styles.eyebrow}>RECIPE {recipe.number} · {recipe.time}</p>
              <h2>{recipe.name}</h2>
              <h3>{recipe.english}</h3>
              <p className={styles.note}>{recipe.note}</p>

              <div className={styles.recipeColumns}>
                <div>
                  <h4>INGREDIENTS</h4>
                  <ul>
                    {recipe.ingredients.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h4>METHOD</h4>
                  <ol>
                    {recipe.steps.map((step, index) => (
                      <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <a className={styles.next} href={recipeIndex === recipes.length - 1 ? '#top' : `#${recipes[recipeIndex + 1].id}`}>
                {recipeIndex === recipes.length - 1 ? 'Back to the top ↑' : 'Next course ↓'}
              </a>
            </div>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>THE KITCHEN IS OPEN</p>
        <h2>Cook slowly.<br />Eat while it&apos;s warm.</h2>
        <Link href="/">Return to the solar system →</Link>
      </footer>
    </main>
  )
}
