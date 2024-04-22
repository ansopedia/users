import jwt from 'jsonwebtoken';
import { JwtToken } from '../../api/v1/auth/auth.validation';
import { checkBearerToken, generateAccessToken, generateRefreshToken, verifyToken } from '../jwt.util';
import { envConstants } from '../../constants';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('Jwt token', () => {
  const mockPayload: JwtToken = {
    userId: '123',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should generate an access token', () => {
    generateAccessToken(mockPayload);
    expect(jwt.sign).toHaveBeenCalledWith(mockPayload, envConstants.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should generate a refresh token', () => {
    generateRefreshToken(mockPayload);
    expect(jwt.sign).toHaveBeenCalledWith(mockPayload, envConstants.JWT_SECRET, { expiresIn: '7d' });
  });

  it('should verify a token', () => {
    const mockToken = 'mockToken';
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
    const result = verifyToken(mockToken);
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, envConstants.JWT_SECRET);
    expect(result).toEqual(mockPayload);
  });

  it('should check a bearer token', () => {
    const mockToken = 'mockToken';
    const result = checkBearerToken(`Bearer ${mockToken}`);
    expect(result).toEqual(mockToken);
  });

  it('should return false if bearer token is not formatted correctly', () => {
    const mockToken = 'mockToken';
    const result = checkBearerToken(mockToken);
    expect(result).toEqual(false);
  });
});

describe('verifyToken', () => {
  const validToken = jwt.sign({ someData: 'payload' }, 'your_secret_key'); // Generate a valid token

  it('should return the decoded payload for a valid token', () => {
    (jwt.verify as jest.Mock).mockReturnValue({ someData: 'payload' }); // Mock successful verification

    const decodedPayload = verifyToken(validToken);
    expect(decodedPayload).toEqual({ someData: 'payload' });
  });
});
