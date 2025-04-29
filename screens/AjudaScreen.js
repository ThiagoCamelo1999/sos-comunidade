// Importa bibliotecas necessárias
import React, { useContext } from 'react'; // React e useContext para usar o contexto de tema (claro/escuro)
import { View, Text, StyleSheet, Button, Linking } from 'react-native'; // Componentes da interface do usuário
import { ThemeContext } from '../context/ThemeContext'; // Pega o tema (claro ou escuro) do contexto

// Define o componente principal da tela de Ajuda
export default function AjudaScreen({ navigation }) {
  // Pega o valor de darkMode (modo escuro ou não) do contexto
  const { darkMode } = useContext(ThemeContext);

  // Define estilos de fundo e texto de acordo com o tema
  const themeBackground = darkMode ? styles.dark : styles.light;
  const themeText = darkMode ? styles.textDark : styles.textLight;

  // Tudo que aparece na tela é retornado aqui
  return (
    <View style={[styles.container, themeBackground]}>
      {/* Título principal da tela */}
      <Text style={[styles.title, themeText]}>ℹ️ Sobre o SOS Comunidade</Text>

      {/* Parágrafo explicando o objetivo do app */}
      <Text style={[styles.paragraph, themeText]}>
        Este app ajuda usuários em situações de emergência, conectando-os a serviços essenciais como polícia, hospitais e bombeiros.
      </Text>

      {/* Subtítulo: Como usar */}
      <Text style={[styles.subtitle, themeText]}>❓ Como usar</Text>

      {/* Lista de instruções sobre como usar o app */}
      <Text style={themeText}>• Escolha o tipo de emergência na tela inicial</Text>
      <Text style={themeText}>• Veja os locais próximos ou entre em contato diretamente</Text>
      <Text style={themeText}>• Use o mapa para navegar até o local</Text>

      {/* Subtítulo: Contato de suporte */}
      <Text style={[styles.subtitle, themeText]}>📞 Contato de suporte</Text>

      {/* Informações de contato */}
      <Text style={themeText}>Email: suporte@soscomunidade.com</Text>

      {/* Número de telefone que, ao ser clicado, faz ligação */}
      <Text
        style={[themeText, { textDecorationLine: 'underline' }]} // Sublinha o número para parecer clicável
        onPress={() => Linking.openURL('tel:81995399641')} // Abre o discador do telefone
      >
        Telefone: (81) 99539-9641
      </Text>

      {/* Botão para voltar para a tela inicial */}
      <View style={{ marginTop: 30 }}>
        <Button
          title="◀️ Voltar para Início" // Texto do botão
          onPress={() => navigation.goBack()} // Função que volta para a tela anterior
          color="#007bff" // Cor azul do botão
        />
      </View>
    </View>
  );
}

// Aqui definimos os estilos da tela (cores, tamanhos, espaçamentos)
const styles = StyleSheet.create({
  container: {
    padding: 20, // Espaço interno
    flex: 1, // Ocupa toda a altura disponível da tela
  },
  title: {
    fontSize: 22, // Tamanho grande do texto
    fontWeight: 'bold', // Deixa o texto em negrito
    marginBottom: 10, // Espaço embaixo do título
  },
  subtitle: {
    marginTop: 20, // Espaço acima dos subtítulos
    fontSize: 18, // Tamanho do texto
    fontWeight: '500', // Negrito médio
  },
  paragraph: {
    marginBottom: 10, // Espaço embaixo dos parágrafos
    lineHeight: 22, // Espaçamento entre linhas
  },
  light: {
    backgroundColor: '#fff', // Cor de fundo branca para o tema claro
  },
  dark: {
    backgroundColor: '#1c1c1e', // Cor de fundo escura para o tema escuro
  },
  textLight: {
    color: '#000', // Cor preta para texto no tema claro
  },
  textDark: {
    color: '#fff', // Cor branca para texto no tema escuro
  },
});
