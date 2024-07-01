import { ref, type Ref } from "vue"
import axios from 'axios';
import { useToast } from '@/components/ui/toast';
import * as z from 'zod';
import { useRouter } from "vue-router";


interface User {
    firstName: string,
    middleName?: string,
    lastName: string,
    userName: string,
    phone: {
        countryCode: string,
        phoneNumber: string,
    },
    dob: string,
    gender: string,
    email: string,
    isAdmin: boolean
}

const userFormSchema =
  z.object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(30, { message: 'First name cannot be longer than 50 characters' }),
    middleName: z
      .string()
      .optional(),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters long' })
      .max(30, { message: 'Last name cannot be longer than 50 characters' }),
    email: z.string().email('Please enter a valid email address'),
    phone: z.object({
        countryCode: z.string().nonempty('Country code is required'),
        phoneNumber: z.string().nonempty('Phone number is required'),
    }),
    gender: z.string(),
    dob: z.string(),
    userName: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters long' })
    .max(20, { message: 'Username cannot be longer than 20 characters' }),
  })


const createUser = () => {
    const router = useRouter()

    const loading: Ref<boolean> = ref(false)
    const newUser = ref<User>({
        firstName: '',
        middleName: '',
        lastName: '',
        userName: '',
        phone: {
            countryCode: '+234',
            phoneNumber: '',
        },
        dob: '',
        gender: '',
        email: '',
        isAdmin: false,
    })

    const token = sessionStorage.getItem('token') || ''
    const { toast } = useToast()
    
    const userLoad = async () => {
        try {
            userFormSchema.parse(newUser.value);
            toast({
                description: "Loading....",
                variant:'loading'
            })
            const response = await axios.post('https://api.staging.weeshr.com/api/v1/admin/accounts/user', newUser.value,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
        
            if (response.data.code === 200) {
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

            router.push({name: "appuser"})

            loading.value = true
        }
        catch (err: any) {
            if (err instanceof z.ZodError) {
                err.errors.forEach((error) => {
                    toast({
                        description: `Error : ${error.message}`,
                        variant: 'destructive'
                    });
                });
                
            } 
            else {
                toast({
                    description: err.message,
                    variant: 'destructive'
                });
            }

            router.push({name: "appuser"})

            loading.value = false;
        }

    }
    
    return {loading, newUser, userLoad}
}

export default createUser