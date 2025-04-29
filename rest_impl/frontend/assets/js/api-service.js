// API Service for Restaurant Management System
// This file contains all API calls to the backend

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    // Authentication
    
    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Save token and user info to localStorage
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            // Save token and user info to localStorage
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/frontend/pages/auth/login.html';
    }
    
    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }
    
    static getCurrentUser() {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    }
    
    // Helper method for authenticated requests
    static async fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // If token is expired or invalid
        if (response.status === 401) {
            this.logout();
            throw new Error('Your session has expired. Please login again.');
        }
        
        return response;
    }
    
    // User Profile
    
    static async getUserProfile() {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/profile`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get user profile');
            }
            
            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }
    
    static async updateUserProfile(profileData) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }
            
            return data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }
    
    // Menu
    
    static async getMenuItems(filters = {}) {
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
            
            const response = await fetch(`${API_BASE_URL}/menu?${queryParams}`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get menu items');
            }
            
            return data;
        } catch (error) {
            console.error('Get menu items error:', error);
            throw error;
        }
    }
    
    static async getCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/categories`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get categories');
            }
            
            return data;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    }
    
    static async getMenuItem(itemId) {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/${itemId}`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get menu item');
            }
            
            return data;
        } catch (error) {
            console.error('Get menu item error:', error);
            throw error;
        }
    }
    
    // Orders
    
    static async createOrder(orderData) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order');
            }
            
            return data;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    }
    
    static async getOrders(filters = {}) {
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
            
            const response = await this.fetchWithAuth(`${API_BASE_URL}/orders?${queryParams}`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get orders');
            }
            
            return data;
        } catch (error) {
            console.error('Get orders error:', error);
            throw error;
        }
    }
    
    static async getOrder(orderId) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/orders/${orderId}`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get order');
            }
            
            return data;
        } catch (error) {
            console.error('Get order error:', error);
            throw error;
        }
    }
    
    static async cancelOrder(orderId) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/orders/${orderId}/cancel`, {
                method: 'PUT'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel order');
            }
            
            return data;
        } catch (error) {
            console.error('Cancel order error:', error);
            throw error;
        }
    }
    
    static async updateOrderStatus(orderId, status) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update order status');
            }
            
            return data;
        } catch (error) {
            console.error('Update order status error:', error);
            throw error;
        }
    }
    
    // Reservations
    
    static async getTables() {
        try {
            const response = await fetch(`${API_BASE_URL}/reservations/tables`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get tables');
            }
            
            return data;
        } catch (error) {
            console.error('Get tables error:', error);
            throw error;
        }
    }
    
    static async checkTableAvailability(params) {
        try {
            // Build query string from params
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
            
            const response = await fetch(`${API_BASE_URL}/reservations/tables/availability?${queryParams}`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to check table availability');
            }
            
            return data;
        } catch (error) {
            console.error('Check table availability error:', error);
            throw error;
        }
    }
    
    static async createReservation(reservationData) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservationData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create reservation');
            }
            
            return data;
        } catch (error) {
            console.error('Create reservation error:', error);
            throw error;
        }
    }
    
    static async getReservations(filters = {}) {
        try {
            // Build query string from filters
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
            
            const response = await this.fetchWithAuth(`${API_BASE_URL}/reservations?${queryParams}`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get reservations');
            }
            
            return data;
        } catch (error) {
            console.error('Get reservations error:', error);
            throw error;
        }
    }
    
    static async getReservation(reservationId) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/reservations/${reservationId}`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get reservation');
            }
            
            return data;
        } catch (error) {
            console.error('Get reservation error:', error);
            throw error;
        }
    }
    
    static async cancelReservation(reservationId) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
                method: 'PUT'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel reservation');
            }
            
            return data;
        } catch (error) {
            console.error('Cancel reservation error:', error);
            throw error;
        }
    }
    
    static async updateReservationStatus(reservationId, status) {
        try {
            const response = await this.fetchWithAuth(`${API_BASE_URL}/reservations/${reservationId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update reservation status');
            }
            
            return data;
        } catch (error) {
            console.error('Update reservation status error:', error);
            throw error;
        }
    }
}

// Add authentication check for protected pages
document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const path = window.location.pathname;
    
    // Skip authentication check for login and register pages
    if (path.includes('/auth/login.html') || path.includes('/auth/register.html')) {
        return;
    }
    
    // Skip authentication check for the landing page
    if (path.endsWith('/index.html') || path === '/' || path.endsWith('/')) {
        return;
    }
    
    // Check if user is authenticated
    if (!ApiService.isAuthenticated()) {
        // Redirect to login page
        window.location.href = '/frontend/pages/auth/login.html';
    }
});