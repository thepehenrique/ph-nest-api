import { Request } from 'express';
import { UserEntity } from '../../users/entities/users.entity';

export interface AuthenticatedRequest extends Request {
  user: UserEntity;
}
