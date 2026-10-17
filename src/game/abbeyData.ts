import { RoomDefinition, TaskDefinition, SabotageDefinition, VentLocation } from '../types/game';

export const ABBEY_ROOMS: RoomDefinition[] = [
  {
    id: 'nave',
    name: 'Nave Central',
    description: 'Corredor solene da catedral com colunas góticas, bancos de carvalho e o grande sino de assembleia.',
    bounds: { minX: -8, maxX: 8, minZ: 0, maxZ: 28 },
    color: '#3b82f6',
  },
  {
    id: 'altar',
    name: 'Altar-Mor',
    description: 'O santuário sagrado ao norte em cruz latina, iluminado pelo grande vitral de rosas e o cálice de ouro.',
    bounds: { minX: -8, maxX: 8, minZ: 28, maxZ: 50 },
    color: '#eab308',
  },
  {
    id: 'sacristia',
    name: 'Sacristia',
    description: 'Ala leste da cruz onde se guardam as vestes sacerdotais, relíquias antigas e os segredos do abade.',
    bounds: { minX: -28, maxX: -8, minZ: 14, maxZ: 28 },
    color: '#a855f7',
  },
  {
    id: 'torre',
    name: 'Torre dos Sinos',
    description: 'Ala oeste que se ergue até o campanário onde ficam os pesados sinos de bronze e os pêndulos de corda.',
    bounds: { minX: 8, maxX: 28, minZ: 14, maxZ: 28 },
    color: '#06b6d4',
  },
  {
    id: 'calabouco',
    name: 'Calabouço & Criptas',
    description: 'Cripta subterrânea úmida com celas de ferro, tochas frias, sarcófagos e escoamento antigo de água.',
    bounds: { minX: -32, maxX: -10, minZ: -12, maxZ: 8 },
    color: '#64748b',
  },
  {
    id: 'cemiterio',
    name: 'Cemitério Ancestral',
    description: 'Campos de lápides quebradas, névoa espessa, árvores retorcidas e mausoléus antigos sob o luar.',
    bounds: { minX: -36, maxX: -10, minZ: -38, maxZ: -14 },
    color: '#10b981',
  },
  {
    id: 'jardim',
    name: 'Jardim do Claustro',
    description: 'Pátio aberto com roseiras murchas, espinheiros espessos, arcos de pedra e a fonte sagrada.',
    bounds: { minX: 10, maxX: 36, minZ: -38, maxZ: 8 },
    color: '#84cc16',
  },
  {
    id: 'atrio',
    name: 'Átrio do Portal',
    description: 'Pátio pavimentado na entrada monumental da catedral que conecta a igreja ao cemitério e ao claustro.',
    bounds: { minX: -10, maxX: 10, minZ: -24, maxZ: 0 },
    color: '#f97316',
  },
];

/**
 * 20 Unique Tasks distributed across all rooms
 */
