import React from 'react';
import styles from './Chat.module.css'; // Shared styles for Chat components

interface Props {
    text: string;
    isMaster: boolean;
}

export const MessageBubble: React.FC<Props> = ({ text, isMaster }) => {
    return (
        <div className={`${styles.bubble} ${isMaster ? styles.master : styles.player}`}>
            {text}
        </div>
    );
};
