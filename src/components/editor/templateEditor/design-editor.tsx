/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import Builder from '@/components/editor/templateEditor/builder'
import { TemplateContext } from '@/providers/template-provider'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'
import { useParams } from 'react-router-dom'

export default function DesignEditor() {
  const params = useParams()
  const {client:amplifyClient} = useAmplifyClient()
  const [storage, setStorage] = useState<any>()
  const { getTemplate, setTemplate } = React.useContext(TemplateContext)

  const {data: design, refetch} = useQuery({
    queryKey: ['designDetail'],
    queryFn: async () => {
      const response = await amplifyClient?.models.TemplateDesigns.get({
        id: params["id"] as string,
      });

      return response?.data ?? null
    },
    enabled: false,
    initialData: null,
    
  })

  useEffect(() => {
    refetch()
  }, [params, amplifyClient, refetch])

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      return await amplifyClient?.models.TemplateDesigns.update({
        id: params['id'] as string,
        name: getTemplate()?.name || '',
        content: JSON.stringify({ ...data, assets: [] }),
      })
    },
  })

  useEffect(() => {
    if (params.id && amplifyClient) {
      setStorage({
        async load() {
          if(design){
            setTemplate(design);
            return {
              ...design,
              content: design?.content
                ? JSON.parse(design.content)
                : {},
            };
          }
          return {
            content: {}
          }
        },

        async store(data: any) {
          return mutation.mutateAsync(data)
        },
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design])

  return storage && <Builder createPicture remoteStorage={storage} />
}
