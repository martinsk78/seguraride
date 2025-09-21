import { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: '#fff',
          padding: '40px 30px',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          width: '350px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '25px',
            color: '#333',
            fontSize: '28px',
          }}
        >
          Iniciar Sesión
        </h2>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#555' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '16px',
              transition: '0.3s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2575fc')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#555' }}>
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '16px',
              transition: '0.3s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2575fc')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2575fc',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            transition: '0.3s',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#1a5edb')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#2575fc')
          }
        >
          Login
        </button>
        {error && (
          <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
