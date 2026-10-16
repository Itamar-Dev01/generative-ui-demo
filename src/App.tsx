import { useMemo, useRef, useState } from 'react'
import { respond } from './agent/mockAgent'
import { library } from './agent/library'
import { GenerativeRenderer } from './agent/GenerativeRenderer'
import type { AgentReply } from './agent/types'

type Msg =
  | { role: 'user'; text: string }
  | { role: 'agent'; reply: AgentReply }

const SUGGESTIONS = [
  'Find me a flight to Bangkok',
  'Weather in Chiang Mai this week',
  'Show the sprint board',
  'Weekly signup chart',
  'Compare Tailwind vs CSS Modules',
  'Track my package',
  'Colors for a fintech brand',
  'How do I say not spicy in Thai',
  'Review my portfolio',          // -> on the fly
  'Track my gym habits',          // -> on the fly
]

export default function App() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'agent', reply: { mode: 'text', note: 'Ask me something. If a library component fits, I fill its schema. If not, I build the UI on the fly. Try the chips below.' } },
  ])
  const [input, setInput] = useState('')
  const [inspector, setInspector] = useState<number | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const send = (text: string) => {
    const q = text.trim()
    if (!q) return
    const reply = respond(q)
    setMsgs((m) => [...m, { role: 'user', text: q }, { role: 'agent', reply }])
    setInput('')
    setInspector(msgs.length + 1)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const inspected = useMemo(() => (inspector != null ? (msgs[inspector] as Extract<Msg, { role: 'agent' }>) : null), [inspector, msgs])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <b>Generative UI</b>
          <span className="muted">two modes, one chat</span>
        </div>
        <button className="ghost-btn" onClick={() => setShowLibrary((v) => !v)}>
          {showLibrary ? 'Close library' : `Component library (${library.length})`}
        </button>
      </header>

      <div className="layout">
        <main className="chat">
          <div className="messages">
            {msgs.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="msg user"><div className="bubble">{m.text}</div></div>
              ) : (
                <div key={i} className="msg agent">
                  <div className="bubble">
                    <p className="note">{m.reply.note}</p>
                    {m.reply.mode === 'library' && (() => {
                      const spec = library.find((c) => c.name === (m.reply as any).component)!
                      return <div className="ui-frame">{spec.render(m.reply.props)}</div>
                    })()}
                    {m.reply.mode === 'generated' && (
                      <div className="ui-frame generated"><GenerativeRenderer node={m.reply.tree} /></div>
                    )}
                    {m.reply.mode !== 'text' && (
                      <div className="msg-foot">
                        <span className={`mode-badge ${m.reply.mode}`}>
                          {m.reply.mode === 'library' ? '① library component' : '② generated on the fly'}
                        </span>
                        <button className="ghost-btn small" onClick={() => setInspector(inspector === i ? null : i)}>
                          {inspector === i ? 'Hide JSON' : 'View JSON'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chips">
            {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}
          </div>

          <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input) }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." autoFocus />
            <button type="submit">Send</button>
          </form>
        </main>

        {inspector != null && inspected?.role === 'agent' && inspected.reply.mode !== 'text' && (
          <aside className="inspector">
            <div className="inspector-head">
              <b>{inspected.reply.mode === 'library' ? `schema: ${(inspected.reply as any).component}` : 'generated UI tree'}</b>
              <button className="ghost-btn small" onClick={() => setInspector(null)}>✕</button>
            </div>
            <pre>{JSON.stringify(inspected.reply.mode === 'library' ? (inspected.reply as any).props : (inspected.reply as any).tree, null, 2)}</pre>
          </aside>
        )}

        {showLibrary && (
          <aside className="inspector">
            <div className="inspector-head"><b>Component library</b><button className="ghost-btn small" onClick={() => setShowLibrary(false)}>✕</button></div>
            <div className="lib-list">
              {library.map((c) => (
                <details key={c.name} className="lib-item">
                  <summary><b>{c.name}</b></summary>
                  <p>{c.description}</p>
                  <p className="muted"><i>Guidelines: {c.guidelines}</i></p>
                  <pre>{JSON.stringify(c.schema, null, 2)}</pre>
                </details>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
