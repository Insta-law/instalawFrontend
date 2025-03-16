export interface LawyerSearch {
  uuid: string;
  userName: string;
  governmentId: string;
  pricing: number;
  availableSlots?: {
    date: string;
    slots: string[];
  }[];
}