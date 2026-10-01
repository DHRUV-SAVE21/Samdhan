import { useState } from 'react'
import Icon from './Icon'

const HARDWARE_PARTS = [
  {
    id: 1,
    name: 'Cryptographic RFID / QR Lid Lock',
    spec: 'Authorized Hospital Officer Access Only',
    desc: 'Prevents unauthorized opening during transit. Automatically logs unlock timestamps and officer credentials to /api/feature/custody/verify.',
    x: '50%',
    y: '18%'
  },
  {
    id: 2,
    name: 'OLED Cold-Chain Telemetry Display',
    spec: '0.1°C Resolution · Live GPS & Battery',
    desc: 'Displays internal chamber temperature, assigned requisition ID, battery autonomy, and active GSM/GPS link status.',
    x: '76%',
    y: '34%'
  },
  {
    id: 3,
    name: 'Medical-Grade Vacuum Insulated Chamber',
    spec: '4-Bag Capacity · Shock-Absorbing Cradle',
    desc: 'Holds up to 4 units of Packed RBC or Fresh Frozen Plasma in anti-vibration medical-grade silicone bays.',
    x: '44%',
    y: '54%'
  },
  {
    id: 4,
    name: 'Dual-Stage Peltier Thermal Core',
    spec: 'Maintains 2.0°C – 6.0°C for 18 Hours',
    desc: 'Solid-state thermoelectric cooling regulated by dual PT1000 platinum temperature probes with automatic excursion alerts.',
    x: '28%',
    y: '76%'
  }
]

