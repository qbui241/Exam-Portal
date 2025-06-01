export interface User {
  id: number;
  username: string;
  password: string;
  enabled: boolean;
  fullName: string;
  gender: string | null;
  birthday: string | null;
  address: string;
  email: string;
  telephone: string | null;
  avatarUrl: string | null;
  school: string;
  className: string;
  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  userRoles: { id: number }[];
}
