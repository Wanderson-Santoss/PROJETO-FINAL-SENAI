# app.py (Na RAIZ do projeto - FINAL)

from flask import Flask, render_template
# 🚨 AJUSTE CRÍTICO: Importa db E bcrypt_instance do database.py (onde estão as "caixas vazias")
from database import db, bcrypt_instance 
# REMOVA A LINHA: from flask_bcrypt import Bcrypt (Se ela estiver no topo)

# Inicialização Padrão
app = Flask(__name__)

# =================================================================
# CONFIGURAÇÃO DO BACKEND (BANCO DE DADOS E FERRAMENTAS)
# =================================================================

# 1. Configura a string de conexão
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 2. Inicializa o objeto db com o app.
db.init_app(app)

# 🚨 AJUSTE CRÍTICO: Inicializa o objeto Bcrypt que veio do database.py
bcrypt_instance.init_app(app)

# 3. Importa e Registra o Blueprint da API de Usuário
from backend.routers.user import user_bp 
app.register_blueprint(user_bp) 

# =================================================================
# ROTAS DE VISUALIZAÇÃO (Front-end)
# =================================================================
# (Suas rotas de visualização aqui...)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@app.route('/perfil')
def perfil():
    return render_template('perfil.html')

# =================================================================
# EXECUÇÃO
# =================================================================

if __name__ == '__main__':
    
    # Cria as tabelas do Banco de Dados
    with app.app_context():
        # A importação do modelo (Usuario) deve ocorrer antes do create_all()
        from backend.models.usuario_model import Usuario 
        db.create_all()
        
    app.run(debug=True)
