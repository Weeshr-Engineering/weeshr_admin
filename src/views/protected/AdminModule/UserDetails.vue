<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { getUser, getUserLog } from '@/composables/getUser'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { Pagination, PaginationList, PaginationListItem } from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    nameofweeshes: 'iPhone 15 Pro Max',
    category: 'Gadgets',
    price: '₦ 1,565,987.00',
    changes: '₦ 5,987.00',
    status: ['Initiated']
  },
  {
    _id: 2,
    nameofweeshes: 'Mary K Facial Cleanser',
    category: 'Body & Beauty',
    price: '₦ 51,000,087.6',
    changes: '₦ 100,087.21',
    status: ['Added']
  },
  {
    _id: 3,
    nameofweeshes: '2014 Honda Accord',
    category: 'Automobile',
    price: '₦ 1,927.05',
    changes: '₦ 1,230.00',
    status: ['Added']
  },
  {
    _id: 4,
    nameofweeshes: 'Lacoste White Sneakers',
    category: 'Footwear',
    price: '₦ 15,927.05',
    changes: '₦ 230.00',
    status: ['Fulfiled']
  },
  {
    _id: 5,
    nameofweeshes: 'Money',
    category: 'Cash',
    price: '₦ 1,333,230.00',
    changes: '₦ 531,927.05',
    status: ['Delivered']
  },
  {
    _id: 6,
    nameofweeshes: 'Zara Men Winter Coat',
    category: 'Clothing',
    price: '₦ 122,927.05',
    changes: '₦ 17,230.00',
    status: ['Delivered']
  },
  {
    _id: 7,
    nameofweeshes: 'S&P 500',
    category: 'Investments',
    price: '₦ 111,230.00',
    changes: '₦ 1,230.00',
    status: ['Added']
  },
  {
    _id: 8,
    nameofweeshes: 'Maldives Invaders',
    category: 'Trip',
    price: '₦ 900,230.00',
    changes: '₦ 11,230.00',
    status: ['Initiated']
  },
  {
    _id: 9,
    nameofweeshes: 'Hisense Double Door Fri..',
    category: 'Appliance',
    price: '₦ 340,230.00',
    changes: '₦ 17,230.00',
    status: ['Fulfiled']
  },
  {
    _id: 10,
    nameofweeshes: 'Raddison Blue Buffet',
    category: 'Food',
    price: '₦ 1,230.00',
    changes: '₦ 0.00',
    status: ['Fulfiled']
  }
])

const user2s = ref<any[]>([
  {
    _id: 1,
    type: 'Inflow',
    date: '01 Nov 1978',
    amount: '₦ 1,565,987.00',
    changes: '₦ 5,987.00',
    status: ['Successful']
  },
  {
    _id: 2,
    type: 'Inflow',
    date: '03 Sep 1995',
    amount: '₦ 51,000,087.6',
    changes: '₦ 100,087.21',
    status: ['Successful']
  },
  {
    _id: 3,
    type: 'Inflow',
    date: '25 Aug 1994',
    amount: '₦ 1,927.05',
    changes: '₦ 1,230.00',
    status: ['Successful']
  },
  {
    _id: 4,
    type: 'Outflow',
    date: '06 Apr 1991',
    amount: '₦ 15,927.05',
    changes: '₦ 230.00',
    status: ['Pending']
  },
  {
    _id: 5,
    type: 'Inflow',
    date: '28 Dec 1988',
    amount: '₦ 1,333,230.00',
    changes: '₦ 531,927.05',
    status: ['Failed']
  },
  {
    _id: 6,
    type: 'Outflow',
    date: '13 Jul 1982',
    amount: '₦ 122,927.05',
    changes: '₦ 17,230.00',
    status: ['Failed']
  },
  {
    _id: 7,
    type: 'Inflow',
    date: '25 Jul 1986',
    amount: '₦ 111,230.00',
    changes: '₦ 1,230.00',
    status: ['Successful']
  },
  {
    _id: 8,
    type: 'Outflow',
    date: '12 Oct 1987',
    amount: '₦ 900,230.00',
    changes: '₦ 11,230.00',
    status: ['Successful']
  },
  {
    _id: 9,
    type: 'Outflow',
    date: '03 Mar 1996',
    amount: '₦ 340,230.00',
    changes: '₦ 17,230.00',
    status: ['Successful']
  },
  {
    _id: 10,
    type: 'Inflow',
    date: '17 May 1999',
    amount: '₦ 1,230.00',
    changes: '₦ 0.00',
    status: ['Failed']
  }
])

//images dummy
const images = ref<any[]>([
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710684025/images1_wbbxb5.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710684023/images2_ma998k.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710693199/image5_lwx2g1.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710684024/image4_v8krvl.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710684023/images2_ma998k.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710684025/images1_wbbxb5.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710684023/images2_ma998k.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710693199/image5_lwx2g1.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710684024/image4_v8krvl.svg' },
  { value: 'https://res.cloudinary.com/dufimctfc/image/upload/v1710684023/images2_ma998k.svg' }
])

