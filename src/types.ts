export interface Medicine {
  _id: string;
  name: string;
  quantity: number;
  dosage: string;
  expiryDate: string; // YYYY-MM-DD
  formType?: 'Tablet' | 'Capsule' | 'Syrup' | 'Ointment' | 'Cream' | 'Gel' | 'Drops' | 'Injection' | 'Other';
  salt?: string;
  purpose?: string;
  image?: string;
  favorite: boolean;
  lowStockThreshold: number;
  createdAt?: string;
  uses?: string[];
  sideEffects?: string[];
  storageInfo?: string;
  precautions?: string[];
  alternatives?: string[];
}

export interface MedicineHistoryItem {
  _id: string;
  medicineId: string;
  medicineName: string;
  quantityTaken: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  createdAt?: string;
}

export interface AiHistoryItem {
  _id: string;
  symptoms: string;
  aiResponse: AiStructuredResponse;
  timestamp: string;
}

export interface ReminderItem {
  _id: string;
  medicineId?: string;
  medicineName: string;
  time: string; // e.g. "08:00 AM" or "08:00"
  dosage: string; // e.g. "1 Tablet after food"
  purpose?: string; // e.g. "Fever / Headache relief"
  repeat?: string; // e.g. "Daily", "Every 8 hours", "Mon, Wed, Fri", "Weekly", "As Needed"
  timings?: string;
  timeString?: string;
  dosageToTake?: number;
  completed: boolean;
  lastTakenDate?: string;
  notes?: string;
}

export interface AvailableMedicineMatch {
  matched: boolean;
  name?: string;
  quantity?: number;
  dosage?: string;
  expiryDate?: string;
  commonUse?: string;
}

export interface OtcOption {
  name: string;
  purpose: string;
  generalDosage: string;
  precautions: string;
}

export interface AiStructuredResponse {
  possibleCause: string[];
  availableMedicine: AvailableMedicineMatch;
  homeCare: string[];
  doctorWarning: string[];
  needToBuy: boolean;
  otcOptions: OtcOption[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  structuredResponse?: AiStructuredResponse;
  timestamp: string;
  quickActionMedicine?: string;
}

export interface PriceOffer {
  pharmacyName: 'Apollo Pharmacy' | 'Tata 1mg' | 'Netmeds' | 'PharmEasy' | string;
  logoUrl?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  deliveryTime: string;
  inStock: boolean;
  buyUrl: string;
}

export interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  openNow: boolean;
  rating: number;
  lat: number;
  lng: number;
  operatingHours: string;
}

export interface PrescriptionExtraction {
  medicineName: string;
  dosage: string;
  duration: string;
  frequency: string;
  purpose?: string;
  salt?: string;
  quantityToBuy?: number;
}

export interface DrugInteractionResult {
  riskLevel: 'Low' | 'Moderate' | 'Severe' | 'Safe';
  summary: string;
  interactions: {
    pair: [string, string];
    effect: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    advice: string;
  }[];
  disclaimer: string;
}
