// Demo data for the dashboard
export const DEMO_STATS = {
  appointments: {
    today: 8,
    upcoming: 24,
    total: 120
  },
  patients: {
    total: 342,
    new: 18
  },
  revenue: {
    today: 1250,
    thisMonth: 28750,
    outstanding: 4500
  },
  telehealth: {
    upcoming: 12
  }
};

export const DEMO_UPCOMING_APPOINTMENTS = [
  {
    id: 'apt-1',
    patientName: 'Sarah Johnson',
    patientId: 'pat-1',
    date: new Date().toISOString(),
    time: '10:00 AM',
    type: 'Check-up',
    status: 'confirmed',
    isVirtual: true
  },
  {
    id: 'apt-2',
    patientName: 'Michael Williams',
    patientId: 'pat-2',
    date: new Date(new Date().getTime() + 3600000).toISOString(),
    time: '11:30 AM',
    type: 'Follow-up',
    status: 'confirmed',
    isVirtual: false
  },
  {
    id: 'apt-3',
    patientName: 'David Brown',
    patientId: 'pat-3',
    date: new Date(new Date().getTime() + 7200000).toISOString(),
    time: '2:00 PM',
    type: 'Consultation',
    status: 'pending',
    isVirtual: true
  },
  {
    id: 'apt-4',
    patientName: 'Emma Davis',
    patientId: 'pat-4',
    date: new Date(new Date().getTime() + 10800000).toISOString(),
    time: '3:30 PM',
    type: 'Check-up',
    status: 'confirmed',
    isVirtual: false
  }
];

export const DEMO_RECENT_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Sarah Johnson',
    age: 42,
    gender: 'Female',
    lastVisit: new Date(new Date().getTime() - 7 * 24 * 3600000).toISOString(),
    condition: 'Hypertension'
  },
  {
    id: 'pat-2',
    name: 'Michael Williams',
    age: 35,
    gender: 'Male',
    lastVisit: new Date(new Date().getTime() - 14 * 24 * 3600000).toISOString(),
    condition: 'Diabetes'
  },
  {
    id: 'pat-3',
    name: 'David Brown',
    age: 28,
    gender: 'Male',
    lastVisit: new Date(new Date().getTime() - 3 * 24 * 3600000).toISOString(),
    condition: 'Asthma'
  }
];
