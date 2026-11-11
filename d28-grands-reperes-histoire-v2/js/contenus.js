'use strict';
/* =====================================================================
   CONTENU DE LA SÉANCE — c'est le seul fichier à réécrire pour une
   nouvelle séance. Le moteur (app.js, activites.js, scores.js, elea.js)
   et la charte (css/style.css) restent identiques.
   ===================================================================== */

const SEANCE = {
  id: 'd28-v2',                       // identifiant unique (sauvegarde locale)
  numero: '28',
  matiere: 'Histoire',
  niveau: 'CE2 · Cycle 2',
  theme: 'Se situer dans le temps',
  titre: 'Quels sont les grands repères de l’histoire ?'
};

/* Types de ressources → bouton MDI (assets/icones/). Remplacer une image
   garde le même nom de fichier. */
const TYPES = {
  video:     {icone: 'videos.png',              label: 'Vidéo'},
  videoInt:  {icone: 'videos-interactives.png', label: 'Vidéo interactive'},
  exo:       {icone: 'exos-interactifs.png',    label: 'Exercice interactif'},
  pdf:       {icone: 'docs-a-imprimer.png',     label: 'Document à imprimer'},
  carrousel: {icone: 'ensemble-de-docs.png',    label: 'Ensemble de documents'},
  image:     {icone: 'image.png',               label: 'Image'},
  schema:    {icone: 'schemas.png',             label: 'Schéma'},
  carte:     {icone: 'cartes.png',              label: 'Carte'},
  lien:      {icone: 'liens-url.png',           label: 'Lien Web'}
};

/* Documents (PDF + aperçus WebP générés dans assets/apercus/<cle>-<n>.webp) */
const DOCUMENTS = {
  'fiche-enseignant':  {titre: 'Fiche enseignant', pages: 2},
  'corriges':          {titre: 'Corrigés', pages: 6},
  'fiche-eleve':       {titre: 'Fiches élève', pages: 4},
  'fiche-a-decouper':  {titre: 'Fiche à découper', pages: 1},
  'je-retiens':        {titre: 'Je retiens', pages: 2, word: 'je-retiens.docx'},
  'evaluation':        {titre: 'Évaluation', pages: 2, word: 'evaluation.docx'},
  'chiffres-romains':  {titre: 'Mémo des chiffres romains', pages: 1},
  'lieux-histoire':    {titre: 'Des lieux qui ont marqué l’histoire', pages: 1},
  'grandes-dates':     {titre: 'Les grandes dates', pages: 1},
  'schema-recapitulatif': {titre: 'Schéma récapitulatif', pages: 1},
  'bio-vercingetorix': {titre: 'Vercingétorix', pages: 1},
  'bio-clovis':        {titre: 'Clovis', pages: 1},
  'bio-charlemagne':   {titre: 'Charlemagne', pages: 1},
  'bio-jeanne-d-arc':  {titre: 'Jeanne d’Arc', pages: 1},
  'bio-francois-1er':  {titre: 'François Iᵉʳ', pages: 1},
  'bio-louis-xiv':     {titre: 'Louis XIV', pages: 1},
  'bio-louis-xvi':     {titre: 'Louis XVI', pages: 1},
  'bio-napoleon':      {titre: 'Napoléon Iᵉʳ', pages: 1},
  'bio-de-gaulle':     {titre: 'Charles de Gaulle', pages: 1}
};

const VIDEOS = {
  'frise':    {titre: 'Qu’est-ce qu’une frise historique ?', src: 'assets/videos/frise-historique.mp4', poster: 'assets/videos/frise-historique.jpg'},
  'romains':  {titre: 'Les chiffres romains', src: 'assets/videos/chiffres-romains.mp4', poster: 'assets/videos/chiffres-romains.jpg'}
};

/* Bandeau inférieur du sommaire : groupes de fichiers */
const FICHIERS = [
  {groupe: 'Enseignant', items: [['doc','fiche-enseignant'], ['doc','corriges']]},
  {groupe: 'Élève',      items: [['doc','fiche-eleve'], ['doc','fiche-a-decouper']]},
  {groupe: 'Je retiens', items: [['doc','je-retiens'], ['word','je-retiens']]},
  {groupe: 'Évaluation', items: [['doc','evaluation'], ['word','evaluation']]},
  {groupe: 'Vidéos',     items: [['video','frise'], ['video','romains']]},
  {groupe: 'Documents',  items: [['doc','chiffres-romains'], ['doc','lieux-histoire'], ['doc','grandes-dates'], ['doc','schema-recapitulatif']]}
];

