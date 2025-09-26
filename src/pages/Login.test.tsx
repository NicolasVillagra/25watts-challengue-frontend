import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest'

// Central mock for useNavigate so we can assert calls reliably
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

let Login: typeof import('./Login')['default']
beforeAll(async () => {
  // Import the component AFTER the mocks are set up
  Login = (await import('./Login')).default
})

function setup() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  )
}

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    localStorage.clear()
  })
  it('permite completar email y password y realiza submit', async () => {
    setup()
    const user = userEvent.setup()

    const email = screen.getByPlaceholderText('ejemplo@gmail.com') as HTMLInputElement
    const password = screen.getByPlaceholderText('••••••••••') as HTMLInputElement
    const submit = screen.getByRole('button', { name: /iniciá sesión/i })

    await user.type(email, 'user@test.com')
    await user.type(password, 'secret')
    await user.click(submit)

    expect(localStorage.getItem('userName')).toBe('User')
    expect(localStorage.getItem('role')).toBe('user')
  })

  it('redirige a admin cuando las credenciales son de admin', async () => {
    setup()

    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText('ejemplo@gmail.com'), 'admin@admin.com')
    await user.type(screen.getByPlaceholderText('••••••••••'), 'admin123')
    await user.click(screen.getByRole('button', { name: /iniciá sesión/i }))

    expect(localStorage.getItem('userName')).toBe('Admin')
    expect(localStorage.getItem('role')).toBe('admin')
    expect(mockNavigate).toHaveBeenCalledWith('/admin')
  })
})
