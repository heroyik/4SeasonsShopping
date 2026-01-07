import { ShoppingBag, Search, Menu } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button className={styles.iconBtn}>
            <Menu size={24} />
          </button>
        </div>
        
        <div className={styles.center}>
          <h1 className={styles.logo}>4SEASONS</h1>
        </div>

        <div className={styles.right}>
          <button className={styles.iconBtn}>
            <Search size={24} />
          </button>
          <button className={styles.iconBtn}>
            <ShoppingBag size={24} />
            <span className={styles.badge}>2</span>
          </button>
        </div>
      </div>
    </header>
  );
}
