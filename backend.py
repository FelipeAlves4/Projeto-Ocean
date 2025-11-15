from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import re
import logging
import os
from datetime import datetime

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Em produção, especificar origens

# Configurar SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ocean.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'  # IMPORTANTE: mudar em produção
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

def validate_email(email):
    """Valida formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def create_tables_and_seed():
    """Cria tabelas e adiciona usuário admin padrão"""
    try:
        db.create_all()
        if not User.query.filter_by(username='admin@gmail.com').first():
            admin = User(username='admin@gmail.com', password_hash=generate_password_hash('admin123'))
            db.session.add(admin)
            db.session.commit()
            logger.info("Usuário admin criado com sucesso")
    except Exception as e:
        logger.error(f"Erro ao criar tabelas ou seed: {str(e)}")
        db.session.rollback()

@app.route('/login', methods=['POST'])
def login():
    """Autenticação por usuário e senha (JSON: username, password)."""
    try:
        if not request.is_json:
            return jsonify({"success": False, "message": "Content-Type deve ser application/json"}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Dados não fornecidos"}), 400
        
        username = data.get("username", "").strip()
        password = data.get("password", "")
        
        # Validações
        if not username:
            return jsonify({"success": False, "message": "Email é obrigatório"}), 400
        
        if not password:
            return jsonify({"success": False, "message": "Senha é obrigatória"}), 400
        
        if not validate_email(username):
            return jsonify({"success": False, "message": "Formato de email inválido"}), 400
        
        # Buscar usuário
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            logger.info(f"Login bem-sucedido para: {username}")
            return jsonify({
                "success": True, 
                "message": "Login realizado com sucesso!",
                "user": user.to_dict()
            }), 200
        
        logger.warning(f"Tentativa de login falhou para: {username}")
        return jsonify({"success": False, "message": "Usuário ou senha incorretos."}), 401
    
    except Exception as e:
        logger.error(f"Erro no login: {str(e)}")
        return jsonify({"success": False, "message": "Erro interno do servidor"}), 500

@app.route('/register', methods=['POST'])
def register():
    """Cadastro de novo usuário (JSON: username, password). Senha mínima de 6 caracteres."""
    try:
        if not request.is_json:
            return jsonify({"success": False, "message": "Content-Type deve ser application/json"}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Dados não fornecidos"}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # Validações
        if not username:
            return jsonify({"success": False, "message": "Email é obrigatório"}), 400
        
        if not password:
            return jsonify({"success": False, "message": "Senha é obrigatória"}), 400
        
        if not validate_email(username):
            return jsonify({"success": False, "message": "Formato de email inválido"}), 400
        
        if len(password) < 6:
            return jsonify({"success": False, "message": "A senha deve ter pelo menos 6 caracteres."}), 400
        
        if len(password) > 128:
            return jsonify({"success": False, "message": "A senha deve ter no máximo 128 caracteres."}), 400
        
        # Verificar se usuário já existe
        if User.query.filter_by(username=username).first():
            return jsonify({"success": False, "message": "Usuário já existe."}), 409
        
        # Criar novo usuário
        user = User(username=username, password_hash=generate_password_hash(password))
        db.session.add(user)
        db.session.commit()
        
        logger.info(f"Novo usuário registrado: {username}")
        return jsonify({
            "success": True, 
            "message": "Usuário cadastrado com sucesso!",
            "user": user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Erro no registro: {str(e)}")
        return jsonify({"success": False, "message": "Erro interno do servidor"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar se o servidor está funcionando"""
    try:
        # Testar conexão com banco de dados
        User.query.first()
        return jsonify({
            "status": "healthy",
            "message": "Servidor funcionando corretamente",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Erro no health check: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "message": "Erro na conexão com banco de dados",
            "error": str(e)
        }), 503

@app.route('/users', methods=['GET'])
def get_users():
    """Lista todos os usuários (apenas para desenvolvimento/admin)"""
    try:
        users = User.query.all()
        return jsonify({
            "success": True,
            "users": [user.to_dict() for user in users],
            "count": len(users)
        }), 200
    except Exception as e:
        logger.error(f"Erro ao listar usuários: {str(e)}")
        return jsonify({"success": False, "message": "Erro ao buscar usuários"}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "message": "Endpoint não encontrado"}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({"success": False, "message": "Erro interno do servidor"}), 500

if __name__ == '__main__':
    # Atenção: debug=True só para desenvolvimento local!
    with app.app_context():
        create_tables_and_seed()
    
    # Configuração de porta (pode ser alterada via variável de ambiente)
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    logger.info(f"Iniciando servidor na porta {port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)