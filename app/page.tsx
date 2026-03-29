'use client';

import { useEffect, useRef, useState } from 'react';
import './guyana.css';

export default function GuyanaNextGen() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState('');
    const [joined, setJoined] = useState(false);
    const rxRef = useRef(0);
    const ryRef = useRef(0);
    const mxRef = useRef(0);
    const myRef = useRef(0);

    useEffect(() => {
        // Custom cursor
        const onMouseMove = (e: MouseEvent) => {
            mxRef.current = e.clientX;
            myRef.current = e.clientY;
            if (cursorRef.current) {
                cursorRef.current.style.left = e.clientX + 'px';
                cursorRef.current.style.top = e.clientY + 'px';
            }
        };
        document.addEventListener('mousemove', onMouseMove);

        let rafId: number;
        const animateRing = () => {
            rxRef.current += (mxRef.current - rxRef.current) * 0.12;
            ryRef.current += (myRef.current - ryRef.current) * 0.12;
            if (ringRef.current) {
                ringRef.current.style.left = rxRef.current + 'px';
                ringRef.current.style.top = ryRef.current + 'px';
            }
            rafId = requestAnimationFrame(animateRing);
        };
        animateRing();

        // Cursor grow on hover
        const interactables = document.querySelectorAll('a, button, .comm-item, .tech-card, .prog-card');
        const grow = () => {
            if (cursorRef.current) { cursorRef.current.style.width = '20px'; cursorRef.current.style.height = '20px'; }
            if (ringRef.current) { ringRef.current.style.width = '56px'; ringRef.current.style.height = '56px'; }
        };
        const shrink = () => {
            if (cursorRef.current) { cursorRef.current.style.width = '12px'; cursorRef.current.style.height = '12px'; }
            if (ringRef.current) { ringRef.current.style.width = '36px'; ringRef.current.style.height = '36px'; }
        };
        interactables.forEach(el => { el.addEventListener('mouseenter', grow); el.addEventListener('mouseleave', shrink); });

        // Scroll reveal
        const reveals = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 60);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        reveals.forEach(el => obs.observe(el));

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafId);
            interactables.forEach(el => { el.removeEventListener('mouseenter', grow); el.removeEventListener('mouseleave', shrink); });
            obs.disconnect();
        };
    }, []);

    const tickerItems = ['Tech & Innovation', 'Community Development', 'Digital Guyana', 'NextGen Leaders', 'Coding Bootcamps', 'Grassroots Impact', 'GY Future'];

    return (
        <>
            {/* Custom Cursor */}
            <div className="cursor" ref={cursorRef} />
            <div className="cursor-ring" ref={ringRef} />

            {/* NAV */}
            <nav>
                <div className="logo">Guyana<em>Next</em>Gen</div>
                <ul className="nav-links">
                    <li><a href="#about">About</a></li>
                    <li><a href="#tech">Technology</a></li>
                    <li><a href="#community">Community</a></li>
                    <li><a href="#programs">Programs</a></li>
                    <li><a href="#cta" className="nav-pill">Join Now</a></li>
                </ul>
            </nav>

            {/* HERO */}
            <section id="hero">
                <div className="hero-glow glow-gold" />
                <div className="hero-glow glow-green" />
                <div className="hero-eyebrow">
                    <div className="eyebrow-line" />
                    Guyana&apos;s Innovation Initiative
                </div>
                <h1 className="hero-title">
                    <span className="line1">BUILD.</span>
                    <span className="line2">CONNECT.</span>
                    <span className="line3">LEAD.</span>
                </h1>
                <div className="hero-bottom">
                    <div>
                        <p className="hero-desc">
                            <strong>GuyanaNextGen</strong> is powering Guyana&apos;s next wave of technologists and community builders — driving innovation from the inside out.
                        </p>
                        <div className="hero-actions" style={{ marginTop: '2rem' }}>
                            <a href="#cta" className="btn-gold">Get Involved</a>
                            <a href="#tech" className="btn-ghost">Our Programs</a>
                        </div>
                    </div>
                    <div className="hero-scroll">
                        <div className="scroll-bar" />
                        Scroll
                    </div>
                </div>
            </section>

            {/* TICKER */}
            <div className="ticker">
                <div className="ticker-inner">
                    {[...tickerItems, ...tickerItems].map((item, i) => (
                        <div className="ticker-item" key={i}>
                            {item} <div className="ticker-dot" />
                        </div>
                    ))}
                </div>
            </div>

            {/* ABOUT */}
            <section id="about">
                <div className="section-wrap">
                    <div className="label label-green reveal">Who We Are</div>
                    <h2 className="display reveal">
                        GUYANA&apos;S<br />BOLDEST BET<br /><span style={{ color: 'var(--gold)' }}>ON ITS PEOPLE</span>
                    </h2>
                    <div className="about-grid">
                        <div className="about-text reveal">
                            <p>GuyanaNextGen sits at the intersection of <strong>technology and community</strong>. We believe Guyana&apos;s greatest resource isn&apos;t oil — it&apos;s the brilliance of its people.</p>
                            <p>As our nation enters its most transformative decade, we&apos;re building the infrastructure that turns potential into power: <strong>digital skills, connected communities, and confident leaders</strong> ready to shape what comes next.</p>
                            <p>From the coast to the hinterland, we show up where it matters most.</p>
                            <div className="flag-bar">
                                <div className="fb-green" /><div className="fb-gold" /><div className="fb-red" />
                            </div>
                        </div>
                        <div className="about-stat-grid reveal">
                            {[
                                { num: '500+', label: 'Youth Reached' },
                                { num: '12', label: 'Communities' },
                                { num: '10', label: 'Regions Active' },
                                { num: '3yr', label: 'of Impact' },
                            ].map((s) => (
                                <div className="about-stat" key={s.label}>
                                    <div className="stat-big">{s.num}</div>
                                    <div className="stat-sub">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TECH */}
            <section id="tech">
                <div className="section-wrap">
                    <div className="tech-header reveal">
                        <div>
                            <div className="label label-gold">Technology</div>
                            <h2 className="display">DIGITAL<br />GUYANA<br /><span style={{ color: 'var(--green)' }}>STARTS HERE</span></h2>
                        </div>
                        <p className="tech-intro">We&apos;re closing the digital divide and building world-class tech talent — right here in Guyana. No passport required.</p>
                    </div>
                    <div className="tech-cards reveal">
                        {[
                            { num: '01', icon: '💻', title: 'Code Guyana Bootcamp', desc: 'Intensive coding programs covering web development, Python, and data fundamentals — free for youth aged 16–30 across all regions.', tag: 'Free Program', glow: 'var(--green)' },
                            { num: '02', icon: '📱', title: 'App Factory', desc: 'Hackathons where teams build real apps solving real Guyanese problems — with mentorship and seed funding for the best ideas.', tag: 'Hackathons', glow: 'var(--gold)' },
                            { num: '03', icon: '🤖', title: 'AI for Guyana', desc: 'Demystifying artificial intelligence and equipping youth with AI literacy to thrive — and lead — in the age of automation.', tag: 'New 2025', glow: 'var(--red)' },
                            { num: '04', icon: '🌐', title: 'Digital Literacy Hubs', desc: 'Community tech centres bringing internet access, devices, and digital skills to underserved areas across the interior.', tag: '12 Locations', glow: 'var(--gold)' },
                            { num: '05', icon: '🚀', title: 'Startup Launchpad', desc: 'A structured program supporting early-stage Guyanese tech startups with mentorship, resources, and investor connections.', tag: 'Cohort 2 Open', glow: 'var(--green)' },
                            { num: '06', icon: '🎓', title: 'Tech Scholarship Fund', desc: 'Partnering with universities and online platforms to fund tech education for Guyanese youth who demonstrate drive and potential.', tag: 'Apply Now', glow: 'var(--red)' },
                        ].map((card) => (
                            <div className="tech-card" key={card.num} style={{ '--card-glow': card.glow } as React.CSSProperties}>
                                <div className="tc-num">{card.num}</div>
                                <span className="tc-icon">{card.icon}</span>
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                                <div className="tc-tag">{card.tag}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMMUNITY */}
            <section id="community">
                <div className="section-wrap">
                    <div className="label label-green reveal">Community Impact</div>
                    <h2 className="display reveal">ROOTED IN<br /><span style={{ color: 'var(--gold)' }}>EVERY</span><br />COMMUNITY</h2>
                    <div className="community-layout">
                        <div className="comm-visual reveal">
                            <div className="comm-map-bg" />
                            {[
                                { w: 10, h: 10, top: '25%', left: '40%', delay: '0s' },
                                { w: 14, h: 14, top: '45%', left: '55%', delay: '0.5s' },
                                { w: 8, h: 8, top: '60%', left: '35%', delay: '1s' },
                                { w: 12, h: 12, top: '70%', left: '60%', delay: '1.5s' },
                                { w: 10, h: 10, top: '35%', left: '65%', delay: '0.8s', gold: true },
                                { w: 8, h: 8, top: '55%', left: '45%', delay: '0.3s', gold: true },
                            ].map((d, i) => (
                                <div key={i} className="map-dot" style={{
                                    width: d.w, height: d.h, top: d.top, left: d.left,
                                    animationDelay: d.delay,
                                    ...(d.gold ? { background: 'var(--gold)', boxShadow: '0 0 12px var(--gold)' } : {}),
                                }} />
                            ))}
                            <div className="comm-map-label">GUYANA</div>
                            <div className="comm-number">10<span>Regions Active</span></div>
                        </div>
                        <div className="comm-list reveal">
                            {[
                                { icon: '🏘️', title: 'Neighbourhood Innovation Grants', desc: 'Small grants empowering local youth to design and implement projects that directly address needs in their own communities.' },
                                { icon: '🤝', title: 'Community Tech Ambassadors', desc: 'Trained youth representatives in every region who bring digital skills back home and advocate for local needs.' },
                                { icon: '📡', title: 'Connectivity Projects', desc: 'Working with partners to expand internet access in underserved communities — because digital transformation starts with connection.' },
                                { icon: '🌱', title: 'Green Tech for Communities', desc: 'Sustainable tech solutions — solar power, clean water monitoring, agritech — developed by youth, for their communities.' },
                            ].map((item) => (
                                <div className="comm-item" key={item.title}>
                                    <div className="ci-icon">{item.icon}</div>
                                    <div>
                                        <div className="ci-title">{item.title}</div>
                                        <div className="ci-desc">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PROGRAMS */}
            <section id="programs">
                <div className="section-wrap">
                    <div className="label label-gold reveal">Programs</div>
                    <h2 className="display reveal">FLAGSHIP<br /><span style={{ color: 'var(--green)' }}>INITIATIVES</span></h2>
                    <div className="prog-grid reveal">
                        <div className="prog-card span2" style={{ background: 'linear-gradient(135deg,#0f0f1c 0%,#1a1a30 100%)' }}>
                            <div className="prog-large-bg">NEXT</div>
                            <div className="prog-badge badge-gold">⭐ Featured Program</div>
                            <h3 style={{ fontSize: '3.5rem' }}>NextGen<br />Leaders Academy</h3>
                            <p style={{ maxWidth: '380px' }}>A 6-month intensive combining tech skills, leadership training, and community project execution. Fully funded for accepted participants.</p>
                            <a href="#cta" className="prog-arrow gold">Apply for 2026 Cohort →</a>
                        </div>
                        {[
                            { badge: '💻 Technology', badgeClass: 'badge-green', title: 'Code\nGuyana', desc: 'Free coding bootcamps nationwide, delivered in-person and online.', arrowClass: 'green' },
                            { badge: '🚀 Innovation', badgeClass: 'badge-gold', title: 'Startup\nLaunchpad', desc: 'Structured support for early-stage tech founders with Guyanese roots.', arrowClass: 'gold' },
                            { badge: '🏘️ Community', badgeClass: 'badge-green', title: 'Roots &\nRise', desc: 'Community grants and ambassador network spanning all 10 regions.', arrowClass: 'green' },
                            { badge: '🌐 Access', badgeClass: 'badge-gold', title: 'Digital\nHubs', desc: 'Tech centres bringing connectivity and skills to the interior and hinterland.', arrowClass: 'gold' },
                        ].map((p) => (
                            <div className="prog-card" key={p.title}>
                                <div className={`prog-badge ${p.badgeClass}`}>{p.badge}</div>
                                <h3>{p.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</h3>
                                <p>{p.desc}</p>
                                <a href="#" className={`prog-arrow ${p.arrowClass}`}>Learn More →</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="cta">
                <div className="cta-grid-bg" />
                <div className="inner reveal">
                    <h2>READY TO<br />BUILD<br />GUYANA&apos;S<br />FUTURE?</h2>
                    <p>Join thousands of young Guyanese who are choosing to build, connect, and lead. Drop your email and we&apos;ll send you opportunities made for you.</p>
                    <div className="cta-form">
                        <input
                            className="cta-input"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className="cta-btn"
                            onClick={() => setJoined(true)}
                            style={joined ? { background: '#007a3d', color: '#fff' } : {}}
                        >
                            {joined ? '✓ Joined!' : 'Join the Movement'}
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <div className="footer-grid">
                    <div>
                        <div className="foot-logo">Guyana<em>Next</em>Gen</div>
                        <p className="foot-tagline">Tech. Community. Future. — Building the generation that transforms Guyana from within.</p>
                        <div className="foot-flag">
                            <div className="ff" style={{ background: 'var(--green)' }} />
                            <div className="ff" style={{ background: 'var(--gold)' }} />
                            <div className="ff" style={{ background: 'var(--red)' }} />
                        </div>
                    </div>
                    {[
                        { title: 'Initiative', links: [{ label: 'About Us', href: '#about' }, { label: 'Technology', href: '#tech' }, { label: 'Community', href: '#community' }, { label: 'Programs', href: '#programs' }] },
                        { title: 'Get Involved', links: [{ label: 'Apply', href: '#cta' }, { label: 'Mentor', href: '#cta' }, { label: 'Partner', href: '#cta' }, { label: 'Donate', href: '#cta' }] },
                        { title: 'Connect', links: [{ label: 'Instagram', href: '#' }, { label: 'LinkedIn', href: '#' }, { label: 'Facebook', href: '#' }, { label: 'Contact', href: '#' }] },
                    ].map((col) => (
                        <div className="footer-col" key={col.title}>
                            <h5>{col.title}</h5>
                            <ul>
                                {col.links.map((link) => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="footer-bottom">
                    <span>© 2026 GuyanaNextGen. All rights reserved.</span>
                    <div className="made-with">
                        <div className="gf-dot" style={{ background: 'var(--green)' }} />
                        <div className="gf-dot" style={{ background: 'var(--gold)' }} />
                        <div className="gf-dot" style={{ background: 'var(--red)' }} />
                        <span>Made with pride. Built for Guyana 🇬🇾</span>
                    </div>
                </div>
            </footer>
        </>
    );
}