<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Depot" />
    <div class="min-w-[164px] grid grid-cols-2 gap-4 md:grid-cols-4  lg:grid-cols-8 ">
      <Button
        class="bg-[#020721] text-l font-medium text-[#FFFFFF] rounded-3xl  h-[30px] md:h-[60px] lg:145px"
      >
        Today
      </Button>
      <Button
        class="bg-[#FFFFFF] text-l font-medium text-[#020721] rounded-3xl  h-[30px] md:h-[60px] lg:145px"
      >
        6 Feb 2023
      </Button>
      <Button
        class="bg-[#FFFFFF] text-l font-medium text-[#020721] rounded-3xl  h-[30px] md:h-[60px] lg:145px"
      >
        7 Feb 2023
      </Button>
      <Button
        class="bg-[#FFFFFF] text-l font-medium text-[#020721] rounded-3xl  h-[30px] md:h-[60px] lg:145px"
      >
        8 Feb 2023
      </Button>
      <Button
        class="bg-[#FFFFFF] text-l font-medium text-[#020721] rounded-3xl  h-[30px] md:h-[60px] lg:145px"
      >
        9 Feb 2023
      </Button>
      <Button
        class="bg-[#FFFFFF] text-l font-medium text-[#020721] rounded-3xl  h-[30px] md:h-[60px] lg:145px"
      >
        10 Feb 2023
      </Button>
      <Button
        class="bg-[#FFFFFF] text-l font-medium text-[#020721] rounded-3xl  h-[30px] md:h-[60px] lg:145px"
      >
        11 Feb 2023
      </Button>
      <Button
        class="bg-[#FFFFFF] text-l font-medium text-[#020721] rounded-3xl  h-[30px] md:h-[60px] lg:145px"
      >
        12 Feb 2023
      </Button>
    </div>

    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6">
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#FFFFFF] cardShadow1 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#020721]">Total Deliverable</p>
            <div class="weeshr-icon1 rounded-[7px]">
              <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#ffffff" />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#020721] absolute bottom-2 left-5">
              56
            </p>
          </CardContent>
        </div>
        <div
          class="border-b-8 border-[#FFFFFF] w-[202px] pt-5 md:pt:6 lg:pt-7 mx-auto rounded"
        ></div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#00C37F] cardShadow2 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Delivered</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#00C37F" />
            </div>

            <div class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              <p v-if="!loading" >{{ deliveredCount }}</p>
            </div>
          </CardContent>
        </div>
        <div
          class="border-b-8 border-[#00C37F] w-[202px] pt-5 md:pt:6 lg:pt-7 mx-auto rounded"
        ></div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#EE9F39] cardShadow3 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Outbounded</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#EE9F39" />
            </div>

            <div class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              <p v-if="!loading" >{{ outboundCount }}</p>
            </div>
          </CardContent>
        </div>
        <div
          class="border-b-8 border-[#EE9F39] w-[202px] pt-5 md:pt:6 lg:pt-7 mx-auto rounded"
        ></div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#E45044] cardShadow4 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Pending</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#E45044" />
            </div>

            <div class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              <p v-if="!loading" >{{ pendingCount }}</p>
            </div>
          </CardContent>
        </div>
        <div
          class="border-b-8 border-[#E45044] w-[202px] pt-5 md:pt:6 lg:pt-7 mx-auto rounded"
        ></div>
      </Card>
    </div>

    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Total Depot Listing
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Manage all fulfilled weeshes
          </p>
        </div>
        <Search class="mt-3 lg:mt-0" />
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead>Full Name </TableHead>
              <TableHead>Name of Weesh</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div class="flex items-center">
                  Price
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>

              <TableHead>
                <div class="flex items-center">
                  Status
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user._id">
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.fullname }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.name }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.category }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.price }} </TableCell>
              <TableCell>
                <div
                  :class="statusBg(user.status)"
                  class="rounded-[10px] w-fit px-2 py-0.5 text-white text-sm capitalize"
                >
                  {{ user.status }}
                </div>
              </TableCell>
              <TableCell>
                <router-link :to="`/usersdetails/${user._id}`">
                  <svg
                    width="20"
                    height="50"
                    viewBox="0 0 20 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 31L12.5118 26.0606C13.1627 25.4773 13.1627 24.5227 12.5118 23.9394L7 19"
                      stroke="#54586D"
                      stroke-opacity="0.8"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </router-link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <Button variant="secondary"> <Icon icon="radix-icons:chevron-left" /> </Button>
        <Button variant="secondary" class="bg-[#020721] text-gray-400"> 1 </Button>
        <Button variant="outline"> 2 </Button>
        <Button variant="outline"> &#8230; </Button>
        <Button variant="outline"> 4 </Button>
        <Button variant="outline"> 5 </Button>
        <Button variant="outline"> <Icon icon="radix-icons:chevron-right" /> </Button>
        <a href="#"><p class="text-[blue]">See all</p></a>
      </div>
    </Card>
    <DashboardFooter />
  </div>
