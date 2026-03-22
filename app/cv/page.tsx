'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ✏️ Change this to your real birthday (format: YYYY-MM-DD)
const BIRTHDAY = '2001-09-11'

/* ===== Bilingual Data ===== */
const DATA = {
  name: { cn: '施尚岳', en: 'Sam Shii' },
  location: { cn: '上海', en: 'Shanghai' },
  email: 'ss19608@nyu.edu',
  youtube:'https://www.youtube.com/@Samsamsam-i2w',
  github: 'https://github.com/Peecocky',
  website: 'https://sam-solar-system-ys2z.vercel.app/',

  sections: {
    education: {
      title: { cn: '教育背景', en: 'Education' },
      items: [
        {
          school: {
            cn: '上海纽约大学（New York University Shanghai）',
            en: 'New York University Shanghai',
          },
          date: { cn: '2024.09 – 2028.05', en: 'Sep 2024 – May 2028' },
          major: {
            cn: '数据科学（金融方向）本科 ｜ 金融与商学（第二专业） ｜数学（辅修）',
            en: 'B.S. Data Science (Finance Track) | B.S Business and Finance (Secondary Major)｜Mathematics (Minor)',
          },
          gpa: '3.98 / 4.00',
          courses: {
            cn: '机器学习、数据结构、经济学',
            en: 'Machine Learning, Data Structures, Economics',
          },
          year: { cn: '当前年级：大二', en: 'Current: Sophomore' },
        },
      ],
    },

    interests: {
      title: { cn: '研究兴趣', en: 'Research Interests' },
      text: {
        cn: '机器学习；计算机视觉，自然语言处理（NLP），人机交互（HCI）；量化金融；创意计算与交互式系统；游戏设计与渲染机制',
        en: 'Machine Learning; Computer Vision, NLP, HCI; Quantitative Finance; Creative Computing & Interactive Systems; Game Design & Rendering Mechanics',
      },
    },

    skills: {
      title: { cn: '技能概览', en: 'Skills' },
      items: [
        {
          label: { cn: '编程语言', en: 'Languages' },
          value: { cn: 'Python，JavaScript/TypeScript，SQL', en: 'Python, JavaScript/TypeScript, SQL' },
        },
        {
          label: { cn: '机器学习', en: 'ML' },
          value: {
            cn: '回归分析（Linear / Ridge / Lasso），Softmax 分类，蒙特卡洛模拟，模型评估',
            en: 'Regression (Linear / Ridge / Lasso), Softmax Classification, Monte Carlo Simulation, Model Evaluation',
          },
        },
        {
          label: { cn: '工具 / 框架', en: 'Tools' },
          value: {
            cn: 'PyTorch，OpenCV，Transformer（学习中），Git，Kaggle，Blender，Unity，Dify',
            en: 'PyTorch, OpenCV, Transformers (learning), Git, Kaggle, Blender, Unity, Dify',
          },
        },
        {
          label: { cn: '设计与创作', en: 'Design' },
          value: {
            cn: '3D 建模与动画，视频剪辑，人机交互设计，游戏关卡设计',
            en: '3D Modeling & Animation, Video Editing, HCI Design, Game Level Design',
          },
        },
        {
          label: { cn: '语言能力', en: 'Spoken' },
          value: {
            cn: '中文（母语），英语（流利），日语（基础）',
            en: 'Chinese (Native), English (Fluent), Japanese (Basic)',
          },
        },
      ],
    },

    projects: {
      title: { cn: '项目经历', en: 'Projects' },
      items: [
        {
          title: {
            cn: '瑞银 UBS 商赛 — 智能化投研分析系统',
            en: 'UBS Business Competition — AI-Powered Investment Research System',
          },
          date: { cn: '2026.03', en: 'Mar 2026' },
          link: '',
          role: { cn: '队长', en: 'Team Leader' },
          hasPaper: false,
          bullets: {
            cn: [
              '担任团队队长，负责整体技术架构设计与团队决策',
              '搭建智能化 AI 系统，自动收集特定公司的投行研究报告、最新动态与财务数据',
              '实现基于 LLM 的财报自动解析与宏观层面多维度打分机制，预测多空策略信号',
              '集成股票回测引擎，支持周期判定、技术指标分析与策略绩效评估',
              '将分散的研究流程整合为端到端的投研工作流，显著提升决策效率',
            ],
            en: [
              'Led team as captain; responsible for overall technical architecture and strategic decision-making',
              'Built AI-powered system to automatically collect investment bank reports, news, and financial data for target companies',
              'Implemented LLM-based earnings report parsing and multi-dimensional macro scoring to predict long/short strategy signals',
              'Integrated stock backtesting engine with cycle detection, technical indicator analysis, and strategy performance evaluation',
              'Consolidated fragmented research workflows into an end-to-end pipeline, significantly improving decision efficiency',
            ],
          },
        },
        {
          title: {
            cn: 'Millennium Fellow 千禧年研究院 — AI 教育平台',
            en: 'Millennium Fellow — AI Education Platform for Rural Children',
          },
          date: { cn: '2026.03 – ', en: 'Mar 2026– ' },
          link: '',
          hasPaper: false,
          bullets: {
            cn: [
              '入选 Millennium Fellowship，参与为期 10 个月的社会影响力项目',
              '为山区儿童开发 AI 教育平台，旨在增加优质教育资源的可获取性',
              '通过自然语言交互降低学习门槛，让偏远地区学生能获得个性化辅导',
              '项目涵盖平台设计、内容策划与实地部署测试',
            ],
            en: [
              'Selected as Millennium Fellow for a 10-month social impact initiative',
              'Developing an AI-powered education platform for children in rural mountainous areas',
              'Leveraging NLP-based interaction to lower learning barriers and provide personalized tutoring',
              'Project scope covers platform design, content curation, and on-site deployment testing',
            ],
          },
        },
        {
          title: {
            cn: 'MCM 数学建模竞赛 — 蒙特卡洛模拟与电池寿命研究',
            en: 'MCM Mathematical Modeling — Monte Carlo Simulation & Battery Lifespan',
          },
          date: { cn: '2026.02', en: 'Feb 2026' },
          link: '',
          role: { cn: '编程员 & 团队领袖', en: 'Programmer & Team Leader' },
          hasPaper: true,
          bullets: {
            cn: [
              '担任编程员与团队领袖，负责核心算法实现与团队协调',
              '选题研究用户行为模式对手机电池耗电速率与使用寿命的影响',
              '采用蒙特卡洛随机模拟方法，建立用户行为-电池退化的随机微分模型',
              '通过大规模仿真实验分析不同使用场景下的电池寿命分布与关键影响因子',
              '完成完整建模论文，论文可在本页面直接查看与下载',
            ],
            en: [
              'Served as lead programmer and team leader; handled core algorithm implementation and coordination',
              'Investigated how user behavior patterns affect smartphone battery drain rate and overall lifespan',
              'Applied Monte Carlo stochastic simulation to build a user-behavior–battery-degradation SDE model',
              'Analyzed battery lifespan distributions and key impact factors across diverse usage scenarios via large-scale simulation',
              'Completed full modeling paper; viewable and downloadable directly on this page',
            ],
          },
        },
        {
          title: {
            cn: '交通大学智慧司法 AI 智能体开发',
            en: 'SJTU Smart Judiciary AI Agent Development',
          },
          date: { cn: '2026.01', en: 'Jan 2026' },
          link: '',
          role: { cn: '骨干', en: 'Team Backbone' },
          hasPaper: false,
          bullets: {
            cn: [
              '参与上海交通大学智慧司法项目，负责 AI 智能体的开发与迭代',
              '主要工作包括法律数据检索系统的设计与优化',
              '基于 Dify 平台搭建 AI Workflow，实现法律文书自动分析与辅助决策流程',
              '同时担任项目助教，协助团队成员以及外校老师理解系统架构与技术细节',
            ],
            en: [
              'Participated in SJTU\'s Smart Judiciary project; responsible for AI agent development and iteration',
              'Designed and optimized legal data retrieval systems for case law search',
              'Built AI Workflow on the Dify platform for automated legal document analysis and decision support',
              'Served as teaching assistant, helping team members and professors from other universities understand system architecture and technical details',
            ],
          },
        },
        {
          title: {
            cn: '城市环境声音分类（Kaggle）',
            en: 'Urban Sound Classification (Kaggle)',
          },
          date: { cn: '2025.12', en: 'Dec 2025' },
          link: 'https://raw.githubusercontent.com/Peecocky/urbansound_final_project/main/ml_final_report.pdf',
          hasPaper: false,
          bullets: {
            cn: [
              '针对 UrbanSound8K 小样本、多类别任务特点，设计按类别的训练与评估策略，缓解类别不平衡与过拟合问题',
              '基于 Mel-spectrogram 等时频特征，分别构建 ResNet-18/34/50 与 CRNN 模型，对比分析卷积与时序建模能力',
              '采用面向对象方式实现模型封装与训练流程，支持多模型并行实验与复用',
              '通过集成投票融合多模型预测结果，显著提升分类稳定性与泛化性能',
              '项目在 Kaggle 排名 4 / 80，完成完整实验报告与误差分析',
            ],
            en: [
              'Designed class-wise training & evaluation strategies for the UrbanSound8K dataset to address class imbalance and overfitting',
              'Built ResNet-18/34/50 and CRNN models on Mel-spectrogram features; compared convolutional vs. sequential modeling',
              'Implemented OOP-based model encapsulation and training pipeline supporting parallel experiments',
              'Applied ensemble voting to fuse multi-model predictions, significantly improving classification robustness',
              'Ranked 4 / 80 on Kaggle with comprehensive experimental report and error analysis',
            ],
          },
        },
        {
          title: {
            cn: '自制量化交易系统 / 股票预测模型',
            en: 'Custom Quantitative Trading System / Stock Prediction Model',
          },
          date: { cn: '2025.09 – 至今', en: 'Sep 2025 – Present' },
          link: '',
          hasPaper: false,
          bullets: {
            cn: [
              '独立设计并开发全栈量化交易系统，涵盖数据采集、因子挖掘、信号生成与回测引擎',
              '构建多因子 Alpha 模型，融合动量、波动率、基本面等异构特征，采用机器学习方法优化因子权重',
              '实现基于滑动窗口的自适应策略切换机制，根据市场状态动态调整多空仓位',
              '搭建完整的回测框架，支持交易成本模拟、滑点估计与风险指标计算（Sharpe / MaxDD / Calmar）',
              '系统在样本外测试中表现出稳定的超额收益，正准备整理研究成果投稿期刊与公众号发布',
            ],
            en: [
              'Independently designed and developed a full-stack quantitative trading system covering data ingestion, factor mining, signal generation, and backtesting',
              'Built a multi-factor Alpha model integrating momentum, volatility, and fundamental features with ML-optimized factor weighting',
              'Implemented an adaptive strategy-switching mechanism using sliding windows that dynamically adjusts positions based on market regime',
              'Developed a complete backtesting framework with transaction cost simulation, slippage estimation, and risk metrics (Sharpe / MaxDD / Calmar)',
              'System demonstrated stable excess returns in out-of-sample testing; preparing manuscript for journal submission and public release',
            ],
          },
        },
        {
          title: {
            cn: 'Unity 游戏设计 — 基于遮挡剔除的解谜游戏',
            en: 'Unity Game Design — Occlusion Culling Puzzle Game',
          },
          date: { cn: '2026.01 – 至今', en: 'Jan 2026 – Present' },
          link: '',
          hasPaper: false,
          bullets: {
            cn: [
              '设计并开发一款利用渲染引擎遮挡剔除（Occlusion Culling）机制的创新解谜游戏',
              '核心玩法：玩家在固定相机后以"灵魂移动"脱离实体位置，进入未被渲染的区域，再转动原相机触发渲染以穿墙或跨越障碍',
              '利用引擎"超大实体只要部分可见即整体渲染"的特性，设计多层嵌套关卡——例如操控视角渲染城墙后的城堡，灵魂潜入突破守卫',
              '引入"常驻渲染物体"概念，作为不受相机影响的锚点供玩家探索与利用',
              '目前已完成基础场景建模与核心移动/渲染切换机制的原型实现',
            ],
            en: [
              'Designing an innovative puzzle game that exploits the rendering engine\'s Occlusion Culling mechanism',
              'Core mechanic: player "soul-detaches" from body after locking camera, moves into unrendered zones, then rotates the original camera to trigger rendering — enabling wall-phasing and long-range obstacle bypass',
              'Leverages the engine behavior where partially visible large entities get fully rendered; designed multi-layered levels (e.g. rendering a castle behind city walls by manipulating camera angle, then soul-infiltrating past guards)',
              'Introduced "always-rendered objects" as camera-independent anchors for player exploration',
              'Basic scene modeling and core soul-movement / render-toggle prototype completed',
            ],
          },
        },
        {
          title: {
            cn: '局域网多线程聊天系统',
            en: 'LAN Multi-threaded Chat System',
          },
          date: { cn: '2025.05', en: 'May 2025' },
          link: 'https://youtu.be/8E8FssQvC7U?si=gn1k56uX5RLVUJl9',
          role: { cn: '队长', en: 'Team Leader' },
          hasPaper: false,
          bullets: {
            cn: [
              '使用 Python 多线程技术在本地网络环境中搭建聊天系统',
              '集成手写字符识别功能，加密通信与交互式视觉效果',
              '独立完成系统架构设计与主要功能实现',
            ],
            en: [
              'Built a multi-threaded chat system over LAN using Python',
              'Integrated handwriting recognition, encrypted communication, and interactive visual effects',
              'Independently designed system architecture and implemented core features',
            ],
          },
        },
        {
          title: {
            cn: '3D 动画建模项目（Blender）',
            en: '3D Animation & Modeling (Blender)',
          },
          date: { cn: '2025.03', en: 'Mar 2025' },
          link: 'https://youtu.be/j51rWeuByEM?si=8zSXCfWOxbxcDXR5',
          hasPaper: false,
          bullets: {
            cn: [
              '使用 Blender 进行原创 3D 建模与动画设计',
              '成品发布于 YouTube，获得良好用户反馈',
            ],
            en: [
              'Original 3D modeling and animation design using Blender',
              'Published on YouTube with positive reception',
            ],
          },
        },
      ],
    },

    research: {
      title: { cn: '研究与写作', en: 'Research & Writing' },
      items: [
        {
          title: {
            cn: 'HCI 研究报告：Bridging HCI Paradigms and Bidirectional Alignment',
            en: 'HCI Research: Bridging HCI Paradigms and Bidirectional Alignment',
          },
          date: { cn: '2025.07', en: 'Jul 2025' },
          link: '',
          bullets: {
            cn: [
              '系统梳理 HCI 的历史发展脉络与主要交互范式',
              '总结不同范式对设计决策的启发，尝试量化交互设计过程',
            ],
            en: [
              'Systematic review of HCI\'s historical evolution and major interaction paradigms',
              'Summarized paradigm implications for design decisions; explored quantifying interaction design',
            ],
          },
        },
        {
          title: {
            cn: '气候难民议题研究报告',
            en: 'Climate Refugee Governance Research Report',
          },
          date: { cn: '', en: '' },
          link: 'https://raw.githubusercontent.com/Peecocky/some-other-stuff-for-personal-website-lol/main/climate%20refugee%20report%20.pdf',
          bullets: {
            cn: [
              '撰写关于气候难民治理与责任分配的研究报告',
              '文章投稿至校内期刊 Million River Review，获得积极反馈',
            ],
            en: [
              'Authored research report on climate refugee governance and responsibility allocation',
              'Submitted to campus journal Million River Review; received positive feedback',
            ],
          },
        },
      ],
    },

    community: {
      title: { cn: '公益与人文项目', en: 'Community & Humanities' },
      items: [
        {
          title: {
            cn: 'Heart to Heart 志愿项目',
            en: 'Heart to Heart Volunteer Project',
          },
          date: { cn: '2024 年底', en: 'Late 2024' },
          link: 'https://raw.githubusercontent.com/Peecocky/some-other-stuff-for-personal-website-lol/main/Genetic%20disease.pptx',
          bullets: {
            cn: [
              '参与心脏病儿童公益项目，负责医疗物资分类与整理',
              '制作汇报 PPT 与宣传视频，呼吁关注遗传性疾病',
              '后续搭建智能体开展基因检测报告研究，查阅论文点位设计程序原型用于解读基因位点与疾病风险 (此项目涉及个人基因数据不对外公开下载)',
            ],
            en: [
              'Participated in children\'s heart disease charity; organized medical supplies',
              'Produced presentation and promotional video advocating awareness of genetic diseases',
              'Conducted follow-up research on genetic testing; designed prototype for gene locus risk interpretation (The protocol used my own genetic data and therefore not open for downloading',
            ],
          },
        },
        {
          title: {
            cn: '可持续时尚访谈项目',
            en: 'Sustainable Fashion Interview Project',
          },
          date: { cn: '2025.04', en: 'Apr 2025' },
          link: 'https://youtu.be/vCDb6cNeDO8',
          bullets: {
            cn: [
              '采访 Dr. Vedantam，围绕可持续时尚议题进行深度访谈',
              '独立完成访谈提纲撰写、视频剪辑与内容制作',
              '项目获得班级综合最高分',
            ],
            en: [
              'Interviewed Dr. Vedantam on sustainable fashion in an in-depth discussion',
              'Independently wrote interview outline, edited video, and produced content',
              'Project received the highest overall class grade',
            ],
          },
        },
      ],
    },

    leadership: {
      title: { cn: '经历与领导力', en: 'Leadership & Activities' },
      items: [
        {
          title: { cn: 'TEDxNYU Shanghai 财务部成员', en: 'TEDxNYU Shanghai — Finance Team Member' },
          date: { cn: '2025.09 – 至今', en: 'Sep 2025 – Present' },
          link: 'https://www.instagram.com/tedxnyushanghai/',
          desc: {
            cn: '负责商户对接，活动费用报销与财务管理工作',
            en: 'Managing event reimbursement and financial operations',
          },
        },
        {
          title: { cn: 'Minecraft 学生社团申请者', en: 'Minecraft Student Club — Applicant' },
          date: { cn: '2025.09 – 2025.10', en: 'Sep – Oct 2025' },
          bullets: {
            cn: [
              '提交社团创建申请，规划跨文化交流活动与运营方案',
              '由于所需资金过多被驳回，计划修改方案后继续申请',
            ],
            en: [
              'Submitted club creation application with cross-cultural activity proposals and operational plan',
              'Application currently declined; plan to revise proposal and reapply',
            ],
          },
        },
        {
          title: {
            cn: '微观经济学 & 机器学习课程 Learning Assistant（申请未通过）',
            en: 'Microeconomics & ML Course Learning Assistant (Application failed)',
          },
          date: { cn: '2025.11 - 2025.12', en: 'Nov 2025 - Dec 2025' },
          bullets: {
            cn: [
              '时间冲突',
            ],
            en: [
              'Time confliction'
            ],
          },
        },
      ],
    },
  },
}

