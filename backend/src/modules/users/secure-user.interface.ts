export interface SecureUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'student' | 'lecturer' | 'kaprodi' | 'dekan' | 'admin' | 'alumni' | 'baak' | 'bauk' | 'applicant';
  phone: string;
  department: string;
  passwordHash: string;
  hashingAlgo: 'argon2' | 'bcrypt';
}
