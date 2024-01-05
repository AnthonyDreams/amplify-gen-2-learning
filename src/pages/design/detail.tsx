import DesignEditor from "@/components/editor/templateEditor/design-editor";
import { TemplateContextProvider } from "@/providers/template-provider";

export default function DesignDetailPage() {
  return (
    <TemplateContextProvider>
      <DesignEditor />
    </TemplateContextProvider>
  )
}
