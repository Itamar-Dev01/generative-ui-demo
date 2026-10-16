// ---------------------------------------------------------------------------
// Core types for the two Generative UI modes demonstrated in this repo.
//
// MODE 1 - "Library" (declarative / controlled):
//   The agent picks a component from a typed catalog and fills its schema.
//   The app renders a real, hand-designed React component with those props.
//
// MODE 2 - "On the fly" (open-ended):
//   No catalog component fits, so the agent composes a tree of low-level UI
//   primitives (heading, stat, bar, table, ...) that a generic renderer
//   walks and draws. In a production system this tree is what the LLM emits
//   as structured output (see A2UI / json-render / Vercel AI SDK).
// ---------------------------------------------------------------------------

export type JsonSchema = {
  type: string
  properties?: Record<string, JsonSchema>
  required?: string[]
  items?: JsonSchema
  enum?: string[]
  description?: string
}

export type ComponentSpec<P = any> = {
  /** kebab-case name the agent refers to */
  name: string
  /** one line: what it is for */
  description: string
  /** usage guidelines handed to the agent, like the post describes */
  guidelines: string
  /** JSON schema of the props the agent must fill */
  schema: JsonSchema
  /** the real React component */
  render: (props: P) => JSX.Element
  /** intents that should route here (demo router; a real LLM decides itself) */
  triggers: RegExp
  /** mock data filler - stands in for "the LLM fills the schema" */
  fill: (query: string) => P
}

// --- Mode 2: primitive UI tree ----------------------------------------------

export type UINode =
  | { kind: 'stack'; direction?: 'row' | 'column'; gap?: number; children: UINode[] }
  | { kind: 'card'; title?: string; children: UINode[] }
  | { kind: 'heading'; text: string; level?: 1 | 2 | 3 }
  | { kind: 'text'; text: string; muted?: boolean }
  | { kind: 'divider' }
  | { kind: 'stat'; label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'flat' }
  | { kind: 'bar'; label: string; value: number; max: number; hint?: string }
  | { kind: 'pill'; text: string; tone?: 'default' | 'good' | 'warn' | 'bad' }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'kv'; pairs: [string, string][] }
  | { kind: 'table'; columns: string[]; rows: string[][] }
  | { kind: 'button'; label: string; style?: 'primary' | 'ghost' }
  | { kind: 'progress'; label: string; pct: number }

// --- Agent response ----------------------------------------------------------

export type AgentReply =
  | { mode: 'library'; component: string; props: unknown; note: string }
  | { mode: 'generated'; tree: UINode; note: string }
  | { mode: 'text'; note: string }
