import { defineStore } from 'pinia'

export const useCreateUserStore = defineStore({
  id: 'user',
  state: () => ({
    users: [] as User[],
    firstName: '',
    lastName: '',
    userEmail: '',
    gender: '',
    dob: '',
    category: '',
    phoneNumber: ''
  }),
  actions: {
    resetForm() {
      // Reset form fields to their initial state
      this.firstName = ''
      this.lastName = ''
      this.userEmail = ''
      this.gender = ''
      this.dob = ''
      this.phoneNumber = ''
      this.category = ''
    },
    addUser(userData: Partial<User>) {
      this.users.push(userData as User)
    }
    // Optionally, you can add other actions to manipulate the form data
  }
})

// Define the User interface
interface User {
  firstName: string
  lastName: string
  gender: string
  userEmail: string
  dob: string

  phoneNumber: string

  dateJoined?: string
  status: boolean
  // category: string
}
