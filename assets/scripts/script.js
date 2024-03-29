import profile from '../datas/profile.json' assert { type: 'json' };
import works from '../datas/works.json' assert { type: 'json' };

const nameElements = document.querySelectorAll('[data-profile=name]');
const emailElements = document.querySelectorAll('[data-profile=email]');
const jobsInlineElements = document.querySelectorAll('[data-profile=jobs-inline]');
const jobsDescElements = document.querySelectorAll('[data-profile=jobs-desc]');
const downloadCVAnchorElements = document.querySelectorAll('a[data-profile=download-cv]');

nameElements.forEach(el => el.textContent = profile.name);
emailElements.forEach(el => {
    if (el instanceof HTMLAnchorElement) {
        el.textContent = profile.email;
        el.href = 'mailto:'+profile.email;
    } else if (el instanceof HTMLFormElement) {
        el.action = 'mailto:'+profile.email;
    } else {
        const target = el.getAttribute('data-target');
        if (target && target != ''){
            const targetEls = document.querySelectorAll(target);
            if (targetEls){
                for(let targetEl of targetEls) {
                    targetEl.textContent = profile.email;
                }
            }
        }
    }

});
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
            <img src="${work.imageSrc}" alt="Image" class="feature-content-image">
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


// controller

let initWorkCarousel;
(initWorkCarousel = () => {
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
            let moved = false;
            $('.carousel-control-next').off('click');
            $('.carousel-control-next').on('click', function(){
                if (moved) return;
                if(scrollPosition < (carouselWidth - visibleCarouselWidth)) {
                    scrollPosition = scrollPosition + workItemWidth;
                } else {
                    $('.carousel-item:first').appendTo($('.carousel-inner'));
                    $('.carousel-inner').animate({scrollLeft: scrollPosition - workItemWidth},0);
                }
                moved = true;
                $('.carousel-inner').animate({scrollLeft: scrollPosition},600,()=>{
                    moved = false;
                });
            });

            $('.carousel-control-prev').off('click');
            $('.carousel-control-prev').on('click', function(){
                if (moved) return;
                if(scrollPosition > 0) {
                    scrollPosition = scrollPosition - workItemWidth;
                } else {
                    // scrollPosition = carouselWidth - visibleCarouselWidth;
                    $('.carousel-item:last').prependTo($('.carousel-inner'));
                    $('.carousel-inner').animate({scrollLeft: scrollPosition + workItemWidth},0);
                }
                moved = true;
                $('.carousel-inner').animate({scrollLeft: scrollPosition},600,()=>{
                    moved = false;
                });
            })
        })()
    } else {
        myWorkCarouselEl.classList.add('slide');
    }
})();


var resizeTimer = false;

$(window).on('resize', () => {

  if( !resizeTimer ) {
	$(window).trigger('resizestart');  	
  }

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {

	resizeTimer = false;
	$(window).trigger('resizeend');
            
  }, 250);

}).on('resizestart', function(){
	// console.log('Started resizing the window');
}).on('resizeend', function(){
	// console.log('Done resizing the window');
    initWorkCarousel();
});

// End my Works