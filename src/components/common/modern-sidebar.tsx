import {
  UsersRound,
  LayoutTemplate,
  Brush,
  LogOut,
} from 'lucide-react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { signOut } from 'aws-amplify/auth'

const navigation = [
  { name: 'Workspaces', href: '/workspace', icon: UsersRound, current: true },
  {
    name: 'Templates',
    href: '/templates',
    icon: LayoutTemplate,
    current: false,
  },
  { name: 'Designs', href: '/designs', icon: Brush, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ModernSideBar({
  children,
  onSignOut
}: {
  children: React.ReactNode,
  onSignOut: typeof signOut
}) {
  const location = useLocation();
  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="sm:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            matchPath(item.href, location.pathname)
                              ? ' text-indigo-600'
                              : '',
                            'group flex gap-x-3 rounded-md p-4 text-sm leading-6 font-semibold',
                          )}
                        >
                          <item.icon
                            className={classNames(
                              matchPath(item.href, location.pathname)
                                ? 'text-indigo-600'
                                : 'text-gray-400 group-hover:text-indigo-600',
                              'h-6 w-6 shrink-0',
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <Button
                    onClick={onSignOut}
                    variant={'ghost'}
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <LogOut />
                    Sign out
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className="py-10 lg:pl-40">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  )
}
