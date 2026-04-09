/**
 * =============================================================================
 * MINDFUELS — MAIN SCRIPT
 * =============================================================================
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. STICKY HEADER SHADOW
 *  2. MOBILE MENU TOGGLE
 *  3. SCROLL ANIMATIONS  (Fade-up on scroll)
 *  4. HERO CAROUSEL
 *  5. TAB SWITCHING      (Parents / Teachers)
 *  6. PRODUCT SCROLL     (Horizontal product rows + Category carousel)
 *  7. TESTIMONIAL CAROUSEL
 *  8. WISHLIST TOGGLE
 *  9. PRODUCT CATALOG
 *     9a. Raw product data (TSV)
 *     9b. Filter metadata  (interests, subjects, classes)
 *     9c. Product parser
 *     9d. Render / filter / sort
 * 10. PRODUCT MODAL
 * 11. SIDEBAR (Filter panel toggle)
 * =============================================================================
 */


/* ─────────────────────────────────────────────────────────────────────────────
   1. STICKY HEADER SHADOW
   Adds / removes a CSS class on the header as the user scrolls.
───────────────────────────────────────────────────────────────────────────── */

const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});


/* ─────────────────────────────────────────────────────────────────────────────
   2. MOBILE MENU TOGGLE
   Opens / closes the main navigation on small screens.
───────────────────────────────────────────────────────────────────────────── */

function toggleMenu() {
  const nav       = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  nav.classList.toggle('open');
  hamburger.classList.toggle('active');
}


/* ─────────────────────────────────────────────────────────────────────────────
   3. SCROLL ANIMATIONS  (Fade-up on scroll)
   Uses IntersectionObserver to trigger a .visible class when elements
   with the class .fade-up enter the viewport.
───────────────────────────────────────────────────────────────────────────── */

const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once then stop watching
      }
    });
  },
  { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
);

fadeElements.forEach(el => observer.observe(el));


/* ─────────────────────────────────────────────────────────────────────────────
   4. HERO CAROUSEL
   Auto-plays every 4 s, pauses on hover, and supports touch / swipe.
───────────────────────────────────────────────────────────────────────────── */

let currentSlide     = 0;
const totalSlides    = document.querySelectorAll('.hero-slide').length;
const heroTrack      = document.getElementById('heroTrack');
const heroDots       = document.querySelectorAll('.hero-dot');
let   autoPlayInterval;

