"use strict";
const img = (name) => "assets/images/" + name;
const illustrations = [
  ["saut","Sauter","Un enfant saute, les bras écartés."],
  ["corde","Tirer à la corde","Trois enfants tirent une corde ensemble."],
  ["escalade","Grimper","Un enfant grimpe sur une paroi d’escalade."],
  ["basket","Jouer au basket","Deux enfants courent avec un ballon de basket."],
  ["football","Jouer au football","Deux enfants se disputent un ballon de football."],
  ["gymnastique","Faire de la gymnastique","Une gymnaste prend appui sur ses avant-bras."],
  ["squelette-face","Squelette vu de face","Squelette humain vu de face."],
  ["squelette-profil","Squelette vu de profil","Squelette humain vu de profil, en position de marche."],
  ["squelette-jambes","Les os des jambes","Vue du bassin, des genoux et des chevilles."],
  ["flexion-extension","Flexion et extension du bras","Le biceps se contracte lors de la flexion ; le triceps se contracte lors de l’extension."],
  ["articulations","Les principales articulations","Schéma d’un coureur : cou, épaule, coude, poignet, hanche, genou et cheville."],
  ["course","Courir","Document d’observation sur la course.","jpg"],
  ["pelleteuse","Le bras d’une pelleteuse","Image d’une pelleteuse pour comparer son bras au bras humain.","jpg"],
  ["radiographie","Radiographie","Document d’observation par radiographie.","jpg"],
  ["schema-recapitulatif","Schéma récapitulatif","Schéma sur le rôle des os, des muscles et des articulations.","jpg"]
].map(([id,title,desc,ext="webp"]) => ({id,title,desc,type:"image",files:[img(id+"."+ext)]}));
const documents = [
  ["planche-os","Les os du squelette","squelette",1],
  ["planche-muscles","Les muscles","muscles",1],
  ["planche-articulations","Les articulations","articulations",1],
  ["enseignant","Fiche enseignant","fiche_enseignant",2],
  ["corriges","Corrigés","corriges",8],
  ["eleve","Fiches élève","fiche_eleve",6],
  ["decouper","Fiche à découper","fiche_decoup",1],
  ["je-retiens","Je retiens","je_retiens",3,true],
  ["evaluation","Évaluations","evaluation",2,true]
].map(([id,title,stem,n,word]) => {
  const base="054964_d10_"+stem;
  return {id,title,type:"pdf",pdf:"assets/documents/"+base+".pdf",word:word?"assets/documents/"+base+"_word.docx":null,files:Array.from({length:n},(_,i)=>"assets/apercus/"+base+"-"+(i+1)+".jpg")};
});
const fiches=[["enseignant","corriges"],["eleve","decouper"],["je-retiens"],["evaluation"]];
const chapters=[
  {id:"mouvement",title:"Le corps en mouvement",art:img("saut.webp"),intro:"Observe différentes façons de bouger. Quelles parties du corps travaillent ?",items:["saut","corde","escalade","basket","football","gymnastique","course"],quick:[["Illustrations","#mouvement"],["Vidéos","#videos"]]},
  {id:"os",title:"Les os",art:"assets/apercus/054964_d10_squelette-1.jpg",intro:"Observe le squelette et repère les principaux os.",items:["planche-os","squelette-face","squelette-profil","squelette-jambes","radiographie"],quick:[["Planche","#document/planche-os"],["Images","#os"]]},
  {id:"muscles",title:"Les muscles",art:img("flexion-extension.webp"),intro:"Compare le bras qui se plie et le bras qui se tend.",items:["planche-muscles","flexion-extension"],quick:[["Planche","#document/planche-muscles"],["Schéma","#document/flexion-extension"]]},
  {id:"articulations",title:"Les articulations",art:img("articulations.webp"),intro:"Observe où le corps peut se plier et compare ton bras à celui de la pelleteuse.",items:["planche-articulations","articulations","pelleteuse"],quick:[["Planche","#document/planche-articulations"],["Schéma","#document/articulations"]]},
  {id:"jeu",title:"À toi de jouer !",art:img("jeu-squelette.webp"),style:"game",quick:[["Reconstituer le squelette","#jeu"]]},
  {id:"quiz",title:"Entraîne-toi !",style:"quiz",quick:[["Faire les 13 exercices","#quiz"]]}
];
const explain={
  os:"Les os forment la charpente rigide du corps.",muscle:"Un muscle se raccourcit et s’épaissit lorsqu’il se contracte.",
  articulation:"Une articulation est la jonction entre deux os ; les articulations mobiles permettent de les faire bouger.",
  tendon:"Un tendon relie un muscle à un os."
};
const tissue=["muscle","tendon","articulation","os"];
const joints=["cheville","genou","hanche","poignet","coude","épaule"];
const roles=["donne de la rigidité","attache le muscle à l’os","permet le mouvement en se contractant","permet le mouvement entre deux os"];
const quiz=[
 {title:"Quels éléments font bouger ton corps ?",hint:"Complète les trois phrases.",options:["articulations","os","muscles"],rows:[["Les … donnent de la rigidité à notre corps.","os"],["Les … se contractent pour réaliser les mouvements.","muscles"],["Les … permettent aux os de bouger les uns par rapport aux autres.","articulations"]]},
 {title:"Je gonfle pendant un mouvement. Qui suis-je ?",options:["L’os","Le muscle"],answer:[1],explain:explain.muscle},
 {title:"Je ne me déforme pas pendant un mouvement. Qui suis-je ?",options:["Le muscle","L’os"],answer:[1],explain:explain.os},
 {title:"Je permets aux os de bouger les uns par rapport aux autres. Qui suis-je ?",options:["L’articulation","Le tendon"],answer:[0],explain:explain.articulation},
 {title:"J’attache les muscles aux os. Qui suis-je ?",options:["L’articulation","Le tendon"],answer:[1],explain:explain.tendon},
 {title:"Légende le schéma du genou.",hint:"Associe chaque numéro à un mot.",fig:"genou",alt:"Schéma d’une jambe pliée au genou avec quatre repères.",dots:[[44,20],[20,33],[20,52],[20,65]],options:tissue,rows:[["1","muscle"],["2","articulation"],["3","tendon"],["4","os"]]},
 {title:"Compare la pelleteuse et le bras de l’enfant.",hint:"Associe chaque articulation à la bonne lettre.",fig:"engin-bras",alt:"Une pelleteuse dont les trois articulations sont repérées A, B et C ; à droite, un bras humain plié.",options:["B","C","A"],rows:[["Poignet","C"],["Coude","B"],["Épaule","A"]]},
 {title:"Repère les articulations de l’enfant qui saute.",hint:"Associe chaque numéro à une articulation.",fig:"saut-legende",alt:"Photo d’un enfant qui saute, avec six repères à compléter.",dots:[[20,47],[20,71],[78,11],[86,29],[87,60],[83,91]],options:joints,rows:[["1","coude"],["2","cheville"],["3","épaule"],["4","poignet"],["5","hanche"],["6","genou"]]},
 {title:"Quelles articulations vois-tu au niveau des jambes ?",hint:"Coche toutes les bonnes réponses.",photo:"squelette-jambes.webp",alt:"Vue des jambes du squelette, du bassin aux pieds.",options:["Le genou","Le poignet","Le coude","La cheville","L’épaule","La hanche"],answer:[0,3,5],multiple:true,explain:"La hanche relie la jambe au bassin, le genou permet de plier la jambe et la cheville permet de bouger le pied."},
 {title:"Légende le schéma du bras.",hint:"Associe chaque numéro à un mot.",fig:"bras",alt:"Schéma de l’intérieur d’un bras plié avec quatre repères.",dots:[[16,7],[56,8],[15,38],[80,88]],options:["os","tendon","muscle","articulation du coude"],rows:[["1","tendon"],["2","os"],["3","muscle"],["4","articulation du coude"]]},
 {title:"Flexion ou extension ?",options:["extension","flexion"],rows:[["Quand le bras se plie, c’est la…","flexion"],["Quand le bras se tend, c’est l’…","extension"]]},
 {title:"Relie chaque partie du corps à son rôle.",options:roles,rows:[["Os",roles[0]],["Articulation",roles[3]],["Muscle",roles[2]],["Tendon",roles[1]]]},
 {title:"Légende les deux mouvements du bras.",fig:"deux-bras",alt:"Deux schémas du bras. À gauche, le bras se plie. À droite, il se tend.",options:["flexion","extension"],rows:[["Schéma de gauche","flexion"],["Schéma de droite","extension"]]}
];
const skeleton=[
 ["crane","Crâne","crane",50,9,27,16],
 ["cage","Cage thoracique","cage",50,29,63,25],
 ["bassin","Bassin","bassin",50,47,52,13],
 ["bras-g","Humérus","bras-d",17,29,15,17],["bras-d","Humérus","bras-g",83,29,15,17],
 ["avant-bras-g","Os de l’avant-bras","avant-bras-g",13,43,14,14],["avant-bras-d","Os de l’avant-bras","avant-bras-d",87,43,14,14],
 ["main-g","Main","main-g",9,53,12,8],["main-d","Main","main-d",91,53,12,8],
 ["cuisse-g","Fémur","cuisse-g",33,61,17,23],["cuisse-d","Fémur","cuisse-d",67,61,17,23],
 ["jambe-g","Tibia et péroné","jambe-g",31,81,15,22],["jambe-d","Tibia et péroné","jambe-d",69,81,15,22],
 ["pied-g","Pied","pied-d",27,95,22,8],["pied-d","Pied","pied-g",73,95,22,8]
].map(([id,label,art,x,y,w,h])=>({id,label,art,x,y,w,h,group:id.replace(/-[gd]$/,"")}));

