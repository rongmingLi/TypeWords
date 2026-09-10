<script setup lang="ts">
import { BaseInput, BasePage, Dialog, Toast } from '@/base'
import { useDataSyncPersistence } from '@/core/composables/useDataSyncPersistence.ts'
import { useBaseStore, useSettingStore } from '@/core/stores'
import { SyncDataType } from '@/core/types'
import { deleteLocalProfileData } from '@/core/utils/local-profile-data.ts'
import {
  createLocalProfile,
  deleteLocalProfile,
  getLocalProfileState,
  renameLocalProfile,
  switchLocalProfile,
  type LocalProfile,
} from '@/core/utils/local-profile.ts'

const { t } = useI18n()
const store = useBaseStore()
const settingStore = useSettingStore()
const persistence = useDataSyncPersistence()

const profileState = ref(getLocalProfileState())
const newProfileName = ref('')
const editingProfileId = ref('')
const editingProfileName = ref('')
const pendingDelete = ref<LocalProfile | null>(null)
const showDeleteDialog = ref(false)
const busy = ref(false)

useSeoMeta({ title: () => `${t('local_profiles')} — Type Words` })

function refreshProfiles() {
  profileState.value = getLocalProfileState()
}

function profileErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : ''
  const messages: Record<string, string> = {
    PROFILE_NAME_REQUIRED: t('profile_name_required'),
    PROFILE_NAME_TOO_LONG: t('profile_name_too_long'),
    PROFILE_NAME_EXISTS: t('profile_name_exists'),
    LAST_PROFILE_DELETE_FORBIDDEN: t('last_profile_delete_forbidden'),
  }
  return messages[code] ?? t('profile_action_failed')
}

async function saveCurrentProfile() {
  if (store.load) await persistence.saveDictState(store.$state, { canSyncRemote: false })
  if (settingStore.load) {
    await persistence.saveLocalAndSync(SyncDataType.setting, settingStore.$state, { canSyncRemote: false })
  }
}

async function activateProfile(profileId: string) {
  if (profileId === profileState.value.activeProfileId || busy.value) return
  busy.value = true
  try {
    await saveCurrentProfile()
    switchLocalProfile(profileId)
    window.location.reload()
  } catch (error) {
    busy.value = false
    Toast.error(profileErrorMessage(error))
  }
}

async function addProfile() {
  if (busy.value) return
  busy.value = true
  try {
    await saveCurrentProfile()
    const profile = createLocalProfile(newProfileName.value)
    switchLocalProfile(profile.id)
    window.location.reload()
  } catch (error) {
    busy.value = false
    Toast.error(profileErrorMessage(error))
  }
}

function beginRename(profile: LocalProfile) {
  editingProfileId.value = profile.id
  editingProfileName.value = profile.name
}

function cancelRename() {
  editingProfileId.value = ''
  editingProfileName.value = ''
}

function saveRename() {
  try {
    renameLocalProfile(editingProfileId.value, editingProfileName.value)
    cancelRename()
    refreshProfiles()
    Toast.success(t('save_success'))
  } catch (error) {
    Toast.error(profileErrorMessage(error))
  }
}

async function confirmDelete() {
  const profile = pendingDelete.value
  if (!profile) return false
  try {
    busy.value = true
    await deleteLocalProfileData(profile.id)
    const nextActiveId = deleteLocalProfile(profile.id)
    showDeleteDialog.value = false
    pendingDelete.value = null
    if (profile.id === profileState.value.activeProfileId) {
      switchLocalProfile(nextActiveId)
      window.location.reload()
      return true
    }
    refreshProfiles()
    busy.value = false
    Toast.success(t('profile_deleted'))
    return true
  } catch (error) {
    busy.value = false
    Toast.error(profileErrorMessage(error))
    return false
  }
}

function requestDelete(profile: LocalProfile) {
  pendingDelete.value = profile
  showDeleteDialog.value = true
}
</script>

