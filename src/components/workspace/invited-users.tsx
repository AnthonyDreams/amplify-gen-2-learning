import { UserInvitation } from '@/API'
import { ColumnDef } from '@tanstack/react-table'
import { Delete, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'

const columns: (
  onRemove: (data: any) => void,
) => ColumnDef<UserInvitation>[] = (onRemove) => [
  { accessorKey: 'email', header: 'Name' },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onRemove(row.original)}>
            <Delete className="mr-2 h-4 w-4" /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default columns
