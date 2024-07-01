<script setup lang="ts">
import Search from '@/components/UseSearch.vue'
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useDateFormat, useNow } from '@vueuse/core'
import MainNav from '@/components/MainNav.vue'
import axios from 'axios'
import { Loader2 } from 'lucide-vue-next'
import router from '@/router'
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

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useGeneralStore } from '@/stores/general-use'

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
    phone: z.string().nonempty('Please enter your phone number'),
    admin_type: z.string().nonempty('Please select your admin_type'),
    permissions: z.string().nonempty('Please select Modular Permission')
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
  permissions: ''
})

const sheetOpen = ref(false)
const loading = ref(false)
const superAdminStore = useSuperAdminStore()
const token = sessionStorage.getItem('token') || ''

const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  const user = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.userEmail,
    gender: values.gender,
    dob: values.dob,
    phone: {
      countryCode: '+234',
      phoneNumber: values.phone
    },
    dateJoined: formattedDate.value,
    permissions: values.permissions,
    admin_type: values.admin_type
  }

  await saveUserData(user)

  sheetOpen.value = false

  // Show success toast

  // Reset form fields
  newUser.value = {
    firstName: '',
    lastName: '',
    userEmail: '',
    gender: '',
    dob: '',
    permissions: ''
  }
})

// Define a ref to hold the users data
// const users = ref([]);
const users = ref<any[]>([
  {
    _id: 1,
    firstName: 'Abiolaz',
    lastName: 'Tendo',
    admin_type: 'Super Admin',
    permissions:
      'Dashboard, Users, Weeshes, Deport, Bank,Support,Configuration,Analysics,Activity log'
  },
  {
    _id: 2,
    firstName: 'Saloni',
    lastName: 'Smith',
    admin_type: 'Admin',
    permissions: 'Dashboard, Users, Weeshes, Deport, Bank,Support,Activity log'
  },
  {
    _id: 3,
    firstName: 'Bada',
    lastName: 'Right',
    admin_type: 'Admin',
    permissions: 'Dashboard, Weeshes, Deport, Bank,Support,Configuration,Activity log'
  },
  {
    _id: 4,
    firstName: 'Emily',
    lastName: 'Stone',
    admin_type: 'Flutter',
    permissions: 'Dashboard, Weeshes, Deport, Bank,Support,Configuration,Activity log'
  },
  {
    _id: 5,
    firstName: ' Kunle',
    lastName: 'Blue',
    admin_type: 'Cxperience',
    permissions: 'Dashboard, Weeshes, Deport, Bank,Support,Configuration,Activity log'
  }
])

