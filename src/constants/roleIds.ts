import { UserRoleType } from '../models/User';

export const ROLE_TO_ID: Record<UserRoleType, number> = {
  admin: 1,
  organizer: 2,
  participant: 3,
  operations: 4,
};

export const ID_TO_ROLE: Record<number, UserRoleType> = {
  1: 'admin',
  2: 'organizer',
  3: 'participant',
  4: 'operations',
};
