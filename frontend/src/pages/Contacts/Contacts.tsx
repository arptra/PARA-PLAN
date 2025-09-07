import React from 'react';
import styles from './Contacts.module.css';

const Contacts: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contacts</h2>
      <p className={styles.subtitle}>Get in touch with the Discrete Taburetka team</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.avatar} aria-label="avatar" />
          <div className={styles.info}>
            <div className={styles.name}>Vyacheslav Baumtrok</div>
            <div className={styles.handle}>lighterboii</div>
            <a className={styles.email} href="mailto:me@vbaumtrok.ru">me@vbaumtrok.ru</a>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.avatarPhoto} aria-label="avatar" />
          <div className={styles.info}>
            <div className={styles.name}>Ilyasov Artem</div>
            <div className={styles.handle}>thatswhyifuckyourself</div>
            <a className={styles.email} href="mailto:gay@sex.com">artpra@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
