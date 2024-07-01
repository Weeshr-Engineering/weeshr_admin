<script setup lang="ts">
import { isVNode } from 'vue'
import { useToast } from './use-toast'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '.'
import { Icon } from '@iconify/vue'

const { toasts } = useToast()
</script>

<template>
  <ToastProvider>
    <Toast v-for="toast in toasts" :key="toast.id" v-bind="toast">
      <div class="flex flex-row items-center justify-center">
        <ToastTitle v-if="toast.title">
         
        </ToastTitle>
        <template v-if="toast.description">
          <ToastDescription v-if="isVNode(toast.description)">
            <component :is="toast.description" />
          </ToastDescription>
          <ToastDescription v-else :class="{ 'text-center': toast.variant !== 'loading' }">
            <template v-if="toast.variant === 'success'">
              <Icon
              icon="mdi:success-circle-outline"
              width="20"
              height="16"
              class="inline-block w-8 h-6 mr-2 text-[#FFFFFF] animate-pulse"
            />
            </template>
            <template v-else-if="toast.variant === 'loading'">
              <!-- Loading Icon -->
              <Icon
              icon="tabler:chart-arcs-3"
              width="16"
              height="16"
              class="inline-block w-4 h-4 mr-2 text-[#FFFFFF] animate-spin"
            />
            </template>
            <template v-else-if="toast.variant === 'info'">
              <Icon
                icon="fluent:cd-16-regular"
                width="16"
                height="16"
                class="inline-block w-5 h-5 mr-2 text-[#FFFFFF] animate-bounce"
              />
            </template>
            <template v-else-if="toast.variant === 'warning'">
              <Icon
                icon="mdi:alert-circle"
                width="16"
                height="16"
                class="inline-block w-5 h-5 mr-2 text-[#FFFFFF] animate-shake"
              />
            </template>
            <template v-else-if="toast.variant === 'destructive'">
              <Icon
                icon="codicon:error"
                width="16"
                height="16"
                class="inline-block w-5 h-5 mr-2 text-[#FFFFFF] animate-flash"
              />
            </template>
            {{ toast.description }}
          </ToastDescription>
        </template>
        <ToastClose :class="{ 'toast-close-loading': toast.variant === 'loading',
       'toast-close-success': toast.variant === 'success','toast-close-destructive': toast.variant === 'destructive',
       'toast-close-info': toast.variant === 'info', 'toast-close-warning': toast.variant === 'warning'}" />
     
      <component :is="toast.action" />
    </div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>

<style scoped>
.toast-close-loading {
  background-color: #F8F9FFB2; /* Set background color to white */
}
.toast-close-success {
  background-color: #02072199; /* Set background color to white */
}
.toast-close-info {
  background-color: #02072199; /* Set background color to white */
}
.toast-close-destructive{
  background-color: #02072199;
}
.toast-close-warning{
  background-color: #02072199;
}
/* Add these styles to your main CSS file or component-specific style block */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

/* Other animations (bounce, shake, flash) remain the same */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}

@keyframes flash {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.animate-bounce {
  animation: bounce 1.5s infinite;
}

.animate-shake {
  animation: shake 0.5s infinite;
}

.animate-flash {
  animation: flash 1.5s infinite;
}
</style>
