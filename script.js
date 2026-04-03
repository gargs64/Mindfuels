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

/* ── 9a. Raw product data (Tab-separated: Name \t Description \t Price \t MRP) ── */

const rawProductData = `
Practice Assignment Book on Phonics Skill- A	Helps Children develop Phonics Skills	295	295
Word Search Books for Kids	Combo of 12 Books	450	480
Calligraphy: The New Style Of English Lettering Vol.-1	Calligraphy Practice Book	250	250
Shabd Sulekhni	Hindi Handwriting Practice Book	195	195
Capital ABC Wipe & Clean Flash Cards	Spiral Learning Books For Kids of age 2-5	250	250
The Ultimate Gift	Story Book by Jim Stovall	390	450
Fun With Cursive Level 3	Cursive Writing Book For Kids	195	195
Alphabet Practice and Learning Book (Small abc)	Reusable Wipe & Clean Flash Cards for Age 2 to 5 years	250	250
Practice Assignments and Advanced Workbook	English, Hindi, Maths, EVS All in One for Class 3rd	295	295
Brain Booster Activity Book – 3	Practice Assignment Book of Aptitude Based Quantitative Reasoning and Puzzles	295	295
Practice Assignment Workbook Math Express -1	Interactive Activity book of Math for Ages 5 to 8 years	294	295
All in One Fun Practice Workbook and Activity Book	For Pre-Nursery students Age 2 to 4 years	295	295
EXPRESS-4 For Kids Learn Grammar	Grammar Learning Book	295	295
Practice Assignments Book (1 - 20) Writing & Activity	Includes Pictures and Activities for Preschoolers	295	295
My 2nd Step in English - Phonetic Sounds	English Phonic book for kids	295	295
Fun Activity book and Practice Work Book for Class L.K.G.	All In One (Math, English, Hindi, Evs, Art) for Age 3 to 5 years	295	295
Art And Craft - B	Art & Craft Book for children with materials	325	325
Shabd Sargun	Hindi learning and practice workbook for kids 2 to 5	250	250
Express-6 Maths Books	Early Learning Books for logical skills	295	295
Sargun Hindi- Praveshika	Hindi learning and practice workbook	395	395
Interactive Activity Book of Math and Practice Assignment Book on Subtraction	Subtraction of Double and Three Digits	295	295
All In One Practice Assignment Book and Activity Book for U.K.G.	Exercise book for children including 5 subjects	295	295
Utsah Ki Kahaniya Safalta Ki Taiyaari	Story Book In Hindi	195	195
Brain Booster 4	Practice Assignment Workbook Of Aptitude Based Reasoning	294	295
All in One Writing & Activity (1 - 50) Practice Assignments Book	Includes Colourful Pictures and Activities for Preschoolers	294	295
Selected Short Stories: Munshi Premchand	Story Book	175	195
Apathit Gadyansh - 4	Hidden Passage Compendium in Hindi for class 3 and 4	225	225
Gyan Ke Moti (Pearls Of Wisdom)	Prernadayak Kahaniya For Children And Adults	195	195
All in One Practice Assignment Book and Fun Activity Book	Interactive exercise workbook for Age 4 to 8 years	295	295
Apathit Gadyansh 2	Hidden Passage Compendium in Hindi for class 2	195	195
Practice Assignment Book on Phonics Skill- B	Phonic Book For Kids	295	295
My Big Book of Capital ABC Writing & Activity Book	Writing practice book for kindergarten children 2+	299	299
All in One Full Subjects Practice Assignments and Updated New Activity Workbook for Class 4	Exercise book for all subjects	295	295
English GRAMMAR EXPRESS-1	Practice Assignment Books with answers	295	295
Practice Assignment Maths Express-5	Graded Practice worksheet with Attractive Diagrams	295	295
Fun With Pattern Activity	Pattern book for early learning	199	199
Practice Assignment Book-ODD ONE OUT	Interactive Activity book for children	295	295
All in One Practice Assignments Book For Pattern Practice Lines And Curves	Fun Writing & Activity Book for Kindergarten Children	295	295
Learn with Phonetics	English Hindi phonic sounds with practice worksheets	265	265
Interactive Activity Book and Practice Assignment Book	For Children and Young Minds Age Group 3 years and above	295	295
Awesome Comprehension Unseen Passages Book 4	Multiple-choice questions, grammar exercises, poetry, and unseen passages	225	225
Awesome Comprehension Unseen Passages Book 1	Unseen Passages with MCQs, Grammar, Vocabulary & Exercises	225	225
Awesome Comprehension Unseen Passages Book 2	Multiple Choice Questions, Grammar Exercises, Vocabulary & Illustrations	225	225
Awesome Comprehension Unseen Passages Book 3	Multiple Choice Questions, Grammar Exercises, Vocabulary Building, Poetry	225	225
Awesome Comprehension Unseen Passages Book 5	Multiple Choice Questions, Attractive Illustrations, Poetry, Grammar Exercises	225	225
Reading Comprehension Workbook Grade 6	Engaging Passages, Poetry, Vocabulary Builder, Grammar Practice	225	225
Computer Learning with AI for Class 3	Textbook with Windows 10 & MS Office 2016	299	299
Excel in Computers with AI – Class 1	Windows 10 & MS Office 2016 Lab Activities, Puzzle Time	240	240
AI-Powered Computer Lab Class 2 Manual	Windows 10 & MS Office 2016 with Puzzles & Brain Teasers	270	270
Excel in COMPUTERS With AI Class 4	Windows 10 & MS Office 2016 Lab Activity and Puzzle Time	330	330
The Adventures Of Tom Sawyer	Story Book in English	175	195
Calligraphy Combo Pack of 4 Books	Calligraphy Practice Books Set	1168	1298
Art And Craft - A	Art & Craft Book For Kids with Craft Material	299	299
Brain Booster – 1	Intellectual Activity book and Practice Assignment Workbook	295	295
Writing Practice Assignment Book and Activity Book in English	Learning Alphabets for children Age 2 to 5 years	290	295
Practice Assignment Workbook - Math Express 3	Activity book for children Age 6 to 9 years	295	295
Writing Practice Assignment Workbook on Cursive ABC	Fun Activity Book for Young Kids Ages 4 to 6 years	290	295
My Big Book of Cursive abc Writing & Activity Book	Alphabet Writing practice book for kids	250	295
Mind Blowing Word Search 3 in 1 Activity Book	Mind boosting word search book for kids	175	195
Pearls of Wisdom – A Book of English Reader Level 1	Early Learning English Reading Book for Kids	285	285
Pearls of Wisdom – A Book of English Reader Level 2	Early Learning English Reading Book for Kids	315	315
Pearls of Wisdom – A Book of English Reader Level 3	Early Learning English Reading Book for Kids	345	345
Pearls of Wisdom – A Book of English Reader Level 4	Early Learning English Reading Book for Kids	375	375
Pearls of Wisdom – A Book of English Reader Level 5	Early Learning English Reading Book for Kids	395	395
My Introductory Book of Environmental Studies Level 0	Kids Learning Book for Environmental Studies	320	320
My First Book of Environmental Studies Level 1	Kids Learning Book for Environmental Studies	330	330
My Second Book of Environmental Studies Level 2	Kids Learning Book for Environmental Studies	360	360
Excel in Computers with AI – Class 5	Windows 10 & MS Office 2016	390	390
Explore Science – Class 3	Unlocking the Universe: Discover the Wonders of Science	360	360
Explore Science – Class 4	Unlocking the Universe: Discover the Wonders of Science	390	390
Explore Science – Class 5	Unlocking the Universe: Discover the Wonders of Science	415	415
All in One Practice Assignments Workbook for Class 1st	English, Maths, Hindi, EVS Exercise book	295	295
Fun With Cursive Level 1	Cursive Writing Book For Kids	195	195
Calligraphy Practice Book (Part -2)	Writing and Lettering practice workbook	399	399
Picture Matching - Practice Assignments Book	Interactive Activity book for children	295	295
Word Search for Children and Young Minds	Interactive Activity Book of Class 4	175	195
Combo Pack of 6 Books	Workbook Collection	1270	1270
Fun Activity Hindi Alphabet Learning Book	Colorful Illustrations for Kids	225	225
Fun with Activity - 2	General Awareness Workbook for Kids	260	260
Fun with Numbers 1-20	Activity book for kids	195	195
Wipe & Clean Flash Cards With Spiral (Combo Of 4 Books)	Birds, Good Habits, Domestic Animals, Colors For Kids	350	380
Rebecca Of Sunnybrook Farm & The Secret Garden	2-in-1 Classics Large Print Story Book	175	195
Captain Courageous & The Adventure Of Don Quixote	2-in-1 Classics Large Print Story Book	175	195
The Little Prince & The Phoenix And The Carpet	Story Book in English	175	195
The Man In The Iron Mask & The Red Badge Of Courage	Story Book in English	171	195
The Happy Prince & The Wind In The Willows	Story Book in English	175	195
The Wizard Of Oz & The Mill On The Floss	Story Book in English	171	195
Anne The Green Gables & Ivanhoe	2 in 1 Classics Large Print Story Book in English 	175	195
The Hound Of The Baskervilles & The Enchanted Castle	2 in 1 Classics Large Print Story Book in English 	175	195
Sense And Sensibility & Silas Marner	2 in 1 Classics Large Print Story Book in English 	171	195
The Railway Children & The Fisherman And His Soul	2 in 1 Classics Large Print Story Book in English 	175	195
Pride And Prejudice & The Devoted Friend	2 in 1 Classics Large Print Story Book in English 	171	195
The Mayor Of Casterbridge & War Of The Worlds	2 in 1 Classics Large Print Story Book in English 	175	195
Colour Me Again & Again Fruits & Vegetables	Reusable Wipe and Clean Colouring Books For Kids	250	250
Colour Me Again & Again Transport & Numbers	Reusable Wipe and Clean Coloring Books For Kids	225	250
Colour Me Again & Again ABC Alphabet & Shapes	Reusable Wipe and Clean Coloring Books For Kids	250	250
Animal Farm By George Orwell	Story Book in English	175	195
Gulliver's Travels	Complete & Unabridged By Jonathan Swift	225	250
The Jungle Book By Rudyard Kipling	Book Recommended By CBSE	250	250
The Time Machine By H.G. Wells	Book Recommended By CBSE	195	195
Three Men in a Boat	Story book for Children by Jerome K. Jerome	195	195
Up From Slavery: The Autobiography Of Booker T. Washington	Fun Story book for children	224	250
Gooseberries & Dreams	2 in 1 Story Book By Anton Chekhov	175	195
Selected Story In The Ravine	Short story book By Anton Chekhov	175	195
Peasant Wives & The Lottery Ticket	2 in 1 Story By Anton Chekhov	175	195
4 in 1 Story The Student, The Huntsman, A Male Factor & At Christmas Time	By Anton Chekhov	175	195
The Witch & The Pipe	2 in 1 Story Book By Anton Chekhov	175	195
Selected Story Peasants	Story book By Anton Chekhov	175	195
The Post & Gusev	2 in 1 Story Book By Anton Chekhov	175	195
Difficult People & Happiness	2 in 1 Story Book By Anton Chekhov	175	195
The Schoolmistress & In Exile	2 in 1 Story Book By Anton Chekhov	175	195
Selected Story A Nervous Breakdown	Short story By Anton Chekhov	175	195
The Cattle-Dealers & After The Theatre	2 in 1 Story Book By Anton Chekhov	175	195
On Official Duty & A Lady's Story	2 in 1 Story By Anton Chekhov	175	195
The First-Class Passenger, A Tragic Actor, Small Fry & The Requiem	4 in 1 Story By Anton Chekhov	175	195
3 in 1 Story In The Coach-House, Panic Fears & The Beauties	Story Book By Anton Chekhov	175	195
The Bet, The Head-Gardener's Story & The Shoemaker And The Devil	3 in 1 Story By Anton Chekhov	175	195
Selected Story A Case Of Identity	Story Book By Arthur Conan Doyle	175	195
Selected Story The Five Orange Pips	Story Book By Arthur Conan Doyle	175	195
Selected Story A Scandal In Bohemia	Story Book By Arthur Conan Doyle	175	195
Selected Story That Little Square Box	Story Book By Arthur Conan Doyle	175	195
Selected Story The Adventure Of The Cardboard Box	Story Book By Arthur Conan Doyle	175	195
Selected Story The Adventure Of The Devil's Foot	Story Book By Arthur Conan Doyle	175	195
Selected Story The Adventure Of The Red Circle	Story Book By Arthur Conan Doyle	175	195
Selected Story The Black Doctor	Story Book By Arthur Conan Doyle	175	195
Selected Story The Captain Of The Pole-Star	Story Book By Arthur Conan Doyle	175	195
Selected Story The Japanned Box	Story Book By Arthur Conan Doyle	175	195
Selected Story The Jew's Breastplate	Story Book By Arthur Conan Doyle	175	195
Selected Story The Lost Special	Story Book By Arthur Conan Doyle	175	195
Selected Story The Man From Archangel	Story book By Arthur Conan Doyle	175	195
Selected Story The Man With the Watches	Story Book By Arthur Conan Doyle	175	195
Selected Story The Red-Headed League	Story Book By Arthur Conan Doyle	175	195
3 In 1 Story By Charles Dickens	A Child's Dream Of A Star, Our French Watering-Place & Births.Mrs. Meek, Of A Son	175	195
2 In 1 Story By Charles Dickens	A Christmas Tree & What Christmas Is As We Grow Older	175	195
2 In 1 Story By Charles Dickens	A Monument Of French Folly & The Poor Relation's Story	175	195
3 In 1 Story By Charles Dickens	A Poor Man's Tale Of A Patent, The Noble Savage & A Fight	175	195
2 In 1 Story By Charles Dickens	Bill-Sticking & Lying Awake	175	195
2 In 1 Story By Charles Dickens	Down With The Tide & A Walk In A Workhouse	175	195
Single Story Hunted Down	Story Book By Charles Dickens	175	195
3 In 1 Story Our School, Our Vestry & Our Bore	Story Book By Charles Dickens	175	195
3 In 1 Story Prince Bull - A Fairy Tale, A Plated Article & Our Honourable Friend	Story book By Charles Dickens	175	195
3 In 1 Story The Child's Story, The Schoolboy's Story & Nobody's Story	Story Book By Charles Dickens	175	195
Single Story The Detective Police	Story Book in hindi By Charles Dickens	175	195
3 In 1 Story The Ghost Of Art, Out Of Town & Out Of The Season	Story Book By Charles Dickens	175	195
Single Story The Haunted House	Story Book By Charles Dickens	175	195
2 In 1 Story By Charles Dickens	The Long Voyage & The Begging- Letter Writer	175	195
2 In 1 Story By Charles Dickens	The Trial For Murder & The Signal- Man	175	195
2 In 1 Story By Charles Dickens	Three 'Detective' Anecdotes & On Duty With Inspector Field	175	195
3 In 1 Story Leo Tolstoy	Three Question, God See The Truth - But Wait & Esarhaddon King Of Assyria	175	195
2 In 1 Story Leo Tolstoy	The Candle & After The Dance Story Book	175	195
3 In 1 Story Leo Tolstoy	The Coffee -House Of Surat, Alyosha The Pot & Too Dear!	175	195
3 In 1 Story Leo Tolstoy	Where Love Is- God Is , How Much Land Does A Man Need? & The Grain As Big As A Hen's Egg	175	195
2 In 1 Story Leo Tolstoy	A Spark Neglected & Little Girls Wiser Than Men	175	195
4 In 1 Story O.Henry	After Twenty Years, Lost On Dress Parade, The Romance Of A Busy Broker & By Courier	175	195
4 In 1 Story O.Henry	An Adjustment Of Nature, Memoirs Of A Yellow Dog, The Love Philter Of Ikey Schoenstein & Mammon And The Archer	175	195
3 In 1 Story O.Henry	An Unfinished Story, The Caliph,Cupid And The Clock & Sisters Of The Golden Circle	175	195
3 In 1 Story O.Henry	Babes In The Jungle, The Princess And The Puma & Confessions Of A Humorist	175	195
3 In 1 Story O.Henry	Between Rounds, The Skylight Room & A Service Of Love	175	195
Single Story Blind Man's Holiday By O.Henry	Story Book	175	195
3 In 1 Story O. Henry	Man About Town, The Cop And The Anthem & The Coming -Out Of Maggie	175	195
3 In 1 Story O. Henry	Springtime, The Green Door & From The Cabby's Seat	175	195
3 In 1 Story O. Henry	The Furnished Room, The Brief Debut Of Tildy & The Cactus	175	195
2 In 1 Story Oscar Wilde	The Birthday Of The Infanta & The Sphinx Without A Secret	175	195
2 In 1 Story Oscar Wilde	The Devoted Friend & The Star- Child	175	195
Single Story The Fisherman And His Soul By Oscar Wilde	Story Book	175	195
3 In 1 Story Oscar Wilde	The Nightingale And The Rose, The Selfish Giant & The Remarkable Rocket	175	195
3 In 1 Story Oscar Wilde	The Young King, The Happy Prince & The Model Millionaire	175	195
3 In 1 Story My Elder Brother, The Road To Salvation & Penalty By Munshi Premchand	Story Book	175	195
2 In 1 Story Catastrophe & The Shroud By Munshi Premchand	Story Book	175	195
4 In 1 Story By Munshi Premchand	Power Of A Curse, The Naive Friends, A Complex Problem & A Lesson In The Holy Life	175	195
4 In 1 Story By Munshi Premchand	Two Bullocks, January Night, Car- Splashing & Thakur's Well	175	195
4 In 1 Story Rudyard Kipling	False Down, Yoked With An Unbeliver, The Rescue Of Pluffles & Cupid's Arrows	175	195
5 In 1 Story Rudyard Kipling	His Chance In Life, Watches Of the Night, The Other Man, Consequences & The Story Of Muhammad Din	175	195
3 In 1 Story Rudyard Kipling	In Flood Time, The Broken-Link Handicap & In The house Of Suddhoo	175	195
4 In 1 Story Rudyard Kipling	Lispeth, Three And-An Extra, Thrown Away & Miss Youghal's Sais	175	195
2 In 1 Story Rudyard Kipling	My Own True Ghost Story & The Strange Ride Of Morrowbie Jukes	175	195
Single Story The Finest Story In The World By Rudyard Kipling	Story Book	175	195
2 In 1 Story Rudyard Kipling	The Phantom Rickshaw & The Conversion Of Aurelian Mcgoggin	175	195
2 In 1 Story Shakespeare	As You Like It & Winter's Tale	175	195
2 In 1 Story Shakespeare	Comedy Of Errors & All's Well That Ends Well	175	195
2 In 1 Story Shakespeare	Hamlet & Measure For Measure	175	195
2 In 1 Story Shakespeare	King Lear & Much Ado About Nothing	175	195
2 In 1 Story Macbeth & Cymbeline - Shakespeare	Story Book	175	195
2 In 1 Story Shakespeare	Merchant Of Venice & Two Gentlemen Of Verona	175	195
2 In 1 Story Shakespeare	Othello & Pericles Prince Of Tyre	175	195
2 In 1 Story Shakespeare	Romeo And Juliet & Timon Of Athens	175	195
2 In 1 Story Shakespeare	The Tempest & A Midsummer Night's Dream	175	195
2 In 1 Story Shakespeare	Twelfth Night & Taming Of The Shrew	175	195
2 In 1 Story Rabindranath Tagore	Mashi & Renunciation	175	195
3 In 1 Story Rabindranath Tagore	Raja And Rani, The Elder Sister & Subha	175	195
3 In 1 Story Rabindranath Tagore	The Auspicious Vision, The Supreme Night & The Trust Property	175	195
2 In 1 Story The Babus Of Nayanjore & Living Or Dead? - Rabindranath Tagore	Story Book	175	195
3 In 1 Story The Cabuliwallah, The Victory & Once There Was A King - Rabindranath Tagore	Story Book	175	195
3 In 1 Story Rabindranath Tagore	The Castaway, Saved & My Fair Neighbour	175	195
2 In 1 Story The Child's Return & Master Mashai By Rabindranath Tagore	Story Book	171	195
The Devotee & Vision 2 In 1 Story - Rabindranath Tagore	Story Book	175	195
The Hungry Stones & The Home-Coming 2 In 1 Story By Rabindranath Tagore	Story Book	175	195
The Kingdom Of Cards & My Lord, The Baby 2 In 1 Story By Rabindranath Tagore	Story Book	175	195
The Postmaster, The Riddle Solved & The River Stairs 3 In 1 Story - Rabindranath Tagore	Story Book	175	195
2 In 1 The Skeleton & The Crown Thee King - Rabindranath Tagore	Story book	175	195
French Book Combo Of 4 Books	French language Learning Book for students and beginners	360	360
French Book Combo Of 5 Books	French learning Book for kids	450	450
German Book Combo Of 4 Books	German language Learning Book For Kids and Students	360	360
German Book Combo Of 5 Books	German language learning book for students and children	450	450
Adbhut Kahaniya Chalte Rehne Ki Zidd	Hindi Stories For Children And Adults	175	195
Anmol Kahaniya (Priceless Stories)	Zindagi Badalne Wali Kahaniya In Hindi For Children and Adults	175	195
Inspirational Stories For Everyone In English	Story Book	175	195
Khilkhilati Hasya Kahaniya For Children's : Hindi Edition	Hindi story book	175	195
Margdarshak Kahaniya Jeewan Ki Sik Deti Kahaniya : Hindi Edition	Hindi story book	175	195
Short And Sweet Moral Stories For Children And Adult : English Edition	Story Book	175	195
Glittering Poems For School Children	Beautiful Book of Poems for children	250	295
Sparkling Poems Book For School Children	A beautiful fun book of poems for children	250	295
Rochak Kavitayen Poems Book By Sharda Madra	Hindi Poems book for children-rhymes book	175	195
Manoranjak Kavitayen (Entertaining Poems) By Sharda Madra	Poem Book For Kids in Hindi	175	195
2- in- 1 Classics Large Print Story Book for children	The Swiss Family Robinson & David Copperfield	175	195
2- in- 1 Classics Large Print	The Prince And The Pauper & Journey To The Center Of The Earth	175	195
2- in- 1 Classics Large Print Story Book for Children	Oliver Twist & Gulliver's Travels	175	195
2- in- 1 Classics Large Print Story Book for Children	Great Expectations & Around The World In 80 Days	175	195
2- in- 1 Classics Large Print Fun Story Book For Children	The Jungle Book & Robin Hood	175	195
2- in- 1 Classics Large Print Story Book For Children	Little Women & Black Beauty	175	195
2- in- 1 Classics Large Print A Tale Of Two Cities	Story book	175	195
2- in- 1 Classics Large Print Robinson Crusoe & The Time Machine	Story book	175	195
2- in- 1 Classics Large Print Kidnapped & The Three Musketeers	Story Book	175	195
2- in- 1 Classics Large Print Emma & The Prisoner Of Zenda	Story book	175	195
2- in- 1 Classics Large Print Jane Eyre & Far From The Madding Crowd	Story Book	175	195
2- in- 1 Classics Large Print The Call Of The Wild & Moby Dick	Story Book	171	195
2- in- 1 Classics Large Print The Little Mermaid & Animal farm	Story book	175	195
2- in- 1 Classics Large Print Dr. Jekyll And Mr. Hyde & Frankenstein	Story Book	175	195
2- in- 1 Classics Large Print The Invisible Man & Dracula	Story Book	175	195
2- in- 1 Classics Large Print Pinocchio & King Solomon 's Mines	Story Book	175	195
2- in- 1 Classics Large Print Alice In Wonderland & 20,000 Leagues Under The Sea	Story Book	175	195
GRAMMAR EXPRESS-5 for Age 10+	Practice Assignments Book with Answers	295	295
GRAMMAR EXPRESS-6 for Age 11+	Practice Assignments Book with Answers	295	295
Prernadayak Kahaniya (9 Inspiring Stories)	Timeless Stories For Children (Hindi Edition)	295	295
TilTil Ki Shikshaprad Kahaniya	Timeless Stories For Children (Hindi Edition)	195	195
Bal Nai tik Kahaniyan Stories in Hindi For Kids	Story Book Hindi Short Stories with Pictures	195	195
Superb Coloring Book -2 for kids	Best gift for children	195	195
Aapathit Gadyansh Unread Passage Hindi Comprehension Practice Manual - Grade 5	Hindi Comprehension Book 5	225	225
Aapathit Gadyansh Hindi Comprehension Practice Book with Moral Stories	Class 6 Students	225	225
Sargun Hindi Pathyapustak Class 1	Hindi Textbook for Kids Based on NEP & NCF	299	299
Sargun Hindi Pathyapustak Class 2	Hindi Textbook for Kids Based on NEP & NCF	330	330
Sargun Hindi Pathyapustak Class 3	Hindi Textbook for Kids Based on NEP & NCF	360	360
Sargun Hindi Pathyapustak Class 4	Hindi Textbook for Kids Based on NEP & NCF	390	390
Sargun Hindi Pathyapustak Class 5	Hindi Textbook for Kids Based on NEP & NCF	415	415
Hindi Vyakaran - 1 Practice Assignments Workbook	Hindi Grammar Book for Kids Age 5+	295	295
Hindi Vyakaran - 2 Practice Assignments Workbook	Hindi Grammar Book for Kids Age 6+	295	295
Hindi Vyakaran - 3 Practice Assignments Workbook	Hindi Grammar Book for Kids Age 8+	295	295
Hindi Vyakaran - 4 Practice Assignments Workbook	Hindi Grammar Book for Kids Age 9+	295	295
Hindi Vyakaran - 5 Practice Assignments Workbook	Hindi Grammar Book for Kids Age 9+	295	295
Swar Sargun	Hindi learning and practice book for kids 2 to 5	280	265
Practice Assignments and Activity Workbook All in One Full Subjects for Class 5	Practice book	295	295
Calligraphy Practice workbook for Beautiful handwriting and Lettering	Art of Calligraphy for Beginners– (Part 2)	250	250
Vocabulary Builder word Search puzzle worksheets for kids	Workbook	294	295
Maths Express-4 Books practice question and worksheets for kids	Develop YOUR Skills	293	295
Sargun Hindi- Praveshika	Hindi learning and practice workbook for children	395	395
Practice Assignment book-Matching skills	Interactive Activity book for children	295	295
Fun with phonetics Books English Hindi sounds with practice worksheets	Workbook	295	295
Mind Blowing Word Search Activity Book for Kids (3 in 1)	Activity Book	175	195
Calligraphy: The New Style Of English Lettering Vol.-1	Calligraphy Practice Book	250	250
GRAMMAR BOOKS FOR KIDS EXPRESS -3	Grammar Skills BOOKS	295	295
Logical Reasoning Practice Worksheets for Class 1	Graded Assignments with Diagrams & Exercises	250	250
Logical Reasoning Practice Worksheets for Class 2	Graded Assignments with Diagrams & Exercises	250	250
Logical Reasoning Practice Worksheets for Class 3	Graded Assignments with Diagrams & Exercises	250	250
Logical Reasoning Practice Worksheets for Class 4	Graded Assignments with Diagrams & Exercises	250	250
Logical Reasoning Practice Worksheets for Class 5	Graded Assignments with Diagrams & Exercises	250	250
Logical Reasoning Practice Worksheets for Class 6	Graded Assignments with Diagrams & Exercises	250	250
Beautiful Rhymes and Bal Geet Book- B for children	Nursery rhymes and preschool poem book	195	195
Meri Pratham KA KHA GA For Primary School Kids (3-5 Years)	Hindi Alphabet Learning Book for kindergarten kids	195	195
Interactive Activity book and Practice Assignment Book on Hindi Shabad Gyaan	Hindi Edition (Ages 5 years to 8 years)	295	295
Calligraphy Practice workbook for Beautiful handwriting and Lettering	Art of Calligraphy for Beginners– (Part 2)	250	250
Practice Assignment book-Opposite book for children	Practice Workbook	294	295
Mind Blowing Word Search Interactive Activity Book for Children and Young of Class 3 (3 in 1)	Activity Book	175	195
My 1st Step In English With Phonetic Sound For Pre Primer School Kids	Phonics learning Book for Kids	280	265
My 1st Step in Maths With Pre Number Skills For Pre Primer Kids	Maths Practice Book for kids	250	250
My 2nd Step in Maths With Fun filled activities	Interactive Activity Book for kids	250	295
My Alphabet And Number Book For 3-5 Year Kids	Alphabet & Number Books for Kids	225	250
My Big Book Of Colouring For Kids	Colouring For Kids	295	325
My Big Book Of Pictures For Kids	Pictures & Illustration Book for Kids	250	295
My Big Books Of Rhymes & बाल गीत	English & Hindi Poem Books For Kids	395	395
My First Learning Step Book For Kids	Alphabet and Number Book for kindergarten children	365	395
Pre School Activity Book For kids 3-5 Year Old	Interactive Activity Book For Kids	325	299
Practice Assignments Workbook for Class 2nd All in One (English, Maths, Hindi, Evs)	Activity book and Practice Workbook	295	295
Level 4 Fun With Cursive Cursive Writing Book For Little Once	Writing book for nursery kids	195	195
Superb Colouring Book -1 for kids	Colouring book for kids	225	225
Practice Assignment book-MAZES find the way	Activity Book	295	295
The 7 Habits of Highly Effective Teenagers	By Sean Covey	445	599
Brain Booster – 2 Practice Assignment Book of Quantitative Reasoning	A Fun Interactive Activity Book for Children	295	295
Apathit Gadyansh Abhyash Pustika | Hidden Passage Compendium | Unseen Passages	3 Practice Workbook For Students of class 3 th In Hindi	195	195
Interactive Activity book and Practice Assignment Book on Hindi Maatra Gyaan	Hindi Edition hindi learnant book	295	295
Rhymes and Bal Geet Book C	Rhymes book for kids in english	195	195
All in One Interactive Writing and Activity Book & Practice Assignment Book on Alphabets	To Keep Children and Young Minds Efficient in Alphabets	295	295
Alphabet Practice and Learning Book (Small abc) For Kids	With Reusable Wipe & Clean Flash Cards :Age 2 to 5 years	250	250
Poem book pack of 4 Books	Poem Book Collection	882	980
Word Search combo Book pack of 4	Word Search Book Collection	700	780
Interactive Activity Book and Practice Assignment Book on Multiplication And Tables	To Keep Children and Young Minds Efficient in Mathematics	295	295
Rudrakshi Hindi Vyakaran – Class 1	Easy Hindi Grammar Book for Kids | Based on NEP 2020	225	225
Rudrakshi Hindi Vyakaran– Class 2	Easy Hindi Grammar Book for Kids | Based on NEP 2020	240	240
Rudrakshi Hindi Vyakaran – Class 3	Easy Hindi Grammar Book for Kids | Based on NEP 2020	260	260
Rudrakshi Hindi Vyakaran – Class 4	Easy Hindi Grammar Book for Kids | Based on NEP 2020	345	345
Rudrakshi Hindi Vyakaran – Class 5	Easy Hindi Grammar Book for Kids | Based on NEP 2020	449	449
Interactive Activity 5+ Practice Assignment Book	To Keep Children and Young Minds Engaged In Enhancing Problem Solving Skills	295	295
Handwriting Improvement Books - Cursive Writing Book For Kids And Young Adult	Beautiful amazing handwriting and writing practice Book 5	195	195
My Big Book of Small abc	Writing Practice & Activity Book for Nursery kids	299	299
Smart Minds Class 1 General Knowledge Book	100+ Facts | Based on NEP & NCF | Amazing Discoveries & Activities	195	195
Smart Minds Class 2 General Knowledge Book	100+ Facts | Based on NEP & NCF | Amazing Discoveries & Activities	220	220
Smart Minds Class 3 General Knowledge Book	100+ Facts | Based on NEP & NCF | Amazing Discoveries & Activities	230	230
Smart Minds Class 4 General Knowledge Book	100+ Facts | Based on NEP & NCF | Amazing Discoveries & Activities	240	240
Smart Minds Class 5 General Knowledge Book	100+ Facts | Based on NEP & NCF | Amazing Discoveries & Activities	260	260
Awesome World – Social Studies 3	As per NEP & NCF (New Education Policy)	360	360
Awesome World – Social Studies 4	As per NEP & NCF (New Education Policy)	390	390
Awesome World – Social Studies 5	As per NEP & NCF (New Education Policy)	415	415
Interactive Activity Practice Assignment Book on Addition	To Keep Children and Young Minds Efficient in Addition of Double and Three Digits	295	295
All in One Practice Assignment Workbook and fun Activity book For Nursery Students	To Keep Children and Young Minds Efficient	295	295
English GRAMMAR EXPRESS-2 practice Assigment Books with answers	Book for Develop Skills of Kids	295	295
Interactive Activity book and Practice Assignment Workbook For Mathematics	To Keep Children and Young Minds Efficient in Math	295	295
Fun With Cursive Level 2 Cursive Writing Book For Kids	Writing practise book - writing workbook	195	195
Interactive Activity book and Practice Assignment Book -Math Express 2	To Keep Children and Young Minds Efficient in Mathematics	295	295
Hindi Kahaniyan	Set of 9 Story Books for kids	450	450
Writing Practice Assignment Workbook on Hindi	To Keep Children and Young Minds Efficient in Hindi writing Activity	295	295
All in One Fun Activity book & Practice Work Book	English, Math, Hindi, Evs and Art for Kindergarten kids	295	295
Big Books of phonetics English-Hindi phonic sounds	Workbook	450	450
Write Calligraphy Practice Book -1	Practice Book	399	399
Kahawato Ki Kahaniya (Stories Of Proverb) : Hindi Edition	Hindi Story Book	175	195
Hindi Reusable Wipe & Clean Flash Cards book	Hindi Alphabet Learning Books For Kids	325	325
Flash Cards , Wipe & Clean books With Spiral (Combo Of 5 Books)	Festivals, Food, Fruits , Insects, Vegetables	450	475
Aadhunik Kahaniya : Anokhi Sikh Deti Kahaniya Stories For Children	Hindi Edition Story Book	175	195
Fun With Activity Book 1	Preschool book - activity book for 3+	250	250
Rhymes and Bal Geet book A	Rhymes book - bal geet book for kids in english	199	199
Practice Assignment Book Amazing Mandala	Early Learning Skill Development Practice Worksheets	295	295
Practice Worksheets / Early Learning Comparison skill	English, Maths, GK, Colouring Workbook – 1	295	295
Cursive word Handwriting - 2 & 3 Letters	Practice Workbook For Children	295	295
Handwriting Print Script - Easy Sentence	Practice Workbook	295	295
Practice Assignment Book (MANDALA )	Early Learning Practice Worksheets for kids	295	295
Spot the Differences	Fun Activity Books For Children	295	295
ABC Book With Vowel Sound For 3-5 Years Kids	Early Learning ABC Book for Children	195	195
Engaging Activity Book for Kids and Young Mind Blowing Word Search of Class 2 (6 in 1)	Activity Book	225	250
Fun With Numbers 1-100	Writing Practice and Math Interactive Activity Book For Kids	195	195
Colour Me Again & Again Animals & Birds And Fruits & Vegetables Colouring Books For Kids	Reusable Wipe and Clean Colouring books for children	225	250
Champagne, Sorrow, Misery, A Transgression 4 in 1 Story By Anton Chekhov	Story Book	175	195
3 In 1 Story O.Henry	The Gift Of The Magi, Tobin's Palm & A Cosmopolite In A Cafe	175	195
Story The Man Who Would Be King By Rudyard Kipling	Story Book	175	195
Apathit Gadyansh | Hidden Passage Compendium | Unseen Passages	1 Hindi Practice Workbook For Students of Class First	195	195
Punjabi Learning Books for Kids	Reusable Wipe & Clean Books: Activity Book	365	395
My Big Book of 1-20 Writing and Activity book	Practice & exercise book of Math for kinder garden children	250	295
Mind Blowing Word Search 6 in 1 Activity Book for Kids of Class 1	Activity Book	225	250
Art of Calligraphy Practice Assignment Books for Beautiful handwriting and Lettering	For Kids and Young Adults	295	295
Style of Calligraphy practice workBooks for kids	Workbook	295	295
ABC Alphabet Book For Kids	Early Learning ABC Book for Children	195	195
`;


