// Importação de bibliotecas que vamos usar
import React, { useEffect, useState, useContext } from 'react';
import { Asset } from 'expo-asset';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { ThemeContext } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';
import { database } from '../context/firebase'; // ou o caminho certo no seu projeto
import { push, ref, set } from 'firebase/database';
import uuid from 'react-native-uuid';
import { startBackgroundTracking, stopBackgroundTracking } from '../context/locationTask';
import Constants from 'expo-constants';

// Chave de acesso para o serviço de rotas
const ORS_API_KEY = Constants.expoConfig.extra.orsApiKey;

// Dados de exemplo com locais de emergência
const locaisFakes = {
  // Cada chave representa um tipo de serviço de emergência
  policia: [
    { nome: 'Polícia Militar Jordão', telefone: '190', coords: { lat: -8.136382818902055, lon: -34.9368618530304 } },
    { nome: 'Delegacia Jardim Jordão', telefone: '190', coords: { lat: -8.139865903087069, lon: -34.93177269342763 } },
  ],
  bombeiros: [
    { nome: 'Corpo de Bombeiros', telefone: '193', coords: { lat: -8.164071996922287, lon: -34.922720115587936 } },
    { nome: 'CBM Bombeiros Militar', telefone: '193', coords: { lat: -8.050742290095572, lon: -34.89125356146615 } },
  ],
  hospitais: [
    { nome: 'Hospital Otávio de Freitas', telefone: '(81) 3182-8500', coords: { lat: -8.08588628783825, lon: -34.96234114070481 } },
    { nome: 'Hospital Areias', telefone: '(81) 3182-3000', coords: { lat: -8.100129945192489, lon: -34.926403746465134 } },
  ],
  upas: [
    { nome: 'UPA - Tipo III Lagoa Encantada', telefone: '(81) 3184-4595', coords: { lat: -8.12866692590721, lon: -34.9495069969486 } },
    { nome: 'UPAE Dois Rios', telefone: '(81) 3788-3888', coords: { lat: -8.109822044415735, lon: -34.936491318057705 } },
    { nome: 'UPA Imbiribeira', telefone: '(81) 3184-4328', coords: { lat: -8.120891590987684, lon: -34.91386177605739 } },
    { nome: 'UPAE-R Ipsep', telefone: '(81) 3788-3899', coords: { lat: -8.10050097842462, lon: -34.92554985444436 } },
  ],
  samu: [
    { nome: 'SAMU Ibura', telefone: '192', coords: { lat: -8.120201418927774, lon: -34.94444233872937 } },
    { nome: 'SAMU Piedade', telefone: '192', coords: { lat: -8.162931568756852, lon: -34.915201384780055 } },
  ],
};

