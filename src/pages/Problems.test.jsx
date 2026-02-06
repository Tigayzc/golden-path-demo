import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('Problems', () => {
  it('renders page title', () => {
    renderWithRouter(<Problems />)
    expect(screen.getByText('Problems While Developing')).toBeInTheDocument()
  })

  it('renders back to home link', () => {
    renderWithRouter(<Problems />)
    const backLink = screen.getByText(/Back to Home/i)
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/')
  })

  it('renders statistics cards', () => {
    renderWithRouter(<Problems />)
    expect(screen.getByText('Total Issues')).toBeInTheDocument()
    expect(screen.getByText('Resolved')).toBeInTheDocument()
    expect(screen.getByText('Ongoing')).toBeInTheDocument()
  })

  it('displays correct total issues count', () => {
    renderWithRouter(<Problems />)
    const totalCount = problemsData.length
    // Use getAllByText since the number might appear multiple times
    const numbers = screen.getAllByText(totalCount.toString())
    expect(numbers.length).toBeGreaterThan(0)
  })

  it('displays correct resolved count', () => {
    renderWithRouter(<Problems />)
    const resolvedCount = problemsData.filter(p => p.status === 'resolved').length
    const statCards = screen.getAllByText(resolvedCount.toString())
    expect(statCards.length).toBeGreaterThan(0)
  })

  it('displays statistics in correct structure', () => {
    renderWithRouter(<Problems />)
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

  it('renders all problems from JSON data', () => {
    renderWithRouter(<Problems />)
    problemsData.forEach(problem => {
      expect(screen.getByText(problem.title)).toBeInTheDocument()
    })
  })

  it('renders problem categories', () => {
    renderWithRouter(<Problems />)
    problemsData.forEach(problem => {
      expect(screen.getByText(problem.category)).toBeInTheDocument()
    })
  })

  it('renders problem descriptions', () => {
    renderWithRouter(<Problems />)
    problemsData.forEach(problem => {
      expect(screen.getByText(problem.description)).toBeInTheDocument()
    })
  })

  it('renders problem solutions', () => {
    renderWithRouter(<Problems />)
    problemsData.forEach(problem => {
      expect(screen.getByText(problem.solution)).toBeInTheDocument()
    })
  })

  it('renders resolved status correctly', () => {
    renderWithRouter(<Problems />)
    const resolvedProblems = problemsData.filter(p => p.status === 'resolved')
    const resolvedBadges = screen.getAllByText('✓ Resolved')
    expect(resolvedBadges.length).toBe(resolvedProblems.length)
  })

  it('applies correct CSS class for resolved problems', () => {
    renderWithRouter(<Problems />)
    const problemCards = document.querySelectorAll('.problem-card.resolved')
    const resolvedCount = problemsData.filter(p => p.status === 'resolved').length
    expect(problemCards.length).toBe(resolvedCount)
  })
})
