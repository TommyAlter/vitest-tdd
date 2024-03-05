<template>
  <form @submit.prevent="submit">
    <h1>Sign Up</h1>
    <div>
      <label for="username">Username</label>
      <input id="username" v-model="formState.username" />
    </div>

    <div>
      <label for="email">Email</label>
      <input id="email" v-model="formState.email" />
    </div>

    <div>
      <label for="password">Password</label>
      <input id="password" type="password" v-model="formState.password" />
    </div>

    <div>
      <label for="password-confirm">Password Confirmation</label>
      <input id="password-confirm" type="password" v-model="formState.passwordConfirm" />
    </div>
    <button :disabled="isDisabled">Sign Up</button>
  </form>
</template>

<script setup>
import axios from 'axios'
import { reactive, computed } from 'vue'
const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const submit = () => {
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
