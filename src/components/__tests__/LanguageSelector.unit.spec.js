import { render, screen } from '@testing-library/vue'
import LanguageSelector from '../LanguageSelector.vue'
import userEvent from '@testing-library/user-event'

describe('Language Selector', () => {
  describe.each([{ language: 'vi' }, { language: 'en' }])(
    'when user select $language',
    ({ language, text }) => {
      it('display expected text', async () => {
        const user = userEvent.setup()
        const i18n = {
          locale: 'en'
        }
        render(LanguageSelector, {
          global: {
            mocks: {
              $i18n: i18n
            }
          }
        })
        await user.click(screen.getByTestId(`language-${language}-selector`))
        expect(i18n.locale).toBe(language)
      })
    }
  )
})
