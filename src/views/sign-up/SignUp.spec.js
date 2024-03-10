import { render, screen, waitFor } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'

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

  describe('when user submit form', () => {
    it('sends username, email, password to backend', async () => {
      let requestBody
      const server = setupServer(
        http.post('/api/v1/users', async ({ request }) => {
          requestBody = await request.json()
          return HttpResponse.json({})
        })
      )
      server.listen()

      const user = userEvent.setup()
      render(SignUp)
      const usernameInput = screen.getByLabelText('Username')
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Password')
      const passwordConfirmInput = screen.getByLabelText('Password Confirmation')
      await user.type(usernameInput, 'user1')
      await user.type(emailInput, 'user1@mail.com')
      await user.type(passwordInput, 'P4ssword')
      await user.type(passwordConfirmInput, 'P4ssword')
      const button = screen.getByRole('button', { name: 'Sign Up' })
      await user.click(button)
      await waitFor(() => {
        expect(requestBody).toEqual({
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword'
        })
      })
      server.close()
    })

    describe('when there is an ongoing api call', () => {
      it('does not allow clicking the button', async () => {
        let count = 0
        const server = setupServer(
          http.post('/api/v1/users', () => {
            count += 1
            return HttpResponse.json({})
          })
        )
        server.listen()

        const user = userEvent.setup()
        render(SignUp)
        const usernameInput = screen.getByLabelText('Username')
        const emailInput = screen.getByLabelText('Email')
        const passwordInput = screen.getByLabelText('Password')
        const passwordConfirmInput = screen.getByLabelText('Password Confirmation')
        await user.type(usernameInput, 'user1')
        await user.type(emailInput, 'user1@mail.com')
        await user.type(passwordInput, 'P4ssword')
        await user.type(passwordConfirmInput, 'P4ssword')
        const button = screen.getByRole('button', { name: 'Sign Up' })
        await user.click(button)
        await user.click(button)
        await waitFor(() => {
          expect(count).toBe(1)
        })
        server.close()
      })
    })
  })

})
