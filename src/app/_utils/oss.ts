import OSS from "ali-oss";

export const ossClient = new OSS({
  region: "oss-cn-shenzhen",
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID!,
  accessKeySecret: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET!,
  stsToken: process.env.NEXT_PUBLIC_STS_TOKEN!,
  bucket: process.env.NEXT_PUBLIC_BUCKET!,
});