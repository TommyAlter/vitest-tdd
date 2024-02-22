<template>
  <h1>Sign Up</h1>
  <div>
    <label for="username">Username</label>
    <input id="username" v-model="username" />
  </div>

  <div>
    <label for="email">Email</label>
    <input id="email" v-model="email" />
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" type="password" v-model="password" />
  </div>

  <div>
    <label for="password-confirm">Password Confirmation</label>
    <input id="password-confirm" type="password" v-model="passwordConfirm" />
  </div>
  <button :disabled="isDisabled" @click="submit">Sign Up</button>
</template>

<script setup>
import axios from 'axios'
import { ref, computed } from 'vue'
const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

const submit = () => {
  axios.post('/api/v1/users', {
    username: username.value,
    email: email.value,
    password: password.value
  })
}

const isDisabled = computed(() =>
  password.value || passwordConfirm.value ? password.value !== passwordConfirm.value : true
)
</script>
