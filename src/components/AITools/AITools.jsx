import { useState } from "react";
import { NPC_NAMES, RANDOM_ENCOUNTER_TABLES } from "../../data/generatorTables.js";

// ─── Local random data ─────────────────────────────────────────────────────────

const RACES = ["Human","Elf","Dwarf","Halfling","Gnome","Tiefling","Half-Orc","Dragonborn","Half-Elf","Aasimar"];
const CLASSES = ["Barbarian","Bard","Cleric","Druid","Fighter","Monk","Paladin","Ranger","Rogue","Sorcerer","Warlock","Wizard","Artificer","Blood Hunter"];
const ROLES = ["Merchant","Guard","Noble","Innkeeper","Blacksmith","Farmer","Scholar","Priest","Bandit","Sailor","Spy","Herald","Beggar","Apothecary"];
const BACKGROUNDS = ["Acolyte","Charlatan","Criminal","Entertainer","Folk Hero","Guild Artisan","Hermit","Noble","Outlander","Sage","Sailor","Soldier","Urchin","Far Traveler","Haunted One","Knight","Pirate","Gladiator","Courtier","Archaeologist"];
const ALIGNMENTS = ["Lawful Good","Neutral Good","Chaotic Good","Lawful Neutral","True Neutral","Chaotic Neutral","Lawful Evil","Neutral Evil","Chaotic Evil"];

const BUILDS = ["stocky","wiry","muscular","slender","heavyset","lithe","broad-shouldered","gaunt","compact","lanky"];
const HAIR = ["raven-black","chestnut brown","fiery red","silver-streaked","ash blonde","iron grey","sandy","platinum white","auburn","jet black"];
const EYES = ["piercing blue","warm brown","cold grey","bright green","amber","violet","hazel","ice blue","dark brown","golden"];
const FEATURES = [
  "a jagged scar across the left cheek","calloused, ink-stained fingers","a missing front tooth revealed by a wide grin","an elaborate tattoo curling up the neck","a nervous habit of drumming fingers on every surface","deep-set worry lines that age them beyond their years","a crooked nose broken more than once","unusually long fingers adorned with many rings","a permanent squint as though sizing everyone up","a birthmark shaped like a crescent on the jaw","one ear noticeably higher than the other","eyes that never quite settle on one thing"
];

const PERSONALITY_TRAITS = [
  "I always have a plan for what to do when things go wrong.",
  "I am always calm, no matter the situation — never raise my voice.",
  "The first thing I do in a new place is note the exits.",
  "I hoard small trinkets that others would consider junk.",
  "I tell very long, elaborate stories that often have no point.",
  "I misuse long words in an attempt to sound smarter.",
  "I have a strong sense of fair play and always try to find the most equitable solution.",
  "I can't resist a pretty face or a captivating smile.",
  "I blow up at the slightest insult and hold grudges for years.",
  "I am slow to trust but fiercely loyal once earned.",
  "I use flattery to get what I want and rarely reveal my true intentions.",
  "I love a good argument and will play devil's advocate just to see where it leads.",
  "I have little respect for anyone who can't handle themselves in a fight.",
  "I judge others by their ambitions — idle people bore me.",
  "I always eat everything on my plate and treat it as a serious task.",
  "I speak very quietly, forcing others to lean in to hear me.",
  "I am deeply suspicious of magic I don't understand.",
  "Everything I do has a reason — I don't believe in luck.",
  "I find beauty in unexpected places and stop to note them often.",
  "I never make eye contact when lying, but I've gotten very good at looking people in the eye.",
];

const IDEALS = [
  "Freedom. Chains, whether physical or social, are an affront to the self.",
  "Power. The strong shape the world; the weak endure it.",
  "Community. Everything I do, I do for the people around me.",
  "Knowledge. The truth is worth any price.",
  "Redemption. I have done wrong. I will spend my life making it right.",
  "Beauty. The world is more bearable when there is art in it.",
  "Order. Chaos destroys everything it touches. Structure is salvation.",
  "Change. Old ways must give way to new or they calcify into chains.",
  "Ambition. Mediocrity is the slow death. I will be remembered.",
  "Honor. My word is my bond; break it and I am nothing.",
  "Survival. Every choice I make keeps me alive one more day.",
  "Loyalty. I will not abandon those who stand with me.",
  "Justice. The guilty answer for their crimes or the world has no meaning.",
  "Curiosity. I must understand how everything works.",
  "Gratitude. I was given a chance I didn't deserve. I intend to use it.",
];

