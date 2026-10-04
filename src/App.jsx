import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import Lenis from 'lenis';

const PRODUCT_API = 'https://dummyjson.com/products/category/fragrances?limit=12';

const FALLBACK_PRODUCTS = [
  {
    id: 'slow-burn',
    title: 'Slow Burn',
    brand: 'Sillage Studio',
    price: 88,
    description: 'A warm, close-to-skin fragrance with a spark of pink pepper.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
    volume: '50 ML',
    notes: 'PINK PEPPER · AMBER · SKIN MUSK',
  },
  {
    id: 'moss-study',
    title: 'Moss Study',
    brand: 'Sillage Studio',
    price: 94,
    description: 'Green, damp earth and the kind of quiet that follows rain.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85',
    volume: '50 ML',
    notes: 'GALBANUM · FIG LEAF · CEDAR',
  },
  {
    id: 'soft-static',
    title: 'Soft Static',
    brand: 'Sillage Studio',
    price: 76,
    description: 'A clean flash of citrus settling into a soft cotton musk.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
    volume: '30 ML',
    notes: 'BERGAMOT · IRIS · WHITE MUSK',
  },
  {
    id: 'midnight-fig',
    title: 'Midnight Fig',
    brand: 'Sillage Studio',
    price: 102,
    description: 'Dark fruit, warm woods and the last hour of the night.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1000&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1000&q=85',
    volume: '50 ML',
    notes: 'BLACK FIG · TONKA · VETIVER',
  },
];

const NOTES = [
  'PINK PEPPER · AMBER · SKIN MUSK',
  'GALBANUM · FIG LEAF · CEDAR',
  'BERGAMOT · IRIS · WHITE MUSK',
  'BLACK FIG · TONKA · VETIVER',
  'NEROLI · TEA LEAF · SOFT WOOD',
  'ROSE PETAL · SAFFRON · SUEDE',
];

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(price || 0);
}

function normaliseProducts(items) {
  return items.map((item, index) => {
    const fallback = FALLBACK_PRODUCTS[index % FALLBACK_PRODUCTS.length];
    const image = Array.isArray(item.images) && item.images.length ? item.images[0] : item.thumbnail;
    return {
      id: item.id,
      title: item.title || fallback.title,
      brand: item.brand || 'Sillage Studio',
      price: Number(item.price) || fallback.price,
      description: item.description || fallback.description,
      image: image || fallback.image,
      fallbackImage: fallback.fallbackImage,
      volume: index % 3 === 1 ? '30 ML' : '50 ML',
      notes: NOTES[index % NOTES.length],
      rating: item.rating,
    };
  });
}

