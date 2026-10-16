// ---------------------------------------------------------------------------
// MODE 1 - the component library.
// Each entry ships: a JSON schema the agent fills, usage guidelines, and the
// real component. A production agent sees `name`, `description`, `guidelines`
// and `schema` in its system prompt and emits props as structured output.
// ---------------------------------------------------------------------------
import type { ComponentSpec } from './types'
import { extraLibrary } from './library-extra'

const s = (schema: any) => schema

const baseLibrary: ComponentSpec[] = [
  {
    name: 'flight-card',
    description: 'One flight option: route, times, airline, price.',
    guidelines:
      'Use for a single flight recommendation or the best pick. For several options use flight-list instead. Always include currency.',
    schema: s({
      type: 'object',
      required: ['from', 'to', 'depart', 'arrive', 'airline', 'price', 'currency', 'duration', 'stops'],
      properties: {
        from: { type: 'string', description: 'IATA code' },
        to: { type: 'string', description: 'IATA code' },
        depart: { type: 'string' },
        arrive: { type: 'string' },
        airline: { type: 'string' },
        price: { type: 'number' },
        currency: { type: 'string' },
        duration: { type: 'string' },
        stops: { type: 'number' },
        tag: { type: 'string', enum: ['best', 'cheapest', 'fastest'] },
      },
    }),
    triggers: /flight|fly|טיסה/i,
    fill: () => ({ from: 'TLV', to: 'BKK', depart: '23:55', arrive: '15:20 +1', airline: 'El Al', price: 812, currency: 'USD', duration: '10h 25m', stops: 0, tag: 'fastest' }),
    render: (p) => (
      <div className="ui-flight">
        <div className="ui-flight-route">
          <div><b>{p.from}</b><span>{p.depart}</span></div>
          <div className="ui-flight-line"><i />✈<i /></div>
          <div><b>{p.to}</b><span>{p.arrive}</span></div>
        </div>
        <div className="ui-flight-meta">
          <span>{p.airline}</span><span>{p.duration}</span>
          <span>{p.stops === 0 ? 'Nonstop' : `${p.stops} stop`}</span>
        </div>
        <div className="ui-flight-price">
          {p.tag && <em className={`tag-${p.tag}`}>{p.tag}</em>}
          <b>{p.currency === 'USD' ? '$' : p.currency}{p.price}</b>
        </div>
      </div>
    ),
  },
  {
    name: 'hotel-card',
    description: 'A place to stay: name, area, rating, nightly price.',
    guidelines: 'Use when recommending accommodation. Rating is out of 5. Price is per night.',
    schema: s({
      type: 'object',
      required: ['name', 'area', 'rating', 'reviews', 'pricePerNight', 'currency', 'perks'],
      properties: {
        name: { type: 'string' }, area: { type: 'string' },
        rating: { type: 'number' }, reviews: { type: 'number' },
        pricePerNight: { type: 'number' }, currency: { type: 'string' },
        perks: { type: 'array', items: { type: 'string' } },
      },
    }),
    triggers: /hotel|hostel|stay|sleep|guesthouse|מלון|לינה/i,
    fill: () => ({ name: 'Rim Riverside House', area: 'Nimman, Chiang Mai', rating: 4.7, reviews: 412, pricePerNight: 38, currency: 'USD', perks: ['Pool', 'Breakfast', 'Fast wifi'] }),
    render: (p) => (
      <div className="ui-hotel">
        <div className="ui-hotel-photo">🏨</div>
        <div className="ui-hotel-body">
          <b>{p.name}</b>
          <span className="muted">{p.area}</span>
          <span className="ui-hotel-rating">★ {p.rating} <i className="muted">({p.reviews} reviews)</i></span>
          <div className="ui-pills">{p.perks.map((k: string) => <span key={k} className="pill">{k}</span>)}</div>
        </div>
        <div className="ui-hotel-price"><b>${p.pricePerNight}</b><span className="muted">/ night</span></div>
      </div>
    ),
  },
  {
    name: 'weather-widget',
    description: 'Current conditions plus a short forecast for one place.',
    guidelines: 'Use for weather questions. Temps in Celsius unless the user asked otherwise.',
    schema: s({
      type: 'object',
      required: ['place', 'now', 'condition', 'days'],
      properties: {
        place: { type: 'string' },
        now: { type: 'number' },
        condition: { type: 'string', enum: ['sun', 'cloud', 'rain', 'storm'] },
        days: { type: 'array', items: { type: 'object', required: ['day', 'icon', 'hi', 'lo'], properties: { day: { type: 'string' }, icon: { type: 'string' }, hi: { type: 'number' }, lo: { type: 'number' } } } },
      },
    }),
    triggers: /weather|rain|temperature|forecast|מזג/i,
    fill: () => ({ place: 'Chiang Mai', now: 29, condition: 'sun', days: [
      { day: 'Sat', icon: '⛅', hi: 31, lo: 22 }, { day: 'Sun', icon: '🌧', hi: 28, lo: 21 },
      { day: 'Mon', icon: '🌧', hi: 27, lo: 21 }, { day: 'Tue', icon: '⛅', hi: 30, lo: 22 },
    ]}),
    render: (p) => (
      <div className="ui-weather">
        <div className="ui-weather-now">
          <span className="ui-weather-icon">{{ sun: '☀️', cloud: '☁️', rain: '🌧', storm: '⛈' }[p.condition as string]}</span>
          <b>{p.now}°</b>
          <span className="muted">{p.place}</span>
        </div>
        <div className="ui-weather-days">
          {p.days.map((d: any) => (
            <div key={d.day}><span className="muted">{d.day}</span><span>{d.icon}</span><span>{d.hi}° <i className="muted">{d.lo}°</i></span></div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: 'kanban-board',
    description: 'A sprint / task board with columns and cards.',
    guidelines: 'Use for project status, sprint planning, or anything with workflow stages. Keep cards short.',
    schema: s({
      type: 'object',
      required: ['title', 'columns'],
      properties: {
        title: { type: 'string' },
        columns: { type: 'array', items: { type: 'object', required: ['name', 'cards'], properties: { name: { type: 'string' }, cards: { type: 'array', items: { type: 'object', required: ['title'], properties: { title: { type: 'string' }, owner: { type: 'string' }, label: { type: 'string' } } } } } } },
      },
    }),
    triggers: /sprint|kanban|board|tasks|backlog|ספרינט|לוח/i,
    fill: () => ({ title: 'Sprint 14 - Onboarding revamp', columns: [
      { name: 'Todo', cards: [{ title: 'Empty states', owner: 'IK', label: 'design' }, { title: 'Invite email copy', owner: 'DM', label: 'content' }] },
      { name: 'Doing', cards: [{ title: 'New signup flow', owner: 'IK', label: 'design' }, { title: 'API rate limits', owner: 'AL', label: 'dev' }] },
      { name: 'Done', cards: [{ title: 'Pricing page', owner: 'IK', label: 'design' }, { title: 'SSO login', owner: 'AL', label: 'dev' }] },
    ]}),
    render: (p) => (
      <div className="ui-kanban">
        <b className="ui-kanban-title">{p.title}</b>
        <div className="ui-kanban-cols">
          {p.columns.map((c: any) => (
            <div className="ui-kanban-col" key={c.name}>
              <span className="ui-kanban-colname">{c.name} <i className="muted">{c.cards.length}</i></span>
              {c.cards.map((card: any, i: number) => (
                <div className="ui-kanban-card" key={i}>
                  <span>{card.title}</span>
                  <div><em className={`label label-${card.label}`}>{card.label}</em><b className="avatar">{card.owner}</b></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    name: 'stat-chart',
    description: 'A bar or line chart for a numeric series.',
    guidelines: 'Use for trends and comparisons over time. Max 12 points. Always label the unit.',
    schema: s({
      type: 'object',
      required: ['title', 'unit', 'kind', 'points'],
      properties: {
        title: { type: 'string' }, unit: { type: 'string' },
        kind: { type: 'string', enum: ['bar', 'line'] },
        points: { type: 'array', items: { type: 'object', required: ['label', 'value'], properties: { label: { type: 'string' }, value: { type: 'number' } } } },
      },
    }),
    triggers: /chart|graph|revenue|sales|stats|growth|גרף|נתונים/i,
    fill: () => ({ title: 'Weekly signups', unit: 'users', kind: 'bar', points: [
      { label: 'W41', value: 120 }, { label: 'W42', value: 180 }, { label: 'W43', value: 150 },
      { label: 'W44', value: 240 }, { label: 'W45', value: 310 }, { label: 'W46', value: 285 },
    ]}),
    render: (p) => {
      const max = Math.max(...p.points.map((x: any) => x.value))
      return (
        <div className="ui-chart">
          <div className="ui-chart-head"><b>{p.title}</b><span className="muted">{p.unit}</span></div>
          <div className="ui-chart-bars">
            {p.points.map((x: any) => (
              <div key={x.label} className="ui-chart-bar">
                <span className="ui-chart-val">{x.value}</span>
                <div style={{ height: `${Math.round((x.value / max) * 100)}%` }} />
                <span className="muted">{x.label}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
  },
  {
    name: 'comparison-table',
    description: 'Side-by-side comparison of 2-4 options across rows of criteria.',
    guidelines: 'Use when the user is choosing between options. Mark a winner column only if the data supports it.',
    schema: s({
      type: 'object',
      required: ['title', 'options', 'rows'],
      properties: {
        title: { type: 'string' },
        options: { type: 'array', items: { type: 'string' } },
        rows: { type: 'array', items: { type: 'object', required: ['criterion', 'values'], properties: { criterion: { type: 'string' }, values: { type: 'array', items: { type: 'string' } } } } },
        winner: { type: 'number' },
      },
    }),
    triggers: /compare|versus| vs |difference|השוואה/i,
    fill: () => ({ title: 'Tailwind vs CSS Modules', options: ['Tailwind', 'CSS Modules'], winner: 0, rows: [
      { criterion: 'Learning curve', values: ['Medium', 'Low'] },
      { criterion: 'Bundle size', values: ['Small (purged)', 'Small'] },
      { criterion: 'Design consistency', values: ['Built-in tokens', 'Up to you'] },
      { criterion: 'Readability', values: ['Noisy JSX', 'Clean JSX'] },
    ]}),
    render: (p) => (
      <div className="ui-compare">
        <b>{p.title}</b>
        <table>
          <thead><tr><th></th>{p.options.map((o: string, i: number) => <th key={o} className={i === p.winner ? 'winner' : ''}>{o}{i === p.winner ? ' ✓' : ''}</th>)}</tr></thead>
          <tbody>{p.rows.map((r: any) => <tr key={r.criterion}><td className="muted">{r.criterion}</td>{r.values.map((v: string, i: number) => <td key={i} className={i === p.winner ? 'winner' : ''}>{v}</td>)}</tr>)}</tbody>
        </table>
      </div>
    ),
  },
  {
    name: 'pricing-table',
    description: 'Pricing tiers with features and a highlighted plan.',
    guidelines: 'Use for plan/pricing questions. Highlight at most one plan.',
    schema: s({
      type: 'object',
      required: ['plans'],
      properties: {
        plans: { type: 'array', items: { type: 'object', required: ['name', 'price', 'period', 'features'], properties: { name: { type: 'string' }, price: { type: 'string' }, period: { type: 'string' }, features: { type: 'array', items: { type: 'string' } }, highlight: { type: 'boolean' } } } },
      },
    }),
    triggers: /pricing|price plan|subscription|תמחור/i,
    fill: () => ({ plans: [
      { name: 'Solo', price: '$0', period: 'forever', features: ['3 projects', 'Community support'], highlight: false },
      { name: 'Studio', price: '$19', period: '/mo', features: ['Unlimited projects', 'Custom domains', 'Priority support'], highlight: true },
      { name: 'Team', price: '$49', period: '/mo', features: ['5 seats', 'Shared library', 'SSO'], highlight: false },
    ]}),
    render: (p) => (
      <div className="ui-pricing">
        {p.plans.map((pl: any) => (
          <div key={pl.name} className={`ui-plan ${pl.highlight ? 'highlight' : ''}`}>
            <b>{pl.name}</b>
            <div className="ui-plan-price">{pl.price}<span className="muted">{pl.period}</span></div>
            <ul>{pl.features.map((f: string) => <li key={f}>{f}</li>)}</ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: 'timeline',
    description: 'Chronological steps or events.',
    guidelines: 'Use for schedules, itineraries, roadmaps and histories, earliest first.',
    schema: s({
      type: 'object',
      required: ['title', 'events'],
      properties: {
        title: { type: 'string' },
        events: { type: 'array', items: { type: 'object', required: ['when', 'what'], properties: { when: { type: 'string' }, what: { type: 'string' } } } },
      },
    }),
    triggers: /timeline|schedule|itinerary|roadmap|plan my day|לוז/i,
    fill: () => ({ title: 'Saturday in Chiang Mai', events: [
      { when: '08:00', what: 'Coffee at Akha Ama' },
      { when: '10:00', what: 'Lanna Expo at CMECC' },
      { when: '13:00', what: 'Khao soi lunch' },
      { when: '17:00', what: 'Saturday Night Market' },
    ]}),
    render: (p) => (
      <div className="ui-timeline">
        <b>{p.title}</b>
        {p.events.map((e: any, i: number) => (
          <div className="ui-timeline-row" key={i}><span className="ui-timeline-when">{e.when}</span><span className="ui-timeline-dot" /><span>{e.what}</span></div>
        ))}
      </div>
    ),
  },
  {
    name: 'profile-card',
    description: 'A person: name, role, key facts, actions.',
    guidelines: 'Use when the user asks about a person or a contact.',
    schema: s({
      type: 'object',
      required: ['name', 'role', 'facts'],
      properties: {
        name: { type: 'string' }, role: { type: 'string' },
        facts: { type: 'array', items: { type: 'string' } },
      },
    }),
    triggers: /who is|profile|designer|about itamar/i,
    fill: () => ({ name: 'Itamar Katan', role: 'Product designer, builds with AI', facts: ['Freelance, ex-startups', 'Portfolio: itamarkatan.xyz', 'Currently: Chiang Mai'] }),
    render: (p) => (
      <div className="ui-profile">
        <div className="ui-profile-avatar">{p.name.split(' ').map((w: string) => w[0]).join('')}</div>
        <b>{p.name}</b><span className="muted">{p.role}</span>
        <ul>{p.facts.map((f: string) => <li key={f}>{f}</li>)}</ul>
      </div>
    ),
  },
  {
    name: 'checklist',
    description: 'A checklist with done / pending states.',
    guidelines: 'Use for packing lists, launch lists, and step-by-step prep.',
    schema: s({
      type: 'object',
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        items: { type: 'array', items: { type: 'object', required: ['text', 'done'], properties: { text: { type: 'string' }, done: { type: 'boolean' } } } },
      },
    }),
    triggers: /checklist|packing|to-?do|list for|צ׳קליסט|רשימה/i,
    fill: () => ({ title: 'Portfolio launch checklist', items: [
      { text: 'Case studies in English', done: true }, { text: 'GEO meta tags', done: true },
      { text: 'Mobile pass at 390px', done: false }, { text: 'Analytics events', done: false },
    ]}),
    render: (p) => (
      <div className="ui-checklist">
        <b>{p.title}</b>
        {p.items.map((it: any, i: number) => (
          <div key={i} className={`ui-check ${it.done ? 'done' : ''}`}><span>{it.done ? '✓' : '○'}</span>{it.text}</div>
        ))}
      </div>
    ),
  },
  {
    name: 'quote-card',
    description: 'A short quote or testimonial.',
    guidelines: 'Use sparingly, only when a quotation is the actual answer.',
    schema: s({
      type: 'object', required: ['quote', 'author'],
      properties: { quote: { type: 'string' }, author: { type: 'string' }, source: { type: 'string' } },
    }),
    triggers: /quote|inspire|ציטוט/i,
    fill: () => ({ quote: 'The interface is the product. Everything else is plumbing.', author: 'Every designer, eventually' }),
    render: (p) => (
      <div className="ui-quote"><blockquote>“{p.quote}”</blockquote><span className="muted">— {p.author}</span></div>
    ),
  },
  {
    name: 'map-card',
    description: 'A location with address and a mini map placeholder.',
    guidelines: 'Use for “where is X”. Include the full address.',
    schema: s({
      type: 'object', required: ['name', 'address', 'lat', 'lng'],
      properties: { name: { type: 'string' }, address: { type: 'string' }, lat: { type: 'number' }, lng: { type: 'number' }, note: { type: 'string' } },
    }),
    triggers: /where|map|address|location|איפה/i,
    fill: () => ({ name: 'CMECC', address: '456 Moo 1, Chang Phueak, Chiang Mai 50300', lat: 18.845, lng: 98.968, note: 'Lanna Expo, Oct 12-18, free entry' }),
    render: (p) => (
      <div className="ui-map">
        <div className="ui-map-visual"><span>📍</span><i className="muted">{p.lat}, {p.lng}</i></div>
        <b>{p.name}</b><span className="muted">{p.address}</span>
        {p.note && <span className="pill">{p.note}</span>}
      </div>
    ),
  },
]

export const library: ComponentSpec[] = [...baseLibrary, ...extraLibrary]

export function findComponent(query: string): ComponentSpec | undefined {
  return library.find((c) => c.triggers.test(query))
}
