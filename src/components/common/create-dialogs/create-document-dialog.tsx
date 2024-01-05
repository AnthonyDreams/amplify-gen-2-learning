import {
  UseMutationResult,
  useMutation,
} from '@tanstack/react-query'
import slugify from '@/lib/utils/slugify'
import CreateDialog from '@/components/common/create-dialogs/create-dialog'
import { Template } from '../../../lib/amplify-schema'
import { useNavigate } from 'react-router-dom'
import { useUserAttribute } from '@/hooks/useUserAttribute'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'

interface CreateDocumentDialogProps {
  open: boolean
  data?: unknown
  handleClose: () => void
}

export default function CreateDocumentDialog(props: CreateDocumentDialogProps) {
  const { open, handleClose, data } = props
  const navigate = useNavigate();
  const {attributes:userAttributes} = useUserAttribute()
  const {client: amplifyClient} = useAmplifyClient()


  const createDocumentMutation = useMutation({
    mutationFn: async (templateName: string) => {
      if (!userAttributes['custom:workspace']) {
        navigate('/workspace')
        throw new Error("missing workspace")
      }
      const slug = slugify(templateName)
      const response = await amplifyClient?.models.Template.create({
        content: data ?? null,
        name: templateName,
        slug,
        ownerWorkspaceId: userAttributes['custom:workspace']
      })
      
      return response?.data
    },
    onSuccess(template: Template) {
      handleClose()
      navigate(`/templates/${template.id}`)
    },
  })

  return (
    <CreateDialog
      componentName="Document"
      open={open}
      placeholder="Create document"
      handleClose={handleClose}
      mutation={createDocumentMutation as UseMutationResult}
    />
  )
}
