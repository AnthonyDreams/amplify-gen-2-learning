import CreateWorkspaceUserInvitationDialog from '@/components/common/create-dialogs/create-workspace-user-invitation-dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import WorkspaceMembers from '@/components/workspace/members-table'
import PageTitle from '@/components/common/page-title'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'
import { useEffect, useState } from 'react'
import { Workspace } from '@/lib/amplify-schema'

export default function WorkspaceMembersDataTable() {
  const {id} = useParams()
  const [workspaceName, setWorkspaceName] = useState('')
  const [openInviteUserDialog, setOpenInviteUserDialog] = useState(false)
  const {client: amplifyClient} = useAmplifyClient()

  const {data:workspace, refetch, isLoading:isWorkspaceLoading} = useQuery({
    queryKey: ['workspaceDetail'],
    queryFn: async () => {
        const workspace = amplifyClient?.models.Workspace.get({
            id: id as string
        })
        return (await workspace)?.data
    },
    initialData: null,
    enabled: false
  })

  useEffect(() => {
    if(amplifyClient?.models){
        refetch()
    }
  }, [refetch, amplifyClient])


  const updateWorkspaceMutation = useMutation({
    mutationFn: async () => {
      if (!workspace) {
        throw new Error('Invalid')
      }

      await amplifyClient?.models.Workspace.update({
        id: workspace.id,
        name: workspaceName
      })
    },
  })

  return (
    <div>
      <PageTitle title={workspace?.name ?? ''} className="mb-10">
        <Button
          onClick={() => setOpenInviteUserDialog(true)}
        >
          <span>Invite user</span>
        </Button>
      </PageTitle>

      {workspace && !isWorkspaceLoading && (
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            onChange={(e) => setWorkspaceName(e.target.value)}
            value={workspaceName}
            placeholder="workspace name"
          />

          <Button
            disabled={updateWorkspaceMutation.isPending}
            onClick={() => updateWorkspaceMutation.mutate()}
          >
            {updateWorkspaceMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Actualizar
          </Button>
        </div>
      )}
      <h4>Members</h4>
      <WorkspaceMembers workspace={workspace as Workspace}/>

      {workspace && (
        <CreateWorkspaceUserInvitationDialog
          data={workspace}
          open={openInviteUserDialog}
          handleClose={() => {
            setOpenInviteUserDialog(false)
          }}
        />
      )}
    </div>
  )
}
