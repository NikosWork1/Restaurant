// Dashboard JavaScript for Restaurant Management System

document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
            
            // Save user preference to localStorage
            if (document.body.classList.contains('sidebar-collapsed')) {
                localStorage.setItem('sidebar-collapsed', 'true');
            } else {
                localStorage.setItem('sidebar-collapsed', 'false');
            }
        });
    }
    
    // Check user preference from localStorage
    if (localStorage.getItem('sidebar-collapsed') === 'true') {
        document.body.classList.add('sidebar-collapsed');
    }
    
    // Mobile sidebar toggle
    const handleResize = () => {
        if (window.innerWidth < 768) {
            document.body.classList.add('sidebar-collapsed');
            
            // Add mobile-specific event handling
            document.addEventListener('click', function(event) {
                const sidebar = document.querySelector('.sidebar');
                const sidebarToggle = document.getElementById('sidebarToggle');
                
                // Close sidebar when clicking outside on mobile
                if (!sidebar.contains(event.target) && event.target !== sidebarToggle) {
                    sidebar.classList.remove('visible');
                }
            });
            
            // Change sidebar toggle behavior on mobile
            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', function(event) {
                    event.stopPropagation();
                    const sidebar = document.querySelector('.sidebar');
                    sidebar.classList.toggle('visible');
                });
            }
        }
    };
    
    // Run on page load
    handleResize();
    
    // Run when window is resized
    window.addEventListener('resize', handleResize);
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Change icon
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('dark-mode', 'true');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('dark-mode', 'false');
            }
        });
    }
    
    // Check theme preference from localStorage
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    // Handle notification dropdown
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function(event) {
            event.stopPropagation();
            const dropdown = this.querySelector('.notification-dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close when clicking elsewhere
        document.addEventListener('click', function() {
            const dropdown = document.querySelector('.notification-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Handle user dropdown
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.addEventListener('click', function(event) {
            event.stopPropagation();
            const dropdown = this.querySelector('.user-dropdown-menu');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close when clicking elsewhere
        document.addEventListener('click', function() {
            const dropdown = document.querySelector('.user-dropdown-menu');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Table action buttons (if they exist)
    const actionButtons = document.querySelectorAll('.btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const action = this.getAttribute('title');
            const row = this.closest('tr');
            const id = row.querySelector('td:first-child').textContent;
            
            // Handle different actions
            switch(action) {
                case 'View Details':
                    alert(`Viewing details for ${id}`);
                    break;
                case 'Edit':
                    alert(`Editing ${id}`);
                    break;
                case 'Cancel':
                    if (confirm(`Are you sure you want to cancel ${id}?`)) {
                        alert(`Cancelled ${id}`);
                    }
                    break;
                case 'Reorder':
                    alert(`Reordering items from ${id}`);
                    break;
                default:
                    break;
            }
        });
    });
    
    // Add animation to stats cards (if they exist)
    const statsCards = document.querySelectorAll('.stat-card');
    statsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});