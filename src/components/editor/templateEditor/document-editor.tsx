/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from "react";
import Builder from "@/components/editor/templateEditor/builder";
import { TemplateContext } from "@/providers/template-provider";
import { useAmplifyClient } from "@/hooks/useAmplifyClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function DocumentEditor() {
  const params = useParams();
  const { client: amplifyClient } = useAmplifyClient();
  const [storage, setStorage] = useState<any>();
  const {data: template, refetch} = useQuery({
    queryKey: ['templateDetail'],
    queryFn: async () => {
      const response = await amplifyClient?.models.Template.get({
        id: params["id"] as string,
      });

      return response?.data ?? null
    },
    enabled: false,
    initialData: null,
    
  })

  useEffect(() => {
    refetch()
  }, [params, amplifyClient, refetch])

  const { getTemplate, setTemplate } = React.useContext(TemplateContext);
  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      return await amplifyClient?.models.Template.update({
        id: params["id"] as string,
        name: getTemplate()?.name || "",
        content: JSON.stringify({ ...data, assets: [] }),
      }); 
    },
  });

  useEffect(() => {
    if (params.id && amplifyClient) {
      setStorage({
        async load() {
          
          if(template){
            setTemplate(template);
            return {
              ...template,
              content: template?.content
                ? JSON.parse(template.content)
                : {},
            };
          }
          return {
            content: {}
          }
        },

        async store(data: any) {
          return mutation.mutateAsync(data);
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  return (
    (storage) && (
      <Builder
        createPicture={false}
        createHtmlTemplate
        remoteStorage={storage}
      />
    )
  );
}
