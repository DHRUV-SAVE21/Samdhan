export function EyeLoader({ visible }) {
  return <div className={visible ? 'eye-loader' : 'eye-loader eye-loader--hidden'} aria-hidden={!visible} aria-label="Loading Drishti AI">
    <div className="loader-grid" />
    <div className="loader-eye"><span className="loader-lid loader-lid--top"/><span className="loader-iris"><i /></span><span className="loader-lid loader-lid--bottom"/></div>
    <div className="loader-copy"><strong>DRISHTI</strong><span>INITIALISING PERCEPTION</span><i /></div>
  </div>
}