const BONDS = [
  "There is someone I wronged long ago. I look for them everywhere.",
  "I protect a secret that would ruin someone I love.",
  "A mentor shaped who I am. I carry their lessons like a scar.",
  "I owe a debt to someone who saved my life — money or otherwise.",
  "My hometown is everything to me, even in its absence.",
  "There is a relic in my possession I would die before surrendering.",
  "I have a sibling I haven't seen in years. I still search for them.",
  "An old rival defines me as much as any friend ever did.",
  "I carry a letter I was never able to deliver.",
  "I served an institution — a guild, temple, army — that I left in disgrace.",
  "A child I've never met may carry my name.",
  "I once made a promise under duress that I'm not sure I can keep.",
  "The person who hurt me most is still out there.",
  "I owe everything to someone who asks nothing — and that terrifies me.",
  "I have seen something I cannot explain and I need to understand it.",
];

const FLAWS = [
  "I cannot back down from a challenge, even a foolish one.",
  "I would rather lie smoothly than tell the truth awkwardly.",
  "I have a vice — drink, gambling, something — that surfaces under pressure.",
  "I assume I am the most capable person in any room.",
  "I am deeply superstitious and avoid anything that might bring bad luck.",
  "I hold people to standards I don't apply to myself.",
  "I will sacrifice almost anything for what I want.",
  "I run from emotional intimacy the moment I sense it forming.",
  "I am violently protective of those weaker than me, even when they don't want it.",
  "I deflect every serious moment with a joke.",
  "I am obsessed with a past failure and make poor decisions because of it.",
  "I trust authority figures instinctively, even when I shouldn't.",
  "I cannot keep a secret; eventually it spills out.",
  "I overthink simple decisions until the window closes.",
  "I nurse old grudges long after everyone else has moved on.",
];

const SECRET_MOTIVATIONS = [
  "Seeks to locate a missing person — and fears what they'll find.",
  "Believes they are destined for something great and is terrified of being ordinary.",
  "Carries guilt over a death they caused, accidentally or not.",
  "Is slowly working toward revenge against someone who wronged them years ago.",
  "Wants to acquire enough wealth to disappear entirely and start over.",
  "Has been feeding information to a rival faction.",
  "Is hiding their true identity; their past would change everything.",
  "Searching for a cure — for themselves or someone they love.",
  "Was sent here by someone they dare not name, to watch and report.",
  "Believes they are being followed and is looking for proof.",
  "Has an addiction to something they're deeply ashamed of.",
  "Desperately wants to be accepted by people they consider their betters.",
  "Is sitting on knowledge that could destabilize something powerful.",
  "Trying to undo a past deal that has started to cost more than expected.",
  "Waiting for a signal from someone they've lost contact with.",
];

