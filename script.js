document.addEventListener('DOMContentLoaded', function () {

    let imagemOriginal = null; // Para armazenar a imagem original
    let imagemAtual = null; // Para armazenar a imagem atualmente exibida

    // Função para abrir o arquivo
    function abrirArquivo() {
        const input = document.getElementById('inputImagem');
        input.click();

        input.addEventListener('change', function () {
            const arquivo = input.files[0];
            if (arquivo) {
                const leitor = new FileReader();

                leitor.onload = function () {
                    const img = new Image();
                    img.src = leitor.result;

                    img.onload = function () {
                        // Quando a imagem estiver carregada, a configuramos
                        imagemOriginal = img; // Guardamos a imagem original
                        imagemAtual = img; // Definimos a imagem atual como a original

                        // Criamos um canvas para desenhar a imagem
                        const canvas = document.createElement('canvas');
                        const contexto = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        contexto.drawImage(img, 0, 0);

                        // Agora exibimos a imagem no elemento 'visualizacaoImagem'
                        const visualizacao = document.getElementById('visualizacaoImagem');
                        visualizacao.src = canvas.toDataURL(); // A imagem agora é visível
                    };

                    img.onerror = function () {
                        alert("Erro ao carregar a imagem.");
                    }
                };

                leitor.readAsDataURL(arquivo); // Lê o arquivo como URL de dados
            }
        });
    }

    // Função para aplicar filtros
    function aplicarFiltro(filtro) {
        if (!imagemOriginal) return;

        // Cria um novo canvas para aplicar o filtro
        const canvasFiltro = document.createElement('canvas');
        const contextoFiltro = canvasFiltro.getContext('2d');
        const { width, height } = imagemAtual;

        canvasFiltro.width = width;
        canvasFiltro.height = height;
        contextoFiltro.drawImage(imagemAtual, 0, 0, width, height); // Desenha a imagem no canvas

        // Aplica o filtro no canvas
        contextoFiltro.filter = filtro;
        contextoFiltro.drawImage(imagemAtual, 0, 0, width, height);

        imagemAtual = new Image();
        imagemAtual.src = canvasFiltro.toDataURL(); // Atualiza a imagem atual com o filtro aplicado
        imagemAtual.onload = function () {
            const visualizacao = document.getElementById('visualizacaoImagem');
            visualizacao.src = imagemAtual.src; // Atualiza a exibição da imagem
        }

        // Salva a imagem no histórico
        salvarNoHistorico(imagemAtual.src, filtro);
    }

    // Função para desfazer o filtro e restaurar a imagem original
    function desfazerFiltro() {
        if (imagemOriginal) {
            imagemAtual = imagemOriginal; // Restaura a imagem original
            const visualizacao = document.getElementById('visualizacaoImagem');
            visualizacao.src = imagemAtual.src; // Atualiza a exibição da imagem
        }
    }

    // Função para salvar no histórico
    function salvarNoHistorico(imagem, filtro) {
        const historico = document.getElementById('historicoImagens');
        const item = document.createElement('div');
        item.classList.add('historico-item');
        item.innerHTML = `
            <img src="${imagem}" alt="Imagem Editada" class="thumbnail" title="${filtro}">
            <p>Filtro: ${filtro}</p>
        `;
        historico.appendChild(item);
    }

    // Função para salvar imagem
    function salvarImagem() {
        const canvas = document.createElement('canvas');
        const contexto = canvas.getContext('2d');
        const { width, height } = imagemAtual;

        canvas.width = width;
        canvas.height = height;
        contexto.drawImage(imagemAtual, 0, 0, width, height);

        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'imagem-editada.png';
        link.click();
    }

    // Adicionar eventos aos botões
    document.getElementById('carregarBotao').addEventListener('click', abrirArquivo);
    document.getElementById('desfazerBotao').addEventListener('click', desfazerFiltro);
    document.getElementById('salvarImagem').addEventListener('click', salvarImagem);


    // Filtros
    document.getElementById('filtroCinza').addEventListener('click', function () {
        aplicarFiltro('grayscale(100%)');
    });
    document.getElementById('filtroBrilho').addEventListener('click', function () {
        aplicarFiltro('brightness(1.5)');
    });
    document.getElementById('filtroContraste').addEventListener('click', function () {
        aplicarFiltro('contrast(1.5)');
    });
    document.getElementById('filtroSepia').addEventListener('click', function () {
        aplicarFiltro('sepia(100%)');
    });
    document.getElementById('filtroSaturacao').addEventListener('click', function () {
        aplicarFiltro('saturate(2)');
    });
    document.getElementById('filtroDesfoque').addEventListener('click', function () {
        aplicarFiltro('blur(5px)');
    });
    document.getElementById('filtroInvertido').addEventListener('click', function () {
        aplicarFiltro('invert(100%)');
    });
    document.getElementById('filtroVermelho').addEventListener('click', function () {
        aplicarFiltro('hue-rotate(90deg)');
    });
    document.getElementById('filtroAzul').addEventListener('click', function () {
        aplicarFiltro('hue-rotate(180deg)');
    });
    document.getElementById('filtroVerde').addEventListener('click', function () {
        aplicarFiltro('hue-rotate(270deg)');
    });
});
