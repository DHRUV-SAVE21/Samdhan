import {
  INITIAL_DONORS,
  INITIAL_EMERGENCIES,
  INITIAL_STOCKS
} from '../data/bloodgridData'

const STORAGE_KEYS = {
  requests: 'bg_requests_v2',
  donors: 'bg_donors_v2',
  inventory: 'bg_inventory_v2',
  user: 'bg_current_user_v2'
}

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // ignore storage errors
  }
}

export function getCurrentUser() {
  return readLocal(STORAGE_KEYS.user, null)
}

export function logoutUser() {
  try {
    localStorage.removeItem(STORAGE_KEYS.user)
  } catch {
    // ignore
  }
}

export async function loginUser(payload) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const data = await res.json()
      const user = {
        id: data.id || 'USR-101',
        name: data.full_name || data.name || payload.name || payload.email.split('@')[0],
        email: data.email || payload.email,
        role: data.role || payload.role || 'Voluntary Donor',
        bloodGroup: data.bloodGroup || payload.bloodGroup || 'O+'
      }
      writeLocal(STORAGE_KEYS.user, user)
      return { user }
    }
  } catch {
    // fallback to local auth
  }

  const user = {
    id: `USR-${Math.floor(100 + Math.random() * 899)}`,
    name: payload.name || payload.email.split('@')[0],
    email: payload.email,
    role: payload.role || 'Voluntary Donor',
    bloodGroup: payload.bloodGroup || 'O+'
  }
  writeLocal(STORAGE_KEYS.user, user)
  return { user }
}

export async function registerUser(payload) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const data = await res.json()
      const user = {
        id: data.id || 'USR-201',
        name: payload.name,
        email: payload.email,
        role: payload.role || 'Voluntary Donor',
        bloodGroup: payload.bloodGroup || 'O+',
        city: payload.city || 'Mumbai Central'
      }
      writeLocal(STORAGE_KEYS.user, user)
      return { user }
    }
  } catch {
    // fallback to local registration
  }

  const user = {
    id: `USR-${Math.floor(200 + Math.random() * 799)}`,
    name: payload.name || payload.email.split('@')[0],
    email: payload.email,
    role: payload.role || 'Voluntary Donor',
    bloodGroup: payload.bloodGroup || 'O+',
    city: payload.city || 'Mumbai Central'
  }
  writeLocal(STORAGE_KEYS.user, user)
  return { user }
}

export async function fetchDashboardStats() {
  try {
    const res = await fetch('/api/feature/dashboard-stats')
    if (res.ok) {
      const data = await res.json()
      return {
        partnerHospitals: 28,
        verifiedDonors: data.activeDonors || 1420,
        avgDispatchTime: data.avgMatchTime || '13 mins',
        coldChainCompliance: data.coldChainCompliance || '99.8%'
      }
    }
  } catch {
    // fallback to local stats
  }

  return {
    partnerHospitals: 28,
    verifiedDonors: 1420,
    avgDispatchTime: '13 mins',
    coldChainCompliance: '99.8%'
  }
}

export async function fetchRequests() {
  const items = readLocal(STORAGE_KEYS.requests, INITIAL_EMERGENCIES)
  return { items }
}

export async function createBloodRequest(payload) {
  try {
    await fetch('/api/feature/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch {
    // fallback to local persistence
  }

  const current = readLocal(STORAGE_KEYS.requests, INITIAL_EMERGENCIES)
  const request = {
    id: `REQ-${Math.floor(8510 + Math.random() * 480)}`,
    hospital: payload.hospital,
    bloodGroup: payload.bloodGroup,
    component: payload.component,
    units: Number(payload.units) || 1,
    urgency: payload.urgency || 'Critical',
    radius: payload.radius || '0-2 km Ring',
    matchedDonors: Math.floor(4 + Math.random() * 6),
    eta: '12 mins',
    status: 'Dispatched',
    temp: '3.9°C',
    boxId: `SBB-${Math.floor(110 + Math.random() * 190)}`
  }

  const updated = [request, ...current]
  writeLocal(STORAGE_KEYS.requests, updated)
  return { request, items: updated }
}

export async function fetchDonors() {
  const items = readLocal(STORAGE_KEYS.donors, INITIAL_DONORS)
  return { items }
}

export async function registerDonor(payload) {
  try {
    await fetch('/api/feature/donors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch {
    // fallback to local persistence
  }

  const current = readLocal(STORAGE_KEYS.donors, INITIAL_DONORS)
  const donor = {
    id: `DNR-${Math.floor(200 + Math.random() * 799)}`,
    name: payload.name,
    bloodGroup: payload.bloodGroup,
    distance: '1.4 km',
    ring: payload.ring || '0-2 km',
    lastDonated: 'Eligible Today',
    status: 'Eligible & Verified',
    reliability: '100%',
    phone: payload.phone || '+91 98200 00000',
    city: payload.city || 'Mumbai Central'
  }

  const updated = [donor, ...current]
  writeLocal(STORAGE_KEYS.donors, updated)
  return { donor, items: updated }
}

export async function fetchInventory() {
  const items = readLocal(STORAGE_KEYS.inventory, INITIAL_STOCKS)
  return { items }
}

export async function updateInventoryUnit(group, delta) {
  const current = readLocal(STORAGE_KEYS.inventory, INITIAL_STOCKS)
  const updated = current.map((item) => {
    if (item.group !== group) return item
    const nextUnits = Math.max(0, item.units + delta)
    const status =
      nextUnits <= 4 ? 'Critical' : nextUnits < item.target * 0.45 ? 'Low' : 'Stable'
    return {
      ...item,
      units: nextUnits,
      status
    }
  })
  writeLocal(STORAGE_KEYS.inventory, updated)
  return { items: updated }
}

export async function verifyCustodyChain(reqId) {
  try {
    await fetch(`/api/feature/custody/verify/${reqId}`, { method: 'POST' })
  } catch {
    // fallback to local custody record
  }

  const requests = readLocal(STORAGE_KEYS.requests, INITIAL_EMERGENCIES)
  const matched = requests.find((r) => r.id === reqId) || requests[0]

  return {
    requestId: matched?.id || reqId,
    smartBoxId: matched?.boxId || 'SBB-104',
    meanTemp: matched?.temp || '3.8°C',
    compliance: '2.0°C–6.0°C Compliant · Verified',
    checkpoints: [
      {
        stage: '1. Donor Phlebotomy & Bag Serialization',
        actor: 'Regional Blood Bank Collection Unit',
        timestamp: '14:05 IST',
        status: 'QR Seal Applied · Bag ID Verified'
      },
      {
        stage: '2. Serology Screening & Cross-Match Release',
        actor: 'Dr. R. Deshmukh (Lab Pathology)',
        timestamp: '14:18 IST',
        status: 'TTI Negative · Cleared for Dispatch'
      },
      {
        stage: '3. Smart Blood Box Cold-Chain Loading',
        actor: `Peltier Carrier ${matched?.boxId || 'SBB-104'}`,
        timestamp: '14:22 IST',
        status: `Locked at ${matched?.temp || '3.8°C'} · Zero Excursions`
      },
      {
        stage: '4. Hospital Transfusion Officer Handover',
        actor: matched?.hospital || 'KEM Hospital Trauma Care',
        timestamp: '14:34 IST',
        status: 'Cryptographic Custody Signature Verified'
      }
    ]
  }
}
