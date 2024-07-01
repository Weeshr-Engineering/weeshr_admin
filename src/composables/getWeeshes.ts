import { ref, type Ref } from 'vue'
import axios from 'axios'
import { useToast } from '@/components/ui/toast'


interface Weeshes {
  _id: string
  name: string
  user: {
    _id: string
    userName: string
  }
  category: {
    name: string
  }
  price: {
    price: string
    genieGratuity: string
  }
  currency: {
    code: string
  }
  status: string
  fulfilledStatus: string
}

const getWeeshes = () => {
  const weeshes: Ref<Weeshes[]> = ref([])
  const error: Ref<string> = ref('')
  const totalPages = ref(0)
  const currentPage = ref(0)
  const token = sessionStorage.getItem('token') || ''
  const { toast } = useToast()
  const base = `https://api.staging.weeshr.com/api/v1/admin/weeshes?per_page=20&`

  const loadWeeshes = async (option?: string | number) => {
    const url = () => {
      const statusOptions = new Set([
        'INITIATED',
        'ADDED',
        'OUTBOUND',
        'PENDING',
        'DELIVERED',
        'FULFILLED'
      ])

      const fulfillmentStatusOptions = new Set([
        'PURCHASE ELIGIBLE',
        'COST ABOVE PRICE',
        'OUT OF STOCK',
        'PROCURRED',
        'UNATTENDED'
      ])

      if (typeof option === 'string') {
        if (statusOptions.has(option)) {
          return base + `status=${option}`
        } else if (fulfillmentStatusOptions.has(option)) {
          return base + `fulfillment_status=${option}`
        } else {
          return base + `search=${option}`
        }
      } else if (typeof option === 'number') {
        return base + `page=${option}`
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
        weeshes.value = response.data.data.data
        totalPages.value = response.data.data.totalPages
        currentPage.value = response.data.data.currentPage

        toast({
          description: response.data.message,
          variant: 'success',
         
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

  return { weeshes, error, totalPages, currentPage, loadWeeshes }
}

export default getWeeshes
