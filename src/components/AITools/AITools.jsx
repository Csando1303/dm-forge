import { useState, useCallback, useRef, useEffect } from "react";
import {
  getApiKey,
  setApiKey,
  clearApiKey,
  askRulesAssistant,
  generateNPC,
  regenerateNPCField,
  suggestEncounters,
} from "../../services/aiService.js";

// ─── Shared style tokens ───────────────────────────────────────────────────────

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

const btnSecondary = {
  background: "rgba(200,149,42,.12)",
  border: "1px solid rgba(200,149,42,.4)",
  color: "var(--gold)",
  borderRadius: 3,
  cursor: "pointer",
  fontFamily: "'Cinzel',serif",
  fontSize: 9,
  letterSpacing: 1,
  padding: "5px 14px",
};

const btnDanger = {
  background: "rgba(139,26,26,.2)",
  border: "1px solid rgba(139,26,26,.4)",
  color: "var(--cr)",
  borderRadius: 3,
  cursor: "pointer",
  fontFamily: "'Cinzel',serif",
  fontSize: 9,
  letterSpacing: 1,
  padding: "5px 14px",
};

const panel = {
  background: "rgba(26,10,2,.7)",
  border: "1px solid rgba(92,51,23,.4)",
  borderRadius: 4,
  padding: 14,
};

const errorStyle = {
  fontFamily: "'IM Fell English',serif",
  fontSize: 12,
  color: "#ff8888",
  background: "rgba(139,26,26,.18)",
  border: "1px solid rgba(139,26,26,.35)",
  borderRadius: 3,
  padding: "7px 11px",
  marginTop: 8,
};

// ─── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <span style={{
      display: "inline-block",
      width: 12,
      height: 12,
      border: "2px solid rgba(200,149,42,.3)",
      borderTop: "2px solid var(--gold)",
      borderRadius: "50%",
      animation: "dm-spin 0.7s linear infinite",
      verticalAlign: "middle",
      marginRight: 6,
    }} />
  );
}

// ─── API Key Panel ─────────────────────────────────────────────────────────────

function ApiKeyPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [hasKey, setHasKey] = useState(() => !!getApiKey());

  function handleSave() {
    if (!keyInput.trim()) return;
    setApiKey(keyInput.trim());
    setHasKey(true);
    setKeyInput("");
  }

  function handleClear() {
    clearApiKey();
    setHasKey(false);
    setKeyInput("");
  }

  return (
    <div style={{
      ...panel,
      marginBottom: 14,
      border: hasKey ? "1px solid rgba(76,175,80,.3)" : "1px solid rgba(200,149,42,.35)",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: collapsed ? 0 : 10 }}>
        <div style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 9,
          letterSpacing: 1.5,
          color: hasKey ? "#88cc88" : "var(--gold)",
          textTransform: "uppercase",
          flex: 1,
        }}>
          {hasKey ? "✓ API Key Configured" : "⚠ No API Key"}
        </div>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ ...btnSecondary, padding: "2px 10px", fontSize: 8 }}
        >
          {collapsed ? "▼ Show" : "▲ Hide"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={lStyle}>
                {hasKey ? "Replace API Key" : "Enter API Key"}
              </div>
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSave()}
                placeholder="sk-ant-..."
                style={iStyle}
              />
            </div>
            <button onClick={handleSave} style={{ ...btnPrimary, padding: "6px 16px", fontSize: 9 }}>
              Save Key
            </button>
            {hasKey && (
              <button onClick={handleClear} style={{ ...btnDanger, padding: "6px 14px" }}>
                Clear Key
              </button>
            )}
          </div>
          <div style={{
            fontFamily: "'IM Fell English',serif",
            fontStyle: "italic",
            fontSize: 11,
            color: "rgba(245,230,200,.35)",
            marginTop: 8,
          }}>
            Your Anthropic API key is stored only in your browser's localStorage and never sent anywhere except directly to Anthropic.
            Get a key at{" "}
            <a
              href="https://anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(200,149,42,.6)", textDecoration: "underline" }}
            >
              anthropic.com
            </a>.
          </div>
        </>
      )}
    </div>
  );
}

// ─── Tab 1: Rules Assistant ────────────────────────────────────────────────────

