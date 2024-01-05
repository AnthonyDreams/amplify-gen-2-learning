/* eslint-disable no-underscore-dangle */
import {
  DeleteUserInvitationInput,
  DeleteUserInvitationMutation,
  ListUserInvitationsQuery,
  ListUserInvitationsQueryVariables,
  UserInvitation,
} from '@/API'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { GraphQLQuery } from '@aws-amplify/api'
import * as queries from '@/graphql/queries'
import { useQuery } from 'react-query'
import * as mutations from '@/graphql/mutations'
import React from 'react'
import DataTable from './data-table'
import columns from './invited-users'

export default function InvitedUserTable() {
  const { query } = useRouter()
  const { data: invitedUsers, refetch: getInvitedUsers } = useQuery(
    'invitedUsers',
    async () => {
      const variables: ListUserInvitationsQueryVariables = {
        filter: {
          userInvitationWorkspaceId: {
            eq: query.name as string,
          },
          _deleted: {
            ne: true,
          },
        },
      }
      const response = await API.graphql<
        GraphQLQuery<ListUserInvitationsQuery>
      >({
        query: queries.listUserInvitations,
        variables,
      })
      return response.data?.listUserInvitations?.items
    },
    { initialData: [], cacheTime: 0, enabled: false },
  )

  const removeUser = async (user: UserInvitation) => {
    const deleteUserInvitationInput: DeleteUserInvitationInput = {
      id: user.id as string,
      _version: user._version,
    }
    await API.graphql<GraphQLQuery<DeleteUserInvitationMutation>>({
      query: mutations.deleteUserInvitation,
      variables: { input: deleteUserInvitationInput },
    })

    await getInvitedUsers()
  }

  React.useEffect(() => {
    if (query.name) {
      Promise.all([getInvitedUsers()])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.name])
  return (
    <DataTable
      columns={columns(removeUser)}
      data={invitedUsers as UserInvitation[]}
    />
  )
}
