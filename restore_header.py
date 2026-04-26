import sys

path = 'd:/Projects/mindfuels-master/index.html'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

full_icons = [
    '      <!-- Right Icons -->\n',
    '      <div class="header-icons">\n',
    '        <!-- Search -->\n',
    '        <button class="search-btn" aria-label="Search" onclick="toggleSearchOverlay()">\n',
    '          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n',
    '            <circle cx="11" cy="11" r="8"></circle>\n',
    '            <path d="M21 21l-4.35-4.35"></path>\n',
    '          </svg>\n',
    '        </button>\n',
    '        \n',
    '        <!-- Cart -->\n',
    '        <a href="cart.html" class="cart-icon" aria-label="Cart">\n',
    '          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n',
    '            <circle cx="9" cy="21" r="1"></circle>\n',
    '            <circle cx="20" cy="21" r="1"></circle>\n',
    '            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path>\n',
    '          </svg>\n',
    '          <span class="cart-badge cart-count">0</span>\n',
    '        </a>\n',
    '\n',
    '        <!-- Account -->\n',
    '        <div class="account-wrapper" id="accountWrapper">\n',
    '          <a href="login.html" id="accountBtn" aria-label="Account">\n',
    '            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n',
    '              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>\n',
    '              <circle cx="12" cy="7" r="4"></circle>\n',
    '            </svg>\n',
    '          </a>\n',
    '          <div id="accountDropdown" class="account-dropdown"></div>\n',
    '        </div>\n',
    '\n',
    '        <!-- Wishlist -->\n',
    '        <a href="javascript:void(0)" id="wishlistBtnDesktop" class="wishlist-btn" aria-label="Wishlist" style="position: relative;">\n',
    '          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n',
    '            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z"></path>\n',
    '          </svg>\n',
    '          <span class="wishlist-badge" style="display:none; right:-8px; top:-5px;">0</span>\n',
    '        </a>\n',
    '\n',
    '        <button class="hamburger-btn" id="hamburgerBtn" aria-label="Open menu" onclick="openMenu()">\n',
    '          &#9776;\n',
    '        </button>\n',
    '      </div>\n'
]

try:
    start_idx = next(i for i, line in enumerate(lines) if '<!-- Right Icons -->' in line)
    header_icons_start = next(i for i, line in enumerate(lines) if 'class="header-icons"' in line)
    header_icons_end = header_icons_start + 1
    while '</div>' not in lines[header_icons_end]:
        header_icons_end += 1
    header_icons_end += 1

    new_lines = lines[:start_idx] + full_icons + lines[header_icons_end:]
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
