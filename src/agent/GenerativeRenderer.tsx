// MODE 2 renderer: walks a UINode tree and draws it. It only knows the
// primitive vocabulary, so anything the agent composes from those primitives
// renders safely - no eval, no injected code.
import type { UINode } from './types'

export function GenerativeRenderer({ node }: { node: UINode }) {
  switch (node.kind) {
    case 'stack':
      return (
        <div className={`gr-stack gr-${node.direction ?? 'column'}`} style={{ gap: node.gap ?? 8 }}>
          {node.children.map((c, i) => <GenerativeRenderer key={i} node={c} />)}
        </div>
      )
    case 'card':
      return (
        <div className="gr-card">
          {node.title && <b className="gr-card-title">{node.title}</b>}
          {node.children.map((c, i) => <GenerativeRenderer key={i} node={c} />)}
        </div>
      )
    case 'heading':
      return <div className={`gr-h${node.level ?? 2}`}>{node.text}</div>
    case 'text':
      return <p className={node.muted ? 'gr-muted' : ''}>{node.text}</p>
    case 'divider':
      return <hr className="gr-divider" />
    case 'stat':
      return (
        <div className="gr-stat">
          <span className="gr-muted">{node.label}</span>
          <b>{node.value}</b>
          {node.delta && <em className={`gr-trend-${node.trend ?? 'flat'}`}>{node.delta}</em>}
        </div>
      )
    case 'bar':
      return (
        <div className="gr-bar">
          <div className="gr-bar-label"><span>{node.label}</span>{node.hint && <span className="gr-muted">{node.hint}</span>}</div>
          <div className="gr-bar-track"><div style={{ width: `${(node.value / node.max) * 100}%` }} /></div>
        </div>
      )
    case 'pill':
      return <span className={`gr-pill gr-pill-${node.tone ?? 'default'}`}>{node.text}</span>
    case 'list':
      return node.ordered
        ? <ol className="gr-list">{node.items.map((t, i) => <li key={i}>{t}</li>)}</ol>
        : <ul className="gr-list">{node.items.map((t, i) => <li key={i}>{t}</li>)}</ul>
    case 'kv':
      return (
        <div className="gr-kv">
          {node.pairs.map(([k, v]) => <div key={k}><span className="gr-muted">{k}</span><span>{v}</span></div>)}
        </div>
      )
    case 'table':
      return (
        <table className="gr-table">
          <thead><tr>{node.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>{node.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table>
      )
    case 'button':
      return <button className={`gr-btn gr-btn-${node.style ?? 'ghost'}`}>{node.label}</button>
    case 'progress':
      return (
        <div className="gr-progress">
          <div className="gr-bar-label"><span>{node.label}</span><span className="gr-muted">{node.pct}%</span></div>
          <div className="gr-bar-track"><div style={{ width: `${node.pct}%` }} /></div>
        </div>
      )
  }
}
