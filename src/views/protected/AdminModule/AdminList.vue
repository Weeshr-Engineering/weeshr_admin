<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref, onMounted, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useDateFormat, useNow } from '@vueuse/core'
import MainNav from '@/components/MainNav.vue'
import axios from 'axios'
import { Loader2 } from 'lucide-vue-next'
import router from '@/router'
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
// import { Icon } from '@iconify/vue'
import CountryCodes from '@/lib/CountryCodes'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'

import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { useAdminListStore } from '@/stores/admin-list/admin-list'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'

defineAbilities()
const create = ability.can('create', 'admins')
const createStyle = computed(()=>{
  return create ? 'bg-[#020721] px-4 py-2 rounded-xl w-50 h-12' : 'bg-[#020721] cursor-not-allowed opacity-20 px-4 py-2 rounded-xl w-50 h-12'
})
const formSchema = toTypedSchema(
  z.object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name cannot be longer than 50 characters' })
      .nonempty('Please enter your first name'),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters long' })
      .max(50, { message: 'Last name cannot be longer than 50 characters' })
      .nonempty('Please enter your last name'),
    userEmail: z.string().email('Please enter a valid email address'),
    dob: z.string().nonempty('Please enter your date of birth'),
    gender: z.string().nonempty('Please select your gender'),
    phone: z.string().nonempty('Please enter your phone number').min(10, { message: 'Phone number must be 10 characters' }).max(10, { message: 'Phone number must be 10 characters' }).optional(),
    status: z.boolean().optional(),
    countrycode: z.string().optional(),
    roles: z.string().nonempty('Assign a role'),
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema
})

const newUser = ref({
  firstName: '',
  userEmail: '',
  lastName: '',
  gender: '',
  dob: '',
  phone: '',
})

const adminListStore = useAdminListStore()
adminListStore.fetchUsersData()
const sheetOpen = adminListStore.sheetOpen
const loading = ref(false)
const token = sessionStorage.getItem('token') || ''

const onSubmit = handleSubmit(async (values) => {
  adminListStore.loadingControl(true)
  loading.value = true
  const user = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.userEmail,
    gender: values.gender,
    dob: values.dob,
    phone: {
      countryCode: values.countrycode  || '+234',
      phoneNumber: values.phone
    },
    dateJoined: formattedDate.value,
    disabled: values.status || false,
    roles: [values.roles]
  }

  // console.log(user)
  await adminListStore.saveUserData(user)
  loading.value = false
  // sheetOpen = false
  adminListStore.sheetControl(false)

  // Show success toast

  // Reset form fields
  newUser.value = {
    firstName: '',
    lastName: '',
    userEmail: '',
    gender: '',
    dob: '',
    phone: '',
  }
})

// Define a ref to hold the users data
const users = computed(()=>{
  return adminListStore.users
})
const roles = ref<any[]>([])

// define a ref to hold user status
// const userStatus = ref<any>();
// const perPage = ref(0);
const currentPage = computed(()=>{
  return adminListStore.currentPage
});
const totalPages = computed(()=>{
  return adminListStore.totalPages
})

const paginationItems = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i });
  }
  return pages;
});

