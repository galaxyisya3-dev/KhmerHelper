// Backend Simulation Service
class BackendService {
    constructor() {
        this.baseURL = 'https://api.helperfinder.com/v1';
        this.isSimulated = true;
        this.networkDelay = 500; // ms to simulate network latency
        this.init();
    }

    init() {
        // Initialize sample data if not exists
        this.initializeSampleData();
        console.log('Backend Service Initialized (Simulated)');
    }

    initializeSampleData() {
        // Users data
        if (!StorageHelper.get('backend_users')) {
            const users = {
                'user1': {
                    id: 'user1',
                    email: 'john.doe@example.com',
                    password: 'password123',
                    name: 'John Doe',
                    type: 'user',
                    avatar: 'https://picsum.photos/seed/user1/60/60.jpg',
                    level: 3,
                    progress: 65,
                    joinedDate: '2023-01-15',
                    rating: 4.8,
                    completedTasks: 24,
                    totalSpent: 486,
                    balance: 150.50,
                    isVerified: true,
                    preferences: {
                        notifications: true,
                        emailUpdates: true
                    }
                },
                'user2': {
                    id: 'user2',
                    email: 'sarah.runner@example.com',
                    password: 'password123',
                    name: 'Sarah Johnson',
                    type: 'runner',
                    avatar: 'https://picsum.photos/seed/runner1/60/60.jpg',
                    level: 5,
                    progress: 85,
                    joinedDate: '2022-11-20',
                    rating: 4.9,
                    completedTasks: 156,
                    totalEarned: 3240,
                    balance: 320.75,
                    isVerified: true,
                    skills: ['shopping', 'cleaning', 'delivery'],
                    vehicle: 'bicycle',
                    available: true,
                    location: {
                        lat: 39.9042,
                        lng: 116.4074
                    }
                },
                'user3': {
                    id: 'user3',
                    email: 'admin@helperfinder.com',
                    password: 'admin123',
                    name: 'Admin User',
                    type: 'admin',
                    avatar: 'https://picsum.photos/seed/admin1/60/60.jpg',
                    joinedDate: '2022-01-01',
                    permissions: ['users', 'tasks', 'payments', 'reports']
                },
                'user4': {
                    id: 'user4',
                    email: 'mike.helper@example.com',
                    password: 'password123',
                    name: 'Mike Wilson',
                    type: 'runner',
                    avatar: 'https://picsum.photos/seed/runner2/60/60.jpg',
                    level: 4,
                    progress: 70,
                    joinedDate: '2023-03-10',
                    rating: 4.7,
                    completedTasks: 89,
                    totalEarned: 1780,
                    balance: 125.30,
                    isVerified: true,
                    skills: ['delivery', 'repair'],
                    vehicle: 'motorcycle',
                    available: true,
                    location: {
                        lat: 39.9142,
                        lng: 116.4174
                    }
                }
            };
            StorageHelper.set('backend_users', users);
        }

        // Tasks data
        if (!StorageHelper.get('backend_tasks')) {
            const tasks = {
                'task1': {
                    id: 'task1',
                    title: 'Supermarket Shopping',
                    description: 'Need to buy daily necessities, shopping list is ready. Mainly includes: milk, bread, eggs, fruits, vegetables, etc.',
                    category: 'shopping',
                    budget: 50,
                    location: '88 Jianguo Road, Chaoyang District, Beijing',
                    coordinates: {
                        lat: 39.9042,
                        lng: 116.4074
                    },
                    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                    urgency: 'high',
                    status: 'pending',
                    userId: 'user1',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    shoppingList: [
                        'Milk 2 boxes',
                        'Whole wheat bread 1 bag',
                        'Eggs 1 box',
                        'Apples 1kg',
                        'Tomatoes 500g',
                        'Cucumbers 3'
                    ],
                    images: [],
                    acceptedBy: null,
                    completedAt: null,
                    userRating: null,
                    runnerRating: null
                },
                'task2': {
                    id: 'task2',
                    title: 'Pick Up Package',
                    description: 'Pick up package from delivery station and deliver to home',
                    category: 'delivery',
                    budget: 20,
                    location: '123 Wangfujing Street, Dongcheng District, Beijing',
                    coordinates: {
                        lat: 39.9142,
                        lng: 116.4174
                    },
                    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    urgency: 'medium',
                    status: 'pending',
                    userId: 'user1',
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    packageSize: 'medium',
                    trackingNumber: 'TRK123456789',
                    acceptedBy: null,
                    completedAt: null
                },
                'task3': {
                    id: 'task3',
                    title: 'Clean Apartment',
                    description: 'Need help cleaning living room and kitchen. Basic cleaning supplies provided.',
                    category: 'home',
                    budget: 100,
                    location: '456 Sanlitun Road, Chaoyang District, Beijing',
                    coordinates: {
                        lat: 39.9342,
                        lng: 116.4574
                    },
                    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    urgency: 'low',
                    status: 'pending',
                    userId: 'user1',
                    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
                    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    area: 85, // square meters
                    cleaningSupplies: true,
                    acceptedBy: null,
                    completedAt: null
                }
            };
            StorageHelper.set('backend_tasks', tasks);
        }

        // Conversations data
        if (!StorageHelper.get('backend_conversations')) {
            const conversations = {
                'conv1': {
                    id: 'conv1',
                    userId: 'user1',
                    runnerId: 'user2',
                    taskId: 'task1',
                    lastMessage: 'Okay, no problem. I\'ll be there on time.',
                    lastMessageTime: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
                    unreadCount: 3,
                    messages: [
                        {
                            id: 'msg1',
                            senderId: 'user2',
                            text: 'Hello, I saw your shopping task, I can help complete it.',
                            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                            status: 'delivered'
                        },
                        {
                            id: 'msg2',
                            senderId: 'user1',
                            text: 'Great! When are you available?',
                            timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
                            status: 'read'
                        },
                        {
                            id: 'msg3',
                            senderId: 'user2',
                            text: 'I\'m available after 3 PM, is that okay?',
                            timestamp: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
                            status: 'delivered'
                        },
                        {
                            id: 'msg4',
                            senderId: 'user1',
                            text: 'Sure, shall we meet at the supermarket entrance at 3:30?',
                            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
                            status: 'read'
                        },
                        {
                            id: 'msg5',
                            senderId: 'user2',
                            text: 'Okay, no problem. I\'ll be there on time.',
                            timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
                            status: 'delivered'
                        }
                    ]
                }
            };
            StorageHelper.set('backend_conversations', conversations);
        }

        // Payments data
        if (!StorageHelper.get('backend_payments')) {
            const payments = {
                'payment1': {
                    id: 'payment1',
                    userId: 'user1',
                    taskId: 'task1',
                    amount: 50,
                    type: 'task_payment',
                    status: 'completed',
                    createdAt: new Date().toISOString(),
                    paymentMethod: 'credit_card',
                    transactionId: 'TXN123456'
                }
            };
            StorageHelper.set('backend_payments', payments);
        }

        // Reviews data
        if (!StorageHelper.get('backend_reviews')) {
            const reviews = {
                'review1': {
                    id: 'review1',
                    taskId: 'task1',
                    userId: 'user1',
                    runnerId: 'user2',
                    rating: 5,
                    comment: 'Very timely help, got everything on the shopping list!',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                'review2': {
                    id: 'review2',
                    taskId: 'task2',
                    userId: 'user1',
                    runnerId: 'user4',
                    rating: 4,
                    comment: 'Helped clean the room, very clean, will find her again next time!',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                }
            };
            StorageHelper.set('backend_reviews', reviews);
        }

        // System statistics
        if (!StorageHelper.get('backend_stats')) {
            const stats = {
                totalUsers: 1250,
                totalRunners: 340,
                totalTasks: 2890,
                completedTasks: 2450,
                totalEarnings: 125430,
                activeToday: 45,
                averageRating: 4.7,
                monthlyGrowth: 15.2
            };
            StorageHelper.set('backend_stats', stats);
        }
    }

    // Simulate network delay
    async simulateNetwork() {
        return new Promise(resolve => {
            setTimeout(resolve, this.networkDelay + Math.random() * 500);
        });
    }

    // Simulate API response
    createResponse(data, success = true, message = '') {
        return {
            success,
            data,
            message,
            timestamp: new Date().toISOString()
        };
    }

    // Error response
    createError(message = 'An error occurred') {
        return this.createResponse(null, false, message);
    }

    // AUTHENTICATION API
    async login(email, password) {
        await this.simulateNetwork();
        
        const users = StorageHelper.get('backend_users', {});
        const user = Object.values(users).find(u => u.email === email && u.password === password);
        
        if (user) {
            // Don't return password in response
            const { password: _, ...userWithoutPassword } = user;
            
            // Create session
            const session = {
                userId: user.id,
                token: 'simulated_token_' + Date.now(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            };
            StorageHelper.set('current_session', session);
            
            return this.createResponse({
                user: userWithoutPassword,
                token: session.token
            }, true, 'Login successful');
        }
        
        return this.createError('Invalid email or password');
    }

    async register(userData) {
        await this.simulateNetwork();
        
        const users = StorageHelper.get('backend_users', {});
        const existingUser = Object.values(users).find(u => u.email === userData.email);
        
        if (existingUser) {
            return this.createError('User already exists with this email');
        }
        
        const userId = 'user_' + Date.now();
        const newUser = {
            id: userId,
            ...userData,
            joinedDate: new Date().toISOString(),
            level: 1,
            progress: 0,
            rating: 0,
            completedTasks: 0,
            totalSpent: 0,
            balance: 0,
            isVerified: false
        };
        
        users[userId] = newUser;
        StorageHelper.set('backend_users', users);
        
        const { password: _, ...userWithoutPassword } = newUser;
        return this.createResponse(userWithoutPassword, true, 'Registration successful');
    }

    async getCurrentUser() {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session) {
            return this.createError('Not authenticated');
        }
        
        const users = StorageHelper.get('backend_users', {});
        const user = users[session.userId];
        
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            return this.createResponse(userWithoutPassword);
        }
        
        return this.createError('User not found');
    }

