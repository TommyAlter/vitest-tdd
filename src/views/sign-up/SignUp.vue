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
    <input id="password" type="password" v-model="password" />
  </div>

  <div>
    <label for="password-confirm">Password Confirmation</label>
    <input id="password-confirm" type="password" v-model="passwordConfirm" />
  </div>
  <button :disabled="isDisabled">Sign Up</button>
</template>

<script setup>
import { ref, computed } from 'vue'
const password = ref('')
const passwordConfirm = ref('')

const isDisabled = computed(() =>
  password.value || passwordConfirm.value ? password.value !== passwordConfirm.value : true
)
</script>
