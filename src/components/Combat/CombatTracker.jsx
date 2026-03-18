import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { genId } from "../../store.js";
import { CONDITIONS, MONSTERS } from "../../data/monsters.js";

// ─── Module-level helpers ──────────────────────────────────────────────────────
function rollD20() { return Math.floor(Math.random() * 20) + 1; }
function abMod(s) { return Math.floor(((s || 10) - 10) / 2); }
const CR_SORT = cr => ({ "0": 0, "1/8": .125, "1/4": .25, "1/2": .5 }[cr] ?? (parseFloat(cr) || 0));
const CRS = ["all","0","1/8","1/4","1/2","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
const COND_MAP = Object.fromEntries(CONDITIONS.map(c => [c.id, c]));

// ─── Style tokens ──────────────────────────────────────────────────────────────
const sPanel = { background: "rgba(26,10,2,.8)", border: "1px solid rgba(92,51,23,.4)", borderRadius: 4, padding: 10 };
const sLabel = { fontFamily: "'Cinzel',serif", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(200,149,42,.4)", marginBottom: 4, display: "block" };
const sInput = { background: "rgba(245,230,200,.05)", border: "1px solid rgba(92,51,23,.4)", borderRadius: 3, color: "var(--vel)", fontFamily: "'IM Fell English',serif", fontSize: 13, padding: "4px 8px", outline: "none", width: "100%" };
const sBtnGold = { background: "var(--gold)", border: "none", color: "var(--ink)", borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: "5px 12px" };
const sBtnSec = { background: "rgba(200,149,42,.1)", border: "1px solid rgba(200,149,42,.4)", color: "var(--gold)", borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1, padding: "5px 10px" };
const sBtnDng = { background: "rgba(139,26,26,.2)", border: "1px solid rgba(139,26,26,.4)", color: "var(--cr)", borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1, padding: "5px 10px" };

// ─── Cell component ────────────────────────────────────────────────────────────
function Cell({ x, y, px, combatant, isActive, isSelected, isWall, placingId, editMode, onClick, onMouseDown, onCellMouseEnter }) {
  const [hovered, setHovered] = useState(false);

  const isDead = combatant && combatant.hp <= 0;
  const isEnemy = combatant?.type === "enemy";
  const hpPct = combatant ? Math.max(0, Math.min(1, combatant.hp / combatant.hpMax)) : 1;
  const hpColor = hpPct > 0.5 ? "#4caf50" : hpPct > 0.25 ? "#e8a44b" : "#e84b4b";

  const tokenColor = isDead ? "#333" : isEnemy ? "#8b2222" : "#1a3a7a";
  const showPlacingHint = placingId && !combatant && !isWall && editMode === "move";

  let bgColor = "rgba(14,4,0,.5)";
  if (isWall) bgColor = "rgba(50,25,5,.95)";
  else if (hovered && !combatant) bgColor = "rgba(200,149,42,.08)";

  const cellStyle = {
    width: px,
    height: px,
    border: `1px solid ${isSelected ? "rgba(200,149,42,.9)" : "rgba(60,30,10,.4)"}`,
    background: bgColor,
    position: "relative",
    cursor: "pointer",
    flexShrink: 0,
    outline: isSelected ? "2px solid rgba(200,149,42,.6)" : "none",
    outlineOffset: -2,
    boxSizing: "border-box",
  };

  const tokenStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -60%)",
    width: px * 0.7,
    height: px * 0.7,
    borderRadius: "50%",
    background: tokenColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isDead ? "#888" : "#fff",
    fontSize: px * 0.32,
    fontFamily: "'Cinzel',serif",
    fontWeight: 700,
    opacity: isDead ? 0.45 : 1,
    border: isActive ? `2px solid #c8952a` : "1px solid rgba(255,255,255,.2)",
    boxShadow: isActive ? `0 0 ${px * 0.4}px rgba(200,149,42,.8)` : "none",
    userSelect: "none",
    zIndex: 2,
  };

  const hpBarStyle = px >= 36 ? {
    position: "absolute",
    bottom: 2,
    left: 2,
    right: 2,
    height: 3,
    background: "rgba(0,0,0,.5)",
    borderRadius: 2,
    overflow: "hidden",
    zIndex: 3,
  } : null;

  const placingHintStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: px * 0.65,
    height: px * 0.65,
    borderRadius: "50%",
    border: "2px dashed rgba(74,144,226,.7)",
    opacity: hovered ? 1 : 0,
    pointerEvents: "none",
    zIndex: 2,
  };

  return (
    <div
      style={cellStyle}
      onClick={() => onClick(x, y)}
      onMouseDown={e => { e.preventDefault(); onMouseDown?.(x, y); }}
      onMouseEnter={() => { setHovered(true); onCellMouseEnter?.(x, y); }}
      onMouseLeave={() => setHovered(false)}
    >
      {isWall && (
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg,rgba(92,51,23,.3) 0px,rgba(92,51,23,.3) 4px,transparent 4px,transparent 8px)" }} />
      )}
      {combatant && (
        <div style={tokenStyle}>
          {isDead ? "✕" : combatant.name.charAt(0).toUpperCase()}
        </div>
      )}
      {showPlacingHint && <div style={placingHintStyle} />}
      {combatant && hpBarStyle && (
        <div style={hpBarStyle}>
          <div style={{ width: `${hpPct * 100}%`, height: "100%", background: hpColor, borderRadius: 2, transition: "width .2s" }} />
        </div>
      )}
    </div>
  );
}