// onMounted(fetchUsersData);
const getRoles = async ()=>{
  try {
    const response = await axios.get(
      'https://api.staging.weeshr.com/api/v1/admin/roles',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Check if response status is 200 or 201
    if (response.status === 200 || response.status === 201) {
      // Show success toast
      toast({
        title: 'Success',
        description: `Roles fetched successfully.`,
        variant: 'success'
      })
      roles.value = response.data.data.data
      // fetchUsersData()
    }
    // createUserStore.addUser(user)
    // adminListStore.loadingControl(false)
    // Handle success
  } catch (err: any) {
    // adminListStore.loadingControl(false)
    if (err.response.data.code === 401) {
      // sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      // superAdminStore.setToken('')

      setTimeout(() => {
        router.push({ name: 'home' })
      }, 3000)

      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to perform this action. Redirecting to home page...',
        variant: 'destructive'
      })
      // Redirect after 3 seconds
    } else {
      toast({
        title: err.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
    // Handle other errors
  }
}
onMounted(async () => {
  // useGeneralStore().setLoading(true);
  // fetchUsersData()
  // adminListStore?.fetchUsersData()
  getRoles()
})

const formattedDate = useDateFormat(useNow(), 'ddd, D MMM YYYY')
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] min-h-[400px] px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Admin List" />
    <div class="px-10 py-10 ml-auto">
      <Sheet>
        <SheetTrigger as-child>
          <button @click="verifyAbilities('create', 'admins')"  :class='createStyle'>
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Add New Admin
              <svg
                width="20"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="ml-6"
              >
                <path
                  d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z"
                  fill="#F8F9FF"
                />
              </svg>
            </div>
          </button>
        </SheetTrigger>
        <SheetContent class="overflow-y-auto" v-if="ability.can('create', 'admins')">
          <SheetHeader>
            <h3 class="text-2xl font-medium">Create User profile</h3>
            <SheetDescription>
              Add a new profile here. Click submit when you're done.
            </SheetDescription>
          </SheetHeader>
          <CardContent class="grid gap-4 pt-10">
            <form class="space-y-4" @submit.prevent="onSubmit">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">First Name</FormLabel>
                  <FormControl>
                    <Input
                      id="text"
                      type="text"
                      placeholder="First Name"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>

                  <FormMessage for="firstName" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      id="text"
                      type="text"
                      placeholder="Last Name"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>

                  <FormMessage for="lastName" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="userEmail">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="weeshr@admin.com"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </FormField>
              <div class="flex flex-row justify-between gap-2 max-w-full">
                <div class="min-w-[35%]">
                  <FormField v-slot="{ componentField }" name="gender">
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      
                        <Select
                        v-bind="componentField"
                        id="gender"
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                        <FormControl>
                          <SelectTrigger class="">
                              <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                        </FormControl>
                          <SelectContent>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                          </SelectContent>
                        </Select>
                      
                      <FormMessage for="gender" />
                    </FormItem>
                  </FormField>
                </div>

                <div class="lg:w-[70%]">
                  <FormField v-slot="{ componentField }" name="dob">
                    <FormItem v-auto-animate>
                      <FormLabel class="text-blue-900">Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          id="dob"
                          type="date"
                          placeholder="Date of Birth"
                          class="focus-visible:ring-blue-600"
                          v-bind="componentField"
                        />
                      </FormControl>

                      <FormMessage for="dob" />
                    </FormItem>
                  </FormField>
                </div>
              </div>
              <div class="">
                <h5 class='text-blue-900 text-sm font-medium mb-3'>Phone Number</h5>
                <div class='flex flex-row md:justify-between md:items-start gap-2 relative'>
                  <div class="min-w-[35%]">
                    <FormField v-slot="{ componentField }" name="countrycode">
                      <FormItem>
                          <Select
                          v-bind="componentField"
                          id="gender"
                          class='bg-gray-50 w-auto mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'>
                          <FormControl>
                            <SelectTrigger class="">
                                <SelectValue placeholder="+234" />
                              </SelectTrigger>
                          </FormControl>
                            <SelectContent>
                              <SelectItem v-for="(code, key ) in CountryCodes" :value="code.dial_code" :key="key" class='flex justify-center items-center gap-2'>
                                {{code.dial_code}} 
                                <img
                                class="w-[18px] h-[18px] hidden md:inline-block"
                                :src="'https://flagcdn.com/16x12/'+code.code.toLowerCase()+'.png'"
                                alt="gradient"/>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        
                        <FormMessage for="countrycode" />
                      </FormItem>
                    </FormField>
                  </div>
                  <div class='lg:w-[70%]'>
                    <FormField v-slot="{ componentField }" name="phone">
                      <FormItem v-auto-animate>
                        <FormControl>
                          <div>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Phone Number"
                              class="focus-visible:ring-blue-600"
                              v-bind="componentField"
                            />
                          </div>
                        </FormControl>
      
                        <FormMessage for="phone" />
                      </FormItem>
                    </FormField>
                  </div>
                </div>
              </div>
              
              <FormField v-slot="{ componentField }" name="roles">
                <FormItem>
                  <FormLabel>Admin Type</FormLabel>
                  
                    <Select
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    v-bind="componentField"
                    id="type">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select Admin Type" />
                      </SelectTrigger>
                    </FormControl>
                      <SelectContent>
                        <SelectItem v-for="(role, key) in roles" :key=key :value="role._id">{{role.name}}</SelectItem>
                      </SelectContent>
                  </Select>
                  <FormMessage for="gender" />
                </FormItem>
              </FormField>

              <Button type="submit">
                <Loader2
                  color="#ffffff"
                  v-if="loading"
                  class="w-4 h-4 mr-2 text-white animate-spin"
                />
                Submit

                <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
              </Button>
            </form>
          </CardContent>
        </SheetContent>
      </Sheet>
    </div>

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="text-2xl font-bold tracking-tight text-[#020721]">
          Admin
          <p class="text-xs text-[#02072199] py-2">List of Weehr Admin</p>
        </div>
        <div class="flex flex-col"></div>
        <Search />
      </div>

      <div class="overflow-auto min-h-52 bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead> Name </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Modular Permission</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user._id">
              <TableCell class="font-medium">{{ user.firstName }} {{ user.lastName }}</TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell>{{ user.gender }}</TableCell>
              <TableCell>{{user.phoneNumber.normalizedNumber}}</TableCell>
              <TableCell>
                <Badge
                  :class="{ 'bg-[#00C37F]': !user.disabled, 'bg-[#020721]': user.disabled }">
                  {{ user.disabled ? 'Disabled' : 'Active' }}
              </Badge>
              </TableCell>
              <TableCell>
                <div class="flex flex-wrap gap-2">
                    <span
                      class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                      >Dashboard</span>
                </div>
              </TableCell>
              <TableCell v-if="ability.can('read', 'admins')">
                <router-link :to="`/admindetails/${user._id}`">
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
        <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="adminListStore.handlePageChange">
          <PaginationList class="flex items-center gap-1">
            <PaginationFirst @click="adminListStore.handlePageChange(1)" />
            <PaginationPrev @click="adminListStore.handlePageChange(Math.max(currentPage - 1, 1))" />
            <template v-for="(item, index) in paginationItems" :key="index">
              <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                <Button class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'" @click="adminListStore.handlePageChange(item.value)">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :index="index" />
            </template>
            <PaginationNext @click="adminListStore.handlePageChange(Math.min(currentPage + 1, totalPages))" />
            <PaginationLast @click="adminListStore.handlePageChange(totalPages)" />
          </PaginationList>
        </Pagination>
      </div>
    </Card>
  </div>
</template>