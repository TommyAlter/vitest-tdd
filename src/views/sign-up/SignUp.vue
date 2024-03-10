<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card" @submit.prevent="submit">
      <div class="card-header text-center">
        <h1>Sign Up</h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label" for="username">Username</label>
          <input class="form-control" id="username" v-model="formState.username" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="email">Email</label>
          <input class="form-control" id="email" v-model="formState.email" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input class="form-control" id="password" type="password" v-model="formState.password" />
        </div>

        <div class="mb-3">
          <label class="form-label" for="password-confirm">Password Confirmation</label>
          <input
            class="form-control"
            id="password-confirm"
            type="password"
            v-model="formState.passwordConfirm"
          />
        </div>
        <div class="text-center">
          <button class="btn btn-primary" :disabled="isDisabled || apiProgress">Sign Up</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive, computed } from 'vue'
const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const apiProgress = ref(false)

const submit = () => {
  apiProgress.value = true
  const { passwordConfirm, ...body } = formState
  axios.post('/api/v1/users', body)
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
