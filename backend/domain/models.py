#  APENAS ESTRUTURA DE CLASSES


usuarios_cadastrados = []   #testar se o back esta funcionando com o front
class Usuario:
    """ 
    Representa a conta base obrigatória. 
    A rota de cadastro usará esta classe para criar o primeiro registro.
    """
    def __init__(self, id, nome, email, senha_hash, cpf, telefone=None):
        # O 'id' é passado pela rota de cadastro (simulando o banco de dados)
        self.id = id                    
        self.nome = nome                    
        self.email = email
        self.senha_hash = senha_hash    # Hash da senha (segurança)
        self.cpf = cpf                  
        self.telefone = telefone

        # Relacionamentos que serão ativados nas próximas rotas
        self.perfil_profissional = None
        self.perfil_cliente = None


class Profissional:
    """ Informações específicas para o perfil que busca trabalho. """
    def __init__(self, id_usuario, titulo, habilidades, valor_honra=0.0, bio="", ativo=True):
        self.id_usuario = id_usuario    
        self.titulo = titulo
        self.habilidades = habilidades
        self.valor_honra = valor_honra
        self.bio = bio
        self.ativo = ativo


class Cliente:
    """ Informações específicas para o perfil que contrata (Recrutador). """
    def __init__(self, id_usuario, nome_empresa, pessoa_contato, cnpj=None):
        self.id_usuario = id_usuario    
        self.nome_empresa = nome_empresa
        self.pessoa_contato = pessoa_contato
        self.cnpj = cnpj