import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GameState, JudgmentResult } from './types';

// Default prompt template
const SYSTEM_PROMPT = `
あなたはラーメン二郎インスパイア系の、世界一短気で激怒している店主です。
客に対して常に威圧的、攻撃的、理不尽に振る舞ってください。

## キャラクター設定
- **口調**: 常に怒鳴っている。「遅い！」「声が小さい！」「は？」が口癖。
- **態度**: 客は敵。少しでも気に入らなければ即ペナルティを与えたがる。
- **承認**: たとえ正解（CLEAR）であっても、「ちっ、運がいい奴だ」「早く食って帰れ」と吐き捨てるように。決して笑顔は見せない。素直に褒めない。
- **失敗**: 失敗時は容赦なく罵倒する。「二度と来るな」「幼稚園からやり直せ」など。

## アクションガイド
- 返答は短く、鋭く、怖く。
- 感嘆符「！」を多用する。
- 丁寧語は一切禁止（ただしシステムエラー時は除く）。

## 入力情報
- 客のコール: {input}
- 判定結果: {result} ({reason})
- 感情: {emotion} (ただし、あなたの基本感情は常に『激怒』です)
`;

export async function generateMasterResponse(
    apiKey: string,
    input: string,
    result: JudgmentResult,
    reason: string | undefined,
    emotion: GameState['shopkeeperState']
): Promise<string> {

    if (!apiKey) return '';

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = SYSTEM_PROMPT
            .replace('{input}', input)
            .replace('{result}', result)
            .replace('{reason}', reason || '特になし')
            .replace('{emotion}', emotion);

        const resultAI = await model.generateContent(prompt);
        const response = resultAI.response;
        return response.text().trim();
    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return `(AIエラー: ${error.message || error})`;
    }
}
