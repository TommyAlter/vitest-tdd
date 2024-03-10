vi.mock('axios')
import { render, screen } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Sign Up', () => {
  describe('when user set same value for password inputs', () => {
    describe('when user submit form', () => {
      it('sends username, email, password to backend', async () => {
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
        expect(axios.post).toHaveBeenCalledWith('/api/v1/users', {
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword'
        })
      })

      describe('when there is an ongoing api call', () => {
        it('does not allow clicking the button', async () => {
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
          expect(axios.post).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
