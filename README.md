# Generative UI Demo - the two modes

A small chat app where the agent answers with **real UI instead of a wall of text**.
It demonstrates the two approaches side by side:

## ① Library mode (declarative)

The agent picks a component from a typed catalog and fills its JSON schema.
The app renders a hand-designed React component with those props.

Each catalog entry (`src/agent/library.tsx`) ships exactly what the post describes:

- `name` + `description` - what the component is for
- `guidelines` - usage rules handed to the agent ("use flight-list for several options")
- `schema` - the JSON schema the agent must fill
- `render` - the real, designed component

36 components included:
flight-card, hotel-card, weather-widget, kanban-board, stat-chart,
comparison-table, pricing-table, timeline, profile-card, checklist, quote-card,
map-card, restaurant-card, event-card, stock-ticker, news-list, podcast-card,
book-card, movie-card, recipe-card, expense-summary, currency-converter,
rating-breakdown, alert-banner, goal-rings, stepper, faq-accordion, file-list,
shipping-tracker, poll-card, countdown-card, phrase-card, code-snippet,
route-card, color-palette, pros-cons.

## ② On-the-fly mode (open-ended)

When **no** library component fits the intent, the agent doesn't fall back to
plain text - it composes a tree of low-level primitives (`stack`, `card`,
`stat`, `bar`, `table`, `progress`, `pill`, ...) and a generic renderer
(`src/agent/GenerativeRenderer.tsx`) draws it. The renderer only knows the
primitive vocabulary, so anything the agent emits renders safely - no `eval`,
no injected code. Dashed amber border marks generated UI; solid border marks
library components.

Try: "Review my portfolio" or "Track my gym habits" - no component exists for
those, so the interface is composed live.

## The agent

`src/agent/mockAgent.ts` is a mock so the demo runs fully offline, no API key.
In production you swap `respond()` for a model call:

- **Mode 1** - the model receives the catalog (names, guidelines, schemas) and
  returns structured props: Vercel AI SDK `generateObject`, OpenAI structured
  outputs, or CopilotKit's Jev-style intent -> component routing.
- **Mode 2** - the model emits the `UINode` tree directly (the A2UI /
  json-render pattern: the LLM speaks a UI grammar, the client renders it).

The rendering layers don't change - only who fills the schema / writes the tree.

## Inspector

Every agent UI message has a **View JSON** button showing the exact payload the
agent produced - the filled schema (mode 1) or the raw UI tree (mode 2).
The **Component library** button in the header shows every component with its
guidelines and schema, i.e. what the agent "sees".

## Run

```bash
npm install
npm run dev
```

## References

- Vercel AI SDK - Generative UI: https://vercel.com/blog/ai-sdk-3-generative-ui
- A2UI protocol: https://a2ui.org/
- json-render: https://json-render.dev/
- CopilotKit Jev cookbook: https://docs.copilotkit.ai/cookbook/jev-generative-ui
- Google Research, Generative UI: https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/
