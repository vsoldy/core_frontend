<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>SOLDY</h3>
          <p>Сервис для выкупа товаров из других стран</p>
        </div>
        
        <div class="footer-section">
          <h3>Контакты</h3>
          <p>support@soldy.com</p>
          <p>+7 (XXX) XXX-XX-XX</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2024 Soldy. Все права защищены.</p>
        <div class="footer-links">
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Условия использования</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-footer {
  border-top: 1px solid var(--border-color);
  padding: 2rem 0 1.5rem;
  background: var(--background-secondary);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.footer-section h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.footer-section p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--text-primary);
}
</style>
