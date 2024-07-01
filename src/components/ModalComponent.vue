<template>
  <div v-if="show" class=" fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-[700px] mx-auto">
      <div class="flex justify-between items-center pb-3 border-b">
        <p class="text-xl font-bold">{{ action }} Details</p>
        <button @click="closeModal" class="text-gray-600 hover:text-gray-900" aria-label="Close">
          <Icon icon="mdi:close" width="24" height="24" />
        </button>
      </div>
      <div>
        <div class="mb-4 w-full">
          <p class="text-lg font-semibold">Resource</p>
          <pre class="bg-gray-100 p-2 rounded overflow-x-auto">{{ formattedResource }}</pre>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Metadata</h3>
          <pre class="bg-gray-100 p-2 rounded overflow-x-auto">{{ formattedMetadata }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, computed } from 'vue';
import { Icon } from '@iconify/vue';


interface Resource {
  [key: string]: unknown;
}

interface Metadata {
  [key: string]: unknown;
}

const props = defineProps<{
  show: boolean;
  action: string;
  resource: Resource;
  metadata: Metadata;
 
}>();

const emit = defineEmits(['close']);

const formatJson = (data: any) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error formatting JSON', error);
    return JSON.stringify(data, null, 2);
  }
};

const formattedResource = computed(() => formatJson(props.resource));
const formattedMetadata = computed(() => formatJson(props.metadata));

const closeModal = () => {
  emit('close');
};
</script>
