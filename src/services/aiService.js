// ─── Anthropic API Service Layer ──────────────────────────────────────────────
// Thin wrapper around the Anthropic Messages API.
// All AI modules (Rules Assistant, NPC Generator, Encounter Suggester) call
// through this wrapper — never the API directly.
//
// API key is stored in localStorage under 'dm_forge_api_key' and never in
// the main store blob.

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001'; // Fast, cost-effective for table-side use

export const API_KEY_STORAGE = 'dm_forge_api_key';

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
}

/**
 * Core fetch wrapper. Throws a user-friendly Error on any failure.
 * @param {Array} messages - Anthropic messages array
 * @param {string} systemPrompt - System prompt string
 * @param {number} maxTokens - Max tokens for response
 * @returns {Promise<string>} - The assistant text response
 */
async function callAPI(messages, systemPrompt, maxTokens = 1024) {
  const key = getApiKey();
  if (!key) {
    throw new Error('No API key set. Enter your Anthropic API key in the AI Tools settings.');
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    });
  } catch (networkErr) {
    throw new Error('Network error — check your internet connection and try again.');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const err = await response.json();
      detail = err?.error?.message || JSON.stringify(err);
    } catch {
      detail = `HTTP ${response.status}`;
    }
    if (response.status === 401) throw new Error('Invalid API key. Check your Anthropic API key and try again.');
    if (response.status === 429) throw new Error('Rate limit reached. Wait a moment and try again.');
    throw new Error(`API error: ${detail}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Unexpected response from API — could not parse JSON.');
  }

  const text = data?.content?.[0]?.text;
  if (!text) throw new Error('Empty response from API.');
  return text;
}

// ─── Rules Assistant ──────────────────────────────────────────────────────────

const RULES_SYSTEM = `You are an expert Dungeon Master assistant for D&D 5e (2024 Player's Handbook rules).
Answer rules questions clearly and accurately. Always:
1. Give a direct answer first
2. Cite the relevant rule section or mechanic by name (e.g. "per the Grappling rules", "per the Concentration rules")
3. Handle edge cases and multi-step rule interactions explicitly
4. Keep answers concise — DMs need fast answers at the table
5. If a 2024 PHB rule differs significantly from 2014, note that
Be precise, cite sources by name, and be helpful to a DM running a live session.`;

/**
 * Send a message to the rules assistant.
 * @param {Array} history - Prior messages [{role, content}]
 * @param {string} userMessage - New user question
 * @returns {Promise<string>}
 */
export async function askRulesAssistant(history, userMessage) {
  const messages = [...history, { role: 'user', content: userMessage }];
  return callAPI(messages, RULES_SYSTEM, 800);
}

// ─── NPC Generator ────────────────────────────────────────────────────────────

const NPC_SYSTEM = `You are a creative D&D NPC generator. Given race, class, and alignment, produce a vivid NPC profile.
Respond ONLY with valid JSON matching this exact schema:
{
  "name": "string",
  "appearance": "string (2-3 sentences, specific and visual)",
  "personalityTraits": "string (2-3 distinct traits, specific and interesting)",
  "secretMotivation": "string (1-2 sentences, something the NPC hides from the party)"
}
No markdown, no explanation — raw JSON only.`;

/**
 * Generate a full NPC profile.
 * @param {{ race: string, class: string, alignment: string }} params
 * @returns {Promise<{ name, appearance, personalityTraits, secretMotivation }>}
 */
export async function generateNPC(params) {
  const { race, npcClass, alignment } = params;
  const prompt = `Generate a D&D NPC: Race: ${race}, Class/Role: ${npcClass}, Alignment: ${alignment}`;
  const text = await callAPI([{ role: 'user', content: prompt }], NPC_SYSTEM, 600);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Could not parse NPC response. Try again.');
  }
}

/**
 * Regenerate a single field of an existing NPC profile.
 * @param {object} existingProfile - Current NPC fields
 * @param {string} field - Which field to regenerate: 'name'|'appearance'|'personalityTraits'|'secretMotivation'
 * @param {{ race, npcClass, alignment }} params - Original generation params
 * @returns {Promise<string>} - New value for that field
 */
export async function regenerateNPCField(existingProfile, field, params) {
  const { race, npcClass, alignment } = params;
  const fieldSystem = `You are a D&D NPC generator. Regenerate ONLY the "${field}" field for an existing NPC.
Respond with ONLY the new value as a plain string — no JSON wrapper, no explanation.
Existing profile for context: Name: ${existingProfile.name}, Appearance: ${existingProfile.appearance},
Personality: ${existingProfile.personalityTraits}, Secret: ${existingProfile.secretMotivation}`;
  const prompt = `Regenerate the ${field} for: Race: ${race}, Class: ${npcClass}, Alignment: ${alignment}`;
  return callAPI([{ role: 'user', content: prompt }], fieldSystem, 300);
}

// ─── Encounter Suggester ──────────────────────────────────────────────────────

const ENCOUNTER_SYSTEM = `You are a creative D&D encounter designer. Given party details and context, suggest interesting encounters.
Respond ONLY with valid JSON — an array of exactly 3 encounter suggestions:
[
  {
    "title": "string (short, evocative name)",
    "monsters": "string (monster names and rough quantities, e.g. '2 Ogres and 4 Goblins')",
    "hook": "string (2-3 sentences — narrative hook that slots this encounter into the story)"
  }
]
No markdown, no explanation — raw JSON array only.`;

/**
 * Get AI encounter suggestions.
 * @param {{ partyLevel: number, partySize: number, context: string }} params
 * @returns {Promise<Array<{ title, monsters, hook }>>}
 */
export async function suggestEncounters(params) {
  const { partyLevel, partySize, context } = params;
  const prompt = `Party: Level ${partyLevel}, ${partySize} players. Context: ${context}. Suggest 3 encounters.`;
  const text = await callAPI([{ role: 'user', content: prompt }], ENCOUNTER_SYSTEM, 800);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Could not parse encounter suggestions. Try again.');
  }
}
