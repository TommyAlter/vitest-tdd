vi.mock('@/views/activation/Activation.vue')
vi.mock('@/views/home/components//UserList.vue')
import { render, router, screen, waitFor } from 'test/helper'
import App from './App.vue'

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
    { path: '/password-reset/set', pageId: 'password-reset-set-page' }
  ])('when path is $path', ({ path, pageId }) => {
    it(`display ${pageId}`, async () => {
      await setup(path)
      const page = screen.queryByTestId(pageId)
      expect(page).toBeInTheDocument()
    })
  })

  describe.each([
    { initialPath: '/', clickingTo: 'link-signup-page', visiblePage: 'signup-page' },
    { initialPath: '/signup', clickingTo: 'link-home-page', visiblePage: 'home-page' }
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
})