</template>

<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useWeeshStore } from '@/stores/weeshes/weeshes-count'
import { Loader2 } from 'lucide-vue-next'


import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { storeToRefs } from 'pinia'

// Define a ref to hold the users data
// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    fullname: 'Alisha Christian',
    name: 'iphone 15 Pro Max',
    category: 'Gadget',
    price: '₦ 1,565,987.00',
    status: 'outbound'
  },
  {
    _id: 2,
    fullname: 'Dario Rasmussen',
    name: 'Mary K Facial Cleanser',
    category: 'Body & Beauty ',
    price: '₦ 51,000,087.66',
    status: 'delivered'
  },
  {
    _id: 3,
    fullname: 'Sidney Mclaughlin',
    name: '2014 Honda Accord',
    category: 'Automobile',
    price: '₦ 1,927.05',
    status: 'delivered'
  },
  {
    _id: 4,
    fullname: 'Awokoya Olawale',
    name: 'Lacoste White Sneakers',
    category: 'Footwear',
    price: '₦ 1,565,987.00',
    status: 'pending'
  },
  {
    _id: 5,
    fullname: 'Cristopher Sade',
    name: 'Money',
    category: 'Cash',
    price: '₦ 1,565,987.00',
    status: 'pending'
  },
  {
    _id: 6,
    fullname: 'Charles Ryland',
    name: 'Zara Men Winter Coat',
    category: 'Clothing',
    price: '₦ 231,000.00',
    status: 'pending'
  },
  {
    _id: 7,
    fullname: 'Ngozi Nylah',
    name: 'S&P 500',
    category: 'Investments',
    price: '₦ 3,523.50',
    status: 'outbound'
  },
  {
    _id: 8,
    fullname: 'Adeyinka Bentley',
    name: 'Maldives Invaders',
    category: 'Trip',
    price: '₦ 4,343,021.00',
    status: 'outbound'
  },
  {
    _id: 9,
    fullname: 'Onyenka Obaji',
    name: 'Hisense Double Door Fridge',
    category: 'Appliance',
    price: '₦ 230,103.34',
    status: 'outbound'
  },
  {
    _id: 10,
    fullname: 'Piu Memphis',
    name: 'Raddison Blue Buffet',
    category: 'Food',
    price: '₦ 0.00',
    status: 'delivered'
  }
])

const statusBg = (status: string) => {
  switch (status) {
    case 'outbound':
      return 'bg-[#EE9F39]'
    case 'pending':
      return 'bg-[#E45044]'
    case 'delivered':
      return 'bg-[#00c37f]'
    default:
      return ''
  }
}

const weeshStore = useWeeshStore()
const { deliveredCount, outboundCount, pendingCount, loading } = storeToRefs(weeshStore)

weeshStore.getWeeshesCount()
</script>

<style scoped>
.cardShadow1 {
  box-shadow:
    0px 31px 30px -23px #dddcdc,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow2 {
  box-shadow:
    0px 31px 30px -23px #00c37f,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}
.cardShadow3 {
  box-shadow:
    0px 31px 30px -23px #ee9f39,
    inset 0px -23px 30px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow4 {
  box-shadow:
    0px 31px 30px -23px #e45044,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}
.weeshr-icon1 {
  background-color: black;
}
.weeshr-icon2 {
  background-color: white;
}
</style>
