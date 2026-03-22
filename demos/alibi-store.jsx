"use client";
import { useState, useEffect, useRef } from "react";

/*
═══════════════════════════════════════════════════════════════
  AI IMAGE / VIDEO GENERATION PROMPTS FOR THIS PROJECT
═══════════════════════════════════════════════════════════════

🖼️ HERO IMAGE (Nano Banana / Midjourney / DALL·E):
"Minimal product photography of a sleek matte black capsule-shaped 
electronic device, approximately 4cm long, attached to a premium 
titanium keychain ring. The device has one subtle circular button 
and a tiny LED indicator. Shot on white marble surface with dramatic 
side lighting creating long shadows. Swiss design aesthetic, 
ultra-clean composition. 8K, studio photography, Phase One camera --ar 16:9 --s 750"

🖼️ PRODUCT LIFESTYLE (Nano Banana / Midjourney):
"Cinematic editorial photo of a young professional at a dinner party, 
discreetly touching a small matte black device on their keychain 
under the table. Warm ambient restaurant lighting, shallow depth of 
field focused on hands and device. Film grain, Kodak Portra 400 look. 
--ar 3:2 --s 600"

🖼️ APP INTERFACE MOCKUP (Nano Banana / Midjourney):
"Ultra-clean mobile app UI screenshot on iPhone 16 Pro, dark mode 
interface showing a 'Set Up Fake Call' screen with caller name input, 
delay timer slider (10s to 5min), and AI conversation toggle. 
Minimalist design with monochrome palette and one accent color in 
electric coral. Floating phone mockup on dark gradient background. 
--ar 9:16 --s 800"

🖼️ PRODUCT EXPLODED VIEW (Nano Banana / Midjourney):
"Technical exploded view diagram of a miniature capsule electronic 
device showing internal components: tiny speaker, Bluetooth chip, 
rechargeable battery, haptic motor, and premium aluminum shell. 
Clean white background, isometric angle, technical illustration style. 
Dieter Rams inspired. --ar 1:1 --s 700"

🖼️ LIFESTYLE - OFFICE ESCAPE (Nano Banana / DALL·E):
"Editorial photograph of a person in a modern open-plan office, 
standing up from their desk with phone to ear, looking relieved 
while walking away from a boring meeting visible through glass walls. 
Natural office lighting, candid moment, shot from medium distance. 
Magazine editorial style. --ar 16:9"

🖼️ COLOR VARIANTS (Nano Banana / Midjourney):
"Product lineup of 4 sleek capsule-shaped keychain devices in 
different colors: matte black, arctic white, moss green, and sunset 
coral. Arranged in a diagonal line on light grey surface. Overhead 
shot, soft diffused lighting, minimal shadows. Premium consumer 
electronics photography. --ar 21:9 --s 800"

🖼️ AI ASSISTANT CONCEPT (Nano Banana / Midjourney):
"Abstract visualization of voice-to-task AI conversion. Sound waves 
transforming into organized checklist items, floating in dark space. 
Glowing electric coral accent lines connecting voice waveform to 
structured task cards. Futuristic, clean, dark background. 
Digital art, 3D render. --ar 16:9 --s 750"

🎬 VIDEO PROMPT (Runway Gen-3 / Kling / Sora):
"A person at an awkward networking event, subtly pressing a button on 
their keychain. 10 seconds later, their phone rings. They answer with 
a relieved expression, mouths 'sorry, I have to take this' to the 
group, and walks away confidently. Shot in slow-motion during the 
escape moment. Cinematic, warm indoor lighting, shallow DOF."

🎬 PRODUCT REVEAL VIDEO (Runway / Sora):
"Extreme close-up of a matte black capsule device rotating slowly 
against pure black background. A single beam of light reveals the 
surface texture and the small button detail. Camera slowly pulls back 
to reveal it attached to a keychain held by a hand. Ultra-premium 
feel, like an Apple product reveal. 4K cinematic."

🎬 APP DEMO VIDEO (Sora / Kling):
"Screen recording style: a hand tapping through a dark-mode mobile 
app. Setting up a fake call - typing a name, adjusting a timer 
slider, toggling 'AI Conversation' on. Then switching to a to-do 
list view where voice-recorded tasks appear with checkmarks. 
Smooth transitions, minimal UI, clean typography."

═══════════════════════════════════════════════════════════════
*/

