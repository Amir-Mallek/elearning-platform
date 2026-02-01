import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  preferences?: string;
  notificationsEnabled?: boolean;
}