// ─── Add Custom Modal ──────────────────────────────────────────────────────────
function AddCustomModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", type: "enemy", count: 1, initiative: "", hp: 10, ac: 10, cr: "1" });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleAdd() {
    if (!form.name.trim()) return;
    const count = Math.max(1, parseInt(form.count) || 1);
    for (let i = 0; i < count; i++) {
      const init = form.initiative !== "" ? parseInt(form.initiative) : rollD20();
      onAdd({
        name: count > 1 ? `${form.name.trim()} ${i + 1}` : form.name.trim(),
        type: form.type,
        initiative: init,
        hp: parseInt(form.hp) || 10,
        hpMax: parseInt(form.hp) || 10,
        ac: parseInt(form.ac) || 10,
        cr: form.cr,
        dex: 10,
        conditions: [],
        isConcentrating: false,
      });
    }
    onClose();
  }

  const overlay = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  const modal = {
    background: "linear-gradient(135deg,#1a0802,#0e0400)", border: "2px solid var(--gold)",
    borderRadius: 6, padding: 24, width: 380, maxWidth: "90vw",
    boxShadow: "0 20px 60px rgba(0,0,0,.8)",
  };
  const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
  const fLabel = { ...sLabel, marginBottom: 3 };

  function Field({ label, children }) {
    return (
      <div>
        <span style={fLabel}>{label}</span>
        {children}
      </div>
    );
  }

  return createPortal(
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={{ fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)", fontSize: 13, marginBottom: 16, textAlign: "center" }}>
          ✦ Add Custom Combatant
        </div>
        <div style={{ marginBottom: 10 }}>
          <Field label="Name"><input style={sInput} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Goblin Chief" /></Field>
        </div>
        <div style={{ ...grid2, marginBottom: 10 }}>
          <Field label="Type">
            <select style={sInput} value={form.type} onChange={e => set("type", e.target.value)}>
              <option value="enemy">Enemy</option>
              <option value="ally">Ally</option>
            </select>
          </Field>
          <Field label="Count">
            <input style={sInput} type="number" min={1} max={20} value={form.count} onChange={e => set("count", e.target.value)} />
          </Field>
          <Field label="Initiative (blank=random)">
            <input style={sInput} type="number" value={form.initiative} onChange={e => set("initiative", e.target.value)} placeholder="Random" />
          </Field>
          <Field label="Max HP">
            <input style={sInput} type="number" min={1} value={form.hp} onChange={e => set("hp", e.target.value)} />
          </Field>
          <Field label="AC">
            <input style={sInput} type="number" min={1} value={form.ac} onChange={e => set("ac", e.target.value)} />
          </Field>
          <Field label="CR">
            <select style={sInput} value={form.cr} onChange={e => set("cr", e.target.value)}>
              {CRS.filter(c => c !== "all").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button style={sBtnGold} onClick={handleAdd}>✦ Add</button>
          <button style={sBtnSec} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Main CombatTracker ────────────────────────────────────────────────────────
export default function CombatTracker({
  characters = [],
  customMonsters = [],
  pendingCombatant,
  onClearPending,
  pendingCombatants,
  onClearPendingAll,
  initialState = null,
  onSaveState,
}) {
  // Core combat state — hydrate from persisted state if available
  const [combatants, setCombatants] = useState(() => initialState?.combatants || []);
  const [round, setRound] = useState(() => initialState?.round || 1);
  const [activeIdx, setActiveIdx] = useState(() => initialState?.activeIdx || 0);
  const [log, setLog] = useState(() => initialState?.log || []);

  // Grid state
  const [tokens, setTokens] = useState(() => initialState?.tokens || {});
  const [walls, setWalls] = useState(() => new Set(initialState?.walls || []));
  const [cols, setCols] = useState(() => initialState?.cols || 22);
  const [rows, setRows] = useState(() => initialState?.rows || 16);
  const [cellSize, setCellSize] = useState(() => initialState?.cellSize || "M");

  // Drag-to-draw wall refs
  const isDragging = useRef(false);
  const dragAdding = useRef(true);

  // UI state
  const [selected, setSelected] = useState(null);
  const [placingId, setPlacingId] = useState(null);
  const [editMode, setEditMode] = useState("move");
  const [sideTab, setSideTab] = useState("party");
  const [showAddModal, setShowAddModal] = useState(false);

  // Monster filter state
  const [monsterSearch, setMonsterSearch] = useState("");
  const [monsterCr, setMonsterCr] = useState("all");

  // HP edit inputs for selected combatant
  const [dmgInput, setDmgInput] = useState("");
  const [healInput, setHealInput] = useState("");
  const [showAllConds, setShowAllConds] = useState(false);

  const px = cellSize === "S" ? 28 : cellSize === "L" ? 56 : 40;

  // Reverse token lookup: combatantId -> "x,y"
  const tokenPos = useMemo(() => {
    const map = {};
    for (const [key, cid] of Object.entries(tokens)) map[cid] = key;
    return map;
  }, [tokens]);

  const sortedCombatants = useMemo(() =>
    [...combatants].sort((a, b) => b.initiative - a.initiative),
    [combatants]
  );

  const activeId = sortedCombatants[activeIdx]?.id ?? null;

  const allMonsters = useMemo(() =>
    [...MONSTERS, ...customMonsters].sort((a, b) => CR_SORT(a.cr) - CR_SORT(b.cr)),
    [customMonsters]
  );

  const filteredMonsters = useMemo(() => {
    let list = allMonsters;
    if (monsterCr !== "all") list = list.filter(m => m.cr === monsterCr);
    if (monsterSearch.trim()) {
      const q = monsterSearch.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }
    return list.slice(0, 60);
  }, [allMonsters, monsterSearch, monsterCr]);

  // ─── Log helper ─────────────────────────────────────────────────────────────
  function addLog(msg) {
    setLog(l => [msg, ...l].slice(0, 60));
  }

  // ─── Add combatant ──────────────────────────────────────────────────────────
  function addCombatant(data) {
    const id = genId();
    const newC = {
      id,
      name: data.name || "Unknown",
      type: data.type || "enemy",
      initiative: data.initiative ?? rollD20(),
      hp: data.hp ?? data.hpMax ?? 10,
      hpMax: data.hpMax ?? data.hp ?? 10,
      ac: data.ac ?? 10,
      cr: data.cr ?? "0",
      dex: data.dex ?? 10,
      conditions: [],
      isConcentrating: false,
      charId: data.charId,
    };
    setCombatants(cs => [...cs, newC]);
    addLog(`${newC.name} joins the battle (Init: ${newC.initiative})`);
    return id;
  }

  // ─── Update combatant ────────────────────────────────────────────────────────
  function updateCombatant(id, patch) {
    setCombatants(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  }

  // ─── Remove combatant ────────────────────────────────────────────────────────
  function removeCombatant(id) {
    setCombatants(cs => cs.filter(c => c.id !== id));
    setTokens(t => {
      const next = { ...t };
      for (const [k, v] of Object.entries(next)) if (v === id) delete next[k];
      return next;
    });
    if (selected === id) setSelected(null);
    if (placingId === id) setPlacingId(null);
  }

  function removeFromGrid(id) {
    setTokens(t => {
      const next = { ...t };
      for (const [k, v] of Object.entries(next)) if (v === id) delete next[k];
      return next;
    });
  }

  // ─── Drag wall handlers ──────────────────────────────────────────────────────
  function handleCellMouseDown(x, y) {
    if (editMode !== "wall") return;
    const key = `${x},${y}`;
    if (tokens[key]) return; // don't wall over tokens
    isDragging.current = true;
    const willAdd = !walls.has(key);
    dragAdding.current = willAdd;
    setWalls(w => {
      const next = new Set(w);
      if (willAdd) next.add(key); else next.delete(key);
      return next;
    });
  }

  function handleCellMouseEnter(x, y) {
    if (!isDragging.current || editMode !== "wall") return;
    const key = `${x},${y}`;
    if (tokens[key]) return;
    setWalls(w => {
      const next = new Set(w);
      if (dragAdding.current) next.add(key); else next.delete(key);
      return next;
    });
  }

  // ─── Cell click ─────────────────────────────────────────────────────────────
  function handleCellClick(x, y) {
    const key = `${x},${y}`;
    const occupant = tokens[key];
    const isWallCell = walls.has(key);

    if (editMode === "wall") {
      // Wall toggling handled by mousedown/mouseenter drag system
      return;
      return;
    }

    if (editMode === "erase") {
      if (occupant) {
        removeFromGrid(occupant);
      } else {
        setWalls(w => { const next = new Set(w); next.delete(key); return next; });
      }
      return;
    }

    // move mode
    if (placingId) {
      if (!occupant && !isWallCell) {
        setTokens(t => {
          const next = { ...t };
          for (const [k, v] of Object.entries(next)) if (v === placingId) delete next[k];
          next[key] = placingId;
          return next;
        });
        const c = combatants.find(c => c.id === placingId);
        const colLabel = x + 1;
        const rowLabel = String.fromCharCode(65 + y);
        addLog(`${c?.name ?? "?"} placed at ${rowLabel}${colLabel}`);
        setPlacingId(null);
      }
      return;
    }

    if (occupant) {
      setSelected(s => s === occupant ? null : occupant);
    } else if (selected && !isWallCell) {
      // Move selected token
      const c = combatants.find(c => c.id === selected);
      setTokens(t => {
        const next = { ...t };
        for (const [k, v] of Object.entries(next)) if (v === selected) delete next[k];
        next[key] = selected;
        return next;
      });
      const colLabel = x + 1;
      const rowLabel = String.fromCharCode(65 + y);
      addLog(`${c?.name ?? "?"} moves to ${rowLabel}${colLabel}`);
    }
  }

  // ─── Next turn ───────────────────────────────────────────────────────────────
  function nextTurn() {
    if (sortedCombatants.length === 0) return;
    const nextIdx = (activeIdx + 1) % sortedCombatants.length;
    if (nextIdx === 0) {
      setRound(r => r + 1);
      addLog(`── Round ${round + 1} begins ──`);
    }
    setActiveIdx(nextIdx);
    const next = sortedCombatants[nextIdx];
    if (next) addLog(`${next.name}'s turn`);
  }

  // ─── Roll initiatives ────────────────────────────────────────────────────────
  function rollAllInit() {
    setCombatants(cs => cs.map(c => ({ ...c, initiative: rollD20() + abMod(c.dex) })));
    setActiveIdx(0);
    addLog("Initiatives re-rolled for all combatants");
  }

  // ─── Reset ───────────────────────────────────────────────────────────────────
  function resetCombat() {
    setCombatants([]);
    setRound(1);
    setActiveIdx(0);
    setLog([]);
    setTokens({});
    setWalls(new Set());
    setSelected(null);
    setPlacingId(null);
  }

  // ─── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setPlacingId(null);
        setSelected(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ─── Stop drag on global mouseup ─────────────────────────────────────────────
  useEffect(() => {
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, []);

  // ─── Persist combat state (debounced 1.5s) ───────────────────────────────────
  useEffect(() => {
    if (!onSaveState) return;
    const timer = setTimeout(() => {
      onSaveState({
        combatants,
        round,
        activeIdx,
        log: log.slice(0, 30),
        tokens,
        walls: [...walls],
        cols,
        rows,
        cellSize,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [combatants, round, activeIdx, log, tokens, walls, cols, rows, cellSize]); // eslint-disable-line

  // ─── Auto-add pending combatants ─────────────────────────────────────────────
  useEffect(() => {
    if (!pendingCombatant) return;
    const m = pendingCombatant;
    addCombatant({
      name: m.name,
      type: "enemy",
      initiative: rollD20() + abMod(m.dex),
      hp: m.hp,
      hpMax: m.hp,
      ac: m.ac,
      cr: m.cr,
      dex: m.dex,
    });
    onClearPending?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCombatant]);

  useEffect(() => {
    if (!pendingCombatants?.length) return;
    pendingCombatants.forEach(m => addCombatant({
      name: m.name,
      type: "enemy",
      initiative: rollD20() + abMod(m.dex),
      hp: m.hp,
      hpMax: m.hp,
      ac: m.ac,
      cr: m.cr,
      dex: m.dex,
    }));
    onClearPendingAll?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCombatants]);

  // ─── Selected combatant helpers ──────────────────────────────────────────────
  const selectedCombatant = combatants.find(c => c.id === selected) ?? null;

  function applyDmg() {
    if (!selectedCombatant) return;
    const n = parseInt(dmgInput);
    if (isNaN(n) || n <= 0) return;
    const newHp = Math.max(0, selectedCombatant.hp - n);
    updateCombatant(selected, { hp: newHp });
    addLog(`${selectedCombatant.name} takes ${n} damage (${newHp}/${selectedCombatant.hpMax} HP)`);
    setDmgInput("");
  }

  function applyHeal() {
    if (!selectedCombatant) return;
    const n = parseInt(healInput);
    if (isNaN(n) || n <= 0) return;
    const newHp = Math.min(selectedCombatant.hpMax, selectedCombatant.hp + n);
    updateCombatant(selected, { hp: newHp });
    addLog(`${selectedCombatant.name} healed for ${n} (${newHp}/${selectedCombatant.hpMax} HP)`);
    setHealInput("");
  }

  function toggleCondition(condId) {
    if (!selectedCombatant) return;
    const has = selectedCombatant.conditions.includes(condId);
    const next = has
      ? selectedCombatant.conditions.filter(c => c !== condId)
      : [...selectedCombatant.conditions, condId];
    updateCombatant(selected, { conditions: next });
  }

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const selHpPct = selectedCombatant ? Math.max(0, Math.min(1, selectedCombatant.hp / selectedCombatant.hpMax)) : 1;
  const selHpColor = selHpPct > 0.5 ? "#4caf50" : selHpPct > 0.25 ? "#e8a44b" : "#e84b4b";
  const selPos = selectedCombatant ? tokenPos[selectedCombatant.id] : null;
  const selOnGrid = !!selPos;

  // ─── Render helpers ──────────────────────────────────────────────────────────
  const modeBtn = (mode, label) => (
    <button
      style={{
        ...sBtnSec,
        background: editMode === mode ? "rgba(200,149,42,.3)" : "rgba(200,149,42,.08)",
        borderColor: editMode === mode ? "var(--gold)" : "rgba(200,149,42,.3)",
        color: editMode === mode ? "var(--gold)" : "rgba(200,149,42,.6)",
      }}
      onClick={() => setEditMode(mode)}
    >{label}</button>
  );

  const sizeBtn = (sz) => (
    <button
      style={{
        ...sBtnSec,
        padding: "5px 8px",
        background: cellSize === sz ? "rgba(200,149,42,.3)" : "rgba(200,149,42,.08)",
        borderColor: cellSize === sz ? "var(--gold)" : "rgba(200,149,42,.3)",
        color: cellSize === sz ? "var(--gold)" : "rgba(200,149,42,.6)",
      }}
      onClick={() => setCellSize(sz)}
    >{sz}</button>
  );

  // ─── Grid ────────────────────────────────────────────────────────────────────
  const columnLabels = (
    <div style={{ display: "flex", paddingLeft: 24 }}>
      {Array.from({ length: cols }, (_, x) => (
        <div key={x} style={{ width: px, flexShrink: 0, textAlign: "center", fontFamily: "'Cinzel',serif", fontSize: 8, color: "rgba(200,149,42,.35)", letterSpacing: 0.5, lineHeight: "16px" }}>
          {x + 1}
        </div>
      ))}
    </div>
  );

  const gridRows = Array.from({ length: rows }, (_, y) => {
    const rowLabel = String.fromCharCode(65 + y);
    return (
      <div key={y} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: 20, flexShrink: 0, textAlign: "right", paddingRight: 4, fontFamily: "'Cinzel',serif", fontSize: 8, color: "rgba(200,149,42,.35)", lineHeight: `${px}px` }}>
          {rowLabel}
        </div>
        {Array.from({ length: cols }, (_, x) => {
          const key = `${x},${y}`;
          const cid = tokens[key];
          const combatant = cid ? combatants.find(c => c.id === cid) : null;
          return (
            <Cell
              key={key}
              x={x} y={y} px={px}
              combatant={combatant}
              isActive={cid === activeId}
              isSelected={cid === selected || key === (selected && tokenPos[selected])}
              isWall={walls.has(key)}
              placingId={placingId}
              editMode={editMode}
              onClick={handleCellClick}
              onMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
            />
          );
        })}
      </div>
    );
  });

  // ─── Toolbar ─────────────────────────────────────────────────────────────────
  const activeC = sortedCombatants[activeIdx];
  const toolbar = (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(14,4,0,.8)", border: "1px solid rgba(92,51,23,.4)", borderRadius: 4, padding: "8px 12px", flexWrap: "wrap" }}>
      <div style={{ fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)", fontSize: 12, whiteSpace: "nowrap" }}>
        ⚔ Round {round}
        {activeC && (
          <span style={{ fontFamily: "'IM Fell English',serif", fontSize: 11, color: "var(--vel)", marginLeft: 10 }}>
            — {activeC.name}'s turn
          </span>
        )}
      </div>

      {placingId && (
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, color: "#4a90e2", letterSpacing: 1, animation: "pulse 1.2s ease-in-out infinite", padding: "0 8px" }}>
          Placing: {combatants.find(c => c.id === placingId)?.name ?? "?"} — click an empty cell
        </div>
      )}

      <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: "auto", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {modeBtn("move", "↖ Move")}
          {modeBtn("wall", "🧱 Wall")}
          {modeBtn("erase", "✕ Erase")}
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {sizeBtn("S")}{sizeBtn("M")}{sizeBtn("L")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={sLabel}>W</span>
          <input type="number" min={5} max={40} value={cols} onChange={e => setCols(Math.max(5, Math.min(40, parseInt(e.target.value) || 22)))}
            style={{ ...sInput, width: 44, textAlign: "center", padding: "3px 4px", fontSize: 12 }} />
          <span style={{ color: "rgba(200,149,42,.4)", fontSize: 10 }}>×</span>
          <span style={sLabel}>H</span>
          <input type="number" min={5} max={30} value={rows} onChange={e => setRows(Math.max(5, Math.min(30, parseInt(e.target.value) || 16)))}
            style={{ ...sInput, width: 44, textAlign: "center", padding: "3px 4px", fontSize: 12 }} />
        </div>
        <button style={sBtnSec} onClick={rollAllInit}>🎲 Roll Init</button>
        <button style={sBtnGold} onClick={nextTurn}>Next Turn ▶</button>
        <button style={sBtnDng} onClick={resetCombat}>✕ Reset</button>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );

  // ─── Sidebar: Initiative list ─────────────────────────────────────────────────
  const initiativeList = (
    <div style={sPanel}>
      <span style={sLabel}>Initiative Order</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {sortedCombatants.length === 0 && (
          <div style={{ fontFamily: "'IM Fell English',serif", fontSize: 11, color: "rgba(245,230,200,.3)", fontStyle: "italic", textAlign: "center", padding: "8px 0" }}>
            No combatants yet
          </div>
        )}
        {sortedCombatants.map((c, idx) => {
          const isAct = idx === activeIdx;
          const isDead = c.hp <= 0;
          const onGrid = !!tokenPos[c.id];
          const isSel = selected === c.id;
          const hpPct = c.hpMax > 0 ? Math.max(0, Math.min(1, c.hp / c.hpMax)) : 0;
          const hpColor = hpPct > 0.5 ? "#4caf50" : hpPct > 0.25 ? "#e8a44b" : "#e84b4b";
          return (
            <div
              key={c.id}
              onClick={() => setSelected(s => s === c.id ? null : c.id)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "4px 6px",
                background: isSel ? "rgba(200,149,42,.12)" : isAct ? "rgba(200,149,42,.07)" : "transparent",
                border: `1px solid ${isSel ? "rgba(200,149,42,.4)" : isAct ? "rgba(200,149,42,.2)" : "transparent"}`,
                borderRadius: 3, cursor: "pointer",
              }}
            >
              {/* Initiative badge */}
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: isAct ? "var(--gold)" : "rgba(200,149,42,.15)",
                border: `1px solid ${isAct ? "var(--gold)" : "rgba(200,149,42,.3)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 700,
                color: isAct ? "var(--ink)" : "var(--gold)",
              }}>{c.initiative}</div>

              {/* Type icon */}
              <span style={{ fontSize: 11 }}>{isDead ? "💀" : c.type === "enemy" ? "🗡️" : "🛡️"}</span>

              {/* Name + HP bar */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, color: isDead ? "#666" : "var(--vel)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.name}
                </div>
                <div style={{ height: 3, background: "rgba(0,0,0,.4)", borderRadius: 2, marginTop: 2 }}>
                  <div style={{ width: `${hpPct * 100}%`, height: "100%", background: hpColor, borderRadius: 2, transition: "width .2s" }} />
                </div>
              </div>

              {/* Grid badge */}
              {onGrid
                ? <span style={{ fontFamily: "'Cinzel',serif", fontSize: 7, color: "rgba(200,149,42,.4)", letterSpacing: 0.5, flexShrink: 0 }}>ON GRID</span>
                : <button
                    onClick={e => { e.stopPropagation(); setPlacingId(c.id); setSelected(null); setEditMode("move"); }}
                    style={{ ...sBtnSec, padding: "2px 6px", fontSize: 7, flexShrink: 0 }}
                  >Place</button>
              }

              {/* Remove */}
              <button
                onClick={e => { e.stopPropagation(); removeCombatant(c.id); }}
                style={{ background: "none", border: "none", color: "rgba(200,149,42,.3)", cursor: "pointer", fontSize: 12, padding: "0 2px", flexShrink: 0 }}
              >✕</button>
            </div>
          );
        })}
      </div>

      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
        <button style={{ ...sBtnSec, flex: 1, padding: "4px 0", fontSize: 8, background: sideTab === "party" ? "rgba(200,149,42,.25)" : undefined }} onClick={() => setSideTab("party")}>+ Party</button>
        <button style={{ ...sBtnSec, flex: 1, padding: "4px 0", fontSize: 8, background: sideTab === "monsters" ? "rgba(200,149,42,.25)" : undefined }} onClick={() => setSideTab("monsters")}>+ Monsters</button>
        <button style={{ ...sBtnSec, flex: 1, padding: "4px 0", fontSize: 8 }} onClick={() => setShowAddModal(true)}>Custom</button>
      </div>
    </div>
  );

  // ─── Sidebar: Add panel ──────────────────────────────────────────────────────
  const partyPanel = (
    <div style={sPanel}>
      <span style={sLabel}>Party</span>
      {characters.length === 0 && (
        <div style={{ fontFamily: "'IM Fell English',serif", fontSize: 11, color: "rgba(245,230,200,.3)", fontStyle: "italic" }}>No characters saved</div>
      )}
      {characters.map(ch => {
        const inCombat = combatants.some(c => c.charId === ch.id);
        const hpPct = ch.hpMax > 0 ? Math.max(0, Math.min(1, (ch.hp ?? ch.hpMax) / ch.hpMax)) : 1;
        const hpColor = hpPct > 0.5 ? "#4caf50" : hpPct > 0.25 ? "#e8a44b" : "#e84b4b";
        return (
          <div key={ch.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, padding: "4px 6px", background: "rgba(245,230,200,.03)", borderRadius: 3, border: "1px solid rgba(92,51,23,.3)" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: inCombat ? "rgba(245,230,200,.35)" : "var(--vel)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {ch.name}
              </div>
              <div style={{ height: 3, background: "rgba(0,0,0,.4)", borderRadius: 2, marginTop: 2, width: "100%" }}>
                <div style={{ width: `${hpPct * 100}%`, height: "100%", background: hpColor, borderRadius: 2 }} />
              </div>
            </div>
            {inCombat
              ? <span style={{ fontFamily: "'Cinzel',serif", fontSize: 7, color: "rgba(200,149,42,.35)", letterSpacing: 0.5 }}>IN COMBAT</span>
              : <button style={{ ...sBtnSec, padding: "3px 8px", fontSize: 8 }} onClick={() => {
                  const dex = ch.dex ?? 10;
                  addCombatant({ name: ch.name, type: "ally", initiative: rollD20() + abMod(dex), hp: ch.hp ?? ch.hpMax ?? 20, hpMax: ch.hpMax ?? 20, ac: ch.ac ?? 10, cr: "—", dex, charId: ch.id });
                }}>⚔ Add</button>
            }
          </div>
        );
      })}
    </div>
  );

  const monstersPanel = (
    <div style={sPanel}>
      <span style={sLabel}>Monsters</span>
      <input
        style={{ ...sInput, marginBottom: 5 }}
        placeholder="Search monsters..."
        value={monsterSearch}
        onChange={e => setMonsterSearch(e.target.value)}
      />
      <select style={{ ...sInput, marginBottom: 6 }} value={monsterCr} onChange={e => setMonsterCr(e.target.value)}>
        {CRS.map(c => <option key={c} value={c}>{c === "all" ? "All CRs" : `CR ${c}`}</option>)}
      </select>
      <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {filteredMonsters.map(m => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 5px", marginBottom: 2, background: "rgba(245,230,200,.03)", borderRadius: 3, border: "1px solid rgba(92,51,23,.25)" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, color: "var(--vel)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
              <div style={{ fontFamily: "'IM Fell English',serif", fontSize: 9, color: "rgba(200,149,42,.45)" }}>CR {m.cr} · AC {m.ac} · {m.hp} HP</div>
            </div>
            <button
              style={{ ...sBtnGold, padding: "3px 8px", fontSize: 11, lineHeight: 1 }}
              onClick={() => addCombatant({ name: m.name, type: "enemy", initiative: rollD20() + abMod(m.dex), hp: m.hp, hpMax: m.hp, ac: m.ac, cr: m.cr, dex: m.dex })}
            >+</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Sidebar: Selected combatant panel ───────────────────────────────────────
  const selectedPanel = selectedCombatant && (
    <div style={sPanel}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>{selectedCombatant.hp <= 0 ? "💀" : selectedCombatant.type === "enemy" ? "🗡️" : "🛡️"}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, color: "var(--gold)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedCombatant.name}</div>
          <div style={{ fontFamily: "'IM Fell English',serif", fontSize: 9, color: "rgba(200,149,42,.45)" }}>
            AC {selectedCombatant.ac} · CR {selectedCombatant.cr}{selPos ? ` · ${String.fromCharCode(65 + parseInt(selPos.split(",")[1]))}${parseInt(selPos.split(",")[0]) + 1}` : ""}
          </div>
        </div>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(200,149,42,.4)", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
      </div>

      {/* HP display */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={sLabel}>HP</span>
          <span style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: selHpColor }}>{selectedCombatant.hp} / {selectedCombatant.hpMax}</span>
        </div>
        <div style={{ height: 6, background: "rgba(0,0,0,.5)", borderRadius: 3 }}>
          <div style={{ width: `${selHpPct * 100}%`, height: "100%", background: selHpColor, borderRadius: 3, transition: "width .2s" }} />
        </div>
      </div>

      {/* DMG/HEAL inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto", gap: 4, alignItems: "end", marginBottom: 8 }}>
        <div>
          <span style={sLabel}>DMG</span>
          <input
            style={{ ...sInput, textAlign: "center" }} type="number" min={0} value={dmgInput}
            onChange={e => setDmgInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyDmg()}
            placeholder="0"
          />
        </div>
        <button style={{ ...sBtnDng, padding: "5px 10px", alignSelf: "end" }} onClick={applyDmg}>−HP</button>
        <div>
          <span style={sLabel}>HEAL</span>
          <input
            style={{ ...sInput, textAlign: "center" }} type="number" min={0} value={healInput}
            onChange={e => setHealInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyHeal()}
            placeholder="0"
          />
        </div>
        <button style={{ ...sBtnSec, padding: "5px 10px", alignSelf: "end", color: "#4caf50", borderColor: "#4caf50" }} onClick={applyHeal}>+HP</button>
      </div>

      {/* Conditions */}
      <div style={{ marginBottom: 6 }}>
        <span style={sLabel}>Conditions</span>
        {selectedCombatant.conditions.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 5 }}>
            {selectedCombatant.conditions.map(cid => {
              const cond = COND_MAP[cid];
              if (!cond) return null;
              return (
                <span
                  key={cid}
                  onClick={() => toggleCondition(cid)}
                  title={`${cond.name}: ${cond.desc}`}
                  style={{ background: `${cond.color}33`, border: `1px solid ${cond.color}88`, borderRadius: 10, padding: "2px 7px", fontSize: 9, fontFamily: "'Cinzel',serif", color: cond.color, cursor: "pointer" }}
                >{cond.icon} {cond.name}</span>
              );
            })}
          </div>
        )}
        <button style={{ ...sBtnSec, width: "100%", fontSize: 8, padding: "3px 0" }} onClick={() => setShowAllConds(v => !v)}>
          {showAllConds ? "▲ Hide" : "▼ Add Condition"}
        </button>
        {showAllConds && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 5, maxHeight: 120, overflowY: "auto" }}>
            {CONDITIONS.map(cond => {
              const has = selectedCombatant.conditions.includes(cond.id);
              return (
                <span
                  key={cond.id}
                  onClick={() => toggleCondition(cond.id)}
                  title={cond.desc}
                  style={{
                    background: has ? `${cond.color}44` : "rgba(245,230,200,.04)",
                    border: `1px solid ${has ? cond.color : "rgba(92,51,23,.3)"}`,
                    borderRadius: 10, padding: "2px 7px", fontSize: 8,
                    fontFamily: "'Cinzel',serif", color: has ? cond.color : "rgba(245,230,200,.4)",
                    cursor: "pointer",
                  }}
                >{cond.icon} {cond.name}</span>
              );
            })}
          </div>
        )}
      </div>

      {/* Remove from grid */}
      {selOnGrid && (
        <button style={{ ...sBtnDng, width: "100%", fontSize: 8, padding: "4px 0", marginTop: 4 }} onClick={() => removeFromGrid(selected)}>
          Remove from Grid
        </button>
      )}
    </div>
  );

  // ─── Sidebar: Combat log ──────────────────────────────────────────────────────
  const combatLog = log.length > 0 && (
    <div style={{ ...sPanel, padding: "8px 10px" }}>
      <span style={sLabel}>Combat Log</span>
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {log.map((entry, i) => (
          <div key={i} style={{ fontFamily: "'IM Fell English',serif", fontSize: 10, color: i === 0 ? "var(--vel)" : "rgba(245,230,200,.4)", marginBottom: 2, lineHeight: 1.4 }}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {toolbar}

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Grid */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{ overflow: "auto", maxHeight: "calc(100vh - 200px)", background: "rgba(8,2,0,.6)", border: "1px solid rgba(60,30,10,.5)", borderRadius: 4, userSelect: "none" }}>
            {columnLabels}
            <div>{gridRows}</div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {initiativeList}
          {sideTab === "party" ? partyPanel : monstersPanel}
          {selectedPanel}
          {combatLog}
        </div>
      </div>

      {showAddModal && (
        <AddCustomModal
          onAdd={data => addCombatant(data)}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
