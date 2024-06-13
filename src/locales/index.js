import { createI18n } from 'vue-i18n'
import en from './translations/en.json'
import vi from './translations/vi.json'
export const createInstance = () => {
  return createI18n({
    locale: localStorage.getItem('app-lang') || navigator.language || 'en',
    messages: {
      en,
      'en-US': en,
      vi
    }
  })
}

export const i18n = createInstance()
