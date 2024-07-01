<script setup lang="ts">
import { onMounted } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { useUserhubStore } from '@/stores/userhub-details/userhub-details'
import usersTable from '@/components/usersTable.vue'
import { ability } from '@/lib/ability'
import { defineAbilities } from '@/lib/ability'
import { useWeeshStore } from '@/stores/weeshes/weeshes-count'
import { storeToRefs } from 'pinia'




defineAbilities()
const userHubStore = useUserhubStore() 
const weeshStore = useWeeshStore()

const { addedCount } = storeToRefs(weeshStore)

weeshStore.getWeeshesCount()

onMounted(() => {
  userHubStore.getUsersNumber()  
})

</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full p-8 pt-6 pb-10 w-full">
    <MainNav class="mx-6" headingText="Dashboard" />
    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#00e19d] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-l font-medium text-[#020721]">Weeshes</p>
                    <img
                      class="h-6 w-6"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162947/menu_mvjoy6.svg"
                      alt="gradient"
                    />
      
                    <p class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">{{ addedCount }}</p>
                  </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-l font-normal text-[#F8F9FFB2]">Delivered</p>
                    <p class="text-2xl font-normal text-white">275,865</p>
                  </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#6A70FF] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-l font-medium text-[#020721]">Total wallet balance</p>
                    <img
                      class="h-6 w-6"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162926/wallet-3_fbkk9u.svg"
                      alt="gradient"
                    />
      
                    <p class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">₦ 2,986,004.07</p>
                  </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-l font-normal text-[#F8F9FFB2]">Invested</p>
                    <p class="text-2xl font-normal text-white">₦ 0.00</p>
                  </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#00BBD4] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-l font-medium text-[#020721]">Users</p>
                    <img
                      class="h-6 w-6"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162907/profile-2user_stezwz.svg"
                      alt="gradient"
                    />
      
                    <p class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">{{userHubStore.usersCount}}</p>
                  </CardContent>
            </div>
            <div class="bg-[#020721] pt-2 h-[80px] rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-l font-normal text-[#F8F9FFB2]">Active</p>
                    <p class="text-2xl font-normal text-white">365,987</p>
                  </CardContent>
            </div>
        </Card>

        <Card class="h-[210px] rounded-[24px] shadow-md transition-transform transform hover:scale-105">
            <div class="h-[130px] pt-4 bg-[#AEE219] bg-opacity-20 relative rounded-tr-[24px] rounded-tl-[24px]">
                <CardContent class="flex items-center justify-between space-y-0">
                    <p class="text-l font-medium text-[#020721]">Tickets</p>
                    <img
                      class="h-6 w-6"
                      src="https://res.cloudinary.com/dotojp6xu/image/upload/v1715162881/ticket_etur0t.svg"
                      alt="gradient"
                    />
      
                    <p class="text-2xl lg:text-2xl font-medium text-[#020721] absolute bottom-2 left-5">1,375</p>
                </CardContent>
            </div>
            <div class="bg-[#020721] h-[80px] pt-2 rounded-bl-[24px] rounded-br-[24px]">
                <CardContent class="flex flex-col space-y-0">
                    <p class="text-l font-normal text-[#F8F9FFB2]">Pending</p>
                    <p class="text-2xl font-normal text-white">15</p>
                  </CardContent>
            </div>
        </Card>
    </div>
    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-16 mb-4">
      <usersTable />
    </Card>
    <DashboardFooter/>
  </div>
</template>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin
