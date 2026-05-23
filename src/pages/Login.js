import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    setErro('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro('Email ou senha incorretos.');
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#08080f', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'30px', fontFamily:'sans-serif' }}>
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(100,105,180,0.06) 0%, transparent 60%)', pointerEvents:'none' }} />

      <button onClick={() => navigate('/')} style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'0.9rem', letterSpacing:'7px', opacity:0.45, background:'none', border:'none', color:'white', cursor:'pointer', marginBottom:'52px' }}>Mirror</button>

      <div style={{ width:'100%', maxWidth:'380px', position:'relative', zIndex:10 }}>
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'44px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

          <h1 style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'1.5rem', fontWeight:'400', marginBottom:'8px' }}>Bem-vindo de volta</h1>
          <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.28)', marginBottom:'36px', lineHeight:1.6 }}>O espelho está esperando por você.</p>

          <label style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.28)', letterSpacing:'2px', textTransform:'uppercase', display:'block', marginBottom:'8px' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{ width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'3px', color:'white', fontSize:'0.92rem', marginBottom:'20px', boxSizing:'border-box', outline:'none', fontFamily:'sans-serif' }}
            onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.2)'}
            onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
          />

          <label style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.28)', letterSpacing:'2px', textTransform:'uppercase', display:'block', marginBottom:'8px' }}>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
            placeholder="••••••••"
            style={{ width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'3px', color:'white', fontSize:'0.92rem', marginBottom:'24px', boxSizing:'border-box', outline:'none', fontFamily:'sans-serif' }}
            onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.2)'}
            onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
          />

          {erro && <p style={{ fontSize:'0.8rem', color:'rgba(248,113,113,0.8)', marginBottom:'16px', textAlign:'center' }}>{erro}</p>}

          <button onClick={handleLogin} disabled={loading} style={{ width:'100%', padding:'14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'3px', color:'rgba(255,255,255,0.85)', fontSize:'0.75rem', cursor:'pointer', letterSpacing:'3px', transition:'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.26)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.14)'; }}
          >{loading ? '...' : 'ENTRAR'}</button>

          <p style={{ textAlign:'center', marginTop:'24px', fontSize:'0.78rem', color:'rgba(255,255,255,0.22)' }}>
            Não tem conta?{' '}
            <button onClick={() => navigate('/register')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'0.78rem', letterSpacing:'0.5px', transition:'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.85)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}
            >Criar conta</button>
          </p>
        </div>
      </div>

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}