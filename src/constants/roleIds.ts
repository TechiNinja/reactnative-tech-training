import { UserRoleType } from '../models/User';

export const ROLE_TO_ID: Record<UserRoleType, number> = {
  admin: 1,
  operations: 2,
  organizer: 3,
  participant: 4,
};

export const ID_TO_ROLE: Record<number, UserRoleType> = {
  1: 'admin',
  2: 'operations',
  3: 'organizer',
  4: 'participant',
};
