import { useState, useMemo } from "react";
import { genId } from "../../store.js";

const TYPE_ICONS = { Location: "📍", Faction: "⚔", NPC: "🧑" };
const TYPE_COLORS = { Location: "#4b9ee8", Faction: "#8b1a1a", NPC: "#4caf50" };

const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

function blankEntry(type) {
  return {
    id: genId(),
    type,
    name: "",
    description: "",
    tags: [],
    links: [],
    createdAt: new Date().toISOString(),
    // Location
    ...(type === "Location" ? { locationType: "City", notableFeatures: "" } : {}),
    // Faction
    ...(type === "Faction" ? { goals: "", keyMembers: "", alignment: "True Neutral", status: "Active" } : {}),
    // NPC
    ...(type === "NPC" ? {
      race: "", role: "", appearance: "", personalityTraits: "",
      secretMotivation: "", factionId: null, locationId: null,
    } : {}),
  };
}

// ─── Shared input styles ──────────────────────────────────────────────────────
const iStyle = {
  background: "rgba(245,230,200,.05)",
  border: "1px solid rgba(92,51,23,.4)",
  borderRadius: 3,
  color: "var(--vel)",
  fontFamily: "'IM Fell English',serif",
  fontSize: 13,
  padding: "5px 9px",
  outline: "none",
  width: "100%",
};
const taStyle = {
  ...iStyle,
  resize: "vertical",
  minHeight: 80,
  lineHeight: 1.55,
};
const lStyle = {
  fontFamily: "'Cinzel',serif",
  fontSize: 8,
  letterSpacing: 1.5,
  color: "var(--br)",
  textTransform: "uppercase",
  marginBottom: 3,
};
const selectStyle = {
  ...iStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={lStyle}>{label}</div>
      {children}
    </div>
  );
}

