import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Medicine,
  MedicineHistoryItem,
  AiHistoryItem,
  ReminderItem,
  AiStructuredResponse,
  DrugInteractionResult,
  PrescriptionExtraction
} from '../types';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface CabinetContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  medicines: Medicine[];
  consumptionHistory: MedicineHistoryItem[];
  aiHistory: AiHistoryItem[];
  reminders: ReminderItem[];
  loading: boolean;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Modals & Selection
  selectedMedicineForDetail: Medicine | null;
  setSelectedMedicineForDetail: (m: Medicine | null) => void;
  selectedMedicineForConsume: Medicine | null;
  setSelectedMedicineForConsume: (m: Medicine | null) => void;
  selectedMedicineForRestock: Medicine | null;
  setSelectedMedicineForRestock: (m: Medicine | null) => void;
  
  // Quick prefill query
  symptomQuery: string;
  setSymptomQuery: (query: string) => void;
  priceCheckMedicine: string;
  setPriceCheckMedicine: (name: string) => void;

  // User Profile Name
  userName: string;
  setUserName: (name: string) => void;
  showNamePrompt: boolean;
  setShowNamePrompt: (show: boolean) => void;

  // Active Phone Alarm & Ringtone Modal State
  activeAlarmReminder: ReminderItem | null;
  setActiveAlarmReminder: (reminder: ReminderItem | null) => void;
  isTestAlarm: boolean;
  triggerTestAlarm: (reminder?: ReminderItem) => void;
  isRingtoneModalOpen: boolean;
  setIsRingtoneModalOpen: (open: boolean) => void;
  customVoiceUrl: string | null;

  // Actions
  fetchMedicines: () => Promise<void>;
  addMedicine: (data: Partial<Medicine>) => Promise<Medicine | null>;
  updateMedicine: (id: string, updates: Partial<Medicine>) => Promise<Medicine | null>;
  deleteMedicine: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<void>;
  consumeMedicine: (id: string, qty: number, notes?: string) => Promise<void>;
  restockMedicine: (id: string, amount: number) => Promise<void>;
  
  // Reminders
  addReminder: (data: Partial<ReminderItem>) => Promise<ReminderItem | null>;
  updateReminder: (id: string, updates: Partial<ReminderItem>) => Promise<ReminderItem | null>;
  handleReminderAction: (id: string, action: 'taken' | 'snooze' | 'reset') => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;

  // AI & Services
  evaluateSymptoms: (symptoms: string) => Promise<AiStructuredResponse | null>;
  scanMedicineOcr: (image?: string, rawText?: string) => Promise<any>;
  parsePrescriptionOcr: (image?: string, rawText?: string) => Promise<any>;
  checkInteractions: (medicines: string[]) => Promise<DrugInteractionResult | null>;
}

const CabinetContext = createContext<CabinetContextType | undefined>(undefined);