<template>
  <BasePage>
    <main class="profile-page card-white" aria-labelledby="profile-page-title">
      <header>
        <h1 id="profile-page-title">{{ $t('local_profiles') }}</h1>
        <p>{{ $t('local_profiles_desc') }}</p>
      </header>

      <form class="create-form" @submit.prevent="addProfile">
        <label>
          <span>{{ $t('create_local_profile') }}</span>
          <div class="form-row">
            <BaseInput
              v-model="newProfileName"
              :placeholder="$t('profile_name_placeholder')"
              :max-length="32"
              autocomplete="off"
            />
            <button class="action-button primary" type="submit" :disabled="busy">
              {{ $t('create_local_profile') }}
            </button>
          </div>
        </label>
      </form>

      <section aria-labelledby="profile-list-title">
        <h2 id="profile-list-title">{{ $t('local_profile_list') }}</h2>
        <ul class="profile-list">
          <li v-for="profile in profileState.profiles" :key="profile.id" class="profile-item">
            <div v-if="editingProfileId === profile.id" class="rename-row">
              <BaseInput
                v-model="editingProfileName"
                :aria-label="$t('profile_name_placeholder')"
                :max-length="32"
                autofocus
                @enter="saveRename"
              />
              <button class="action-button primary" type="button" @click="saveRename">{{ $t('save') }}</button>
              <button class="action-button" type="button" @click="cancelRename">{{ $t('cancel') }}</button>
            </div>
            <template v-else>
              <div class="profile-identity">
                <span class="avatar" aria-hidden="true">{{ profile.name.slice(0, 1).toLocaleUpperCase() }}</span>
                <div>
                  <div class="profile-name">{{ profile.name }}</div>
                  <span v-if="profile.id === profileState.activeProfileId" class="current-label">
                    {{ $t('current') }}
                  </span>
                </div>
              </div>
              <div class="profile-actions">
                <button
                  v-if="profile.id !== profileState.activeProfileId"
                  class="action-button primary"
                  type="button"
                  :disabled="busy"
                  @click="activateProfile(profile.id)"
                >
                  {{ $t('switch_profile') }}
                </button>
                <button class="action-button" type="button" :disabled="busy" @click="beginRename(profile)">
                  {{ $t('rename_profile') }}
                </button>
                <button
                  class="action-button danger"
                  type="button"
                  :disabled="busy || profileState.profiles.length === 1"
                  @click="requestDelete(profile)"
                >
                  {{ $t('delete') }}
                </button>
              </div>
            </template>
          </li>
        </ul>
      </section>
    </main>
  </BasePage>

  <Dialog v-model="showDeleteDialog" footer :title="$t('delete')" :on-confirm="confirmDelete">
    <p class="px-4">{{ $t('delete_profile_confirm', { name: pendingDelete?.name }) }}</p>
  </Dialog>
</template>

<style scoped lang="scss">
.profile-page {
  width: min(44rem, calc(100vw - 2rem));
  margin-inline: auto;
  color: var(--color-main-text);

  h1 {
    @apply text-2xl font-bold m-0;
  }
  h2 {
    @apply text-lg font-bold mt-8 mb-3;
  }
  header p {
    @apply color-gray mt-2 leading-6;
  }
}

.create-form {
  @apply mt-8;
}
.create-form label > span {
  @apply block font-bold mb-2;
}
.form-row,
.rename-row {
  @apply flex gap-2 items-center;
}
.form-row .base-input,
.rename-row .base-input {
  @apply flex-1;
}
.profile-list {
  @apply list-none p-0 m-0 flex flex-col gap-3;
}
.profile-item {
  @apply flex items-center justify-between gap-4 p-4 rounded-lg border-item-solid;
  background: var(--color-third);
}
.profile-identity {
  @apply flex items-center gap-3 min-w-0;
}
.avatar {
  @apply w-10 h-10 rounded-full center font-bold shrink-0;
  background: var(--color-fourth);
}
.profile-name {
  @apply font-bold break-words;
}
.current-label {
  @apply text-sm color-gray;
}
.profile-actions {
  @apply flex gap-2 flex-wrap justify-end;
}
.action-button {
  @apply h-9 px-3 rounded-md border-item-solid cursor-pointer;
  color: var(--color-main-text);
  background: var(--color-card-bg);
}
.action-button.primary {
  color: white;
  background: var(--color-select-bg);
}
.action-button.danger {
  @apply color-red;
}
.action-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}
.action-button:focus-visible {
  outline: 2px solid var(--color-link);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .profile-page {
    width: 100%;
    margin-bottom: 0;
  }
  .form-row,
  .rename-row {
    @apply items-stretch flex-col;
  }
  .profile-item {
    @apply items-stretch flex-col;
  }
  .profile-actions {
    @apply justify-start;
  }
  .action-button {
    @apply min-h-11;
  }
}
</style>
