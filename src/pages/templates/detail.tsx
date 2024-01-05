import DocumentEditor from "@/components/editor/templateEditor/document-editor";
import { TemplateContextProvider } from "@/providers/template-provider";


export default function TemplateDetailPage() {
  return (
    <TemplateContextProvider>
      <DocumentEditor />
    </TemplateContextProvider>
  )
}
