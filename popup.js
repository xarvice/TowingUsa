// Emergency Popup functionality
class EmergencyPopup {
    constructor() {
        this.popup = null;
        this.closeBtn = null;
        this.timer = null;
        this.timeLeft = 30; // 30 seconds countdown
        this.hasUserCalled = false;
        this.isVisible = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.init();
    }

    init() {
        // Create popup HTML
        const popupHTML = `
            <div class="popup-overlay" id="emergencyPopup">
                <div class="popup-container">
                    <button class="popup-close" id="popupClose" aria-label="Close popup">×</button>
                    <img src="https://action-towing.com/wp-content/uploads/2023/05/logo.png" alt="Action Towing" class="popup-logo">
                    <div class="popup-content">
                        <strong>🚨 EMERGENCY TOWING SERVICE 🚨</strong>
                    </div>
                    <div class="popup-content">
                        During these times, we are maintaining every necessary precaution to ensure the safety of our staff and our clientele.
                    </div>
                    <div class="popup-urgency">
                        Need immediate assistance? Don't wait!
                    </div>
                    <div class="popup-timer" id="popupTimer" aria-live="polite">
                        Limited time offer: <span>30</span> seconds
                    </div>
                    <a href="tel:720-737-9118" class="popup-phone" id="popupPhone">
                        <i class="fas fa-phone-alt" aria-hidden="true"></i> 720-737-9118
                    </a>
                    <div class="popup-content">
                        <small>* Professional service available 24/7</small>
                    </div>
                </div>
            </div>
        `;

        // Add popup to body
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        // Get elements
        this.popup = document.getElementById('emergencyPopup');
        this.closeBtn = document.getElementById('popupClose');
        this.timerElement = document.querySelector('#popupTimer span');
        this.phoneBtn = document.getElementById('popupPhone');
        this.container = this.popup.querySelector('.popup-container');

        // Add event listeners
        this.setupEventListeners();

        // Show popup after 2 seconds
        setTimeout(() => this.showPopup(), 2000);

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

        // Handle mobile orientation changes
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
    }

    setupEventListeners() {
        // Close button click
        this.closeBtn.addEventListener('click', () => this.closePopup());

        // Phone button click
        this.phoneBtn.addEventListener('click', () => this.handlePhoneClick());

        // Touch events for mobile swipe
        this.popup.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.popup.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.popup.addEventListener('touchend', () => this.handleTouchEnd());

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.closePopup();
            }
        });

        // Click outside to close
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.closePopup();
            }
        });

        // Prevent scroll on popup when touch moving
        this.container.addEventListener('touchmove', (e) => {
            if (this.container.scrollHeight <= this.container.clientHeight) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        this.touchEndY = e.touches[0].clientY;
        const deltaY = this.touchEndY - this.touchStartY;

        // If swiping down and scroll at top, or swiping up and scroll at bottom
        if ((deltaY > 0 && this.container.scrollTop === 0) ||
            (deltaY < 0 && this.container.scrollHeight - this.container.scrollTop === this.container.clientHeight)) {
            e.preventDefault();
        }
    }

    handleTouchEnd() {
        const deltaY = this.touchEndY - this.touchStartY;
        if (deltaY > 100 && this.container.scrollTop === 0) {
            // Swipe down to close
            this.closePopup();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseCountdown();
        } else {
            this.resumeCountdown();
        }
    }

    handleOrientationChange() {
        // Reset container scroll position
        if (this.container) {
            this.container.scrollTop = 0;
        }
    }

    showPopup() {
        if (!this.hasUserCalled) {
            this.isVisible = true;
            this.popup.classList.add('active');
            this.startCountdown();
            
            // Prevent background scrolling on mobile
            document.body.style.overflow = 'hidden';
            
            // Announce for screen readers
            this.announceForScreenReaders('Emergency towing service popup is now visible');
        }
    }

    closePopup() {
        this.isVisible = false;
        this.popup.classList.remove('active');
        clearInterval(this.timer);
        
        // Restore background scrolling
        document.body.style.overflow = '';
        
        // Show popup again after 3 minutes if not called
        if (!this.hasUserCalled) {
            setTimeout(() => {
                this.timeLeft = 30;
                this.showPopup();
            }, 180000);
        }
    }

    startCountdown() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timeLeft = 30;
                // Restart countdown
                setTimeout(() => {
                    if (!this.hasUserCalled) {
                        this.startCountdown();
                    }
                }, 1000);
            }
        }, 1000);
    }

    pauseCountdown() {
        clearInterval(this.timer);
    }

    resumeCountdown() {
        if (this.isVisible && !this.hasUserCalled) {
            this.startCountdown();
        }
    }

    handlePhoneClick() {
        this.hasUserCalled = true;
        
        // Track the call attempt
        this.trackCallAttempt();
        
        // Close popup after call is initiated
        setTimeout(() => this.closePopup(), 1000);
    }

    trackCallAttempt() {
        // You can implement analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'emergency_call', {
                'event_category': 'Emergency',
                'event_label': 'Emergency Call Button Clicked'
            });
        }
    }

    announceForScreenReaders(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('class', 'sr-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
}

// Initialize popup when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new EmergencyPopup());
} else {
    new EmergencyPopup();
} 