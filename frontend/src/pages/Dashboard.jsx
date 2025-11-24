import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService, authService } from '../services/api';
import { Plus, LogOut, Folder, CheckCircle2, Clock, Users, Calendar, Target } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [projectsData, profileData] = await Promise.all([
                projectService.getAll(),
                authService.getProfile()
            ]);

            setProjects(projectsData.projects || []);
            setStats(profileData.statistics || {});
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            await projectService.create({
                name: formData.get('name'),
                description: formData.get('description'),
                status: 'active'
            });

            setShowCreateModal(false);
            e.target.reset();
            loadData();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Cargando...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.logo}>
                        <div style={styles.logoIcon}>
                            <Folder size={20} color="white" />
                        </div>
                        <div>
                            <h1 style={styles.logoTitle}>ProjectHub</h1>
                            <p style={styles.logoSubtitle}>Gestión de Proyectos</p>
                        </div>
                    </div>

                    <div style={styles.userSection}>
                        <div style={styles.userInfo}>
                            <p style={styles.userName}>{user?.name}</p>
                            <p style={styles.userEmail}>{user?.email}</p>
                        </div>
                        <button onClick={logout} style={styles.logoutBtn}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Welcome */}
                <div style={styles.welcome}>
                    <h2 style={styles.welcomeTitle}>Hola, {user?.name?.split(' ')[0]} 👋</h2>
                    <p style={styles.welcomeText}>Resumen de tus proyectos y tareas</p>
                </div>

                {/* Stats */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <Target size={24} color="#8b5cf6" />
                        <p style={styles.statNumber}>{stats?.totalProjects || 0}</p>
                        <p style={styles.statLabel}>Total Proyectos</p>
                    </div>

                    <div style={styles.statCard}>
                        <Clock size={24} color="#10b981" />
                        <p style={styles.statNumber}>{stats?.activeProjects || 0}</p>
                        <p style={styles.statLabel}>Proyectos Activos</p>
                    </div>

                    <div style={styles.statCard}>
                        <CheckCircle2 size={24} color="#3b82f6" />
                        <p style={styles.statNumber}>{stats?.completedProjects || 0}</p>
                        <p style={styles.statLabel}>Completados</p>
                    </div>

                    <div style={styles.statCard}>
                        <Folder size={24} color="#ec4899" />
                        <p style={styles.statNumber}>{stats?.totalTasks || 0}</p>
                        <p style={styles.statLabel}>Total Tareas</p>
                    </div>
                </div>

                {/* Projects Header */}
                <div style={styles.projectsHeader}>
                    <div>
                        <h3 style={styles.projectsTitle}>Mis Proyectos</h3>
                        <p style={styles.projectsCount}>{projects.length} proyectos</p>
                    </div>
                    <button onClick={() => setShowCreateModal(true)} style={styles.createBtn}>
                        <Plus size={20} />
                        <span>Nuevo Proyecto</span>
                    </button>
                </div>

                {/* Projects List */}
                {projects.length === 0 ? (
                    <div style={styles.emptyState}>
                        <Folder size={48} color="#6b7280" />
                        <h3 style={styles.emptyTitle}>No hay proyectos</h3>
                        <p style={styles.emptyText}>Crea tu primer proyecto para comenzar</p>
                        <button onClick={() => setShowCreateModal(true)} style={styles.createBtnLarge}>
                            <Plus size={20} />
                            Crear Proyecto
                        </button>
                    </div>
                ) : (
                    <div style={styles.projectsGrid}>
                        {projects.map(project => (
                            <div
                                key={project.projectId}
                                onClick={() => navigate(`/projects/${project.projectId}`)}
                                style={styles.projectCard}
                            >
                                <div style={styles.projectHeader}>
                                    <div style={styles.projectIcon}>
                                        <Folder size={20} color="white" />
                                    </div>
                                    <div style={{
                                        ...styles.projectStatus,
                                        backgroundColor: project.status === 'active' ? '#10b981' : '#3b82f6'
                                    }}></div>
                                </div>

                                <h4 style={styles.projectName}>{project.name}</h4>
                                <p style={styles.projectDescription}>
                                    {project.description || 'Sin descripción'}
                                </p>

                                <div style={styles.projectMeta}>
                                    <div style={styles.metaItem}>
                                        <Users size={14} color="#9ca3af" />
                                        <span>{project.memberCount || 1}</span>
                                    </div>
                                    <div style={styles.metaItem}>
                                        <CheckCircle2 size={14} color="#9ca3af" />
                                        <span>{project.taskCount || 0}</span>
                                    </div>
                                    <div style={styles.metaItem}>
                                        <Calendar size={14} color="#9ca3af" />
                                        <span>{new Date(project.createdAt).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div style={styles.projectFooter}>
                                    <span style={{
                                        ...styles.projectRole,
                                        backgroundColor: project.userRole === 'owner' ? '#8b5cf6' : '#374151',
                                        color: project.userRole === 'owner' ? '#e9d5ff' : '#9ca3af'
                                    }}>
                                        {project.userRole === 'owner' ? 'Owner' : 'Miembro'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {showCreateModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Nuevo Proyecto</h3>

                        <form onSubmit={handleCreateProject} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    minLength={3}
                                    style={styles.input}
                                    placeholder="Ej: Sistema de Biblioteca"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Descripción</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    style={styles.textarea}
                                    placeholder="Describe tu proyecto..."
                                ></textarea>
                            </div>

                            <div style={styles.modalButtons}>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    style={styles.cancelBtn}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" style={styles.submitBtn}>
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#030712',
        color: '#fff',
    },
    loadingContainer: {
        minHeight: '100vh',
        backgroundColor: '#030712',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #1f2937',
        borderTop: '4px solid #8b5cf6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        color: '#9ca3af',
    },
    header: {
        backgroundColor: '#111827',
        borderBottom: '1px solid #1f2937',
        padding: '16px 24px',
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        backgroundColor: '#8b5cf6',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: 0,
    },
    logoSubtitle: {
        fontSize: '12px',
        color: '#9ca3af',
        margin: 0,
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    userInfo: {
        textAlign: 'right',
    },
    userName: {
        fontSize: '14px',
        fontWeight: '500',
        margin: 0,
    },
    userEmail: {
        fontSize: '12px',
        color: '#9ca3af',
        margin: 0,
    },
    logoutBtn: {
        padding: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
    },
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
    },
    welcome: {
        marginBottom: '32px',
    },
    welcomeTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: '0 0 8px 0',
    },
    welcomeText: {
        color: '#9ca3af',
        margin: 0,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
    },
    statCard: {
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '8px',
        padding: '24px',
    },
    statNumber: {
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '12px 0 4px 0',
    },
    statLabel: {
        fontSize: '14px',
        color: '#9ca3af',
        margin: 0,
    },
    projectsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    projectsTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '0 0 4px 0',
    },
    projectsCount: {
        fontSize: '14px',
        color: '#9ca3af',
        margin: 0,
    },
    createBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        backgroundColor: '#8b5cf6',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    emptyState: {
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '8px',
        padding: '80px 24px',
        textAlign: 'center',
    },
    emptyTitle: {
        fontSize: '18px',
        fontWeight: '600',
        margin: '16px 0 8px 0',
    },
    emptyText: {
        color: '#9ca3af',
        marginBottom: '24px',
    },
    createBtnLarge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#8b5cf6',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '16px',
    },
    projectsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
    },
    projectCard: {
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '8px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
    },
    projectHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    projectIcon: {
        width: '40px',
        height: '40px',
        backgroundColor: '#8b5cf6',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    projectStatus: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
    },
    projectName: {
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 8px 0',
    },
    projectDescription: {
        fontSize: '14px',
        color: '#9ca3af',
        marginBottom: '16px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    projectMeta: {
        display: 'flex',
        gap: '16px',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #1f2937',
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        color: '#9ca3af',
    },
    projectFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectRole: {
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '4px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
    },
    modalTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '24px',
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
        padding: '10px 12px',
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
    },
    textarea: {
        padding: '10px 12px',
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    modalButtons: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    cancelBtn: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#1f2937',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
    },
    submitBtn: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#8b5cf6',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
    },
};