function ArrowIcon({ direction = 'right', className = '' }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {direction === 'left' ? (
        <path d="M19 12H5M5 12l6.5-6.5M5 12l6.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 12h14m0 0-6.5-6.5M19 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5.5 8.5h13l1 12h-15l1-12Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 9V6.25a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Reveal({ children, className = '', delay = 0 }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return undefined;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ProductImage({ product, className = '', eager = false }) {
  const [source, setSource] = useState(product.image || product.fallbackImage);
  const [usingFallback, setUsingFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSource(product.image || product.fallbackImage);
    setUsingFallback(false);
    setFailed(false);
  }, [product.image, product.fallbackImage]);

  function handleImageError() {
    if (!usingFallback && product.fallbackImage && product.fallbackImage !== source) {
      setUsingFallback(true);
      setSource(product.fallbackImage);
      return;
    }
    setFailed(true);
  }

  return (
    <div className={`product-image ${className}`}>
      {!failed ? (
        <img
          src={source}
          alt={`${product.title} fragrance bottle`}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />
      ) : (
        <div className="bottle-placeholder" aria-hidden="true">
          <span className="bottle-cap" />
          <span className="bottle-body"><i>S.</i></span>
        </div>
      )}
    </div>
  );
}

function Header({ bagCount, bagOpen, onBagClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'THE SHELF', href: '#shop', index: '01' },
    { label: 'OUR RITUAL', href: '#ritual', index: '02' },
    { label: 'THE STUDIO', href: '#about', index: '03' },
  ];

  return (
    <header className="site-header flex items-center">
      <a className="wordmark" href="#top" onClick={closeMenus} aria-label="Sillage home">
        <span className="wordmark-mark" aria-hidden="true"><i /><i /><i /></span>
        <span>SILLAGE<span className="wordmark-period">.</span></span>
      </a>

      <div className="desktop-menu-root" onMouseLeave={() => setMenuOpen(false)}>
        <motion.div
          className="liquid-panel"
          animate={{
            width: menuOpen ? 340 : 140,
            height: menuOpen ? 320 : 48,
            paddingBottom: menuOpen ? 20 : 0,
            borderRadius: menuOpen ? '20px 20px 0px 0px' : '999px',
          }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 28 }}
        >
          <button
            className="liquid-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="desktop-menu-panel"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? 'CLOSE' : 'EXPLORE'}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                className="liquid-menu-icon"
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: menuOpen ? -90 : 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: menuOpen ? 90 : -90, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                aria-hidden="true"
              >
                {menuOpen ? <CloseIcon /> : <ArrowIcon />}
              </motion.span>
            </AnimatePresence>
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                id="desktop-menu-panel"
                className="liquid-menu-links"
                aria-label="Main navigation"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={reduceMotion ? { duration: 0 } : { delay: 0.1, duration: 0.2 }}
              >
                {navLinks.map((item) => (
                  <a key={item.href} href={item.href} onClick={closeMenus}>
                    <span className="liquid-link-index">{item.index}</span>
                    <span>{item.label}</span>
                    <ArrowIcon />
                  </a>
                ))}
                <span className="menu-note">LEAVE A LITTLE MYSTERY.</span>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="header-actions">
        <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="mobile-menu-sheet" onClick={() => setMobileOpen((open) => !open)}>
          <span className={`hamburger ${mobileOpen ? 'is-open' : ''}`} aria-hidden="true"><i /><i /><i /></span>
          <span className="mobile-menu-label">{mobileOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
        <button className="bag-button" type="button" aria-expanded={bagOpen} aria-controls="bag-drawer" aria-label={`${bagOpen ? 'Close' : 'Open'} shopping bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`} onClick={onBagClick}>
          <BagIcon />
          <span className="bag-button-label">BAG</span>
          <span className="bag-count" aria-live="polite">{bagCount}</span>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu-sheet"
            className="mobile-menu-sheet"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="mobile-sheet-overline">SILLAGE / THE SCENT STUDIO</span>
            <nav aria-label="Mobile navigation">
              {navLinks.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.15 + 0.08 * index, ease: [0.25, 1, 0.5, 1] }}
                >
                  <span>{item.index}</span>{item.label}<ArrowIcon />
                </motion.a>
              ))}
            </nav>
            <div className="mobile-sheet-bottom"><span>SCENT, WITH A POINT OF VIEW.</span><span>EST. 2024</span></div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ product, reduceMotion }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [0, 2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.1]);

  return (
    <section ref={heroRef} id="top" className="hero-outer" aria-label="Sillage fragrance studio">
      <motion.div className="hero-sticky" style={reduceMotion ? undefined : { scale, rotate, opacity }}>
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-kicker reveal is-visible">
            <span className="micro-label">INDEPENDENT FRAGRANCE STUDIO</span>
            <span className="hero-kicker-line" />
            <span className="micro-label">NEW YORK · EVERYWHERE</span>
          </div>
          <div className="hero-title-wrap">
            <div className="hero-title-line">
              <span className="hero-side-note">SCENT<br />STUDY Nº 01</span>
              <h1 className="hero-word" aria-label="Scent">
                <span aria-hidden="true">SC</span>
                <span className="hero-image-letter" aria-hidden="true">E</span>
                <span aria-hidden="true">NT</span>
              </h1>
              <span className="hero-side-note hero-side-note-right">EAU DE<br />PARFUM</span>
              <div className="hero-product-frame">
                <ProductImage product={product} eager />
                <span className="hero-product-stamp">S / 01</span>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="hero-script-lockup">
              <p>Wear it like a <em>memory.</em></p>
              <span className="hero-sticker">MADE TO<br />LINGER</span>
            </div>
            <div className="hero-support-row">
              <p>Fragrance for the part of you<br className="desktop-break" /> that never needs an introduction.</p>
              <a className="button button-dark" href="#shop">
                <span>FIND YOUR FREQUENCY</span><ArrowIcon />
              </a>
            </div>
          </div>
          <div className="hero-scroll-hint" aria-hidden="true"><span>SCROLL TO FEEL</span><i /></div>
        </div>
      </motion.div>
    </section>
  );
}

