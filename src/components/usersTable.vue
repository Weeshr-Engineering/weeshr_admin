<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Pagination, PaginationList, PaginationListItem } from '@/components/ui/pagination'

import { ref } from 'vue'
import getUsers from '@/composables/getUsers'
import { computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'

//logic

const { users, error, totalPages, currentPage, load } = getUsers()

const appUsers = ref(users)
const errors = error

load('', 1)

const dateOfBirth = (dob: string) => {
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

  const formattedDate = `${day} - ${month} - ${year}`

  return formattedDate
}

//search
const search = ref('')

watch(search, () => {
  load(search.value, 1)
})

//filter
type SortItem = 'male' | 'female' | 'dob' | 'verified' | 'unverified' | 'all'

const order = ref<SortItem>('all')

const handleClick = (term: SortItem) => {
  order.value = term
}
const handleReset = () => {
  order.value = 'all'
  load('', 1)
}

const sortUsers = computed(() => {
  let users = [...appUsers.value]

  if (order.value === 'female') {
    users = users.filter((user) => user.gender === 'female')
  } else if (order.value === 'male') {
    users = users.filter((user) => user.gender === 'male')
  }
  if (order.value === 'verified') {
    users = users.filter((user) => user.emailVerified)
  } else if (order.value === 'unverified') {
    users = users.filter((user) => !user.emailVerified)
  }

  if (order.value === 'dob') {
    users.sort((a, b) => {
      const dateA = new Date(a.dob).getTime()
      const dateB = new Date(b.dob).getTime()
      return dateA - dateB
    })
  }
  return users
})

//pagination
const pageTotal = ref(totalPages)
const pageCurrent = ref(currentPage)

const paginationItems = computed(() => {
  const pages = []
  for (let i = 1; i <= pageTotal.value; i++) {
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

const handlePageChange = (page: number) => {
  load('', page)
}
</script>

<template>
  <div
    class="flex flex-col gap-4 md:flex-row items-center justify-between px-2 sm:px-6 py-4 w-full bg-[#FFFFFF] h-full"
  >
    <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-4 sm:mb-0">
      App Users
      <p class="text-xs sm:text-sm text-[#02072199]">List of Weeshr App Users</p>
    </div>
    <div class="items-center grid grid-cols-3 md:grid-cols-4 gap-2 flex-row">
      <DropdownMenu>
        <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
          <Button variant="outline">
            <div class="flex items-center text-[10px] md:text-xs">
              Gender
              <Icon icon="ion:chevron-down-outline" class="ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="item-center justify-between">
          <DropdownMenuCheckboxItem @click="() => handleClick('male')">
            Male
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click="() => handleClick('female')">
            Female
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" class="rounded-2xl bg-[#EEEFF5]" @click="() => handleClick('dob')">
        <div class="flex items-center text-[10px] md:text-xs">Birthday</div>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
          <Button variant="outline">
            <div class="flex items-center text-[10px] md:text-xs">
              Status
              <Icon icon="ion:chevron-down-outline" class="ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="item-center justify-between">
          <DropdownMenuCheckboxItem @click="() => handleClick('verified')">
            Verified
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem @click="() => handleClick('unverified')">
            Unverified
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        class="rounded-2xl bg-[#EEEFF5] col-span-3 md:col-span-1"
        @click="() => handleReset()"
      >
        <div class="flex items-center text-[10px] md:text-xs">
          <Icon icon="tdesign:clear" width="15" height="15" class="me-2" />
          Clear Filter
        </div>
      </Button>
    </div>
    <Search v-model="search" />
  </div>

  <div class="overflow-auto bg-white rounded-lg shadow">
    <div v-if="errors" class="text-[#02072199] p-10">
      <p>{{ errors }}</p>
    </div>
    <div v-else-if="sortUsers.length">
      <Table class="lg:w-full w-[800px]">
        <TableHeader>
          <TableRow
            class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
          >
            <TableHead> Weeshr name </TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Birthday</TableHead>
            <TableHead> Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in sortUsers" :key="user._id">
            <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.userName }} </TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm"
              >{{ user.firstName }} {{ user.middleName }} {{ user.lastName }}</TableCell
            >
            <TableCell class="text-xs md:text-sm lg:text-sm">{{ dateOfBirth(user.dob) }}</TableCell>
            <TableCell class="text-xs md:text-sm lg:text-sm">{{ user.gender }} </TableCell>
            <TableCell>
              <div
                class="rounded-[15px] w-fit px-3 py-1 text-white text-sm capitalize flex items-center"
                :class="user.emailVerified ? 'bg-green-900' : 'bg-gray-500'"
              >
                <Icon
                  :icon="
                    user.emailVerified ? 'ic:outline-mark-email-read' : 'mdi:email-remove-outline'
                  "
                  width="24"
                  height="24"
                  class="me-2"
                />
                <p class="text-xs md:text-sm lg:text-sm">
                  {{ user.emailVerified ? 'Verified' : 'Unverified' }}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <router-link :to="`/user/appuser/${user._id}`">
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
    <div v-else class="text-[#02072199] p-10">
      <p>No user data available</p>
    </div>
  </div>
  <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
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
          @click="handlePageChange(1)"
          :disabled="pageCurrent == 1"
        >
          <Icon icon="heroicons:chevron-double-left-20-solid" />
        </Button>
        <Button
          class="w-10 h-10 p-0"
          variant="outline"
          @click="() => handlePageChange(pageCurrent - 1)"
          :disabled="pageCurrent == 1"
        >
          <Icon icon="heroicons:chevron-left-20-solid" />
        </Button>

        <template v-for="(item, index) in visiblePaginationItems" :key="index">
          <PaginationListItem :value="index" as-child>
            <Button
              class="w-10 h-10 p-0"
              :variant="item === currentPage ? 'default' : 'outline'"
              @click="() => handlePageChange(item)"
            >
              {{ item }}
            </Button>
          </PaginationListItem>
        </template>

        <Button
          class="w-10 h-10 p-0"
          variant="outline"
          @click="() => handlePageChange(pageCurrent + 1)"
          :disabled="pageCurrent === pageTotal"
        >
          <Icon icon="heroicons:chevron-right-20-solid" />
        </Button>
        <Button
          class="w-10 h-10 p-0"
          variant="outline"
          @click="() => handlePageChange(pageTotal)"
          :disabled="pageCurrent === pageTotal"
        >
          <Icon icon="heroicons:chevron-double-right-20-solid" />
        </Button>
      </PaginationList>
    </Pagination>
    <p>Showing {{ currentPage }} of {{ pageTotal }} page(s)</p>
  </div>
</template>
