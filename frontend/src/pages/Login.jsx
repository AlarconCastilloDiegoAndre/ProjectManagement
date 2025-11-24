import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Folder } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {/* Logo */}
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>
                        <Folder size={32} color="white" />
                    </div>
                    <h1 style={styles.logoTitle}>ProjectHub</h1>
                    <p style={styles.logoSubtitle}>Gestión de Proyectos</p>
                </div>

                {/* Card */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Iniciar Sesión</h2>

                    {/* Error Message */}
                    {error && (
                        <div style={styles.errorBox}>
                            <AlertCircle size={20} color="#ef4444" />
                            <p style={styles.errorText}>{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.submitBtn,
                                opacity: loading ? 0.5 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div style={styles.footer}>
                        <p style={styles.footerText}>
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" style={styles.link}>
                                Crear cuenta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#030712',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
    },
    content: {
        width: '100%',
        maxWidth: '400px',
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoIcon: {
        width: '64px',
        height: '64px',
        backgroundColor: '#8b5cf6',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
    },
    logoTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: 'white',
        margin: '0 0 8px 0',
    },
    logoSubtitle: {
        fontSize: '14px',
        color: '#9ca3af',
        margin: 0,
    },
    card: {
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '12px',
        padding: '32px',
    },
    cardTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '24px',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        marginBottom: '24px',
    },
    errorText: {
        color: '#f87171',
        fontSize: '14px',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#d1d5db',
    },
    input: {
        padding: '12px 16px',
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    submitBtn: {
        padding: '12px',
        backgroundColor: '#8b5cf6',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
        transition: 'background-color 0.2s',
    },
    footer: {
        marginTop: '24px',
        textAlign: 'center',
    },
    footerText: {
        fontSize: '14px',
        color: '#9ca3af',
        margin: 0,
    },
    link: {
        color: '#a78bfa',
        textDecoration: 'none',
        fontWeight: '600',
    },
};