function RulesAssistant() {
  // conversation history: [{role:'user'|'assistant', content:string}]
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const handleAsk = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setError("");
    const newHistory = [...history, { role: "user", content: q }];
    setHistory(newHistory);
    setLoading(true);
    try {
      // Pass prior history without the message we just appended (service appends it)
      const reply = await askRulesAssistant(history, q);
      setHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      // Remove the user message we optimistically added
      setHistory(history);
    } finally {
      setLoading(false);
    }
  }, [input, history, loading]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Message history */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 280,
          maxHeight: 420,
          marginBottom: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingRight: 2,
        }}
      >
        {history.length === 0 && !loading && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "rgba(245,230,200,.3)",
            fontFamily: "'IM Fell English',serif",
            fontStyle: "italic",
            fontSize: 14,
            border: "1px dashed rgba(92,51,23,.3)",
            borderRadius: 4,
          }}>
            Ask any D&D 5e rules question…
          </div>
        )}

        {history.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div style={{
              maxWidth: "78%",
              padding: "9px 13px",
              borderRadius: msg.role === "user"
                ? "12px 12px 3px 12px"
                : "12px 12px 12px 3px",
              background: msg.role === "user"
                ? "rgba(200,149,42,.22)"
                : "rgba(26,10,2,.8)",
              border: msg.role === "user"
                ? "1px solid rgba(200,149,42,.4)"
                : "1px solid rgba(92,51,23,.45)",
              fontFamily: "'IM Fell English',serif",
              fontSize: 13,
              color: msg.role === "user" ? "var(--vd)" : "var(--vel)",
              lineHeight: 1.55,
              whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "9px 13px",
              borderRadius: "12px 12px 12px 3px",
              background: "rgba(26,10,2,.8)",
              border: "1px solid rgba(92,51,23,.45)",
              fontFamily: "'IM Fell English',serif",
              fontStyle: "italic",
              fontSize: 12,
              color: "rgba(245,230,200,.45)",
            }}>
              <Spinner /> Consulting the tomes…
            </div>
          </div>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {/* Input row */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a rules question… (Enter to send, Shift+Enter for newline)"
          rows={2}
          style={{
            ...iStyle,
            resize: "vertical",
            minHeight: 44,
            lineHeight: 1.4,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
          <button
            onClick={handleAsk}
            disabled={loading || !input.trim()}
            style={{
              ...btnPrimary,
              padding: "7px 18px",
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            Ask
          </button>
          {history.length > 0 && (
            <button
              onClick={() => { setHistory([]); setError(""); }}
              style={{ ...btnDanger, padding: "4px 10px", fontSize: 8 }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: NPC Generator ──────────────────────────────────────────────────────

const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

const RACE_SUGGESTIONS = [
  "Human", "Elf", "Dwarf", "Halfling", "Gnome",
  "Tiefling", "Half-Orc", "Dragonborn", "Half-Elf", "Aasimar",
];

const CLASS_SUGGESTIONS = [
  "Fighter", "Wizard", "Rogue", "Cleric", "Paladin",
  "Ranger", "Bard", "Warlock", "Merchant", "Guard", "Noble", "Innkeeper",
];

function SuggestionPills({ items, onSelect }) {
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
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(200,149,42,.18)";
            e.currentTarget.style.color = "var(--gold)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(200,149,42,.08)";
            e.currentTarget.style.color = "rgba(245,230,200,.5)";
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function RerollButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title="Reroll this field"
      style={{
        background: "none",
        border: "1px solid rgba(200,149,42,.3)",
        borderRadius: 3,
        color: "var(--gold)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 11,
        padding: "2px 6px",
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
      }}
    >
      🎲
    </button>
  );
}

function NPCGenerator({ onSaveToWiki }) {
  const [race, setRace] = useState("");
  const [npcClass, setNpcClass] = useState("");
  const [alignment, setAlignment] = useState("True Neutral");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rerolling, setRerolling] = useState({}); // field -> bool
  const [error, setError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  const params = { race: race || "Human", npcClass: npcClass || "Commoner", alignment };

  async function handleGenerate() {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const result = await generateNPC(params);
      setProfile(result);
    } catch (err) {
      setError(err.message || "Failed to generate NPC. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReroll(field) {
    if (!profile || rerolling[field]) return;
    setRerolling(r => ({ ...r, [field]: true }));
    try {
      const newVal = await regenerateNPCField(profile, field, params);
      setProfile(prev => ({ ...prev, [field]: newVal }));
    } catch (err) {
      setError(err.message || "Failed to reroll. Try again.");
    } finally {
      setRerolling(r => ({ ...r, [field]: false }));
    }
  }

  function handleSave() {
    if (!profile || !onSaveToWiki) return;
    onSaveToWiki({
      ...profile,
      race: params.race,
      npcClass: params.npcClass,
      alignment: params.alignment,
    });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  const anyRerolling = Object.values(rerolling).some(Boolean);

  const npcFields = [
    { key: "name", label: "Name" },
    { key: "appearance", label: "Appearance" },
    { key: "personalityTraits", label: "Personality Traits" },
    { key: "secretMotivation", label: "Secret Motivation" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {/* Race */}
        <div>
          <div style={lStyle}>Race</div>
          <input
            value={race}
            onChange={e => setRace(e.target.value)}
            placeholder="Human"
            style={iStyle}
          />
          <SuggestionPills items={RACE_SUGGESTIONS} onSelect={setRace} />
        </div>

        {/* Class / Role */}
        <div>
          <div style={lStyle}>Class / Role</div>
          <input
            value={npcClass}
            onChange={e => setNpcClass(e.target.value)}
            placeholder="Fighter, Merchant…"
            style={iStyle}
          />
          <SuggestionPills items={CLASS_SUGGESTIONS} onSelect={setNpcClass} />
        </div>

        {/* Alignment */}
        <div>
          <div style={lStyle}>Alignment</div>
          <select
            value={alignment}
            onChange={e => setAlignment(e.target.value)}
            style={iStyle}
          >
            {ALIGNMENTS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            ...btnPrimary,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? <><Spinner />Generating…</> : "✦ Generate NPC"}
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {/* Result panel */}
      {profile && (
        <div style={{ ...panel, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            fontFamily: "'Cinzel Decorative',serif",
            color: "var(--gold)",
            fontSize: 12,
            borderBottom: "1px solid rgba(200,149,42,.25)",
            paddingBottom: 8,
            marginBottom: 2,
          }}>
            {profile.name || "Unnamed NPC"}
            <span style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 9,
              color: "rgba(200,149,42,.5)",
              marginLeft: 10,
              letterSpacing: 1,
            }}>
              {params.race} · {params.npcClass} · {params.alignment}
            </span>
          </div>

          {npcFields.map(({ key, label }) => (
            <div key={key}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ ...lStyle, marginBottom: 0, flex: 1 }}>{label}</div>
                <RerollButton
                  onClick={() => handleReroll(key)}
                  disabled={rerolling[key] || anyRerolling || loading}
                />
              </div>
              <div style={{
                fontFamily: "'IM Fell English',serif",
                fontSize: 13,
                color: rerolling[key] ? "rgba(245,230,200,.4)" : "var(--vel)",
                lineHeight: 1.55,
                padding: "6px 10px",
                background: "rgba(0,0,0,.25)",
                borderRadius: 3,
                border: "1px solid rgba(92,51,23,.25)",
                fontStyle: key === "secretMotivation" ? "italic" : "normal",
                transition: "color .2s",
              }}>
                {rerolling[key] ? <><Spinner />Rerolling…</> : profile[key]}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <button
              onClick={handleSave}
              style={{
                ...btnPrimary,
                background: savedFlash ? "rgba(76,175,80,.85)" : "var(--gold)",
                color: savedFlash ? "#fff" : "var(--ink)",
                transition: "background .3s",
              }}
            >
              {savedFlash ? "✓ Saved to Wiki" : "✦ Save to Wiki"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Encounter Suggester ────────────────────────────────────────────────

function EncounterCard({ enc, index }) {
  return (
    <div style={{
      ...panel,
      borderLeft: "3px solid var(--gold)",
    }}>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        marginBottom: 8,
      }}>
        <div style={{
          fontFamily: "'Cinzel Decorative',serif",
          fontSize: 9,
          color: "rgba(200,149,42,.5)",
          flexShrink: 0,
        }}>
          {index + 1}.
        </div>
        <div style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 12,
          color: "var(--gold)",
          fontWeight: 700,
        }}>
          {enc.title}
        </div>
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ ...lStyle, marginBottom: 3 }}>Monsters</div>
        <div style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 11,
          color: "#ff9999",
          padding: "4px 8px",
          background: "rgba(139,26,26,.12)",
          borderRadius: 3,
          border: "1px solid rgba(139,26,26,.25)",
          display: "inline-block",
        }}>
          {enc.monsters}
        </div>
      </div>

      <div>
        <div style={{ ...lStyle, marginBottom: 3 }}>Narrative Hook</div>
        <div style={{
          fontFamily: "'IM Fell English',serif",
          fontSize: 13,
          fontStyle: "italic",
          color: "var(--vel)",
          lineHeight: 1.55,
        }}>
          {enc.hook}
        </div>
      </div>
    </div>
  );
}

function EncounterSuggester({ characters }) {
  // Auto-detect party level from characters if possible
  const detectedLevel = (() => {
    if (!characters || characters.length === 0) return "";
    const levels = characters.map(c => c.level || c.details?.level || 1).filter(Boolean);
    if (levels.length === 0) return "";
    return Math.round(levels.reduce((a, b) => a + b, 0) / levels.length);
  })();

  const [partyLevel, setPartyLevel] = useState(detectedLevel || "");
  const [partySize, setPartySize] = useState(characters?.length || "");
  const [context, setContext] = useState("");
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSuggest() {
    if (loading) return;
    const lvl = parseInt(partyLevel) || 1;
    const sz = parseInt(partySize) || 4;
    if (lvl < 1 || lvl > 20 || sz < 1 || sz > 10) {
      setError("Party level must be 1–20 and party size 1–10.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await suggestEncounters({
        partyLevel: lvl,
        partySize: sz,
        context: context.trim() || "A standard dungeon adventure",
      });
      setEncounters(result);
    } catch (err) {
      setError(err.message || "Failed to suggest encounters. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={lStyle}>
            Party Level (1–20)
            {detectedLevel ? (
              <span style={{ color: "rgba(200,149,42,.5)", marginLeft: 6, textTransform: "none", letterSpacing: 0, fontSize: 8 }}>
                auto-detected
              </span>
            ) : null}
          </div>
          <input
            type="number"
            min={1}
            max={20}
            value={partyLevel}
            onChange={e => setPartyLevel(e.target.value)}
            placeholder="e.g. 5"
            style={iStyle}
          />
        </div>

        <div>
          <div style={lStyle}>
            Party Size (1–10)
            {characters?.length ? (
              <span style={{ color: "rgba(200,149,42,.5)", marginLeft: 6, textTransform: "none", letterSpacing: 0, fontSize: 8 }}>
                {characters.length} in party
              </span>
            ) : null}
          </div>
          <input
            type="number"
            min={1}
            max={10}
            value={partySize}
            onChange={e => setPartySize(e.target.value)}
            placeholder="e.g. 4"
            style={iStyle}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <div style={lStyle}>Context / Setting</div>
          <textarea
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="The party is in a haunted forest looking for a missing child…"
            rows={3}
            style={{ ...iStyle, resize: "vertical", lineHeight: 1.5 }}
          />
        </div>
      </div>

      <div>
        <button
          onClick={handleSuggest}
          disabled={loading}
          style={{
            ...btnPrimary,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? <><Spinner />Summoning encounters…</> : "✦ Suggest Encounters"}
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {encounters.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 9,
            letterSpacing: 1.5,
            color: "rgba(200,149,42,.5)",
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(200,149,42,.15)",
            paddingBottom: 6,
          }}>
            3 Encounter Suggestions
          </div>
          {encounters.map((enc, i) => (
            <EncounterCard key={i} enc={enc} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main AITools Component ────────────────────────────────────────────────────

const TABS = [
  { id: "rules",      label: "Rules Assistant",    icon: "📜" },
  { id: "npc",        label: "NPC Generator",      icon: "🧙" },
  { id: "encounters", label: "Encounter Suggester", icon: "⚔" },
];

export default function AITools({ characters = [], onSaveToWiki }) {
  const [activeTab, setActiveTab] = useState("rules");

  return (
    <>
      {/* Inline keyframes for spinner */}
      <style>{`@keyframes dm-spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* API Key Panel (always visible at top) */}
        <ApiKeyPanel />

        {/* Sub-tab bar */}
        <div style={{
          display: "flex",
          gap: 0,
          borderBottom: "2px solid rgba(200,149,42,.25)",
          marginBottom: 16,
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? "rgba(200,149,42,.1)" : "none",
                border: "none",
                borderBottom: activeTab === t.id
                  ? "2px solid var(--gold)"
                  : "2px solid transparent",
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
              onMouseEnter={e => {
                if (activeTab !== t.id) e.currentTarget.style.color = "rgba(200,149,42,.75)";
              }}
              onMouseLeave={e => {
                if (activeTab !== t.id) e.currentTarget.style.color = "rgba(200,149,42,.4)";
              }}
            >
              <span style={{ fontSize: 13 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ ...panel, minHeight: 320 }}>
          {activeTab === "rules" && <RulesAssistant />}
          {activeTab === "npc" && <NPCGenerator onSaveToWiki={onSaveToWiki} />}
          {activeTab === "encounters" && <EncounterSuggester characters={characters} />}
        </div>
      </div>
    </>
  );
}
