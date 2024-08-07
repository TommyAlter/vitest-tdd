<template>
  <div class="col-lg-6 offset-lg-3 col-sm-8 offset-sm-2" data-testid="password-reset-set-page">
    <form class="card" @submit.prevent="submit">
      <div class="card-header text-center">
        <h1>{{ $t('passwordReset.set') }}</h1>
      </div>
      <div class="card-body">
        <AppInput
          id="password"
          :label="$t('password')"
          :help="errors.password"
          v-model="password"
          type="password"
        />
        <AppInput
          id="passwordConfirm"
          :label="$t('passwordConfirm')"
          :help="passwordMatchError"
          v-model="passwordConfirm"
          type="password"
        />
        <Alert v-if="errorMessage" variant="danger">{{ errorMessage }}</Alert>
        <Alert v-if="successMessage">{{ successMessage }}</Alert>
        <div class="text-center">
          <AppButton :is-disabled="isDisabled" :api-progress="apiProgress">
            {{ $t('passwordReset.set') }}
          </AppButton>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup>
import { AppInput, AppButton, Alert } from '@/components'
import { ref, watch, computed } from 'vue'
import { passwordSet } from './api'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
const { t } = useI18n()
const route = useRoute()

const password = ref('')
const passwordConfirm = ref('')
const apiProgress = ref(false)
const successMessage = ref()
const errorMessage = ref()
const errors = ref({})

const submit = async () => {
  apiProgress.value = true
  errorMessage.value = undefined
  try {
    const response = await passwordSet(route.query.tk, { password: password.value })
    successMessage.value = response.data.message
  } catch (apiError) {
    if (apiError.response?.data?.validationErrors) {
      errors.value = apiError.response.data.validationErrors
    } else if (apiError.response?.data?.message) {
      errorMessage.value = apiError.response.data.message
    } else {
      errorMessage.value = t('genericError')
    }
  } finally {
    apiProgress.value = false
  }
}

watch(
  () => password.value,
  () => {
    delete errors.value.password
  }
)

const isDisabled = computed(() => {
  return password.value || passwordConfirm.value ? password.value !== passwordConfirm.value : true
})
const passwordMatchError = computed(() => {
  return password.value !== passwordConfirm.value ? t('passwordMismatch') : ''
})
</script>
