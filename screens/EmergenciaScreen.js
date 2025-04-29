// Importação de bibliotecas que vamos usar
import React, { useEffect, useState, useContext } from 'react';
import { Asset } from 'expo-asset';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { ThemeContext } from '../context/ThemeContext';


// Chave de acesso para o serviço de rotas
const ORS_API_KEY = "coloque aqui sua chave da api";

// Dados de exemplo com locais de emergência
const locaisFakes = {
  policia: [
    { nome: 'Polícia Civil', telefone: '197', coords: { lat: -8.059658, lon: -34.901112 } },
    { nome: 'Polícia Militar Jordão', telefone: '190', coords: { lat: -8.136382818902055,  lon: -34.9368618530304 } },
    { nome: 'Delegacia Jardim Jordão', telefone: '190', coords: { lat: -8.139865903087069, lon: -34.93177269342763 } },
  ],
  bombeiros: [
    { nome: 'Corpo de Bombeiros', telefone: '193', coords: { lat: -8.164071996922287,  lon: -34.922720115587936 } },
    { nome: 'CBM Bombeiros Militar', telefone: '193', coords: { lat: -8.050742290095572,  lon: -34.89125356146615 } },
  ],
  hospitais: [
    { nome: 'Hospital Otávio de Freitas', telefone: '(81) 3182-8500', coords: { lat: -8.08588628783825,  lon: -34.96234114070481 } },
    { nome: 'Hospital Areias', telefone: '(81) 3182-3000', coords: { lat: -8.100129945192489,   lon: -34.926403746465134} },
  ],
  upas: [
    { nome: 'UPA - Tipo III Lagoa Encantada', telefone: '(81) 3184-4595', coords: { lat: -8.12866692590721, lon: -34.9495069969486 } },
    { nome: 'UPAE Dois Rios', telefone: '(81) 3788-3888', coords: { lat: -8.109822044415735,  lon: -34.936491318057705 } },
    { nome: 'UPA Imbiribeira', telefone: '(81) 3184-4328', coords: { lat: -8.120891590987684,  lon: -34.91386177605739 } },
    { nome: 'UPAE-R Ipsep', telefone: '(81) 3788-3899', coords: { lat: -8.10050097842462,  lon: -34.92554985444436 } },
  ],
  samu: [
    { nome: 'SAMU Ibura', telefone: '192', coords: { lat: -8.120201418927774,  lon: -34.94444233872937 } },
    { nome: 'SAMU Piedade', telefone: '192', coords: { lat: -8.162931568756852,  lon: -34.915201384780055 } },
  ],
};

