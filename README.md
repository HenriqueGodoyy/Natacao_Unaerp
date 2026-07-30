# 🏊 Unaerp Esportes

Sistema desenvolvido para o projeto de extensão **Unaerp Esportes**, com foco inicial na equipe de **natação da UNAERP**.

## 📌 Sobre o Projeto

O objetivo deste sistema é facilitar a visualização e o acompanhamento da evolução dos atletas ao longo do tempo, permitindo que treinadores e responsáveis analisem desempenho de forma mais organizada e eficiente.

Em etapas futuras, o projeto será expandido e convertido para um **aplicativo mobile**, tornando o acesso aos dados dos atletas ainda mais prático e acessível.

---

## 🚀 Tecnologias Utilizadas

* **React**
* **TypeScript**
* **Node.js**
* **Supabase** (Banco de Dados Relacional privado)
* **REST API**

---

## ✨ Funcionalidades Planejadas / Implementadas

* Cadastro de atletas
* Registro de métricas de desempenho
* Histórico de evolução individual
* Visualização gráfica de progresso
* Painel administrativo para treinadores
* Exportação/consulta de dados
* Futuro aplicativo mobile para acesso facilitado

---

## ⚙️ Execução do Projeto

> **Aviso:** Este projeto utiliza variáveis de ambiente privadas para conexão com banco de dados e serviços internos.
> Por esse motivo, o projeto **não pode ser executado integralmente sem acesso ao arquivo `.env` e às credenciais apropriadas**.

### Instalação Local

```bash
git clone https://github.com/HenriqueGodoyy/Natacao_Unaerp.git
cd Natacao_Unaerp/natacao-unaerp
npm install
```

### Configurar as variáveis de ambiente

O projeto precisa das credenciais do Supabase. Copie o arquivo de exemplo e preencha os valores (encontrados em **Project Settings → API** no painel do Supabase):

```bash
cp .env.example .env
```

Depois edite o `.env` com sua `VITE_SUPABASE_URL` e `VITE_SUPABASE_KEY`.

### Executar em Ambiente de Desenvolvimento

```bash
npm run dev
```

---

## 📈 Status do Projeto

🚧 **Em Desenvolvimento**

---

## 🔮 Roadmap Futuro

* [ ] Finalizar dashboard web
* [ ] Melhorar visualização de métricas
* [ ] Implementar autenticação de usuários
* [ ] Desenvolver aplicativo mobile
* [ ] Adicionar notificações e relatórios automáticos
