import profile from '../datas/profile.json' assert { type: 'json' };
import works from '../datas/works.json' assert { type: 'json' };

const nameElements = document.querySelectorAll('[data-profile=name]');
const jobsInlineElements = document.querySelectorAll('[data-profile=jobs-inline]');
const jobsDescElements = document.querySelectorAll('[data-profile=jobs-desc]');
const downloadCVAnchorElements = document.querySelectorAll('a[data-profile=download-cv]');

nameElements.forEach(el => el.textContent = profile.name);
jobsInlineElements.forEach(el => el.textContent = profile.jobs.join(', '))
jobsDescElements.forEach(el => el.innerHTML = profile.jobsDesc.map(v => `<p>${v}</p>`).join(''));
downloadCVAnchorElements.forEach(el => el.href = profile.downloadCV);
// console.log(new Date(profile.born));

// My works
const worksContainer = document.querySelector('[data-container=works]');
const createWorkElement = (work) => {
    const txt = `
    <div class="col-md-4">
        <div class="feature-content">
            <img src="${work.imageSrc}" alt="Image">
            <h2 class="feature-content-title green-text">${work.name}</h2>
            <p class="feature-content-description">${work.desc}</p>
            ${(work.links && work.links.length > 0)? '<div class="feature-content-link-container">'+work.links.map(link => `<a href="${link.href}" target="_blank" class="feature-content-link green-btn">${link.title}</a>`).join(' ')+'</div>':''}
        </div>
    </div>`;
    return $.parseHTML(txt.trim())[0];
}

worksContainer.childNodes.forEach(node => node.remove());
works.forEach(work => {
    const tmpl = createWorkElement(work);

    worksContainer.appendChild(tmpl);
});