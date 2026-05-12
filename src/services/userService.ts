export const authService = {
  iniciarLoginGoogle: () => {
    // Chama o seu NestJS
    window.location.href = "http://localhost:3000/users/auth/google";
  }
};