// ─── Entry Editor ─────────────────────────────────────────────────────────────
function EntryEditor({ entry, wiki, onSave, onDelete, onNavigate }) {
  const [form, setForm] = useState(entry);
  const [tagInput, setTagInput] = useState((entry.tags || []).join(", "));
  const [showLinkDrop, setShowLinkDrop] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Keep form in sync when switching entries
  useMemo(() => {
    setForm(entry);
    setTagInput((entry.tags || []).join(", "));
    setConfirmDelete(false);
  }, [entry.id]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const allEntries = Object.values(wiki).filter(e => e.id !== form.id);
  const linkedIds = new Set((form.links || []).map(l => l.targetId));
  const linkableEntries = allEntries.filter(e => !linkedIds.has(e.id));

  function handleSave() {
    const tags = tagInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
    onSave({ ...form, tags });
  }

  function handleAddLink(targetId) {
    const target = wiki[targetId];
    if (!target) return;
    const newLink = { type: target.type, targetId };
    f("links", [...(form.links || []), newLink]);
    setShowLinkDrop(false);
  }

  function handleRemoveLink(targetId) {
    f("links", (form.links || []).filter(l => l.targetId !== targetId));
  }

  const sectionHdr = (text) => (
    <div style={{
      fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 2,
      color: "var(--gold)", borderBottom: "1px solid rgba(200,149,42,.25)",
      paddingBottom: 4, marginBottom: 12, marginTop: 20, textTransform: "uppercase",
    }}>{text}</div>
  );

  return (
    <div style={{ padding: "0 2px" }}>
      {/* Type badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{
          fontFamily: "'Cinzel',serif", fontSize: 9, letterSpacing: 1.5,
          background: TYPE_COLORS[form.type] + "22",
          border: `1px solid ${TYPE_COLORS[form.type]}55`,
          color: TYPE_COLORS[form.type], borderRadius: 3, padding: "2px 10px",
          textTransform: "uppercase",
        }}>
          {TYPE_ICONS[form.type]} {form.type}
        </span>
        <span style={{ fontSize: 9, color: "rgba(245,230,200,.2)", fontFamily: "'IM Fell English',serif", fontStyle: "italic" }}>
          Created {new Date(form.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Name */}
      <Field label="Name">
        <input
          style={{ ...iStyle, fontSize: 18, fontFamily: "'Cinzel',serif", color: "var(--gold)" }}
          value={form.name}
          onChange={e => f("name", e.target.value)}
          placeholder="Entry name…"
        />
      </Field>

      {/* Description */}
      <Field label="Description">
        <textarea
          style={{ ...taStyle, minHeight: 100 }}
          value={form.description}
          onChange={e => f("description", e.target.value)}
          placeholder="Describe this entry…"
        />
      </Field>

      {/* Tags */}
      <Field label="Tags (comma-separated)">
        <input
          style={iStyle}
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          placeholder="e.g. forest, ancient, cursed"
        />
        {tagInput.split(",").map(t => t.trim()).filter(Boolean).length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
            {tagInput.split(",").map(t => t.trim()).filter(Boolean).map((tag, i) => (
              <span key={i} style={{
                background: "rgba(200,149,42,.12)", border: "1px solid rgba(200,149,42,.3)",
                color: "var(--gold)", borderRadius: 12, padding: "1px 9px",
                fontSize: 10, fontFamily: "'IM Fell English',serif",
              }}>{tag}</span>
            ))}
          </div>
        )}
      </Field>

      {/* ── Location-specific ──────────────────────────────────────── */}
      {form.type === "Location" && (
        <>
          {sectionHdr("Location Details")}
          <Field label="Location Type">
            <select style={selectStyle} value={form.locationType || "City"} onChange={e => f("locationType", e.target.value)}>
              {["City", "Town", "Village", "Dungeon", "Wilderness", "Other"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Notable Features">
            <textarea style={taStyle} value={form.notableFeatures || ""} onChange={e => f("notableFeatures", e.target.value)} placeholder="What makes this place memorable?" />
          </Field>
        </>
      )}

      {/* ── Faction-specific ───────────────────────────────────────── */}
      {form.type === "Faction" && (
        <>
          {sectionHdr("Faction Details")}
          <Field label="Goals">
            <textarea style={taStyle} value={form.goals || ""} onChange={e => f("goals", e.target.value)} placeholder="What does this faction want?" />
          </Field>
          <Field label="Key Members">
            <textarea style={taStyle} value={form.keyMembers || ""} onChange={e => f("keyMembers", e.target.value)} placeholder="Notable members and their roles…" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Alignment">
              <select style={selectStyle} value={form.alignment || "True Neutral"} onChange={e => f("alignment", e.target.value)}>
                {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select style={selectStyle} value={form.status || "Active"} onChange={e => f("status", e.target.value)}>
                {["Active", "Disbanded", "Unknown"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </>
      )}

      {/* ── NPC-specific ───────────────────────────────────────────── */}
      {form.type === "NPC" && (
        <>
          {sectionHdr("NPC Details")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Race">
              <input style={iStyle} value={form.race || ""} onChange={e => f("race", e.target.value)} placeholder="e.g. Human, Elf…" />
            </Field>
            <Field label="Role / Class">
              <input style={iStyle} value={form.role || ""} onChange={e => f("role", e.target.value)} placeholder="e.g. Innkeeper, Wizard…" />
            </Field>
          </div>
          <Field label="Appearance">
            <textarea style={taStyle} value={form.appearance || ""} onChange={e => f("appearance", e.target.value)} placeholder="Physical description…" />
          </Field>
          <Field label="Personality Traits">
            <textarea style={taStyle} value={form.personalityTraits || ""} onChange={e => f("personalityTraits", e.target.value)} placeholder="How they act and speak…" />
          </Field>
          <Field label="Secret Motivation">
            <textarea style={{ ...taStyle, borderColor: "rgba(139,26,26,.4)" }} value={form.secretMotivation || ""} onChange={e => f("secretMotivation", e.target.value)} placeholder="What they truly want (hidden from players)…" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Faction">
              <select style={selectStyle} value={form.factionId || ""} onChange={e => f("factionId", e.target.value || null)}>
                <option value="">— None —</option>
                {Object.values(wiki).filter(e => e.type === "Faction").sort((a, b) => a.name.localeCompare(b.name)).map(fac => (
                  <option key={fac.id} value={fac.id}>{fac.name || "(unnamed)"}</option>
                ))}
              </select>
            </Field>
            <Field label="Location">
              <select style={selectStyle} value={form.locationId || ""} onChange={e => f("locationId", e.target.value || null)}>
                <option value="">— None —</option>
                {Object.values(wiki).filter(e => e.type === "Location").sort((a, b) => a.name.localeCompare(b.name)).map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name || "(unnamed)"}</option>
                ))}
              </select>
            </Field>
          </div>
        </>
      )}

      {/* ── Linked Entries ─────────────────────────────────────────── */}
      {sectionHdr("Linked Entries")}
      <div style={{ marginBottom: 12 }}>
        {(form.links || []).length === 0 && (
          <div style={{ fontSize: 11, color: "rgba(245,230,200,.25)", fontStyle: "italic", marginBottom: 8 }}>
            No linked entries yet.
          </div>
        )}
        {(form.links || []).map(link => {
          const target = wiki[link.targetId];
          if (!target) return null;
          return (
            <div key={link.targetId} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 10px", marginBottom: 4,
              background: "rgba(26,10,2,.5)", border: "1px solid rgba(92,51,23,.3)",
              borderRadius: 3,
            }}>
              <span style={{ fontSize: 13 }}>{TYPE_ICONS[target.type]}</span>
              <span
                onClick={() => onNavigate(target.id)}
                style={{
                  flex: 1, fontFamily: "'Cinzel',serif", fontSize: 11,
                  color: "var(--gold)", cursor: "pointer", textDecoration: "underline",
                  textDecorationColor: "rgba(200,149,42,.3)",
                }}
              >
                {target.name || "(unnamed)"}
              </span>
              <span style={{ fontSize: 9, color: "rgba(245,230,200,.3)", fontFamily: "'Cinzel',serif" }}>{target.type}</span>
              <button
                onClick={() => handleRemoveLink(link.targetId)}
                style={{
                  background: "none", border: "none", color: "rgba(139,26,26,.6)",
                  cursor: "pointer", fontSize: 13, padding: "0 2px", lineHeight: 1,
                }}
                title="Remove link"
              >✕</button>
            </div>
          );
        })}

        {/* Add link */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setShowLinkDrop(v => !v)}
            disabled={linkableEntries.length === 0}
            style={{
              background: "rgba(200,149,42,.08)", border: "1px solid rgba(200,149,42,.3)",
              color: linkableEntries.length === 0 ? "rgba(200,149,42,.25)" : "var(--gold)",
              borderRadius: 3, cursor: linkableEntries.length === 0 ? "default" : "pointer",
              fontFamily: "'Cinzel',serif", fontSize: 9, padding: "4px 14px", letterSpacing: .5,
            }}
          >
            + Add Link
          </button>
          {showLinkDrop && linkableEntries.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, zIndex: 50, marginTop: 4,
              background: "#1a0802", border: "1px solid rgba(92,51,23,.5)",
              borderRadius: 4, minWidth: 240, maxHeight: 200, overflowY: "auto",
              boxShadow: "0 4px 16px rgba(0,0,0,.6)",
            }}>
              {linkableEntries.sort((a, b) => a.name.localeCompare(b.name)).map(e => (
                <div
                  key={e.id}
                  onClick={() => handleAddLink(e.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px", cursor: "pointer",
                    borderBottom: "1px solid rgba(92,51,23,.2)",
                    transition: "background .12s",
                  }}
                  onMouseEnter={ev => ev.currentTarget.style.background = "rgba(200,149,42,.1)"}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 13 }}>{TYPE_ICONS[e.type]}</span>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: "var(--vel)", flex: 1 }}>
                    {e.name || "(unnamed)"}
                  </span>
                  <span style={{ fontSize: 8, color: "rgba(245,230,200,.3)", fontFamily: "'Cinzel',serif" }}>{e.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Action Buttons ─────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(92,51,23,.3)" }}>
        <button
          onClick={handleSave}
          style={{
            background: "var(--gold)", border: "none", color: "var(--ink)",
            borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
            fontSize: 10, padding: "8px 22px", fontWeight: 700, letterSpacing: .5,
          }}
        >
          ✦ Save Changes
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              background: "none", border: "1px solid rgba(139,26,26,.5)",
              color: "var(--cr)", borderRadius: 3, cursor: "pointer",
              fontFamily: "'Cinzel',serif", fontSize: 10, padding: "8px 18px",
            }}
          >
            ✕ Delete Entry
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "var(--crl)", fontFamily: "'Cinzel',serif" }}>Confirm?</span>
            <button
              onClick={() => onDelete(form.id)}
              style={{
                background: "var(--cr)", border: "none", color: "#fff",
                borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
                fontSize: 10, padding: "6px 14px",
              }}
            >Yes, Delete</button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                background: "none", border: "1px solid rgba(92,51,23,.4)",
                color: "var(--br)", borderRadius: 3, cursor: "pointer",
                fontFamily: "'Cinzel',serif", fontSize: 10, padding: "6px 12px",
              }}
            >Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Wiki Component ──────────────────────────────────────────────────────
