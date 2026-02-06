import { Link } from 'react-router-dom'
import './Problems.css'
import problemsData from '../data/problems.json'

function Problems() {
  const problems = problemsData

  return (
    <div className="problems-page">
      <header className="problems-header">
        <div className="container">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Problems While Developing</h1>
          <p className="problems-subtitle">
            A collection of issues encountered during development and their solutions
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
