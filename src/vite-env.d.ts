/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_PUBLIC_MEDIA_FILE_DOMAIN
    readonly VITE_PUBLIC_CANVAS_PROXY
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }