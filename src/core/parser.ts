export function normalizeInput(input: string): string {
    // 1. Fullwidth to Halfwidth
    let normalized = input.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });

    // 2. Hiragana to Katakana
    normalized = normalized.replace(/[\u3041-\u3096]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) + 0x60);
    });

    return normalized;
}

export function parseInput(input: string): string[] {
    let normalized = normalizeInput(input);

    // Remove polite endings (noise)
    // "デスマス", "オネガイシマス", "クダサイ", "デス" (in Katakana because of step 2)
    const noise = [
        'デス', 'マス', 'オネガイシマス', 'クダサイ', 'オネガイ', 'ハイ', 'エート', 'アノ'
    ];

    // Simple removal logic - replace found suffixes or words
    // Note: Replacing all occurrences might be aggressive but safe for this simple game
    noise.forEach(n => {
        normalized = normalized.split(n).join(' ');
    });

    // Split by delimiters
    // Space (half/full), Comma, Dot, Slash, newline
    const tokens = normalized
        .split(/[\s,、。./\n]+/)
        .filter(t => t.length > 0);

    return tokens;
}