export const ALL_TASKS: Omit<TaskDefinition, 'id' | 'completed'>[] = [
  // 1-3: NAVE CENTRAL
  {
    type: 'acender_velas',
    title: 'Acender Velas do Candelabro',
    roomId: 'nave',
    roomName: 'Nave Central',
    difficulty: 'facil',
    duration: 'curta',
    position: [-3, 0.5, 8],
  },
  {
    type: 'limpar_bancos',
    title: 'Limpar Bancos dos Fiéis',
    roomId: 'nave',
    roomName: 'Nave Central',
    difficulty: 'facil',
    duration: 'curta',
    position: [4, 0.5, 16],
  },
  {
    type: 'recolher_hostias',
    title: 'Recolher Hóstias Consagradas',
    roomId: 'nave',
    roomName: 'Nave Central',
    difficulty: 'media',
    duration: 'media',
    position: [0, 0.5, 22],
  },

  // 4-6: ALTAR-MOR
  {
    type: 'polir_calice',
    title: 'Polir o Cálice Dourado',
    roomId: 'altar',
    roomName: 'Altar-Mor',
    difficulty: 'media',
    duration: 'media',
    position: [0, 0.8, 44],
  },
  {
    type: 'organizar_missal',
    title: 'Reorganizar o Missal Sagrado',
    roomId: 'altar',
    roomName: 'Altar-Mor',
    difficulty: 'media',
    duration: 'media',
    position: [-4, 0.5, 36],
  },
  {
    type: 'consertar_vitral',
    title: 'Consertar Vitral Quebrado',
    roomId: 'altar',
    roomName: 'Altar-Mor',
    difficulty: 'dificil',
    duration: 'longa',
    position: [4, 0.5, 42],
  },

  // 7-9: SACRISTIA
  {
    type: 'decifrar_relicario',
    title: 'Decifrar Relicário Sagrado',
    roomId: 'sacristia',
    roomName: 'Sacristia',
    difficulty: 'media',
    duration: 'media',
    position: [-22, 0.5, 22],
  },
  {
    type: 'reabastecer_oleo',
    title: 'Reabastecer Óleo Sagrado',
    roomId: 'sacristia',
    roomName: 'Sacristia',
    difficulty: 'facil',
    duration: 'curta',
    position: [-16, 0.5, 18],
  },
  {
    type: 'dobrar_tunicas',
    title: 'Dobrar Túnicas Cerimoniais',
    roomId: 'sacristia',
    roomName: 'Sacristia',
    difficulty: 'facil',
    duration: 'curta',
    position: [-20, 0.5, 26],
  },

  // 10-12: TORRE DOS SINOS
  {
    type: 'ajustar_sinos',
    title: 'Sintonizar os Sinos da Torre',
    roomId: 'torre',
    roomName: 'Torre dos Sinos',
    difficulty: 'dificil',
    duration: 'longa',
    position: [20, 0.5, 20],
  },
  {
    type: 'engrenagens_relogio',
    title: 'Ajustar Engrenagens do Relógio',
    roomId: 'torre',
    roomName: 'Torre dos Sinos',
    difficulty: 'media',
    duration: 'media',
    position: [24, 0.5, 24],
  },
  {
    type: 'desamarrar_corda',
    title: 'Desamarrar Corda Presa',
    roomId: 'torre',
    roomName: 'Torre dos Sinos',
    difficulty: 'facil',
    duration: 'curta',
    position: [14, 0.5, 18],
  },

  // 13-15: CALABOUÇO & CRIPTAS
  {
    type: 'drenar_cripta',
    title: 'Drenar Infiltração da Cripta',
    roomId: 'calabouco',
    roomName: 'Calabouço & Criptas',
    difficulty: 'media',
    duration: 'media',
    position: [-24, 0.3, -4],
  },
  {
    type: 'reacender_tochas',
    title: 'Reacender Tochas das Catacumbas',
    roomId: 'calabouco',
    roomName: 'Calabouço & Criptas',
    difficulty: 'facil',
    duration: 'curta',
    position: [-16, 0.5, 2],
  },
  {
    type: 'encontrar_chave',
    title: 'Identificar Chave do Calabouço',
    roomId: 'calabouco',
    roomName: 'Calabouço & Criptas',
    difficulty: 'media',
    duration: 'media',
    position: [-28, 0.5, 4],
  },

  // 16-17: CEMITÉRIO ANCESTRAL
  {
    type: 'restaurar_lapide',
    title: 'Restaurar Lápide Quebrada',
    roomId: 'cemiterio',
    roomName: 'Cemitério Ancestral',
    difficulty: 'media',
    duration: 'media',
    position: [-26, 0.3, -28],
  },
  {
    type: 'queimar_raizes',
    title: 'Queimar Raízes Amaldiçoadas',
    roomId: 'cemiterio',
    roomName: 'Cemitério Ancestral',
    difficulty: 'facil',
    duration: 'curta',
    position: [-16, 0.3, -22],
  },

  // 18-20: JARDIM DO CLAUSTRO
  {
    type: 'podar_espinheiros',
    title: 'Podar Espinheiros da Fonte',
    roomId: 'jardim',
    roomName: 'Jardim do Claustro',
    difficulty: 'media',
    duration: 'media',
    position: [24, 0.3, -16],
  },
  {
    type: 'plantar_sementes',
    title: 'Plantar Sementes de Mirra',
    roomId: 'jardim',
    roomName: 'Jardim do Claustro',
    difficulty: 'facil',
    duration: 'curta',
    position: [18, 0.3, -26],
  },
  {
    type: 'purificar_estatua',
    title: 'Purificar a Estátua do Arcanjo',
    roomId: 'jardim',
    roomName: 'Jardim do Claustro',
    difficulty: 'media',
    duration: 'media',
    position: [28, 0.5, -6],
  },

  // 21-25: 5 QUEBRA-CABEÇAS DE RELÍQUIAS SAGRADAS (PODERES DIVINOS PARA OS MONGES)
  {
    type: 'relic_agua_benta',
    title: 'Fonte Batismal: Consagrar Água Benta',
    roomId: 'jardim',
    roomName: 'Jardim do Claustro',
    difficulty: 'media',
    duration: 'media',
    position: [20, 0.5, 2],
    isSacredRelicPuzzle: true,
    sacredPowerReward: 'agua_benta',
  },
  {
    type: 'relic_lascas_cruz',
    title: 'Relicário: Montar as Lascas da Cruz de Jesus',
    roomId: 'sacristia',
    roomName: 'Sacristia',
    difficulty: 'dificil',
    duration: 'longa',
    position: [-14, 0.5, 24],
    isSacredRelicPuzzle: true,
    sacredPowerReward: 'lascas_da_cruz',
  },
  {
    type: 'relic_livro_exorcismo',
    title: 'Atril Sagrado: Decifrar Livro do Exorcismo',
    roomId: 'altar',
    roomName: 'Altar-Mor',
    difficulty: 'media',
    duration: 'media',
    position: [-6, 0.8, 42],
    isSacredRelicPuzzle: true,
    sacredPowerReward: 'livro_exorcismo',
  },
  {
    type: 'relic_cruz_sagrada',
    title: 'Forja dos Mártires: Abençoar a Cruz de Prata',
    roomId: 'calabouco',
    roomName: 'Calabouço & Criptas',
    difficulty: 'media',
    duration: 'media',
    position: [-22, 0.3, 5],
    isSacredRelicPuzzle: true,
    sacredPowerReward: 'cruz_sagrada',
  },
  {
    type: 'relic_santo_graal',
    title: 'Tabernáculo Dourado: Despertar o Santo Graal',
    roomId: 'altar',
    roomName: 'Altar-Mor',
    difficulty: 'dificil',
    duration: 'longa',
    position: [0, 0.8, 47],
    isSacredRelicPuzzle: true,
    sacredPowerReward: 'santo_graal',
  },
];

