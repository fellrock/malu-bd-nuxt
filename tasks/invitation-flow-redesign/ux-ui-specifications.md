# UX/UI Design Specifications - Invitation Flow Redesign

## 🎨 Design Overview

### Design Principles
1. **Clarity First** - Users should always understand what action they're taking
2. **Confirmation Before Commitment** - Critical actions require explicit confirmation
3. **Mobile-First** - Primary design for mobile with desktop enhancements
4. **Glass-morphism Consistency** - Maintain existing visual design language
5. **Progressive Disclosure** - Show information when needed, avoid overwhelming users

---

## 📱 Page 1: Initial Invitation Landing (`[code].vue`)

### Current State: Simple redirect middleware
### New State: Full invitation landing page

### Layout Structure:
```
┌─────────────────────────────────────┐
│ 🎉 Maria Luiza faz 4 aninhos! 🎉   │ ← Header
├─────────────────────────────────────┤
│ Você foi convidado(a) para nossa    │ ← Subtitle
│ celebração especial                 │
├─────────────────────────────────────┤
│ 📅 Data: 30 de Agosto de 2025       │ ← Event Summary
│ 🕙 Horário: 10h às 14h              │   (Reused component)
│ 📍 Local: Quintal Cores             │
│ 🚗 Estacionamento: Ao longo da rua  │
├─────────────────────────────────────┤
│ [✅ Confirmar Dados]                │ ← Action Buttons
│ [❌ Recusar Convite]                │
└─────────────────────────────────────┘
```

### Visual Design:

**Header Section:**
```scss
.invitation-landing {
  .header {
    text-align: center;
    padding: 2rem 1rem;
    
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #F8FAFC;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 10px rgba(0,0,0,0.4);
      
      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }
    
    .subtitle {
      font-size: 1.1rem;
      color: #CBD5E1;
      margin: 0;
    }
  }
}
```

**Event Summary (Reused Component):**
- Same styling as current convite page
- Icons with responsive sizing
- Clean information hierarchy
- Mobile-optimized spacing

**Action Buttons:**
```scss
.invitation-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 1rem;
  max-width: 400px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    flex-direction: row;
    max-width: 600px;
  }
  
  .accept-btn {
    background: linear-gradient(135deg, #059669, #10B981);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    min-height: 3.5rem;
    
    &:hover {
      background: linear-gradient(135deg, #047857, #059669);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
    }
  }
  
  .reject-btn {
    background: linear-gradient(135deg, #DC2626, #EF4444);
    color: white;
    // ... similar styling to accept-btn
  }
}
```

### Interactive States:

**REGISTERED State (Default):**
- Both buttons visible and enabled
- Event information clearly displayed
- Loading state during API calls

**PENDING State:**
- Show "Redirecionando para completar dados..." message
- Automatic redirect to convite page
- No user interaction needed

**CONFIRMED State:**
- Show "Redirecionando para informações do evento..." message  
- Automatic redirect to event page
- No user interaction needed

**CANCELLED State:**
- Show cancellation acknowledgment message
- "Obrigado por responder" message
- No action buttons needed

**Loading State:**
- Disable buttons during API calls
- Show spinner on clicked button
- Prevent double-clicks

### User Flow:

1. **User lands on page** → See invitation details
2. **Check current status:**
   - **REGISTERED:** Show accept/reject buttons
   - **PENDING:** Auto-redirect to convite page for data completion
   - **CONFIRMED:** Auto-redirect to event page
   - **CANCELLED:** Show cancellation acknowledgment
3. **Click "Aceitar" (REGISTERED only)** → Update status to PENDING → Navigate to `/convite/[code]`
4. **Click "Recusar" (REGISTERED only)** → Show confirmation modal → Set status to CANCELLED
5. **Cancellation confirmed** → Show thank you modal

---

## 📝 Page 2: Data Collection (`/convite/[code].vue`)

### Current State: Immediate API submission
### New State: Draft mode with final confirmation (PENDING guests only)

### Access Control:
- **Only PENDING guests** can access this page
- **REGISTERED guests** → Redirected to main invitation page
- **CONFIRMED guests** → Redirected to event page
- **CANCELLED guests** → Redirected to access denied page

### Key Changes:

**Form Header:**
```
┌─────────────────────────────────────┐
│ 📝 Informações dos Convidados       │ ← New header
│ Complete os dados para finalizar    │ ← Updated instructions
│ sua confirmação                     │
├─────────────────────────────────────┤
│ ⚠️ Dados não salvos                  │ ← Draft indicator
└─────────────────────────────────────┘
```