type Lang = 'cn' | 'en'
type LangStr = { cn: string; en: string }
type LangList = { cn: string[]; en: string[] }

function t<T extends LangStr | LangList>(obj: T, lang: Lang): T[Lang] {
  return obj[lang]
}

export default function CVPage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('cn')
  const [showPaper, setShowPaper] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [bdInput, setBdInput] = useState('')
  const [bdError, setBdError] = useState(false)

  function handleDownload() {
    window.print()
  }

  function handleUnlock() {
    if (bdInput === BIRTHDAY) {
      setUnlocked(true)
      setBdError(false)
    } else {
      setBdError(true)
    }
  }

  const d = DATA
  const s = d.sections

  /* ===== Birthday Gate ===== */
  if (!unlocked) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0b0b0f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      }}>
        <div style={{ textAlign: 'center', maxWidth: 360, padding: '0 20px' }}>
          <div style={{
            fontSize: 13, letterSpacing: 6, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.15)', marginBottom: 32,
          }}>
            Access Restricted
          </div>
          <div style={{
            fontSize: 18, color: 'rgba(255,255,255,0.5)',
            marginBottom: 8, fontFamily: "'Crimson Pro', serif",
          }}>
            When is Sam&apos;s birthday?
          </div>
          <div style={{
            fontSize: 12, color: 'rgba(255,255,255,0.15)', marginBottom: 28,
          }}>
            format: YYYY-MM-DD
          </div>
          <input
            type="date"
            value={bdInput}
            onChange={e => { setBdInput(e.target.value); setBdError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            style={{
              display: 'block', width: '100%', padding: '12px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${bdError ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 4, color: 'white', fontSize: 15,
              fontFamily: 'inherit', outline: 'none',
              textAlign: 'center', marginBottom: 16,
            }}
          />
          {bdError && (
            <div style={{
              fontSize: 12, color: 'rgba(255,80,80,0.6)',
              marginBottom: 16, animation: 'shake 0.3s ease',
            }}>
              wrong answer
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={handleUnlock}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', padding: '8px 28px',
                borderRadius: 4, cursor: 'pointer', fontSize: 12,
                letterSpacing: 2, fontFamily: 'inherit', transition: 'all 0.2s',
              }}
            >
              ENTER
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.2)', padding: '8px 20px',
                borderRadius: 4, cursor: 'pointer', fontSize: 12,
                letterSpacing: 1, fontFamily: 'inherit',
              }}
            >
              BACK
            </button>
          </div>
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-6px); }
              75% { transform: translateX(6px); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  /* ===== Main CV ===== */
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Noto+Serif+SC:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --cv-bg: #0b0b0f;
          --cv-surface: #111116;
          --cv-text: #e8e6e3;
          --cv-muted: #8a8690;
          --cv-accent: #7c93c3;
          --cv-accent2: #c3a87c;
          --cv-border: rgba(255,255,255,0.06);
          --cv-font-serif: 'Crimson Pro', 'Noto Serif SC', serif;
          --cv-font-mono: 'JetBrains Mono', monospace;
        }

        .cv-page {
          font-family: var(--cv-font-serif);
          background: var(--cv-bg);
          color: var(--cv-text);
          min-height: 100vh;
          line-height: 1.7;
        }

        .cv-topbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: linear-gradient(var(--cv-bg) 60%, transparent);
          backdrop-filter: blur(12px);
        }
        .cv-topbar .back {
          background: none; border: none;
          color: var(--cv-muted);
          font: 13px var(--cv-font-mono);
          letter-spacing: 1px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .cv-topbar .back:hover { color: var(--cv-text); }

        .cv-topbar .controls {
          display: flex; align-items: center; gap: 12px;
        }

        .lang-toggle {
          display: flex;
          border: 1px solid var(--cv-border);
          border-radius: 4px;
          overflow: hidden;
        }
        .lang-toggle button {
          background: none;
          border: none;
          color: var(--cv-muted);
          padding: 6px 14px;
          font: 12px var(--cv-font-mono);
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lang-toggle button.active {
          background: rgba(124,147,195,0.15);
          color: var(--cv-accent);
        }

        .dl-btn {
          background: none;
          border: 1px solid var(--cv-border);
          color: var(--cv-muted);
          padding: 6px 16px;
          font: 12px var(--cv-font-mono);
          letter-spacing: 1px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .dl-btn:hover {
          border-color: var(--cv-accent);
          color: var(--cv-accent);
        }

        .cv-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 100px 40px 80px;
        }

        .cv-header {
          text-align: center;
          margin-bottom: 48px;
          padding-bottom: 36px;
          border-bottom: 1px solid var(--cv-border);
        }
        .cv-header h1 {
          font-size: 42px;
          font-weight: 300;
          letter-spacing: 6px;
          margin: 0 0 4px;
        }
        .cv-header .subtitle {
          font-size: 16px;
          font-weight: 400;
          color: var(--cv-muted);
          letter-spacing: 3px;
          margin-bottom: 16px;
        }
        .cv-header .contact {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px 24px;
          font: 13px var(--cv-font-mono);
          color: var(--cv-muted);
        }
        .cv-header .contact a {
          color: var(--cv-accent);
          text-decoration: none;
          transition: color 0.2s;
        }
        .cv-header .contact a:hover {
          color: var(--cv-accent2);
        }

        .cv-section {
          margin-bottom: 40px;
        }
        .cv-section-title {
          font-size: 13px;
          font-family: var(--cv-font-mono);
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--cv-accent);
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(124,147,195,0.15);
        }

        .cv-entry {
          margin-bottom: 28px;
        }
        .cv-entry-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 6px;
        }
        .cv-entry-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--cv-text);
        }
        .cv-entry-title a {
          color: var(--cv-text);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .cv-entry-title a:hover {
          border-color: var(--cv-accent);
        }
        .cv-entry-date {
          font: 13px var(--cv-font-mono);
          color: var(--cv-muted);
          white-space: nowrap;
        }
        .cv-entry-sub {
          font-size: 15px;
          color: var(--cv-muted);
          margin-bottom: 4px;
        }
        .cv-entry-desc {
          font-size: 15px;
          color: #c8c5c0;
        }
        .cv-entry-role {
          display: inline-block;
          font: 11px var(--cv-font-mono);
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--cv-accent2);
          background: rgba(195,168,124,0.1);
          border: 1px solid rgba(195,168,124,0.2);
          padding: 2px 10px;
          border-radius: 3px;
          margin-bottom: 8px;
        }

        .cv-bullets {
          list-style: none;
          padding: 0;
          margin: 8px 0 0;
        }
        .cv-bullets li {
          position: relative;
          padding-left: 18px;
          font-size: 14.5px;
          color: #c8c5c0;
          margin-bottom: 5px;
          line-height: 1.65;
        }
        .cv-bullets li::before {
          content: '–';
          position: absolute;
          left: 0;
          color: var(--cv-accent);
          opacity: 0.5;
        }

        .gpa {
          font-family: var(--cv-font-mono);
          font-weight: 500;
          color: var(--cv-accent2);
        }

        .cv-interests {
          font-size: 15px;
          color: #c8c5c0;
          line-height: 1.8;
        }

        .cv-skills {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 8px 20px;
        }
        .cv-skills .label {
          font: 13px var(--cv-font-mono);
          color: var(--cv-accent);
          text-align: right;
          padding-top: 2px;
        }
        .cv-skills .value {
          font-size: 14.5px;
          color: #c8c5c0;
        }

        .paper-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          background: rgba(124,147,195,0.08);
          border: 1px solid rgba(124,147,195,0.2);
          color: var(--cv-accent);
          padding: 8px 16px;
          font: 13px var(--cv-font-mono);
          letter-spacing: 1px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .paper-btn:hover {
          background: rgba(124,147,195,0.15);
          border-color: rgba(124,147,195,0.4);
        }

        .paper-overlay {
          position: fixed;
          inset: 0;
          z-index: 500;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          animation: cvFadeIn 0.25s ease;
        }
        @keyframes cvFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .paper-overlay .paper-bar {
          width: 100%;
          max-width: 1000px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .paper-overlay .paper-bar span {
          font: 14px var(--cv-font-mono);
          color: var(--cv-muted);
          letter-spacing: 1px;
        }
        .paper-close {
          background: none;
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          padding: 6px 18px;
          font: 13px var(--cv-font-mono);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .paper-close:hover { border-color: rgba(255,255,255,0.4); }
        .paper-dl-link {
          background: none;
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          padding: 6px 18px;
          font: 13px var(--cv-font-mono);
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .paper-dl-link:hover { border-color: rgba(255,255,255,0.4); }
        .paper-overlay iframe {
          width: 100%;
          max-width: 1000px;
          flex: 1;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          background: white;
        }

        @media print {
          .cv-topbar { display: none !important; }
          .paper-overlay { display: none !important; }
          .paper-btn { display: none !important; }
          .cv-page {
            background: white !important;
            color: #111 !important;
          }
          .cv-header h1, .cv-entry-title, .cv-entry-title a {
            color: #111 !important;
          }
          .cv-section-title {
            color: #333 !important;
            border-color: #ccc !important;
          }
          .cv-header .contact a, .cv-skills .label, .cv-bullets li::before {
            color: #555 !important;
          }
          .cv-entry-role {
            color: #666 !important;
            background: #f0f0f0 !important;
            border-color: #ccc !important;
          }
          .cv-muted, .cv-entry-date, .cv-entry-sub, .cv-header .subtitle,
          .cv-header .contact, .cv-skills .value, .cv-bullets li,
          .cv-interests, .cv-entry-desc, .gpa {
            color: #333 !important;
          }
          .cv-container { padding-top: 20px !important; }
        }
      `}</style>

      <div className="cv-page">
        <div className="cv-topbar">
          <button className="back" onClick={() => router.push('/')}>
            ← BACK
          </button>
          <div className="controls">
            <div className="lang-toggle">
              <button
                className={lang === 'cn' ? 'active' : ''}
                onClick={() => setLang('cn')}
              >
                中文
              </button>
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
            <button className="dl-btn" onClick={handleDownload}>
              ↓ PDF
            </button>
          </div>
        </div>

        <div className="cv-container">
          {/* Header */}
          <div className="cv-header">
            <h1>{t(d.name, lang)}</h1>
            <div className="subtitle">
              {lang === 'cn' ? 'Sam Shii' : '施尚岳'}
            </div>
            <div className="contact">
              <span>{t(d.location, lang)}</span>
              <a href={`mailto:${d.email}`}>{d.email}</a>
              <span><a href={d.youtube} target="_blank" rel="noreferrer">Youtube</a></span>
              <a href={d.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={d.website} target="_blank" rel="noreferrer">
                {lang === 'cn' ? '个人网站' : 'Portfolio'}
              </a>
            </div>
          </div>

          {/* Education */}
          <div className="cv-section">
            <div className="cv-section-title">{t(s.education.title, lang)}</div>
            {s.education.items.map((edu, i) => (
              <div className="cv-entry" key={i}>
                <div className="cv-entry-header">
                  <span className="cv-entry-title">{t(edu.school, lang)}</span>
                  <span className="cv-entry-date">{t(edu.date, lang)}</span>
                </div>
                <div className="cv-entry-sub">{t(edu.major, lang)}</div>
                <div className="cv-entry-sub">
                  GPA: <span className="gpa">{edu.gpa}</span>
                </div>
                <div className="cv-entry-sub" style={{ fontSize: 14 }}>
                  {lang === 'cn' ? '相关课程' : 'Relevant Courses'}:{' '}
                  {t(edu.courses, lang)} &nbsp;|&nbsp; {t(edu.year, lang)}
                </div>
              </div>
            ))}
          </div>

          {/* Interests */}
          <div className="cv-section">
            <div className="cv-section-title">{t(s.interests.title, lang)}</div>
            <div className="cv-interests">{t(s.interests.text, lang)}</div>
          </div>

          {/* Skills */}
          <div className="cv-section">
            <div className="cv-section-title">{t(s.skills.title, lang)}</div>
            <div className="cv-skills">
              {s.skills.items.map((sk, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  <div className="label">{t(sk.label, lang)}</div>
                  <div className="value">{t(sk.value, lang)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="cv-section">
            <div className="cv-section-title">{t(s.projects.title, lang)}</div>
            {s.projects.items.map((proj, i) => (
              <div className="cv-entry" key={i}>
                <div className="cv-entry-header">
                  <span className="cv-entry-title">
                    {proj.link ? (
                      <a href={proj.link} target="_blank" rel="noreferrer">
                        {t(proj.title, lang)}
                      </a>
                    ) : (
                      t(proj.title, lang)
                    )}
                  </span>
                  <span className="cv-entry-date">{t(proj.date, lang)}</span>
                </div>
                {proj.role && (
                  <div className="cv-entry-role">{t(proj.role, lang)}</div>
                )}
                <ul className="cv-bullets">
                  {(t(proj.bullets, lang) as string[]).map((b: string, j: number) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                {proj.hasPaper && (
                  <button className="paper-btn" onClick={() => setShowPaper(true)}>
                    📄 {lang === 'cn' ? '查看 MCM 论文' : 'View MCM Paper'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Research */}
          <div className="cv-section">
            <div className="cv-section-title">{t(s.research.title, lang)}</div>
            {s.research.items.map((r, i) => (
              <div className="cv-entry" key={i}>
                <div className="cv-entry-header">
                  <span className="cv-entry-title">
                    {r.link ? (
                      <a href={r.link} target="_blank" rel="noreferrer">
                        {t(r.title, lang)}
                      </a>
                    ) : (
                      t(r.title, lang)
                    )}
                  </span>
                  {r.date.cn && (
                    <span className="cv-entry-date">{t(r.date, lang)}</span>
                  )}
                </div>
                <ul className="cv-bullets">
                  {(t(r.bullets, lang) as string[]).map((b: string, j: number) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Community */}
          <div className="cv-section">
            <div className="cv-section-title">{t(s.community.title, lang)}</div>
            {s.community.items.map((c, i) => (
              <div className="cv-entry" key={i}>
                <div className="cv-entry-header">
                  <span className="cv-entry-title">
                    {c.link ? (
                      <a href={c.link} target="_blank" rel="noreferrer">
                        {t(c.title, lang)}
                      </a>
                    ) : (
                      t(c.title, lang)
                    )}
                  </span>
                  <span className="cv-entry-date">{t(c.date, lang)}</span>
                </div>
                <ul className="cv-bullets">
                  {(t(c.bullets, lang) as string[]).map((b: string, j: number) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Leadership */}
          <div className="cv-section">
            <div className="cv-section-title">{t(s.leadership.title, lang)}</div>
            {s.leadership.items.map((l, i) => (
              <div className="cv-entry" key={i}>
                <div className="cv-entry-header">
                  <span className="cv-entry-title">
                    {'link' in l && l.link ? (
                      <a href={l.link} target="_blank" rel="noreferrer">
                        {t(l.title, lang)}
                      </a>
                    ) : (
                      t(l.title, lang)
                    )}
                  </span>
                  <span className="cv-entry-date">{t(l.date, lang)}</span>
                </div>
                {'desc' in l && l.desc && (
                  <div className="cv-entry-desc">{t(l.desc, lang)}</div>
                )}
                {'bullets' in l && l.bullets && (
                  <ul className="cv-bullets">
                    {(t(l.bullets, lang) as string[]).map(
                      (b: string, j: number) => (
                        <li key={j}>{b}</li>
                      )
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MCM Paper Viewer Modal */}
        {showPaper && (
          <div className="paper-overlay">
            <div className="paper-bar">
              <span>
                MCM Paper —{' '}
                {lang === 'cn'
                  ? '蒙特卡洛模拟与电池寿命研究'
                  : 'Monte Carlo Simulation & Battery Lifespan'}
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <a className="paper-dl-link" href="/mcm-paper.pdf" download>
                  ↓ Download
                </a>
                <button
                  className="paper-close"
                  onClick={() => setShowPaper(false)}
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <iframe src="/mcm-paper.pdf" title="MCM Paper" />
          </div>
        )}
      </div>
    </>
  )
}
