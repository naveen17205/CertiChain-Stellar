export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: any; // Firestore Timestamp
  institutionId: string;
  institutionName: string;
  stellarTxHash: string;
  status: 'issued' | 'revoked';
}

export interface Institution {
  id: string;
  name: string;
  email: string;
  publicKey?: string;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}
