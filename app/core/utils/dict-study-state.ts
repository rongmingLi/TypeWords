import type { Dict, DictResource } from '../types/types.ts'

function findCatalogResource(saved: Dict, resources: DictResource[]) {
  if (saved.enName) return resources.find(item => item.enName === saved.enName)
  return resources.find(item => item.id === saved.id)
}

export function mergeDictResourceWithStudyState(resource: DictResource, saved?: Dict): Partial<Dict> {
  return {
    ...saved,
    ...resource,
    lastLearnIndex: saved?.lastLearnIndex ?? 0,
    perDayStudyNumber: saved?.perDayStudyNumber ?? 20,
    complete: saved?.complete ?? false,
    statistics: saved?.statistics ?? [],
    words: saved?.words ?? [],
    userDictId: saved?.userDictId,
  }
}

export function syncSavedDictMetadata(savedList: Dict[], resources: DictResource[]) {
  for (const saved of savedList) {
    if (saved.custom || saved.system) continue
    const resource = findCatalogResource(saved, resources)
    if (!resource) continue
    Object.assign(saved, { id: resource.id, enName: resource.enName, name: resource.name, description: resource.description, cover: resource.cover, category: resource.category, tags: resource.tags, url: resource.url })
  }
}

export function removeUnavailableOfficialDictionaries(savedList: Dict[], resources: DictResource[], studyIndex: number) {
  for (let index = savedList.length - 1; index >= 0; index--) {
    const saved = savedList[index]
    if (saved.custom || saved.system || findCatalogResource(saved, resources)) continue
    savedList.splice(index, 1)
    if (studyIndex === index) studyIndex = -1
    else if (studyIndex > index) studyIndex--
  }
  return studyIndex
}
