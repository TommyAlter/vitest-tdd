<template>
  <button :class="`btn btn-${variant}`" :disabled="isDisabled || apiProgress">
    <Spinner v-if="apiProgress" />
    <slot />
  </button>
</template>
<script setup>
import Spinner from './Spinner.vue'
defineProps({
  isDisabled: Boolean,
  apiProgress: Boolean,
  variant: {
    type: String,
    default: 'primary'
  }
})
</script>
