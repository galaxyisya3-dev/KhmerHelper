class TranslationService {
    constructor() {
        this.translations = {
            en: {
                appTitle: "Helper Service Finder",
                navHome: "Home",
                navUserCenter: "User Center",
                navRunnerTasks: "Runner Tasks",
                navRunnerDashboard: "Runner Dashboard",
                navMapView: "Map View",
                navMessages: "Messages",
                navProfile: "Profile",
                landingTitle: "Connecting people who need help with those willing to help",
                landingSubtitle: "Whether it's shopping, housework or other tasks, we can help you find the right helper",
                landingUserBtn: "I'm a user, need help",
                landingRunnerBtn: "I'm a runner, want to earn money",
                feature1Title: "Post a Task",
                feature1Desc: "Describe your needs in a few simple steps, set budget and time",
                feature2Title: "Find a Helper",
                feature2Desc: "Nearby runners will see your task and accept it",
                feature3Title: "Task Completed",
                feature3Desc: "After the task is completed, confirm and rate the helper",
                popularServicesTitle: "Popular Service Categories",
                categoryShopping: "Shopping",
                categoryHomeHelp: "Home Help",
                categoryDelivery: "Delivery",
                categoryRepair: "Repair Services",
                categoryOther: "Other",
                userHomeTitle: "User Center",
                welcomeBack: "Welcome back",
                activeTasks: "Active Tasks",
                completedTasks: "Completed Tasks",
                totalSpent: "Total Spent",
                postNewRequestBtn: "Post New Request",
                serviceCategoriesTitle: "Service Categories",
                recentReviewsTitle: "Recent Runner Reviews",
                review1: "Very timely help, got everything on the shopping list!",
                review2: "Helped clean the room, very clean, will find her again next time!",
                myRequestsTitle: "My Requests",
                tableTaskTitle: "Task Title",
                tableCategory: "Category",
                tableBudget: "Budget",
                tableStatus: "Status",
                tableAction: "Action",
                task1Title: "Supermarket Shopping",
                task2Title: "Pick Up Package",
                task3Title: "Clean Room",
                statusCompleted: "Completed",
                statusInProgress: "In Progress",
                statusPending: "Pending",
                viewDetailsBtn: "View",
                postRequestTitle: "Post New Request",
                formTaskTitle: "Task Title",
                formTaskDescription: "Task Description",
                formTaskCategory: "Task Category",
                formBudget: "Budget",
                formLocation: "Location",
                selectLocationBtn: "Select Location",
                formTimePreference: "Time Preference",
                formUrgency: "Urgency Level",
                urgencyLow: "Not Urgent",
                urgencyMedium: "Normal",
                urgencyHigh: "Urgent",
                cancelBtn: "Cancel",
                publishRequestBtn: "Publish Request",
                runnerFeedTitle: "Available Tasks",
                filterAll: "All",
                distance1km: "Within 1km",
                acceptTaskBtn: "Accept",
                taskMapTitle: "Task Map",
                runnerDashboardTitle: "Runner Dashboard",
                todayEarnings: "Today's Earnings",
                earningsIncrease: "15% from yesterday",
                monthlyTotal: "Monthly: 42",
                acceptedTasksTitle: "Accepted Tasks",
                contactUserBtn: "Contact",
                startTaskBtn: "Start",
                markAsDoneBtn: "Complete",
                mapViewTitle: "Task Map",
                filterAllTasks: "All Tasks",
                legendTitle: "Legend",
                legendShopping: "Shopping Tasks",
                legendHomeHelp: "Home Help Tasks",
                legendDelivery: "Delivery Tasks",
                legendOther: "Other Tasks",
                requestDetailsTitle: "Task Details",
                taskDetailDesc: "Need to buy daily necessities, shopping list is ready. Mainly includes: milk, bread, eggs, fruits, vegetables, etc. Please ensure to buy fresh products, contact me if there are any out-of-stock items to confirm alternatives.",
                shoppingListTitle: "Shopping List",
                item1: "Milk 2 boxes",
                item2: "Whole wheat bread 1 bag",
                item3: "Eggs 1 box",
                item4: "Apples 1kg",
                item5: "Tomatoes 500g",
                item6: "Cucumbers 3",
                taskTime: "Today 14:00",
                publisherInfoTitle: "Publisher Information",
                publishedTasks: "12 tasks",
                taskRewardTitle: "Task Reward",
                includesServiceFee: "Includes service fee",
                contactPublisherBtn: "Contact Publisher",
                bookmarkTaskBtn: "Bookmark Task",
                safetyTipsTitle: "Safety Tips",
                safetyTip1: "• Please complete tasks in public places",
                safetyTip2: "• Maintain communication with the platform",
                safetyTip3: "• Contact customer service promptly if you encounter problems",
                onlineStatus: "Online",
                chatMessage1: "Hello, I saw your shopping task, I can help complete it.",
                chatMessage2: "Great! When are you available?",
                chatMessage3: "I'm available after 3 PM, is that okay?",
                chatMessage4: "Sure, shall we meet at the supermarket entrance at 3:30?",
                chatMessage5: "Okay, no problem. I'll be there on time.",
                profileTitle: "Profile & Settings",
                accountTypeTitle: "Account Type",
                accountTypeUser: "User",
                accountTypeRunner: "Runner",
                accountTypeBoth: "Both",
                personalInfoTitle: "Personal Information",
                formName: "Name",
                formPhone: "Phone",
                formEmail: "Email",
                formAddress: "Address",
                formBio: "Bio",
                bioPlaceholder: "I am a helpful person who often helps neighbors solve various problems.",
                saveChangesBtn: "Save Changes"
            },
            zh: {
                appTitle: "Helper Service Finder",
                navHome: "首页",
                navUserCenter: "用户中心",
                navRunnerTasks: "跑腿任务",
                navRunnerDashboard: "跑腿仪表板",
                navMapView: "地图视图",
                navMessages: "消息",
                navProfile: "个人资料",
                landingTitle: "连接需要帮助的人与愿意提供帮助的人",
                landingSubtitle: "无论是购物、家务还是其他任务，我们都能帮您找到合适的帮手",
                landingUserBtn: "我是用户，需要帮助",
                landingRunnerBtn: "我是跑腿员，想赚钱",
                feature1Title: "发布任务",
                feature1Desc: "简单几步描述您的需求，设置预算和时间",
                feature2Title: "找到帮手",
                feature2Desc: "附近的跑腿员会看到您的任务并接受",
                feature3Title: "任务完成",
                feature3Desc: "任务完成后，确认并评价帮手",
                popularServicesTitle: "热门服务类别",
                categoryShopping: "购物代购",
                categoryHomeHelp: "家务帮助",
                categoryDelivery: "快递配送",
                categoryRepair: "维修服务",
                categoryOther: "其他",
                userHomeTitle: "用户中心",
                welcomeBack: "欢迎回来",
                activeTasks: "活跃任务",
                completedTasks: "完成任务",
                totalSpent: "总支出",
                postNewRequestBtn: "发布新请求",
                serviceCategoriesTitle: "服务类别",
                recentReviewsTitle: "最近的跑腿员评价",
                review1: "非常及时的帮助，购物清单上的每样东西都买到了！",
                review2: "帮忙打扫了房间，非常干净，下次还会找她！",
                myRequestsTitle: "我的请求",
                tableTaskTitle: "任务标题",
                tableCategory: "类别",
                tableBudget: "预算",
                tableStatus: "状态",
                tableAction: "操作",
                task1Title: "超市购物",
                task2Title: "取快递",
                task3Title: "打扫房间",
                statusCompleted: "已完成",
                statusInProgress: "进行中",
                statusPending: "待开始",
                viewDetailsBtn: "查看",
                postRequestTitle: "发布新请求",
                formTaskTitle: "任务标题",
                formTaskDescription: "任务描述",
                formTaskCategory: "任务类别",
                formBudget: "预算",
                formLocation: "位置",
                selectLocationBtn: "选择位置",
                formTimePreference: "时间偏好",
                formUrgency: "紧急程度",
                urgencyLow: "不急",
                urgencyMedium: "一般",
                urgencyHigh: "紧急",
                cancelBtn: "取消",
                publishRequestBtn: "发布请求",
                runnerFeedTitle: "可接任务",
                filterAll: "全部",
                distance1km: "1公里内",
                acceptTaskBtn: "接受",
                taskMapTitle: "任务地图",
                runnerDashboardTitle: "跑腿员仪表板",
                todayEarnings: "今日收入",
                earningsIncrease: "比昨天增加 15%",
                monthlyTotal: "本月累计: 42",
                acceptedTasksTitle: "已接受的任务",
                contactUserBtn: "联系",
                startTaskBtn: "开始",
                markAsDoneBtn: "完成",
                mapViewTitle: "任务地图",
                filterAllTasks: "全部任务",
                legendTitle: "图例",
                legendShopping: "购物任务",
                legendHomeHelp: "家务帮助",
                legendDelivery: "配送任务",
                legendOther: "其他任务",
                requestDetailsTitle: "任务详情",
                taskDetailDesc: "需要购买生活用品，清单已准备好。主要包括：牛奶、面包、鸡蛋、水果、蔬菜等。请确保购买新鲜的产品，如有缺货可联系我确认替代品。",
                shoppingListTitle: "购物清单",
                item1: "牛奶 2盒",
                item2: "全麦面包 1袋",
                item3: "鸡蛋 1盒",
                item4: "苹果 1kg",
                item5: "西红柿 500g",
                item6: "黄瓜 3根",
                taskTime: "今天 14:00",
                publisherInfoTitle: "发布者信息",
                publishedTasks: "已发布 12 个任务",
                taskRewardTitle: "任务报酬",
                includesServiceFee: "包含服务费",
                contactPublisherBtn: "联系发布者",
                bookmarkTaskBtn: "收藏任务",
                safetyTipsTitle: "安全提示",
                safetyTip1: "• 请在公共场所完成任务",
                safetyTip2: "• 保持与平台沟通",
                safetyTip3: "• 如遇问题请及时联系客服",
                onlineStatus: "在线",
                chatMessage1: "你好，我看到你发布的购物任务，我可以帮忙完成。",
                chatMessage2: "太好了！你什么时候有空？",
                chatMessage3: "我下午3点后都有空，可以吗？",
                chatMessage4: "可以的，那我们约在3点半在超市门口见面？",
                chatMessage5: "好的，没问题。我会准时到的。",
                profileTitle: "个人资料与设置",
                accountTypeTitle: "账户类型",
                accountTypeUser: "用户",
                accountTypeRunner: "跑腿员",
                accountTypeBoth: "两者都是",
                personalInfoTitle: "个人信息",
                formName: "姓名",
                formPhone: "电话",
                formEmail: "邮箱",
                formAddress: "地址",
                formBio: "个人简介",
                bioPlaceholder: "我是一个乐于助人的人，经常帮助邻居解决各种问题。",
                saveChangesBtn: "保存更改"
            },
            km: {
                appTitle: "កម្មវិធីស្វែងរកអ្នកជំនួយ",
                navHome: "ទំព័រដើម",
                navUserCenter: "មជ្ឈមណ្ឌលអ្នកប្រើប្រាស់",
                navRunnerTasks: "ភារកិច្ចរត់ការ",
                navRunnerDashboard: "ផ្ទាំងគ្រប់គ្រងរត់ការ",
                navMapView: "ទិដ្ឋភាពផែនទី",
                navMessages: "សារ",
                navProfile: "ប្រវត្តិរូប",
                landingTitle: "ភ្ជាប់មនុស្សដែលត្រូវការជំនួយជាមួយអ្នកដែលព្រមជួយ",
                landingSubtitle: "ទោះបីជាជាការទិញឥវ៉ាន់ ការងារផ្ទះ ឬភារកិច្ចផ្សេងៗក៏ដោយ យើងអាចជួយអ្នករកអ្នកជំនួយដ៏សមរម្យ",
                landingUserBtn: "ខ្ញុំជាអ្នកប្រើប្រាស់ ត្រូវការជំនួយ",
                landingRunnerBtn: "ខ្ញុំជាអ្នករត់ការ ចង់រកលុយ",
                feature1Title: "បង្ហោះភារកិច្ច",
                feature1Desc: "ពិពណ៌នាតម្រូវការរបស់អ្នកក្នុងជំហានងាយៗ កំណត់ថវិកា និងពេលវេលា",
                feature2Title: "រកអ្នកជំនួយ",
                feature2Desc: "អ្នករត់ការនៅជិតនឹងឃើញភារកិច្ចរបស់អ្នកហើយទទួលវា",
                feature3Title: "ភារកិច្ចបានបញ្ចប់",
                feature3Desc: "បន្ទាប់ពីភារកិច្ចបានបញ្ចប់ បញ្ជាក់ និងវាយតម្លៃអ្នកជំនួយ",
                popularServicesTitle: "ប្រភេទសេវាកម្មពេញនិយម",
                categoryShopping: "ទិញឥវ៉ាន់",
                categoryHomeHelp: "ជំនួយផ្ទះ",
                categoryDelivery: "ដឹកជញ្ជូន",
                categoryRepair: "សេវាកម្មជួសជុល",
                categoryOther: "ផ្សេងៗ",
                userHomeTitle: "មជ្ឈមណ្ឌលអ្នកប្រើប្រាស់",
                welcomeBack: "សូមស្វាគមន៍មកវិញ",
                activeTasks: "ភារកិច្ចសកម្ម",
                completedTasks: "ភារកិច្ចបានបញ្ចប់",
                totalSpent: "ចំណាយសរុប",
                postNewRequestBtn: "បង្ហោះសំណើថ្មី",
                serviceCategoriesTitle: "ប្រភេទសេវាកម្ម",
                recentReviewsTitle: "ការវាយតម្លៃអ្នករត់ការថ្មីៗ",
                review1: "ជំនួយត្រឹមត្រូវពេលវេលា បានទិញគ្រប់អ្វីដែលនៅក្នុងបញ្ជីទិញឥវ៉ាន់!",
                review2: "ជួយសម្អាតបន្ទប់ សម្អាតណាស់ លើកក្រោយនឹងរកគាត់ម្តងទៀត!",
                myRequestsTitle: "សំណើរបស់ខ្ញុំ",
                tableTaskTitle: "ចំណងជើងភារកិច្ច",
                tableCategory: "ប្រភេទ",
                tableBudget: "ថវិកា",
                tableStatus: "ស្ថានភាព",
                tableAction: "សកម្មភាព",
                task1Title: "ទិញឥវ៉ាន់នៅហាងទំនិញ",
                task2Title: "ទទួលកញ្ចប់",
                task3Title: "សម្អាតបន្ទប់",
                statusCompleted: "បានបញ្ចប់",
                statusInProgress: "កំពុងដំណើរការ",
                statusPending: "រង់ចាំ",
                viewDetailsBtn: "មើល",
                postRequestTitle: "បង្ហោះសំណើថ្មី",
                formTaskTitle: "ចំណងជើងភារកិច្ច",
                formTaskDescription: "ពិពណ៌នាភារកិច្ធ",
                formTaskCategory: "ប្រភេទភារកិច្ធ",
                formBudget: "ថវិកា",
                formLocation: "ទីតាំង",
                selectLocationBtn: "ជ្រើសរើសទីតាំង",
                formTimePreference: "ចំណង់ចំណូលចិត្តពេលវេលា",
                formUrgency: "កម្រិតបន្ទាន់",
                urgencyLow: "មិនបន្ទាន់",
                urgencyMedium: "ធម្មតា",
                urgencyHigh: "បន្ទាន់",
                cancelBtn: "បោះបង់",
                publishRequestBtn: "បង្ហោះសំណើ",
                runnerFeedTitle: "ភារកិច្ចដែលអាចទទួល",
                filterAll: "ទាំងអស់",
                distance1km: "ក្នុងចម្ងាយ 1គម",
                acceptTaskBtn: "ទទួល",
                taskMapTitle: "ផែនទីភារកិច្ធ",
                runnerDashboardTitle: "ផ្ទាំងគ្រប់គ្រងអ្នករត់ការ",
                todayEarnings: "ចំណូលថ្ងៃនេះ",
                earningsIncrease: "កើនឡើង 15% ពីម្សិលមិញ",
                monthlyTotal: "សរុបប្រចាំខែ: 42",
                acceptedTasksTitle: "ភារកិច្ចដែលបានទទួល",
                contactUserBtn: "ទាក់ទង",
                startTaskBtn: "ចាប់ផ្តើម",
                markAsDoneBtn: "បញ្ចប់",
                mapViewTitle: "ផែនទីភារកិច្ធ",
                filterAllTasks: "ភារកិច្ចទាំងអស់",
                legendTitle: "សញ្ញាណសម្គាល់",
                legendShopping: "ភារកិច្ចទិញឥវ៉ាន់",
                legendHomeHelp: "ភារកិច្ចជំនួយផ្ទះ",
                legendDelivery: "ភារកិច្ចដឹកជញ្ជូន",
                legendOther: "ភារកិច្ចផ្សេងៗ",
                requestDetailsTitle: "ព័ត៌មានលម្អិតភារកិច្ធ",
                taskDetailDesc: "ត្រូវការទិញវត្ថុប្រើប្រាស់ប្រចាំថ្ងៃ បញ្ជីទិញឥវ៉ាន់ត្រូវបានរួចរាល់។ រួមមាន៖ ទឹកដោះគោ នំបុ័ង កូនមាន់ ផ្លែឈើ បន្លែ ជាដើម។ សូមប្រាកដថាទិញផលិតផលស្រស់ ទាក់ទងខ្ញុំប្រសិនបើមានអត់ទំនិញដើម្បីបញ្ជាក់ជម្រើសជំនួស។",
                shoppingListTitle: "បញ្ជីទិញឥវ៉ាន់",
                item1: "ទឹកដោះគោ 2 ប្រអប់",
                item2: "នំបុ័ងគ្រាប់ធម្មតា 1 ដុំ",
                item3: "កូនមាន់ 1 ប្រអប់",
                item4: "ប៉ោម 1គក",
                item5: "ប៉េងប៉ោម 500ក្រាម",
                item6: "ត្រសក់ 3 ដើម",
                taskTime: "ថ្ងៃនេះ 14:00",
                publisherInfoTitle: "ព័ត៌មានអ្នកបង្ហោះ",
                publishedTasks: "បានបង្ហោះ 12 ភារកិច្ធ",
                taskRewardTitle: "រង្វាន់ភារកិច្ធ",
                includesServiceFee: "រួមបញ្ចូលថ្លៃសេវា",
                contactPublisherBtn: "ទាក់ទងអ្នកបង្ហោះ",
                bookmarkTaskBtn: "រក្សាទុកភារកិច្ធ",
                safetyTipsTitle: "ព័ត៌មានសុវត្ថិភាព",
                safetyTip1: "• សូមបញ្ចប់ភារកិច្ចនៅកន្លែងសាធារណៈ",
                safetyTip2: "• រក្សាទំនាក់ទំនងជាមួយវេទិកា",
                safetyTip3: "• ទាក់ទងបុគ្គលិកគាំទ្រភ្លាមៗប្រសិនបើមានបញ្ហា",
                onlineStatus: "អនឡាញ",
                chatMessage1: "សួស្តី ខ្ញុំឃើញភារកិច្ចទិញឥវ៉ាន់របស់អ្នក ខ្ញុំអាចជួយបញ្ចប់វា។",
                chatMessage2: "ល្អណាស់! តើអ្នកមានពេលទំនេរពេលណា?",
                chatMessage3: "ខ្ញុំមានពេលទំនេរបន្ទាប់ពីម៉ោង 3 ល្ងាច តើអាចទេ?",
                chatMessage4: "បាទ/ចាស តើយើងអាចជួបគ្នានៅមុខហាងទំនិញម៉ោង 3:30 បានទេ?",
                chatMessage5: "ព្រម គ្មានបញ្ហាទេ។ ខ្ញុំនឹងមកដល់ត្រឹមត្រូវពេលវេលា។",
                profileTitle: "ប្រវត្តិរូប និងការកំណត់",
                accountTypeTitle: "ប្រភេទគណនី",
                accountTypeUser: "អ្នកប្រើប្រាស់",
                accountTypeRunner: "អ្នករត់ការ",
                accountTypeBoth: "ទាំងពីរ",
                personalInfoTitle: "ព័ត៌មានផ្ទាល់ខ្លួន",
                formName: "ឈ្មោះ",
                formPhone: "ទូរស័ព្ទ",
                formEmail: "អ៊ីមែល",
                formAddress: "អាសយដ្ឋាន",
                formBio: "ជីវប្រវត្តិ",
                bioPlaceholder: "ខ្ញុំជាមនុស្សម្នាក់ដែលចូលចិត្តជួយ ហើយញុំញញឹមជួយអ្នកជិតខាងដោះស្រាយបញ្ហាផ្សេងៗ។",
                saveChangesBtn: "រក្សាទុកការផ្លាស់ប្តូរ"
            }
        };
        
        this.currentLanguage = 'en';
        this.languageNames = {
            'en': 'English',
            'zh': '中文',
            'km': 'ភាសាខ្មែរ'
        };
    }

    changeLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not supported`);
            return;
        }

        this.currentLanguage = lang;
        
        // Update current language display
        const currentLanguageElement = document.getElementById('currentLanguage');
        if (currentLanguageElement) {
            currentLanguageElement.textContent = this.languageNames[lang];
        }
        
        // Update active state of language options
        this.updateLanguageOptions(lang);
        
        // Apply translations
        this.applyTranslations();
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Save preference
        StorageHelper.set('preferredLanguage', lang);
        
        // Close dropdown
        this.hideLanguageDropdown();
        
        console.log(`Language changed to ${lang}`);
    }

    updateLanguageOptions(activeLang) {
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            const langCode = option.getAttribute('data-lang');
            if (langCode === activeLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
                
                // Handle placeholder attributes for inputs and textareas
                if (element.hasAttribute('placeholder') || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', translation);
                }
            }
        });
    }

    getTranslation(key) {
        const langData = this.translations[this.currentLanguage];
        if (!langData) {
            console.warn(`No translation data for language ${this.currentLanguage}`);
            return key;
        }
        
        const translation = langData[key];
        if (!translation) {
            console.warn(`No translation found for key: ${key} in language ${this.currentLanguage}`);
            return key;
        }
        
        return translation;
    }

    updatePageTranslations() {
        this.applyTranslations();
    }

    hideLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    formatCurrency(amount, currency = 'USD') {
        const formatters = {
            'en': new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
            'zh': new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }),
            'km': new Intl.NumberFormat('km-KH', { style: 'currency', currency: 'KHR' })
        };
        
        const formatter = formatters[this.currentLanguage] || formatters.en;
        return formatter.format(amount);
    }

    formatDate(date) {
        const formatters = {
            'en': new Intl.DateTimeFormat('en-US'),
            'zh': new Intl.DateTimeFormat('zh-CN'),
            'km': new Intl.DateTimeFormat('km-KH')
        };
        
        const formatter = formatters[this.currentLanguage] || formatters.en;
        return formatter.format(new Date(date));
    }
}

// Initialize and export the service
window.TranslationService = new TranslationService();