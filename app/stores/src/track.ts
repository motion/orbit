import KeenTracking from 'keen-tracking'

// This is your actual Project ID and Write Key
export const track = new KeenTracking({
  projectId: '5bb666d3c9e77c0001dd0906',
  writeKey:
    '672B20CC0B152CCB5E47C12167106EC1B37F8716A4618D390F6E761ECB3F558174DEE689C1313E9B5B6422F08519403DA7324F78E86F206CE80AA41EA29F0CF8F71F1DD1ACB993B06BB69AD3A400E9D69C1503327DFD9293D37132C35B521A0A',
})

// // Record an event
// client.recordEvent('pageviews', {
//   title: document.title
// });
