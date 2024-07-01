<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { ref, onMounted,  computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from "@/components/ui/button"
import { z } from 'zod';
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import axios from "axios";
import { toast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from '@iconify/vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import router from '@/router'
import { useWeeshConfigStore } from '@/stores/config-details/weeshConfig'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'

defineAbilities()
const create = ability.can('create', 'weesh-categories')
const createStyle = computed(()=>{
  return create ? 'bg-[#020721] px-4 py-2 rounded-xl w-50 h-12' : 'cursor-not-allowed opacity-20 bg-[#020721] px-4 py-2 rounded-xl w-50 h-12'
})

const edit = ability.can('update', 'weesh-categories')
const editStyle = computed(()=>{
  return edit ? 'icons-sidebar border-2 border-gray-100' : 'cursor-not-allowed opacity-20 icons-sidebar border-2 border-gray-100'
})

const deleteWeeshCategory = ability.can('delete', 'weesh-categories')
const deleteStyle = computed(()=>{
  return deleteWeeshCategory ? 'icons-sidebar text-red-600' : 'cursor-not-allowed opacity-20 icons-sidebar text-red-600'
})

const store = useWeeshConfigStore()
const loading = ref(false);
const MAX_FILE_SIZE = 1024 * 1024 * 2;
const active = computed(()=>{
  return store.active
})

const currentCategory = ref('')
const setCurrentCategory = (id: string)=>{
  verifyAbilities('update', 'weesh-categories')
  currentCategory.value= id
  console.log(id)
}

const updateImg = ref<any[]>([])
const updateName = ref('')

const handleFileUpdate = (event: any) => {
  const file = event.target.files[0];
  updateImg.value = file
}

const onUpdate = () => {  
  toast({
    title: 'Updating',
    description: `Updating Weeshe Category`,
    variant: 'default'
  })
  loading.value = true
  const stringSchema = z.string()      
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(50, { message: 'First name cannot be longer than 50 characters' })
  
  const name = stringSchema.safeParse(updateName.value)
  if (!name.success && updateImg.value.length == 0) {
        toast({
          title: 'No edit found',
          description: 'You have to make a change first',
          variant: 'destructive'
        })
        return;
  }else{
      const data = {
        'name': updateName.value,
        'image': updateImg.value
      }
      let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `https://api.staging.weeshr.com/api/v1/admin/weesh/category/${currentCategory.value}`,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        data : data
      };

      axios.request(config)
      .then((response) => {
        console.log(response.data);
        store.getWeesheCategories(store.page, `${response.data.message}`)
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
                // sessionStorage.removeItem('token')
    
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
            title: error.response.data.message || 'An error occurred',
            variant: 'destructive'
          })
        }
      });
      }
      loading.value = false
}

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name cannot be longer than 50 characters' })
      .nonempty('Please enter your first name'),
    image: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`), 
    isCash: z.string()
  })
)

const { handleSubmit: formSubmit } = useForm({
  validationSchema: formSchema
})

const img = ref<any[]>([])

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  img.value = file
}

const onSubmit = formSubmit(async (values) => {
  loading.value = true
  const data = {
    'image': img.value,
    'name': values.name,
    'isCash': values.isCash,
    'disabled': `${active.value}`
  }
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.staging.weeshr.com/api/v1/admin/weesh/category',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status === 401) {    
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
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  });
  loading.value = false
})


const token = sessionStorage.getItem('token') || ''
const categories = computed(()=>{
  return store.categories
})
const page = computed(()=>{
  return store.page
})
const currentPage = computed(()=>{
  return store.currentPage
});
const totalPages = computed(()=>{
  return store.totalPages
})


const paginationItems = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i });
  }
  return pages;
});


onMounted(async()=>{
  store.getWeesheCategories(page.value, 'Data fetched')
})
</script>

<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Weesh Categories" />
        <div class="px-10 py-10 ml-auto w-full flex justify-end">
            <Sheet>
              <SheetTrigger as-child @click="verifyAbilities('create', 'weesh-categories')">
                <button :class="createStyle">
                  <div class="text-base text-[#F8F9FF] text-center flex items-center">
                    Add New
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
              <SheetContent class="overflow-y-auto py-8" v-if="create">
                <form class="space-y-4" @submit.prevent="onSubmit">
                <div class="flex py-4 justify-between items-center">
                <SheetHeader>
                    <h3 class="text-2xl font-medium">Add New Weeshes Categories</h3>
                    
                    </SheetHeader>
                    <SheetDescription class="flex items-center gap-4">
                      Active <Switch @click="store.handleActive()" :checked="store.active"/>
                    </SheetDescription>
                </div>
                
                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="name">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Category Name</FormLabel>
                        <FormControl>
                            <Input id="name" v-bind="componentField" type="text" placeholder="Category Name" />
                        </FormControl>
                        <FormMessage for="name" />
                      </FormItem>
                    </FormField>
                  </div>
                   
                  <div class="grid w-full max-w-sm items-center gap-1.5">
                    <FormField v-slot="{ componentField }" name="image">
                      <FormItem v-auto-animate>
                        <FormLabel class="text-blue-900">Category Image</FormLabel>
                        <FormControl>
                           <input id="picture" type="file"  @change="handleFileChange" v-bind="componentField"  class="w-full h-48 border-[1px] border-gray-200 rounded-sm flex justify-center items-center" accept="image/*"/>
                        </FormControl>
                        <FormMessage for="image" />
                      </FormItem>
                    </FormField>
                  </div>
                  <FormField v-slot="{ componentField }" name="isCash">
                    <FormItem>
                      <FormLabel>Category Type</FormLabel>
                      
                        <Select
                        v-bind="componentField"
                        id="isCash"
                        class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                        <FormControl>
                          <SelectTrigger class="">
                              <SelectValue placeholder="Category type" />
                            </SelectTrigger>
                        </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Cash</SelectItem>
                            <SelectItem value="false">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      
                      <FormMessage for="isCash" />
                    </FormItem>
                  </FormField>
                  <Button type="submit" class="bg-[#4145A7] mt-2">
                    <Loader2
                      color="#ffffff"
                      v-if="loading"
                      class="w-4 h-4 mr-2 text-white animate-spin"
                    />
                    Submit
    
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
        </div>
        <div class="w-full flex justify-center">
            <div class="w-3/4">
                <div class="flex justify-end w-full text-sm text-[#6A70FF]">
                    <p>Only show active</p>
                </div>
                <div class="w-full min-h-72">
                  <Card Content class="mt-4" v-for="(category, key) in categories" :key="key">
                    <CardContent
                      class="flex items-center justify-between px-2 sm:px-4 py-4"
                    >
                      <span class="flex gap-2 items-center"><div
                        class="inline-block text-[#F8F9FF] w-14 h-14"
                      >
                        <img :src='category.image.secure_url' class="wfull h-full rounded-sm"/>
                      </div>
                      <p class="text-sm text-muted-foreground text-center text-[#000000]">
                        {{category.name}}
                      </p>
                    </span>
                    <div class="flex items-center gap-4">
                      <Switch :checked="!category.disabled" @click="store.handleSwitch(category._id, category.name, category.disabled)" :disabled="!edit"/>
                      <Sheet>
                          <SheetTrigger>
                              <Icon @click="setCurrentCategory(category._id)" icon="mdi:edit" width="17" height="17" :class="editStyle" />
                          </SheetTrigger>
                          <SheetContent class="overflow-y-auto py-8" side="right" v-if="ability.can('update', 'weesh-categories')">
                              <div class="flex py-4 justify-between items-center">
                                <SheetHeader>
                                <h3 class="text-2xl font-medium">EDIT {{category.name.toUpperCase()}} CATEGORY</h3>
                                </SheetHeader>
                              </div>
                              <form class="space-y-4" @submit.prevent="onUpdate">
                                <div class="grid w-full max-w-sm items-center gap-1.5">
                                  <FormField name="updateName">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Edit Category Name</FormLabel>
                                      <FormControl>
                                          <Input id="updateName" v-model="updateName" type="text" :placeholder="category.name" />
                                      </FormControl>
                                      <FormMessage for="updateName" />
                                    </FormItem>
                                  </FormField>
                                </div>
                                <div class="flex justify-center items-center w-full h-48">
                                  <img :src='category.image.secure_url' class="h-36 w-36 rounded-sm"/>
                                </div>
                                <div class="grid w-full max-w-sm items-center gap-1.5">
                                  <FormField v-slot="{ componentField }" name="updateImage">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Change Image</FormLabel>
                                      <FormControl>
                                        <input id="updatePicture" type="file"  @change="handleFileUpdate" v-bind="componentField" accept="image/*" class='border-[1px] border-gray-200 rounded-sm'/>
                                      </FormControl>
                                      <FormMessage for="updateImage" />
                                    </FormItem>
                                  </FormField>
                                </div>
                                <Button type="submit" class="bg-[#4145A7] mt-2">
                    
                                  <Loader2
                                    color="#ffffff"
                                    v-if="loading"
                                    class="w-4 h-4 mr-2 text-white animate-spin"
                                  />
                                  Submit
                  
                                  <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-white animate-spin" />
                                </Button>
                              </form>
                          </SheetContent>
                        </Sheet>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Icon icon="mdi:delete" width="17" height="17" :class="deleteStyle" @click="verifyAbilities('delete', 'weesh-categories')"/>
                        </AlertDialogTrigger>
                        <div>
                        <AlertDialogContent v-if="deleteWeeshCategory">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure you want to delete {{category.name}}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this role
                              and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction :onclick="()=>store.deleteWeeshCategory(category._id)">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        </div>
                      </AlertDialog>
                    </div>
                    </CardContent>
                  </Card>
                  <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]" v-if="categories.length !== 0">
                    <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="store.handlePageChange">
                      <PaginationList class="flex items-center gap-1">
                        <PaginationFirst @click="store.handlePageChange(1)" />
                        <PaginationPrev @click="store.handlePageChange(Math.max(currentPage - 1, 1))" />
                        <template v-for="(item, index) in paginationItems" :key="index">
                          <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                            <Button class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'" @click="store.handlePageChange(item.value)">
                              {{ item.value }}
                            </Button>
                          </PaginationListItem>
                          <PaginationEllipsis v-else :index="index" />
                        </template>
                        <PaginationNext @click="store.handlePageChange(Math.min(currentPage + 1, totalPages))" />
                        <PaginationLast @click="store.handlePageChange(totalPages)" />
                      </PaginationList>
                    </Pagination>
                  </div>

                </div>
              </div>
        </div>
        <DashboardFooter/>
    </div>
</template>