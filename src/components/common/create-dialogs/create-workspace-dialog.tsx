import { useAuthenticator } from '@aws-amplify/ui-react'
import CreateDialog from '@/components/common/create-dialogs/create-dialog'
import { useNavigate } from 'react-router-dom'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { Workspace } from '@/lib/amplify-schema'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'


interface CreateWorkspaceDialogProps {
  open: boolean
  handleClose: () => void
}

export default function CreateWorkspaceDialog(
  props: CreateWorkspaceDialogProps,
) {
  const { open, handleClose } = props
  const navigate = useNavigate()
  const { user } = useAuthenticator((context) => [context.user])
  const {client: amplifyClient} = useAmplifyClient()

  const createWorkspaceMutation = useMutation({
    mutationFn: async (workspaceName: string) => {
      const workspace = await amplifyClient?.models.Workspace.create({
        name: workspaceName,
        mantainers: [user.userId],
      })
      
      if(!workspace){
        throw new Error("No workspace created")
      }

      let member;
      try {
        member = await amplifyClient?.models.Member.get({id: user.userId})
      } catch (error){
        member = await amplifyClient?.models.Member.create({
          id: user.userId,
        })
      }

      if(!member){
        throw new Error("No workspace created")
      }

     await amplifyClient?.models.WorkspaceMembers.create({
      workspaceId: workspace.data.id,
      memberId: member.data.id
     })


     return workspace.data
    },
    onSuccess(workspace: Workspace) {
      if (workspace) {
        handleClose()
        navigate(`/workspace/${workspace.id}`)
      }
    },
  })

  return (
    <CreateDialog
      componentName="Workspace"
      placeholder="Create workspace"
      open={open}
      handleClose={handleClose}
      mutation={createWorkspaceMutation as UseMutationResult}
    />
  )
}
