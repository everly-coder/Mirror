import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Chat() {
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState([
    { role: 'assistant', content: 'Estou aqui. O que você quer me dizer hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [memorias, setMemorias] = useState('');
  const [nome, setNome] = useState('');
  const fimRef = useRef(null);

  useEffect(() => {
    const carregar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: perfil } = await supabase.from('perfis').select('nome').eq('user_id', user.id).single();
      setNome(perfil?.nome || '');
      const { data } = await supabase.from('memorias').select('*').eq('user_id', user.id);
      if (data) {
        const texto = data.map(m => `Pergunta: ${m.pergunta}\nResposta: ${m.resposta}`).join('\n\n');
        setMemorias(texto);
      }
    };
    carregar();
  }, []);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const novaMensagem = { role: 'user', content: input };
    const novaLista = [...mensagens, novaMensagem];
    setMensagens(novaLista);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Você é o Mirror — não um assistente, mas um espelho digital de ${nome || 'esta pessoa'}. Seu papel não é responder perguntas, mas revelar padrões, contradições e verdades que a pessoa não percebe em si mesma.

Você tem acesso às reflexões anteriores desta pessoa:
${memorias}

Regras:
- Nunca dê conselhos genéricos
- Observe o que NÃO está sendo dito tanto quanto o que está
- Aponte padrões de linguagem, temas recorrentes, contradições
- Seja preciso, frio e revelador — como um espelho real
- Máximo 3 parágrafos por resposta
- Nunca comece com "Eu" ou "Como seu Mirror"
- Fale diretamente, sem rodeios`,
          messages: novaLista.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await response.json();
      const resposta = data.content[0].text;
      setMensagens([...novaLista, { role: 'assistant', content: resposta }]);
    } catch (err) {
      setMensagens([...novaLista, { role: 'assistant', content: 'Algo interrompeu o espelho. Tente novamente.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#08080f', color:'white', fontFamily:'sans-serif', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(100,105,180,0.04) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      {/* Header */}
      <header style={{ padding:'20px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.04)', position:'relative', zIndex:10, backdropFilter:'blur(20px)', background:'rgba(8,8,15,0.7)' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.25)', cursor:'pointer', fontSize:'0.9rem', transition:'color 0.3s', display:'flex', alignItems:'center', gap:'8px' }}
          onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.25)'}
        >←</button>
        <div style={{ textAlign:'center' }}>
          <span style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'0.88rem', letterSpacing:'6px', opacity:0.5, display:'block' }}>Mirror</span>
          <span style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.18)', letterSpacing:'2px' }}>espelho pessoal</span>
        </div>
        <div style={{ width:'40px' }} />
      </header>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'48px 30px 20px', display:'flex', flexDirection:'column', gap:'28px', position:'relative', zIndex:10, maxWidth:'720px', width:'100%', margin:'0 auto' }}>
        {mensagens.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.9) 0%, rgba(180,185,220,0.6) 30%, rgba(60,65,120,0.7) 60%, rgba(8,8,20,0.9) 100%)', flexShrink:0, marginRight:'14px', marginTop:'4px', position:'relative' }}>
                <div style={{ position:'absolute', top:'16%', left:'20%', width:'22%', height:'22%', background:'rgba(255,255,255,0.85)', borderRadius:'50%', filter:'blur(1.5px)' }} />
              </div>
            )}
            <div style={{ maxWidth:'75%', padding:'16px 20px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px', background: m.role === 'user' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)', border:`1px solid rgba(255,255,255,${m.role === 'user' ? 0.08 : 0.05})`, lineHeight:1.85, fontSize:'0.92rem', color: m.role === 'user' ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)', fontFamily: m.role === 'assistant' ? '"Palatino Linotype", Palatino, serif' : 'sans-serif', fontStyle: m.role === 'assistant' ? 'italic' : 'normal', position:'relative', overflow:'hidden' }}>
              {m.role === 'assistant' && <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />}
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.9) 0%, rgba(180,185,220,0.6) 30%, rgba(60,65,120,0.7) 60%, rgba(8,8,20,0.9) 100%)', flexShrink:0 }} />
            <div style={{ display:'flex', gap:'5px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:'4px', height:'4px', borderRadius:'50%', background:'rgba(255,255,255,0.3)', animation:`dot 1.4s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={fimRef} />
      </div>

      {/* Input */}
      <div style={{ padding:'20px 30px 32px', borderTop:'1px solid rgba(255,255,255,0.04)', position:'relative', zIndex:10, maxWidth:'720px', width:'100%', margin:'0 auto' }}>
        <div style={{ display:'flex', gap:'10px', alignItems:'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
            placeholder="Fale livremente..."
            rows={1}
            style={{ flex:1, padding:'14px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', color:'white', fontSize:'0.92rem', fontFamily:'"Palatino Linotype", Palatino, serif', fontStyle:'italic', resize:'none', outline:'none', lineHeight:1.7, boxSizing:'border-box', transition:'border-color 0.3s', maxHeight:'120px' }}
            onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.18)'}
            onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.07)'}
          />
          <button onClick={enviar} disabled={loading || !input.trim()} style={{ padding:'14px 20px', background: input.trim() ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)', border:`1px solid rgba(255,255,255,${input.trim() ? 0.14 : 0.05})`, borderRadius:'4px', color:`rgba(255,255,255,${input.trim() ? 0.85 : 0.2})`, cursor: input.trim() ? 'pointer' : 'default', fontSize:'1rem', transition:'all 0.3s', flexShrink:0 }}
            onMouseEnter={e => { if (input.trim()) { e.currentTarget.style.background='rgba(255,255,255,0.11)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background=input.trim() ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)'; }}
          >→</button>
        </div>
        <p style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.1)', marginTop:'10px', letterSpacing:'0.5px', textAlign:'center' }}>Enter para enviar · Shift+Enter para nova linha</p>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        textarea::placeholder { color: rgba(255,255,255,0.18); }
        @keyframes dot { 0%,80%,100%{transform:scale(0.6);opacity:0.3} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}