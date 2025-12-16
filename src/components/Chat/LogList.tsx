import React, { useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import type { ChatMessage } from '../../core/types';

interface Props {
    history: ChatMessage[];
}

export const LogList: React.FC<Props> = ({ history }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    if (history.length === 0) return null;

    return (
        <div className={styles.logContainer} ref={containerRef}>
            {history.map((msg, idx) => (
                <div
                    key={idx}
                    className={`${styles.logItem} ${msg.sender === 'MASTER' ? styles.logMaster : styles.logPlayer}`}
                >
                    {msg.sender === 'MASTER' ? '店主: ' : '客: '} {msg.text}
                </div>
            ))}
        </div>
    );
};
