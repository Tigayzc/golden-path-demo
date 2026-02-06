import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Problems from './Problems'
import problemsData from '../data/problems.json'

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

// Mock fetch before each test
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: problemsData,
        count: problemsData.length,
        timestamp: new Date().toISOString()
      }),
    })
  )
})

describe('Problems', () => {
  it('renders page title', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      expect(screen.getByText('Problems While Developing')).toBeInTheDocument()
    })
  })

  it('renders back to home link', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      const backLink = screen.getByText(/Back to Home/i)
      expect(backLink).toBeInTheDocument()
      expect(backLink.closest('a')).toHaveAttribute('href', '/')
    })
  })

  it('renders statistics cards', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      expect(screen.getByText('Total Issues')).toBeInTheDocument()
      expect(screen.getByText('Resolved')).toBeInTheDocument()
      expect(screen.getByText('Ongoing')).toBeInTheDocument()
    })
  })

  it('displays correct total issues count', async () => {
    renderWithRouter(<Problems />)
    const totalCount = problemsData.length
    await waitFor(() => {
      // Use getAllByText since the number might appear multiple times
      const numbers = screen.getAllByText(totalCount.toString())
      expect(numbers.length).toBeGreaterThan(0)
    })
  })

  it('displays correct resolved count', async () => {
    renderWithRouter(<Problems />)
    const resolvedCount = problemsData.filter(p => p.status === 'resolved').length
    await waitFor(() => {
      const statCards = screen.getAllByText(resolvedCount.toString())
      expect(statCards.length).toBeGreaterThan(0)
    })
  })

  it('displays statistics in correct structure', async () => {
    renderWithRouter(<Problems />)

    await waitFor(() => {
      const statCards = document.querySelectorAll('.stat-card')
      expect(statCards.length).toBe(3)

      const totalIssues = problemsData.length
      const resolvedIssues = problemsData.filter(p => p.status === 'resolved').length
      const ongoingIssues = problemsData.filter(p => p.status === 'ongoing').length

      expect(statCards[0].textContent).toContain(totalIssues.toString())
      expect(statCards[0].textContent).toContain('Total Issues')

      expect(statCards[1].textContent).toContain(resolvedIssues.toString())
      expect(statCards[1].textContent).toContain('Resolved')

      expect(statCards[2].textContent).toContain(ongoingIssues.toString())
      expect(statCards[2].textContent).toContain('Ongoing')
    })
  })

  it('renders all problems from JSON data', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      problemsData.forEach(problem => {
        expect(screen.getByText(problem.title)).toBeInTheDocument()
      })
    })
  })

  it('renders problem categories', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      problemsData.forEach(problem => {
        expect(screen.getByText(problem.category)).toBeInTheDocument()
      })
    })
  })

  it('renders problem descriptions', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      problemsData.forEach(problem => {
        expect(screen.getByText(problem.description)).toBeInTheDocument()
      })
    })
  })

  it('renders problem solutions', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      problemsData.forEach(problem => {
        expect(screen.getByText(problem.solution)).toBeInTheDocument()
      })
    })
  })

  it('renders resolved status correctly', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      const resolvedProblems = problemsData.filter(p => p.status === 'resolved')
      const resolvedBadges = screen.getAllByText('✓ Resolved')
      expect(resolvedBadges.length).toBe(resolvedProblems.length)
    })
  })

  it('applies correct CSS class for resolved problems', async () => {
    renderWithRouter(<Problems />)
    await waitFor(() => {
      const problemCards = document.querySelectorAll('.problem-card.resolved')
      const resolvedCount = problemsData.filter(p => p.status === 'resolved').length
      expect(problemCards.length).toBe(resolvedCount)
    })
  })
})
