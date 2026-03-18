import { useState, useMemo, useCallback } from "react";
import { MONSTERS, CR_XP } from "../../data/monsters.js";
import { genId } from "../../store.js";

// ── CR helpers ────────────────────────────────────────────────────────────────
const CR_ORDER = ["0","1/8","1/4","1/2","1","2","3","4","5","6","7","8","9","10",
  "11","12","13","14","15","16","17","18","19","20","21","22","23","24","30"];

function crNum(cr) {
  if (cr === "1/8") return 0.125;
  if (cr === "1/4") return 0.25;
  if (cr === "1/2") return 0.5;
  return parseFloat(cr) || 0;
}

// ── XP budget tables (2024 PHB) ───────────────────────────────────────────────
const XP_THRESHOLDS = {
  1:[25,50,75,100], 2:[50,100,150,200], 3:[75,150,225,400],
  4:[125,250,375,500], 5:[250,500,750,1100], 6:[300,600,900,1400],
  7:[350,750,1100,1700], 8:[450,900,1400,2100], 9:[550,1100,1600,2400],
  10:[600,1200,1900,2800], 11:[800,1600,2400,3600], 12:[1000,2000,3000,4500],
  13:[1100,2200,3400,5100], 14:[1250,2500,3800,5700], 15:[1400,2800,4300,6400],
  16:[1600,3200,4800,7200], 17:[2000,3900,5900,8800], 18:[2100,4200,6300,9500],
  19:[2400,4900,7300,10900], 20:[2800,5700,8500,12700],
};

function getMultiplier(count) {
  if (count <= 1) return 1;
  if (count === 2) return 1.5;
  if (count <= 6) return 2;
  if (count <= 10) return 2.5;
  if (count <= 14) return 3;
  return 4;
}

function calcDifficulty(partyLevels, totalRawXP, totalCount) {
  if (partyLevels.length === 0 || totalRawXP === 0) return null;

  // Sum thresholds across all party members
  const thresholds = [0, 0, 0, 0]; // easy, medium, hard, deadly
  for (const lvl of partyLevels) {
    const t = XP_THRESHOLDS[Math.max(1, Math.min(20, lvl))] || XP_THRESHOLDS[1];
    thresholds[0] += t[0];
    thresholds[1] += t[1];
    thresholds[2] += t[2];
    thresholds[3] += t[3];
  }

  const multiplier = getMultiplier(totalCount);
  const adjustedXP = Math.round(totalRawXP * multiplier);

  let label, color;
  if (adjustedXP < thresholds[0]) { label = "Trivial"; color = "#6aaf6a"; }
  else if (adjustedXP < thresholds[1]) { label = "Easy"; color = "#4caf50"; }
  else if (adjustedXP < thresholds[2]) { label = "Medium"; color = "#e8c94b"; }
  else if (adjustedXP < thresholds[3]) { label = "Hard"; color = "#e8894b"; }
  else if (adjustedXP < thresholds[3] * 2) { label = "Deadly"; color = "#e84b4b"; }
  else { label = "Beyond Deadly"; color = "#8b1a1a"; }

  return { adjustedXP, multiplier, thresholds, label, color };
}

// ── Shared input style ────────────────────────────────────────────────────────
const iStyle = {
  background: "rgba(245,230,200,.05)",
  border: "1px solid rgba(92,51,23,.4)",
  borderRadius: 3,
  color: "var(--vel)",
  fontFamily: "'IM Fell English',serif",
  fontSize: 12,
  padding: "4px 9px",
  outline: "none",
};

const lStyle = {
  fontFamily: "'Cinzel',serif",
  fontSize: 8,
  letterSpacing: 1.5,
  color: "var(--br)",
  textTransform: "uppercase",
  marginBottom: 3,
};

