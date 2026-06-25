import { loginSchema, registerSchema } from './validation';

describe('loginSchema', () => {
  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'pasEmail', password: 'password123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: '123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password');
    }
  });

  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: 'motdepasse123' });
    expect(result.success).toBe(true);
  });
});

describe('registerSchema', () => {
  const valid = {
    username:        'thomas_gg',
    email:           'test@test.com',
    password:        'motdepasse123',
    confirmPassword: 'motdepasse123',
  };

  it('rejects a username shorter than 3 characters', () => {
    const result = registerSchema.safeParse({ ...valid, username: 'ab' });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'different' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });
});
