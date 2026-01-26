import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BuildInfo from './BuildInfo'

// Mock __BUILD_INFO__
global.__BUILD_INFO__ = {
  version: '1.0.0',
  gitCommitHash: 'abc1234567890def',
  gitCommitShort: 'abc1234',
  gitBranch: 'main',
  buildTime: '2026-01-27T12:00:00.000Z',
  buildTimestamp: Date.now(),
  environment: 'production',
}

describe('BuildInfo', () => {
  beforeEach(() => {
    // Reset any state before each test
  })

  it('renders toggle button', () => {
    render(<BuildInfo />)
    expect(screen.getByLabelText(/Toggle build information/i)).toBeInTheDocument()
  })

  it('shows version in toggle button', () => {
    render(<BuildInfo />)
    expect(screen.getByText(/v1.0.0/i)).toBeInTheDocument()
  })

  it('shows environment badge', () => {
    render(<BuildInfo />)
    expect(screen.getByText(/production/i)).toBeInTheDocument()
  })

  it('expands panel when clicked', () => {
    render(<BuildInfo />)
    const toggleButton = screen.getByLabelText(/Toggle build information/i)

    // Initially collapsed
    expect(screen.queryByText(/Build Information/i)).not.toBeInTheDocument()

    // Click to expand
    fireEvent.click(toggleButton)

    // Now expanded
    expect(screen.getByText(/Build Information/i)).toBeInTheDocument()
  })

  it('shows git commit info when expanded', () => {
    render(<BuildInfo />)
    const toggleButton = screen.getByLabelText(/Toggle build information/i)

    fireEvent.click(toggleButton)

    expect(screen.getByText(/abc1234/i)).toBeInTheDocument()
    expect(screen.getByText(/main/i)).toBeInTheDocument()
  })

  it('closes panel when close button clicked', () => {
    render(<BuildInfo />)
    const toggleButton = screen.getByLabelText(/Toggle build information/i)

    // Open panel
    fireEvent.click(toggleButton)
    expect(screen.getByText(/Build Information/i)).toBeInTheDocument()

    // Close panel
    const closeButton = screen.getByLabelText(/Close/i)
    fireEvent.click(closeButton)

    // Panel should be closed
    expect(screen.queryByText(/Build Information/i)).not.toBeInTheDocument()
  })

  it('renders commit link with correct href', () => {
    render(<BuildInfo />)
    const toggleButton = screen.getByLabelText(/Toggle build information/i)

    fireEvent.click(toggleButton)

    const commitLink = screen.getByTitle(/View commit abc1234567890def/i)
    expect(commitLink).toHaveAttribute('href', expect.stringContaining('commit/abc1234567890def'))
  })
})
