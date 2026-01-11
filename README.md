# Voice AI Assistant

## Visão Geral
Este projeto consiste em uma interface web interativa desenvolvida para permitir conversas por voz com Inteligência Artificial. A aplicação tem como objetivo principal capturar o áudio do usuário, transcrever a fala para texto através da API Whisper e utilizar esse contexto para gerar respostas inteligentes via ChatGPT.

O desenvolvimento foi focado em proporcionar uma experiência de usuário fluida, com tratamento robusto de permissões de microfone, latência de rede e gestão de erros.

## Arquitetura e Decisões Técnicas
A aplicação segue uma arquitetura moderna com separação estrita de responsabilidades entre cliente e servidor para garantir segurança, organização e escalabilidade.

## Protocolo de Uso e Testes
Para garantir a melhor experiência e evitar erros de permissão, siga as diretrizes abaixo:

* **Evite navegadores internos:** Não acesse a aplicação diretamente através de redes sociais (Instagram, TikTok, Facebook), pois o bloqueio à captura de áudio é frequente nestas plataformas.
* **Abra no navegador nativo:** Caso acesse o link por uma rede social, utilize o menu de opções (três pontos) e escolha "Abrir no Navegador" ou "Abrir no Chrome/Safari".
* **Compatibilidade:** Dê preferência aos navegadores **Google Chrome** (Android/Desktop) ou **Safari** (iOS).
* **Permissões:** Autorize o uso do microfone assim que o site solicitar. Caso ocorra erro, verifique se o navegador possui permissão de acesso ao microfone nas configurações de privacidade do seu dispositivo.
* **Processamento:** Aguarde a conclusão da transcrição e da resposta da IA antes de atualizar ou fechar a página.
* **Qualidade do Áudio:** Para transcrições mais precisas, realize a gravação em ambientes com pouco ruído de fundo.
