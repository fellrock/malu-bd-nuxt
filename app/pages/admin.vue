<template>
  <div class="admin-container">
    <div class="header">
      <h1 class="title">Admin - Lista de Convidados</h1>
      <p class="subtitle">Maria Luiza 4 Anos</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>{{ stats.totalGuests }}</h3>
        <p>Total de Convidados</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.totalGroups }}</h3>
        <p>Grupos/Famílias</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.confirmedGuests }}</h3>
        <p>Confirmados</p>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="openAddGuestModal" class="action-btn add-btn">
        ➕ Adicionar Convidado
      </button>
      <button @click="showImportModal = true" class="action-btn import-btn">
        📋 Importar Excel
      </button>
      <button @click="exportData" class="action-btn export-btn" :disabled="loading">
        📊 Exportar Dados
      </button>
    </div>

    <div class="table-container">
      <div class="table-header">
        <h2>Lista de Confirmações</h2>
        <button @click="refreshData" class="refresh-btn" :disabled="loading">
          {{ loading ? 'Atualizando...' : '🔄 Atualizar' }}
        </button>
      </div>
      
      <div v-if="loading" class="loading">
        <p>Carregando dados...</p>
      </div>

      <div v-else-if="groupedGuests.length === 0" class="empty-state">
        <p>Nenhum convidado encontrado.</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="guests-table">
          <thead>
            <tr>
              <th>Referência</th>
              <th>Categoria</th>
              <th>Código</th>
              <th>Convidados</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="group in groupedGuests" :key="group.referenceCode">
              <tr @click="toggleGroupDetails(group.referenceCode)" class="group-row">
                <td><strong>{{ group.referenceCode }}</strong></td>
                <td><span class="category-badge" :class="group.category">{{ group.category }}</span></td>
                <td><span class="invite-code">{{ group.inviteCode }}</span></td>
                <td><span class="guest-count">{{ group.guests.length }}</span></td>
                <td>{{ new Date(group.guests[0]?.createdAt).toLocaleDateString('pt-BR') }}</td>
              </tr>
              <!-- Guest details row -->
              <tr v-if="expandedGroups.includes(group.referenceCode)" class="details-row">
                <td colspan="5">
                  <div class="guest-details">
                    <div v-for="guest in group.guests" :key="guest.id" class="guest-detail-item">
                      <div class="guest-info">
                        <span class="guest-name">{{ guest.name }}</span>
                        <span v-if="guest.email" class="guest-email">{{ guest.email }}</span>
                        <span v-if="guest.kidAge" class="kid-info">Criança: {{ guest.kidAge }} anos ({{ guest.maleKid ? 'Menino' : 'Menina' }})</span>
                        <span v-if="guest.dietary" class="dietary">Restrições: {{ guest.dietary }}</span>
                        <span class="status-badge" :class="guest.status.toLowerCase()">{{ guest.status }}</span>
                      </div>
                      <button @click="editGuest(guest)" class="edit-guest-btn">
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="nav-section">
        <a href="/" class="nav-button">
          🏠 Voltar ao Início
        </a>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Importar Convidados via Excel</h3>
          <button @click="showImportModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="import-instructions">
            <p><strong>📋 Importação de Convidados via Excel</strong></p>
            <p>Selecione um arquivo Excel (.xlsx) com as seguintes colunas obrigatórias:</p>
            <ul class="excel-columns">
              <li><code>name</code> - Nome do convidado (obrigatório)</li>
              <li><code>category</code> - Categoria: Amigos, Creche, Familia, ou Padrinhos (obrigatório)</li>
              <li><code>referenceCode</code> - Código de referência da família (obrigatório)</li>
              <li><code>email</code> - Email do convidado (opcional)</li>
              <li><code>kidAge</code> - Idade da criança, se aplicável (opcional)</li>
              <li><code>maleKid</code> - Sexo da criança: true para menino, false para menina (opcional)</li>
              <li><code>dietary</code> - Restrições alimentares (opcional)</li>
              <li><code>notes</code> - Observações adicionais (opcional)</li>
            </ul>
            
            <div class="template-section">
              <p><strong>💡 Dica:</strong> Baixe o modelo Excel para facilitar a importação:</p>
              <button @click="downloadExcelTemplate" class="template-btn">
                📥 Baixar Modelo Excel
              </button>
            </div>
          </div>
          
          <div class="file-upload-section">
            <label for="excelFile" class="file-label">Selecionar arquivo Excel:</label>
            <input type="file" @change="handleFileSelect" accept=".xlsx" ref="fileInput" id="excelFile" class="file-input" />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showImportModal = false" class="cancel-btn">Cancelar</button>
          <button @click="importData" :disabled="!selectedFile || importing" class="import-btn">
            {{ importing ? 'Importando Excel...' : 'Importar Excel' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Guest Modal -->
    <div v-if="showAddGuestModal" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Adicionar Convidado</h3>
          <button @click="showAddGuestModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="addName">Nome *</label>
            <input v-model="newGuest.name" id="addName" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="addEmail">Email</label>
            <input v-model="newGuest.email" id="addEmail" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label for="addCategory">Categoria *</label>
            <select v-model="newGuest.category" id="addCategory" class="form-select" required>
              <option value="Familia">Família</option>
              <option value="Amigos">Amigos</option>
              <option value="Creche">Creche</option>
              <option value="Padrinhos">Padrinhos</option>
            </select>
          </div>
          <div class="form-group">
            <label for="addReferenceCode">Código de Referência *</label>
            <input v-model="newGuest.referenceCode" @input="updateInviteCodePreview" id="addReferenceCode" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="addInviteCode">Código do Convite (automático por família)</label>
            <input v-model="newGuest.inviteCode" id="addInviteCode" type="text" class="form-input" readonly placeholder="Código compartilhado por família" />
          </div>
          
          <!-- Kid information section -->
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="newGuest.isKid" type="checkbox" class="form-checkbox" />
              Criança
            </label>
          </div>
          
          <div v-if="newGuest.isKid" class="kid-section">
            <div class="form-group">
              <label for="addKidAge">Idade da Criança *</label>
              <input v-model.number="newGuest.kidAge" id="addKidAge" type="number" class="form-input" min="0" max="12" />
            </div>
            <div class="form-group">
              <label for="addMaleKid">Sexo da Criança *</label>
              <select v-model="newGuest.maleKid" id="addMaleKid" class="form-select">
                <option :value="false">Menina</option>
                <option :value="true">Menino</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="addDietary">Restrições Alimentares</label>
            <textarea v-model="newGuest.dietary" id="addDietary" class="form-textarea" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label for="addNotes">Observações</label>
            <textarea v-model="newGuest.notes" id="addNotes" class="form-textarea" rows="2"></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showAddGuestModal = false" class="cancel-btn">Cancelar</button>
          <button @click="addGuest" :disabled="!newGuest.name || !newGuest.category || !newGuest.referenceCode || (newGuest.isKid && !newGuest.kidAge) || loading" class="add-btn">
            {{ loading ? 'Adicionando...' : 'Adicionar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Guest Modal -->
    <div v-if="showEditGuestModal" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar Convidado</h3>
          <button @click="showEditGuestModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body" v-if="editingGuest">
          <div class="form-group">
            <label for="editName">Nome *</label>
            <input v-model="editingGuest.name" id="editName" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="editEmail">Email</label>
            <input v-model="editingGuest.email" id="editEmail" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label for="editCategory">Categoria *</label>
            <select v-model="editingGuest.category" id="editCategory" class="form-select" required>
              <option value="Familia">Família</option>
              <option value="Amigos">Amigos</option>
              <option value="Creche">Creche</option>
              <option value="Padrinhos">Padrinhos</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editReferenceCode">Código de Referência *</label>
            <input v-model="editingGuest.referenceCode" id="editReferenceCode" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="editInviteCode">Código do Convite *</label>
            <input v-model="editingGuest.inviteCode" id="editInviteCode" type="text" class="form-input" required />
          </div>
          
          <!-- Kid information section -->
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="editingGuest.isKid" type="checkbox" class="form-checkbox" />
                Criança
            </label>
          </div>
          
          <div v-if="editingGuest.isKid" class="kid-section">
            <div class="form-group">
              <label for="editKidAge">Idade da Criança *</label>
              <input v-model.number="editingGuest.kidAge" id="editKidAge" type="number" class="form-input" min="0" max="12" />
            </div>
            <div class="form-group">
              <label for="editMaleKid">Sexo da Criança *</label>
              <select v-model="editingGuest.maleKid" id="editMaleKid" class="form-select">
                <option :value="false">Menina</option>
                <option :value="true">Menino</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="editStatus">Status</label>
            <select v-model="editingGuest.status" id="editStatus" class="form-select">
              <option value="REGISTERED">Registrado</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="ATTENDED">Compareceu</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editDietary">Restrições Alimentares</label>
            <textarea v-model="editingGuest.dietary" id="editDietary" class="form-textarea" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label for="editNotes">Observações</label>
            <textarea v-model="editingGuest.notes" id="editNotes" class="form-textarea" rows="2"></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showEditGuestModal = false" class="cancel-btn">Cancelar</button>
          <button @click="updateGuest" :disabled="!editingGuest?.name || (editingGuest?.isKid && !editingGuest?.kidAge) || loading" class="save-btn">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Creator Reference -->
    <div class="creator-reference">
      <p>Desenvolvido por <a href="https://www.kravela.cloud" target="_blank" rel="noopener noreferrer">Kravela Cloud LTDA</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'

const guests = ref<any[]>([])
const groupedGuests = ref<any[]>([])
const stats = ref({ totalGuests: 0, totalGroups: 0, confirmedGuests: 0 })
const loading = ref(false)
const expandedGroups = ref<string[]>([])
const showImportModal = ref(false)
const showAddGuestModal = ref(false)
const showEditGuestModal = ref(false)
const selectedFile = ref<File | null>(null)
const importing = ref(false)
const fileInput = ref<HTMLInputElement>()
const editingGuest = ref<any>(null)

// Function to open add guest modal and generate preview code
const openAddGuestModal = () => {
  resetNewGuest()
  showAddGuestModal.value = true
}

const newGuest = ref({
  name: '',
  email: '',
  category: 'Familia',
  referenceCode: '',
  inviteCode: '',
  isKid: false,
  kidAge: null,
  maleKid: false,
  dietary: '',
  notes: ''
})

async function fetchGuests() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/guests')
    if (res.success) {
      guests.value = res.guests
      groupedGuests.value = res.groupedGuests
      stats.value = res.stats
    }
  } catch (err) {
    console.error('Error fetching guests:', err)
  } finally {
    loading.value = false
  }
}

function refreshData() {
  fetchGuests()
}

function toggleGroupDetails(referenceCode: string) {
  const index = expandedGroups.value.indexOf(referenceCode)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(referenceCode)
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0] || null
  }
}

