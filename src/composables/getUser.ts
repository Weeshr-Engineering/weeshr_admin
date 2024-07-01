import { ref, type Ref } from 'vue'
import axios from 'axios'
import { useToast } from '@/components/ui/toast'

interface User {
  firstName: string
  middleName: string | null
  lastName: string
  userName: string
  phoneNumber: {
    normalizedNumber: string
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

interface Log {
  id: string
  timestamp: string
  user: {
    type: string
    extras: {
      email: string
      userName: string
    }
  }
  action: string
  status: string
  description: string
}

export interface Weeshes {
  _id: string
  name: string
  wishYear: string
  isLocked: boolean
  isPriority: boolean
  status: string
  images: [
    {
      _id: string
      url: string
    }
  ]
  category: {
    name: string
  }
  price: {
    price: number
    genieGratuity: number
    total: number
  }
  currency: {
    code: string
  }
  contributions: [
    {
      _id: string
      isContributorAnonymous: boolean
      amount: number
      contributor: {
        avatar: string
        firstName: string
        lastName: string
      }
    }
  ]
}
interface Wallet {
  id: string
  account_number: string
  account_name: string
  balance: number
  ledger_balance: number
}

const token = sessionStorage.getItem('token') || ''
const { toast } = useToast()

export const getUser = () => {
  const appUser = ref<User | null>(null)
  const error: Ref<string> = ref('')

  const load = async (_id: string | string[]) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(
        'https://api.staging.weeshr.com/api/v1/admin/accounts/users/' + _id,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 200) {
        appUser.value = response.data.data
        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        error.value = response.data.message
        toast({
          description: response.data.message,
          variant: 'warning'
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

  return { appUser, error, load }
}

export const getUserLog = () => {
  const userLog = ref<Log[]>([])
  const logError: Ref<string> = ref('')
  const count = ref<number>(0)

  const log = async (_id: string | string[], next: number, perPage: number) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(
        `https://api.staging.weeshr.com/api/v1/admin/accounts/user/${_id}/logs?&per_page=${perPage}&page_item_from=${next}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 200) {
        userLog.value = response.data.data.data
        count.value = response.data.data.count

        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        logError.value = response.data.message
        toast({
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (err: any) {
      logError.value = err.message
      toast({
        description: err.message,
        variant: 'destructive'
      })
    }
  }

  return { userLog, count, logError, log }
}

export const getUserWeeshes = () => {
  const userWeeshesList: Ref<Weeshes[]> = ref([])
  const weeshesError: Ref<string> = ref('')
  const totalPages = ref(0)
  const currentPage = ref(0)

  const userWeeshes = async (_id: string | string[], options?: string | number) => {
    const base = `https://api.staging.weeshr.com/api/v1/admin/accounts/users/${_id}/weeshes?`

    const url = () => {
      if (typeof options === 'string') {
        if (options === 'asc' || options === 'desc') {
          return base + `sort_by_price=${options}`
        } else if (options !== 'asc' && options !== 'desc') {
          return base + `search=${options}`
        }
      } else if (typeof options === 'number') {
        return base + `page=${options}`
      }
      return base
    }

    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(url(), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.code === 200) {
        userWeeshesList.value = response.data.data.data
        totalPages.value = response.data.data.totalPages
        currentPage.value = response.data.data.currentPage

        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        weeshesError.value = response.data.message
        toast({
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (err: any) {
      weeshesError.value = err.message
      toast({
        description: err.message,
        variant: 'destructive'
      })
    }
  }

  return { userWeeshesList, weeshesError, totalPages, currentPage, userWeeshes }
}

export const getUserWallet = () => {
  const userWallet = ref<Wallet | null>(null)

  const getWallet = async (_id: string | string[]) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(
        `https://api.staging.weeshr.com/api/v1/admin/user/${_id}/wallet`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 200) {
        userWallet.value = response.data.data
        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        toast({
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (err: any) {
      toast({
        description: err.message,
        variant: 'destructive'
      })
    }
  }
  return { userWallet, getWallet }
}

export const getUserWalletList = () => {
  const userWalletList = ref<Wallet | null>(null)
  const walletError: Ref<string> = ref('')

  const getWalletList = async (_id: string | string[]) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(
        `https://api.staging.weeshr.com/api/v1/admin/user/${_id}/wallet/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.code === 200) {
        userWalletList.value = response.data.data.data
        toast({
          description: response.data.message,
          variant: 'success'
        })
      } else {
        walletError.value = response.data.message
        toast({
          description: response.data.message,
          variant: 'destructive'
        })
      }
    } catch (err: any) {
      walletError.value = err.message
      toast({
        description: err.message,
        variant: 'destructive'
      })
    }
  }
  return { walletError, userWalletList, getWalletList }
}

export default {
  getUser,
  getUserLog,
  getUserWeeshes,
  getUserWallet,
  getUserWalletList
}
