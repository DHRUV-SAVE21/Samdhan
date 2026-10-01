import { useState } from 'react'
import {
  initialEmergencyRequests,
  bloodInventory,
  donorNetworkList,
} from '../data/bloodgridData'

export function RolePortalsDashboard() {
  const [activeRole, setActiveRole] = useState('hospital') // 'hospital' | 'bloodbank' | 'donor' | 'logistics'
  const [requests, setRequests] = useState(initialEmergencyRequests)
  const [donors, setDonors] = useState(donorNetworkList)
  const [activeRing, setActiveRing] = useState(1)
  const [donorAvailable, setDonorAvailable] = useState(true)

  // New Emergency Request Form State
  const [formState, setFormState] = useState({
    hospital: 'Cooper Municipal General Hospital',
    bloodGroup: 'O-',
    component: 'Packed Red Blood Cells (PRBC)',
    units: '2',
    urgency: 'Critical · Emergency Surgery',
    officerId: 'Dr. S. Kulkarni (#MMC-51092)',
  })
  const [verificationBanner, setVerificationBanner] = useState(null)

  const handleCreateRequest = (e) => {
    e.preventDefault()
    const newId = `REQ-2026-${Math.floor(100 + Math.random() * 899)}`
    const newQr = `BG-2026-${formState.bloodGroup.replace('+', 'P').replace('-', 'N')}${Math.floor(100 + Math.random() * 899)}`

    const newReq = {
      id: newId,
      hospital: formState.hospital,
      bloodGroup: formState.bloodGroup,
      component: formState.component,
      units: Number(formState.units) || 1,
      urgency: formState.urgency,
      verified: true,
      verifiedBy: formState.officerId,
      status: 'Verified · AI Matching & Smart Box Assigned',
      source: 'Vile Parle Regional Hub + Ring 1 Donors Alerted',
      eta: '09 mins',
      temp: '2.4°C',
      qrCode: newQr,
      timeAgo: 'Just now',
      progress: 35,
    }

    setRequests((prev) => [newReq, ...prev])
    setVerificationBanner(
      `✓ Request ${newId} Verified (No Duplicate Found) · Matched with Smart Blood Box ${newQr} (ETA 09 mins)`
    )
    window.setTimeout(() => setVerificationBanner(null), 5000)
  }

  const handleVerifyQrHandover = (reqId) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === reqId
          ? {
              ...req,
              status: 'Handover QR Verified · Closed (Alerts Stopped)',
              eta: 'Delivered',
              progress: 100,
            }
          : req
      )
    )
  }

  const handleAcceptDonorAlert = (donorId) => {
    setDonors((prev) =>
      prev.map((d) =>
        d.id === donorId
          ? { ...d, status: 'Accepted · En Route to Blood Bank Collection' }
          : d
      )
    )
  }

  return (
    <div className="portals-shell">
      {/* Role Selector Tabs matching Slide 4 User & Integration Layer */}
      <div className="portal-role-tabs" role="tablist" aria-label="BloodGrid Stakeholder Portals">
        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'hospital'}
          className={`portal-tab ${activeRole === 'hospital' ? 'active' : ''}`}
          onClick={() => setActiveRole('hospital')}
        >
          <span className="portal-tab__icon">🏥</span>
          <div>
            <strong>Hospital Portal</strong>
            <small>Emergency Requests · Verification · QR Handover</small>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'bloodbank'}
          className={`portal-tab ${activeRole === 'bloodbank' ? 'active' : ''}`}
          onClick={() => setActiveRole('bloodbank')}
        >
          <span className="portal-tab__icon">🩸</span>
          <div>
            <strong>Blood Bank &amp; UPAY NGO Portal</strong>
            <small>Multi-Source Inventory · AI Forecast · Geo-Ring Mobilization</small>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'donor'}
          className={`portal-tab ${activeRole === 'donor' ? 'active' : ''}`}
          onClick={() => setActiveRole('donor')}
        >
          <span className="portal-tab__icon">🤝</span>
          <div>
            <strong>Donor PWA (Offline-First)</strong>
            <small>Availability Toggle · Privacy Shield · Verified Alerts</small>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'logistics'}
          className={`portal-tab ${activeRole === 'logistics' ? 'active' : ''}`}
          onClick={() => setActiveRole('logistics')}
        >
          <span className="portal-tab__icon">🚚</span>
          <div>
            <strong>Smart Logistics Dashboard</strong>
            <small>ESP32 Cold-Chain (2–6°C) · Live GPS · Exception Reroute</small>
          </div>
        </button>
      </div>

      {verificationBanner && (
        <div className="portal-toast" role="status">
          {verificationBanner}
        </div>
      )}

      {/* ROLE 1: HOSPITAL PORTAL */}
      {activeRole === 'hospital' && (
        <div className="portal-panel-grid">
          <form className="portal-card portal-form" onSubmit={handleCreateRequest}>
            <div className="portal-card__head">
              <span className="badge-crimson">STEP 01 &amp; 02 · INTAKE + VERIFICATION</span>
              <h3>Raise Verified Emergency Blood Request</h3>
              <p>Validates authorized medical requester and checks for duplicate/stale requests before alerting the network.</p>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label htmlFor="req-blood-group">Blood Group</label>
                <select
                  id="req-blood-group"
                  value={formState.bloodGroup}
                  onChange={(e) => setFormState({ ...formState, bloodGroup: e.target.value })}
                >
                  {['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="req-units">Units Needed</label>
                <select
                  id="req-units"
                  value={formState.units}
                  onChange={(e) => setFormState({ ...formState, units: e.target.value })}
                >
                  {['1', '2', '3', '4', '6'].map((u) => (
                    <option key={u} value={u}>{u} Units</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="req-component">Blood Component</label>
              <select
                id="req-component"
                value={formState.component}
                onChange={(e) => setFormState({ ...formState, component: e.target.value })}
              >
                <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                <option value="Single Donor Platelets (SDP)">Single Donor Platelets (SDP)</option>
                <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                <option value="Whole Blood">Whole Blood</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="req-hospital">Authorized Hospital Facility</label>
              <input
                id="req-hospital"
                type="text"
                value={formState.hospital}
                onChange={(e) => setFormState({ ...formState, hospital: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="req-officer">Verifying Medical Officer / Reg ID</label>
              <input
                id="req-officer"
                type="text"
                value={formState.officerId}
                onChange={(e) => setFormState({ ...formState, officerId: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-crimson full-width">
              Verify &amp; Trigger Fastest Feasible Fulfilment →
            </button>
          </form>

          <div className="portal-card">
            <div className="portal-card__head">
              <span className="badge-outline">LIVE FULFILMENT &amp; DIGITAL CHAIN OF CUSTODY</span>
              <h3>Active Hospital Requisitions ({requests.length})</h3>
              <p>Real-time ETA, Smart Blood Box temperature telemetry, and QR handover verification.</p>
            </div>

            <div className="req-list">
              {requests.map((req) => (
                <article key={req.id} className="req-item">
                  <div className="req-item__top">
                    <span className="blood-badge">{req.bloodGroup}</span>
                    <div className="req-item__title">
                      <strong>{req.hospital}</strong>
                      <small>{req.id} · {req.component} ({req.units} Units) · {req.urgency}</small>
                    </div>
                    <span className={`req-status-pill ${req.progress === 100 ? 'closed' : 'active'}`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="req-progress-bar">
                    <div className="req-progress-fill" style={{ width: `${req.progress}%` }} />
                  </div>

                  <div className="req-item__meta">
                    <span>✓ Verified: <b>{req.verifiedBy}</b></span>
                    <span>📍 Source: <b>{req.source}</b></span>
                    <span>🌡️ Box Temp: <b>{req.temp}</b></span>
                    <span>⏱️ ETA: <b>{req.eta}</b></span>
                  </div>

                  <div className="req-item__actions">
                    <span className="qr-code-tag">📱 QR Unit ID: {req.qrCode}</span>
                    {req.progress < 100 ? (
                      <button
                        type="button"
                        className="btn-verify-qr"
                        onClick={() => handleVerifyQrHandover(req.id)}
                      >
                        ✓ Scan QR &amp; Complete Hospital Handover
                      </button>
                    ) : (
                      <span className="handover-complete-tag">
                        ✓ Handover Verified · Donor Alerts Auto-Stopped
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROLE 2: BLOOD BANK & UPAY NGO PORTAL */}
      {activeRole === 'bloodbank' && (
        <div className="portal-panel-grid">
          <div className="portal-card">
            <div className="portal-card__head">
              <span className="badge-crimson">MULTI-SOURCE INVENTORY &amp; AI FORECAST</span>
              <h3>Federated Blood Stock &amp; Predictive Shortage Detection</h3>
              <p>Powered by Scikit-learn &amp; XGBoost demand forecasting across connected blood banks and partner hospitals.</p>
            </div>

            <div className="inventory-grid">
              {bloodInventory.map((item) => (
                <div key={item.group} className={`inventory-tile status-${item.status.toLowerCase()}`}>
                  <div className="inventory-tile__head">
                    <strong>{item.group}</strong>
                    <span className={`stock-chip stock-chip--${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="inventory-tile__units">
                    <b>{item.units}</b> <small>Verified Units</small>
                  </div>
                  <small className="inventory-bank">{item.bank}</small>
                  <div className="inventory-forecast">📊 {item.forecast}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card__head">
              <span className="badge-outline">PROGRESSIVE DONOR MOBILIZATION ENGINE</span>
              <h3>Smart Geo-Ring Escalation (Zero Donor Fatigue)</h3>
              <p>Instead of blasting 500 WhatsApp groups at once, BloodGrid progressively mobilizes eligible, available donors in concentric geo-rings and automatically halts notifications upon fulfilment.</p>
            </div>

            <div className="ring-selector">
              {[
                { ring: 1, title: 'Ring 1 · Immediate Zone (0–3 km)', count: '18 Eligible Active Donors', desc: 'Alerted via PWA Push · 94% Historical Response' },
                { ring: 2, title: 'Ring 2 · Extended Cluster (3–7 km)', count: '64 Partner NGO Donors (UPAY)', desc: 'Triggered only if Ring 1 does not fulfil within 6 mins' },
                { ring: 3, title: 'Ring 3 · City-Wide Federation Escalation', count: '420+ Multi-NGO Reserve', desc: 'Cross-organisation mobilization for rare blood groups (O-, B-)' },
              ].map((r) => (
                <div
                  key={r.ring}
                  className={`ring-card ${activeRing === r.ring ? 'active' : ''}`}
                  onClick={() => setActiveRing(r.ring)}
                >
                  <div className="ring-card__num">R{r.ring}</div>
                  <div>
                    <strong>{r.title}</strong>
                    <span>{r.count}</span>
                    <small>{r.desc}</small>
                  </div>
                  <button type="button" className="ring-activate-btn">
                    {activeRing === r.ring ? 'Active Ring' : 'Escalate'}
                  </button>
                </div>
              ))}
            </div>

            <div className="capacity-utilization-box">
              <h4>Community Capacity Utilisation (PS.txt Pillar #6)</h4>
              <div className="capacity-bars">
                <div>
                  <span>Active &amp; Eligible Now (62%)</span>
                  <div className="cap-track"><i style={{ width: '62%' }} className="fill-crimson" /></div>
                </div>
                <div>
                  <span>In 90-Day Post-Donation Cooldown (24%)</span>
                  <div className="cap-track"><i style={{ width: '24%' }} className="fill-amber" /></div>
                </div>
                <div>
                  <span>Inactive / Re-Engageable via UPAY Drives (14%)</span>
                  <div className="cap-track"><i style={{ width: '14%' }} className="fill-slate" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROLE 3: DONOR PWA */}
      {activeRole === 'donor' && (
        <div className="portal-panel-grid">
          <div className="portal-card">
            <div className="portal-card__head">
              <span className="badge-crimson">OFFLINE-FIRST DONOR PWA</span>
              <h3>Voluntary Donor Profile &amp; Privacy Shield</h3>
              <p>Protects sensitive donor details (PS.txt Pillar #7). Phone numbers are never shared publicly; communication happens via consent-gated BloodGrid bridges.</p>
            </div>

            <div className="donor-pwa-card">
              <div className="donor-pwa-header">
                <div className="donor-avatar">O-</div>
                <div>
                  <h4>Aarav Kulkarni</h4>
                  <small>UPAY NGO · SVKM DJSCE Youth Chapter · Vile Parle West</small>
                </div>
                <button
                  type="button"
                  className={`availability-toggle ${donorAvailable ? 'on' : 'off'}`}
                  onClick={() => setDonorAvailable(!donorAvailable)}
                >
                  {donorAvailable ? '● AVAILABLE TO DONATE' : '○ PAUSED / UNAVAILABLE'}
                </button>
              </div>

              <div className="donor-stats-row">
                <div><small>ELIGIBILITY</small><strong>Cleared (114d since last)</strong></div>
                <div><small>PRIVACY MODE</small><strong>🔒 Masked (+91 98••• ••412)</strong></div>
                <div><small>LIVES IMPACTED</small><strong>21 Lives (7 Donations)</strong></div>
              </div>

              <div className="medical-authority-note">
                ⚕️ <strong>Medical Governance Note:</strong> BloodGrid matches availability and proximity; final medical screening and eligibility sign-off always remain with authorized blood-bank medical personnel.
              </div>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card__head">
              <span className="badge-outline">ACTIVE DONOR NETWORK ROSTER</span>
              <h3>Verified Community Donors in Current Geo-Ring</h3>
              <p>One-tap donor acceptance routes the donor directly to an authorized Blood Bank Collection center.</p>
            </div>

            <div className="donor-roster">
              {donors.map((d) => (
                <div key={d.id} className="donor-row">
                  <span className="blood-badge">{d.bloodGroup}</span>
                  <div className="donor-row__info">
                    <strong>{d.name} <small>({d.ngoNetwork})</small></strong>
                    <span>📍 {d.zone} · Last Donated: {d.lastDonated}</span>
                    <small>{d.maskedContact}</small>
                  </div>
                  <div className="donor-row__action">
                    <span className="donor-status-tag">{d.status}</span>
                    {d.status === 'Available Now' && (
                      <button
                        type="button"
                        className="btn-accept-donate"
                        onClick={() => handleAcceptDonorAlert(d.id)}
                      >
                        Accept &amp; Donate →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROLE 4: SMART LOGISTICS DASHBOARD */}
      {activeRole === 'logistics' && (
        <div className="portal-panel-grid">
          <div className="portal-card">
            <div className="portal-card__head">
              <span className="badge-crimson">ESP32 + MQTT COLD-CHAIN FLEET</span>
              <h3>Live Smart Blood Box Telemetry</h3>
              <p>Tracks certified transport units with continuous 2°C–6°C monitoring, GPS, tamper detection, and QR chain of custody.</p>
            </div>

            <div className="fleet-list">
              {[
                { boxId: 'SMART-BOX #SB-04', unit: 'BG-2026-A841 (O-)', route: 'KEM Blood Bank → Cooper Hospital', temp: '2.4°C', gps: '19.1074° N, 72.8372° E', seal: 'LOCKED', eta: '11 mins', status: 'Optimal Transit' },
                { boxId: 'SMART-BOX #SB-09', unit: 'BG-2026-A849 (A+)', route: 'Andheri Red Cross → Nanavati Max', temp: '3.1°C', gps: '19.1136° N, 72.8697° E', seal: 'LOCKED', eta: '19 mins', status: 'Optimal Transit' },
                { boxId: 'SMART-BOX #SB-12', unit: 'BG-2026-A832 (B-)', route: 'Nair Blood Bank → Sion LTMG Hospital', temp: '2.8°C', gps: '19.0434° N, 72.8633° E', seal: 'QR VERIFIED', eta: 'Delivered', status: 'Handover Closed' },
              ].map((b) => (
                <div key={b.boxId} className="fleet-item">
                  <div className="fleet-item__head">
                    <strong>📦 {b.boxId}</strong>
                    <span className="fleet-unit-tag">{b.unit}</span>
                    <span className="fleet-status">{b.status}</span>
                  </div>
                  <p className="fleet-route">🚚 {b.route}</p>
                  <div className="fleet-telemetry-pills">
                    <span>🌡️ Temp: <b>{b.temp}</b></span>
                    <span>📍 GPS: <b>{b.gps}</b></span>
                    <span>🛡️ Seal: <b>{b.seal}</b></span>
                    <span>⏱️ ETA: <b>{b.eta}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card__head">
              <span className="badge-outline">COLD-CHAIN &amp; STORAGE TELEMETRY LAYER</span>
              <h3>End-to-End Storage &amp; Transit Guardrails</h3>
              <p>Covers all 4 nodes from Slide 4 (IoT &amp; Cold-Chain Layer): Blood Bank Storage, Smart Blood Box, Transport Telemetry, and Hospital Storage.</p>
            </div>

            <div className="coldchain-nodes">
              <div className="cc-node">
                <span className="cc-node__step">NODE 01</span>
                <strong>Blood Bank Storage</strong>
                <p>Cabinet Temperature: <b>2.6°C</b> · Backup Power: <b>Online (UPS 100%)</b></p>
              </div>
              <div className="cc-node">
                <span className="cc-node__step">NODE 02</span>
                <strong>Smart Blood Box (ESP32)</strong>
                <p>Internal Core: <b>2.4°C</b> · Humidity Sensor: <b>44% RH</b> · Lid Tamper: <b>Armed</b></p>
              </div>
              <div className="cc-node">
                <span className="cc-node__step">NODE 03</span>
                <strong>Transport Telemetry (WebSockets + MQTT)</strong>
                <p>Green Corridor ETA Optimization · Automatic Reroute on Traffic or Thermal Drift</p>
              </div>
              <div className="cc-node">
                <span className="cc-node__step">NODE 04</span>
                <strong>Hospital Receiving Storage</strong>
                <p>QR Chain-of-Custody Scan · Instant Audit Log &amp; Donor Notification Closure</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
