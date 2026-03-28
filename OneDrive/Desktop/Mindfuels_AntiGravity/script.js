// ========== HERO CAROUSEL ==========
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.hero-slide').length;
const heroTrack = document.getElementById('heroTrack');
const heroDots = document.querySelectorAll('.hero-dot');
let autoPlayInterval;

function goToSlide(index) {
  currentSlide = index;
  if (currentSlide < 0) currentSlide = totalSlides - 1;
  if (currentSlide >= totalSlides) currentSlide = 0;
  heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  heroDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startAutoPlay() {
  autoPlayInterval = setInterval(nextSlide, 4000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

// Start auto-play
startAutoPlay();

// Pause on hover
const heroSection = document.getElementById('heroCarousel');
if (heroSection) {
  heroSection.addEventListener('mouseenter', stopAutoPlay);
  heroSection.addEventListener('mouseleave', startAutoPlay);
}

// Touch/swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

if (heroSection) {
  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  }, { passive: true });
}

// ========== TAB SWITCHING ==========
function switchTab(tab) {
  const parentsProducts = document.getElementById('parentsProducts');
  const teachersProducts = document.getElementById('teachersProducts');
  const tabParents = document.getElementById('tabParents');
  const tabTeachers = document.getElementById('tabTeachers');

  if (tab === 'parents') {
    parentsProducts.style.display = 'block';
    teachersProducts.style.display = 'none';
    tabParents.classList.add('active');
    tabTeachers.classList.remove('active');
  } else if (tab === 'teachers') {
    parentsProducts.style.display = 'none';
    teachersProducts.style.display = 'block';
    tabParents.classList.remove('active');
    tabTeachers.classList.add('active');
  }
}

// ========== PRODUCT SCROLL ==========
document.addEventListener('DOMContentLoaded', () => {
  ['parentsScroll', 'teachersScroll'].forEach(id => {
    const container = document.getElementById(id);
    if (container && container.children.length > 0) {
      const originalHTML = container.innerHTML;
      // Clone sets for infinite loop
      container.innerHTML = originalHTML + originalHTML + originalHTML;
      // Initialize scroll position to the middle clone
      setTimeout(() => {
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = container.scrollWidth / 3;
        setTimeout(() => container.style.scrollBehavior = '', 50);
      }, 100);
    }
  });

  // ===== CATEGORY CAROUSEL (infinite loop) =====
  const catTrack = document.getElementById('catTrack');
  if (catTrack) {
    const original = catTrack.innerHTML;
    // Triple-clone for seamless loop
    catTrack.innerHTML = original + original + original;
    // Remove scroll-snap so infinite scrolling works without jarring jumps
    catTrack.style.scrollSnapType = 'none';
    // Start in the middle set
    setTimeout(() => {
      catTrack.style.scrollBehavior = 'auto';
      catTrack.scrollLeft = catTrack.scrollWidth / 3;
      setTimeout(() => { catTrack.style.scrollBehavior = ''; }, 50);
    }, 100);

    // Wrap-around logic
    catTrack.addEventListener('scroll', () => {
      const max = catTrack.scrollWidth / 3;
      if (catTrack.scrollLeft <= 0) {
        catTrack.style.scrollBehavior = 'auto';
        catTrack.scrollLeft = max;
        setTimeout(() => { catTrack.style.scrollBehavior = ''; }, 50);
      } else if (catTrack.scrollLeft >= max * 2) {
        catTrack.style.scrollBehavior = 'auto';
        catTrack.scrollLeft = max;
        setTimeout(() => { catTrack.style.scrollBehavior = ''; }, 50);
      }
    });
  }

  window.scrollCat = function(dir) {
    const track = document.getElementById('catTrack');
    if (!track) return;
    const wrap = track.querySelector('.cat-wrap');
    const cardWidth = wrap ? wrap.offsetWidth + 16 : 340;
    track.scrollBy({ left: cardWidth * dir, behavior: 'smooth' });
  };
});

function scrollProducts(scrollId, direction) {
  const container = document.getElementById(scrollId);
  if (container) {
    const scrollAmount = 480;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
    
    // Seamless infinite wrap after smooth scroll completes
    setTimeout(() => {
      const oneSetWidth = container.scrollWidth / 3;
      if (container.scrollLeft < oneSetWidth / 2 || container.scrollLeft > oneSetWidth * 2) {
        container.style.scrollBehavior = 'auto'; // Disable CSS smooth snap momentarily
        if (container.scrollLeft < oneSetWidth / 2) {
          container.scrollLeft += oneSetWidth;
        } else {
          container.scrollLeft -= oneSetWidth;
        }
        setTimeout(() => container.style.scrollBehavior = '', 50); // Restore CSS behavior
      }
    }, 600);
  }
}

// ========== STICKY HEADER SHADOW ==========
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ========== MOBILE MENU TOGGLE ==========
function toggleMenu() {
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  nav.classList.toggle('open');
  hamburger.classList.toggle('active');
}

// ========== SCROLL ANIMATIONS (Fade-up on scroll) ==========
const fadeElements = document.querySelectorAll('.fade-up');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));