// ── Monster search panel ──────────────────────────────────────────────────────
function MonsterSearchPanel({ allMonsters, onAdd }) {
  const [search, setSearch] = useState("");
  const [filterCR, setFilterCR] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allMonsters
      .filter(m => {
        if (q && !m.name.toLowerCase().includes(q)) return false;
        if (filterCR && m.cr !== filterCR) return false;
        return true;
      })
      .sort((a, b) => crNum(a.cr) - crNum(b.cr) || a.name.localeCompare(b.name))
      .slice(0, 80);
  }, [allMonsters, search, filterCR]);

  return (
    <div style={{ background: "#120600", border: "1px solid rgba(92,51,23,.4)", borderRadius: 4, display: "flex", flexDirection: "column", gap: 8, padding: 12, minWidth: 260, flex: 1 }}>
      <div style={{ fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)", fontSize: 11, letterSpacing: 1, borderBottom: "1px solid rgba(200,149,42,.2)", paddingBottom: 8, marginBottom: 2 }}>
        Monster Library
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <input
          style={{ ...iStyle, flex: 1, minWidth: 100 }}
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={{ ...iStyle, minWidth: 80 }}
          value={filterCR}
          onChange={e => setFilterCR(e.target.value)}
        >
          <option value="">All CR</option>
          {CR_ORDER.map(cr => <option key={cr} value={cr}>CR {cr}</option>)}
        </select>
      </div>

      {/* Results */}
      <div style={{ overflowY: "auto", maxHeight: 340, display: "flex", flexDirection: "column", gap: 2 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 12px", color: "rgba(245,230,200,.25)", fontStyle: "italic", fontFamily: "'IM Fell English',serif", fontSize: 12 }}>
            No monsters found.
          </div>
        )}
        {filtered.map(m => (
          <div
            key={m.id}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px",
              background: "rgba(26,10,2,.5)", border: "1px solid rgba(92,51,23,.3)",
              borderLeft: `3px solid ${m.source === "Custom" ? "var(--gold)" : "rgba(139,26,26,.45)"}`,
              borderRadius: 3, cursor: "pointer", transition: "all .13s" }}
            onClick={() => onAdd(m)}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(200,149,42,.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(26,10,2,.5)"}
          >
            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 9, color: "var(--gold)",
              width: 32, textAlign: "center", background: "rgba(200,149,42,.1)", borderRadius: 3, padding: "2px 0", flexShrink: 0 }}>
              {m.cr}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, color: "var(--vel)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m.name}
              </div>
              <div style={{ fontSize: 9, color: "rgba(245,230,200,.35)", fontFamily: "'IM Fell English',serif" }}>
                {(CR_XP[m.cr] || 0).toLocaleString()} XP
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onAdd(m); }}
              style={{ background: "rgba(200,149,42,.15)", border: "1px solid rgba(200,149,42,.4)",
                color: "var(--gold)", borderRadius: 3, cursor: "pointer", fontSize: 11,
                padding: "1px 7px", fontFamily: "'Cinzel',serif", flexShrink: 0 }}
              title="Add to encounter"
            >
              +
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 80 && (
        <div style={{ fontSize: 9, color: "rgba(245,230,200,.3)", textAlign: "center", fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>
          Showing first 80 results — refine your search
        </div>
      )}
    </div>
  );
}

