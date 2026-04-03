import { getDaysSince, getToday } from './src/lib/timezone.ts'

const today = getToday();
const activityDate = '2026-04-02';

const daysAgo = getDaysSince(activityDate);

console.log('🧪 Testing getDaysSince()');
console.log('Today:', today);
console.log('Activity date:', activityDate);
console.log('Days ago:', daysAgo);
console.log('Expected: 1 day ago');
console.log('Result:', daysAgo === 1 ? '✅ PASS' : '❌ FAIL');
