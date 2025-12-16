export type Amount = 'ヌキ' | 'スクナメ' | 'フツウ' | 'マシ' | 'マシマシ';

export type Item = 'ニンニク' | 'ヤサイ' | 'アブラ' | 'カラメ';

export type JudgmentResult =
    | 'CLEAR'
    | 'HIDDEN_CLEAR'
    | 'GAME_OVER'
    | 'MISSING_ITEM'
    | 'MISSING_AMOUNT'
    | 'NONSENSE';

export interface GameState {
    history: ChatMessage[];
    lastResult: JudgmentResult | null;
    shopkeeperState: 'NORMAL' | 'ANGRY' | 'SMILE' | 'CONFUSED' | 'DOYA';
}

export interface ChatMessage {
    sender: 'MASTER' | 'PLAYER';
    text: string;
}

export interface Dictionary {
    items: string[];
    amounts: string[];
    ngWords: string[];
    exceptions: string[];
}
