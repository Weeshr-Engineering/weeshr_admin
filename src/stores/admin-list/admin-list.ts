import { defineStore } from "pinia";
import axios from "axios";
import { toast } from '@/components/ui/toast'
import router from '@/router'

interface PhoneNumber {
  countryCode: string;
  phoneNumber: string;
  normalizedNumber: string;
  _id: string;
}

interface Role {
  [key: string]: any; // Assuming the structure of Role is dynamic
}

interface adminProfile {
    avatar: string | null;
    disabled: boolean;
    dob: string;
    email: string;
    firstName: string;
    gender: string;
    lastName: string;
    middleName: string | null;
    phoneNumber: PhoneNumber;
    roles: Role[];
    _id: string
}

  interface AdminListStore {
    users: adminProfile[],
    adminStatus: boolean, //single admin id gotten from admin details page
    sheetOpen: boolean,
    loading: boolean,
    currentPage: number,
    totalpage: any[],
    detailLoading: boolean,
    totalPages: number
}

export const useAdminListStore = defineStore({
    id: 'admin-list',
    state: (): AdminListStore =>({
        users: [],
        adminStatus: true,
        sheetOpen: false,
        loading: false,
        currentPage: 1,
        totalpage: [],
        detailLoading: false,
        totalPages: 1
    }),
    actions: {
        async fetchUsersData (){
            const token = sessionStorage.getItem('token') || ''
            toast({
              title: 'Loading Data',
              description: 'Fetching data...',
              variant:'loading',
              duration: 0 // Set duration to 0 to make it indefinite until manually closed
            })
          
            // useGeneralStore().setLoading(true)
            try {
              // Set loading to true
          
              const response = await axios.get(
                'https://api.staging.weeshr.com/api/v1/admin/administrators?per_page=200',
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
          
              if (response.status === 200 || response.status === 201) {
                // Show success toast
                toast({
                  title: 'Success',
                  description: `data fetched`,
                  variant: 'success'
                })
          
                console.log(response.data)
              }
          
              // Update the users data with the response
              const data = response.data.data.data
              this.users = data.reverse()
              // adminListStore.setUsers(data.reverse())

              // set page data
            //   this.perPage= response.data.data.perPage
              this.currentPage = response.data.data.currentPage
              this.totalPages = response.data.data.totalPages
              
              // close loading screen
              // useGeneralStore().setLoading(false)
            } catch (error: any) {
              this.catchErr(error)
              if (error.response.status === 401) {
                sessionStorage.removeItem('token')
                // Clear token from superAdminStore
                // superAdminStore.setToken('')
          
                setTimeout(() => {
                  router.push({ name: 'home' })
                }, 3000)
          
                toast({
                  title: 'Unauthorized',
                  description: 'You are not authorized to perform this action. Redirecting to home page...',
                  variant: 'warning'
                })
                // Redirect after 3 seconds
              } else {
                toast({
                  title: error.response.data.message || 'An error occurred',
                  variant: 'destructive'
                })
              }
            }
          },
          // Save user data to the /administrator endpoint
        async saveUserData (user: any){
            const token = sessionStorage.getItem('token') || ''
            // adminListStore.loadingControl(true)
            try {
            const response = await axios.post(
                'https://api.staging.weeshr.com/api/v1/admin/administrator',
                user,
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                }
            )
        
            // Check if response status is 200 or 201
            if (response.status === 200 || response.status === 201) {
                // Show success toast
                toast({
                title: 'Success',
                description: `${user.firstName} User profile created successfully.`,
                variant: 'success'
                })
                this.fetchUsersData()
            }
            // Handle success
            } catch (err: any) {
            //   adminListStore.loadingControl(false)
            this.catchErr(err)
            // Handle other errors
            }
        },
        handlePageChange(newPage: number) {
            if (newPage > 0 && newPage <= this.totalPages) {
              this.currentPage = newPage;
            }
          },
        sheetControl(value : boolean){
            if(value){
                this.sheetOpen = value
            }else{
                this.sheetOpen = !this.sheetOpen
            }
        },
        loadingControl(value: boolean){
            if(value){
                this.loading = value
            }else{
                this.loading = !this.loading
            }
        },
        setUsers(value: any[]){
            if(value){
                this.users = value
            }
        },
        setAdminStatus(value: boolean){
            this.adminStatus = value
        },
        setDetailLoading(value: boolean){
            if(value){
                this.detailLoading = value
            }else{
                this.detailLoading = !this.detailLoading
            }            
        },
        async toggleStatus(value: string, status: boolean, user: string){
            toast({
                title: `${!status ? `Disabling ${user}...` : `Activating ${user}...`}`,
                description: `${status ? `Disabling ${user} in progress...` : `Activating ${user} in progress...`}`,
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
            const data = JSON.stringify({
              "status": !status
            });
            const token = sessionStorage.getItem('token') || ''
            const config = {
              method: 'patch',
              maxBodyLength: Infinity,
              url: `https://api.staging.weeshr.com/api/v1/admin/administrator/${value}/disabled_status`,
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
              },
              data : data
            };
          
            axios.request(config)
            .then((response) => {
              // Check if response status is 200 or 201
              if (response.status === 200 || response.status === 201) {
                // Show success toast
                this.adminStatus = !this.adminStatus
                toast({
                    title: 'Success',
                    description: `${!status ? `${user} Disabled` : `${user} Activated`}`,
                    variant: 'success'
                  })
              }
            })
            .catch((error) => {
              console.log(error);
              this.catchErr(error)
            });
          },
          catchErr (error: any){
            if(error.response.status === 400){
              toast({
                title:  error.response.data.message || 'Bad Request',
                description: 'Pls reach out to the management reguarding this request',
                variant: 'destructive'
              })
            }else if(error.response.status === 401){
              sessionStorage.removeItem('token')
              setTimeout(() => {
                router.push({ name: 'superAdmin-login' })
              }, 1000)
              toast({
                title:  error.response.data.message || 'Unauthenticated',
                description: 'Pls Signin again',
                variant: 'destructive'
              })
            }else if(error.response.status === 403){
              toast({
                title:  error.response.data.message || 'Unauthorized',
                description: 'You are not authorized to access this feature',
                variant: 'destructive'
              })
              setTimeout(() => {
                router.push({ name: 'home' })
              }, 3000)
            }else if(error.response.status === 422 ){
              toast({
                title:  error.response.data.message || 'Validation Error',
                description: 'Your request is not validated, Pls try again ',
                variant: 'destructive'
              })
            }else if(error.response.status === 500 ){
              toast({
                title:  error.response.data.message || 'Server Error',
                description: 'Pls try again later',
                variant: 'destructive'
              })
            }else if(error.response.status === 404 ){
              toast({
                title:  error.response.data.message || 'Not found',
                description: '404 Error',
                variant: 'destructive'
              })
            }
          }
    }
})
