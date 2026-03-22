'use client'

import { useRouter } from 'next/navigation'

type KitchenMoment = {
  id: string
  title: string
  label: string
  summary: string
  story: string
  punchline: string
  details: string[]
}

const KITCHEN_MOMENTS: KitchenMoment[] = [
  {
    id: 'tea',
    title: '泡茶',
    label: 'Kitchen boot sequence',
    summary: '一切从烧水开始。厨房是否文明，先看这壶水有没有被认真对待。',
    story:
      '这不是普通喝茶，这是 Sam 给厨房按下开机键。步骤看似简单，气质必须到位：水温不能马虎，茶叶不能受委屈，杯子最好也被尊重。',
    punchline: '如果说做饭是主线任务，那泡茶就是进入副本前的庄严读条。',
    details: ['热水管理', '茶叶投放', '气氛值拉满'],
  },
  {
    id: 'sushi',
    title: '寿司',
    label: 'First-cook confidence incident',
    summary: '第一次做饭就去碰寿司，属于对自己有一种未经证实但非常坚定的信任。',
    story:
      '米饭、醋、卷帘、整形，理论上每一步都很温柔，实际上每一步都在考验手部稳定性和精神状态。朋友圈那次，是一场名副其实的首秀。',
    punchline: '成品的灵魂大概是：想当米其林，先别让海苔走位。',
    details: ['第一次做饭纪念', '卷物塑形', '朋友圈留档'],
  },
  {
    id: 'shrimp',
    title: '剥虾',
    label: 'Shellfish labor division',
    summary: '先做甲壳类劳务，再做虾米饭。流程完整，态度端正，手指略微抗议。',
    story:
      '剥虾这件事看着像前置步骤，实际是耐心测试。每只虾都得经过人工处理，最后再汇总进入虾米饭项目，形成一个高效但不轻松的供应链。',
    punchline: '虾负责鲜，Sam 负责工时。',
    details: ['去壳处理', '虾米饭前置', '手工耐心活'],
  },
  {
    id: 'crab',
    title: '剥蟹',
    label: 'King crab surgery',
    summary: '帝王蟹 + 小剪刀，这已经不是做饭了，这是一台精密海鲜外科手术。',
    story:
      '器材并不夸张，但精神状态必须像主刀医生。剪刀下去要准，力道不能莽，目标是在不制造海鲜灾难的前提下，把可食用部分体面地请出来。',
    punchline: '别看工具很小，处理的是帝王级别的复杂度。',
    details: ['帝王蟹处理', '小剪刀作业', '精细拆解'],
  },
  {
    id: 'salmon',
    title: '三文鱼解冻和蘸酱油',
    label: 'Ceremonial patience',
    summary: '三文鱼最怕两件事：粗暴解冻，以及酱油倒得像报复社会。',
    story:
      '这一步的重点不在“快”，而在“稳”。先把鱼恢复到一个合适状态，再让酱油以配角身份出现。毕竟主角已经够贵了，没必要再被折腾。',
    punchline: '真正的技术不是猛，是知道什么时候该等一下。',
    details: ['解冻节奏', '蘸酱控制', '刺身前的尊重'],
  },
  {
    id: 'surf-clam',
    title: '北极贝清洁与刺身切割',
    label: 'Seafood spa and precision slicing',
    summary: '清洁非常仔细，切割非常认真，北极贝大概经历了它职业生涯里最正式的一次护理。',
    story:
      '先清，再修，再切，动作里带一点洁癖和一点强迫症。处理北极贝这件事最怕含糊，所以这部分的风格非常明确：海鲜可以凉，流程不能乱。',
    punchline: '这不是随便切两刀，这是给北极贝做毕业答辩。',
    details: ['仔细清洁', '刺身切片', '整齐度执念'],
  },
  {
    id: 'milk',
    title: '热牛奶',
    label: 'Soft landing',
    summary: '不是所有夜晚都需要大菜，有时候一杯热牛奶就足够像句号。',
    story:
      '热牛奶的厉害之处在于，它明明很简单，却非常会收尾。厨房忙完之后来这一杯，整个页面的语气都会自动柔和下来。',
    punchline: '有些人负责做硬菜，有些人负责在最后把世界调成温柔模式。',
    details: ['深夜收尾', '热度管理', '安静但有效'],
  },
]

