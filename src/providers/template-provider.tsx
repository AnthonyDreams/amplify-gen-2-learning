import { Template, TemplateDesign } from '@/lib/amplify-schema'
import { Dispatch, ReactNode, createContext, useMemo, useState } from 'react'

interface TemplateContextType {
  setTemplate: Dispatch<Template | TemplateDesign>
  template: Template | TemplateDesign | null | undefined
  getTemplate: () => Template | TemplateDesign | null | undefined
}

const TemplateContext = createContext<TemplateContextType>({
  setTemplate: () => {},
  template: null,
  getTemplate: () => null,
})

function TemplateContextProvider({ children }: { children: ReactNode }) {
  const [template, setTemplate] = useState<
    Template | TemplateDesign | null | undefined
  >()

  function getTemplate(): Template | TemplateDesign | null | undefined {
    return template
  }

  const value = useMemo(
    () => ({
      setTemplate,
      template,
      getTemplate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template],
  )

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  )
}

export { TemplateContextProvider, TemplateContext }
