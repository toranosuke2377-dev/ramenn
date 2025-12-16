import React from 'react';
import styles from './Settings.module.css';

interface Props {
    isStrictMode: boolean;
    onToggleStrict: () => void;
    apiKey: string;
    onChangeApiKey: (key: string) => void;
    isAiEnabled: boolean;
    onToggleAi: () => void;
}

export const Settings: React.FC<Props> = ({
    isStrictMode, onToggleStrict,
    apiKey, onChangeApiKey,
    isAiEnabled, onToggleAi
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <label className={styles.label}>
                    <span className={styles.text}>厳しめ</span>
                    <div
                        className={`${styles.toggle} ${isStrictMode ? styles.active : ''}`}
                        onClick={onToggleStrict}
                    >
                        <div className={styles.knob} />
                    </div>
                </label>
            </div>

            <div className={styles.separator} />

            <div className={styles.row}>
                <label className={styles.label}>
                    <span className={styles.text}>AI店主</span>
                    <div
                        className={`${styles.toggle} ${isAiEnabled ? styles.active : ''}`}
                        onClick={onToggleAi}
                    >
                        <div className={styles.knob} />
                    </div>
                </label>
            </div>

            {isAiEnabled && (
                <div className={styles.inputRow}>
                    <input
                        type="text" // debugging: show text
                        className={styles.apiKeyInput}
                        placeholder="API Key"
                        value={apiKey}
                        onChange={(e) => onChangeApiKey(e.target.value)}
                    />
                    <div style={{ color: 'red', fontSize: '10px', marginTop: '5px' }}>
                        Current Key: {apiKey ? apiKey.slice(0, 5) + '...' : '(empty)'}
                    </div>
                </div>
            )}
        </div>
    );
};
