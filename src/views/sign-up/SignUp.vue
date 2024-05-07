<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card" @submit.prevent="submit" data-testid="form-sign-up" v-if="!successMessage">
      <div class="card-header text-center">
        <h1>Sign Up</h1>
      </div>
      <div class="card-body">
        <AppInput
          id="username"
          label="Username"
          :help="errors.username"
          v-model="formState.username"
        />

        <AppInput id="email" label="Email" :help="errors.email" v-model="formState.email" />

        <AppInput
          id="password"
          label="Password"
          :help="errors.password"
          v-model="formState.password"
          type="password"
        />

        <div class="mb-3">
          <label class="form-label" for="password-confirm">Password Confirmation</label>
          <input
            class="form-control"
            id="password-confirm"
            type="password"
            v-model="formState.passwordConfirm"
          />
        </div>
        <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="text-center">
          <button class="btn btn-primary" :disabled="isDisabled || apiProgress">
            <span role="status" class="spinner-border spinner-border-sm" v-if="apiProgress"></span>
            Sign Up
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
import { ref, reactive, computed } from 'vue'
import { AppInput } from '@/components'
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
      errorMessage.value = 'Unexpected error occurred, please try again'
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
</script>
