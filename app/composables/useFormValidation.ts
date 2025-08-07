import { ref, computed, reactive, watch } from 'vue'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  custom?: (value: any) => string | boolean
  message?: string
}

export interface FieldValidation {
  value: any
  rules: ValidationRule[]
  error: string
  touched: boolean
  valid: boolean
}

export interface UseFormValidationOptions {
  validateOnBlur?: boolean
  validateOnChange?: boolean
  showErrorsOnSubmit?: boolean
}

export function useFormValidation(options: UseFormValidationOptions = {}) {
  const {
    validateOnBlur = true,
    validateOnChange = false,
    showErrorsOnSubmit = true
  } = options

  const fields = reactive<Record<string, FieldValidation>>({})
  const isSubmitting = ref(false)
  const submitAttempted = ref(false)

  // Add a field to validation
  const addField = (
    name: string, 
    initialValue: any = '', 
    rules: ValidationRule[] = []
  ) => {
    fields[name] = {
      value: initialValue,
      rules,
      error: '',
      touched: false,
      valid: true
    }

    // Watch for changes if validateOnChange is enabled
    if (validateOnChange) {
      watch(
        () => fields[name]?.value,
        () => validateField(name),
        { deep: true }
      )
    }
  }

  // Validate a single field
  const validateField = (name: string): boolean => {
    const field = fields[name]
    if (!field) return true

    field.error = ''
    field.valid = true

    for (const rule of field.rules) {
      const error = checkRule(field.value, rule)
      if (error) {
        field.error = error
        field.valid = false
        return false
      }
    }

    return true
  }

  // Check a specific rule
  const checkRule = (value: any, rule: ValidationRule): string => {
    // Required check
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rule.message || 'Este campo é obrigatório'
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return ''
    }

    // Min length check
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `Mínimo de ${rule.minLength} caracteres`
    }

    // Max length check
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Máximo de ${rule.maxLength} caracteres`
    }

    // Email validation
    if (rule.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return rule.message || 'Email inválido'
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || 'Formato inválido'
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value)
      if (typeof result === 'string') {
        return result
      }
      if (result === false) {
        return rule.message || 'Valor inválido'
      }
    }

    return ''
  }

  // Validate all fields
  const validateAll = (): boolean => {
    let isValid = true
    
    for (const name in fields) {
      const fieldValid = validateField(name)
      if (!fieldValid) {
        isValid = false
      }
    }

    return isValid
  }

  // Mark field as touched
  const touchField = (name: string) => {
    if (fields[name]) {
      fields[name].touched = true
      if (validateOnBlur) {
        validateField(name)
      }
    }
  }

  // Update field value
  const updateField = (name: string, value: any) => {
    if (fields[name]) {
      fields[name].value = value
    }
  }

  // Reset form
  const reset = () => {
    for (const name in fields) {
      if (fields[name]) {
        fields[name].error = ''
        fields[name].touched = false
        fields[name].valid = true
      }
    }
    submitAttempted.value = false
  }

  // Handle form submission
  const handleSubmit = async (onSubmit: () => Promise<void> | void) => {
    submitAttempted.value = true
    isSubmitting.value = true

    try {
      // Mark all fields as touched if showing errors on submit
      if (showErrorsOnSubmit) {
        for (const name in fields) {
          if (fields[name]) {
            fields[name].touched = true
          }
        }
      }

      const isValid = validateAll()
      
      if (isValid) {
        await onSubmit()
      }
    } finally {
      isSubmitting.value = false
    }
  }

  // Computed properties
  const isFormValid = computed(() => {
    return Object.values(fields).every(field => field.valid)
  })

  const hasErrors = computed(() => {
    return Object.values(fields).some(field => field.error && field.touched)
  })

  const formData = computed(() => {
    const data: Record<string, any> = {}
    for (const name in fields) {
      if (fields[name]) {
        data[name] = fields[name].value
      }
    }
    return data
  })

  // Get field validation state for UI
  const getFieldProps = (name: string) => {
    const field = fields[name]
    if (!field) return {}

    return {
      value: field.value,
      error: field.touched ? field.error : '',
      hasError: field.touched && !!field.error,
      isValid: field.touched && field.valid,
      onBlur: () => touchField(name),
      onInput: (value: any) => updateField(name, value)
    }
  }

  // Get field CSS classes for styling
  const getFieldClass = (name: string) => {
    const field = fields[name]
    if (!field || !field.touched) return ''

    return field.valid ? 'success' : 'error'
  }

  return {
    // State
    fields,
    isSubmitting,
    submitAttempted,
    
    // Computed
    isFormValid,
    hasErrors,
    formData,
    
    // Methods
    addField,
    validateField,
    validateAll,
    touchField,
    updateField,
    reset,
    handleSubmit,
    getFieldProps,
    getFieldClass
  }
}

// Preset validation rules
export const validationRules = {
  required: (): ValidationRule => ({ required: true }),
  
  email: (): ValidationRule => ({ 
    email: true, 
    message: 'Insira um email válido' 
  }),
  
  minLength: (min: number): ValidationRule => ({ 
    minLength: min, 
    message: `Mínimo de ${min} caracteres` 
  }),
  
  maxLength: (max: number): ValidationRule => ({ 
    maxLength: max, 
    message: `Máximo de ${max} caracteres` 
  }),
  
  name: (): ValidationRule => ({
    required: true,
    minLength: 2,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    message: 'Nome deve conter apenas letras e espaços'
  }),
  
  phone: (): ValidationRule => ({
    pattern: /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}[-\s]?\d{4})$/,
    message: 'Formato: (11) 99999-9999'
  }),
  
  age: (min: number = 0, max: number = 150): ValidationRule => ({
    custom: (value: any) => {
      const num = parseInt(value)
      if (isNaN(num)) return 'Idade deve ser um número'
      if (num < min || num > max) return `Idade deve estar entre ${min} e ${max} anos`
      return true
    }
  })
}
