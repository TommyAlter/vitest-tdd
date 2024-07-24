<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="signup-page">
    <form class="card" @submit.prevent="submit" data-testid="form-sign-up" v-if="!successMessage">
      <div class="card-header text-center">
        <h1>{{ $t('signUp') }}</h1>
      </div>
      <div class="card-body">
        <AppInput
          id="username"
          :label="$t('username')"
          :help="errors.username"
          v-model="formState.username"
        />

        <AppInput id="email" :label="$t('email')" :help="errors.email" v-model="formState.email" />

        <AppInput
          id="password"
          :label="$t('password')"
          :help="errors.password"
          v-model="formState.password"
          type="password"
        />

        <AppInput
          id="password-confirm"
          :label="$t('passwordConfirm')"
          :help="passwordMismatchError"
          v-model="formState.passwordConfirm"
          type="password"
        />

        <Alert v-if="errorMessage" variant="danger">{{ errorMessage }}</Alert>
        <div class="text-center">
          <AppButton :is-disabled="isDisabled" :api-progress="apiProgress">
            {{ $t('signUp') }}
          </AppButton>
        </div>
      </div>
    </form>

    <Alert v-else>{{ successMessage }}</Alert>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Alert, AppInput, AppButton } from '@/components'
import { useI18n } from 'vue-i18n'
import { signUp } from './api'
const { t } = useI18n()
const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const apiProgress = ref(false)
const successMessage = ref()
const errorMessage = ref()
const errors = ref({})

const submit = async () => {
  apiProgress.value = true
  errorMessage.value = ''
  const { passwordConfirm, ...body } = formState
  try {
    const response = await signUp(body)
    successMessage.value = response.data.message
  } catch (apiError) {
    if (apiError.response?.status === 400) {
      errors.value = apiError.response.data.validationErrors
    } else {
      errorMessage.value = t('genericError')
    }
  } finally {
    apiProgress.value = false
  }
  //---> Just work with SignUp.spec.js
  // fetch(window.location.origin + '/api/v1/users', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(body)
  // })
}

const isDisabled = computed(() =>
  formState.password || formState.passwordConfirm
    ? formState.password !== formState.passwordConfirm
    : true
)
const passwordMismatchError = computed(() => {
  return formState.password !== formState.passwordConfirm ? t('passwordMismatch') : undefined
})

watch(
  () => formState.username,
  () => {
    delete errors.value.username
  }
)

watch(
  () => formState.email,
  () => {
    delete errors.value.email
  }
)

watch(
  () => formState.password,
  () => {
    delete errors.value.password
  }
)
</script>
