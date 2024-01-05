/* eslint-disable no-underscore-dangle */
import {
  DeleteWorkspaceMemberInput,
  DeleteWorkspaceMemberMutation,
  ListUsersQuery,
  ListUsersQueryVariables,
  ListWorkspaceMembersQuery,
  ListWorkspaceMembersQueryVariables,
  ModelUserFilterInput,
  WorkspaceMember,
} from '@/API'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { GraphQLQuery } from '@aws-amplify/api'
import * as queries from '@/graphql/queries'
import { useQuery } from 'react-query'
import * as mutations from '@/graphql/mutations'
import React from 'react'
import DataTable from './data-table'
import columns from './members-columns'

export default function WorkspaceMembers() {
  const { query } = useRouter()

  const { data: workspaceMembers, refetch: getWorkspaceMembers } = useQuery(
    'myWorkspaceUsers',
    async () => {
      const variables: ListWorkspaceMembersQueryVariables = {
        filter: {
          workspaceID: {
            eq: query.name as string,
          },
          _deleted: {
            ne: true,
          },
        },
      }
      const membersResponse = await API.graphql<
        GraphQLQuery<ListWorkspaceMembersQuery>
      >({
        query: queries.listWorkspaceMembers,
        variables,
      })

      const members = membersResponse.data?.listWorkspaceMembers as NonNullable<
        ListWorkspaceMembersQuery['listWorkspaceMembers']
      >

      const listUsersVariable: ListUsersQueryVariables = {
        filter: {
          or: members.items.map(
            (member) =>
              ({
                id: {
                  eq: member?.userID as string,
                },
              }) as ModelUserFilterInput,
          ),
        },
      }
      const users = await API.graphql<GraphQLQuery<ListUsersQuery>>({
        query: queries.listUsers,
        variables: listUsersVariable,
      })

      if (users.data?.listUsers) {
        return users.data.listUsers.items.map((memberUser) => ({
          ...memberUser,
          member: members.items.find(
            (member) => member?.userID === memberUser?.id,
          ),
        }))
      }

      return []
    },
    { initialData: [], cacheTime: 0, enabled: false },
  )
  const removeUser = async (
    user: Partial<{ id: string; _version: number }>,
  ) => {
    const deleteWorkspaceMemberInput: DeleteWorkspaceMemberInput = {
      id: user.id as string,
      _version: user._version,
    }
    await API.graphql<GraphQLQuery<DeleteWorkspaceMemberMutation>>({
      query: mutations.deleteWorkspaceMember,
      variables: { input: deleteWorkspaceMemberInput },
    })

    await getWorkspaceMembers()
  }

  React.useEffect(() => {
    if (query.name) {
      Promise.all([getWorkspaceMembers()])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.name])
  return (
    <DataTable
      columns={columns(removeUser)}
      data={workspaceMembers as WorkspaceMember[]}
    />
  )
}
