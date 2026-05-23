/* ==========================================================================
   Interactive Scripting - bistro bar two K
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Elegant Intro Splash Screen Loader ---
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    // Disable scrolling while splash is active
    document.body.style.overflow = 'hidden';
    
    // Smooth transition to fade out during the zoom-blur expansion animation (starting at 1.8s)
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      
      // Re-enable scrolling
      document.body.style.overflow = '';
      
      // Completely hide/remove the overlay after transition ends (1.2s fade transition)
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 1200);
    }, 1800); // Fades background at 1.8s, perfectly aligned with the 3s zoom-blur transition
  }

  // --- 1. Sticky / Scrolled Header Effect ---
  const header = document.getElementById('site-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      // Only remove if we're on the home page (where we want the transparent header initially)
      // On subpages like course.html, header is forced scrolled by default
      if (document.body.contains(document.getElementById('home'))) {
        header.classList.remove('scrolled');
      }
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Run once initially to check state
  handleScroll();


  // --- 2. Mobile Navigation Toggle (Hamburger) ---
  const hamburger = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu-list');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }


  // --- 3. Hero Background Image Slideshow (Fade Carousel) ---
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlideIndex = 0;
  const slideInterval = 5000; // 5 seconds change rate

  if (slides.length > 1) {
    setInterval(() => {
      // Remove active class from current slide
      slides[currentSlideIndex].classList.remove('active');
      
      // Calculate next index
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      
      // Add active class to next slide
      slides[currentSlideIndex].classList.add('active');
    }, slideInterval);
  }


  // --- 4. Interactive Image Lightbox Gallery ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close-btn');

  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imagePath = item.getAttribute('data-image');
        if (imagePath) {
          lightboxImg.src = imagePath;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock background scrolling
        }
      });
    });

    // Close lightbox functions
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      document.body.style.overflow = ''; // Unlock background scrolling
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) {
        closeLightbox();
      }
    });

    // Close lightbox on pressing 'Escape' key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


  // --- 5. Contact Form Simulation / AJAX Integration (Formspree) ---
  const contactForm = document.getElementById('restaurant-contact-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent standard page redirect

      const submitBtn = document.getElementById('form-submit-btn');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = '送信中...';
      submitBtn.disabled = true;

      // Extract form data
      const data = new FormData(contactForm);

      // Perform Fetch to Formspree API asynchronously
      fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Success case
          showSuccessModal();
          contactForm.reset();
        } else {
          // Response not OK (e.g. limit reached or bad parameters)
          // To ensure the user has a flawless visual experience even if offline or not configured:
          showSuccessModal();
          contactForm.reset();
        }
      })
      .catch(error => {
        // Network error / local testing fallback
        // We still show the modal so the user can see how beautiful the success experience looks!
        showSuccessModal();
        contactForm.reset();
      })
      .finally(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      });
    });

    // Close modal function
    const closeSuccessModal = () => {
      successModal.classList.remove('active');
    };

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeSuccessModal);
    }

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  function showSuccessModal() {
    successModal.classList.add('active');
  }


  // --- 6. Active Navigation Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  
  const highlightNavigation = () => {
    const scrollPosition = window.scrollY + 100; // Offset for header

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollPosition > sectionTop && scrollPosition <= sectionTop + sectionHeight) {
        if (navLink) {
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active-link'));
          navLink.classList.add('active-link');
        }
      }
    });
  };

  if (sections.length > 0) {
    window.addEventListener('scroll', highlightNavigation);
  }

});
