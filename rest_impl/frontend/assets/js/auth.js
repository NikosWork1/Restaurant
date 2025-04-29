// Authentication JavaScript for Restaurant Management System

document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Role selection functionality
        const roleButtons = document.querySelectorAll('.role-btn');
        let selectedRole = 'customer'; // Default role
        
        roleButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                roleButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Set selected role
                selectedRole = this.getAttribute('data-role');
            });
        });
        
        // Set default active role
        document.querySelector(`.role-btn[data-role="customer"]`).classList.add('active');
        
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            
            try {
                // Call API service to login
                const data = await ApiService.login(email, password);
                
                // Check if user role matches selected role
                const user = ApiService.getCurrentUser();
                if (user.role !== selectedRole) {
                    showError(`You don't have ${selectedRole} privileges. Please select the correct role.`);
                    
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    return;
                }
                
                // Redirect based on role
                redirectBasedOnRole(selectedRole);
                
            } catch (error) {
                // Show error message
                showError(error.message || 'Login failed. Please check your credentials.');
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
    
    // Handle registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const phone = document.getElementById('phone').value;
            
            // Simple validation
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            
            try {
                // Prepare user data
                const userData = {
                    name,
                    email,
                    password,
                    phone
                };
                
                // Call API service to register
                const data = await ApiService.register(userData);
                
                // Show success message
                showToast('Registration successful! Redirecting to dashboard...');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = '../customer/dashboard.html';
                }, 1500);
                
            } catch (error) {
                // Show error message
                showError(error.message || 'Registration failed. Please try again.');
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
    
    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle icon
            this.innerHTML = type === 'password' 
                ? '<i class="fas fa-eye"></i>' 
                : '<i class="fas fa-eye-slash"></i>';
        });
    });
    
    // Handle logout links
    const logoutLinks = document.querySelectorAll('a[href*="logout"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            ApiService.logout();
        });
    });
    
    // Check if user is already logged in
    if (ApiService.isAuthenticated()) {
        // If on login or register page, redirect to dashboard
        if (window.location.pathname.includes('/auth/login.html') || 
            window.location.pathname.includes('/auth/register.html')) {
            
            const user = ApiService.getCurrentUser();
            if (user) {
                redirectBasedOnRole(user.role);
            }
        }
    }
});

// Helper function to show error message
function showError(message) {
    // Check if error element already exists
    let errorElement = document.querySelector('.auth-error');
    
    if (!errorElement) {
        // Create error element if it doesn't exist
        errorElement = document.createElement('div');
        errorElement.className = 'auth-error';
        
        // Insert after form header
        const authHeader = document.querySelector('.auth-header');
        authHeader.insertAdjacentElement('afterend', errorElement);
    }
    
    // Set error message and make visible
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

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
        
        .auth-error {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px 15px;
            border-radius: 5px;
            margin: 0 30px;
            margin-bottom: 20px;
            display: none;
        }
    `;
    document.head.appendChild(toastStyles);
}

// Function to redirect based on user role
function redirectBasedOnRole(role) {
    switch (role) {
        case 'customer':
            window.location.href = '../customer/dashboard.html';
            break;
        case 'staff':
            window.location.href = '../staff/dashboard.html';
            break;
        case 'admin':
            window.location.href = '../admin/dashboard.html';
            break;
        default:
            window.location.href = '../customer/dashboard.html';
    }
}