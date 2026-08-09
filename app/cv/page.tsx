'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import styles from './cv.module.css'

const BIRTHDAY = '2001-09-11'

const projects = [
  {
    title: '上海交通大学凯原法学院 — 涉外法治智能体与赛队网页',
    date: '2026.01 — 2026.06',
    bullets: [
      '基于 Dify 与 RAG 流程参与涉外法治 / 赛队知识库智能体搭建，完成数据预处理、成绩入库、智能体迭代与网页接入。',
      '整理微信公众号历史推文、赛事资讯与赛队成绩，提取赛事名称、时间、参赛队伍、成绩等字段并建立结构化标签。',
      '完成赛队智能体三轮开发：基础问答与知识库对接、召回增强、多轮对话优化、异常处理与网页端集成。',
      '设计并开发赛队网页（首页、赛事展示、成绩查询），并通过 Dify 接口实现前端与智能体交互。',
      '参与法条入库规则制定与法条拆分编译器开发，对 docx 法律文本进行层级解析、扁平化处理与召回率测试。',
    ],
  },
  {
    title: '瑞银 UBS 金融精英挑战赛 2026 — 队长、AI 投研模块与汇报 PPT',
    date: '2026.03 — 2026.05',
    bullets: [
      '担任队长，围绕 AI 光模块产业链设计 long 中际旭创 / short 华工科技的 pair trade 投资策略。',
      '独立制作核心汇报 PPT，梳理行业逻辑、公司对比、估值框架、风险矩阵与交易催化剂。',
      '负责 AI 投研模块设计，构建基于 RAG 的财报与公告检索流程，实现公司维度绑定、双轨检索、对比式回答与强制引用。',
      '将 AI 系统用于辅助判断 1.6T 光模块量产进度、毛利率变化与公司执行差异，提升投研结论的可验证性与复现性。',
    ],
  },
  {
    title: '航空订票系统 — 数据库期末项目',
    date: '2026.04 — 2026.05',
    bullets: [
      '设计航空订票网站，覆盖普通用户、顾客、订票代理与航空公司员工等不同使用场景。',
      '实现航班搜索、购票、代购、乘客列表、消费统计、佣金统计与航班状态管理等主要功能。',
      '加入登录权限、表单检查与防止重复购票 / 超卖的规则，使系统流程更完整稳定。',
    ],
  },
  {
    title: '地震数据可视化与 Sonification 交互系统',
    date: '2026.04 — 2026.05',
    bullets: [
      '设计基于 sonification 的地震数据可视化系统，针对现有工具操作复杂、功能分散、使用门槛高的问题进行改进。',
      '实现交互式教程、2D / 3D 地图切换、历史浏览记录与时间分布播放功能。',
      '加入 brush interaction 与 audio probing，使用户能通过视觉与声音共同探索地震事件的时间、空间与强度分布。',
      '作为数据可视化期末课题展示，因交互体验与声音辅助探索设计获得积极反馈。',
    ],
  },
  {
    title: '城市环境声音分类 — Kaggle',
    date: '2025.12',
    bullets: [
      '基于 UrbanSound8K 构建环境声音分类模型，处理多类别预测与类别不平衡问题。',
      '使用 Mel-spectrogram 特征训练并对比 ResNet 与 CRNN 模型，采用面向对象方式组织训练与评估流程。',
      '通过模型集成提升预测性能，最终取得 Kaggle 排名 4 / 80。',
    ],
  },
  {
    title: '局域网多线程聊天系统',
    date: '2025.05',
    bullets: [
      '使用 Python 多线程技术在本地网络环境中搭建聊天系统，主导系统架构设计与主要功能实现。',
      '集成神经网络手写字符识别功能，并加入加密通信、登录流程与个性化视觉效果。',
    ],
  },
  {
    title: '3D 动画建模项目 — Blender',
    date: '2025.03',
    bullets: ['使用 Blender 进行原创 3D 建模与动画设计，成品发布于 YouTube 并获得良好用户反馈。'],
  },
]

