import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { life, profile, work } from '../content/profile'

const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>)

describe('Home', () => {
  it('renders the hero name and tagline', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name)
    expect(screen.getByText(profile.tagline)).toBeInTheDocument()
  })

  it('renders the about, work, life, and shiji sections', () => {
    renderHome()
    expect(document.getElementById('about')).toBeInTheDocument()
    expect(document.getElementById('work')).toBeInTheDocument()
    expect(document.getElementById('life')).toBeInTheDocument()
    expect(document.getElementById('shiji')).toBeInTheDocument()
    expect(screen.getByText(work[0].title)).toBeInTheDocument()
    expect(screen.getByText(life[0].title)).toBeInTheDocument()
  })

  it('links to the Under the Hood section', () => {
    renderHome()
    const links = screen.getAllByRole('link', { name: /Under the Hood/i })
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/under-the-hood'))
  })
})
