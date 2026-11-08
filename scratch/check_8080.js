const http = require('http');

http.get('http://localhost:8080/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP 8080 Status:', res.statusCode);
    console.log('Has horaMasterSection:', data.includes('id="horaMasterSection"'));
    console.log('Has pillHora:', data.includes('id="pillHora"'));
    console.log('Has horaLiveStatusBanner:', data.includes('id="horaLiveStatusBanner"'));
    console.log('Has horaActiveSummaryBadge:', data.includes('id="horaActiveSummaryBadge"'));
    console.log('Has horaHierarchyTree:', data.includes('id="horaHierarchyTree"'));
  });
});
