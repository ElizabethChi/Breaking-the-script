import { useEffect, useMemo, useState } from 'react';

const STARTER = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Georgia, serif;
      max-width: 28em;
      margin: 3em auto;
      background: #faf6ef;
      color: #1a1612;
      line-height: 1.5;
    }
    h1 { font-weight: normal; font-size: 2rem; }
  </style>
</head>
<body>
  <h1>Hello, internet.</h1>
  <p>Change this text. You just edited a website.</p>
</body>
</html>
`;

const SECTIONS = [
  { id: 'files', n: '01', label: 'Files' },
  { id: 'prompt', n: '02', label: 'Prompt' },
  { id: 'preview', n: '03', label: 'Preview' },
  { id: 'platforms', n: '04', label: 'Platforms' },
  { id: 'link', n: '05', label: 'Link' },
];

export default function App() {
  const [active, setActive] = useState('files');

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.15, 0.4, 0.7] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div className="site-wrap">
      <a className="skip" href="#files">
        Skip to lesson
      </a>
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">Prompt to Link</span>
          <span className="brand-kicker">a field guide</span>
        </a>
        <nav className="top-nav" aria-label="Lesson sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''}>
              {s.n} {s.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <header className="hero" id="top">
          <div className="shell hero-grid">
            <div>
              <p className="kicker">Just the basics</p>
              <h1>
                From a prompt
                <br />
                <em>to a link.</em>
              </h1>
              <p className="one-liner">
                You describe a page. It becomes <strong>files</strong>. You put those files on a{' '}
                <strong>host</strong>. The host gives you a <strong>link</strong>.
              </p>
            </div>
            <aside className="hero-aside">
              <p style={{ marginBottom: 0 }}>
                You do not need to become a programmer first. You need five ideas, in this order.
              </p>
              <ol>
                <li>
                  <b>1</b>
                  <span>A website is three kinds of files.</span>
                </li>
                <li>
                  <b>2</b>
                  <span>A prompt (or you) writes those files.</span>
                </li>
                <li>
                  <b>3</b>
                  <span>Your browser can open them privately.</span>
                </li>
                <li>
                  <b>4</b>
                  <span>GitHub stores them. A host publishes them.</span>
                </li>
                <li>
                  <b>5</b>
                  <span>The URL is what you share.</span>
                </li>
              </ol>
            </aside>
          </div>
        </header>

        <div className="shell" style={{ padding: '2rem 0 0' }}>
          <CheatSheet />
        </div>

        <section className="block" id="files">
          <div className="shell">
            <div className="section-head">
              <div className="sec-num">01</div>
              <div>
                <p className="kicker">What a website is</p>
                <h2>A website is a folder of files.</h2>
              </div>
            </div>

            <div className="split">
              <div className="prose">
                <p className="lede">
                  Every site you have ever used — this one, Google, a restaurant menu — is a browser reading
                  files and drawing them on screen. That is the whole trick.
                </p>
                <p>
                  There are only three kinds of files that matter at the start. HTML is the stuff on the page.
                  CSS is how it looks. JavaScript is what it does when you click.
                </p>
                <p>
                  A useful picture: HTML is the furniture, CSS is the paint and lighting, JavaScript is the
                  doorbells and light switches. Take the furniture away and the paint has nothing to sit on.
                </p>
                <p className="note">
                  The file named <code className="mono">index.html</code> is the front door. Browsers look for
                  that name first.
                </p>
              </div>
              <div>
                <div className="folder" aria-label="A typical website folder">
                  <div className="folder-bar">my-site/</div>
                  <div className="file-row">
                    <code>index.html</code>
                    <span>The page itself — headings, text, images, buttons.</span>
                  </div>
                  <div className="file-row">
                    <code>styles.css</code>
                    <span>Colors, type, spacing, layout. The look.</span>
                  </div>
                  <div className="file-row">
                    <code>script.js</code>
                    <span>Clicks, forms, anything that moves or reacts.</span>
                  </div>
                </div>
                <p className="note">
                  You can start with a single HTML file. CSS and JS can even live inside it. More files come
                  later, when you need them.
                </p>
              </div>
            </div>

            <LayerDemo />
          </div>
        </section>

        <section className="block" id="prompt">
          <div className="shell">
            <div className="section-head">
              <div className="sec-num">02</div>
              <div>
                <p className="kicker">How the files get written</p>
                <h2>A prompt is just a description.</h2>
              </div>
            </div>
            <div className="split">
              <div className="prose">
                <p className="lede">
                  “Build me a one-page site for my weekend bakery. Warm colors, the menu, hours, and a photo
                  of bread.” That is a prompt. The output is those files.
                </p>
                <p>
                  You can write the files yourself in any text editor, or have an AI write them from a
                  description like the one above. Same files either way. A browser does not care who typed
                  them.
                </p>
                <p>
                  The skill is not memorizing code. The skill is knowing what the three files are, so you can
                  tell whether the result is right — and what to ask for next.
                </p>
              </div>
              <div className="card" style={{ background: 'var(--paper-2)' }}>
                <p className="who">A prompt that works</p>
                <h3>Be concrete.</h3>
                <p>
                  Say what the page is for, who it is for, what must be on it, and how it should feel. Mention
                  pages (“just one page”), and any must-haves (menu, email, a photo).
                </p>
                <p style={{ marginBottom: 0 }}>
                  Vague: “make me a website.” Useful: “a single page for a ceramicist named Jun, cream
                  background, three photos, a price list, and a mailto link.”
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="block" id="preview">
          <div className="shell">
            <div className="section-head">
              <div className="sec-num">03</div>
              <div>
                <p className="kicker">Seeing it before anyone else does</p>
                <h2>Open the files in a browser. That is not the internet yet.</h2>
              </div>
            </div>
            <div className="split">
              <div className="prose">
                <p className="lede">
                  Double-click <span className="mono">index.html</span>. It opens in Chrome or Safari. The
                  address bar will say <span className="mono">file://</span> or{' '}
                  <span className="mono">localhost</span>. Only you can see it. Your laptop is doing a dress
                  rehearsal.
                </p>
                <p>
                  If you are using a coding tool, it often runs a tiny local server and gives you a preview
                  URL. Still private. Still not a link you can text to a friend.
                </p>
                <p>
                  This step exists so you can fix the page before you publish. Does the menu look right? Is
                  the photo huge? Click around. Then you put it online.
                </p>
              </div>
              <div className="demo-frame">
                <div className="demo-chrome">
                  <span className="traffic" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <div className="addr">localhost:5173 — only you can see this</div>
                </div>
                <div className="demo-body" style={{ minHeight: 160 }}>
                  <p style={{ margin: 0, textAlign: 'center', maxWidth: '18rem' }}>
                    A private preview is a website that has not been given an address yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="block" id="platforms">
          <div className="shell">
            <div className="section-head">
              <div className="sec-num">04</div>
              <div>
                <p className="kicker">The only names to learn</p>
                <h2>Three platforms. That is the whole stack.</h2>
              </div>
            </div>
            <p className="lede prose">
              You already have a browser. You need a place to keep the files, and a place that stays online
              so other people can open them. Everything else is optional.
            </p>

            <div className="platforms">
              <article className="card">
                <p className="who">You already have this</p>
                <h3>A browser</h3>
                <p>
                  Chrome, Safari, Firefox, Edge. It is both your preview tool and what your visitors will
                  use. If it looks right here, it is a real page.
                </p>
                <p style={{ marginBottom: 0 }}>Nothing to install if you can read this sentence.</p>
              </article>
              <article className="card">
                <p className="who">Storage, not a website</p>
                <h3>GitHub</h3>
                <p>
                  A folder in the cloud, with history. This is where the code lives. The GitHub URL is a view
                  of the files — it is usually not the site you share.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Think Google Drive, but for code. Free account. One “repository” per project.
                </p>
              </article>
              <article className="card featured">
                <p className="who">Pick one host</p>
                <h3>Vercel</h3>
                <p>
                  Connect GitHub, click deploy, get a public URL. This is the computer that is always on.
                  When a friend opens your link, Vercel sends them your files.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Netlify and GitHub Pages do the same job. Pick one and ignore the rest.
                </p>
              </article>
            </div>

            <div className="alt-hosts" aria-label="Other hosts">
              <span className="pill">Netlify — same idea as Vercel</span>
              <span className="pill">GitHub Pages — built into GitHub</span>
              <span className="pill">Cloudflare Pages — also fine</span>
            </div>

            <div className="places" aria-label="The same files in three places">
              <div className="place">
                <h3>Your laptop</h3>
                <p>Private. Address starts with file:// or localhost. Fine for drafting.</p>
              </div>
              <div className="arrow" aria-hidden="true">
                →
              </div>
              <div className="place">
                <h3>GitHub</h3>
                <p>
                  Backup and history. URL looks like github.com/you/bakery — that is the code, not the shop
                  window.
                </p>
              </div>
              <div className="arrow" aria-hidden="true">
                →
              </div>
              <div className="place public">
                <h3>The host</h3>
                <p>Public. URL looks like bakery.vercel.app. This is the link you send.</p>
              </div>
            </div>
            <p className="note">
              Same files, three places. Only the host is the website. Mixing up the GitHub URL and the Vercel
              URL is the most common mix-up in this whole process.
            </p>
          </div>
        </section>

        <section className="block" id="link">
          <div className="shell">
            <div className="section-head">
              <div className="sec-num">05</div>
              <div>
                <p className="kicker">Getting it on the internet</p>
                <h2>Hosting turns the folder into an address.</h2>
              </div>
            </div>
            <div className="split">
              <div className="prose">
                <p className="lede">
                  A link is not a mysterious object. It is a street address for your files. When someone types
                  it, their browser asks the host for <span className="mono">index.html</span>, then draws
                  whatever comes back.
                </p>
                <p>
                  You do not buy a server. You do not need a custom name like{' '}
                  <span className="mono">bakery.com</span> on day one. The free address{' '}
                  <span className="mono">something.vercel.app</span> is a real website. People can open it on
                  their phones. Your laptop can be off.
                </p>
                <p>
                  Later, if you want, you buy a domain (Namecheap, Google Domains, Cloudflare) and point it at
                  the same host. Same site, fancier address. Skip it until you care.
                </p>
              </div>
              <div className="card featured">
                <p className="who">What happens when they open your link</p>
                <h3>Four steps, a second or two.</h3>
                <ul>
                  <li>They type the URL, or tap it.</li>
                  <li>The browser asks Vercel (or Netlify, or Pages) for your files.</li>
                  <li>The host sends HTML, CSS, and JavaScript.</li>
                  <li>Their browser draws the page. You are not in that conversation.</li>
                </ul>
              </div>
            </div>

            <h3 className="serif" style={{ marginTop: '2.4rem', fontSize: '1.8rem' }}>
              The actual recipe
            </h3>
            <div className="recipe">
              <Recipe n="1" title="Describe the page.">
                To an AI, or in a notebook. What it is, who it is for, what must be on it.
              </Recipe>
              <Recipe n="2" title="Get the files.">
                At minimum, an index.html. Open it locally. Tinker until it feels right.
              </Recipe>
              <Recipe n="3" title="Put the folder on GitHub.">
                Create a free account, create a repository, upload the files. This is backup plus the door
                your host will use.
              </Recipe>
              <Recipe n="4" title="Connect a host.">
                Sign into Vercel (or Netlify) with GitHub. Import the repository. Click Deploy. Wait a
                minute.
              </Recipe>
              <Recipe n="5" title="Copy the URL.">
                Something like my-bakery.vercel.app. That is the website. Send it.
              </Recipe>
            </div>
          </div>
        </section>

        <section className="block" id="words">
          <div className="shell">
            <div className="section-head">
              <div className="sec-num">*</div>
              <div>
                <p className="kicker">A tiny dictionary</p>
                <h2>Words you will hear, translated.</h2>
              </div>
            </div>
            <div className="split-wide">
              <p className="lede">
                People in this world enjoy jargon. You do not need the jargon to ship a page. You do need to
                not panic when it shows up.
              </p>
              <table className="words">
                <thead>
                  <tr>
                    <th>Word</th>
                    <th>Means</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Deploy</td>
                    <td>Publish the files to the host. “Make it live.”</td>
                  </tr>
                  <tr>
                    <td>Repo</td>
                    <td>The project folder on GitHub. Short for repository.</td>
                  </tr>
                  <tr>
                    <td>Commit / push</td>
                    <td>Save a snapshot, then send it to GitHub.</td>
                  </tr>
                  <tr>
                    <td>Localhost</td>
                    <td>The private preview on your computer.</td>
                  </tr>
                  <tr>
                    <td>Domain</td>
                    <td>The name in the URL. Optional on day one.</td>
                  </tr>
                  <tr>
                    <td>Static site</td>
                    <td>Just files, no database. This is what you should build first.</td>
                  </tr>
                  <tr>
                    <td>Frontend</td>
                    <td>The pages people see. HTML, CSS, JS.</td>
                  </tr>
                  <tr>
                    <td>Framework</td>
                    <td>Extra tools on top (React, etc.). Useful later, not required.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="block" id="ignore">
          <div className="shell">
            <div className="section-head">
              <div className="sec-num">×</div>
              <div>
                <p className="kicker">Permission to skip</p>
                <h2>You can ignore all of this for months.</h2>
              </div>
            </div>
            <p className="lede prose">
              The internet is full of tools that assume you are already building an app. You are building a
              page. Different job.
            </p>
            <div className="ignore">
              <ul>
                <li>
                  <strong>React, Next.js, Vue</strong>
                  <span>Libraries for complicated interfaces. This lesson is not them, even if this page uses some extras under the hood.</span>
                </li>
                <li>
                  <strong>Node, npm, package.json</strong>
                  <span>A toolbox for JavaScript projects. You will meet them when a project needs them.</span>
                </li>
                <li>
                  <strong>Databases, logins, payments</strong>
                  <span>That is a backend. A first site should not have one.</span>
                </li>
                <li>
                  <strong>AWS, Docker, “the cloud”</strong>
                  <span>Vercel is already someone else’s computer. That is enough cloud.</span>
                </li>
                <li>
                  <strong>Wix, Squarespace, WordPress</strong>
                  <span>Fine products, different path: you work in their editor, they host it. Use them if you want a dashboard, not files.</span>
                </li>
                <li>
                  <strong>A custom domain</strong>
                  <span>Buy one when the free URL starts to bother you. Not before.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="block" id="try">
          <div className="shell">
            <div className="section-head">
              <div className="sec-num">→</div>
              <div>
                <p className="kicker">Do this once</p>
                <h2>Edit a website, right here.</h2>
              </div>
            </div>
            <p className="lede prose">
              The left side is an HTML file. The right side is a browser reading it. Change a word. That is
              the entire job — you just did it without GitHub, Vercel, or a course.
            </p>
            <Playground />
            <p className="note">
              Save this as index.html on your computer, open it, and you have a local website. Put that file
              on GitHub, connect Vercel, and you have a link.
            </p>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="shell">
          <p>
            <strong>That is the whole map.</strong>
          </p>
          <p>
            Prompt → files → GitHub → host → URL. A browser, GitHub, and Vercel (or Netlify, or GitHub Pages).
            Everything else can wait.
          </p>
          <div className="callout">
            <p>
              This page is itself a website: files, drawn by your browser, sitting on a host so you can open
              it. There is no further secret.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheatSheet() {
  const cells = [
    { n: '01', t: 'Files', d: 'HTML is stuff. CSS is look. JS is behavior.' },
    { n: '02', t: 'Prompt', d: 'A description that becomes those files.' },
    { n: '03', t: 'Preview', d: 'Open them on your computer. Private.' },
    { n: '04', t: 'Platforms', d: 'Browser. GitHub. One host.' },
    { n: '05', t: 'Link', d: 'The host’s URL is what you share.' },
  ];
  return (
    <div className="sheet" aria-label="Cheat sheet">
      {cells.map((c) => (
        <div className="sheet-cell" key={c.n}>
          <div className="sheet-n">{c.n}</div>
          <p>
            <strong>{c.t}</strong>
            {c.d}
          </p>
        </div>
      ))}
    </div>
  );
}

function Recipe({ n, title, children }) {
  return (
    <div className="recipe-row">
      <div className="n">{n}</div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

function LayerDemo() {
  const [on, setOn] = useState({ html: true, css: true, js: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
  }, [on.html, on.js]);

  const label = !on.js ? 'Click me' : count === 0 ? 'Click me' : `Clicked ${count}×`;

  let caption = 'A real page: structure, look, and a little behavior.';
  if (!on.html) caption = 'CSS and JavaScript have nothing to work with. HTML is the body.';
  else if (on.html && !on.css && !on.js) caption = 'Bare HTML. The browser’s default look. It still counts as a website.';
  else if (on.html && on.css && !on.js) caption = 'Now it has a look. Pretty, but it does not do anything yet.';
  else if (on.html && !on.css && on.js) caption = 'It works, but it looks like 1995. That is CSS’s job.';

  return (
    <div style={{ marginTop: '2.4rem' }}>
      <h3 className="serif" style={{ fontSize: '1.6rem', marginBottom: '0.7rem' }}>
        Peel the layers off.
      </h3>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '0.9rem' }}>
        Turn pieces off. Watch the page lose its look, then its brains, then its body.
      </p>
      <div className="toggles" role="group" aria-label="Layer toggles">
        {['html', 'css', 'js'].map((key) => (
          <button
            key={key}
            className={`toggle ${key} ${on[key] ? 'is-on' : ''}`}
            aria-pressed={on[key]}
            onClick={() => setOn((s) => ({ ...s, [key]: !s[key] }))}
          >
            {on[key] ? 'on' : 'off'} · {key.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="split-wide">
        <div className="demo-frame">
          <div className="demo-chrome">
            <span className="traffic" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div className="addr">preview — not on the internet</div>
          </div>
          <div className="demo-body">
            {!on.html ? (
              <div className="demo-empty">Nothing here. No HTML, no page.</div>
            ) : (
              <button
                className={on.css ? 'pretty-btn' : 'plain-btn'}
                onClick={() => on.js && setCount((n) => n + 1)}
                type="button"
              >
                {label}
              </button>
            )}
          </div>
        </div>
        <div>
          <div className="code-stack">
            <pre className={`code-block ${on.html ? '' : 'is-off'}`}>
              <span className="lang">html</span>
              {`<button id="btn">${label}</button>`}
            </pre>
            <pre className={`code-block ${on.css ? '' : 'is-off'}`}>
              <span className="lang">css</span>
              {`button {\n  background: #d63c1a;\n  color: white;\n  padding: 12px 18px;\n}`}
            </pre>
            <pre className={`code-block ${on.js ? '' : 'is-off'}`}>
              <span className="lang">js</span>
              {`btn.onclick = () => {\n  clicks++\n  btn.textContent = "Clicked " + clicks\n}`}
            </pre>
          </div>
          <p className="note">{caption}</p>
        </div>
      </div>
    </div>
  );
}

function Playground() {
  const [code, setCode] = useState(STARTER);
  const srcDoc = useMemo(() => code, [code]);

  return (
    <div className="play">
      <div className="play-edit">
        <header>
          <span>index.html</span>
          <button className="reset-btn" type="button" onClick={() => setCode(STARTER)}>
            Reset
          </button>
        </header>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          aria-label="HTML editor"
        />
      </div>
      <div className="play-view">
        <header>browser</header>
        <iframe title="Live preview of your HTML" sandbox="allow-scripts" srcDoc={srcDoc} />
      </div>
    </div>
  );
}
