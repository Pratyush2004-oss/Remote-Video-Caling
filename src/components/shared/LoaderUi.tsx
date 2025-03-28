import { LoaderIcon } from 'lucide-react'
import React from 'react'

function LoaderUi() {
  return (
    <div className='h-[calc(100vh-4rem-1px)] flex items-center justify-center'>
        <LoaderIcon className='size-8 animate-spin text-muted-foreground'/>
    </div>
  )
}

export default LoaderUi 