import type { JudgmentResult, Dictionary } from './types';
import { parseInput } from './parser';
import dictionariesRaw from '../data/dictionaries.json';

const dictionaries = dictionariesRaw as Dictionary;

export function judgeOrder(input: string, isStrict: boolean = true): { result: JudgmentResult; missingField?: string } {
    const tokens = parseInput(input);

    // 1. Check NG Words (Out of ban)
    const containsNg = tokens.some(token =>
        dictionaries.ngWords.some(ng => token.includes(ng))
    );

    // 2. Check Exceptions
    const containsException = tokens.some(token =>
        dictionaries.exceptions.some(ex => token.includes(ex))
    );

    // Decision logic for NG/Exception
    if (containsNg) {
        if (containsException) {
            // NG + Exception -> STRICT NG (Priority 1)
            return { result: 'GAME_OVER' };
        }
        return { result: 'GAME_OVER' };
    }

    // Exception only -> HIDDEN CLEAR
    if (containsException) {
        return { result: 'HIDDEN_CLEAR' };
    }

    // 3. Normal Call Judgment

    // Special Case: "Zenmashi" (All Extra)
    // If user says "ゼンマシ" or "ゼンブマシ", treat as valid.
    const isZenmashi = tokens.some(t => t.includes('ゼンマシ') || t.includes('ゼンブ'));
    if (isZenmashi) {
        return { result: 'CLEAR' };
    }

    // Validation
    const requiredItems = ['ニンニク', 'ヤサイ', 'アブラ'];

    // Find which items are mentioned
    const mentionedItems = requiredItems.filter(item =>
        tokens.some(t => t.includes(item))
    );

    // Check Missing Items
    // Note: Even in loose mode, generally mentioning items is required,
    // but maybe we can relax it later. For now, keep item requirement strict-ish.
    if (mentionedItems.length < requiredItems.length) {
        const missing = requiredItems.find(i => !mentionedItems.includes(i));
        return { result: 'MISSING_ITEM', missingField: missing };
    }

    // Check Amounts for each item
    // Strategy: For each item token, check if there is an amount associated.
    // This is tricky with free text.
    // Simple heuristic: Look for amount words in the tokens.
    // Ideally, amount should be near the item.
    // Allow format: "ItemAmount" (concatenated) or "Item Amount" (adjacent)

    // However, "Ninniku Mashi" -> ["ニンニク", "マシ"]
    // "NinnikuMashi" -> ["ニンニクマシ"]

    const amounts = dictionaries.amounts; // ["マシ", "ヌキ", ...]

    for (const item of requiredItems) {
        // Does any token contain Item AND Amount? e.g. "ニンニクマシ"
        const hasCombined = tokens.some(t => t.includes(item) && amounts.some(a => t.includes(a)));

        if (hasCombined) continue;

        // Or logic: "Item" token followed by "Amount" token?
        // Find index of item
        const itemIndex = tokens.findIndex(t => t === item); // Exact match or include?
        // If user typed "ニンニク", is the NEXT token an amount?
        if (itemIndex >= 0 && itemIndex + 1 < tokens.length) {
            const nextToken = tokens[itemIndex + 1];
            if (amounts.some(a => nextToken.includes(a))) {
                continue;
            }
        }

        // If we are here, we found the item but no amount associated
        if (isStrict) {
            return { result: 'MISSING_AMOUNT', missingField: item };
        }
        // If not strict, missing amount is allowed (assumed Normal/Standard)
    }

    return { result: 'CLEAR' };
}
