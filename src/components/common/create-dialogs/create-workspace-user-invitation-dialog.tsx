import React, { useContext } from 'react'
import { useMutation } from 'react-query'
import { API } from 'aws-amplify'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { WorkspaceContext } from '@/contexts/workspaceContext'
import { GraphQLQuery } from '@aws-amplify/api'
import * as mutations from '@/graphql/mutations'
import {
  CreateUserInvitationMutation,
  CreateUserInvitationInput,
  GetWorkspaceQuery,
} from '@/API'
import CreateDialog from './create-dialog'

interface CreateWorkspaceUserInvitationDialogProps {
  open: boolean
  handleClose: () => void
  data: NonNullable<GetWorkspaceQuery['getWorkspace']>
}

export default function CreateWorkspaceUserInvitationDialog(
  props: CreateWorkspaceUserInvitationDialogProps,
) {
  const { open, handleClose } = props
  const { user } = useAuthenticator((context: any) => [context.user])
  const { user: workspaceUser } = useContext(WorkspaceContext)

  const invitaUserMutation = useMutation({
    mutationFn: async (userEmail: string) => {
      if (!user?.attributes) {
        throw new Error('Not authenticated')
      }

      if (workspaceUser) {
        const input: CreateUserInvitationInput = {
          email: userEmail,
          userInvitationWorkspaceId: props.data.id,
        }
        const response = await API.graphql<
          GraphQLQuery<CreateUserInvitationMutation>
        >({
          query: mutations.createUserInvitation,
          variables: {
            input,
          },
        })

        return response.data?.createUserInvitation
      }

      return null
    },
    onSuccess(invitation: any | null) {
      if (invitation) {
        handleClose()
      }
    },
  })

  return (
    <CreateDialog
      componentName="User Invitation"
      placeholder="user@invite.com"
      open={open}
      handleClose={handleClose}
      mutation={invitaUserMutation}
    />
  )
}