// Componente principal da tela de emergência
// Recebe o parâmetro 'tipo' que indica o tipo de emergência (policia, bombeiros, hospitais, upas, samu)
export default function EmergenciaScreen({ route }) {
  const { tipo } = route.params;
  const { darkMode } = useContext(ThemeContext);

  // Estados para guardar localização, destino e rota
  const [loc, setLoc] = useState(null);
  const [destino, setDestino] = useState(null);
  const [rotaCoords, setRotaCoords] = useState([]);
  const [infoRota, setInfoRota] = useState(null);

    // Filtra os locais de acordo com o tipo escolhido
  const pontos = locaisFakes[tipo] || [];
  const themeBackground = darkMode ? styles.dark : styles.light;
  const themeText = darkMode ? styles.textDark : styles.textLight;

  // Pede permissão e pega a localização do usuário
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'É necessário permitir acesso à localização para usar esta função.');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setLoc(coords);
    })();
  }, []);

  // Toda vez que a localização ou destino mudarem, busca a nova rota
  useEffect(() => {
    if (loc && destino) buscarRota();
  }, [loc, destino]);

  // Função para buscar o caminho entre o usuário e o destino
  async function buscarRota() {
    try {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${loc.longitude},${loc.latitude}&end=${destino.lon},${destino.lat}`;
      const resp = await fetch(url);
      const json = await resp.json();

      // Se não achou rota, mostra erro
      if (!json.features || json.features.length === 0) {
        throw new Error('Nenhuma rota encontrada.');
      }

      // Monta o caminho da linha
      // Converte as coordenadas de longitude/latitude para latitude/longitude
      const coords = json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRotaCoords(coords);

      // Pega a distância e duração da rota
      // Converte a distância de metros para quilômetros e arredonda para 2 casas decimais
      const distanciaKm = (json.features[0].properties.summary.distance / 1000).toFixed(2);
      const duracaoMin = Math.round(json.features[0].properties.summary.duration / 60);
      setInfoRota({ distanciaKm, duracaoMin });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível buscar a rota.');
    }
  }

  // Função para abrir o Google Maps com a rota
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

    // Função para enviar mensagem de emergência no WhatsApp
  // Se a localização não estiver disponível, mostra alerta
  function acionarPanico() {
    if (!loc) {
      Alert.alert('Localização', 'Localização ainda não disponível.');
      return;
    }
    const msg = `🚨 SOS! Preciso de ajuda. Localização: https://maps.google.com/?q=${loc.latitude},${loc.longitude}`;
    const link = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    Linking.openURL(link).catch(() => Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.'));
  }

    // Função que gera o HTML do mapa para mostrar no WebView
  // Usa a biblioteca Leaflet para criar o mapa e adicionar marcadores
  function gerarHTMLMapa() {
    // Ponto central do mapa
    const center = loc ? `${loc.latitude},${loc.longitude}` : `${pontos[0]?.coords.lat || 0},${pontos[0]?.coords.lon || 0}`;
    
    const emergenciaIcon = Asset.fromModule(require('../assets/icone-emergencia.png')).uri;
  
    // Coloca marcadores dos locais
    const marcadores = pontos.map(p => `
      L.marker([${p.coords.lat},${p.coords.lon}], {
        icon: L.icon({
          iconUrl: '${emergenciaIcon}',
          iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30]
        })
      }).addTo(map).bindPopup('${p.nome}');
    `).join('\n');

    const localizacaoIcon = Asset.fromModule(require('../assets/icone-localizacao.png')).uri;

    // Se a localização do usuário estiver disponível, adiciona um marcador para ela
    const marcadorUsuario = loc ? `
      var userIcon = L.icon({
        iconUrl: '${localizacaoIcon}',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -30]
      });
      var userMarker = L.marker([${loc.latitude}, ${loc.longitude}], { icon: userIcon }).addTo(map);
      userMarker.bindPopup("Você está aqui").openPopup();
    ` : '';

    // Se a rota estiver disponível, adiciona uma linha no mapa
    const linhaReal = rotaCoords.length > 0
      ? `L.polyline(${JSON.stringify(rotaCoords)}, { color: 'blue', weight: 4 }).addTo(map);`
      : '';

    // O botão centraliza o mapa na localização do usuário quando clicado
    const botaoCentralizar = loc ? `
      var centralizarBtn = L.control({position: 'topleft'});
      centralizarBtn.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'leaflet-bar centralizar-btn');
        div.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="#007bff">' + 
                        '<path d="M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0-6a1 1 0 0 1 1 1v2.07a8.001 8.001 0 0 1 6.93 6.93H22a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2.07a8.001 8.001 0 0 1-6.93 6.93V22a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2.07a8.001 8.001 0 0 1-6.93-6.93H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h2.07a8.001 8.001 0 0 1 6.93-6.93V3a1 1 0 0 1 1-1h2Z"/>' + 
                        '</svg>';
        div.onclick = function() {
          map.setView([${loc.latitude}, ${loc.longitude}], 15);
        };
        return div;
      };
      centralizarBtn.addTo(map);
    ` : '';

    // Monta todo o HTML e JavaScript do mapa
    // Adiciona o CSS do Leaflet e o estilo do botão de centralizar
    return `
      <html><head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style> html, body, #map { height: 100%; margin: 0; padding: 0; }
          .centralizar-btn { background: white; border-radius: 8px; padding: 3px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer; }
          .centralizar-btn:hover { background: #f0f0f0; }
        </style>
      </head><body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${center}], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> contributors &copy; OpenStreetMap',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 10
  }).addTo(map);
          ${marcadores}
          ${marcadorUsuario}
          ${linhaReal}
          ${botaoCentralizar}
        </script>
      </body></html>
    `;
  }

  // Tela que vai ser desenhada
  // Aqui usamos o WebView para mostrar o mapa e a FlatList para mostrar os locais
  // Também tem o botão de pânico que chama a função acionarPanico
  return (
    <View style={[styles.container, themeBackground]}>
      <View style={styles.mapaContainer}>
        <WebView originWhitelist={['*']} source={{ html: gerarHTMLMapa() }} style={{ flex: 1 }} />
      </View>

      {/* Informação de distância e tempo */}
      {infoRota && (
        <Text style={{ textAlign: 'center', marginVertical: 8, fontWeight: 'bold', color: darkMode ? '#fff' : '#000' }}>
          Distância: {infoRota.distanciaKm} km · Tempo: {infoRota.duracaoMin} min
        </Text>
      )}

      {/* Lista de locais de emergência */}
      <FlatList
        data={pontos}
        keyExtractor={item => item.nome}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, themeBackground]}>
            <Text style={[styles.nome, themeText]}>{item.nome}</Text>
            <Text style={[styles.tel, themeText]}>📞 {item.telefone}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.buttonRoute} onPress={() => setDestino(item.coords)}>
                <Text style={styles.linkWhite}>🗺️ Traçar rota</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonMap} onPress={() => abrirGoogleMaps(item.coords)}>
                <Text style={styles.linkWhite}>📍 Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCall} onPress={() => Linking.openURL(`tel:${item.telefone}`)}>
                <Text style={styles.linkWhite}>📞 Ligar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botão de pânico que chama a função acionarPanico */}
      <TouchableOpacity style={styles.buttonPanico} onPress={acionarPanico}>
        <Text style={styles.buttonPanicoText}>🚨 Botão de Pânico</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos de cores, tamanhos e espaçamentos
