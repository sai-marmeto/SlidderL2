fetch('content.json')
    .then(response => response.json())
    .then(jsonData => {
        loadHeader(jsonData.header);
        loadCarousel(jsonData.sectionBlocks, jsonData.socialIcons);
        initializeSplide(jsonData.sectionBlocks);
    })
    .catch(error => console.error('Error loading JSON data:', error));

function loadHeader(headerData) {
    const header = document.getElementById('site-header');
    const logo = header.querySelector('.logo-container img');
    logo.src = headerData.logo;
    
    const navMenu = document.getElementById('nav-menu');
    const navLinks = headerData.nav.map(navItem => `<li><a href="${navItem.NavLink}">${navItem.linkTitle}</a></li>`).join('');
    navMenu.innerHTML = navLinks;
    
    const signUpButton = document.getElementById('cta-signup');
    if (!headerData.showSignUpButton) {
        signUpButton.style.display = 'none';
    }
}

function loadCarousel(sectionBlocks, socialIcons) {
    const carouselList = document.getElementById('carousel-list');
    sectionBlocks.forEach(block => {
        const slide = document.createElement('li');
        slide.className = 'splide__slide';
        slide.dataset.bgGradient = block.bgGradient; 
        slide.innerHTML = `
            <div class="slide-content">
                <h2>${block.heading}</h2>
                <p style="font-size: 18px;">${block.description}</p> <!-- Increased font size to 18px -->
                <div class="price">${block.price}</div>
                <div class="social-icons">
                    ${createSocialIcons(socialIcons)}
                </div>
            </div>
            <div class="slide-image">
                <img src="${block.media}" alt="${block.heading}">
            </div>
        `;
        carouselList.appendChild(slide);
    });
}

function createSocialIcons(socialIcons) {
    if (!socialIcons || !Array.isArray(socialIcons)) {
        return ''; 
    }

    return socialIcons.map(icon => `
        <a href="${icon.link}">
            <img src="${icon.icon}" alt="${icon.name}">
        </a>
    `).join('');
}


function initializeSplide(sectionBlocks) {
    const splide = new Splide('.splide', {
        type: 'loop',
        autoplay: false,
        pauseOnHover: false,
        resetProgress: false,
        heightRatio: 0.5,
    });

    splide.on('mounted moved', function () {
        const activeSlide = splide.Components.Elements.slides[splide.index];
        const bgGradient = activeSlide.dataset.bgGradient;
        if (bgGradient) {
            document.body.style.background = bgGradient; 
        } else {
            console.error('No gradient data found for the active slide.');
        }
    });

    splide.mount();
}
