import { useState, useEffect, useRef, useCallback } from "react";

const STORY = {
  start: {
    speaker: null,
    text: null,
    scene: "awakening",
    auto: "awaken_1",
  },
  awaken_1: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "黑暗。绝对的黑暗。然后是湿气——腐烂的、甜腻的湿气，包裹着你还没成形的意识。你从某种黏稠的温暖中挣脱出来。",
    scene: "awakening",
    choices: [
      { text: "试图理解自己在哪里", next: "awaken_2a" },
      { text: "本能地向光源移动", next: "awaken_2b" },
    ],
  },
  awaken_2a: {
    speaker: "逻辑",
    speakerColor: "#f7dc6f",
    text: "你的六条腿在某种柔软的、正在分解的表面上站稳。触角轻微颤动——空气中充斥着乙醇和有机酸的气味。这是食物腐败到最终阶段的气味。你在一个食品储存单元里。一个坏掉的食品储存单元。",
    scene: "awakening",
    choices: [
      { text: "检查周围环境", next: "awaken_3" },
      { text: "你是什么？", next: "awaken_identity" },
    ],
  },
  awaken_2b: {
    speaker: "本能",
    speakerColor: "#e74c3c",
    text: "不需要思考。光意味着出路，出路意味着活下去。你的翅鞘微微张开，腿部关节像弹簧一样蓄力——你还不知道自己是什么，但你的身体已经知道该怎么做。",
    scene: "awakening",
    choices: [
      { text: "向光源爬去", next: "awaken_3" },
      { text: "等等——你是什么？", next: "awaken_identity" },
    ],
  },
  awaken_identity: {
    speaker: "自我意识",
    speakerColor: "#bb8fce",
    text: "你低头看——如果"低头"这个词对你的身体结构还适用的话。六条带刺的腿。扁平的、椭圆形的身躯。一对长长的触角在空气中划出看不见的弧线。你是一只蟑螂。德国小蠊，从卵鞘中孵化不超过四十八小时。",
    scene: "awakening",
    skillCheck: { skill: "百科全书", difficulty: "简单", passed: true },
    choices: [
      { text: "接受这个事实", next: "awaken_3" },
      { text: "[百科全书 — 成功] 蟑螂能在核爆中幸存……", next: "awaken_encyclopedia" },
    ],
  },
  awaken_encyclopedia: {
    speaker: "百科全书",
    speakerColor: "#45b7d1",
    text: "准确地说，蟑螂能承受的辐射剂量是人类的六到十五倍。但'在核爆中幸存'是一个都市传说的夸张版本——你无法在爆心存活。不过考虑到你刚从一个显然已经故障很久的食品冷冻单元中自然孵化……你大概是这艘飞船上唯一有生命体征的活物了。",
    scene: "awakening",
    choices: [{ text: "检查周围环境", next: "awaken_3" }],
  },
  awaken_3: {
    speaker: null,
    text: "你的复眼在黑暗中逐渐调节。",
    scene: "food_storage",
    auto: "food_storage_1",
  },
  food_storage_1: {
    speaker: "视觉",
    speakerColor: "#4ecdc4",
    text: "食品冷冻仓，编号 C-7。金属架子从地面延伸到天花板——对你来说，这些架子就像摩天大楼。每一层都堆满了容器，有些已经破裂，深色的液体从裂缝中渗出并凝固成锈色的痂。空气中悬浮着肉眼可见的孢子颗粒。你脚下的东西曾经是某种蔬菜——现在它是一团散发恶臭的灰绿色绒毛。",
    scene: "food_storage",
    choices: [
      { text: "在腐败的食物中翻找——也许有什么可以吃的", next: "food_search" },
      { text: "寻找出口", next: "find_exit" },
      { text: "这里发生了什么？", next: "food_investigate" },
    ],
  },
  food_investigate: {
    speaker: "逻辑",
    speakerColor: "#f7dc6f",
    text: "冷冻仓的温度控制面板嵌在墙壁上——对你来说，那面板在大约三十个身长高的位置。即使从这里你也能看到面板上闪烁的红色警告灯。它的节奏不规律，说明不是正常的提示信号，而是某种系统错误已经持续了很长时间。面板旁边的墙壁上有一条焦黑的痕迹——电路短路。这就是冷冻仓失效的原因。",
    scene: "food_storage",
    choices: [
      { text: "短路孵化了你", next: "food_origin" },
      { text: "寻找出口", next: "find_exit" },
    ],
  },
  food_origin: {
    speaker: "自我意识",
    speakerColor: "#bb8fce",
    text: "所以这就是你的起源故事。某个地方的线路烧了，冷冻系统崩溃，温度上升到足以让某批食材中混入的蟑螂卵鞘开始发育。你不是被设计出来的，不是被计划的，不是被需要的。你是一个故障的副产品。一个bug。",
    scene: "food_storage",
    choices: [
      { text: "……但你活着。", next: "food_alive" },
      { text: "寻找出口", next: "find_exit" },
    ],
  },
  food_alive: {
    speaker: "意志",
    speakerColor: "#e67e22",
    text: "是的。你活着。在这艘似乎已经部分停摆的飞船上，在腐烂的食物堆里，你——一只什么都不是的蟑螂——活着。这个事实本身就是某种宇宙级别的黑色幽默。",
    scene: "food_storage",
    choices: [
      { text: "在腐败的食物中觅食", next: "food_search" },
      { text: "不想在这里多待了。寻找出口。", next: "find_exit" },
    ],
  },
  food_search: {
    speaker: "本能",
    speakerColor: "#e74c3c",
    text: "你的触角引导你找到了一块已经发黑但还没有完全被霉菌覆盖的什么东西——可能曾经是面包。对你来说这已经是一顿盛宴了。你的口器工作着，身体里涌入了一小股能量。",
    scene: "food_storage",
    reward: "体力 +1",
    choices: [
      { text: "继续寻找更多食物", next: "food_more" },
      { text: "够了，寻找出口", next: "find_exit" },
    ],
  },
  food_more: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "你在一个破裂的真空包装旁边发现了几粒干燥的米——它们像巨石一样散落在你面前。但更重要的是，你注意到包装上印着什么。你的复眼不太擅长解读人类文字，但你能辨认出一个标志：一个被环形轨道包裹的星球图案。下面的小字写着什么——你几乎可以读出来……",
    scene: "food_storage",
    choices: [
      { text: "[感知检定] 努力辨认文字", next: "food_label" },
      { text: "不重要，寻找出口", next: "find_exit" },
    ],
  },
  food_label: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "「新伊甸园殖民计划 · 第七舰队补给品 · 保质期：冷冻状态下无限」。新伊甸园。殖民计划。第七舰队。这些词对一只蟑螂来说毫无意义。但它们被存入了你大脑中某个你还不知道存在的角落。",
    scene: "food_storage",
    reward: "记忆碎片：新伊甸园殖民计划",
    skillCheck: { skill: "感知", difficulty: "中等", passed: true },
    choices: [{ text: "寻找出口", next: "find_exit" }],
  },
  find_exit: {
    speaker: "视觉",
    speakerColor: "#4ecdc4",
    text: "冷冻仓的主门——一扇巨大的气密门——从你的视角看就像一面无尽的金属悬崖。门缝紧闭，连你的扁平身躯都无法挤过去。但是你的触角捕捉到了一丝气流——来自上方。你抬起复眼：天花板附近有一个通风口格栅，其中一个角已经松动，留出了一条缝隙。",
    scene: "food_storage",
    choices: [
      { text: "攀爬货架，飞向通风口", next: "vent_climb" },
      { text: "有没有其他出路？", next: "other_exit" },
    ],
  },
  other_exit: {
    speaker: "逻辑",
    speakerColor: "#f7dc6f",
    text: "你花了一些时间沿着墙根爬行。主门密封良好。地面没有排水口。墙壁完整无裂缝。唯一的选项就是那个通风口。好消息是：你是一只蟑螂。攀爬垂直表面和在狭小空间中移动正好是你的两项核心能力。",
    scene: "food_storage",
    choices: [{ text: "攀爬货架，飞向通风口", next: "vent_climb" }],
  },
  vent_climb: {
    speaker: null,
    text: "你开始攀爬最近的金属货架。你的爪垫上的微小钩刺紧紧抓住冰冷的金属表面。每一步都很稳——这对你来说和走平路没什么区别。",
    scene: "climbing",
    auto: "vent_climb_2",
  },
  vent_climb_2: {
    speaker: "本能",
    speakerColor: "#e74c3c",
    text: "到达最高层货架的顶端时，你能看到整个冷冻仓的全貌——对你来说，这就是从摩天大楼顶端俯瞰一座死去的城市。腐烂的食物容器就像被遗弃的建筑群。远处的通风口格栅在微弱的应急灯下闪着金属光泽。距离大约是你翅展的二十倍。你的翅鞘微微张开——",
    scene: "climbing",
    choices: [
      { text: "跳跃！张开翅膀，飞向通风口", next: "vent_fly" },
      { text: "……你真的能飞吗？", next: "vent_doubt" },
    ],
  },
  vent_doubt: {
    speaker: "自我意识",
    speakerColor: "#bb8fce",
    text: "德国小蠊的飞行能力有限——与其说是飞行，不如说是「可控坠落」。你可以张开翅膀滑翔一段距离，但不能真正悬停或爬升。所以这不是一个需要勇气的决定，而是一个物理计算：你现在的高度是否足够让你滑翔到通风口。",
    scene: "climbing",
    choices: [
      { text: "应该够了。跳。", next: "vent_fly" },
      { text: "爬到更高的位置再跳", next: "vent_higher" },
    ],
  },
  vent_higher: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "你沿着墙壁又攀爬了一段。现在你离天花板更近了，通风口就在斜下方。这个角度好多了。",
    scene: "climbing",
    choices: [{ text: "跳。", next: "vent_fly" }],
  },
  vent_fly: {
    speaker: null,
    text: "你跳了。",
    scene: "flying",
    auto: "vent_fly_2",
  },
  vent_fly_2: {
    speaker: "本能",
    speakerColor: "#e74c3c",
    text: "翅鞘弹开，薄膜翅在空气中展开——你的身体在冷冻仓的空气中划出一道弧线。腐烂的气味在下方翻涌。金属格栅在你面前迅速放大。你的六条腿在着陆前已经伸展到位——",
    scene: "flying",
    auto: "vent_land",
  },
  vent_land: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "落地。完美。你的爪垫抓住通风口格栅的金属边缘。从松动的缝隙挤入管道内部。管道里的空气不同了——没有那么浓烈的腐败气味，取而代之的是金属和循环系统清洁剂的味道。前方是黑暗的管道，延伸向飞船的深处。",
    scene: "ventilation",
    choices: [
      { text: "前进。进入飞船。", next: "vent_enter" },
      { text: "回头看一眼冷冻仓", next: "vent_lookback" },
    ],
  },
  vent_lookback: {
    speaker: "自我意识",
    speakerColor: "#bb8fce",
    text: "你从格栅的缝隙向下看。冷冻仓在应急灯的红光中像一座坟墓。那堆腐败的食物，你的孵化之地，你的摇篮——你再也不会回来了。这是你记忆中第一个「地方」。它又脏又臭，但它是你的起点。",
    scene: "ventilation",
    choices: [{ text: "……前进。", next: "vent_enter" }],
  },
  vent_enter: {
    speaker: null,
    text: "你转身，触角在前方探路，六条腿有节奏地敲击着金属管道壁。通风管道在你面前分岔——一条通向左边，那里传来微弱的机械运转声；另一条通向右边，你的触角捕捉到了……某种你无法定义的东西。不是气味，不是声音，更像是空气中一种极其微弱的电场波动。",
    scene: "ventilation",
    choices: [
      { text: "左边——跟着机械声走。安全的选择。", next: "vent_left" },
      { text: "右边——那个奇怪的感觉……是什么？", next: "vent_right" },
    ],
  },
  vent_left: {
    speaker: "逻辑",
    speakerColor: "#f7dc6f",
    text: "机械运转声意味着飞船的某些系统仍在工作。跟着运转中的系统走是合理的——那里可能有光，有热源，有其他可以利用的资源。你沿着左侧管道前进，声音越来越清晰。在管道的一个弯道处，你透过另一个通风格栅看到了下方的空间——",
    scene: "ventilation",
    auto: "cryo_discovery",
  },
  vent_right: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "那种电场波动引导着你向右深入。管道变窄了，但对你来说仍然宽敞得像一条公路。空气中的电场感越来越强，你的触角尖端开始有轻微的刺痛感。然后管道在一个格栅处终止，你向下看去——",
    scene: "ventilation",
    auto: "cryo_discovery",
  },
  cryo_discovery: {
    speaker: "视觉",
    speakerColor: "#4ecdc4",
    text: "冷冻舱。和食品冷冻仓完全不同——这里干净、安静、几乎神圣。蓝白色的灯光从嵌入墙壁的舱位中射出，照亮了整个房间。在你下方，一排排透明的棺材状装置整齐排列。每一个里面都躺着一个人类——他们的面孔在冰晶中模糊不清，但你能看到他们的胸口有极其缓慢的起伏。他们还活着。只是……被冻住了。",
    scene: "cryo_room",
    reward: "新区域解锁：冷冻舱",
    choices: [
      { text: "爬下去，近距离观察他们", next: "cryo_explore" },
      { text: "数一数有多少人", next: "cryo_count" },
    ],
  },
  cryo_count: {
    speaker: "逻辑",
    speakerColor: "#f7dc6f",
    text: "从你的位置你可以看到这个房间里有十二个冷冻舱位。其中八个亮着蓝色灯——运行正常。两个灯是琥珀色——可能是某种警告状态。还有两个完全是暗的——要么空着，要么……已经失败了。",
    scene: "cryo_room",
    choices: [
      { text: "爬下去，接近最近的冷冻舱", next: "cryo_explore" },
    ],
  },
  cryo_explore: {
    speaker: null,
    text: "你从格栅缝隙挤出，沿着墙壁向下爬行。冷冻舱的表面冰凉光滑——你的爪垫在玻璃上有些打滑。你选择了最近的一个亮着蓝光的舱位，爬上了它的透明盖板。",
    scene: "cryo_room",
    auto: "cryo_first_npc",
  },
  cryo_first_npc: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "透过被你体重微微压弯的——不，你几乎没有重量——透过冰晶覆盖的玻璃，你看到了一张人类的脸。年轻，大概二十多岁，卷曲的棕发贴在额头上。他的表情很平静，几乎像在微笑。冷冻舱的显示屏上闪烁着你无法阅读的信息，但有一个图标你能认出：一颗心脏的示意图，在稳定地跳动。",
    scene: "cryo_room",
    choices: [
      { text: "触碰玻璃表面", next: "cryo_touch" },
      { text: "查看冷冻舱的其他部分", next: "cryo_examine" },
    ],
  },
  cryo_touch: {
    speaker: null,
    text: "你的前腿触碰了玻璃。冰凉。",
    scene: "cryo_room",
    auto: "cryo_alarm",
  },
  cryo_examine: {
    speaker: "逻辑",
    speakerColor: "#f7dc6f",
    text: "冷冻舱的侧面有一个小型控制面板，上面有几个物理按钮和一个小屏幕。屏幕上滚动着数据——体温、心率、脑电波、还有一个你不认识的读数，标签写着"ψ-储存完整性"。旁边连接着一根光纤缆线，通向墙壁上一个球形的装置——它散发着你之前在管道中感觉到的那种电场波动。",
    scene: "cryo_room",
    choices: [
      { text: "ψ-储存……那个球形装置是什么？", next: "cryo_psi" },
      { text: "碰一下那个装置", next: "cryo_alarm" },
    ],
  },
  cryo_psi: {
    speaker: "百科全书",
    speakerColor: "#45b7d1",
    text: "ψ——Psi，希腊字母，在人类的科学传统中通常与心理学和意识相关。「ψ-储存完整性」——如果你的猜测是对的，这个冷冻系统不仅保存了人类的身体，还保存了他们的……意识？精神状态？记忆？那个球形装置可能就是储存精神数据的硬件。",
    scene: "cryo_room",
    reward: "记忆碎片：ψ-精神储存技术",
    choices: [
      { text: "靠近那个球形装置", next: "cryo_alarm" },
    ],
  },
  cryo_alarm: {
    speaker: null,
    text: "——嗡。",
    scene: "alert",
    auto: "cryo_alarm_2",
  },
  cryo_alarm_2: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "一道红色扫描光从天花板射下，精确地锁定了你的位置。你的触角感受到一股急剧升高的电磁场。扫描光追踪着你的每一个微小动作。然后，一个机械合成的声音响彻整个冷冻舱——",
    scene: "alert",
    auto: "cryo_alarm_3",
  },
  cryo_alarm_3: {
    speaker: "飞船AI",
    speakerColor: "#ff4444",
    text: "「警告：冷冻区域检测到未授权生物入侵。物种识别——目蜚蠊，德国小蠊。威胁等级：低。执行标准消杀协议。」",
    scene: "alert",
    choices: [
      { text: "跑！", next: "cryo_run" },
      { text: "你跑不掉的。你知道。", next: "cryo_accept" },
    ],
  },
  cryo_run: {
    speaker: "本能",
    speakerColor: "#e74c3c",
    text: "你的六条腿全速运转——蟑螂的奔跑速度相当于自身体长的五十倍每秒，换算成人类就是每小时三百多公里。你在冷冻舱的玻璃表面上疯狂冲刺，一道细如发丝的蓝色激光在你身后留下焦痕——",
    scene: "alert",
    auto: "cryo_light",
  },
  cryo_accept: {
    speaker: "自我意识",
    speakerColor: "#bb8fce",
    text: "你不跑。不是因为放弃，而是因为某种模糊的直觉告诉你——跑没有意义。激光的瞄准系统比你的反应快一千倍。但是你注意到激光的角度在微调，它在避开冷冻舱本体……它不想损坏设备。这意味着如果你贴着冷冻舱——",
    scene: "alert",
    auto: "cryo_light",
  },
  cryo_light: {
    speaker: null,
    text: "激光射出。",
    scene: "light_burst",
    auto: "cryo_light_2",
  },
  cryo_light_2: {
    speaker: "感知",
    speakerColor: "#4ecdc4",
    text: "它没有击中你。它击中了那个球形装置——ψ-储存器。装置表面裂开了一道缝，一道不属于激光的光从裂缝中喷涌而出。这道光是温暖的、金色的，完全不像飞船上任何人工光源的质感。它像液体一样流淌，像雾一样扩散，在几分之一秒内就包裹了你的整个身体——",
    scene: "light_burst",
    auto: "cryo_light_3",
  },
  cryo_light_3: {
    speaker: "自我意识",
    speakerColor: "#bb8fce",
    text: "你感觉自己在溶解。不是疼痛——更像是你的意识被一只无形的手轻轻拉伸，穿过了某种你无法描述的界面。你的六条腿不再触碰任何表面。你的触角不再接收任何信号。你的复眼——",
    scene: "light_burst",
    auto: "cryo_light_4",
  },
  cryo_light_4: {
    speaker: null,
    text: "你的复眼看到了阳光。真正的、温暖的、来自一颗恒星的阳光。还有草地的味道。",
    scene: "transition",
    choices: [
      {
        text: "……你在哪里？",
        next: "chapter1_end",
      },
    ],
  },
  chapter1_end: {
    speaker: null,
    text: null,
    scene: "end",
    ending: true,
    endingText: "序章完 · 你进入了第一位冷冻人的精神世界",
    endingSubtext: "第一章：牧场 — 即将开放",
  },
};

