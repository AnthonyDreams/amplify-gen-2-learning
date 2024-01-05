import React, { useEffect } from 'react'
import DataTable from '@/components/templates/data-table'
import columns from '@/components/templates/columns'
import PageTitle from '@/components/common/page-title'
import { Button } from '@/components/ui/button'
import CreateDocumentDialog from '@/components/common/create-dialogs/create-document-dialog'
import { Template } from '../../lib/amplify-schema'
import { useAmplifyClient } from '@/hooks/useAmplifyClient'
import { useQuery } from '@tanstack/react-query'

export default function TemplatesPage() {
    const {client: amplifyClient} = useAmplifyClient()

    const { data, refetch } = useQuery(
        {
            queryKey: ['myTemplates'],
            queryFn : async () => {
                const templates = await amplifyClient?.models.Template.list()
              return templates?.data ?? [] 
            },
            initialData: [],
            staleTime: 30,
            enabled: false
        },
      )
    
    useEffect(() => {refetch()}, [amplifyClient, refetch])
  
    const [documentToDuplicate, setDocumentToDuplicate] =
        React.useState<Template['content']>(null)

    const [openCreateTemplate, setOpenCreateTemplate] = React.useState<any>(null)

    const openCreateTemplateModal = (event: any) => {
        setDocumentToDuplicate(event.detail)
        setOpenCreateTemplate(true)
    }

    const closeCreateTemplateModal = () => {
        setDocumentToDuplicate(null)
        setOpenCreateTemplate(false)
    }

    React.useEffect(() => {
        document.addEventListener('openCreateDocument', openCreateTemplateModal)
        return () => {
            document.removeEventListener(
                'openCreateDocument',
                openCreateTemplateModal,
            )
        }
    }, [])

    return (
        <div className="">
            <PageTitle title="Templates" className="mb-10">
                <Button onClick={() => setOpenCreateTemplate(true)}>
                    New Template
                </Button>
            </PageTitle>
            <DataTable columns={columns} data={data as Template[]} />
            <CreateDocumentDialog
                open={openCreateTemplate}
                data={documentToDuplicate}
                handleClose={closeCreateTemplateModal}
            />
        </div>
    )
}
