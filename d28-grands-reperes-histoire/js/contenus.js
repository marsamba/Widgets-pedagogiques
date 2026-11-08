'use strict';

const SECTIONS = [
  ['frise', 'La frise historique', 'Place les images sur la frise des six périodes.', 'Découvrir'],
  ['romains', 'Les chiffres romains', 'Décode les nombres et retrouve le siècle d’une date.', 'Comprendre'],
  ['reperes', 'Personnages et événements', 'Explore les repères à l’intérieur de chaque période.', 'Explorer'],
  ['activites', 'Les activités interactives', 'Associe des portraits, des descriptions, des événements et des dates.', 'S’entraîner'],
  ['quiz', 'Le quiz de révision', 'Vérifie ce que tu sais avec 10 questions.', 'Se préparer']
];

const PERIODES = [
  ['Préhistoire', 'Jusqu’à l’invention de l’écriture, vers 3 500 av. J.-C.', 'menthe'],
  ['Antiquité', 'De l’invention de l’écriture à 476', 'jaune'],
  ['Moyen Âge', 'De 476 à 1492', 'peche'],
  ['Temps modernes', 'De 1492 à 1789', 'rose'],
  ['Révolution et XIXᵉ siècle', 'De 1789 à 1914', 'violet'],
  ['Période contemporaine', 'De 1914 à aujourd’hui', 'bleu']
];

const REPERES = {
  tautavel: {p:0, nom:'L’Homme de Tautavel', date:'Il y a environ 500 000 ans', evenement:'Un humain préhistorique', portrait:'homme_tautavel', photo:'tautavel_crane', description:'Les restes de cet humain préhistorique ont été retrouvés dans une grotte des Pyrénées-Orientales.', indice:'Des ossements humains très anciens ont été découverts dans une grotte des Pyrénées-Orientales.'},
  vercingetorix: {p:1, nom:'Vercingétorix', date:'52 av. J.-C.', evenement:'Bataille d’Alésia', portrait:'vercingetorix', photo:'alesia', description:'Ce chef gaulois affronte l’armée romaine de Jules César. Il est vaincu à Alésia.', indice:'Ce chef gaulois affronte Jules César et perd la bataille d’Alésia.'},
  clovis: {p:2, nom:'Clovis', date:'Vers 496', evenement:'Baptême de Clovis', portrait:'clovis', photo:'clovisbapteme', description:'Ce roi des Francs devient chrétien. La date de 496 est le repère retenu dans la fiche.', indice:'Ce roi des Francs devient chrétien. Son baptême est situé vers 496 dans la leçon.'},
  charlemagne: {p:2, nom:'Charlemagne', date:'800', evenement:'Sacre de Charlemagne', portrait:'charlemagne', photo:'charlemagne_sacre', description:'Ce roi des Francs gouverne un vaste territoire. Il est couronné empereur en 800.', indice:'Ce roi des Francs gouverne un vaste territoire et devient empereur en 800.'},
  louis: {p:3, nom:'Louis XIV', date:'XVIIᵉ siècle', evenement:'Château de Versailles', portrait:'louis_xiv', photo:'versailles', description:'Le Roi-Soleil fait agrandir le château de Versailles et y installe sa cour.', indice:'Surnommé le Roi-Soleil, ce roi fait agrandir le château de Versailles.'},
  napoleon: {p:4, nom:'Napoléon Iᵉʳ', date:'1804', evenement:'Sacre de Napoléon', portrait:'napoleon', photo:'napoleon_sacre', description:'Couronné empereur en 1804, il mène de nombreuses batailles. Il est vaincu à Waterloo en 1815.', indice:'Couronné empereur en 1804, il est vaincu à Waterloo en 1815.'},
  gaulle: {p:5, nom:'Charles de Gaulle', date:'1939–1945', evenement:'Seconde Guerre mondiale', portrait:'de_gaulle', description:'Pendant la Seconde Guerre mondiale, il appelle à poursuivre le combat et dirige la France libre. La guerre se termine en 1945.', indice:'Pendant la Seconde Guerre mondiale, ce général dirige la France libre. Il devient ensuite président de la République.'},
  colomb: {p:3, nom:'Christophe Colomb', date:'1492', evenement:'Arrivée de Christophe Colomb en Amérique', portrait:'colomb', photo:'amerique', description:'Le navigateur traverse l’océan Atlantique et arrive dans les Caraïbes. La fiche appelle cet événement « Découverte de l’Amérique ». C’est une date charnière de la frise.'}
};

const FICHE = ['napoleon','charlemagne','vercingetorix','louis','gaulle','clovis','tautavel'];
const EVAL = ['tautavel','colomb','napoleon','gaulle','vercingetorix','charlemagne','clovis'];
const DATES_EVAL = {tautavel:'Il y a environ 500 000 ans', colomb:'1492', napoleon:'1804', gaulle:'1945', vercingetorix:'52 av. J.-C.', charlemagne:'800', clovis:'496'};

const QUIZ = [
  ['Combien d’années dure un siècle ?', ['10 ans', '100 ans', '1 000 ans'], 1, 'Un siècle dure 100 ans.'],
  ['Combien d’années dure un millénaire ?', ['1 000 ans', '10 000 ans', '100 ans'], 0, 'Un millénaire dure 1 000 ans, soit 10 siècles.'],
  ['Comment écrit-on 21 en chiffres romains ?', ['XIX', 'XX', 'XXI'], 2, 'XXI = 10 + 10 + 1.'],
  ['À quel siècle appartient l’année 1789 ?', ['XVIIᵉ siècle', 'XVIIIᵉ siècle', 'XIXᵉ siècle'], 1, 'Le XVIIIᵉ siècle va de 1701 à 1800.'],
  ['Dans quel sens lit-on une frise chronologique ?', ['De gauche à droite', 'De droite à gauche', 'De haut en bas'], 0, 'On part du passé, à gauche, et on avance vers les dates plus récentes, à droite.'],
  ['Quelle période vient juste après l’Antiquité ?', ['Les Temps modernes', 'La Préhistoire', 'Le Moyen Âge'], 2, 'Dans la frise du dossier, le Moyen Âge commence en 476, après l’Antiquité.'],
  ['Qui affronte Jules César à Alésia ?', ['Clovis', 'Vercingétorix', 'Charlemagne'], 1, 'Vercingétorix est vaincu à Alésia en 52 av. J.-C.', 'alesia'],
  ['Quel personnage est sacré empereur en 800 ?', ['Charlemagne', 'Napoléon Iᵉʳ', 'Louis XIV'], 0, 'Charlemagne est couronné empereur en 800, au Moyen Âge.', 'charlemagne_sacre'],
  ['À quelle période associe-t-on Louis XIV et Versailles ?', ['L’Antiquité', 'La période contemporaine', 'Les Temps modernes'], 2, 'Louis XIV règne pendant les Temps modernes.', 'versailles'],
  ['Quand se termine la Seconde Guerre mondiale, à laquelle est associé Charles de Gaulle ?', ['1914', '1945', '1804'], 1, 'La Seconde Guerre mondiale se termine en 1945.', 'de_gaulle']
];
