vi.mock('@/views/activation/Activation.vue')
vi.mock('@/views/home/components//UserList.vue')
import { render, router, screen, waitFor } from 'test/helper'
import App from './App.vue'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.post('/api/v1/auth', () => {
    return HttpResponse.json({ id: 1, username: 'user1', email: 'user1@mail.com', image: null })
  })
)

beforeEach(() => {
  server.resetHandlers()
})

beforeAll(() => server.listen())
afterAll(() => server.close())

const setup = async (path) => {
  router.push(path)
  await router.isReady()
  return render(App)
}

describe('Routing', () => {
  describe.each([
    { path: '/', pageId: 'home-page' },
    { path: '/signup', pageId: 'signup-page' },
    { path: '/activation/123', pageId: 'activation-page' },
    { path: '/activation/456', pageId: 'activation-page' },
    { path: '/password-reset/request', pageId: 'password-reset-request-page' },
    { path: '/password-reset/set', pageId: 'password-reset-set-page' },
    { path: '/user/1', pageId: 'user-page' },
    { path: '/user/2', pageId: 'user-page' },
    { path: '/login', pageId: 'login-page' }
  ])('when path is $path', ({ path, pageId }) => {
    it(`display ${pageId}`, async () => {
      await setup(path)
      const page = screen.queryByTestId(pageId)
      expect(page).toBeInTheDocument()
    })
  })

  describe.each([
    { initialPath: '/', clickingTo: 'link-signup-page', visiblePage: 'signup-page' },
    { initialPath: '/signup', clickingTo: 'link-home-page', visiblePage: 'home-page' },
    { initialPath: '/', clickingTo: 'link-login-page', visiblePage: 'login-page' }
  ])('when path is $initialPath', ({ initialPath, clickingTo, visiblePage }) => {
    describe(`when user clicks ${clickingTo}`, () => {
      it(`display ${visiblePage}`, async () => {
        const { user } = await setup(initialPath)
        const link = screen.queryByTestId(clickingTo)
        await user.click(link)
        await waitFor(() => {
          expect(screen.queryByTestId(visiblePage)).toBeInTheDocument()
        })
      })
    })
  })

  describe('when user is at home page', () => {
    describe('when user clicks to user name in user list', () => {
      it('display user page', async () => {
        const { user } = await setup('/')
        const link = await screen.findByText('test user')
        await user.click(link)
        await waitFor(() => {
          expect(screen.queryByTestId('user-page')).toBeInTheDocument()
        })
      })
    })
  })

  describe('when user is at login page', () => {
    describe('when user clicks forgot password link', () => {
      it('displays password reset request page', async () => {
        const { user } = await setup('/login')
        const link = await screen.findByText('Forgot password?')
        await user.click(link)
        await waitFor(() => {
          expect(screen.queryByTestId('password-reset-request-page')).toBeInTheDocument()
        })
      })
    })
  })

  describe('when login successful', () => {
    it('navigates to home page', async () => {
      const { user } = await setup('/login')
      await user.type(screen.getByLabelText('Email'), 'user1@mail.com')
      await user.type(screen.getByLabelText('Password'), 'P4ssword')
      await user.click(screen.getByRole('button', { name: 'Login' }))
      await waitFor(() => {
        expect(screen.queryByTestId('home-page')).toBeInTheDocument()
      })
    })
  })
})
