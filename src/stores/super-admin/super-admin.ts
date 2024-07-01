import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { toast } from '@/components/ui/toast'
import { useGeneralStore } from '@/stores/general-use'

interface SuperAdminState {
  userEmail: string
  password: string
  newUser: NewUser[]
  token: string
}

interface NewUser {
  username: string
  userEmail: string
  category: 'Vendor' | 'Admin'
}

export const useSuperAdminStore = defineStore({
  id: 'super-admin',
  state: (): SuperAdminState => ({
    userEmail: '',
    password: '',
    newUser: [],
    token: sessionStorage.getItem('token') || ''
  }),

  actions: {
    get loading() {
      return useGeneralStore().loading
    },
    setToken(token: string) {
      this.token = token
      sessionStorage.setItem('token', token)
    },
    setLocalStorage(firstname: string, lastname: string, email: string){
      const user = {
        firstname,
        lastname,
        email
      }
      // store basic user data in local storage
      localStorage.setItem('user', JSON.stringify(user))
    },
    getLocalstorageData (){
      const data = localStorage.getItem('user')!
      return JSON.parse(data)
    },
    clearToken() {
      this.token = ''
      // Remove the token from sessionStorage
      // sessionStorage.removeItem('token')
      localStorage.clear()
      sessionStorage.clear()
    },
    setuserEmail(value: string) {
      this.userEmail = value
    },
    setPassword(value: string) {
      this.password = value
    },
    addNewUser(newUser: NewUser) {
      this.newUser.push(newUser) // Add a new user to the newUser array
    },
    async logout() {
      try {
        useGeneralStore().setLoading(true) // Set loading to true
        // Make a request to the logout endpoint
        await axios.get('https://api.staging.weeshr.com/api/v1/admin/logout', {
          headers: {
            Authorization: `Bearer ${this.token}` // Include token in the Authorization header
          }
        })

        // Clear the token
        this.clearToken()
        // clear localstorage
        useGeneralStore().setLoading(false)

        router.push({ name: 'superAdmin-login' })
      } catch (error: any) {
        useGeneralStore().setLoading(false)

        this.clearToken()
        router.push({ name: 'superAdmin-login' })
        toast({
          title: error.response.data.message || 'An error occurred',
          variant: 'destructive'
        })
      }
    }
  }
})
