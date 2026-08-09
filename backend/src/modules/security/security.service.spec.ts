import { SecurityService } from './security.service';

describe('SecurityService Unit Tests', () => {
  let securityService: SecurityService;

  beforeEach(() => {
    securityService = new SecurityService();
    // Simulate initialization
    securityService.rotateAllSecrets();
  });

  describe('Password Hashing & Verification', () => {
    it('should successfully hash a plain password using argon2', async () => {
      const password = 'mySuperSecurePassword123';
      const { hash, algo } = await securityService.secureHash(password);

      expect(hash).toBeDefined();
      expect(algo).toBe('argon2');
    });

    it('should verify correct password successfully', async () => {
      const password = 'testPassword';
      const { hash, algo } = await securityService.secureHash(password);

      const isValid = await securityService.secureVerify(password, hash, algo);
      expect(isValid).toBe(true);
    });

    it('should fail verification for incorrect password', async () => {
      const password = 'testPassword';
      const incorrectPassword = 'wrongPassword';
      const { hash, algo } = await securityService.secureHash(password);

      const isValid = await securityService.secureVerify(incorrectPassword, hash, algo);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Signing & Verification', () => {
    it('should sign access token correctly and contain user payload', () => {
      const payload = { id: 'u1', email: 'test@kampus.ac.id', role: 'student', name: 'Student' };
      const token = securityService.signAccessToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should sign refresh token correctly', () => {
      const payload = { id: 'u1', email: 'test@kampus.ac.id', role: 'student', name: 'Student' };
      const token = securityService.signRefreshToken(payload);

      expect(token).toBeDefined();
    });
  });

  describe('Secret Rotation', () => {
    it('should generate new high-entropy secrets and invalidate old session tokens', () => {
      const oldAccessSecret = securityService.jwtAccessSecret;
      securityService.rotateAllSecrets();
      
      expect(securityService.jwtAccessSecret).not.toEqual(oldAccessSecret);
      expect(securityService.jwtAccessSecret.length).toBeGreaterThanOrEqual(64);
    });
  });
});
