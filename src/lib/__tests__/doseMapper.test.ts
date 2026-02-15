import { mapTwiceDailyDose } from '../doseMapper';

describe('mapTwiceDailyDose', () => {
  const iftarTime = '18:30';
  const suhoorTime = '04:15';

  it('should return iftar and suhoor times when withFood is true', () => {
    const result = mapTwiceDailyDose('any', iftarTime, suhoorTime, true);
    expect(result).toEqual([iftarTime, suhoorTime]);
  });

  it('should return iftar and suhoor times when timePreference is "with_food"', () => {
    const result = mapTwiceDailyDose('with_food', iftarTime, suhoorTime, false);
    expect(result).toEqual([iftarTime, suhoorTime]);
  });

  it('should return adjusted times (2h after iftar, 1h before suhoor) when timePreference is "empty_stomach"', () => {
    const result = mapTwiceDailyDose('empty_stomach', iftarTime, suhoorTime, false);
    // 18:30 + 120m = 20:30
    // 04:15 - 60m = 03:15
    expect(result).toEqual(['20:30', '03:15']);
  });

  it('should handle "empty_stomach" with times wrapping around midnight', () => {
    const iftarLate = '23:30';
    const suhoorEarly = '00:30';
    const result = mapTwiceDailyDose('empty_stomach', iftarLate, suhoorEarly, false);
    // 23:30 + 120m = 01:30
    // 00:30 - 60m = 23:30
    expect(result).toEqual(['01:30', '23:30']);
  });

  it('should return default times for "any" preference and not withFood', () => {
    const result = mapTwiceDailyDose('any', iftarTime, suhoorTime, false);
    expect(result).toEqual([iftarTime, suhoorTime]);
  });

  it('should return default times for "morning" preference when twice daily (not optimized for morning, just split)', () => {
    const result = mapTwiceDailyDose('morning', iftarTime, suhoorTime, false);
    expect(result).toEqual([iftarTime, suhoorTime]);
  });
});
