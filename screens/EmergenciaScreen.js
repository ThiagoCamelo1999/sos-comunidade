// Importação de bibliotecas que vamos usar
import React, { useEffect, useState, useContext } from 'react';
import { Asset } from 'expo-asset';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { ThemeContext } from '../context/ThemeContext';


// Chave de acesso para o serviço de rotas
const ORS_API_KEY = '5b3ce3597851110001cf62482af63f790a214459b1416e1ebf915798';

// Dados de exemplo com locais de emergência
const locaisFakes = {
  policia: [
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
export default function EmergenciaScreen({ route, navigation }) {
  const { tipo } = route.params;
  const { darkMode, isAuto } = useContext(ThemeContext);

  // Estados para guardar localização, destino e rota
  const [loc, setLoc] = useState(null);
  const [destino, setDestino] = useState(null);
  const [rotaCoords, setRotaCoords] = useState([]);
  const [infoRota, setInfoRota] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filtra os locais de acordo com o tipo escolhido
  const pontos = locaisFakes[tipo] || [];

  // Pede permissão e pega a localização do usuário
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Negada', 'É necessário permitir acesso à localização para usar esta função.');
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        setLoc(coords);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter a localização.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Toda vez que a localização ou destino mudarem, busca a nova rota
  useEffect(() => {
    if (loc && destino ) buscarRota();
  }, [loc, destino]);

  // Função para buscar o caminho entre o usuário e o destino
  async function buscarRota() {
    setLoading(true);
    try {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${loc.longitude},${loc.latitude}&end=${destino.lon},${destino.lat}`;
      const resp = await fetch(url);
      const json = await resp.json();

      if (!json.features || json.features.length === 0) {
        throw new Error('Nenhuma rota encontrada.');
      }

      const coords = json.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRotaCoords(coords);

      const distanciaKm = (json.features[0].properties.summary.distance / 1000).toFixed(2);
      const duracaoMin = Math.round(json.features[0].properties.summary.duration / 60);
      setInfoRota({ distanciaKm, duracaoMin });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível buscar a rota.');
    } finally {
      setLoading(false);
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
  function acionarPanico() {
    if (!loc) {
      Alert.alert('Localização', 'Localização ainda não disponível.');
      return;
    }
    const msg = `🚨 SOS! Preciso de ajuda. Localização: https://maps.google.com/?q=${loc.latitude},${loc.longitude}`;
    const link = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    Linking.openURL(link).catch(() => Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.'));
  }

 function gerarHTMLMapa() {
  const center = loc ? `${loc.latitude},${loc.longitude}` : `${pontos[0]?.coords.lat || 0},${pontos[0]?.coords.lon || 0}`;
  
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

  const linhaReal = rotaCoords.length > 0
    ? `L.polyline(${JSON.stringify(rotaCoords)}, { color: '#4dabf7', weight: 4 }).addTo(map);`
    : '';

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

  const fitBoundsCode = (loc && destino) ? `
    var bounds = L.latLngBounds([
      [${loc.latitude}, ${loc.longitude}],
      [${destino.lat}, ${destino.lon}]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  ` : '';

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
        var map = L.map('map').setView([${center}], 13);
       L.tileLayer('https://{s}.basemaps.cartocdn.com/${darkMode ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> contributors &copy; OpenStreetMap',
          subdomains: 'abcd',
          maxZoom: 19,
          minZoom: 12
        }).addTo(map);
        ${marcadores}
        ${marcadorUsuario}
        ${linhaReal}
        ${botaoCentralizar}
        ${fitBoundsCode}
      </script>
    </body></html>
  `;
}

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#2d2d30' : '#fff' }]}>
      <View style={styles.mapaContainer}>
        <WebView 
          originWhitelist={['*']} 
          source={{ html: gerarHTMLMapa() }} 
          style={{ flex: 1 }} 
          key={darkMode ? 'dark' : 'light'} // Força recriação ao mudar o tema
        />
      </View>

      {infoRota && (
        <Text style={[styles.infoRota, { color: darkMode ? '#fff' : '#000' }]}>
          Distância: {infoRota.distanciaKm} km · Tempo: {infoRota.duracaoMin} min
        </Text>
      )}

      <FlatList
        data={pontos}
        keyExtractor={item => item.nome}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: darkMode ? '#3a3a3c' : '#f8f9fa' }]}>
            <Text style={[styles.nome, { color: darkMode ? '#e9ecef' : '#212529' }]}>{item.nome}</Text>
            <Text style={[styles.tel, { color: darkMode ? '#adb5bd' : '#495057' }]}>📞 {item.telefone}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.button, styles.buttonRoute]} onPress={() => setDestino(item.coords)}>
                <Text style={styles.linkWhite}>🗺️ Traçar rota</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonMap]} onPress={() => abrirGoogleMaps(item.coords)}>
                <Text style={styles.linkWhite}>📍 Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonCall]} onPress={() => Linking.openURL(`tel:${item.telefone}`)}>
                <Text style={styles.linkWhite}>📞 Ligar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity 
        style={[styles.buttonPanico, { backgroundColor: '#ff6b6b' }]} 
        onPress={acionarPanico}
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


const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  mapaContainer: { 
    height: Dimensions.get('window').height * 0.4,
  },
  infoRota: {
    textAlign: 'center', 
    marginVertical: 8, 
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  list: { 
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: { 
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  nome: { 
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
  tel: { 
    marginBottom: 6,
    fontSize: 14,
  },
  actions: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonRoute: { 
    backgroundColor: '#e63946',
  },
  buttonCall: { 
    backgroundColor: '#4dabf7',
  },
  buttonMap: { 
    backgroundColor: '#6c757d',
  },
  linkWhite: { 
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonPanico: { 
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonPanicoText: { 
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
   buttonVoltar: {
    paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  marginTop: 8,
  marginBottom: 20,
  elevation: 2, // sombra Android
  shadowColor: '#000', // sombra iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  },
  buttonVoltarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
});