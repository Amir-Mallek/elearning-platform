export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issueDate: Date;
  credentialId: string;
  certificateUrl: string;
  thumbnailUrl: string;
  verificationUrl: string;
  expiryDate?: Date;
  grade?: number;
  skills?: string[];
}
