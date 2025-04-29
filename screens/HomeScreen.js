// Importa as bibliotecas necessárias
import React, { useContext } from 'react'; // React + useContext para usar o tema (escuro/claro)
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Button
} from 'react-native'; // Componentes básicos da interface
import { ThemeContext } from '../context/ThemeContext'; // Importa o contexto do tema (para mudar cor do app)

// Define os botões que vão aparecer na tela, cada um para um tipo de emergência
const botoes = [
  { tipo: 'policia', label: '🚔 Polícia' },
  { tipo: 'bombeiros', label: '🚒 Bombeiros' },
  { tipo: 'hospitais', label: '🏥 Hospitais' },
  { tipo: 'upas', label: '🏪 UPAs' },
  { tipo: 'samu', label: '🚑 SAMU' },
];

// Cria o componente principal da tela inicial (Home)
export default function HomeScreen({ navigation }) {
  // Pega do contexto se o modo escuro está ativo e a função para mudar o tema
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  // Define o fundo da tela de acordo com o tema atual
  const themeStyles = darkMode ? styles.dark : styles.light;

  // Define a cor do texto de acordo com o tema atual
  const textTheme = darkMode ? styles.textDark : styles.textLight;

  // Tudo que aparece na tela é retornado aqui
  return (
    <View style={{ flex: 1 }}>
      {/* ScrollView permite a rolagem da tela caso os conteúdos ultrapassem o tamanho do dispositivo */}
      <ScrollView
        contentContainerStyle={[styles.container, themeStyles, { flexGrow: 1 }]}
      >

        {/* Área do botão de troca de tema (claro/escuro) */}
        <View style={styles.toggleContainer}>
          {/* Ícone Sol/Lua */}
          <Text style={[styles.toggleLabel, textTheme]}>🌞/🌙</Text>
          {/* Botão tipo Switch para alternar o tema */}
          <Switch
            value={darkMode} // Mostra a posição atual (claro ou escuro)
            onValueChange={toggleTheme} // Muda o tema quando o usuário interage
            trackColor={{ false: '#ccc', true: '#333' }} // Cor da linha do switch
            thumbColor={darkMode ? '#f1c40f' : '#fff'} // Cor do botãozinho
          />
        </View>

        {/* Título principal do app */}
        <Text style={[styles.title, textTheme]}>SOS Comunidade 🚨</Text>

        {/* Subtítulo com instruções */}
        <Text style={[styles.subtitle, textTheme]}>
          Escolha o tipo de emergência:
        </Text>

        {/* Área onde aparecem todos os botões de emergência */}
        <View style={styles.buttonGrid}>
          {/* Para cada botão definido no array 'botoes', cria um botão na tela */}
          {botoes.map(item => (
            <View key={item.tipo} style={styles.button}>
              <Button
                title={item.label} // O que aparece no botão (ícone + texto)
                onPress={() =>
                  navigation.navigate('Emergencia', { tipo: item.tipo }) // Vai para a tela de emergência, passando o tipo
                }
                color="#e63946" // Cor vermelha para indicar urgência
              />
            </View>
          ))}
        </View>

        {/* Botão para ir para a tela de Ajuda */}
        <View style={{ marginTop: 20 }}>
          <Button
            title="❓ Ajuda" // Texto do botão
            onPress={() => navigation.navigate('Ajuda')} // Vai para a tela Ajuda
            color="#007bff" // Cor azul
          />
        </View>
      </ScrollView>
    </View>
  );
}

// Define os estilos da tela
const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Centraliza os itens na horizontal
    padding: 20, // Espaçamento interno
  },
  toggleContainer: {
    flexDirection: 'row', // Organiza o texto e o switch na horizontal
    alignItems: 'center', // Alinha verticalmente
    alignSelf: 'flex-end', // Coloca o switch no canto direito da tela
    marginBottom: 10, // Espaço abaixo
  },
  toggleLabel: { 
    marginRight: 8, // Espaço entre o texto e o botão switch
    fontSize: 16, // Tamanho do texto
  },
  title: { 
    fontSize: 28, // Tamanho grande do título
    marginBottom: 10, // Espaço abaixo do título
    fontWeight: 'bold', // Texto em negrito
  },
  subtitle: { 
    fontSize: 16, // Tamanho do subtítulo
    marginBottom: 20, // Espaço abaixo do subtítulo
  },
  buttonGrid: {
    width: '100%', // Ocupa toda a largura
    alignItems: 'center', // Centraliza os botões
  },
  button: {
    width: '100%', // Cada botão ocupa 100% da largura disponível
    marginVertical: 6, // Espaço entre os botões
  },
  light: { 
    backgroundColor: '#fff', // Cor de fundo branca para tema claro
  },
  dark: { 
    backgroundColor: '#1c1c1e', // Cor de fundo escura para tema escuro
  },
  textLight: { 
    color: '#000', // Texto preto para fundo claro
  },
  textDark: { 
    color: '#fff', // Texto branco para fundo escuro
  },
});
