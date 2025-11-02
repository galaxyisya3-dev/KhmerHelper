class FormHandler {
    constructor() {
        this.forms = new Map();
        this.validators = {
            required: this.validateRequired.bind(this),
            email: this.validateEmail.bind(this),
            phone: this.validatePhone.bind(this),
            minLength: this.validateMinLength.bind(this),
            maxLength: this.validateMaxLength.bind(this),
            number: this.validateNumber.bind(this),
            date: this.validateDate.bind(this)
        };
    }

    init() {
        this.setupGlobalFormHandlers();
    }

    setupGlobalFormHandlers() {
        // Global form submission handler
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.hasAttribute('data-validate')) {
                e.preventDefault();
                this.handleFormSubmission(form);
            }
        });

        // Real-time validation for forms with data-validate-live
        document.addEventListener('input', (e) => {
            const input = e.target;
            const form = input.closest('form');
            if (form && form.hasAttribute('data-validate-live')) {
                this.validateField(input);
            }
        });

        // Floating label behavior
        document.addEventListener('input', (e) => {
            const input = e.target;
            if (input.parentElement.classList.contains('floating-label')) {
                this.updateFloatingLabel(input);
            }
        });

        // Initialize existing floating labels
        this.initFloatingLabels();
    }

    initFloatingLabels() {
        const floatingLabels = document.querySelectorAll('.floating-label');
        floatingLabels.forEach(container => {
            const input = container.querySelector('input, textarea, select');
            if (input) {
                this.updateFloatingLabel(input);
            }
        });
    }

    updateFloatingLabel(input) {
        const label = input.parentElement.querySelector('label');
        if (label) {
            if (input.value || input === document.activeElement) {
                label.classList.add('floating');
            } else {
                label.classList.remove('floating');
            }
        }
    }

    registerForm(formId, options = {}) {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`Form with id ${formId} not found`);
            return;
        }

        const formConfig = {
            validateOnSubmit: true,
            validateOnInput: true,
            showSuccessStates: true,
            autoFocusFirstError: true,
            ...options
        };

        this.forms.set(formId, formConfig);

        // Add data attributes for global handlers
        if (formConfig.validateOnSubmit) {
            form.setAttribute('data-validate', 'true');
        }
        if (formConfig.validateOnInput) {
            form.setAttribute('data-validate-live', 'true');
        }

        // Initialize form fields
        this.initFormFields(form);
    }

    initFormFields(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            this.initFieldValidation(field);
        });
    }

    initFieldValidation(field) {
        // Clear existing errors
        this.clearFieldError(field);

        // Add blur validation
        field.addEventListener('blur', () => {
            this.validateField(field);
        });
    }

    async handleFormSubmission(form) {
        const formId = form.id;
        const formConfig = this.forms.get(formId);

        if (!formConfig?.validateOnSubmit) {
            return true; // Skip validation
        }

        HelperUtils.showLoading();

        try {
            const isValid = await this.validateForm(form);
            
            if (isValid) {
                // Form is valid, proceed with submission
                await this.submitForm(form);
                return true;
            } else {
                // Focus on first error
                if (formConfig.autoFocusFirstError) {
                    const firstError = form.querySelector('.border-red-500');
                    if (firstError) {
                        firstError.focus();
                    }
                }
                
                HelperUtils.showNotification('Please fix the errors in the form', 'error');
                return false;
            }
        } catch (error) {
            console.error('Form submission error:', error);
            HelperUtils.showNotification('Error submitting form', 'error');
            return false;
        } finally {
            HelperUtils.hideLoading();
        }
    }

    async validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, textarea, select');

        // Clear all errors first
        fields.forEach(field => this.clearFieldError(field));

        // Validate each field
        for (const field of fields) {
            const fieldValid = await this.validateField(field);
            if (!fieldValid) {
                isValid = false;
            }
        }

        // Additional form-level validation
        const formValid = await this.validateFormRules(form);
        if (!formValid) {
            isValid = false;
        }

        return isValid;
    }

    async validateField(field) {
        if (field.disabled || field.type === 'hidden') {
            return true;
        }

        let isValid = true;
        const errors = [];

        // Check validators based on field attributes and type
        if (field.hasAttribute('required')) {
            if (!this.validators.required(field.value)) {
                errors.push(field.getAttribute('data-required-message') || 'This field is required');
                isValid = false;
            }
        }

        if (field.type === 'email' && field.value) {
            if (!this.validators.email(field.value)) {
                errors.push(field.getAttribute('data-email-message') || 'Please enter a valid email address');
                isValid = false;
            }
        }

        if (field.type === 'tel' && field.value) {
            if (!this.validators.phone(field.value)) {
                errors.push(field.getAttribute('data-phone-message') || 'Please enter a valid phone number');
                isValid = false;
            }
        }

        if (field.hasAttribute('minlength') && field.value) {
            if (!this.validators.minLength(field.value, parseInt(field.getAttribute('minlength')))) {
                errors.push(field.getAttribute('data-minlength-message') || `Minimum length is ${field.getAttribute('minlength')} characters`);
                isValid = false;
            }
        }

        if (field.hasAttribute('maxlength') && field.value) {
            if (!this.validators.maxLength(field.value, parseInt(field.getAttribute('maxlength')))) {
                errors.push(field.getAttribute('data-maxlength-message') || `Maximum length is ${field.getAttribute('maxlength')} characters`);
                isValid = false;
            }
        }

        if (field.type === 'number' && field.value) {
            if (!this.validators.number(field.value)) {
                errors.push(field.getAttribute('data-number-message') || 'Please enter a valid number');
                isValid = false;
            }
        }

        if (field.type === 'date' && field.value) {
            if (!this.validators.date(field.value)) {
                errors.push(field.getAttribute('data-date-message') || 'Please enter a valid date');
                isValid = false;
            }
        }

        // Custom validation
        const customValidator = field.getAttribute('data-validate');
        if (customValidator && this.validators[customValidator]) {
            if (!this.validators[customValidator](field.value)) {
                errors.push(field.getAttribute('data-validation-message') || 'Invalid value');
                isValid = false;
            }
        }

        // Update field UI
        if (!isValid) {
            this.showFieldError(field, errors);
        } else if (field.value) {
            this.showFieldSuccess(field);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    // Validation methods
    validateRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    validatePhone(value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    }

    validateMinLength(value, minLength) {
        return value.length >= minLength;
    }

    validateMaxLength(value, maxLength) {
        return value.length <= maxLength;
    }

    validateNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    validateDate(value) {
        return !isNaN(Date.parse(value));
    }

    async validateFormRules(form) {
        // Form-level validation rules
        const rules = form.getAttribute('data-form-rules');
        if (!rules) return true;

        try {
            const ruleDefinitions = JSON.parse(rules);
            let isValid = true;

            for (const rule of ruleDefinitions) {
                switch (rule.type) {
                    case 'password-match':
                        const password = form.querySelector(rule.fields[0]);
                        const confirmPassword = form.querySelector(rule.fields[1]);
                        if (password && confirmPassword && password.value !== confirmPassword.value) {
                            this.showFieldError(confirmPassword, [rule.message || 'Passwords do not match']);
                            isValid = false;
                        }
                        break;
                    case 'date-range':
                        const startDate = form.querySelector(rule.fields[0]);
                        const endDate = form.querySelector(rule.fields[1]);
                        if (startDate && endDate && new Date(startDate.value) > new Date(endDate.value)) {
                            this.showFieldError(endDate, [rule.message || 'End date must be after start date']);
                            isValid = false;
                        }
                        break;
                }
            }

            return isValid;
        } catch (error) {
            console.error('Error parsing form rules:', error);
            return true;
        }
    }

    showFieldError(field, errors) {
        // Remove existing success state
        field.classList.remove('border-green-500', 'bg-green-50');
        
        // Add error state
        field.classList.add('border-red-500', 'bg-red-50');
        
        // Remove existing error messages
        this.clearFieldError(field);
        
        // Add error messages
        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'text-red-500 text-sm mt-1 flex items-center';
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-circle mr-1"></i>
                <span>${error}</span>
            `;
            field.parentNode.appendChild(errorElement);
        });

        // Add error class to parent for floating labels
        const parent = field.parentElement;
        if (parent.classList.contains('floating-label')) {
            parent.classList.add('error');
        }
    }

    showFieldSuccess(field) {
        const formConfig = this.forms.get(field.closest('form')?.id);
        if (!formConfig?.showSuccessStates) return;

        // Remove error state
        field.classList.remove('border-red-500', 'bg-red-50');
        this.clearFieldError(field);
        
        // Add success state
        field.classList.add('border-green-500', 'bg-green-50');
        
        // Remove error class from parent
        const parent = field.parentElement;
        if (parent.classList.contains('floating-label')) {
            parent.classList.remove('error');
        }
    }

    clearFieldError(field) {
        // Remove error styles
        field.classList.remove('border-red-500', 'bg-red-50', 'border-green-500', 'bg-green-50');
        
        // Remove error messages
        const parent = field.parentElement;
        const errorMessages = parent.querySelectorAll('.text-red-500');
        errorMessages.forEach(msg => msg.remove());
        
        // Remove error class from parent
        if (parent.classList.contains('floating-label')) {
            parent.classList.remove('error');
        }
    }

    async submitForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Get additional data from elements not in form
        const additionalData = this.getAdditionalFormData(form);
        const submitData = { ...data, ...additionalData };

        // Call form-specific handler
        const formId = form.id;
        switch (formId) {
            case 'requestForm':
                return await window.helperApp.handleTaskSubmission(form);
            case 'profileForm':
                return await this.handleProfileUpdate(submitData);
            default:
                console.log('Form submitted:', submitData);
                HelperUtils.showNotification('Form submitted successfully!', 'success');
                form.reset();
                this.initFloatingLabels();
                return true;
        }
    }

    getAdditionalFormData(form) {
        const data = {};
        
        // Get data from elements with data-form-value
        const valueElements = form.querySelectorAll('[data-form-value]');
        valueElements.forEach(element => {
            const key = element.getAttribute('data-form-value');
            data[key] = element.value || element.textContent;
        });

        return data;
    }

    async handleProfileUpdate(data) {
        try {
            // Update user profile
            const currentUser = StorageHelper.get('currentUser');
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    ...data,
                    updatedAt: new Date().toISOString()
                };
                
                StorageHelper.set('currentUser', updatedUser);
                window.helperApp.currentUser = updatedUser;
                
                HelperUtils.showNotification('Profile updated successfully!', 'success');
                return true;
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            HelperUtils.showNotification('Error updating profile', 'error');
            return false;
        }
    }

    setFormValues(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;

        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
                this.updateFloatingLabel(field);
                this.validateField(field);
            }
        });
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            this.initFloatingLabels();
            
            // Clear all validation states
            const fields = form.querySelectorAll('input, textarea, select');
            fields.forEach(field => this.clearFieldError(field));
        }
    }

    // Utility method to create dynamic forms
    createForm(fields, options = {}) {
        const formId = options.id || `form_${Date.now()}`;
        const formHTML = this.generateFormHTML(fields, formId, options);
        return { id: formId, html: formHTML };
    }

    generateFormHTML(fields, formId, options) {
        const fieldsHTML = fields.map(field => this.generateFieldHTML(field)).join('');
        
        return `
            <form id="${formId}" class="${options.className || ''}" 
                  data-validate="${options.validate !== false}" 
                  data-validate-live="${options.liveValidation === true}">
                ${fieldsHTML}
                <div class="flex space-x-4 mt-6">
                    ${options.showCancel ? `
                        <button type="button" onclick="${options.onCancel || ''}" 
                                class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                            Cancel
                        </button>
                    ` : ''}
                    <button type="submit" 
                            class="${options.showCancel ? 'flex-1' : 'w-full'} btn-primary text-white py-3 rounded-lg font-semibold">
                        ${options.submitText || 'Submit'}
                    </button>
                </div>
            </form>
        `;
    }

    generateFieldHTML(fieldConfig) {
        const commonAttributes = `
            id="${fieldConfig.id}"
            name="${fieldConfig.name}"
            ${fieldConfig.required ? 'required' : ''}
            ${fieldConfig.placeholder ? `placeholder="${fieldConfig.placeholder}"` : ''}
            ${fieldConfig.value ? `value="${fieldConfig.value}"` : ''}
            ${fieldConfig.min ? `min="${fieldConfig.min}"` : ''}
            ${fieldConfig.max ? `max="${fieldConfig.max}"` : ''}
            ${fieldConfig.minLength ? `minlength="${fieldConfig.minLength}"` : ''}
            ${fieldConfig.maxLength ? `maxlength="${fieldConfig.maxLength}"` : ''}
        `.trim();

        let fieldHTML = '';

        switch (fieldConfig.type) {
            case 'textarea':
                fieldHTML = `
                    <div class="floating-label mb-6">
                        <textarea ${commonAttributes} rows="4" 
                                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none"></textarea>
                        <label for="${fieldConfig.id}">${fieldConfig.label}</label>
                    </div>
                `;
                break;
            case 'select':
                const optionsHTML = fieldConfig.options.map(opt => 
                    `<option value="${opt.value}" ${opt.selected ? 'selected' : ''}>${opt.label}</option>`
                ).join('');
                fieldHTML = `
                    <div class="floating-label mb-6">
                        <select ${commonAttributes} 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition appearance-none">
                            <option value=""></option>
                            ${optionsHTML}
                        </select>
                        <label for="${fieldConfig.id}">${fieldConfig.label}</label>
                    </div>
                `;
                break;
            case 'checkbox':
            case 'radio':
                // Handle checkbox/radio groups differently
                break;
            default:
                fieldHTML = `
                    <div class="floating-label mb-6">
                        <input type="${fieldConfig.type}" ${commonAttributes}
                               class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition">
                        <label for="${fieldConfig.id}">${fieldConfig.label}</label>
                    </div>
                `;
        }

        return fieldHTML;
    }
}

// Initialize form handler
window.FormHandler = new FormHandler();