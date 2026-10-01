export const INITIAL_STOCKS = [
  { group: 'O-', units: 3, target: 15, status: 'Critical', trend: 'Emergency Outflow', hospital: 'KEM Regional Blood Bank' },
  { group: 'O+', units: 34, target: 45, status: 'Stable', trend: 'Normal Demand', hospital: 'Central Red Cross Hub' },
  { group: 'A-', units: 6, target: 16, status: 'Low', trend: 'Maternal Ward Need', hospital: 'District Civil Hospital' },
  { group: 'A+', units: 28, target: 35, status: 'Stable', trend: 'Balanced', hospital: 'City Care Medical Center' },
  { group: 'B-', units: 4, target: 14, status: 'Critical', trend: 'Trauma Alert', hospital: 'KEM Regional Blood Bank' },
  { group: 'B+', units: 31, target: 35, status: 'Stable', trend: 'Normal Demand', hospital: 'Suburban Blood Bank' },
  { group: 'AB-', units: 2, target: 10, status: 'Critical', trend: 'Rare Reserve', hospital: 'Regional Trauma Center' },
  { group: 'AB+', units: 19, target: 22, status: 'Stable', trend: 'Balanced', hospital: 'Central Red Cross Hub' }
]

export const INITIAL_EMERGENCIES = [
  {
    id: 'REQ-8492',
    hospital: 'KEM Hospital Trauma Care',
    bloodGroup: 'O-',
    component: 'Packed RBC',
    units: 3,
    urgency: 'Critical',
    radius: '0-2 km Ring',
    matchedDonors: 5,
    eta: '11 mins',
    status: 'Dispatched',
    temp: '3.8°C',
    boxId: 'SBB-104'
  },
  {
    id: 'REQ-8495',
    hospital: 'District Civil Maternity Wing',
    bloodGroup: 'A-',
    component: 'Fresh Frozen Plasma',
    units: 2,
    urgency: 'High',
    radius: '2-5 km Ring',
    matchedDonors: 8,
    eta: '18 mins',
    status: 'Donor Mobilized',
    temp: '4.1°C',
    boxId: 'SBB-209'
  },
  {
    id: 'REQ-8501',
    hospital: 'Sion Regional Medical Center',
    bloodGroup: 'B-',
    component: 'Single Donor Platelets',
    units: 2,
    urgency: 'Critical',
    radius: '0-2 km Ring',
    matchedDonors: 4,
    eta: '14 mins',
    status: 'In Transit',
    temp: '4.0°C',
    boxId: 'SBB-118'
  }
]

export const INITIAL_DONORS = [
  {
    id: 'DNR-101',
    name: 'Aarav Kulkarni',
    bloodGroup: 'O-',
    distance: '1.2 km',
    ring: '0-2 km',
    lastDonated: '114 days ago',
    status: 'Eligible & Verified',
    reliability: '99%',
    phone: '+91 98201 44102',
    city: 'Mumbai Central'
  },
  {
    id: 'DNR-102',
    name: 'Dr. Meera Deshmukh',
    bloodGroup: 'A-',
    distance: '2.4 km',
    ring: '2-5 km',
    lastDonated: '96 days ago',
    status: 'On-Call Responder',
    reliability: '98%',
    phone: '+91 98204 88310',
    city: 'Dadar West'
  },
  {
    id: 'DNR-103',
    name: 'Rohan Joshi',
    bloodGroup: 'B-',
    distance: '1.8 km',
    ring: '0-2 km',
    lastDonated: '130 days ago',
    status: 'Eligible & Verified',
    reliability: '96%',
    phone: '+91 98192 55019',
    city: 'Parel'
  },
  {
    id: 'DNR-104',
    name: 'Priya Nair',
    bloodGroup: 'O+',
    distance: '3.6 km',
    ring: '2-5 km',
    lastDonated: '105 days ago',
    status: 'Eligible & Verified',
    reliability: '97%',
    phone: '+91 98670 11208',
    city: 'Worli'
  },
  {
    id: 'DNR-105',
    name: 'Vikram Sawant',
    bloodGroup: 'AB-',
    distance: '4.1 km',
    ring: '2-5 km',
    lastDonated: '142 days ago',
    status: 'Rare Group Standby',
    reliability: '100%',
    phone: '+91 98331 77490',
    city: 'Matunga'
  },
  {
    id: 'DNR-106',
    name: 'Neha Patil',
    bloodGroup: 'A+',
    distance: '6.2 km',
    ring: '5-10 km',
    lastDonated: '92 days ago',
    status: 'Eligible & Verified',
    reliability: '95%',
    phone: '+91 98211 66340',
    city: 'Bandra East'
  }
]

