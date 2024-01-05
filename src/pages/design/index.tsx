import { useState } from 'react'
import DesignCardList from '@/components/design/design-card-list'
import PageTitle from '@/components/common/page-title'
import { Button } from '@/components/ui/button'
import CreateDesignDialog from '@/components/common/create-dialogs/create-design-dialog'

export default function DesignPage() {
  const [openCreateDesignModal, setOpenCreateDesignModal] = useState(false)
  return (
    <div>
      <PageTitle title="Design" className="mb-10">
        <Button onClick={() => setOpenCreateDesignModal(true)}>
          New Design
        </Button>
      </PageTitle>
      <DesignCardList />
      <CreateDesignDialog
        open={openCreateDesignModal}
        handleClose={() => setOpenCreateDesignModal(false)}
      />
    </div>
  )
}
