import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { theme } from '../theme'; // Importa o tema centralizado

export default function AjudaScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const colors = theme.colors[darkMode ? 'dark' : 'light'];

  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          ℹ️ Sobre o SOS Comunidade
        </Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Este aplicativo conecta usuários em situações de emergência aos serviços essenciais mais próximos, incluindo polícia, hospitais e bombeiros.
        </Text>

        {/* Seção Como Usar */}
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: colors.text }]}>❓ Como usar</Text>
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

        {/* Seção Contato */}
        <View style={styles.section}>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            📞 Contato de suporte
          </Text>
          <View style={styles.contactItem}>
            <Text style={[styles.contactLabel, { color: colors.secondaryText }]}>
              Email:
            </Text>
            <Text style={[styles.contactValue, { color: colors.text }]}>
              suporte@soscomunidade.com
            </Text>
          </View>
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

      {/* Botão de voltar */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
  },
  listText: {
    fontSize: 16,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  contactLabel: {
    width: 80,
    fontSize: 16,
  },
  contactValue: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  marginTop: 24,
  elevation: 2, // sombra Android
  shadowColor: '#000', // sombra iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});