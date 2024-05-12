<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
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

        <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="text-center">
          <button class="btn btn-primary" :disabled="isDisabled || apiProgress">
            <span role="status" class="spinner-border spinner-border-sm" v-if="apiProgress"></span>
            {{ $t('signUp') }}
          </button>
        </div>
      </div>
    </form>

    <div class="alert alert-success" v-else>
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive, computed, watch } from 'vue'
import { AppInput } from '@/components'
import { useI18n } from 'vue-i18n'
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
    const response = await axios.post('/api/v1/users', body)
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
