<template>
  <div class="form-field" :class="fieldStateClass">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="fieldId" 
      class="form-label"
      :class="{ required: required }"
    >
      {{ label }}
      <span v-if="required" class="required-indicator" aria-label="obrigatório">*</span>
    </label>

    <!-- Input Field -->
    <div class="form-input-wrapper">
      <!-- Text Input -->
      <input 
        v-if="type === 'text' || type === 'email' || type === 'tel' || type === 'number'"
        :id="fieldId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        class="form-input"
        :class="inputClass"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Textarea -->
      <textarea 
        v-else-if="type === 'textarea'"
        :id="fieldId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        class="form-input form-textarea"
        :class="inputClass"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      ></textarea>

      <!-- Select -->
      <select 
        v-else-if="type === 'select'"
        :id="fieldId"
        :value="modelValue"
        :disabled="disabled"
        class="form-input form-select"
        :class="inputClass"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option value="" disabled>{{ placeholder || 'Selecione...' }}</option>
        <option 
          v-for="option in options" 
          :key="String(option.value)" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Radio Group -->
      <div v-else-if="type === 'radio'" class="form-radio-group">
        <div 
          v-for="option in options" 
          :key="String(option.value)" 
          class="form-radio-item"
        >
          <input 
            :id="`${fieldId}-${option.value}`"
            type="radio"
            :name="name || fieldId"
            :value="option.value"
            :checked="modelValue === option.value"
            :disabled="disabled"
            class="form-radio"
            @change="handleRadioChange"
          />
          <label 
            :for="`${fieldId}-${option.value}`" 
            class="form-radio-label"
          >
            {{ option.label }}
          </label>
        </div>
      </div>

      <!-- Checkbox -->
      <div v-else-if="type === 'checkbox'" class="form-checkbox-wrapper">
        <input 
          :id="fieldId"
          type="checkbox"
          :checked="modelValue"
          :disabled="disabled"
          class="form-checkbox"
          @change="handleCheckboxChange"
        />
        <label :for="fieldId" class="form-checkbox-label">
          <slot name="checkbox-label">{{ checkboxLabel }}</slot>
        </label>
      </div>

      <!-- Input Icons -->
      <div v-if="showIcon" class="form-input-icon">
        <Icon 
          v-if="hasError" 
          name="exclamation-circle" 
          class="icon-error" 
          size="16"
        />
        <Icon 
          v-else-if="isValid && touched" 
          name="check-circle" 
          class="icon-success" 
          size="16"
        />
        <Icon 
          v-else-if="icon" 
          :name="icon" 
          class="icon-default" 
          size="16"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="form-loading">
        <div class="loading-spinner"></div>
      </div>
    </div>

    <!-- Help Text -->
    <div v-if="helpText && !hasError" class="form-help">
      {{ helpText }}
    </div>

    <!-- Error Message -->
    <div v-if="hasError" class="form-error" role="alert">
      <Icon name="exclamation-circle" size="14" />
      {{ error }}
    </div>

    <!-- Character Count -->
    <div 
      v-if="showCharCount && (type === 'text' || type === 'textarea')" 
      class="form-char-count"
      :class="{ 'char-count-warning': isNearLimit }"
    >
      {{ charCount }}{{ maxLength ? `/${maxLength}` : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue?: any
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox'
  label?: string
  placeholder?: string
  helpText?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  loading?: boolean
  
  // Input specific
  autocomplete?: string
  inputmode?: 'text' | 'search' | 'email' | 'url' | 'none' | 'tel' | 'numeric' | 'decimal'
  maxLength?: number
  
  // Textarea specific
  rows?: number
  
  // Select/Radio specific
  options?: Option[]
  name?: string
  
  // Checkbox specific
  checkboxLabel?: string
  
  // Visual
  icon?: string
  showIcon?: boolean
  showCharCount?: boolean
  
  // Validation states
  hasError?: boolean
  isValid?: boolean
  touched?: boolean
  
  // Styling
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'filled'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  rows: 3,
  showIcon: true,
  showCharCount: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'blur': [event: Event]
  'focus': [event: Event]
  'change': [value: any]
}>()

// Generate unique ID for form field
const fieldId = computed(() => useId())

// Character count
const charCount = computed(() => {
  if (typeof props.modelValue === 'string') {
    return props.modelValue.length
  }
  return 0
})

const isNearLimit = computed(() => {
  return props.maxLength && charCount.value > props.maxLength * 0.8
})

// CSS classes
const fieldStateClass = computed(() => ({
  'form-field--error': props.hasError,
  'form-field--success': props.isValid && props.touched,
  'form-field--disabled': props.disabled,
  'form-field--loading': props.loading,
  [`form-field--${props.size}`]: true,
  [`form-field--${props.variant}`]: true
}))

const inputClass = computed(() => ({
  'form-input--error': props.hasError,
  'form-input--success': props.isValid && props.touched,
  'form-input--with-icon': props.showIcon && (props.icon || props.hasError || (props.isValid && props.touched))
}))

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  let value = target.value
  
  // Enforce max length
  if (props.maxLength && value.length > props.maxLength) {
    value = value.substring(0, props.maxLength)
    target.value = value
  }
  
  emit('update:modelValue', value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', target.value)
}

const handleRadioChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('change', target.value)
}

const handleCheckboxChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked)
}

const handleBlur = (event: Event) => {
  emit('blur', event)
}

const handleFocus = (event: Event) => {
  emit('focus', event)
}
</script>

<style scoped>
.form-field {
  position: relative;
  margin-bottom: var(--spacing-md);
}

/* Labels */
.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.5;
}

.required-indicator {
  color: var(--color-danger);
  margin-left: 2px;
}

/* Input Wrapper */
.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Base Input Styles */
.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--text-base);
  line-height: 1.5;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-alpha);
    background: var(--color-surface-elevated);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--color-surface-disabled);
  }
}

/* Input with icon spacing */
.form-input--with-icon {
  padding-right: 2.5rem;
}

/* Input States */
.form-input--error {
  border-color: var(--color-danger);
  
  &:focus {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px var(--color-danger-alpha);
  }
}

.form-input--success {
  border-color: var(--color-success);
}

/* Textarea */
.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Select */
.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Radio Group */
.form-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-radio-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.form-radio {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
}

.form-radio-label {
  margin: 0;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: var(--text-base);
}

/* Checkbox */
.form-checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.form-checkbox {
  width: 16px;
  height: 16px;
  margin: 0;
  margin-top: 2px;
  cursor: pointer;
}

.form-checkbox-label {
  margin: 0;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  line-height: 1.5;
}

/* Icons */
.form-input-icon {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.icon-error {
  color: var(--color-danger);
}

.icon-success {
  color: var(--color-success);
}

.icon-default {
  color: var(--color-text-tertiary);
}

/* Loading */
.form-loading {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Help Text */
.form-help {
  margin-top: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

/* Error Message */
.form-error {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-danger);
  line-height: 1.4;
}

/* Character Count */
.form-char-count {
  margin-top: var(--spacing-xs);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  text-align: right;
}

.char-count-warning {
  color: var(--color-warning);
}

/* Size Variants */
.form-field--sm .form-input {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-sm);
}

.form-field--lg .form-input {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--text-lg);
}

/* Style Variants */
.form-field--minimal .form-input {
  border: none;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  background: transparent;
  
  &:focus {
    border-bottom-color: var(--color-primary);
    box-shadow: none;
  }
}

.form-field--filled .form-input {
  border: none;
  background: var(--color-surface-elevated);
  
  &:focus {
    background: var(--color-surface);
    box-shadow: 0 0 0 1px var(--color-primary);
  }
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .form-radio-group {
    gap: var(--spacing-xs);
  }
  
  .form-field--sm .form-input,
  .form-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .form-select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%9ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .form-input,
  .loading-spinner {
    transition: none;
    animation: none;
  }
}
</style>
