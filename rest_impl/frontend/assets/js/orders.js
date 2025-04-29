// Orders JavaScript for Restaurant Management System

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const orderFilterButtons = document.querySelectorAll('.order-filter-btn');
    const sortBtn = document.querySelector('.sort-btn');
    const sortMenu = document.querySelector('.sort-menu');
    const sortOptions = document.querySelectorAll('.sort-option');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyDateFilterBtn = document.getElementById('applyDateFilter');
    const detailButtons = document.querySelectorAll('.btn-icon[title="View Details"]');
    const reviewButtons = document.querySelectorAll('.btn-icon[title="Leave Review"]');
    const reorderButtons = document.querySelectorAll('.btn-icon[title="Reorder"]');
    const cancelButtons = document.querySelectorAll('.btn-icon[title="Cancel Order"]');
    const trackButtons = document.querySelectorAll('.btn-icon[title="Track Order"]');
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const reviewModal = document.getElementById('reviewModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const modalOverlay = document.getElementById('modalOverlay');
    const starRatingItems = document.querySelectorAll('.star-rating i');
    const ratingValueInput = document.getElementById('ratingValue');
    const reviewForm = document.getElementById('reviewForm');
    const cancelReviewBtn = document.getElementById('cancelReviewBtn');
    const paginationButtons = document.querySelectorAll('.page-btn');
    
    // Filter orders by status
    orderFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            orderFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterOrders(filter);
        });
    });
    
    // Filter orders function
    function filterOrders(filter) {
        const rows = document.querySelectorAll('.data-table tbody tr');
        
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
            } else if (filter === 'active' && row.classList.contains('active-row')) {
                row.style.display = '';
            } else if (filter === 'completed' && row.classList.contains('completed-row')) {
                row.style.display = '';
            } else if (filter === 'cancelled' && row.classList.contains('cancelled-row')) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Sort dropdown
    if (sortBtn) {
        sortBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            sortMenu.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        if (sortMenu) {
            sortMenu.classList.remove('active');
        }
    });
    
    // Sort options
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            sortOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get sort value
            const sortValue = this.getAttribute('data-sort');
            
            // Sort orders
            sortOrders(sortValue);
            
            // Close sort menu
            sortMenu.classList.remove('active');
        });
    });
    
    // Sort orders function
    function sortOrders(sortBy) {
        const table = document.querySelector('.data-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Sort rows based on criteria
        rows.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    const dateA = new Date(a.cells[1].textContent.split('<br>')[0]);
                    const dateB = new Date(b.cells[1].textContent.split('<br>')[0]);
                    return dateB - dateA;
                
                case 'date-asc':
                    const dateAsc = new Date(a.cells[1].textContent.split('<br>')[0]);
                    const dateBsc = new Date(b.cells[1].textContent.split('<br>')[0]);
                    return dateAsc - dateBsc;
                
                case 'amount-high':
                    const amountA = parseFloat(a.cells[4].textContent.replace('$', ''));
                    const amountB = parseFloat(b.cells[4].textContent.replace('$', ''));
                    return amountB - amountA;
                
                case 'amount-low':
                    const amountAl = parseFloat(a.cells[4].textContent.replace('$', ''));
                    const amountBl = parseFloat(b.cells[4].textContent.replace('$', ''));
                    return amountAl - amountBl;
                
                default:
                    return 0;
            }
        });
        
        // Reappend rows in new order
        rows.forEach(row => {
            tbody.appendChild(row);
        });
    }
    
    // Date filter
    if (applyDateFilterBtn) {
        applyDateFilterBtn.addEventListener('click', function() {
            const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
            const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
            
            filterByDate(startDate, endDate);
        });
    }
    
    // Filter by date function
    function filterByDate(startDate, endDate) {
        const rows = document.querySelectorAll('.data-table tbody tr');
        
        if (!startDate && !endDate) {
            rows.forEach(row => {
                row.style.display = '';
            });
            return;
        }
        
        rows.forEach(row => {
            const dateCell = row.cells[1].textContent.split('<br>')[0];
            const orderDate = new Date(dateCell);
            
            let showRow = true;
            
            if (startDate && orderDate < startDate) {
                showRow = false;
            }
            
            if (endDate && orderDate > endDate) {
                showRow = false;
            }
            
            row.style.display = showRow ? '' : 'none';
        });
    }
    
    // View order details
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            const orderDate = row.cells[1].textContent;
            const orderItems = row.cells[2].textContent;
            const orderType = row.cells[3].textContent;
            const orderAmount = row.cells[4].textContent;
            const orderStatus = row.cells[5].querySelector('.status-badge').textContent;
            
            // Populate and show modal
            showOrderDetails(orderId, orderDate, orderItems, orderType, orderAmount, orderStatus);
        });
    });
    
    // Show order details function
    function showOrderDetails(id, date, items, type, amount, status) {
        const modalContent = orderDetailsModal.querySelector('.order-details-content');
        
        // Generate modal content
        modalContent.innerHTML = `
            <div class="order-detail-header">
                <h3>${id}</h3>
                <span class="status-badge ${status.toLowerCase()}">${status}</span>
            </div>
            
            <div class="order-detail-info">
                <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value">${date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Type:</span>
                    <span class="detail-value">${type}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">${amount}</span>
                </div>
            </div>
            
            <div class="order-detail-items">
                <h4>Items Ordered</h4>
                <ul>
                    ${items.split(',').map(item => `<li>${item.trim()}</li>`).join('')}
                </ul>
            </div>
            
            <div class="order-detail-actions">
                <button class="btn btn-outline">
                    <i class="fas fa-print"></i> Print Receipt
                </button>
                <button class="btn btn-primary">
                    <i class="fas fa-redo"></i> Reorder
                </button>
            </div>
        `;
        
        // Show modal
        openModal(orderDetailsModal);
    }
    
    // Leave review
    reviewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset form
            reviewForm.reset();
            resetStarRating();
            
            // Show modal
            openModal(reviewModal);
        });
    });
    
    // Star rating functionality
    starRatingItems.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            setRating(rating);
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = parseInt(ratingValueInput.value) || 0;
            highlightStars(currentRating);
        });
    });
    
    // Set rating function
    function setRating(rating) {
        ratingValueInput.value = rating;
        highlightStars(rating);
    }
    
    // Highlight stars function
    function highlightStars(rating) {
        starRatingItems.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }
    
    // Reset star rating
    function resetStarRating() {
        ratingValueInput.value = '';
        starRatingItems.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
    }
    
    // Review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const rating = ratingValueInput.value;
            const title = document.getElementById('reviewTitle').value;
            const review = document.getElementById('reviewText').value;
            
            if (!rating) {
                showToast('Please select a rating');
                return;
            }
            
            if (!title) {
                showToast('Please enter a review title');
                return;
            }
            
            if (!review) {
                showToast('Please enter your review');
                return;
            }
            
            // Submit review (in a real app, this would go to the server)
            console.log('Review submitted:', { rating, title, review });
            
            // Show success message
            showToast('Thank you for your review!');
            
            // Close modal
            closeModal();
        });
    }
    
    // Reorder functionality
    reorderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            
            // In a real app, we would send this to the server
            // For demo, just show a toast
            showToast(`Reordering items from ${orderId}`);
        });
    });
    
    // Cancel order
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            
            if (confirm(`Are you sure you want to cancel ${orderId}?`)) {
                // In a real app, we would send this to the server
                // For demo, just update the UI
                const statusCell = row.cells[5];
                statusCell.innerHTML = '<span class="status-badge cancelled">Cancelled</span>';
                
                // Update row class
                row.classList.remove('active-row');
                row.classList.add('cancelled-row');
                
                // Update buttons
                const actionsCell = row.cells[6];
                actionsCell.innerHTML = `
                    <div class="table-actions">
                        <button class="btn-icon" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" title="Reorder">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                `;
                
                // Add event listeners to new buttons
                const newDetailBtn = actionsCell.querySelector('.btn-icon[title="View Details"]');
                const newReorderBtn = actionsCell.querySelector('.btn-icon[title="Reorder"]');
                
                newDetailBtn.addEventListener('click', function() {
                    const r = this.closest('tr');
                    const oId = r.cells[0].textContent;
                    const oDate = r.cells[1].textContent;
                    const oItems = r.cells[2].textContent;
                    const oType = r.cells[3].textContent;
                    const oAmount = r.cells[4].textContent;
                    const oStatus = r.cells[5].querySelector('.status-badge').textContent;
                    
                    showOrderDetails(oId, oDate, oItems, oType, oAmount, oStatus);
                });
                
                newReorderBtn.addEventListener('click', function() {
                    const r = this.closest('tr');
                    const oId = r.cells[0].textContent;
                    showToast(`Reordering items from ${oId}`);
                });
                
                showToast(`Order ${orderId} has been cancelled`);
            }
        });
    });
    
    // Track order
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.cells[0].textContent;
            
            // In a real app, we would open a tracking view
            // For demo, just show a toast
            showToast(`Tracking order ${orderId}`);
        });
    });
    
    // Modal functions
    function openModal(modal) {
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close modal buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Cancel review button
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Prevent modal from closing when clicking inside it
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Pagination functionality
    paginationButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                
                // If it's a number button, make it active
                if (!this.querySelector('i')) {
                    this.classList.add('active');
                }
                
                // In a real app, we would load the corresponding page
                // For demo, just show a toast
                const page = this.textContent.trim();
                if (page) {
                    showToast(`Loading page ${page}`);
                } else if (this.querySelector('.fa-chevron-left')) {
                    showToast('Loading previous page');
                } else if (this.querySelector('.fa-chevron-right')) {
                    showToast('Loading next page');
                }
            });
        }
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