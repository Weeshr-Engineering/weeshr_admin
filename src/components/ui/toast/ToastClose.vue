<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ToastClose, type ToastCloseProps } from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<
  ToastCloseProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastClose
    v-bind="delegatedProps"
    :class="
      cn(
        'absolute right-2  rounded-full p-1 text-foreground/90 opacity-1 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-offset-3 focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        props.class
      )
    "
  >
    <X class="h-3 w-3" />
  </ToastClose>
</template>
