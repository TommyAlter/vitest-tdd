import { render, screen } from 'test/helper'
import LanguageSelector from '../LanguageSelector.vue'
import userEvent from '@testing-library/user-event'

describe('Language Selector', () => {
  describe.each([
    { language: 'vi', text: 'Dang Ky' },
    { language: 'en', text: 'Sign Up' }
  ])('when user select $language', ({ language, text }) => {
    it('display expected text', async () => {
      const user = userEvent.setup()
      const TempComponent = {
        components: {
          LanguageSelector
        },
        template: `
          <span>{{ $t('signUp') }}</span>
          <LanguageSelector />
          `
      }

      render(TempComponent)
      await user.click(screen.getByTestId(`language-${language}-selector`))
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
