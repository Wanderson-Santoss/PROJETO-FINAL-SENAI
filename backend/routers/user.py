from flask import Blueprint, request, jsonify
# 🚨 Esta linha pressupõe que a classe 'Usuario' está em models.py
from domain.models import Usuario 
import random 

# 1. Cria o Blueprint (Organizador de Rotas entre as pastas)
# Define que todas as rotas neste arquivo começarão com /api/auth
user_bp = Blueprint('user', __name__, url_prefix='/api/auth')

# =================================================================
# ROTA DE REGISTRO
# URL COMPLETA: POST /api/auth/register
# =================================================================
@user_bp.route('/register', methods=['POST'])
def register_user():
    """ 
    Recebe os dados do formulário de cadastro base do frontend (nome, email, senha, cpf).
    """
    
    # 2. Obtém os dados JSON enviados pelo JavaScript
    data = request.get_json()

    # 3. Validação Inicial
    if not data or not all(data.get(field) for field in ['nome', 'email', 'senha', 'cpf']):
        # Erro 400: Dados incompletos ou no formato errado
        return jsonify({"erro": "Campos obrigatórios (nome, email, senha, cpf) estão faltando."}), 400

    # 4. Simulação de Lógica de Negócio
    
    # Simula a criação de um ID (que o Banco de Dados fará de verdade)
    usuario_id = random.randint(1000, 9999) 
    
    # Cria uma instância da sua classe Usuario
    novo_usuario = Usuario(
        id=usuario_id, 
        nome=data['nome'], 
        email=data['email'], 
        senha_hash="SIMULADO_HASH_DA_SENHA", # Futuramente, aqui entra a criptografia de senha
        cpf=data['cpf'], 
        telefone=data.get('telefone')
    )
    
    # 5. Resposta de Sucesso
    # O status 201 significa "Created" (Criado com sucesso)
    return jsonify({
        "mensagem": f"Usuário '{novo_usuario.nome}' registrado com sucesso!",
        "id_usuario": novo_usuario.id,
        "proximo_passo": "escolha_de_perfil"
    }), 201