// 1. TEMA CLARO E ESCURO: classList altera as cores definidas no CSS.
const botaoTema = document.getElementById('botao-tema');

function mudarTema(claro) {
  document.body.classList.toggle('claro', claro);
  botaoTema.textContent = claro ? 'Modo escuro' : 'Modo claro';
  botaoTema.setAttribute('aria-pressed', String(claro));
}

// localStorage mantém a escolha quando o usuário recarrega a página.
// O site continua funcionando se o navegador bloquear o armazenamento.
try {
  mudarTema(localStorage.getItem('tema') === 'claro');
} catch (erro) {
  mudarTema(false);
}

botaoTema.addEventListener('click', function () {
  const claro = !document.body.classList.contains('claro');
  mudarTema(claro);
  try {
    localStorage.setItem('tema', claro ? 'claro' : 'escuro');
  } catch (erro) {
    // Sem armazenamento, a escolha vale enquanto esta página estiver aberta.
  }
});

// 2. CARROSSEL: corações mudam o projeto mostrado.
const projetos = document.querySelectorAll('.projeto');
const anterior = document.getElementById('anterior');
const proximo = document.getElementById('proximo');
const contador = document.getElementById('contador');
let projetoAtual = 0;

function mostrarProjeto(numero) {
  projetoAtual = (numero + projetos.length) % projetos.length;
  projetos.forEach(function (projeto, indice) {
    projeto.hidden = indice !== projetoAtual;
  });
  contador.textContent = (projetoAtual + 1) + ' / ' + projetos.length;
}

anterior.hidden = false;
proximo.hidden = false;
contador.hidden = false;
mostrarProjeto(0);
anterior.addEventListener('click', function () { mostrarProjeto(projetoAtual - 1); });
proximo.addEventListener('click', function () { mostrarProjeto(projetoAtual + 1); });

// As setas do teclado também funcionam quando o foco está nos corações.
[anterior, proximo].forEach(function (botao) {
  botao.addEventListener('keydown', function (evento) {
    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
      evento.preventDefault();
      mostrarProjeto(projetoAtual + (evento.key === 'ArrowRight' ? 1 : -1));
    }
  });
});

// 3. MODAL: mostra informações sem trocar de página.
const modal = document.getElementById('modal');
const tituloModal = document.getElementById('titulo-modal');
const textoModal = document.getElementById('texto-modal');
const abrirEmail = document.getElementById('abrir-email');
const fecharModal = document.getElementById('fechar-modal');

function abrirModal(titulo, texto) {
  tituloModal.textContent = titulo;
  textoModal.textContent = texto;
  abrirEmail.hidden = true;
  abrirEmail.removeAttribute('href');
  modal.showModal();
  document.body.classList.add('modal-aberto');
}

const descricoes = [
  'Tabela periódica criada em uma atividade escolar. O botão Abrir projeto leva à página publicada no meu GitHub Pages.',
  'Landing page SUSU desenvolvida em uma atividade de criação de sites. Acesse o resultado pelo botão Abrir projeto.',
  'Atividade de CSS Grid para organizar os elementos de uma página. O resultado está disponível pelo botão Abrir projeto.',
  'Trabalho de manutenção de PC registrado na foto enviada. A imagem mostra o gabinete aberto e os componentes do computador.'
];

document.querySelectorAll('.detalhes').forEach(function (botao) {
  botao.hidden = false;
  botao.addEventListener('click', function () {
    const indice = Number(botao.dataset.projeto);
    abrirModal(projetos[indice].querySelector('h3').textContent, descricoes[indice]);
  });
});

fecharModal.addEventListener('click', function () { modal.close(); });
modal.addEventListener('close', function () { document.body.classList.remove('modal-aberto'); });
// A tecla Escape já fecha o dialog automaticamente.

// 4. FORMULÁRIO: máscara de telefone brasileiro e validação.
const formulario = document.getElementById('formulario');
const telefone = document.getElementById('telefone');
const nome = document.getElementById('nome');
const mensagem = document.getElementById('mensagem');
document.getElementById('preparar-email').disabled = false;

function numerosTelefone(valor) {
  let numeros = valor.replace(/\D/g, '');
  // Aceita DDD + número, ou o número completo com o prefixo +55.
  if (valor.trim().startsWith('+55') || (numeros.length > 11 && numeros.startsWith('55'))) {
    numeros = numeros.slice(2);
  }
  return numeros.slice(0, 11);
}

function formatarTelefone() {
  const numeros = numerosTelefone(telefone.value);
  let formato = numeros ? '+55 (' + numeros.slice(0, 2) : '';
  if (numeros.length > 2) formato += ') ' + numeros.slice(2, 7);
  if (numeros.length > 7) formato += '-' + numeros.slice(7);
  telefone.value = formato;
  telefone.setCustomValidity('');
}

telefone.addEventListener('input', formatarTelefone);
telefone.addEventListener('blur', function () {
  const numeros = numerosTelefone(telefone.value);
  // Telefones fixos têm 10 dígitos incluindo o DDD.
  if (numeros.length === 10) {
    telefone.value = '+55 (' + numeros.slice(0, 2) + ') ' + numeros.slice(2, 6) + '-' + numeros.slice(6);
  }
});

[nome, mensagem].forEach(function (campo) {
  campo.addEventListener('input', function () { campo.setCustomValidity(''); });
});

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const numeros = numerosTelefone(telefone.value);
  telefone.setCustomValidity(numeros.length === 10 || numeros.length === 11 ? '' : 'Informe um telefone com DDD e 10 ou 11 dígitos.');
  nome.setCustomValidity(nome.value.trim().length >= 2 ? '' : 'Informe seu nome.');
  mensagem.setCustomValidity(mensagem.value.trim().length >= 10 ? '' : 'Escreva uma mensagem com pelo menos 10 caracteres.');
  if (!formulario.reportValidity()) return;

  const email = document.getElementById('email').value.trim();
  const assunto = 'Contato pelo portfólio - ' + nome.value.trim();
  const corpo = 'Nome: ' + nome.value.trim() + '\nTelefone: ' + telefone.value + '\nEmail: ' + email + '\n\n' + mensagem.value.trim();
  abrirModal('Email preparado', 'Clique abaixo para abrir seu aplicativo de email. Revise a mensagem e confirme o envio nele. Nada foi enviado automaticamente.');
  abrirEmail.href = 'mailto:joaolucasbasquete2026@gmail.com?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
  abrirEmail.hidden = false;
});
