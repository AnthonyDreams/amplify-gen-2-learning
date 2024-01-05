import DataTable from './data-table'
import columns from './members-columns'
import { useQuery } from '@tanstack/react-query'
import { Workspace, WorkspaceMember } from '@/lib/amplify-schema'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'

export default function WorkspaceMembers({workspace}: {workspace: Workspace}) {
  const {client:amplifyClient} = useAmplifyClient()

  const { data: workspaceMembers, refetch: getWorkspaceMembers } = useQuery(
    {
      queryKey: ['myWorkspaceUsers'],
      queryFn: async () => {
        const workspaceUsers = await workspace.members()
        return workspaceUsers.data
      },
      initialData: []
    }
    
  )
  const removeUser = async (
    member: WorkspaceMember,
  ) => {
    await amplifyClient?.models.WorkspaceMembers.delete({id: member.id as string})
    await getWorkspaceMembers()
  }
 
  return (
    <DataTable
      columns={columns(removeUser)}
      data={workspaceMembers as WorkspaceMember[]}
    />
  )
}
