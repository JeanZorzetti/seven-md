import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getAdminSession } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: '4MB', maxFileCount: 8 } })
    .middleware(async () => {
      const session = await getAdminSession()
      if (!session) throw new Error('Unauthorized')
      return { userId: session.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
