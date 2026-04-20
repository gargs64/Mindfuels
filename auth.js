const AUTH0_DOMAIN = 'mindfuels.us.auth0.com';
const AUTH0_CLIENT_ID = 'Lmx8bHhyDNqIurh0VV0NL11oDVMbQF63';
// API_BASE_URL is declared in script.js (loaded before this file)

// Build redirect URI dynamically (works on localhost & production)
const pathBase = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
const REDIRECT_URI = window.location.origin + pathBase + 'login.html';

window.auth0Client = null;
window.isUserLoggedIn = false;

// 1. IMMEDIATE FALLBACK (Runs instantly as soon as script starts)
(function showNameFirst() {
  try {
    const savedName = localStorage.getItem('mindfuels_username');
    const accountBtn = document.getElementById('accountBtn');
    if (savedName && accountBtn) {
      const firstLetter = savedName.charAt(0).toUpperCase();
      accountBtn.innerHTML = `
        <div style="width:38px; height:38px; border-radius:50%; background:#FDE893; color:#1a1a1a;
                    display:flex; align-items:center; justify-content:center;
                    font-weight:800; font-size:16px; cursor:pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          ${firstLetter}
        </div>`;
    }
  } catch(e) {}
})();

// 2. AUTH0 CHECK
async function checkAuthState() {
  try {
    // Check if library exists to avoid crash
    if (typeof auth0 === 'undefined') {
      console.warn('Auth0 SDK not loaded');
      return;
    }

    if (!window.auth0Client) {
      window.auth0Client = await auth0.createAuth0Client({
        domain: AUTH0_DOMAIN,
        clientId: AUTH0_CLIENT_ID,
        authorizationParams: { 
          redirect_uri: REDIRECT_URI, 
          audience: 'mindfuels-api' 
        },
        cacheLocation: 'localstorage'
      });
    }

    const isAuthenticated = await window.auth0Client.isAuthenticated();
    window.isUserLoggedIn = isAuthenticated;
    const accountBtn = document.getElementById('accountBtn');

    if (isAuthenticated) {
      const user = await window.auth0Client.getUser();
      const customUsername = localStorage.getItem('mindfuels_username');
      let displayName = customUsername || (user.name && !user.name.includes('@') ? user.name : user.email.split('@')[0]);
      const firstLetter = (displayName || '?').charAt(0).toUpperCase();

      if (accountBtn) {
        accountBtn.href = '#';
        accountBtn.onclick = (e) => e.preventDefault();
        accountBtn.innerHTML = `
          <div style="width:38px; height:38px; border-radius:50%; background:#FDE893; color:#1a1a1a;
                      display:flex; align-items:center; justify-content:center;
                      font-weight:800; font-size:16px; cursor:pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            ${firstLetter}
          </div>`;
      }

      // Populate Dropdown
      const accountDropdown = document.getElementById('accountDropdown');
      if (accountDropdown) {
        accountDropdown.innerHTML = `
          <div class="dropdown-header"><strong>${displayName}</strong><span>${user.email}</span></div>
          <div class="dropdown-links">
            <a href="#"><span class="dropdown-icon">📦</span>My Orders</a>
            <a href="#"><span class="dropdown-icon">❤️</span>Wishlist</a>
          </div>
          <div class="dropdown-footer"><button onclick="logout()" class="signout-btn">Sign Out</button></div>
        `;
      }

      // Setup Dropdown Hover
      const accountWrapper = document.getElementById('accountWrapper');
      if (accountWrapper && accountDropdown) {
        let timer = null;
        const show = () => { clearTimeout(timer); accountDropdown.classList.add('visible'); };
        const hide = () => { timer = setTimeout(() => accountDropdown.classList.remove('visible'), 300); };
        accountWrapper.onmouseenter = show; accountWrapper.onmouseleave = hide;
        accountDropdown.onmouseenter = show; accountDropdown.onmouseleave = hide;
      }

      // Sync backend
      try {
        const token = await window.auth0Client.getTokenSilently();
        const phone = localStorage.getItem('mindfuels_phone') || '';
        fetch(`${API_BASE_URL}/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name: displayName, email: user.email, phone: phone, picture: user.picture })
        });
        if (typeof window.loadUserCart === 'function') window.loadUserCart();
        if (typeof window.loadUserWishlist === 'function') window.loadUserWishlist();
      } catch (err) {
        console.warn('Backend sync error (non-critical):', err);
      }

    } else {
      const savedName = localStorage.getItem('mindfuels_username');
      if (!savedName && accountBtn) {
        accountBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
      }
    }
  } catch (e) { console.error("Auth helper error:", e); }
}

// 3. Initialize on Load
window.addEventListener('load', checkAuthState);

window.logout = function () {
  localStorage.removeItem('mindfuels_username');
  localStorage.removeItem('mindfuels_phone');
  localStorage.removeItem('mindfuels_wishlist');
  localStorage.removeItem('mindfuels_cart'); // Clear cart to avoid seeing old data before next load
  if (window.auth0Client) {
    window.auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
  } else {
    window.location.href = 'index.html';
  }
};