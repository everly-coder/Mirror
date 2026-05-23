import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleRegister = async () => {
    setErro('');
    if (senha !== confirma) { setErro('As senhas não coincidem.'); return; }
    if (senha.length < 6) { setErro('Senha deve ter no mínimo 6 caracteres.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password: senha });
    if (error) setErro(error.message);
    else setSucesso(true);
    setLoading(false);
  };

  const input = {
    width:'100%', padding:'12px 16px',
    background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:'3px', color:'white',
    fontSize:'0.92rem', marginBottom:'20px',
    boxSizing:'border-box', outline:'none',
    fontFamily:'sans-serif',
  };

  const label = {
    fontSize:'0.62rem', color:'rgba(255,255,255,0.28)',
    letterSpacing:'2px', textTransform:'uppercase',
    display:'block', marginBottom:'8px',
  };

  return (
    <div style={{ minHeight:'100vh', background:'#08080f', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'30px', fontFamily:'sans-serif' }}>
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(100,105,180,0.06) 0%, transparent 60%)', pointerEvents:'none' }} />

      <button onClick={() => navigate('/')} style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'0.9rem', letterSpacing:'7px', opacity:0.45, background:'none', border:'none', color:'white', cursor:'pointer', marginBottom:'52px' }}>Mirror</button>

      <div style={{ width:'100%', maxWidth:'380px', position:'relative', zIndex:10 }}>
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px', padding:'44px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

          {sucesso ? (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ width:'48px', height:'48px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:'1.2rem' }}>✦</div>
              <h2 style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'1.4rem', fontWeight:'400', marginBottom:'12px' }}>Conta criada</h2>
              <p style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.3)', lineHeight:1.8, marginBottom:'32px' }}>Verifique seu email para confirmar e começar sua jornada com o Mirror.</p>
              <button onClick={() => navigate('/login')} style={{ width:'100%', padding:'14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'3px', color:'rgba(255,255,255,0.85)', fontSize:'0.75rem', cursor:'pointer', letterSpacing:'3px' }}>
                IR PARA O LOGIN
              </button>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:'1.5rem', fontWeight:'400', marginBottom:'8px' }}>Criar conta</h1>
              <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.28)', marginBottom:'36px', lineHeight:1.6 }}>Comece a se ver de verdade.</p>

              <label style={label}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" style={input}
                onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.2)'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
              />

              <label style={label}>Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                placeholder="••••••••" style={input}
                onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.2)'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
              />

              <label style={label}>Confirmar senha</label>
              <input type="password" value={confirma} onChange={e => setConfirma(e.target.value)}
                placeholder="••••••••" style={{...input, marginBottom:'24px'}}
                onFocus={e => e.target.style.borderColor='rgba(255,255,255,0.2)'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'}
                onKeyPress={e => e.key === 'Enter' && handleRegister()}
              />

              {erro && <p style={{ fontSize:'0.8rem', color:'rgba(248,113,113,0.8)', marginBottom:'16px', textAlign:'center' }}>{erro}</p>}

              <button onClick={handleRegister} disabled={loading} style={{ width:'100%', padding:'14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:'3px', color:'rgba(255,255,255,0.85)', fontSize:'0.75rem', cursor:'pointer', letterSpacing:'3px', transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.26)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.14)'; }}
              >{loading ? '...' : 'CRIAR CONTA'}</button>

              <p style={{ textAlign:'center', marginTop:'24px', fontSize:'0.78rem', color:'rgba(255,255,255,0.22)' }}>
                Já tem conta?{' '}
                <button onClick={() => navigate('/login')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'0.78rem', transition:'color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}
                >Entrar</button>
              </p>
            </>
          )}
        </div>
      </div>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}