export default function CookingPage() {
  const router = useRouter()

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Serif+SC:wght@500;600;700&display=swap');

        .kitchen-page {
          --bg: #fff7ec;
          --bg-deep: #f3dbc0;
          --ink: #563a2d;
          --muted: #8a6858;
          --line: rgba(86, 58, 45, 0.15);
          --accent: #bf6a3f;
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(255,255,255,0.88), transparent 28%),
            linear-gradient(180deg, #fff7ec 0%, #f8ead4 52%, #f2d9b7 100%);
          color: var(--ink);
          font-family: 'IBM Plex Sans', 'Noto Serif SC', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .kitchen-page::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(rgba(104, 74, 44, 0.08) 1px, transparent 1px),
            linear-gradient(120deg, rgba(255,255,255,0.25), transparent 45%);
          background-size: 20px 20px, 100% 100%;
          opacity: 0.45;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: rgba(255, 247, 236, 0.8);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(86, 58, 45, 0.08);
        }

        .back-btn {
          border: 1px solid rgba(86, 58, 45, 0.18);
          background: rgba(255, 255, 255, 0.38);
          color: var(--ink);
          padding: 10px 14px;
          font: 600 12px 'IBM Plex Sans', sans-serif;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          cursor: pointer;
        }

        .top-title {
          font-family: 'Fraunces', 'Noto Serif SC', serif;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .hero {
          max-width: 1080px;
          margin: 0 auto;
          padding: 72px 24px 46px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 32px;
          align-items: end;
        }

        .hero h1 {
          margin: 0;
          font-family: 'Fraunces', 'Noto Serif SC', serif;
          font-size: clamp(50px, 9vw, 100px);
          line-height: 0.95;
          letter-spacing: -2px;
        }

        .hero p {
          margin: 18px 0 0;
          font-size: 18px;
          line-height: 1.8;
          color: var(--muted);
          max-width: 600px;
        }

        .hero-note {
          background: rgba(255,255,255,0.38);
          border: 1px solid rgba(86, 58, 45, 0.12);
          padding: 22px 24px;
          box-shadow: 0 18px 40px rgba(126, 85, 49, 0.08);
        }

        .hero-note .eyebrow,
        .story-meta,
        .detail-chip {
          font-size: 11px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .hero-note .eyebrow {
          color: var(--accent);
          margin-bottom: 10px;
          font-weight: 600;
        }

        .hero-note strong {
          display: block;
          font-family: 'Fraunces', 'Noto Serif SC', serif;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .hero-note p {
          margin: 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
        }

        .stories {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 24px 90px;
        }

        .story-card {
          display: grid;
          grid-template-columns: 0.96fr 1.04fr;
          gap: 34px;
          align-items: center;
          padding: 34px 0;
          border-top: 1px solid var(--line);
        }

        .story-card:nth-child(even) .story-photo {
          order: 2;
        }

        .story-card:nth-child(even) .story-copy {
          order: 1;
        }

        .story-photo {
          min-height: 340px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.72), rgba(244, 220, 193, 0.88)),
            linear-gradient(120deg, rgba(191,106,63,0.08), transparent 60%);
          border: 1px solid rgba(86, 58, 45, 0.14);
          box-shadow: 0 24px 45px rgba(118, 84, 51, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .story-photo::before {
          content: '';
          position: absolute;
          inset: 20px;
          border: 1px dashed rgba(86, 58, 45, 0.18);
        }

        .story-photo::after {
          content: '';
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.55), transparent 68%);
          top: -24px;
          right: -24px;
        }

        .photo-placeholder {
          position: relative;
          z-index: 1;
          text-align: center;
          color: rgba(86, 58, 45, 0.78);
        }

        .photo-placeholder .slot {
          font-family: 'Fraunces', 'Noto Serif SC', serif;
          font-size: 34px;
          margin-bottom: 12px;
        }

        .photo-placeholder p {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          max-width: 300px;
        }

        .story-copy {
          padding-right: 10px;
        }

        .story-index {
          color: rgba(191, 106, 63, 0.58);
          font-family: 'Fraunces', serif;
          font-size: 56px;
          line-height: 1;
          margin-bottom: 12px;
        }

        .story-copy h2 {
          margin: 0;
          font-family: 'Fraunces', 'Noto Serif SC', serif;
          font-size: clamp(34px, 6vw, 52px);
          line-height: 1;
        }

        .story-copy .label {
          margin-top: 10px;
          color: var(--accent);
          font-size: 13px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .story-copy .summary {
          margin-top: 16px;
          font-size: 20px;
          line-height: 1.65;
          color: #6a4a3d;
        }

        .story-copy .story {
          margin-top: 14px;
          font-size: 15px;
          line-height: 1.9;
          color: var(--muted);
        }

        .story-copy .punchline {
          margin-top: 18px;
          padding: 14px 16px;
          border-left: 3px solid rgba(191, 106, 63, 0.5);
          background: rgba(255, 255, 255, 0.36);
          color: #6f4a3c;
          line-height: 1.8;
          font-size: 15px;
        }

        .detail-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .detail-chip {
          padding: 8px 10px;
          background: rgba(255,255,255,0.44);
          border: 1px solid rgba(86, 58, 45, 0.1);
          color: rgba(86, 58, 45, 0.76);
        }

        .story-meta {
          margin-top: 16px;
          color: rgba(86, 58, 45, 0.54);
          font-weight: 600;
        }

        @media (max-width: 860px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 54px;
          }

          .story-card {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .story-card:nth-child(even) .story-photo,
          .story-card:nth-child(even) .story-copy {
            order: initial;
          }

          .story-photo {
            min-height: 280px;
          }
        }
      `}</style>

      <div className="kitchen-page">
        <div className="topbar">
          <button className="back-btn" onClick={() => router.push('/')}>
            Back to Solar System
          </button>
          <div className="top-title">Sam&apos;s Kitchen</div>
          <div style={{ width: 150 }} />
        </div>

        <section className="hero">
          <div>
            <h1>
              Sam&apos;s
              <br />
              Kitchen
            </h1>
            <p>
              这页不再假装自己是一个公共菜谱网站。现在它只干一件事：
              认真记录 Sam 在厨房里发生过的 7 起重要事件，并给照片留下体面的位置。
            </p>
          </div>

          <div className="hero-note">
            <div className="eyebrow">Field note</div>
            <strong>Evidence locker is open.</strong>
            <p>
              每张图目前都留了专属照片位。你后续把照片发来之后，直接替换掉占位区就可以，
              页面结构已经按“个人厨房档案馆”准备好了。
            </p>
          </div>
        </section>

        <section className="stories">
          {KITCHEN_MOMENTS.map((moment, index) => (
            <article className="story-card" key={moment.id}>
              <div className="story-photo">
                <div className="photo-placeholder">
                  <div className="slot">Photo Slot {String(index + 1).padStart(2, '0')}</div>
                  <p>
                    Reserved for {moment.title} evidence.
                    <br />
                    Waiting for your photo drop.
                  </p>
                </div>
              </div>

              <div className="story-copy">
                <div className="story-index">{String(index + 1).padStart(2, '0')}</div>
                <h2>{moment.title}</h2>
                <div className="label">{moment.label}</div>
                <div className="summary">{moment.summary}</div>
                <div className="story">{moment.story}</div>
                <div className="punchline">{moment.punchline}</div>
                <div className="detail-row">
                  {moment.details.map((detail) => (
                    <span className="detail-chip" key={detail}>
                      {detail}
                    </span>
                  ))}
                </div>
                <div className="story-meta">Photo reserved and ready for replacement.</div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  )
}
