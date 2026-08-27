import { describe, expect, it } from 'vitest';
import { getActivePack, getChapterPackAngle, COMPANY_PACKS } from './companyPacks';

describe('companyPacks', () => {
  it('returns null for none pack', () => {
    expect(getActivePack('none')).toBeNull();
  });

  it('returns pack with chapter angles', () => {
    const pack = getActivePack('google');
    expect(pack?.label).toBe('Google Pack');
    expect(getChapterPackAngle('google', 'capacity-estimation')).toContain('Google');
  });

  it('defines all company packs', () => {
    expect(Object.keys(COMPANY_PACKS)).toEqual(['google', 'meta', 'netflix', 'startup', 'amazon', 'atlassian']);
  });

  it('returns Amazon pack angles for payment topics', () => {
    expect(getChapterPackAngle('amazon', 'idempotent-webhooks')).toMatch(/payment/i);
  });
});