**Form Footer (Updated):**
```
┌─────────────────────────────────────┐
│ Guest 1: [Name] [Email] [...]       │ ← Guest entries
│ Guest 2: [Name] [Email] [...]       │
│ Guest 3: [Name] [Email] [...]       │
│                                     │
│ [+ Adicionar Convidado]             │ ← Add button after last guest
├─────────────────────────────────────┤
│ [❌ Cancelar] [📤 Finalizar Confirmação] │ ← Action buttons
└─────────────────────────────────────┘
```

### New Visual Elements:

**Draft Mode Indicator:**
```scss
.draft-indicator {
  background: linear-gradient(135deg, #F59E0B20, #F59E0B15);
  border: 1px solid #F59E0B30;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .icon {
    color: #F59E0B;
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .text {
    color: #F59E0B;
    font-size: 0.9rem;
    font-weight: 500;
  }
}
```

**Updated Submit Button:**
```scss
.form-buttons {
  .submit-btn {
    background: linear-gradient(135deg, #3B82F6, #60A5FA);
    // Change from green (confirm) to blue (send data)
    
    .btn-text::before {
      content: "📤 ";
    }
  }
}
```

### Confirmation Modal:
```
┌─────────────────────────────────────┐
│ ✅ Finalizar Confirmação             │ ← Modal header
├─────────────────────────────────────┤
│ Verifique se as informações estão   │ ← Instructions
│ corretas:                           │
│                                     │
│ • Ana Silva (ana@email.com)         │ ← Guest summary
│ • Pedro Silva (6 anos, Menino)      │
│                                     │
│ Esta ação confirmará definitivamente│ ← Warning
│ sua presença no evento.             │
├─────────────────────────────────────┤
│ [❌ Cancelar] [✅ Confirmar e Finalizar] │ ← Modal actions
└─────────────────────────────────────┘
```

---

## 🎉 Page 3: Event Information (`/evento/[code].vue`)

### Current State: Immediate edit mode with API calls
### New State: Display mode with explicit edit mode (CONFIRMED guests only)

### Access Control:
- **Only CONFIRMED guests** can access this page
- **REGISTERED guests** → Redirected to main invitation page
- **PENDING guests** → Redirected to convite page
- **CANCELLED guests** → Redirected to access denied page

### Layout Changes:

**Guest List Header (New):**
```
┌─────────────────────────────────────┐
│ 👥 Convidados Confirmados           │ ← Header
│ [✏️ Editar Dados]                   │ ← Edit mode toggle
└─────────────────────────────────────┘
```

**Display Mode (Default):**
```
┌─────────────────────────────────────┐
│ • Ana Silva                         │ ← Read-only display
│   📧 ana@email.com                  │
│   🥗 Vegetariana                    │
│                                     │
│ • Pedro Silva                       │
│   👶 6 anos (Menino)                │
│   🥜 Alergia a amendoim             │
└─────────────────────────────────────┘
```

**Edit Mode (Toggled):**
```
┌─────────────────────────────────────┐
│ ⚠️ Modo de Edição Ativo              │ ← Edit indicator
├─────────────────────────────────────┤
│ [Nome: Ana Silva        ] [❌]      │ ← Editable fields
│ [Email: ana@email.com   ]           │
│ [Restrições: Vegetariana]           │
│                                     │
│ [❌ Cancelar] [💾 Salvar Alterações]│ ← Edit actions
└─────────────────────────────────────┘
```

### Visual Design:

**Edit Mode Toggle:**
```scss
.edit-mode-toggle {
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #7C3AED, #8B5CF6);
    transform: translateY(-1px);
  }
}
```

**Edit Mode Indicator:**
```scss
.edit-mode-indicator {
  background: linear-gradient(135deg, #F59E0B20, #F59E0B15);
  border: 1px solid #F59E0B30;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  
  .icon {
    color: #F59E0B;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }
  
  .text {
    color: #F59E0B;
    font-weight: 600;
  }
}
```

