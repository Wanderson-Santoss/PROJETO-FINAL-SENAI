# app.py (na RAIZ do projeto)

from flask import Flask, render_template

# Inicialização Padrão. Encontrará 'static' e 'templates' automaticamente.
app = Flask(__name__)

# Rotas de VISUALIZAÇÃO (Front-end)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@app.route('/perfil')
def perfil():
    return render_template('perfil.html')

if __name__ == '__main__':
    # Roda o servidor. Acesse em http://127.0.0.1:5000/
    app.run(debug=True)