    // TASKS API
    async createTask(taskData) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session) {
            return this.createError('Not authenticated');
        }
        
        const tasks = StorageHelper.get('backend_tasks', {});
        const taskId = 'task_' + Date.now();
        
        const newTask = {
            id: taskId,
            ...taskData,
            userId: session.userId,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            acceptedBy: null,
            completedAt: null
        };
        
        tasks[taskId] = newTask;
        StorageHelper.set('backend_tasks', tasks);
        
        // Update user stats
        this.updateUserStats(session.userId);
        
        return this.createResponse(newTask, true, 'Task created successfully');
    }

    async getTasks(filters = {}) {
        await this.simulateNetwork();
        
        const tasks = StorageHelper.get('backend_tasks', {});
        let tasksArray = Object.values(tasks);
        
        // Apply filters
        if (filters.userId) {
            tasksArray = tasksArray.filter(task => task.userId === filters.userId);
        }
        
        if (filters.status) {
            tasksArray = tasksArray.filter(task => task.status === filters.status);
        }
        
        if (filters.category) {
            tasksArray = tasksArray.filter(task => task.category === filters.category);
        }
        
        if (filters.runnerId) {
            tasksArray = tasksArray.filter(task => task.acceptedBy === filters.runnerId);
        }
        
        // Sort by creation date (newest first)
        tasksArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return this.createResponse(tasksArray);
    }

    async getTask(taskId) {
        await this.simulateNetwork();
        
        const tasks = StorageHelper.get('backend_tasks', {});
        const task = tasks[taskId];
        
        if (task) {
            return this.createResponse(task);
        }
        
        return this.createError('Task not found');
    }

    async updateTask(taskId, updates) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session) {
            return this.createError('Not authenticated');
        }
        
        const tasks = StorageHelper.get('backend_tasks', {});
        const task = tasks[taskId];
        
        if (!task) {
            return this.createError('Task not found');
        }
        
        // Check permissions
        if (task.userId !== session.userId && !this.isAdmin(session.userId)) {
            return this.createError('Not authorized to update this task');
        }
        
        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        tasks[taskId] = updatedTask;
        StorageHelper.set('backend_tasks', tasks);
        
        return this.createResponse(updatedTask, true, 'Task updated successfully');
    }

    async acceptTask(taskId, runnerId) {
        await this.simulateNetwork();
        
        const tasks = StorageHelper.get('backend_tasks', {});
        const task = tasks[taskId];
        
        if (!task) {
            return this.createError('Task not found');
        }
        
        if (task.status !== 'pending') {
            return this.createError('Task is not available');
        }
        
        const updatedTask = {
            ...task,
            status: 'accepted',
            acceptedBy: runnerId,
            updatedAt: new Date().toISOString()
        };
        
        tasks[taskId] = updatedTask;
        StorageHelper.set('backend_tasks', tasks);
        
        return this.createResponse(updatedTask, true, 'Task accepted successfully');
    }

    async completeTask(taskId, ratingData = null) {
        await this.simulateNetwork();
        
        const tasks = StorageHelper.get('backend_tasks', {});
        const task = tasks[taskId];
        
        if (!task) {
            return this.createError('Task not found');
        }
        
        const updatedTask = {
            ...task,
            status: 'completed',
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (ratingData) {
            updatedTask.userRating = ratingData.userRating;
            updatedTask.runnerRating = ratingData.runnerRating;
            
            // Create review if rating provided
            if (ratingData.comment) {
                await this.createReview({
                    taskId,
                    userId: task.userId,
                    runnerId: task.acceptedBy,
                    rating: ratingData.userRating,
                    comment: ratingData.comment
                });
            }
        }
        
        tasks[taskId] = updatedTask;
        StorageHelper.set('backend_tasks', tasks);
        
        // Update user and runner stats
        this.updateUserStats(task.userId);
        if (task.acceptedBy) {
            this.updateRunnerStats(task.acceptedBy);
        }
        
        return this.createResponse(updatedTask, true, 'Task completed successfully');
    }

    // USERS API
    async getUsers(filters = {}) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session || !this.isAdmin(session.userId)) {
            return this.createError('Admin access required');
        }
        
        const users = StorageHelper.get('backend_users', {});
        let usersArray = Object.values(users);
        
        // Remove passwords from response
        usersArray = usersArray.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        
        // Apply filters
        if (filters.type) {
            usersArray = usersArray.filter(user => user.type === filters.type);
        }
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            usersArray = usersArray.filter(user => 
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
        }
        
        return this.createResponse(usersArray);
    }

    async updateUser(userId, updates) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session || (session.userId !== userId && !this.isAdmin(session.userId))) {
            return this.createError('Not authorized');
        }
        
        const users = StorageHelper.get('backend_users', {});
        const user = users[userId];
        
        if (!user) {
            return this.createError('User not found');
        }
        
        const updatedUser = {
            ...user,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        users[userId] = updatedUser;
        StorageHelper.set('backend_users', users);
        
        const { password: _, ...userWithoutPassword } = updatedUser;
        return this.createResponse(userWithoutPassword, true, 'User updated successfully');
    }

    // RUNNERS API
    async getRunners(filters = {}) {
        await this.simulateNetwork();
        
        const users = StorageHelper.get('backend_users', {});
        let runners = Object.values(users).filter(user => user.type === 'runner');
        
        // Remove passwords
        runners = runners.map(runner => {
            const { password, ...runnerWithoutPassword } = runner;
            return runnerWithoutPassword;
        });
        
        // Apply filters
        if (filters.available !== undefined) {
            runners = runners.filter(runner => runner.available === filters.available);
        }
        
        if (filters.skills) {
            runners = runners.filter(runner => 
                runner.skills && runner.skills.some(skill => 
                    filters.skills.includes(skill)
                )
            );
        }
        
        return this.createResponse(runners);
    }

    async updateRunnerStatus(runnerId, status) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session || session.userId !== runnerId) {
            return this.createError('Not authorized');
        }
        
        return this.updateUser(runnerId, { available: status });
    }

    // REVIEWS API
    async createReview(reviewData) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session) {
            return this.createError('Not authenticated');
        }
        
        const reviews = StorageHelper.get('backend_reviews', {});
        const reviewId = 'review_' + Date.now();
        
        const newReview = {
            id: reviewId,
            ...reviewData,
            createdAt: new Date().toISOString()
        };
        
        reviews[reviewId] = newReview;
        StorageHelper.set('backend_reviews', reviews);
        
        // Update runner rating
        await this.updateRunnerRating(reviewData.runnerId);
        
        return this.createResponse(newReview, true, 'Review created successfully');
    }

    async getReviews(filters = {}) {
        await this.simulateNetwork();
        
        const reviews = StorageHelper.get('backend_reviews', {});
        let reviewsArray = Object.values(reviews);
        
        if (filters.runnerId) {
            reviewsArray = reviewsArray.filter(review => review.runnerId === filters.runnerId);
        }
        
        if (filters.userId) {
            reviewsArray = reviewsArray.filter(review => review.userId === filters.userId);
        }
        
        // Sort by creation date (newest first)
        reviewsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return this.createResponse(reviewsArray);
    }

    // STATISTICS API
    async getStatistics() {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session || !this.isAdmin(session.userId)) {
            return this.createError('Admin access required');
        }
        
        const stats = StorageHelper.get('backend_stats', {});
        return this.createResponse(stats);
    }

    async getUserStatistics(userId) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session || (session.userId !== userId && !this.isAdmin(session.userId))) {
            return this.createError('Not authorized');
        }
        
        const users = StorageHelper.get('backend_users', {});
        const user = users[userId];
        
        if (!user) {
            return this.createError('User not found');
        }
        
        const userStats = {
            completedTasks: user.completedTasks || 0,
            totalSpent: user.totalSpent || 0,
            totalEarned: user.totalEarned || 0,
            rating: user.rating || 0,
            level: user.level || 1,
            progress: user.progress || 0
        };
        
        return this.createResponse(userStats);
    }

    // HELPER METHODS
    isAdmin(userId) {
        const users = StorageHelper.get('backend_users', {});
        const user = users[userId];
        return user && user.type === 'admin';
    }

    updateUserStats(userId) {
        const users = StorageHelper.get('backend_users', {});
        const user = users[userId];
        
        if (user) {
            // Calculate user stats based on tasks
            const tasks = StorageHelper.get('backend_tasks', {});
            const userTasks = Object.values(tasks).filter(task => task.userId === userId);
            
            const completedTasks = userTasks.filter(task => task.status === 'completed').length;
            const totalSpent = userTasks
                .filter(task => task.status === 'completed')
                .reduce((sum, task) => sum + (task.budget || 0), 0);
            
            users[userId] = {
                ...user,
                completedTasks,
                totalSpent,
                level: Math.floor(completedTasks / 10) + 1,
                progress: (completedTasks % 10) * 10
            };
            
            StorageHelper.set('backend_users', users);
        }
    }

    updateRunnerStats(runnerId) {
        const users = StorageHelper.get('backend_users', {});
        const runner = users[runnerId];
        
        if (runner) {
            // Calculate runner stats based on tasks
            const tasks = StorageHelper.get('backend_tasks', {});
            const runnerTasks = Object.values(tasks).filter(task => task.acceptedBy === runnerId);
            
            const completedTasks = runnerTasks.filter(task => task.status === 'completed').length;
            const totalEarned = runnerTasks
                .filter(task => task.status === 'completed')
                .reduce((sum, task) => sum + (task.budget || 0), 0);
            
            // Calculate average rating from reviews
            const reviews = StorageHelper.get('backend_reviews', {});
            const runnerReviews = Object.values(reviews).filter(review => review.runnerId === runnerId);
            const averageRating = runnerReviews.length > 0 
                ? runnerReviews.reduce((sum, review) => sum + review.rating, 0) / runnerReviews.length
                : runner.rating || 0;
            
            users[runnerId] = {
                ...runner,
                completedTasks,
                totalEarned,
                rating: parseFloat(averageRating.toFixed(1)),
                level: Math.floor(completedTasks / 25) + 1,
                progress: (completedTasks % 25) * 4
            };
            
            StorageHelper.set('backend_users', users);
        }
    }

    // PAYMENTS API
    async processPayment(paymentData) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session) {
            return this.createError('Not authenticated');
        }
        
        const payments = StorageHelper.get('backend_payments', {});
        const paymentId = 'payment_' + Date.now();
        
        const newPayment = {
            id: paymentId,
            ...paymentData,
            status: 'completed',
            createdAt: new Date().toISOString()
        };
        
        payments[paymentId] = newPayment;
        StorageHelper.set('backend_payments', payments);
        
        return this.createResponse(newPayment, true, 'Payment processed successfully');
    }

    // NOTIFICATIONS API
    async getNotifications(userId) {
        await this.simulateNetwork();
        
        const session = StorageHelper.get('current_session');
        if (!session || (session.userId !== userId && !this.isAdmin(session.userId))) {
            return this.createError('Not authorized');
        }
        
        // Simulate notifications
        const notifications = [
            {
                id: 'notif1',
                userId,
                type: 'task_accepted',
                title: 'Task Accepted',
                message: 'Your shopping task has been accepted by Sarah Johnson',
                read: false,
                createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                data: { taskId: 'task1' }
            },
            {
                id: 'notif2',
                userId,
                type: 'new_message',
                title: 'New Message',
                message: 'You have a new message from Mike Wilson',
                read: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                data: { conversationId: 'conv1' }
            }
        ];
        
        return this.createResponse(notifications);
    }
}

// Initialize and export the backend service
window.BackendService = new BackendService();