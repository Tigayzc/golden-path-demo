import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders main heading', () => {
    render(<App />)
    expect(screen.getByText(/Golden Path Demo/i)).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<App />)
    expect(screen.getByText(/Modern DevOps Workflow Best Practices/i)).toBeInTheDocument()
  })

  it('renders project overview section', () => {
    render(<App />)
    expect(screen.getByText(/Project Overview/i)).toBeInTheDocument()
  })

  it('renders tech stack section', () => {
    render(<App />)
    expect(screen.getByText(/Tech Stack/i)).toBeInTheDocument()
  })

  it('renders build info component', () => {
    render(<App />)
    // BuildInfo 组件默认渲染为折叠状态
    expect(document.querySelector('.build-info-container')).toBeInTheDocument()
  })

  it('renders footer with links', () => {
    render(<App />)
    expect(screen.getByText(/Made with ❤️/i)).toBeInTheDocument()
  })
})