/* Galerie d'images de la page Ressources */
const GALERIE = [
  ['ecriture','Invention de l’écriture'], ['homme-tautavel','L’Homme de Tautavel'], ['tautavel-crane','Crâne de Tautavel'],
  ['vercingetorix','Vercingétorix'], ['alesia','Bataille d’Alésia'], ['chute-empire-romain','Chute de l’Empire romain'],
  ['clovis','Clovis'], ['clovisbapteme','Baptême de Clovis'], ['charlemagne','Charlemagne'], ['charlemagne-sacre','Sacre de Charlemagne'],
  ['saint-louis','Saint Louis'], ['croisades','Les croisades'], ['jeanne','Jeanne d’Arc'], ['siege-orleans','Siège d’Orléans'],
  ['colomb','Christophe Colomb'], ['amerique','Arrivée en Amérique'], ['francois','François Iᵉʳ'], ['chambord','Château de Chambord'],
  ['henri-iv','Henri IV'], ['st-barthelemy','La Saint-Barthélemy'], ['louis-xiv','Louis XIV'], ['versailles','Château de Versailles'],
  ['louis-xvi','Louis XVI'], ['bastille','Prise de la Bastille'], ['bastille2','La Bastille'], ['napoleon','Napoléon Iᵉʳ'],
  ['napoleon-sacre','Sacre de Napoléon'], ['poilus','Les poilus (1914-1918)'], ['de-gaulle','Charles de Gaulle'], ['liberation','La Libération']
];

/* Les six périodes (couleurs de la frise de la classe) */
const PERIODES = [
  {nom: 'Préhistoire',               debut: '− 3 000 000', couleur: '#5fb267'},
  {nom: 'Antiquité',                 debut: '− 3 500',     couleur: '#f2b318'},
  {nom: 'Moyen Âge',                 debut: '476',         couleur: '#ee8044'},
  {nom: 'Temps modernes',            debut: '1492',        couleur: '#e33a5d'},
  {nom: 'Révolution et XIXᵉ siècle', debut: '1789',        couleur: '#7b6bb5'},
  {nom: 'Période contemporaine',     debut: '1914',        couleur: '#26aecd'}
];

/* Repères : personnage, image, événement, date */
const REPERES = {
  tautavel:      {nom: 'L’Homme de Tautavel', img: 'homme-tautavel', periode: 0, evenement: 'Premier Européen connu', date: '− 500 000 ans', photo: 'tautavel-crane',
                  texte: 'Ses restes ont été découverts dans une grotte des Pyrénées-Orientales.'},
  vercingetorix: {nom: 'Vercingétorix', img: 'vercingetorix', periode: 1, evenement: 'Bataille d’Alésia', date: '− 52', photo: 'alesia',
                  texte: 'Ce chef gaulois affronte Jules César. Il est vaincu à Alésia.'},
  clovis:        {nom: 'Clovis', img: 'clovis', periode: 2, evenement: 'Baptême de Clovis', date: '496', photo: 'clovisbapteme',
                  texte: 'Premier roi chrétien de notre territoire, il fait partie des Francs.'},
  charlemagne:   {nom: 'Charlemagne', img: 'charlemagne', periode: 2, evenement: 'Sacre de Charlemagne', date: '800', photo: 'charlemagne-sacre',
                  texte: 'Couronné empereur en l’an 800, il a conquis un immense empire.'},
  colomb:        {nom: 'Christophe Colomb', img: 'colomb', periode: 3, evenement: 'Découverte de l’Amérique', date: '1492', photo: 'amerique',
                  texte: 'Il traverse l’océan Atlantique et arrive en Amérique.'},
  louis:         {nom: 'Louis XIV', img: 'louis-xiv', periode: 3, evenement: 'Château de Versailles', date: 'XVIIᵉ siècle', photo: 'versailles',
                  texte: 'Le Roi-Soleil a régné 72 ans et a vécu au château de Versailles.'},
  napoleon:      {nom: 'Napoléon Iᵉʳ', img: 'napoleon', periode: 4, evenement: 'Sacre de Napoléon', date: '1804', photo: 'napoleon-sacre',
                  texte: 'Sacré empereur en 1804, il mène de nombreuses batailles en Europe.'},
  gaulle:        {nom: 'Charles de Gaulle', img: 'de-gaulle', periode: 5, evenement: 'Seconde Guerre mondiale', date: '1945', photo: 'liberation',
                  texte: 'Ce général conduit la Résistance pendant la Seconde Guerre mondiale.'}
};

