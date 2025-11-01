console.log("🚀 Initializing Raizeit Authentication...");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";

// Firebase Configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCuOGfEavfiGpvOu6Gz3r2i_SgOE_gcTOw",
      authDomain: "raizeit-771e5.firebaseapp.com",
      projectId: "raizeit-771e5",
      storageBucket: "raizeit-771e5.firebasestorage.app",
      messagingSenderId: "467814664892",
      appId: "1:467814664892:web:8f28785aaa1660df7adeb9",
      measurementId: "G-CPJVRFF499"
    };
  
   
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Safe DOM element getter
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.log(`ℹ️ Element not found (may be on different page): ${id}`);
  }
  return element;
}

// Get DOM elements safely
const profileIcon = getElement('profileIcon');
const dropdownMenu = getElement('dropdownMenu');
const signinModal = getElement('signinModal');
const menuSignAction = getElement('menuSignAction');
const topSignLink = getElement('topSignLink');
const modalSignBtn = getElement('modalSignBtn');
const modalCloseBtn = getElement('modalCloseBtn');
const submitNav = getElement('submitNav');
const menuSubmitLink = getElement('menuSubmitLink');
const chatbotIcon = getElement('chatbot-icon');

// ==========================================
// Authentication Functions
// ==========================================

async function signIn() {
  if (!modalSignBtn) {
    console.log("🔑 Sign-in triggered but no modal button found");
    return;
  }
  
  modalSignBtn.disabled = true;
  modalSignBtn.textContent = 'Signing in...';
  
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('✅ User signed in:', result.user.email);
    
    if (signinModal) {
      signinModal.hidden = true;
    }
  } catch (error) {
    console.error('❌ Sign-in error:', error);
    alert('Failed to sign in. Please try again.');
  } finally {
    if (modalSignBtn) {
      modalSignBtn.disabled = false;
      modalSignBtn.textContent = 'Sign in with Google';
    }
  }
}

async function signOutUser() {
  try {
    await signOut(auth);
    console.log('👋 User signed out');
  } catch (error) {
    console.error('❌ Sign-out error:', error);
  }
}

function updateUI(user) {
  // Only update UI if elements exist (on index.html)
  if (profileIcon) {
    if (user) {
      const displayName = user.displayName || user.email.split('@')[0];
      const initial = displayName.charAt(0).toUpperCase();
      
      profileIcon.textContent = initial;
      profileIcon.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      
      if (menuSignAction) menuSignAction.textContent = 'Sign Out';
      if (topSignLink) topSignLink.textContent = 'Sign Out';
      
    } else {
      profileIcon.textContent = '👤';
      profileIcon.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      if (menuSignAction) menuSignAction.textContent = 'Sign In';
      if (topSignLink) topSignLink.textContent = 'Sign In';
    }
  }
}

function requireAuth(e) {
  if (!auth.currentUser) {
    e.preventDefault();
    if (signinModal) {
      signinModal.hidden = false;
    } else {
      // If on submit.html and no modal, redirect to index.html to sign in
      window.location.href = 'index.html';
    }
  }
}

// ==========================================
// Event Listeners (only if elements exist)
// ==========================================

// Profile dropdown (only on index.html)
if (profileIcon && dropdownMenu) {
  profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => {
    dropdownMenu.style.display = 'none';
  });

  dropdownMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Sign in/out from menu (only on index.html)
if (menuSignAction) {
  menuSignAction.addEventListener('click', (e) => {
    e.preventDefault();
    if (dropdownMenu) dropdownMenu.style.display = 'none';
    
    if (auth.currentUser) {
      signOutUser();
    } else if (signinModal) {
      signinModal.hidden = false;
    }
  });
}

// Sign in/out from top nav (only on index.html)
if (topSignLink) {
  topSignLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (auth.currentUser) {
      signOutUser();
    } else if (signinModal) {
      signinModal.hidden = false;
    }
  });
}

// Modal buttons (only on index.html)
if (modalSignBtn) {
  modalSignBtn.addEventListener('click', signIn);
}

if (modalCloseBtn && signinModal) {
  modalCloseBtn.addEventListener('click', () => {
    signinModal.hidden = true;
  });
}

// Close modal on backdrop click (only on index.html)
if (signinModal) {
  signinModal.addEventListener('click', (e) => {
    if (e.target === signinModal) {
      signinModal.hidden = true;
    }
  });
}

// Protect navigation (works on both pages)
if (submitNav) {
  submitNav.addEventListener('click', requireAuth);
}

if (menuSubmitLink) {
  menuSubmitLink.addEventListener('click', requireAuth);
}

if (chatbotIcon) {
  chatbotIcon.addEventListener('click', requireAuth);
}

// ==========================================
// Firebase Auth State Observer
// ==========================================

onAuthStateChanged(auth, (user) => {
  console.log('🔄 Auth state changed:', user ? user.email : 'No user');
  
  // Store user in window for other scripts - CRITICAL FIX
  window.currentUser = user;
  window.firebaseAuthUser = user;
  
  updateUI(user);
});

// ==========================================
// First Visit Modal (only on index.html)
// ==========================================

window.addEventListener('load', () => {
  if (signinModal && !auth.currentUser) {
    setTimeout(() => {
      signinModal.hidden = false;
    }, 2000);
  }
});

// ==========================================
// Export for other modules
// ==========================================

export { auth, signIn, signOutUser };
export function getCurrentUser() {
  return auth.currentUser;
}
