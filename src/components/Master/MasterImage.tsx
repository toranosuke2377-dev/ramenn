import React from 'react';
import styles from './MasterImage.module.css';
import type { GameState } from '../../core/types';

interface Props {
    emotion: GameState['shopkeeperState'];
}

export const MasterImage: React.FC<Props> = ({ emotion }) => {
    // Mapping emotion to emoji/color/text for MVP
    const getVisuals = () => {
        switch (emotion) {
            case 'ANGRY': return { emoji: '😡', color: '#ff4d4d', text: '激怒' };
            case 'SMILE': return { emoji: '☺️', color: '#4dff88', text: 'にこっ' };
            case 'DOYA': return { emoji: '😏', color: '#ffaa4d', text: 'ドヤ' };
            case 'CONFUSED': return { emoji: '🤨', color: '#ffff4d', text: '？' };
            case 'NORMAL':
            default: return { emoji: '😠', color: '#eeeeee', text: '通常' };
        }
    };

    const v = getVisuals();

    return (
        <div className={styles.container} style={{ borderColor: v.color }}>
            <div className={styles.emoji}>{v.emoji}</div>
            <div className={styles.label}>{v.text}</div>
        </div>
    );
};