function pickRandom(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLocalNPC({ race }) {
  const raceData = NPC_NAMES[race] || NPC_NAMES["Human"];
  const gender = pickRandom(["male", "female"]);
  const firstName = pickRandom(raceData[gender] || raceData.male || []);
  const surname = pickRandom(raceData.surname || []);
  const name = surname ? `${firstName} ${surname}` : firstName;
  const build = pickRandom(BUILDS);
  const hair = pickRandom(HAIR);
  const eyes = pickRandom(EYES);
  const feature = pickRandom(FEATURES);
  const appearance = `${build.charAt(0).toUpperCase() + build.slice(1)}, with ${hair} hair and ${eyes} eyes. ${feature.charAt(0).toUpperCase() + feature.slice(1)}.`;
  return {
    name,
    gender,
    appearance,
    personalityTrait: pickRandom(PERSONALITY_TRAITS),
    ideal: pickRandom(IDEALS),
    bond: pickRandom(BONDS),
    flaw: pickRandom(FLAWS),
    secretMotivation: pickRandom(SECRET_MOTIVATIONS),
  };
}

function generateLocalEncounters({ terrain, partyLevel, count = 3 }) {
  const lvl = parseInt(partyLevel) || 1;
  const band = lvl <= 4 ? "1-4" : lvl <= 10 ? "5-10" : lvl <= 16 ? "11-16" : "17+";
  const keys = terrain === "Any" ? Object.keys(RANDOM_ENCOUNTER_TABLES) : [terrain.toLowerCase()];
  const results = [];
  const used = new Set();
  let attempts = 0;
  while (results.length < count && attempts < count * 10) {
    attempts++;
    const terrainKey = pickRandom(keys);
    const tableData = RANDOM_ENCOUNTER_TABLES[terrainKey];
    if (!tableData) continue;
    const pool = tableData[band] || tableData["1-4"] || [];
    if (pool.length === 0) continue;
    const enc = pickRandom(pool);
    if (!used.has(enc)) {
      used.add(enc);
      results.push({ terrain: terrainKey, band, encounter: enc });
    }
  }
  return results;
}

const TERRAINS = ["Any","Forest","Dungeon","Urban","Mountain","Coastal","Plains","Swamp","Underdark"];

// ─── Shared styles ─────────────────────────────────────────────────────────────

const iStyle = {
  background: "rgba(245,230,200,.05)",
  border: "1px solid rgba(92,51,23,.4)",
  borderRadius: 3,
  color: "var(--vel)",
  fontFamily: "'IM Fell English',serif",
  fontSize: 13,
  padding: "6px 10px",
  outline: "none",
  width: "100%",
};

const lStyle = {
  fontFamily: "'Cinzel',serif",
  fontSize: 8,
  letterSpacing: 1.5,
  color: "var(--br)",
  textTransform: "uppercase",
  marginBottom: 4,
};

const btnPrimary = {
  background: "var(--gold)",
  border: "none",
  color: "var(--ink)",
  borderRadius: 3,
  cursor: "pointer",
  fontFamily: "'Cinzel',serif",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
  padding: "7px 20px",
};


const panel = {
  background: "rgba(26,10,2,.7)",
  border: "1px solid rgba(92,51,23,.4)",
  borderRadius: 4,
  padding: 14,
};

// ─── Reroll button ─────────────────────────────────────────────────────────────

function RerollButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Reroll this field"
      style={{
        background: "none",
        border: "1px solid rgba(200,149,42,.3)",
        borderRadius: 3,
        color: "var(--gold)",
        cursor: "pointer",
        fontSize: 11,
        padding: "2px 6px",
        flexShrink: 0,
      }}
    >
      🎲
    </button>
  );
}

// ─── Pill buttons ──────────────────────────────────────────────────────────────

