import { useState, useCallback } from "react";
import { genId } from "../../store.js";
import {
  NPC_NAMES,
  LOOT_TABLES,
  RANDOM_ENCOUNTER_TABLES,
  SHOP_INVENTORIES,
} from "../../data/generatorTables.js";

// ─── Pure generation functions ────────────────────────────────────────────────

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple(arr, count) {
  if (arr.length === 0) return [];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Map capitalized UI values to lowercase data keys
const RARITY_KEY = { Any: null, Mundane: "mundane", Uncommon: "uncommon", Rare: "rare", "Very Rare": "veryRare" };

function generateNpcNames({ race, gender }) {
  const raceData = NPC_NAMES[race] || NPC_NAMES["Human"];
  let pool = [];
  if (gender === "Any") {
    pool = [...(raceData.male || []), ...(raceData.female || [])];
  } else {
    pool = raceData[gender.toLowerCase()] || raceData.male || [];
  }
  return pickMultiple(pool, 5);
}

function generateLoot({ crRange, rarity }) {
  const crTable = LOOT_TABLES[crRange] || LOOT_TABLES["0-1"];
  const key = RARITY_KEY[rarity];
  const pool = key ? (crTable[key] || []) : [
    ...(crTable.mundane || []),
    ...(crTable.uncommon || []),
    ...(crTable.rare || []),
    ...(crTable.veryRare || []),
  ];
  if (!pool || pool.length === 0) return [];
  const count = 3 + Math.floor(Math.random() * 3); // 3-5
  return pickMultiple(pool, count);
}

function generateEncounter({ terrain, partyLevel }) {
  const key = terrain.toLowerCase();
  const terrainData = RANDOM_ENCOUNTER_TABLES[key] || RANDOM_ENCOUNTER_TABLES["forest"];
  const pool = terrainData[partyLevel] || terrainData["1-4"];
  if (!pool || pool.length === 0) return null;
  return pickRandom(pool);
}

function generateShopInventory({ shopType }) {
  const key = shopType.toLowerCase().replace(" ", "");
  const shopData = SHOP_INVENTORIES[key] || SHOP_INVENTORIES["general"];
  const pool = shopData.items || shopData || [];
  const count = 6 + Math.floor(Math.random() * 3); // 6-8
  return pickMultiple(pool, count);
}

// ─── Shared style fragments ───────────────────────────────────────────────────

const S = {
  wrap: {
    background: "#1a0800",
    borderRadius: 6,
    border: "1px solid rgba(92,51,23,.45)",
    marginBottom: 18,
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #120400, #1e0a02)",
    borderBottom: "1px solid rgba(200,149,42,.25)",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  headerTitle: {
    fontFamily: "'Cinzel Decorative', serif",
    color: "var(--gold)",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    fontSize: 16,
  },
  body: {
    padding: "12px 14px 14px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  label: {
    fontFamily: "'Cinzel', serif",
    fontSize: 9,
    letterSpacing: 1.5,
    color: "rgba(245,230,200,.5)",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  select: {
    background: "rgba(26,8,0,.8)",
    border: "1px solid rgba(92,51,23,.6)",
    borderRadius: 3,
    color: "var(--vel)",
    fontFamily: "'IM Fell English', Georgia, serif",
    fontSize: 12,
    padding: "4px 8px",
    outline: "none",
    cursor: "pointer",
    minWidth: 120,
  },
  btnGold: {
    background: "var(--gold)",
    border: "none",
    borderRadius: 3,
    color: "#1a0a00",
    fontFamily: "'Cinzel', serif",
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: 700,
    textTransform: "uppercase",
    padding: "6px 14px",
    cursor: "pointer",
    transition: "background .15s",
    whiteSpace: "nowrap",
  },
  btnGhost: {
    background: "transparent",
    border: "1px solid rgba(200,149,42,.4)",
    borderRadius: 3,
    color: "var(--gold)",
    fontFamily: "'Cinzel', serif",
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    padding: "4px 10px",
    cursor: "pointer",
    transition: "all .15s",
    whiteSpace: "nowrap",
  },
  btnDanger: {
    background: "transparent",
    border: "1px solid rgba(139,26,26,.5)",
    borderRadius: 3,
    color: "var(--cr)",
    fontFamily: "'Cinzel', serif",
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    padding: "3px 8px",
    cursor: "pointer",
    transition: "all .15s",
    whiteSpace: "nowrap",
  },
  resultItem: {
    background: "rgba(0,0,0,.25)",
    border: "1px solid rgba(92,51,23,.35)",
    borderRadius: 3,
    padding: "6px 10px",
    marginBottom: 5,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  resultText: {
    fontFamily: "'IM Fell English', Georgia, serif",
    fontSize: 13,
    color: "var(--vel)",
    flex: 1,
  },
  noResults: {
    fontFamily: "'IM Fell English', Georgia, serif",
    fontStyle: "italic",
    fontSize: 12,
    color: "rgba(245,230,200,.3)",
    textAlign: "center",
    padding: "12px 0",
  },
  divider: {
    border: "none",
    borderTop: "1px solid rgba(200,149,42,.15)",
    margin: "10px 0",
  },
  badgeRarity: (rarity) => {
    const colors = {
      Mundane:   { bg: "rgba(92,51,23,.35)",  text: "rgba(245,230,200,.5)" },
      Uncommon:  { bg: "rgba(0,128,0,.2)",    text: "#4caf50" },
      Rare:      { bg: "rgba(0,80,200,.2)",   text: "#5b9cf6" },
      "Very Rare": { bg: "rgba(128,0,200,.2)", text: "#b47ef5" },
      Legendary: { bg: "rgba(200,149,0,.2)",  text: "var(--gl)" },
    };
    const c = colors[rarity] || colors.Mundane;
    return {
      background: c.bg,
      color: c.text,
      fontFamily: "'Cinzel', serif",
      fontSize: 7,
      letterSpacing: 1,
      textTransform: "uppercase",
      padding: "2px 6px",
      borderRadius: 2,
      whiteSpace: "nowrap",
      flexShrink: 0,
    };
  },
};

function GoldHover({ children, style, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{ ...style, background: hover ? "var(--gl)" : style?.background }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  );
}

function GhostHover({ children, style, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{
        ...style,
        borderColor: hover ? "var(--gold)" : style?.borderColor || "rgba(200,149,42,.4)",
        color: hover ? "var(--gl)" : style?.color || "var(--gold)",
        background: hover ? "rgba(200,149,42,.08)" : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  );
}

function DangerHover({ children, style, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{
        ...style,
        borderColor: hover ? "var(--cr)" : "rgba(139,26,26,.5)",
        color: hover ? "var(--crl)" : "var(--cr)",
        background: hover ? "rgba(139,26,26,.1)" : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title }) {
  return (
    <div style={S.header}>
      <div style={S.headerTitle}>
        <span style={S.headerIcon}>{icon}</span>
        {title}
      </div>
    </div>
  );
}

// ─── NPC Name Generator ───────────────────────────────────────────────────────

const RACES = ["Human","Elf","Dwarf","Halfling","Gnome","Half-Orc","Tiefling","Dragonborn","Half-Elf"];
const GENDERS = ["Any","Male","Female"];

function NpcNameGenerator({ onSaveNote }) {
  const [race, setRace] = useState("Human");
  const [gender, setGender] = useState("Any");
  const [names, setNames] = useState([]);
  const [generated, setGenerated] = useState(false);

  function generate() {
    setNames(generateNpcNames({ race, gender }));
    setGenerated(true);
  }

  function saveNameToNotes(name) {
    onSaveNote({
      id: genId(),
      text: `NPC Name [${race}, ${gender}]: ${name}`,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div style={S.wrap}>
      <SectionHeader icon="👤" title="NPC Name Generator" />
      <div style={S.body}>
        <div style={S.row}>
          <div>
            <div style={S.label}>Race</div>
            <select style={S.select} value={race} onChange={e => setRace(e.target.value)}>
              {RACES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <div style={S.label}>Gender</div>
            <select style={S.select} value={gender} onChange={e => setGender(e.target.value)}>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", paddingBottom:1 }}>
            <GoldHover style={S.btnGold} onClick={generate}>Generate Names</GoldHover>
            {generated && (
              <GhostHover style={S.btnGhost} onClick={generate} title="Reroll">
                🎲 Reroll
              </GhostHover>
            )}
          </div>
        </div>

        {names.length > 0 && (
          <>
            <hr style={S.divider} />
            {names.map((name, i) => (
              <div key={i} style={S.resultItem}>
                <span style={S.resultText}>{name}</span>
                <GhostHover style={S.btnGhost} onClick={() => saveNameToNotes(name)}>
                  ✦ Save
                </GhostHover>
              </div>
            ))}
          </>
        )}
        {generated && names.length === 0 && (
          <p style={S.noResults}>No names found for these filters.</p>
        )}
      </div>
    </div>
  );
}

// ─── Loot Generator ───────────────────────────────────────────────────────────

const CR_RANGES = ["0-1","2-4","5-8","9-12","13-16","17+"];
const RARITIES = ["Any","Mundane","Uncommon","Rare","Very Rare"];

function LootGenerator({ onSaveNote }) {
  const [crRange, setCrRange] = useState("0-1");
  const [rarity, setRarity] = useState("Any");
  const [items, setItems] = useState([]);
  const [generated, setGenerated] = useState(false);

  function generate() {
    setItems(generateLoot({ crRange, rarity }));
    setGenerated(true);
  }

  function saveItemToNotes(item) {
    onSaveNote({
      id: genId(),
      text: `Loot [CR ${crRange}]: ${item.name}${item.rarity !== "Any" ? ` (${item.rarity})` : ""}`,
      createdAt: new Date().toISOString(),
    });
  }

  function saveAllToNotes() {
    items.forEach(item => saveItemToNotes(item));
  }

  return (
    <div style={S.wrap}>
      <SectionHeader icon="💰" title="Loot Generator" />
      <div style={S.body}>
        <div style={S.row}>
          <div>
            <div style={S.label}>CR Range</div>
            <select style={S.select} value={crRange} onChange={e => setCrRange(e.target.value)}>
              {CR_RANGES.map(r => <option key={r} value={r}>CR {r}</option>)}
            </select>
          </div>
          <div>
            <div style={S.label}>Rarity</div>
            <select style={S.select} value={rarity} onChange={e => setRarity(e.target.value)}>
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", paddingBottom:1 }}>
            <GoldHover style={S.btnGold} onClick={generate}>Roll Loot</GoldHover>
            {generated && (
              <GhostHover style={S.btnGhost} onClick={generate} title="Reroll">
                🎲 Reroll
              </GhostHover>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <>
            <hr style={S.divider} />
            {items.map((item, i) => (
              <div key={i} style={S.resultItem}>
                <span style={S.resultText}>{item.name}</span>
                {item.rarity && (
                  <span style={S.badgeRarity(item.rarity)}>{item.rarity}</span>
                )}
                <GhostHover style={S.btnGhost} onClick={() => saveItemToNotes(item)}>
                  ✦ Save
                </GhostHover>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
              <GhostHover style={S.btnGhost} onClick={saveAllToNotes}>
                ✦ Save All to Notes
              </GhostHover>
            </div>
          </>
        )}
        {generated && items.length === 0 && (
          <p style={S.noResults}>No loot found for these filters.</p>
        )}
      </div>
    </div>
  );
}

// ─── Random Encounter Generator ───────────────────────────────────────────────

const TERRAINS = ["Forest","Dungeon","Urban","Mountain","Coastal","Plains","Swamp","Underdark"];
const PARTY_LEVELS = ["1-4","5-10","11-16","17+"];

function EncounterGenerator({ onSaveNote }) {
  const [terrain, setTerrain] = useState("Forest");
  const [partyLevel, setPartyLevel] = useState("1-4");
  const [encounter, setEncounter] = useState(null);
  const [generated, setGenerated] = useState(false);

  function generate() {
    setEncounter(generateEncounter({ terrain, partyLevel }));
    setGenerated(true);
  }

  function saveToNotes() {
    if (!encounter) return;
    onSaveNote({
      id: genId(),
      text: `Encounter [${terrain}, Level ${partyLevel}]: ${encounter}`,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div style={S.wrap}>
      <SectionHeader icon="⚔" title="Random Encounter Generator" />
      <div style={S.body}>
        <div style={S.row}>
          <div>
            <div style={S.label}>Terrain</div>
            <select style={S.select} value={terrain} onChange={e => setTerrain(e.target.value)}>
              {TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div style={S.label}>Party Level</div>
            <select style={S.select} value={partyLevel} onChange={e => setPartyLevel(e.target.value)}>
              {PARTY_LEVELS.map(l => <option key={l} value={l}>Level {l}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", paddingBottom:1 }}>
            <GoldHover style={S.btnGold} onClick={generate}>Generate Encounter</GoldHover>
            {generated && (
              <GhostHover style={S.btnGhost} onClick={generate} title="Reroll">
                🎲 Reroll
              </GhostHover>
            )}
          </div>
        </div>

        {encounter && (
          <>
            <hr style={S.divider} />
            <div style={{
              ...S.resultItem,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
              borderColor: "rgba(200,149,42,.25)",
              background: "rgba(200,149,42,.05)",
            }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 8,
                letterSpacing: 1.5,
                color: "rgba(200,149,42,.5)",
                textTransform: "uppercase",
              }}>
                {terrain} · Level {partyLevel}
              </div>
              <p style={{ ...S.resultText, lineHeight: 1.5 }}>{encounter}</p>
              <GhostHover style={S.btnGhost} onClick={saveToNotes}>
                ✦ Save to Notes
              </GhostHover>
            </div>
          </>
        )}
        {generated && !encounter && (
          <p style={S.noResults}>No encounter found for these filters.</p>
        )}
      </div>
    </div>
  );
}

// ─── Shop Inventory Generator ─────────────────────────────────────────────────

const SHOP_TYPES = ["General","Weapons","Armor","Potions","Magic","Black Market","Food"];

function ShopInventoryGenerator({ onSaveNote }) {
  const [shopType, setShopType] = useState("General");
  const [inventory, setInventory] = useState([]);
  const [generated, setGenerated] = useState(false);

  function generate() {
    setInventory(generateShopInventory({ shopType }));
    setGenerated(true);
  }

  function saveItemToNotes(item) {
    onSaveNote({
      id: genId(),
      text: `Shop Item [${shopType}]: ${item}`,
      createdAt: new Date().toISOString(),
    });
  }

  function saveAllToNotes() {
    inventory.forEach(item => saveItemToNotes(item));
  }

  return (
    <div style={S.wrap}>
      <SectionHeader icon="🏪" title="Shop Inventory Generator" />
      <div style={S.body}>
        <div style={S.row}>
          <div>
            <div style={S.label}>Shop Type</div>
            <select style={S.select} value={shopType} onChange={e => setShopType(e.target.value)}>
              {SHOP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", paddingBottom:1 }}>
            <GoldHover style={S.btnGold} onClick={generate}>Generate Inventory</GoldHover>
            {generated && (
              <GhostHover style={S.btnGhost} onClick={generate} title="Reroll">
                🎲 Reroll
              </GhostHover>
            )}
          </div>
        </div>

        {inventory.length > 0 && (
          <>
            <hr style={S.divider} />
            {inventory.map((item, i) => (
              <div key={i} style={S.resultItem}>
                <span style={S.resultText}>{item}</span>
                <GhostHover style={S.btnGhost} onClick={() => saveItemToNotes(item)}>
                  ✦ Save
                </GhostHover>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
              <GhostHover style={S.btnGhost} onClick={saveAllToNotes}>
                ✦ Save All to Notes
              </GhostHover>
            </div>
          </>
        )}
        {generated && inventory.length === 0 && (
          <p style={S.noResults}>No inventory available for this shop type.</p>
        )}
      </div>
    </div>
  );
}

// ─── Notes Scratchpad ─────────────────────────────────────────────────────────

function NotesScratchpad({ notes, onDeleteNote }) {
  const sorted = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
        " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }

  return (
    <div style={{ ...S.wrap, marginBottom: 0 }}>
      <div style={S.header}>
        <div style={S.headerTitle}>
          <span style={S.headerIcon}>📜</span>
          Notes Scratchpad
        </div>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 9,
          color: "rgba(200,149,42,.4)",
          letterSpacing: 1,
        }}>
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </div>
      </div>
      <div style={S.body}>
        {sorted.length === 0 && (
          <p style={S.noResults}>
            No notes yet. Use ✦ Save buttons above to add notes here.
          </p>
        )}
        {sorted.map(note => (
          <div key={note.id} style={{
            ...S.resultItem,
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 4,
          }}>
            <p style={{ ...S.resultText, lineHeight: 1.5, wordBreak: "break-word" }}>
              {note.text}
            </p>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%", alignItems:"center" }}>
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 8,
                color: "rgba(245,230,200,.25)",
                letterSpacing: .5,
              }}>
                {formatDate(note.createdAt)}
              </span>
              <DangerHover style={S.btnDanger} onClick={() => onDeleteNote(note.id)}>
                🗑 Delete
              </DangerHover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Generators Component ────────────────────────────────────────────────

export default function Generators({ generatorNotes, onSaveNote, onDeleteNote }) {
  const handleSaveNote = useCallback((note) => {
    onSaveNote(note);
  }, [onSaveNote]);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Page title */}
      <div style={{
        fontFamily: "'Cinzel Decorative', serif",
        color: "var(--gold)",
        fontSize: 13,
        letterSpacing: 3,
        textTransform: "uppercase",
        textAlign: "center",
        padding: "4px 0 18px",
        textShadow: "0 0 20px rgba(200,149,42,.4)",
      }}>
        ✦ Generators ✦
      </div>

      <NpcNameGenerator onSaveNote={handleSaveNote} />
      <LootGenerator onSaveNote={handleSaveNote} />
      <EncounterGenerator onSaveNote={handleSaveNote} />
      <ShopInventoryGenerator onSaveNote={handleSaveNote} />

      <NotesScratchpad notes={generatorNotes || []} onDeleteNote={onDeleteNote} />
    </div>
  );
}
