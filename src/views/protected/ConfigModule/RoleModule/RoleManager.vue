<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Role Manager" />
        <div class="px-10 py-5 md:py-10 ml-auto w-full flex justify-end">
            <Sheet :close='sheetCLose'>
              <SheetTrigger as-child>
                <button @click="verifyAbilities('create', 'roles')" :class="createStyle">
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
               <div class="flex py-4 justify-between items-center">
                    <SheetHeader>
                    <h3 class="text-2xl font-medium">Add New Role</h3>
                    
                    </SheetHeader>
                    <SheetDescription class="pt-2 flex items-center gap-4">
                        Active <Switch :checked="true"/>
                    </SheetDescription>
                </div>
                <div>
                  <Form :validation-schema="schema" @submit="onSubmit">
                    <!-- <form class="space-y-4" @submit.prevent="onSubmit"> -->
                        <FormField v-slot="{ componentField }" name="roleName">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Name of Role</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="roleName" />
                            </FormItem>
                          </FormField>

                          <FormField v-slot="{ componentField }" name="description">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Description</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="description" />
                            </FormItem>
                          </FormField>
                  
                          <FormField  name="permissions">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Select Module Access</FormLabel>
                              <FormControl>
                                <Table>
                                  <TableHead> Name </TableHead>
                                  <TableHead>Create</TableHead>
                                  <TableHead>Read</TableHead>
                                  <TableHead>Edit</TableHead>
                                  <TableHead>Delete</TableHead>
                                    <TableBody>
                                      <TableRow v-for="(name, key) in permissions" :key="key">
                                        <TableCell>{{ key }}</TableCell>
                                        <TableCell ><span v-for="(item, keys) in permissions[key].permissions" :key="keys"><span v-if="item.tag == 'create'">
                                          <Field name="permissionList" type="checkbox" :value="item.identifier" />
                                        </span></span></TableCell>
                                        <TableCell ><span v-for="(item, keys) in permissions[key].permissions" :key="keys"><span v-if="item.tag == 'read'">
                                          <Field name="permissionList" type="checkbox" :value="item.identifier" />
                                        </span></span></TableCell>
                                        <TableCell ><span v-for="(item, keys) in permissions[key].permissions" :key="keys"><span v-if="item.tag == 'update'">
                                          <Field name="permissionList" type="checkbox" :value="item.identifier" />
                                        </span></span></TableCell>
                                        <TableCell ><span v-for="(item, keys) in permissions[key].permissions" :key="keys"><span v-if="item.tag == 'delete'">
                                          <Field name="permissionList" type="checkbox" :value="item.identifier" />
                                        </span></span></TableCell>
                                      </TableRow>
                                    </TableBody>
                                </Table>
                              </FormControl>
                            </FormItem>
                          </FormField>
                          <ErrorMessage name="permissionList" class="text-red-600 text-sm font-medium"/>
                          
                          <div class="flex justify-end items-center gap-4 mt-5"> 
                              <Button type="submit" class="bg-[#4145A7]">
                                <!-- <Loader2
                                  color="#ffffff"
                                  v-if="loading"
                                  class="w-4 h-4 mr-2 text-black animate-spin"
                                /> -->
                                Save
                
                                <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                              </Button>
                          </div>
                    </Form>
                </div>
              </SheetContent>
            </Sheet>
        </div>
        <div class="w-full flex justify-center">
            <div class="min-h-72 w-5/6">
                <div class="flex justify-end w-full text-sm text-[#6A70FF]">
                    <p>Only show active</p>
                </div>
                <Card Content class="mt-4" v-for="(item, key) in roles" :key="key">
                  <CardContent
                    class="flex items-center justify-between px-2 sm:px-6 py-4"
                  >
                  <div class="flex items-center gap-4">
                      <div
                        class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-3 py-2 text-sm"
                      >
                      {{item.name[0]}}{{ (item.name)[item.name.length-1].toUpperCase() }}
                      </div>
                      <p class="text-sm text-muted-foreground text-center text-[#000000]">
                        {{ item.name}}
                      </p>
                  </div>
                  <div class="hidden md:inline-block">
                    {{ item.description }}
                  </div>
                    <div class="flex items-center gap-4">
                      <Sheet>
                        <SheetTrigger>
                          <Icon @click="()=>handleRolePermissions(item.permissions, item.name, item._id)" icon="mdi:edit" width="17" height="17" :class="editStyle" />
                        </SheetTrigger>
                        <SheetContent class="overflow-y-auto py-8" side="right" v-if="edit">
                            <div class="flex py-4 justify-between items-center">
                              <SheetHeader>
                              <h3 class="text-2xl font-medium">{{item.name.toUpperCase()}}</h3>
                              </SheetHeader>
                              
                          </div>
                              <Form :validation-schema="editSchema" @submit="onEdit">
                                <div class="">
                                  <ErrorMessage name="permissionList" class="text-red-600 text-sm font-medium"/>
                                  <FormField v-slot="{ componentField }" name="name">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900">Edit Role Name</FormLabel>
                                      <FormControl>
                                        <Input
                                          id="text"
                                          type="text"
                                          placeholder="Edit role name"
                                          class="focus-visible:ring-blue-600"
                                          v-bind="componentField"
                                        />
                                      </FormControl>
                    
                                      <FormMessage for="roleName" />
                                    </FormItem>
                                  </FormField>
    
                                  <FormField  name="permission">
                                    <FormItem v-auto-animate>
                                      <FormLabel class="text-blue-900 text-left">Edit Module Access</FormLabel>
                                      <FormControl>
                                        <Table>
                                          <TableHead> Name </TableHead>
                                          <TableHead>Create</TableHead>
                                          <TableHead>Read</TableHead>
                                          <TableHead>Edit</TableHead>
                                          <TableHead>Delete</TableHead>
                                            <TableBody>
                                              <TableRow v-for="(name, key) in permissions" :key="key">
                                                <TableCell>{{ key }}</TableCell>
                                                <TableCell ><span v-for="(permit, keys) in permissions[key].permissions" :key="keys"><span v-if="permit.tag == 'create'">
                                                  <Field v-slot="{ field }" name="permissionArr" type="checkbox" :value="permit.identifier" :unchecked-value="!item.permissions.includes(permit.identifier)">
                                                    <input type="checkbox" @click="()=> handleChecked(permit.identifier)" :value="permit.identifier" v-if="item.permissions.includes(permit.identifier)" checked>
                                                    <input type="checkbox" v-bind="field" :value="permit.identifier" v-else>
                                                </Field>
                                                </span></span></TableCell>
                                                <TableCell ><span v-for="(permit, keys) in permissions[key].permissions" :key="keys"><span v-if="permit.tag == 'read'">
                                                  <Field v-slot="{ field }" name="permissionArr" type="checkbox" :value="permit.identifier" :unchecked-value="!item.permissions.includes(permit.identifier)">
                                                    <input type="checkbox" @click="()=> handleChecked(permit.identifier)" :value="permit.identifier" v-if="item.permissions.includes(permit.identifier)" checked>
                                                    <input type="checkbox" v-bind="field" :value="permit.identifier" v-else>
                                                  </Field>
                                                </span></span></TableCell>
                                                <TableCell ><span v-for="(permit, keys) in permissions[key].permissions" :key="keys"><span v-if="permit.tag == 'update'">
                                                  <Field v-slot="{ field }" name="permissionArr" type="checkbox" :value="permit.identifier" :unchecked-value="!item.permissions.includes(permit.identifier)">
                                                    <input type="checkbox" @click="()=> handleChecked(permit.identifier)" :value="permit.identifier" v-if="item.permissions.includes(permit.identifier)" checked>
                                                    <input type="checkbox" v-bind="field" :value="permit.identifier" v-else>
                                                  </Field>
                                                </span></span></TableCell>
                                                <TableCell ><span v-for="(permit, keys) in permissions[key].permissions" :key="keys"><span v-if="permit.tag == 'delete'">
                                                  <Field v-slot="{ field }" name="permissionArr" type="checkbox" :value="permit.identifier" :unchecked-value="!item.permissions.includes(permit.identifier)">
                                                    <input type="checkbox" @click="()=> handleChecked(permit.identifier)" :value="permit.identifier" v-if="item.permissions.includes(permit.identifier)" checked>
                                                    <input type="checkbox" v-bind="field" :value="permit.identifier" v-else>
                                                  </Field>
                                                </span></span></TableCell>
                                              </TableRow>
                                            </TableBody>
                                        </Table>
                                      </FormControl>
                                    </FormItem>
                                  </FormField>
                                  <ErrorMessage name="permissionList" class="text-red-600 text-sm font-medium"/>
                                </div>
                                <Button type="submit" class="bg-[#4145A7] mt-2"> Update Role</Button>
                              </Form>
                        </SheetContent>
                      </Sheet>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Icon icon="mdi:delete" width="17" height="17" :class="deleteStyle" @click="verifyAbilities('delete', 'roles')"/>
                        </AlertDialogTrigger>
                        <div>
                        <AlertDialogContent v-if="deleteRoles">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure you want to delete {{item.name}}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this role
                              and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction :onclick="()=>deleteRole(item._id)">Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        </div>
                      </AlertDialog>
                    </div>

                  </CardContent>
                </Card>
              </div>
        </div>
        <DashboardFooter/>
    </div>