// Define a function to fetch users data
const fetchUsersData = async () => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  // useGeneralStore().setLoading(true)
  try {
    // Set loading to true

    const response = await axios.get(
      'https:{{host}}/administrators?search=test_admin&disabled_status=disabled',
      {
        // params: {
        //   search: 'test_admin',
        //   disabled_status: 'disabled'
        // },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status === 200 || response.status === 201) {
      useGeneralStore().setLoadingToFalse()
      // Show success toast
      toast({
        title: 'Success',
        description: `data fetched`,
        variant: 'success'
      })

      console.log('jiji' + JSON.stringify(response.data))
    }

    // Update the users data with the response

    users.value = response.data.data.data
  } catch (error: any) {
    if (error.response.status === 401) {
      sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      superAdminStore.setToken('')

      setTimeout(() => {
        router.push({ name: 'super-admin-login' })
      }, 3000)

      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to perform this action. Redirecting to home page...',
        variant: 'destructive'
      })
      // Redirect after 3 seconds
    } else {
      toast({
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  }
} // Call the fetchUsersData function when the component is mounted

// Save user data to the /administrator endpoint
const saveUserData = async (user: any) => {
  loading.value = true
  try {
    const response = await axios.post(
      'https:{{host}}/administrators?search=test_admin&disabled_status=disabled',
      user,
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
        description: `${user.firstName} User profile created successfully.`,
        variant: 'success'
      })
    }

    console.log(response.data)
    loading.value = false
    // Handle success
  } catch (err: any) {
    loading.value = false
    if (err.response.data.code === 401) {
      sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      superAdminStore.setToken('')

      setTimeout(() => {
        router.push({ name: 'super-admin-login' })
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

const toggleStatus = (user: { status: boolean }) => {
  user.status = !user.status
}

// onMounted(fetchUsersData);

onMounted(async () => {
  // useGeneralStore().setLoading(true);
  fetchUsersData()
})

const formattedDate = useDateFormat(useNow(), 'ddd, D MMM YYYY')
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] min-h-[400px] px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="wae" />
    <div class="px-10 py-10 ml-auto">
      <Sheet :close="sheetOpen">
        <SheetTrigger as-child>
          <button @click="sheetOpen = true" class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
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
        <SheetContent class="overflow-y-auto">
          <SheetHeader>
            <h3 class="text-2xl font-medium">Create User profile</h3>
            <SheetDescription>
              Add a new profile here. Click submit when you're done.
            </SheetDescription>
          </SheetHeader>
          <CardContent class="grid gap-4 pt-10">
            <form class="space-y-4" @submit="onSubmit">
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
              <div class="flex flex-row justify-between gap-2">
                <FormField v-slot="{ componentField }" name="gender" class="w-[40%]">
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <select
                      v-bind="componentField"
                      id="gender"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select a category"
                    >
                      <option value="" disabled selected hidden>Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <FormMessage for="gender" />
                  </FormItem>
                </FormField>

                <div class="w-[70%]">
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

              <FormField v-slot="{ componentField }" name="type">
                <FormItem>
                  <FormLabel>Admin Type</FormLabel>
                  <select
                    v-bind="componentField"
                    id="type"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Select Admin type"
                  >
                    <option value="" disabled selected hidden>Select Admin Type</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="cxperience">Cxperience</option>
                    <option value="flutter">Flutter</option>
                  </select>
                  <FormMessage for="gender" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="permissions">
                <FormItem>
                  <FormLabel>Modular Permissions</FormLabel>
                  <FormControl>
                    <!-- Example Checkbox Markup -->
                    <div
                      v-for="permissions in [
                        'Dashboard',
                        'Users',
                        'Weeshes',
                        'Deposit',
                        'Bank',
                        'Support',
                        'Configuration',
                        'Analytics',
                        'Log'
                      ]"
                      :key="permissions"
                      class="relative flex items-start ml-2"
                    >
                      <input
                        :id="permissions"
                        type="checkbox"
                        class="hidden peer"
                        v-bind="componentField"
                      />
                      <label
                        :for="permissions"
                        class="inline-flex items-center justify-between w-auto p-2 font-medium tracking-tight border rounded-lg cursor-pointer bg-brand-light text-brand-black border-violet-500 peer-checked:border-violet-400 peer-checked:bg-violet-700 peer-checked:text-white peer-checked:font-semibold peer-checked:decoration-brand-dark decoration-2"
                      >
                        <div class="flex items-center justify-center w-full">
                          <div class="text-sm text-brand-black">{{ permissions }}</div>
                        </div>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage for="permissions" />
                </FormItem>
              </FormField>

              <Button :disabled="loading" type="submit">
                <Loader2
                  color="#ffffff"
                  v-if="loading"
                  class="w-4 h-4 mr-2 text-black animate-spin"
                />
                Submit

                <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
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

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow
              class="text-xs sm:text-sm md:text-base text-[#02072199] font-semibold bg-gray-200"
            >
              <TableHead> Name </TableHead>
              <TableHead>Admin Type</TableHead>
              <TableHead>Modular Permission</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user._id">
              <TableCell class="font-medium">{{ user.firstName }} {{ user.lastName }}</TableCell>
              <TableCell>{{ user.admin_type }}</TableCell>

              <TableCell>
                <div class="flex flex-wrap gap-2">
                  <!-- Display each permission as a pill -->
                  <template v-for="permission in user.permissions.split(',')" :key="permission">
                    <span
                      class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-2 py-1 text-sm"
                      >{{ permission }}</span
                    >
                  </template>
                </div>
              </TableCell>
              <TableCell>
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
    </Card>
  </div>
</template>
@/stores/super-admin/super-admin@/stores/super-admin/super-admin admin
