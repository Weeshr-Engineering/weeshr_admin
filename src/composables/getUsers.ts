import { ref, type Ref } from 'vue'
import axios from 'axios'
import { useToast } from '@/components/ui/toast'

interface User {
  _id: string
  firstName: string
  middleName: string | null
  lastName: string
  userName: string
  phoneNumber: {
    countryCode: string
    phoneNumber: string
    normalizedNumber: string
    _id: string
  }
  dob: string
  gender: string
  email: string
  address: string | null
  verificationBadge: string
  emailVerified: boolean
  isDisabled: boolean
  avatar: string | null
}

const getUsers = () => {
  const users: Ref<User[]> = ref([])
  const error: Ref<string> = ref('')
  const totalPages = ref(0)
  const currentPage = ref(0)
  const token = sessionStorage.getItem('token') || ''
  const { toast } = useToast()

  const load = async (search: string, page: number) => {
    try {
      toast({
        description: 'Loading....',
        variant:'loading'
      })
      const response = await axios.get(
        `https://api.staging.weeshr.com/api/v1/admin/accounts/users?search=${search}&page=${page}&per_page=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 200) {
        users.value = response.data.data.data
        totalPages.value = response.data.data.totalPages
        currentPage.value = response.data.data.currentPage

        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        error.value = response.data.message
        toast({
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (err: any) {
      error.value = err.message
      toast({
        description: err.message,
        variant: 'destructive'
      })
    }
  }

  return { users, error, totalPages, currentPage, load }
}

export default getUsers
