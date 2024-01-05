import { ColumnDef } from '@tanstack/react-table'
import { Edit, Files, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { Template } from '../../lib/amplify-schema'
import router from '@/routes'

const columns: ColumnDef<Template>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'slug', header: 'Url' },
  { accessorKey: 'updatedAt', header: 'Updated' },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const duplicate = () => {
        const openCreateDocument = new CustomEvent('openCreateDocument', {
          detail: row.original.content,
        })
        document.dispatchEvent(openCreateDocument)
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => duplicate()}>
              <Files className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.navigate(`/templates/${row.original.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default columns