/* ---------------------------------------------------------------------
   VIGNETTES DU SOMMAIRE
   Chaque vignette contient 1 à 4 pages. Chaque page a un type (bouton MDI)
   et s'ouvre seule, en plein écran, sans défilement.
   Types de page : video · image · document · carrousel · activite · bilan
   --------------------------------------------------------------------- */
const VIGNETTES = [
  {
    id: 'periodes', titre: 'Les grandes périodes historiques', categorie: 'Découvrir',
    art: {img: 'assets/images/frise-periodes.webp'},
    pages: [
      {id: 'video-frise', type: 'video', bouton: 'video', titre: 'Qu’est-ce qu’une frise ?', video: 'frise'},
      {id: 'frise-classe', type: 'image', bouton: 'schema', titre: 'La frise de la classe', img: 'assets/images/frise-perso.webp'},
      {id: 'ordre-periodes', type: 'activite', bouton: 'exo', titre: 'Remets les périodes dans l’ordre',
       consigne: 'Glisse chaque période à sa place sur la frise, de la plus ancienne à la plus récente.',
       activite: {moteur: 'placer', disposition: 'frise',
         zones: PERIODES.map((p, i) => ({id: 'z' + i, label: p.debut, couleur: p.couleur, attend: ['p' + i]})),
         items: PERIODES.map((p, i) => ({id: 'p' + i, texte: p.nom})),
         correction: id => PERIODES[+id.slice(1)].nom}},
      {id: 'dates-charnieres', type: 'activite', bouton: 'exo', titre: 'Les dates charnières',
       consigne: 'Chaque date marque un grand événement. Glisse chaque image sur la bonne date.',
       activite: {moteur: 'placer', disposition: 'frise',
         zones: [['− 3 500','ecriture'],['476','chute'],['1492','amerique'],['1789','revolution'],['1914','guerre']]
           .map(([d, id], i) => ({id: 'd' + i, label: d, couleur: PERIODES[i + 1].couleur, attend: [id]})),
         items: [
           {id: 'ecriture', img: 'ecriture', texte: 'Invention de l’écriture'},
           {id: 'chute', img: 'chute-empire-romain', texte: 'Chute de l’Empire romain'},
           {id: 'amerique', img: 'amerique', texte: 'Découverte de l’Amérique'},
           {id: 'revolution', img: 'bastille', texte: 'Révolution française'},
           {id: 'guerre', img: 'poilus', texte: 'Première Guerre mondiale'}]}}
    ]
  },
  {
    id: 'romains', titre: 'Lire les chiffres romains', categorie: 'Comprendre',
    art: {html: '<div class="roman-art"><span>I</span><span>V</span><span>X</span></div>'},
    pages: [
      {id: 'video-romains', type: 'video', bouton: 'video', titre: 'Les chiffres romains en vidéo', video: 'romains'},
      {id: 'memo-romains', type: 'document', bouton: 'pdf', titre: 'Le mémo des chiffres romains', doc: 'chiffres-romains'},
      {id: 'ecrire-romains', type: 'activite', bouton: 'exo', titre: 'Écris en chiffres romains',
       consigne: 'Touche une carte, puis compose le nombre avec les lettres I, V et X.',
       activite: {moteur: 'romains', nombres: [2, 3, 6, 11, 13, 15, 19, 20], lettres: ['I', 'V', 'X']}},
      {id: 'siecles', type: 'activite', bouton: 'exo', titre: 'Siècles et millénaires',
       consigne: 'Pour chaque ligne, touche la bonne réponse.',
       activite: {moteur: 'choix', lignes: [
         ['Un siècle dure…', ['10 ans', '100 ans', '1 000 ans'], 1],
         ['Un millénaire dure…', ['100 ans', '1 000 ans', '10 000 ans'], 1],
         ['L’an 496 appartient au…', ['IVᵉ siècle', 'Vᵉ siècle', 'VIᵉ siècle'], 1],
         ['L’an 800 appartient au…', ['VIIIᵉ siècle', 'IXᵉ siècle', 'VIIᵉ siècle'], 0],
         ['L’an 1492 appartient au…', ['XIVᵉ siècle', 'XVIᵉ siècle', 'XVᵉ siècle'], 2],
         ['L’an 1789 appartient au…', ['XVIIᵉ siècle', 'XVIIIᵉ siècle', 'XIXᵉ siècle'], 1],
         ['L’an 2000 appartient au…', ['XXᵉ siècle', 'XXIᵉ siècle', 'XIXᵉ siècle'], 0],
         ['L’an 2017 appartient au…', ['XXᵉ siècle', 'XXIIᵉ siècle', 'XXIᵉ siècle'], 2]]}}
    ]
  },
  {
    id: 'personnages', titre: 'Personnages et événements', categorie: 'Explorer',
    art: {portraits: ['vercingetorix', 'charlemagne', 'louis-xiv']},
    pages: [
      {id: 'reperes', type: 'carrousel', bouton: 'image', titre: 'Un personnage, un événement',
       diapos: Object.values(REPERES).map(r => ({imgs: [r.img, r.photo], titre: r.nom, sous: r.date + ' · ' + r.evenement, texte: r.texte, couleur: PERIODES[r.periode].couleur, periode: PERIODES[r.periode].nom}))},
      {id: 'qui-est-ce', type: 'activite', bouton: 'exo', titre: 'Qui est-ce ?',
       consigne: 'Glisse chaque portrait à côté de la description qui lui correspond.',
       activite: {moteur: 'placer', disposition: 'lignes',
         zones: ['napoleon', 'charlemagne', 'vercingetorix', 'louis', 'gaulle', 'clovis', 'tautavel'].map(id => ({id: 'q' + id, label: REPERES[id].texte, attend: [id]})),
         items: ['tautavel', 'vercingetorix', 'clovis', 'charlemagne', 'louis', 'napoleon', 'gaulle'].map(id => ({id, img: REPERES[id].img, texte: REPERES[id].nom}))}},
      {id: 'qui-quoi-quand', type: 'activite', bouton: 'exo', titre: 'Qui, quoi, quand ?',
       consigne: 'Relie chaque personnage à son événement, puis l’événement à sa date.',
       activite: {moteur: 'relier', ids: ['tautavel', 'colomb', 'napoleon', 'gaulle', 'vercingetorix', 'charlemagne', 'clovis'],
         colonnes: [
           ['tautavel', 'colomb', 'napoleon', 'gaulle', 'vercingetorix', 'charlemagne', 'clovis'].map(id => ({id, texte: REPERES[id].nom, img: REPERES[id].img})),
           ['colomb', 'charlemagne', 'tautavel', 'napoleon', 'clovis', 'vercingetorix', 'gaulle'].map(id => ({id, texte: REPERES[id].evenement})),
           ['clovis', 'charlemagne', 'gaulle', 'vercingetorix', 'napoleon', 'tautavel', 'colomb'].map(id => ({id, texte: REPERES[id].date}))]}},
      {id: 'sur-la-frise', type: 'activite', bouton: 'exo', titre: 'Place-les sur la frise',
       consigne: 'Glisse chaque personnage dans la période où il a vécu.',
       activite: {moteur: 'placer', disposition: 'periodes',
         zones: PERIODES.map((p, i) => ({id: 'f' + i, label: p.nom, couleur: p.couleur, multiple: true,
           attend: Object.entries(REPERES).filter(([, r]) => r.periode === i).map(([id]) => id)})),
         items: ['napoleon', 'tautavel', 'louis', 'clovis', 'gaulle', 'vercingetorix', 'colomb', 'charlemagne'].map(id => ({id, img: REPERES[id].img, texte: REPERES[id].nom})),
         correction: id => PERIODES[REPERES[id].periode].nom}}
    ]
  },
  {
    id: 'en-savoir-plus', titre: 'Pour en savoir plus sur l’histoire de France', categorie: 'Approfondir',
    art: {img: 'assets/apercus/bio-charlemagne-1.webp'},
    pages: [
      {id: 'fiches-personnages', type: 'carrousel', bouton: 'carrousel', titre: 'Les fiches personnages',
       diapos: ['bio-vercingetorix', 'bio-clovis', 'bio-charlemagne', 'bio-jeanne-d-arc', 'bio-francois-1er', 'bio-louis-xiv', 'bio-louis-xvi', 'bio-napoleon', 'bio-de-gaulle']
         .map(k => ({doc: k, titre: DOCUMENTS[k].titre}))},
      {id: 'lieux', type: 'document', bouton: 'carte', titre: 'Des lieux qui ont marqué l’histoire', doc: 'lieux-histoire'},
      {id: 'dates', type: 'document', bouton: 'pdf', titre: 'Les grandes dates', doc: 'grandes-dates'}
    ]
  },
  {
    id: 'je-retiens', titre: 'Je retiens', categorie: 'Retenir',
    art: {img: 'assets/apercus/je-retiens-1.webp'},
    pages: [
      {id: 'lecon', type: 'document', bouton: 'pdf', titre: 'La leçon', doc: 'je-retiens'},
      {id: 'schema', type: 'image', bouton: 'schema', titre: 'Le schéma récapitulatif', img: 'assets/images/schema-recapitulatif.webp'},
      {id: 'texte-trous', type: 'activite', bouton: 'exo', titre: 'Complète la leçon',
       consigne: 'Glisse chaque mot dans le bon trou.',
       activite: {moteur: 'placer', disposition: 'texte',
         texte: 'Depuis l’apparition des premiers hommes, il s’est écoulé des dizaines de milliers d’années : on mesure le temps en [millenaire] (1 000 ans) ou en [siecle] (100 ans). La [frise] de l’histoire de France représente sur une ligne, de gauche à droite, l’histoire de notre pays. On y trouve les [six] grandes périodes : la Préhistoire, l’Antiquité, le [moyen], les Temps modernes, la Révolution et le XIXᵉ siècle, la Période contemporaine. Dans chaque période, on retrouve les [personnages] et les événements importants.',
         items: [['siecle', 'siècle'], ['personnages', 'personnages'], ['millenaire', 'millénaire'], ['six', '6'], ['frise', 'frise chronologique'], ['moyen', 'Moyen Âge']].map(([id, texte]) => ({id, texte}))}}
    ]
  },
  {
    id: 'quiz', titre: 'Le quiz final', categorie: 'Évaluer',
    art: {html: '<div class="quiz-art"><strong>10</strong><span>QUESTIONS</span></div>'},
    pages: [
      {id: 'quiz-final', type: 'activite', bouton: 'exo', titre: 'Le quiz : 10 questions',
       activite: {moteur: 'quiz', questions: [
         ['Combien d’années dure un siècle ?', ['10 ans', '100 ans', '1 000 ans'], 1, 'Un siècle dure 100 ans.'],
         ['Combien d’années dure un millénaire ?', ['1 000 ans', '10 000 ans', '100 ans'], 0, 'Un millénaire dure 1 000 ans, soit 10 siècles.'],
         ['Comment écrit-on 21 en chiffres romains ?', ['XIX', 'XX', 'XXI'], 2, 'XXI = 10 + 10 + 1.'],
         ['À quel siècle appartient l’année 1789 ?', ['XVIIᵉ siècle', 'XVIIIᵉ siècle', 'XIXᵉ siècle'], 1, 'Le XVIIIᵉ siècle va de 1701 à 1800.'],
         ['Dans quel sens lit-on une frise chronologique ?', ['De gauche à droite', 'De droite à gauche', 'De haut en bas'], 0, 'Le passé est à gauche, les dates récentes à droite.'],
         ['Quelle période vient juste après l’Antiquité ?', ['Les Temps modernes', 'La Préhistoire', 'Le Moyen Âge'], 2, 'Le Moyen Âge commence en 476, après l’Antiquité.'],
         ['Qui affronte Jules César à Alésia ?', ['Clovis', 'Vercingétorix', 'Charlemagne'], 1, 'Vercingétorix est vaincu à Alésia en 52 avant J.-C.', 'alesia'],
         ['Quel personnage est sacré empereur en 800 ?', ['Charlemagne', 'Napoléon Iᵉʳ', 'Louis XIV'], 0, 'Charlemagne est couronné empereur en 800.', 'charlemagne-sacre'],
         ['À quelle période associe-t-on Louis XIV et Versailles ?', ['L’Antiquité', 'La Période contemporaine', 'Les Temps modernes'], 2, 'Louis XIV règne pendant les Temps modernes.', 'versailles'],
         ['En quelle année se termine la Seconde Guerre mondiale ?', ['1914', '1945', '1804'], 1, 'La Seconde Guerre mondiale se termine en 1945.', 'de-gaulle']]}},
      {id: 'bilan', type: 'bilan', bouton: 'exo', titre: 'Mon bilan et ma note'}
    ]
  }
];
