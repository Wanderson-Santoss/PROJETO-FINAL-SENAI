from flask import Blueprint, request, jsonify
# Importa o objeto 'db'
from database import db
# Importa a classe Usuario (o modelo)
from backend.models.usuario_model import Usuario 
# A pasta deve ser 'backend' minúscula se for assim no seu projeto!

# Cria o Blueprint
user_bp = Blueprint('user', __name__, url_prefix='/api/auth')

# =================================================================
# ROTA DE REGISTRO
# URL COMPLETA: POST /api/auth/register
# =================================================================
@user_bp.route('/register', methods=['POST'])
def register_user():
    """ 
    Recebe os dados do formulário de cadastro base do frontend e salva no BD.
    """
    
    # 1. Obtém os dados JSON
    data = request.get_json()

    # 2. Validação Inicial de campos obrigatórios
    if not data or not all(data.get(field) for field in ['nome', 'email', 'senha', 'cpf']):
        return jsonify({"erro": "Campos obrigatórios (nome, email, senha, cpf) estão faltando."}), 400

    # 3. Lógica de Persistência no Banco de Dados
    
    # Verifica se o email já está cadastrado (Status 409 Conflict)
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({"erro": "Este e-mail já está cadastrado."}), 409

    # Cria a instância da sua classe Usuario
    # 🚨 AJUSTE AQUI: O modelo (usuario_model.py) agora lida com a criptografia
    novo_usuario = Usuario( 
        nome=data['nome'], 
        email=data['email'], 
        senha=data['senha'], # <--- PASSAMOS A SENHA EM TEXTO CLARO para a propriedade 'senha'
        cpf=data['cpf'], 
        telefone=data.get('telefone')
    )
    
    try:
        # Adiciona e Salva (commit) no Banco de Dados
        db.session.add(novo_usuario)
        db.session.commit()
    except Exception as e:
        # Em caso de erro, desfaz a operação
        db.session.rollback()
        print(f"Erro ao salvar no BD: {e}")
        return jsonify({"erro": "Erro interno ao processar o registro."}), 500

    # 4. Resposta de Sucesso (Status 201 Created)
    return jsonify({
        "mensagem": f"Usuário '{novo_usuario.nome}' registrado com sucesso!",
        "id_usuario": novo_usuario.id,
        "proximo_passo": "escolha_de_perfil"
    }), 201