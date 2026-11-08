const fs = require('fs');

async function test() {
  const res = await fetch('http://localhost:8080/index.html');
  const html = await res.text();
  console.log('Status:', res.status);
  console.log('Has inputEducation:', html.includes('id="inputEducation"'));
  console.log('Has careerEduFilterWrap:', html.includes('id="careerEduFilterWrap"'));
  console.log('Has btnEduDiploma:', html.includes('id="btnEduDiploma"'));
  console.log('Has btnEduUG:', html.includes('id="btnEduUG"'));
  console.log('HTML Length:', html.length);
}

test();
