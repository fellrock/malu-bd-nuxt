<template>
  <div class="guest-form-container">
    <div class="guests-list">
      <div v-for="(guest, index) in guests" :key="guest.id || `new-${index}`" class="guest-item">
        <div class="guest-header">
          <input 
            v-model="guest.name" 
            type="text" 
            placeholder="Nome completo *"
            required
            class="guest-name-input"
            @input="onGuestChange"
          />
          <button 
            type="button" 
            @click="removeGuest(index)"                 
            class="remove-btn desktop-remove"
            v-if="guests.length > 1"
            title="Remover convidado"
          >
            <TrashIcon class="icon-sm" />
          </button>
        </div>

        <div class="guest-fields">
          <input 
            v-model="guest.email" 
            type="email" 
            placeholder="E-mail (opcional)"
            class="field-input"
            @input="onGuestChange"
          />
          
          <textarea 
            v-model="guest.dietary" 
            placeholder="Restrições alimentares (opcional)"
            class="field-textarea"
            rows="2"
            @input="onGuestChange"
          ></textarea>

          <div class="kid-section">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                :checked="!!guest.kidAge"
                @change="toggleKidFields(guest, $event)"
              />
              Criança
            </label>

            <div v-if="guest.kidAge !== null && guest.kidAge !== undefined" class="kid-fields">
              <input 
                v-model.number="guest.kidAge" 
                type="number" 
                placeholder="Idade da criança"
                min="0" 
                max="18"
                class="kid-input"
                @input="onGuestChange"
              />
              <select v-model="guest.maleKid" class="kid-select" @change="onGuestChange">
                <option value="">Sexo da criança</option>
                <option :value="true">Menino</option>
                <option :value="false">Menina</option>
              </select>
            </div>
          </div>

          <textarea 
            v-model="guest.notes" 
            placeholder="Observações (opcional)"
            class="field-textarea"
            rows="2"
            @input="onGuestChange"
          ></textarea>
        </div>
        
        <!-- Mobile remove button at bottom -->
        <div v-if="guests.length > 1" class="mobile-remove-container">
          <button 
            type="button" 
            @click="removeGuest(index)" 
            class="remove-btn mobile-remove"
            title="Remover convidado"
          >
            <TrashIcon class="icon-xs" /> 
            <span class="mobile-btn-text">Remover</span>
          </button>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" @click="addGuest" class="add-guest-btn">
        <PlusIcon class="icon-sm" /> 
        <span class="btn-text">Adicionar Convidado</span>
        <span class="btn-text-mobile">Adicionar</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'

// Define guest interface
interface Guest {
  id?: number
  name: string
  email?: string
  dietary?: string
  kidAge?: number | null
  maleKid?: boolean | null
  notes?: string
}

interface Props {
  modelValue: Guest[]
  allowAddRemove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowAddRemove: true
})

const emit = defineEmits<{
  'update:modelValue': [guests: Guest[]]
}>()

// Use computed for reactive guest list
const guests = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const addGuest = () => {
  if (!props.allowAddRemove) return
  
  const newGuest: Guest = {
    name: '',
    email: '',
    dietary: '',
    notes: ''
  }
  
  guests.value = [...guests.value, newGuest]
}

const removeGuest = (index: number) => {
  if (!props.allowAddRemove || guests.value.length <= 1) return
  
  const updatedGuests = [...guests.value]
  updatedGuests.splice(index, 1)
  guests.value = updatedGuests
}

const toggleKidFields = (guest: Guest, event: Event) => {
  const target = event.target as HTMLInputElement
  
  if (target.checked) {
    guest.kidAge = 0
    guest.maleKid = null
  } else {
    guest.kidAge = null
    guest.maleKid = null
  }
  
  onGuestChange()
}

const onGuestChange = () => {
  // Trigger reactivity update
  guests.value = [...guests.value]
}
</script>

<style scoped>
.guest-form-container {
  width: 100%;
}

.guests-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.guest-item {
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #64748B30;
  transition: all 0.3s ease;
}

.guest-item:hover {
  border-color: #64748B50;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.guest-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.guest-name-input {
  flex: 1;
  background: linear-gradient(145deg, #F8FAFC15, #E2E8F015);
  border: 1px solid #64748B40;
  border-radius: 12px;
  padding: 1rem;
  color: #F8FAFC;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.guest-name-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px #3B82F620;
  background: linear-gradient(145deg, #F8FAFC25, #E2E8F025);
}

.guest-name-input::placeholder {
  color: #CBD5E1;
  font-weight: 500;
}

.remove-btn {
  background: linear-gradient(145deg, #EF444450, #EF444430);
  border: 1px solid #EF444460;
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: linear-gradient(145deg, #EF444470, #EF444450);
  border-color: #EF444480;
  transform: translateY(-2px);
}

.desktop-remove {
  display: flex;
}

.mobile-remove-container {
  display: none;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #64748B30;
}

.guest-fields {
  display: grid;
  gap: 1rem;
}

.field-input,
.field-textarea {
  background: #64748B15;
  border: 1px solid #64748B40;
  border-radius: 8px;
  padding: 0.75rem;
  color: #F8FAFC;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  resize: vertical;
  transition: all 0.3s ease;
}

.field-input:focus,
.field-textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px #3B82F620;
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: #CBD5E1;
}

.kid-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #E2E8F0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #3B82F6;
}

.kid-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.kid-input,
.kid-select {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.75rem;
  color: #1e293b;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  transition: all 0.3s ease;
}

.kid-input::placeholder {
  color: #64748b;
}

.kid-input:focus,
.kid-select:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px #3B82F620;
  background: #ffffff;
}

.kid-select option {
  background: #ffffff;
  color: #1e293b;
}

.form-actions {
  margin: 2rem 0;
  text-align: center;
}

.add-guest-btn {
  background: linear-gradient(145deg, #10B98150, #06D6A030);
  border: 1px solid #10B98160;
  border-radius: 15px;
  padding: 1rem 2rem;
  color: #FFFFFF;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.add-guest-btn:hover {
  background: linear-gradient(145deg, #10B98170, #06D6A050);
  border-color: #10B98180;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.icon-sm {
  width: 0.875rem;
  height: 0.875rem;
}

.icon-xs {
  width: 0.75rem;
  height: 0.75rem;
}

.btn-text-mobile {
  display: none;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .guest-item {
    padding: 1.5rem;
  }
  
  .desktop-remove {
    display: none;
  }
  
  .mobile-remove-container {
    display: block;
  }
  
  .mobile-remove {
    background: linear-gradient(145deg, #EF444450, #EF444430);
    border: 1px solid #EF444460;
    border-radius: 12px;
    padding: 0.625rem 1rem;
    color: #FFFFFF;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    width: 100%;
  }
  
  .mobile-remove:hover {
    background: linear-gradient(145deg, #EF444470, #EF444450);
    border-color: #EF444480;
  }
  
  .btn-text {
    display: none;
  }
  
  .btn-text-mobile {
    display: inline;
  }
  
  .kid-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .guest-item {
    padding: 1rem;
  }
  
  .add-guest-btn {
    font-size: 0.8rem;
    padding: 0.625rem 0.875rem;
  }
}
</style>
