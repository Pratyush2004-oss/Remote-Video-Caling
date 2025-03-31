import { UserCircle } from 'lucide-react'
import { Doc } from '../../../convex/_generated/dataModel'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
type User = Doc<"users">
function UserInfo({user}:{user:User}) {
  return (
    <div className='flex items-center gap-2'>
        <Avatar className='size-6'>
            <AvatarImage src={user.image}/>
            <AvatarFallback>
                <UserCircle className='size-4'/>
            </AvatarFallback>
        </Avatar>
        <span>{user.name}</span>
    </div>
  )
}

export default UserInfo