// --- Skill Check Badge ---
function SkillCheckBadge({ check }) {
  if (!check) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: check.passed
          ? "rgba(46,204,113,0.15)"
          : "rgba(231,76,60,0.15)",
        border: `1px solid ${check.passed ? "#2ecc7144" : "#e74c3c44"}`,
        borderRadius: "4px",
        padding: "3px 10px",
        marginBottom: "8px",
        fontSize: "12px",
        fontFamily: "'IBM Plex Mono', monospace",
        color: check.passed ? "#2ecc71" : "#e74c3c",
      }}
    >
      <span style={{ opacity: 0.7 }}>{check.skill}</span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span style={{ opacity: 0.7 }}>{check.difficulty}</span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span style={{ fontWeight: 700 }}>
        {check.passed ? "成功" : "失败"}
      </span>
    </div>
  );
}

// --- Reward Badge ---
function RewardBadge({ reward }) {
  if (!reward) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "rgba(241,196,15,0.12)",
        border: "1px solid #f1c40f33",
        borderRadius: "4px",
        padding: "3px 10px",
        marginTop: "6px",
        fontSize: "12px",
        fontFamily: "'IBM Plex Mono', monospace",
        color: "#f1c40f",
      }}
    >
      ✦ {reward}
    </div>
  );
}

