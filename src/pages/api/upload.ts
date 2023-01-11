import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import type { NextApiRequest, NextApiResponse } from "next";

const s3Client = new S3Client({ region: "us-west-1" });
const Bucket = process.env.AWS_S3_BUCKET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const post = await createPresignedPost(s3Client, {
    Bucket,
    Key: req.query.file as string,
    Expires: 60,
  });
  res.status(200).send(post);
}
