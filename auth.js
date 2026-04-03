const AUTH0_DOMAIN = 'mindfuels.us.auth0.com';
const AUTH0_CLIENT_ID = 'HOTM4KSpHLFFmdXYchCP2vYDtgTBDfJW';
let auth0Client = null;

// Global tracking for scripts
window.isUserLoggedIn = false;

async function checkAuthState() {
  try {
    auth0Client = await auth0.createAuth0Client({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin + '/login.html'
      },
      cacheLocation: 'localstorage'
    });

    const isAuthenticated = await auth0Client.isAuthenticated();
    window.isUserLoggedIn = isAuthenticated;

    const accountBtn = document.getElementById('accountBtn');
    const accountDropdown = document.getElementById('accountDropdown');
    const accountWrapper = document.getElementById('accountWrapper');

    if (isAuthenticated) {
      const user = await auth0Client.getUser();

      // Get Display Name
      const customUsername = localStorage.getItem('mindfuels_username');
      let displayName;

      if (customUsername) {
        displayName = customUsername;
      } else {
        const fullName = `${user.given_name || ''} ${user.family_name || ''}`.trim();
        if (fullName) {
          displayName = fullName;
        } else if (user.name && !user.name.includes('@')) {
          displayName = user.name;
        } else {
          displayName = user.email.split('@')[0];
        }
      }

      const email = user.email || '';
      const firstLetter = (displayName || '?').charAt(0).toUpperCase();

      // Update Account Icon
      if (accountBtn) {
        accountBtn.href = '#';
        accountBtn.onclick = (e) => e.preventDefault();
        accountBtn.innerHTML = `
          <div style="
            width:38px; height:38px; border-radius:50%;
            background:#FDE893; color:#1a1a1a;
            display:flex; align-items:center; justify-content:center;
            font-weight:800; font-size:16px; cursor:pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">${firstLetter}</div>`;
      }

      // Populate Dropdown
      if (accountDropdown) {
        accountDropdown.innerHTML = `
    <div class="dropdown-header">
      <strong>${displayName}</strong>
      <span>${email}</span>
    </div>
    <div class="dropdown-links">
      <a href="#"><span class="dropdown-icon">📦</span>My Orders</a>
      <a href="#"><span class="dropdown-icon">❤️</span>Wishlist</a>
    </div>
    <div class="dropdown-footer">
      <button onclick="logout()" class="signout-btn">Sign Out</button>
    </div>
  `;
      }

      // Dropdown Interaction Logic
      if (accountWrapper && accountDropdown) {
        let hideTimer = null;

        const showDrop = () => {
          clearTimeout(hideTimer);
          accountDropdown.classList.add('visible');
        };

        const hideDrop = () => {
          hideTimer = setTimeout(() => {
            accountDropdown.classList.remove('visible');
          }, 300);
        };

        accountWrapper.onmouseenter = showDrop;
        accountWrapper.onmouseleave = hideDrop;
        accountDropdown.onmouseenter = showDrop;
        accountDropdown.onmouseleave = hideDrop;
      }

    } else {
      if (accountBtn) {
        accountBtn.href = 'login.html';
        accountBtn.onclick = null;
        accountBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
      }
      // Hide cart and wishlist badges when logged out
      document.querySelectorAll('.cart-badge').forEach(b => { b.innerText = '0'; b.style.display = 'none'; });
      const wishBadge = document.getElementById('wishlistBadge');
      if (wishBadge) wishBadge.style.display = 'none';
    }
  } catch (e) {
    console.error('Auth check error:', e);
  }
}

window.logout = function () {
  localStorage.removeItem('mindfuels_user');
  localStorage.removeItem('mindfuels_username');
  localStorage.removeItem('mindfuels_cart');
  localStorage.removeItem('mindfuels_wishlist');
  sessionStorage.removeItem('mindfuels_welcome_shown');
  if (auth0Client) {
    auth0Client.logout({
      logoutParams: { returnTo: window.location.origin }
    });
  }
};

window.addEventListener('load', checkAuthState);