//get User
const route = useRoute()
const _id = route.params.id

const { appUser, error, load } = getUser()
const { userLog, count, logError, log } = getUserLog()

onMounted(() => {
  load(_id)
})

const dateFormat = (dob: string, time?: string): string => {
  const date = new Date(dob)

  const day = String(date.getUTCDate()).padStart(2, '0')

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const month = monthNames[date.getUTCMonth()]
  const year = date.getUTCFullYear()

  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  const formattedDate = `${day} - ${month} - ${year}`
  const formattedTime = `${hours}:${minutes}:${seconds}`

  const formattedDateTime = `${formattedDate} at ${formattedTime}`

  if (time) {
    return formattedDateTime
  }
  return formattedDate
}

let order = ref<string>('')

const handleSort = () => {
  order.value = order.value === 'sort' ? '' : 'sort'
}

const sortItem = computed(() => {
  let userLogs = [...userLog.value]

  if (order.value === 'sort') {
    userLogs.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return dateB - dateA
    })
  }
  return userLogs
})

//pagination
const pageTotal = ref(count)
let perPage = ref(20)
const pageCurrent = ref(1)

const handleClick = (pageItem: number) => {
  perPage.value = pageItem
  log(_id, 1, perPage.value)
}

const paginationItems = computed(() => {
  const pages = []
  for (let i = 1; i <= Math.ceil(pageTotal.value / perPage.value); i++) {
    pages.push(i)
  }
  return pages
})

const visiblePaginationItems = computed(() => {
  const totalItems = paginationItems.value.length
  const currentPage = pageCurrent.value
  if (totalItems <= 3) {
    return paginationItems.value
  } else {
    let start = Math.max(1, currentPage - 1)
    let end = Math.min(totalItems, currentPage + 1)

    if (currentPage === 1 && totalItems > 3) {
      end = Math.min(totalItems, 3)
    }

    return paginationItems.value.slice(start - 1, end)
  }
})

const isLastPage = computed(() => {
  return pageCurrent.value === Math.ceil(pageTotal.value / perPage.value)
})

const handlePageChange = (page: number, index: number) => {
  const totalPages = Math.ceil(pageTotal.value / perPage.value)
  if (index === totalPages) {
    pageCurrent.value = totalPages
  } else {
    pageCurrent.value = index + 1
  }

  log(_id, page, perPage.value)
}
</script>

