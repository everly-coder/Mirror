// Mirror Landing v3
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations, flags } from '../i18n';

function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let id;
    const rsz = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    rsz(); window.addEventListener('resize', rsz);
    const P = Array.from({length: 180}, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 0.9 + 0.05, o: Math.random() * 0.35 + 0.03,
      ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.004 + 0.001,
      vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.08,
    }));
    let t = 0;
    const draw = () => {
      const W = c.width, H = c.height;
      ctx.clearRect(0, 0, W, H);
      P.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const pulse = p.o + Math.sin(t * p.sp + p.ph) * 0.12;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,215,240,${pulse})`; ctx.fill();
      });
      t++; id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', rsz); };
  }, []);
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}} />;
}

function MirrorObject({ insights }) {
  const ref = useRef(null);
  const [text, setText] = useState('');
  const [hovered, setHovered] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      el.style.transition = 'transform 0.08s ease';
    };
    const onEnter = () => {
      setHovered(true);
      setText(insights[idxRef.current % insights.length]);
      idxRef.current++;
      el.style.transition = 'transform 0.08s ease';
    };
    const onLeave = () => {
      setHovered(false);
      setText('');
      el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg)';
      el.style.transition = 'transform 0.7s ease';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); };
  }, [insights]);

  return (
    <div ref={ref} style={{position:'relative', width:'280px', height:'380px', margin:'0 auto 56px', cursor:'default'}}>
      <div style={{position:'absolute', inset:'-20px', borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%', background:'radial-gradient(ellipse, rgba(180,185,230,0.05) 0%, transparent 70%)', animation:'mglow 6s ease-in-out infinite'}} />
      <div style={{position:'absolute', inset:0, borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%', border:'1px solid rgba(255,255,255,0.07)', background:'linear-gradient(160deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)', backdropFilter:'blur(4px)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{position:'absolute', top:'-50%', left:'-30%', width:'60%', height:'200%', background:'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.025) 50%, transparent 60%)', animation:'sheen 9s ease-in-out infinite'}} />
        <p style={{fontSize:'0.62rem', letterSpacing:'3px', color: hovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)', textTransform:'uppercase', textAlign:'center', lineHeight:2.8, fontFamily:'sans-serif', padding:'0 30px', transition:'all 0.8s ease', whiteSpace:'pre-line'}}>
          {hovered ? text : 'passe o mouse\nsobre o espelho'}
        </p>
      </div>
      <div style={{position:'absolute', bottom:'-28px', left:'50%', transform:'translateX(-50%)', width:'2px', height:'28px', background:'linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)'}} />
      <div style={{position:'absolute', bottom:'-34px', left:'50%', transform:'translateX(-50%)', width:'70px', height:'3px', background:'rgba(255,255,255,0.04)', borderRadius:'2px'}} />
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('pt');
  const [langOpen, setLangOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const t = translations[lang];

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const mirrorInsights = {
    pt: ['você está\naqui agora', 'o que você\nnão diz\ntambém fala', 'padrões\ninvisíveis', 'quem você\né de verdade?', 'mirror\nte vê'],
    en: ["you're\nhere now", "what you\ndon't say\nalso speaks", 'invisible\npatterns', 'who are\nyou really?', 'mirror\nsees you'],
    es: ['estás\naquí ahora', 'lo que no\ndices\ntambién habla', 'patrones\ninvisibles', '¿quién eres\nrealmente?', 'mirror\nte ve'],
  };

  const steps = [
    { n: '01', title: t.s1t, desc: t.s1d },
    { n: '02', title: t.s2t, desc: t.s2d },
    { n: '03', title: t.s3t, desc: t.s3d },
  ];

  // eslint-disable-next-line no-unused-vars
const B = (props) => (
    <button {...props} style={{...props.style, cursor:'pointer'}}
      onMouseEnter={e => { Object.assign(e.currentTarget.style, props['data-hover'] || {}); }}
      onMouseLeave={e => { Object.assign(e.currentTarget.style, props['data-leave'] || {}); }}
    />
  );

  return (
    <div style={{minHeight:'100vh', background:'#08080f', color:'white', overflowX:'hidden', fontFamily:'sans-serif'}}>
      <Particles />
      <div style={{position:'fixed', inset:0, background:'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(100,105,180,0.06) 0%, transparent 60%)', zIndex:1, pointerEvents:'none'}} />

      {/* HEADER */}
      <header style={{position:'fixed', top:0, left:0, right:0, zIndex:200, padding:'24px 56px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'1rem', letterSpacing:'7px', opacity:0.6, cursor:'pointer'}} onClick={() => navigate('/')}>Mirror</span>
        <div style={{display:'flex', alignItems:'center', gap:'14px'}}>
          <div style={{position:'relative'}}>
            <button onClick={() => setLangOpen(!langOpen)} style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.3)', padding:'6px 14px', borderRadius:'20px', cursor:'pointer', fontSize:'0.68rem', letterSpacing:'2px', display:'flex', alignItems:'center', gap:'6px'}}>
              {flags[lang].label} <span style={{fontSize:'0.52rem', opacity:0.5}}>▾</span>
            </button>
            {langOpen && (
              <div style={{position:'absolute', top:'40px', right:0, background:'rgba(8,8,20,0.97)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px', overflow:'hidden', minWidth:'80px', backdropFilter:'blur(20px)', boxShadow:'0 20px 50px rgba(0,0,0,0.7)'}}>
                {Object.entries(flags).map(([code, {label}]) => (
                  <button key={code} onClick={() => { setLang(code); setLangOpen(false); }} style={{display:'block', width:'100%', padding:'10px 16px', background: lang===code ? 'rgba(255,255,255,0.05)' : 'transparent', border:'none', color: lang===code ? 'rgba(220,225,255,0.85)' : 'rgba(255,255,255,0.35)', cursor:'pointer', fontSize:'0.7rem', letterSpacing:'2px', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => navigate('/login')} style={{background:'transparent', border:'none', color:'rgba(255,255,255,0.3)', padding:'8px 4px', cursor:'pointer', fontSize:'0.7rem', letterSpacing:'2px', transition:'color 0.3s'}}
            onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.3)'}
          >{t.login}</button>
          <button onClick={() => navigate('/register')} style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.8)', padding:'9px 22px', borderRadius:'3px', cursor:'pointer', fontSize:'0.7rem', letterSpacing:'2px', transition:'all 0.3s'}}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; }}
          >{t.register}</button>
        </div>
      </header>

      {/* HERO */}
      <section style={{position:'relative', zIndex:10, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 40px 80px', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(28px)', transition:'opacity 1.8s ease, transform 1.8s ease'}}>
        <MirrorObject insights={mirrorInsights[lang]} />
        <p style={{fontSize:'0.58rem', letterSpacing:'5px', color:'rgba(255,255,255,0.18)', textTransform:'uppercase', marginBottom:'22px'}}>{t.tagline}</p>
        <h1 style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'clamp(2.4rem,6.5vw,5.2rem)', fontWeight:'400', lineHeight:1.05, marginBottom:'24px', letterSpacing:'-1px'}}>
          {t.h1line1}<br />
          <span style={{color:'rgba(255,255,255,0.42)', fontStyle:'italic'}}>{t.h1line2}</span>
        </h1>
        <p style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'0.98rem', fontStyle:'italic', color:'rgba(255,255,255,0.24)', maxWidth:'380px', lineHeight:2.1, marginBottom:'12px'}}>{t.sub}</p>
        <p style={{fontSize:'0.65rem', color:'rgba(255,255,255,0.11)', letterSpacing:'2.5px', marginBottom:'48px'}}>{t.sub2}</p>
        <div style={{display:'flex', gap:'12px', flexWrap:'wrap', justifyContent:'center', marginBottom:'14px'}}>
          <button onClick={() => navigate('/register')} style={{background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.14)', color:'rgba(255,255,255,0.85)', padding:'16px 50px', borderRadius:'3px', cursor:'pointer', fontSize:'0.75rem', letterSpacing:'3px', transition:'all 0.3s', position:'relative', overflow:'hidden'}}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.26)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.055)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.14)'; }}
          >{t.ctaMain}</button>
          <button onClick={() => navigate('/login')} style={{background:'transparent', border:'none', color:'rgba(255,255,255,0.22)', padding:'16px 20px', cursor:'pointer', fontSize:'0.72rem', letterSpacing:'2px', transition:'color 0.3s'}}
            onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.22)'}
          >{t.ctaLogin}</button>
        </div>
        <span style={{fontSize:'0.62rem', color:'rgba(255,255,255,0.1)', letterSpacing:'1.5px'}}>{t.hint}</span>
        <div style={{position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', opacity:0.15}}>
          <span style={{fontSize:'0.56rem', letterSpacing:'3px', textTransform:'uppercase'}}>{t.explore}</span>
          <div style={{width:'1px', height:'40px', background:'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)', animation:'scrollA 2.6s ease-in-out infinite'}} />
        </div>
      </section>

      {/* DIVIDER 01 */}
      <div style={{display:'flex', alignItems:'center', maxWidth:'1100px', margin:'0 auto', padding:'0 56px', position:'relative', zIndex:10}}>
        <div style={{flex:1, height:'1px', background:'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)'}} />
        <span style={{fontSize:'0.56rem', color:'rgba(255,255,255,0.1)', letterSpacing:'3px', padding:'0 20px'}}>01</span>
        <div style={{flex:1, height:'1px', background:'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)'}} />
      </div>

      {/* HOW IT WORKS — asymmetric */}
      <section style={{position:'relative', zIndex:10, maxWidth:'1100px', margin:'0 auto', padding:'100px 56px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center'}}>
        <div>
          <p style={{fontSize:'0.56rem', letterSpacing:'4px', color:'rgba(255,255,255,0.18)', textTransform:'uppercase', marginBottom:'22px'}}>{t.howLabel}</p>
          <h2 style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'clamp(1.7rem,3.2vw,2.6rem)', fontWeight:'400', lineHeight:1.15, marginBottom:'22px', color:'rgba(255,255,255,0.78)'}}>O espelho que ninguém construiu antes</h2>
          <p style={{fontSize:'0.86rem', color:'rgba(255,255,255,0.26)', lineHeight:2.1, fontWeight:'300'}}>{t.iSub}</p>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'1px', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'12px', overflow:'hidden'}}>
          {steps.map((st, i) => (
            <div key={i} style={{padding:'26px 30px', background:'rgba(255,255,255,0.015)', borderBottom: i < steps.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', position:'relative', transition:'background 0.4s'}}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.querySelector('.rl').style.opacity='1'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.015)'; e.currentTarget.querySelector('.rl').style.opacity='0'; }}
            >
              <div className="rl" style={{position:'absolute', left:0, top:0, bottom:0, width:'2px', background:'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)', opacity:0, transition:'opacity 0.4s'}} />
              <p style={{fontSize:'0.54rem', color:'rgba(255,255,255,0.15)', letterSpacing:'3px', marginBottom:'8px'}}>{st.n}</p>
              <h3 style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'1rem', fontWeight:'400', marginBottom:'8px', color:'rgba(255,255,255,0.7)'}}>{st.title}</h3>
              <p style={{fontSize:'0.8rem', color:'rgba(255,255,255,0.22)', lineHeight:1.85, fontWeight:'300'}}>{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER 02 */}
      <div style={{display:'flex', alignItems:'center', maxWidth:'1100px', margin:'0 auto', padding:'0 56px', position:'relative', zIndex:10}}>
        <div style={{flex:1, height:'1px', background:'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)'}} />
        <span style={{fontSize:'0.56rem', color:'rgba(255,255,255,0.1)', letterSpacing:'3px', padding:'0 20px'}}>02</span>
        <div style={{flex:1, height:'1px', background:'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)'}} />
      </div>

      {/* INSIGHT CARD — side by side */}
      <section style={{position:'relative', zIndex:10, maxWidth:'1100px', margin:'0 auto', padding:'100px 56px'}}>
        <p style={{fontSize:'0.56rem', letterSpacing:'4px', color:'rgba(255,255,255,0.15)', textTransform:'uppercase', marginBottom:'50px', textAlign:'center'}}>{t.iLabel}</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1px 1fr', gap:'50px', background:'rgba(255,255,255,0.015)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'4px', padding:'54px', position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'}} />
          <div>
            <p style={{fontSize:'0.54rem', letterSpacing:'3px', color:'rgba(255,255,255,0.15)', textTransform:'uppercase', marginBottom:'20px'}}>O que você disse</p>
            <p style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'1.02rem', fontStyle:'italic', color:'rgba(255,255,255,0.45)', lineHeight:1.9, marginBottom:'16px'}}>{t.iText}</p>
            <p style={{fontSize:'0.7rem', color:'rgba(255,255,255,0.14)', letterSpacing:'1px'}}>— entrada, 23h14</p>
          </div>
          <div style={{background:'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)'}} />
          <div>
            <p style={{fontSize:'0.54rem', letterSpacing:'3px', color:'rgba(255,255,255,0.15)', textTransform:'uppercase', marginBottom:'20px'}}>O que Mirror viu</p>
            <p style={{fontSize:'0.88rem', color:'rgba(255,255,255,0.36)', lineHeight:2.05, fontWeight:'300'}}>
              Você usou <em style={{color:'rgba(255,255,255,0.65)', fontStyle:'italic'}}>"deveria"</em> 6 vezes hoje. Sempre ligada a trabalho, nunca a desejo. Isso não é motivação — é obrigação disfarçada. Há algo que você genuinamente quer que não aparece nas suas palavras há semanas.
            </p>
          </div>
        </div>
      </section>

      {/* DIVIDER 03 */}
      <div style={{display:'flex', alignItems:'center', maxWidth:'1100px', margin:'0 auto', padding:'0 56px', position:'relative', zIndex:10}}>
        <div style={{flex:1, height:'1px', background:'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)'}} />
        <span style={{fontSize:'0.56rem', color:'rgba(255,255,255,0.1)', letterSpacing:'3px', padding:'0 20px'}}>03</span>
        <div style={{flex:1, height:'1px', background:'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)'}} />
      </div>

      {/* QUOTE */}
      <section style={{position:'relative', zIndex:10, textAlign:'center', padding:'100px 56px 120px', maxWidth:'700px', margin:'0 auto'}}>
        <div style={{width:'1px', height:'60px', background:'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1))', margin:'0 auto 44px'}} />
        <p style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'clamp(1rem,2.3vw,1.35rem)', fontStyle:'italic', color:'rgba(255,255,255,0.3)', lineHeight:1.85, marginBottom:'18px'}}>{t.quoteText}</p>
        <span style={{fontSize:'0.58rem', color:'rgba(255,255,255,0.1)', letterSpacing:'4px', textTransform:'uppercase'}}>{t.quoteAuthor}</span>
        <div style={{width:'1px', height:'60px', background:'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)', margin:'44px auto 0'}} />
      </section>

      {/* FINAL CTA */}
      <section style={{position:'relative', zIndex:10, textAlign:'center', padding:'0 56px 160px'}}>
        <h2 style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'clamp(1.8rem,4.5vw,3.2rem)', fontWeight:'400', lineHeight:1.05, marginBottom:'14px', color:'rgba(255,255,255,0.6)'}}>{t.cta2h}</h2>
        <p style={{fontSize:'0.8rem', fontStyle:'italic', color:'rgba(255,255,255,0.15)', marginBottom:'44px'}}>{t.cta2p}</p>
        <button onClick={() => navigate('/register')} style={{background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.45)', padding:'15px 50px', borderRadius:'3px', cursor:'pointer', fontSize:'0.75rem', letterSpacing:'3px', transition:'all 0.3s'}}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.color='rgba(255,255,255,0.8)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}
        >{t.cta2btn}</button>
      </section>

      <footer style={{position:'relative', zIndex:10, borderTop:'1px solid rgba(255,255,255,0.04)', padding:'26px 56px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontSize:'0.62rem', color:'rgba(255,255,255,0.1)', letterSpacing:'3px'}}>© 2026 MIRROR</span>
        <span style={{fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'0.72rem', color:'rgba(255,255,255,0.1)', fontStyle:'italic'}}>{t.footer}</span>
      </footer>

      <style>{`
        @keyframes mglow { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
        @keyframes sheen { 0%,100%{transform:translateX(-100%)} 50%{transform:translateX(200%)} }
        @keyframes scrollA { 0%,100%{opacity:0;transform:scaleY(0.2);transform-origin:top} 50%{opacity:1;transform:scaleY(1)} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}