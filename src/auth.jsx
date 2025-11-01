import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

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

const AuthComponent = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Authentication Functions
  const handleSignIn = async () => {
    setIsSigningIn(true);
    
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('✅ User signed in:', result.user.email);
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      alert('Failed to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('👋 User signed out');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('❌ Sign-out error:', error);
    }
  };

  const requireAuth = (callback) => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      callback();
    }
  };

  // Firebase Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔄 Auth state changed:', currentUser ? currentUser.email : 'No user');
      setUser(currentUser);
      
      // Store user globally if needed
      window.currentUser = currentUser;
      window.firebaseAuthUser = currentUser;
    });

    return () => unsubscribe();
  }, []);

  // Show modal on first visit
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  // Get user initial
  const getUserInitial = () => {
    if (!user) return '👤';
    const displayName = user.displayName || user.email.split('@')[0];
    return displayName.charAt(0).toUpperCase();
  };

  // Get profile icon background
  const getProfileBackground = () => {
    return user 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <>
      {/* Profile Menu */}
      <div className="profile-menu">
        <div 
          id="profileIcon"
          className="profile-icon"
          style={{ background: getProfileBackground() }}
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          {getUserInitial()}
        </div>

        {/* Dropdown Menu */}
        <div 
          id="dropdownMenu"
          className={`dropdown ${isDropdownOpen ? 'show' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ul>
            <li>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                requireAuth(() => window.location.href = '/app');
              }}>
                Submit Issue
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                if (user) {
                  handleSignOut();
                } else {
                  setIsDropdownOpen(false);
                  setIsModalOpen(true);
                }
              }}>
                {user ? 'Sign Out' : 'Sign In'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Sign In Modal */}
      {isModalOpen && (
        <div 
          id="signinModal"
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains('modal-overlay')) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="modal-content">
            <button 
              className="modal-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            
            <h2>Welcome to RaizeIt</h2>
            <p>Sign in to submit issues and track your reports</p>
            
            <button 
              className="btn btn--primary"
              onClick={handleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthComponent;

// Export helper functions
export const getCurrentUser = () => auth.currentUser;
export { auth };
