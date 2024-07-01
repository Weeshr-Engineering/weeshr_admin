import { defineStore } from "pinia";
import axios from "axios";
import { toast } from '@/components/ui/toast'
import router from '@/router'

export const useRoleStore = defineStore({
    id: 'admin-list',
    state: ():ConfigStore=>({
      permissions: [],
      roles: []
    }),
    actions: {
        async createRole (data: any){
          const token = sessionStorage.getItem('token') || ''
            toast({
                title: 'Loading Data',
                description: 'Fetching data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
              const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://api.staging.weeshr.com/api/v1/admin/role`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`
                },
                data : data
              };
              
              axios.request(config)
              .then((response) => {
                if (response.status === 200 || response.status === 201) {
                  this.getRoles('New Role Created')
                }
              })
              .catch((error) => {
                this.catchErr(error)
              });
        },
        async getRoles(msg: string){
          const token = sessionStorage.getItem('token') || ''
          toast({
              title: 'Loading Data',
              description: 'Fetching data...',
              duration: 0 // Set duration to 0 to make it indefinite until manually closed
            })  
            try {
              const response = await axios.get(
                `https://api.staging.weeshr.com/api/v1/admin/roles`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
          
              if (response.status === 200 || response.status === 201) {
                toast({
                  title: 'Success',
                  description: msg,
                  variant: 'success'
                })
              }
              this.roles= response.data.data.data.reverse()
              console.log(this.roles)
              // set Loading to false
      
            } catch (error: any) {
              this.catchErr(error)
            }
      },
        updateRole (data: any, id: string){
          const token = sessionStorage.getItem('token') || ''  
          toast({
                title: 'Loading Data',
                description: 'Fetching data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
              
              const config = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `https://api.staging.weeshr.com/api/v1/admin/role/${id}`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`
                },
                data : data
              };
              
              axios.request(config)
              .then((response) => {
                // console.log(JSON.stringify(response.data));
                this.getRoles('Role Updated Successfully')
              })
              .catch((error) => {
                console.log(error)
                this.catchErr(error)
              });            
        },
        async deleteRole(id: string){
          const token = sessionStorage.getItem('token') || ''
            toast({
                title: 'Deleting Data',
                description: 'Deleting data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
            
              
              const config = {
                method: 'delete',
                url: `https://api.staging.weeshr.com/api/v1/admin/role/${id}`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`
                }
              };
              
              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                this.getRoles('Role Deleted Successfully')
              })
              .catch((error) => {
                this.catchErr(error)
              });
        },
        async getPermissions (){
          const token = sessionStorage.getItem('token') || ''
          toast({
              title: 'Loading Data',
              description: 'Fetching data...',
              duration: 0 // Set duration to 0 to make it indefinite until manually closed
            })
            try {
              const response = await axios.get(
                `https://api.staging.weeshr.com/api/v1/admin/role/permissions?group_by=model`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
          
              if (response.status === 200 || response.status === 201) {
                toast({
                  title: 'Success',
                  description: `Successful: data retrieved`,
                  variant: 'success'
                })
                // console.log(response.data.data)
                const data = response.data.data
                this.permissions = response.data.data
                return data
                
              }
            } catch (error: any) {
              this.catchErr(error)
            }
      },
      async allPermissions (){
        const token = sessionStorage.getItem('token') || ''
        toast({
            title: 'Loading Data',
            description: 'Fetching data...',
            duration: 0 // Set duration to 0 to make it indefinite until manually closed
          })
          try {
            const response = await axios.get(
              `https://api.staging.weeshr.com/api/v1/admin/role/permissions?group_by=basic`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
        
            if (response.status === 200 || response.status === 201) {
              toast({
                title: 'Success',
                description: `Successful: data retrieved`,
                variant: 'success'
              })
              console.log(response.data.data)
              const data = response.data.data
              return data
              
            }
          } catch (error: any) {
            this.catchErr(error)
          }
    },
        async getWeesheCategories (){
          const token = sessionStorage.getItem('token') || ''
          toast({
            title: 'Loading Data',
            description: 'Fetching data...',
            duration: 0 // Set duration to 0 to make it indefinite until manually closed
          })
          const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.staging.weeshr.com/api/v1/admin/weesh/categories?per_page=5&page=1&search=cash',
            headers: { 
              'Authorization': `Bearer ${token}`
            }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            toast({
              title: 'Success',
              description: `Successful: data retrieved`,
              variant: 'success'
            })
            return response.data.data
          })
          .catch((error) => {
            this.catchErr(error)
          });          
      },
      catchErr (error: any){
        console.log(error)
        if(error.response.status === 400){
          toast({
            title:  error.response.data.message || 'Bad Request',
            description: 'Pls reach out to the management reguarding this request',
            variant: 'destructive'
          })
        }else if(error.response.status === 401){
          toast({
            title:  error.response.data.message || 'Unauthenticated',
            description: 'Pls Signin again',
            variant: 'destructive'
          })
          sessionStorage.removeItem('token')
          setTimeout(() => {
            router.push({ name: 'superAdmin-login' })
          }, 1000)
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

interface ConfigStore {
  permissions: any[],
  roles: any[]
}
