import { render, screen, waitFor } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { HttpResponse, http, delay } from 'msw'
import { it } from 'vitest'

let requestBody
let counter = 0
const server = setupServer(
  http.post('/api/v1/users', async ({ request }) => {
    requestBody = await request.json()
    counter += 1
    return HttpResponse.json({ message: 'User create success' })
  })
)

beforeEach(() => {
  counter = 0
  server.resetHandlers()
})

beforeAll(() => server.listen())

afterAll(() => server.close())

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

  it('does not display spinner', () => {
    render(SignUp)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  describe('when user set same value for password inputs', () => {
    it('enable button', async () => {
      const {
        elements: { button }
      } = await setup()
      expect(button).toBeEnabled()
    })
  })

  describe('when user submit form', () => {
    it('sends username, email, password to backend', async () => {
      const {
        user,
        elements: { button }
      } = await setup()
      await user.click(button)
      await waitFor(() => {
        expect(requestBody).toEqual({
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword'
        })
      })
    })

    describe('when there is an ongoing api call', () => {
      it('does not allow clicking the button', async () => {
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        await user.click(button)
        await waitFor(() => {
          expect(counter).toBe(1)
        })
      })

      it('display spinner', async () => {
        server.use(
          http.post('/api/v1/users', async () => {
            await delay('infinite')
            return HttpResponse.json({})
          })
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
      it('display generic message', async () => {
        server.use(
          http.post('/api/v1/users', async () => {
            return HttpResponse.error()
          })
        )
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        const text = await screen.findByText('Unexpected error occurred, please try again')
        expect(text).toBeInTheDocument()
      })

      it('hide spinner', async () => {
        server.use(
          http.post('/api/v1/users', async () => {
            return HttpResponse.error()
          })
        )
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
          let processedFirstRequest = false
          server.use(
            http.post('/api/v1/users', async () => {
              if (!processedFirstRequest) {
                processedFirstRequest = true
                return HttpResponse.error()
              } else {
                return HttpResponse.json({})
              }
            })
          )
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

    describe('when username is invalid', () => {
      it('display validation error', async () => {
        server.use(
          http.post('/api/v1/users', async () => {
            return HttpResponse.json(
              {
                validationErrors: {
                  username: 'Username cannot be null'
                }
              },
              { status: 400 }
            )
          })
        )
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        const error = await screen.findByText('Username cannot be null')
        expect(error).toBeInTheDocument()
      })
    })
  })
})
