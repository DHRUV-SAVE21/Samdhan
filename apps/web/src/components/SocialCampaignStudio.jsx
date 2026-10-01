import { useState } from 'react'

const campaignPresets = [
  {
    id: 'emergency',
    badge: 'URGENT VERIFIED REQUIREMENT',
    headlineTop: 'DONATE BLOOD',
    headlineMain: 'SAVE A LIFE TODAY',
    subtext: 'Verified emergency requirement at Cooper Municipal Hospital. Screened & coordinated via BloodGrid × UPAY NGO.',
    bloodGroup: 'O-',
    unitsNeeded: '2 Units PRBC',
    location: 'Vile Parle West, Mumbai',
    verificationCode: 'VERIFIED #REQ-2026-089',
    ctaText: 'ACCEPT & DONATE NOW',
    contactNote: 'Zero Spam · Privacy Masked · Direct Blood Bank Handover',
    theme: 'crimson',
  },
  {
    id: 'camp',
    badge: 'COMMUNITY BLOOD DRIVE · UPAY NGO',
    headlineTop: 'BE SOMEONE’S HERO',
    headlineMain: 'GIVE THE GIFT OF LIFE',
    subtext: 'Join the SVKM DJSCE × UPAY NGO Voluntary Blood Donation Camp. Every unit is tracked with Smart Cold-Chain custody.',
    bloodGroup: 'ALL',
    unitsNeeded: 'Target: 150 Units',
    location: 'SVKM DJSCE Campus Hall, Mumbai',
    verificationCode: 'CAMP ID #UPAY-2026-04',
    ctaText: 'REGISTER ON DONOR PWA',
    contactNote: 'Instant Digital Donor Certificate & Eligibility Tracker',
    theme: 'ruby',
  },
  {
    id: 'retention',
    badge: 'DONOR IMPACT & RETENTION REPORT',
    headlineTop: 'EVERY DROP COUNTS',
    headlineMain: 'YOUR BLOOD SAVED 3 LIVES',
    subtext: 'Automated campaign-wise contribution & donor retention card generated from BloodGrid Analytics without manual spreadsheets.',
    bloodGroup: 'A+',
    unitsNeeded: '98.4% Cold-Chain Integrity',
    location: 'Mumbai Metro Fulfilment Grid',
    verificationCode: 'CHAIN OF CUSTODY #BG-2026-A841',
    ctaText: 'VIEW IMPACT DASHBOARD',
    contactNote: 'Next Eligible Window: Automated 90-Day Reminder Active',
    theme: 'rose',
  },
]

export function SocialCampaignStudio() {
  const [activePreset, setActivePreset] = useState(campaignPresets[0])
  const [customGroup, setCustomGroup] = useState(activePreset.bloodGroup)
  const [customLocation, setCustomLocation] = useState(activePreset.location)
  const [copied, setCopied] = useState(false)

  const handlePresetChange = (preset) => {
    setActivePreset(preset)
    setCustomGroup(preset.bloodGroup)
    setCustomLocation(preset.location)
    setCopied(false)
  }

  const handleShare = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="campaign-studio">
      <div className="campaign-studio__controls">
        <div className="studio-kicker">
          <span>COMMUNITY ENGAGEMENT &amp; RETENTION</span>
          <small>Inspired by Blood Donation Social Media Template · Auto-Compiled from Live Network Data</small>
        </div>
        <h3>Verified Campaign &amp; Emergency Post Generator</h3>
        <p>
          In <strong>PS.txt</strong>, UPAY NGO highlights that creating donor communications, campaign updates, and verified alerts requires staff to repeatedly compile data from scattered sources. BloodGrid generates <strong>verified, privacy-safe social media templates</strong> in one click—and automatically stops circulation once the requirement is fulfilled.
        </p>

        <div className="preset-tabs" role="tablist">
          {campaignPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="tab"
              aria-selected={activePreset.id === preset.id}
              className={`preset-tab ${activePreset.id === preset.id ? 'active' : ''}`}
              onClick={() => handlePresetChange(preset)}
            >
              <strong>{preset.badge.split('·')[0]}</strong>
              <small>{preset.headlineMain}</small>
            </button>
          ))}
        </div>

        <div className="studio-customizer">
          <div className="field-group">
            <label htmlFor="campaign-blood-group">Target Blood Group</label>
            <div className="pill-row">
              {['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'ALL'].map((grp) => (
                <button
                  key={grp}
                  type="button"
                  className={`mini-group-pill ${customGroup === grp ? 'active' : ''}`}
                  onClick={() => setCustomGroup(grp)}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="campaign-location">Hospital / Camp Location</label>
            <input
              id="campaign-location"
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="studio-input"
            />
          </div>

          <div className="studio-actions">
            <button type="button" className="btn-crimson" onClick={handleShare}>
              {copied ? '✓ Verified Campaign Link Copied!' : 'Broadcast to Progressive Donor Ring ↗'}
            </button>
            <span className="privacy-shield-note">
              🔒 Personal phone numbers hidden · Routes via BloodGrid Consent Bridge
            </span>
          </div>
        </div>
      </div>

      {/* Dribbble Shot 15848659 Inspired Social Media Template Canvas */}
      <div className="dribbble-template-wrapper">
        <div className={`dribbble-post-card theme-${activePreset.theme}`}>
          {/* Top Decorative Geometric Waves & Medical Crosses */}
          <div className="post-wave post-wave--top" aria-hidden="true" />
          <div className="post-wave post-wave--bottom" aria-hidden="true" />
          <div className="post-dots-grid" aria-hidden="true" />
          <div className="post-cross post-cross--one" aria-hidden="true">+</div>
          <div className="post-cross post-cross--two" aria-hidden="true">+</div>

          {/* Header Brand Row */}
          <div className="post-card__top">
            <div className="post-brand">
              <span className="post-brand__drop" />
              <div>
                <strong>BloodGrid</strong>
                <small>SAMADHAN × UPAY NGO</small>
              </div>
            </div>
            <span className="post-verified-pill">✓ {activePreset.verificationCode}</span>
          </div>

          {/* Center Hero Composition */}
          <div className="post-card__body">
            <div className="post-copy-col">
              <span className="post-kicker">{activePreset.badge}</span>
              <h4>{activePreset.headlineTop}</h4>
              <h2>{activePreset.headlineMain}</h2>
              <p>{activePreset.subtext}</p>

              <div className="post-meta-chips">
                <div className="post-chip">
                  <small>REQUIREMENT</small>
                  <strong>{activePreset.unitsNeeded}</strong>
                </div>
                <div className="post-chip">
                  <small>LOCATION</small>
                  <strong>{customLocation}</strong>
                </div>
              </div>
            </div>

            {/* Central 3D-Styled Blood Drop & Heart Beat Emblem */}
            <div className="post-drop-emblem">
              <div className="drop-outer-ring" />
              <div className="drop-shape">
                <span className="drop-gloss" />
                <strong className="drop-group-text">{customGroup}</strong>
                <small>VERIFIED</small>
              </div>
              <svg className="post-ecg-line" viewBox="0 0 180 40" fill="none" aria-hidden="true">
                <path
                  d="M0 20 H45 L58 6 L70 35 L84 4 L98 32 L108 20 H180"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Bottom Footer Strip with QR & Call to Action */}
          <div className="post-card__footer">
            <div className="post-cta-box">
              <span>{activePreset.ctaText}</span>
              <b>→</b>
            </div>
            <div className="post-qr-badge">
              <div className="mock-qr-grid" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i /><i />
              </div>
              <div>
                <strong>SCAN QR CUSTODY</strong>
                <small>{activePreset.contactNote}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