export const SACRED_POWERS_METADATA = {
  agua_benta: {
    name: 'Água Benta Consagrada',
    description: 'Arremesse a água benta para atordoar a Freira Maligna por 5s ou quebrar imediatamente o ritual de suspensão de um irmão!',
    cooldown: 35,
  },
  lascas_da_cruz: {
    name: 'Lascas da Cruz de Jesus',
    description: 'Proteção divina passiva: se a Freira tentar golpear você, a cruz repele o golpe mortal e a cega!',
    cooldown: 45,
  },
  livro_exorcismo: {
    name: 'Livro do Ritual de Exorcismo',
    description: 'Entoa salmos sagrados em latim, expondo a verdadeira face das trevas da Freira e de seu servo por 15 segundos!',
    cooldown: 40,
  },
  cruz_sagrada: {
    name: 'Cruz Sagrada de Prata',
    description: 'Ergue a cruz sagrada: nenhum monge pode ser assassinado ou suspenso dentro de um raio de 8 metros por 10 segundos!',
    cooldown: 30,
  },
  santo_graal: {
    name: 'Santo Graal com Sangue de Cristo',
    description: 'Relíquia milagrosa suprema! Purifica instantaneamente qualquer sabotagem ativa ou ressuscita o último monge caído!',
    cooldown: 60,
  },
};

/**
 * 6 Unique Sabotages for the Evil Nun & Assistant
 */
