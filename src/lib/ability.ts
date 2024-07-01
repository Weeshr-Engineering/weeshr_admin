import { createMongoAbility } from '@casl/ability';
import { toast } from '@/components/ui/toast'; 

// define an empty rule
export const ability = createMongoAbility()
// function to update/define the created empt rule
export const defineAbilities = async ()=> {
    const permissions = JSON.parse(sessionStorage.getItem('permissions') || "[]")
    if(permissions !== ''){
        const data = modPermissions(permissions)
        ability.update(data)
    }
    return
}
// function to trigger a toast
export const verifyAbilities = (action: string, subject: string)=>{
    if(!ability.can(action, subject)){
      toast({
          title: `You do not have ${action.toUpperCase()} access to this feature`,
          variant: 'destructive'
        })
    }
}
// modifies the permmissions array into a usable form
const modPermissions = (array: any) =>{
    // Create an array to hold the resulting objects
    const result: any = [];

    // Loop through each item in the array
    array.forEach((item: string)=> {
        // Split the string at the first underscore
        const [first, ...rest] = item.split('-');
        const second = rest.join('-'); // Rejoin the rest if there are multiple underscores

        // Create an object with the required structure
        const obj = { action: first, subject: second };

        // Add the object to the result array
        result.push(obj);
    });

    return result;
}