export const PLATFORM_MODULES = [
  {
    id: 'dashboard',
    path: '/dashboard',
    apiEndpoint: '/api/feature/dashboard-stats',
    title: 'Emergency Command Dashboard',
    category: 'Operations',
    icon: 'dashboard',
    summary: 'Real-time visibility across hospital blood requisitions, active cold-chain dispatches, and regional reserve levels.',
    details: [
      'Live monitoring of verified emergency requisitions across partner hospitals',
      'Instant cross-hub transfer coordination when local stock drops below threshold',
      'Direct telemetry feed from active transport units in the field'
    ]
  },
  {
    id: 'request-blood',
    path: '/request-blood',
    apiEndpoint: '/api/feature/requests',
    title: 'Hospital Blood Requisition',
    category: 'Emergency Dispatch',
    icon: 'activity',
    summary: 'Direct hospital-to-grid requisition portal with automated blood bank matching and concentric donor ring mobilization.',
    details: [
      'Hospital verification workflow to prevent duplicate or unverified broadcasts',
      'Component-specific matching (Packed RBC, Fresh Frozen Plasma, Platelets, Whole Blood)',
      'Automated escalation from nearest blood bank stock to local verified donors'
    ]
  },
  {
    id: 'donor-network',
    path: '/donor-network',
    apiEndpoint: '/api/feature/donors',
    title: 'Voluntary Donor Registry & Geo-Rings',
    category: 'Donor Network',
    icon: 'users',
    summary: 'Geo-fenced mobilization across 0–2 km, 2–5 km, and 5–10 km rings with strict 90-day recovery cooldown protection.',
    details: [
      'Concentric ring alerts notify only eligible, cooldown-cleared donors nearby',
      'Instant donor registration with blood group and locality indexing',
      'Zero public spam—targeted alerts protect donor privacy and prevent alert fatigue'
    ]
  },
  {
    id: 'smart-box',
    path: '/smart-box',
    apiEndpoint: '/api/feature/smart-box',
    title: 'Smart Blood Box Cold-Chain Telemetry',
    category: 'Hardware & IoT',
    icon: 'thermometer',
    summary: 'Peltier-cooled portable blood transport carrier maintaining 2°C–6°C with continuous GPS, shock, and lid-lock monitoring.',
    details: [
      'Active medical-grade thermal regulation between 2.0°C and 6.0°C',
      'Real-time excursion alerts if internal temperature approaches 5.5°C threshold',
      'Cryptographic RFID/QR lid lock restricting access to authorized clinical staff'
    ]
  },
  {
    id: 'inventory',
    path: '/inventory',
    apiEndpoint: '/api/feature/inventory',
    title: 'Blood Bank Inventory & Demand Forecast',
    category: 'Supply Chain',
    icon: 'droplet',
    summary: 'Live blood group stock tracking across regional centers with 7-day predictive shortage alerts and FEFO shelf-life management.',
    details: [
      'Group-by-group reserve monitoring for O-, O+, A-, A+, B-, B+, AB-, and AB+',
      'First-Expiry-First-Out (FEFO) routing to eliminate plasma and platelet wastage',
      'Predictive shortage forecasting ahead of seasonal trauma and dengue spikes'
    ]
  },
  {
    id: 'custody',
    path: '/custody',
    apiEndpoint: '/api/feature/custody/verify',
    title: 'Digital Chain of Custody Verification',
    category: 'Compliance',
    icon: 'qr',
    summary: 'End-to-end tamper-evident audit trail from donor vein to recipient transfusion with temperature compliance certification.',
    details: [
      'Four-stage cryptographic checkpoints: Collection, Lab Screening, Cold Transit, Ward Handover',
      'Instant requisition ID lookup for hospital transfusion officers',
      'Automated cold-chain pass/fail certification before bed-side administration'
    ]
  }
]

export const CAMPAIGN_HIGHLIGHTS = [
  {
    date: '14 JUNE',
    tag: 'World Blood Donor Day Initiative',
    title: 'Every Drop Counts: Regional Voluntary Donor Drive',
    description: 'Join certified hospitals and municipal blood banks in building a zero-shortage emergency reserve for rare blood groups (O-, A-, B-, AB-).',
    cta: 'Register as a Voluntary Donor',
    targetPath: '/donor-network'
  },
  {
    date: '24 × 7 GRID',
    tag: 'Hospital & Blood Bank Integration',
    title: 'Verified Cold-Chain Dispatch Across 28 Partner Centers',
    description: 'Connecting trauma centers, maternity wards, and licensed blood banks through real-time stock synchronization and monitored transport.',
    cta: 'Open Command Dashboard',
    targetPath: '/dashboard'
  }
]
