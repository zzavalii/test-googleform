import { type ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'third' | 'outline';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

const Button = ({
        children,
        onClick,
        variant = 'primary',
        type = 'button',
        disabled = false,
        className = ''
    }: ButtonProps) => {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${styles.button} ${styles[variant]} ${className}`}
            >
                {children}
            </button>
        );
};

export default Button;