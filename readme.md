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

Icon - 
![Icon](https://github.com/user-attachments/assets/cd92253c-e3b6-48f4-bc2b-b4c4931d96eb)

HomeScreen com tema automatico de acordo com o sistema do dispositivo

![home screen - tema automatico](https://github.com/user-attachments/assets/6a4f5386-396e-4b2f-bb61-432a4261339a)

HomeScreen com tema manual

![tela home - tema manual](https://github.com/user-attachments/assets/795a93be-1754-4f95-a771-e46d4d4bf1ff)

EmergenciaScreen

![screen emergencia](https://github.com/user-attachments/assets/7ca01b14-c062-4fd8-b78b-ca519ca73fe3)

EmergenciaScreen com rota traçada

![rota traçada](https://github.com/user-attachments/assets/b660b269-a805-4cc6-8f86-ce8fd9f5ed07)

Abrir app de Rota externo

![abrir app de rotas](https://github.com/user-attachments/assets/08ebef55-cb64-4cee-8f58-1f6307dd2286)

Botão de panico

![msg btn-panico](https://github.com/user-attachments/assets/9bbdf6eb-34c0-4bf7-810a-d08dbb4348fe)

Pagina Web Criada para rastrear atravês do link do botão de panico

![web](https://github.com/user-attachments/assets/3c495e13-cba6-4c35-b960-28f85e42216f)

AjudaScreen

![ajudaScreen](https://github.com/user-attachments/assets/c5a41e74-3980-4a4b-bb4d-c2c4aa4758eb)


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