const extraSections = [
  {
    title: '研究与写作',
    items: [
      {
        name: '人机交互研究报告 — Bridging HCI Paradigms & Bidirectional Alignment',
        date: '2025.07',
        text: '系统梳理 HCI 的历史发展脉络与主要交互范式，总结不同范式对设计决策的启发，并尝试量化交互设计过程。',
      },
      {
        name: '气候难民议题研究报告',
        date: '2025',
        text: '撰写关于气候难民治理与责任分配的研究报告，投稿至校内期刊 Million River Review 并获得积极反馈。',
      },
    ],
  },
  {
    title: '公益与人文项目',
    items: [
      {
        name: 'Heart to Heart 志愿项目',
        date: '2024 年底',
        text: '参与心脏病儿童公益项目，负责医疗物资分类与整理；制作汇报 PPT 与宣传视频，并设计 WeGene 基因位点与疾病风险解读程序原型。',
      },
      {
        name: '可持续时尚访谈项目',
        date: '2025.04',
        text: '采访 Dr. Vedantam，独立完成访谈提纲、视频剪辑与内容制作，获班级综合最高分。',
      },
    ],
  },
  {
    title: '经历与领导力',
    items: [
      { name: 'TEDxNYU Shanghai — 财务部成员', date: '2025.09 — 至今', text: '负责活动报销流程与财务管理工作。' },
      { name: 'Minecraft 学生社团 — 创建者', date: '2025.09 — 至今', text: '创建并运营核心成员超过 30 人的跨文化学生社群，定期举办建筑与设计相关活动。' },
      { name: '微观经济学与数据结构课程 Learning Assistant', date: '2025.11', text: '入选课程教学辅助岗位，协助课程教学工作（申请中）。' },
    ],
  },
]

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [date, setDate] = useState('')
  const [error, setError] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (date === BIRTHDAY) {
      setError(false)
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <main className={styles.gate}>
      <Link href="/">← BACK TO ORBIT</Link>
      <div className={styles.gateGrid} aria-hidden="true" />
      <form onSubmit={submit}>
        <span>IDENTITY CHECK · CV ARCHIVE</span>
        <h1>When is Sam&apos;s birthday?</h1>
        <p>Enter the date to open the full résumé.</p>
        <input
          aria-label="Sam's birthday"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <button type="submit">UNLOCK CV →</button>
        {error && <small>That date does not match the archive.</small>}
      </form>
    </main>
  )
}

export default function CvPage() {
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/">← ORBIT</Link>
        <span>CURRICULUM VITAE · UPDATED 02 JUN 2026</span>
        <a href="/sam-shi-cv-cn.pdf" target="_blank" rel="noreferrer">DOWNLOAD PDF ↓</a>
      </header>

      <div className={styles.resume}>
        <aside className={styles.sidebar}>
          <div className={styles.monogram}>SSY</div>
          <p className={styles.sideLabel}>CONTACT</p>
          <address>
            中国 · 上海<br />
            <a href="mailto:ss19608@nyu.edu">ss19608@nyu.edu</a><br />
            <a href="tel:+8617765114369">+86 177 6511 4369</a><br />
            <a href="https://github.com/Peecocky" target="_blank" rel="noreferrer">github.com/Peecocky</a><br />
            <a href="https://sam-solar-system-ys2z.vercel.app/" target="_blank" rel="noreferrer">Personal website ↗</a>
          </address>

          <p className={styles.sideLabel}>SKILLS</p>
          <div className={styles.skill}>
            <b>编程语言</b><span>Python, SQL, JavaScript / TypeScript, HTML / CSS</span>
          </div>
          <div className={styles.skill}>
            <b>机器学习</b><span>Linear / Ridge / Lasso, Softmax, Model Evaluation, RAG, Knowledge Retrieval</span>
          </div>
          <div className={styles.skill}>
            <b>工具与框架</b><span>PyTorch, OpenCV, Flask, MySQL, Dify, Git, Next.js, Blender, Unity</span>
          </div>
          <div className={styles.skill}>
            <b>设计与创作</b><span>3D 建模与动画、视频剪辑、数据可视化、人机交互设计</span>
          </div>
          <div className={styles.skill}>
            <b>语言能力</b><span>中文 — 母语<br />英语 — 流利<br />日语 — 基础</span>
          </div>

          <p className={styles.sideLabel}>RESEARCH INTERESTS</p>
          <p className={styles.interests}>机器学习 · 计算机视觉 · 自然语言处理 · 人机交互 · 量化金融 · 创意计算与交互式系统</p>
        </aside>

        <article className={styles.content}>
          <header className={styles.identity}>
            <p>数据科学（金融方向） · 上海纽约大学</p>
            <h1>施尚岳</h1>
            <h2>SAM SHI</h2>
          </header>

          <section className={styles.intent}>
            <p className={styles.kicker}>求职意向 · 2026 暑期实习</p>
            <p>互联网 / 科技公司：数据科学、数据分析、大模型应用与智能体（AI Agent）开发</p>
            <p>金融机构：用 AI 辅助分析公司财报与行业数据、量化研究</p>
          </section>

          <section>
            <h3 className={styles.sectionHeading}><span>01</span>教育背景</h3>
            <div className={styles.education}>
              <div>
                <h4>上海纽约大学 <small>New York University Shanghai</small></h4>
                <p>数据科学（金融方向）本科 · 数学辅修</p>
                <p>GPA：3.98 / 4.00 · 当前年级：大二</p>
                <p>相关课程：机器学习、数据结构、经济学、数据库、数据可视化</p>
              </div>
              <time>2024.09 — 2028.05</time>
            </div>
          </section>

          <section>
            <h3 className={styles.sectionHeading}><span>02</span>项目经历</h3>
            <div className={styles.timeline}>
              {projects.map((project) => (
                <article className={styles.entry} key={project.title}>
                  <header><h4>{project.title}</h4><time>{project.date}</time></header>
                  <ul>{project.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          {extraSections.map((section, sectionIndex) => (
            <section key={section.title}>
              <h3 className={styles.sectionHeading}><span>{String(sectionIndex + 3).padStart(2, '0')}</span>{section.title}</h3>
              <div className={styles.compactEntries}>
                {section.items.map((item) => (
                  <article key={item.name}>
                    <header><h4>{item.name}</h4><time>{item.date}</time></header>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </main>
  )
}
