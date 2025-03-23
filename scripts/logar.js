document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    // Aqui você pode adicionar a lógica de autenticação com seu backend
    // Por enquanto, vamos fazer uma verificação simples
    if (usuario && senha) {
        // Armazena o estado de login no localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('usuario', usuario);
        
        // Redireciona para a página principal
        window.location.href = '../index.html';
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}); 