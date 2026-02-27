export type UserRoleType = 'admin' | 'organizer' | 'participant' | 'operations';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  isActive: boolean;
}
