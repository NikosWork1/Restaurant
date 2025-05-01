// Profile JavaScript for Restaurant Management System

document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const navButtons = document.querySelectorAll('.profile-nav-btn');
    const profileTabs = document.querySelectorAll('.profile-tab');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target tab
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            navButtons.forEach(btn => btn.classList.remove('active'));
            profileTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Personal Information Edit Toggle
    const editPersonalInfoBtn = document.getElementById('editPersonalInfoBtn');
    const personalInfoView = document.getElementById('personalInfoView');
    const personalInfoEdit = document.getElementById('personalInfoEdit');
    const cancelPersonalEditBtn = document.getElementById('cancelPersonalEditBtn');
    
    if (editPersonalInfoBtn) {
        editPersonalInfoBtn.addEventListener('click', function() {
            personalInfoView.style.display = 'none';
            personalInfoEdit.style.display = 'block';
        });
    }
    
    if (cancelPersonalEditBtn) {
        cancelPersonalEditBtn.addEventListener('click', function() {
            personalInfoEdit.style.display = 'none';
            personalInfoView.style.display = 'block';
        });
    }
    
    // Personal Info Form Submission
    const personalInfoForm = document.getElementById('personalInfoEdit');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const dob = document.getElementById('dob').value;
            
            // Validate form (simple validation)
            if (!fullName || !email || !phone || !dob) {
                showToast('Please fill in all required fields');
                return;
            }
            
            // In a real app, you would send this data to your server
            console.log('Personal info update:', { fullName, email, phone, dob });
            
            // Update the view with new values
            document.querySelector('.profile-avatar-info h3').textContent = fullName;
            document.querySelector('#personalInfoView .info-value:nth-child(2)').textContent = fullName;
            document.querySelector('#personalInfoView .info-value:nth-child(4)').textContent = email;
            document.querySelector('#personalInfoView .info-value:nth-child(6)').textContent = phone;
            
            // Format date for display
            const formattedDate = new Date(dob).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            document.querySelector('#personalInfoView .info-value:nth-child(8)').textContent = formattedDate;
            
            // Show success message
            showToast('Personal information updated successfully');
            
            // Switch back to view mode
            personalInfoEdit.style.display = 'none';
            personalInfoView.style.display = 'block';
        });
    }
    
    // Preferences Edit Toggle
    const editPreferencesBtn = document.getElementById('editPreferencesBtn');
    const preferencesView = document.getElementById('preferencesView');
    const preferencesEdit = document.getElementById('preferencesEdit');
    const cancelPreferencesBtn = document.getElementById('cancelPreferencesBtn');
    
    if (editPreferencesBtn) {
        editPreferencesBtn.addEventListener('click', function() {
            preferencesView.style.display = 'none';
            preferencesEdit.style.display = 'block';
        });
    }
    
    if (cancelPreferencesBtn) {
        cancelPreferencesBtn.addEventListener('click', function() {
            preferencesEdit.style.display = 'none';
            preferencesView.style.display = 'block';
        });
    }
    
    // Preferences Form Submission
    const preferencesForm = document.getElementById('preferencesEdit');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const dietaryPrefs = document.getElementById('dietaryPrefs').value;
            const cuisinePrefs = document.getElementById('cuisinePrefs').value;
            const allergies = document.getElementById('allergies').value;
            const seatingPref = document.getElementById('seatingPref').value;
            const emailNotif = document.getElementById('emailNotif').checked;
            const smsNotif = document.getElementById('smsNotif').checked;
            const marketingEmails = document.getElementById('marketingEmails').checked;
            
            // In a real app, you would send this data to your server
            console.log('Preferences update:', { 
                dietaryPrefs, 
                cuisinePrefs, 
                allergies, 
                seatingPref,
                emailNotif,
                smsNotif,
                marketingEmails
            });
            
            // Update the view with new values
            document.querySelector('#preferencesView .info-value:nth-child(2)').textContent = 
                dietaryPrefs || 'No specific preferences';
            document.querySelector('#preferencesView .info-value:nth-child(4)').textContent = 
                cuisinePrefs || 'Not specified';
            document.querySelector('#preferencesView .info-value:nth-child(6)').textContent = 
                allergies || 'None';
            document.querySelector('#preferencesView .info-value:nth-child(8)').textContent = 
                seatingPref || 'No preference';
            
            // Update communication preferences
            const commPrefs = document.querySelector('#preferencesView .info-value:nth-child(10)');
            commPrefs.innerHTML = `
                <div class="preference-item"><i class="fas ${emailNotif ? 'fa-check text-success' : 'fa-times text-danger'}"></i> Email notifications</div>
                <div class="preference-item"><i class="fas ${smsNotif ? 'fa-check text-success' : 'fa-times text-danger'}"></i> SMS notifications</div>
                <div class="preference-item"><i class="fas ${marketingEmails ? 'fa-check text-success' : 'fa-times text-danger'}"></i> Marketing emails</div>
            `;
            
            // Show success message
            showToast('Preferences updated successfully');
            
            // Switch back to view mode
            preferencesEdit.style.display = 'none';
            preferencesView.style.display = 'block';
        });
    }
    
    // Avatar Upload
    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Check if file is an image
                if (!file.type.startsWith('image/')) {
                    showToast('Please select an image file');
                    return;
                }
                
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast('Image size should be less than 5MB');
                    return;
                }
                
                // Create file reader to read the file
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    // Update avatar preview
                    const avatarImg = document.querySelector('.profile-avatar-large img');
                    avatarImg.src = event.target.result;
                    
                    // Update small avatar in user dropdown
                    const smallAvatar = document.querySelector('.user-avatar-small img');
                    if (smallAvatar) {
                        smallAvatar.src = event.target.result;
                    }
                    
                    // Update sidebar avatar
                    const sidebarAvatar = document.querySelector('.user-avatar img');
                    if (sidebarAvatar) {
                        sidebarAvatar.src = event.target.result;
                    }
                    
                    showToast('Profile picture updated successfully');
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Password Toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
    
    // Password Strength Meter
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthSegments = document.querySelectorAll('.strength-segment');
            const strengthText = document.querySelector('.strength-text');
            
            // Reset
            strengthSegments.forEach(segment => {
                segment.className = 'strength-segment';
            });
            
            // Check password strength
            let strength = 0;
            
            // Length check
            if (password.length > 0) strength += 1;
            if (password.length >= 8) strength += 1;
            
            // Character type checks
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            // Update strength meter
            for (let i = 0; i < strength && i < 4; i++) {
                if (strength === 1) {
                    strengthSegments[i].classList.add('weak');
                } else if (strength === 2) {
                    strengthSegments[i].classList.add('medium');
                } else if (strength === 3) {
                    strengthSegments[i].classList.add('strong');
                } else if (strength >= 4) {
                    strengthSegments[i].classList.add('very-strong');
                }
            }
            
            // Update strength text
            if (password === '') {
                strengthText.textContent = 'Password strength';
            } else if (strength === 1) {
                strengthText.textContent = 'Weak';
            } else if (strength === 2) {
                strengthText.textContent = 'Medium';
            } else if (strength === 3) {
                strengthText.textContent = 'Strong';
            } else if (strength >= 4) {
                strengthText.textContent = 'Very strong';
            }
        });
    }
    
    // Password Update Form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate
            if (!currentPassword) {
                showToast('Please enter your current password');
                return;
            }
            
            if (!newPassword) {
                showToast('Please enter a new password');
                return;
            }
            
            if (newPassword.length < 8) {
                showToast('Password must be at least 8 characters long');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showToast('Passwords do not match');
                return;
            }
            
            // In a real app, you would send this to your server
            console.log('Password update submitted');
            
            // Show success and reset form
            showToast('Password updated successfully');
            passwordForm.reset();
            
            // Reset strength meter
            const strengthSegments = document.querySelectorAll('.strength-segment');
            strengthSegments.forEach(segment => {
                segment.className = 'strength-segment';
            });
            document.querySelector('.strength-text').textContent = 'Password strength';
        });
    }
    
    // Security Toggles
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', function() {
            const enabled = this.checked;
            
            // In a real app, you would send this to your server
            console.log('2FA toggle:', enabled);
            
            // Show confirmation
            showToast(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
            
            // If enabled, you might show a setup modal here
            if (enabled) {
                // Show setup modal (in a real app)
            }
        });
    }
    
    const loginNotificationsToggle = document.getElementById('loginNotificationsToggle');
    if (loginNotificationsToggle) {
        loginNotificationsToggle.addEventListener('change', function() {
            const enabled = this.checked;
            
            // In a real app, you would send this to your server
            console.log('Login notifications toggle:', enabled);
            
            // Show confirmation
            showToast(`Login notifications ${enabled ? 'enabled' : 'disabled'}`);
        });
    }
    
    // View Activity Button
    const viewActivityButtons = document.querySelectorAll('.security-option-action .btn-outline');
    viewActivityButtons.forEach(button => {
        if (button.textContent.trim() === 'View Activity') {
            button.addEventListener('click', function() {
                openModal(document.getElementById('activityLogModal'));
            });
        }
    });
    
    // Add Payment Method
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    const addPaymentModal = document.getElementById('addPaymentModal');
    const cancelAddPayment = document.getElementById('cancelAddPayment');
    
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', function() {
            openModal(addPaymentModal);
        });
    }
    
    if (cancelAddPayment) {
        cancelAddPayment.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Add Payment Form
    const addPaymentForm = document.getElementById('addPaymentForm');
    if (addPaymentForm) {
        addPaymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardholderName = document.getElementById('cardholderName').value;
            const isDefault = document.getElementById('defaultPayment').checked;
            
            // Simple validation
            if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
                showToast('Please fill in all required fields');
                return;
            }
            
            // In a real app, you would send this data to your server
            console.log('Add payment method:', { cardNumber, expiryDate, cvv, cardholderName, isDefault });
            
            // Create a new payment method element
            const paymentMethodsList = document.querySelector('.payment-methods-list');
            
            // Determine card type based on first digit
            let cardType = 'visa';
            let cardIcon = 'fa-cc-visa';
            
            if (cardNumber.startsWith('4')) {
                cardType = 'visa';
                cardIcon = 'fa-cc-visa';
            } else if (cardNumber.startsWith('5')) {
                cardType = 'mastercard';
                cardIcon = 'fa-cc-mastercard';
            } else if (cardNumber.startsWith('3')) {
                cardType = 'amex';
                cardIcon = 'fa-cc-amex';
            } else if (cardNumber.startsWith('6')) {
                cardType = 'discover';
                cardIcon = 'fa-cc-discover';
            }
            
            // Get last 4 digits of card
            const last4 = cardNumber.slice(-4);
            
            // Create payment method markup
            const paymentMethodMarkup = `
                <div class="payment-method">
                    <div class="payment-method-icon ${cardType}">
                        <i class="fab ${cardIcon}"></i>
                    </div>
                    <div class="payment-method-details">
                        <div class="payment-method-name">${cardType.charAt(0).toUpperCase() + cardType.slice(1)} ending in ${last4}</div>
                        <div class="payment-method-expiry">Expires ${expiryDate}</div>
                    </div>
                    <div class="payment-method-actions">
                        ${isDefault ? '<span class="payment-method-default">Default</span>' : '<button class="btn btn-sm btn-outline make-default-btn">Make Default</button>'}
                        <div class="payment-actions">
                            <button class="btn-icon" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add new payment method to the list
            if (isDefault) {
                // If this is the default, update existing default
                const existingDefault = paymentMethodsList.querySelector('.payment-method-default');
                if (existingDefault) {
                    const parentActions = existingDefault.parentElement;
                    existingDefault.remove();
                    parentActions.insertAdjacentHTML('afterbegin', '<button class="btn btn-sm btn-outline make-default-btn">Make Default</button>');
                }
                
                // Add new payment method at the top
                paymentMethodsList.insertAdjacentHTML('afterbegin', paymentMethodMarkup);
            } else {
                // Add new payment method at the end
                paymentMethodsList.insertAdjacentHTML('beforeend', paymentMethodMarkup);
            }
            
            // Add event listeners to new buttons
            addPaymentButtonListeners();
            
            // Show success message
            showToast('Payment method added successfully');
            
            // Close modal and reset form
            closeModal();
            addPaymentForm.reset();
        });
    }
    
    // Add Address
    const addAddressBtn = document.getElementById('addAddressBtn');
    const addAddressModal = document.getElementById('addAddressModal');
    const cancelAddAddress = document.getElementById('cancelAddAddress');
    
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            openModal(addAddressModal);
        });
    }
    
    if (cancelAddAddress) {
        cancelAddAddress.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // Add Address Form
    const addAddressForm = document.getElementById('addAddressForm');
    if (addAddressForm) {
        addAddressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nickname = document.getElementById('addressNickname').value;
            const addressLine1 = document.getElementById('addressLine1').value;
            const addressLine2 = document.getElementById('addressLine2').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zipCode = document.getElementById('zipCode').value;
            const country = document.getElementById('country').value;
            const isDefault = document.getElementById('defaultAddress').checked;
            
            // Simple validation
            if (!nickname || !addressLine1 || !city || !state || !zipCode) {
                showToast('Please fill in all required fields');
                return;
            }
            
            // In a real app, you would send this data to your server
            console.log('Add address:', { 
                nickname, 
                addressLine1, 
                addressLine2, 
                city, 
                state, 
                zipCode, 
                country, 
                isDefault 
            });
            
            // Format address for display
            const formattedAddress = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}<br>${city}, ${state} ${zipCode}<br>${getCountryName(country)}`;
            
            // Create a new address element
            const addressesList = document.querySelector('.addresses-list');
            
            // Create address markup
            const addressMarkup = `
                <div class="address-item">
                    <div class="address-header">
                        <div class="address-title">${nickname}</div>
                        ${isDefault ? '<span class="address-badge default">Default</span>' : '<button class="btn btn-sm btn-outline make-default-btn">Make Default</button>'}
                    </div>
                    <div class="address-content">
                        <p>${formattedAddress}</p>
                    </div>
                    <div class="address-actions">
                        <button class="btn-icon" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add new address to the list
            if (isDefault) {
                // If this is the default, update existing default
                const existingDefault = addressesList.querySelector('.address-badge.default');
                if (existingDefault) {
                    const parentHeader = existingDefault.parentElement;
                    existingDefault.remove();
                    parentHeader.insertAdjacentHTML('beforeend', '<button class="btn btn-sm btn-outline make-default-btn">Make Default</button>');
                }
                
                // Add new address at the top
                addressesList.insertAdjacentHTML('afterbegin', addressMarkup);
            } else {
                // Add new address at the end
                addressesList.insertAdjacentHTML('beforeend', addressMarkup);
            }
            
            // Add event listeners to new buttons
            addAddressButtonListeners();
            
            // Show success message
            showToast('Address added successfully');
            
            // Close modal and reset form
            closeModal();
            addAddressForm.reset();
        });
    }
    
    // Helper function to get country name from code
    function getCountryName(countryCode) {
        const countries = {
            'US': 'United States',
            'CA': 'Canada',
            'UK': 'United Kingdom',
            'AU': 'Australia',
            'other': 'Other'
        };
        
        return countries[countryCode] || countryCode;
    }
    
    // Add event listeners to payment method buttons
    function addPaymentButtonListeners() {
        // Make default buttons
        document.querySelectorAll('.payment-method .make-default-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Get all payment methods
                const paymentMethods = document.querySelectorAll('.payment-method');
                
                // Remove default from current default
                paymentMethods.forEach(pm => {
                    const defaultBadge = pm.querySelector('.payment-method-default');
                    if (defaultBadge) {
                        const parentActions = defaultBadge.parentElement;
                        defaultBadge.remove();
                        parentActions.insertAdjacentHTML('afterbegin', '<button class="btn btn-sm btn-outline make-default-btn">Make Default</button>');
                        
                        // Add listener to new button
                        const newButton = parentActions.querySelector('.make-default-btn');
                        newButton.addEventListener('click', function() {
                            makeDefaultPayment(this);
                        });
                    }
                });
                
                // Make this payment method default
                const actionsDiv = this.parentElement;
                this.remove();
                actionsDiv.insertAdjacentHTML('afterbegin', '<span class="payment-method-default">Default</span>');
                
                // Show success message
                showToast('Default payment method updated');
            });
        });
        
        // Edit buttons
        document.querySelectorAll('.payment-method .btn-icon[title="Edit"]').forEach(button => {
            button.addEventListener('click', function() {
                // In a real app, this would open an edit modal with pre-filled data
                alert('Edit payment method functionality would go here');
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.payment-method .btn-icon[title="Delete"]').forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this payment method?')) {
                    const paymentMethod = this.closest('.payment-method');
                    
                    // Check if this is the default payment method
                    const isDefault = paymentMethod.querySelector('.payment-method-default');
                    
                    // Remove the payment method
                    paymentMethod.remove();
                    
                    // If this was the default and there are other payment methods, make the first one default
                    if (isDefault) {
                        const remainingMethods = document.querySelectorAll('.payment-method');
                        if (remainingMethods.length > 0) {
                            const firstMethod = remainingMethods[0];
                            const makeDefaultBtn = firstMethod.querySelector('.make-default-btn');
                            
                            if (makeDefaultBtn) {
                                const actionsDiv = makeDefaultBtn.parentElement;
                                makeDefaultBtn.remove();
                                actionsDiv.insertAdjacentHTML('afterbegin', '<span class="payment-method-default">Default</span>');
                            }
                        }
                    }
                    
                    // Show success message
                    showToast('Payment method deleted successfully');
                }
            });
        });
    }
    
    // Add event listeners to address buttons
    function addAddressButtonListeners() {
        // Make default buttons
        document.querySelectorAll('.address-item .make-default-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Get all addresses
                const addresses = document.querySelectorAll('.address-item');
                
                // Remove default from current default
                addresses.forEach(addr => {
                    const defaultBadge = addr.querySelector('.address-badge.default');
                    if (defaultBadge) {
                        const parentHeader = defaultBadge.parentElement;
                        defaultBadge.remove();
                        parentHeader.insertAdjacentHTML('beforeend', '<button class="btn btn-sm btn-outline make-default-btn">Make Default</button>');
                        
                        // Add listener to new button
                        const newButton = parentHeader.querySelector('.make-default-btn');
                        newButton.addEventListener('click', function() {
                            makeDefaultAddress(this);
                        });
                    }
                });
                
                // Make this address default
                const headerDiv = this.parentElement;
                this.remove();
                headerDiv.insertAdjacentHTML('beforeend', '<span class="address-badge default">Default</span>');
                
                // Show success message
                showToast('Default address updated');
            });
        });
        
        // Edit buttons
        document.querySelectorAll('.address-item .btn-icon[title="Edit"]').forEach(button => {
            button.addEventListener('click', function() {
                // In a real app, this would open an edit modal with pre-filled data
                alert('Edit address functionality would go here');
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.address-item .btn-icon[title="Delete"]').forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this address?')) {
                    const address = this.closest('.address-item');
                    
                    // Check if this is the default address
                    const isDefault = address.querySelector('.address-badge.default');
                    
                    // Remove the address
                    address.remove();
                    
                    // If this was the default and there are other addresses, make the first one default
                    if (isDefault) {
                        const remainingAddresses = document.querySelectorAll('.address-item');
                        if (remainingAddresses.length > 0) {
                            const firstAddress = remainingAddresses[0];
                            const makeDefaultBtn = firstAddress.querySelector('.make-default-btn');
                            
                            if (makeDefaultBtn) {
                                const headerDiv = makeDefaultBtn.parentElement;
                                makeDefaultBtn.remove();
                                headerDiv.insertAdjacentHTML('beforeend', '<span class="address-badge default">Default</span>');
                            }
                        }
                    }
                    
                    // Show success message
                    showToast('Address deleted successfully');
                }
            });
        });
    }
    
    // Initialize event listeners for existing elements
    addPaymentButtonListeners();
    addAddressButtonListeners();
    
    // Modal functions
    function openModal(modal) {
        modal.classList.add('active');
        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking overlay
    document.getElementById('modalOverlay').addEventListener('click', closeModal);
    
    // Prevent modal from closing when clicking inside it
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Toast notification function
    function showToast(message) {
        // Check if toast container exists
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            // Create container if it doesn't exist
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Add toast styles dynamically if not already added
    if (!document.querySelector('#toastStyles')) {
        const toastStyles = document.createElement('style');
        toastStyles.id = 'toastStyles';
        toastStyles.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1050;
            }
            
            .toast {
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                margin-top: 10px;
                transform: translateX(100%);
                opacity: 0;
                transition: transform 0.3s, opacity 0.3s;
            }
            
            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            body.dark-mode .toast {
                background-color: rgba(255, 255, 255, 0.15);
            }
        `;
        document.head.appendChild(toastStyles);
    }
});