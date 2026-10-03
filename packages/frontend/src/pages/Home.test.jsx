import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home', () => {
  it('links to the Under the Hood section', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText(/Under the Hood/i).closest('a')).toHaveAttribute('href', '/under-the-hood')
  })
})
