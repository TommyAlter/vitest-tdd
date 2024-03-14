vi.mock('axios')
import { render, screen, waitFor } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

beforeEach(() => {
  vi.clearAllMocks()
})

const setup = async () => {
  const user = userEvent.setup()
  const result = render(SignUp)
  const usernameInput = screen.getByLabelText('Username')
  const emailInput = screen.getByLabelText('Email')
  const passwordInput = screen.getByLabelText('Password')
  const passwordConfirmInput = screen.getByLabelText('Password Confirmation')
  await user.type(usernameInput, 'user1')
  await user.type(emailInput, 'user1@mail.com')
  await user.type(passwordInput, 'P4ssword')
  await user.type(passwordConfirmInput, 'P4ssword')
  const button = screen.getByRole('button', { name: 'Sign Up' })
  return {
    ...result,
    user,
    elements: {
      button
    }
  }
}

describe('Sign Up', () => {
  describe('when user set same value for password inputs', () => {
    describe('when user submit form', () => {
      it('sends username, email, password to backend', async () => {
        axios.post.mockResolvedValue({ data: {} })
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        expect(axios.post).toHaveBeenCalledWith('/api/v1/users', {
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword'
        })
      })

      describe('when there is an ongoing api call', () => {
        it('does not allow clicking the button', async () => {
          axios.post.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 1000))
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          await user.click(button)
          expect(axios.post).toHaveBeenCalledTimes(1)
        })

        it('display spinner', async () => {
          axios.post.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 1000))
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          expect(screen.getByRole('status')).toBeInTheDocument()
        })
      })

      describe('when success response is received', () => {
        beforeEach(() => {
          axios.post.mockResolvedValue({ data: { message: 'User create success' } })
        })
        it('display message received from backend', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const text = await screen.findByText('User create success')
          expect(text).toBeInTheDocument()
        })

        it('hide sign up form', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          const form = screen.getByTestId('form-sign-up')
          await user.click(button)
          await waitFor(() => {
            expect(form).not.toBeInTheDocument()
          })
        })
      })

      describe('when network failure occurs', () => {
        beforeEach(() => {
          axios.post.mockRejectedValue({})
        })
        it('display generic message', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const text = await screen.findByText('Unexpected error occurred, please try again')
          expect(text).toBeInTheDocument()
        })

        it('hide spinner', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument()
          })
        })

        describe('when user submit again', () => {
          it('hide error when api request is progress', async () => {
            axios.post.mockRejectedValueOnce({}).mockResolvedValue({ data: {} })
            const {
              user,
              elements: { button }
            } = await setup()
            await user.click(button)
            const text = await screen.findByText('Unexpected error occurred, please try again')
            await user.click(button)
            await waitFor(() => {
              expect(text).not.toBeInTheDocument()
            })
          })
        })
      })
    })
  })
})
