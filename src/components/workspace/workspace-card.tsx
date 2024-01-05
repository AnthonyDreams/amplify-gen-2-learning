import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Workspace } from '@/lib/amplify-schema'
import { useNavigate } from 'react-router-dom'
import { useUserAttribute } from '@/hooks/useUserAttribute'

interface workspaceCardProps extends React.PropsWithChildren {
  workspace: Workspace
  className: string
}

export default function WorkspaceCard(props: workspaceCardProps) {
  const [joining, setJoining] = useState(false)
  const navigate = useNavigate()
  const {attributes:userAttributes, handleUpdateUserAttribute} = useUserAttribute()
  
  
  async function join() {
    setJoining(true)
    await handleUpdateUserAttribute('custom:workspace', props.workspace.id ?? '')
    setJoining(false)
  }

  function goToWorkspace() {
    navigate(`/workspace/${props.workspace.id}`)
  }

  return (
    <Card className={cn('min-w-[275px]', props.className)}>
      <CardHeader>
        <CardTitle> {props.workspace.name}</CardTitle>
      </CardHeader>
      <CardFooter className='flex justify-between'>
        <Button onClick={() => goToWorkspace()} variant="outline">Details</Button>
        <Button
          disabled={userAttributes['custom:workspace'] === props.workspace.id}
          onClick={() => join()}
        >
          {joining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Join'}
        </Button>
      </CardFooter>
    </Card>
  )
}
