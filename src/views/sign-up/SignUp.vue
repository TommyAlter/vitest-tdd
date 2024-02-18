<template>
  <h1>Sign Up</h1>
  <div>
    <label for="username">Username</label>
    <input id="username" />
  </div>

  <div>
    <label for="email">Email</label>
    <input id="email" />
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" type="password" @input="onChangePassword" />
  </div>

  <div>
    <label for="password-confirm">Password Confirmation</label>
    <input id="password-confirm" type="password" @input="onChangePasswordConfirm" />
  </div>
  <button :disabled="disabled">Sign Up</button>
</template>

<script setup>
import { ref } from 'vue'
const disabled = ref(true)
const password = ref('')
const passwordConfirm = ref('')

const onChangePassword = (ev) => {
  password.value = ev.target.value
  disabled.value = password.value !== passwordConfirm.value
}

const onChangePasswordConfirm = (ev) => {
  passwordConfirm.value = ev.target.value
  disabled.value = password.value !== passwordConfirm.value
}
</script>
