<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import axios from 'axios'
import { useRoute } from 'vue-router';
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useAdminListStore } from '@/stores/admin-list/admin-list'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from "@/components/ui/button"
import * as z from 'zod'
import router from '@/router'
import CountryCodes from '@/lib/CountryCodes'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'

defineAbilities()

const edit = ability.can('update', 'admins')
const editStyle = computed(()=>{
  return edit ? 'flex' : 'flex cursor-not-allowed opacity-20'
})

const deleteAdmin = ability.can('delete', 'admins')
const deleteStyle = computed(()=>{
  return deleteAdmin ? 'flex' : 'cursor-not-allowed opacity-20 flex'
})

const route = useRoute();
const id = route.params.Id;
const superAdminStore = useSuperAdminStore()
const token = sessionStorage.getItem('token') || ''
const user = ref<any>({})
const dobFormat = ref('')
const loading = ref(false)
const adminListStore = useAdminListStore()
const roleLoading = ref(false)
const roles = ref<any[]>([])
const defaultRole = ref<any[]>([])

// Define a function to fetch users data
const fetchUsersData = async (msg: string) => {
  adminListStore.setDetailLoading(false)
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  
  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(
      `https://api.staging.weeshr.com/api/v1/admin/administrator/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      // console.log(response.data.data)
      const responseData = response.data.data[0]
      const phoneData = response.data.data[0].phoneNumber.normalizedNumber
      dobFormat.value = formatDate(response.data.data[0].dob)
      const data = {...responseData, phone:phoneData}
      // fill user data with response data
      user.value = data
      defaultRole.value  = await getAllIds(responseData.roles)
      // console.log(defaultRole.value)
      // console.log(user.value)
      adminListStore.setAdminStatus(responseData.disabled)
      // Show success toast
      toast({
        title: 'Success',
        description: `${data.firstName} ${msg}`,
        variant: 'success'
      })
    }
    adminListStore.setDetailLoading(false)
    // set Loading to false
    // useGeneralStore().setLoading(false)
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

// Function to get all _id values
const getAllIds = async (roles: any[]) => {
  return roles.map(role => role._id);
}

function formatDate(inputDate: string) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dateObj = new Date(inputDate);
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();

    return `${month} ${day}`;
}

const editProfile = async (values: any) => {
  const adminProfile = JSON.stringify({
    'firstName': values.firstName || user.value.firstName,
    'lastName': values.lastName || user.value.lastName,
    'gender': values.gender || user.value.gender,
    'email': values.email || user.value.email,
    'dob': values.dob && values.dob.substring(0, 10) || user.value.dob.substring(0, 10),
    'phone': {
      countryCode: values.countrycode  || user.value.phoneNumber.countryCode,
      'phoneNumber': values.phone || user.value.phoneNumber.phoneNumber
    },
    "disabled": adminListStore.adminStatus
  })
  console.log(adminProfile)
let config = {
  method: 'patch',
  maxBodyLength: Infinity,
  url: `https://api.staging.weeshr.com/api/v1/admin/administrator/${id}`,
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}`
  },
  data : adminProfile
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  fetchUsersData('data updated')
})
.catch((error) => {
  console.log(error);
});

}

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
      // console.log(response.data.data.data)
      roles.value = response.data.data.data.reverse()
      // fetchUsersData()
    }
  } catch (err: any) {
    // adminListStore.loadingControl(false)
    if (err.response.data.code === 401) {
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

const updateRole = async (roleId: string)=>{
  roleLoading.value = true
  console.log(roleId)
  const adminRole = await modifyArrayValue(defaultRole.value, roleId)
  let data = JSON.stringify({
  "roles": adminRole
});


console.log(data)
let config = {
  method: 'patch',
  maxBodyLength: Infinity,
  url: `https://api.staging.weeshr.com/api/v1/admin/administrator/${id}/roles`,
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}`
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  toast({
        title: 'Success',
        description: `${user.value.firstName}' s role is updated...'`,
        variant: 'success'
      })
})
.catch((error) => {
  console.log(error);
  toast({
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
      fetchUsersData('')
});
roleLoading.value = false
}

const modifyArrayValue= async (arr: any[], value: string)=> {
    const index = arr.indexOf(value);
    if (index !== -1) {
        // Value is present, remove it
        arr.splice(index, 1);
    } else {
        // Value is not present, add it
        arr.push(value);
    }
    return arr;
}

// const containsTargetId: boolean = (role: any, val: string)=>{
//   role.some((obj: any) =>
//   Object.values(obj).some((innerObj: any) => innerObj._id === val)
// );
// }
// fetch data on mount
onMounted(() => {
  fetchUsersData('data fetched')
  getRoles()
})

const contactFormSchema = toTypedSchema(z.object({
      firstName: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }).optional(),
    lastName: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }).optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    phone: z.string().min(10, { message: 'Phone number must be 10 characters' }).max(10, { message: 'Phone number must be 10 characters' }).optional(),
    countrycode: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
}))

const { handleSubmit: contactForm } = useForm({
  validationSchema: contactFormSchema
})

// console.log(contactForm((values)=>{return values}))
const onSubmit = contactForm((values) => {
  function valueChecker<T extends Record<string, any>>(obj: T): boolean {
  return Object.values(obj).some(value => value !== undefined);
}
  if(valueChecker(values)){
    editProfile(values)  
  }else{
    toast({
        title: 'Form Input Is Empty',
        description: `Make a change: There is nothing to update`,
        variant: 'destructive'
      })
  }
})


// function getAllIds(roles: any): any[] | PromiseLike<any[]> {
//   throw new Error('Function not implemented.')
// } 
</script>
<template>
  <div class="container lg:px-0 mx-auto">
    <div class="flex-col lg:flex lg:flex-row gap-1">
      <Card
      class="sm:col-span-3 md:col-span-3 bg-[#F8F9FF] sm:items-center shadow-xl lg:min-w-[398px]"
      >
        <CardHeader>
          <CardTitle class="text-2xl font-bold text-[#000000] my-4">{{ user.firstName }} Profile</CardTitle>
          <CardDescription>
            <img
              v-if="user.avatar"
              class=""
              :src="user.avatar"
              alt="User Profile Image"
            />
            <div class="flex justify-between px-2 pr-6 my-2">
              <span class="font-semibold text-base text-[#020721]">Identity</span>
              
                <Popover>
                  <PopoverTrigger>
                    <div :class="editStyle" @click="verifyAbilities('update', 'admins')">
                      <img
                        class="max-w-[18.05px] max-h-[24px]"
                        src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                        alt="gradient"
                      />
                      <span class="text-sm font-medium text-[#02072199]">
                        <p>Edit</p>
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent v-if="edit">
                      <form class="space-y-8" @submit="onSubmit">
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
                        <div class="flex flex-row justify-between gap-2">
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
          
                          <div class="">
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
                        <Button type="submit">
                          <Loader2
                            color="#ffffff"
                            v-if="loading"
                            class="w-4 h-4 mr-2 text-black animate-spin"
                          />
                          Update
                          <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                        </Button>
                        </form>
                  </PopoverContent>
                </Popover>
            </div>

            <Card class="rounded-md">
              <div class="flex min-w-62 justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">First Name</p>
                <p class="text-xs text-left md:text-sm lg:text-sm text-[#020721]">{{user.firstName}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Last Name</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.lastName}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Handle</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.handle}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Role</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.role}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Birthday</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{dobFormat}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b" v-if="user.middleName">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Handle</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.middleName}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Gender</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.gender}}</p>
              </div>
              <div class="flex justify-between px-6 md:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Joined</p>
                <p class="text-xs md:text-sm text-left lg:text-sm text-[#020721]">3 Aug 2023</p>
              </div>
            </Card>

            <div class="flex justify-between px-2 pr-6 my-2">
              <span class="font-semibold text-base text-[#020721]">Contact</span>
                
                <Popover>
                  <PopoverTrigger>
                    <div :class="deleteStyle" @click="verifyAbilities('update', 'admins')">
                      <img
                        class="max-w-[18.05px] max-h-[24px]"
                        src="https://res.cloudinary.com/dufimctfc/image/upload/v1714310908/edit-4-svgrepo-com_1_iy2nwu.svg"
                        alt="gradient"
                      />
                      <span class="text-sm font-medium text-[#02072199]">
                        <p>Edit</p>
                      </span>
                  </div>
                  </PopoverTrigger>
                  <PopoverContent v-if="deleteAdmin">  
                    <form class="space-y-4" @submit.prevent="onSubmit">
                      <div class="">
                        <h5 class='text-blue-900 text-sm font-medium mb-5'>Phone Number</h5>
                        <div class='flex items-start flex-row md:justify-between md:items-start gap-2 relative'>
                          <FormField v-slot="{ componentField }" name="countrycode" class="bg-[teal] mt-6 w-[50%]">
                            <FormItem>
                              <!-- <FormLabel>
                                <span class="hidden md:inline-block">Country Code</span><span class="md:hidden inline-block">CC</span>
                              </FormLabel> -->
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
                                    <!-- <SelectItem value="Male">+44</SelectItem> -->
                                  </SelectContent>
                                </Select>
                              
                              <FormMessage for="countrycode" />
                            </FormItem>
                          </FormField>
                          <div class='lg:w-[70%]'>
                            <FormField v-slot="{ componentField }" name="phone" class='lg:w-[70%]'>
                              <FormItem v-auto-animate>
                                <!-- <FormLabel class="text-blue-900">Phone Number</FormLabel> -->
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

                        <FormField v-slot="{ componentField }" name="email">
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
          
                        <Button type="submit">
                          <Loader2
                            color="#ffffff"
                            v-if="loading"
                            class="w-4 h-4 mr-2 text-black animate-spin"
                          />
                          Update
                          <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                        </Button>
                      </form>
                  </PopoverContent>
                </Popover>
            </div>

            <Card class="rounded-md">
              <div class="flex justify-between px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Email</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.email}}</p>
              </div>
              <div class="flex justify-between px-6 lg:px-6 py-2 border-b">
                <p class="text-[#02072199] text-xs md:text-sm lg:text-sm">Phone no.</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">{{user.phone}}</p>
              </div>
              <div class="flex justify-between px-6 lg:px-6 py-2 border-b">
                <p class="flex grow text-[#02072199] text-xs md:text-sm lg:text-sm">Address:</p>
                <p class="text-xs md:text-sm lg:text-sm text-[#020721]">
                  {{user.address}}
                </p>
              </div>
            </Card>

            <div class="w-full px-2 pr-6 my-2">
              <span class="font-semibold text-base text-[#020721]">Status</span>
            </div>

            <Card class="bg-[#F8F9FF] flex justify-between">
              <CardHeader><span v-if="!adminListStore.detailLoading">{{ adminListStore.adminStatus ? 'Disabled' : 'Active' }}</span>
                <Loader2 v-else class="w-4 h-4 mr-2 text-black animate-spin" />
              </CardHeader>
              
              <CardContent
                class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-4"
              >
                <Switch
                v-if="!adminListStore.detailLoading"
                v-bind:checked="!adminListStore.adminStatus"
                :onclick="()=>adminListStore.toggleStatus(user._id, adminListStore.adminStatus, user.firstName)"
                :disabled="!edit"
                />
                <Loader2 v-else class="w-4 h-4 mr-2 text-black animate-spin" />
              </CardContent>
            </Card>
          </CardDescription>
        </CardHeader>
      </Card>

      <div class="my-9 lg:px-6 lg:w-4/5">
        <Tabs default-value="role" class="space-y-1">
          <TabsList
          class="border-[#DEDFE8] bg-transparent lg:w-[560px] lg:flex lg:justify-between px-0 lg:px-6 md:px-6 py-2"
          >
            <TabsTrigger value="role"> Role Permissions </TabsTrigger>
            <TabsTrigger value="activity" disabled> Activity log </TabsTrigger>
          </TabsList>
          <TabsContent value="role">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription class="fle justify-between items-center">
                  <div>Assign roles to {{user.firstName}}</div>
                  <Loader2 v-if="roleLoading" class="w-4 h-4 mr-2 text-black animate-spin" />
                </CardDescription>
              </CardHeader>
              <!-- <span v-if="ability.can('update', 'admins')"> -->
                <CardContent class="flex items-center justify-between px-2 sm:px-6 py-4 max-h-16" v-for="(role, id) in roles" :key=id>
                  <div class="flex items-center gap-4">
                        <div class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-3 py-2 text-sm">
                        {{role.name[0]}}{{ (role.name)[role.name.length-1].toUpperCase() }}
                        </div>
                        <p class="text-sm text-muted-foreground text-center text-[#000000]">
                          {{ role.name}}
                        </p>
                  </div>
                  <div class="hidden md:inline-block">
                      {{ role.description }}
                  </div>
                  <div class="flex items-center gap-4">
                    <Switch @click="()=>updateRole(role._id)" :checked="defaultRole.includes(role._id) ? true : false" :disabled="!ability.can('update', 'admins')"/>
                  </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>
