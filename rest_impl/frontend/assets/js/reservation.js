// Reservation JavaScript for Restaurant Management System

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newReservationBtn = document.getElementById('newReservationBtn');
    const reservationModal = document.getElementById('reservationModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelReservationBtn = document.getElementById('cancelReservationBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const reservationForm = document.getElementById('reservationForm');
    const resFilterButtons = document.querySelectorAll('.res-filter-btn');
    const dateFilter = document.getElementById('dateFilter');
    const tableElements = document.querySelectorAll('.table');
    const selectedTableInput = document.getElementById('resTable');
    const layoutDateSelector = document.getElementById('layoutDateSelector');
    const layoutTimeSelector = document.getElementById('layoutTimeSelector');
    
    // Set minimum date to today for reservation datepicker
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('resDate').min = formattedDate;
    
    // Set default date for date filter to today
    if (dateFilter) {
        dateFilter.value = formattedDate;
    }
    
    // Filter reservations by status
    resFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            resFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterReservations(filter);
        });
    });
    
    // Filter reservations function
    function filterReservations(filter) {
        const rows = document.querySelectorAll('.data-table tbody tr');
        
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
            } else if (filter === 'upcoming' && row.classList.contains('upcoming-row')) {
                row.style.display = '';
            } else if (filter === 'past' && row.classList.contains('past-row')) {
                row.style.display = '';
            } else if (filter === 'cancelled' && row.classList.contains('cancelled-row')) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Filter by date
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            const selectedDate = this.value;
            filterByDate(selectedDate);
        });
    }
    
    // Filter by date function
    function filterByDate(date) {
        const rows = document.querySelectorAll('.data-table tbody tr');
        
        if (!date) {
            rows.forEach(row => {
                row.style.display = '';
            });
            return;
        }
        
        // Format selected date
        const selectedDate = new Date(date);
        const selectedDateStr = selectedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        rows.forEach(row => {
            const rowDate = row.querySelector('td:nth-child(2)').textContent.trim();
            
            // Compare dates - simplified comparison
            if (rowDate.includes(selectedDateStr)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Table selection in floor plan
    tableElements.forEach(table => {
        table.addEventListener('click', function() {
            // Don't allow selecting occupied tables
            if (this.classList.contains('occupied')) {
                return;
            }
            
            // Check if table is already selected
            const isSelected = this.classList.contains('selected');
            
            // Remove selected class from all tables
            tableElements.forEach(t => t.classList.remove('selected'));
            
            // If table wasn't already selected, select it
            if (!isSelected) {
                this.classList.add('selected');
                // Update the form input with selected table
                const tableNumber = this.getAttribute('data-table');
                selectedTableInput.value = tableNumber;
            } else {
                // If it was already selected, deselect it
                selectedTableInput.value = '';
            }
        });
    });
    
    // Layout date and time selectors
    if (layoutDateSelector) {
        layoutDateSelector.addEventListener('change', updateFloorPlan);
    }
    
    if (layoutTimeSelector) {
        layoutTimeSelector.addEventListener('change', updateFloorPlan);
    }
    
    // Update floor plan based on selected date and time
    function updateFloorPlan() {
        const selectedDate = layoutDateSelector.value;
        const selectedTime = layoutTimeSelector.value;
        
        // For demo purposes, we'll just show a loading effect and randomly change some tables
        showToast(`Updating floor plan for ${selectedDate} at ${selectedTime}...`);
        
        // Simulate loading
        tableElements.forEach(table => {
            table.style.opacity = '0.5';
        });
        
        // Simulate server response with random changes
        setTimeout(() => {
            tableElements.forEach(table => {
                table.style.opacity = '1';
                
                // Reset classes first
                table.classList.remove('available', 'reserved', 'occupied', 'selected');
                
                // Randomly assign status for demo
                const random = Math.random();
                if (random < 0.6) {
                    table.classList.add('available');
                } else if (random < 0.8) {
                    table.classList.add('reserved');
                } else {
                    table.classList.add('occupied');
                }
            });
            
            // Clear selected table in form
            selectedTableInput.value = '';
            
            showToast('Floor plan updated!');
        }, 1000);
    }
    
    // Modal functions
    function openModal() {
        reservationModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        reservationModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form
        reservationForm.reset();
        selectedTableInput.value = '';
        // Deselect all tables
        tableElements.forEach(table => table.classList.remove('selected'));
    }
    
    // Open modal
    if (newReservationBtn) {
        newReservationBtn.addEventListener('click', openModal);
    }
    
    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelReservationBtn) {
        cancelReservationBtn.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Prevent modal from closing when clicking inside it
    if (reservationModal) {
        reservationModal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Form submission
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const reservationData = {};
            
            for (let [key, value] of formData.entries()) {
                reservationData[key] = value;
            }
            
            // In a real app, you would send this to your server
            console.log('Reservation submitted:', reservationData);
            
            // Show success message
            showToast('Reservation submitted successfully!');
            
            // Close modal
            closeModal();
            
            // In a real application, you might refresh the reservations list here
            // or add the new reservation to the table
            
            // For demo, we'll add a new row to the table
            addNewReservation(reservationData);
        });
    }
    
    // Add new reservation to table (for demo)
    function addNewReservation(data) {
        const tbody = document.querySelector('.reservations-list tbody');
        
        if (!tbody) return;
        
        // Create a new row
        const tr = document.createElement('tr');
        tr.className = 'upcoming-row';
        
        // Generate a random ID
        const id = '#RES-' + Math.floor(Math.random() * 9000000) + 1000000;
        
        // Format date
        const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create row HTML
        tr.innerHTML = `
            <td>${id}</td>
            <td>${formattedDate}</td>
            <td>${data.time}</td>
            <td>${data.guests}</td>
            <td>${data.table || 'Not assigned'}</td>
            <td>${data.requests || 'None'}</td>
            <td><span class="status-badge pending">Pending</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Cancel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        `;
        
        // Prepend to table (add at the top)
        tbody.insertBefore(tr, tbody.firstChild);
        
        // Scroll to the new row
        tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight the new row
        tr.style.backgroundColor = 'rgba(78, 115, 223, 0.1)';
        setTimeout(() => {
            tr.style.backgroundColor = '';
            tr.style.transition = 'background-color 1s ease';
        }, 2000);
        
        // Add event listeners to the new row's buttons
        addRowButtonListeners(tr);
    }
    
    // Add event listeners to table action buttons
    function addRowButtonListeners(row) {
        const buttons = row.querySelectorAll('.btn-icon');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const action = this.getAttribute('title');
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
                        if (confirm(`Are you sure you want to cancel reservation ${id}?`)) {
                            // In a real app, you would send a request to the server
                            // For demo, we'll just update the status and move to cancelled section
                            const statusCell = row.querySelector('td:nth-child(7)');
                            statusCell.innerHTML = '<span class="status-badge cancelled">Cancelled</span>';
                            row.classList.remove('upcoming-row');
                            row.classList.add('cancelled-row');
                            
                            // Update action buttons
                            const actionsCell = row.querySelector('td:last-child');
                            actionsCell.innerHTML = `
                                <div class="table-actions">
                                    <button class="btn-icon" title="View Details">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" title="Book Again">
                                        <i class="fas fa-redo"></i>
                                    </button>
                                </div>
                            `;
                            
                            // Re-add event listeners to new buttons
                            addRowButtonListeners(row);
                            
                            showToast('Reservation cancelled');
                        }
                        break;
                    case 'Book Again':
                        // In a real app, you might pre-fill the reservation form
                        // For demo, we'll just open the modal
                        openModal();
                        break;
                    default:
                        break;
                }
            });
        });
    }
    
    // Add listeners to existing table rows
    const existingRows = document.querySelectorAll('.reservations-list tbody tr');
    existingRows.forEach(row => {
        addRowButtonListeners(row);
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