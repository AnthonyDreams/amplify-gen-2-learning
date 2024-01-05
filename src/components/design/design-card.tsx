import { useEffect, useState } from 'react'
import { Edit, Files, LayoutTemplate, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { TemplateDesign } from '@/lib/amplify-schema'
import { getUrl } from 'aws-amplify/storage';
import { useNavigate } from 'react-router-dom'


interface CardEmailProps {
  onDuplicateDesign: (data: TemplateDesign) => void
  onUseDesign: (data: TemplateDesign) => void
  data: TemplateDesign
}

function EmailCard(props: CardEmailProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const navigate = useNavigate()

  async function getImageUrl() {
    const url = await getUrl({
      key: `preview/${props.data?.id}.jpg`,
    })
    setImageUrl(url.url.toString())
  }

  useEffect(() => {
    getImageUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data])

  return (
    <div className="group relative mouse-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          style={{
            position: 'absolute',
            zIndex: '1',
            bottom: '0%',
            right: '0%',
          }}
        >
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem
            onClick={() => {
              props.onUseDesign(props.data)
            }}
          >
            <LayoutTemplate className="mr-2 h-4 w-4" /> Use this design
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              props.onDuplicateDesign(props.data)
            }}
          >
            <Files className="mr-2 h-4 w-4" /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate(`/designs/${props.data.id}`)
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div
        className="rounded overlay cursor-pointer flex relative"
        id={props.data.id}
      >
        {imageUrl ? (
          <img
            className="email-card rounded brightness-95 group-hover:brightness-75"
            src={imageUrl}
            alt="preview"
            style={{ width: '100%', display: 'block', alignSelf: 'start' }}
          />
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  )
}

export default EmailCard
