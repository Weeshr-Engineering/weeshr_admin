<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { Button } from '@/components/ui/button'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import router from '@/router'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import axios from 'axios'
// import { ability } from '@/lib/ability'
// import { useAbilityStore } from '@/stores/permissions/permission-store'

// import { useAbilityStore } from '@/stores/permissions/permission-store'
// const ability = useAbilityStore().ability
// const updateAbility = useAbilityStore().updateAbility


// console.log(ability.can('rea', 'Post') )// true)
// console.log(ability.can('delete', 'Post')) // true)
// setTimeout(()=>{
//   // ability.update({'delete': 'Post'})
//   // ability.update([]);
//   ability.update([ // switch to readonly mode
//   { action: 'rea', subject: 'Post' }
// ]);
//   setTimeout(()=>{
//     console.log(ability.can('rea', 'Post') )// true)
//   }, 3000)
// }, 3000)
const currentYear = ref(new Date().getFullYear())

const updateYear = () => {
  currentYear.value = new Date().getFullYear()
}

const superAdminStore = useSuperAdminStore()

onMounted(() => {
  updateYear()
  setInterval(updateYear, 1000 * 60 * 60 * 24 * 30) // Update the year once a month

  // Choose a random index for variety
  const randomIndex = Math.floor(Math.random() * quotes.length)

  // Set the data properties
  quote.value = quotes[randomIndex]
  author.value = authors[randomIndex]
})

const loading = ref(false)

const quotes = [
  'Weehr App turns my ordinary moments into extraordinary 🌟 memories...',
  'Experiencing pure joy is just a 🎉 tap away with Weehr App...',
  'Weehr App has redefined the art of wish fulfillment, making 🎂 dreams come true effortlessly...',
  "Navigating life's wishes is a 🎁 breeze, thanks to the intuitive Weehr App...",
  "Every 🌈 wish feels like pure magic, courtesy of Weehr App's innovation and simplicity..."
]

const authors = ['Chloe Thompson', 'Mason Carter', 'Isabella Scott', 'Noah Adams', 'Ava Miller']

const quote = ref<string>('')
const author = ref<string>('')

