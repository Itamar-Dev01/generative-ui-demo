// ---------------------------------------------------------------------------
// The mock agent. It stands in for an LLM so the demo runs fully offline.
//
// A production version replaces `respond()` with a model call:
//   - Mode 1: the model gets the catalog (name, description, guidelines,
//     schema) and returns structured props (Vercel AI SDK generateObject,
//     OpenAI structured outputs, etc.).
//   - Mode 2: when no component fits, the model emits a UINode tree from the
//     primitive vocabulary (the A2UI / json-render pattern).
// The rendering layers on both sides stay exactly the same.
// ---------------------------------------------------------------------------
import { findComponent } from './library'
import type { AgentReply, UINode } from './types'

// Mode 2: "no component fits - build it anyway."
// A real LLM would compose this tree freely; here a few hand-written
// composers prove the renderer can draw arbitrary trees it never saw before.
function composeOnTheFly(query: string): UINode {
  const q = query.toLowerCase()

  if (/portfolio|resume|cv/.test(q)) {
    return {
      kind: 'stack', direction: 'column', gap: 12, children: [
        { kind: 'heading', level: 2, text: 'Portfolio review - generated on the fly' },
        { kind: 'text', muted: true, text: 'No portfolio component exists in the library, so the agent composed this view from primitives.' },
        { kind: 'stack', direction: 'row', gap: 12, children: [
          { kind: 'stat', label: 'Case studies', value: '4', delta: '+1 this month', trend: 'up' },
          { kind: 'stat', label: 'Avg. read time', value: '3:12', trend: 'flat' },
          { kind: 'stat', label: 'Bounce', value: '31%', delta: '-6%', trend: 'up' },
        ]},
        { kind: 'card', title: 'What to fix first', children: [
          { kind: 'bar', label: 'Hero clarity', value: 6, max: 10 },
          { kind: 'bar', label: 'Mobile nav', value: 4, max: 10 },
          { kind: 'bar', label: 'CTA visibility', value: 8, max: 10 },
        ]},
        { kind: 'button', label: 'Open full audit', style: 'primary' },
      ],
    }
  }

  if (/habit|gym|workout|run streak/.test(q)) {
    return {
      kind: 'stack', direction: 'column', gap: 12, children: [
        { kind: 'heading', level: 2, text: 'Habit tracker - composed live' },
        { kind: 'text', muted: true, text: 'Built from primitives because the library has no habit component.' },
        { kind: 'progress', label: 'Runs this week', pct: 75 },
        { kind: 'progress', label: 'Gym sessions', pct: 50 },
        { kind: 'progress', label: 'Reading', pct: 90 },
        { kind: 'stack', direction: 'row', gap: 8, children: [
          { kind: 'pill', text: '12-day streak', tone: 'good' },
          { kind: 'pill', text: 'Best: 21 days', tone: 'default' },
        ]},
      ],
    }
  }

  if (/font|typography|type scale/.test(q)) {
    return {
      kind: 'stack', direction: 'column', gap: 12, children: [
        { kind: 'heading', level: 2, text: 'Type scale proposal' },
        { kind: 'text', muted: true, text: 'Generated view: no typography component in the catalog.' },
        { kind: 'table', columns: ['Token', 'Size', 'Use'], rows: [
          ['display', '48/56', 'Hero only'],
          ['h1', '32/40', 'Page titles'],
          ['body', '16/24', 'Default text'],
          ['caption', '13/18', 'Metadata'],
        ]},
        { kind: 'kv', pairs: [['Pairing', 'Space Grotesk + Inter'], ['Base', '16px'], ['Scale', '1.25 (major third)']] },
      ],
    }
  }

  // Generic fallback: prove the mechanism on ANY query by reflecting it back
  // as a small dashboard assembled from primitives.
  return {
    kind: 'stack', direction: 'column', gap: 12, children: [
      { kind: 'heading', level: 2, text: 'Composed on the fly' },
      { kind: 'text', text: `No library component matches "${query}", so the agent built this interface from primitive blocks instead of falling back to plain text.` },
      { kind: 'divider' },
      { kind: 'card', title: 'How this answer was made', children: [
        { kind: 'list', ordered: true, items: [
          'Intent parsed from your message',
          'Catalog checked - no schema fits',
          'Agent emitted a JSON tree of primitives',
          'Generic renderer drew it, sandboxed',
        ]},
      ]},
      { kind: 'stack', direction: 'row', gap: 8, children: [
        { kind: 'pill', text: 'mode: open-ended', tone: 'warn' },
        { kind: 'pill', text: 'no hand-written component', tone: 'default' },
      ]},
    ],
  }
}

export function respond(query: string): AgentReply {
  const spec = findComponent(query)
  if (spec) {
    return {
      mode: 'library',
      component: spec.name,
      props: spec.fill(query),
      note: `Picked "${spec.name}" from the library and filled its schema.`,
    }
  }
  return {
    mode: 'generated',
    tree: composeOnTheFly(query),
    note: 'No library component fits - composed a UI tree on the fly.',
  }
}
