import WorkspaceCard from '@/components/workspace/workspace-card'
import CreateWorkspaceDialog from '@/components/common/create-dialogs/create-workspace-dialog'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/common/page-title'
import { useQuery } from '@tanstack/react-query'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'

export default function Workspaces() {
  const [open, setOpenCreateWorkspaceDialog] = useState(false)
  const {client: amplifyClient} = useAmplifyClient()
  const { data, refetch } = useQuery(
    {
        queryKey: ['myWorkspaces'],
        queryFn : async () => {
          const workspaces = await amplifyClient?.models?.Workspace.list()
          return workspaces?.data ?? [] 
        },
        initialData: [],
        enabled: false
    },
  )

  useEffect(() => {refetch()}, [amplifyClient, refetch])

  return (
    <div>
      <PageTitle title="Workspace" className="mb-10">
        <Button onClick={() => setOpenCreateWorkspaceDialog(true)}>
          New Workspace
        </Button>
      </PageTitle>
      <CreateWorkspaceDialog
        open={open}
        handleClose={() => setOpenCreateWorkspaceDialog(false)}
      />
      <div className="flex flex-row">
        {data?.map(
          (workspace) =>
            workspace && (
              <WorkspaceCard
                className="basis-1/4 mr-5"
                key={workspace.id}
                workspace={workspace}
              />
            ),
        )}
      </div>
    </div>
  )
}
