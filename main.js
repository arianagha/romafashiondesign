/* ============================================
   Roshanak Marefat Portfolio — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Behavior ---
    const header = document.querySelector('.header');
    const isHeroPage = document.querySelector('.hero') !== null;

    function updateHeader() {
        if (!header) return;
        if (isHeroPage) {
            if (window.scrollY > 60) {
                header.classList.remove('header--transparent');
                header.classList.add('header--solid');
            } else {
                header.classList.remove('header--solid');
                header.classList.add('header--transparent');
            }
        } else {
            header.classList.add('header--solid');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Fade In on Scroll ---
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // --- Lightbox ---
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    let galleryImages = [];

    if (galleryItems.length > 0 && lightbox) {
        galleryImages = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            return img ? img.src : '';
        }).filter(Boolean);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox();
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateLightbox(-1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateLightbox(1);
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    function openLightbox() {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = galleryImages[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = galleryImages.length - 1;
        if (currentIndex >= galleryImages.length) currentIndex = 0;
        if (lightboxImage) {
            lightboxImage.style.opacity = '0';
            setTimeout(() => {
                lightboxImage.src = galleryImages[currentIndex];
                lightboxImage.style.opacity = '1';
            }, 150);
        }
    }

    // --- Contact Form (Web3Forms + hCaptcha) ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.querySelector('.form-success');
    const formError = document.querySelector('.form-error');

    // Show thank-you if redirected back after submission
    if (window.location.hash === '#thankyou' && contactForm && formSuccess) {
        contactForm.style.display = 'none';
        formSuccess.classList.add('visible');
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            if (formError) formError.textContent = '';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    contactForm.style.display = 'none';
                    if (formSuccess) formSuccess.classList.add('visible');
                    contactForm.reset();
                } else {
                    if (formError) formError.textContent = 'Something went wrong. Please try again.';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (err) {
                if (formError) formError.textContent = 'Connection error. Please try again.';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Lazy Loading Images ---
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

});