export function SmartBloodBoxVisual({ activeEmergencies = [] }) {
  const [selectedPart, setSelectedPart] = useState(HARDWARE_PARTS[0])
  const [excursionSim, setExcursionSim] = useState(false)

  const currentTemp = excursionSim ? '5.9°C' : '3.8°C'

  return (
    <div className="smart-box-showcase">
      <div className="smart-box-showcase__grid">
        {/* Left: Interactive Hardware Schematic */}
        <div className="smart-box-diagram-card">
          <div className="smart-box-diagram-card__top">
            <span className="smart-box-chip">
              <Icon name="box" size={15} />
              <span>Model SBB-2026 Cold-Chain Carrier</span>
            </span>

            <span
              className={`smart-box-status ${
                excursionSim ? 'smart-box-status--warn' : 'smart-box-status--ok'
              }`}
            >
              <Icon name="thermometer" size={15} />
              <span>
                {excursionSim
                  ? 'Thermal Warning · 5.9°C Approaching Limit'
                  : '2.0°C–6.0°C Compliant · Sealed'}
              </span>
            </span>
          </div>

          <div className="smart-box-svg-wrapper">
            <svg
              viewBox="0 0 600 380"
              className="smart-box-svg"
              role="img"
              aria-label="Smart Blood Box Technical Cutaway"
            >
              <defs>
                <linearGradient id="casingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b0a14" />
                  <stop offset="100%" stopColor="#1f050a" />
                </linearGradient>
                <linearGradient id="chamberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f293a" />
                  <stop offset="100%" stopColor="#081621" />
                </linearGradient>
              </defs>

              {/* Outer Insulated Shell */}
              <rect
                x="95"
                y="70"
                width="410"
                height="250"
                rx="22"
                fill="url(#casingGrad)"
                stroke="#be1833"
                strokeWidth="2.5"
              />

              {/* Top Lid Assembly */}
              <rect
                x="85"
                y="42"
                width="430"
                height="42"
                rx="12"
                fill="#590d1c"
                stroke="#f43f5e"
                strokeWidth="2"
              />

              {/* Lid Lock Module */}
              <rect
                x="255"
                y="48"
                width="90"
                height="28"
                rx="6"
                fill="#140609"
                stroke="#fda4af"
                strokeWidth="1.5"
              />
              <text x="300" y="66" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily="monospace">
                RFID LOCKED
              </text>

              {/* Inner Cooling Chamber */}
              <rect
                x="130"
                y="102"
                width="255"
                height="165"
                rx="12"
                fill="url(#chamberGrad)"
                stroke="#38bdf8"
                strokeWidth="1.8"
              />

              {/* Blood Bags inside Chamber */}
              {[0, 1, 2].map((idx) => (
                <g key={idx} transform={`translate(${150 + idx * 74}, 122)`}>
                  <rect
                    x="0"
                    y="0"
                    width="56"
                    height="120"
                    rx="10"
                    fill="#991229"
                    stroke="#fda4af"
                    strokeWidth="1.5"
                  />
                  <rect x="10" y="24" width="36" height="42" rx="4" fill="#fff1f2" />
                  <text x="28" y="45" textAnchor="middle" fill="#881337" fontSize="12" fontWeight="bold">
                    {idx === 0 ? 'O-' : idx === 1 ? 'A-' : 'B+'}
                  </text>
                  <text x="28" y="58" textAnchor="middle" fill="#881337" fontSize="8">
                    350 ML
                  </text>
                </g>
              ))}

              {/* Right Telemetry Panel */}
              <rect
                x="402"
                y="102"
                width="82"
                height="165"
                rx="10"
                fill="#12070a"
                stroke="#e11d48"
                strokeWidth="1.5"
              />
              <text x="443" y="132" textAnchor="middle" fill="#fda4af" fontSize="10" fontFamily="monospace">
                CORE TEMP
              </text>
              <text x="443" y="158" textAnchor="middle" fill="#38bdf8" fontSize="20" fontWeight="bold" fontFamily="monospace">
                {currentTemp}
              </text>
              <text x="443" y="188" textAnchor="middle" fill="#86efac" fontSize="10" fontFamily="monospace">
                BAT: 96%
              </text>
              <text x="443" y="212" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                GPS: LOCKED
              </text>

              {/* Bottom Peltier Thermal Core */}
              <rect
                x="130"
                y="278"
                width="354"
                height="28"
                rx="6"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <text x="307" y="296" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
                DUAL-STAGE PELTIER COOLING BUS · PT1000 SENSORS
              </text>
            </svg>

            {HARDWARE_PARTS.map((part) => (
              <button
                key={part.id}
                type="button"
                style={{ left: part.x, top: part.y }}
                className={`smart-box-hotspot ${
                  selectedPart.id === part.id ? 'is-active' : ''
                }`}
                onClick={() => setSelectedPart(part)}
              >
                <span className="smart-box-hotspot__dot">{part.id}</span>
                <span>{part.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="smart-box-diagram-card__footer">
            <span>Select numbered callouts (1–4) to inspect hardware specifications.</span>
            <button
              type="button"
              className="smart-box-sim-btn"
              onClick={() => setExcursionSim((prev) => !prev)}
            >
              {excursionSim ? 'Reset to Normal (3.8°C)' : 'Simulate 5.9°C Excursion Alert'}
            </button>
          </div>
        </div>

        {/* Right: Live Telemetry & Component Inspector */}
        <div className="smart-box-panel">
          <div className="smart-box-telemetry-strip">
            <div className="smart-box-metric">
              <span>Chamber Temperature</span>
              <strong>{currentTemp}</strong>
              <small>Target Range: 2.0°C – 6.0°C</small>
            </div>
            <div className="smart-box-metric">
              <span>Battery Autonomy</span>
              <strong>16.5 hrs</strong>
              <small>96% Charge · Dual LiFePO4</small>
            </div>
            <div className="smart-box-metric">
              <span>Enclosure Seal</span>
              <strong>LOCKED</strong>
              <small>RFID + QR Verified</small>
            </div>
          </div>

          <div className="smart-box-spotlight">
            <div className="smart-box-spotlight__header">
              <span>Subsystem 0{selectedPart.id}</span>
              <span>{selectedPart.spec}</span>
            </div>
            <h3>{selectedPart.name}</h3>
            <p>{selectedPart.desc}</p>
          </div>

          <div className="smart-box-part-tabs">
            {HARDWARE_PARTS.map((part) => (
              <button
                key={part.id}
                type="button"
                className={`smart-box-part-tab ${
                  selectedPart.id === part.id ? 'is-selected' : ''
                }`}
                onClick={() => setSelectedPart(part)}
              >
                <span className="smart-box-part-tab__num">{part.id}</span>
                <span>{part.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Field Units Bar */}
      <div className="smart-box-transit-bar">
        <div className="smart-box-transit-bar__title">
          <Icon name="truck" size={18} />
          <strong>Active Smart Blood Boxes in Field Transit</strong>
        </div>

        <div className="smart-box-transit-bar__items">
          {activeEmergencies.slice(0, 3).map((req) => (
            <div key={req.id} className="smart-box-transit-pill">
              <div className="smart-box-transit-pill__top">
                <strong>{req.boxId}</strong>
                <span className="bg-badge bg-badge--crimson">
                  {req.bloodGroup} · {req.temp}
                </span>
              </div>
              <span>Destination: {req.hospital}</span>
              <small>
                Requisition {req.id} · ETA {req.eta} · {req.status}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SmartBloodBoxVisual
