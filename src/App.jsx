/* eslint-disable */
import { useState, useEffect, useRef } from "react";

// ============================================================
// GLOBAL CSS - defined once at top level
// ============================================================
const GLOBAL_CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; }

  @keyframes ballFly {
    0%   { left: 50%; bottom: 35px; transform: translateX(-50%) scale(1); opacity: 1; }
    40%  { bottom: 110px; opacity: 0.95; }
    100% { left: var(--bx); bottom: var(--by); transform: translateX(-50%) scale(0.55); opacity: 0.7; }
  }
  @keyframes goalPop {
    0%   { transform: scale(0.1) rotate(-15deg); opacity: 0; }
    55%  { transform: scale(1.35) rotate(4deg); opacity: 1; }
    80%  { transform: scale(1.08) rotate(-1deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes goalText {
    0%   { transform: scale(0) translateY(40px); opacity: 0; }
    60%  { transform: scale(1.25) translateY(-8px); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes netShake {
    0%,100% { transform: translateX(0) rotate(0); }
    15%  { transform: translateX(-7px) rotate(-0.8deg); }
    30%  { transform: translateX(7px)  rotate(0.8deg); }
    50%  { transform: translateX(-4px); }
    70%  { transform: translateX(4px); }
    85%  { transform: translateX(-2px); }
  }
  .net-shake { animation: netShake 0.55s ease-in-out; }

  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-9px); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .shimmer-btn {
    background: linear-gradient(90deg,#FFD700 0%,#FFA500 25%,#FFD700 50%,#FFA500 75%,#FFD700 100%);
    background-size: 200% auto;
    animation: shimmer 2.2s linear infinite;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .fade-up { animation: fadeUp 0.45s ease-out forwards; }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 8px rgba(0,200,100,0.3); }
    50%      { box-shadow: 0 0 22px rgba(0,200,100,0.75); }
  }
  .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }

  .zone-btn { transition: transform 0.12s, filter 0.12s !important; }
  .zone-btn:hover  { transform: translate(-50%,-50%) scale(1.18) !important; filter: brightness(1.35) !important; }
  .zone-btn:active { transform: translate(-50%,-50%) scale(0.92) !important; }

  .team-card { transition: transform 0.18s, box-shadow 0.18s; }
  .team-card:hover { transform: scale(1.06) translateY(-3px); }

  .nav-tab { transition: color 0.18s; }

  @keyframes suddenDeath {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.6; transform:scale(1.08); }
  }
  .sudden-pulse { animation: suddenDeath 1s ease-in-out infinite; }

  @keyframes confetti {
    0%   { transform: translateY(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(80px) rotate(720deg); opacity:0; }
  }
`;

// ============================================================
// 48 TEAMS
// ============================================================
const TEAMS = [
  { id:1,  name:"Brazil",       code:"BRA", flag:"🇧🇷", group:"A", color:"#009C3B", jersey:"#009C3B" },
  { id:2,  name:"Germany",      code:"GER", flag:"🇩🇪", group:"A", color:"#1a1a1a", jersey:"#FFFFFF" },
  { id:3,  name:"Mexico",       code:"MEX", flag:"🇲🇽", group:"A", color:"#006847", jersey:"#006847" },
  { id:4,  name:"Japan",        code:"JPN", flag:"🇯🇵", group:"A", color:"#003087", jersey:"#003087" },
  { id:5,  name:"France",       code:"FRA", flag:"🇫🇷", group:"B", color:"#002395", jersey:"#002395" },
  { id:6,  name:"Argentina",    code:"ARG", flag:"🇦🇷", group:"B", color:"#43A1D5", jersey:"#43A1D5" },
  { id:7,  name:"Portugal",     code:"POR", flag:"🇵🇹", group:"B", color:"#AD2121", jersey:"#AD2121" },
  { id:8,  name:"South Korea",  code:"KOR", flag:"🇰🇷", group:"B", color:"#CD2E3A", jersey:"#CD2E3A" },
  { id:9,  name:"Spain",        code:"ESP", flag:"🇪🇸", group:"C", color:"#AA151B", jersey:"#AA151B" },
  { id:10, name:"England",      code:"ENG", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", group:"C", color:"#003090", jersey:"#FFFFFF" },
  { id:11, name:"Netherlands",  code:"NED", flag:"🇳🇱", group:"C", color:"#C8522A", jersey:"#FF6600" },
  { id:12, name:"Senegal",      code:"SEN", flag:"🇸🇳", group:"C", color:"#00853F", jersey:"#00853F" },
  { id:13, name:"Italy",        code:"ITA", flag:"🇮🇹", group:"D", color:"#0066CC", jersey:"#0066CC" },
  { id:14, name:"Belgium",      code:"BEL", flag:"🇧🇪", group:"D", color:"#ED2939", jersey:"#ED2939" },
  { id:15, name:"Croatia",      code:"CRO", flag:"🇭🇷", group:"D", color:"#CC0000", jersey:"#CC0000" },
  { id:16, name:"Morocco",      code:"MAR", flag:"🇲🇦", group:"D", color:"#C1272D", jersey:"#006233" },
  { id:17, name:"USA",          code:"USA", flag:"🇺🇸", group:"E", color:"#002868", jersey:"#FFFFFF" },
  { id:18, name:"Colombia",     code:"COL", flag:"🇨🇴", group:"E", color:"#B5922A", jersey:"#FCD116" },
  { id:19, name:"Uruguay",      code:"URU", flag:"🇺🇾", group:"E", color:"#5B9BD5", jersey:"#5B9BD5" },
  { id:20, name:"Ghana",        code:"GHA", flag:"🇬🇭", group:"E", color:"#006B3F", jersey:"#FFFFFF" },
  { id:21, name:"Poland",       code:"POL", flag:"🇵🇱", group:"F", color:"#DC143C", jersey:"#FFFFFF" },
  { id:22, name:"Switzerland",  code:"SUI", flag:"🇨🇭", group:"F", color:"#CC0000", jersey:"#CC0000" },
  { id:23, name:"Denmark",      code:"DEN", flag:"🇩🇰", group:"F", color:"#C60C30", jersey:"#C60C30" },
  { id:24, name:"Nigeria",      code:"NGA", flag:"🇳🇬", group:"F", color:"#008751", jersey:"#008751" },
  { id:25, name:"Australia",    code:"AUS", flag:"🇦🇺", group:"G", color:"#00008B", jersey:"#FFD700" },
  { id:26, name:"Canada",       code:"CAN", flag:"🇨🇦", group:"G", color:"#CC0000", jersey:"#CC0000" },
  { id:27, name:"Saudi Arabia", code:"KSA", flag:"🇸🇦", group:"G", color:"#006C35", jersey:"#FFFFFF" },
  { id:28, name:"Ecuador",      code:"ECU", flag:"🇪🇨", group:"G", color:"#A67C00", jersey:"#FFD100" },
  { id:29, name:"Serbia",       code:"SRB", flag:"🇷🇸", group:"H", color:"#0C4076", jersey:"#FFFFFF" },
  { id:30, name:"Cameroon",     code:"CMR", flag:"🇨🇲", group:"H", color:"#007A5E", jersey:"#009A44" },
  { id:31, name:"Qatar",        code:"QAT", flag:"🇶🇦", group:"H", color:"#8D153A", jersey:"#8D153A" },
  { id:32, name:"Wales",        code:"WAL", flag:"🏴󠁧󠁢󠁷󠁬󠁳󠁿", group:"H", color:"#CC0000", jersey:"#FFFFFF" },
  { id:33, name:"Turkey",       code:"TUR", flag:"🇹🇷", group:"I", color:"#E30A17", jersey:"#E30A17" },
  { id:34, name:"Ukraine",      code:"UKR", flag:"🇺🇦", group:"I", color:"#005BBB", jersey:"#FFD500" },
  { id:35, name:"Austria",      code:"AUT", flag:"🇦🇹", group:"I", color:"#ED2939", jersey:"#FFFFFF" },
  { id:36, name:"Algeria",      code:"ALG", flag:"🇩🇿", group:"I", color:"#006233", jersey:"#FFFFFF" },
  { id:37, name:"Chile",        code:"CHI", flag:"🇨🇱", group:"J", color:"#D52B1E", jersey:"#D52B1E" },
  { id:38, name:"Venezuela",    code:"VEN", flag:"🇻🇪", group:"J", color:"#CF142B", jersey:"#FFFFFF" },
  { id:39, name:"Egypt",        code:"EGY", flag:"🇪🇬", group:"J", color:"#CE1126", jersey:"#FFFFFF" },
  { id:40, name:"Ivory Coast",  code:"CIV", flag:"🇨🇮", group:"J", color:"#F77F00", jersey:"#009A44" },
  { id:41, name:"Sweden",       code:"SWE", flag:"🇸🇪", group:"K", color:"#006AA7", jersey:"#FECC02" },
  { id:42, name:"Czechia",      code:"CZE", flag:"🇨🇿", group:"K", color:"#D7141A", jersey:"#D7141A" },
  { id:43, name:"Iran",         code:"IRN", flag:"🇮🇷", group:"K", color:"#239F40", jersey:"#FFFFFF" },
  { id:44, name:"Honduras",     code:"HON", flag:"🇭🇳", group:"K", color:"#0073CF", jersey:"#FFFFFF" },
  { id:45, name:"New Zealand",  code:"NZL", flag:"🇳🇿", group:"L", color:"#1a1a1a", jersey:"#FFFFFF" },
  { id:46, name:"Peru",         code:"PER", flag:"🇵🇪", group:"L", color:"#D91023", jersey:"#FFFFFF" },
  { id:47, name:"Panama",       code:"PAN", flag:"🇵🇦", group:"L", color:"#DA121A", jersey:"#FFFFFF" },
  { id:48, name:"Costa Rica",   code:"CRC", flag:"🇨🇷", group:"L", color:"#002B7F", jersey:"#FFFFFF" },
];

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

// Zone layout: 9 zones in a 3x3 grid
// id: 0=top-left  1=top-mid  2=top-right
//     3=mid-left  4=center   5=mid-right
//     6=bot-left  7=bot-mid  8=bot-right
const ZONES = [
  { id:0, label:"↖", bx:"18%",  by:"78%" },
  { id:1, label:"⬆", bx:"50%",  by:"80%" },
  { id:2, label:"↗", bx:"82%",  by:"78%" },
  { id:3, label:"◀", bx:"18%",  by:"55%" },
  { id:4, label:"●", bx:"50%",  by:"55%" },
  { id:5, label:"▶", bx:"82%",  by:"55%" },
  { id:6, label:"↙", bx:"18%",  by:"32%" },
  { id:7, label:"⬇", bx:"50%",  by:"30%" },
  { id:8, label:"↘", bx:"82%",  by:"32%" },
];

// GK dive transform per zone
function gkDiveTransform(zoneId) {
  // columns: 0=left, 1=center, 2=right
  // rows:    0=top, 1=mid, 2=bot (bot zones = lower half of goal)
  const col = zoneId % 3;   // 0,1,2
  const row = Math.floor(zoneId / 3); // 0=top,1=mid,2=bot
  let tx = 0, ty = 0, rot = 0;
  if (col === 0) { tx = -72; rot = -22; }
  if (col === 2) { tx =  72; rot =  22; }
  if (row === 0) { ty = -30; }   // top zones → jump up
  if (row === 2) { ty =  18; }   // bottom zones → crouch
  return `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
}

// ============================================================
// SVG JERSEY
// ============================================================
function Jersey({ color, number = "10", size = 40 }) {
  const c = color || "#333";
  const textColor = isLight(c) ? "#000" : "#fff";
  return (
    <svg width={size} height={size} viewBox="0 0 40 42" fill="none">
      {/* sleeves */}
      <path d="M4 9 L12 6 L12 19 L4 19 Z" fill={c} stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
      <path d="M36 9 L28 6 L28 19 L36 19 Z" fill={c} stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
      {/* body */}
      <path d="M12 6 L20 9 L28 6 L30 38 L10 38 Z" fill={c} stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
      {/* collar */}
      <path d="M16 6 C16 6 17.5 11 20 11 C22.5 11 24 6 24 6" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
      {/* number */}
      <text x="20" y="29" textAnchor="middle" fill={textColor} fontSize="10" fontWeight="bold" fontFamily="Arial" opacity="0.9">{number}</text>
    </svg>
  );
}

function isLight(hex) {
  const h = hex.replace("#","");
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return (r*299 + g*587 + b*114) / 1000 > 160;
}

// ============================================================
// GOAL NET SVG
// ============================================================
function GoalNet({ shaking }) {
  return (
    <svg
      className={shaking ? "net-shake" : ""}
      width="280" height="168" viewBox="0 0 280 168"
      style={{ display:"block", position:"absolute", top:0, left:0 }}
    >
      {/* posts */}
      <rect x="8"  y="8"  width="9" height="152" fill="#bbb" rx="2"/>
      <rect x="263" y="8" width="9" height="152" fill="#bbb" rx="2"/>
      <rect x="8"  y="8"  width="264" height="9" fill="#bbb" rx="2"/>
      {/* back of net (shadow) */}
      <rect x="17" y="17" width="246" height="136" fill="rgba(0,0,0,0.18)" rx="2"/>
      {/* vertical net lines */}
      {Array.from({length:14}).map((_,i)=>(
        <line key={i} x1={17+i*18.9} y1={17} x2={17+i*18.9} y2={153} stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
      ))}
      {/* horizontal net lines */}
      {Array.from({length:9}).map((_,i)=>(
        <line key={i} x1={17} y1={17+i*15.1} x2={263} y2={17+i*15.1} stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
      ))}
      {/* ground */}
      <line x1="8" y1="160" x2="272" y2="160" stroke="#bbb" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

// ============================================================
// GOALKEEPER
// ============================================================
function Goalkeeper({ diveZone, team, isPlayer }) {
  const c = team ? team.jersey : "#FF6B00";
  const num = isPlayer ? "1" : "1";
  const diveStyle = diveZone !== null
    ? { transform: gkDiveTransform(diveZone), transition: "transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)" }
    : { transform: "translate(0,0) rotate(0deg)", transition: "transform 0.32s ease" };
  return (
    <div style={{
      position:"absolute", bottom:"14px", left:"50%",
      transform:"translateX(-50%)", zIndex:8,
    }}>
      <div style={diveStyle}>
        <Jersey color={c} number={num} size={46}/>
      </div>
    </div>
  );
}

// ============================================================
// FLYING BALL
// ============================================================
function FlyingBall({ zone, active }) {
  if (!active || zone === null) return null;
  const z = ZONES[zone];
  return (
    <div style={{
      position:"absolute",
      left:"50%", bottom:"35px",
      width:"22px", height:"22px",
      borderRadius:"50%",
      background:"radial-gradient(circle at 35% 30%, #fff 0%, #ccc 55%, #888 100%)",
      boxShadow:"0 3px 10px rgba(0,0,0,0.55)",
      pointerEvents:"none",
      zIndex:20,
      animation:"ballFly 0.42s cubic-bezier(0.22,0.61,0.36,1) forwards",
      "--bx": z.bx,
      "--by": z.by,
    }}/>
  );
}

// ============================================================
// EFFECTS
// ============================================================
function GoalFX({ show }) {
  if (!show) return null;
  return (
    <div style={{
      position:"absolute", inset:0, zIndex:100, pointerEvents:"none",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{ fontSize:"68px", animation:"goalPop 0.75s ease-out forwards",
        textShadow:"0 0 28px #FF6600, 0 0 56px #FF2200", lineHeight:1 }}>⚽🔥</div>
      <div style={{
        fontSize:"46px", fontWeight:"900", fontFamily:"'Bebas Neue','Impact',sans-serif",
        color:"#FFD700", textShadow:"0 0 18px #FF6600", letterSpacing:"5px",
        animation:"goalText 0.75s ease-out forwards", marginTop:"6px",
      }}>GOOOAL!</div>
    </div>
  );
}

function SaveFX({ show }) {
  if (!show) return null;
  return (
    <div style={{
      position:"absolute", inset:0, zIndex:100, pointerEvents:"none",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{
        fontSize:"44px", fontWeight:"900", fontFamily:"'Bebas Neue','Impact',sans-serif",
        color:"#00FF88", textShadow:"0 0 18px #00FF88",
        animation:"goalText 0.75s ease-out forwards", letterSpacing:"3px",
      }}>SAVED! 🧤</div>
    </div>
  );
}

// ============================================================
// PENALTY DOTS ROW
// ============================================================
function PenDots({ results, max=5 }) {
  return (
    <div style={{ display:"flex", gap:"5px" }}>
      {Array.from({length:max}).map((_,i)=>(
        <div key={i} style={{
          width:"16px", height:"16px", borderRadius:"50%",
          background: i < results.length
            ? (results[i] ? "#00FF88" : "#FF4444")
            : "rgba(255,255,255,0.18)",
          border:"2px solid rgba(255,255,255,0.35)",
          transition:"background 0.3s",
        }}/>
      ))}
    </div>
  );
}

// ============================================================
// MATCH SCREEN  (fixed AI animation + sudden death)
// ============================================================
function MatchScreen({ playerTeam, aiTeam, onBack, onRematch, onGoTournament, pvpMode=false, onPVPWin }) {
  const [penalties, setPenalties]         = useState({ p:[], ai:[] });
  const [phase, setPhase]                 = useState("player_kick"); // player_kick | ai_kick | sudden_death | result
  const [round, setRound]                 = useState(0);   // 0-4 for normal, increments in SD
  const [sdRound, setSdRound]             = useState(0);
  const [animating, setAnimating]         = useState(false);
  const [playerZone, setPlayerZone]       = useState(null);
  const [aiShotZone, setAiShotZone]       = useState(null);
  const [gkDiveZone, setGkDiveZone]       = useState(null);  // defender's gk dive
  const [aiGkDiveZone, setAiGkDiveZone]   = useState(null);  // AI gk dive (during player kick)
  const [ballZone, setBallZone]           = useState(null);
  const [ballActive, setBallActive]       = useState(false);
  const [showGoal, setShowGoal]           = useState(false);
  const [showSave, setShowSave]           = useState(false);
  const [netShake, setNetShake]           = useState(false);
  const [winner, setWinner]               = useState(null);  // "player"|"ai"
  const [statusMsg, setStatusMsg]         = useState("Choose your shot zone!");
  const [isSuddenDeath, setIsSuddenDeath] = useState(false);
  const tRef = useRef([]);

  const clr = (fn, ms) => { const t = setTimeout(fn, ms); tRef.current.push(t); return t; };
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);

  const pScore  = penalties.p.filter(Boolean).length;
  const aiScore = penalties.ai.filter(Boolean).length;
  const shotsCompleted = Math.min(penalties.p.length, penalties.ai.length);

  // ---------- early finish check ----------
  function checkEarlyFinish(pArr, aArr, roundIdx) {
    const ps = pArr.filter(Boolean).length;
    const as = aArr.filter(Boolean).length;
    const rem = 5 - roundIdx;
    if (roundIdx >= 5) {
      if (ps > as) return "player";
      if (as > ps) return "ai";
      return "draw";
    }
    if (ps > as + rem) return "player";
    if (as > ps + rem) return "ai";
    return null;
  }

  // ---------- animate a kick ----------
  // dir: "player" or "ai"
  // shotZoneId: where the ball goes
  // gkZoneId: where keeper dives
  // onDone(scored)
  function animateKick(dir, shotZoneId, gkZoneId, onDone) {
    setAnimating(true);
    if (dir === "player") {
      setPlayerZone(shotZoneId);
      setAiGkDiveZone(gkZoneId);
    } else {
      setAiShotZone(shotZoneId);
      setGkDiveZone(gkZoneId);
    }
    setBallZone(shotZoneId);
    setBallActive(true);

    clr(() => {
      const scored = shotZoneId !== gkZoneId;
      setShowGoal(scored);
      setShowSave(!scored);
      if (scored) setNetShake(true);

      clr(() => {
        setShowGoal(false); setShowSave(false); setNetShake(false);
        setBallActive(false); setBallZone(null);
        if (dir === "player") { setPlayerZone(null); setAiGkDiveZone(null); }
        else { setAiShotZone(null); setGkDiveZone(null); }
        setAnimating(false);
        onDone(scored);
      }, 950);
    }, 440);
  }

  // ---------- player kicks ----------
  function handlePlayerKick(zoneId) {
    if (animating || (phase !== "player_kick" && phase !== "sudden_death")) return;
    const gkZone = Math.floor(Math.random() * 9);
    setStatusMsg("...");
    animateKick("player", zoneId, gkZone, (scored) => {
      const newP = [...penalties.p, scored];
      setPenalties(prev => ({ ...prev, p: newP }));
      setStatusMsg(scored ? "⚽ GOAL!" : "Saved!");
      clr(() => doAIKick(newP, penalties.ai), 600);
    });
  }

  // ---------- AI kicks ----------
  function doAIKick(pArr, aArr) {
    const aiZone  = Math.floor(Math.random() * 9);
    const gkZone  = Math.floor(Math.random() * 9); // player GK dives randomly
    setStatusMsg("Opponent shooting...");
    animateKick("ai", aiZone, gkZone, (scored) => {
      const newAI = [...aArr, scored];
      setPenalties({ p: pArr, ai: newAI });
      const nextRound = Math.min(pArr.length, newAI.length);

      if (isSuddenDeath) {
        // In SD: if both scored → next round; if p scored and ai missed → player wins; etc.
        if (pArr[pArr.length-1] && !scored) { endMatch("player"); return; }
        if (!pArr[pArr.length-1] && scored)  { endMatch("ai");     return; }
        if (!pArr[pArr.length-1] && !scored) {
          setSdRound(r => r+1);
          setStatusMsg("Still tied — sudden death continues!");
          clr(() => setPhase("sudden_death"), 400);
          return;
        }
        // both scored → next sd round
        setSdRound(r => r+1);
        setStatusMsg("Both scored — next round!");
        clr(() => setPhase("sudden_death"), 400);
        return;
      }

      const res = checkEarlyFinish(pArr, newAI, nextRound);
      if (res === "player") { endMatch("player"); return; }
      if (res === "ai")     { endMatch("ai");     return; }
      if (res === "draw")   {
        setIsSuddenDeath(true);
        setStatusMsg("🔥 SUDDEN DEATH!");
        clr(() => setPhase("sudden_death"), 600);
        return;
      }
      setRound(nextRound);
      setStatusMsg("Choose your shot zone!");
      clr(() => setPhase("player_kick"), 300);
    });
  }

  function endMatch(w) {
    setWinner(w);
    setPhase("result");
    setStatusMsg(w === "player" ? "🏆 YOU WIN!" : "💀 YOU LOSE");
    if (pvpMode && w === "player" && onPVPWin) onPVPWin();
  }

  function resetMatch() {
    setPenalties({p:[],ai:[]});
    setPhase("player_kick");
    setRound(0); setSdRound(0);
    setAnimating(false);
    setPlayerZone(null); setAiShotZone(null);
    setGkDiveZone(null); setAiGkDiveZone(null);
    setBallZone(null); setBallActive(false);
    setShowGoal(false); setShowSave(false); setNetShake(false);
    setWinner(null); setStatusMsg("Choose your shot zone!");
    setIsSuddenDeath(false);
  }

  const isPlayerKicking = phase === "player_kick" || phase === "sudden_death";

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#07101d 0%,#0a1c0a 65%,#122210 100%)",
      fontFamily:"'Barlow','Trebuchet MS',sans-serif",
      color:"#fff",
      display:"flex", flexDirection:"column", alignItems:"center",
    }}>
      {/* Header */}
      <div style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 16px",
        background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)",
        borderBottom:"1px solid rgba(255,215,0,0.2)",
      }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#FFD700",fontSize:"22px",cursor:"pointer" }}>←</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"11px", color:"#888", letterSpacing:"2px" }}>
            {pvpMode ? "💰 PVP MATCH" : "PENALTY SHOOTOUT"}
            {isSuddenDeath && <span className="sudden-pulse" style={{ color:"#FF4444", marginLeft:"8px" }}>• SUDDEN DEATH</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"14px", justifyContent:"center", marginTop:"2px" }}>
            <span style={{ fontSize:"22px" }}>{playerTeam?.flag}</span>
            <span style={{ fontSize:"26px", fontWeight:"900", color:"#FFD700", fontFamily:"'Bebas Neue','Impact',sans-serif" }}>
              {pScore} – {aiScore}
            </span>
            <span style={{ fontSize:"22px" }}>{aiTeam?.flag}</span>
          </div>
        </div>
        <div style={{ width:"32px" }}/>
      </div>

      {/* Penalty dots */}
      <div style={{ display:"flex", gap:"18px", padding:"8px 16px", alignItems:"center" }}>
        <PenDots results={penalties.p} max={isSuddenDeath ? penalties.p.length+1 : 5}/>
        <span style={{ fontSize:"18px" }}>⚽</span>
        <PenDots results={penalties.ai} max={isSuddenDeath ? penalties.ai.length+1 : 5}/>
      </div>

      {/* Goal scene */}
      <div style={{
        position:"relative",
        width:"280px", height:"200px",
        margin:"4px auto 8px",
        flexShrink:0,
      }}>
        {/* Sky / stands */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to bottom,#0e1e2c 0%,#162c1a 55%,#1e3c14 100%)",
          borderRadius:"10px",
          overflow:"hidden",
        }}>
          {/* crowd dots */}
          <div style={{ padding:"6px 10px", fontSize:"7px", opacity:0.3, lineHeight:1.4 }}>
            {"👥".repeat(20)}
          </div>
          {/* pitch */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0, height:"55px",
            background:"linear-gradient(to bottom,#2d7a2d,#1a4d1a)",
          }}/>
          {/* penalty spot */}
          <div style={{
            position:"absolute", bottom:"46px", left:"50%",
            transform:"translateX(-50%)",
            width:"5px", height:"5px", borderRadius:"50%",
            background:"rgba(255,255,255,0.5)",
          }}/>
          {/* penalty area lines */}
          <div style={{
            position:"absolute", bottom:"50px", left:"50%",
            transform:"translateX(-50%)",
            width:"90px", height:"36px",
            border:"1px solid rgba(255,255,255,0.25)",
            borderBottom:"none",
          }}/>
        </div>

        {/* Net */}
        <GoalNet shaking={netShake}/>

        {/* Goalkeeper */}
        {isPlayerKicking ? (
          // AI is the goalkeeper
          <Goalkeeper diveZone={aiGkDiveZone} team={aiTeam} isPlayer={false}/>
        ) : (
          // Player is the goalkeeper (during AI kick)
          <Goalkeeper diveZone={gkDiveZone} team={playerTeam} isPlayer={true}/>
        )}

        {/* Ball */}
        <FlyingBall zone={ballZone} active={ballActive}/>

        {/* Effects */}
        <GoalFX show={showGoal}/>
        <SaveFX show={showSave}/>
      </div>

      {/* Status */}
      <div style={{
        fontSize:"15px", fontWeight:"700",
        color: phase === "result"
          ? (winner === "player" ? "#FFD700" : "#FF4444")
          : isSuddenDeath ? "#FF6600" : "#00FF88",
        letterSpacing:"1px", textAlign:"center",
        minHeight:"22px", marginBottom:"8px",
        textShadow:"0 0 10px currentColor",
        fontFamily:"'Bebas Neue','Impact',sans-serif",
        fontSize:"18px",
      }}>{statusMsg}</div>

      {/* Shot zones */}
      {phase !== "result" && (
        <div style={{ width:"100%", maxWidth:"300px", padding:"0 12px" }}>
          <div style={{ fontSize:"10px", color:"#555", letterSpacing:"2px", textAlign:"center", marginBottom:"6px" }}>
            {isPlayerKicking ? "YOUR SHOT" : "YOUR KEEPER"}
          </div>
          <div style={{
            position:"relative",
            width:"100%", paddingBottom:"52%",
            background:"rgba(255,255,255,0.03)",
            borderRadius:"10px",
            border:"1px solid rgba(255,255,255,0.1)",
          }}>
            <div style={{ position:"absolute", inset:0 }}>
              {ZONES.map(z => {
                const col = z.id % 3;
                const row = Math.floor(z.id / 3);
                const left = `${16 + col * 34}%`;
                const top  = `${18 + row * 30}%`;
                const isActive = isPlayerKicking && !animating;
                return (
                  <button
                    key={z.id}
                    className="zone-btn"
                    disabled={!isActive}
                    onClick={() => handlePlayerKick(z.id)}
                    style={{
                      position:"absolute",
                      left, top,
                      transform:"translate(-50%,-50%)",
                      width:"34px", height:"34px",
                      borderRadius:"50%",
                      background: isActive
                        ? "linear-gradient(135deg,#003a00,#006600)"
                        : "rgba(255,80,0,0.12)",
                      border: `2px solid ${isActive ? "#00FF88" : "rgba(255,100,0,0.4)"}`,
                      color: isActive ? "#00FF88" : "rgba(255,100,0,0.5)",
                      fontSize:"13px",
                      cursor: isActive ? "pointer" : "default",
                      opacity: animating && !isActive ? 0.4 : 1,
                      boxShadow: isActive ? "0 0 8px rgba(0,255,136,0.3)" : "none",
                      lineHeight:1,
                    }}
                  >{z.label}</button>
                );
              })}
            </div>
          </div>
          {isPlayerKicking && !animating && (
            <div style={{ textAlign:"center", fontSize:"11px", color:"#555", marginTop:"6px" }}>
              Tap a zone to shoot · GK dives randomly
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {phase === "result" && (
        <div style={{ textAlign:"center", padding:"16px 20px", animation:"fadeUp 0.5s ease-out" }}>
          <div style={{ fontSize:"60px", marginBottom:"12px" }}>
            {winner === "player" ? "🏆" : "😢"}
          </div>
          <div style={{
            fontSize:"22px", fontWeight:"900",
            fontFamily:"'Bebas Neue','Impact',sans-serif",
            color: winner === "player" ? "#FFD700" : "#FF4444",
            textShadow:`0 0 16px ${winner === "player" ? "#FFD700" : "#FF4444"}`,
            letterSpacing:"2px", marginBottom:"4px",
          }}>
            {winner === "player"
              ? `${playerTeam?.flag} ${playerTeam?.name} WINS!`
              : `${aiTeam?.flag} ${aiTeam?.name} WINS!`}
          </div>
          <div style={{ fontSize:"18px", color:"#aaa", marginBottom:"20px" }}>
            {pScore} – {aiScore} {isSuddenDeath ? "(SD)" : ""}
          </div>
          <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
            <button onClick={resetMatch} style={{
              padding:"11px 22px",
              background:"linear-gradient(135deg,#003a00,#00AA44)",
              border:"2px solid #00FF88", borderRadius:"10px",
              color:"#00FF88", fontSize:"15px", fontWeight:"700", cursor:"pointer",
            }}>🔄 Rematch</button>
            {onGoTournament && (
              <button onClick={onGoTournament} style={{
                padding:"11px 22px",
                background:"rgba(255,215,0,0.08)",
                border:"2px solid #FFD700", borderRadius:"10px",
                color:"#FFD700", fontSize:"15px", fontWeight:"700", cursor:"pointer",
              }}>🏆 Bracket</button>
            )}
            <button onClick={onBack} style={{
              padding:"11px 22px",
              background:"rgba(255,255,255,0.06)",
              border:"2px solid #555", borderRadius:"10px",
              color:"#aaa", fontSize:"15px", fontWeight:"700", cursor:"pointer",
            }}>🏠 Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TEAM SELECT
// ============================================================
function TeamSelect({ onSelect, onBack }) {
  const [activeGroup, setActiveGroup] = useState("A");
  const [search, setSearch] = useState("");
  const filtered = search
    ? TEAMS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()))
    : TEAMS.filter(t => t.group === activeGroup);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#060d18 0%,#0a1a0a 100%)", fontFamily:"'Barlow','Trebuchet MS',sans-serif", color:"#fff" }}>
      <div style={{
        background:"rgba(0,0,0,0.65)", backdropFilter:"blur(10px)",
        padding:"14px 18px", display:"flex", alignItems:"center", gap:"12px",
        borderBottom:"1px solid rgba(255,215,0,0.25)",
        position:"sticky", top:0, zIndex:50,
      }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#FFD700",fontSize:"22px",cursor:"pointer" }}>←</button>
        <div>
          <div style={{ fontSize:"17px", fontWeight:"700", color:"#FFD700", fontFamily:"'Bebas Neue','Impact',sans-serif", letterSpacing:"1px" }}>SELECT YOUR TEAM</div>
          <div style={{ fontSize:"11px", color:"#888", letterSpacing:"2px" }}>48 NATIONS • WORLD CUP 2026</div>
        </div>
      </div>

      <div style={{ padding:"10px 14px" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Search team..."
          style={{ width:"100%", padding:"9px 13px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"8px", color:"#fff", fontSize:"14px", outline:"none", boxSizing:"border-box" }}
        />
      </div>

      {!search && (
        <div style={{ display:"flex", overflowX:"auto", padding:"0 14px 8px", gap:"6px" }}>
          {GROUPS.map(g => (
            <button key={g} onClick={() => setActiveGroup(g)} style={{
              padding:"5px 13px",
              background: activeGroup===g ? "#FFD700" : "rgba(255,255,255,0.07)",
              border:"1px solid "+(activeGroup===g?"#FFD700":"rgba(255,255,255,0.18)"),
              borderRadius:"20px", color:activeGroup===g?"#000":"#fff",
              fontWeight:"700", fontSize:"12px", cursor:"pointer", flexShrink:0, transition:"all 0.18s",
            }}>Group {g}</button>
          ))}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:"10px", padding:"10px 14px 40px" }}>
        {filtered.map(team => (
          <button key={team.id} className="team-card" onClick={() => onSelect(team)} style={{
            background:`linear-gradient(135deg,${team.color}20,rgba(0,0,0,0.82))`,
            border:`2px solid ${team.color}55`,
            borderRadius:"12px", padding:"14px 10px",
            color:"#fff", cursor:"pointer", textAlign:"center",
            boxShadow:`0 2px 12px ${team.color}18`,
          }}>
            <div style={{ fontSize:"34px", marginBottom:"7px" }}>{team.flag}</div>
            <Jersey color={team.jersey} number="10" size={34}/>
            <div style={{ fontSize:"13px", fontWeight:"700", marginTop:"7px" }}>{team.name}</div>
            <div style={{ fontSize:"10px", color:"#aaa", letterSpacing:"2px" }}>{team.code}</div>
            <div style={{ marginTop:"5px", fontSize:"10px", background:`${team.color}33`, borderRadius:"4px", padding:"2px 5px", color:"#FFD700" }}>
              Group {team.group}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// BRACKET VIEW  (Groups + R32 + R16 + QF + SF + Final)
// ============================================================
function BracketView({ standings, bracket, onSimulate, onStartMatch, selectedTeam }) {
  const [view, setView] = useState("groups");
  const hasData = Object.keys(standings).length > 0;

  return (
    <div style={{ padding:"14px" }}>
      {/* sub-tabs */}
      <div style={{ display:"flex", gap:"5px", overflowX:"auto", marginBottom:"14px" }}>
        {["groups","R32","R16","QF","SF","Final"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding:"5px 12px", flexShrink:0,
            background: view===v ? "#FFD700" : "rgba(255,255,255,0.07)",
            border:"1px solid "+(view===v?"#FFD700":"rgba(255,255,255,0.18)"),
            borderRadius:"20px", color:view===v?"#000":"#fff",
            fontWeight:"700", fontSize:"12px", cursor:"pointer", transition:"all 0.18s",
          }}>{v}</button>
        ))}
      </div>

      {!hasData ? (
        <div style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:"48px", marginBottom:"14px" }}>📊</div>
          <div style={{ fontSize:"15px", color:"#aaa", marginBottom:"22px" }}>Simulate the group stage to build the bracket</div>
          <button onClick={onSimulate} style={{
            padding:"14px 28px",
            background:"linear-gradient(135deg,#FFD700,#FFA500)",
            border:"none", borderRadius:"10px",
            fontSize:"16px", fontWeight:"700", color:"#000", cursor:"pointer",
          }}>🎲 SIMULATE GROUPS</button>
        </div>
      ) : view === "groups" ? (
        <div>
          <button onClick={onSimulate} style={{
            width:"100%", padding:"9px",
            background:"rgba(255,215,0,0.08)", border:"1px solid rgba(255,215,0,0.3)",
            borderRadius:"8px", color:"#FFD700", fontSize:"13px", cursor:"pointer", marginBottom:"10px",
          }}>🔄 Re-simulate groups</button>
          {GROUPS.map(g => (
            <div key={g} style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.09)",
              borderRadius:"10px", marginBottom:"9px", overflow:"hidden",
            }}>
              <div style={{ background:"rgba(255,215,0,0.09)", padding:"7px 12px", fontSize:"12px", fontWeight:"700", color:"#FFD700", letterSpacing:"2px" }}>
                GROUP {g}
              </div>
              {(standings[g]||[]).map((team,idx) => (
                <div key={team.id} style={{
                  display:"flex", alignItems:"center", padding:"8px 12px",
                  background: idx<2 ? "rgba(0,255,136,0.04)" : "transparent",
                  borderTop:"1px solid rgba(255,255,255,0.05)",
                }}>
                  <span style={{ width:"18px", fontSize:"12px", fontWeight:"700", color:idx<2?"#00FF88":"#666" }}>{idx+1}</span>
                  <span style={{ fontSize:"18px", marginRight:"8px" }}>{team.flag}</span>
                  <span style={{ flex:1, fontSize:"13px", fontWeight:"600" }}>{team.name}</span>
                  <span style={{ fontSize:"11px", color:"#888" }}>{team.w}W {team.d}D {team.l}L</span>
                  <span style={{ marginLeft:"10px", fontWeight:"900", fontSize:"15px", color:"#FFD700", minWidth:"22px", textAlign:"right" }}>{team.pts}</span>
                  {idx<2 && <span style={{ marginLeft:"5px", fontSize:"10px", color:"#00FF88" }}>✓</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <BracketRound
          round={view}
          bracket={bracket}
          selectedTeam={selectedTeam}
          onStartMatch={onStartMatch}
        />
      )}
    </div>
  );
}

function BracketRound({ round, bracket, selectedTeam, onStartMatch }) {
  if (!bracket) return <div style={{ textAlign:"center", padding:"30px", color:"#666" }}>Simulate groups first</div>;

  const roundMap = { R32:"r32", R16:"r16", QF:"qf", SF:"sf", Final:"final" };
  const key = roundMap[round];
  const matches = key === "final"
    ? (bracket.final ? [bracket.final] : [])
    : (bracket[key] || []);

  if (matches.length === 0) {
    return (
      <div style={{ textAlign:"center", padding:"30px", color:"#666" }}>
        <div style={{ fontSize:"32px", marginBottom:"10px" }}>🔒</div>
        <div>Play through previous rounds to unlock {round}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize:"11px", color:"#888", letterSpacing:"2px", marginBottom:"10px" }}>
        {round} • {matches.length} MATCH{matches.length>1?"ES":""}
      </div>
      {matches.map((match, i) => (
        <div key={i} style={{
          background:"rgba(255,255,255,0.04)",
          border:`1px solid ${match.winner ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.1)"}`,
          borderRadius:"10px", marginBottom:"8px", overflow:"hidden",
        }}>
          <div style={{ display:"flex", alignItems:"stretch" }}>
            {[match.team1, match.team2].map((team, ti) => (
              <button key={ti} onClick={() => selectedTeam && onStartMatch(selectedTeam, team)} style={{
                flex:1, padding:"10px 10px", background:"none", border:"none",
                display:"flex", alignItems:"center", justifyContent: ti===0?"flex-start":"flex-end",
                gap:"8px", cursor: selectedTeam?"pointer":"default", color:"#fff",
                background: match.winner && match.winner.id===team?.id ? "rgba(0,255,136,0.07)" : "transparent",
              }}>
                {ti===1 && <span style={{ fontSize:"12px", fontWeight:"700", color:match.winner?.id===team?.id?"#00FF88":"#fff" }}>{team?.code}</span>}
                <span style={{ fontSize:"22px" }}>{team?.flag}</span>
                {ti===0 && <span style={{ fontSize:"12px", fontWeight:"700", color:match.winner?.id===team?.id?"#00FF88":"#fff" }}>{team?.code}</span>}
              </button>
            ))}
            <div style={{ padding:"10px 8px", fontSize:"11px", fontWeight:"700", color:"#555", alignSelf:"center", flexShrink:0 }}>VS</div>
          </div>
          {match.winner && (
            <div style={{ padding:"4px 12px 6px", fontSize:"11px", color:"#00FF88", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              ✓ {match.winner.flag} {match.winner.name} advances
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PVP TAB
// ============================================================
function PVPTab({ selectedTeam, onSelectTeam, onStartPVPMatch }) {
  const [balance, setBalance]         = useState(5.00);
  const [totalFees, setTotalFees]     = useState(0);
  const [coinBal, setCoinBal]         = useState(0);
  const [walletOk, setWalletOk]       = useState(false);
  const [room, setRoom]               = useState(null);
  const [log, setLog]                 = useState([]);
  const addLog = (msg) => setLog(l => [msg, ...l].slice(0,12));

  const MOCK_ROOMS = [
    { id:"WC4821", team: TEAMS[4] },
    { id:"WC3319", team: TEAMS[11] },
    { id:"WC7701", team: TEAMS[8] },
    { id:"WC2255", team: TEAMS[22] },
  ];

  function createRoom() {
    if (balance < 1 || !selectedTeam) return;
    const id = "WC" + Math.floor(Math.random()*9000+1000);
    setBalance(b => b - 1);
    setTotalFees(f => f + 0.25);
    setCoinBal(c => c + 2.5);
    const r = { id, status:"waiting", team: selectedTeam, bet:1 };
    setRoom(r);
    addLog(`Room #${id} created · $1.00 bet`);
    setTimeout(() => {
      const opp = TEAMS[Math.floor(Math.random()*TEAMS.length)];
      setRoom(prev => prev ? {...prev, status:"matched", opponent:opp} : null);
      addLog(`${opp.flag} ${opp.name} joined room #${id}!`);
    }, 3000);
  }

  function joinRoom(mockRoom) {
    if (balance < 1 || !selectedTeam) return;
    setBalance(b => b - 1);
    setTotalFees(f => f + 0.25);
    setCoinBal(c => c + 2.5);
    addLog(`Joined room #${mockRoom.id} · vs ${mockRoom.team.flag} ${mockRoom.team.name}`);
    onStartPVPMatch(selectedTeam, mockRoom.team, () => {
      setBalance(b => b + 1.75);
      addLog(`🏆 YOU WON! +$1.75 · $0.25 → WCUP coin`);
    });
  }

  function playFromRoom() {
    if (!room || !room.opponent) return;
    onStartPVPMatch(room.team, room.opponent, () => {
      setBalance(b => b + 1.75);
      setRoom(null);
      addLog(`🏆 YOU WON! +$1.75 · $0.25 → WCUP coin`);
    });
  }

  return (
    <div style={{ padding:"14px" }}>
      {/* Balance card */}
      <div style={{
        background:"linear-gradient(135deg,#12002a,#2a0060)",
        border:"2px solid rgba(153,0,255,0.35)",
        borderRadius:"14px", padding:"14px", marginBottom:"14px",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
          <div>
            <div style={{ fontSize:"10px", color:"#888", letterSpacing:"2px" }}>PVP BALANCE</div>
            <div style={{ fontSize:"30px", fontWeight:"900", color:"#FFD700", fontFamily:"'Bebas Neue','Impact',sans-serif" }}>
              ${balance.toFixed(2)}
            </div>
          </div>
          <button onClick={() => setWalletOk(w=>!w)} style={{
            padding:"8px 13px",
            background: walletOk ? "rgba(0,255,136,0.1)" : "rgba(153,0,255,0.2)",
            border:`1px solid ${walletOk?"#00FF88":"#9900FF"}`,
            borderRadius:"8px", color:walletOk?"#00FF88":"#DD88FF",
            fontSize:"12px", fontWeight:"700", cursor:"pointer",
          }}>
            {walletOk ? "🔗 Connected" : "🔌 Connect Wallet"}
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"8px", padding:"9px", textAlign:"center" }}>
            <div style={{ fontSize:"10px", color:"#888" }}>FEES PAID</div>
            <div style={{ fontSize:"18px", fontWeight:"700", color:"#FF6600" }}>${totalFees.toFixed(2)}</div>
            <div style={{ fontSize:"10px", color:"#555" }}>→ WCUP coin</div>
          </div>
          <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"8px", padding:"9px", textAlign:"center" }}>
            <div style={{ fontSize:"10px", color:"#888" }}>WCUP COINS</div>
            <div style={{ fontSize:"18px", fontWeight:"700", color:"#00FF88" }}>{coinBal.toFixed(1)}</div>
            <div style={{ fontSize:"10px", color:"#555" }}>pump.fun</div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div style={{
        background:"rgba(255,215,0,0.05)", border:"1px solid rgba(255,215,0,0.2)",
        borderRadius:"10px", padding:"11px 13px", marginBottom:"14px",
      }}>
        <div style={{ fontSize:"12px", fontWeight:"700", color:"#FFD700", marginBottom:"7px" }}>💰 PVP RULES</div>
        <div style={{ fontSize:"12px", color:"#bbb", lineHeight:"1.85" }}>
          • Entry fee: <strong style={{color:"#fff"}}>$1.00</strong><br/>
          • Winner gets: <strong style={{color:"#00FF88"}}>$1.75</strong><br/>
          • Fee: <strong style={{color:"#FF6600"}}>$0.25</strong> auto-buys <strong style={{color:"#FFD700"}}>WCUP</strong> on pump.fun<br/>
          • 5 penalties each · Sudden death if tied
        </div>
      </div>

      {/* Team selector */}
      {!selectedTeam ? (
        <div style={{ textAlign:"center", padding:"18px", color:"#888", fontSize:"14px" }}>
          ← Go to Play tab and select your team first
        </div>
      ) : !room ? (
        <div>
          {/* Selected team */}
          <div style={{
            display:"flex", alignItems:"center", gap:"10px",
            background:`${selectedTeam.color}18`,
            border:`1px solid ${selectedTeam.color}40`,
            borderRadius:"10px", padding:"10px 13px", marginBottom:"12px",
          }}>
            <span style={{ fontSize:"28px" }}>{selectedTeam.flag}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"14px", fontWeight:"700" }}>{selectedTeam.name}</div>
              <div style={{ fontSize:"11px", color:"#888" }}>Your team · Group {selectedTeam.group}</div>
            </div>
            <Jersey color={selectedTeam.jersey} number="10" size={38}/>
          </div>

          {/* Create room */}
          <button onClick={createRoom} disabled={balance<1} style={{
            width:"100%", padding:"15px",
            background: balance>=1 ? "linear-gradient(135deg,#12002a,#5500bb)" : "rgba(80,80,80,0.2)",
            border:`2px solid ${balance>=1?"#9900FF":"#444"}`,
            borderRadius:"12px",
            color: balance>=1?"#DD88FF":"#666",
            fontSize:"17px", fontWeight:"700", cursor:balance>=1?"pointer":"not-allowed",
            letterSpacing:"1px", marginBottom:"16px",
          }}>
            💰 CREATE ROOM ($1.00)
          </button>

          {/* Open rooms */}
          <div style={{ fontSize:"11px", color:"#666", letterSpacing:"2px", marginBottom:"9px" }}>OPEN ROOMS</div>
          {MOCK_ROOMS.map(r => (
            <div key={r.id} style={{
              display:"flex", alignItems:"center",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:"10px", padding:"9px 12px", marginBottom:"8px",
            }}>
              <span style={{ fontSize:"22px", marginRight:"9px" }}>{r.team.flag}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"13px", fontWeight:"700" }}>Room #{r.id}</div>
                <div style={{ fontSize:"11px", color:"#888" }}>{r.team.name} · $1.00 bet</div>
              </div>
              <button onClick={() => joinRoom(r)} disabled={balance<1} style={{
                padding:"6px 13px",
                background: balance>=1 ? "linear-gradient(135deg,#003a00,#006600)" : "rgba(60,60,60,0.3)",
                border:`1px solid ${balance>=1?"#00FF88":"#444"}`,
                borderRadius:"8px", color:balance>=1?"#00FF88":"#666",
                fontSize:"12px", fontWeight:"700", cursor:balance>=1?"pointer":"not-allowed",
              }}>JOIN</button>
            </div>
          ))}
        </div>
      ) : (
        // Active room
        <div style={{
          background:"rgba(0,255,136,0.06)", border:"2px solid rgba(0,255,136,0.28)",
          borderRadius:"12px", padding:"16px", textAlign:"center",
        }}>
          <div style={{ fontSize:"11px", color:"#888", letterSpacing:"2px", marginBottom:"8px" }}>ROOM #{room.id}</div>
          {room.status === "waiting" ? (
            <>
              <div style={{ fontSize:"30px", animation:"float 2s ease-in-out infinite" }}>⏳</div>
              <div style={{ fontSize:"16px", color:"#FFD700", fontWeight:"700", marginTop:"8px" }}>Waiting for opponent...</div>
              <div style={{ fontSize:"12px", color:"#888", marginTop:"4px" }}>
                Share code: <strong style={{color:"#00FF88"}}>#{room.id}</strong>
              </div>
            </>
          ) : (
            <>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", marginBottom:"14px" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"32px" }}>{room.team.flag}</div>
                  <div style={{ fontSize:"10px", color:"#00FF88" }}>YOU</div>
                </div>
                <div style={{ fontSize:"20px", color:"#FFD700", fontWeight:"900" }}>VS</div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"32px" }}>{room.opponent?.flag}</div>
                  <div style={{ fontSize:"10px", color:"#FF4444" }}>OPPONENT</div>
                </div>
              </div>
              <button onClick={playFromRoom} style={{
                padding:"13px 26px",
                background:"linear-gradient(135deg,#003a00,#00AA44)",
                border:"2px solid #00FF88", borderRadius:"10px",
                color:"#00FF88", fontSize:"16px", fontWeight:"700", cursor:"pointer",
              }}>⚽ PLAY NOW!</button>
            </>
          )}
        </div>
      )}

      {/* Activity log */}
      {log.length > 0 && (
        <div style={{ background:"rgba(0,0,0,0.28)", borderRadius:"8px", padding:"9px", marginTop:"12px", maxHeight:"110px", overflowY:"auto" }}>
          <div style={{ fontSize:"10px", color:"#555", letterSpacing:"2px", marginBottom:"5px" }}>LOG</div>
          {log.map((e,i) => (
            <div key={i} style={{ fontSize:"11px", color:"#aaa", marginBottom:"3px" }}>
              <span style={{ color:"#555" }}>{i===0?"now":`${i}m ago`}</span> · {e}
            </div>
          ))}
        </div>
      )}

      {/* Pump.fun note */}
      <div style={{
        marginTop:"14px", padding:"11px 13px",
        background:"linear-gradient(135deg,rgba(255,103,0,0.09),rgba(255,200,0,0.04))",
        border:"1px solid rgba(255,103,0,0.28)", borderRadius:"10px",
        fontSize:"11px", color:"#aaa", lineHeight:"1.7",
      }}>
        <div style={{ color:"#FF6600", fontWeight:"700", marginBottom:"3px" }}>🔥 WCUP TOKEN</div>
        Every $0.25 fee auto-buys <strong style={{color:"#FFD700"}}>WCUP</strong> on pump.fun — more matches = more buy pressure.
        <div style={{ marginTop:"5px", color:"#555", fontSize:"10px" }}>⚠️ Demo — real wallet integration required for live trading</div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function simulateGroupStage() {
  const standings = {};
  GROUPS.forEach(g => {
    const teams = TEAMS.filter(t => t.group === g).map(t => ({...t,w:0,d:0,l:0,pts:0}));
    for (let i=0; i<teams.length; i++) {
      for (let j=i+1; j<teams.length; j++) {
        const r = Math.random();
        if (r<0.38)      { teams[i].w++; teams[i].pts+=3; teams[j].l++; }
        else if (r<0.55) { teams[i].d++; teams[i].pts+=1; teams[j].d++; teams[j].pts+=1; }
        else             { teams[j].w++; teams[j].pts+=3; teams[i].l++; }
      }
    }
    teams.sort((a,b) => b.pts-a.pts);
    standings[g] = teams;
  });
  return standings;
}

function buildBracketFromStandings(standings) {
  const qualifiers = [];
  GROUPS.forEach(g => { qualifiers.push(standings[g][0], standings[g][1]); });
  const shuffled = [...qualifiers].sort(() => Math.random()-0.5);

  // Build progressive rounds
  const r32 = [];
  for (let i=0; i<32; i+=2) r32.push({ team1:shuffled[i], team2:shuffled[i+1], winner:null });

  return { r32, r16:[], qf:[], sf:[], final:null, champion:null };
}

export default function App() {
  const [screen, setScreen]           = useState("home");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [matchTeams, setMatchTeams]   = useState({ p:null, ai:null });
  const [pvpWinCb, setPvpWinCb]       = useState(null);
  const [pvpMode, setPvpMode]         = useState(false);
  const [standings, setStandings]     = useState({});
  const [bracket, setBracket]         = useState(null);
  const [activeTab, setActiveTab]     = useState("play");

  function startMatch(pTeam, aiTeam, pvpCb=null) {
    setMatchTeams({ p: pTeam, ai: aiTeam });
    setPvpMode(!!pvpCb);
    setPvpWinCb(() => pvpCb);
    setScreen("match");
  }

  function handleSimulate() {
    const s = simulateGroupStage();
    setStandings(s);
    setBracket(buildBracketFromStandings(s));
  }

  if (screen === "match") {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <MatchScreen
          playerTeam={matchTeams.p}
          aiTeam={matchTeams.ai}
          pvpMode={pvpMode}
          onPVPWin={pvpWinCb}
          onBack={() => setScreen("main")}
          onRematch={() => startMatch(matchTeams.p, matchTeams.ai, pvpMode ? pvpWinCb : null)}
          onGoTournament={() => { setActiveTab("bracket"); setScreen("main"); }}
        />
      </>
    );
  }

  if (screen === "teamSelect") {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <TeamSelect
          onSelect={t => { setSelectedTeam(t); setScreen("main"); setActiveTab("play"); }}
          onBack={() => setScreen(Object.keys(standings).length>0 ? "main" : "home")}
        />
      </>
    );
  }

  if (screen === "home") {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{
          minHeight:"100vh",
          background:"linear-gradient(135deg,#080812 0%,#0b1d2e 45%,#081505 100%)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          fontFamily:"'Barlow','Trebuchet MS',sans-serif",
          position:"relative", overflow:"hidden", padding:"20px",
        }}>
          {/* grass stripes bg */}
          {Array.from({length:7}).map((_,i) => (
            <div key={i} style={{
              position:"absolute", left:0, right:0,
              top:`${i*14.5}%`, height:"7%",
              background:"#00AA44", opacity:0.04,
            }}/>
          ))}

          <div style={{ textAlign:"center", marginBottom:"38px" }} className="fade-up">
            <div style={{ fontSize:"54px", animation:"float 3s ease-in-out infinite" }}>⚽</div>
            <h1 style={{
              fontSize:"clamp(30px,6vw,52px)", fontWeight:"900",
              color:"#FFD700", margin:"6px 0 2px",
              textShadow:"0 0 28px rgba(255,215,0,0.5), 2px 2px 0 #8a6000",
              letterSpacing:"2px", fontFamily:"'Bebas Neue','Impact',sans-serif",
            }}>WORLD CUP 2026</h1>
            <h2 style={{
              fontSize:"clamp(18px,3.5vw,28px)", fontWeight:"700",
              color:"#fff", margin:"0 0 6px",
              letterSpacing:"7px", textShadow:"0 2px 10px rgba(255,255,255,0.25)",
              fontFamily:"'Bebas Neue','Impact',sans-serif",
            }}>PENALTY PVP</h2>
            <div style={{ fontSize:"12px", color:"#00FF88", letterSpacing:"3px", textShadow:"0 0 8px #00FF88" }}>
              48 TEAMS · 5 PENALTIES · SUDDEN DEATH · WIN $1.75
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"13px", width:"100%", maxWidth:"320px" }}>
            <button className="shimmer-btn" onClick={() => setScreen("teamSelect")} style={{
              padding:"17px 30px", border:"none", borderRadius:"12px",
              fontSize:"19px", fontWeight:"900", color:"#1a0a00", cursor:"pointer",
              letterSpacing:"1px", fontFamily:"'Bebas Neue','Impact',sans-serif",
              boxShadow:"0 4px 18px rgba(255,200,0,0.4)",
            }}>🏆 TOURNAMENT MODE</button>

            <button className="pulse-glow" onClick={() => {
              const opp = TEAMS[Math.floor(Math.random()*TEAMS.length)];
              const me  = selectedTeam || TEAMS[Math.floor(Math.random()*TEAMS.length)];
              startMatch(me, opp);
            }} style={{
              padding:"15px 30px",
              background:"linear-gradient(135deg,#003a00,#006600)",
              border:"2px solid #00CC44", borderRadius:"12px",
              fontSize:"17px", fontWeight:"700", color:"#00FF88", cursor:"pointer",
            }}>⚡ QUICK MATCH</button>

            <button onClick={() => { setScreen("main"); setActiveTab("pvp"); }} style={{
              padding:"15px 30px",
              background:"linear-gradient(135deg,#12002a,#440088)",
              border:"2px solid #9900FF", borderRadius:"12px",
              fontSize:"17px", fontWeight:"700", color:"#DD88FF", cursor:"pointer",
              boxShadow:"0 0 18px rgba(153,0,255,0.28)",
            }}>💰 PVP BETTING ($1 vs $1)</button>
          </div>

          <div style={{
            marginTop:"32px", padding:"11px 18px",
            background:"rgba(255,215,0,0.08)", border:"1px solid rgba(255,215,0,0.28)",
            borderRadius:"8px", fontSize:"12px", color:"#FFD700",
            textAlign:"center", maxWidth:"320px",
          }}>
            💎 $0.25 per match → auto-buys <strong>WCUP</strong> coin on pump.fun
          </div>
        </div>
      </>
    );
  }

  // ---- MAIN (tabs) ----
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        background:"linear-gradient(160deg,#060d18 0%,#0a1a0a 100%)",
        fontFamily:"'Barlow','Trebuchet MS',sans-serif", color:"#fff",
      }}>
        {/* Header */}
        <div style={{
          background:"rgba(0,0,0,0.7)", backdropFilter:"blur(10px)",
          padding:"10px 14px", display:"flex", alignItems:"center", gap:"10px",
          borderBottom:"1px solid rgba(255,215,0,0.18)",
          position:"sticky", top:0, zIndex:50,
        }}>
          <button onClick={() => setScreen("home")} style={{ background:"none",border:"none",color:"#FFD700",fontSize:"20px",cursor:"pointer" }}>←</button>
          <div style={{ fontSize:"14px", fontWeight:"700", color:"#FFD700", letterSpacing:"1px", fontFamily:"'Bebas Neue','Impact',sans-serif" }}>
            🏆 WORLD CUP PENALTY PVP
          </div>
          {selectedTeam && (
            <button onClick={() => setScreen("teamSelect")} style={{
              marginLeft:"auto",
              display:"flex", alignItems:"center", gap:"6px",
              background:`${selectedTeam.color}22`,
              padding:"4px 10px", borderRadius:"20px",
              border:`1px solid ${selectedTeam.color}55`,
              cursor:"pointer", color:"#fff",
            }}>
              <span style={{ fontSize:"18px" }}>{selectedTeam.flag}</span>
              <span style={{ fontSize:"11px", fontWeight:"700" }}>{selectedTeam.code}</span>
            </button>
          )}
        </div>

        {/* Tab content */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {activeTab === "play" && (
            <div style={{ padding:"14px" }}>
              {!selectedTeam ? (
                <div style={{ textAlign:"center", padding:"50px 20px" }}>
                  <div style={{ fontSize:"52px", marginBottom:"14px" }}>🌍</div>
                  <div style={{ fontSize:"17px", fontWeight:"700", marginBottom:"8px", color:"#FFD700" }}>Choose Your Nation</div>
                  <div style={{ fontSize:"13px", color:"#888", marginBottom:"22px" }}>48 World Cup teams</div>
                  <button onClick={() => setScreen("teamSelect")} style={{
                    padding:"13px 26px",
                    background:"linear-gradient(135deg,#FFD700,#FFA500)",
                    border:"none", borderRadius:"10px",
                    fontSize:"15px", fontWeight:"700", color:"#000", cursor:"pointer",
                  }}>SELECT TEAM →</button>
                </div>
              ) : (
                <div>
                  {/* My team card */}
                  <div style={{
                    background:`linear-gradient(135deg,${selectedTeam.color}20,rgba(0,0,0,0.7))`,
                    border:`2px solid ${selectedTeam.color}55`,
                    borderRadius:"12px", padding:"14px", marginBottom:"14px",
                    display:"flex", alignItems:"center", gap:"12px",
                  }}>
                    <span style={{ fontSize:"42px" }}>{selectedTeam.flag}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"18px", fontWeight:"700" }}>{selectedTeam.name}</div>
                      <div style={{ fontSize:"11px", color:"#888", letterSpacing:"1px" }}>YOUR TEAM · GROUP {selectedTeam.group}</div>
                    </div>
                    <Jersey color={selectedTeam.jersey} number="10" size={44}/>
                  </div>

                  {/* Quick kick-off */}
                  <button onClick={() => {
                    const opp = TEAMS.filter(t=>t.id!==selectedTeam.id)[Math.floor(Math.random()*(TEAMS.length-1))];
                    startMatch(selectedTeam, opp);
                  }} style={{
                    width:"100%", padding:"15px",
                    background:"linear-gradient(135deg,#003a00,#008844)",
                    border:"2px solid #00FF88", borderRadius:"12px",
                    color:"#00FF88", fontSize:"18px", fontWeight:"700",
                    cursor:"pointer", letterSpacing:"1px", marginBottom:"12px",
                    fontFamily:"'Bebas Neue','Impact',sans-serif",
                  }}>⚽ KICK OFF vs RANDOM OPPONENT</button>

                  {/* Grid of all flags */}
                  <div style={{ fontSize:"11px", color:"#666", letterSpacing:"2px", marginBottom:"9px" }}>CHOOSE OPPONENT</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:"5px" }}>
                    {TEAMS.filter(t=>t.id!==selectedTeam.id).map(t => (
                      <button key={t.id} title={t.name} onClick={() => startMatch(selectedTeam, t)} style={{
                        background:`${t.color}20`, border:`1px solid ${t.color}44`,
                        borderRadius:"8px", padding:"5px 2px",
                        fontSize:"18px", cursor:"pointer", transition:"transform 0.15s",
                      }}>{t.flag}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "bracket" && (
            <BracketView
              standings={standings}
              bracket={bracket}
              onSimulate={handleSimulate}
              onStartMatch={(p, ai) => startMatch(p, ai)}
              selectedTeam={selectedTeam}
            />
          )}

          {activeTab === "pvp" && (
            <PVPTab
              selectedTeam={selectedTeam}
              onSelectTeam={setSelectedTeam}
              onStartPVPMatch={(p, ai, cb) => startMatch(p, ai, cb)}
            />
          )}
        </div>

        {/* Bottom nav */}
        <div style={{
          background:"rgba(0,0,0,0.92)", backdropFilter:"blur(10px)",
          borderTop:"1px solid rgba(255,255,255,0.09)",
          display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
          padding:"7px 0 10px",
        }}>
          {[
            { id:"play",    icon:"⚽", label:"PLAY" },
            { id:"bracket", icon:"🏆", label:"BRACKET" },
            { id:"pvp",     icon:"💰", label:"PVP BET" },
          ].map(tab => (
            <button key={tab.id} className="nav-tab" onClick={() => setActiveTab(tab.id)} style={{
              background:"none", border:"none",
              color: activeTab===tab.id ? "#FFD700" : "#555",
              cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:"2px",
            }}>
              <span style={{ fontSize:"21px" }}>{tab.icon}</span>
              <span style={{
                fontSize:"9px", fontWeight:"700", letterSpacing:"1px",
                borderBottom: activeTab===tab.id ? "2px solid #FFD700" : "2px solid transparent",
                paddingBottom:"1px", fontFamily:"'Barlow','Trebuchet MS',sans-serif",
              }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