// ========== TESTIMONIAL CAROUSEL ==========
const testimonialData = [
  {
    video: "videos/vid1.mp4",
    quote: "I choose comfort for my child and care for tomorrow. Made with the same care I give my Child",
    rot: 1
  },
  {
    video: "videos/vid2.mp4",
    quote: "My kid absolutely loves the stories. It's our everyday ritual now.",
    rot: 2
  },
  {
    video: "videos/vid3.mp4",
    quote: "The quality and the thought put into these books are amazing.",
    rot: 3
  },
  {
    video: "videos/vid4.mp4",
    quote: "The perfect blend of learning and fun! Highly recommended.",
    rot: 1
  },
  {
    video: "videos/vid5.mp4",
    quote: "Mind-Quests have changed our evening routines for the better.",
    rot: 2
  },
  {
    video: "videos/vid6.mp4",
    quote: "Beautiful illustrations and meaningful life lessons.",
    rot: 3
  },
  {
    video: "videos/vid7.mp4",
    quote: "Every page is a new adventure! Brilliant concept.",
    rot: 1
  },
  {
    video: "videos/vid8.mp4",
    quote: "A wonderful way to bond with my child over meaningful stories.",
    rot: 2
  }
];

const testimonialTrack = document.getElementById('testimonialTrack');

if (testimonialTrack) {
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

  // Join array into a single HTML string
  const allCardsHTML = testimonialData.map(createCardHTML).join('');

  // Clone cards multiple times for robust infinite JS scrolling
  testimonialTrack.innerHTML = allCardsHTML + allCardsHTML + allCardsHTML;

  // JS Infinite Auto-scroll
  let isHoveringTestimonials = false;
  let isScrollingTestimonials = false;

  function autoScrollTestimonials() {
    // Only scroll if not hovered, not manually scrolling, and videos aren't playing (which pauses animation state)
    if (!isHoveringTestimonials && !isScrollingTestimonials && testimonialTrack.style.animationPlayState !== 'paused') {
      testimonialTrack.scrollLeft += 1.5; // Auto-scroll speed
    }

    // Wrap to simulate infinite loop. Avoid wrapping exactly during a smooth scroll to prevent judder.
    if (!isScrollingTestimonials) {
      if (testimonialTrack.scrollLeft >= 2240) {
        testimonialTrack.scrollLeft -= 2240;
      } else if (testimonialTrack.scrollLeft <= 0) {
        testimonialTrack.scrollLeft += 2240;
      }
    }
    requestAnimationFrame(autoScrollTestimonials);
  }

  testimonialTrack.addEventListener('mouseenter', () => isHoveringTestimonials = true);
  testimonialTrack.addEventListener('mouseleave', () => isHoveringTestimonials = false);

  requestAnimationFrame(autoScrollTestimonials);

  // Add right arrow click logic globally
  window.scrollTestimonials = function (dir) {
    isScrollingTestimonials = true;
    testimonialTrack.scrollBy({ left: 280 * dir, behavior: 'smooth' });
    setTimeout(() => { isScrollingTestimonials = false; }, 600);
  };

  // Add scroll logic globally for product tracks
  window.scrollProducts = function (id, dir) {
    const track = document.getElementById(id);
    if(track) {
      track.scrollBy({ left: 300 * dir, behavior: 'smooth' });
    }
  };

  // Add click listeners to all video containers
  const containers = testimonialTrack.querySelectorAll('.video-container');
  containers.forEach(container => {
    container.addEventListener('click', () => {
      const video = container.querySelector('video');

      if (video.paused) {
        // Pause others
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

        const anyPlaying = Array.from(containers).some(c => !c.querySelector('video').paused);
        if (!anyPlaying) {
          testimonialTrack.style.animationPlayState = '';
        }
      }
    });
  });
}

