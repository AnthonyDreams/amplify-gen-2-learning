import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import domEvents from '@/lib/utils/domEvents'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { UseMutationResult } from '@tanstack/react-query'

interface CreateDocumentDialogProps {
  open: boolean
  componentName: string
  handleClose: () => void
  mutation: UseMutationResult
  placeholder: string
}

export default function CreateDialog(props: CreateDocumentDialogProps) {
  const { open, handleClose, placeholder } = props
  const [name, setName] = useState<string>('')

  const createTemplate = async () => {
    if (!name) return
    props.mutation.mutate(name)
  }

  useEffect(() => {
    if (!open) {
      setName("")
    }
  }, [open])

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(isOpening: boolean) => !isOpening && handleClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.componentName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                required
                disabled={props.mutation.isPending}
                id={uuidv4()}
                placeholder={placeholder}
                onChange={(e) => setName(e.target.value)}
                onKeyUp={(e) => domEvents.isEnterKey(e) && createTemplate()}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!name} onClick={createTemplate}>
              {props.mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
