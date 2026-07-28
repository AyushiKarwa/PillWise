import React, { useState } from 'react';
import { CabinetProvider, useCabinet } from './context/CabinetContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastNotification } from './components/ToastNotification';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { ConsumeModal } from './components/ConsumeModal';
import { RestockModal } from './components/RestockModal';
import { UserNameModal } from './components/UserNameModal';
import { AlarmModal } from './components/AlarmModal';
import { RingtoneSettingsModal } from './components/RingtoneSettingsModal';

import { DashboardPage } from './pages/DashboardPage';
import { MedicineCabinetPage } from './pages/MedicineCabinetPage';
import { AddMedicinePage } from './pages/AddMedicinePage';
import { ScanMedicinePage } from './pages/ScanMedicinePage';
import { PrescriptionReaderPage } from './pages/PrescriptionReaderPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { PriceComparisonPage } from './pages/PriceComparisonPage';
import { DrugInteractionPage } from './pages/DrugInteractionPage';
import { RemindersPage } from './pages/RemindersPage';
import { HistoryPage } from './pages/HistoryPage';
import { NearbyPharmaciesPage } from './pages/NearbyPharmaciesPage';
import { EmergencyPage } from './pages/EmergencyPage';

const AppContent: React.FC = () => {
  const {
    activeSection,
    activeAlarmReminder,
    setActiveAlarmReminder,
    isTestAlarm,
    customVoiceUrl,
    isRingtoneModalOpen,
    setIsRingtoneModalOpen,
    handleReminderAction,
    medicines,
    consumeMedicine,
    showToast
  } = useCabinet();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleTakeAlarmMedicine = async (reminder: any) => {
    // If medicine is in cabinet, consume 1 unit
    const matched = medicines.find(
      (m) => m.name.toLowerCase().trim() === reminder.medicineName.toLowerCase().trim()
    );
    if (matched) {
      await consumeMedicine(matched._id, 1, 'Taken via alarm reminder');
    } else {
      showToast(`Marked ${reminder.medicineName} as taken!`, 'success');
    }

    if (reminder._id && !reminder._id.startsWith('test-alarm')) {
      await handleReminderAction(reminder._id, 'taken');
    }
    setActiveAlarmReminder(null);
  };

  const handleSnoozeAlarm = async (reminder: any) => {
    showToast(`Snoozed alarm for 5 minutes ⏰`, 'info');
    if (reminder._id && !reminder._id.startsWith('test-alarm')) {
      await handleReminderAction(reminder._id, 'snooze');
    }
    setActiveAlarmReminder(null);
  };

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Medicine Cabinet':
        return <MedicineCabinetPage />;
      case 'Add Medicine':
        return <AddMedicinePage />;
      case 'AI Assistant':
        return <AiAssistantPage />;
      case 'Scan Medicine':
        return <ScanMedicinePage />;
      case 'Prescription Reader':
        return <PrescriptionReaderPage />;
      case 'Price Comparison':
        return <PriceComparisonPage />;
      case 'Drug Interaction Checker':
        return <DrugInteractionPage />;
      case 'Reminders':
        return <RemindersPage />;
      case 'History':
        return <HistoryPage />;
      case 'Nearby Pharmacies':
        return <NearbyPharmaciesPage />;
      case 'Emergency':
        return <EmergencyPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased flex flex-col lg:flex-row">
      {/* Toast Notification Container */}
      <ToastNotification />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Body View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentSection()}
        </main>
      </div>

      {/* Global Action Modals */}
      <MedicineDetailModal />
      <ConsumeModal />
      <RestockModal />
      <UserNameModal />

      {/* Active Phone Alarm Ringing Modal */}
      {activeAlarmReminder && (
        <AlarmModal
          reminder={activeAlarmReminder}
          customVoiceUrl={customVoiceUrl}
          isTest={isTestAlarm}
          onTake={handleTakeAlarmMedicine}
          onSnooze={handleSnoozeAlarm}
          onDismiss={() => setActiveAlarmReminder(null)}
        />
      )}

      {/* Custom Voice & Ringtone Settings Modal */}
      <RingtoneSettingsModal
        isOpen={isRingtoneModalOpen}
        onClose={() => setIsRingtoneModalOpen(false)}
        showToast={showToast}
      />
    </div>
  );
};

export default function App() {
  return (
    <CabinetProvider>
      <AppContent />
    </CabinetProvider>
  );
}
