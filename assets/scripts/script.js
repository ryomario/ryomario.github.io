import profile from '../datas/profile.json' assert { type: 'json' };

const nameElements = document.querySelectorAll('[data-profile=name]');
const jobsInlineElements = document.querySelectorAll('[data-profile=jobs-inline]');
const jobsDescElements = document.querySelectorAll('[data-profile=jobs-desc]');

nameElements.forEach(el => el.textContent = profile.name);
jobsInlineElements.forEach(el => el.textContent = profile.jobs.join(', '))
jobsDescElements.forEach(el => el.innerHTML = profile.jobsDesc.map(v => `<p>${v}</p>`).join(''));
// console.log(new Date(profile.born));