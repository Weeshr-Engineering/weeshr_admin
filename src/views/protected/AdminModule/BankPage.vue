<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Bank" />

    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6">
      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#FFFFFF] cardShadow1 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#020721]">Balance</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="solar:book-bold" width="24px" height="24px" color="#020721" />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#020721] absolute bottom-2 left-5">
              ₦ 78,351,823.74
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#00C37F] cardShadow2 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Inflow</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon
                icon="mingcute:arrow-left-down-line"
                width="24px"
                height="24px"
                color="#00C37F"
              />
            </div>

            <p class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              ₦ 176,405,287.78
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#EE9F39] cardShadow3 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Lieu</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon icon="heroicons:bars-3" width="24px" height="24px" color="#EE9F39" />
            </div>

            <p class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              ₦ 32,125.00
            </p>
          </CardContent>
        </div>
      </Card>

      <Card
        class="h-[150px] rounded-[24px] transition-transform transform hover:scale-105 bg-[#E45044] cardShadow4 border-transparent"
      >
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Outflow</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Icon
                icon="mingcute:arrow-right-up-line"
                width="24px"
                height="24px"
                color="#E45044"
              />
            </div>

            <p class="text-2xl lg:text-3xl font-medium text-[#ffffff] absolute bottom-2 left-5">
              ₦ 98,021,339.04
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Bank Inflow
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">List of Inflow</p>
        </div>
        <Search class="mt-3 lg:mt-0" />
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead>Recipient </TableHead>
              <TableHead>Account ID </TableHead>
              <TableHead>Weeshes</TableHead>
              <TableHead>
                <div class="flex items-center">
                  Type
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">
                  Date
                  <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div class="flex items-center">
                  Amount
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
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.recipient }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.id }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.weeshes }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.type }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.date }} </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.amount }} </TableCell>
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
        <Button variant="outline"> 74</Button>
        <Button variant="outline"> 75 </Button>
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

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

// Define a ref to hold the users data
// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    recipient: 'Weeshr Bank',
    id: '@harrison',
    weeshes: 'iphone 15 Pro Max',
    type: 'Inflow',
    date: '01 Nov 1978',
    amount: '₦ 1,565,987.00',
    status: 'successful'
  },
  {
    _id: 2,
    recipient: 'Weeshr Bank',
    id: '@dario',
    weeshes: 'Mary K Facial Cleanser',
    type: 'Inflow',
    date: '03 Sep 1995',
    amount: '₦ 51,000,087.66',
    status: 'successful'
  },
  {
    _id: 3,
    recipient: 'Weeshr Bank',
    id: '@sidney101',
    weeshes: '2014 Honda Accord',
    type: 'Inflow',
    date: '25 Aug 1994',
    amount: '₦ 1,927.0',
    status: 'successful'
  },
  {
    _id: 4,
    recipient: 'Ajax Logistics',
    id: '@kemiller',
    weeshes: 'Lacoste White Sneakers',
    type: 'Outflow',
    date: '06 Apr 1991',
    amount: '₦ 1,565,987.00',
    status: 'pending'
  },
  {
    _id: 5,
    recipient: 'WeeshrBank',
    id: '@saderizder',
    weeshes: 'Money',
    type: 'Inflow',
    date: '28 Dec 1988',
    amount: '₦ 200,000.00',
    status: 'failed'
  },
  {
    _id: 6,
    recipient: 'Middle Men Lagos',
    id: '@vendor_mml',
    weeshes: 'Zara Men Winter Coat',
    type: 'Outflow',
    date: '13 Jul 1982',
    amount: '₦ 231,000.00',
    status: 'failed'
  },
  {
    _id: 7,
    recipient: 'WeeshrBank',
    id: '@ngozero',
    weeshes: 'S&P 500',
    type: 'Inflow',
    date: '25 Jul 1986',
    amount: '₦ 3,523.50',
    status: 'successful'
  },
  {
    _id: 8,
    recipient: 'Middle Men Lagos',
    id: '@vendor_mml',
    weeshes: 'Maldives Invaders',
    type: 'Outflow',
    date: '12 Oct 1987',
    amount: '₦ 4,343,021.00',
    status: 'successful'
  },
  {
    _id: 9,
    recipient: 'Middle Men Lagos',
    id: '@vendor_mml',
    weeshes: 'Hisense Double Door Fridge',
    type: 'Outflow',
    date: '03 Mar 1996',
    amount: '₦ 230,103.34',
    status: 'successful'
  },
  {
    _id: 10,
    recipient: 'WeeshrBank',
    id: '@piurity',
    weeshes: 'Raddison Blue Buffet',
    type: 'Inflow',
    date: '17 May 1999',
    amount: '₦ 0.00',
    status: 'failed'
  }
])

const statusBg = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-[#EE9F39]'
    case 'failed':
      return 'bg-[#E45044]'
    case 'successful':
      return 'bg-[#00c37f]'
    default:
      return ''
  }
}
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
