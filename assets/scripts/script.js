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
const createWorkElement = (work,active) => {
    const txt = `
    <div class="carousel-item ${active?'active':''}">
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
let active = true;
works.forEach(work => {
    const tmpl = createWorkElement(work,active);
    active = false;

    worksContainer.appendChild(tmpl);
});
const myWorkCarouselEl = document.querySelector('#workCarousel');

if (window.matchMedia("(min-width:640px)").matches){
    (()=>{
        const carousel = new bootstrap.Carousel(myWorkCarouselEl, {
            interval: false
        })

        const carouselWidth = worksContainer.scrollWidth;
        const workItemWidth = $('.carousel-item').width();
        const visibleCarouselWidth = $('.carousel').width();
    
        let scrollPosition = 0;
        $('.carousel-control-next').on('click', function(){
            if(scrollPosition < (carouselWidth - visibleCarouselWidth)) {
                scrollPosition = scrollPosition + workItemWidth;
            } else {
                scrollPosition = 0;
            }
            $('.carousel-inner').animate({scrollLeft: scrollPosition},600);
        });
    
        $('.carousel-control-prev').on('click', function(){
            if(scrollPosition > 0) {
                scrollPosition = scrollPosition - workItemWidth;
            } else {
                scrollPosition = carouselWidth - visibleCarouselWidth;
            }
            $('.carousel-inner').animate({scrollLeft: scrollPosition},600);
        })
    })()
} else {
    myWorkCarouselEl.classList.add('slide');
}


// End my Works