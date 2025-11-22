# DonaAyuda - Frontend

Este es el prototipo del frontend relacionado al sistema de donaciones transparentes y auditables para rescate animal en Argentina.

## Requisitos Previos

⚠️ **IMPORTANTE**: Para que la aplicación funcione correctamente, es necesario tener el backend levantado y funcionando.

Por defecto, el frontend espera que el backend esté disponible en `http://localhost:9999`. Puedes configurar esta URL mediante la variable de entorno `NEXT_PUBLIC_API_URL`.

Sin el backend en ejecución, la aplicación no podrá funcionar ya que todas las funcionalidades dependen de la API.

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:9999
```

## Comenzando

Primero, instala las dependencias:

```bash
npm install
```

Luego, inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

Puedes comenzar a editar la página modificando `app/page.tsx`. La página se actualiza automáticamente mientras editas el archivo.

## Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter para verificar el código


## Stack Tecnológico

Este proyecto está construido con [Next.js](https://nextjs.org) utilizando [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- **Framework**: Next.js 15.2.4 con App Router
- **Frontend**: React 19 + TypeScript
- **Estilos**: TailwindCSS v4 con componentes shadcn/ui
- **Componentes UI**: Radix UI primitives + Lucide React icons
- **Autenticación**: JWT con cookies HTTP-only
- **Fetching de Datos**: SWR para datos del lado del cliente

