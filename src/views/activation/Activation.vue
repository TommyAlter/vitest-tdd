<template>
  <div data-testid="activation-page">
    <Alert v-if="status === 'fail'" variant="danger">{{ errorMessage }}</Alert>
    <Alert v-if="status === 'success'">{{ successMessage }}</Alert>
    <Alert variant="secondary" center v-if="status === 'loading'">
      <Spinner size="normal" />
    </Alert>
  </div>
</template>
<script setup>
import axios from 'axios'
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Spinner, Alert } from '@/components'
const { t } = useI18n()
const route = useRoute()
const errorMessage = ref()
const successMessage = ref()
const status = ref('')
watchEffect(async () => {
  status.value = 'loading'
  try {
    const response = await axios.patch(`/api/v1/users/${route.params.token}/active`)
    successMessage.value = response.data.message
    status.value = 'success'
  } catch (apiError) {
    if (apiError.response?.data?.message) {
      errorMessage.value = apiError.response.data.message
    } else {
      errorMessage.value = t('genericError')
    }
    status.value = 'fail'
  }
})
</script>
