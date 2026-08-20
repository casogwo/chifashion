import { createUploadthing } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),
};
