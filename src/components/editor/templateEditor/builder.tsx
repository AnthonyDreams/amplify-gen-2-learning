/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable react-hooks/exhaustive-deps */
import grapesjs, { Editor, IStorage, usePlugin } from "grapesjs";
import React, { useEffect, useState } from "react";
import "grapesjs/dist/css/grapes.min.css";
import html2canvas from "html2canvas";
import grapesJSMJML from "grapesjs-mjml";
import BasicBlocs from "grapesjs-blocks-basic/dist/index";
import { v4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import TemplateManager from "../manager/template-manager";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { list, uploadData, remove } from "aws-amplify/storage";
import EditCodeplugin from '@/lib/builder/editCodeplugin'
import { useUserAttribute } from "@/hooks/useUserAttribute";
import { useAmplifyClient } from "@/hooks/useAmplifyClient";

interface TemplateEditorProps extends React.PropsWithChildren {
  remoteStorage: IStorage;
  createPicture?: boolean;
  createHtmlTemplate?: boolean;
}

export default function Builder(props: TemplateEditorProps) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isTemplateManagerOpen, openTemplateManager] = React.useState(false);
  const location = useLocation();
  const params = useParams();
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const {attributes:userAttributes} = useUserAttribute()
  const { toast } = useToast();
  const {client:amplifyClient} = useAmplifyClient() 

  useEffect(() => {
    if (snackBarMessage) {
      toast({
        description: snackBarMessage,
        duration: 3000,
        variant: snackBarMessage.startsWith("File: ") ? "destructive" : undefined,
      });
    }
  }, [snackBarMessage]);
  const mediaFileReponse = (files: any[]) =>
    files.map((file: any) => ({
      src: `${import.meta.env.VITE_PUBLIC_MEDIA_FILE_DOMAIN}/${file.key}`,
    }));

  const uploadFileMutation = useMutation({
    mutationFn: (uploadPromise: Promise<any>) => uploadPromise,
  });

  const { refetch, data:files } = useQuery({
    queryKey: ["myFiles"],
    queryFn: async () => {
      const response = await list({ prefix: "media/" });
      return response.items ?? [];
    },
    initialData: [],
    enabled: false,
  });

  

  useEffect(() => {
    if(files){
      editor?.AssetManager.add(mediaFileReponse(files))
    }
  }, [files])

  const handleCloseTemplateManager = () => openTemplateManager(false);
  const plugins = [
    usePlugin(grapesJSMJML, {}),
    usePlugin(BasicBlocs, {
      category: "Raw Html",
    }),
    usePlugin(EditCodeplugin, {}),
  ];

  useEffect(() => {
    refetch();
  }, [location]);

  useEffect(() => {
    const builder = grapesjs.init({
      container: "#gjs",
      plugins,
      assetManager: {
        upload: "/api/files",
        beforeUpload: (files: FileList) => {
          const sizeLimit = 4100000;
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > sizeLimit) {
              setSnackBarMessage(`File: ${file.name} is more than 4mb`);
              return false;
            }
          }
          return undefined;
        },
        async uploadFile(e: any) {
          const files = e.target?.files;
          const uploadingPromises = [];
          if (files) {
            for (let i = 0; i < files.length; i++) {
              uploadingPromises.push(
                uploadData({
                  key: `media/${v4()}-${files[i].name}`,
                  data: files[i],
                  options: {
                    accessLevel: 'guest'
                  }
                })
              );
            }
            const resuls = mediaFileReponse(
              await Promise.all(uploadingPromises)
            );
            builder.AssetManager.add(resuls);
            return resuls;
          }
          return [];
        },
      },
      pageManager: {
        pages: [
          {
            component: `
            <mjml>
            <mj-body>
              <mj-section>
                <mj-column>
                  <mj-text>My template</mj-text>
                </mj-column>
              </mj-section>
            </mj-body>
          </mjml>`,
          },
        ],
      },
      storageManager: {
        autoload: false,
        stepsBeforeSave: 3,
        options: {
          remote: {
            onLoad: (result) => result.content,
          },
        },
      },
    });
    builder.Commands.add("open-templates", {
      run() {
        openTemplateManager(true);
      },
    });

    builder.Commands.add("save-templates", {
      async run(runningEditor: Editor) {
        await runningEditor.Storage.store({
          ...runningEditor.getProjectData(),
          assets: [],
        });
        const html = runningEditor.getWrapper()?.getEl();
        if (html && props.createPicture) {
          const referenceElement = html
            .querySelectorAll("div[data-gjs-type=mj-column]")[0]
            .getBoundingClientRect();
          setSnackBarMessage("Uploading preview...");
          html2canvas(html, {
            proxy: import.meta.env.VITE_PUBLIC_CANVAS_PROXY,
            width: referenceElement?.width,
            x: referenceElement?.x,
          }).then((canvas: HTMLCanvasElement) => {
            canvas.toBlob(
              (blob) => {
                if(blob){
                  uploadData({
                    key: `preview/${params['id']}.jpg`, 
                    data: blob,
                    options: {
                      accessLevel: 'guest',
                    }
                  }).result.then(() => setSnackBarMessage(""));
                }
              },
              "image/jpg",
              0.7
            );
          });
        }

        if (props.createHtmlTemplate && userAttributes) {
          const code = runningEditor.runCommand("mjml-code-to-html");
          const template = await amplifyClient?.models.Template.get({
            id: params['id'] as string
          })
          if (template) {
            console.log('asd')
            const uploading = uploadData(
              {
                key: `html/${userAttributes["custom:workspace"]}/${template.data.slug}.html`,
                data:  new Blob([code.html], { type: "text/html" }),
                options: {
                  contentType: "text/html"
                }
              }
            );

            await uploading.result
          }
        }
      },
    });

    builder.on("load", async ({ editor: loadedEditor }: { editor: Editor }) => {
      loadedEditor.Storage.setCurrent("remote");
      loadedEditor.Storage.add("remote", props.remoteStorage);
      await builder.Storage.load().then((projectData) =>
        builder.loadProjectData(projectData)
      );
      await refetch();
    });

    builder.on("update", () => {
      const element = document.getElementById("save-button");
      element?.classList.add("badge");
    });

    builder.on("storage:store", () => {
      const element = document.getElementById("save-button");
      element?.classList.remove("badge");
      if (!props.createPicture) {
        setSnackBarMessage("Changes saved");
      }
    });

    builder.on("asset:remove", async (asset: any) => {
      const url = new URL(asset.attributes.src);
      await remove({key: url.pathname.substring(1)});
    });

    builder.on("asset:upload:start", async () => {
      const uploadPromise = new Promise((res) => {
        builder.on("asset:upload:response", res);
      });
      await uploadFileMutation.mutateAsync(uploadPromise);
    });

    const pn = builder.Panels;

    pn.addButton("options", {
      id: "open-templates",
      className: "fa fa-file-text gjs-pn-btn",
      attributes: {
        style: "font-size: 17px;",
        title: "Open projects and templates",
      },
      command: "open-templates", // Open modal
    });
    pn.addButton("options", {
      id: "save-templates",
      className: "fa fa-save gjs-pn-btn",
      attributes: {
        id: "save-button",
        style: "font-size: 19px;",
        title: "save projects and templates",
      },
      command: "save-templates",
    });
    builder?.Panels?.getButton("options", "sw-visibility")?.set("active", true);
    setEditor(builder);
    return () => {
      editor?.destroy();
    };
  }, [props.remoteStorage]);

  return (
    <>
      <div id="gjs" style={{ position: "absolute", top: "0" }} />
      <TemplateManager
        open={isTemplateManagerOpen}
        handleClose={handleCloseTemplateManager}
        editor={editor}
      />
    </>
  );
}
