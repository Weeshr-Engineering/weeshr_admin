import { defineStore } from "pinia"
import axios from "axios"

export const useUserhubStore = defineStore({
    id: 'userhubStore',
    state: (): UserhubFigures => ({ 
        usersCount: '0',
        adminsCount: '',
        vendorsCount: '',
        partnersCount: '',
        loading: false
     }),
    actions: {
        async getUsersNumber(){
            const token = sessionStorage.getItem('token') || ''
            try {
                const response = await axios.get(
                  'https://api.staging.weeshr.com/api/v1/admin/accounts/user-types/counts',
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
                if (response.status === 200 || response.status === 201) {
                    const { no_of_users, no_of_admins, number_of_vendors, no_of_partners} = response.data.data
                    this.usersCount = no_of_users
                    this.adminsCount = no_of_admins
                    this.vendorsCount = number_of_vendors
                    this.partnersCount = no_of_partners
                    this.loading = true
                }
                return true
            }
            catch (err: any) {
                console.log(err)
            }
            
        }
    }
})

interface UserhubFigures {
    usersCount: string,
    adminsCount: string,
    vendorsCount: string,
    partnersCount: string,
    loading: boolean
}