**Save Changes Button:**
```scss
.save-changes-btn {
  background: linear-gradient(135deg, #059669, #10B981);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 160px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

---

## 🔄 Interactive Components

### 1. Confirmation Modal Component
**Purpose:** Reusable confirmation dialog for all pages

**Props:**
```typescript
interface ConfirmationModalProps {
  show: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  type: 'warning' | 'info' | 'success' | 'danger'
  loading?: boolean
}
```

**Visual Variants:**
- **Warning:** Orange theme for data confirmations
- **Danger:** Red theme for destructive actions
- **Success:** Green theme for positive actions
- **Info:** Blue theme for informational dialogs

### 2. Draft Mode Indicator Component
**Purpose:** Show unsaved changes status

**States:**
- **Clean:** No indicator shown
- **Draft:** Yellow warning with save reminder
- **Saving:** Blue loading state
- **Error:** Red error state with retry option

### 3. Guest Form Component
**Purpose:** Reusable guest data entry form

**Features:**
- Real-time validation
- Mobile-optimized inputs
- Add/remove functionality
- Draft state management

---

## 📱 Mobile-Specific Considerations

### Touch Interactions:
- **Minimum button size:** 44px x 44px (iOS guideline)
- **Touch target spacing:** 8px minimum between buttons
- **Swipe gestures:** Consider swipe to delete for guest items

### Mobile Layout Adjustments:
```scss
@media (max-width: 768px) {
  .invitation-actions {
    .accept-btn, .reject-btn {
      font-size: 1rem;
      padding: 1.25rem 2rem;
    }
  }
  
  .form-buttons {
    flex-direction: column;
    gap: 1rem;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
  
  .guest-item {
    padding: 1.5rem 1rem;
    
    .guest-actions {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
}
```

### Mobile Input Improvements:
- **Input type optimization:** `type="email"`, `type="tel"`, etc.
- **Auto-complete attributes:** `autocomplete="name"`, `autocomplete="email"`
- **Input mode hints:** `inputmode="numeric"` for age fields
- **Virtual keyboard optimization:** Proper field types to show relevant keyboards

---

## 🎨 Animation and Transitions

### Page Transitions:
```scss
.page-enter-active, .page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
```

### Button Interactions:
```scss
.btn-interaction {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  &:active {
    transform: translateY(0);
    transition: all 0.1s ease;
  }
}
```

### Modal Animations:
```scss
.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
```

---

## ♿ Accessibility Considerations

### Keyboard Navigation:
- **Tab order:** Logical tab sequence through all interactive elements
- **Focus indicators:** Visible focus states for all focusable elements
- **Escape key:** Close modals and cancel operations

### Screen Reader Support:
```html
<!-- Proper ARIA labels -->
<button aria-label="Aceitar convite para festa da Maria Luiza">
  <CheckIcon aria-hidden="true" />
  Aceitar Convite
</button>

<!-- Form labels -->
<label for="guest-name">Nome completo</label>
<input id="guest-name" type="text" required>

<!-- Status announcements -->
<div aria-live="polite" class="sr-only">
  Dados salvos com sucesso
</div>
```

### Color Accessibility:
- **Contrast ratios:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Color indicators:** Never rely solely on color to convey information
- **Focus indicators:** High contrast focus rings

---

## 🧪 Testing Scenarios

### Visual Testing:
- [ ] All components render correctly on mobile (320px-768px)
- [ ] All components render correctly on desktop (768px+)
- [ ] Dark mode compatibility (if implemented)
- [ ] High contrast mode compatibility
- [ ] Text scaling up to 200%

### Interaction Testing:
- [ ] Touch targets are appropriately sized for mobile
- [ ] Hover states work correctly on desktop
- [ ] Focus management works with keyboard navigation
- [ ] Modal dialogs trap focus correctly
- [ ] Form validation provides clear feedback

### User Flow Testing:
- [ ] Complete invitation acceptance flow
- [ ] Complete invitation rejection flow
- [ ] Edit mode toggle and save functionality
- [ ] Error state handling and recovery
- [ ] Offline behavior (graceful degradation)

---

## 📊 Success Metrics

### User Experience Metrics:
- **Task completion rate:** % of users who complete invitation flow
- **Time to completion:** Average time from landing to confirmation
- **Error rate:** % of failed submissions due to validation
- **Mobile usage:** % of users completing flow on mobile devices

### Design Quality Metrics:
- **Accessibility score:** WAVE/axe-core audit results
- **Performance score:** Lighthouse performance audit
- **Mobile usability:** Google Mobile-Friendly test results
- **Cross-browser compatibility:** Testing across major browsers

This design specification ensures a cohesive, accessible, and user-friendly experience across all devices while maintaining the existing visual design language of the application.