/* ── 9b. Filter metadata ─────────────────────────────────────────────────── */

const exactInterests = [
  "Story Books",
  "Activity & Puzzles",
  "Art & Creativity",
  "School Textbooks",
];

const exactSubjects = [
  "English",
  "Hindi",
  "Mathematics",
  "Science & EVS",
  "Computers & AI",
];

const exactClasses = [
  "2-4 Years (Nursery)",
  "4-5 Years (LKG)",
  "5-6 Years (UKG)",
  "6-7 Years (Class 1)",
  "7-8 Years (Class 2)",
  "8-9 Years (Class 3)",
  "9-10 Years (Class 4)",
  "10-11 Years (Class 5)",
  "11-12 Years (Class 6)",
];


/* ── 9c. Product parser ──────────────────────────────────────────────────── */

/**
 * Parse rawProductData (TSV) into an array of product objects,
 * inferring interest, subject and age-group from keywords in the title.
 */
const catalogProducts = rawProductData
  .split('\n')
  .map((line, index) => {
    // Try tab-separated first, fall back to 3-space separation
    let parts = line.split('\t');
    if (parts.length < 3) parts = line.split('   ');

    const mrp   = parseInt(parts.pop(), 10) || 500;
    const price = parseInt(parts.pop(), 10) || mrp;
    let   desc  = parts.length > 1 ? parts.pop().trim() : "A wonderful educational product.";
    let   title = parts.join(' ').trim();

    if (!title) title = "Mindfuel's Educational Product " + (index + 1);

    const t = title.toLowerCase();

    // --- Interest mapping ---
    let mappedInterest = "School Textbooks"; // default
    if (t.includes('story') || t.includes('classic') || t.includes('tale') || t.includes('kahaniya'))
      mappedInterest = "Story Books";
    else if (t.includes('activity') || t.includes('puzzle') || t.includes('workbook') ||
             t.includes('reasoning') || t.includes('brain booster') ||
             t.includes('practice') || t.includes('all in one'))
      mappedInterest = "Activity & Puzzles";
    else if (t.includes('art') || t.includes('colour') || t.includes('color') ||
             t.includes('calligraphy') || t.includes('drawing') ||
             t.includes('mandala') || t.includes('handwriting') || t.includes('craft'))
      mappedInterest = "Art & Creativity";

    // --- Subject mapping ---
    let mappedSubject = "General"; // default
    if (t.includes('english') || t.includes('phonics') || t.includes('grammar') ||
        t.includes('comprehension') || t.includes('reading') ||
        t.includes('abc') || t.includes('alphabet'))
      mappedSubject = "English";
    else if (t.includes('hindi') || t.includes('sulekhni') || t.includes('varnmala') ||
             t.includes('sargun') || t.includes('bal geet'))
      mappedSubject = "Hindi";
    else if (t.includes('math') || t.includes('number') || t.includes('subtraction'))
      mappedSubject = "Mathematics";
    else if (t.includes('science') || t.includes('environmental') || t.includes('evs'))
      mappedSubject = "Science & EVS";
    else if (t.includes('computer') || t.includes('ai '))
      mappedSubject = "Computers & AI";

    // --- Age / class mapping ---
    let mappedClass = exactClasses[(index * 3) % exactClasses.length]; // rotating default
    if      (t.includes('nursery')) mappedClass = "2-4 Years (Nursery)";
    else if (t.includes('lkg'))     mappedClass = "4-5 Years (LKG)";
    else if (t.includes('ukg'))     mappedClass = "5-6 Years (UKG)";

    return {
      id:            index + 1,
      name:          title,
      description:   desc,
      interest:      mappedInterest,
      subject:       mappedSubject,
      ageGroup:      mappedClass,
      price,
      originalPrice: mrp,
      sales:         Math.floor(Math.random() * 500),
      images: [
        "https://placehold.co/300x400/e1efff/333333?text=Mindfuels+Book",
        "https://placehold.co/300x400/fff8e7/333333?text=Mindfuels+Inside+1",
        "https://placehold.co/300x400/fdeae8/333333?text=Mindfuels+Inside+2",
        "https://placehold.co/300x400/e8f0e4/333333?text=Mindfuels+Inside+3",
        "https://placehold.co/300x400/e2e8f0/333333?text=Mindfuels+Inside+4"
      ],
    };
  });


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

  const sortSelect = document.getElementById('sortSelect');
  const sortVal    = sortSelect ? sortSelect.value : 'bestsellers';

  // Filter
  let filtered = catalogProducts.filter(p => {
    if (selectedInterests.length > 0 && !selectedInterests.includes(p.interest)) return false;
    if (selectedSubjects.length  > 0 && !selectedSubjects.includes(p.subject))   return false;
    if (selectedClasses.length   > 0 && !selectedClasses.includes(p.ageGroup))   return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  // Sort
  if      (sortVal === 'price_low_high')                      filtered.sort((a, b) => a.price - b.price);
  else if (sortVal === 'price_high_low')                      filtered.sort((a, b) => b.price - a.price);
  else if (sortVal === 'bestsellers' || sortVal === 'most_purchased') filtered.sort((a, b) => b.sales - a.sales);

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

/** Reset all filters to their defaults and re-render. */
window.clearAllFilters = function() {
  document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.value = 5000;
    document.getElementById('priceDisplay').innerText = 5000;
  }
  renderProducts();
};

// Wire up filter checkboxes and price slider, then do the initial render
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', renderProducts);
  });

  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.addEventListener('input', () => updatePriceDisplay(priceRange.value));
  }

  renderProducts();
  renderHomeBestsellers();
});

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
  currentModalImages = product.images;
  currentImageIndex  = 0;

  document.getElementById('modalProductName').innerText  = product.name;
  document.getElementById('modalPrice').innerText        = '₹' + product.price;
  document.getElementById('modalOriginalPrice').innerText = '₹' + product.originalPrice;

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  document.getElementById('modalDiscount').innerText = discountPercent + '% OFF';

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

