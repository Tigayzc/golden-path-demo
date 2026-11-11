import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { life, profile } from '../content/profile'

const renderHome = () => render(<MemoryRouter><Home /></MemoryRouter>)

describe('Home', () => {
  it('renders the hero name and tagline', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name)
    expect(screen.getByText(profile.tagline)).toBeInTheDocument()
  })

  it('renders the about and life sections without the removed ones', () => {
    renderHome()
    expect(document.getElementById('about')).toBeInTheDocument()
    expect(document.getElementById('life')).toBeInTheDocument()
    expect(document.getElementById('work')).not.toBeInTheDocument()
    expect(document.getElementById('shiji')).not.toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: life.photos[0].alt }).length).toBe(1)
  })

  it('renders every life photo in the gallery', () => {
    renderHome()
    life.photos.forEach((photo) => {
      expect(screen.getByRole('img', { name: photo.alt })).toHaveAttribute('src', photo.src)
    })
    expect(screen.getByRole('button', { name: 'Previous photo' })).toBeDisabled()
  })

  it('links to the Under the Hood section', () => {
    renderHome()
    const links = screen.getAllByRole('link', { name: /Under the Hood/i })
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/under-the-hood'))
  })
})