</template>

<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from "@/components/ui/button"
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

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoleStore } from '@/stores/config-details/roleManager'
import { toTypedSchema } from '@vee-validate/zod'
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as z from 'zod'
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead
} from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability'

defineAbilities()
const create = ability.can('create', 'admins')
const createStyle = computed(()=>{
  return create ? 'bg-[#020721] px-4 py-2 rounded-xl w-50 h-12' : 'cursor-not-allowed opacity-20 bg-[#020721] px-4 py-2 rounded-xl w-50 h-12'
})

const edit = ability.can('update', 'admins')
const editStyle = computed(()=>{
  return edit ? 'icons-sidebar border-2 border-gray-100' : 'cursor-not-allowed opacity-20 icons-sidebar border-2 border-gray-100'
})

const deleteRoles = ability.can('delete', 'admins')
const deleteStyle = computed(()=>{
  return deleteRoles ? 'icons-sidebar text-red-600' : 'cursor-not-allowed opacity-20 icons-sidebar text-red-600'
})

const store = useRoleStore()
store.getPermissions()

const schema = toTypedSchema(
  z.object({
    roleName: z.string().nonempty('Please add a Name'),
    description: z.string().nonempty('Add description'),
    permissionList: z.array(z.string()),
  })
)

const deleteRole = async (id:string)=>{
  await store.deleteRole(id)
}
const onSubmit=async (values:any)=> {
  console.log(JSON.stringify(values, null, 2));
  const data = JSON.stringify({
    'name': values.roleName,
    'description': values.description,
    'permissions': values.permissionList
  })
  await store.createRole(data)
}