const COLORS = {
  black: "#0A0A0A",
  white: "#FAFAF9",
  cream: "#F5F0EB",
  coral: "#FF5A36",
  grey: "#8A8A8A",
  lightGrey: "#E8E4DF",
  darkGrey: "#1A1A1A",
  midGrey: "#2A2A2A",
};

// Intersection Observer Hook
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isVisible];
}

// Animated Section wrapper
function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, isVisible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── NAV ────────────────────────────────────────────
function Nav({ scrolled }) {
  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 clamp(20px, 4vw, 60px)",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.4s ease",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: `2px solid ${COLORS.coral}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: COLORS.coral,
          fontFamily: "'JetBrains Mono', monospace",
        }}>A</div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 15, fontWeight: 700, color: COLORS.white,
          letterSpacing: 3, textTransform: "uppercase",
        }}>ALIBI</span>
      </div>
      <div style={{
        display: "flex", gap: 32, alignItems: "center",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
      }}>
        {["产品", "功能", "App", "商店"].map((item) => (
          <a key={item} href="#" style={{
            color: COLORS.grey, textDecoration: "none",
            transition: "color 0.3s",
          }}
            onMouseEnter={e => e.target.style.color = COLORS.white}
            onMouseLeave={e => e.target.style.color = COLORS.grey}
          >{item}</a>
        ))}
        <button style={{
          background: COLORS.coral, color: COLORS.white,
          border: "none", padding: "8px 20px", cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
          fontWeight: 600,
        }}>立即购买</button>
      </div>
    </nav>
  );
}

// ─── HERO ───────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  return (
    <section style={{
      height: "100vh", minHeight: 700,
      background: COLORS.black,
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      position: "relative", overflow: "hidden",
      padding: "0 20px",
    }}>
      {/* Background gradient orb */}
      <div style={{
        position: "absolute", width: 600, height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.coral}15 0%, transparent 70%)`,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        filter: "blur(80px)",
        animation: "pulse 6s ease-in-out infinite",
      }} />

      {/* Product visual placeholder */}
      <div style={{
        width: 220, height: 220,
        borderRadius: "50%",
        border: `1px solid ${COLORS.coral}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 48,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "scale(1)" : "scale(0.8)",
        transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
      }}>
        {/* Device illustration */}
        <div style={{
          width: 56, height: 100, borderRadius: 28,
          background: `linear-gradient(145deg, #333 0%, #1a1a1a 100%)`,
          border: `1px solid #444`,
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>
          {/* Button */}
          <div style={{
            position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)",
            width: 16, height: 16, borderRadius: "50%",
            background: COLORS.coral,
            boxShadow: `0 0 20px ${COLORS.coral}60, inset 0 1px 0 rgba(255,255,255,0.3)`,
            animation: "glow 3s ease-in-out infinite",
          }} />
          {/* LED */}
          <div style={{
            position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)",
            width: 4, height: 4, borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 8px #4ade8060",
          }} />
        </div>
        {/* Keyring */}
        <div style={{
          position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
          width: 24, height: 24, borderRadius: "50%",
          border: "2px solid #555", background: "transparent",
        }} />
        {/* Orbit ring */}
        <div style={{
          position: "absolute", inset: -1,
          borderRadius: "50%",
          border: `1px solid ${COLORS.coral}15`,
          animation: "spin 20s linear infinite",
        }}>
          <div style={{
            position: "absolute", top: 0, left: "50%",
            width: 4, height: 4, borderRadius: "50%",
            background: COLORS.coral,
            transform: "translate(-50%, -50%)",
          }} />
        </div>
      </div>

      <h1 style={{
        fontFamily: "'Instrument Serif', Georgia, serif",
        fontSize: "clamp(48px, 8vw, 120px)",
        color: COLORS.white, fontWeight: 400,
        lineHeight: 0.95, textAlign: "center",
        letterSpacing: -2,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(30px)",
        transition: "all 1s ease 0.3s",
      }}>
        <span style={{ fontStyle: "italic", color: COLORS.coral }}>逃离</span>
        <br />社交困境
      </h1>

      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12, color: COLORS.grey,
        letterSpacing: 3, textTransform: "uppercase",
        marginTop: 32, textAlign: "center",
        opacity: loaded ? 1 : 0,
        transition: "all 1s ease 0.6s",
      }}>
        一键触发 · 智能通话 · 优雅离场
      </p>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: loaded ? 0.4 : 0,
        transition: "all 1s ease 1s",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, color: COLORS.grey,
          letterSpacing: 3, textTransform: "uppercase",
        }}>Scroll</span>
        <div style={{
          width: 1, height: 40,
          background: `linear-gradient(to bottom, ${COLORS.grey}, transparent)`,
          animation: "scrollDown 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}

// ─── PRODUCT STORY ──────────────────────────────────
function ProductStory() {
  return (
    <section style={{
      background: COLORS.cream,
      padding: "clamp(80px, 12vw, 160px) clamp(20px, 6vw, 120px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: COLORS.coral,
            letterSpacing: 4, textTransform: "uppercase",
            marginBottom: 24,
          }}>
            01 — 产品理念
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 64px)",
            color: COLORS.black, fontWeight: 400,
            lineHeight: 1.15, maxWidth: 700,
            letterSpacing: -1,
          }}>
            你的时间，<br/>
            <span style={{ fontStyle: "italic" }}>只属于你自己</span>
          </h2>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 60, marginTop: 80,
        }}>
          {/* Product visual */}
          <FadeIn delay={0.2}>
            <div style={{
              aspectRatio: "4/5",
              background: COLORS.black,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              {/* Stylized device */}
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 80, height: 140, borderRadius: 40,
                  background: "linear-gradient(160deg, #2a2a2a, #111)",
                  border: "1px solid #333",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", top: 30, left: "50%",
                    transform: "translateX(-50%)",
                    width: 24, height: 24, borderRadius: "50%",
                    background: COLORS.coral,
                    boxShadow: `0 0 30px ${COLORS.coral}50`,
                  }} />
                  <div style={{
                    position: "absolute", bottom: 25, left: "50%",
                    transform: "translateX(-50%)",
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 12px #4ade8050",
                  }} />
                </div>
              </div>
              {/* Size reference */}
              <div style={{
                marginTop: 40,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: COLORS.grey,
                letterSpacing: 2,
              }}>
                实际尺寸 4.2 × 2.1 × 0.8 cm
              </div>
              {/*
                📸 REPLACE WITH: Product hero shot
                Nano Banana prompt: "Extreme close-up product photo of tiny 
                matte black capsule device next to a coin for scale, on dark 
                slate surface. Single dramatic spotlight from upper right. 
                Ultra sharp focus, macro lens. --ar 4:5 --s 800"
              */}
            </div>
          </FadeIn>

          {/* Text content */}
          <FadeIn delay={0.3}>
            <div style={{
              display: "flex", flexDirection: "column",
              justifyContent: "center", gap: 40,
            }}>
              <p style={{
                fontFamily: "'DM Sans', Helvetica, sans-serif",
                fontSize: "clamp(16px, 1.8vw, 20px)",
                color: COLORS.black,
                lineHeight: 1.8, opacity: 0.7,
              }}>
                ALIBI 是一个极简的随身设备——小到可以挂在钥匙圈上。
                它只做一件事：在你需要的时候，给你一通「来电」。
                一个优雅的借口，让你从任何不想待的场合中从容离开。
              </p>

              <div style={{ display: "flex", gap: 40 }}>
                {[
                  { num: "4.2cm", label: "极致小巧" },
                  { num: "10s", label: "最快响应" },
                  { num: "∞", label: "使用次数" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 36, color: COLORS.coral,
                      lineHeight: 1,
                    }}>{stat.num}</div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, color: COLORS.grey,
                      letterSpacing: 2, marginTop: 8,
                      textTransform: "uppercase",
                    }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ───────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "连接App",
      desc: "通过蓝牙与ALIBI App配对，设置来电显示号码、姓名和通话延迟时间。",
      icon: "📱",
    },
    {
      num: "02",
      title: "一键触发",
      desc: "在任何场合，悄悄按下设备按钮。10秒到数分钟后，你的手机将收到一通来电。",
      icon: "👆",
    },
    {
      num: "03",
      title: "AI对话",
      desc: "开启AI模式后，电话另一端将有一个了解你的AI进行自然对话，让通话更加真实。",
      icon: "🤖",
    },
    {
      num: "04",
      title: "优雅离场",
      desc: "接起电话，从容地说一句「抱歉，我得接个电话」，然后潇洒离开。",
      icon: "🚪",
    },
  ];

  return (
    <section style={{
      background: COLORS.black,
      padding: "clamp(80px, 12vw, 160px) clamp(20px, 6vw, 120px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: COLORS.coral,
            letterSpacing: 4, textTransform: "uppercase",
            marginBottom: 24,
          }}>
            02 — 使用方式
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            color: COLORS.white, fontWeight: 400,
            lineHeight: 1.15, letterSpacing: -1,
            marginBottom: 80,
          }}>
            四步，<span style={{ fontStyle: "italic", color: COLORS.coral }}>自由</span>
          </h2>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 1,
        }}>
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={0.15 * i}>
              <div style={{
                background: COLORS.darkGrey,
                padding: "clamp(32px, 4vw, 48px)",
                height: "100%",
                transition: "background 0.4s",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.midGrey}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.darkGrey}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, color: COLORS.coral,
                  letterSpacing: 3, marginBottom: 20,
                }}>{step.num}</div>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{step.icon}</div>
                <h3 style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 28, color: COLORS.white,
                  fontWeight: 400, marginBottom: 16,
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: "'DM Sans', Helvetica, sans-serif",
                  fontSize: 14, color: COLORS.grey,
                  lineHeight: 1.7,
                }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI FEATURES ────────────────────────────────────