// ========== WISHLIST TOGGLE ==========
function toggleWishlist(btn) {
  if (btn.innerText.trim() === '♡') {
    btn.innerText = '♥';
    btn.style.color = '#F93549';
  } else {
    btn.innerText = '♡';
    btn.style.color = '';
  }
}

document.querySelectorAll('.product-wishlist').forEach(btn => {
  if(!btn.onclick) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleWishlist(btn);
    });
  }
});

function toggleModalWishlist(btn) {
  toggleWishlist(btn);
}

// ========== PRODUCT CATALOG LOGIC ==========
const catalogProducts = [
  { id: 1, name: "Math & Logic Puzzle Book", category: "Math & Logic", ageGroup: "6-8 Years", format: "Printed Books", price: 250, originalPrice: 500, sales: 120, images: ["https://i.postimg.cc/02sccbs2/2.png", "https://i.postimg.cc/jSTmwM5N/Untitled-design.png", "https://i.postimg.cc/3NJWxXGQ/Gemini-Generated-Image-xnyqdjxnyqdjxnyq.png", "https://i.postimg.cc/QCyNNRs0/Gemini-Generated-Image-2qbskp2qbskp2qbs.png", "https://i.postimg.cc/5y61rnvt/Gemini-Generated-Image-q0h9myq0h9myq0h9.png"] },
  { id: 2, name: "Funny Farm Comics", category: "Storybooks & Comics", ageGroup: "3-5 Years", format: "E-Books & Audio", price: 150, originalPrice: 300, sales: 300, images: ["https://i.postimg.cc/jSTmwM5N/Untitled-design.png", "https://i.postimg.cc/3NJWxXGQ/Gemini-Generated-Image-xnyqdjxnyqdjxnyq.png", "https://i.postimg.cc/02sccbs2/2.png", "https://i.postimg.cc/QCyNNRs0/Gemini-Generated-Image-2qbskp2qbskp2qbs.png", "https://i.postimg.cc/5y61rnvt/Gemini-Generated-Image-q0h9myq0h9myq0h9.png"] },
  { id: 3, name: "World Atlas for Kids", category: "Geography & World", ageGroup: "9-12 Years", format: "Printed Books", price: 300, originalPrice: 400, sales: 80, images: ["https://i.postimg.cc/3NJWxXGQ/Gemini-Generated-Image-xnyqdjxnyqdjxnyq.png", "https://i.postimg.cc/02sccbs2/2.png", "https://i.postimg.cc/jSTmwM5N/Untitled-design.png", "https://i.postimg.cc/QCyNNRs0/Gemini-Generated-Image-2qbskp2qbskp2qbs.png", "https://i.postimg.cc/5y61rnvt/Gemini-Generated-Image-q0h9myq0h9myq0h9.png"] },
  { id: 4, name: "Build Your Own Robot", category: "Science & Space", ageGroup: "9-12 Years", format: "Activities & Games", price: 450, originalPrice: 600, sales: 50, images: ["https://i.postimg.cc/QCyNNRs0/Gemini-Generated-Image-2qbskp2qbskp2qbs.png", "https://i.postimg.cc/02sccbs2/2.png", "https://i.postimg.cc/jSTmwM5N/Untitled-design.png", "https://i.postimg.cc/3NJWxXGQ/Gemini-Generated-Image-xnyqdjxnyqdjxnyq.png", "https://i.postimg.cc/5y61rnvt/Gemini-Generated-Image-q0h9myq0h9myq0h9.png"] },
  { id: 5, name: "Finger Painting Art", category: "Art & Craft", ageGroup: "3-5 Years", format: "Activities & Games", price: 120, originalPrice: 200, sales: 500, images: ["https://i.postimg.cc/5y61rnvt/Gemini-Generated-Image-q0h9myq0h9myq0h9.png", "https://i.postimg.cc/02sccbs2/2.png", "https://i.postimg.cc/jSTmwM5N/Untitled-design.png", "https://i.postimg.cc/3NJWxXGQ/Gemini-Generated-Image-xnyqdjxnyqdjxnyq.png", "https://i.postimg.cc/QCyNNRs0/Gemini-Generated-Image-2qbskp2qbskp2qbs.png"] },
  { id: 6, name: "Solar System Explorer", category: "Science & Space", ageGroup: "6-8 Years", format: "E-Books & Audio", price: 800, originalPrice: 1200, sales: 250, images: ["https://i.postimg.cc/PJpsyNsw/Gemini-Generated-Image-o62zfco62zfco62z.png", "https://i.postimg.cc/02sccbs2/2.png", "https://i.postimg.cc/jSTmwM5N/Untitled-design.png", "https://i.postimg.cc/3NJWxXGQ/Gemini-Generated-Image-xnyqdjxnyqdjxnyq.png", "https://i.postimg.cc/QCyNNRs0/Gemini-Generated-Image-2qbskp2qbskp2qbs.png"] },
  { id: 7, name: "Sudoku for Beginners", category: "Math & Logic", ageGroup: "6-8 Years", format: "Printed Books", price: 350, originalPrice: 500, sales: 110, images: ["https://i.postimg.cc/02sccbs2/2.png", "https://i.postimg.cc/PJpsyNsw/Gemini-Generated-Image-o62zfco62zfco62z.png", "https://i.postimg.cc/jSTmwM5N/Untitled-design.png", "https://i.postimg.cc/3NJWxXGQ/Gemini-Generated-Image-xnyqdjxnyqdjxnyq.png", "https://i.postimg.cc/QCyNNRs0/Gemini-Generated-Image-2qbskp2qbskp2qbs.png"] },
  { id: 8, name: "Origami Craft Animals", category: "Art & Craft", ageGroup: "9-12 Years", format: "Activities & Games", price: 500, originalPrice: 750, sales: 90, images: ["https://i.postimg.cc/jSTmwM5N/Untitled-design.png", "https://i.postimg.cc/PJpsyNsw/Gemini-Generated-Image-o62zfco62zfco62z.png", "https://i.postimg.cc/02sccbs2/2.png", "https://i.postimg.cc/3NJWxXGQ/Gemini-Generated-Image-xnyqdjxnyqdjxnyq.png", "https://i.postimg.cc/QCyNNRs0/Gemini-Generated-Image-2qbskp2qbskp2qbs.png"] }
];

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  // get filters
  const categoryInputs = document.querySelectorAll('#categoryFilter input:checked');
  const selectedCategories = Array.from(categoryInputs).map(cb => cb.value);
  
  const ageInputs = document.querySelectorAll('#ageFilter input:checked');
  const selectedAges = Array.from(ageInputs).map(cb => cb.value);
  
  const formatInputs = document.querySelectorAll('#formatFilter input:checked');
  const selectedFormats = Array.from(formatInputs).map(cb => cb.value);
  
  const sortSelect = document.getElementById('sortSelect');
  const sortVal = sortSelect ? sortSelect.value : 'bestsellers';

  // filter
  let filtered = catalogProducts.filter(p => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    if (selectedAges.length > 0 && !selectedAges.includes(p.ageGroup)) return false;
    if (selectedFormats.length > 0 && !selectedFormats.includes(p.format)) return false;
    return true;
  });

  // sort
  if (sortVal === 'price_low_high') filtered.sort((a,b) => a.price - b.price);
  else if (sortVal === 'price_high_low') filtered.sort((a,b) => b.price - a.price);
  else if (sortVal === 'bestsellers' || sortVal === 'most_purchased') filtered.sort((a,b) => b.sales - a.sales);

  // render
  if (filtered.length === 0) {
     grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888; font-size: 18px;">No products found matching your criteria.</p>';
     return;
  }

  grid.innerHTML = filtered.map((p, index) => {
    const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    return `
      <div class="product-card" onclick='openModal(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
        <div class="product-img">
          <img src="${p.images[0]}" alt="${p.name}">
          <span class="product-badge">${discountPercent}% OFF</span>
          <button class="product-wishlist" aria-label="Wishlist" onclick="event.stopPropagation(); toggleWishlist(this);">♡</button>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">
            <span class="price-current">₹${p.price}</span>
            <span class="price-original">₹${p.originalPrice}</span>
            <span class="price-discount">(${discountPercent}% OFF)</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Modal Logic
let currentModalImages = [];
let currentImageIndex = 0;

window.openModal = function(product) {
  const modal = document.getElementById('productModal');
  if(!modal) return;
  
  currentModalImages = product.images;
  currentImageIndex = 0;
  
  document.getElementById('modalProductName').innerText = product.name;
  document.getElementById('modalPrice').innerText = '₹' + product.price;
  document.getElementById('modalOriginalPrice').innerText = '₹' + product.originalPrice;
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  document.getElementById('modalDiscount').innerText = discountPercent + '% OFF';
  
  updateModalImage();
  renderThumbnails();
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scrolling
};

window.closeModal = function(e) {
  // if e is passed from overlay click, ensure it's not the content box
  if (e && e.target.closest && e.target.closest('.product-modal-content')) return;
  const modal = document.getElementById('productModal');
  if(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

function updateModalImage() {
  const imgElem = document.getElementById('modalMainImage');
  if (imgElem && currentModalImages.length > 0) {
    imgElem.src = currentModalImages[currentImageIndex];
  }
  
  // Update thumbnails active state
  document.querySelectorAll('.modal-thumb').forEach((th, idx) => {
    if(idx === currentImageIndex) th.classList.add('active');
    else th.classList.remove('active');
  });
}

// ========== SIDEBAR TOGGLE ==========
window.toggleSidebar = function() {
  const sidebar = document.getElementById('catalogSidebar');
  if (sidebar && sidebar.classList.contains('closed')) {
    sidebar.classList.remove('closed');
  } else if (sidebar) {
    sidebar.classList.add('closed');
  }
};

window.closeSidebar = function() {
  const sidebar = document.getElementById('catalogSidebar');
  if (sidebar && !sidebar.classList.contains('closed')) {
    sidebar.classList.add('closed');
  }
  if (window.renderProducts) renderProducts();
};

window.nextModalImage = function() {
  if(currentModalImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
  updateModalImage();
};

window.setModalImage = function(index) {
  currentImageIndex = index;
  updateModalImage();
};

function renderThumbnails() {
  const container = document.getElementById('modalThumbnails');
  if(container) {
    container.innerHTML = currentModalImages.map((img, idx) => `
      <img src="${img}" class="modal-thumb ${idx === 0 ? 'active' : ''}" onclick="setModalImage(${idx})">
    `).join('');
  }
}

// Event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', renderProducts);
    });
    renderProducts();
});