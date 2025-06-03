// Importa as bibliotecas e componentes necessários do React e React Native
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
// Importa o contexto do tema para alternar entre modo claro/escuro
import { ThemeContext } from '../context/ThemeContext';
// Importa o objeto de temas centralizado
import { theme } from '../theme';
// Importa o SafeAreaView para garantir que o conteúdo não fique sob a barra de status (não está sendo usado aqui)
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente principal da tela de Ajuda
export default function AjudaScreen({ navigation }) {
  // Obtém o estado do modo escuro do contexto do tema
  const { darkMode } = useContext(ThemeContext);
  // Seleciona as cores do tema conforme o modo atual
  const colors = theme.colors[darkMode ? 'dark' : 'light'];

  return (
    // Container principal da tela, com cor de fundo do tema
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cabeçalho com o título da tela */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          ℹ️ Sobre o SOS Comunidade
        </Text>
      </View>

      {/* Conteúdo principal da tela */}
      <View style={styles.content}>
        {/* Parágrafo explicando o propósito do app */}
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Este aplicativo conecta usuários em situações de emergência aos serviços essenciais mais próximos, incluindo polícia, hospitais e bombeiros.
        </Text>

        {/* Seção de instruções de uso */}
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: colors.text }]}>❓ Como usar</Text>
          {/* Lista de passos para usar o app */}
          <View style={styles.listItem}>
            <Text style={[styles.bullet, { color: colors.button }]}>•</Text>
            <Text style={[styles.listText, { color: colors.text }]}>
              Escolha o tipo de emergência na tela inicial
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={[styles.bullet, { color: colors.button }]}>•</Text>
            <Text style={[styles.listText, { color: colors.text }]}>
              Visualize os locais próximos no mapa
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={[styles.bullet, { color: colors.button }]}>•</Text>
            <Text style={[styles.listText, { color: colors.text }]}>
              Entre em contato diretamente ou trace rotas
            </Text>
          </View>
        </View>

        {/* Seção de contato para suporte */}
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            📞 Contato de suporte
          </Text>
          {/* Informação de email de suporte */}
          <View style={styles.contactItem}>
            <Text style={[styles.contactLabel, { color: colors.secondaryText }]}>
              Email:
            </Text>
            <Text style={[styles.contactValue, { color: colors.text }]}>
              suporte@soscomunidade.com
            </Text>
          </View>
          {/* Botão para ligar para o suporte */}
          <TouchableOpacity
            onPress={() => Linking.openURL('tel:81995399641')}
            style={styles.contactItem}
          >
            <Text style={[styles.contactLabel, { color: colors.secondaryText }]}>
              Telefone:
            </Text>
            <Text style={[styles.contactValue, { color: colors.button }]}>
              (81) 99539-9641
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão para voltar para a tela inicial */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.button }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText || '#fff' }]}>
          ◀️ Voltar para Início
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos da tela usando StyleSheet do React Native
const styles = StyleSheet.create({
  // Container principal da tela
  container: {
    flex: 1, // Ocupa toda a tela
    padding: 24, // Espaçamento interno
    backgroundColor: 'transparent', // Cor de fundo definida pelo tema
  },
  // Cabeçalho da tela (título)
  header: {
    marginBottom: 24, // Espaço abaixo do cabeçalho
    alignItems: 'center', // Centraliza o título
  },
  // Estilo do texto do título
  title: {
    fontSize: 26, // Tamanho da fonte do título
    fontWeight: 'bold', // Negrito
    textAlign: 'center', // Centraliza o texto
  },
  // Área de conteúdo principal
  content: {
    flex: 1, // Ocupa o espaço restante da tela
  },
  // Seção de agrupamento (ex: instruções, contato)
  section: {
    marginBottom: 24, // Espaço entre seções
  },
  // Estilo do subtítulo das seções
  subtitle: {
    fontSize: 18, // Tamanho da fonte do subtítulo
    fontWeight: '600', // Seminegrito
    marginBottom: 12, // Espaço abaixo do subtítulo
  },
  // Parágrafo de texto explicativo
  paragraph: {
    fontSize: 16, // Tamanho da fonte do parágrafo
    lineHeight: 24, // Altura da linha
    marginBottom: 24, // Espaço abaixo do parágrafo
    textAlign: 'justify', // Justifica o texto
  },
  // Item da lista de instruções
  listItem: {
    flexDirection: 'row', // Itens em linha (marcador + texto)
    alignItems: 'flex-start', // Alinha ao topo
    marginBottom: 8, // Espaço entre itens
    paddingLeft: 8, // Espaço à esquerda
  },
  // Estilo do marcador (bullet) da lista
  bullet: {
    marginRight: 8, // Espaço após o marcador
    fontSize: 18, // Tamanho do marcador
    lineHeight: 22, // Altura da linha do marcador
  },
  // Texto do item da lista
  listText: {
    fontSize: 16, // Tamanho do texto do item
    flex: 1, // Ocupa o espaço restante
  },
  // Linha de contato (label + valor)
  contactItem: {
    flexDirection: 'row', // Linha para label e valor
    alignItems: 'center', // Centraliza verticalmente
    marginBottom: 8, // Espaço entre contatos
  },
  // Estilo do label do contato (ex: "Email:")
  contactLabel: {
    width: 80, // Largura fixa para o label
    fontSize: 16,
    fontWeight: '500', // Seminegrito
  },
  // Valor do contato (ex: email ou telefone)
  contactValue: {
    fontSize: 16,
    flex: 1, // Ocupa o espaço restante
  },
  // Estilo do botão de voltar
  button: {
    paddingVertical: 14, // Espaço vertical interno
    paddingHorizontal: 32, // Espaço horizontal interno
    borderRadius: 8, // Bordas arredondadas
    alignItems: 'center', // Centraliza o texto
    justifyContent: 'center',
    alignSelf: 'center', // Centraliza o botão na tela
    marginTop: 24, // Espaço acima do botão
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Cor da sombra no iOS
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.2, // Opacidade da sombra
    shadowRadius: 4, // Raio da sombra
    minWidth: 200, // Largura mínima do botão
  },
  // Estilo do texto do botão
  buttonText: {
    color: '#ffffff', // Cor do texto do botão
    fontSize: 16,
    fontWeight: '600', // Seminegrito
  },
});