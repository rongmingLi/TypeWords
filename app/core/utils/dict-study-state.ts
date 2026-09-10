import type { Dict, DictResource } from '../types/types.ts'

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
