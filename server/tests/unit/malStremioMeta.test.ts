import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/services/animeIdMap/index.ts', () => ({
  getEntryByMalId: vi.fn(() => ({ imdb_id: 12345, themoviedb_id: 0 })),
  malIdToStremioId: vi.fn(() => null),
}));

vi.mock('../../src/services/artworkService.ts', () => ({
  applyArtworkOverridesSync: vi.fn((_context, nativeUrls) => ({
    ...nativeUrls,
    logo: null,
  })),
}));

vi.mock('../../src/services/common/stremioHelpers.ts', () => ({
  generateSlug: vi.fn((_type, title, id) => `${title}-${id}`),
}));

import { malToStremioMeta } from '../../src/services/mal/stremioMeta.ts';

describe('malToStremioMeta', () => {
  it('ignores malformed non-string mapped IMDb IDs', () => {
    const meta = malToStremioMeta({ id: 123, title: 'Example Anime' }, 'anime');

    expect(meta?.id).toBe('mal:123');
    expect(meta?.imdbId).toBeNull();
  });
});