function MarqueeCard({ product, index }) {
  return (
    <article className="marquee-card">
      <div className="marquee-card-meta">
        <span>OBJECT Nº {String(index + 1).padStart(2, '0')}</span>
        <span className="marquee-dot" />
        <span>50 ML</span>
      </div>
      <div className="marquee-card-visual"><ProductImage product={product} /></div>
      <div className="marquee-card-copy">
        <span className="marquee-note">{product.notes}</span>
        <h3>{product.title}</h3>
        <span className="marquee-card-price">{formatPrice(product.price)}</span>
      </div>
      <span className="marquee-card-corner" aria-hidden="true">↗</span>
    </article>
  );
}

function MarqueeRow({ products, reverse = false, rowIndex = 0 }) {
  const items = products.length ? products : FALLBACK_PRODUCTS;
  const copies = [0, 1];
  return (
    <div className={`marquee-row ${reverse ? 'marquee-row-reverse' : ''}`}>
      <div className={`marquee-track ${reverse ? 'marquee-track-reverse' : ''}`}>
        {copies.map((copy) => (
          <div className="marquee-group" key={`${rowIndex}-${copy}`} aria-hidden={copy === 1 ? 'true' : undefined}>
            {items.slice(0, 4).map((product, index) => (
              <MarqueeCard key={`${copy}-${product.id}`} product={product} index={index + rowIndex * 4} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Marquee({ products }) {
  const list = products.length ? products : FALLBACK_PRODUCTS;
  return (
    <section className="marquee-section" aria-labelledby="marquee-heading">
      <div className="marquee-heading-row">
        <Reveal>
          <span className="micro-label">A COLLECTION OF SMALL OBSESSIONS</span>
          <h2 id="marquee-heading">Made to be <em>remembered.</em></h2>
        </Reveal>
        <a className="text-link" href="#shop">MEET THE SCENTS <ArrowIcon /></a>
      </div>
      <div className="marquee-wall" aria-label="Fragrance collection highlights">
        <MarqueeRow products={list} rowIndex={0} />
        <MarqueeRow products={[...list].reverse()} reverse rowIndex={1} />
      </div>
      <div className="marquee-footnote"><span>01 — 04 / THE FIRST EDITION</span><span>SCENT IS A PLACE YOU CAN RETURN TO.</span></div>
    </section>
  );
}

function StoryScene({ reduceMotion }) {
  const sceneRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end end'] });
  const readingY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-65%']);
  const sceneScale = useTransform(scrollYProgress, [0.5, 1], [1, 0.9]);
  const sceneY = useTransform(scrollYProgress, [0.5, 1], [0, -40]);
  const blur = useTransform(scrollYProgress, [0.5, 1], [0, 4]);
  const brightness = useTransform(scrollYProgress, [0.5, 1], [1, 0.5]);
  const sceneFilter = useMotionTemplate`blur(${blur}px) brightness(${brightness})`;
  const copyY = useTransform(scrollYProgress, [0.5, 0.82], [0, -150]);
  const cardY = useTransform(scrollYProgress, [0.5, 0.82], [0, 150]);
  const fade = useTransform(scrollYProgress, [0.5, 0.68], [1, 0]);

  const sceneStyle = reduceMotion ? undefined : { scale: sceneScale, y: sceneY, filter: sceneFilter };
  const copyStyle = reduceMotion ? undefined : { y: copyY, opacity: fade };
  const cardStyle = reduceMotion ? undefined : { y: cardY, opacity: fade };

  return (
    <section ref={sceneRef} id="ritual" className="scene-outer" aria-labelledby="scene-heading">
      <motion.div className="scene-sticky" style={sceneStyle}>
        <div className="scene-grid">
          <motion.div className="scene-copy" style={copyStyle}>
            <span className="micro-label scene-label">FIELD NOTE 001 <i /> THE HUMAN TRACE</span>
            <h2 id="scene-heading">PERFUME,<br /><em>PERSONAL.</em></h2>
            <p>A scent isn't a finishing touch. It's the thing people remember when the room has gone quiet.</p>
            <a href="#about" className="round-link" aria-label="Discover our point of view"><ArrowIcon /></a>
          </motion.div>

          <motion.div className="ritual-card" style={cardStyle}>
            <div className="ritual-card-top">
              <span className="micro-label">THE FORMULA FOR A FEELING</span>
              <span className="ritual-card-index">S/001 — 004</span>
            </div>
            <div className="ritual-window">
              <motion.div className="ritual-reading-list" style={reduceMotion ? undefined : { y: readingY }}>
                <div className="ritual-reading-item">
                  <span className="ritual-number">01</span><div><span className="micro-label">FIRST IMPRESSION</span><h3>A bright little interruption.</h3><p>Yuzu peel, pink pepper, a flash of green.</p></div><span className="ritual-cross">×</span>
                </div>
                <div className="ritual-reading-item">
                  <span className="ritual-number">02</span><div><span className="micro-label">CLOSE ENOUGH</span><h3>Warmth, not volume.</h3><p>Skin musk settles in; sandalwood stays awhile.</p></div><span className="ritual-cross">×</span>
                </div>
                <div className="ritual-reading-item">
                  <span className="ritual-number">03</span><div><span className="micro-label">THE LAST WORD</span><h3>Something only you know.</h3><p>A trace of amber. A memory with no name.</p></div><span className="ritual-cross">×</span>
                </div>
                <div className="ritual-reading-item">
                  <span className="ritual-number">04</span><div><span className="micro-label">THE DRY DOWN</span><h3>Nothing to prove.</h3><p>Quiet confidence, with a pulse underneath.</p></div><span className="ritual-cross">×</span>
                </div>
              </motion.div>
            </div>
            <div className="ritual-card-bottom"><span>COMPOSED IN SMALL BATCHES</span><span className="ritual-signal"><i /><i /><i /><i /><i /></span></div>
          </motion.div>
        </div>
        <div className="scene-bottomline"><span>SCENT HAS A MEMORY.</span><span>SCROLL TO FOLLOW THE NOTES <b>↓</b></span></div>
      </motion.div>
    </section>
  );
}

function CurtainSection({ reduceMotion }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start start'] });
  const waveX = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  return (
    <section ref={sectionRef} className="curtain-section" aria-labelledby="curtain-heading">
      <motion.svg
        className="curtain-wave"
        viewBox="0 0 2880 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={reduceMotion ? undefined : { x: waveX }}
      >
        <path d="M0 48 C120 48 120 12 240 12 S360 48 480 48 S600 84 720 84 S840 48 960 48 S1080 12 1200 12 S1320 48 1440 48 S1560 84 1680 84 S1800 48 1920 48 S2040 12 2160 12 S2280 48 2400 48 S2520 84 2640 84 S2760 48 2880 48 V100 H0 Z" fill="currentColor" />
      </motion.svg>
      <div className="curtain-content">
        <div className="curtain-topline"><span className="micro-label">A SMALL RITUAL. A BIG SHIFT.</span><span className="micro-label">SCENT IS THE SOUVENIR.</span></div>
        <Reveal className="curtain-headline-wrap">
          <h2 id="curtain-heading">WEAR YOUR<br /><em>OWN</em> ATMOSPHERE.</h2>
        </Reveal>
        <div className="curtain-bottomline">
          <p>Layer it. Leave it. Make it yours.<br />There are no rules that smell this good.</p>
          <a className="button button-outline-dark" href="#shop"><span>SHOP THE SCENT EDIT</span><ArrowIcon /></a>
        </div>
        <div className="curtain-stamp" aria-hidden="true">S / S<br />2025</div>
      </div>
    </section>
  );
}

function DragCursor({ visible, dragging, x, y, reduceMotion }) {
  const cursorX = useSpring(x, { stiffness: 300, damping: 25, mass: 0.5 });
  const cursorY = useSpring(y, { stiffness: 300, damping: 25, mass: 0.5 });
  if (reduceMotion) return null;
  return (
    <motion.div className={`drag-cursor ${visible ? 'is-visible' : ''}`} style={{ x: cursorX, y: cursorY, scale: dragging ? 0.9 : 1 }} aria-hidden="true">
      <span>◀ DRAG ▶</span>
    </motion.div>
  );
}

function ProductCard({ product, index, onAdd, suppressClicksUntil }) {
  const volume = product.volume || (index % 3 === 1 ? '30 ML' : '50 ML');
  const titleWords = product.title.trim().split(/\s+/);
  const titleSplit = Math.max(1, Math.ceil(titleWords.length / 2));
  const titleLead = titleWords.slice(0, titleSplit).join(' ');
  const titleTail = titleWords.slice(titleSplit).join(' ') || '\u00a0';
  return (
    <article className="fragrance-card">
      <div className="product-card-topline">
        <span className="micro-label">SILLAGE / {String(index + 1).padStart(2, '0')}</span>
        <span className="product-tag">EAU DE PARFUM</span>
      </div>
      <div className="product-card-orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="product-card-art"><ProductImage product={product} /></div>
      <div className="product-card-body">
        <div className="product-card-heading">
          <div>
            <span className="product-notes">{product.notes || NOTES[index % NOTES.length]}</span>
            <h3><span>{titleLead}</span><em>{titleTail}</em></h3>
          </div>
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <div className="product-card-bottom">
          <span className="product-volume">{volume} <i /> VEGAN · CRUELTY FREE</span>
          <button
            type="button"
            className="add-to-bag-button"
            onClick={(event) => {
              event.stopPropagation();
              if (Date.now() < suppressClicksUntil.current) return;
              onAdd(product);
            }}
            aria-label={`Add ${product.title} to bag for ${formatPrice(product.price)}`}
          >
            <span>ADD TO BAG</span><span className="add-button-plus" aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function ShopCarousel({ products, onAdd, reduceMotion, catalogueState }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const suppressClicksUntil = useRef(0);
  const x = useMotionValue(0);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;
    const measure = () => {
      const left = Math.min(0, viewport.clientWidth - track.scrollWidth);
      setConstraints({ left, right: 0 });
      if (x.get() < left) x.set(left);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [products, x]);

  useEffect(() => {
    const updatePosition = (latest) => {
      setAtStart(latest >= -1);
      setAtEnd(latest <= constraints.left + 1);
    };
    updatePosition(x.get());
    return x.on('change', updatePosition);
  }, [x, constraints.left]);

  const moveCarousel = (direction) => {
    const card = trackRef.current?.firstElementChild;
    const step = card ? card.getBoundingClientRect().width : 440;
    const destination = Math.max(constraints.left, Math.min(0, x.get() + direction * step));
    if (reduceMotion) {
      x.set(destination);
    } else {
      animate(x, destination, { type: 'spring', stiffness: 260, damping: 30 });
    }
  };

  const handlePointerMove = (event) => {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };

  return (
    <section id="shop" className="shop-section" aria-labelledby="shop-heading">
      <div className="shop-heading-row">
        <Reveal>
          <span className="micro-label">THE SILLAGE SHELF <i className="live-dot" /></span>
          <h2 id="shop-heading">Find your<br /><em>frequency.</em></h2>
        </Reveal>
        <div className="shop-heading-side">
          <p>Four moods. No wrong answers.<br />Wear the one that feels like you.</p>
          <div className="carousel-controls" aria-label="Carousel controls">
            <button type="button" onClick={() => moveCarousel(1)} aria-label="Previous fragrances" disabled={atStart}>
              <ArrowIcon direction="left" />
            </button>
            <button type="button" onClick={() => moveCarousel(-1)} aria-label="Next fragrances" disabled={atEnd}>
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
      <div
        className="carousel-viewport"
        ref={viewportRef}
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => { setCursorVisible(false); setDragging(false); }}
        onMouseMove={handlePointerMove}
      >
        <motion.div
          ref={trackRef}
          className="carousel-track"
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.05}
          dragMomentum={!reduceMotion}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (Math.abs(info.offset.x) > 8) suppressClicksUntil.current = Date.now() + 180;
          }}
          style={{ x }}
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onAdd={onAdd} suppressClicksUntil={suppressClicksUntil} />
          ))}
        </motion.div>
        <DragCursor visible={cursorVisible} dragging={dragging} x={mouseX} y={mouseY} reduceMotion={reduceMotion} />
      </div>
      <div className="shop-footline">
        <span>DRAG THE SHELF TO EXPLORE <b>← →</b></span>
        <span>{catalogueState === 'live' ? 'LIVE CATALOGUE · DUMMYJSON OPEN API' : catalogueState === 'loading' ? 'CONNECTING TO THE OPEN FRAGRANCE CATALOGUE…' : 'A CURATED DEMO · DUMMYJSON OPEN API'}</span>
      </div>
    </section>
  );
}

function AboutOutro() {
  return (
    <section id="about" className="outro-section" aria-labelledby="outro-heading">
      <div className="outro-topline"><span className="micro-label">THE SILLAGE POINT OF VIEW</span><span className="micro-label">LESS LOUD. MORE YOU.</span></div>
      <div className="outro-title-wrap">
        <h2 id="outro-heading" className="outro-title">SOME THINGS<br /><em>STAY</em> WITH YOU.</h2>
      </div>
      <div className="outro-lower">
        <p>Good fragrance doesn't walk into a room before you do.<br />It simply gives the room something to remember.</p>
        <a className="button button-lime" href="#shop"><span>MEET YOUR NEW SIGNATURE</span><ArrowIcon /></a>
      </div>
      <div className="outro-wordmark" aria-hidden="true">SILLAGE<span>.</span></div>
    </section>
  );
}

function FlipLink({ href, label, description }) {
  return (
    <a className="footer-flip-link" href={href}>
      <span className="flip-link-face flip-link-front">{label}</span>
      <span className="flip-link-face flip-link-back" aria-hidden="true">{description}</span>
    </a>
  );
}

function Footer({ newsletterEmail, setNewsletterEmail, onSubscribe, subscribed }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-block">
          <a className="footer-wordmark" href="#top">SILLAGE<span>.</span></a>
          <p>Fragrance for the parts of you<br />that words never quite reach.</p>
          <span className="micro-label">NEW YORK · EVERYWHERE</span>
        </div>
        <div className="footer-links-column">
          <h2>EXPLORE</h2>
          <FlipLink href="#shop" label="The scent shelf" description="Explore the edit" />
          <FlipLink href="#ritual" label="Our ritual" description="A closer look" />
          <FlipLink href="#about" label="The studio" description="Our point of view" />
        </div>
        <div className="footer-links-column">
          <h2>THE DETAILS</h2>
          <FlipLink href="#about" label="Ingredients" description="Good to know" />
          <FlipLink href="#about" label="Shipping & returns" description="The fine print" />
          <FlipLink href="#about" label="Care guide" description="Make it last" />
        </div>
        <div className="footer-newsletter">
          <h2>GOOD THINGS, OCCASIONALLY.</h2>
          <p>Notes from the studio. New drops. No noise.</p>
          <form className="newsletter-form" onSubmit={onSubscribe}>
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" placeholder="YOUR EMAIL ADDRESS" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} required />
            <button type="submit" aria-label="Subscribe to the Sillage newsletter"><ArrowIcon /></button>
          </form>
          <span className="newsletter-status" aria-live="polite">{subscribed ? 'YOU’RE ON THE LIST. TALK SOON.' : 'A NOTE, NOT A NEWSLETTER.'}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SILLAGE STUDIO</span>
        <span>CATALOGUE IMAGERY VIA DUMMYJSON OPEN PRODUCTS API</span>
        <div><a href="#top">INSTAGRAM ↗</a><a href="#top">CONTACT ↗</a></div>
      </div>
    </footer>
  );
}

function BagDrawer({ open, items, onClose, onUpdateQuantity, reduceMotion }) {
  const [checkoutNote, setCheckoutNote] = useState(false);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (open) setCheckoutNote(false);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="bag-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.22 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
          <motion.aside id="bag-drawer" className="bag-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-heading" initial={{ x: reduceMotion ? 0 : '100%' }} animate={{ x: 0 }} exit={{ x: reduceMotion ? 0 : '100%' }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 310, damping: 32 }}>
            <div className="bag-drawer-header">
              <div><span className="micro-label">THE GOOD STUFF</span><h2 id="bag-heading">Your bag <em>({quantity})</em></h2></div>
              <button className="bag-close-button" type="button" onClick={onClose} aria-label="Close shopping bag"><CloseIcon /></button>
            </div>
            {items.length ? (
              <>
                <div className="bag-items">
                  {items.map(({ product, quantity: itemQuantity }) => (
                    <article className="bag-item" key={product.id}>
                      <ProductImage product={product} />
                      <div className="bag-item-info"><span className="micro-label">EAU DE PARFUM</span><h3>{product.title}</h3><span>{formatPrice(product.price)}</span>
                        <div className="quantity-control" aria-label={`Quantity for ${product.title}`}>
                          <button type="button" onClick={() => onUpdateQuantity(product.id, -1)} aria-label={`Remove one ${product.title}`}>−</button><span>{itemQuantity}</span><button type="button" onClick={() => onUpdateQuantity(product.id, 1)} aria-label={`Add one ${product.title}`}>+</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="bag-drawer-bottom">
                  <div className="bag-subtotal"><span>SUBTOTAL</span><strong>{formatPrice(subtotal)}</strong></div>
                  <p>Complimentary shipping on orders over $100.</p>
                  <button className="button button-dark bag-checkout" type="button" onClick={() => setCheckoutNote(true)}><span>CONTINUE TO CHECKOUT</span><ArrowIcon /></button>
                  {checkoutNote && <p className="checkout-note" role="status">Checkout isn’t connected in this preview yet — your bag is saved while you keep exploring.</p>}
                  <button className="continue-shopping" type="button" onClick={onClose}>KEEP LOOKING</button>
                </div>
              </>
            ) : (
              <div className="bag-empty"><span className="bag-empty-glyph">S.</span><h3>Nothing in here<br />but possibility.</h3><p>Go find the feeling that follows you home.</p><button className="button button-dark" type="button" onClick={onClose}><span>BACK TO THE SHELF</span><ArrowIcon /></button></div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const reduceMotion = useReducedMotion() ?? false;
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [catalogueState, setCatalogueState] = useState('loading');
  const [bagItems, setBagItems] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const lenis = new Lenis({
      duration: 2.5,
      easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.6,
      touchMultiplier: 2,
    });
    let animationFrame = 0;
    const raf = (time) => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(raf);
    };
    animationFrame = window.requestAnimationFrame(raf);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, [reduceMotion]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setCatalogueState('fallback');
      controller.abort();
    }, 8000);
    fetch(PRODUCT_API, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Catalogue request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.products) && data.products.length) {
          setProducts(normaliseProducts(data.products));
          setCatalogueState('live');
        } else {
          setCatalogueState('fallback');
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setCatalogueState('fallback');
      })
      .finally(() => window.clearTimeout(timeoutId));
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') setBagOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const bagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToBag = (product) => {
    setBagItems((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) return items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { product, quantity: 1 }];
    });
    setBagOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setBagItems((items) => items
      .map((item) => item.product.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  };

  const subscribe = (event) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
      <div className="site-shell">
        <Header bagCount={bagCount} bagOpen={bagOpen} onBagClick={() => setBagOpen((open) => !open)} />
        <main>
          <Hero product={products[0] || FALLBACK_PRODUCTS[0]} reduceMotion={reduceMotion} />
          <div className="black-stage">
            <Marquee products={products} />
            <StoryScene reduceMotion={reduceMotion} />
            <CurtainSection reduceMotion={reduceMotion} />
            <ShopCarousel products={products} onAdd={addToBag} reduceMotion={reduceMotion} catalogueState={catalogueState} />
            <AboutOutro />
          </div>
        </main>
        <Footer newsletterEmail={newsletterEmail} setNewsletterEmail={setNewsletterEmail} onSubscribe={subscribe} subscribed={subscribed} />
        <BagDrawer open={bagOpen} items={bagItems} onClose={() => setBagOpen(false)} onUpdateQuantity={updateQuantity} reduceMotion={reduceMotion} />
      </div>
    </MotionConfig>
  );
}
