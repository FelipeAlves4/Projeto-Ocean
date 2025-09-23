import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
import os
import jwt
from functools import wraps

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ocean.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Ocean23@'

db = SQLAlchemy(app)

# Modelos
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(80), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)

    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)

    def check_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)

class Tarefa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text)
    status = db.Column(db.String(20), default='pendente')
    data_criacao = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))

class Meta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text)
    data_inicial = db.Column(db.Date)
    data_final = db.Column(db.Date)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))

class Financa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(10), nullable=False)  # receita ou despesa
    valor = db.Column(db.Float, nullable=False)
    categoria = db.Column(db.String(50))
    data = db.Column(db.Date)
    descricao = db.Column(db.Text)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))

# Função para criar o banco de dados
"""
Inicialização do banco e seed de usuário demo
Nota: Flask 3 removeu before_first_request; usamos app.app_context() no import.
"""
with app.app_context():
    db.create_all()
    try:
        if not Usuario.query.filter_by(usuario='demo@ocean.com').first():
            demo = Usuario(usuario='demo@ocean.com')
            demo.set_senha('demo123')
            db.session.add(demo)
            db.session.commit()
    except Exception:
        db.session.rollback()

# Utilitários
def parse_date(value):
    """Aceita date em ISO (YYYY-MM-DD) e retorna datetime.date ou None."""
    if not value:
        return None
    try:
        if isinstance(value, datetime.date):
            return value
        if isinstance(value, str):
            return datetime.datetime.strptime(value[:10], '%Y-%m-%d').date()
    except Exception:
        return None
    return None

# Função utilitária para gerar token JWT
def gerar_token(usuario_id):
    payload = {
        'usuario_id': usuario_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

# Função utilitária para verificar token JWT
def verificar_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['usuario_id']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

# Decorator para proteger rotas com JWT
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'erro': 'Token não fornecido.'}), 401
        token = auth_header.split(' ')[1]
        usuario_id = verificar_token(token)
        if not usuario_id:
            return jsonify({'erro': 'Token inválido ou expirado.'}), 401
        return f(usuario_id, *args, **kwargs)
    return decorated

# Rota de registro de usuário
@app.route('/api/register', methods=['POST'])
def registrar_usuario():
    data = request.get_json() or {}
    # aceita tanto 'usuario' quanto 'email'
    usuario = (data.get('usuario') or data.get('email') or '').strip().lower()
    senha = (data.get('senha') or data.get('password') or '').strip()
    if not usuario or not senha:
        return jsonify({'erro': 'Usuário e senha são obrigatórios.'}), 400
    if Usuario.query.filter_by(usuario=usuario).first():
        return jsonify({'erro': 'Usuário já existe.'}), 409
    novo_usuario = Usuario(usuario=usuario)
    novo_usuario.set_senha(senha)
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({'mensagem': 'Usuário registrado com sucesso!'}), 201

# Rota de login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    usuario = (data.get('usuario') or data.get('email') or '').strip().lower()
    senha = (data.get('senha') or data.get('password') or '').strip()
    if not usuario or not senha:
        return jsonify({'erro': 'Usuário e senha são obrigatórios.'}), 400
    user = Usuario.query.filter_by(usuario=usuario).first()
    if not user or not user.check_senha(senha):
        return jsonify({'erro': 'Usuário ou senha inválidos.'}), 401
    token = gerar_token(user.id)
    return jsonify({'token': token}), 200

# Info do usuário autenticado
@app.route('/api/me', methods=['GET'])
@login_required
def me(usuario_id):
    user = Usuario.query.get(usuario_id)
    if not user:
        return jsonify({'erro': 'Usuário não encontrado.'}), 404
    return jsonify({'id': user.id, 'usuario': user.usuario})

# --- CRUD TAREFAS ---
@app.route('/api/tarefas', methods=['GET'])
@login_required
def listar_tarefas(usuario_id):
    tarefas = Tarefa.query.filter_by(usuario_id=usuario_id).all()
    return jsonify([
        {
            'id': t.id,
            'titulo': t.titulo,
            'descricao': t.descricao,
            'status': t.status,
            'data_criacao': t.data_criacao.isoformat()
        } for t in tarefas
    ])

@app.route('/api/tarefas', methods=['POST'])
@login_required
def criar_tarefa(usuario_id):
    data = request.get_json()
    nova = Tarefa(
        titulo=data.get('titulo'),
        descricao=data.get('descricao'),
        status=data.get('status', 'pendente'),
        usuario_id=usuario_id
    )
    db.session.add(nova)
    db.session.commit()
    return jsonify({'mensagem': 'Tarefa criada!', 'id': nova.id}), 201

@app.route('/api/tarefas/<int:tarefa_id>', methods=['PUT'])
@login_required
def atualizar_tarefa(usuario_id, tarefa_id):
    tarefa = Tarefa.query.filter_by(id=tarefa_id, usuario_id=usuario_id).first()
    if not tarefa:
        return jsonify({'erro': 'Tarefa não encontrada.'}), 404
    data = request.get_json()
    tarefa.titulo = data.get('titulo', tarefa.titulo)
    tarefa.descricao = data.get('descricao', tarefa.descricao)
    tarefa.status = data.get('status', tarefa.status)
    db.session.commit()
    return jsonify({'mensagem': 'Tarefa atualizada!'})

