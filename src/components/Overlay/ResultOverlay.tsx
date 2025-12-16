import React from 'react';
import styles from './ResultOverlay.module.css';
import type { JudgmentResult } from '../../core/types';

interface Props {
    result: JudgmentResult;
    onRetry: () => void;
}

export const ResultOverlay: React.FC<Props> = ({ result, onRetry }) => {
    if (result === 'MISSING_ITEM' || result === 'MISSING_AMOUNT' || result === 'NONSENSE') {
        return null; // These don't end the game
    }

    const getContent = () => {
        switch (result) {
            case 'CLEAR':
                return { title: '完食', message: 'ごちそうさまでした！', color: '#4dff88', button: 'また来る' };
            case 'HIDDEN_CLEAR':
                return { title: '免許皆伝', message: '君、わかってるねぇ...', color: '#ffd700', button: 'ありがとうございます' };
            case 'GAME_OVER':
                return { title: '出禁', message: '二度と来るな！', color: '#ff4d4d', button: '申し訳ありません' };
            default:
                return { title: '', message: '', color: '', button: '' };
        }
    };

    const content = getContent();

    return (
        <div className={styles.overlay}>
            <h1 className={styles.title} style={{ color: content.color }}>
                {content.title}
            </h1>
            <p className={styles.message}>{content.message}</p>
            <button className={styles.button} onClick={onRetry}>
                {content.button}
            </button>
        </div>
    );
};
