import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Problems.css'

function Problems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true)
        setError(null)

        // 根据环境使用不同的 API URL
        const apiUrl = import.meta.env.PROD
          ? 'https://tiga2000.com/api/problems'
          : 'http://localhost:8787/api/problems'

        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        setProblems(result.data || [])
      } catch (err) {
        console.error('Failed to fetch problems:', err)
        setError(err.message)
        // 如果 API 失败，fallback 到本地数据
        try {
          const fallbackData = await import('../data/problems.json')
          setProblems(fallbackData.default || fallbackData)
        } catch (fallbackErr) {
          console.error('Failed to load fallback data:', fallbackErr)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  if (loading) {
    return (
      <div className="problems-page">
        <header className="problems-header">
          <div className="container">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>Problems While Developing</h1>
            <p className="problems-subtitle">Loading problems...</p>
          </div>
        </header>
        <main className="problems-main">
          <div className="container">
            <div className="loading-spinner">Loading...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error && problems.length === 0) {
    return (
      <div className="problems-page">
        <header className="problems-header">
          <div className="container">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>Problems While Developing</h1>
            <p className="problems-subtitle">Failed to load problems</p>
          </div>
        </header>
        <main className="problems-main">
          <div className="container">
            <div className="error-message">
              <p>Error: {error}</p>
              <p>Please try again later.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="problems-page">
      <header className="problems-header">
        <div className="container">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Problems While Developing</h1>
          <p className="problems-subtitle">
            A collection of issues encountered during development and their solutions
            {error && <span className="api-warning"> (Using fallback data)</span>}
          </p>
        </div>
      </header>

      <main className="problems-main">
        <div className="container">
          <div className="problems-stats">
            <div className="stat-card">
              <span className="stat-number">{problems.length}</span>
              <span className="stat-label">Total Issues</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{problems.filter(p => p.status === 'resolved').length}</span>
              <span className="stat-label">Resolved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{problems.filter(p => p.status === 'ongoing').length}</span>
              <span className="stat-label">Ongoing</span>
            </div>
          </div>

          <div className="problems-list">
            {problems.map(problem => (
              <div key={problem.id} className={`problem-card ${problem.status}`}>
                <div className="problem-header">
                  <div className="problem-meta">
                    <span className="problem-category">{problem.category}</span>
                    <span className="problem-date">{problem.date}</span>
                  </div>
                  <span className={`problem-status ${problem.status}`}>
                    {problem.status === 'resolved' ? '✓ Resolved' : '⚠ Ongoing'}
                  </span>
                </div>

                <h2 className="problem-title">{problem.title}</h2>

                <div className="problem-content">
                  <div className="problem-section">
                    <h3>Problem:</h3>
                    <p>{problem.description}</p>
                  </div>

                  <div className="problem-section">
                    <h3>Solution:</h3>
                    <p>{problem.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Problems
