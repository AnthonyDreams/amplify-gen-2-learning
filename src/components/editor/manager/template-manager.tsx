import { Editor } from 'grapesjs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TemplateManagerNameInput from './template-manager-name-input'

export default function TemplateManager(props: {
  open: boolean
  handleClose: () => void
  editor: Editor | null
}) {
  function updateTemplateName(name: string) {
    props.editor?.runCommand('save-templates', { name })
    props.handleClose()
  }
  return (
    <Dialog
      open={props.open}
      onOpenChange={(isOpening: boolean) => !isOpening && props.handleClose()}
    >
      <DialogHeader>
        <DialogTitle>Template manager</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <TemplateManagerNameInput
          update={(name: string) => updateTemplateName(name)}
        />
      </DialogContent>
    </Dialog>
  )
}
