import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import '../styles/landing.css'; // Leverage existing glass styling classes

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at center, var(--color-primary-glow) 0%, var(--bg-primary) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glows */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'var(--color-primary)',
        filter: 'blur(100px)',
        opacity: 0.1,
        top: '-10%',
        left: '-10%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'var(--color-secondary)',
        filter: 'blur(120px)',
        opacity: 0.08,
        bottom: '-10%',
        right: '-10%',
        pointerEvents: 'none'
      }} />

      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '30px 24px',
          boxShadow: 'var(--glass-shadow-hover)',
          border: '1px solid var(--glass-border-hover)',
          zIndex: 10
        }}
        hoverable={false}
        header={
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              margin: '0 auto 16px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px var(--color-primary-glow)'
            }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ffffff' }} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Welcome Back</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Sign in to continue to AutoPilot</p>
          </div>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--color-danger)',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            disabled={submitting}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            disabled={submitting}
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            loading={submitting}
            style={{ width: '100%', marginTop: '10px' }}
            iconRight={<ArrowRight size={16} />}
          >
            Sign In
          </Button>

          <div style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginTop: '8px'
          }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--color-primary)',
                fontWeight: 600,
                textDecoration: 'none'
              }}
              className="hover-underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
