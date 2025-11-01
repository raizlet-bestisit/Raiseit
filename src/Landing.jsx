import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaYoutube, FaInstagram } from "react-icons/fa6";


const functionalities = [
  { 
    icon: '',
    title: 'Just provide the details, let AI do',
    desc: 'Just enter some basic information about your issue and let AI do the work'
   },
  { 
    icon: '',
    title: 'Automatically forwards e-mail and tweets',
    desc: 'Our AI automatically e-mails and tweets about your problem'
   },
  { 
    icon: '',
    title: 'No one listens, we do!',
    desc: 'We make sure that every problem you post gets the highest possible reach.'
   },
   {
     icon: '',
     title: 'FREE',
     desc: 'This is beta version, using all features is free.'
   },
];

const benefs = [
  {
    icon: '📌',
    title: 'Any problem, one place to report',
    desc: 'At RaiseIt, just give a few details about the problem, other things our AI will handle.'
  },
  { 
    icon: '⌚',
    title: 'Save time',
    desc: 'Our AI automatically generates a formatted legal complaint for problem and automatically emails to that authority.'
   },
   {
     icon: '⚡',
     title: 'Make your problem effective!',
     desc: 'There is no other social media platform dedicated to issues and problems!'
   },
   {
     icon: '⚡',
     title: 'Everyone can use!',
     desc: 'No matter who you are or from where you belong, ANY problem can be reported here'
   },
];

const faqs = [
  {
    q: 'Is RaizeIt free to use?',
    a: 'Yes!'
  },
  {
    q: 'Who built RaizeIt and how can i reach out support?',
    a: 'The founder of RaizeIt is Arush Sharma. I am the founder, developer, marketer, and everything else of RaizeIt. My e-mail id : raizeitai1@gmail.com'
  },
];
<div class="profile-menu">
    <div class="profile-icon" id="profileIcon" title="Account">👤</div>
    <div class="dropdown" id="dropdownMenu">
      <ul>
        <li><a href="products.html">Our Products</a></li>
        <li><a href="submit.html" id="menuSubmitLink">Submit a Tool</a></li>
        <li><a href="feed.html" id="menuSubmitLink">Feed/Tools</a></li>
        <li><a href="#" id="menuSignAction">Sign In</a></li>
      </ul>
    </div>
  </div>

const LandingPage = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = ['World', 'System', 'Government', 'Civic sense', 'life', 'Public'];
  const [openFaq, setOpenFaq] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [texts.length]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const textGradient = 'text-gradient';
  const buttonGradient = 'button-gradient';
  const glassEffectPrimary = 'glass-effect';

  return (
    <div className="bg-white flex flex-col items-center justify-between min-h-[calc(100vh-14rem)] text-white relative z-10 px-4 sm:px-6 py-8 bg-lumin-landing-bg">
      <div className="relative min-h-screen overflow-hidden">
        {/* Background layer */}
        <div className="lumin-landing-bg"></div>
        
        <div className="flex flex-col items-center justify-center flex-grow text-center max-w-4xl mx-auto relative z-20 fade-in-up">
          <h2 className="text-5xl sm:text-6xl font-bold mt-20 mb-5 leading-snug">
            <span className="text-white">Let's aim for a better </span>
            <span className="inline-block h-[70px] overflow-hidden align-middle text-gradient">
              <span key={texts[currentTextIndex]} className="text-gradient block text-rotating">
                {texts[currentTextIndex]}
              </span>
            </span>
          </h2>

          <p className="text-xl font-light sm:text-xl text-white mb-10 max-w-3xl mx-auto opacity-90 fade-in-up-delay-2">
            At RaizeIt, we aim to create a better world, users can report their problems here for free. We listen to you.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 fade-in-up-delay-3">
            <Link
              to='/app'
              className={`inline-block px-8 py-3 rounded-full text-lg font-regular text-white shadow-lg transition-all duration-300 ${buttonGradient}`}
            >
              Start Now- Raize your voice 
            </Link>
          </div>

          <section className="w-full max-w-4xl mx-auto mt-8">
            <h3 className="text-3xl font-bold text-center text-gradient">Just like Reddit, but AI powered for problems.</h3>
          </section>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow text-center max-w-4xl mx-auto relative z-20 mt-5">
          <h3 className="text-3xl font-bold text-center mb-2 text-gradient scroll-animate">No one listens to your problems ? We do!</h3>
        </div> 

        <div className="flex flex-col items-center justify-center flex-grow text-center max-w-4xl mx-auto relative z-20 mt-5 mb-100">
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-x-4 space-x-0 items-center">
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow text-center max-w-4xl mx-auto relative z-20 mt-5">
          <h3 className="text-3xl font-bold text-center mb-2 text-gradient scroll-animate">How it works?</h3>
        </div> 

        <section className="w-full max-w-6xl mx-auto mt-5 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
            {functionalities.map((f, index) => (
              <div 
                key={f.title} 
                className="glass-effect rounded-3xl p-6 flex flex-col items-center text-center scroll-animate" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        
        <div className="flex flex-col items-center justify-center flex-grow text-center max-w-4xl mx-auto relative z-20 mt-10">
          <h3 className="text-3xl font-bold text-center mb-2 text-gradient scroll-animate">"Benefits of using our platform"</h3>
        </div> 

        <section className="w-full max-w-6xl mx-auto mt-5 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
            {benefs.map((f, index) => (
              <div 
                key={f.title} 
                className="glass-effect rounded-3xl p-6 flex flex-col items-center text-center scroll-animate" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-3xl mx-auto mb-16">
          <div className="flex flex-col items-center justify-center flex-grow text-center max-w-4xl mx-auto relative z-20 mt-10">
            <h3 className="text-3xl font-bold text-center mb-2 text-gradient scroll-animate">Very frequently asked questions</h3>
          </div> 

          <div className="space-y-4 mt-8">
            {faqs.map((faq, idx) => (
              <div 
                key={faq.q} 
                className="glass-effect rounded-xl p-4 scroll-animate" 
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <button
                  className="w-full text-left flex justify-between items-center text-lg font-semibold focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <span className="ml-2">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="mt-2 text-gray-300 text-base animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                to="/blog"
                className={`inline-block px-8 py-3 rounded-full text-lg font-bold text-white shadow-lg transition-all duration-300 ${buttonGradient}`}
              >
                Blogs →
              </Link>
            </div>
          
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center justify-center flex-grow text-center max-w-4xl mx-auto relative z-20 fade-in-up">
                <footer className="w-full py-6 mt-10 border-t border-gray-700 flex flex-col items-center space-y-4">
                  <p className="text-gray-400 text-sm">© 2025 NexNotes AI. All rights reserved.</p>
                  
                  <div className="flex space-x-6 text-2xl">
                    <a href="https://x.com/@raize_our_voice" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                      <FaXTwitter />
                    </a>
                    <a href="https://www.youtube.com/@NexNotesAIStudyHelp" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
                      <FaYoutube />
                    </a>
                    <a href="https://instagram.com/raizeit_" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                      <FaInstagram />
                    </a>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;