export const SABOTAGES: SabotageDefinition[] = [
  {
    type: 'blackout',
    name: 'Blecaute de Trevas',
    description: 'Apaga todas as tochas e vitrais da abadia. O campo de visão dos monges cai drasticamente até alguém religar as tochas no Calabouço.',
    cooldown: 35,
    duration: 30,
  },
  {
    type: 'curse_bells',
    name: 'Sino da Maldição (Crítica)',
    description: 'Dispara um sino tenebroso com contagem regressiva de 35 segundos. Os monges devem correr à Torre dos Sinos para interromper, ou perdem o jogo!',
    cooldown: 50,
    duration: 35,
    isCritical: true,
  },
  {
    type: 'lockdown',
    name: 'Trancar Portas',
    description: 'Fecha as grades de ferro da Sacristia e do Calabouço por 14 segundos, isolando vítimas indefesas.',
    cooldown: 25,
    duration: 14,
  },
  {
    type: 'sound_illusions',
    name: 'Sussurros & Passos Ilusórios',
    description: 'Propaga passos falsos, risadas sombrias e sussurros pela abadia para desorientar e dispersar o grupo.',
    cooldown: 20,
    duration: 12,
  },
  {
    type: 'curse_station',
    name: 'Amaldiçoar Estações',
    description: 'Profana as tarefas sagradas do Altar ou Cemitério por 20 segundos, impedindo qualquer monge de operá-las.',
    cooldown: 28,
    duration: 20,
  },
  {
    type: 'plant_trap',
    name: 'Armadilha de Pavor',
    description: 'Coloca um selo sombrio invisível no chão. Qualquer monge que pisar fica paralisado de horror por 4 segundos.',
    cooldown: 30,
    duration: 60,
  },
];

/**
 * Secret Vent Passageways for Impostors
 */
export const VENT_LOCATIONS: VentLocation[] = [
  {
    id: 'vent_calabouco',
    name: 'Grade do Calabouço',
    roomId: 'calabouco',
    position: [-26, 0.1, 0],
  },
  {
    id: 'vent_sacristia',
    name: 'Alçapão da Sacristia',
    roomId: 'sacristia',
    position: [-24, 0.1, 16],
  },
  {
    id: 'vent_cemiterio',
    name: 'Cripta Aberta do Cemitério',
    roomId: 'cemiterio',
    position: [-22, 0.1, -30],
  },
  {
    id: 'vent_jardim',
    name: 'Poço Seco do Jardim',
    roomId: 'jardim',
    position: [26, 0.1, -12],
  },
];

/**
 * Monastic Player Robe Colors (Portuguese monastic themes)
 */
export const MONK_COLORS = [
  { color: '#854d0e', name: 'Beneditino (Marrom)' },
  { color: '#1e293b', name: 'Dominicano (Preto)' },
  { color: '#f1f5f9', name: 'Cisterciense (Branco)' },
  { color: '#b91c1c', name: 'Cardeal (Carmesim)' },
  { color: '#15803d', name: 'Ermitão (Verde)' },
  { color: '#7e22ce', name: 'Bispo (Púrpura)' },
  { color: '#475569', name: 'Franciscano (Cinza)' },
  { color: '#d97706', name: 'Abade (Âmbar)' },
  { color: '#0284c7', name: 'Devoto (Azul)' },
  { color: '#e11d48', name: 'Noviço (Rubro)' },
];

export const BOT_NAMES = [
  'Irmão Tomás',
  'Irmão Bento',
  'Irmão Francis',
  'Irmão Inácio',
  'Irmão Gabriel',
  'Irmão Lucas',
  'Irmão Paulo',
  'Irmão Barnabé',
  'Irmão Mateus',
];

export const BOT_ALIBIS = [
  'Eu estava limpando os bancos na Nave Central.',
  'Estava no Altar acendendo as velas sagradas!',
  'Fui até a Sacristia organizar as túnicas sacerdotais.',
  'Estava tentando desembaraçar a corda dos sinos na Torre.',
  'Eu estava no Jardim podando os espinhos da fonte.',
  'Acabei de vir do Cemitério restaurando uma lápide antiga.',
  'Estava descendo para o Calabouço para drenar a água.',
  'Passei pelo Átrio e vi o sino de emergência intocado.',
];

export const BOT_ACCUSATIONS = [
  'Eu vi {suspect} andando muito quieto perto do local!',
  'Tenho quase certeza que {suspect} não estava fazendo nenhuma tarefa.',
  '{suspect} correu em direção à passagem secreta quando me aproximei!',
  'Não confio no silêncio de {suspect}.',
  'Eu vi {suspect} saindo do {room} logo antes do alarme soar!',
  'Vamos pular o voto ou votar no {suspect}?',
];
