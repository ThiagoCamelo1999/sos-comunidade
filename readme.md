📱 SOS Comunidade
Aplicativo de ajuda comunitária para emergências.
Com ele, o usuário pode localizar rapidamente serviços essenciais como polícia, bombeiros, hospitais, UPAs e SAMU, traçar rotas, ligar para os locais e até enviar pedidos de socorro via WhatsApp.

🚀 Tecnologias Utilizadas
- React Native (com Expo)
- React Navigation
- Expo Location (localização do usuário)
- WebView (para exibir mapas via Leaflet)
- Leaflet.js (no WebView para mapas interativos)
- OpenRouteService API (para traçar rotas)
- AsyncStorage (para salvar preferências de tema)
- Expo Asset (para carregar ícones locais no mapa)
- Firebase Realtime Database (para rastreamento ao vivo)
- Expo Haptics (vibração nos alertas)
- UUID (para gerar links únicos de rastreamento)
- Expo Status Bar

🎯 Funcionalidades
🔥 Tela inicial com seleção de tipo de emergência
🗺️ Mapa interativo com localização do usuário e locais de emergência
🚔 Rotas traçadas em tempo real
📞 Ligações rápidas para os serviços
🚑 Botão de pânico para enviar localização via WhatsApp com link de rastreamento ao vivo
🔗 Página web de rastreamento em tempo real com atualizações no mapa
🎛️ Escolha de camadas de visualização no mapa (Claro, Escuro, Satélite, OSM)
🌗 Suporte a tema claro/escuro
📶 Uso offline parcial (ícones locais, mapa precisa de internet)
📍 Centralizar localização do usuário
🕒 Atualização do horário da última posição no mapa
🎨 Ícones personalizados no mapa

📸 Screenshots


📦 Como rodar o projeto
1. Acesse a pasta do projeto:

cd sos-comunidade

2. Instale as dependências:

npm install

3. Rode o app:

npm start

Ou use:

expo start


4. Use o aplicativo pelo Expo Go ou rodando no Android Studio.

📋 Pré-requisitos
- Node.js instalado
- Expo CLI instalado:

npm install -g expo-cli

- Android Studio ou Expo Go App para testes no celular

🔐 APIs utilizadas
- OpenRouteService – para traçar rotas no mapa (requer chave gratuita)
- Leaflet – para exibição de mapas interativos via WebView
- Firebase Realtime Database – para rastreamento de localização ao vivo

✨ Melhorias Futuras
1. Modo de segurança com alerta sonoro no botão de pânico
2. Suporte a mapa offline
3. Notificações locais para emergências
4. Melhorar suporte offline total
5. Histórico de rastreamentos
6. Compartilhamento via SMS e outros canais
7. Armazenamento de rotas salvas

🧑‍💻 Autor
Feito por Thiago da Silva Barbosa Camelo.

LinkedIn - https://www.linkedin.com/in/thiago-da-silva-486a25142 /  
GitHub - https://github.com/ThiagoCamelo1999

📃 Licença
Este projeto está licenciado sob a licença MIT.
Veja o arquivo LICENSE para mais detalhes.

🚨 SOS Comunidade – Seu apoio rápido em momentos de emergência!