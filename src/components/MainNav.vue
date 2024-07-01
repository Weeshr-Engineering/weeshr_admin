<script setup lang="ts">
import { defineProps } from 'vue'
import UserNav from '@/components/UserNav.vue'
// Function to format the date in the desired format (e.g., "Tue, 5 Feb 2023")
import { useDateFormat, useNow } from '@vueuse/core'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'

const superAdminStore = useSuperAdminStore()
const user = superAdminStore.getLocalstorageData()

const formattedDate = useDateFormat(useNow(), 'ddd, D MMM YYYY')

const props = defineProps<{
  headingText: string
}>()

const headingText = props.headingText
</script>

<template>
  <nav class="flex items-center justify-between p-4 py-6 space-x-4 lg:space-x-6">
    <div>
      <h4 class="text-[#02072199] text-sm">
        {{ formattedDate }}
      </h4>

      <h2 class="text-3xl">
        {{ headingText }}
      </h2>
    </div>

    <div class="items-center hidden ml-auto space-x-2 sm:flex">
      <div>
        <h6>{{user.firstname}} {{user.lastname}}</h6>
        <h6 class="text-xs text-end text-[#373B4D]">Administrator</h6>
      </div>
      <UserNav />
    </div>
  </nav>
</template>
