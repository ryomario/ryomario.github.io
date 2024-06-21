import profile from '../datas/profile.json' with { type: 'json' };
import works from '../datas/works.json' with { type: 'json' };

const nameElements = document.querySelectorAll('[data-profile=name]');
const emailElements = document.querySelectorAll('[data-profile=email]');
const anchorElements = document.querySelectorAll('a[data-anchor]');
const jobsInlineElements = document.querySelectorAll('[data-profile=jobs-inline]');
const jobsDescElements = document.querySelectorAll('[data-profile=jobs-desc]');
const downloadCVAnchorElements = document.querySelectorAll('a[data-profile=download-cv]');

nameElements.forEach(el => el.textContent = profile.name);
emailElements.forEach(el => {
    if (el instanceof HTMLAnchorElement) {
        if(!el.classList.contains('no-text'))el.textContent = profile.email;
        el.href = 'mailto:'+profile.email;
    } else if (el instanceof HTMLFormElement) {
        el.action = 'mailto:'+profile.email;
    } else {
        el.textContent = profile.email;
    }

});
anchorElements.forEach(el => {
    if (el instanceof HTMLAnchorElement) {
        if(!el.classList.contains('no-text'))el.textContent = profile[el.dataset.profile];
        el.href = profile[el.dataset.profile];
    }

});
jobsInlineElements.forEach(el => el.textContent = profile.jobs.join(', '))
jobsDescElements.forEach(el => el.innerHTML = profile.jobsDesc.map(v => `<p>${v}</p>`).join(''));
downloadCVAnchorElements.forEach(el => el.href = profile.downloadCV);
// console.log(new Date(profile.born));

function initProgress(containerSegment, total) {
    const $loader = $('<div class="ui bottom attached progress"><div class="bar"></div></div>');
    
    $loader.appendTo(containerSegment);
    
    $loader.progress({
        total,
        onSuccess: function(total) {
            $loader.remove();
        }
    });

    $loader.progress('reset');

    const setPercent = (percent) => {
        $loader.progress({percent});
    }
    const setDone = () => {
        $loader.progress({percent: 100});
        $loader.remove();
    }

    return {
        setPercent,
        setDone
    }
}

// My works
const worksContainer = document.querySelector('[data-container=works]');
const createWorkElement = (work) => {
    const container = $.parseHTML(`<div class="card with-popup" data-title="${work.name}" data-content="${work.desc}"></div>`)[0];
    const img_container = $.parseHTML(`<div class="image"><div class="ui active centered loader"></div></div>`)[0];
    const content = $.parseHTML(`
    <div class="content work">
        <div class="center aligned header">${work.name}</div>
        ${(work.links && work.links.length > 0)? '<div class="center aligned spaced">'+work.links.map(link => `<a href="${link.href}" target="_blank" class="mini ui icon button green"><i class="${link.icon} icon"></i> ${link.title}</a>`).join(' ')+'</div>':''}
    </div>`.trim())[0];

    const img = new Image();
    img.onload = () => {
        while(img_container.firstChild)img_container.removeChild(img_container.lastChild);
        img_container.appendChild(img);
    }
    img.onerror = () => {
        const error_image = '/assets/images/error_image.png';
        if(img.src != error_image)img.src = error_image;
        else img.src = '';
    }
    img.src = work.imageSrc;

    container.appendChild(img_container);
    container.appendChild(content);
    return container;
}

const worksProgress = initProgress(worksContainer.parentNode);
while(worksContainer.firstChild)worksContainer.removeChild(worksContainer.lastChild);

works.forEach((work, idx) => {
    const tmpl = createWorkElement(work);

    worksContainer.appendChild(tmpl);

    worksProgress.setPercent((idx + 1) / works.length * 100);
});

worksProgress.setDone();

if((worksContainer.scrollHeight + 100) >= window.innerHeight) {
    const btn_showmore = $('<div class="show more"><div>Show More</div><i class="angle down icon"></i></div>');
    btn_showmore.appendTo(worksContainer);

    btn_showmore.click(e => {
        worksContainer.animate([{
            maxHeight: worksContainer.scrollHeight + 'px'
        }],{duration:500,iterations:1,easing:'ease-in-out'})
            .finished.then(val => {
                worksContainer.style.maxHeight = 'unset';
                worksContainer.style.overflowY = 'visible';
                btn_showmore[0].animate([{opacity: 0}],200).finished.then(() => {
                    btn_showmore.remove();
                });
            });
    });
}


// Github profile

function SetGithubProfile(profile) {
    const txt = `
    <div class="item">
        <div class="ui small circular image">
            <img src="${profile.avatar_url}" alt="Github avatar">
        </div>
        <div class="content">
            <a href="${profile.html_url}" class="header">${profile.name} <i class="small external alternate icon"></i></a>
            <div class="meta">
                <i class="github icon"></i>
                <span>${profile.login}</span>
            </div>
            <div class="description">${profile.bio}</div>
            <div class="extra">
                <div class="ui label">
                    <i class="book icon"></i>
                    ${profile.public_repos} repositories
                    ·
                    ${profile.public_gists} gists
                </div>
                <div class="ui label">
                    <i class="users icon"></i>
                    ${profile.followers} followers
                    ·
                    ${profile.following} following
                </div>
            </div>
        </div>
    </div>
    `;

    $('[data-github=profile]').html(txt);
}

var settings = {
    "url": "https://api.github.com/users/ryomario",
    "method": "GET",
    "timeout": 0,
    "headers": {
        "accept": "application/vnd.github+json",
    },
};

$.ajax(settings).done(function (response) {
    SetGithubProfile(response);
});
