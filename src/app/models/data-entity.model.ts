export interface Lawyer {
  uuid: string;
  userName: string;
  governmentId: string;
  pricing: number;
}


export interface SlotOpening {
  id: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  lawyer: {
    uuid: string;
    userName: string;
  };
  bookedBy: {
    id: string;
    username: string;
  } | null;
  workingDate: string;
  slot: {
    id: string;
    time: string;
  };
  status: 'OPEN' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
}