// ── Encounter roster row ──────────────────────────────────────────────────────
function RosterRow({ entry, onQtyChange, onRemove }) {
  const xpEach = CR_XP[entry.monster.cr] || 0;
  const totalXP = xpEach * entry.quantity;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8,
      background: "rgba(26,10,2,.55)", border: "1px solid rgba(92,51,23,.35)",
      borderLeft: `3px solid ${entry.monster.source === "Custom" ? "var(--gold)" : "rgba(139,26,26,.45)"}`,
      borderRadius: 3, padding: "6px 10px", transition: "all .13s" }}>

      {/* CR badge */}
      <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 9, color: "var(--gold)",
        width: 32, textAlign: "center", background: "rgba(200,149,42,.1)", borderRadius: 3, padding: "2px 0", flexShrink: 0 }}>
        {entry.monster.cr}
      </div>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, color: "var(--vel)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {entry.monster.name}
        </div>
        <div style={{ fontSize: 9, color: "rgba(245,230,200,.4)", fontFamily: "'IM Fell English',serif" }}>
          {xpEach.toLocaleString()} XP each · {totalXP.toLocaleString()} XP total
        </div>
      </div>

      {/* Quantity controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <button
          onClick={() => onQtyChange(Math.max(1, entry.quantity - 1))}
          style={{ width: 22, height: 22, background: "rgba(200,149,42,.1)", border: "1px solid rgba(200,149,42,.3)",
            borderRadius: 3, color: "var(--gold)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
        >−</button>
        <input
          type="number"
          min={1}
          max={99}
          value={entry.quantity}
          onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1) onQtyChange(v); }}
          style={{ width: 36, textAlign: "center", background: "rgba(245,230,200,.06)", border: "1px solid rgba(92,51,23,.4)",
            borderRadius: 3, color: "var(--gold)", fontFamily: "'Cinzel',serif", fontSize: 12, padding: "1px 0", outline: "none" }}
        />
        <button
          onClick={() => onQtyChange(entry.quantity + 1)}
          style={{ width: 22, height: 22, background: "rgba(200,149,42,.1)", border: "1px solid rgba(200,149,42,.3)",
            borderRadius: 3, color: "var(--gold)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
        >+</button>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        style={{ background: "none", border: "1px solid rgba(139,26,26,.4)", borderRadius: 3,
          color: "var(--cr)", cursor: "pointer", fontSize: 10, padding: "1px 6px", fontFamily: "'Cinzel',serif", flexShrink: 0 }}
        title="Remove from encounter"
      >✕</button>
    </div>
  );
}

// ── XP Budget display ─────────────────────────────────────────────────────────
function XPBudgetDisplay({ roster, partyLevels }) {
  const totalCount = roster.reduce((s, e) => s + e.quantity, 0);
  const totalRawXP = roster.reduce((s, e) => s + (CR_XP[e.monster.cr] || 0) * e.quantity, 0);
  const diff = useMemo(() => calcDifficulty(partyLevels, totalRawXP, totalCount), [partyLevels, totalRawXP, totalCount]);

  if (roster.length === 0) return null;

  const multiplier = getMultiplier(totalCount);

  return (
    <div style={{ background: "rgba(26,10,2,.7)", border: "1px solid rgba(92,51,23,.4)", borderRadius: 4, padding: "10px 14px" }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.5, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>
        XP Budget
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <div style={lStyle}>Monster XP</div>
          <div style={{ fontFamily: "'Cinzel Decorative',serif", color: "var(--vel)", fontSize: 16 }}>
            {totalRawXP.toLocaleString()}
          </div>
        </div>

        <div style={{ color: "rgba(245,230,200,.4)", fontSize: 14, paddingBottom: 2 }}>×</div>

        <div>
          <div style={lStyle}>Multiplier</div>
          <div style={{ fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)", fontSize: 16 }}>
            {multiplier}
          </div>
          <div style={{ fontSize: 8, color: "rgba(245,230,200,.3)", fontFamily: "'Cinzel',serif" }}>
            {totalCount} monster{totalCount !== 1 ? "s" : ""}
          </div>
        </div>

        <div style={{ color: "rgba(245,230,200,.4)", fontSize: 14, paddingBottom: 2 }}>=</div>

        <div>
          <div style={lStyle}>Adjusted XP</div>
          <div style={{ fontFamily: "'Cinzel Decorative',serif", color: diff?.color || "var(--vel)", fontSize: 18 }}>
            {diff ? diff.adjustedXP.toLocaleString() : "—"}
          </div>
        </div>

        {diff && (
          <div style={{ marginLeft: "auto" }}>
            <div style={lStyle}>Difficulty</div>
            <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 18, color: diff.color,
              textShadow: `0 0 12px ${diff.color}66` }}>
              {diff.label}
            </div>
          </div>
        )}
      </div>

      {/* Threshold bars */}
      {diff && partyLevels.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", gap: 6, fontSize: 8, fontFamily: "'Cinzel',serif", letterSpacing: 0.5, marginBottom: 4 }}>
            {["Easy", "Medium", "Hard", "Deadly"].map((label, i) => (
              <div key={label} style={{ flex: 1, textAlign: "center", color: ["#4caf50","#e8c94b","#e8894b","#e84b4b"][i], opacity: 0.7 }}>
                {label}<br/>
                <span style={{ color: "rgba(245,230,200,.4)", fontFamily: "'IM Fell English',serif", fontSize: 9 }}>
                  {diff.thresholds[i].toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div style={{ position: "relative", height: 6, background: "linear-gradient(to right, #4caf5055, #e8c94b55, #e8894b55, #e84b4b55)", borderRadius: 3, overflow: "hidden" }}>
            {diff.adjustedXP > 0 && (
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%",
                width: `${Math.min(100, (diff.adjustedXP / (diff.thresholds[3] * 2)) * 100)}%`,
                background: diff.color, borderRadius: 3, transition: "width .3s",
                opacity: 0.85,
              }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Party info panel ──────────────────────────────────────────────────────────
function PartyPanel({ characters, manualLevels, manualSize, onManualLevels, onManualSize }) {
  const hasChars = characters && characters.length > 0;

  if (hasChars) {
    return (
      <div style={{ background: "rgba(26,10,2,.6)", border: "1px solid rgba(92,51,23,.4)", borderRadius: 4, padding: "10px 14px" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.5, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>
          Party ({characters.length} characters)
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {characters.map(c => (
            <div key={c.id} style={{ background: "rgba(75,158,232,.1)", border: "1px solid rgba(75,158,232,.3)",
              borderRadius: 3, padding: "3px 9px", fontFamily: "'Cinzel',serif", fontSize: 10, color: "#88bbff" }}>
              {c.name || "Unnamed"} <span style={{ color: "rgba(136,187,255,.6)", fontSize: 9 }}>Lv{c.level || 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "rgba(26,10,2,.6)", border: "1px solid rgba(92,51,23,.4)", borderRadius: 4, padding: "10px 14px" }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.5, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>
        Party (Manual Override)
      </div>
      <div style={{ fontSize: 9, color: "rgba(245,230,200,.35)", fontFamily: "'IM Fell English',serif", fontStyle: "italic", marginBottom: 10 }}>
        No characters found. Set party manually below.
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <div style={lStyle}>Party Size</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => onManualSize(Math.max(1, manualSize - 1))}
              style={{ width: 22, height: 22, background: "rgba(200,149,42,.1)", border: "1px solid rgba(200,149,42,.3)", borderRadius: 3, color: "var(--gold)", cursor: "pointer", fontSize: 13 }}>−</button>
            <span style={{ fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)", fontSize: 18, minWidth: 24, textAlign: "center" }}>{manualSize}</span>
            <button onClick={() => onManualSize(Math.min(8, manualSize + 1))}
              style={{ width: 22, height: 22, background: "rgba(200,149,42,.1)", border: "1px solid rgba(200,149,42,.3)", borderRadius: 3, color: "var(--gold)", cursor: "pointer", fontSize: 13 }}>+</button>
          </div>
        </div>
        <div>
          <div style={lStyle}>Average Level</div>
          <input
            type="number" min={1} max={20} value={manualLevels}
            onChange={e => { const v = Math.max(1, Math.min(20, parseInt(e.target.value) || 1)); onManualLevels(v); }}
            style={{ ...iStyle, width: 60, textAlign: "center" }}
          />
        </div>
        <div style={{ fontSize: 9, color: "rgba(245,230,200,.4)", fontFamily: "'Cinzel',serif" }}>
          {manualSize} × Level {manualLevels}
        </div>
      </div>
    </div>
  );
}

// ── Saved encounters list ─────────────────────────────────────────────────────
function SavedEncountersList({ savedEncounters, allMonsters, onLoad, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (!savedEncounters || savedEncounters.length === 0) {
    return (
      <div style={{ fontSize: 10, color: "rgba(245,230,200,.25)", fontStyle: "italic", fontFamily: "'IM Fell English',serif", padding: "10px 0" }}>
        No saved encounters yet.
      </div>
    );
  }

  function monsterLabel(enc) {
    if (!enc.monsters || enc.monsters.length === 0) return "Empty";
    return enc.monsters.map(e => {
      const m = allMonsters.find(x => x.id === e.monsterId);
      const name = m ? m.name : "Unknown";
      return e.quantity > 1 ? `${e.quantity}× ${name}` : name;
    }).join(", ");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {savedEncounters.map(enc => (
        <div key={enc.id} style={{ display: "flex", alignItems: "center", gap: 8,
          background: "rgba(26,10,2,.6)", border: "1px solid rgba(92,51,23,.35)",
          borderRadius: 3, padding: "7px 10px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, color: "var(--vel)" }}>{enc.name}</div>
            <div style={{ fontSize: 9, color: "rgba(245,230,200,.35)", fontFamily: "'IM Fell English',serif",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {monsterLabel(enc)}
            </div>
          </div>
          <button
            onClick={() => onLoad(enc)}
            style={{ background: "rgba(200,149,42,.15)", border: "1px solid rgba(200,149,42,.4)",
              color: "var(--gold)", borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
              fontSize: 9, padding: "3px 10px", letterSpacing: 0.5, flexShrink: 0 }}
          >Load</button>
          {confirmDelete === enc.id ? (
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <button onClick={() => { onDelete(enc.id); setConfirmDelete(null); }}
                style={{ background: "rgba(139,26,26,.3)", border: "1px solid rgba(139,26,26,.5)",
                  color: "#ff8888", borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
                  fontSize: 9, padding: "3px 8px" }}>Confirm</button>
              <button onClick={() => setConfirmDelete(null)}
                style={{ background: "none", border: "1px solid rgba(92,51,23,.4)",
                  color: "var(--br)", borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
                  fontSize: 9, padding: "3px 8px" }}>Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(enc.id)}
              style={{ background: "none", border: "1px solid rgba(139,26,26,.35)",
                color: "var(--cr)", borderRadius: 3, cursor: "pointer", fontSize: 10,
                padding: "2px 7px", flexShrink: 0 }}
            >✕</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main EncounterBuilder ─────────────────────────────────────────────────────
export default function EncounterBuilder({
  characters = [],
  customMonsters = [],
  savedEncounters = [],
  onSaveEncounter,
  onDeleteEncounter,
  onSendToInitiative,
}) {
  // Roster: [{ rosterId, monsterId, quantity, monster }]
  const [roster, setRoster] = useState([]);
  const [manualLevel, setManualLevel] = useState(1);
  const [manualSize, setManualSize] = useState(4);
  const [showSaved, setShowSaved] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Combine SRD + custom monsters
  const allMonsters = useMemo(() => [...MONSTERS, ...customMonsters], [customMonsters]);

  // Determine party levels
  const partyLevels = useMemo(() => {
    if (characters && characters.length > 0) {
      return characters.map(c => Math.max(1, Math.min(20, c.level || 1)));
    }
    return Array(manualSize).fill(manualLevel);
  }, [characters, manualLevel, manualSize]);

  // Add monster to roster (increment qty if already present)
  const addMonster = useCallback((monster) => {
    setRoster(prev => {
      const existing = prev.find(e => e.monsterId === monster.id);
      if (existing) {
        return prev.map(e => e.monsterId === monster.id ? { ...e, quantity: e.quantity + 1 } : e);
      }
      return [...prev, { rosterId: genId(), monsterId: monster.id, quantity: 1, monster }];
    });
  }, []);

  const updateQty = useCallback((rosterId, qty) => {
    setRoster(prev => prev.map(e => e.rosterId === rosterId ? { ...e, quantity: qty } : e));
  }, []);

  const removeEntry = useCallback((rosterId) => {
    setRoster(prev => prev.filter(e => e.rosterId !== rosterId));
  }, []);

  const clearRoster = useCallback(() => {
    if (roster.length === 0) return;
    if (!confirm("Clear the current encounter?")) return;
    setRoster([]);
  }, [roster]);

  // Save encounter
  function handleSave() {
    const name = saveName.trim();
    if (!name) return;
    const encounter = {
      id: genId(),
      name,
      monsters: roster.map(e => ({ monsterId: e.monsterId, quantity: e.quantity })),
    };
    onSaveEncounter?.(encounter);
    setSaveName("");
    setShowSaveInput(false);
  }

  // Load encounter
  function handleLoad(enc) {
    const newRoster = (enc.monsters || []).reduce((acc, entry) => {
      const monster = allMonsters.find(m => m.id === entry.monsterId);
      if (!monster) return acc;
      return [...acc, { rosterId: genId(), monsterId: entry.monsterId, quantity: entry.quantity, monster }];
    }, []);
    setRoster(newRoster);
    setShowSaved(false);
  }

  // Send to initiative
  function handleSendToInitiative() {
    if (roster.length === 0) return;
    const payload = roster.map(e => ({
      monsterId: e.monsterId,
      quantity: e.quantity,
      monster: e.monster,
    }));
    onSendToInitiative?.(payload);
  }

  const totalCount = roster.reduce((s, e) => s + e.quantity, 0);
  const totalRawXP = roster.reduce((s, e) => s + (CR_XP[e.monster.cr] || 0) * e.quantity, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Top: Party + XP Budget */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <PartyPanel
            characters={characters}
            manualLevels={manualLevel}
            manualSize={manualSize}
            onManualLevels={setManualLevel}
            onManualSize={setManualSize}
          />
        </div>
        <div style={{ flex: 1.4, minWidth: 300 }}>
          <XPBudgetDisplay roster={roster} partyLevels={partyLevels} />
        </div>
      </div>

      {/* Middle: Monster search + Roster side by side */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* Monster search */}
        <MonsterSearchPanel allMonsters={allMonsters} onAdd={addMonster} />

        {/* Encounter Roster */}
        <div style={{ flex: 1.2, minWidth: 280, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Roster header */}
          <div style={{ background: "#120600", border: "1px solid rgba(92,51,23,.4)", borderRadius: 4, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)", fontSize: 11, letterSpacing: 1, flex: 1 }}>
                Encounter Roster
                {totalCount > 0 && (
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: 9, color: "rgba(200,149,42,.6)", marginLeft: 8 }}>
                    {totalCount} creature{totalCount !== 1 ? "s" : ""} · {totalRawXP.toLocaleString()} XP
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {roster.length > 0 && (
                  <>
                    <button
                      onClick={clearRoster}
                      style={{ background: "none", border: "1px solid rgba(92,51,23,.4)", color: "var(--br)",
                        borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: 9, padding: "4px 10px" }}
                    >✕ Clear</button>
                    <button
                      onClick={() => { setShowSaveInput(v => !v); setSaveName(""); }}
                      style={{ background: "rgba(200,149,42,.1)", border: "1px solid rgba(200,149,42,.4)",
                        color: "var(--gold)", borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
                        fontSize: 9, padding: "4px 10px", letterSpacing: 0.5 }}
                    >✦ Save</button>
                    {onSendToInitiative && (
                      <button
                        onClick={handleSendToInitiative}
                        style={{ background: "var(--gold)", border: "none", color: "var(--ink)",
                          borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
                          fontSize: 9, padding: "4px 12px", fontWeight: 700, letterSpacing: 0.5 }}
                      >⚔ Send to Initiative</button>
                    )}
                  </>
                )}
                <button
                  onClick={() => setShowSaved(v => !v)}
                  style={{ background: showSaved ? "rgba(200,149,42,.15)" : "none",
                    border: "1px solid rgba(200,149,42,.35)", color: "var(--gold)",
                    borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
                    fontSize: 9, padding: "4px 10px" }}
                >
                  {showSaved ? "▲ Hide" : "▼ Saved"} ({savedEncounters.length})
                </button>
              </div>
            </div>

            {/* Save name input */}
            {showSaveInput && (
              <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center" }}>
                <input
                  autoFocus
                  placeholder="Encounter name…"
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setShowSaveInput(false); }}
                  style={{ ...iStyle, flex: 1 }}
                />
                <button onClick={handleSave} disabled={!saveName.trim()}
                  style={{ background: saveName.trim() ? "var(--gold)" : "rgba(200,149,42,.2)", border: "none",
                    color: saveName.trim() ? "var(--ink)" : "rgba(200,149,42,.4)", borderRadius: 3,
                    cursor: saveName.trim() ? "pointer" : "not-allowed", fontFamily: "'Cinzel',serif",
                    fontSize: 9, padding: "5px 14px", fontWeight: 700 }}>
                  Save
                </button>
                <button onClick={() => setShowSaveInput(false)}
                  style={{ background: "none", border: "1px solid rgba(92,51,23,.4)", color: "var(--br)",
                    borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: 9, padding: "5px 10px" }}>
                  Cancel
                </button>
              </div>
            )}

            {/* Saved encounters list */}
            {showSaved && (
              <div style={{ marginBottom: 12, borderBottom: "1px solid rgba(92,51,23,.3)", paddingBottom: 12 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.5, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>
                  Saved Encounters
                </div>
                <SavedEncountersList
                  savedEncounters={savedEncounters}
                  allMonsters={allMonsters}
                  onLoad={handleLoad}
                  onDelete={onDeleteEncounter}
                />
              </div>
            )}

            {/* Roster entries */}
            {roster.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 16px", color: "rgba(245,230,200,.2)",
                fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: 13,
                border: "1px dashed rgba(92,51,23,.25)", borderRadius: 4 }}>
                Add monsters from the library to build your encounter.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {roster.map(entry => (
                  <RosterRow
                    key={entry.rosterId}
                    entry={entry}
                    onQtyChange={qty => updateQty(entry.rosterId, qty)}
                    onRemove={() => removeEntry(entry.rosterId)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Multiplier reference */}
          {roster.length > 0 && (
            <div style={{ background: "rgba(26,10,2,.5)", border: "1px solid rgba(92,51,23,.3)",
              borderRadius: 4, padding: "8px 12px" }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 8, letterSpacing: 1.5, color: "rgba(200,149,42,.5)", textTransform: "uppercase", marginBottom: 6 }}>
                Count Multipliers
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["1","×1"],["2","×1.5"],["3–6","×2"],["7–10","×2.5"],["11–14","×3"],["15+","×4"]].map(([range, mult]) => {
                  const isActive = (
                    (range === "1" && totalCount === 1) ||
                    (range === "2" && totalCount === 2) ||
                    (range === "3–6" && totalCount >= 3 && totalCount <= 6) ||
                    (range === "7–10" && totalCount >= 7 && totalCount <= 10) ||
                    (range === "11–14" && totalCount >= 11 && totalCount <= 14) ||
                    (range === "15+" && totalCount >= 15)
                  );
                  return (
                    <div key={range} style={{
                      background: isActive ? "rgba(200,149,42,.18)" : "rgba(200,149,42,.05)",
                      border: `1px solid ${isActive ? "rgba(200,149,42,.6)" : "rgba(92,51,23,.3)"}`,
                      borderRadius: 3, padding: "3px 8px", textAlign: "center",
                    }}>
                      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 8, color: isActive ? "var(--gold)" : "rgba(245,230,200,.35)", letterSpacing: 0.5 }}>{range}</div>
                      <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 11, color: isActive ? "var(--gold)" : "rgba(245,230,200,.3)" }}>{mult}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