// Aqui usamos o Dimensions para pegar a altura da tela e fazer o mapa ocupar 40% dela
// Também usamos o StyleSheet para criar os estilos de forma otimizada
const styles = StyleSheet.create({
  /** 🗺️ Estilos relacionados ao mapa */
  container: { 
    flex: 1, // Faz o container ocupar todo o espaço da tela
  },
  mapaContainer: { 
    height: Dimensions.get('window').height * 0.4, // Mapa ocupa 40% da altura da tela
  },

  /** 📋 Estilos da lista de locais */
  list: { 
    paddingHorizontal: 12, // Espaçamento lateral
    paddingBottom: 20, // Espaçamento embaixo da lista
  },
  card: { 
    marginVertical: 6, // Espaço entre os cards
    padding: 12, // Espaçamento interno do card
    borderRadius: 6, // Bordas arredondadas
    backgroundColor: '#fafafa', // Cor de fundo do card
    elevation: 1, // Sombra leve para Android
  },
  nome: { 
    fontWeight: 'bold', // Nome em negrito
    marginBottom: 4, // Espaço abaixo do nome
  },
  tel: { 
    marginBottom: 6, // Espaço abaixo do telefone
  },

  /** ➡️ Estilos para área de botões de ação (rota, ligar, abrir mapa) */
  actions: { 
    flexDirection: 'row', // Botões alinhados lado a lado
    justifyContent: 'space-between', // Espaço igual entre os botões
    marginTop: 6, // Espaço acima dos botões
    gap: 8, // Espaço entre os botões (iOS/Android mais novos)
  },
  
  /** 🎯 Estilos específicos de cada botão de ação */
  buttonRoute: { 
    padding: 6, 
    backgroundColor: '#e63946', // Vermelho para "rota"
    borderRadius: 4, // Bordas arredondadas
  },
  buttonCall: { 
    padding: 6, 
    backgroundColor: '#007bff', // Azul para "ligar"
    borderRadius: 4,
  },
  buttonMap: { 
    padding: 6, 
    backgroundColor: '#6c757d', // Cinza para "ver no mapa"
    borderRadius: 4,
  },
  linkWhite: { 
    color: '#fff', // Texto branco dentro dos botões
    fontWeight: 'bold', 
  },

  /** 🚨 Estilo especial para o botão de "Botão do Pânico" */
  buttonPanico: { 
    margin: 10, // Espaçamento externo
    backgroundColor: '#cc0000', // Vermelho forte para emergência
    paddingVertical: 14, // Espaçamento vertical interno
    paddingHorizontal: 20, // Espaçamento horizontal interno
    borderRadius: 8, // Bordas arredondadas maiores
    alignItems: 'center', // Centraliza o texto
    shadowColor: '#000', // Cor da sombra
    shadowOpacity: 0.2, // Transparência da sombra
    shadowOffset: { width: 0, height: 2 }, // Direção da sombra
    shadowRadius: 4, // Espalhamento da sombra
  },
  buttonPanicoText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16, 
  },

  /** 🎨 Estilos para modo claro/escuro */
  light: { 
    backgroundColor: '#fff', // Fundo branco para tema claro
  },
  dark: { 
    backgroundColor: '#1c1c1e', // Fundo escuro para tema escuro
  },
  textLight: { 
    color: '#000', // Texto preto para fundo claro
  },
  textDark: { 
    color: '#fff', // Texto branco para fundo escuro
  },
});