function AIFeatures() {
  return (
    <section style={{
      background: COLORS.cream,
      padding: "clamp(80px, 12vw, 160px) clamp(20px, 6vw, 120px)",
      position: "relative",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: COLORS.coral,
            letterSpacing: 4, textTransform: "uppercase",
            marginBottom: 24,
          }}>
            03 — AI 智能
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            color: COLORS.black, fontWeight: 400,
            lineHeight: 1.15, letterSpacing: -1,
            maxWidth: 600,
          }}>
            不止是假电话，<br />
            更是你的<span style={{ fontStyle: "italic", color: COLORS.coral }}>私人助理</span>
          </h2>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 40, marginTop: 80,
        }}>
          {/* AI Conversation Card */}
          <FadeIn delay={0.2}>
            <div style={{
              background: COLORS.black,
              padding: "clamp(36px, 4vw, 56px)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 200, height: 200, borderRadius: "50%",
                background: `radial-gradient(circle, ${COLORS.coral}10, transparent)`,
              }} />
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: COLORS.coral,
                letterSpacing: 3, marginBottom: 24,
              }}>AI 对话模式</div>
              <h3 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 32, color: COLORS.white,
                fontWeight: 400, marginBottom: 20,
              }}>真实的对话体验</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, color: COLORS.grey,
                lineHeight: 1.8, marginBottom: 32,
              }}>
                在App中预设AI对你的了解——你的名字、你的工作、
                常用的借口。当假电话响起，AI会像一个真正了解你的人一样
                与你对话。旁人完全无法分辨。
              </p>
              {/* Mock chat */}
              <div style={{
                borderTop: `1px solid ${COLORS.midGrey}`,
                paddingTop: 24,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                {[
                  { from: "ai", text: "嘿，你现在方便说话吗？" },
                  { from: "you", text: "嗯，怎么了？" },
                  { from: "ai", text: "刚收到消息，客户把会议提前到今晚了..." },
                ].map((msg, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: msg.from === "you" ? "flex-end" : "flex-start",
                  }}>
                    <div style={{
                      background: msg.from === "you" ? COLORS.coral : COLORS.midGrey,
                      color: COLORS.white,
                      padding: "10px 16px",
                      borderRadius: msg.from === "you" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13, maxWidth: "75%",
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* AI Assistant Card */}
          <FadeIn delay={0.3}>
            <div style={{
              background: COLORS.black,
              padding: "clamp(36px, 4vw, 56px)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", bottom: -40, left: -40,
                width: 200, height: 200, borderRadius: "50%",
                background: `radial-gradient(circle, #4ade8010, transparent)`,
              }} />
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: "#4ade80",
                letterSpacing: 3, marginBottom: 24,
              }}>AI 助理模式</div>
              <h3 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 32, color: COLORS.white,
                fontWeight: 400, marginBottom: 20,
              }}>通话即待办</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, color: COLORS.grey,
                lineHeight: 1.8, marginBottom: 32,
              }}>
                开启AI助理后，你的每一通假电话都可以被智能记录。
                在通话中直接说出你的任务和想法，AI会自动整理成待办事项，
                并在App中一项一项帮你跟进完成。
              </p>
              {/* Mock task list */}
              <div style={{
                borderTop: `1px solid ${COLORS.midGrey}`,
                paddingTop: 24,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                {[
                  { done: true, text: "发送周报给张总", time: "已完成" },
                  { done: true, text: "预约周三牙医", time: "已完成" },
                  { done: false, text: "订周五飞上海的机票", time: "进行中" },
                  { done: false, text: "回复小王的合作邮件", time: "待处理" },
                ].map((task, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px",
                    background: task.done ? `${COLORS.midGrey}80` : COLORS.midGrey,
                    borderLeft: `3px solid ${task.done ? "#4ade80" : COLORS.coral}`,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: `2px solid ${task.done ? "#4ade80" : COLORS.grey}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#4ade80",
                      flexShrink: 0,
                    }}>
                      {task.done && "✓"}
                    </div>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      color: task.done ? COLORS.grey : COLORS.white,
                      textDecoration: task.done ? "line-through" : "none",
                      flex: 1,
                    }}>{task.text}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, color: task.done ? "#4ade80" : COLORS.coral,
                      letterSpacing: 1, flexShrink: 0,
                    }}>{task.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Note about AI cost */}
        <FadeIn delay={0.4}>
          <div style={{
            marginTop: 40,
            padding: "20px 28px",
            background: `${COLORS.lightGrey}`,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, color: COLORS.black,
              lineHeight: 1.6, opacity: 0.6,
            }}>
              AI对话与AI助理功能需要额外订阅AI服务（月付制），基础假电话功能永久免费使用。
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── APP PREVIEW ────────────────────────────────────
function AppPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["通话设置", "AI人设", "任务管理"];

  return (
    <section style={{
      background: COLORS.darkGrey,
      padding: "clamp(80px, 12vw, 160px) clamp(20px, 6vw, 120px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: COLORS.coral,
            letterSpacing: 4, textTransform: "uppercase",
            marginBottom: 24,
          }}>
            04 — ALIBI App
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            color: COLORS.white, fontWeight: 400,
            letterSpacing: -1, marginBottom: 60,
          }}>
            一切尽在<span style={{ fontStyle: "italic", color: COLORS.coral }}>掌控</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{
            display: "flex", justifyContent: "center", gap: 0,
            marginBottom: 48,
          }}>
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} style={{
                background: activeTab === i ? COLORS.coral : "transparent",
                color: activeTab === i ? COLORS.white : COLORS.grey,
                border: `1px solid ${activeTab === i ? COLORS.coral : COLORS.midGrey}`,
                padding: "12px 28px", cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, letterSpacing: 1.5,
                transition: "all 0.3s",
              }}>{tab}</button>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          {/* Phone mockup */}
          <div style={{
            maxWidth: 320, margin: "0 auto",
            background: COLORS.black,
            borderRadius: 36,
            padding: 12,
            border: `1px solid #333`,
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}>
            <div style={{
              background: "#111",
              borderRadius: 28,
              padding: "48px 24px 32px",
              minHeight: 520,
              position: "relative",
            }}>
              {/* Status bar */}
              <div style={{
                position: "absolute", top: 12, left: 24, right: 24,
                display: "flex", justifyContent: "space-between",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: COLORS.grey,
              }}>
                <span>9:41</span>
                <span>●●●</span>
              </div>

              {activeTab === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 24, color: COLORS.white,
                  }}>通话设置</div>
                  {[
                    { label: "来电号码", value: "+86 138****8888" },
                    { label: "显示名称", value: "张经理" },
                    { label: "延迟时间", value: "15 秒" },
                    { label: "铃声", value: "默认" },
                  ].map(field => (
                    <div key={field.label} style={{
                      borderBottom: `1px solid ${COLORS.midGrey}`,
                      paddingBottom: 12,
                    }}>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9, color: COLORS.coral,
                        letterSpacing: 2, marginBottom: 6,
                        textTransform: "uppercase",
                      }}>{field.label}</div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 16, color: COLORS.white,
                      }}>{field.value}</div>
                    </div>
                  ))}
                  {/* Slider mock */}
                  <div style={{ marginTop: 8 }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, color: COLORS.grey,
                      letterSpacing: 2, marginBottom: 12,
                    }}>延迟滑块</div>
                    <div style={{
                      height: 4, background: COLORS.midGrey,
                      borderRadius: 2, position: "relative",
                    }}>
                      <div style={{
                        width: "25%", height: "100%",
                        background: COLORS.coral, borderRadius: 2,
                      }} />
                      <div style={{
                        position: "absolute", top: -6, left: "25%",
                        width: 16, height: 16, borderRadius: "50%",
                        background: COLORS.coral,
                        transform: "translateX(-50%)",
                        boxShadow: `0 0 10px ${COLORS.coral}40`,
                      }} />
                    </div>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, color: COLORS.grey,
                      marginTop: 8,
                    }}>
                      <span>10s</span>
                      <span>5min</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 24, color: COLORS.white,
                  }}>AI人设配置</div>
                  <div style={{
                    padding: 16, background: COLORS.midGrey,
                    borderRadius: 12,
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, color: "#4ade80",
                      letterSpacing: 2, marginBottom: 8,
                    }}>AI 已启用 ●</div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13, color: COLORS.grey, lineHeight: 1.7,
                    }}>
                      AI将以「同事」身份与你通话，了解你在一家科技公司工作，
                      常用借口：紧急会议/客户来访
                    </div>
                  </div>
                  {[
                    { label: "AI关系", value: "同事" },
                    { label: "你的职业", value: "产品经理" },
                    { label: "默认借口", value: "紧急会议" },
                    { label: "语气风格", value: "专业但友好" },
                  ].map(field => (
                    <div key={field.label} style={{
                      borderBottom: `1px solid ${COLORS.midGrey}`,
                      paddingBottom: 12,
                    }}>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9, color: COLORS.coral,
                        letterSpacing: 2, marginBottom: 6,
                      }}>{field.label}</div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 16, color: COLORS.white,
                      }}>{field.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 24, color: COLORS.white,
                  }}>我的任务</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, color: COLORS.grey,
                    letterSpacing: 2,
                  }}>来自通话记录 · 今日</div>
                  {[
                    { text: "回复合作方邮件", done: false, priority: "高" },
                    { text: "预订下周出差酒店", done: false, priority: "中" },
                    { text: "发送合同给法务审核", done: true, priority: "高" },
                    { text: "约李总下周一午餐", done: true, priority: "低" },
                    { text: "更新项目进度表", done: false, priority: "中" },
                  ].map((task, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 14px",
                      background: COLORS.midGrey,
                      borderRadius: 8,
                      opacity: task.done ? 0.5 : 1,
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        border: `2px solid ${task.done ? "#4ade80" : COLORS.coral}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "#4ade80", flexShrink: 0,
                      }}>{task.done && "✓"}</div>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14, color: COLORS.white, flex: 1,
                        textDecoration: task.done ? "line-through" : "none",
                      }}>{task.text}</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 8,
                        color: task.priority === "高" ? COLORS.coral : task.priority === "中" ? "#fbbf24" : COLORS.grey,
                        letterSpacing: 1, border: `1px solid currentColor`,
                        padding: "2px 6px", borderRadius: 4,
                      }}>{task.priority}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/*
            📸 REPLACE ENTIRE PHONE MOCKUP WITH:
            Nano Banana prompt: "Floating iPhone 16 Pro mockup showing dark-mode 
            app interface with timer slider and toggle switches. Phone at slight 
            angle against pure black background. Soft rim lighting on phone edges. 
            Ultra clean, premium tech product shot. --ar 9:16 --s 800"
          */}
        </FadeIn>
      </div>
    </section>
  );
}

// ─── SHOP ───────────────────────────────────────────
function Shop() {
  const products = [
    {
      name: "ALIBI One",
      subtitle: "经典黑",
      price: "¥299",
      desc: "基础款，含设备+钥匙环+充电线",
      color: "#1a1a1a",
      accent: COLORS.coral,
    },
    {
      name: "ALIBI One",
      subtitle: "极地白",
      price: "¥299",
      desc: "基础款，含设备+钥匙环+充电线",
      color: "#e8e4df",
      accent: "#333",
    },
    {
      name: "ALIBI Pro",
      subtitle: "苔藓绿",
      price: "¥499",
      desc: "含AI对话3个月订阅 + 高级皮质挂绳",
      color: "#4a5d4a",
      accent: "#4ade80",
      badge: "热卖",
    },
    {
      name: "ALIBI Pro",
      subtitle: "珊瑚橙",
      price: "¥499",
      desc: "含AI对话3个月订阅 + 高级皮质挂绳",
      color: COLORS.coral,
      accent: COLORS.white,
      badge: "限定",
    },
  ];

  return (
    <section style={{
      background: COLORS.cream,
      padding: "clamp(80px, 12vw, 160px) clamp(20px, 6vw, 120px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: COLORS.coral,
            letterSpacing: 4, textTransform: "uppercase",
            marginBottom: 24,
          }}>
            05 — 商店
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            color: COLORS.black, fontWeight: 400,
            letterSpacing: -1, marginBottom: 60,
          }}>
            选择你的 <span style={{ fontStyle: "italic", color: COLORS.coral }}>ALIBI</span>
          </h2>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {products.map((p, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div style={{
                background: COLORS.white,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.4s, box-shadow 0.4s",
                position: "relative",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {p.badge && (
                  <div style={{
                    position: "absolute", top: 16, right: 16, zIndex: 1,
                    background: COLORS.coral, color: COLORS.white,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, letterSpacing: 2, padding: "4px 10px",
                    textTransform: "uppercase",
                  }}>{p.badge}</div>
                )}
                {/* Product color swatch / device preview */}
                <div style={{
                  height: 280,
                  background: p.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 44, height: 78, borderRadius: 22,
                    border: `1.5px solid ${p.accent}40`,
                    position: "relative",
                    boxShadow: `0 10px 30px rgba(0,0,0,0.3)`,
                    background: `linear-gradient(160deg, ${p.color}, ${p.color}dd)`,
                  }}>
                    <div style={{
                      position: "absolute", top: 18, left: "50%",
                      transform: "translateX(-50%)",
                      width: 12, height: 12, borderRadius: "50%",
                      background: p.accent,
                      boxShadow: `0 0 15px ${p.accent}40`,
                    }} />
                  </div>
                  {/*
                    📸 REPLACE WITH PRODUCT PHOTO:
                    Nano Banana prompt: "Product photo of tiny ${p.subtitle} colored 
                    capsule keychain device on matching colored background. Centered 
                    composition, soft even lighting, no shadows. Clean ecommerce 
                    product photography. --ar 1:1 --s 600"
                  */}
                </div>
                <div style={{ padding: "24px 24px 28px" }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", marginBottom: 4,
                  }}>
                    <h3 style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: 22, fontWeight: 400,
                      color: COLORS.black,
                    }}>{p.name}</h3>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14, color: COLORS.coral,
                      fontWeight: 600,
                    }}>{p.price}</span>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, color: COLORS.grey,
                    letterSpacing: 2, marginBottom: 12,
                    textTransform: "uppercase",
                  }}>{p.subtitle}</div>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, color: COLORS.grey,
                    lineHeight: 1.6,
                  }}>{p.desc}</p>
                  <button style={{
                    marginTop: 20, width: "100%",
                    background: COLORS.black, color: COLORS.white,
                    border: "none", padding: "14px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, letterSpacing: 2, cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "background 0.3s",
                  }}
                    onMouseEnter={e => e.target.style.background = COLORS.coral}
                    onMouseLeave={e => e.target.style.background = COLORS.black}
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Subscription tier */}
        <FadeIn delay={0.5}>
          <div style={{
            marginTop: 60,
            background: COLORS.black,
            padding: "clamp(40px, 5vw, 60px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
          }}>
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, color: COLORS.coral,
                letterSpacing: 3, marginBottom: 16,
              }}>AI 订阅计划</div>
              <h3 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 28, color: COLORS.white, fontWeight: 400,
              }}>解锁全部AI能力</h3>
            </div>
            {[
              { name: "基础版", price: "免费", features: "假电话功能 · 自定义延迟 · 来电显示设置" },
              { name: "AI 对话版", price: "¥29/月", features: "全部基础功能 + AI实时对话 · 人设自定义" },
              { name: "AI 全能版", price: "¥49/月", features: "全部功能 + 语音任务记录 · AI待办助手 · 优先支持" },
            ].map((plan, i) => (
              <div key={i} style={{
                padding: 24,
                border: `1px solid ${i === 2 ? COLORS.coral : COLORS.midGrey}`,
                background: i === 2 ? `${COLORS.coral}10` : "transparent",
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, color: i === 2 ? COLORS.coral : COLORS.grey,
                  letterSpacing: 2, marginBottom: 8,
                  textTransform: "uppercase",
                }}>{plan.name}</div>
                <div style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 28, color: COLORS.white, marginBottom: 12,
                }}>{plan.price}</div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, color: COLORS.grey, lineHeight: 1.7,
                }}>{plan.features}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── SCENARIOS / USE CASES ──────────────────────────
function Scenarios() {
  const scenes = [
    {
      emoji: "🍽️",
      title: "无聊的饭局",
      desc: "亲戚聚会、应酬晚宴、不想待的约会...一键脱身。",
    },
    {
      emoji: "🏢",
      title: "冗长的会议",
      desc: "又一场本可以用邮件解决的会议。你值得拥有自由。",
    },
    {
      emoji: "🛋️",
      title: "尴尬的拜访",
      desc: "朋友家待太久？不好意思直接说走？ALIBI帮你体面告辞。",
    },
    {
      emoji: "🤝",
      title: "社交活动",
      desc: "Networking到极限了？一通电话让你自然消失。",
    },
  ];

  return (
    <section style={{
      background: COLORS.black,
      padding: "clamp(80px, 12vw, 120px) clamp(20px, 6vw, 120px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: COLORS.coral,
            letterSpacing: 4, textTransform: "uppercase",
            marginBottom: 24, textAlign: "center",
          }}>
            使用场景
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            color: COLORS.white, fontWeight: 400,
            textAlign: "center", letterSpacing: -1, marginBottom: 60,
          }}>
            每个人都需要一个 <span style={{ fontStyle: "italic", color: COLORS.coral }}>Plan B</span>
          </h2>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}>
          {scenes.map((s, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div style={{
                padding: 32, textAlign: "center",
                border: `1px solid ${COLORS.midGrey}`,
                transition: "border-color 0.4s",
                cursor: "default",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.coral}
                onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.midGrey}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.emoji}</div>
                <h3 style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 22, color: COLORS.white,
                  fontWeight: 400, marginBottom: 12,
                }}>{s.title}</h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, color: COLORS.grey, lineHeight: 1.7,
                }}>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        {/*
          📸 SCENE IMAGES:
          Nano Banana prompt for each:
          "Candid lifestyle photo of [scene-specific description]. 
          Warm cinematic lighting, shallow depth of field. 
          35mm film aesthetic, Fujifilm color science. --ar 16:9 --s 600"
          
          🎬 SCENE VIDEO:
          Runway/Sora prompt: "Montage of 4 awkward social situations 
          where a person discreetly presses a tiny device, then 
          confidently answers a phone call and walks away. Each scene 
          is 3-4 seconds. Quick cuts, cinematic grade. Music-video 
          pacing. Indoor warm lighting."
        */}
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: COLORS.black,
      borderTop: `1px solid ${COLORS.midGrey}`,
      padding: "60px clamp(20px, 6vw, 120px) 40px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 40, marginBottom: 60,
      }}>
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              border: `2px solid ${COLORS.coral}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: COLORS.coral,
              fontFamily: "'JetBrains Mono', monospace",
            }}>A</div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, fontWeight: 700, color: COLORS.white,
              letterSpacing: 3,
            }}>ALIBI</span>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, color: COLORS.grey, lineHeight: 1.7,
            maxWidth: 240,
          }}>
            你的时间，只属于你自己。<br />
            从尴尬中优雅脱身。
          </p>
        </div>
        {[
          { title: "产品", items: ["ALIBI One", "ALIBI Pro", "配件", "App下载"] },
          { title: "支持", items: ["使用指南", "常见问题", "保修政策", "联系我们"] },
          { title: "关注", items: ["微信公众号", "微博", "小红书", "抖音"] },
        ].map((col) => (
          <div key={col.title}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: COLORS.coral,
              letterSpacing: 3, marginBottom: 20,
              textTransform: "uppercase",
            }}>{col.title}</div>
            {col.items.map(item => (
              <a key={item} href="#" style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, color: COLORS.grey,
                textDecoration: "none", marginBottom: 10,
                transition: "color 0.3s",
              }}
                onMouseEnter={e => e.target.style.color = COLORS.white}
                onMouseLeave={e => e.target.style.color = COLORS.grey}
              >{item}</a>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        borderTop: `1px solid ${COLORS.midGrey}`,
        paddingTop: 24,
        display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, color: COLORS.grey, letterSpacing: 1,
        }}>© 2026 ALIBI. All rights reserved.</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, color: COLORS.grey, letterSpacing: 1,
        }}>沪ICP备XXXXXXXX号</span>
      </div>
    </footer>
  );
}

// ─── MAIN APP ───────────────────────────────────────
export default function AlibiStore() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: COLORS.black, minHeight: "100vh" }}>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::selection { background: ${COLORS.coral}; color: ${COLORS.white}; }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px ${COLORS.coral}60, inset 0 1px 0 rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 30px ${COLORS.coral}90, inset 0 1px 0 rgba(255,255,255,0.3); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scrollDown {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(10px); }
        }
        
        @media (max-width: 768px) {
          nav > div:last-child > a { display: none; }
        }
      `}</style>

      <Nav scrolled={scrolled} />
      <Hero />
      <ProductStory />
      <HowItWorks />
      <AIFeatures />
      <AppPreview />
      <Scenarios />
      <Shop />
      <Footer />
    </div>
  );
}