/** Move the carousel to the given slide index (wraps around). */
function goToSlide(index) {
  currentSlide = index;
  if (currentSlide < 0)            currentSlide = totalSlides - 1;
  if (currentSlide >= totalSlides) currentSlide = 0;

  heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  heroDots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoPlay() { autoPlayInterval = setInterval(nextSlide, 4000); }
function stopAutoPlay()  { clearInterval(autoPlayInterval); }

// Boot the carousel
startAutoPlay();

// Pause on hover
const heroSection = document.getElementById('heroCarousel');
if (heroSection) {
  heroSection.addEventListener('mouseenter', stopAutoPlay);
  heroSection.addEventListener('mouseleave', startAutoPlay);

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX   = 0;

  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    startAutoPlay();
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────────────────────────
   5. TAB SWITCHING  (Parents / Teachers)
   Shows the correct product section and marks the active tab button.
───────────────────────────────────────────────────────────────────────────── */

function switchTab(tab) {
  const parentsProducts  = document.getElementById('parentsProducts');
  const teachersProducts = document.getElementById('teachersProducts');
  const tabParents       = document.getElementById('tabParents');
  const tabTeachers      = document.getElementById('tabTeachers');

  const showParents = tab === 'parents';
  parentsProducts.style.display  = showParents ? 'block' : 'none';
  teachersProducts.style.display = showParents ? 'none'  : 'block';
  tabParents.classList.toggle('active',  showParents);
  tabTeachers.classList.toggle('active', !showParents);
}


/* ─────────────────────────────────────────────────────────────────────────────
   6. PRODUCT SCROLL  (Horizontal rows + Category carousel)
   Clones children 3× so scrolling loops seamlessly.
───────────────────────────────────────────────────────────────────────────── */

/**
 * Scroll a product row left (-1) or right (+1).
 * Also handles wrap-around after the smooth scroll animation finishes.
 */
function scrollProducts(scrollId, direction) {
  const container = document.getElementById(scrollId);
  if (!container) return;

  const scrollAmount = 480;
  container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

  // Seamless infinite wrap — re-centre in the middle clone after scroll settles
  setTimeout(() => {
    const oneSetWidth = container.scrollWidth / 3;
    const tooFarLeft  = container.scrollLeft < oneSetWidth / 2;
    const tooFarRight = container.scrollLeft > oneSetWidth * 2;

    if (tooFarLeft || tooFarRight) {
      container.style.scrollBehavior = 'auto';
      container.scrollLeft += tooFarLeft ? oneSetWidth : -oneSetWidth;
      setTimeout(() => { container.style.scrollBehavior = ''; }, 50);
    }
  }, 600);
}

document.addEventListener('DOMContentLoaded', () => {

  // --- Product row infinite setup is handled inside renderHomeBestsellers() ---

  // --- Category carousel (infinite loop) ---
  const catTrack = document.getElementById('catTrack');
  if (catTrack) {
    const original = catTrack.innerHTML;
    catTrack.innerHTML = original + original + original; // triple-clone
    catTrack.style.scrollSnapType = 'none'; // disable snap for smooth infinite scroll

    // Start in the middle clone
    setTimeout(() => {
      catTrack.style.scrollBehavior = 'auto';
      catTrack.scrollLeft = catTrack.scrollWidth / 3;
      setTimeout(() => { catTrack.style.scrollBehavior = ''; }, 50);
    }, 100);

    // Wrap-around on scroll edges
    catTrack.addEventListener('scroll', () => {
      const max = catTrack.scrollWidth / 3;
      const atLeft  = catTrack.scrollLeft <= 0;
      const atRight = catTrack.scrollLeft >= max * 2;

      if (atLeft || atRight) {
        catTrack.style.scrollBehavior = 'auto';
        catTrack.scrollLeft = max; // jump back to centre clone
        setTimeout(() => { catTrack.style.scrollBehavior = ''; }, 50);
      }
    });
  }

  // Expose category scroll function globally so HTML onclick attributes can call it
  window.scrollCat = function(dir) {
    const track = document.getElementById('catTrack');
    if (!track) return;
    const wrap      = track.querySelector('.cat-wrap');
    const cardWidth = wrap ? wrap.offsetWidth + 16 : 340;
    track.scrollBy({ left: cardWidth * dir, behavior: 'smooth' });
  };

});


/* ─────────────────────────────────────────────────────────────────────────────
   7. TESTIMONIAL CAROUSEL
   Renders video testimonial cards, auto-scrolls, and handles video play/pause.
───────────────────────────────────────────────────────────────────────────── */

const testimonialData = [
  { video: "videos/vid1.mp4", quote: "I choose comfort for my child and care for tomorrow. Made with the same care I give my Child", rot: 1 },
  { video: "videos/vid2.mp4", quote: "My kid absolutely loves the stories. It's our everyday ritual now.", rot: 2 },
  { video: "videos/vid3.mp4", quote: "The quality and the thought put into these books are amazing.", rot: 3 },
  { video: "videos/vid4.mp4", quote: "The perfect blend of learning and fun! Highly recommended.", rot: 1 },
  { video: "videos/vid5.mp4", quote: "Mind-Quests have changed our evening routines for the better.", rot: 2 },
  { video: "videos/vid6.mp4", quote: "Beautiful illustrations and meaningful life lessons.", rot: 3 },
  { video: "videos/vid7.mp4", quote: "Every page is a new adventure! Brilliant concept.", rot: 1 },
  { video: "videos/vid8.mp4", quote: "A wonderful way to bond with my child over meaningful stories.", rot: 2 },
];

const testimonialTrack = document.getElementById('testimonialTrack');

if (testimonialTrack) {

  /** Build the HTML string for one testimonial card. */
  const createCardHTML = (data) => `
    <div class="testimonial-card rot-${data.rot}">
      <div class="video-container">
        <video class="testimonial-video" src="${data.video}" loop playsinline></video>
        <button class="play-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" class="pause-icon" style="display:none;">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
      </div>
      <div class="testimonial-quote">"${data.quote}"</div>
    </div>
  `;

  // Triple-clone for robust infinite scroll
  const allCardsHTML = testimonialData.map(createCardHTML).join('');
  testimonialTrack.innerHTML = allCardsHTML + allCardsHTML + allCardsHTML;

  // --- Auto-scroll ---
  let isHoveringTestimonials  = false;
  let isScrollingTestimonials = false;

  function autoScrollTestimonials() {
    const animPaused = testimonialTrack.style.animationPlayState === 'paused';
    if (!isHoveringTestimonials && !isScrollingTestimonials && !animPaused) {
      testimonialTrack.scrollLeft += 1.5;
    }

    // Wrap-around (avoid jumping mid-smooth-scroll)
    if (!isScrollingTestimonials) {
      if (testimonialTrack.scrollLeft >= 2240) {
        testimonialTrack.scrollLeft -= 2240;
      } else if (testimonialTrack.scrollLeft <= 0) {
        testimonialTrack.scrollLeft += 2240;
      }
    }
    requestAnimationFrame(autoScrollTestimonials);
  }

  testimonialTrack.addEventListener('mouseenter', () => { isHoveringTestimonials = true;  });
  testimonialTrack.addEventListener('mouseleave', () => { isHoveringTestimonials = false; });

  requestAnimationFrame(autoScrollTestimonials);

  // Manual scroll buttons (exposed globally for HTML onclick)
  window.scrollTestimonials = function(dir) {
    isScrollingTestimonials = true;
    testimonialTrack.scrollBy({ left: 280 * dir, behavior: 'smooth' });
    setTimeout(() => { isScrollingTestimonials = false; }, 600);
  };

  // Product track scroll (also exposed globally here for convenience)
  window.scrollProducts = function(id, dir) {
    const track = document.getElementById(id);
    if (track) track.scrollBy({ left: 300 * dir, behavior: 'smooth' });
  };

  // --- Video play / pause on click ---
  const containers = testimonialTrack.querySelectorAll('.video-container');

  containers.forEach(container => {
    container.addEventListener('click', () => {
      const video = container.querySelector('video');

      if (video.paused) {
        // Pause any other playing videos first
        containers.forEach(c => {
          const v = c.querySelector('video');
          if (v !== video && !v.paused) {
            v.pause();
            c.classList.remove('playing');
          }
        });

        video.play();
        container.classList.add('playing');
        testimonialTrack.style.animationPlayState = 'paused';
      } else {
        video.pause();
        container.classList.remove('playing');

        // Resume auto-scroll only when ALL videos are paused
        const anyStillPlaying = Array.from(containers).some(c => !c.querySelector('video').paused);
        if (!anyStillPlaying) {
          testimonialTrack.style.animationPlayState = '';
        }
      }
    });
  });

}


/* ─────────────────────────────────────────────────────────────────────────────
   8. WISHLIST TOGGLE
   Toggles the heart icon between hollow ♡ and filled ♥.
───────────────────────────────────────────────────────────────────────────── */

let wishlist = JSON.parse(localStorage.getItem('mindfuels_wishlist')) || [];

window.toggleWishlist = function(btn, productId) {
  if (!window.isUserLoggedIn) {
    alert("Please sign in to add products to your wishlist.");
    window.location.href = "login.html";
    return;
  }

  // If productId not explicitly provided but modal is open, use modal's product
  if (!productId && window.currentModalProduct) {
    productId = window.currentModalProduct.id;
  }

  if (productId) {
    const idx = wishlist.indexOf(productId);
    if (idx === -1) {
      wishlist.push(productId);
      if (btn) {
        btn.innerText = '♥';
        btn.style.color = '#F93549';
      }
    } else {
      wishlist.splice(idx, 1);
      if (btn) {
        btn.innerText = '♡';
        btn.style.color = '';
      }
    }
    localStorage.setItem('mindfuels_wishlist', JSON.stringify(wishlist));
    
    // Auto-update all matching wishlist buttons on screen
    document.querySelectorAll('.product-wishlist').forEach(otherBtn => {
      if (otherBtn.dataset.productId == productId) {
        otherBtn.innerText = idx === -1 ? '♥' : '♡';
        otherBtn.style.color = idx === -1 ? '#F93549' : '';
      }
    });

    if (typeof updateWishlistDropdown === 'function') updateWishlistDropdown();

  } else {
    // Fallback for static elements with no specific ID
    const isWishlisted = btn.innerText.trim() === '♥';
    btn.innerText    = isWishlisted ? '♡' : '♥';
    btn.style.color  = isWishlisted ? ''  : '#F93549';
  }
};

// Handle wishlist buttons rendered in static HTML
document.querySelectorAll('.product-wishlist').forEach(btn => {
  if (!btn.onclick) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleWishlist(btn);
    });
  }
});

