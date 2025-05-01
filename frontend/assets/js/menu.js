// Menu JavaScript for Restaurant Management System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart data
    let cart = [];
    
    // DOM Elements
    const menuGrid = document.getElementById('menuGrid');
    const noResults = document.getElementById('noResults');
    const menuSearch = document.getElementById('menuSearch');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const filterBtn = document.querySelector('.filter-btn');
    const filterMenu = document.querySelector('.filter-menu');
    const sortBtn = document.querySelector('.sort-btn');
    const sortMenu = document.querySelector('.sort-menu');
    const sortOptions = document.querySelectorAll('.sort-option');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const clearAllFiltersBtn = document.getElementById('clearAllFilters');
    const cartIcon = document.querySelector('.cart-icon');
    const cartBadge = document.getElementById('cartCount');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');
    const cartFooter = document.getElementById('cartFooter');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const overlay = document.getElementById('overlay');
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                // Increment quantity
                existingItem.quantity += 1;
            } else {
                // Add new item
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            // Update cart display
            updateCart();
            
            // Show confirmation message
            showToast(`${name} added to cart`);
            
            // Open cart sidebar
            openCart();
        });
    });
    
    // Category tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter menu items
            filterMenuItems();
        });
    });
    
    // Search functionality
    menuSearch.addEventListener('input', function() {
        filterMenuItems();
    });
    
    // Filter button
    if (filterBtn) {
        filterBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            filterMenu.style.display = filterMenu.style.display === 'block' ? 'none' : 'block';
            
            // Close sort menu if open
            sortMenu.style.display = 'none';
        });
    }
    
    // Sort button
    if (sortBtn) {
        sortBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            sortMenu.style.display = sortMenu.style.display === 'block' ? 'none' : 'block';
            
            // Close filter menu if open
            filterMenu.style.display = 'none';
        });
    }
    
    // Apply filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            filterMenu.style.display = 'none';
            filterMenuItems();
        });
    }
    
    // Reset filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset checkboxes
            document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            filterMenu.style.display = 'none';
            filterMenuItems();
        });
    }
    
    // Clear all filters
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', function() {
            // Reset search
            menuSearch.value = '';
            
            // Reset category
            categoryTabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-category') === 'all') {
                    tab.classList.add('active');
                }
            });
            
            // Reset checkboxes
            document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            filterMenuItems();
        });
    }
    
                // Sort options
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            sortOptions.forEach(o => o.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Sort menu items
            sortMenuItems(this.getAttribute('data-sort'));
            
            // Close sort menu
            sortMenu.style.display = 'none';
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        filterMenu.style.display = 'none';
        sortMenu.style.display = 'none';
    });
    
    // Cart functions
    // Open cart
    function openCart() {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    }
    
    // Close cart
    function closeCart() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    // Cart icon click
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    
    // Close cart button
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Overlay click
    if (overlay) {
        overlay.addEventListener('click', closeCart);
    }
    
    // Clear cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                updateCart();
                showToast('Cart has been cleared');
            }
        });
    }
    
    // Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Proceeding to checkout...');
            // In a real app, this would redirect to a checkout page
        });
    }
    
    // Filter menu items function
    function filterMenuItems() {
        const searchTerm = menuSearch.value.toLowerCase();
        const selectedCategory = document.querySelector('.category-tab.active').getAttribute('data-category');
        
        // Get selected dietary filters
        const dietaryFilters = [];
        document.querySelectorAll('.filter-checkbox input[id^="vegetarian"], .filter-checkbox input[id^="vegan"], .filter-checkbox input[id^="gluten-free"]').forEach(checkbox => {
            if (checkbox.checked) {
                dietaryFilters.push(checkbox.value);
            }
        });
        
        // Get selected spice level filters
        const spiceLevelFilters = [];
        document.querySelectorAll('.filter-checkbox input[id^="mild"], .filter-checkbox input[id^="medium"], .filter-checkbox input[id^="spicy"]').forEach(checkbox => {
            if (checkbox.checked) {
                spiceLevelFilters.push(checkbox.value);
            }
        });
        
        // Filter items
        const menuItems = document.querySelectorAll('.menu-item');
        let visibleCount = 0;
        
        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemDescription = item.querySelector('.menu-item-description').textContent.toLowerCase();
            const itemCategory = item.getAttribute('data-category');
            const itemDietary = item.getAttribute('data-dietary') || '';
            const itemSpice = item.getAttribute('data-spice') || '';
            
            // Check search term
            const matchesSearch = searchTerm === '' || itemName.includes(searchTerm) || itemDescription.includes(searchTerm);
            
            // Check category
            const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;
            
            // Check dietary preferences
            const matchesDietary = dietaryFilters.length === 0 || dietaryFilters.some(filter => itemDietary.includes(filter));
            
            // Check spice level
            const matchesSpiceLevel = spiceLevelFilters.length === 0 || spiceLevelFilters.includes(itemSpice);
            
            // Show/hide item
            if (matchesSearch && matchesCategory && matchesDietary && matchesSpiceLevel) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            menuGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            menuGrid.style.display = 'grid';
        }
    }
    
    // Sort menu items function
    function sortMenuItems(sortBy) {
        const menuItems = Array.from(menuGrid.children);
        
        // Sort items based on criteria
        menuItems.sort((a, b) => {
            switch (sortBy) {
                case 'popularity':
                    // For demo, we'll use the presence of bestseller badge
                    const aIsBestseller = a.querySelector('.badge.bestseller') !== null;
                    const bIsBestseller = b.querySelector('.badge.bestseller') !== null;
                    return bIsBestseller - aIsBestseller;
                
                case 'price-low':
                    const aPrice = parseFloat(a.getAttribute('data-price'));
                    const bPrice = parseFloat(b.getAttribute('data-price'));
                    return aPrice - bPrice;
                
                case 'price-high':
                    const aPriceHigh = parseFloat(a.getAttribute('data-price'));
                    const bPriceHigh = parseFloat(b.getAttribute('data-price'));
                    return bPriceHigh - aPriceHigh;
                
                case 'name-asc':
                    const aName = a.querySelector('h3').textContent;
                    const bName = b.querySelector('h3').textContent;
                    return aName.localeCompare(bName);
                
                default:
                    return 0;
            }
        });
        
        // Reappend sorted items
        menuItems.forEach(item => {
            menuGrid.appendChild(item);
        });
    }
    
    // Update cart function
    function updateCart() {
        // Update cart count badge
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
        
        // Update cart items display
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
            cartFooter.style.display = 'none';
            cartItems.innerHTML = '';
            cartItems.appendChild(emptyCart);
        } else {
            emptyCart.style.display = 'none';
            cartFooter.style.display = 'block';
            
            // Clear current items
            cartItems.innerHTML = '';
            
            // Calculate totals
            let subtotal = 0;
            
            // Add cart items
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="../../assets/images/menu/placeholder.jpg" alt="${item.name}" class="placeholder-img">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItemElement);
            });
            
            // Calculate tax and total
            const tax = subtotal * 0.08;
            const total = subtotal + tax;
            
            // Update totals display
            cartSubtotal.textContent = `${subtotal.toFixed(2)}`;
            cartTax.textContent = `${tax.toFixed(2)}`;
            cartTotal.textContent = `${total.toFixed(2)}`;
            
            // Add event listeners to cart item buttons
            addCartItemEventListeners();
        }
        
        // Save cart to localStorage
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
    }
    
    // Add event listeners to cart item buttons
    function addCartItemEventListeners() {
        // Decrease quantity
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    // Remove item if quantity is 1
                    cart = cart.filter(item => item.id !== id);
                }
                
                updateCart();
            });
        });
        
        // Increase quantity
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                item.quantity += 1;
                updateCart();
            });
        });
        
        // Remove item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                
                cart = cart.filter(item => item.id !== id);
                updateCart();
                
                showToast('Item removed from cart');
            });
        });
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
    
    // Load cart from localStorage
    if (localStorage.getItem('restaurantCart')) {
        try {
            cart = JSON.parse(localStorage.getItem('restaurantCart'));
            updateCart();
        } catch (e) {
            console.error('Error loading cart from localStorage', e);
            cart = [];
        }
    }
    
    // Add toast styles dynamically
    const toastStyles = document.createElement('style');
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
    `;
    document.head.appendChild(toastStyles);
    
    // Initialize
    filterMenuItems();
});