import profile from '../datas/profile.json' with { type: 'json' };
import works from '../datas/works.json' with { type: 'json' };

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
    <div class="carousel-item ${active?'active':''} highlight-works-content">
        <img src="${work.imageSrc}" alt="Image" class="highlight-works-content-image">
        <div class="carousel-caption">
            <h2 class="highlight-works-content-title green-text">${work.name}</h2>
            <p class="highlight-works-content-description">${work.desc}</p>
            ${(work.links && work.links.length > 0)? '<div class="highlight-works-content-link-container">'+work.links.map(link => `<a href="${link.href}" target="_blank" class="btn btn-dark">${link.title}</a>`).join(' ')+'</div>':''}
        </div>
    </div>`;
    return $.parseHTML(txt.trim())[0];
}

// Background load
// $('.section').each((idx,sectionEl) => {
//     const imageURL = sectionEl.getAttribute('data-bg');
//     if(imageURL) {
//         const img = new Image();
//         img.onload = () => {
//             sectionEl.style.backgroundImage = 'url('+img.src+')';
//             sectionEl.classList.add('bg-loaded');
//         }
//         img.src = imageURL;
//     }
// })
// end bg load


worksContainer.childNodes.forEach(node => node.remove());
let active = true;
works.forEach(work => {
    const tmpl = createWorkElement(work,active);
    active = false;

    worksContainer.appendChild(tmpl);
});


// controller

// let initWorkCarousel;
// (initWorkCarousel = () => {
//     const myWorkCarouselEl = document.querySelector('#workCarousel');
    
//     if (window.matchMedia("(min-width:640px)").matches){
//         (()=>{
//             const carousel = new bootstrap.Carousel(myWorkCarouselEl, {
//                 interval: false
//             })
    
//             const carouselWidth = worksContainer.scrollWidth;
//             const workItemWidth = $('.carousel-item').width();
//             const visibleCarouselWidth = $('.carousel').width();
        
//             let scrollPosition = 0;
//             let moved = false;
//             $('.carousel-control-next').off('click');
//             $('.carousel-control-next').on('click', function(){
//                 if (moved) return;
//                 if(scrollPosition < (carouselWidth - visibleCarouselWidth)) {
//                     scrollPosition = scrollPosition + workItemWidth;
//                 } else {
//                     $('.carousel-item:first').appendTo($('.carousel-inner'));
//                     $('.carousel-inner').animate({scrollLeft: scrollPosition - workItemWidth},0);
//                 }
//                 moved = true;
//                 $('.carousel-inner').animate({scrollLeft: scrollPosition},600,()=>{
//                     moved = false;
//                 });
//             });

//             $('.carousel-control-prev').off('click');
//             $('.carousel-control-prev').on('click', function(){
//                 if (moved) return;
//                 if(scrollPosition > 0) {
//                     scrollPosition = scrollPosition - workItemWidth;
//                 } else {
//                     // scrollPosition = carouselWidth - visibleCarouselWidth;
//                     $('.carousel-item:last').prependTo($('.carousel-inner'));
//                     $('.carousel-inner').animate({scrollLeft: scrollPosition + workItemWidth},0);
//                 }
//                 moved = true;
//                 $('.carousel-inner').animate({scrollLeft: scrollPosition},600,()=>{
//                     moved = false;
//                 });
//             })
//         })()
//     } else {
//         myWorkCarouselEl.classList.add('slide');
//     }
// })();

// Work repos
function getElapsedTime(startDate, endDate) {
    let difference = endDate - startDate;
    //Arrange the difference of date in days, hours, minutes, and seconds format
    // let years = Math.floor(difference / (1000 * 60 * 60 * 24 * 30 * 12));
    // let months = Math.floor((difference % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30));
    // let days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    // let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);

    let oneMonth = (1000 * 60 * 60 * 24 * 30);
    let threeMonth = 3 * oneMonth;
    if(difference >= threeMonth) {
        const options = {
            month: 'short',
            day: 'numeric',
        }
        if(startDate.getFullYear() != endDate.getFullYear()){
            options.year = 'numeric';
        }
        return ' on '+startDate.toLocaleDateString('en-US',options);
    }
    let months = Math.round((difference % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30));
    if(months > 0) {
        if(months == 1)return 'last month';
        return months + ' months ago';
    }
    let days = Math.round((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    if(days > 0) {
        let weeks = Math.round(days / 7);
        if(weeks > 0){
            if(weeks == 1)return 'last week';
            return weeks + ' weeks ago';
        }
        if(days == 1)return 'yesterday';
        return days + ' days ago';
    }
    let hours = Math.round((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if(hours > 0){
        if(hours == 1)return 'an hour ago';
        return hours + ' hours ago';
    }
    let minutes = Math.round((difference % (1000 * 60 * 60)) / (1000 * 60));
    if(minutes > 0){
        if(minutes == 1)return 'one minute ago';
        return minutes + ' minutes ago';
    }
    return 'a moment ago';

    // let result = '';
    // if(years > 0)result += years + " years ";
    // if(months > 0)result += months + " months ";
    // if(days > 0)result += days + " days ";
    // if(hours > 0)result += hours + " hours ";
    // if(minutes > 0)result += minutes + " minutes ";
    // if(seconds > 0)result += seconds + " seconds";

    // return result + ' ago.';
 }

const initRepos = (repos) => {
    const $container = $('#works_gh-repo');
    $container.empty();

    const currTime = new Date();

    repos.forEach(repo => {
        const repoDate = new Date(repo['updated_at']);
        const txt = `
        <div class="col-md-4 mb-3">
            <div class="card h-100 text-bg-secondary border-5 border-info border-white border-top-0 border-start-0 border-end-0">
                <div class="card-body">
                    <h3>${repo['full_name']}</h3>
                    <p class="text-muted">${repo['description'] || repo['name']}</p>
                    <a href="${repo['html_url']}" class="btn btn-light card-link" target="_blank">Go to repo</a>
                    ${repo['homepage']?`
                    <a href="${repo['homepage']}" class="btn btn-light card-link" target="_blank">Page</a>
                    `:''}
                </div>
                <div class="card-footer">
                    <small class="text-body-secondary">Updated ${getElapsedTime(repoDate,currTime)}</small>
                </div>
            </div>
        </div>
        `;
        $container.append($.parseHTML(txt.trim()));
    })
}

var settings = {
    "url": "https://api.github.com/users/ryomario/repos?sort=updated",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "accept": "application/vnd.github+json",
    },
};

$.ajax(settings).done(function (response) {
    initRepos(response);
});


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
    // initWorkCarousel();
});

// End my Works