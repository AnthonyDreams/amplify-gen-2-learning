import slugify from '@/lib/utils/slugify'
import CreateDialog from '@/components/common/create-dialogs/create-dialog'
import { useNavigate } from 'react-router-dom'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { TemplateDesign } from '@/lib/amplify-schema'

export default function CreateDesignDialog(props: {
  open: boolean
  data?: unknown
  handleClose: () => void
}) {
  const { open, handleClose } = props
  const navigate = useNavigate()
  const {client:amplifyClient} = useAmplifyClient()

  const createDesignMutation = useMutation({
    mutationFn: async (templateName: string) => {
      const slug = slugify(templateName)
      const response = await amplifyClient?.models.TemplateDesigns.create({
        name: templateName,
        slug: slug,
        content: props.data ?? null
      })
      return response?.data
    },
    onSuccess(design: TemplateDesign | undefined) {
      if(!design) {return}
      handleClose()
      navigate(`/designs/${design.id}`)
    },
  })

  return (
    <CreateDialog
      componentName="Design"
      placeholder="Create template-name1"
      open={open}
      handleClose={handleClose}
      mutation={createDesignMutation as UseMutationResult}
    />
  )
}
