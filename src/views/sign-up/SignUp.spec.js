import { render, screen } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import userEvent from '@testing-library/user-event'

describe('Sign Up', () => {
  it('has Sign Up header', () => {
    render(SignUp)
    const header = screen.getByRole('heading', { name: 'Sign Up' })
    expect(header).toBeInTheDocument()
  })

  it('has username input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('has email input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('has password input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('has password type for password input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('has password confirmation input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Confirmation')).toBeInTheDocument()
  })

  it('has password type for password confirmation input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Confirmation')).toHaveAttribute('type', 'password')
  })

  it('has Sign Up button', () => {
    render(SignUp)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    expect(button).toBeInTheDocument()
  })

  it('disable the button initially', () => {
    render(SignUp)
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled()
  })

  describe('when user set same value for password inputs', () => {
    it('enable button', async () => {
      const user = userEvent.setup()
      render(SignUp)
      const passwordInput = screen.getByLabelText('Password')
      const passwordConfirmInput = screen.getByLabelText('Password Confirmation')
      await user.type(passwordInput, 'P4ssword')
      await user.type(passwordConfirmInput, 'P4ssword')
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeEnabled()
    })
  })
})
