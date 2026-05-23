import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Onboarding() {
  const navigate = useNavigate();
  const [perguntas, setPerguntas] = useState([]);
  const [etapa, setEtapa] = useState(0);
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPerguntas, setLoadingPerguntas] = useState(true);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    gerarPerguntas();
  }, []);

  const gerarPerguntas = async () => {
    setLoadingPerguntas(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: memorias } = await supabase
        .from('memorias')
        .select('pergunta, resposta')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const contexto = memorias?.length > 0
        ? `Reflexões anteriores desta pessoa:\n${memorias.map(m => `P: ${m.pergunta}\nR: ${m.resposta}`).join('\n\n')}`
        : 'Esta é a primeira reflexão desta pessoa.';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Você é o Mirror, um espelho de autoconhecimento profundo. Gere exatamente 5 perguntas de reflexão pessoal profunda e únicas para esta pessoa.

${contexto}

Regras:
- Se for a primeira vez, faça perguntas fundamentais sobre identidade, valores e história
- Se já houver reflexões, faça perguntas que aprofundem padrões detectados, contradições ou temas não explorados
- Nunca repita perguntas já feitas
- Perguntas devem ser desconfortáveis o suficiente para provocar reflexão real
- Cada pergunta em uma linha, sem numeração, sem traços
- Responda APENAS com as 5 perguntas, nada mais`,
          messages: [{ role: 'user', content: 'Gere as 5 perguntas agora.' }]
        })
      });

      const data = await response.json();
      const texto = data.content[0].text;
      const lista = texto.split('\n').map(p => p.trim()).filter(p => p.length > 10).slice(0, 5);

      if (lista.length >= 3) {
        setPerguntas(lista.map((texto, i) => ({ texto, num: String(i + 1).padStart(2, '0') })));
      } else {
        setPerguntas(perguntasPadrao);
      }
    } catch {
      setPerguntas(perguntasPadrao);
    }
    setLoadingPerguntas(false);
  };

  const perguntasPadrao = [
    { texto: "Quem você é de verdade, além do que mostra para o mundo?", num: "01" },
    { texto: "Qual foi o momento da sua vida em que você mais se sentiu você mesmo?", num: "02" },
    { texto: "O que você mais evita pensar e por quê?", num: "03" },
    { texto: "Se pudesse mudar uma coisa na sua história, o que seria?", num: "04" },
    { texto: "O que você diria para si mesmo há dez anos?", num: "05" },
  ];

  const handleProximo = async () => {
    if (!resposta.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('memorias').insert({
      user_id: user.id,
      pergunta: perguntas[etapa].texto,
      resposta,
      tipo: 'reflexao'
    });
    setResposta('');
    setLoading(false);
    if (etapa < perguntas.length - 1) {
      setSaindo(true);
      setTimeout(() => { setEtapa(etapa + 1); setSaindo(false); }, 300);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePular = () => {
    if (etapa < perguntas.length - 1) {
      setSaindo(true);
      setTimeout(() => { setEtapa(etapa + 1); setSaindo(false); }, 300);
    } else {
      navigate('/dashboard');
    }
  };

  if (loadingPerguntas) {
    return (
      <div style={{ minHeight:'100vh', background:'#08080f', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
        <div style={{ position:'relative', width:'60px', height:'60px', marginBottom:'32px' }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'0.5px solid rgba(255,255,255,0.1)', animation:'rp 4s ease-in-out infinite' }} />
          <div style={{ position:'absolute', inset:'10px', borderRadius:'50%', background:'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.9) 0%, rgba(180,185,220,0.6) 30%, rgba(60,65,120,0.7) 60%, rgba(8,8,20,0.9) 100%)' }}>
            <div style={{ position:'absolute', top:'16%', left:'20%', width:'22%', height:'22%', background:'rgba(255,255,255,0.85)', borderRadius:'50%', filter:'blur(1.5px)' }} />
          </div>
        </div>
        <p style={{ fontSize:'0.68rem', letterSpacing:'4px', color:'rgba(255,255,255,0.25)', textTransform:'uppercase' }}>Mirror está te conhecendo...</p>
        <style>{`@keyframes rp { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.06)} }`}</style>
      </div>
    );
  }

  const progresso = (etapa / perguntas.length) * 100;

  return (
    <div style={{ minHeight:'100vh', background:'#08080f', color:'white', fontFamily:'sans-serif', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(100,105,180,0.04) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      <header style={{ padding:'22px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:10 }}>
        <span style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'0.88rem', letterSpacing:'6px', opacity:0.4 }}>Mirror</span>
        <span style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.2)', letterSpacing:'3px' }}>{etapa + 1} / {perguntas.length}</span>
      </header>

      <div style={{ height:'1px', background:'rgba(255,255,255,0.05)', position:'relative', zIndex:10 }}>
        <div style={{ height:'100%', background:'rgba(255,255,255,0.25)', width:`${progresso}%`, transition:'width 0.6s ease' }} />
      </div>

      <main style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 30px 40px', position:'relative', zIndex:10, opacity: saindo ? 0 : 1, transform: saindo ? 'translateY(-16px)' : 'translateY(0)', transition:'opacity 0.3s ease, transform 0.3s ease' }}>

        <p style={{ fontSize:'0.56rem', color:'rgba(255,255,255,0.15)', letterSpacing:'4px', textTransform:'uppercase', marginBottom:'32px' }}>{perguntas[etapa]?.num}</p>

        <h2 style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'clamp(1.3rem,3vw,1.9rem)', fontWeight:'400', textAlign:'center', maxWidth:'560px', lineHeight:1.55, marginBottom:'48px', color:'rgba(255,255,255,0.8)' }}>
          {perguntas[etapa]?.texto}
        </h2>

        <div style={{ width:'100%', maxWidth:'560px', position:'relative', marginBottom:'24px' }}>
          <textarea
            value={resposta}
            onChange={e => setResposta(e.target.value)}
            placeholder="Escreva livremente. Sem julgamento."
            rows={5}
            style={{ width:'100%', padding:'20px 24px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', color:'white', fontSize:'0.96rem', fontFamily:'"Palatino Linotype", Palatino, serif', fontStyle:'italic', resize:'none', outline:'none', lineHeight:1.85, boxSizing:'border-box', transition:'border-color 0.3s' }}
            onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.18)'}
            onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.07)'}
          />
          <span style={{ position:'absolute', bottom:'12px', right:'16px', fontSize:'0.62rem', color:'rgba(255,255,255,0.12)' }}>{resposta.length}</span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'16px', width:'100%', maxWidth:'560px' }}>
          <button onClick={handleProximo} disabled={loading || !resposta.trim()} style={{ flex:1, padding:'15px', background: resposta.trim() ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)', border:`1px solid rgba(255,255,255,${resposta.trim() ? 0.14 : 0.05})`, borderRadius:'3px', color:`rgba(255,255,255,${resposta.trim() ? 0.85 : 0.2})`, fontSize:'0.75rem', cursor: resposta.trim() ? 'pointer' : 'default', letterSpacing:'3px', transition:'all 0.3s' }}
            onMouseEnter={e => { if (resposta.trim()) { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.24)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background=resposta.trim() ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor=`rgba(255,255,255,${resposta.trim() ? 0.14 : 0.05})`; }}
          >
            {loading ? '...' : etapa < perguntas.length - 1 ? 'PRÓXIMA →' : 'CONCLUIR'}
          </button>
          {etapa < perguntas.length - 1 && (
            <button onClick={handlePular} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.18)', cursor:'pointer', fontSize:'0.7rem', letterSpacing:'1.5px', padding:'8px', transition:'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.18)'}
            >pular</button>
          )}
        </div>

        <div style={{ display:'flex', gap:'8px', marginTop:'44px' }}>
          {perguntas.map((_, i) => (
            <div key={i} style={{ width: i === etapa ? '24px' : '5px', height:'5px', borderRadius:'3px', background: i === etapa ? 'rgba(255,255,255,0.5)' : i < etapa ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)', transition:'all 0.4s ease' }} />
          ))}
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; }
        textarea::placeholder { color: rgba(255,255,255,0.18); }
      `}</style>
    </div>
  );
}