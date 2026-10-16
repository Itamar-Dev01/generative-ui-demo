// ---------------------------------------------------------------------------
// Library expansion: 24 more catalog components, same contract as library.tsx
// (name, description, guidelines, schema, triggers, mock fill, render).
// ---------------------------------------------------------------------------
import type { ComponentSpec } from './types'

const s = (schema: any) => schema

export const extraLibrary: ComponentSpec[] = [
  {
    name: 'restaurant-card',
    description: 'A restaurant: cuisine, area, rating, price level, signature dish.',
    guidelines: 'Use for one dining recommendation. Price level is 1-4 ($-$$$$). For a shortlist use a generated stack of these.',
    schema: s({ type: 'object', required: ['name', 'cuisine', 'area', 'rating', 'priceLevel', 'signature'],
      properties: { name: { type: 'string' }, cuisine: { type: 'string' }, area: { type: 'string' }, rating: { type: 'number' }, priceLevel: { type: 'number' }, signature: { type: 'string' }, note: { type: 'string' } } }),
    triggers: /restaurant|dinner|lunch|eat|food|מסעדה|אוכל/i,
    fill: () => ({ name: 'Khao Soi Khun Yai', cuisine: 'Northern Thai', area: 'Old City', rating: 4.8, priceLevel: 1, signature: 'Khao soi gai', note: 'Cash only, closes 14:00' }),
    render: (p) => (
      <div className="ui-rest">
        <div className="ui-rest-top"><b>{p.name}</b><span className="ui-price">{'$'.repeat(p.priceLevel)}</span></div>
        <span className="muted">{p.cuisine} · {p.area}</span>
        <span className="ui-hotel-rating">★ {p.rating}</span>
        <div className="ui-rest-dish"><i>Must order:</i> {p.signature}</div>
        {p.note && <span className="pill">{p.note}</span>}
      </div>
    ),
  },
  {
    name: 'event-card',
    description: 'A concert, meetup or show: date, venue, price, availability.',
    guidelines: 'Use for one event. Include whether tickets are still available.',
    schema: s({ type: 'object', required: ['title', 'date', 'venue', 'price', 'available'],
      properties: { title: { type: 'string' }, date: { type: 'string' }, venue: { type: 'string' }, price: { type: 'string' }, available: { type: 'boolean' }, genre: { type: 'string' } } }),
    triggers: /concert|meetup|gig|festival|הופעה/i,
    fill: () => ({ title: 'Monochrome Echo live', date: 'Sat Nov 8, 20:30', venue: 'North Gate Jazz Co-Op', price: '฿450', available: true, genre: 'Post-rock' }),
    render: (p) => (
      <div className="ui-event">
        <div className="ui-event-date"><b>{p.date.split(',')[0]}</b><span>{p.date.split(',')[1]}</span></div>
        <div className="ui-event-body">
          <b>{p.title}</b>
          <span className="muted">{p.venue}{p.genre ? ` · ${p.genre}` : ''}</span>
          <div className="ui-event-foot"><span>{p.price}</span><em className={p.available ? 'ok' : 'soldout'}>{p.available ? 'Tickets available' : 'Sold out'}</em></div>
        </div>
      </div>
    ),
  },
  {
    name: 'stock-ticker',
    description: 'A stock or coin: price, daily change, mini sparkline.',
    guidelines: 'Use for one symbol. Change is daily % unless stated. Sparkline has 7-20 points.',
    schema: s({ type: 'object', required: ['symbol', 'name', 'price', 'currency', 'changePct', 'spark'],
      properties: { symbol: { type: 'string' }, name: { type: 'string' }, price: { type: 'number' }, currency: { type: 'string' }, changePct: { type: 'number' }, spark: { type: 'array', items: { type: 'number' } } } }),
    triggers: /stock|ticker|shares|market|bitcoin|מניה/i,
    fill: () => ({ symbol: 'NVDA', name: 'NVIDIA Corp', price: 189.42, currency: 'USD', changePct: 2.31, spark: [181, 183, 180, 184, 186, 185, 188, 187, 189] }),
    render: (p) => {
      const up = p.changePct >= 0
      const max = Math.max(...p.spark), min = Math.min(...p.spark)
      return (
        <div className="ui-stock">
          <div><b>{p.symbol}</b><span className="muted"> {p.name}</span></div>
          <div className="ui-stock-row">
            <b className="ui-stock-price">${p.price}</b>
            <em className={up ? 'gr-trend-up' : 'gr-trend-down'}>{up ? '▲' : '▼'} {Math.abs(p.changePct)}%</em>
          </div>
          <div className="ui-spark">{p.spark.map((v: number, i: number) => <i key={i} style={{ height: `${20 + ((v - min) / (max - min || 1)) * 80}%`, background: up ? 'var(--accent)' : 'var(--bad)' }} />)}</div>
        </div>
      )
    },
  },
  {
    name: 'news-list',
    description: 'A short list of news headlines with source and time.',
    guidelines: 'Use for news requests. 3-6 items, newest first. Never invent headlines.',
    schema: s({ type: 'object', required: ['topic', 'items'],
      properties: { topic: { type: 'string' }, items: { type: 'array', items: { type: 'object', required: ['title', 'source', 'ago'], properties: { title: { type: 'string' }, source: { type: 'string' }, ago: { type: 'string' } } } } } }),
    triggers: /news|headlines|חדשות/i,
    fill: () => ({ topic: 'AI & design', items: [
      { title: 'Figma ships agent-ready component APIs', source: 'The Verge', ago: '2h' },
      { title: 'Google opens A2UI protocol spec', source: 'TechCrunch', ago: '5h' },
      { title: 'Vercel: chat is the new homepage', source: 'Vercel blog', ago: '1d' },
    ]}),
    render: (p) => (
      <div className="ui-news">
        <b className="ui-news-topic">{p.topic}</b>
        {p.items.map((n: any, i: number) => (
          <div className="ui-news-item" key={i}><span>{n.title}</span><i className="muted">{n.source} · {n.ago}</i></div>
        ))}
      </div>
    ),
  },
  {
    name: 'podcast-card',
    description: 'A podcast episode with length and a play control.',
    guidelines: 'Use for podcast or episode recommendations. Duration in minutes.',
    schema: s({ type: 'object', required: ['show', 'episode', 'minutes', 'blurb'],
      properties: { show: { type: 'string' }, episode: { type: 'string' }, minutes: { type: 'number' }, blurb: { type: 'string' } } }),
    triggers: /podcast|פודקאסט/i,
    fill: () => ({ show: 'Design Details', episode: 'Ep 412: Interfaces that design themselves', minutes: 47, blurb: 'On generative UI and what designers own when the agent composes the screen.' }),
    render: (p) => (
      <div className="ui-pod">
        <button className="ui-pod-play">▶</button>
        <div><b>{p.episode}</b><span className="muted"> {p.show} · {p.minutes} min</span><p className="muted">{p.blurb}</p></div>
      </div>
    ),
  },
  {
    name: 'book-card',
    description: 'A book: title, author, why it fits, rating.',
    guidelines: 'Use for book recommendations. Always say why it fits the request.',
    schema: s({ type: 'object', required: ['title', 'author', 'why', 'rating'],
      properties: { title: { type: 'string' }, author: { type: 'string' }, why: { type: 'string' }, rating: { type: 'number' }, pages: { type: 'number' } } }),
    triggers: /book|reading|ספר/i,
    fill: () => ({ title: 'The Design of Everyday Things', author: 'Don Norman', why: 'The mental-model vocabulary you need when the interface is generated, not drawn.', rating: 4.4, pages: 368 }),
    render: (p) => (
      <div className="ui-book">
        <div className="ui-book-cover">📖</div>
        <div><b>{p.title}</b><span className="muted"> {p.author}{p.pages ? ` · ${p.pages}p` : ''}</span>
          <span className="ui-hotel-rating">★ {p.rating}</span>
          <p className="muted"><i>Why: </i>{p.why}</p></div>
      </div>
    ),
  },
  {
    name: 'movie-card',
    description: 'A film or series: year, genre, rating, where to watch.',
    guidelines: 'Use for watch recommendations. Include streaming availability when known.',
    schema: s({ type: 'object', required: ['title', 'year', 'genre', 'rating'],
      properties: { title: { type: 'string' }, year: { type: 'number' }, genre: { type: 'string' }, rating: { type: 'number' }, on: { type: 'string' } } }),
    triggers: /movie|film|series|watch|סרט/i,
    fill: () => ({ title: 'Her', year: 2013, genre: 'Sci-fi romance', rating: 8.0, on: 'Netflix' }),
    render: (p) => (
      <div className="ui-movie">
        <div className="ui-movie-poster">🎬</div>
        <b>{p.title} <span className="muted">({p.year})</span></b>
        <span className="muted">{p.genre}</span>
        <div className="ui-event-foot"><span className="ui-hotel-rating">★ {p.rating}/10</span>{p.on && <span className="pill">{p.on}</span>}</div>
      </div>
    ),
  },
  {
    name: 'recipe-card',
    description: 'A recipe: time, difficulty, ingredients and steps count.',
    guidelines: 'Use for cooking questions. List at most 8 ingredients, note the full step count.',
    schema: s({ type: 'object', required: ['name', 'minutes', 'difficulty', 'ingredients', 'steps'],
      properties: { name: { type: 'string' }, minutes: { type: 'number' }, difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] }, ingredients: { type: 'array', items: { type: 'string' } }, steps: { type: 'number' } } }),
    triggers: /recipe|cook|מתכון/i,
    fill: () => ({ name: 'Khao soi gai', minutes: 45, difficulty: 'medium', steps: 6, ingredients: ['Egg noodles', 'Chicken thighs', 'Coconut milk', 'Red curry paste', 'Shallots', 'Lime', 'Pickled mustard greens'] }),
    render: (p) => (
      <div className="ui-recipe">
        <div className="ui-rest-top"><b>{p.name}</b><span className={`label label-${p.difficulty === 'easy' ? 'design' : p.difficulty === 'medium' ? 'content' : 'dev'}`}>{p.difficulty}</span></div>
        <span className="muted">⏱ {p.minutes} min · {p.steps} steps</span>
        <div className="ui-pills">{p.ingredients.map((i: string) => <span key={i} className="pill">{i}</span>)}</div>
      </div>
    ),
  },
  {
    name: 'expense-summary',
    description: 'Spending breakdown by category with total and period.',
    guidelines: 'Use for budget and spending questions. Amounts sum to the total.',
    schema: s({ type: 'object', required: ['period', 'currency', 'total', 'categories'],
      properties: { period: { type: 'string' }, currency: { type: 'string' }, total: { type: 'number' },
        categories: { type: 'array', items: { type: 'object', required: ['name', 'amount'], properties: { name: { type: 'string' }, amount: { type: 'number' } } } } } }),
    triggers: /expense|budget|spending|spent|הוצאות/i,
    fill: () => ({ period: 'October so far', currency: '฿', total: 21400, categories: [
      { name: 'Rent', amount: 9500 }, { name: 'Food', amount: 6200 }, { name: 'Transport', amount: 2100 }, { name: 'Fun', amount: 3600 },
    ]}),
    render: (p) => (
      <div className="ui-expense">
        <div className="ui-chart-head"><b>{p.period}</b><span className="muted">total {p.currency}{p.total.toLocaleString()}</span></div>
        {p.categories.map((c: any) => (
          <div className="gr-bar" key={c.name}>
            <div className="gr-bar-label"><span>{c.name}</span><span className="gr-muted">{p.currency}{c.amount.toLocaleString()}</span></div>
            <div className="gr-bar-track"><div style={{ width: `${(c.amount / p.total) * 100}%`, background: 'var(--accent)' }} /></div>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'currency-converter',
    description: 'A currency conversion with rate and timestamp.',
    guidelines: 'Use for money conversion. Always show the rate and when it was fetched.',
    schema: s({ type: 'object', required: ['amount', 'from', 'to', 'result', 'rate', 'asOf'],
      properties: { amount: { type: 'number' }, from: { type: 'string' }, to: { type: 'string' }, result: { type: 'number' }, rate: { type: 'number' }, asOf: { type: 'string' } } }),
    triggers: /convert|exchange|baht|shekel|שקל|באט/i,
    fill: () => ({ amount: 100, from: 'USD', to: 'THB', result: 3294, rate: 32.94, asOf: 'today 14:00' }),
    render: (p) => (
      <div className="ui-currency">
        <div className="ui-currency-main"><span>{p.amount} {p.from}</span><i>→</i><b>{p.result.toLocaleString()} {p.to}</b></div>
        <span className="muted">1 {p.from} = {p.rate} {p.to} · {p.asOf}</span>
      </div>
    ),
  },
  {
    name: 'rating-breakdown',
    description: 'Star distribution for a product or place.',
    guidelines: 'Use when reviews matter more than the average. Counts, not percentages.',
    schema: s({ type: 'object', required: ['subject', 'average', 'total', 'stars'],
      properties: { subject: { type: 'string' }, average: { type: 'number' }, total: { type: 'number' },
        stars: { type: 'array', items: { type: 'object', required: ['star', 'count'], properties: { star: { type: 'number' }, count: { type: 'number' } } } } } }),
    triggers: /reviews|ratings|ביקורות/i,
    fill: () => ({ subject: 'Rim Riverside House', average: 4.7, total: 412, stars: [
      { star: 5, count: 310 }, { star: 4, count: 70 }, { star: 3, count: 20 }, { star: 2, count: 8 }, { star: 1, count: 4 },
    ]}),
    render: (p) => {
      const max = Math.max(...p.stars.map((x: any) => x.count))
      return (
        <div className="ui-rating">
          <div className="ui-rating-head"><b>{p.average}</b><div><span className="ui-hotel-rating">{'★'.repeat(Math.round(p.average))}</span><span className="muted"> {p.total} reviews · {p.subject}</span></div></div>
          {p.stars.map((x: any) => (
            <div className="ui-rating-row" key={x.star}><span className="muted">{x.star}★</span><div className="gr-bar-track"><div style={{ width: `${(x.count / max) * 100}%` }} /></div><span className="muted">{x.count}</span></div>
          ))}
        </div>
      )
    },
  },
  {
    name: 'alert-banner',
    description: 'A status alert: info, warning or critical.',
    guidelines: 'Use for outages, warnings, urgent notices. Severity drives color; do not use for good news.',
    schema: s({ type: 'object', required: ['severity', 'title', 'body'],
      properties: { severity: { type: 'string', enum: ['info', 'warning', 'critical'] }, title: { type: 'string' }, body: { type: 'string' } } }),
    triggers: /alert|warning|outage|down|התראה/i,
    fill: () => ({ severity: 'warning', title: 'Deploy freeze on Friday', body: 'No production deploys after 14:00 ICT. Hotfixes need two approvals.' }),
    render: (p) => (
      <div className={`ui-alert ui-alert-${p.severity}`}><b>{p.title}</b><span>{p.body}</span></div>
    ),
  },
  {
    name: 'goal-rings',
    description: 'Activity-style progress rings for 1-3 goals.',
    guidelines: 'Use for daily progress and streaks. Max 3 rings, percent complete each.',
    schema: s({ type: 'object', required: ['rings'],
      properties: { rings: { type: 'array', items: { type: 'object', required: ['label', 'pct'], properties: { label: { type: 'string' }, pct: { type: 'number' }, detail: { type: 'string' } } } } } }),
    triggers: /goals|rings|daily progress|יעדים/i,
    fill: () => ({ rings: [
      { label: 'Design hours', pct: 80, detail: '4/5h' }, { label: 'Steps', pct: 65, detail: '6.5k' }, { label: 'No meetings', pct: 100, detail: 'done' },
    ]}),
    render: (p) => (
      <div className="ui-rings">
        {p.rings.map((r: any) => (
          <div className="ui-ring" key={r.label}>
            <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" className="ring-bg" /><circle cx="22" cy="22" r="19" className="ring-fg" strokeDasharray={`${(r.pct / 100) * 119.4} 119.4`} /><text x="22" y="26">{r.pct}%</text></svg>
            <b>{r.label}</b>{r.detail && <span className="muted">{r.detail}</span>}
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'stepper',
    description: 'Numbered setup or process steps with current position.',
    guidelines: 'Use for guided processes. Mark completed steps and the current one.',
    schema: s({ type: 'object', required: ['title', 'steps', 'current'],
      properties: { title: { type: 'string' }, current: { type: 'number' }, steps: { type: 'array', items: { type: 'string' } } } }),
    triggers: /steps|setup|onboarding|שלבים/i,
    fill: () => ({ title: 'Connect your repo', current: 1, steps: ['Create empty repo', 'Add Itamar-Dev01 as collaborator', 'Open a PR', 'Merge'] }),
    render: (p) => (
      <div className="ui-steps">
        <b>{p.title}</b>
        {p.steps.map((st: string, i: number) => (
          <div className={`ui-step ${i < p.current ? 'done' : i === p.current ? 'current' : ''}`} key={i}>
            <span>{i < p.current ? '✓' : i + 1}</span>{st}
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'faq-accordion',
    description: 'Question-answer pairs.',
    guidelines: 'Use for FAQ-style answers. 3-6 pairs, answers under 40 words.',
    schema: s({ type: 'object', required: ['items'],
      properties: { items: { type: 'array', items: { type: 'object', required: ['q', 'a'], properties: { q: { type: 'string' }, a: { type: 'string' } } } } } }),
    triggers: /faq|common questions|שאלות/i,
    fill: () => ({ items: [
      { q: 'Is generative UI just function calling?', a: 'Function calling fills schemas; generative UI is the presentation layer built on top of it.' },
      { q: 'Do I lose design control?', a: 'You design the components and constraints. The agent composes inside them.' },
      { q: 'Can it invent new components?', a: 'In open-ended mode it composes primitives; your design system still owns the atoms.' },
    ]}),
    render: (p) => (
      <div className="ui-faq">
        {p.items.map((f: any, i: number) => (
          <details key={i}><summary>{f.q}</summary><p className="muted">{f.a}</p></details>
        ))}
      </div>
    ),
  },
  {
    name: 'file-list',
    description: 'Files or documents with type, size and modified time.',
    guidelines: 'Use for drive/document answers. Newest first, 3-8 rows.',
    schema: s({ type: 'object', required: ['folder', 'files'],
      properties: { folder: { type: 'string' }, files: { type: 'array', items: { type: 'object', required: ['name', 'kind', 'modified'], properties: { name: { type: 'string' }, kind: { type: 'string' }, size: { type: 'string' }, modified: { type: 'string' } } } } } }),
    triggers: /files|documents|folder|קבצים/i,
    fill: () => ({ folder: 'Portfolio assets', files: [
      { name: 'case-study-pixel-poke.fig', kind: 'Figma', size: '48 MB', modified: '2h ago' },
      { name: 'hero-export@2x.png', kind: 'Image', size: '1.2 MB', modified: 'yesterday' },
      { name: 'copy-draft-v3.docx', kind: 'Doc', size: '88 KB', modified: 'Oct 12' },
    ]}),
    render: (p) => (
      <div className="ui-files">
        <b className="muted">📁 {p.folder}</b>
        {p.files.map((f: any, i: number) => (
          <div className="ui-file" key={i}><span>{f.name}</span><i className="muted">{f.kind}{f.size ? ` · ${f.size}` : ''} · {f.modified}</i></div>
        ))}
      </div>
    ),
  },
  {
    name: 'shipping-tracker',
    description: 'Package tracking with checkpoint history.',
    guidelines: 'Use for delivery status. Checkpoints newest last; state the current status clearly.',
    schema: s({ type: 'object', required: ['carrier', 'trackingId', 'status', 'checkpoints'],
      properties: { carrier: { type: 'string' }, trackingId: { type: 'string' },
        status: { type: 'string', enum: ['label created', 'in transit', 'out for delivery', 'delivered'] },
        eta: { type: 'string' },
        checkpoints: { type: 'array', items: { type: 'object', required: ['when', 'what'], properties: { when: { type: 'string' }, what: { type: 'string' } } } } } }),
    triggers: /package|shipping|delivery|parcel|חבילה|משלוח/i,
    fill: () => ({ carrier: 'Thailand Post', trackingId: 'EE1042TH', status: 'in transit', eta: 'Mon Oct 19', checkpoints: [
      { when: 'Oct 14', what: 'Picked up, Bangkok hub' }, { when: 'Oct 15', what: 'Departed sorting center' }, { when: 'Oct 16', what: 'Arrived Chiang Mai depot' },
    ]}),
    render: (p) => (
      <div className="ui-ship">
        <div className="ui-rest-top"><b>{p.carrier}</b><span className="pill">{p.status}</span></div>
        <span className="muted">{p.trackingId}{p.eta ? ` · ETA ${p.eta}` : ''}</span>
        <div className="ui-timeline" style={{ marginTop: 8 }}>
          {p.checkpoints.map((c: any, i: number) => (
            <div className="ui-timeline-row" key={i}><span className="ui-timeline-when">{c.when}</span><span className="ui-timeline-dot" /><span>{c.what}</span></div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: 'poll-card',
    description: 'A poll with options and vote counts.',
    guidelines: 'Use for opinions and votes. Percentages sum to 100.',
    schema: s({ type: 'object', required: ['question', 'options', 'totalVotes'],
      properties: { question: { type: 'string' }, totalVotes: { type: 'number' },
        options: { type: 'array', items: { type: 'object', required: ['text', 'pct'], properties: { text: { type: 'string' }, pct: { type: 'number' } } } } } }),
    triggers: /poll|vote|survey|סקר/i,
    fill: () => ({ question: 'Best chat answer format?', totalVotes: 128, options: [
      { text: 'Generated UI cards', pct: 61 }, { text: 'Short text + link', pct: 27 }, { text: 'Voice summary', pct: 12 },
    ]}),
    render: (p) => (
      <div className="ui-poll">
        <b>{p.question}</b>
        {p.options.map((o: any) => (
          <div className="gr-bar" key={o.text}>
            <div className="gr-bar-label"><span>{o.text}</span><span className="gr-muted">{o.pct}%</span></div>
            <div className="gr-bar-track"><div style={{ width: `${o.pct}%`, background: 'var(--accent)' }} /></div>
          </div>
        ))}
        <span className="muted">{p.totalVotes} votes</span>
      </div>
    ),
  },
  {
    name: 'countdown-card',
    description: 'Countdown to a date with days/hours/minutes.',
    guidelines: 'Use for "how long until X". Always include the target date.',
    schema: s({ type: 'object', required: ['event', 'date', 'days', 'hours', 'minutes'],
      properties: { event: { type: 'string' }, date: { type: 'string' }, days: { type: 'number' }, hours: { type: 'number' }, minutes: { type: 'number' } } }),
    triggers: /countdown|days until|how long until|ספירה/i,
    fill: () => ({ event: 'Portfolio relaunch', date: 'Nov 1, 2026', days: 15, hours: 7, minutes: 42 }),
    render: (p) => (
      <div className="ui-count">
        <b>{p.event}</b><span className="muted">{p.date}</span>
        <div className="ui-count-grid">
          {[['days', p.days], ['hours', p.hours], ['min', p.minutes]].map(([l, v]) => (
            <div key={l as string}><b>{v as number}</b><span className="muted">{l}</span></div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: 'phrase-card',
    description: 'A translated phrase with phonetic reading.',
    guidelines: 'Use for "how do I say X in Y". Include phonetic transcription for non-Latin scripts.',
    schema: s({ type: 'object', required: ['source', 'target', 'language', 'phonetic'],
      properties: { source: { type: 'string' }, target: { type: 'string' }, language: { type: 'string' }, phonetic: { type: 'string' }, note: { type: 'string' } } }),
    triggers: /translate|how do i say|phrase|תרגום/i,
    fill: () => ({ source: 'Not spicy, please', target: 'ไม่เผ็ดครับ', language: 'Thai', phonetic: 'mai phet khrap', note: 'Say it with a smile; "khrap" is the polite particle for men.' }),
    render: (p) => (
      <div className="ui-phrase">
        <span className="muted">{p.source}</span>
        <b className="ui-phrase-target">{p.target}</b>
        <span className="ui-phrase-phon">{p.phonetic} · {p.language}</span>
        {p.note && <p className="muted">{p.note}</p>}
      </div>
    ),
  },
  {
    name: 'code-snippet',
    description: 'A code block with language and caption.',
    guidelines: 'Use when code is the answer. Keep under 25 lines; caption says what it does.',
    schema: s({ type: 'object', required: ['language', 'code', 'caption'],
      properties: { language: { type: 'string' }, code: { type: 'string' }, caption: { type: 'string' } } }),
    triggers: /code|snippet|function|regex|קוד/i,
    fill: () => ({ language: 'ts', caption: 'Fill a component schema with the Vercel AI SDK', code: `const { object } = await generateObject({\n  model,\n  schema: flightCardSchema,\n  prompt: userQuery,\n})\nreturn <FlightCard {...object} />` }),
    render: (p) => (
      <div className="ui-code">
        <div className="ui-code-head"><span className="pill">{p.language}</span><span className="muted">{p.caption}</span></div>
        <pre>{p.code}</pre>
      </div>
    ),
  },
  {
    name: 'route-card',
    description: 'Directions between two places: modes, duration, distance.',
    guidelines: 'Use for "how do I get from A to B". Offer the recommended mode first.',
    schema: s({ type: 'object', required: ['from', 'to', 'options'],
      properties: { from: { type: 'string' }, to: { type: 'string' },
        options: { type: 'array', items: { type: 'object', required: ['mode', 'duration'], properties: { mode: { type: 'string' }, duration: { type: 'string' }, cost: { type: 'string' }, best: { type: 'boolean' } } } } } }),
    triggers: /directions|route|get to|how do i get|דרך/i,
    fill: () => ({ from: 'Nimman', to: 'CMECC', options: [
      { mode: 'Grab bike', duration: '12 min', cost: '฿60', best: true },
      { mode: 'Songthaew', duration: '20 min', cost: '฿30' },
      { mode: 'Walk', duration: '55 min', cost: 'free' },
    ]}),
    render: (p) => (
      <div className="ui-route">
        <b>{p.from} → {p.to}</b>
        {p.options.map((o: any) => (
          <div className={`ui-route-opt ${o.best ? 'best' : ''}`} key={o.mode}>
            <span>{o.mode}</span><span className="muted">{o.duration}</span><span>{o.cost ?? ''}</span>{o.best && <em>best</em>}
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'color-palette',
    description: 'A brand color palette with hex values and roles.',
    guidelines: 'Use for color questions. 4-6 swatches, each with a role (bg, ink, accent...). Always show hex.',
    schema: s({ type: 'object', required: ['name', 'colors'],
      properties: { name: { type: 'string' },
        colors: { type: 'array', items: { type: 'object', required: ['hex', 'role'], properties: { hex: { type: 'string' }, role: { type: 'string' } } } } } }),
    triggers: /color|palette|צבעים/i,
    fill: () => ({ name: 'Fintech, trustworthy but warm', colors: [
      { hex: '#0E2A23', role: 'background' }, { hex: '#F5F1E8', role: 'surface' }, { hex: '#1F7A5C', role: 'primary' }, { hex: '#E8B54D', role: 'accent' }, { hex: '#D9622B', role: 'alert' },
    ]}),
    render: (p) => (
      <div className="ui-palette">
        <b>{p.name}</b>
        <div className="ui-swatches">
          {p.colors.map((c: any) => (
            <div className="ui-swatch" key={c.hex}>
              <div style={{ background: c.hex }} />
              <span>{c.hex}</span><i className="muted">{c.role}</i>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: 'pros-cons',
    description: 'Two-column pros and cons for a decision.',
    guidelines: 'Use for "should I" questions. Balance both sides; end with a one-line verdict.',
    schema: s({ type: 'object', required: ['question', 'pros', 'cons', 'verdict'],
      properties: { question: { type: 'string' }, pros: { type: 'array', items: { type: 'string' } }, cons: { type: 'array', items: { type: 'string' } }, verdict: { type: 'string' } } }),
    triggers: /pros and cons|should i|worth it|כדאי/i,
    fill: () => ({ question: 'Adopt generative UI for the onboarding revamp?', verdict: 'Yes for onboarding; keep checkout hand-designed.', pros: ['Screens compose per user intent', 'No new design per edge case', 'Fast to add components'], cons: ['Needs strict schemas', 'Harder to screenshot-test', 'Model cost per render'] }),
    render: (p) => (
      <div className="ui-proscons">
        <b>{p.question}</b>
        <div className="ui-pc-cols">
          <div><span className="gr-pill gr-pill-good">pros</span><ul>{p.pros.map((x: string) => <li key={x}>{x}</li>)}</ul></div>
          <div><span className="gr-pill gr-pill-bad">cons</span><ul>{p.cons.map((x: string) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        <p className="ui-verdict">⚖ {p.verdict}</p>
      </div>
    ),
  },
]
