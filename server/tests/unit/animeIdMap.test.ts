import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const cache = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
}));

vi.mock('../../src/services/cache/index.ts', () => ({
  getCache: () => cache,
}));

import {
  anilistIdToStremioId,
  getEntryByImdbId,
  initAnimeIdMap,
  isAnimeIdMapReady,
} from '../../src/services/animeIdMap/index.ts';

describe('anime ID map cache validation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    cache.get.mockReset();
    cache.set.mockReset();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('ignores malformed IMDb IDs without aborting initialization', async () => {
    cache.get.mockResolvedValue([
      { anilist_id: 1, kitsu_id: 10, imdb_id: 123 },
      { anilist_id: 2, imdb_id: 'TT1234567' },
    ]);

    await initAnimeIdMap();

    expect(isAnimeIdMapReady()).toBe(true);
    expect(anilistIdToStremioId(1)).toBe('kitsu:10');
    expect(getEntryByImdbId('tt1234567')?.anilist_id).toBe(2);
  });
});
