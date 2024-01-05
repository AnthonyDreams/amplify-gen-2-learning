import { cn } from '@/lib/utils'
import React from 'react'
import { Separator } from '../ui/separator'

type PageTitleProps = {
  title: string
  description?: string
  className: string
}

type ComponentProps = React.PropsWithChildren<PageTitleProps>

export default function PageTitle(props: ComponentProps) {
  return (
    <div {...props}>
      <div className={cn('flex justify-between')}>
        <div className="flex-col">
          <h1 className="text-3xl font-bold tracking-tight">{props.title}</h1>
          <p className="text-sm text-muted-foreground">{props.description}</p>
        </div>
        <div>{props.children}</div>
      </div>
      <Separator className="my-4" />
    </div>
  )
}