// Alias used by the modal
window.toggleModalWishlist = function(btn) {
  toggleWishlist(btn);
};


/* ─────────────────────────────────────────────────────────────────────────────
   9. PRODUCT CATALOG
───────────────────────────────────────────────────────────────────────────── */

/* ── 9a. Product data is now loaded from data.js ── */


/* ── 9d. Render / filter / sort ─────────────────────────────────────────── */

/**
 * Read all active filters from the sidebar and re-render the product grid.
 * Called on page load, filter change, and price-range input.
 */
function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  // Collect checked filter values
  const selectedInterests = Array.from(
    document.querySelectorAll('#interestFilter input:checked')
  ).map(cb => cb.value);

  const selectedSubjects = Array.from(
    document.querySelectorAll('#subjectFilter input:checked')
  ).map(cb => cb.value);

  const selectedClasses = Array.from(
    document.querySelectorAll('#classFilter input:checked')
  ).map(cb => cb.value);

  const priceRange = document.getElementById('priceRange');
  const maxPrice   = priceRange ? parseInt(priceRange.value, 10) : 1500;

  const searchInput = document.getElementById('searchInput');
  const searchTerm  = searchInput ? searchInput.value.toLowerCase().trim() : '';

  // Filter
  let filtered = catalogProducts.filter(p => {
    if (searchTerm) {
      const matchName = p.name && p.name.toLowerCase().includes(searchTerm);
      const matchTags = p.searchTags && p.searchTags.includes(searchTerm);
      if (!matchName && !matchTags) return false;
    }

    const hasInterest = Array.isArray(p.interest) ? p.interest.some(i => selectedInterests.includes(i)) : selectedInterests.includes(p.interest);
    if (selectedInterests.length > 0 && !hasInterest) return false;

    const hasSubject = Array.isArray(p.subject) ? p.subject.some(s => selectedSubjects.includes(s)) : selectedSubjects.includes(p.subject);
    if (selectedSubjects.length > 0 && !hasSubject) return false;

    const hasClass = Array.isArray(p.ageGroup) ? p.ageGroup.some(c => selectedClasses.includes(c)) : selectedClasses.includes(p.ageGroup);
    if (selectedClasses.length > 0 && !hasClass) return false;

    if (p.price > maxPrice) return false;
    return true;
  });

  // Render
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#888;font-size:18px;">No products found matching your criteria.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    const showTopBadge = discountPercent > 0;
    const showBottomOffer = discountPercent > 0;

    return `
      <div class="product-card" onclick='openModal(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
        <div class="product-img">
          <img src="${p.images[0]}" alt="${p.name}">
          ${showTopBadge ? `<span class="product-badge">${discountPercent}% OFF</span>` : ''}
          <button class="product-wishlist" aria-label="Wishlist" data-product-id="${p.id}"
                  style="color: ${wishlist.includes(p.id) ? '#F93549' : ''};"
                  onclick="event.stopPropagation(); window.toggleWishlist(this, ${p.id});">
                 ${wishlist.includes(p.id) ? '♥' : '♡'}
          </button>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">
            <span class="price-current">₹${p.price}</span>
            ${showBottomOffer ? `
              <span class="price-original">₹${p.originalPrice}</span>
              <span class="price-discount">(${discountPercent}% OFF)</span>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Expose globally so HTML onchange / oninput attributes can call it
