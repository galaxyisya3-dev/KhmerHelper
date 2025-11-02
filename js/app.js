// Main Application Controller
class HelperApp {
    constructor() {
        this.currentPage = 'landing';
        this.currentUser = null;
        this.isInitialized = false;
        this.pages = {};
        
        // Initialize the app when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            HelperUtils.showLoading();
            
            // Initialize services first
            await this.initializeServices();
            
            // Load user data
            await this.loadUserData();
            
            // Initialize components
            this.initNavigation();
            this.initEventListeners();
            this.initPages();
            
            // Show initial page
            await this.showPage(this.currentPage);
            
            this.isInitialized = true;
            console.log('Helper App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            HelperUtils.showNotification('Failed to initialize application', 'error');
        } finally {
            HelperUtils.hideLoading();
        }
    }

    async initializeServices() {
        // Initialize Form Handler
        if (window.FormHandler) {
            window.FormHandler.init();
        }
        
        // Initialize Translation Service
        if (window.TranslationService) {
            const savedLanguage = StorageHelper.get('preferredLanguage', 'en');
            window.TranslationService.changeLanguage(savedLanguage);
        }
        
        // Load chat conversations
        if (window.ChatService) {
            window.ChatService.loadConversations();
        }
    }

    async loadUserData() {
        // Try to load user from BackendService first
        if (window.BackendService) {
            try {
                const response = await BackendService.getCurrentUser();
                if (response.success) {
                    this.currentUser = response.data;
                    StorageHelper.set('currentUser', this.currentUser);
                    return;
                }
            } catch (error) {
                console.log('No authenticated user found, using demo data');
            }
        }
        
        // Fallback to demo user
        const userData = StorageHelper.get('currentUser');
        if (userData) {
            this.currentUser = userData;
        } else {
            // Create demo user that matches backend structure
            this.currentUser = {
                id: 'user1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                type: 'user',
                avatar: 'https://picsum.photos/seed/user1/60/60.jpg',
                level: 3,
                progress: 65,
                joinedDate: '2023-01-15',
                rating: 4.8,
                completedTasks: 24,
                totalSpent: 486,
                balance: 150.50,
                isVerified: true
            };
            StorageHelper.set('currentUser', this.currentUser);
        }
    }

