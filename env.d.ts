/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VUE_APP_ADMIN_HOST: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