@app.route('/api/tarefas/<int:tarefa_id>', methods=['DELETE'])
@login_required
def deletar_tarefa(usuario_id, tarefa_id):
    tarefa = Tarefa.query.filter_by(id=tarefa_id, usuario_id=usuario_id).first()
    if not tarefa:
        return jsonify({'erro': 'Tarefa não encontrada.'}), 404
    db.session.delete(tarefa)
    db.session.commit()
    return jsonify({'mensagem': 'Tarefa deletada!'})

# --- CRUD METAS ---
@app.route('/api/metas', methods=['GET'])
@login_required
def listar_metas(usuario_id):
    metas = Meta.query.filter_by(usuario_id=usuario_id).all()
    return jsonify([
        {
            'id': m.id,
            'titulo': m.titulo,
            'descricao': m.descricao,
            'data_inicial': m.data_inicial.isoformat() if m.data_inicial else None,
            'data_final': m.data_final.isoformat() if m.data_final else None
        } for m in metas
    ])

@app.route('/api/metas', methods=['POST'])
@login_required
def criar_meta(usuario_id):
    data = request.get_json()
    nova = Meta(
        titulo=data.get('titulo'),
        descricao=data.get('descricao'),
        data_inicial=parse_date(data.get('data_inicial')),
        data_final=parse_date(data.get('data_final')),
        usuario_id=usuario_id
    )
    db.session.add(nova)
    db.session.commit()
    return jsonify({'mensagem': 'Meta criada!', 'id': nova.id}), 201

@app.route('/api/metas/<int:meta_id>', methods=['PUT'])
@login_required
def atualizar_meta(usuario_id, meta_id):
    meta = Meta.query.filter_by(id=meta_id, usuario_id=usuario_id).first()
    if not meta:
        return jsonify({'erro': 'Meta não encontrada.'}), 404
    data = request.get_json()
    meta.titulo = data.get('titulo', meta.titulo)
    meta.descricao = data.get('descricao', meta.descricao)
    meta.data_inicial = parse_date(data.get('data_inicial')) or meta.data_inicial
    meta.data_final = parse_date(data.get('data_final')) or meta.data_final
    db.session.commit()
    return jsonify({'mensagem': 'Meta atualizada!'})

@app.route('/api/metas/<int:meta_id>', methods=['DELETE'])
@login_required
def deletar_meta(usuario_id, meta_id):
    meta = Meta.query.filter_by(id=meta_id, usuario_id=usuario_id).first()
    if not meta:
        return jsonify({'erro': 'Meta não encontrada.'}), 404
    db.session.delete(meta)
    db.session.commit()
    return jsonify({'mensagem': 'Meta deletada!'})

# --- CRUD FINANCAS ---
@app.route('/api/financas', methods=['GET'])
@login_required
def listar_financas(usuario_id):
    financas = Financa.query.filter_by(usuario_id=usuario_id).all()
    return jsonify([
        {
            'id': f.id,
            'tipo': f.tipo,
            'valor': f.valor,
            'categoria': f.categoria,
            'data': f.data.isoformat() if f.data else None,
            'descricao': f.descricao
        } for f in financas
    ])

@app.route('/api/financas', methods=['POST'])
@login_required
def criar_financa(usuario_id):
    data = request.get_json()
    nova = Financa(
        tipo=data.get('tipo'),
        valor=data.get('valor'),
        categoria=data.get('categoria'),
        data=parse_date(data.get('data')),
        descricao=data.get('descricao'),
        usuario_id=usuario_id
    )
    db.session.add(nova)
    db.session.commit()
    return jsonify({'mensagem': 'Finança criada!', 'id': nova.id}), 201

@app.route('/api/financas/<int:financa_id>', methods=['PUT'])
@login_required
def atualizar_financa(usuario_id, financa_id):
    financa = Financa.query.filter_by(id=financa_id, usuario_id=usuario_id).first()
    if not financa:
        return jsonify({'erro': 'Finança não encontrada.'}), 404
    data = request.get_json()
    financa.tipo = data.get('tipo', financa.tipo)
    financa.valor = data.get('valor', financa.valor)
    financa.categoria = data.get('categoria', financa.categoria)
    parsed_data = parse_date(data.get('data'))
    financa.data = parsed_data or financa.data
    financa.descricao = data.get('descricao', financa.descricao)
    db.session.commit()
    return jsonify({'mensagem': 'Finança atualizada!'})

@app.route('/api/financas/<int:financa_id>', methods=['DELETE'])
@login_required
def deletar_financa(usuario_id, financa_id):
    financa = Financa.query.filter_by(id=financa_id, usuario_id=usuario_id).first()
    if not financa:
        return jsonify({'erro': 'Finança não encontrada.'}), 404
    db.session.delete(financa)
    db.session.commit()
    return jsonify({'mensagem': 'Finança deletada!'})

# --- Fim das rotas CRUD --- 