    initNavigation() {
        const isAuthenticated = this.currentUser !== null;
        
        const navigationItems = isAuthenticated ? [
            { id: 'landing', icon: 'fa-home', text: 'navHome' },
            { id: 'userHome', icon: 'fa-user', text: 'navUserCenter' },
            { id: 'runnerFeed', icon: 'fa-running', text: 'navRunnerTasks' },
            { id: 'runnerDashboard', icon: 'fa-tachometer-alt', text: 'navRunnerDashboard' },
            { id: 'mapView', icon: 'fa-map', text: 'navMapView' },
            { id: 'chat', icon: 'fa-comments', text: 'navMessages', badge: 3 },
            { id: 'profile', icon: 'fa-user-circle', text: 'navProfile' },
            ...(this.currentUser?.type === 'admin' ? [
                { id: 'adminDashboard', icon: 'fa-cog', text: 'Admin' }
            ] : []),
            { id: 'logout', icon: 'fa-sign-out-alt', text: 'Logout', isAction: true } // Add flag
        ] : [
            { id: 'landing', icon: 'fa-home', text: 'navHome' },
            { id: 'login', icon: 'fa-sign-in-alt', text: 'Login' },
            { id: 'register', icon: 'fa-user-plus', text: 'Register' }
        ];

        // Desktop navigation
        const desktopNav = document.getElementById('desktopNav');
        if (desktopNav) {
            desktopNav.innerHTML = navigationItems.map(item => {
                if (item.isAction) {
                    // For action items like logout, use onclick
                    return `
                        <button onclick="window.helperApp.logout()" class="nav-btn px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center space-x-2">
                            <i class="fas ${item.icon}"></i>
                            <span>${item.text}</span>
                        </button>
                    `;
                } else {
                    // Regular pages use data-page
                    return `
                        <button data-page="${item.id}" class="nav-btn px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center space-x-2 relative">
                            <i class="fas ${item.icon}"></i>
                            <span data-i18n="${item.text}">${item.text}</span>
                            ${item.badge ? `<span class="notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">${item.badge}</span>` : ''}
                        </button>
                    `;
                }
            }).join('');
        }

        // Mobile navigation (similar structure)
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) {
            mobileNav.innerHTML = navigationItems.map(item => {
                if (item.isAction) {
                    return `
                        <button onclick="window.helperApp.logout()" class="w-full text-left px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center space-x-2 relative border-b border-gray-100">
                            <i class="fas ${item.icon} w-5"></i>
                            <span>${item.text}</span>
                        </button>
                    `;
                } else {
                    return `
                        <button data-page="${item.id}" class="w-full text-left px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center space-x-2 relative border-b border-gray-100">
                            <i class="fas ${item.icon} w-5"></i>
                            <span data-i18n="${item.text}">${item.text}</span>
                            ${item.badge ? `<span class="notification-badge ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">${item.badge}</span>` : ''}
                        </button>
                    `;
                }
            }).join('');
        }
    }

    initEventListeners() {
        // Navigation events
        document.addEventListener('click', (e) => {
            // Page navigation
            if (e.target.closest('[data-page]')) {
                const pageId = e.target.closest('[data-page]').getAttribute('data-page');
                
                // Handle logout separately - it's not a page
                if (pageId === 'logout') {
                    this.logout();
                } else {
                    this.showPage(pageId);
                }
            }

            // Language dropdown
            if (e.target.closest('#languageToggle')) {
                this.toggleLanguageDropdown();
            } else {
                // Close language dropdown when clicking outside
                const dropdown = document.getElementById('languageDropdown');
                if (dropdown && !e.target.closest('.language-selector')) {
                    dropdown.classList.remove('show');
                }
            }

            // Mobile menu toggle
            if (e.target.closest('#mobileMenuToggle')) {
                this.toggleMobileMenu();
            }

            // Auth form submissions - use event delegation for dynamically loaded forms
            if (e.target.matches('#loginForm') || e.target.closest('#loginForm')) {
                e.preventDefault();
                this.handleLogin();
            }
            if (e.target.matches('#registerForm') || e.target.closest('#registerForm')) {
                e.preventDefault();
                this.handleRegister();
            }

            // Handle login/register navigation from buttons
            if (e.target.closest('[data-page="login"]') || e.target.closest('[data-page="register"]')) {
                const pageId = e.target.closest('[data-page]').getAttribute('data-page');
                this.showPage(pageId);
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'requestForm') {
                e.preventDefault();
                this.handleTaskSubmission(e.target);
            }
        });

        // Budget slider
        const budgetSlider = document.getElementById('taskBudget');
        if (budgetSlider) {
            budgetSlider.addEventListener('input', (e) => {
                this.updateBudgetSlider(e.target);
            });
        }

        // Initialize language dropdown
        this.initLanguageDropdown();
    }

    // Auth handlers
    async handleLogin() {
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (email && password) {
            await this.login(email, password);
        }
    }

    async handleRegister() {
        const name = document.getElementById('registerName')?.value;
        const email = document.getElementById('registerEmail')?.value;
        const password = document.getElementById('registerPassword')?.value;
        const userType = document.querySelector('input[name="userType"]:checked')?.value;
        
        if (name && email && password && userType) {
            await this.register({
                name,
                email,
                password,
                type: userType
            });
        }
    }

    initLanguageDropdown() {
        const languages = [
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'zh', name: '中文', nativeName: '中文' },
            { code: 'km', name: 'ភាសាខ្មែរ', nativeName: 'ភាសាខ្មែរ' }
        ];

        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.innerHTML = languages.map(lang => `
                <div class="language-option ${lang.code === 'en' ? 'active' : ''}" data-lang="${lang.code}">
                    <span>${lang.nativeName}</span>
                </div>
            `).join('');

            // Add click events to language options
            dropdown.addEventListener('click', (e) => {
                const option = e.target.closest('.language-option');
                if (option) {
                    const lang = option.getAttribute('data-lang');
                    if (window.TranslationService) {
                        window.TranslationService.changeLanguage(lang);
                    }
                }
            });
        }
    }

    toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    toggleMobileMenu() {
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) {
            mobileNav.classList.toggle('hidden');
        }
    }

    async showPage(pageId) {
        // Hide mobile menu if open
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) {
            mobileNav.classList.add('hidden');
        }

        // Update current page
        this.currentPage = pageId;

        try {
            HelperUtils.showLoading();

            // Load page content
            const pageContent = await this.loadPageContent(pageId);
            
            // Update page container
            const pageContainer = document.getElementById('pageContainer');
            if (pageContainer) {
                pageContainer.innerHTML = pageContent;
            }
            
            // Update active navigation state
            this.updateActiveNavigation(pageId);
            
            // Initialize page-specific functionality
            await this.initializePage(pageId);
            
            // Update translations for new content
            if (window.TranslationService) {
                window.TranslationService.updatePageTranslations();
            }

            console.log(`Page ${pageId} loaded successfully`);

        } catch (error) {
            console.error(`Error loading page ${pageId}:`, error);
            HelperUtils.showNotification('Failed to load page', 'error');
        } finally {
            HelperUtils.hideLoading();
        }
    }

    async loadPageContent(pageId) {
        // Return the embedded HTML from page templates
        return this.getPageTemplate(pageId);
    }

    updateActiveNavigation(pageId) {
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('bg-blue-50', 'text-blue-600');
        });

        // Add active class to current page button
        const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('bg-blue-50', 'text-blue-600');
        }
    }

    async initializePage(pageId) {
        switch (pageId) {
            case 'mapView':
                if (window.MapManager) {
                    await window.MapManager.initMap('map');
                }
                break;
            case 'runnerFeed':
                if (window.MapManager) {
                    await window.MapManager.initRunnerMap('runnerMap');
                }
                break;
            case 'chat':
                if (window.ChatService) {
                    window.ChatService.init();
                    window.ChatService.setupChatEventListeners();
                }
                break;
            case 'postRequest':
                if (window.FormHandler) {
                    window.FormHandler.registerForm('requestForm');
                }
                break;
            case 'profile':
                if (window.FormHandler) {
                    // Register profile form if it exists
                    const profileForm = document.getElementById('profileForm');
                    if (profileForm) {
                        window.FormHandler.registerForm('profileForm');
                    }
                }
                break;
            case 'adminDashboard':
                if (window.BackendService) {
                    await this.loadAdminDashboard();
                }
            break;
            
            case 'profile':
                this.initializeProfilePage();
            break;
        }
    }

    initializeProfilePage() {
        // Tab switching functionality
        const tabButtons = document.querySelectorAll('.profile-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => {
                    btn.classList.remove('tab-active', 'border-blue-500', 'text-blue-600');
                    btn.classList.add('border-transparent', 'text-gray-500');
                });
                button.classList.add('tab-active', 'border-blue-500', 'text-blue-600');
                button.classList.remove('border-transparent', 'text-gray-500');
                
                // Show active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.classList.add('hidden');
                });
                
                const activeContent = document.getElementById(`${tabId}-tab`);
                if (activeContent) {
                    activeContent.classList.remove('hidden');
                    activeContent.classList.add('active');
                }
            });
        });
        
        // Form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate();
            });
        }
    }

    async handleProfileUpdate() {
        try {
            const formData = {
                name: document.getElementById('profileName')?.value,
                phone: document.getElementById('profilePhone')?.value,
                email: document.getElementById('profileEmail')?.value,
                address: document.getElementById('profileAddress')?.value,
                bio: document.getElementById('profileBio')?.value
            };
            
            // Get account type if available
            const accountType = document.querySelector('input[name="accountType"]:checked');
            if (accountType) {
                formData.type = accountType.value;
            }
            
            if (window.BackendService) {
                const response = await BackendService.updateUser(this.currentUser.id, formData);
                
                if (response.success) {
                    this.currentUser = response.data;
                    StorageHelper.set('currentUser', this.currentUser);
                    HelperUtils.showNotification('Profile updated successfully!', 'success');
                } else {
                    HelperUtils.showNotification(response.message || 'Failed to update profile', 'error');
                }
            } else {
                // Fallback to local update
                this.currentUser = { ...this.currentUser, ...formData };
                StorageHelper.set('currentUser', this.currentUser);
                HelperUtils.showNotification('Profile updated successfully!', 'success');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            HelperUtils.showNotification('Failed to update profile', 'error');
        }
    }


    async handleTaskSubmission(form) {
        try {
            const formData = new FormData(form);
            const taskData = {
                title: formData.get('taskTitle'),
                category: formData.get('taskCategory'),
                description: formData.get('taskDescription'),
                budget: parseInt(formData.get('taskBudget') || '50'),
                location: formData.get('taskLocation'),
                date: formData.get('taskDate'),
                urgency: document.querySelector('input[name="urgency"]:checked')?.value || 'medium'
            };

            console.log('Submitting task:', taskData);

            // Validate required fields
            if (!taskData.title || !taskData.category || !taskData.description || !taskData.location || !taskData.date) {
                HelperUtils.showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Use the BackendService from backend.js
            if (window.BackendService && window.BackendService.createTask) {
                const response = await BackendService.createTask(taskData);
                
                console.log('Backend response:', response);
                
                if (response.success) {
                    HelperUtils.showNotification('Task posted successfully!', 'success');
                    this.showPage('userHome');
                } else {
                    HelperUtils.showNotification(response.message || 'Failed to post task', 'error');
                }
            } else {
                // Fallback if BackendService is not available
                console.error('BackendService not available');
                HelperUtils.showNotification('Backend service not available', 'error');
            }

        } catch (error) {
            console.error('Error submitting task:', error);
            HelperUtils.showNotification('Failed to post task: ' + error.message, 'error');
        }
    }

    async loadAdminDashboard() {
        try {
            // Load statistics
            const statsResponse = await BackendService.getStatistics();
            if (statsResponse.success) {
                const stats = statsResponse.data;
                document.getElementById('totalUsers').textContent = stats.totalUsers;
                document.getElementById('activeTasks').textContent = stats.totalTasks - stats.completedTasks;
                document.getElementById('totalEarnings').textContent = `$${stats.totalEarnings}`;
                document.getElementById('avgRating').textContent = stats.averageRating;
            }

            // Load recent users
            const usersResponse = await BackendService.getUsers({ type: 'user' });
            if (usersResponse.success) {
                const users = usersResponse.data.slice(0, 5);
                const usersHtml = users.map(user => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full mr-3">
                            <div>
                                <p class="font-medium">${user.name}</p>
                                <p class="text-sm text-gray-500">${user.email}</p>
                            </div>
                        </div>
                        <span class="text-sm text-gray-500">Level ${user.level}</span>
                    </div>
                `).join('');
                document.getElementById('recentUsers').innerHTML = usersHtml;
            }

            // Load recent tasks
            const tasksResponse = await BackendService.getTasks();
            if (tasksResponse.success) {
                const tasks = tasksResponse.data.slice(0, 5);
                const tasksHtml = tasks.map(task => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium">${task.title}</p>
                            <p class="text-sm text-gray-500">${task.category} • $${task.budget}</p>
                        </div>
                        <span class="px-2 py-1 text-xs rounded-full ${
                            task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                        }">${task.status}</span>
                    </div>
                `).join('');
                document.getElementById('recentTasks').innerHTML = tasksHtml;
            }

        } catch (error) {
            console.error('Error loading admin dashboard:', error);
        }
    }

    async login(email, password) {
        try {
            HelperUtils.showLoading();
            
            if (window.BackendService) {
                const response = await BackendService.login(email, password);
                
                console.log('Login response:', response);
                
                if (response.success) {
                    this.currentUser = response.data.user;
                    StorageHelper.set('currentUser', this.currentUser);
                    HelperUtils.showNotification('Login successful!', 'success');
                    
                    // Update navigation
                    this.initNavigation();
                    
                    // Redirect based on user type
                    if (this.currentUser.type === 'admin') {
                        this.showPage('adminDashboard');
                    } else if (this.currentUser.type === 'runner') {
                        this.showPage('runnerDashboard');
                    } else {
                        this.showPage('userHome');
                    }
                } else {
                    HelperUtils.showNotification(response.message, 'error');
                }
            } else {
                HelperUtils.showNotification('Backend service not available', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            HelperUtils.showNotification('Login failed', 'error');
        } finally {
            HelperUtils.hideLoading();
        }
    }

    async register(userData) {
        try {
            HelperUtils.showLoading();
            
            if (window.BackendService) {
                const response = await BackendService.register(userData);
                
                console.log('Register response:', response);
                
                if (response.success) {
                    HelperUtils.showNotification('Registration successful! Please login.', 'success');
                    this.showPage('login');
                } else {
                    HelperUtils.showNotification(response.message, 'error');
                }
            } else {
                HelperUtils.showNotification('Backend service not available', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            HelperUtils.showNotification('Registration failed', 'error');
        } finally {
            HelperUtils.hideLoading();
        }
    }

    updateBudgetSlider(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`;
        
        const budgetValue = document.getElementById('budgetValue');
        if (budgetValue) {
            budgetValue.textContent = slider.value;
        }
    }

    async logout() {
        try {
            HelperUtils.showLoading();
            
            // Clear all user-related data
            StorageHelper.remove('currentUser');
            StorageHelper.remove('current_session');
            
            // Reset current user
            this.currentUser = null;
            this.isInitialized = false;
            
            // Show success message
            HelperUtils.showNotification('Logged out successfully', 'success');
            
            // Refresh navigation to show login/register buttons
            this.initNavigation();
            
            // Show landing page
            await this.showPage('landing');
            
        } catch (error) {
            console.error('Logout error:', error);
            HelperUtils.showNotification('Error during logout', 'error');
        } finally {
            HelperUtils.hideLoading();
        }
    }

    // Page Template Methods
    getPageTemplate(pageId) {
        const templates = {
            landing: this.getLandingPage(),
            userHome: this.getUserHomePage(),
            postRequest: this.getPostRequestPage(),
            runnerFeed: this.getRunnerFeedPage(),
            runnerDashboard: this.getRunnerDashboardPage(),
            mapView: this.getMapViewPage(),
            requestDetails: this.getRequestDetailsPage(),
            chat: this.getChatPage(),
            profile: this.getProfilePage(),
            login: this.getLoginPage(),
            register: this.getRegisterPage()
        };

        return templates[pageId] || '<div class="container mx-auto px-4 py-8"><h1>Page not found</h1></div>';
    }

    getLandingPage() {
        return `
        <div id="landing" class="page active">
            <div class="hero-gradient text-white">
                <div class="container mx-auto px-4 py-16">
                    <div class="flex flex-col md:flex-row items-center">
                        <div class="md:w-1/2 mb-10 md:mb-0">
                            <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight" data-i18n="landingTitle">Connecting people who need help with those willing to help</h2>
                            <p class="text-xl mb-8 opacity-90" data-i18n="landingSubtitle">Whether it's shopping, housework or other tasks, we can help you find the right helper</p>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <button data-page="userHome" class="btn-primary text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center">
                                    <i class="fas fa-user mr-2"></i>
                                    <span data-i18n="landingUserBtn">I'm a user, need help</span>
                                </button>
                                <button data-page="runnerFeed" class="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center">
                                    <i class="fas fa-running mr-2"></i>
                                    <span data-i18n="landingRunnerBtn">I'm a runner, want to earn money</span>
                                </button>
                            </div>
                        </div>
                        <div class="md:w-1/2 md:pl-12">
                            <div class="relative">
                                <div class="absolute inset-0 bg-white opacity-10 rounded-3xl transform rotate-6"></div>
                                <div class="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                                    <div class="flex items-center mb-6">
                                        <img src="https://picsum.photos/seed/user1/60/60.jpg" alt="User" class="w-12 h-12 rounded-full mr-4 border-2 border-white">
                                        <div>
                                            <p class="font-semibold">Sarah Johnson</p>
                                            <div class="flex text-yellow-300">
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                                <i class="fas fa-star text-sm"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="mb-4">"Amazing service! The helper was professional and completed my grocery shopping in no time."</p>
                                    <p class="text-sm opacity-75">2 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="container mx-auto px-4 py-16">
                <div class="text-center mb-12">
                    <h3 class="text-3xl font-bold text-gray-800 mb-4" data-i18n="popularServicesTitle">Popular Service Categories</h3>
                    <p class="text-lg text-gray-600">Choose from a wide range of services tailored to your needs</p>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div class="category-icon bg-white rounded-xl shadow-md p-6 text-center cursor-pointer card-hover">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-shopping-cart text-blue-500 text-2xl"></i>
                        </div>
                        <h4 class="font-semibold mb-2" data-i18n="categoryShopping">Shopping</h4>
                        <p class="text-sm text-gray-600">Grocery, personal items, and more</p>
                    </div>
                    <div class="category-icon bg-white rounded-xl shadow-md p-6 text-center cursor-pointer card-hover">
                        <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-home text-green-500 text-2xl"></i>
                        </div>
                        <h4 class="font-semibold mb-2" data-i18n="categoryHomeHelp">Home Help</h4>
                        <p class="text-sm text-gray-600">Cleaning, organizing, maintenance</p>
                    </div>
                    <div class="category-icon bg-white rounded-xl shadow-md p-6 text-center cursor-pointer card-hover">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-truck text-purple-500 text-2xl"></i>
                        </div>
                        <h4 class="font-semibold mb-2" data-i18n="categoryDelivery">Delivery</h4>
                        <p class="text-sm text-gray-600">Package pickup and delivery</p>
                    </div>
                    <div class="category-icon bg-white rounded-xl shadow-md p-6 text-center cursor-pointer card-hover">
                        <div class="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-tools text-orange-500 text-2xl"></i>
                        </div>
                        <h4 class="font-semibold mb-2" data-i18n="categoryRepair">Repair Services</h4>
                        <p class="text-sm text-gray-600">Minor repairs and installations</p>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white rounded-xl shadow-lg p-8 card-hover">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-bullhorn text-blue-500 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4" data-i18n="feature1Title">Post a Task</h3>
                        <p class="text-gray-600 mb-4" data-i18n="feature1Desc">Describe your needs in a few simple steps, set budget and time</p>
                        <a href="#" class="text-blue-500 font-semibold hover:text-blue-600 transition">Learn more →</a>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-8 card-hover">
                        <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-search text-green-500 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4" data-i18n="feature2Title">Find a Helper</h3>
                        <p class="text-gray-600 mb-4" data-i18n="feature2Desc">Nearby runners will see your task and accept it</p>
                        <a href="#" class="text-blue-500 font-semibold hover:text-blue-600 transition">Learn more →</a>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-8 card-hover">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <i class="fas fa-check-circle text-purple-500 text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4" data-i18n="feature3Title">Task Completed</h3>
                        <p class="text-gray-600 mb-4" data-i18n="feature3Desc">After the task is completed, confirm and rate the helper</p>
                        <a href="#" class="text-blue-500 font-semibold hover:text-blue-600 transition">Learn more →</a>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    getUserHomePage() {
        const tasks = StorageHelper.get('tasks', []);
        const userTasks = tasks.filter(task => task.userId === this.currentUser?.id);
        
        return `
        <div id="userHome" class="page active">
            <div class="container mx-auto px-4 py-8">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h2 class="text-3xl font-bold mb-2" data-i18n="userHomeTitle">User Center</h2>
                            <p class="opacity-90" data-i18n="welcomeBack">Welcome back, ${this.currentUser?.name || 'User'}</p>
                        </div>
                        <div class="flex items-center mt-4 md:mt-0">
                            <img src="${this.currentUser?.avatar}" alt="User Avatar" class="w-16 h-16 rounded-full border-4 border-white mr-4">
                            <div>
                                <p class="font-semibold">Level ${this.currentUser?.level} Helper</p>
                                <div class="flex items-center">
                                    <div class="w-32 bg-white bg-opacity-30 rounded-full h-2 mr-2">
                                        <div class="bg-white h-2 rounded-full" style="width: ${this.currentUser?.progress}%"></div>
                                    </div>
                                    <span class="text-sm">${this.currentUser?.progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-700" data-i18n="activeTasks">Active Tasks</h3>
                            <i class="fas fa-tasks text-blue-500 text-xl"></i>
                        </div>
                        <p class="text-3xl font-bold text-blue-600 mb-2">${userTasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length}</p>
                        <p class="text-sm text-gray-500">Tasks in progress</p>
                    </div>
                    <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-700" data-i18n="completedTasks">Completed Tasks</h3>
                            <i class="fas fa-check-circle text-green-500 text-xl"></i>
                        </div>
                        <p class="text-3xl font-bold text-green-600 mb-2">${this.currentUser?.completedTasks || 0}</p>
                        <p class="text-sm text-gray-500">Total completed</p>
                    </div>
                    <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-gray-700" data-i18n="totalSpent">Total Spent</h3>
                            <i class="fas fa-dollar-sign text-purple-500 text-xl"></i>
                        </div>
                        <p class="text-3xl font-bold text-purple-600 mb-2">$${this.currentUser?.totalSpent || 0}</p>
                        <p class="text-sm text-gray-500">All time spending</p>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-gray-800" data-i18n="serviceCategoriesTitle">Service Categories</h3>
                            <button class="text-blue-500 hover:text-blue-600 transition text-sm font-medium">View all</button>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-white rounded-xl shadow-md p-6 text-center category-icon cursor-pointer">
                                <div class="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i class="fas fa-shopping-cart text-blue-500 text-xl"></i>
                                </div>
                                <p class="font-medium" data-i18n="categoryShopping">Shopping</p>
                            </div>
                            <div class="bg-white rounded-xl shadow-md p-6 text-center category-icon cursor-pointer">
                                <div class="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i class="fas fa-home text-green-500 text-xl"></i>
                                </div>
                                <p class="font-medium" data-i18n="categoryHomeHelp">Home Help</p>
                            </div>
                            <div class="bg-white rounded-xl shadow-md p-6 text-center category-icon cursor-pointer">
                                <div class="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i class="fas fa-truck text-purple-500 text-xl"></i>
                                </div>
                                <p class="font-medium" data-i18n="categoryDelivery">Delivery</p>
                            </div>
                            <div class="bg-white rounded-xl shadow-md p-6 text-center category-icon cursor-pointer">
                                <div class="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i class="fas fa-ellipsis-h text-orange-500 text-xl"></i>
                                </div>
                                <p class="font-medium" data-i18n="categoryOther">Other</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-bold text-gray-800" data-i18n="recentReviewsTitle">Recent Runner Reviews</h3>
                            <button class="text-blue-500 hover:text-blue-600 transition text-sm font-medium">View all</button>
                        </div>
                        <div class="space-y-4">
                            <div class="bg-white rounded-xl shadow-md p-4">
                                <div class="flex items-start">
                                    <img src="https://picsum.photos/seed/runner1/50/50.jpg" alt="Runner" class="w-12 h-12 rounded-full mr-3">
                                    <div class="flex-1">
                                        <div class="flex justify-between items-start mb-1">
                                            <p class="font-semibold">Mike Wilson</p>
                                            <div class="flex text-yellow-400 text-sm">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                            </div>
                                        </div>
                                        <p class="text-gray-600 text-sm" data-i18n="review1">"Very timely help, got everything on the shopping list!"</p>
                                        <p class="text-xs text-gray-500 mt-1">2 days ago</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white rounded-xl shadow-md p-4">
                                <div class="flex items-start">
                                    <img src="https://picsum.photos/seed/runner2/50/50.jpg" alt="Runner" class="w-12 h-12 rounded-full mr-3">
                                    <div class="flex-1">
                                        <div class="flex justify-between items-start mb-1">
                                            <p class="font-semibold">Sarah Chen</p>
                                            <div class="flex text-yellow-400 text-sm">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="far fa-star"></i>
                                            </div>
                                        </div>
                                        <p class="text-gray-600 text-sm" data-i18n="review2">"Helped clean the room, very clean, will find her again next time!"</p>
                                        <p class="text-xs text-gray-500 mt-1">5 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-gray-800" data-i18n="myRequestsTitle">My Requests</h3>
                        <button data-page="postRequest" class="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                            <i class="fas fa-plus mr-2"></i><span data-i18n="postNewRequestBtn">Post New Request</span>
                        </button>
                    </div>
                    <div class="bg-white rounded-xl shadow-md overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-i18n="tableTaskTitle">Task Title</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-i18n="tableCategory">Category</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-i18n="tableBudget">Budget</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-i18n="tableStatus">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-i18n="tableAction">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${userTasks.length > 0 ? userTasks.map(task => `
                                        <tr class="hover:bg-gray-50 transition">
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                                        <i class="fas fa-shopping-cart text-blue-500 text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <div class="text-sm font-medium text-gray-900">${task.title}</div>
                                                        <div class="text-xs text-gray-500">${new Date(task.date).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">${task.category}</span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${task.budget}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 status-badge capitalize">${task.status}</span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button data-page="requestDetails" class="text-blue-600 hover:text-blue-900" data-i18n="viewDetailsBtn">View</button>
                                            </td>
                                        </tr>
                                    `).join('') : `
                                        <tr>
                                            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                                                No tasks found. <button data-page="postRequest" class="text-blue-600 hover:text-blue-900">Create your first task</button>
                                            </td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    getPostRequestPage() {
        return `
        <div id="postRequest" class="page active">
            <div class="container mx-auto px-4 py-8 max-w-3xl">
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                        <h2 class="text-2xl font-bold" data-i18n="postRequestTitle">Post New Request</h2>
                        <p class="opacity-90 mt-1">Fill in the details below to post your task</p>
                    </div>
                    
                    <form id="requestForm" class="p-6" data-validate="true" data-validate-live="true">
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <div class="floating-label">
                                <input type="text" id="taskTitle" name="taskTitle" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" " required>
                                <label for="taskTitle" data-i18n="formTaskTitle">Task Title</label>
                            </div>
                            <div class="floating-label">
                                <select id="taskCategory" name="taskCategory" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition appearance-none" required>
                                    <option value="" disabled selected></option>
                                    <option value="shopping" data-i18n="categoryShopping">Shopping</option>
                                    <option value="home" data-i18n="categoryHomeHelp">Home Help</option>
                                    <option value="delivery" data-i18n="categoryDelivery">Delivery</option>
                                    <option value="other" data-i18n="categoryOther">Other</option>
                                </select>
                                <label for="taskCategory" data-i18n="formTaskCategory">Task Category</label>
                            </div>
                        </div>

                        <div class="mb-6">
                            <div class="floating-label">
                                <textarea id="taskDescription" name="taskDescription" rows="4" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none" placeholder=" " required></textarea>
                                <label for="taskDescription" data-i18n="formTaskDescription">Task Description</label>
                            </div>
                        </div>

                        <div class="mb-6">
                            <label class="block text-gray-700 font-semibold mb-3"><span data-i18n="formBudget">Budget</span> ($<span id="budgetValue">50</span>)</label>
                            <div class="relative">
                                <input type="range" id="taskBudget" name="taskBudget" min="10" max="200" value="50" class="slider w-full">
                                <div class="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>$10</span>
                                    <span>$50</span>
                                    <span>$100</span>
                                    <span>$150</span>
                                    <span>$200</span>
                                </div>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <div class="floating-label">
                                <input type="text" id="taskLocation" name="taskLocation" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" " required>
                                <label for="taskLocation" data-i18n="formLocation">Location</label>
                            </div>
                            <div class="floating-label">
                                <input type="date" id="taskDate" name="taskDate" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" required>
                                <label for="taskDate" data-i18n="formTimePreference">Date</label>
                            </div>
                        </div>

                        <div class="mb-6">
                            <label class="block text-gray-700 font-semibold mb-3" data-i18n="formUrgency">Urgency Level</label>
                            <div class="flex flex-wrap gap-3">
                                <label class="flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                    <input type="radio" name="urgency" value="low" class="mr-2">
                                    <span data-i18n="urgencyLow">Not Urgent</span>
                                </label>
                                <label class="flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                    <input type="radio" name="urgency" value="medium" class="mr-2" checked>
                                    <span data-i18n="urgencyMedium">Normal</span>
                                </label>
                                <label class="flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                    <input type="radio" name="urgency" value="high" class="mr-2">
                                    <span data-i18n="urgencyHigh">Urgent</span>
                                </label>
                            </div>
                        </div>

                        <div class="flex space-x-4">
                            <button type="button" data-page="userHome" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                                <span data-i18n="cancelBtn">Cancel</span>
                            </button>
                            <button type="submit" class="flex-1 btn-primary text-white py-3 rounded-lg font-semibold">
                                <span data-i18n="publishRequestBtn">Publish Request</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    }

    getRunnerFeedPage() {
        return `
        <div id="runnerFeed" class="page active">
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-800 mb-2" data-i18n="runnerFeedTitle">Available Tasks</h2>
                        <p class="text-gray-600">Find tasks that match your skills and schedule</p>
                    </div>
                    <div class="mt-4 md:mt-0 bg-blue-50 p-4 rounded-lg">
                        <p class="text-sm text-blue-800 font-medium">Potential earnings today</p>
                        <p class="text-2xl font-bold text-blue-600">$125-180</p>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div class="flex flex-wrap gap-3 items-center">
                        <div class="filter-chip bg-gray-100 px-4 py-2 rounded-full text-sm cursor-pointer active">
                            <i class="fas fa-filter mr-1"></i> <span data-i18n="filterAll">All</span>
                        </div>
                        <div class="filter-chip bg-gray-100 px-4 py-2 rounded-full text-sm cursor-pointer">
                            <span data-i18n="distance1km">Within 1km</span>
                        </div>
                        <div class="filter-chip bg-gray-100 px-4 py-2 rounded-full text-sm cursor-pointer">
                            <span>$10-30</span>
                        </div>
                        <div class="filter-chip bg-gray-100 px-4 py-2 rounded-full text-sm cursor-pointer">
                            <span data-i18n="categoryShopping">Shopping</span>
                        </div>
                        <div class="filter-chip bg-gray-100 px-4 py-2 rounded-full text-sm cursor-pointer">
                            <span data-i18n="urgencyHigh">Urgent</span>
                        </div>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-6">
                    <div class="md:col-span-2">
                        <div class="space-y-4">
                            <div class="task-card bg-white rounded-xl shadow-md p-5 cursor-pointer task-priority-high" data-page="requestDetails">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex items-start">
                                        <div class="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                            <i class="fas fa-shopping-cart text-red-500"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-lg" data-i18n="task1Title">Supermarket Shopping</h4>
                                            <p class="text-sm text-gray-500">Posted 30 min ago</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-xl font-bold text-green-600">$50</p>
                                        <div class="flex items-center text-sm text-gray-500">
                                            <i class="fas fa-map-marker-alt mr-1"></i>
                                            <span>0.8km</span>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-gray-600 mb-3" data-i18n="task1Desc">Need to buy daily necessities, shopping list is ready</p>
                                <div class="flex justify-between items-center">
                                    <div class="flex gap-2">
                                        <span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full" data-i18n="urgencyHigh">Urgent</span>
                                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full" data-i18n="categoryShopping">Shopping</span>
                                    </div>
                                    <button class="btn-success text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        <i class="fas fa-hand-paper mr-1"></i> <span data-i18n="acceptTaskBtn">Accept</span>
                                    </button>
                                </div>
                            </div>

                            <div class="task-card bg-white rounded-xl shadow-md p-5 cursor-pointer task-priority-medium" data-page="requestDetails">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex items-start">
                                        <div class="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                            <i class="fas fa-truck text-purple-500"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-lg" data-i18n="task2Title">Pick Up Package</h4>
                                            <p class="text-sm text-gray-500">Posted 2 hours ago</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-xl font-bold text-green-600">$20</p>
                                        <div class="flex items-center text-sm text-gray-500">
                                            <i class="fas fa-map-marker-alt mr-1"></i>
                                            <span>2.5km</span>
                                        </div>
                                    </div>
                                </div>
                                <p class="text-gray-600 mb-3" data-i18n="task2Desc">Pick up package from delivery station and deliver to home</p>
                                <div class="flex justify-between items-center">
                                    <div class="flex gap-2">
                                        <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full" data-i18n="urgencyMedium">Normal</span>
                                        <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full" data-i18n="categoryDelivery">Delivery</span>
                                    </div>
                                    <button class="btn-success text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        <i class="fas fa-hand-paper mr-1"></i> <span data-i18n="acceptTaskBtn">Accept</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="bg-white rounded-xl shadow-md p-4 mb-4">
                            <h3 class="text-lg font-semibold mb-3" data-i18n="taskMapTitle">Task Map</h3>
                            <div id="runnerMap" style="height: 400px; border-radius: 0.5rem;">
                                <!-- Map will be rendered here -->
                            </div>
                        </div>
                        
                        <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                            <h3 class="font-semibold mb-2">Pro Tip</h3>
                            <p class="text-sm">Tasks marked as urgent typically pay 20% more. Check your notifications for new urgent tasks in your area.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    getRunnerDashboardPage() {
        return `
        <div id="runnerDashboard" class="page active">
            <div class="container mx-auto px-4 py-8">
                <div class="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h2 class="text-3xl font-bold mb-2" data-i18n="runnerDashboardTitle">Runner Dashboard</h2>
                            <p class="opacity-90">Track your earnings and performance</p>
                        </div>
                        <div class="flex items-center mt-4 md:mt-0">
                            <div class="text-center mr-6">
                                <p class="text-3xl font-bold">4.8</p>
                                <div class="flex text-yellow-300">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                </div>
                                <p class="text-sm opacity-75">Rating</p>
                            </div>
                            <div class="text-center">
                                <p class="text-3xl font-bold">Gold</p>
                                <i class="fas fa-medal text-3xl text-yellow-300"></i>
                                <p class="text-sm opacity-75">Level</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Rest of runner dashboard content -->
                <div class="text-center py-8">
                    <p class="text-gray-600">Runner dashboard content would go here</p>
                    <button data-page="runnerFeed" class="btn-primary text-white px-6 py-3 rounded-lg mt-4">
                        View Available Tasks
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    getMapViewPage() {
        return `
        <div id="mapView" class="page active">
            <div class="container mx-auto px-4 py-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-800 mb-2" data-i18n="mapViewTitle">Task Map</h2>
                        <p class="text-gray-600">Find tasks near your location</p>
                    </div>
                    <button class="btn-primary text-white px-4 py-2 rounded-lg font-medium mt-4 md:mt-0">
                        <i class="fas fa-location-arrow mr-2"></i>Use My Location
                    </button>
                </div>
                
                <!-- Rest of map view content -->
                <div class="bg-white rounded-xl shadow-md p-4">
                    <div id="map" class="shadow-xl" style="height: 500px;"></div>
                </div>
            </div>
        </div>
        `;
    }

    getRequestDetailsPage() {
        return `
        <div id="requestDetails" class="page active">
            <div class="container mx-auto px-4 py-8 max-w-4xl">
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-2xl font-bold mb-2" data-i18n="requestDetailsTitle">Task Details</h2>
                                <div class="flex items-center">
                                    <div class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm mr-3" data-i18n="statusPending">Pending</div>
                                    <div class="flex items-center">
                                        <i class="fas fa-clock mr-1"></i>
                                        <span>Posted 2 hours ago</span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-3xl font-bold">$50</p>
                                <p class="opacity-90" data-i18n="includesServiceFee">Includes service fee</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Rest of request details content -->
                    <div class="p-6 text-center py-12">
                        <p class="text-gray-600 mb-4">Task details would be displayed here</p>
                        <button data-page="runnerFeed" class="btn-primary text-white px-6 py-3 rounded-lg">
                            Back to Tasks
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    getChatPage() {
        return `
        <div id="chat" class="page active">
            <div class="container mx-auto px-4 py-8 max-w-4xl">
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <img src="https://picsum.photos/seed/user789/50/50.jpg" alt="User Avatar" class="w-12 h-12 rounded-full mr-3 border-2 border-white">
                                <div>
                                    <h3 class="font-semibold">John Doe</h3>
                                    <p class="text-sm opacity-90 flex items-center">
                                        <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                        <span data-i18n="onlineStatus">Online</span>
                                    </p>
                                </div>
                            </div>
                            <div class="flex space-x-3">
                                <button class="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
                                    <i class="fas fa-phone"></i>
                                </button>
                                <button class="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
                                    <i class="fas fa-video"></i>
                                </button>
                                <button class="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
                                    <i class="fas fa-info-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="h-96 overflow-y-auto p-4 bg-gray-50" id="chatMessages">
                        <!-- Chat messages will be loaded by ChatService -->
                    </div>
                    
                    <div class="p-4 border-t bg-white">
                        <div class="flex items-center space-x-2">
                            <button class="text-gray-500 hover:text-blue-500 transition p-2">
                                <i class="fas fa-paperclip"></i>
                            </button>
                            <button class="text-gray-500 hover:text-blue-500 transition p-2">
                                <i class="fas fa-image"></i>
                            </button>
                            <input type="text" id="messageInput" placeholder="Type a message..." class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition">
                            <button id="sendMessageBtn" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    getProfilePage() {
        const user = this.currentUser || {};
        
        return `
        <div id="profile" class="page active">
            <div class="container mx-auto px-4 py-8 max-w-5xl">
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                        <h2 class="text-2xl font-bold" data-i18n="profileTitle">Profile & Settings</h2>
                        <p class="opacity-90 mt-1">Manage your account and preferences</p>
                    </div>
                    
                    <div class="p-6">
                        <div class="grid md:grid-cols-4 gap-6">
                            <div class="md:col-span-1">
                                <div class="text-center">
                                    <div class="relative inline-block mb-4">
                                        <img src="${user.avatar || 'https://picsum.photos/seed/userprofile/150/150.jpg'}" 
                                            alt="User Avatar" 
                                            class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg">
                                        <button class="absolute bottom-4 right-0 bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition">
                                            <i class="fas fa-camera"></i>
                                        </button>
                                    </div>
                                    <h3 class="text-xl font-semibold mb-2">${user.name || 'User'}</h3>
                                    <p class="text-gray-600 mb-4">${user.email || 'No email'}</p>
                                    
                                    <div class="bg-blue-50 p-4 rounded-lg mb-4">
                                        <p class="text-sm text-blue-800 font-medium mb-1">Member Since</p>
                                        <p class="text-lg font-bold text-blue-600">${user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    
                                    ${user.type === 'runner' ? `
                                    <div class="bg-green-50 p-4 rounded-lg mb-4">
                                        <p class="text-sm text-green-800 font-medium mb-1">Runner Level</p>
                                        <p class="text-lg font-bold text-green-600">Level ${user.level || 1}</p>
                                        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: ${user.progress || 0}%"></div>
                                        </div>
                                        <p class="text-xs text-green-800 mt-1">${user.progress || 0}% to next level</p>
                                    </div>
                                    ` : ''}
                                    
                                    ${user.rating ? `
                                    <div class="bg-yellow-50 p-4 rounded-lg mb-4">
                                        <p class="text-sm text-yellow-800 font-medium mb-1">Rating</p>
                                        <div class="flex items-center justify-center mb-1">
                                            <div class="flex text-yellow-400">
                                                ${this.generateStarRating(user.rating)}
                                            </div>
                                        </div>
                                        <p class="text-lg font-bold text-yellow-600">${user.rating.toFixed(1)}/5.0</p>
                                    </div>
                                    ` : ''}
                                    
                                    <div class="space-y-2">
                                        <button class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center">
                                            <i class="fas fa-share-alt mr-2"></i>Share Profile
                                        </button>
                                        <button class="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center">
                                            <i class="fas fa-qrcode mr-2"></i>My QR Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="md:col-span-3">
                                <div class="mb-6">
                                    <div class="border-b border-gray-200">
                                        <nav class="-mb-px flex space-x-8">
                                            <button class="profile-tab py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600 tab-active" data-tab="personal">
                                                Personal Information
                                            </button>
                                            <button class="profile-tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="account">
                                                Account Settings
                                            </button>
                                            <button class="profile-tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="notifications">
                                                Notifications
                                            </button>
                                            <button class="profile-tab py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300" data-tab="security">
                                                Privacy & Security
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                                
                                <!-- Personal Information Tab -->
                                <div id="personal-tab" class="tab-content active">
                                    <div class="space-y-6">
                                        <div>
                                            <h3 class="text-lg font-semibold mb-4" data-i18n="personalInfoTitle">Personal Information</h3>
                                            <form id="profileForm" class="space-y-4">
                                                <div class="grid md:grid-cols-2 gap-4">
                                                    <div class="floating-label">
                                                        <input type="text" id="profileName" value="${user.name || ''}" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" ">
                                                        <label data-i18n="formName">Name</label>
                                                    </div>
                                                    <div class="floating-label">
                                                        <input type="tel" id="profilePhone" value="${user.phone || '+1 234 567 8900'}" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" ">
                                                        <label data-i18n="formPhone">Phone</label>
                                                    </div>
                                                </div>
                                                <div class="floating-label">
                                                    <input type="email" id="profileEmail" value="${user.email || ''}" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" ">
                                                    <label data-i18n="formEmail">Email</label>
                                                </div>
                                                <div class="floating-label">
                                                    <input type="text" id="profileAddress" value="${user.address || '88 Jianguo Road, Chaoyang District, Beijing'}" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" ">
                                                    <label data-i18n="formAddress">Address</label>
                                                </div>
                                                <div class="floating-label">
                                                    <textarea id="profileBio" rows="3" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none" placeholder=" ">${user.bio || 'I am a helpful person who often helps neighbors solve various problems.'}</textarea>
                                                    <label data-i18n="formBio">Bio</label>
                                                </div>
                                                <div class="flex justify-end">
                                                    <button type="submit" class="btn-primary text-white px-6 py-2 rounded-lg font-medium">
                                                        <span data-i18n="saveChangesBtn">Save Changes</span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        ${user.type !== 'admin' ? `
                                        <div>
                                            <h3 class="text-lg font-semibold mb-4" data-i18n="accountTypeTitle">Account Type</h3>
                                            <div class="bg-gray-50 p-4 rounded-lg">
                                                <div class="space-y-3">
                                                    <label class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50 transition">
                                                        <div class="flex items-center">
                                                            <input type="radio" name="accountType" value="user" class="mr-3" ${user.type === 'user' ? 'checked' : ''}>
                                                            <div>
                                                                <p class="font-medium" data-i18n="accountTypeUser">User</p>
                                                                <p class="text-sm text-gray-500">Post tasks and get help from runners</p>
                                                            </div>
                                                        </div>
                                                        <i class="fas fa-user text-blue-500 text-xl"></i>
                                                    </label>
                                                    <label class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50 transition">
                                                        <div class="flex items-center">
                                                            <input type="radio" name="accountType" value="runner" class="mr-3" ${user.type === 'runner' ? 'checked' : ''}>
                                                            <div>
                                                                <p class="font-medium" data-i18n="accountTypeRunner">Runner</p>
                                                                <p class="text-sm text-gray-500">Accept tasks and earn money</p>
                                                            </div>
                                                        </div>
                                                        <i class="fas fa-running text-green-500 text-xl"></i>
                                                    </label>
                                                    <label class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50 transition">
                                                        <div class="flex items-center">
                                                            <input type="radio" name="accountType" value="both" class="mr-3" ${user.type === 'both' ? 'checked' : ''}>
                                                            <div>
                                                                <p class="font-medium" data-i18n="accountTypeBoth">Both</p>
                                                                <p class="text-sm text-gray-500">Switch between user and runner roles</p>
                                                            </div>
                                                        </div>
                                                        <i class="fas fa-exchange-alt text-purple-500 text-xl"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        ` : ''}
                                        
                                        ${user.type === 'runner' ? `
                                        <div>
                                            <h3 class="text-lg font-semibold mb-4">Runner Preferences</h3>
                                            <div class="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label class="block text-gray-700 font-semibold mb-2">Preferred Task Types</label>
                                                    <div class="space-y-2">
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2" ${user.skills && user.skills.includes('shopping') ? 'checked' : ''}> Shopping
                                                        </label>
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2" ${user.skills && user.skills.includes('cleaning') ? 'checked' : ''}> Cleaning
                                                        </label>
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2" ${user.skills && user.skills.includes('delivery') ? 'checked' : ''}> Delivery
                                                        </label>
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2" ${user.skills && user.skills.includes('repair') ? 'checked' : ''}> Repair
                                                        </label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label class="block text-gray-700 font-semibold mb-2">Availability</label>
                                                    <div class="space-y-2">
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2" checked> Available for tasks
                                                        </label>
                                                        <label class="block text-gray-700 font-semibold mb-2 mt-4">Maximum Distance</label>
                                                        <select class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500">
                                                            <option>5 km</option>
                                                            <option selected>10 km</option>
                                                            <option>15 km</option>
                                                            <option>20 km</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <!-- Account Settings Tab -->
                                <div id="account-tab" class="tab-content hidden">
                                    <div class="space-y-6">
                                        <div>
                                            <h3 class="text-lg font-semibold mb-4">Subscription Plan</h3>
                                            <div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                                                <div class="flex justify-between items-center">
                                                    <div>
                                                        <h4 class="text-xl font-bold">Free Plan</h4>
                                                        <p class="opacity-90">Basic features included</p>
                                                    </div>
                                                    <button class="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                                                        Upgrade Plan
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 class="text-lg font-semibold mb-4">Payment Methods</h3>
                                            <div class="space-y-4">
                                                <div class="flex items-center justify-between p-4 border rounded-lg">
                                                    <div class="flex items-center">
                                                        <div class="bg-blue-100 p-3 rounded-lg mr-4">
                                                            <i class="fas fa-credit-card text-blue-500 text-xl"></i>
                                                        </div>
                                                        <div>
                                                            <p class="font-semibold">Visa ending in 4242</p>
                                                            <p class="text-sm text-gray-500">Expires 12/2025</p>
                                                        </div>
                                                    </div>
                                                    <button class="text-red-500 hover:text-red-700">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                                <button class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition flex items-center justify-center">
                                                    <i class="fas fa-plus mr-2"></i> Add Payment Method
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Notifications Tab -->
                                <div id="notifications-tab" class="tab-content hidden">
                                    <div class="space-y-6">
                                        <h3 class="text-lg font-semibold mb-4">Notification Preferences</h3>
                                        
                                        <div class="space-y-4">
                                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p class="font-semibold">New Task Notifications</p>
                                                    <p class="text-sm text-gray-500">Get notified when new tasks are posted in your area</p>
                                                </div>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" class="sr-only peer" checked>
                                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            
                                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p class="font-semibold">Message Notifications</p>
                                                    <p class="text-sm text-gray-500">Get notified when you receive new messages</p>
                                                </div>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" class="sr-only peer" checked>
                                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            
                                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p class="font-semibold">Task Status Updates</p>
                                                    <p class="text-sm text-gray-500">Get notified about task status changes</p>
                                                </div>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" class="sr-only peer" checked>
                                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            
                                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p class="font-semibold">Promotional Emails</p>
                                                    <p class="text-sm text-gray-500">Receive updates about new features and promotions</p>
                                                </div>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" class="sr-only peer">
                                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Security Tab -->
                                <div id="security-tab" class="tab-content hidden">
                                    <div class="space-y-6">
                                        <h3 class="text-lg font-semibold mb-4">Security Settings</h3>
                                        
                                        <div class="space-y-4">
                                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p class="font-semibold">Change Password</p>
                                                    <p class="text-sm text-gray-500">Update your password regularly for security</p>
                                                </div>
                                                <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                                    Change
                                                </button>
                                            </div>
                                            
                                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p class="font-semibold">Two-Factor Authentication</p>
                                                    <p class="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                                </div>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" class="sr-only peer">
                                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            
                                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p class="font-semibold">Login History</p>
                                                    <p class="text-sm text-gray-500">View your recent login activity</p>
                                                </div>
                                                <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                                                    View
                                                </button>
                                            </div>
                                            
                                            <div class="p-4 bg-red-50 rounded-lg border border-red-200">
                                                <h4 class="font-semibold text-red-800 mb-2">Danger Zone</h4>
                                                <p class="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                                <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // Helper method to generate star ratings
    generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    getAdminDashboardPage() {
    return `
    <div id="adminDashboard" class="page active">
        <div class="container mx-auto px-4 py-8">
            <div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 class="text-3xl font-bold mb-2">Admin Dashboard</h2>
                        <p class="opacity-90">Manage users, tasks, and platform statistics</p>
                    </div>
                    <div class="flex items-center mt-4 md:mt-0">
                        <img src="${this.currentUser?.avatar}" alt="Admin Avatar" class="w-16 h-16 rounded-full border-4 border-white mr-4">
                        <div>
                            <p class="font-semibold">Administrator</p>
                            <p class="text-sm opacity-90">${this.currentUser?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-700">Total Users</h3>
                        <i class="fas fa-users text-purple-500 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-purple-600 mb-2" id="totalUsers">0</p>
                    <p class="text-sm text-gray-500">Registered users</p>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-700">Active Tasks</h3>
                        <i class="fas fa-tasks text-blue-500 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-blue-600 mb-2" id="activeTasks">0</p>
                    <p class="text-sm text-gray-500">Pending and accepted</p>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-700">Total Earnings</h3>
                        <i class="fas fa-dollar-sign text-green-500 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-green-600 mb-2" id="totalEarnings">$0</p>
                    <p class="text-sm text-gray-500">Platform revenue</p>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 card-hover">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-700">Avg Rating</h3>
                        <i class="fas fa-star text-yellow-500 text-xl"></i>
                    </div>
                    <p class="text-3xl font-bold text-yellow-600 mb-2" id="avgRating">0.0</p>
                    <p class="text-sm text-gray-500">User satisfaction</p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Recent Users</h3>
                    <div class="space-y-4" id="recentUsers">
                        <!-- Users will be loaded here -->
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Recent Tasks</h3>
                    <div class="space-y-4" id="recentTasks">
                        <!-- Tasks will be loaded here -->
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Platform Statistics</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center" id="platformStats">
                    <!-- Stats will be loaded here -->
                </div>
            </div>
        </div>
    </div>
    `;
    }

    getLoginPage() {
        return `
        <div id="login" class="page active">
            <div class="container mx-auto px-4 py-8 max-w-md">
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
                        <h2 class="text-2xl font-bold">Welcome Back</h2>
                        <p class="opacity-90 mt-1">Sign in to your account</p>
                    </div>
                    
                    <form id="loginForm" class="p-6">
                        <div class="mb-6">
                            <div class="floating-label">
                                <input type="email" id="loginEmail" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" " required>
                                <label for="loginEmail">Email Address</label>
                            </div>
                        </div>

                        <div class="mb-6">
                            <div class="floating-label">
                                <input type="password" id="loginPassword" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" " required>
                                <label for="loginPassword">Password</label>
                            </div>
                        </div>

                        <button type="submit" class="w-full btn-primary text-white py-3 rounded-lg font-semibold mb-4">
                            Sign In
                        </button>

                        <div class="text-center">
                            <p class="text-gray-600">Don't have an account? 
                                <button type="button" data-page="register" class="text-blue-500 hover:text-blue-600 font-medium">Sign up</button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    }

    getRegisterPage() {
        return `
        <div id="register" class="page active">
            <div class="container mx-auto px-4 py-8 max-w-md">
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white text-center">
                        <h2 class="text-2xl font-bold">Create Account</h2>
                        <p class="opacity-90 mt-1">Join Helper Finder today</p>
                    </div>
                    
                    <form id="registerForm" class="p-6">
                        <div class="mb-6">
                            <div class="floating-label">
                                <input type="text" id="registerName" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" " required>
                                <label for="registerName">Full Name</label>
                            </div>
                        </div>

                        <div class="mb-6">
                            <div class="floating-label">
                                <input type="email" id="registerEmail" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" " required>
                                <label for="registerEmail">Email Address</label>
                            </div>
                        </div>

                        <div class="mb-6">
                            <div class="floating-label">
                                <input type="password" id="registerPassword" class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder=" " required>
                                <label for="registerPassword">Password</label>
                            </div>
                        </div>

                        <div class="mb-6">
                            <label class="block text-gray-700 font-semibold mb-3">Account Type</label>
                            <div class="space-y-2">
                                <label class="flex items-center bg-gray-100 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                    <input type="radio" name="userType" value="user" class="mr-3" checked>
                                    <div>
                                        <p class="font-medium">I need help</p>
                                        <p class="text-sm text-gray-500">Post tasks and find helpers</p>
                                    </div>
                                </label>
                                <label class="flex items-center bg-gray-100 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                    <input type="radio" name="userType" value="runner" class="mr-3">
                                    <div>
                                        <p class="font-medium">I want to help</p>
                                        <p class="text-sm text-gray-500">Complete tasks and earn money</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button type="submit" class="w-full btn-success text-white py-3 rounded-lg font-semibold mb-4">
                            Create Account
                        </button>

                        <div class="text-center">
                            <p class="text-gray-600">Already have an account? 
                                <button type="button" data-page="login" class="text-blue-500 hover:text-blue-600 font-medium">Sign in</button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    }

    initPages() {
        // Initialize page templates
        this.pages = {
            landing: this.getLandingPage(),
            userHome: this.getUserHomePage(),
            postRequest: this.getPostRequestPage(),
            runnerFeed: this.getRunnerFeedPage(),
            runnerDashboard: this.getRunnerDashboardPage(),
            mapView: this.getMapViewPage(),
            requestDetails: this.getRequestDetailsPage(),
            chat: this.getChatPage(),
            profile: this.getProfilePage(),
            login: this.getLoginPage(),
            register: this.getRegisterPage()
        };
    }
}

// Initialize the application
window.helperApp = new HelperApp();