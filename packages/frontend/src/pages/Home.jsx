import { Link } from 'react-router-dom'

function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div>
        <h1>Tiga</h1>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-muted)' }}>Personal homepage — coming soon.</p>
        <Link to="/under-the-hood">Under the Hood →</Link>
      </div>
    </main>
  )
}

export default Home
