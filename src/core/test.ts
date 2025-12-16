
import { judgeOrder } from './gameLogic';

const testCases = [
    // Strict Mode Tests (Default)
    { input: 'ニンニクヤサイアブラ', strict: true, expected: 'MISSING_AMOUNT' },
    { input: 'ニンニクマシヤサイマシアブラマシ', strict: true, expected: 'CLEAR' },
    { input: 'ヤサイニンニクアブラ', strict: true, expected: 'MISSING_AMOUNT' },
    { input: 'ニンニクマシマシ', strict: true, expected: 'MISSING_ITEM' },
    { input: 'お尻', strict: true, expected: 'HIDDEN_CLEAR' },

    // Easy Mode Tests (isStrict = false)
    { input: 'ニンニクヤサイアブラ', strict: false, expected: 'CLEAR' }, // Should pass now
    { input: 'ニンニ ク マシ ヤサイ アブラ', strict: false, expected: 'CLEAR' },
    { input: 'ニンニクマシマシ', strict: false, expected: 'MISSING_ITEM' }, // Item still required
    { input: 'はい', strict: false, expected: 'MISSING_ITEM' }
];

console.log('--- Starting Tests ---');
testCases.forEach((tc, i) => {
    const res = judgeOrder(tc.input, tc.strict);
    const status = res.result === tc.expected ? 'PASS' : `FAIL (Got ${res.result})`;
    console.log(`[${i + 1}] Input: "${tc.input}" (Strict:${tc.strict}) -> Expected: ${tc.expected} -> ${status}`);
    if (res.result !== tc.expected) {
        if (res.missingField) console.log(`   Missing: ${res.missingField}`);
    }
});
console.log('--- End Tests ---');
