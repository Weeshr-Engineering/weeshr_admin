<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { useUserhubStore } from '@/stores/userhub-details/userhub-details';

const userHubStore = useUserhubStore() 

</script>

<template>
    <div class=" w-full h-full" v-if="!userHubStore.loading">
        <div class="flex flex-col grid-cols-1 mt-4 justify-center items-center h-3/4 w-full">
            <Skeleton class="w-32 h-32 bg-gray-400 rounded-xl shadow-md mb-5"/>
            <Skeleton class="w-36 h-10 bg-gray-400"/>
        </div>
        <div class="w-full space-y-2 px-6 py-3 bg-gray-600 rounded-xl">
            <Skeleton class="w-20 h-4 bg-gray-400"/>
            <Skeleton class="w-36 h-10 bg-gray-400"/>
        </div>        
    </div>
</template>