const editSchema = toTypedSchema(
  z.object({
    name: z.string().nonempty('Please add a Name').optional(),
    permissionArr: z.array(z.string()).nonempty('Select at least one permission').optional(),
  })
)

const roles = computed(()=>{
  return store.roles
})
const permissions = computed(()=>{
  return store.permissions
})
const allPermissions = ref<any[]>([])
const rolePermissions = ref<any[]>([])
const roleName = ref('')
const modified = ref(false)
const roleId = ref('')

const handleRolePermissions=(arr: any[], name: string, id: string)=>{
  verifyAbilities('update', 'roles')
  modified.value = false
  rolePermissions.value = arr
  roleName.value = name
  roleId.value = id
}

const onEdit= async (values:any)=> {
  let arr: any[]
  let name: string

  if(values.permissionArr){
    const combinedArray = [...rolePermissions.value, ...values.permissionArr];
    modified.value = true
  
    // Use a Set to ensure all elements are unique
    arr = [...new Set(combinedArray)];
  } else {
    arr = rolePermissions.value
  }
  // console.log(arr)
  if(values.name){
    name = values.name
  }else{
    name = roleName.value
  }
  if(name == roleName.value && modified.value == false){
    console.log(arr)
    toast({
      title: 'No edit found',
      description: 'You have to make a change first',
      variant: 'destructive'
    })
  }else{
    const data = JSON.stringify({
    'name': name,
    'permissions': arr
  })
  store.updateRole(data, roleId.value)
  }
}

const handleChecked = (val: string)=>{
  const index = rolePermissions.value.indexOf(val);
  
  if (index === -1) {
    // If the string is not found, add it to the array
    rolePermissions.value.push(val);
  } else {
    // If the string is found, remove it from the array
    rolePermissions.value.splice(index, 1);
  }
  modified.value = true
}

const sheetCLose = ref(true)

onMounted(async()=>{
    await store.getRoles('Roles found')
    allPermissions.value = await useRoleStore().allPermissions()
})
</script>