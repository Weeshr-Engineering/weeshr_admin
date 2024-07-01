import { defineStore } from "pinia"
import axios from "axios"
import { useToast } from '@/components/ui/toast';

export const useWeeshStore = defineStore('weeshStore', {
    state: () => ({
        addedCount: 0,
        initiatedCount: 0,
        fufilledCount: 0,
        deliveredCount: 0,
        pendingCount: 0,
        outboundCount: 0,
        loading: false
    }),
    actions: {
        async getWeeshesCount() {
            const { toast } = useToast()
            const token = sessionStorage.getItem('token') || ''
            try {
                this.loading = true
                const response = await axios.get(
                    'https://api.staging.weeshr.com/api/v1/admin/weeshes/count/status',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                if (response.status === 200 || response.status === 201) {
                    this.addedCount = response.data.data.status.ADDED;
                    this.initiatedCount = response.data.data.status.INITIATED;
                    this.fufilledCount = response.data.data.status.FULFILLED;
                    this.deliveredCount = response.data.data.status.DELIVERED;
                    this.pendingCount = response.data.data.status.PENDING;
                    this.outboundCount = response.data.data.status.OUTBOUND;

                    this.loading = false
                }else {
                    toast({
                        description: response.data.message,
                        variant: 'destructive'
                    })
                }
            }
            catch (err: any) {
                console.log(err)
            }
        }
    }
})