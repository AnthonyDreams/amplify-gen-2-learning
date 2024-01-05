import { ReactNode, useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import CreateDocumentDialog from '@/components/common/create-dialogs/create-document-dialog'
import DesignCard from './design-card'
import CreateDesignDialog from '../common/create-dialogs/create-design-dialog'
import { useQuery } from '@tanstack/react-query'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'
import { TemplateDesign } from '@/lib/amplify-schema'

export default function DesignCardList(props: {
  size?: number
  children?: ReactNode
}) {
  const [designToDuplicate, setDesignToDuplicate] = useState<TemplateDesign['content'] | null>(null)
  const [templateToCreate, setTemplateToCreate] = useState<TemplateDesign['content'] | null>(null)
  const { client: amplifyClient } = useAmplifyClient()

  const handleCloseModal = () => {
    setDesignToDuplicate(null)
  }

  const { data, refetch } = useQuery(
    {
      queryKey: ['myTemplateDesigns'],
      queryFn: async () => {
        const response = await amplifyClient?.models.TemplateDesigns.list()
        return response?.data ?? []
      },
      initialData: [],
      enabled: false
    }
  )

  useEffect(() => {refetch()}, [amplifyClient, refetch])
  return (
    <>
      <ResponsiveMasonry columnsCountBreakPoints={{ 400: 3, 750: 4, 1300: 6 }}>
        <Masonry gutter="10px" columnsCount={6}>
          {data
            ?.slice(0, props.size ?? data.length)
            .map((design: TemplateDesign) => (
              <DesignCard
                key={design.id}
                onDuplicateDesign={(designData) => setDesignToDuplicate(designData.content)}
                onUseDesign={(designData) => setTemplateToCreate(designData.content)}
                data={design}
              />
            ))}
        </Masonry>
      </ResponsiveMasonry>
      {data && props.size && data.length > props.size && props.children}

      <CreateDocumentDialog
        open={!!templateToCreate}
        handleClose={() => setTemplateToCreate(null)}
        data={templateToCreate}
      />
      <CreateDesignDialog
        open={!!designToDuplicate}
        handleClose={handleCloseModal}
        data={designToDuplicate}
      />
    </>
  )
}
