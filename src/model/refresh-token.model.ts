type RefreshTokenModel = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isConsumed: boolean;
  isRevoked: boolean;
};

export default RefreshTokenModel;
