'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';

import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

import LoginModal from '@/components/auth/LoginModal';
import { User } from '@supabase/supabase-js';

interface MainPageProps {
  isPaid?: boolean;
  user?: User | null;
  cmsContent?: Record<string, any>;
}

export default function MainPage({ isPaid = false, user, cmsContent = {} }: MainPageProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [promoEnded, setPromoEnded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Helper for safe list access with fallbacks
  const getList = (list: any[] | undefined, fallback: any[]) => {
    return (list && list.length > 0) ? list : fallback;
  };

  // Form State
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; title: string; msg: string }>({ show: false, title: '', msg: '' });

  // Countdown Logic
  useEffect(() => {
    const PROMO_KEY = "promoEndsAt_v1";
    let end = 0;
    const saved = localStorage.getItem(PROMO_KEY);
    if (saved) {
      const t = Number(saved);
      if (Number.isFinite(t) && t > Date.now() + 60_000) end = t;
    }
    if (!end) {
      end = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(PROMO_KEY, String(end));
    }

    const tick = () => {
      const now = Date.now();
      let diff = end - now;
      if (diff <= 0) {
        diff = 0;
        setPromoEnded(true);
      }

      const sec = Math.floor(diff / 1000);
      setTimeLeft({
        days: Math.floor(sec / 86400),
        hours: Math.floor((sec % 86400) / 3600),
        minutes: Math.floor((sec % 3600) / 60),
        seconds: sec % 60,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (title: string, msg: string) => {
    setToast({ show: true, title, msg });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5200);
  };

  const handlePay = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (isPaid) {
      window.location.href = '/guide';
      return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showToast("Email required", "Please enter a valid email to receive your access link.");
      document.getElementById('email')?.focus();
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      showToast("Phone required", "Please enter a valid phone number for support.");
      document.getElementById('phone')?.focus();
      return;
    }

    setLoading(true);
    showToast("Initializing...", "Please wait while we set up the secure checkout.");

    try {
      // Initialize transaction on backend
      const res = await axios.post('/api/paystack/initialize', {
        email: formData.email,
        amount: 1000, // NGN
        metadata: {
          custom_fields: [
            { display_name: "Full Name", variable_name: "full_name", value: formData.fullName || "—" },
            { display_name: "Phone", variable_name: "phone", value: formData.phone || "—" },
            { display_name: "Product", variable_name: "product", value: "CAC Registration via SMEDAN (FREE) — Step-by-step Course" }
          ]
        }
      });

      const { authorization_url, access_code, reference } = res.data.data;

      // Open Paystack Popup
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: 1000 * 100,
        currency: 'NGN',
        ref: reference, // Use backend reference
        callback: function (response: any) {
          showToast("Processing...", "Verifying payment...");
          // Redirect to verify route or handle close
          // We can let the backend verify via webhook, but for immediate feedback:
          window.location.href = `/api/paystack/verify?reference=${response.reference}`;
        },
        onClose: function () {
          showToast("Checkout closed", "You can resume anytime.");
          setLoading(false);
        }
      });
      handler.openIframe();
    } catch (err) {
      console.error(err);
      showToast("Error", "Could not initialize payment. Please try again.");
      setLoading(false);
    }
  };

  // Smooth Scroll
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Skip Link */}
      <a className="skip-link" href="#main">Skip to content</a>

      {/* Nav */}
      <header className="nav" role="banner">
        <div className="container">
          <div className="nav-inner">
            <a className="brand" href="#top" aria-label="Go to top" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}>
              <div className="logo" aria-hidden="true"></div>
              <div className="name">
                <strong>CAC via SMEDAN Guide</strong>
                <span>Limited promo • ₦1000 access</span>
              </div>
            </a>

            <nav className="nav-links" aria-label="Primary">
              <a href="#how" onClick={(e) => { e.preventDefault(); scrollTo('how'); }}>How it works</a>
              <a href="#what" onClick={(e) => { e.preventDefault(); scrollTo('what'); }}>What you get</a>
              <a href="#proof" onClick={(e) => { e.preventDefault(); scrollTo('proof'); }}>Trust</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }}>Pricing</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
            </nav>

            <div className="nav-cta">
              <span className="pill hide-mobile" title="Secure payment">
                <span className="dot" aria-hidden="true"></span>
                Secure payment via Paystack
              </span>

              {!isPaid && (
                <button
                  className="btn-icon"
                  title="Already paid? Login"
                  style={{
                    marginRight: '12px',
                    background: 'rgba(11, 94, 46, 0.08)',
                    border: '1.5px solid #0B5E2E',
                    color: '#0B5E2E',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setShowLogin(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}

              <button className="btn btn-primary" id="navPayBtn" type="button" aria-label="Pay and get access" onClick={() => handlePay()}>
                {isPaid ? "Course Access" : "Get Access"}
                <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 12H4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="hero" id="top">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-left">
                <div className="badge-row">
                  <div className="promo-badge" role="status" aria-label="Promo price">
                    <span className="strike"><s>₦{cmsContent.pricing?.originalPrice || 3000}</s></span>
                    <span>cancelled</span>
                    <span style={{ opacity: .85 }}>→</span>
                    <span className="now">Now ₦{cmsContent.pricing?.price || 1000}</span>
                    <span style={{ opacity: .85 }}>• limited-time</span>
                  </div>
                </div>

                <h1 id="hero-title">{cmsContent.hero?.headline || "Register Your Business with CAC"}</h1>
                <p className="hero-p">
                  {cmsContent.hero?.subheadline || "A practical, step-by-step guide to help you register your business independently with the Corporate Affairs Commission (CAC). Save time, save money, and get it right the first time."}
                </p>

                <div className="hero-actions">
                  <button className="btn btn-primary btn-lg" type="button" onClick={() => scrollTo('pricing')}>
                    {cmsContent.hero?.ctaText || "Get the Guide Now"}
                    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 12H4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </button>

                  {!isPaid && (
                    <button
                      className="btn btn-secondary btn-lg"
                      type="button"
                      onClick={() => setShowLogin(true)}
                      style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1.5px solid white', color: 'white' }}
                    >
                      Already paid? Login
                    </button>
                  )}
                </div>

                <div className="microtrust" aria-label="Trust indicators">
                  <span className="check">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="rgba(255,255,255,0.92)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Clear steps (Beginner-friendly)
                  </span>
                  <span className="check">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 2l7 4v6c0 5-3 9-7 10C8 21 5 17 5 12V6l7-4Z" stroke="rgba(255,255,255,0.92)" strokeWidth="2.0" strokeLinejoin="round" />
                      <path d="M9.5 12l1.8 1.8L15.8 9" stroke="rgba(255,255,255,0.92)" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Paystack-secured payment
                  </span>
                  <span className="check">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 8v5l3 2" stroke="rgba(255,255,255,0.92)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="rgba(255,255,255,0.92)" strokeWidth="2.0" />
                    </svg>
                    Lifetime access + updates
                  </span>
                </div>
              </div>

              <aside className="hero-right" aria-label="Promo countdown and quick checkout">
                <div className="glass-card">
                  <div className="card-pad">
                    <div className="countdown-title">
                      <strong>Promo ends soon</strong>
                      <span id="promoEndsLabel" aria-live="polite">{promoEnded ? "Promo ended" : "Limited-time"}</span>
                    </div>

                    <div className="timer" role="timer" aria-label="Countdown timer">
                      <div className="timebox">
                        <div className="num" id="dd">{String(timeLeft.days).padStart(2, '0')}</div>
                        <div className="lbl">Days</div>
                      </div>
                      <div className="timebox">
                        <div className="num" id="hh">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="lbl">Hours</div>
                      </div>
                      <div className="timebox">
                        <div className="num" id="mm">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="lbl">Minutes</div>
                      </div>
                      <div className="timebox">
                        <div className="num" id="ss">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="lbl">Seconds</div>
                      </div>
                    </div>

                    <form className="mini-form" id="payForm" onSubmit={handlePay}>
                      <div className="field-row">
                        <input className="input" type="text" id="fullName" name="fullName" placeholder="Full name" autoComplete="name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        <input className="input" type="tel" id="phone" name="phone" placeholder="Phone (WhatsApp)" autoComplete="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                      <input className="input" type="email" id="email" name="email" placeholder="Email for access link" autoComplete="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={isPaid} />
                      <button className="btn btn-primary" id="payBtn" type="submit" disabled={loading}>
                        {loading ? "Processing..." : (isPaid ? "Continue to Course" : "Pay ₦1000 & Get Instant Access")}
                        {!loading && (
                          <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M17 8V7a5 5 0 0 0-10 0v1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                            <path d="M7 8h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <p className="hero-note">
                        You’ll receive your access link by email after payment. WhatsApp support included.
                      </p>
                    </form>
                  </div>
                </div>

                <div className="glass-card">
                  <div className="card-pad">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div className="kicon" style={{ background: 'rgba(244,180,0,0.16)', borderColor: 'rgba(244,180,0,0.26)' }}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M12 2l7 4v6c0 5-3 9-7 10C8 21 5 17 5 12V6l7-4Z" stroke="rgba(255,255,255,0.95)" strokeWidth="2.0" strokeLinejoin="round" />
                          <path d="M9.5 12l1.8 1.8L15.8 9" stroke="rgba(255,255,255,0.95)" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <strong style={{ display: 'block', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.95)' }}>Trust-first, Nigerian institutional tone</strong>
                        <span style={{ display: 'block', marginTop: '4px', fontSize: '13px', color: 'rgba(244,247,255,0.80)' }}>
                          This is a guidance course to help you navigate the SMEDAN route clearly. Not a government office.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="anchor-pad" >
          <div className="container">
            <div className="section-head">
              <div>
                <h2>{cmsContent.how?.title || "How it works (3 simple steps)"}</h2>
                <p>{cmsContent.how?.subtitle || "Everything is structured so you can move from zero to submitted registration without confusion."}</p>
              </div>
            </div>

            <div className="grid-3">
              {getList(cmsContent.how?.steps, [
                { title: "Enroll for ₦1000 promo access", description: "Make a secure payment via Paystack and receive your access link immediately.", kicker: "Step 1 • Enroll", icon: "M4 7h16M4 12h16M4 17h10" },
                { title: "Use the step-by-step checklist", description: "See what to prepare, what to enter, and what to double-check to avoid rejections/delays.", kicker: "Step 2 • Follow guide", icon: "M4 4h16v16H4z M7 9h10M7 13h7" },
                { title: "Apply using the SMEDAN pathway", description: "The course explains the SMEDAN-supported process where CAC fees are covered (when eligible and slots are available).", kicker: "Step 3 • Register via SMEDAN", icon: "M12 2l9 5-9 5-9-5 9-5Z M3 10v7l9 5 9-5v-7" }
              ]).map((step: any, idx: number) => (
                <div key={idx} className="glass-light">
                  <div className="card">
                    <div className="kicker">
                      <span className="kicon" aria-hidden="true">
                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                          <path d={step.icon || "M12 2l9 5-9 5-9-5 9-5Z"} stroke="rgba(15,28,46,0.82)" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                      </span>
                      {step.kicker}
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section id="what" className="anchor-pad" >
          <div className="container">
            <div className="section-head">
              <div>
                <h2>{cmsContent.what?.title || "What you get inside"}</h2>
                <p>{cmsContent.what?.subtitle || "Built for clarity, speed, and confidence — with support when you need it."}</p>
              </div>
            </div>

            <div className="features">
              <div>
                <div className="feature-list">
                  {getList(cmsContent.what?.features, [
                    { title: "Step-by-step guide page", description: "Simple flow, screenshots, and checklists so you don’t miss anything." },
                    { title: "WhatsApp support", description: "Ask questions and get guided on common blockers and corrections." },
                    { title: "Lifetime access", description: "Revisit the guide anytime — no expiring login drama." },
                    { title: "Updated instructions", description: "When forms/links change, the guide is refreshed so you stay current." }
                  ]).map((f: any, i: number) => (
                    <div className="feat" key={i}>
                      <div className="tick" aria-hidden="true">
                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="rgba(30,132,73,0.95)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <strong>{f.title}</strong>
                        <span>{f.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="side-card">
                <div className="inner">
                  <h3>{cmsContent.what?.sideCardTitle || "Designed to feel official and reliable"}</h3>
                  <p>
                    {cmsContent.what?.sideCardText || "The layout mirrors the way institutional processes work: requirements → steps → submission → follow-up. No noise, no hype."}
                  </p>
                  <div className="chips" aria-label="Key assurances">
                    {getList(cmsContent.what?.chips, ["Beginner-friendly", "Clear checklists", "Fast support", "Secure checkout"]).map((chip: string) => (
                      <span key={chip} className="chip">{chip}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROOF & TRUST */}
        <section id="proof" className="anchor-pad" >
          <div className="container">
            <div className="section-head">
              <div>
                <h2>{cmsContent.proof?.title || "Proof & trust"}</h2>
                <p>{cmsContent.proof?.subtitle || "Social proof, sample screenshots space, and a secure payment flow your customers recognize."}</p>
              </div>
            </div>

            <div className="proof-wrap">
              <div className="testimonials" aria-label="Testimonials">
                {getList(cmsContent.proof?.testimonials, [
                  { name: "Amaka • Lagos", text: "I didn’t know where to start. The checklist and screenshots made everything straightforward, and support replied fast.", quote: "Clear steps, no confusion.", stars: 5 },
                  { name: "Mustapha • Abuja", text: "I avoided common mistakes that cause delays. The guide is structured like an official process.", quote: "Saved me time.", stars: 5 },
                  { name: "Ifeoma • Enugu", text: "For ₦1000 promo it’s a no-brainer. The updates also help because links and steps change.", quote: "Worth it even at ₦3000.", stars: 5 }
                ]).map((t: any, i: number) => (
                  <div key={i} className="tcard">
                    <div className="tmeta">
                      <div className="who">
                        <div className="avatar" aria-hidden="true">{t.name.charAt(0)}</div>
                        <div>
                          <strong>{t.name}</strong>
                          <span>“{t.quote}”</span>
                        </div>
                      </div>
                      <div className="stars" aria-label={`${t.stars} star rating`}>{"★".repeat(t.stars)}</div>
                    </div>
                    <p className="tquote">{t.text}</p>
                  </div>
                ))}
              </div>

              <div className="proof-right" aria-label="Screenshots and payment security">
                <div className="shots" aria-label="Certificate / proof screenshots placeholders">
                  <div className="shot" role="img" aria-label="Placeholder for certificate screenshot 1">
                    <div className="ph">
                      <strong>Certificate / Proof Screenshot</strong>
                      <span>Drop an image here (e.g., CAC certificate sample / confirmation screenshots)</span>
                    </div>
                  </div>
                  <div className="shot" role="img" aria-label="Placeholder for certificate screenshot 2">
                    <div className="ph">
                      <strong>Certificate / Proof Screenshot</strong>
                      <span>Use real customer outcomes for maximum trust</span>
                    </div>
                  </div>
                </div>

                <div className="secure" aria-label="Secure payment notice">
                  <div className="left">
                    <div className="lock" aria-hidden="true">
                      <svg className="icon" viewBox="0 0 24 24" fill="none">
                        <path d="M17 11V8a5 5 0 0 0-10 0v3" stroke="rgba(11,94,46,0.95)" strokeWidth="2.2" strokeLinecap="round" />
                        <path d="M7 11h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" stroke="rgba(11,94,46,0.95)" strokeWidth="2.2" strokeLinejoin="round" />
                        <path d="M12 15v3" stroke="rgba(11,94,46,0.95)" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <strong>{cmsContent.proof?.trustNoticeTitle || "Secure Payment via Paystack"}</strong>
                      <span>{cmsContent.proof?.trustNoticeText || "Cards, bank transfer, USSD (options depend on Paystack settings)"}</span>
                    </div>
                  </div>
                  <button className="btn btn-secondary" id="proofPayBtn" type="button" onClick={() => handlePay()}>Pay ₦1000</button>
                </div>

                <div className="glass-light">
                  <div className="card">
                    <div className="kicker">
                      <span className="kicon" aria-hidden="true">
                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                          <path d="M20 7l-8 8-4-4" stroke="rgba(15,28,46,0.82)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z" stroke="rgba(15,28,46,0.82)" strokeWidth="2.0" />
                        </svg>
                      </span>
                      Credibility
                    </div>
                    <h3>Clear boundaries (trust-building)</h3>
                    <p>
                      {cmsContent.proof?.disclaimer || "This is an educational guide + support to help you complete your SMEDAN/CAC process correctly. We are not a government agency and do not issue certificates ourselves."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about anchor-pad" >
          <div className="container">
            <div className="section-head">
              <div>
                <h2>About this course</h2>
                <p>Built from real registration experiences and common issues Nigerian business owners face.</p>
              </div>
            </div>

            <div className="about-grid">
              <div className="glass-light">
                <div className="card">
                  <div className="kicker">
                    <span className="kicon" aria-hidden="true">
                      <svg className="icon" viewBox="0 0 24 24" fill="none">
                        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="rgba(15,28,46,0.82)" strokeWidth="2.0" />
                        <path d="M3 22a9 9 0 0 1 18 0" stroke="rgba(15,28,46,0.82)" strokeWidth="2.0" strokeLinecap="round" />
                      </svg>
                    </span>
                    Experience-driven
                  </div>
                  <h3>Practical, not theoretical</h3>
                  <p>
                    The guide focuses on what you actually need: requirements, exact steps, and how to avoid common mistakes that lead to delays or rework.
                  </p>
                </div>
              </div>

              <div className="glass-light">
                <div className="card">
                  <div className="kicker">
                    <span className="kicon" aria-hidden="true">
                      <svg className="icon" viewBox="0 0 24 24" fill="none">
                        <path d="M7 7h10v10H7z" stroke="rgba(15,28,46,0.82)" strokeWidth="2.2" />
                        <path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="rgba(15,28,46,0.82)" strokeWidth="2.2" strokeLinecap="round" />
                        <path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="rgba(15,28,46,0.82)" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </span>
                    Support included
                  </div>
                  <h3>Guidance + WhatsApp support</h3>
                  <p>
                    You’re not left alone. If you get stuck on a step, you can ask for help and get direction to proceed correctly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="pricing anchor-pad" >
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Limited-time promo pricing</h2>
                <p>Professional guidance at a promotional price — designed to help you act quickly without pressure tactics.</p>
              </div>
            </div>

            <div className="price-wrap">
              <div className="price-card">
                <div className="price-inner">
                  <div className="kicker" style={{ background: 'rgba(244,180,0,0.12)', borderColor: 'rgba(244,180,0,0.20)' }}>
                    <span className="kicon" style={{ background: 'rgba(244,180,0,0.16)', borderColor: 'rgba(244,180,0,0.26)' }} aria-hidden="true">
                      <svg className="icon" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8v5l3 2" stroke="rgba(15,28,46,0.88)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="rgba(15,28,46,0.88)" strokeWidth="2.0" />
                      </svg>
                    </span>
                    Promo active
                  </div>

                  <h3 style={{ margin: 0, fontSize: '18px', letterSpacing: '-0.02em', fontWeight: 900 }}>CAC Registration via SMEDAN (FREE) — Course Access</h3>
                  <p className="muted" style={{ margin: '8px 0 0', fontSize: '14px' }}>
                    Includes step-by-step guide, updates, and WhatsApp support.
                  </p>

                  <div className="price-tag">
                    <div>
                      <div className="price">₦{cmsContent.pricing?.price || 1000} <small>/ one-time</small></div>
                    </div>
                    <div className="was"><s>₦{cmsContent.pricing?.originalPrice || 3000}</s> original</div>
                  </div>

                  <div className="limited" aria-live="polite">
                    <span className="pulse" aria-hidden="true"></span>
                    <span><strong>Limited-time offer</strong> — promo ends when countdown hits zero (or slots close).</span>
                  </div>

                  <div className="price-actions">
                    <button className="btn btn-primary" id="pricingPayBtn" type="button" onClick={() => handlePay()}>
                      {isPaid ? "Continue to Course" : "Get Access for ₦1000"}
                      <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 12H4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </button>
                    {!isPaid && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowLogin(true)}
                        style={{ background: 'white', border: '1.5px solid #0B5E2E', color: '#0B5E2E', fontWeight: 600 }}
                      >
                        Already paid? Log in here
                      </button>
                    )}
                    <a className="btn btn-secondary" href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>Read FAQs</a>
                  </div>

                  <div className="divider"></div>
                  <p className="subtle" style={{ margin: 0 }}>
                    Support: {cmsContent.contact?.email || 'support@example.com'} • <a href={`https://wa.me/${cmsContent.contact?.whatsapp || '2348000000000'}`}>WhatsApp</a>
                  </p>
                </div>
              </div>

              <div className="glass-light">
                <div className="card">
                  <div className="kicker">
                    <span className="kicon" aria-hidden="true">
                      <svg className="icon" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2l7 4v6c0 5-3 9-7 10C8 21 5 17 5 12V6l7-4Z" stroke="rgba(15,28,46,0.82)" strokeWidth="2.0" strokeLinejoin="round" />
                        <path d="M9.5 12l1.8 1.8L15.8 9" stroke="rgba(15,28,46,0.82)" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    What makes this high-converting
                  </div>
                  <h3>Everything needed to reduce uncertainty</h3>
                  <p>
                    Buyers want clarity and trust. This page gives them both: a simple process, transparent disclaimers, secure Paystack checkout, and proof placeholders for your real screenshots.
                  </p>
                  <div className="divider"></div>
                  <div className="feature-list" style={{ marginTop: 0 }}>
                    <div className="feat" style={{ boxShadow: 'none' }}>
                      <div className="tick" aria-hidden="true">
                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="rgba(30,132,73,0.95)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <strong>Professional tone (not spammy)</strong>
                        <span>Urgency shown via countdown and promo badge only.</span>
                      </div>
                    </div>
                    <div className="feat" style={{ boxShadow: 'none' }}>
                      <div className="tick" aria-hidden="true">
                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="rgba(30,132,73,0.95)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <strong>Clear “what this is / isn’t”</strong>
                        <span>Builds trust and reduces refunds/complaints.</span>
                      </div>
                    </div>
                    <div className="feat" style={{ boxShadow: 'none' }}>
                      <div className="tick" aria-hidden="true">
                        <svg className="icon" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="rgba(30,132,73,0.95)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <strong>Mobile-first layout</strong>
                        <span>Fast scanning, large CTA, sticky nav CTA.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="anchor-pad" >
          <div className="container">
            <div className="section-head">
              <div>
                <h2>{cmsContent.faq?.title || "FAQ"}</h2>
                <p>{cmsContent.faq?.subtitle || "Transparent answers to reduce hesitation and increase trust."}</p>
              </div>
            </div>

            <div className="faq-grid">
              {getList(cmsContent.faq?.questions, [
                { q: "Is CAC registration really free through SMEDAN?", a: "SMEDAN-supported programs may cover CAC registration fees for eligible applicants and while program slots/funding are available. The course explains how to follow that pathway correctly." },
                { q: "What am I paying ₦1000 for?", a: "You’ll receive your access link by email after payment. WhatsApp support included." },
                { q: "Do you issue CAC certificates?", a: "No. CAC certificates and approvals are issued by the official institutions. We provide guidance and support to help you complete the process properly." }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="faq-item">
                  <details>
                    <summary>
                      {item.q}
                      <svg className="chev" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" stroke="rgba(15,28,46,0.85)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <div className="faq-content">
                      {item.a}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4>CAC via SMEDAN Guide</h4>
              <p>
                A practical course to help Nigerian entrepreneurs navigate the SMEDAN-supported CAC registration pathway with clarity and confidence.
              </p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a className="pill" href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }} style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(244,247,255,0.86)', boxShadow: 'none' }}>
                  Promo: ₦1000
                </a>
                <a className="pill" href="#proof" onClick={(e) => { e.preventDefault(); scrollTo('proof'); }} style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(244,247,255,0.86)', boxShadow: 'none' }}>
                  Secure Paystack checkout
                </a>
              </div>
            </div>

            <div>
              <h4>Contact</h4>
              <p>Email: <a href="mailto:support@example.com">support@example.com</a></p>
              <p style={{ marginTop: '6px' }}>WhatsApp: <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">+234 800 000 0000</a></p>
              <p style={{ marginTop: '6px' }}>Hours: Mon–Sat, 9am–6pm</p>
            </div>

            <div>
              <h4>Disclaimer</h4>
              <p>
                This is an educational product and support service. We are not affiliated with CAC or SMEDAN, and we do not guarantee program availability/approval. Official decisions and issuance remain with the respective institutions.
              </p>
              <div className="footer-links" style={{ marginTop: '12px' }}>
                <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
                <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }}>Pricing</a>
                <a href="/admin/login">Admin Login</a>
                <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}>Back to top</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© <span id="year">{new Date().getFullYear()}</span> CAC via SMEDAN Guide. All rights reserved.</span>
            <span>Built for trust • Mobile-first • Secure checkout</span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      {
        toast.show && (
          <div className={`toast ${toast.show ? 'show' : ''} `} role="status" aria-live="polite" aria-atomic="true">
            <div className="ticon" aria-hidden="true">
              <svg className="icon" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="rgba(11,94,46,0.95)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <strong id="toastTitle">{toast.title}</strong>
              <p id="toastMsg">{toast.msg}</p>
            </div>
            <button className="close" type="button" aria-label="Close notification" onClick={() => setToast({ ...toast, show: false })}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="rgba(15,28,46,0.85)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )
      }
      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
