class ChatService {
    constructor() {
        this.currentConversation = null;
        this.conversations = new Map();
        this.isConnected = false;
        this.messageHandlers = [];
    }

    init() {
        this.loadSampleConversations();
        this.setupEventListeners();
        this.setupMockWebSocket();
        this.renderConversationList();
    }

    loadSampleConversations() {
        const sampleConversations = [
            {
                id: 'conv1',
                userId: 'user789',
                userName: 'John Doe',
                userAvatar: 'https://picsum.photos/seed/user789/50/50.jpg',
                lastMessage: 'Okay, no problem. I\'ll be there on time.',
                lastMessageTime: new Date(Date.now() - 24 * 60 * 1000),
                unreadCount: 3,
                messages: [
                    {
                        id: 1,
                        sender: 'other',
                        text: 'Hello, I saw your shopping task, I can help complete it.',
                        timestamp: new Date(Date.now() - 30 * 60 * 1000),
                        status: 'delivered'
                    },
                    {
                        id: 2,
                        sender: 'user',
                        text: 'Great! When are you available?',
                        timestamp: new Date(Date.now() - 28 * 60 * 1000),
                        status: 'read'
                    },
                    {
                        id: 3,
                        sender: 'other',
                        text: 'I\'m available after 3 PM, is that okay?',
                        timestamp: new Date(Date.now() - 27 * 60 * 1000),
                        status: 'delivered'
                    },
                    {
                        id: 4,
                        sender: 'user',
                        text: 'Sure, shall we meet at the supermarket entrance at 3:30?',
                        timestamp: new Date(Date.now() - 25 * 60 * 1000),
                        status: 'read'
                    },
                    {
                        id: 5,
                        sender: 'other',
                        text: 'Okay, no problem. I\'ll be there on time.',
                        timestamp: new Date(Date.now() - 24 * 60 * 1000),
                        status: 'delivered'
                    }
                ]
            },
            {
                id: 'conv2',
                userId: 'user456',
                userName: 'Sarah Chen',
                userAvatar: 'https://picsum.photos/seed/runner2/50/50.jpg',
                lastMessage: 'The cleaning supplies have been delivered.',
                lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                unreadCount: 0,
                messages: [
                    {
                        id: 1,
                        sender: 'other',
                        text: 'Hi! I\'ve completed the room cleaning task.',
                        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                        status: 'read'
                    },
                    {
                        id: 2,
                        sender: 'user',
                        text: 'Great! How did it go?',
                        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
                        status: 'read'
                    },
                    {
                        id: 3,
                        sender: 'other',
                        text: 'Everything went well. The cleaning supplies have been delivered.',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        status: 'read'
                    }
                ]
            }
        ];

        sampleConversations.forEach(conv => {
            this.conversations.set(conv.id, conv);
        });

        // Set first conversation as active
        this.currentConversation = sampleConversations[0];
    }

    setupEventListeners() {
        // Message input event listeners are set up when chat page is loaded
    }

    setupMockWebSocket() {
        // Simulate WebSocket connection
        this.isConnected = true;
        
        // Simulate receiving messages
        setInterval(() => {
            if (this.currentConversation && Math.random() > 0.7) {
                this.simulateIncomingMessage();
            }
        }, 30000); // Check every 30 seconds
    }

    simulateIncomingMessage() {
        if (!this.currentConversation) return;

        const replies = [
            "I'll be there in 10 minutes.",
            "Can we reschedule for 30 minutes later?",
            "I've completed the task as requested.",
            "Do you need anything else?",
            "The item was out of stock, what alternative would you prefer?"
        ];

        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const newMessage = {
            id: Date.now(),
            sender: 'other',
            text: randomReply,
            timestamp: new Date(),
            status: 'delivered'
        };

        this.addMessage(this.currentConversation.id, newMessage);
        
        // Show notification
        HelperUtils.showNotification(`New message from ${this.currentConversation.userName}`, 'info');
    }

    setupChatEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.querySelector('#chat button[onclick="sendMessage()"]');