<template>
  <div class="flex-col lg:flex lg:flex-row gap-1">
    <Card
      class="sm:col-span-3 md:col-span-3 bg-[#F8F9FF] sm:items-center shadow-xl lg:min-w-[450px]"
    >
      <CardHeader>
        <div class="flex items-center text-xl mb-8">
          <RouterLink :to="{ name: 'appuser' }" class="text-gray-500">App Users</RouterLink>
          <Icon icon="tabler:chevron-right" width="22px" height="22px" class="ml-1 pt-1" />
          <RouterLink :to="{ name: 'appuserDetails' }">Users Details</RouterLink>
        </div>
        <CardDescription>
          <Carousel class="w-8/12 lg:w-min mx-auto">
            <CarouselContent>
              <CarouselItem v-for="image in images" :key="image.value">
                <img
                  :src="image.value"
                  alt="display"
                  class="w-full rounded-full border-double border-4 border-[#baef23]"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious class="bg-[#baef23]" />
            <CarouselNext class="bg-[#baef23]" />
          </Carousel>
          <div v-if="error" class="text-[#02072199] p-10">
            <p>{{ error }}</p>
          </div>
          <div v-else-if="appUser">
            <div class="px-6 py-4 mt-4">
              <span class="text-base font-bold lg:text-base text-[#020721]">Identity</span>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Full Name</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                {{ appUser.firstName }} {{ appUser.middleName }} {{ appUser.lastName }}
              </p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Preferred</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.userName }}</p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Birthday</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                {{ dateFormat(appUser.dob) }}
              </p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Gender</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.gender }}</p>
            </div>
            <div class="px-6 py-4">
              <span class="text-base font-bold lg:text-base text-[#020721]">Contact</span>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Email</p>
              <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{ appUser.email }}</p>
            </div>
            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-2 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Phone</p>
              <p class="text-xs md:text-sm text-[#020721]">
                {{ appUser.phoneNumber.normalizedNumber }}
              </p>
            </div>

            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-1 my-2 rounded-full border"
            >
              <p class="text-[#02072199] text-xs md:text-sm lg:text-sm pt-2">Profile Privacy</p>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" value="" checked class="peer sr-only" />
                <div
                  class="peer flex h-8 items-center gap-6 rounded-full bg-[#baef23] px-4 text-black after:absolute after:left-1 after: after:h-6 after:w-16 after:rounded-full after:bg-[#F4ffc8]/50 after:transition-all after:content-[''] peer-checked:bg-green-900 peer-checked:after:translate-x-full peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700 text-sm peer-checked:text-white"
                >
                  <span>Public</span>
                  <span>Private</span>
                </div>
              </label>
            </div>

            <div
              class="flex justify-between lg:mx-4 px-4 shadow-md md:px-6 py-1 my-2 rounded-full border"
            >
              <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm pt-2">
                User Status
              </p>
              <div
                class="rounded-[15px] w-fit px-3 py-1 text-white text-sm capitalize flex items-center"
                :class="appUser.emailVerified ? 'bg-green-900' : 'bg-gray-500'"
              >
                <Icon
                  :icon="
                    appUser.emailVerified
                      ? 'ic:outline-mark-email-read'
                      : 'mdi:email-remove-outline'
                  "
                  width="24"
                  height="24"
                  class="me-2"
                />
                <p class="text-xs md:text-sm lg:text-sm">
                  {{ appUser.emailVerified ? 'Verified' : 'Unverified' }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-[#02072199] p-10">
            <p>No user data available</p>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>

    <Card class="px-2 py-4 mx-1 w-full rounded-xl shadow-md lg:mx-0">
      <Tabs default-value="weeshes" class="space-y-2">
        <TabsList class="w-full bg-transparent">
          <TabsTrigger value="weeshes" class="text-[#000000] data-[state=active]:border-[#baef23]">
            Weeshes
          </TabsTrigger>
          <TabsTrigger value="bank" class="text-[#000000] data-[state=active]:border-[#baef23]">
            Bank
          </TabsTrigger>
          <TabsTrigger value="support" class="text-[#000000] data-[state=active]:border-[#baef23]"
            >Support
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            class="text-[#000000] data-[state=active]:border-[#baef23]"
            @click="
              () => {
                log(_id, 1, perPage)
              }
            "
          >
            Activity log
          </TabsTrigger>
        </TabsList>
        <TabsContent value="weeshes" class="space-y-4">
          <div class="overflow-auto bg-white md:mx-4 rounded-md">
            <Table>
              <TableHeader>
                <TableRow
                  class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
                >
                  <TableHead> Name of Weesh </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <div class="flex items-center">
                      Price
                      <Icon icon="fluent:chevron-up-down-20-regular" class="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div class="flex items-center">
                      Changes
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
                  <TableCell class="font-medium">{{ user.nameofweeshes }}</TableCell>
                  <TableCell class="font-medium">{{ user.category }}</TableCell>
                  <TableCell class="font-normal text-xs">{{ user.price }} </TableCell>
                  <TableCell class="font-medium">{{ user.changes }} </TableCell>
                  <TableCell class="">
                    <!-- Render multiple status icons based on user's status array -->
                    <template v-for="status in user.status" :key="status">
                      <span
                        :class="{
                          'bg-[#6A70FF] text-[#F8F9FF]': status === 'Fulfiled',
                          'bg-[#373B4D] text-[#F8F9FF]': status === 'Added',
                          'bg-[#EE9F39] text-[#F8F9FF]': status === 'Initiated',
                          'bg-[#53eeb8] text-[#F8F9FF]': status === 'Delivered'
                        }"
                        class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                        >{{ status }}</span
                      >
                    </template>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="bank" class="space-y-4">
          <div class="overflow-auto bg-white rounded-md md:mx-6">
            <Table class="min-w-full">
              <TableHeader>
                <TableRow
                  class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
                >
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
                <TableRow v-for="user2 in user2s" :key="user2._id">
                  <TableCell class="font-medium">{{ user2.type }}</TableCell>
                  <TableCell class="font-medium">{{ user2.date }}</TableCell>
                  <TableCell class="font-normal text-xs">{{ user2.amount }} </TableCell>
                  <TableCell class="">
                    <template v-for="status in user2.status" :key="status">
                      <span
                        :class="{
                          'bg-[#53eeb8] text-[#F8F9FF]': status === 'Successful',
                          'bg-[#373B4D] text-[#F8F9FF]': status === ' Pending',
                          'bg-[#EE9F39] text-[#F8F9FF]': status === 'Failed'
                        }"
                        class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                        >{{ status }}</span
                      >
                    </template>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="support" class="space-y-4"> </TabsContent>
        <TabsContent value="activity" class="space-y-4">
          <div v-if="logError" class="text-[#02072199] p-10">
            <p>{{ logError }}</p>
          </div>
          <div v-else-if="sortItem && sortItem.length" class="relative">
            <div
              class="flex gap-2 w-11/12 flex-wrap justify-end mt-8 mr-4 items-center text-[15px]"
            >
              <Button
                variant="outline"
                class="rounded-2xl bg-[#EEEFF5]"
                @click="() => handleSort()"
              >
                <div class="flex items-center text-[10px] md:text-xs">Sort By Date</div>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
                  <Button variant="outline">
                    <div class="flex items-center text-[10px] md:text-xs">
                      Number Per Page
                      <Icon icon="ion:chevron-down-outline" class="ml-1" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="item-center justify-between">
                  <DropdownMenuCheckboxItem @click="() => handleClick(20)">
                    20
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem @click="() => handleClick(50)">
                    50
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem @click="() => handleClick(100)">
                    100
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem @click="() => handleClick(200)">
                    200
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div class="timeline">
              <div v-for="logItem in sortItem" :key="logItem.id">
                <Card class="px-4 my-2 relative ms-8 md:ms-12 xl:ms-16 w-10/12 me-4 shadow-md">
                  <CardHeader>
                    <p
                      class="rounded-[15px] w-fit px-3 py-1 bg-[#baef23] absolute z-10 -left-4 lg:-left-10 top-3.5 italic text-sm"
                    >
                      {{ dateFormat(logItem.timestamp, 'time') }}
                    </p>
                    <CardDescription>
                      <div class="mt-10">
                        <div class="lg:flex lg:justify-between">
                          <p class="text-blue-400 font-bold text-lg">{{ logItem.action }}</p>
                          <h3
                            :class="
                              logItem.status == 'SUCCESS' ? 'text-green-900' : 'text-gray-500'
                            "
                            class="font-bold text-xl italic"
                          >
                            {{ logItem.status }}
                          </h3>
                        </div>
                        <p class="mt-4 text-xs">{{ logItem.description }}</p>
                        <div class="lg:flex lg:justify-between my-2">
                          <p>
                            <span class="text-blue-400 me-2">Email :</span>
                            {{ logItem.user.extras.email }}
                          </p>
                          <p>
                            <span class="text-blue-400 me-2">Username :</span>
                            {{ logItem.user.extras.userName }}
                          </p>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <div
              class="flex gap-2 w-11/12 flex-wrap justify-end mt-8 mr-4 items-center text-[15px]"
            >
              <Pagination
                :total="pageTotal"
                :sibling-count="1"
                show-edges
                :default-page="1"
                @change="handlePageChange"
              >
                <PaginationList class="flex items-center gap-1">
                  <Button
                    class="w-10 h-10 p-0"
                    variant="outline"
                    @click="handlePageChange(1, 0)"
                    :disabled="pageCurrent === 1"
                  >
                    <Icon icon="heroicons:chevron-double-left-20-solid" />
                  </Button>
                  <Button
                    class="w-10 h-10 p-0"
                    variant="outline"
                    @click="
                      handlePageChange(perPage * (pageCurrent - 1) - (perPage - 1), pageCurrent - 2)
                    "
                    :disabled="pageCurrent === 1"
                  >
                    <Icon icon="heroicons:chevron-left-20-solid" />
                  </Button>

                  <template v-for="(item, index) in visiblePaginationItems" :key="index">
                    <PaginationListItem :value="item" as-child>
                      <Button
                        class="w-10 h-10 p-0"
                        :variant="item === pageCurrent ? 'default' : 'outline'"
                        @click="handlePageChange(perPage * item - (perPage - 1), index)"
                      >
                        {{ item }}
                      </Button>
                    </PaginationListItem>
                  </template>

                  <Button
                    class="w-10 h-10 p-0"
                    variant="outline"
                    @click="
                      handlePageChange(perPage * (pageCurrent + 1) - (perPage - 1), pageCurrent)
                    "
                    :disabled="isLastPage"
                  >
                    <Icon icon="heroicons:chevron-right-20-solid" />
                  </Button>
                  <Button
                    class="w-10 h-10 p-0"
                    variant="outline"
                    @click="
                      () => {
                        handlePageChange(
                          Math.floor(pageTotal - perPage + 1),
                          Math.ceil(pageTotal / perPage)
                        )
                      }
                    "
                    :disabled="isLastPage"
                  >
                    <Icon icon="heroicons:chevron-double-right-20-solid" />
                  </Button>
                </PaginationList>
              </Pagination>
              <p>Showing {{ pageCurrent }} of {{ Math.ceil(pageTotal / perPage) }} page(s)</p>
            </div>
          </div>
          <div v-else class="text-[#02072199] p-10">
            <p>No user log available</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  </div>
</template>

<style scoped>
.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 90%;
  background: rgb(255, 255, 255);
  background: linear-gradient(132deg, rgba(255, 255, 255, 1) 1%, rgba(186, 239, 35, 1) 58%);
  top: 3%;
  left: 5%;
}
</style>
