// =================================================================
// 1. CONFIGURAÇÃO BASE
// =================================================================

// 🚨 CRÍTICO: Mantenha a API_URL correta.
const API_URL = 'http://127.0.0.1:5000/api/auth'; 


// =================================================================
// 2. LÓGICA DE ALTERNÂNCIA (LOGIN <-> CADASTRO)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const loginFormDiv = document.getElementById('loginForm');
    const cadastroFormDiv = document.getElementById('cadastroForm');
    const escolhaPerfilContainer = document.getElementById('escolhaPerfilContainer');

    const showCadastroBtn = document.getElementById('showCadastroBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');

    // Inicialmente, mostra o login e esconde o cadastro/perfil (definido no HTML)
    
    // Listener para ir para o Cadastro
    if (showCadastroBtn) {
        showCadastroBtn.addEventListener('click', () => {
            loginFormDiv.style.display = 'none';
            cadastroFormDiv.style.display = 'block';
            escolhaPerfilContainer.style.display = 'none';
        });
    }

    // Listener para voltar para o Login
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            loginFormDiv.style.display = 'block';
            cadastroFormDiv.style.display = 'none';
            escolhaPerfilContainer.style.display = 'none';
        });
    }

    // =================================================================
    // 3. LÓGICA DE ENVIO DO CADASTRO
    // =================================================================

    // Pega o formulário de cadastro (que está dentro da div #cadastroForm)
    const formCadastro = cadastroFormDiv.querySelector('form');

    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            // 🚨 CRÍTICO: Previne o recarregamento da página!
            e.preventDefault(); 

            // 1. Coleta dos dados
            const nome = document.getElementById('cadastroNome').value;
            const email = document.getElementById('cadastroEmail').value;
            const senha = document.getElementById('cadastroSenha').value;
            const cpf = document.getElementById('cadastroCpf').value;
            const telefone = document.getElementById('cadastroTelefone').value;

            const dados = { nome, email, senha, cpf, telefone };
            
            try {
                // 2. Requisição para a API de Registro
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                });

                const resultado = await response.json();

                // 3. Tratamento da Resposta
                if (response.ok) {
                    // Status 201: Sucesso
                    alert(resultado.mensagem); 
                    
                    // Exibe o container de escolha de perfil e esconde o formulário
                    cadastroFormDiv.style.display = 'none';
                    loginFormDiv.style.display = 'none';
                    escolhaPerfilContainer.style.display = 'block';
                    
                    // Você pode salvar o ID do usuário (resultado.id_usuario) aqui se precisar.

                } else {
                    // Status 400, 409, 500, etc.
                    alert(`Erro no Cadastro: ${resultado.erro || resultado.mensagem || 'Ocorreu um erro desconhecido.'}`);
                }

            } catch (error) {
                console.error('Erro de conexão ou requisição:', error);
                alert('Erro ao tentar conectar com o servidor. Verifique se o Flask está rodando.');
            }
        });
    }


    // =================================================================
    // 4. FUNÇÕES GERAIS (Limpar Formulários)
    // =================================================================

    // As funções clearLoginForm e clearCadastroForm devem ser definidas aqui
    // para serem chamadas pelo onclick no HTML.
    window.clearLoginForm = function() {
        document.getElementById('loginForm').querySelector('form').reset();
    }

    window.clearCadastroForm = function() {
        document.getElementById('cadastroForm').querySelector('form').reset();
    }

    window.escolherPerfil = function(perfil) {
        alert(`Perfil escolhido: ${perfil}. Próxima tela (painel) seria carregada aqui.`);
        // Aqui você faria o redirecionamento real:
        // window.location.href = '/painel'; 
    }

});