// --- Typewriter Text ---
function TypewriterText({ text, onComplete, speed = 28 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(intervalRef.current);
        onComplete?.();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  const skipToEnd = useCallback(() => {
    if (!done) {
      clearInterval(intervalRef.current);
      setDisplayed(text);
      setDone(true);
      onComplete?.();
    }
  }, [done, text, onComplete]);

  return (
    <span onClick={skipToEnd} style={{ cursor: done ? "default" : "pointer" }}>
      {displayed}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "#f5f0e8",
            marginLeft: "2px",
            animation: "blink 0.8s infinite",
            verticalAlign: "text-bottom",
          }}
        />
      )}
    </span>
  );
}

// --- Main App ---
export default function InteractiveFiction() {
  const [history, setHistory] = useState([]);
  const [currentId, setCurrentId] = useState("start");
  const [typing, setTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [memories, setMemories] = useState([]);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const bottomRef = useRef(null);

  const current = STORY[currentId];

  useEffect(() => {
    if (current?.auto) {
      const timer = setTimeout(() => {
        if (current.text) {
          setHistory((h) => [...h, { id: currentId, ...current }]);
        }
        setCurrentId(current.auto);
      }, current.text ? 600 : 100);
      return () => clearTimeout(timer);
    }
    if (current?.ending) {
      setHistory((h) => [...h, { id: currentId, ...current }]);
      return;
    }
    if (current?.text) {
      setTyping(true);
      setShowChoices(false);
    }
  }, [currentId]);

  useEffect(() => {
    if (current?.reward && !memories.includes(current.reward)) {
      setMemories((m) => [...m, current.reward]);
    }
  }, [currentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, showChoices, typing]);

  const handleTypingComplete = useCallback(() => {
    setTyping(false);
    setShowChoices(true);
  }, []);

  const choose = useCallback(
    (choice) => {
      setHistory((h) => [
        ...h,
        { id: currentId, ...current },
        { chosen: choice.text },
      ]);
      setShowChoices(false);
      setCurrentId(choice.next);
    },
    [currentId, current]
  );

  const sceneColors = {
    awakening: { bg: "#0a0a0a", accent: "#1a1a2e" },
    food_storage: { bg: "#0d0d0d", accent: "#1a1208" },
    climbing: { bg: "#0a0a0f", accent: "#151520" },
    flying: { bg: "#08080f", accent: "#101028" },
    ventilation: { bg: "#0c0c0c", accent: "#0c1a1a" },
    cryo_room: { bg: "#060a12", accent: "#0a1628" },
    alert: { bg: "#120808", accent: "#2a0a0a" },
    light_burst: { bg: "#12100a", accent: "#2a2210" },
    transition: { bg: "#0a0f08", accent: "#1a2a10" },
    end: { bg: "#0a0a0a", accent: "#1a1a1a" },
  };

  const sc = sceneColors[current?.scene] || sceneColors.awakening;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(170deg, ${sc.bg} 0%, ${sc.accent} 100%)`,
        color: "#f5f0e8",
        fontFamily: "'Noto Serif SC', 'Source Han Serif CN', Georgia, serif",
        transition: "background 1.5s ease",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600;700&family=IBM+Plex+Mono:wght@400;700&display=swap');
        @keyframes blink { 0%,50% { opacity:1 } 51%,100% { opacity:0 } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-12px) } to { opacity:1; transform:translateX(0) } }
        @keyframes endFade { from { opacity:0 } to { opacity:1 } }
        @keyframes pulse { 0%,100% { opacity:0.4 } 50% { opacity:0.8 } }
        * { box-sizing: border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:#ffffff15; border-radius:2px }
      `}</style>

      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: `linear-gradient(180deg, ${sc.bg} 0%, transparent 100%)`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#f5f0e866",
          }}
        >
          蟑 · 螂 · 纪 · 元
        </div>
        <button
          onClick={() => setShowMemoryPanel(!showMemoryPanel)}
          style={{
            background: memories.length > 0 ? "#f1c40f15" : "transparent",
            border: `1px solid ${memories.length > 0 ? "#f1c40f33" : "#ffffff15"}`,
            color: memories.length > 0 ? "#f1c40f" : "#ffffff44",
            padding: "4px 12px",
            borderRadius: "3px",
            cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            letterSpacing: "1px",
          }}
        >
          记忆库 [{memories.length}]
        </button>
      </div>

      {/* Memory Panel */}
      {showMemoryPanel && (
        <div
          style={{
            position: "fixed",
            top: "48px",
            right: "24px",
            width: "280px",
            background: "#0a0a0aee",
            border: "1px solid #f1c40f22",
            borderRadius: "4px",
            padding: "16px",
            zIndex: 101,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: "#f1c40f88",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            已收集记忆碎片
          </div>
          {memories.length === 0 ? (
            <div style={{ fontSize: "13px", color: "#ffffff33" }}>
              尚未收集任何记忆
            </div>
          ) : (
            memories.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: "13px",
                  color: "#f1c40fcc",
                  padding: "6px 0",
                  borderBottom: "1px solid #ffffff08",
                }}
              >
                ✦ {m}
              </div>
            ))
          )}
        </div>
      )}

      {/* Story */}
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "80px 24px 120px",
        }}
      >
        {/* History */}
        {history.map((entry, i) => {
          if (entry.chosen) {
            return (
              <div
                key={i}
                style={{
                  padding: "8px 0 16px",
                  fontSize: "14px",
                  color: "#f5f0e833",
                  fontStyle: "italic",
                  borderLeft: "2px solid #ffffff08",
                  paddingLeft: "16px",
                  marginLeft: "8px",
                }}
              >
                ▸ {entry.chosen}
              </div>
            );
          }
          if (entry.ending) {
            return (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  animation: "endFade 2s ease",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background: "#f5f0e833",
                    margin: "0 auto 30px",
                  }}
                />
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    letterSpacing: "4px",
                    color: "#f5f0e8cc",
                    marginBottom: "12px",
                  }}
                >
                  {entry.endingText}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#f5f0e844",
                    fontFamily: "'IBM Plex Mono', monospace",
                    animation: "pulse 3s infinite",
                  }}
                >
                  {entry.endingSubtext}
                </div>
              </div>
            );
          }
          if (!entry.text) return null;
          return (
            <div key={i} style={{ marginBottom: "20px", opacity: 0.45 }}>
              {entry.skillCheck && <SkillCheckBadge check={entry.skillCheck} />}
              {entry.speaker && (
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: entry.speakerColor || "#888",
                    letterSpacing: "1.5px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {entry.speaker}
                </div>
              )}
              <div
                style={{
                  fontSize: "15px",
                  lineHeight: 1.9,
                  color: "#f5f0e8",
                  fontWeight: 300,
                }}
              >
                {entry.text}
              </div>
              {entry.reward && <RewardBadge reward={entry.reward} />}
            </div>
          );
        })}

        {/* Current */}
        {current && current.text && !current.ending && !current.auto && (
          <div
            style={{
              marginBottom: "20px",
              animation: "fadeIn 0.5s ease",
            }}
          >
            {current.skillCheck && (
              <SkillCheckBadge check={current.skillCheck} />
            )}
            {current.speaker && (
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: current.speakerColor || "#888",
                  letterSpacing: "1.5px",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                }}
              >
                {current.speaker}
              </div>
            )}
            <div
              style={{
                fontSize: "15px",
                lineHeight: 1.9,
                fontWeight: 300,
              }}
            >
              <TypewriterText
                text={current.text}
                onComplete={handleTypingComplete}
                key={currentId}
              />
            </div>
            {current.reward && showChoices && (
              <RewardBadge reward={current.reward} />
            )}
          </div>
        )}

        {/* Choices */}
        {showChoices && current?.choices && (
          <div
            style={{
              marginTop: "24px",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {current.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => choose(choice)}
                style={{
                  background: "transparent",
                  border: "1px solid #f5f0e818",
                  borderRadius: "3px",
                  color: "#f5f0e8cc",
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontFamily:
                    "'Noto Serif SC', 'Source Han Serif CN', Georgia, serif",
                  fontWeight: 300,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  animation: `slideIn 0.4s ease ${i * 0.1}s both`,
                  lineHeight: 1.6,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f5f0e808";
                  e.target.style.borderColor = "#f5f0e833";
                  e.target.style.color = "#f5f0e8";
                  e.target.style.paddingLeft = "28px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "#f5f0e818";
                  e.target.style.color = "#f5f0e8cc";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