async function importData() {
  if (!selectedFile.value) return
  
  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    const res: any = await $fetch('/api/import-guests', {
      method: 'POST',
      body: formData
    })
    
    if (res.success) {
      showImportModal.value = false
      selectedFile.value = null
      if (fileInput.value) fileInput.value.value = ''
      await fetchGuests()
      // Show success message
    }
  } catch (err) {
    console.error('Error importing data:', err)
    // Show error message
  } finally {
    importing.value = false
  }
}

async function exportData() {
  try {
    loading.value = true
    
    // Fetch Excel content directly
    const response = await fetch('/api/export-guests')
    
    if (!response.ok) {
      throw new Error('Export failed')
    }
    
    // Get Excel content as blob
    const blob = await response.blob()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `convidados-${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
  } catch (err) {
    console.error('Error exporting data:', err)
    // Show error message
  } finally {
    loading.value = false
  }
}

async function addGuest() {
  try {
    loading.value = true
    
    // Always generate a new invite code
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    // Prepare guest data - only include kid fields if hasKid is true
    const guestData: any = {
      name: newGuest.value.name,
      email: newGuest.value.email,
      category: newGuest.value.category,
      referenceCode: newGuest.value.referenceCode,
      inviteCode: generatedCode,
      dietary: newGuest.value.dietary,
      notes: newGuest.value.notes,
      status: 'REGISTERED'
    }
    
    // Only add kid fields if isKid is checked
    if (newGuest.value.isKid && newGuest.value.kidAge) {
      guestData.kidAge = newGuest.value.kidAge
      guestData.maleKid = newGuest.value.maleKid
    }
    
    const res: any = await $fetch('/api/guests', {
      method: 'POST',
      body: guestData
    })
    
    if (res.success) {
      showAddGuestModal.value = false
      resetNewGuest()
      await fetchGuests()
    }
  } catch (err) {
    console.error('Error adding guest:', err)
  } finally {
    loading.value = false
  }
}

function editGuest(guest: any) {
  editingGuest.value = { 
    ...guest,
    isKid: !!(guest.kidAge && guest.kidAge > 0) // Set isKid based on existing kidAge
  }
  showEditGuestModal.value = true
}

async function updateGuest() {
  try {
    loading.value = true
    
    // Prepare update data - clear kid fields if isKid is false
    const updateData = { ...editingGuest.value }
    
    if (!updateData.isKid) {
      updateData.kidAge = null
      updateData.maleKid = false
    }
    
    // Remove isKid from the data sent to API as it's not in the database schema
    delete updateData.isKid
    
    const res: any = await $fetch(`/api/guests/${editingGuest.value.id}`, {
      method: 'PUT',
      body: updateData
    })
    
    if (res.success) {
      showEditGuestModal.value = false
      editingGuest.value = null
      await fetchGuests()
    }
  } catch (err) {
    console.error('Error updating guest:', err)
  } finally {
    loading.value = false
  }
}

function resetNewGuest() {
  const previewCode = Math.random().toString(36).substring(2, 8).toUpperCase()
  newGuest.value = {
    name: '',
    email: '',
    category: 'Familia',
    referenceCode: '',
    inviteCode: previewCode, // Show preview of what will be generated
    isKid: false,
    kidAge: null,
    maleKid: false,
    dietary: '',
    notes: ''
  }
}

// Function to update invite code preview when reference code changes
const updateInviteCodePreview = () => {
  if (newGuest.value.referenceCode) {
    // Look for existing guest with same reference code
    const existingGroup = groupedGuests.value.find(group => 
      group.referenceCode === newGuest.value.referenceCode
    )
    
    if (existingGroup) {
      // Reuse existing invite code
      newGuest.value.inviteCode = existingGroup.inviteCode
    } else {
      // Generate new preview code
      newGuest.value.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    }
  }
}

// Function to download Excel template
const downloadExcelTemplate = () => {
  const sampleData = [
    {
      name: 'João Silva',
      category: 'Familia',
      referenceCode: 'Família Silva',
      email: 'joao@email.com',
      kidAge: 5,
      maleKid: true,
      dietary: 'Sem lactose',
      notes: 'Pai da aniversariante'
    },
    {
      name: 'Maria Silva',
      category: 'Familia',
      referenceCode: 'Família Silva',
      email: 'maria@email.com',
      dietary: 'Vegetariana',
      notes: 'Mãe da aniversariante'
    },
    {
      name: 'Pedro Santos',
      category: 'Amigos',
      referenceCode: 'Família Santos',
      email: 'pedro@email.com',
      kidAge: 4,
      maleKid: true,
      notes: 'Amigo da escola'
    },
    {
      name: 'Ana Costa',
      category: 'Creche',
      referenceCode: 'Professoras Creche',
      email: 'ana@creche.com',
      notes: 'Professora da turma'
    },
    {
      name: 'Carlos Oliveira',
      category: 'Padrinhos',
      referenceCode: 'Padrinhos',
      email: 'carlos@email.com',
      notes: 'Padrinho da Maria Luiza'
    }
  ]

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(sampleData)
  XLSX.utils.book_append_sheet(wb, ws, 'Guests')
  const buffer = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array',
    codepage: 28591
  })

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'modelo-convidados.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  fetchGuests()
})

useHead({
  title: 'Admin - Maria Luiza 4 Anos'
})
</script>

<style scoped>
/* Universal box-sizing for better layout control */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Base styles */
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A, #1E293B);
  color: #F8FAFC;
  padding: 2rem;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.2rem;
  color: #94A3B8;
  margin: 0;
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(145deg, #1E293B, #334155);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #64748B30;
  box-shadow: 0 10px 25px #00000030;
}

.stat-card h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #3B82F6;
}

.stat-card p {
  color: #94A3B8;
  margin: 0;
  font-weight: 500;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.action-btn {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: #FFFFFF;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  white-space: nowrap;
}

.action-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563EB, #1E40AF);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #3B82F640;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.add-btn {
  background: linear-gradient(135deg, #10B981, #059669);
}

.add-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 10px 25px #10B98140;
}

.export-btn {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
}

.export-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  box-shadow: 0 10px 25px #8B5CF640;
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Table container */
.table-container {
  background: linear-gradient(145deg, #1E293B, #334155);
  border-radius: 20px;
  border: 1px solid #64748B30;
  overflow: hidden;
  box-shadow: 0 25px 50px #00000040;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #64748B30;
}

.table-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #F8FAFC;
}

.refresh-btn {
  background: linear-gradient(135deg, #64748B, #475569);
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #475569, #334155);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading and empty states */
.loading, .empty-state {
  padding: 3rem;
  text-align: center;
  color: #94A3B8;
}

/* Table styles */
.table-wrapper {
  overflow-x: auto;
}

.guests-table {
  width: 100%;
  border-collapse: collapse;
}

.guests-table th {
  background: linear-gradient(135deg, #334155, #475569);
  color: #F8FAFC;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid #64748B30;
}

.guests-table td {
  padding: 1rem;
  border-bottom: 1px solid #64748B20;
  vertical-align: top;
}

.group-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.group-row:hover {
  background: #64748B10;
}

.details-row {
  background: #0F172A50;
}

/* Guest details */
.guest-details {
  padding: 1rem 0;
}

.guest-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #1E293B30;
  border-radius: 8px;
  border: 1px solid #64748B20;
}

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
}

.guest-name {
  font-weight: 600;
  color: #F8FAFC;
  font-size: 1rem;
}

.guest-email {
  color: #94A3B8;
  font-size: 0.9rem;
}

.kid-info {
  color: #A855F7;
  font-size: 0.85rem;
  font-weight: 500;
}

.dietary {
  color: #F59E0B;
  font-size: 0.85rem;
  font-style: italic;
}

.edit-guest-btn {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: #FFFFFF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-left: 1rem;
}

.edit-guest-btn:hover {
  background: linear-gradient(135deg, #2563EB, #1E40AF);
  transform: translateY(-1px);
  box-shadow: 0 5px 15px #3B82F630;
}

/* Badges */
.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.category-badge.Familia { background: #10B98130; color: #10B981; border: 1px solid #10B98140; }
.category-badge.Amigos { background: #3B82F630; color: #3B82F6; border: 1px solid #3B82F640; }
.category-badge.Creche { background: #F59E0B30; color: #F59E0B; border: 1px solid #F59E0B40; }
.category-badge.Padrinhos { background: #A855F730; color: #A855F7; border: 1px solid #A855F740; }

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.registered { background: #64748B30; color: #64748B; border: 1px solid #64748B40; }
.status-badge.confirmed { background: #10B98130; color: #10B981; border: 1px solid #10B98140; }
.status-badge.attended { background: #8B5CF630; color: #8B5CF6; border: 1px solid #8B5CF640; }

.invite-code {
  font-family: 'Courier New', monospace;
  background: #64748B20;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #E2E8F0;
}

.guest-count {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: #FFFFFF;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Navigation */
.nav-section {
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid #64748B30;
}

.nav-button {
  display: inline-block;
  background: linear-gradient(135deg, #64748B, #475569);
  color: #FFFFFF;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: linear-gradient(135deg, #475569, #334155);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px #64748B40;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #00000080;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(145deg, #1E293B, #334155);
  border-radius: 20px;
  border: 1px solid #64748B30;
  box-shadow: 0 25px 50px #00000040;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #64748B30;
}

.modal-header h3 {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #F8FAFC;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #94A3B8;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #64748B30;
  color: #F8FAFC;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

.form-group {
  margin-bottom: 1rem;
  box-sizing: border-box;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #E2E8F0;
  font-weight: 600;
  box-sizing: border-box;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background: #64748B15;
  border: 1px solid #64748B40;
  border-radius: 8px;
  padding: 0.75rem;
  color: #F8FAFC;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px #3B82F620;
}

/* Checkbox styles */
.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0 !important;
}

.form-checkbox {
  width: auto !important;
  margin: 0;
  accent-color: #3B82F6;
  transform: scale(1.2);
}

/* Kid section styles */
.kid-section {
  background: #64748B10;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #64748B20;
  margin-bottom: 1rem;
  box-sizing: border-box;
  width: 100%;
}

/* Import modal styles */
.import-instructions {
  background: #64748B10;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #64748B20;
}

.excel-columns {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.excel-columns li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #64748B20;
  font-size: 0.9rem;
}

.excel-columns li:last-child {
  border-bottom: none;
}

.excel-columns code {
  background: #3B82F620;
  color: #3B82F6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.template-section {
  background: #10B98110;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid #10B98120;
}

.template-btn {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #FFFFFF;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.template-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 5px 15px #10B98130;
}

.file-upload-section {
  border: 2px dashed #64748B40;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  background: #64748B05;
}

.file-label {
  display: block;
  margin-bottom: 1rem;
  color: #E2E8F0;
  font-weight: 600;
  font-size: 1rem;
}

.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #64748B40;
  border-radius: 8px;
  background: #64748B15;
  color: #F8FAFC;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #64748B30;
  justify-content: flex-end;
}

.cancel-btn {
  background: linear-gradient(135deg, #64748B, #475569);
  color: #FFFFFF;
  border: 1px solid #64748B40;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #475569, #334155);
  transform: translateY(-1px);
}

.import-btn, .save-btn {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  color: #FFFFFF;
  border: 1px solid #3B82F640;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.import-btn:hover:not(:disabled), .save-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563EB, #1E40AF);
  transform: translateY(-1px);
  box-shadow: 0 10px 25px #3B82F640;
}

.import-btn:disabled, .save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .guests-table th,
  .guests-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .guest-detail-item {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .edit-guest-btn {
    margin-left: 0;
    align-self: flex-start;
  }
  
  .modal-content {
    width: 95%;
    max-width: none;
    margin: 0;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-actions {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .kid-section {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-content {
    width: 100%;
    max-height: 98vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-actions {
    padding: 0.75rem;
  }
  
  .kid-section {
    padding: 0.5rem;
  }
}

.creator-reference {
  margin-top: 2rem;
  padding: 1.5rem;
  border-top: 1px solid #64748B30;
  text-align: center;
  background: linear-gradient(145deg, #64748B20, #64748B15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid #64748B30;
}

.creator-reference p {
  font-size: 0.8rem;
  color: #94A3B8;
  margin: 0;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.creator-reference a {
  color: #60A5FA;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.creator-reference a:hover {
  color: #3B82F6;
  text-decoration: underline;
}
</style>