// Componente principal da tela de emergência
export default function EmergenciaScreen({ route, navigation }) {
  // Recebe o tipo de emergência da navegação
  const { tipo } = route.params;
  // Contexto do tema (claro/escuro)
  const { darkMode, isAuto } = useContext(ThemeContext);

  // Estados para localização, destino, rota, carregamento, etc.
  const [loc, setLoc] = useState(null); // Localização do usuário
  let debounceTimeout = null; // Controle para evitar múltiplos cliques rápidos

  // Função para traçar rota até um local
  const handleTraçarRota = (coords, nome) => {
    if (debounceTimeout) return; // Ignora se já está esperando

    setLoadingDestino(nome); // Mostra loading no botão
    setRotaCoords([]); // Limpa rota anterior
    setInfoRota(null); // Limpa info anterior
    setDestino(null); // Limpa destino anterior

    debounceTimeout = setTimeout(() => {
      setDestino(coords); // Define novo destino
      debounceTimeout = null;
    }, 2000); // Espera 2 segundos para evitar cliques rápidos
  };

  const [rotaCoords, setRotaCoords] = useState([]); // Coordenadas da rota
  const [infoRota, setInfoRota] = useState(null); // Informações da rota (distância, tempo)
  const [loading, setLoading] = useState(false); // Estado de carregamento geral
  const [destino, setDestino] = useState(null); // Destino selecionado
  const [loadingDestino, setLoadingDestino] = useState(null); // Loading do botão de rota
  const pontos = locaisFakes[tipo] || []; // Lista de pontos do tipo selecionado
  const [watcher, setWatcher] = useState(null); // Não utilizado aqui

  // Pede permissão e pega a localização do usuário ao abrir a tela
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Negada', 'É necessário permitir acesso à localização para usar esta função.');
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        setLoc(coords); // Salva localização
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter a localização.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Busca nova rota sempre que localização ou destino mudam
  useEffect(() => {
    if (loc && destino) {
      buscarRota().finally(() => setLoadingDestino(null));
    }
  }, [loc, destino]);

  // Função para buscar rota entre usuário e destino usando OpenRouteService
  async function buscarRota() {
    if (!loc || !destino) return;

    setLoading(true);
    try {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${loc.longitude},${loc.latitude}&end=${destino.lon},${destino.lat}`;
      const resp = await fetch(url);
      const json = await resp.json();

      if (!json.features || json.features.length === 0) {
        throw new Error('Nenhuma rota encontrada.');
      }

      // Extrai coordenadas da rota
      const coords = json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRotaCoords(coords);

      // Extrai distância e duração
      const distanciaKm = (json.features[0].properties.summary.distance / 1000).toFixed(2);
      const duracaoMin = Math.round(json.features[0].properties.summary.duration / 60);
      setInfoRota({ distanciaKm, duracaoMin });
    } catch (e) {
      console.error("Erro ao buscar rota:", e);
      Alert.alert('Erro', 'Não foi possível buscar a rota.');
    } finally {
      setLoading(false);
      setLoadingDestino(null);
    }
  }

  // Função para abrir rota no Google Maps
  function abrirGoogleMaps(dest) {
    if (!dest) return;
    Alert.alert(
      'Abrir no Google Maps',
      'Deseja abrir a rota no aplicativo de mapas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir',
          onPress: () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lon}`;
            Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o Google Maps.'));
          },
        },
      ]
    );
  }

  // Função para iniciar rastreamento em tempo real (botão de pânico)
  function iniciarRastreamento() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // Vibração leve

    Alert.alert(
      '🚨 Rastrear em tempo real',
      'Deseja compartilhar sua localização ao vivo por 1 hora?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: async () => {
            try {
              const rastreioId = uuid.v4(); // Gera ID único
              console.log('🔁 Iniciando rastreamento com ID:', rastreioId);
              await startBackgroundTracking(rastreioId); // Inicia rastreamento

              // Gera link para compartilhar
              const link = `https://sos-comunidade-a98de.web.app/rastreamento.html?id=${rastreioId}`;
              const msg = `🚨 SOS! Me acompanhe em tempo real: ${link}`;

              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`); // Abre WhatsApp

              // Para rastreamento após 1 hora
              setTimeout(async () => {
                await stopBackgroundTracking();
                Alert.alert('Rastreamento encerrado', 'Acompanhar ao vivo finalizado.');
              }, 60 * 60 * 1000); // 1 hora

            } catch (err) {
              console.error('Erro ao iniciar rastreamento:', err);
              Alert.alert('Erro', 'Não foi possível iniciar o rastreamento.');
            }
          },
        },
      ]
    );
  }

  // Função que gera o HTML do mapa (usado no WebView)
  function gerarHTMLMapa() {
    // Centraliza no usuário ou no primeiro ponto
    const center = loc ? `${loc.latitude},${loc.longitude}` : `${pontos[0]?.coords.lat || 0},${pontos[0]?.coords.lon || 0}`;

    // Gera marcadores dos pontos de emergência
    const marcadores = pontos.map(p => `
    L.marker([${p.coords.lat},${p.coords.lon}], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [30, 30], 
        iconAnchor: [15, 30], 
        popupAnchor: [0, -30]
      })
    }).addTo(map).bindPopup('${p.nome}');
  `).join('\n');

    // Marcador do usuário
    const marcadorUsuario = loc ? `
    var userIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -30]
    });
    var userMarker = L.marker([${loc.latitude}, ${loc.longitude}], { icon: userIcon }).addTo(map);
    userMarker.bindPopup("Você está aqui").openPopup();
  ` : '';

    // Linha da rota traçada
    const linhaReal = rotaCoords.length > 0
      ? `L.polyline(${JSON.stringify(rotaCoords)}, { color: '#4dabf7', weight: 4 }).addTo(map);`
      : '';

    // Botão para centralizar no usuário
    const botaoCentralizar = loc ? `
    var centralizarBtn = L.control({position: 'topleft'});
    centralizarBtn.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'leaflet-bar centralizar-btn');
      div.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="#4dabf7">' + 
                      '<path d="M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0-6a1 1 0 0 1 1 1v2.07a8.001 8.001 0 0 1 6.93 6.93H22a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2.07a8.001 8.001 0 0 1-6.93 6.93V22a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2.07a8.001 8.001 0 0 1-6.93-6.93H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h2.07a8.001 8.001 0 0 1 6.93-6.93V3a1 1 0 0 1 1-1h2Z"/>' + 
                      '</svg>';
      div.onclick = function() {
        map.setView([${loc.latitude}, ${loc.longitude}], 15);
      };
      return div;
    };
    centralizarBtn.addTo(map);
  ` : '';

    // Ajusta o zoom para mostrar usuário e destino
    const fitBoundsCode = (loc && destino) ? `
    var bounds = L.latLngBounds([
      [${loc.latitude}, ${loc.longitude}],
      [${destino.lat}, ${destino.lon}]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  ` : '';

    // HTML do mapa
    return `
    <html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style> 
        html, body, #map { height: 100%; margin: 0; padding: 0; }
        .centralizar-btn { 
          background: ${darkMode ? '#3a3a3c' : 'white'}; 
          border-radius: 8px; 
          padding: 3px; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3); 
          cursor: pointer; 
        }
        .centralizar-btn:hover { 
          background: ${darkMode ? '#4a4a4c' : '#f0f0f0'}; 
        }
      </style>
    </head><body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        // Camadas de mapas base
        var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors"
        });

        var cartoLight = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://carto.com/">Carto</a>',
          subdomains: 'abcd',
          maxZoom: 19
        });

        var cartoDark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://carto.com/">Carto</a>',
          subdomains: 'abcd',
          maxZoom: 19
        });

        var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          attribution: 'Tiles © Esri'
        });

        // Inicializa o mapa
        var map = L.map('map', {
          center: [${center}],
          zoom: 13,
          layers: [${darkMode ? 'cartoDark' : 'cartoLight'}]
        });

        // Controle de camadas
        var baseMaps = {
          "🌍 OpenStreetMap": osm,
          "🧊 Claro (Carto Light)": cartoLight,
          "🌙 Escuro (Carto Dark)": cartoDark,
          "🛰️ Satélite (Esri)": satellite
        };

        L.control.layers(baseMaps).addTo(map);

        // Aplica filtro visual se camada escura ativa
        function atualizarFiltro() {
          const tilePane = document.querySelector('.leaflet-tile-pane');
          if (!tilePane) return;
          const isDark = Object.values(map._layers).some(layer =>
            layer._url && layer._url.includes('dark_all')
          );
          tilePane.style.filter = isDark ? 'brightness(4) contrast(1)' : 'none';
        }
        atualizarFiltro();
        map.on('baselayerchange', atualizarFiltro);

        ${marcadores}
        ${marcadorUsuario}
        ${linhaReal}
        ${botaoCentralizar}
        ${fitBoundsCode}
      </script>
    </body></html>
  `;
  }

  // Renderização do componente
  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#2d2d30' : '#fff' }]}>
      {/* Mapa */}
      <View style={styles.mapaContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: gerarHTMLMapa() }}
          style={{ flex: 1 }}
          key={darkMode ? 'dark' : 'light'} // Força recriação ao mudar o tema
        />
      </View>

      {/* Informações da rota */}
      {infoRota && (
        <Text style={[styles.infoRota, { color: darkMode ? '#fff' : '#000' }]}>
          Distância: {infoRota.distanciaKm} km · Tempo: {infoRota.duracaoMin} min
        </Text>
      )}

      {/* Lista de locais de emergência */}
      <FlatList
        data={pontos}
        keyExtractor={item => item.nome}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: darkMode ? '#3a3a3c' : '#f8f9fa' }]}>
            <Text style={[styles.nome, { color: darkMode ? '#e9ecef' : '#212529' }]}>{item.nome}</Text>
            <Text style={[styles.tel, { color: darkMode ? '#adb5bd' : '#495057' }]}>📞 {item.telefone}</Text>
            <View style={styles.actions}>
              {/* Botão para traçar rota */}
              <TouchableOpacity
                style={[styles.button, styles.buttonRoute, loadingDestino === item.nome && { opacity: 0.7 }]}
                onPress={() => handleTraçarRota(item.coords, item.nome)}
                disabled={loadingDestino !== null}
              >
                {loadingDestino === item.nome ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.linkWhite}>🗺️ Traçar rota</Text>
                )}
              </TouchableOpacity>
              {/* Botão para abrir no Maps */}
              <TouchableOpacity style={[styles.button, styles.buttonMap]} onPress={() => abrirGoogleMaps(item.coords)} disabled={loadingDestino !== null}>
                <Text style={styles.linkWhite}>📍 Maps</Text>
              </TouchableOpacity>
              {/* Botão para ligar */}
              <TouchableOpacity style={[styles.button, styles.buttonCall]} onPress={() => Linking.openURL(`tel:${item.telefone}`)} disabled={loadingDestino !== null}>
                <Text style={styles.linkWhite}>📞 Ligar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botão de pânico */}
      <TouchableOpacity
        style={[styles.buttonPanico, { backgroundColor: '#ff6b6b' }]}
        onPress={iniciarRastreamento}
      >
        <Text style={styles.buttonPanicoText}>🚨 Botão de Pânico</Text>
      </TouchableOpacity>

      {/* Botão de voltar */}
      <TouchableOpacity
        style={[styles.buttonVoltar, { backgroundColor: '#1E90FF' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonVoltarText}> ◀️ Voltar para Início</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos da tela
// Estilos da tela de emergência
const styles = StyleSheet.create({
  // Container principal da tela
  container: {
    flex: 1, // Ocupa toda a tela
  },
  // Container do mapa (WebView)
  mapaContainer: {
    height: Dimensions.get('window').height * 0.4, // Altura do mapa (40% da tela)
  },
  // Texto de informações da rota (distância/tempo)
  infoRota: {
    textAlign: 'center', // Centraliza texto
    marginVertical: 8, // Espaço vertical
    fontWeight: 'bold',
    paddingHorizontal: 16, // Espaço lateral
  },
  // Estilo da lista de locais de emergência
  list: {
    paddingHorizontal: 12, // Espaço lateral da lista
    paddingBottom: 20, // Espaço inferior
  },
  // Card de cada local de emergência
  card: {
    marginVertical: 6, // Espaço entre cards
    padding: 12, // Espaço interno
    borderRadius: 8, // Bordas arredondadas
    elevation: 1, // Sombra Android
  },
  // Nome do local (título do card)
  nome: {
    fontWeight: 'bold', // Nome em negrito
    marginBottom: 4, // Espaço abaixo do nome
    fontSize: 16, // Tamanho da fonte do nome
  },
  // Telefone do local
  tel: {
    marginBottom: 6, // Espaço abaixo do telefone
    fontSize: 14, // Tamanho da fonte do telefone
  },
  // Container dos botões de ação do card
  actions: {
    flexDirection: 'row', // Botões lado a lado
    justifyContent: 'space-between', // Espaço entre botões
    marginTop: 8, // Espaço acima dos botões
    gap: 8, // Espaço entre botões (RN >= 0.71)
  },
  // Estilo base dos botões de ação
  button: {
    paddingVertical: 6, // Espaço vertical do botão
    paddingHorizontal: 10, // Espaço horizontal do botão
    borderRadius: 4, // Bordas arredondadas do botão
    minWidth: 90, // Largura mínima do botão
    alignItems: 'center', // Centraliza texto do botão
  },
  // Botão de traçar rota
  buttonRoute: {
    backgroundColor: '#e63946', // Cor do botão de rota
  },
  // Botão de ligar
  buttonCall: {
    backgroundColor: '#4dabf7', // Cor do botão de ligar
  },
  // Botão de abrir no Maps
  buttonMap: {
    backgroundColor: '#6c757d', // Cor do botão de maps
  },
  // Texto branco dos botões
  linkWhite: {
    color: '#fff', // Texto branco
    fontWeight: 'bold', // Texto em negrito
    fontSize: 14, // Tamanho da fonte do texto do botão
  },
  // Botão de pânico (rastrear em tempo real)
  buttonPanico: {
    margin: 16, // Espaço externo do botão de pânico
    paddingVertical: 14, // Espaço vertical interno
    borderRadius: 8, // Bordas arredondadas
    alignItems: 'center', // Centraliza texto
    shadowColor: '#000', // Cor da sombra
    shadowOpacity: 0.2, // Opacidade da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowRadius: 4, // Raio da sombra
  },
  // Texto do botão de pânico
  buttonPanicoText: {
    color: '#fff', // Texto branco
    fontWeight: 'bold', // Texto em negrito
    fontSize: 16, // Tamanho da fonte
  },
  // Botão de voltar para a tela inicial
  buttonVoltar: {
    paddingVertical: 14, // Espaço vertical interno
    paddingHorizontal: 24, // Espaço horizontal interno
    borderRadius: 8, // Bordas arredondadas
    alignItems: 'center', // Centraliza texto
    justifyContent: 'center', // Centraliza conteúdo
    alignSelf: 'center', // Centraliza botão na tela
    marginTop: 8, // Espaço acima do botão
    marginBottom: 20, // Espaço abaixo do botão
    elevation: 2, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.2, // Opacidade da sombra
    shadowRadius: 4, // Raio da sombra
  },
  // Texto do botão de voltar
  buttonVoltarText: {
    color: '#ffffff', // Texto branco
    fontSize: 16, // Tamanho da fonte
    fontWeight: '600', // Peso da fonte
  },
});