        if (messageInput) {
            // Remove existing event listeners
            messageInput.replaceWith(messageInput.cloneNode(true));
            
            const newInput = document.getElementById('messageInput');
            newInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (sendButton) {
            sendButton.replaceWith(sendButton.cloneNode(true));
            document.querySelector('#chat button[onclick="sendMessage()"]')
                .addEventListener('click', () => this.sendMessage());
        }
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const messageText = messageInput?.value.trim();

        if (!messageText || !this.currentConversation) return;

        const message = {
            id: Date.now(),
            sender: 'user',
            text: messageText,
            timestamp: new Date(),
            status: 'sent'
        };

        this.addMessage(this.currentConversation.id, message);
        messageInput.value = '';

        // Simulate typing indicator and reply
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.simulateReply();
        }, 1000 + Math.random() * 2000);
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'flex justify-start mb-4 chat-message';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="max-w-xs">
                <div class="bg-white p-3 rounded-lg rounded-tl-none shadow">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    simulateReply() {
        if (!this.currentConversation) return;

        const replies = [
            "I understand. Let me check and get back to you.",
            "That sounds good to me.",
            "I can help with that. What are the details?",
            "When would you like me to complete this?",
            "I'm available for that task."
        ];

        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const replyMessage = {
            id: Date.now() + 1,
            sender: 'other',
            text: randomReply,
            timestamp: new Date(),
            status: 'delivered'
        };

        this.addMessage(this.currentConversation.id, replyMessage);
    }

    addMessage(conversationId, message) {
        const conversation = this.conversations.get(conversationId);
        if (!conversation) return;

        conversation.messages.push(message);
        conversation.lastMessage = message.text;
        conversation.lastMessageTime = message.timestamp;

        if (message.sender === 'other') {
            conversation.unreadCount++;
        }

        this.renderMessages();
        this.renderConversationList();

        // Save to localStorage
        this.saveConversations();
    }

    renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages || !this.currentConversation) return;

        const messages = this.currentConversation.messages;
        
        chatMessages.innerHTML = messages.map(message => `
            <div class="flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 chat-message">
                <div class="max-w-xs">
                    <div class="${message.sender === 'user' ? 'bg-blue-500 text-white rounded-lg rounded-tr-none' : 'bg-white text-gray-800 rounded-lg rounded-tl-none'} p-3 shadow">
                        <p>${HelperUtils.sanitizeInput(message.text)}</p>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : ''}">
                        ${HelperUtils.formatTime(message.timestamp)}
                        ${message.sender === 'user' ? ` • ${this.getMessageStatus(message.status)}` : ''}
                    </p>
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Mark messages as read
        if (this.currentConversation) {
            this.markConversationAsRead(this.currentConversation.id);
        }
    }

    getMessageStatus(status) {
        const statusIcons = {
            sent: '↗️',
            delivered: '✓',
            read: '✓✓'
        };
        return statusIcons[status] || '↗️';
    }

    renderConversationList() {
        const conversationList = document.getElementById('conversationList');
        if (!conversationList) return;

        const conversationsArray = Array.from(this.conversations.values())
            .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        conversationList.innerHTML = conversationsArray.map(conv => `
            <div class="conversation-item flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${this.currentConversation?.id === conv.id ? 'bg-blue-50' : ''}"
                 onclick="window.ChatService.selectConversation('${conv.id}')">
                <img src="${conv.userAvatar}" alt="${conv.userName}" class="w-12 h-12 rounded-full mr-3">
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="font-semibold text-gray-800 truncate">${conv.userName}</h4>
                        <span class="text-xs text-gray-500">${HelperUtils.formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <p class="text-sm text-gray-600 truncate">${conv.lastMessage}</p>
                </div>
                ${conv.unreadCount > 0 ? `
                    <span class="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        ${conv.unreadCount}
                    </span>
                ` : ''}
            </div>
        `).join('');
    }

    selectConversation(conversationId) {
        const conversation = this.conversations.get(conversationId);
        if (!conversation) return;

        this.currentConversation = conversation;
        this.renderMessages();
        this.renderConversationList();
        this.setupChatEventListeners();
        
        // Mark as read
        this.markConversationAsRead(conversationId);
    }

    markConversationAsRead(conversationId) {
        const conversation = this.conversations.get(conversationId);
        if (conversation) {
            conversation.unreadCount = 0;
            this.renderConversationList();
        }
    }

    startNewConversation(userId, userName, userAvatar) {
        const conversationId = `conv_${Date.now()}`;
        const newConversation = {
            id: conversationId,
            userId,
            userName,
            userAvatar,
            lastMessage: 'Conversation started',
            lastMessageTime: new Date(),
            unreadCount: 0,
            messages: []
        };

        this.conversations.set(conversationId, newConversation);
        this.selectConversation(conversationId);
        this.renderConversationList();

        return conversationId;
    }

    saveConversations() {
        const conversationsData = Object.fromEntries(this.conversations);
        StorageHelper.set('chat_conversations', conversationsData);
    }

    loadConversations() {
        const savedConversations = StorageHelper.get('chat_conversations', {});
        Object.entries(savedConversations).forEach(([id, conv]) => {
            this.conversations.set(id, conv);
        });
    }

    getUnreadCount() {
        let total = 0;
        this.conversations.forEach(conv => {
            total += conv.unreadCount;
        });
        return total;
    }
}

// Initialize chat service
window.ChatService = new ChatService();