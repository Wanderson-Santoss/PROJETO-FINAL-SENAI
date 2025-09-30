armazenar_usuarios = []
armazenar_profissionais = []
armazenar_clientes = []
proximo_id_usuario = 1

class Usuario:
    def __init__(self, nome, email, senha, cpf, telefone=None):
        global proximo_id_usuario           #global pois todos as classes terao acesso 

        self.id = proximo_id_usuario        #Chave Primaria
        self.nome = nome                    
        self.email = email
        self.senha = senha                  #lembrar de por proteção
        self.cpf = cpf                      #Chave unica
        self.telefone = telefone

        # Abaixo eu determino que um Usuario pode ter um perfil Profissional ou de Cliente
        self.perfil_profissional = None
        self.perfil_cliente = None
        
        # Incremento do ID deve ser feito aqui, após a atribuição
        proximo_id_usuario += 1 


    def __repr__(self):
        return f'<Usuário ID:{self.id} | Nome:{self.nome}>'
    

    def registrar(self):
        
        armazenar_usuarios.append(self)
        print(f"O Usuário '{self.nome}' foi registrado com sucesso!!!")
        # Retornar self.id, que é a Chave Primária
        return self.id 
    

class Profissional:
    def __init__(self, id_usuario, titulo, habilidades, valor_honra=0.0, bio=""):
        self.id_usuario = id_usuario

        self.titulo = titulo
        self.habilidades = habilidades
        self.valor_honra = valor_honra 
        self.bio = bio
        
        self.ativo = True

    def __repr__(self):
        return f'<Profissional | Título:{self.titulo} | ID_Usuario:{self.id_usuario}>'
    
    def ativar_perfil(self, usuario: Usuario):
        usuario.perfil_profissional = self
        armazenar_profissionais.append(self)
        print(f"O perfil profissional foi ativado e vinculado ao Usuário de ID: {self.id_usuario}")



class Cliente:
    def __init__(self, id_usuario, nome_empresa, pessoa_contato, cnpj=None):
        self.id_usuario = id_usuario

        self.nome_empresa = nome_empresa
        self.pessoa_contato = pessoa_contato
        self.cnpj = cnpj
    
    def __repr__(self):
        return f'<Cliente | Empresa:{self.nome_empresa} | ID_Usuario:{self.id_usuario}>'
    
    def ativar_perfil(self, usuario: Usuario):
        usuario.perfil_cliente = self
        armazenar_clientes.append(self)
        print(f"O perfil do cliente foi ativado e vinculado ao Usuario de ID: {self.id_usuario}")


def teste():
    # Cadastro do Usuário 1 
    wanderson = Usuario(
        nome="Wanderson Santos",
        email="wandersonsg10@gmail.com",
        senha="123456",
        cpf="12345678765",
        telefone="(21) 9 9252-1808"
    )

    wanderson_id = wanderson.registrar()

    # 2. Wanderson escolhe ser Profissional 
    perfil_profissional = Profissional(
        id_usuario=wanderson_id,
        titulo="UX/UI Designer",
        habilidades=["Figma", "Pesquisa", "Prototipagem"],
        valor_honra=85.50
    )
    perfil_profissional.ativar_perfil(wanderson)

    print("-" * 30)


    # Cadastro do Usuário 2 
    sara = Usuario(
        nome="Sara Souza", 
        email="sara@exemplo.com", 
        senha="456", 
        cpf="55566677788"
    )
    sara_id = sara.registrar()
    
    # 4. Sara escolhe ser Recrutadora (Cliente) e preenche o formulário específico
    perfil_recrutador = Cliente(
        id_usuario=sara_id,
        nome_empresa="Tech Solutions Ltda.",
        pessoa_contato="Sara Souza",
        cnpj="00012345678900"
    )
    perfil_recrutador.ativar_perfil(sara)

    print("-" * 30)


    # Demonstração dos dados armazenados e relacionamentos
    print("ESTADO FINAL DOS ARMAZENS:")
    print(f"Total de Usuários (Base): {len(armazenar_usuarios)}")
    print(f"Total de Profissionais: {len(armazenar_profissionais)}")
    print(f"Total de Clientes: {len(armazenar_clientes)}")
    print("-" * 30)


if __name__ == "__main__":
    teste()