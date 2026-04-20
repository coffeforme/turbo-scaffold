import styles from "./navbar.module.scss";

export interface NavbarItem {
  id: string;
  label: string;
  description?: string;
  badge?: string;
}

interface NavbarProps {
  brand: string;
  items: NavbarItem[];
  activeItemId: string;
  onNavigate: (itemId: string) => void;
}

export function Navbar({ brand, items, activeItemId, onNavigate }: NavbarProps) {
  return (
    <nav className={styles.navbar} aria-label="Primary navigation">
      <div className={styles.brandBlock}>
        <span className={styles.brand}>{brand}</span>
        <span className={styles.caption}>Decoupled app scaffold</span>
      </div>

      <div className={styles.actions}>
        {items.map((item) => {
          const isActive = item.id === activeItemId;

          return (
            <button
              key={item.id}
              className={isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <span className={styles.labelRow}>
                <span className={styles.label}>{item.label}</span>
                {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
              </span>
              {item.description ? <span className={styles.description}>{item.description}</span> : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
