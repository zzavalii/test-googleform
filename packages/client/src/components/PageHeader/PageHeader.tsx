import { type ReactNode } from 'react';
import Button from '../Button/Button';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    onBackClick?: () => void;
    backButtonText?: string;
    children?: ReactNode;
}

const PageHeader = ({ 
    title, 
    subtitle, 
    onBackClick, 
    backButtonText = 'Back to Home',
    children 
}: PageHeaderProps) => {
    return (
        <header className={styles.header}>
            <div className={styles.headerBlocks}>
                <div className={styles.titleBlock}>
                    <h1>{title}</h1>
                    {subtitle && <p>{subtitle}</p>}
                </div>
                <div className={styles.actions}>
                    {onBackClick && (
                        <Button onClick={onBackClick} variant='primary'>
                            {backButtonText}
                        </Button>
                    )}
                    {children}
                </div>
            </div>
        </header>
    );
};

export default PageHeader;