export const CabinetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<string>('Dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [consumptionHistory, setConsumptionHistory] = useState<MedicineHistoryItem[]>([]);
  const [aiHistory, setAiHistory] = useState<AiHistoryItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [selectedMedicineForDetail, setSelectedMedicineForDetail] = useState<Medicine | null>(null);
  const [selectedMedicineForConsume, setSelectedMedicineForConsume] = useState<Medicine | null>(null);
  const [selectedMedicineForRestock, setSelectedMedicineForRestock] = useState<Medicine | null>(null);
  
  const [symptomQuery, setSymptomQuery] = useState<string>('');
  const [priceCheckMedicine, setPriceCheckMedicine] = useState<string>('Dolo 650');

  // User Name State with localStorage persistence
  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem('pillwise_user_name') || '';
  });

  const [showNamePrompt, setShowNamePrompt] = useState<boolean>(() => {
    // Show prompt on starting if user hasn't set or dismissed name prompt
    return !localStorage.getItem('pillwise_name_prompted');
  });

  const setUserName = (name: string) => {
    const trimmed = name.trim();
    setUserNameState(trimmed);
    localStorage.setItem('pillwise_user_name', trimmed);
    localStorage.setItem('pillwise_name_prompted', 'true');
  };

  // Alarm & Ringtone State
  const [activeAlarmReminder, setActiveAlarmReminder] = useState<ReminderItem | null>(null);
  const [isTestAlarm, setIsTestAlarm] = useState<boolean>(false);
  const [isRingtoneModalOpen, setIsRingtoneModalOpen] = useState<boolean>(false);
  const [triggeredMinuteMap, setTriggeredMinuteMap] = useState<Record<string, string>>({});

  const customVoiceUrl = typeof window !== 'undefined' ? localStorage.getItem('pillwise_custom_ringtone') : null;

  const triggerTestAlarm = (customRem?: ReminderItem) => {
    setIsTestAlarm(true);
    if (customRem) {
      setActiveAlarmReminder(customRem);
    } else {
      setActiveAlarmReminder({
        _id: 'test-alarm-' + Date.now(),
        medicineName: 'Dolo 650mg',
        dosage: '1 Tablet after meals',
        purpose: 'Fever & Pain relief',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        repeat: 'Daily',
        completed: false
      });
    }
  };

  // Real-time alarm checker running every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strHours = hours < 10 ? '0' + hours : '' + hours;
      const strMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
      const current12 = `${strHours}:${strMinutes} ${ampm}`; // e.g. "08:30 AM"
      const current24 = `${now.getHours().toString().padStart(2, '0')}:${strMinutes}`; // e.g. "08:30" or "20:30"

      if (activeAlarmReminder) return; // already ringing

      reminders.forEach((r) => {
        if (r.completed) return;
        const rTime = (r.time || r.timeString || '').trim();
        if (!rTime) return;

        // Compare time strings flexible (12-hr or 24-hr)
        const isMatch = rTime === current12 || rTime === current24 || rTime.toLowerCase() === current12.toLowerCase();

        const minuteKey = `${r._id}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

        if (isMatch && triggeredMinuteMap[r._id] !== minuteKey) {
          setTriggeredMinuteMap((prev) => ({ ...prev, [r._id]: minuteKey }));
          setIsTestAlarm(false);
          setActiveAlarmReminder(r);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reminders, activeAlarmReminder, triggeredMinuteMap]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Fetch
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [medRes, histRes, aiHistRes, remRes] = await Promise.all([
        fetch('/api/medicines').then((r) => r.json()),
        fetch('/api/history/consumption').then((r) => r.json()),
        fetch('/api/history/ai').then((r) => r.json()),
        fetch('/api/reminders').then((r) => r.json())
      ]);

      if (medRes.success) setMedicines(medRes.data);
      if (histRes.success) setConsumptionHistory(histRes.data);
      if (aiHistRes.success) setAiHistory(aiHistRes.data);
      if (remRes.success) setReminders(remRes.data);
    } catch (err) {
      console.error('Failed to load initial cabinet data:', err);
      showToast('Connecting to PillWise cabinet server...', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/medicines').then((r) => r.json());
      if (res.success) setMedicines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addMedicine = async (data: Partial<Medicine>) => {
    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then((r) => r.json());

      if (res.success) {
        showToast(`Saved "${res.data.name}" to Medicine Cabinet!`, 'success');
        await fetchMedicines();
        return res.data;
      } else {
        showToast(res.error || 'Failed to add medicine', 'error');
      }
    } catch (err) {
      showToast('Error saving medicine to database', 'error');
    }
    return null;
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    try {
      const res = await fetch(`/api/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).then((r) => r.json());

      if (res.success) {
        showToast('Updated medicine details.', 'success');
        await fetchMedicines();
        return res.data;
      }
    } catch (err) {
      showToast('Error updating medicine', 'error');
    }
    return null;
  };

  const deleteMedicine = async (id: string) => {
    try {
      const med = medicines.find(m => m._id === id);
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res.success) {
        showToast(`Removed "${med?.name || 'Medicine'}" from cabinet.`, 'info');
        setMedicines((prev) => prev.filter((m) => m._id !== id));
        return true;
      }
    } catch (err) {
      showToast('Error deleting medicine', 'error');
    }
    return false;
  };

  const toggleFavorite = async (id: string) => {
    try {
      const res = await fetch(`/api/medicines/${id}/favorite`, { method: 'PATCH' }).then((r) => r.json());
      if (res.success) {
        setMedicines((prev) =>
          prev.map((m) => (m._id === id ? { ...m, favorite: res.data.favorite } : m))
        );
        showToast(res.data.favorite ? 'Marked as favorite ⭐' : 'Removed from favorites', 'info');
      }
    } catch (err) {
      showToast('Failed to update favorite', 'error');
    }
  };

  const consumeMedicine = async (id: string, qty: number, notes?: string) => {
    try {
      const res = await fetch(`/api/medicines/${id}/consume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantityTaken: qty, notes })
      }).then((r) => r.json());

      if (res.success) {
        showToast(`Logged intake of ${qty} dose(s). Remaining: ${res.data.medicine.quantity}`, 'success');
        // Update local state
        setMedicines((prev) => prev.map((m) => (m._id === id ? res.data.medicine : m)));
        setConsumptionHistory((prev) => [res.data.history, ...prev]);
      }
    } catch (err) {
      showToast('Failed to record medicine intake', 'error');
    }
  };

  const restockMedicine = async (id: string, amount: number) => {
    try {
      const res = await fetch(`/api/medicines/${id}/restock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      }).then((r) => r.json());

      if (res.success) {
        showToast(`Restocked +${amount} units. New Total: ${res.data.quantity}`, 'success');
        setMedicines((prev) => prev.map((m) => (m._id === id ? res.data : m)));
      }
    } catch (err) {
      showToast('Failed to restock medicine', 'error');
    }
  };

  const addReminder = async (data: Partial<ReminderItem>) => {
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then((r) => r.json());

      if (res.success) {
        showToast(`Created ${data.timings || data.repeat || 'Daily'} reminder for ${data.medicineName}`, 'success');
        setReminders((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      showToast('Failed to set reminder', 'error');
    }
    return null;
  };

  const updateReminder = async (id: string, updates: Partial<ReminderItem>) => {
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).then((r) => r.json());

      if (res.success) {
        showToast(`Updated reminder for ${res.data.medicineName}`, 'success');
        setReminders((prev) => prev.map((r) => (r._id === id ? res.data : r)));
        return res.data;
      }
    } catch (err) {
      showToast('Failed to update reminder', 'error');
    }
    return null;
  };

  const handleReminderAction = async (id: string, action: 'taken' | 'snooze' | 'reset') => {
    try {
      const res = await fetch(`/api/reminders/${id}/action`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      }).then((r) => r.json());

      if (res.success) {
        if (action === 'taken') {
          showToast('Marked reminder as Taken! Quantity updated.', 'success');
          await fetchMedicines();
          const histRes = await fetch('/api/history/consumption').then((r) => r.json());
          if (histRes.success) setConsumptionHistory(histRes.data);
        } else if (action === 'snooze') {
          showToast('Reminder snoozed for 15 minutes ⏰', 'info');
        } else {
          showToast('Reminder reset for today.', 'info');
        }

        setReminders((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      }
    } catch (err) {
      showToast('Failed to process reminder action', 'error');
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const res = await fetch(`/api/reminders/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res.success) {
        showToast('Reminder deleted', 'info');
        setReminders((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      showToast('Failed to delete reminder', 'error');
    }
  };

  const evaluateSymptoms = async (symptoms: string) => {
    try {
      const res = await fetch('/api/ai/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      }).then((r) => r.json());

      if (res.success) {
        // Refresh AI history
        const histRes = await fetch('/api/history/ai').then((r) => r.json());
        if (histRes.success) setAiHistory(histRes.data);
        return res.data;
      }
    } catch (err) {
      showToast('Error contacting PillWise AI', 'error');
    }
    return null;
  };

  const scanMedicineOcr = async (image?: string, rawText?: string) => {
    try {
      const res = await fetch('/api/ai/scan-medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, rawText })
      }).then((r) => r.json());

      if (res.success) return res.data;
    } catch (err) {
      showToast('OCR scanning error', 'error');
    }
    return null;
  };

  const parsePrescriptionOcr = async (image?: string, rawText?: string) => {
    try {
      const res = await fetch('/api/ai/parse-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, rawText })
      }).then((r) => r.json());

      if (res.success) return res.data;
    } catch (err) {
      showToast('Prescription OCR error', 'error');
    }
    return null;
  };

  const checkInteractions = async (medicinesList: string[]) => {
    try {
      const res = await fetch('/api/ai/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: medicinesList })
      }).then((r) => r.json());

      if (res.success) return res.data;
    } catch (err) {
      showToast('Error checking drug interactions', 'error');
    }
    return null;
  };

  return (
    <CabinetContext.Provider
      value={{
        activeSection,
        setActiveSection,
        medicines,
        consumptionHistory,
        aiHistory,
        reminders,
        loading,
        toasts,
        showToast,
        removeToast,
        selectedMedicineForDetail,
        setSelectedMedicineForDetail,
        selectedMedicineForConsume,
        setSelectedMedicineForConsume,
        selectedMedicineForRestock,
        setSelectedMedicineForRestock,
        symptomQuery,
        setSymptomQuery,
        priceCheckMedicine,
        setPriceCheckMedicine,
        userName,
        setUserName,
        showNamePrompt,
        setShowNamePrompt,
        activeAlarmReminder,
        setActiveAlarmReminder,
        isTestAlarm,
        triggerTestAlarm,
        isRingtoneModalOpen,
        setIsRingtoneModalOpen,
        customVoiceUrl,
        fetchMedicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        toggleFavorite,
        consumeMedicine,
        restockMedicine,
        addReminder,
        updateReminder,
        handleReminderAction,
        deleteReminder,
        evaluateSymptoms,
        scanMedicineOcr,
        parsePrescriptionOcr,
        checkInteractions
      }}
    >
      {children}
    </CabinetContext.Provider>
  );
};

export const useCabinet = () => {
  const context = useContext(CabinetContext);
  if (!context) {
    throw new Error('useCabinet must be used within a CabinetProvider');
  }
  return context;
};
