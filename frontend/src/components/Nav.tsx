import { useNavigate } from 'react-router-dom'

interface NavProps {
    mode?: 'landing' | 'dashboard'
}

export default function Nav({ mode }: NavProps) {
    const navigate = useNavigate()

    return (
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderBottom: '0.5px solid #133328' }}>
            <div
                onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5dffc2', boxShadow: '0 0 10px #5dffc2', display: 'inline-block' }} />
                Emerging Markets
            </div>
            {mode === 'dashboard' && (
                <div style={{ fontSize: 11, color: '#6a9a8a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Dashboard
                </div>
            )}
        </nav>
    )
}