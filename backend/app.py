# backend/app.py - ARQUIVO DE CONFIGURAÇÃO DO SERVIDOR

from flask import Flask, jsonify
from flask_cors import CORS 
# Importa o seu roteador (Blueprint) criado em routers/user.py
from routers.user import user_bp 
# 🌟 IMPORTAÇÃO NOVA: Roteador de perfil
from routers.profile import profile_bp 


def create_app():
    # 1. Cria a instância do aplicativo Flask
    app = Flask(__name__)
    
    # 2. Configura CORS.
    CORS(app) 
    
    # 3. Registra o Roteador de Autenticação (user_bp)
    app.register_blueprint(user_bp) 

    # 🌟 4. REGISTRO NOVO: Roteador de Perfil (profile_bp)
    app.register_blueprint(profile_bp) 

    # 5. Rota de Teste na raiz (/) para confirmar que o servidor está no ar
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            "status": "Servidor Flask rodando e pronto!", 
            # 🌟 ATUALIZADO: Inclui as novas rotas ativas
            "rotas_ativas": ["/api/auth/register", "/api/profile/professional"]
        }), 200

    return app

if __name__ == '__main__':
    # 6. Roda o servidor em modo de depuração (debug=True)
    app = create_app()
    app.run(debug=True)