export default function Wiki({ wiki, onSave, onDelete }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [tagFilter, setTagFilter] = useState(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const entries = Object.values(wiki || {});

  // All unique tags
  const allTags = useMemo(() => {
    const set = new Set();
    entries.forEach(e => (e.tags || []).forEach(t => set.add(t)));
    return [...set].sort();
  }, [entries]);

  // Filtered + searched entries
  const filtered = useMemo(() => {
    return entries.filter(e => {
      if (filterType !== "All" && e.type !== filterType) return false;
      if (tagFilter && !(e.tags || []).includes(tagFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        const inName = (e.name || "").toLowerCase().includes(q);
        const inDesc = (e.description || "").toLowerCase().includes(q);
        const inTags = (e.tags || []).some(t => t.toLowerCase().includes(q));
        if (!inName && !inDesc && !inTags) return false;
      }
      return true;
    }).sort((a, b) => {
      // Group by type, then by name
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [entries, filterType, tagFilter, search]);

  // Group for display
  const grouped = useMemo(() => {
    const g = { Location: [], Faction: [], NPC: [] };
    filtered.forEach(e => { if (g[e.type]) g[e.type].push(e); });
    return g;
  }, [filtered]);

  const selectedEntry = selectedId ? wiki[selectedId] : null;

  function handleNewEntry(type) {
    const entry = blankEntry(type);
    onSave(entry);
    setSelectedId(entry.id);
    setShowTypeMenu(false);
  }

  function handleDelete(id) {
    onDelete(id);
    setSelectedId(null);
  }

  function handleNavigate(id) {
    setSelectedId(id);
  }

  const FILTER_TABS = ["All", "Locations", "Factions", "NPCs"];
  const TAB_TYPE_MAP = { All: "All", Locations: "Location", Factions: "Faction", NPCs: "NPC" };

  return (
    <div style={{ display: "flex", gap: 0, height: "100%", minHeight: 500 }}>
      {/* ── Left Sidebar ────────────────────────────────────────────── */}
      <div style={{
        width: 240, flexShrink: 0, borderRight: "1px solid rgba(92,51,23,.35)",
        display: "flex", flexDirection: "column", background: "#140800",
        borderRadius: "4px 0 0 4px", overflow: "hidden",
      }}>

        {/* Search */}
        <div style={{ padding: "12px 10px 8px" }}>
          <input
            style={{
              ...iStyle,
              fontSize: 11, padding: "6px 10px",
              background: "rgba(245,230,200,.04)",
            }}
            placeholder="🔍 Search wiki…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(92,51,23,.3)", padding: "0 8px" }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(TAB_TYPE_MAP[tab])}
              style={{
                flex: 1, background: "none", border: "none",
                borderBottom: `2px solid ${filterType === TAB_TYPE_MAP[tab] ? "var(--gold)" : "transparent"}`,
                color: filterType === TAB_TYPE_MAP[tab] ? "var(--gold)" : "rgba(245,230,200,.35)",
                fontFamily: "'Cinzel',serif", fontSize: 7.5, letterSpacing: 0.5,
                padding: "7px 2px", cursor: "pointer", textTransform: "uppercase",
                transition: "all .15s",
              }}
            >{tab}</button>
          ))}
        </div>

        {/* Tag filter chips */}
        {allTags.length > 0 && (
          <div style={{ padding: "8px 10px 4px", borderBottom: "1px solid rgba(92,51,23,.2)" }}>
            <div style={{ ...lStyle, marginBottom: 5 }}>Tags</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {allTags.map(tag => (
                <span
                  key={tag}
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  style={{
                    background: tagFilter === tag ? "rgba(200,149,42,.2)" : "rgba(245,230,200,.04)",
                    border: `1px solid ${tagFilter === tag ? "rgba(200,149,42,.5)" : "rgba(92,51,23,.3)"}`,
                    color: tagFilter === tag ? "var(--gold)" : "rgba(245,230,200,.4)",
                    borderRadius: 10, padding: "1px 7px", fontSize: 9,
                    fontFamily: "'IM Fell English',serif", cursor: "pointer",
                    transition: "all .12s",
                  }}
                >{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* + Add button */}
        <div style={{ padding: "10px 10px 6px", position: "relative" }}>
          <button
            onClick={() => setShowTypeMenu(v => !v)}
            style={{
              width: "100%", background: "rgba(200,149,42,.12)",
              border: "1px solid rgba(200,149,42,.4)", color: "var(--gold)",
              borderRadius: 3, cursor: "pointer", fontFamily: "'Cinzel',serif",
              fontSize: 9, padding: "7px 0", letterSpacing: 1, textTransform: "uppercase",
              fontWeight: 700,
            }}
          >+ Add Entry</button>
          {showTypeMenu && (
            <div style={{
              position: "absolute", top: "100%", left: 10, right: 10, zIndex: 50,
              background: "#1a0802", border: "1px solid rgba(92,51,23,.5)",
              borderRadius: 4, overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,.7)",
            }}>
              {["Location", "Faction", "NPC"].map(type => (
                <button
                  key={type}
                  onClick={() => handleNewEntry(type)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", background: "none", border: "none",
                    borderBottom: "1px solid rgba(92,51,23,.2)",
                    color: "var(--vel)", cursor: "pointer",
                    fontFamily: "'Cinzel',serif", fontSize: 10,
                    padding: "9px 14px", textAlign: "left",
                    transition: "background .12s",
                  }}
                  onMouseEnter={ev => ev.currentTarget.style.background = "rgba(200,149,42,.1)"}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                >
                  <span>{TYPE_ICONS[type]}</span>
                  <span>{type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entry list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px 12px" }}>
          {entries.length === 0 && (
            <div style={{
              padding: "20px 10px", textAlign: "center",
              color: "rgba(245,230,200,.2)", fontFamily: "'IM Fell English',serif",
              fontStyle: "italic", fontSize: 11, lineHeight: 1.6,
            }}>
              No entries yet.<br />Click "+ Add Entry"<br />to get started.
            </div>
          )}
          {filtered.length === 0 && entries.length > 0 && (
            <div style={{
              padding: "20px 10px", textAlign: "center",
              color: "rgba(245,230,200,.2)", fontFamily: "'IM Fell English',serif",
              fontStyle: "italic", fontSize: 11,
            }}>
              No entries match your search.
            </div>
          )}

          {["Location", "Faction", "NPC"].map(type => {
            const group = grouped[type];
            if (!group || group.length === 0) return null;
            return (
              <div key={type} style={{ marginBottom: 8 }}>
                <div style={{
                  fontFamily: "'Cinzel',serif", fontSize: 7, letterSpacing: 2,
                  color: "rgba(245,230,200,.2)", textTransform: "uppercase",
                  padding: "6px 4px 3px",
                }}>
                  {TYPE_ICONS[type]} {type}s
                </div>
                {group.map(e => (
                  <div
                    key={e.id}
                    onClick={() => setSelectedId(e.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "6px 8px", borderRadius: 3, marginBottom: 2,
                      background: selectedId === e.id ? "rgba(200,149,42,.13)" : "rgba(26,10,2,.4)",
                      border: `1px solid ${selectedId === e.id ? "var(--gold)" : "rgba(92,51,23,.25)"}`,
                      borderLeft: `3px solid ${TYPE_COLORS[e.type]}`,
                      cursor: "pointer", transition: "all .13s",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Cinzel',serif", fontSize: 10,
                        color: selectedId === e.id ? "var(--gold)" : "var(--vel)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {e.name || <span style={{ opacity: .4, fontStyle: "italic" }}>(unnamed)</span>}
                      </div>
                      {(e.tags || []).length > 0 && (
                        <div style={{
                          fontSize: 8, color: "rgba(245,230,200,.3)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          fontFamily: "'IM Fell English',serif",
                        }}>
                          {e.tags.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main Panel ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {!selectedEntry ? (
          entries.length === 0 ? (
            // Empty state
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", minHeight: 300,
              color: "rgba(245,230,200,.2)", textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'Cinzel Decorative',serif", fontSize: 22,
                color: "rgba(200,149,42,.2)", marginBottom: 14,
              }}>World Wiki</div>
              <div style={{
                fontFamily: "'IM Fell English',serif", fontSize: 14, fontStyle: "italic",
                lineHeight: 1.8, marginBottom: 24,
              }}>
                Your world is a blank canvas.<br />
                Add Locations, Factions, and NPCs<br />
                to build your campaign lore.
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {["Location", "Faction", "NPC"].map(type => (
                  <button
                    key={type}
                    onClick={() => handleNewEntry(type)}
                    style={{
                      background: "rgba(200,149,42,.1)", border: "1px solid rgba(200,149,42,.35)",
                      color: "var(--gold)", borderRadius: 4, cursor: "pointer",
                      fontFamily: "'Cinzel',serif", fontSize: 10, padding: "10px 18px",
                      letterSpacing: .5,
                    }}
                  >
                    {TYPE_ICONS[type]} Add {type}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Nothing selected yet
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", minHeight: 300,
              color: "rgba(245,230,200,.15)", fontFamily: "'IM Fell English',serif",
              fontStyle: "italic", fontSize: 14, textAlign: "center",
              border: "1px dashed rgba(92,51,23,.2)", borderRadius: 4,
            }}>
              Select an entry from the sidebar<br />to view and edit it.
            </div>
          )
        ) : (
          <>
            <div style={{
              fontFamily: "'Cinzel Decorative',serif", color: "var(--gold)",
              fontSize: 13, marginBottom: 20, paddingBottom: 12,
              borderBottom: "1px solid rgba(200,149,42,.2)",
            }}>
              {selectedEntry.name || <span style={{ opacity: .4 }}>(New {selectedEntry.type})</span>}
            </div>
            <EntryEditor
              key={selectedEntry.id}
              entry={selectedEntry}
              wiki={wiki}
              onSave={onSave}
              onDelete={handleDelete}
              onNavigate={handleNavigate}
            />
          </>
        )}
      </div>
    </div>
  );
}