function Pills({ items, onSelect }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
      {items.map(item => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          style={{
            background: "rgba(200,149,42,.08)",
            border: "1px solid rgba(92,51,23,.35)",
            borderRadius: 2,
            color: "rgba(245,230,200,.5)",
            fontFamily: "'Cinzel',serif",
            fontSize: 8,
            letterSpacing: .5,
            padding: "2px 8px",
            cursor: "pointer",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,149,42,.18)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,149,42,.08)"; e.currentTarget.style.color = "rgba(245,230,200,.5)"; }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// ─── NPC Generator (fully local) ──────────────────────────────────────────────

const NPC_FIELDS = [
  { key: "appearance",      label: "Appearance" },
  { key: "personalityTrait",label: "Personality Trait" },
  { key: "ideal",           label: "Ideal" },
  { key: "bond",            label: "Bond" },
  { key: "flaw",            label: "Flaw" },
  { key: "secretMotivation",label: "Secret Motivation" },
];

const FIELD_POOLS = {
  name:             null, // special — regenerated from NPC_NAMES
  appearance:       null, // special — built from component parts
  personalityTrait: PERSONALITY_TRAITS,
  ideal:            IDEALS,
  bond:             BONDS,
  flaw:             FLAWS,
  secretMotivation: SECRET_MOTIVATIONS,
};

function NPCGenerator({ onSaveToWiki }) {
  const [race, setRace]             = useState("Human");
  const [npcClass, setNpcClass]     = useState("");
  const [alignment, setAlignment]   = useState("True Neutral");
  const [level, setLevel]           = useState(1);
  const [background, setBackground] = useState("Folk Hero");
  const [profile, setProfile]       = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  function generate() {
    setProfile(generateLocalNPC({ race, npcClass, alignment, level, background }));
  }

  function rerollField(key) {
    if (!profile) return;
    if (key === "name") {
      const raceData = NPC_NAMES[race] || NPC_NAMES["Human"];
      const gender = profile.gender || "male";
      const firstName = pickRandom(raceData[gender] || raceData.male || []);
      const surname = pickRandom(raceData.surname || []);
      setProfile(p => ({ ...p, name: surname ? `${firstName} ${surname}` : firstName }));
    } else if (key === "appearance") {
      const build = pickRandom(BUILDS);
      const hair = pickRandom(HAIR);
      const eyes = pickRandom(EYES);
      const feature = pickRandom(FEATURES);
      setProfile(p => ({ ...p, appearance: `${build.charAt(0).toUpperCase() + build.slice(1)}, with ${hair} hair and ${eyes} eyes. ${feature.charAt(0).toUpperCase() + feature.slice(1)}.` }));
    } else {
      const pool = FIELD_POOLS[key];
      if (pool) setProfile(p => ({ ...p, [key]: pickRandom(pool) }));
    }
  }

  function handleSave() {
    if (!profile || !onSaveToWiki) return;
    onSaveToWiki({ ...profile, race, role: npcClass || "Commoner", alignment, level, background });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Form row 1: Race, Class, Alignment */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <div style={lStyle}>Race</div>
          <select value={race} onChange={e => setRace(e.target.value)} style={iStyle}>
            {RACES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <div style={lStyle}>Class / Role</div>
          <input value={npcClass} onChange={e => setNpcClass(e.target.value)} placeholder="Fighter, Merchant…" style={iStyle} />
          <Pills items={[...CLASSES.slice(0,6), ...ROLES.slice(0,6)]} onSelect={setNpcClass} />
        </div>
        <div>
          <div style={lStyle}>Alignment</div>
          <select value={alignment} onChange={e => setAlignment(e.target.value)} style={iStyle}>
            {ALIGNMENTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Form row 2: Level, Background */}
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12 }}>
        <div>
          <div style={lStyle}>Level (1–20)</div>
          <input type="number" min={1} max={20} value={level} onChange={e => setLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} style={iStyle} />
        </div>
        <div>
          <div style={lStyle}>Background</div>
          <select value={background} onChange={e => setBackground(e.target.value)} style={iStyle}>
            {BACKGROUNDS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <button onClick={generate} style={btnPrimary}>✦ Generate NPC</button>
      </div>

      {profile && (
        <div style={{ ...panel, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Header: name with reroll */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(200,149,42,.25)", paddingBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)", fontSize: 13 }}>{profile.name || "Unnamed"}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, color: "rgba(200,149,42,.5)", letterSpacing: 1, marginTop: 3 }}>
                {race} · {npcClass || "Commoner"} · Lvl {level} · {background} · {alignment}
              </div>
            </div>
            <RerollButton onClick={() => rerollField("name")} />
          </div>

          {/* All rerollable fields */}
          {NPC_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ ...lStyle, marginBottom: 0, flex: 1 }}>{label}</div>
                <RerollButton onClick={() => rerollField(key)} />
              </div>
              <div style={{
                fontFamily: "'IM Fell English',serif", fontSize: 13, color: "var(--vel)",
                lineHeight: 1.55, padding: "6px 10px", background: "rgba(0,0,0,.25)",
                borderRadius: 3, border: "1px solid rgba(92,51,23,.25)",
                fontStyle: key === "secretMotivation" || key === "ideal" || key === "bond" ? "italic" : "normal",
              }}>
                {profile[key]}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <button
              onClick={handleSave}
              style={{ ...btnPrimary, background: savedFlash ? "rgba(76,175,80,.85)" : "var(--gold)", color: savedFlash ? "#fff" : "var(--ink)", transition: "background .3s" }}
            >
              {savedFlash ? "✓ Saved to Wiki" : "✦ Save to Wiki"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Encounter Suggester (fully local) ──────────────────────────────────

function EncounterSuggester({ characters }) {
  const detectedLevel = (() => {
    if (!characters || characters.length === 0) return 1;
    const lvls = characters.map(c => c.level || c.details?.level || 1);
    return Math.max(1, Math.round(lvls.reduce((a, b) => a + b, 0) / lvls.length));
  })();

  const [partyLevel, setPartyLevel] = useState(detectedLevel);
  const [partySize,  setPartySize]  = useState(characters?.length || 4);
  const [terrain,    setTerrain]    = useState("Any");
  const [results,    setResults]    = useState([]);

  function generate() {
    setResults(generateLocalEncounters({ terrain, partyLevel, count: 3 }));
  }

  const TERRAIN_COLORS = {
    forest: "#4a7c59", dungeon: "#7c4a4a", urban: "#4a5c7c", mountain: "#6a6a7c",
    coastal: "#4a6a7c", plains: "#7c6a4a", swamp: "#5a7c4a", underdark: "#5a4a7c",
  };

  const band = partyLevel <= 4 ? "1-4" : partyLevel <= 10 ? "5-10" : partyLevel <= 16 ? "11-16" : "17+";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div>
          <div style={lStyle}>
            Party Level
            {characters?.length > 0 && <span style={{ color: "rgba(200,149,42,.5)", marginLeft: 6, textTransform: "none", letterSpacing: 0, fontSize: 8 }}>auto</span>}
          </div>
          <input type="number" min={1} max={20} value={partyLevel} onChange={e => setPartyLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} style={iStyle} />
        </div>
        <div>
          <div style={lStyle}>
            Party Size
            {characters?.length > 0 && <span style={{ color: "rgba(200,149,42,.5)", marginLeft: 6, textTransform: "none", letterSpacing: 0, fontSize: 8 }}>{characters.length} in party</span>}
          </div>
          <input type="number" min={1} max={10} value={partySize} onChange={e => setPartySize(Math.max(1, Math.min(10, parseInt(e.target.value) || 4)))} style={iStyle} />
        </div>
        <div>
          <div style={lStyle}>Terrain</div>
          <select value={terrain} onChange={e => setTerrain(e.target.value)} style={iStyle}>
            {TERRAINS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <button onClick={generate} style={btnPrimary}>✦ Suggest Encounters</button>
      </div>

      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.5, color: "rgba(200,149,42,.5)", textTransform: "uppercase", borderBottom: "1px solid rgba(200,149,42,.15)", paddingBottom: 6 }}>
            {results.length} Encounter Suggestions · Tier {band} · {partySize} Players
          </div>
          {results.map((r, i) => {
            const terrColor = TERRAIN_COLORS[r.terrain] || "#6a6a6a";
            return (
              <div key={i} style={{ ...panel, borderLeft: "3px solid var(--gold)" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 9, color: "rgba(200,149,42,.5)" }}>{i + 1}.</span>
                  <span style={{
                    fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1,
                    background: terrColor + "33", border: `1px solid ${terrColor}88`,
                    color: terrColor, borderRadius: 2, padding: "2px 8px", textTransform: "capitalize",
                  }}>
                    {r.terrain}
                  </span>
                  <span style={{
                    fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1,
                    background: "rgba(200,149,42,.1)", border: "1px solid rgba(200,149,42,.3)",
                    color: "var(--gold)", borderRadius: 2, padding: "2px 8px",
                  }}>
                    Tier {r.band}
                  </span>
                </div>
                <div style={{ fontFamily: "'IM Fell English',serif", fontSize: 13, color: "var(--vel)", lineHeight: 1.6, fontStyle: "italic" }}>
                  {r.encounter}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main AITools ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "npc",        label: "NPC Generator",      icon: "🧙" },
  { id: "encounters", label: "Encounter Suggester", icon: "⚔" },
];

export default function AITools({ characters = [], onSaveToWiki }) {
  const [activeTab, setActiveTab] = useState("npc");

  return (
    <>
      <style>{`@keyframes dm-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid rgba(200,149,42,.25)", marginBottom: 16 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? "rgba(200,149,42,.1)" : "none",
                border: "none",
                borderBottom: activeTab === t.id ? "2px solid var(--gold)" : "2px solid transparent",
                color: activeTab === t.id ? "var(--gold)" : "rgba(200,149,42,.4)",
                cursor: "pointer",
                fontFamily: "'Cinzel',serif",
                fontSize: 9,
                letterSpacing: 1.5,
                padding: "10px 18px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all .15s",
                marginBottom: -2,
                position: "relative",
              }}
              onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.color = "rgba(200,149,42,.75)"; }}
              onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.color = "rgba(200,149,42,.4)"; }}
            >
              <span style={{ fontSize: 13 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ ...panel, minHeight: 320 }}>
{activeTab === "npc" && <NPCGenerator onSaveToWiki={onSaveToWiki} />}
          {activeTab === "encounters" && <EncounterSuggester characters={characters} />}
        </div>
      </div>
    </>
  );
}
