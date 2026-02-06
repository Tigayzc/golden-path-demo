import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('App', () => {
  it('renders main heading', () => {
    renderWithRouter(<App />)
    expect(screen.getByText(/Golden Path Demo/i)).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    renderWithRouter(<App />)
    expect(screen.getByText(/Modern DevOps Workflow Best Practices/i)).toBeInTheDocument()
  })

  it('renders project overview section', () => {
    renderWithRouter(<App />)
    expect(screen.getByText(/Project Overview/i)).toBeInTheDocument()
  })

  it('renders tech stack section', () => {
    renderWithRouter(<App />)
    expect(screen.getByText(/Tech Stack/i)).toBeInTheDocument()
  })

  it('renders build info component', () => {
    renderWithRouter(<App />)
    // BuildInfo 组件默认渲染为折叠状态
    expect(document.querySelector('.build-info-container')).toBeInTheDocument()
  })

  it('renders footer with links', () => {
    renderWithRouter(<App />)
    expect(screen.getByText(/Made with ❤️/i)).toBeInTheDocument()
  })

  it('renders problems button link', () => {
    renderWithRouter(<App />)
    const problemsLink = screen.getByText(/Problems & Solutions/i)
    expect(problemsLink).toBeInTheDocument()
    expect(problemsLink.closest('a')).toHaveAttribute('href', '/problems')
  })
})
