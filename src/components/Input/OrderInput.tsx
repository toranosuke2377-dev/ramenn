import React, { useState } from 'react';
import styles from './Input.module.css';

interface Props {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export const OrderInput: React.FC<Props> = ({ onSend, disabled }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!value.trim() || disabled) return;
        onSend(value);
        setValue('');
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                className={styles.input}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="コールを入力..."
                disabled={disabled}
                autoFocus
            />
            <button
                className={styles.button}
                type="submit"
                disabled={disabled || !value.trim()}
            >
                送信
            </button>
        </form>
    );
};
