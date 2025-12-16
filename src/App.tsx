import { useState } from 'react';
import { MasterImage } from './components/Master/MasterImage';
import { MessageBubble } from './components/Chat/MessageBubble';
import { LogList } from './components/Chat/LogList';
import { OrderInput } from './components/Input/OrderInput';
import { ResultOverlay } from './components/Overlay/ResultOverlay';
import { Settings } from './components/Status/Settings';
import { judgeOrder } from './core/gameLogic';
import { generateMasterResponse } from './core/aiService';
import type { GameState, ChatMessage, JudgmentResult } from './core/types';
import './App.module.css'; // Just to ensure CSS modules don't break if I used them, but here I'll use inline styles or existing global
import styles from './App.module.css';

// Initial Message
const INITIAL_MSG: ChatMessage = { sender: 'MASTER', text: 'ニンニク入れますか？' };

function App() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [latestMessage, setLatestMessage] = useState<ChatMessage>(INITIAL_MSG);
  const [shopkeeperState, setShopkeeperState] = useState<GameState['shopkeeperState']>('NORMAL');
  const [result, setResult] = useState<JudgmentResult | null>(null);

  // Settings State
  const [isStrictMode, setIsStrictMode] = useState(true);
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');

  const handleSend = async (text: string) => {
    // Add user message to log (but mostly we just show latest conversation flow)
    // Actually, design says: "Latest 5 logs".
    // Flow: Master says -> User says -> Master reacts.

    // 1. User speaks
    const userMsg: ChatMessage = { sender: 'PLAYER', text };
    setHistory(prev => [...prev, latestMessage, userMsg].slice(-10)); // Keep last 10

    // 2. Judge
    const judgment = judgeOrder(text, isStrictMode);

    // 3. Master Reaction Setup
    let masterText = '';
    let emotion: GameState['shopkeeperState'] = 'NORMAL';
    let res: JudgmentResult | null = null;

    // Default Logic
    // Wait a bit for "thinking" effect? Maybe 500ms?
    // For MVP, instant.

    switch (judgment.result) {
      case 'CLEAR':
        masterText = 'へい、お待ち！';
        emotion = 'SMILE';
        res = 'CLEAR';
        break;
      case 'HIDDEN_CLEAR':
        masterText = '...全マシでいこう。';
        emotion = 'DOYA';
        res = 'HIDDEN_CLEAR';
        break;
      case 'GAME_OVER':
        masterText = '帰れ。';
        emotion = 'ANGRY';
        res = 'GAME_OVER';
        break;
      case 'MISSING_ITEM':
        masterText = `${judgment.missingField}は？`;
        emotion = 'CONFUSED';
        break;
      case 'MISSING_AMOUNT':
        masterText = `${judgment.missingField}の量は？`;
        emotion = 'CONFUSED';
        break;
      case 'NONSENSE': // Not used in current logic but fallback
      default:
        masterText = 'は？';
        emotion = 'ANGRY';
        break;
    }

    // AI Override
    if (isAiEnabled) {
      if (!apiKey) {
        console.log('AI Enabled but NO API Key');
        setLatestMessage({ sender: 'MASTER', text: '[System] API Keyがありません' });
      } else {
        console.log('Calling AI with Key:', apiKey.slice(0, 5) + '...');
        try {
          const aiText = await generateMasterResponse(
            apiKey,
            text,
            judgment.result,
            judgment.missingField,
            emotion
          );
          if (aiText) {
            masterText = aiText;
          } else {
            masterText += ' (AI生成失敗)';
          }
        } catch (e) {
          console.error(e);
          masterText += ' (AIエラー)';
        }
      }
    }

    setLatestMessage({ sender: 'MASTER', text: masterText });
    setShopkeeperState(emotion);
    if (res) {
      setTimeout(() => setResult(res), 800); // Delay overlay slightly
    }
  };

  const handleRetry = () => {
    setHistory([]);
    setLatestMessage(INITIAL_MSG);
    setShopkeeperState('NORMAL');
    setResult(null);
  };

  return (
    <div className={styles.appContainer}>
      <Settings
        isStrictMode={isStrictMode}
        onToggleStrict={() => setIsStrictMode(!isStrictMode)}
        isAiEnabled={isAiEnabled}
        onToggleAi={() => setIsAiEnabled(!isAiEnabled)}
        apiKey={apiKey}
        onChangeApiKey={setApiKey}
      />
      <header className={styles.header}>
        二郎ラーメンシュミレーター
      </header>

      <main className={styles.main}>
        <div className={styles.leftCol}>
          <MasterImage emotion={shopkeeperState} />
        </div>

        <div className={styles.centerCol}>
          <div className={styles.bubbleArea}>
            <MessageBubble text={latestMessage.text} isMaster={true} />
            {/* Show user's last input if not results? Or just rely on Log? */}
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.inputArea}>
            <OrderInput onSend={handleSend} disabled={!!result} />
          </div>
          <div className={styles.logArea}>
            <LogList history={history} />
          </div>
        </div>
      </main>

      {result && <ResultOverlay result={result} onRetry={handleRetry} />}

      <footer className={styles.footer}>
        ※このゲームはフィクションです
      </footer>
    </div>
  );
}

export default App;
