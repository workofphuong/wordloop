// Persistence: one JSON object in localStorage, saved after every answer.
import { newState, looksLikeState } from './model.js';
import { makeSample } from './sample.js';

const KEY = 'revisit-vocab-trainer-v1';
let state = null;
export let storageError = null;

function fresh() {
  const s = newState();
  const sample = makeSample();
  s.lists.push(sample);
  s.activeListId = sample.id;
  s.settings.sampleSeeded = true;
  return s;
}

function load() {
  try {
    const raw = globalThis.localStorage && localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (looksLikeState(parsed)) return { ...newState(), ...parsed, settings: { ...newState().settings, ...parsed.settings } };
    }
  } catch (e) {
    storageError = e;
  }
  return fresh();
}

// Sample lists saved before readings existed get them filled in.
function backfillSampleReadings(s) {
  const sample = s.lists.find((l) => l.isSample);
  if (!sample) return;
  const fresh = new Map(makeSample().units.flatMap((u) => u.words).map((w) => [w.term, w.reading]));
  for (const u of sample.units) for (const w of u.words) if (!w.reading && fresh.get(w.term)) w.reading = fresh.get(w.term);
}

export function getState() {
  if (!state) {
    state = load();
    backfillSampleReadings(state);
  }
  return state;
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageError = null;
    return true;
  } catch (e) {
    storageError = e;
    return false;
  }
}

export function replaceState(next) {
  state = { ...newState(), ...next, settings: { ...newState().settings, ...next.settings } };
  save();
  return state;
}

export function activeList(s = getState()) {
  return s.lists.find((l) => l.id === s.activeListId) || s.lists[0] || null;
}
