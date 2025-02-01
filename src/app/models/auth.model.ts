export interface SignupRequestDto {
  email: string;
  username: string;
  phone: string;
  password: string;
  roleName: string;
  governmentId?: string; // Optional for lawyers
  pricing?: number; // Optional for lawyers
}

export interface AuthenticatedUserDetails {
  id: string;
  email: string;
  username: string;
  phone: string;
  role: {
    id: number;
    roleName: string;
  };
}
