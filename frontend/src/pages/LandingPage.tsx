import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        const dpr = window.devicePixelRatio || 1

        function resize() {
            const rect = canvas!.getBoundingClientRect()
            canvas!.width = rect.width * dpr
            canvas!.height = rect.height * dpr
        }
        resize()
        window.addEventListener('resize', resize)

        const cities = [
            // Africa
            { name: 'Lagos', lat: 6.52, lon: 3.38 },
            { name: 'Nairobi', lat: -1.29, lon: 36.82 },
            { name: 'Accra', lat: 5.60, lon: -0.19 },
            { name: 'Johannesburg', lat: -26.20, lon: 28.05 },
            { name: 'Addis Ababa', lat: 9.03, lon: 38.74 },
            { name: 'Cairo', lat: 30.04, lon: 31.24 },
            { name: 'Dar es Salaam', lat: -6.79, lon: 39.21 },
            { name: 'Casablanca', lat: 33.57, lon: -7.59 },
            { name: 'Dakar', lat: 14.72, lon: -17.47 },
            { name: 'Kigali', lat: -1.94, lon: 30.06 },
            { name: 'Abidjan', lat: 5.36, lon: -4.01 },
            { name: 'Yaounde', lat: 3.87, lon: 11.52 },
            // Asia
            { name: 'Mumbai', lat: 19.08, lon: 72.88 },
            { name: 'Dhaka', lat: 23.81, lon: 90.41 },
            { name: 'Ho Chi Minh', lat: 10.82, lon: 106.63 },
            { name: 'Jakarta', lat: -6.21, lon: 106.85 },
            { name: 'Karachi', lat: 24.86, lon: 67.01 },
        ]
        const cityByName = Object.fromEntries(cities.map(c => [c.name, c]))
        const flows = [
            // Africa flows
            ['Lagos', 'Accra'], ['Lagos', 'Johannesburg'], ['Lagos', 'Nairobi'],
            ['Nairobi', 'Addis Ababa'], ['Nairobi', 'Johannesburg'],
            ['Accra', 'Addis Ababa'], ['Johannesburg', 'Addis Ababa'], ['Accra', 'Nairobi'],
            ['Cairo', 'Nairobi'], ['Cairo', 'Casablanca'], ['Dakar', 'Accra'],
            ['Kigali', 'Nairobi'], ['Abidjan', 'Lagos'], ['Yaounde', 'Lagos'],
            ['Dar es Salaam', 'Nairobi'],
            // Africa to Asia
            ['Cairo', 'Mumbai'], ['Nairobi', 'Mumbai'], ['Lagos', 'Dhaka'],
            // Asia flows
            ['Mumbai', 'Dhaka'], ['Mumbai', 'Karachi'],
            ['Dhaka', 'Ho Chi Minh'], ['Ho Chi Minh', 'Jakarta'],
        ]

        let rotation = 2.2
        const tilt = -0.45
        let time = 0
        let animId: number
        function project(lat: number, lon: number, cx: number, cy: number, r: number) {
            const phi = lat * Math.PI / 180
            const theta = lon * Math.PI / 180 + rotation
            const x3 = Math.cos(phi) * Math.sin(theta)
            const y3 = Math.sin(phi) * Math.cos(tilt) - Math.cos(phi) * Math.cos(theta) * Math.sin(tilt)
            const z3 = Math.cos(phi) * Math.cos(theta) * Math.cos(tilt) + Math.sin(phi) * Math.sin(tilt)
            return { x: cx + x3 * r, y: cy - y3 * r, z: z3, visible: z3 > -0.05 }
        }

        function arcPath(a: typeof cities[0], b: typeof cities[0], cx: number, cy: number, r: number, samples = 48) {
            const pts: { x: number; y: number; z: number }[] = []
            const latA = a.lat * Math.PI / 180, lonA = a.lon * Math.PI / 180
            const latB = b.lat * Math.PI / 180, lonB = b.lon * Math.PI / 180
            const ax = Math.cos(latA) * Math.cos(lonA), ay = Math.cos(latA) * Math.sin(lonA), az = Math.sin(latA)
            const bx = Math.cos(latB) * Math.cos(lonB), by = Math.cos(latB) * Math.sin(lonB), bz = Math.sin(latB)
            const dot = ax * bx + ay * by + az * bz
            const omega = Math.acos(Math.max(-1, Math.min(1, dot)))
            const arcHeight = 0.25 + 0.15 * (omega / Math.PI)
            for (let i = 0; i <= samples; i++) {
                const t = i / samples
                const s1 = Math.sin((1 - t) * omega) / Math.sin(omega)
                const s2 = Math.sin(t * omega) / Math.sin(omega)
                const px = s1 * ax + s2 * bx, py = s1 * ay + s2 * by, pz = s1 * az + s2 * bz
                const lift = 1 + arcHeight * Math.sin(t * Math.PI)
                const lat = Math.asin(pz / Math.sqrt(px * px + py * py + pz * pz))
                const lon = Math.atan2(py, px)
                const theta = lon + rotation
                const cosPhi = Math.cos(lat)
                const x3 = cosPhi * Math.sin(theta)
                const y3 = Math.sin(lat) * Math.cos(tilt) - cosPhi * Math.cos(theta) * Math.sin(tilt)
                const z3 = cosPhi * Math.cos(theta) * Math.cos(tilt) + Math.sin(lat) * Math.sin(tilt)
                pts.push({ x: cx + x3 * r * lift, y: cy - y3 * r * lift, z: z3 })
            }
            return pts
        }

        function draw() {
            const w = canvas!.width, h = canvas!.height
            ctx.clearRect(0, 0, w, h)
            const cx = w / 2, cy = h / 2
            const r = Math.min(w, h) * 0.4

            const glow = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.25)
            glow.addColorStop(0, 'rgba(29, 233, 182, 0.22)')
            glow.addColorStop(1, 'rgba(29, 233, 182, 0)')
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2)
            ctx.fill()

            const sg = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r)
            sg.addColorStop(0, '#0a2620')
            sg.addColorStop(0.7, '#051a14')
            sg.addColorStop(1, '#020b08')
            ctx.fillStyle = sg
            ctx.beginPath()
            ctx.arc(cx, cy, r, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = 'rgba(29, 107, 82, 0.3)'
            ctx.lineWidth = 0.5 * dpr
            for (let lonDeg = -180; lonDeg < 180; lonDeg += 30) {
                ctx.beginPath(); let started = false
                for (let latDeg = -90; latDeg <= 90; latDeg += 4) {
                    const p = project(latDeg, lonDeg, cx, cy, r)
                    if (p.visible) { if (!started) { ctx.moveTo(p.x, p.y); started = true } else ctx.lineTo(p.x, p.y) }
                    else started = false
                }
                ctx.stroke()
            }
            for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
                ctx.beginPath(); let started = false
                for (let lonDeg = -180; lonDeg <= 180; lonDeg += 4) {
                    const p = project(latDeg, lonDeg, cx, cy, r)
                    if (p.visible) { if (!started) { ctx.moveTo(p.x, p.y); started = true } else ctx.lineTo(p.x, p.y) }
                    else started = false
                }
                ctx.stroke()
            }

            ctx.strokeStyle = 'rgba(93, 255, 194, 0.4)'
            ctx.lineWidth = dpr
            ctx.beginPath()
            ctx.arc(cx, cy, r, 0, Math.PI * 2)
            ctx.stroke()

            flows.forEach((f, fi) => {
                const a = cityByName[f[0]], b = cityByName[f[1]]
                const pts = arcPath(a, b, cx, cy, r)
                const vis = pts.filter(p => p.z > -0.1)
                if (vis.length < 2) return
                ctx.strokeStyle = 'rgba(29, 233, 182, 0.28)'
                ctx.lineWidth = dpr
                ctx.beginPath()
                vis.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
                ctx.stroke()

                const pulseT = ((time * 0.0004 + fi * 0.17) % 1)
                const headIdx = Math.floor(pulseT * pts.length)
                const tail = 10
                ctx.lineWidth = 2 * dpr
                for (let i = Math.max(0, headIdx - tail); i <= headIdx && i < pts.length - 1; i++) {
                    const p1 = pts[i], p2 = pts[i + 1]
                    if (p1.z < -0.1 || p2.z < -0.1) continue
                    const alpha = (i - (headIdx - tail)) / tail
                    ctx.strokeStyle = `rgba(125, 255, 179, ${alpha * 0.95})`
                    ctx.beginPath()
                    ctx.moveTo(p1.x, p1.y)
                    ctx.lineTo(p2.x, p2.y)
                    ctx.stroke()
                }
            })

            cities.forEach(c => {
                const p = project(c.lat, c.lon, cx, cy, r)
                if (!p.visible) return
                const pulse = 0.5 + 0.5 * Math.sin(time * 0.003 + c.lat)
                const depth = 0.4 + 0.6 * Math.max(0, p.z)
                const haloR = (10 + pulse * 10) * dpr
                const hg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR)
                hg.addColorStop(0, `rgba(93, 255, 194, ${0.5 * depth})`)
                hg.addColorStop(1, 'rgba(93, 255, 194, 0)')
                ctx.fillStyle = hg
                ctx.beginPath()
                ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2)
                ctx.fill()
                ctx.strokeStyle = `rgba(29, 233, 182, ${0.8 * depth})`
                ctx.lineWidth = dpr
                ctx.beginPath()
                ctx.arc(p.x, p.y, (5 + pulse * 3) * dpr, 0, Math.PI * 2)
                ctx.stroke()

                ctx.fillStyle = `rgba(220, 255, 240, ${0.95 * depth})`
                ctx.beginPath()
                ctx.arc(p.x, p.y, 3 * dpr, 0, Math.PI * 2)
                ctx.fill()
            })
        }

        function animate() {
            time += 16
            rotation += 0.0025
            draw()
            animId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: '#04080a', color: '#e4fff4', fontFamily: "'JetBrains Mono', monospace", overflowX: 'hidden' }}>
            <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&display=swap" rel="stylesheet" />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
                {/* Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', borderBottom: '0.5px solid #133328' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5dffc2', boxShadow: '0 0 10px #5dffc2', display: 'inline-block' }} />
                        Emerging Markets
                    </div>
                </nav>
                {/* Hero */}
                <div style={{ padding: '80px 0 60px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1de9b6', padding: '6px 12px', border: '0.5px solid #1d4d3e', borderRadius: 999, background: '#061411', marginBottom: 28 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5dffc2', boxShadow: '0 0 8px #5dffc2', display: 'inline-block' }} />
                            Live · World Bank Open Data
                        </div>
                        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300, fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 24, color: '#e4fff4' }}>
                            Real-time economic<br />signals across<br />
                            <em style={{ fontStyle: 'italic', color: '#5dffc2', fontWeight: 400 }}>emerging markets</em>.
                        </h1>
                        <p style={{ fontSize: 15, color: '#9de8c8', maxWidth: 520, marginBottom: 36, lineHeight: 1.7 }}>
                            A fullstack dashboard pulling GDP, inflation, and population indicators across
                            17 emerging markets in Africa and Asia — powered by Spring Boot,
                            React, and the World Bank Open Data API.
                        </p>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 22px', background: '#5dffc2', color: '#04080a', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase', border: 'none', borderRadius: 4, boxShadow: '0 0 30px rgba(93,255,194,0.35)', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                View Dashboard →
                            </button>
                        </div>
                    </div>

                    {/* Globe */}
                    <div style={{ position: 'relative', aspectRatio: '1', maxWidth: 480, marginLeft: 'auto' }}>
                        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '0.5px solid #133328', borderRadius: 6, background: '#061411', marginBottom: 80 }}>
                    {[
                        { label: 'Countries', value: '17', sub: 'Africa · South Asia · SE Asia' },
                        { label: 'Indicators', value: '03', sub: 'GDP · inflation · population' },
                        { label: 'Endpoints', value: '06', sub: 'REST · JSON responses' },
                        { label: 'Refresh', value: '7d', sub: 'Weekly sync from source' },
                    ].map((s, i) => (
                        <div key={i} style={{ padding: '24px 28px', borderRight: i < 3 ? '0.5px solid #133328' : 'none' }}>
                            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6a9a8a', marginBottom: 8 }}>{s.label}</div>
                            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300, fontSize: 32, color: '#5dffc2', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 11, color: '#3f6356', marginTop: 4 }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer style={{ borderTop: '0.5px solid #133328', padding: '32px 0', marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#3f6356' }}>
                    <div>© 2026 · Emerging Markets Dashboard · Data: World Bank Open Data</div>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#6a9a8a', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>Dashboard →</button>
                </footer>
            </div>
        </div>
    )
}