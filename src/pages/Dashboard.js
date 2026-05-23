import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const [memorias, setMemorias] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeTemp, setNomeTemp] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: perfil } = await supabase.from('perfis').select('nome').eq('user_id', user.id).single();
      setNome(perfil?.nome || user.email.split('@')[0]);
      const { data } = await supabase.from('memorias').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setMemorias(data || []);
      setTimeout(() => setLoaded(true), 80);
    };
    carregar();
  }, []);

  const salvarNome = async () => {
    if (!nomeTemp.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('perfis').upsert({ user_id: user.id, nome: nomeTemp });
    setNome(nomeTemp);
    setEditandoNome(false);
  };

  const totalPalavras = memorias.reduce((acc, m) => acc + (m.resposta?.split(' ').length || 0), 0);
  const formatData = (str) => new Date(str).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <div style={{ minHeight:'100vh', background:'#08080f', color:'white', fontFamily:'sans-serif' }}>
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(100,105,180,0.05) 0%, transparent 60%)', zIndex:1, pointerEvents:'none' }} />

      {/* Header */}
      <header style={{ position:'sticky', top:0, zIndex:200, padding:'20px 52px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(8,8,15,0.8)', backdropFilter:'blur(30px)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'0.88rem', letterSpacing:'6px', opacity:0.5 }}>Mirror</span>
        <button onClick={async () => await supabase.auth.signOut()} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.22)', cursor:'pointer', fontSize:'0.68rem', letterSpacing:'2px', transition:'color 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.22)'}
        >SAIR</button>
      </header>

      <main style={{ maxWidth:'860px', margin:'0 auto', padding:'70px 30px 120px', position:'relative', zIndex:10, opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(24px)', transition:'opacity 1.2s ease, transform 1.2s ease' }}>

        {/* Greeting */}
        <div style={{ marginBottom:'64px' }}>
          <p style={{ fontSize:'0.58rem', letterSpacing:'4px', color:'rgba(255,255,255,0.18)', textTransform:'uppercase', marginBottom:'18px' }}>Seu espelho pessoal</p>

          {editandoNome ? (
            <div style={{ display:'flex', alignItems:'flex-end', gap:'14px', marginBottom:'10px' }}>
              <input value={nomeTemp} onChange={e => setNomeTemp(e.target.value)} onKeyPress={e => e.key === 'Enter' && salvarNome()} autoFocus placeholder="Seu nome"
                style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'clamp(2rem,5.5vw,3.6rem)', fontWeight:'400', background:'transparent', border:'none', borderBottom:'1px solid rgba(255,255,255,0.15)', color:'white', outline:'none', paddingBottom:'4px', width:'100%', maxWidth:'480px' }}
              />
              <button onClick={salvarNome} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.8)', padding:'10px 22px', borderRadius:'3px', cursor:'pointer', fontSize:'0.7rem', letterSpacing:'1.5px', flexShrink:0, marginBottom:'6px' }}>SALVAR</button>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'10px', flexWrap:'wrap' }}>
              <h1 style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'clamp(2rem,5.5vw,3.6rem)', fontWeight:'400', lineHeight:1.1, color:'rgba(255,255,255,0.82)', margin:0 }}>{nome}</h1>
              <button onClick={() => { setNomeTemp(nome); setEditandoNome(true); }} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.22)', width:'30px', height:'30px', borderRadius:'50%', cursor:'pointer', fontSize:'0.82rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='rgba(255,255,255,0.22)'; }}
              >✎</button>
            </div>
          )}

          <p style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'1rem', fontStyle:'italic', color:'rgba(255,255,255,0.2)', lineHeight:1.8 }}>
            {memorias.length === 0 ? 'O espelho está em branco. Comece a falar.' : `${memorias.length} ${memorias.length === 1 ? 'reflexão registrada.' : 'reflexões registradas.'}`}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', overflow:'hidden', marginBottom:'48px', border:'1px solid rgba(255,255,255,0.05)' }}>
          {[
            { num: memorias.length, label: 'Reflexões' },
            { num: totalPalavras.toLocaleString(), label: 'Palavras' },
            { num: '∞', label: 'Potencial' },
          ].map((s, i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.015)', padding:'26px 24px', textAlign:'center', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
              <span style={{ display:'block', fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'2rem', fontWeight:'400', color:'rgba(255,255,255,0.65)', marginBottom:'5px' }}>{s.num}</span>
              <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.18)', letterSpacing:'2px', textTransform:'uppercase' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'64px' }}>
          {[
            { label:'INICIAR', title:'Falar com Mirror', desc:'Dialogue com seu espelho digital através da IA', path:'/chat', primary:true },
            { label:'REGISTRAR', title:'Nova reflexão', desc:'Adicione histórias e pensamentos à sua coleção', path:'/onboarding', primary:false },
          ].map((a, i) => (
            <button key={i} onClick={() => navigate(a.path)} style={{ background: a.primary ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', border:`1px solid rgba(255,255,255,${a.primary ? 0.09 : 0.05})`, borderRadius:'4px', padding:'28px 26px', cursor:'pointer', textAlign:'left', transition:'all 0.4s', position:'relative', overflow:'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.background=`rgba(255,255,255,${a.primary ? 0.07 : 0.04})`; e.currentTarget.style.borderColor=`rgba(255,255,255,${a.primary ? 0.18 : 0.1})`; e.currentTarget.querySelector('.al').style.opacity='1'; }}
              onMouseLeave={e => { e.currentTarget.style.background=`rgba(255,255,255,${a.primary ? 0.04 : 0.02})`; e.currentTarget.style.borderColor=`rgba(255,255,255,${a.primary ? 0.09 : 0.05})`; e.currentTarget.querySelector('.al').style.opacity='0'; }}
            >
              <div className="al" style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', opacity:0, transition:'opacity 0.4s' }} />
              <span style={{ display:'block', fontSize:'0.56rem', color:'rgba(255,255,255,0.2)', letterSpacing:'2.5px', textTransform:'uppercase', marginBottom:'10px' }}>{a.label}</span>
              <span style={{ display:'block', fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'1.1rem', color:'rgba(255,255,255,0.78)', fontWeight:'400', marginBottom:'8px' }}>{a.title}</span>
              <span style={{ display:'block', fontSize:'0.78rem', color:'rgba(255,255,255,0.22)', lineHeight:1.7 }}>{a.desc}</span>
            </button>
          ))}
        </div>

        {/* Memories */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
          <p style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.16)', letterSpacing:'3px', textTransform:'uppercase' }}>Arquivo de reflexões</p>
          <p style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.1)', letterSpacing:'1px' }}>{memorias.length} registros</p>
        </div>

        {memorias.length === 0 ? (
          <div style={{ textAlign:'center', padding:'72px 0', border:'1px dashed rgba(255,255,255,0.05)', borderRadius:'4px' }}>
            <p style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontStyle:'italic', fontSize:'1rem', color:'rgba(255,255,255,0.14)', lineHeight:1.9 }}>
              O espelho ainda não te conhece.<br />Comece falando.
            </p>
            <button onClick={() => navigate('/onboarding')} style={{ marginTop:'22px', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.35)', padding:'10px 26px', borderRadius:'3px', cursor:'pointer', fontSize:'0.7rem', letterSpacing:'2px', transition:'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.22)'; e.currentTarget.style.color='rgba(255,255,255,0.7)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.35)'; }}
            >ADICIONAR PRIMEIRA REFLEXÃO</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {memorias.map((m, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.015)', border:'1px solid rgba(255,255,255,0.05)', borderLeft:'2px solid rgba(255,255,255,0.08)', borderRadius:'4px', padding:'24px 28px', transition:'all 0.3s', position:'relative', overflow:'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.025)'; e.currentTarget.style.borderLeftColor='rgba(255,255,255,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.015)'; e.currentTarget.style.borderLeftColor='rgba(255,255,255,0.08)'; }}
              >
                <p style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.2)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'10px' }}>{m.pergunta}</p>
                <p style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'0.94rem', color:'rgba(255,255,255,0.58)', lineHeight:1.85 }}>{m.resposta}</p>
                <p style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.1)', marginTop:'12px', letterSpacing:'0.5px' }}>{formatData(m.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}