import { Injectable, BadRequestException } from '@nestjs/common';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../config/aws.config';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No video file provided');
    }

    const key = `videos/${Date.now()}-${file.originalname}`;

    // Stream the file to S3 for large uploads
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: file.stream || file.buffer, // Prefer stream if available
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    return key;
  }
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const key = `images/${Date.now()}-${file.originalname}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: file.stream || file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    return key;
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const daya = getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('daya', daya);
    return daya;
  }
}
