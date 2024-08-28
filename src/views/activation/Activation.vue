<template>
  <div data-testid="activation-page">
    <Alert v-if="status === 'fail'" variant="danger">{{ error }}</Alert>
    <Alert v-if="status === 'success'">{{ data.message }}</Alert>
    <Alert variant="secondary" center v-if="status === 'loading'">
      <Spinner size="normal" />
    </Alert>
  </div>
</template>
<script setup>
import { Spinner, Alert } from '@/components'
import { activate } from './api'
import useRouteParamApiRequest from '@/shared/useRouteParamApiRequest'
const { status, data, error } = useRouteParamApiRequest(activate, 'token')
</script>
