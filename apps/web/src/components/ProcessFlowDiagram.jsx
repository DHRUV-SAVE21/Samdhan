import { useState } from 'react'
import { processFlowNodes } from '../data/bloodgridData'

export function ProcessFlowDiagram() {
  const [activeIndex, setActiveIndex] = useState(3)
  const [scenario, setScenario] = useState('standard') // 'standard' | 'shortage' | 'exception' | 'rejected'

  const scenarioDescriptions = {
    standard: {
      title: 'Standard Verified Emergency Fulfilment',
      summary: 'Request Verified → Supply Discovered in Partner Blood Bank → Smart Blood Box Dispatched (2.4°C) → Hospital QR Handover & Auto-Closure.',
      badge: 'PATH: DIRECT + DONOR BACKUP',
    },
    shortage: {
      title: 'Shortage → Progressive Donor Mobilization Path',
      summary: 'Blood Bank Stock Insufficient → Triggers Progressive Geo-Ring Donor Mobilization & Partner NGO Escalation → Donor Accepts → Blood Bank Collection → Dispatch.',
      badge: 'BRANCH: SHORTAGE ESCALATION',
    },
    exception: {
      title: 'Cold-Chain / Transit Delivery Exception Path',
      summary: 'Smart Blood Box detects temperature rise (>6°C) or traffic bottleneck → Triggers ALERT / REROUTE / ESCALATE to nearest partner blood bank.',
      badge: 'BRANCH: TELEMETRY EXCEPTION',
    },
    rejected: {
      title: 'Unverified / Duplicate Request Rejection Path',
      summary: 'Request Verification detects duplicate WhatsApp forward or unverified requester → REJECT / REQUEST CORRECTION → Prevents donor fatigue.',
      badge: 'BRANCH: ANTI-SPAM FILTER',
    },
  }

  return (
    <div className="flow-architect">
      {/* Top Scenario Switcher */}
      <div className="flow-scenario-bar">
        <div className="flow-scenario-buttons">
          <button
            type="button"
            className={`scenario-btn ${scenario === 'standard' ? 'active' : ''}`}
            onClick={() => { setScenario('standard'); setActiveIndex(4) }}
          >
            ✓ Optimal Fulfilment Flow
          </button>
          <button
            type="button"
            className={`scenario-btn ${scenario === 'shortage' ? 'active' : ''}`}
            onClick={() => { setScenario('shortage'); setActiveIndex(3) }}
          >
            ⚠️ Shortage &amp; Progressive Mobilization
          </button>
          <button
            type="button"
            className={`scenario-btn ${scenario === 'exception' ? 'active' : ''}`}
            onClick={() => { setScenario('exception'); setActiveIndex(6) }}
          >
            🌡️ Delivery / Cold-Chain Exception
          </button>
          <button
            type="button"
            className={`scenario-btn ${scenario === 'rejected' ? 'active' : ''}`}
            onClick={() => { setScenario('rejected'); setActiveIndex(1) }}
          >
            ✕ Duplicate / Unverified Request
          </button>
        </div>
        <div className="flow-scenario-callout">
          <span className="scenario-badge">{scenarioDescriptions[scenario].badge}</span>
          <strong>{scenarioDescriptions[scenario].title}:</strong>{' '}
          <span>{scenarioDescriptions[scenario].summary}</span>
        </div>
      </div>

      {/* Visual Architecture Flowchart matching MergeInfinity_Samdhan_Prototype.pdf */}
      <div className="flowchart-board">
        {/* ROW 1: Intake & Verification */}
        <div className="flowchart-row">
          <div className="flow-pill-start">START</div>
          <span className="flow-arrow-h">→</span>

          <div
            className={`flow-box flow-box--green ${activeIndex === 0 ? 'selected' : ''}`}
            onClick={() => setActiveIndex(0)}
          >
            <small>STEP 01 · INTAKE</small>
            <strong>EMERGENCY BLOOD REQUEST</strong>
            <p>Hospital / authorized user enters blood group, location, units, etc.</p>
          </div>
          <span className="flow-arrow-h">→</span>

          <div
            className={`flow-box flow-box--blue ${activeIndex === 1 ? 'selected' : ''}`}
            onClick={() => setActiveIndex(1)}
          >
            <small>STEP 02 · GATEKEEPER</small>
            <strong>REQUEST VERIFICATION</strong>
            <p>Validate requester · Validate details · Duplicate / stale request check</p>
          </div>
          <span className="flow-arrow-h">→</span>

          <div className="flow-diamond">
            <span>REQUEST VERIFIED?</span>
          </div>
          <span className="flow-arrow-h flow-label-no">NO →</span>

          <div className={`flow-box flow-box--reject ${scenario === 'rejected' ? 'highlighted' : ''}`}>
            <small>✕ REJECTED</small>
            <strong>REJECT / REQUEST CORRECTION</strong>
            <p>Stops unverified forwards → END</p>
          </div>
        </div>

        {/* ROW 2: Supply Discovery & Shortage Escalation */}
        <div className="flowchart-row">
          <div
            className={`flow-box flow-box--blue ${activeIndex === 2 ? 'selected' : ''}`}
            onClick={() => setActiveIndex(2)}
          >
            <small>STEP 03 · MULTI-SOURCE</small>
            <strong>SUPPLY DISCOVERY</strong>
            <p>Blood banks + partner hospitals + voluntary donor network</p>
          </div>
          <span className="flow-arrow-h">→</span>

          <div className="flow-diamond">
            <span>Blood Available?</span>
          </div>
          <span className="flow-arrow-h flow-label-no">NO →</span>

          <div
            className={`flow-box flow-box--green ${activeIndex === 3 || scenario === 'shortage' ? 'selected' : ''}`}
            onClick={() => setActiveIndex(3)}
          >
            <small>STEP 04 · SHORTAGE ENGINE</small>
            <strong>⚠️ SHORTAGE MOBILIZATION</strong>
            <p>Progressive donor mobilization · Nearby network escalation</p>
          </div>
          <span className="flow-arrow-h">→</span>

          <div className="flow-diamond">
            <span>STILL UNAVAILABLE?</span>
          </div>
          <span className="flow-arrow-h flow-label-yes">YES →</span>

          <div className="flow-box flow-box--warn">
            <small>🔔 ESCALATION</small>
            <strong>MARK UNRESOLVED</strong>
            <p>Notify authorized stakeholders</p>
          </div>
        </div>

        {/* ROW 3: Intelligent Matching & Dispatch */}
        <div className="flowchart-row">
          <div
            className={`flow-box flow-box--green ${activeIndex === 4 ? 'selected' : ''}`}
            onClick={() => setActiveIndex(4)}
          >
            <small>STEP 05 · AI CORE</small>
            <strong>INTELLIGENT MATCHING &amp; FULFILMENT OPTIMIZATION</strong>
            <p>Fastest feasible source + route selection by urgency, compatibility &amp; ETA</p>
          </div>
          <span className="flow-arrow-h">→</span>

          <div className="flow-diamond">
            <span>Source Type?</span>
          </div>
          <span className="flow-arrow-h">→</span>

          <div
            className={`flow-box flow-box--blue ${activeIndex === 5 ? 'selected' : ''}`}
            onClick={() => setActiveIndex(5)}
          >
            <small>STEP 06 · COLLECTION &amp; DISPATCH</small>
            <strong>DIRECT DISPATCH / DONOR → BLOOD BANK COLLECTION</strong>
            <p>Medical screening by blood bank authority → Certified unit dispatch</p>
          </div>
        </div>

        {/* ROW 4: Smart Logistics, Exception Handling & Handover Closure */}
        <div className="flowchart-row">
          <div
            className={`flow-box flow-box--green ${activeIndex === 6 ? 'selected' : ''}`}
            onClick={() => setActiveIndex(6)}
          >
            <small>STEP 07 · IOT COLD-CHAIN</small>
            <strong>SMART LOGISTICS &amp; LIVE MONITORING</strong>
            <p>Smart Blood Box GPS + Temp (2–6°C) + Tamper + ETA &amp; Chain of Custody</p>
          </div>
          <span className="flow-arrow-h">→</span>

          <div className="flow-diamond">
            <span>DELIVERY EXCEPTION?</span>
          </div>
          <span className="flow-arrow-h flow-label-yes">YES →</span>

          <div className={`flow-box flow-box--reject ${scenario === 'exception' ? 'highlighted' : ''}`}>
            <small>⚠️ EXCEPTION</small>
            <strong>ALERT / REROUTE / ESCALATE</strong>
            <p>Notify team, reroute if possible, initiate backup escalation</p>
          </div>
          <span className="flow-arrow-h flow-label-no">NO →</span>

          <div
            className={`flow-box flow-box--blue ${activeIndex === 7 ? 'selected' : ''}`}
            onClick={() => setActiveIndex(7)}
          >
            <small>STEP 08 · CLOSURE</small>
            <strong>HOSPITAL HANDOVER → QR VERIFICATION → CLOSED</strong>
            <p>Update status, stop donor alerts · Feed Data &amp; Analytics loop</p>
          </div>
        </div>

        {/* Bottom Data & Analytics Feedback Loop Bar */}
        <div className="flowchart-analytics-bar">
          <strong>📊 DATA &amp; ANALYTICS FEEDBACK LOOP:</strong>
          <span>Fulfilment Time</span>
          <b>→</b>
          <span>Donor Response</span>
          <b>→</b>
          <span>Source Utilization</span>
          <b>→</b>
          <span>Temperature Events</span>
          <b>↺ Feeds back into Intelligent Matching &amp; Predictive Shortage Detection</b>
        </div>
      </div>

      {/* Selected Step Inspector Drawer */}
      <div className="flow-inspector">
        <div className="flow-inspector__num">{processFlowNodes[activeIndex].step}</div>
        <div className="flow-inspector__body">
          <span className="flow-inspector__stage">
            {processFlowNodes[activeIndex].stage} · {processFlowNodes[activeIndex].actor}
          </span>
          <h4>{processFlowNodes[activeIndex].title}</h4>
          <p>{processFlowNodes[activeIndex].detail}</p>
          {processFlowNodes[activeIndex].branchNo && (
            <div className="flow-inspector__branch">
              <strong>Decision Guardrail:</strong> {processFlowNodes[activeIndex].branchNo}
            </div>
          )}
        </div>
        <div className="flow-inspector__metric">
          <small>LIVE TELEMETRY / STATE</small>
          <strong>{processFlowNodes[activeIndex].metrics}</strong>
        </div>
      </div>
    </div>
  )
}
