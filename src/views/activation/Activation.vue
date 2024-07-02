<template>
  <div data-testid="activation-page">
    <h1>Activation Page</h1>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watchEffect(() => {
  axios.patch(`/api/v1/users/${route.params.token}/active`)
})
</script>
