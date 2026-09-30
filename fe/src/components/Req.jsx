// Required-field marker for form labels: <label>Email <Req /></label>.
// Screen readers get "required" from aria-required on the input instead,
// so the asterisk itself is hidden from them.
export function Req() {
  return <span className="req" aria-hidden="true">*</span>;
}

// "* Required" note shown at the top of forms that use the marker.
export function ReqLegend() {
  return <p className="form-legend"><span className="req" aria-hidden="true">*</span> Required</p>;
}
