export enum Language {
  ENGLISH = 'en',
  URDU = 'ur'
}

export enum RSVPSstatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined'
}

export interface Guest {
  id: string;
  name: string;
  village: string;
  phone: string;
  rsvp: RSVPSstatus;
  gender: 'Male' | 'Female' | 'Family';
  events: string[]; // Event IDs
}

export interface WeddingEvent {
  id: string;
  name: string;
  type: 'Mangni' | 'Dholki' | 'Mehndi' | 'Barat' | 'Walima' | 'Nikkah' | 'Other';
  date: string;
  venue: string;
  budget: number;
}

export interface Vendor {
  id: string;
  name: string;
  serviceType: string; // e.g., Catering, Decor, Photo
  cost: number;
  paidAmount: number;
  contact: string;
}

export interface Task {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  completed: boolean;
}

export interface Suit {
  id: string;
  owner: string;
  type: 'Suit' | 'Sherwani' | 'Maxi' | 'Waistcoat' | 'Lehenga';
  tailor: string;
  status: 'Fabric Bought' | 'At Tailor' | 'Ready' | 'Collected';
}

export interface GiftLog {
  id: string;
  guestName: string;
  amount: number;
  type: 'Salami' | 'Gift' | 'Nyoondrah';
  event: string;
  notes: string;
}

export interface AppData {
  guests: Guest[];
  events: WeddingEvent[];
  vendors: Vendor[];
  tasks: Task[];
  suits: Suit[];
  gifts: GiftLog[];
}

export interface NavItem {
  id: string;
  labelEn: string;
  labelUr: string;
  icon: React.ReactNode;
}