window.renderProducts = renderProducts;

/** Update the visible price label and re-render. */
window.updatePriceDisplay = function(val) {
  const display = document.getElementById('priceDisplay');
  if (display) display.innerText = val;
  renderProducts();
};



// Wire up filter checkboxes and price slider, then do the initial render
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      // Enforce global single-selection
      if (e.target.checked) {
        document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(otherCb => {
          if (otherCb !== e.target) otherCb.checked = false;
        });
      }
      renderProducts();
      window.scrollTo(0, 0);
    });
  });

  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.addEventListener('input', () => updatePriceDisplay(priceRange.value));
  }

  // Check URL for search parameter and apply it
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('search');
  const navSearchInput = document.getElementById('searchInput');
  if (q && navSearchInput) {
    navSearchInput.value = q;
    const wrapper = document.getElementById('navSearchWrapper');
    if (wrapper) wrapper.classList.add('open');
  }

  // Check URL for class filter and apply it
  const urlClass = urlParams.get('class');
  if (urlClass) {
    const classCheckboxes = document.querySelectorAll('#classFilter input[type="checkbox"]');
    classCheckboxes.forEach(cb => {
      if (cb.value.trim().toLowerCase() === urlClass.trim().toLowerCase()) {
        cb.checked = true;
      }
    });
  }

  // Check URL for subject filter and apply it
  const urlSubject = urlParams.get('subject');
  if (urlSubject) {
    const subjectCheckboxes = document.querySelectorAll('#subjectFilter input[type="checkbox"]');
    subjectCheckboxes.forEach(cb => {
      if (cb.value.trim().toLowerCase() === urlSubject.trim().toLowerCase()) {
        cb.checked = true;
      }
    });
  }

  // Check URL for interest filter and apply it
  const urlInterest = urlParams.get('interest');
  if (urlInterest) {
    const interestCheckboxes = document.querySelectorAll('#interestFilter input[type="checkbox"]');
    interestCheckboxes.forEach(cb => {
      if (cb.value.trim().toLowerCase() === urlInterest.trim().toLowerCase()) {
        cb.checked = true;
      }
    });
  }

  renderProducts();
  renderHomeBestsellers();
});

