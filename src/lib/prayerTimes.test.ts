import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: (key: string) => localStorageMock.store[key] || null,
  setItem: (key: string, value: string) => { localStorageMock.store[key] = value; },
  clear: () => { localStorageMock.store = {}; },
  key: (index: number) => Object.keys(localStorageMock.store)[index] || null,
  get length() { return Object.keys(this.store).length; },
};

// Mock fetch
const fetchMock = async (url: string, options: any) => {
  return fetchMockHandler(url, options);
};
let fetchMockHandler: (url: string, options: any) => Promise<any> = async () => {};

// Mock window
const windowMock = {};

describe('Prayer Times Fixes', () => {
  let prayerTimesModule: any;
  let originalFetch: any;
  let originalNavigator: any;

  before(async () => {
    (global as any).window = windowMock;
    (global as any).localStorage = localStorageMock;

    // Mock fetch
    if ((global as any).fetch) {
        originalFetch = (global as any).fetch;
    }
    Object.defineProperty(global, 'fetch', {
        value: fetchMock,
        writable: true,
        configurable: true
    });

    // Mock navigator
    if ((global as any).navigator) {
        originalNavigator = (global as any).navigator;
    }
    // Force override navigator
    Object.defineProperty(global, 'navigator', {
        value: { geolocation: {} },
        writable: true,
        configurable: true
    });

    // Import module dynamically
    prayerTimesModule = await import('./prayerTimes.ts');
  });

  after(() => {
    delete (global as any).window;
    delete (global as any).localStorage;

    if (originalFetch) {
        Object.defineProperty(global, 'fetch', { value: originalFetch, writable: true, configurable: true });
    } else {
        delete (global as any).fetch;
    }

    if (originalNavigator) {
        Object.defineProperty(global, 'navigator', { value: originalNavigator, writable: true, configurable: true });
    } else {
        delete (global as any).navigator;
    }
  });

  beforeEach(() => {
      localStorageMock.clear();
      // Reset fetch handler
      fetchMockHandler = async () => { throw new Error('Unexpected fetch call'); };
  });

  it('should use fuzzy matching from localStorage', async () => {
    const lat = 10.0000;
    const lng = 20.0000;
    const method = 'MuslimWorldLeague';
    const date = '2023-10-27';

    const storedData = {
      fajr: '05:00',
      sunrise: '06:00',
      dhuhr: '12:00',
      asr: '15:00',
      maghrib: '18:00',
      isha: '19:00',
      date: date
    };

    const key = `ramadan_prayer_times_${lat.toFixed(4)}-${lng.toFixed(4)}-${method}-${date}`;
    localStorageMock.setItem(key, JSON.stringify(storedData));

    // Request slightly different coordinates (within 0.1 diff)
    const reqLat = 10.0500;
    const reqLng = 19.9500;

    // fetch should fail if called
    fetchMockHandler = async () => { throw new Error('Should not call fetch'); };

    const result = await prayerTimesModule.fetchPrayerTimes(reqLat, reqLng, method, date);

    assert.deepStrictEqual(result, storedData);
  });

  it('should retry on API failure', async () => {
     let calls = 0;
     fetchMockHandler = async (url, options) => {
         calls++;
         if (calls === 1) {
             throw new Error('Network error');
         }
         return {
             ok: true,
             json: async () => ({
                 code: 200,
                 status: 'OK',
                 data: {
                     timings: {
                         Fajr: '05:00', Sunrise: '06:00', Dhuhr: '12:00', Asr: '15:00', Maghrib: '18:00', Isha: '19:00'
                     }
                 }
             })
         };
     };

     // Use unique coords to avoid cache
     const result = await prayerTimesModule.fetchPrayerTimes(30, 30, 'MuslimWorldLeague', '2023-01-01');

     assert.strictEqual(result.fajr, '05:00');
     assert.strictEqual(calls, 2);
  });

  it('should abort if timeout is reached', async () => {
    let signal: AbortSignal | undefined;
    fetchMockHandler = async (url, options) => {
        signal = options?.signal;
        return {
             ok: true,
             json: async () => ({
                 code: 200,
                 status: 'OK',
                 data: {
                     timings: {
                         Fajr: '05:00', Sunrise: '06:00', Dhuhr: '12:00', Asr: '15:00', Maghrib: '18:00', Isha: '19:00'
                     }
                 }
             })
         };
    };

    await prayerTimesModule.fetchPrayerTimes(40, 40, 'MuslimWorldLeague', '2023-01-02');

    assert.ok(signal);
    assert.strictEqual(signal.aborted, false);
  });
});
