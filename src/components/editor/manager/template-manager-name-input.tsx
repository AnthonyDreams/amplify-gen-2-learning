import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { TemplateContext } from '@/providers/template-provider'

export default function TemplateManagerNameInput(props: any) {
  const { template, setTemplate } = React.useContext(TemplateContext)
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        value={template?.name ?? ''}
        placeholder="Template name"
        onChange={(e) =>
          setTemplate({ ...(template ?? {}), name: e.target.value })
        }
      />
      <Button
        variant="outline"
        onClick={() => props.update(template?.name ?? '')}
      >
        <Save  />
      </Button>
    </div>
  )
}