window.toggleSearchInput = function() {
  const wrapper = document.getElementById('navSearchWrapper');
  const input = document.getElementById('searchInput');
  if(wrapper) {
    wrapper.classList.toggle('open');
    if(wrapper.classList.contains('open') && input) {
      input.focus();
    } else if (input && input.value.trim() !== '') {
      // Clear input and search when closed
      input.value = '';
      if(window.renderProducts) renderProducts();
    }
  }
};

/**
 * Populate the Trusted Favorites carousel tracks on the home page
 * with real product cards from catalogProducts.
 */
function renderHomeBestsellers() {
  const parentsTrack = document.getElementById('parentsScroll');
  const teachersTrack = document.getElementById('teachersScroll');
  if (!parentsTrack && !teachersTrack) return;
  if (typeof catalogProducts === 'undefined' || catalogProducts.length === 0) return;

  const wishlist = JSON.parse(localStorage.getItem('mindfuels_wishlist')) || [];

  // Helper: generate a product card HTML matching the products page style
  function makeCard(p) {
    const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    const showBadge = discountPercent > 0;
    return `
      <div class="product-card bs-product-card" onclick='openModal(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
        <div class="product-img">
          <img src="${p.images[0]}" alt="${p.name}">
          ${showBadge ? `<span class="product-badge">${discountPercent}% OFF</span>` : ''}
          <button class="product-wishlist" aria-label="Wishlist" data-product-id="${p.id}"
                  style="color: ${wishlist.includes(p.id) ? '#F93549' : ''};"
                  onclick="event.stopPropagation(); window.toggleWishlist(this, ${p.id});">
                 ${wishlist.includes(p.id) ? '♥' : '♡'}
          </button>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">
            <span class="price-current">₹${p.price}</span>
            ${showBadge ? `
              <span class="price-original">₹${p.originalPrice}</span>
              <span class="price-discount">(${discountPercent}% OFF)</span>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Sort by highest discount for Parents tab, by sales for Teachers tab
  const byDiscount = [...catalogProducts].sort((a, b) => {
    const dA = (a.originalPrice - a.price) / a.originalPrice;
    const dB = (b.originalPrice - b.price) / b.originalPrice;
    return dB - dA;
  });

  const bySales = [...catalogProducts].sort((a, b) => b.sales - a.sales);

  if (parentsTrack) {
    parentsTrack.innerHTML = byDiscount.slice(0, 15).map(makeCard).join('');
  }
  if (teachersTrack) {
    teachersTrack.innerHTML = bySales.slice(0, 15).map(makeCard).join('');
  }

  // Triple-clone for infinite loop scrolling
  [parentsTrack, teachersTrack].forEach(container => {
    if (!container || container.children.length === 0) return;
    const originalHTML = container.innerHTML;
    container.innerHTML = originalHTML + originalHTML + originalHTML;

    setTimeout(() => {
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = container.scrollWidth / 3;
      setTimeout(() => { container.style.scrollBehavior = ''; }, 50);
    }, 100);
  });
}


/* ─────────────────────────────────────────────────────────────────────────────
   10. PRODUCT MODAL
   Opens a detail popup for a product with image gallery, price, and description.
───────────────────────────────────────────────────────────────────────────── */

let currentModalImages = [];
let currentImageIndex  = 0;
let currentModalProduct = null;

/** Open the modal and populate it with the given product object. */
window.openModal = function(product) {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  currentModalProduct = product;
  currentModalImages = product.images || [];
  currentImageIndex  = 0;

  document.getElementById('modalProductName').innerText  = product.name;
  document.getElementById('modalPrice').innerText        = '₹' + product.price;
  
  const originalPriceEl = document.getElementById('modalOriginalPrice');
  const discountEl = document.getElementById('modalDiscount');
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  if (discountPercent > 0) {
    originalPriceEl.innerText = '₹' + product.originalPrice;
    originalPriceEl.style.display = 'inline-block';
    discountEl.innerText = discountPercent + '% OFF';
    discountEl.style.display = 'inline-block';
  } else {
    originalPriceEl.style.display = 'none';
    discountEl.style.display = 'none';
  }

  const ratingEl = document.getElementById('modalRating');
  if (ratingEl) {
    if (product.rating && product.rating !== "N/A" && product.rating.trim() !== '') {
      ratingEl.innerText = '★ ' + product.rating;
      ratingEl.style.display = 'inline-block';
    } else {
      ratingEl.style.display = 'none';
    }
  }

  const lengthEl = document.getElementById('modalLength');
  if (lengthEl) {
    if (product.length && product.length !== "N/A" && product.length.trim() !== '') {
      lengthEl.innerText = 'Length: ' + product.length;
      lengthEl.style.display = 'inline-block';
    } else {
      lengthEl.style.display = 'none';
    }
  }

  // Update wishlist icon
  const modalWishlistBtn = document.querySelector('.modal-wishlist');
  if (modalWishlistBtn) {
    const inWishlist = wishlist.includes(product.id);
    modalWishlistBtn.innerText = inWishlist ? '♥' : '♡';
    modalWishlistBtn.style.color = inWishlist ? '#F93549' : '';
    // Set data attribute for cross-page sync
    modalWishlistBtn.dataset.productId = product.id;
  }

  const modalDesc = document.getElementById('modalDesc');
  if (modalDesc) modalDesc.innerText = product.description;

  updateModalImage();
  renderThumbnails();
  if (typeof renderModalCartActions === 'function') renderModalCartActions();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scroll
};

/** Close the modal (also bound to overlay clicks — ignores clicks inside the content box). */
window.closeModal = function(e) {
  if (e && e.target.closest && e.target.closest('.product-modal-content')) return;
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/** Sync the main image element to currentImageIndex and update thumbnail highlights. */
function updateModalImage() {
  const imgElem = document.getElementById('modalMainImage');
  if (imgElem && currentModalImages.length > 0) {
    imgElem.src = currentModalImages[currentImageIndex];
  }
  document.querySelectorAll('.modal-thumb').forEach((th, idx) => {
    th.classList.toggle('active', idx === currentImageIndex);
  });
}

/** Advance the gallery to the next image (wraps around). */
window.nextModalImage = function() {
  if (currentModalImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
  updateModalImage();
};

/** Jump directly to a specific image by index. */
window.setModalImage = function(index) {
  currentImageIndex = index;
  updateModalImage();
};

/** Rebuild the thumbnail strip inside the modal. */
function renderThumbnails() {
  const container = document.getElementById('modalThumbnails');
  if (container) {
    container.innerHTML = currentModalImages.map((img, idx) => `
      <img src="${img}" class="modal-thumb ${idx === 0 ? 'active' : ''}"
           onclick="setModalImage(${idx})">
    `).join('');
  }
}


/* ─────────────────────────────────────────────────────────────────────────────
   11. SIDEBAR  (Filter panel toggle)
───────────────────────────────────────────────────────────────────────────── */

/** Open the sidebar if closed, close it if open. */
window.toggleSidebar = function() {
  const sidebar = document.getElementById('catalogSidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('closed');
};

/** Close the sidebar and re-render products to apply any pending filter changes. */
window.closeSidebar = function() {
  const sidebar = document.getElementById('catalogSidebar');
  if (sidebar && !sidebar.classList.contains('closed')) {
    sidebar.classList.add('closed');
  }
  renderProducts();
};


/* ─────────────────────────────────────────────────────────────────────────────
   12. CART MANAGEMENT
   Handles adding to cart and persisting to localStorage.
───────────────────────────────────────────────────────────────────────────── */

let cart = JSON.parse(localStorage.getItem('mindfuels_cart')) || [];

function updateCartBadge() {
  const currentCart = JSON.parse(localStorage.getItem('mindfuels_cart')) || [];
  const totalItems = currentCart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.innerText = totalItems;
    badge.style.transform = 'scale(1.2)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  });
}

window.renderModalCartActions = function() {
  const container = document.getElementById('modalCartActions');
  if (!container || !currentModalProduct) return;
  
  let currentCart = JSON.parse(localStorage.getItem('mindfuels_cart')) || [];
  const existing = currentCart.find(item => item.id == currentModalProduct.id);
  
  if (existing) {
    container.innerHTML = `
      <div class="qty-selector" style="width: 100%; display: flex; justify-content: space-between; align-items: center; background: #f0f0f0; border-radius: var(--radius-pill); height: 44px; padding: 0;">
        <button class="qty-btn" style="flex:1; height: 100%; font-size: 20px; color: var(--text-primary); border-top-left-radius: var(--radius-pill); border-bottom-left-radius: var(--radius-pill);" onclick="changeModalQty(-1)">−</button>
        <span style="flex: 1; text-align: center; font-weight: 700; font-size: 16px;">${existing.qty}</span>
        <button class="qty-btn" style="flex:1; height: 100%; font-size: 20px; color: var(--text-primary); border-top-right-radius: var(--radius-pill); border-bottom-right-radius: var(--radius-pill);" onclick="changeModalQty(1)">+</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="add-to-cart-btn btn-primary" style="width: 100%; border-radius: var(--radius-pill); font-size: 14px; padding: 12px; font-weight: 700;" onclick="addToCartModal(this)">ADD TO CART</button>
    `;
  }
};

window.addToCartModal = function() {
  if (!window.isUserLoggedIn) {
     alert("Please sign in to add items to your cart.");
     window.location.href = "login.html";
     return;
  }
  let currentCart = JSON.parse(localStorage.getItem('mindfuels_cart')) || [];
  currentCart.push({
      id: currentModalProduct.id,
      name: currentModalProduct.name,
      price: currentModalProduct.price,
      image: currentModalProduct.images && currentModalProduct.images.length > 0 ? currentModalProduct.images[0] : currentModalProduct.image,
      qty: 1
  });
  localStorage.setItem('mindfuels_cart', JSON.stringify(currentCart));
  if (typeof updateCartBadge === 'function') updateCartBadge();
  renderModalCartActions();
};

window.changeModalQty = function(delta) {
  let currentCart = JSON.parse(localStorage.getItem('mindfuels_cart')) || [];
  let existingIndex = currentCart.findIndex(item => item.id == currentModalProduct.id);
  if (existingIndex !== -1) {
    currentCart[existingIndex].qty += delta;
    if (currentCart[existingIndex].qty <= 0) {
      currentCart.splice(existingIndex, 1);
    }
    localStorage.setItem('mindfuels_cart', JSON.stringify(currentCart));
    if (typeof updateCartBadge === 'function') updateCartBadge();
    renderModalCartActions();
  }
};

window.addToCart = function(btnElem) {
  if (!window.isUserLoggedIn) {
     alert("Please sign in to add items to your cart.");
     window.location.href = "login.html";
     return;
  }

  if (!currentModalProduct) return;
  
  let currentCart = JSON.parse(localStorage.getItem('mindfuels_cart')) || [];
  const existingItem = currentCart.find(item => item.id == currentModalProduct.id);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    currentCart.push({
      id: currentModalProduct.id,
      name: currentModalProduct.name,
      price: currentModalProduct.price,
      image: currentModalProduct.images[0],
      qty: 1
    });
  }
  
  localStorage.setItem('mindfuels_cart', JSON.stringify(currentCart));
  updateCartBadge();
  
  // Visual feedback on the button
  if (btnElem) {
    const originalText = btnElem.innerText;
    btnElem.innerText = 'Added to Cart!';
    btnElem.style.background = '#4CAF50';
    btnElem.style.color = 'white';
    
    setTimeout(() => {
      btnElem.innerText = originalText;
      btnElem.style.background = '';
      btnElem.style.color = '';
    }, 1500);
  }
  renderModalCartActions();
};

// Wishlist Dropdown Logic
window.updateWishlistDropdown = function() {
  const badge = document.getElementById('wishlistBadge');
  const dropdown = document.getElementById('wishlistDropdown');
  if (!dropdown) return;
  
  wishlist = JSON.parse(localStorage.getItem('mindfuels_wishlist')) || [];
  
  if (wishlist.length === 0) {
    if (badge) badge.style.display = 'none';
    dropdown.innerHTML = '<div class="wishlist-empty">Your wishlist is empty.</div>';
    return;
  }
  
  if (badge) {
    badge.innerText = wishlist.length;
    badge.style.display = 'flex';
  }
  
  let html = '';
  wishlist.forEach((id) => {
    const product = (typeof catalogProducts !== 'undefined') ? catalogProducts.find(p => p.id == id) : null;
    if (!product) return;
    
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : (product.image || '');
    
    html += `
      <div class="wishlist-item" id="wishlist-item-${product.id}">
        <img src="${imageUrl}" class="wishlist-item-img" alt="${product.name}">
        <div class="wishlist-item-info">
          <div class="wishlist-item-title">${product.name}</div>
          <div class="wishlist-item-price">₹${product.price ? product.price.toLocaleString('en-IN') : ''}</div>
        </div>
        <div class="wishlist-item-btn-group" style="display: flex; align-items: center; gap: 8px;">
          <button class="wishlist-move-btn" onclick="moveToCartFromWishlist(${product.id}, event)" aria-label="Move to cart" title="Move to Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </button>
          <button class="wishlist-remove-btn" onclick="toggleWishlist(null, ${product.id}); updateWishlistDropdown(); event.stopPropagation();" aria-label="Remove" title="Remove">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
    `;
  });
  
  if (html === '') {
     html = '<div class="wishlist-empty">Your wishlist is empty.</div>';
  }
  dropdown.innerHTML = html;
};

window.moveToCartFromWishlist = function(productId, e) {
  if (e) e.stopPropagation();
  const product = catalogProducts.find(p => p.id == productId);
  if (!product) return;
  
  if (!window.isUserLoggedIn) {
     alert("Please sign in to add items to your cart.");
     window.location.href = "login.html";
     return;
  }
  
  let cart = JSON.parse(localStorage.getItem('mindfuels_cart')) || [];
  const existing = cart.find(item => item.id == productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : product.image,
      qty: 1
    });
  }
  localStorage.setItem('mindfuels_cart', JSON.stringify(cart));
  if (typeof updateCartBadge === 'function') updateCartBadge();
  
  // Remove from wishlist
  const idx = wishlist.indexOf(productId);
  if (idx !== -1) {
    wishlist.splice(idx, 1);
    localStorage.setItem('mindfuels_wishlist', JSON.stringify(wishlist));
    
    document.querySelectorAll('.product-wishlist').forEach(otherBtn => {
      if (otherBtn.dataset.productId == productId) {
        otherBtn.innerText = '♡';
        otherBtn.style.color = '';
      }
    });
  }
  
  updateWishlistDropdown();
};

// Initialize badges and dropdown hover on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setTimeout(updateWishlistDropdown, 500);
  
  const wrapper = document.getElementById('wishlistWrapper');
  const dropdown = document.getElementById('wishlistDropdown');

  if (wrapper && dropdown) {
    let timeout;
    wrapper.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      updateWishlistDropdown();
      dropdown.classList.add('visible');
    });
    wrapper.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        dropdown.classList.remove('visible');
      }, 200);
    });
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
    });
    dropdown.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        dropdown.classList.remove('visible');
      }, 200);
    });
  }
});

