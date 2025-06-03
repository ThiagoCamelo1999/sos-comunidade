
// Dados de exemplo com locais de emergência
const locaisFakes = {
  // Cada chave representa um tipo de serviço de emergência
  
  policia: [
    { nome: 'Núcleo da Polícia Militar Jordão Baixo', endereco: 'R. Escola de Sagres, S/N - Jordão, Recife - PE, 51260-010', telefone: '(81) 3181-1394', coords: { lat: -8.136382818902055, lon: -34.9368618530304 } },
    { nome: 'Delegacia de policia do Jordão', endereco: 'R. Profa. Arcelina Câmara, 45 - Jordão, Recife - PE, 51250-220', telefone: '190', coords: { lat: -8.139865903087069, lon: -34.93177269342763 } },
    { nome: 'Núcleo de Segurança Comunitária - Ibura', endereco: 'Avenida Pernambuco S/N UR1 - Ibura, Recife - PE, 51280-000', telefone: "(81) 3301-3102", coords: { lat: -8.120552060526043, lon: -34.94588563217335 } },
    { nome: '06º Delegacia de Polícia - Casa Amarela', endereco: 'R. Paula Batista, 616 - Casa Amarela, Recife - PE, 52070-070', telefone: '(81) 3184-3426', coords: { lat: -8.027634389091457, lon: -34.916827218683686 } }

  ],
  bombeiros: [
    { nome: 'Corpo de Bombeiros', endereco: 'R. Arão Lins de Andrade, 1043 - Prazeres, Jaboatão dos Guararapes - PE, 54310-335', telefone: '(81) 3412-8200', coords: { lat: -8.164071996922287, lon: -34.922720115587936 } },
    { nome: 'CBM Bombeiros Militar', endereco: 'R. Tabira, 230 - Boa Vista, Recife - PE, 50050-330', telefone: '193', coords: { lat: -8.050742290095572, lon: -34.89125356146615 } },
    { nome: 'Comando Geral do Corpo de Bombeiros Militar de Pernambuco - CG CBMPE', endereco: 'Av. João de Barros, 399 - Soledade, Recife - PE, 50050-180', telefone: '(81) 3182-9187', coords: { lat: -8.051183554015964, lon: -34.890449099522776 } },
    { nome: 'Corpo de Bombeiros Militar de Pernambuco - São José', endereco: 'Av. Rio Capibaribe, 147 - São José, Recife - PE, 50020-080', telefone: '193', coords: { lat: -8.067023294097053, lon: -34.88500802570225 } }
  ],
  hospitais: [
    { nome: 'Hospital Otávio de Freitas', endereco: 'R. Aprígio Guimarães, s/n - Tejipio, Recife - PE, 50920-460', telefone: '(81) 3182-8500', coords: { lat: -8.08588628783825, lon: -34.96234114070481 } },
    { nome: 'Hospital Geral de Areias - Sony Santos', endereco: 'Av. Recife, 810 - Estância, Recife - PE, 50870-901', telefone: '(81) 3182-3000', coords: { lat: -8.100129945192489, lon: -34.926403746465134 } },
    { nome: 'Hospital da Restauração Gov. Paulo Guerra', endereco: 'Av. Gov. Agamenon Magalhães, s/n - Derby, Recife - PE, 52171-011', telefone: '(81) 3181-5400', coords: { lat: -8.05345444063023, lon: -34.89771794230228 } },
    { nome: 'Hospital da Mulher do Recife (HMR)', endereco: 'Av. Recife, 5629 - Estância, Recife - PE, 50110-727', telefone: '(81)2011-0100', coords: { lat: -8.070360043562333, lon: -34.941048203338106 } },
    { nome: 'Real Hospital Português de Boa Viagem', endereco: 'Av. Conselheiro Aguiar, 2502 - Boa Viagem, Recife - PE, 51020-020', telefone: '(81) 3416-1111', coords: { lat: -8.111410577031862, lon: -34.89202437484117 } },
    { nome: 'Hospital de Boa Viagem', endereco: 'R. Ana Camelo da Silva, 315 - Boa Viagem, Recife - PE, 51111-040', telefone: '(81) 99291-0764', coords: { lat: -8.108602061534063, lon: -34.892626544534444 } }
  ],
  upas: [
    { nome: 'UPA - Tipo III Lagoa Encantada', endereco: 'Rua Vale do Itajaí, S / N, Ibura - COHAB, Recife - PE, 51280-590', telefone: '(81) 3184-4595', coords: { lat: -8.12866692590721, lon: -34.9495069969486 } },
    { nome: 'UPAE Dois Rios', endereco: 'Av. Dois Rios, 170 - Ibura, Recife - PE, 51230-000', telefone: '(81) 3788-3888', coords: { lat: -8.109822044415735, lon: -34.936491318057705 } },
    { nome: 'UPA Imbiribeira', endereco: 'Av. Mal. Mascarenhas de Morais, 4223 - Imbiribeira, Recife - PE, 51150-004', telefone: '(81) 3184-4328', coords: { lat: -8.120891590987684, lon: -34.91386177605739 } },
    { nome: 'UPAE-R Ipsep', endereco: 'R. Interna, 801 - Ipsep, Recife - PE, 51350-351', telefone: '(81) 3788-3899', coords: { lat: -8.10050097842462, lon: -34.92554985444436 } },
  ],
  samu: [
    { nome: 'SAMU Ibura', endereco: 'r 144, R. Santa Maria, 2 - COHAB, Recife - PE, 51290-200', telefone: '192', coords: { lat: -8.120201418927774, lon: -34.94444233872937 } },
    { nome: 'SAMU Piedade', endereco: 'Rua Comendador José Didier, 300 - Piedade, Jaboatão dos Guararapes - PE, 54400-160', telefone: '(81) 3343-4109', coords: { lat: -8.162931568756852, lon: -34.915201384780055 } },
    { nome: 'SAMU Afogados', endereco: 'R. Dr. Carlos Alberto de Menezes - Afogados, Recife - PE, 50770-360', telefone: '3232-5800', coords: { lat: -8.078555430082268, lon: -34.911129446026756 } },
    { nome: 'SAMU Boa Vista', endereco: 'R. Dr. José de Melo, 100 - Boa Viagem, Recife - PE, 51020-010', telefone: '192', coords: { lat: -8.059499645168316, lon: -34.893778941101345 } }
  ],
};
export default locaisFakes;