const formSchema = toTypedSchema(
  z.object({
    userEmail: z
      .string({
        required_error: 'Please enter a valid email'
      })
      .email(),

    password: z
      .string({
        required_error: 'Please enter your password '
      })
      .min(9)
  })
)

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit(async () => {
  loading.value = true

  // Ensure userEmail and password have values
  if (form.values.userEmail && form.values.password) {
    const { userEmail, password } = form.values

    console.log(userEmail, password)

    // Set the username and password in the store
    superAdminStore.setuserEmail(userEmail)
    superAdminStore.setPassword(password)

    try {
      console.log('userEmail', userEmail)

      const response = await axios.post('https://api.staging.weeshr.com/api/v1/admin/login', {
        email: userEmail,
        password: password
      })

      // Check if the token property exists in the response
      if (response.data.data && response.data.data.user && response.data.data.user.token) {
        // Access the data from the response data
        // token
        const token = response.data.data.user.token
        //  firstname
        const firstName = response.data.data.user.firstName
        // lastname
        const lastName = response.data.data.user.lastName
        // email
        const userEmail = response.data.data.user.email

        // save basic user data to local storage
        superAdminStore.setLocalStorage(firstName, lastName, userEmail)
        // save user email
        superAdminStore.setuserEmail(userEmail)
        // Save the token in Pinia store
        superAdminStore.setToken(token)
        sessionStorage.setItem('permissions', JSON.stringify(response.data.data.user.permissions))
        // console.log(response.data)
        // const permissions = modPermissions(response.data.data.user.permissions)
        // ability.update(permissions)
        // updateAbility(permissions)
        // useAbilityStore().permissions = permissions

        // Save the token in sessionStorage

        router.push({ name: 'home' })
      } else {
        router.push({ name: 'superAdmin-login' })
      }

      // Redirect to home page after successful login
    } catch (error: any) {
      loading.value = false
      // Handle login errors, such as displaying error messages to the user
      toast({
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  } else {
    // Handle the case when form fields are empty
    toast({
      title: 'Please enter your username/email and password.',
      variant: 'destructive'
    })
    loading.value = false
  }
})
</script>

<template>
  <div
    class="bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1710591674/kimcfu0uld547xavvpkn.png')] bg-cover relative"
  >
    <div
      class="container flex flex-col items-center justify-center w-full h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <img
        class="absolute bottom-0 h-[640px] w-fit absoluteImg"
        src="https://res.cloudinary.com/drykej1am/image/upload/v1710588213/gljbojydunbpercw3cqx.png"
        alt="gradient"
      />

      <div
        class="relative flex-col hidden h-full p-10 pb-0 text-white bg-center bg-no-repeat bg-cover lg:flex"
      >
        <img
          class="hidden lg:block absolute bottom-0 h-[280px] w-auto transform left-1/2 -translate-x-[50%]"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1710592164/weeshr_admin/loginPage/cpv0br6dhygp8nyqzyeh.svg"
          alt="gradient"
        />

        <div class="inset-0 flex items-center justify-center w-full h-full text-center -left-[20%]">
          <div
            aria-current="page"
            class="flex items-center -translate-y-[145px] flex-col justify-center space-y-2"
          >
            <h4 class="text-[#F8F9FFB2] tracking-widest">THE</h4>
            <img
              class="w-auto h-24"
              src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
              alt=""
            />
            <h4 class="text-[#F8F9FFB2] tracking-widest">SUPER ADMIN FACTORY</h4>
          </div>

          <div class="absolute w-[80%] z-20 mt-auto bottom-[300px] text-white">
            <blockquote class="space-y-2">
              <p class="text-lg text-left">
                {{ quote }}
              </p>
              <footer class="text-sm text-end">
                {{ author }}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
      <div class="flex justify-center w-full lg:p-8">
        <div class="w-full max-w-sm lg:p-8">
          <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div class="flex flex-col space-y-2 text-center">
              <div
                aria-current="page"
                class="flex lg:hidden justify-center -translate-y-[60px] flex-col space-y-2"
              >
                <h4 class="text-[#F8F9FFB2] tracking-widest">THE</h4>

                <img
                  class="w-auto h-20"
                  src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
                  alt=""
                />
                <h4 class="text-[#F8F9FFB2] tracking-widest">SUPER ADMIN FACTORY</h4>
              </div>
            </div>

            <Card class="relative py-3 border-0 rounded-2xl bg-[#D9D9D91A]">
              <img
                class="absolute w-auto h-20 -top-[40px]"
                src="https://res.cloudinary.com/drykej1am/image/upload/v1710587777/mksb1isi3h5kihgepmuv.svg"
                alt=""
              />

              <img
                class="absolute w-auto h-16 -bottom-[35px] right-[60px]"
                src="https://res.cloudinary.com/drykej1am/image/upload/v1710587780/ed8ljwdauwhuge9mjgzr.svg"
                alt=""
              />

              <CardHeader class="space-y-1 pt-9">
                <CardTitle class="text-2xl text-white"> Sign In </CardTitle>
              </CardHeader>
              <CardContent class="grid gap-4">
                <form class="space-y-4" @submit.prevent="onSubmit">
                  <FormField v-slot="{ componentField }" name="userEmail">
                    <FormItem v-auto-animate>
                      <FormLabel class="font-normal text-white">Username/Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="weeshr@admin.com"
                          class="focus-visible:ring-[#BAEF23]"
                          v-bind="componentField"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                      <FormLabel class="font-normal text-white">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          class="focus-visible:ring-[#BAEF23]"
                          v-bind="componentField"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  </FormField>
                </form>
              </CardContent>
              <CardFooter>
                <div class="flex flex-col w-full">
                  <Button
                    @click="onSubmit()"
                    type="submit"
                    class="w-full bg-[#BAEF23] hover:bg-[#BAEF23] hover:scale-105 text-black font-normal"
                  >
                    <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />

                    Sign In
                  </Button>
                  <div class="pt-5 text-xs text-center text-gray-400">
                    <span> Copyright © {{ currentYear }} </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.absoluteImg {
  width: -webkit-fill-available;
  width: -moz-available;
}
</style>
