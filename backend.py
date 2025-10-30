from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Configurar SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ocean.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

def create_tables_and_seed():
    db.create_all()
    if not User.query.filter_by(username='admin@gmail.com').first():
        admin = User(username='admin@gmail.com', password_hash=generate_password_hash('admin123'))
        db.session.add(admin)
        db.session.commit()

@app.route('/login', methods=['POST'])
def login():
    """Autenticação por usuário e senha (JSON: username, password)."""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return jsonify({"success": True, "message": "Login realizado com sucesso!"})
    return jsonify({"success": False, "message": "Usuário ou senha incorretos."}), 401

@app.route('/register', methods=['POST'])
def register():
    """Cadastro de novo usuário (JSON: username, password). Senha mínima de 6 caracteres."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"success": False, "message": "Usuário e senha são obrigatórios."}), 400
    if len(password) < 6:
        return jsonify({"success": False, "message": "A senha deve ter pelo menos 6 caracteres."}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "Usuário já existe."}), 409
    user = User(username=username, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({"success": True, "message": "Usuário cadastrado com sucesso!"}), 201

if __name__ == '__main__':
    # Atenção: debug=True só para desenvolvimento local!
    with app.app_context():
        create_tables_and_seed()
    app.run(debug=True)