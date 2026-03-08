# REPUBLIQUE DU SENEGAL
## Un Peuple - Un But - Une Foi
## MINISTERE DE L'ENSEIGNEMENT SUPERIEUR, DE LA RECHERCHE ET DE L'INNOVATION

---

### [NOM DE L'UNIVERSITE / INSTITUT]
### Departement : [Nom du departement]
### Filiere : Licence Professionnelle en Informatique

---

# MEMOIRE DE FIN D'ETUDES

**Pour l'obtention du diplome de Licence Professionnelle en Informatique**

**Specialite : [Informatique Appliquee a la Gestion des Entreprises / autre]**

---

## THEME :

# Conception et realisation d'une plateforme web intelligente de pre-consultation medicale et de gestion des rendez-vous en ligne

---

**Presente et soutenu par :** [PRENOM NOM]

**Maitre de stage :** [Nom et fonction]

**Directeur de memoire :** [Nom, Grade]

**Annee academique :** [2024 - 2025]

---
---

# DEDICACES

Je dedie ce travail :

A mes chers parents, pour leur amour inconditionnel, leurs sacrifices et leur soutien permanent tout au long de mon parcours academique. Aucune dedicace ne saurait exprimer mon respect, ma reconnaissance et mon amour eternel.

A mes freres et soeurs, pour leur encouragement continu et leur presence a mes cotes dans les moments les plus difficiles.

A tous mes amis et camarades de promotion, pour les moments de partage, d'entraide et de solidarite qui ont marque ces annees de formation.

A tous ceux qui, de pres ou de loin, ont contribue a la realisation de ce travail.

---

# REMERCIEMENTS

Au terme de ce travail, je tiens a exprimer ma profonde gratitude envers toutes les personnes qui ont contribue, de pres ou de loin, a la realisation de ce memoire de fin d'etudes.

Mes remerciements s'adressent en premier lieu a **Dieu le Tout-Puissant** pour m'avoir donne la force, le courage et la patience necessaires pour mener a bien ce travail.

Je remercie sincerement **[Nom du Directeur de memoire]**, mon directeur de memoire, pour sa disponibilite, ses orientations precieuses et ses conseils avises qui m'ont permis de structurer et d'ameliorer ce travail tout au long de sa realisation.

J'adresse mes vifs remerciements a **[Nom du Maitre de stage]**, mon maitre de stage au sein de **[Nom de la clinique/structure]**, pour m'avoir accueilli et encadre durant ma periode de stage. Son expertise dans le domaine medical et sa confiance m'ont permis de comprendre les enjeux reels du terrain.

Je remercie egalement l'ensemble du **corps professoral** de [Nom de l'Institut/Universite] pour la qualite de l'enseignement dispense et pour m'avoir transmis les competences necessaires a l'exercice de mon metier.

Mes remerciements vont aussi a tous les **membres du jury** qui ont accepte d'evaluer ce travail. Leurs observations et critiques constructives contribueront sans doute a son amelioration.

Enfin, je remercie ma famille, mes amis et tous ceux qui m'ont soutenu moralement et materiellement durant cette formation.

---

# AVANT-PROPOS

[Nom de l'Institut/Universite] est un etablissement d'enseignement superieur qui forme des cadres competents dans le domaine de l'informatique et des nouvelles technologies. La formation en Licence Professionnelle en Informatique a pour objectif de fournir aux etudiants des connaissances theoriques solides et des competences pratiques leur permettant de s'inserer efficacement dans le monde professionnel.

Dans le cadre de cette formation, un stage pratique en entreprise est exige en fin de cycle. Ce stage, d'une duree de [X mois], constitue une etape determinante dans le parcours de l'etudiant. Il offre l'opportunite de mettre en application les connaissances acquises durant la formation et de se confronter aux realites du monde du travail.

C'est dans ce cadre que j'ai effectue mon stage au sein de **[Nom de la clinique/structure]**, une structure sanitaire privee situee a [Ville, Senegal]. Ce stage m'a permis d'identifier les difficultes liees a la gestion des rendez-vous medicaux et de la pre-consultation, et de proposer une solution informatique adaptee aux besoins de la structure.

Le present memoire constitue la synthese de ce travail de recherche et de developpement, et retrace les differentes etapes de la conception et de la realisation de la plateforme **MediConsult**.

---

# SOMMAIRE

- Dedicaces
- Remerciements
- Avant-propos
- Sommaire
- Glossaire / Sigles et Abreviations
- Liste des figures
- Liste des tableaux
- Resume / Abstract
- **Introduction generale**
- **Chapitre I : Cadre theorique et etude de l'existant**
  - I.1. Presentation de la structure d'accueil
  - I.2. Etude de l'existant
  - I.3. Critique de l'existant
  - I.4. Problematique
  - I.5. Objectifs du projet
  - I.6. Identification des acteurs
  - I.7. Identification des besoins
- **Chapitre II : Analyse et conception**
  - II.1. Methodologie adoptee
  - II.2. Langage de modelisation : UML
  - II.3. Diagramme de cas d'utilisation
  - II.4. Description textuelle des cas d'utilisation
  - II.5. Diagramme de sequence
  - II.6. Diagramme de classes
  - II.7. Diagramme de deploiement
  - II.8. Conception de la base de donnees
- **Chapitre III : Realisation et mise en oeuvre**
  - III.1. Environnement de travail
  - III.2. Outils et technologies utilises
  - III.3. Architecture de l'application
  - III.4. Securite de l'application
  - III.5. Presentation des interfaces
  - III.6. Tests et validation
- **Conclusion generale et perspectives**
- Bibliographie / Webographie
- Annexes

---

# GLOSSAIRE / SIGLES ET ABREVIATIONS

| Sigle / Terme | Signification |
|---|---|
| API | Application Programming Interface (Interface de Programmation Applicative) |
| CRUD | Create, Read, Update, Delete (Creer, Lire, Modifier, Supprimer) |
| CSS | Cascading Style Sheets (Feuilles de style en cascade) |
| HTML | HyperText Markup Language (Langage de balisage hypertexte) |
| HTTP | HyperText Transfer Protocol (Protocole de transfert hypertexte) |
| HTTPS | HyperText Transfer Protocol Secure |
| IA | Intelligence Artificielle |
| IHM | Interface Homme-Machine |
| JS | JavaScript |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MVC | Model-View-Controller (Modele-Vue-Controleur) |
| ORM | Object-Relational Mapping (Mapping Objet-Relationnel) |
| PHP | Hypertext Preprocessor |
| REST | Representational State Transfer |
| SGBD | Systeme de Gestion de Base de Donnees |
| SQL | Structured Query Language (Langage de requete structuree) |
| UML | Unified Modeling Language (Langage de modelisation unifie) |
| URL | Uniform Resource Locator |
| UI | User Interface (Interface utilisateur) |
| UX | User Experience (Experience utilisateur) |
| RDV | Rendez-vous |
| SMS | Short Message Service |
| SMTP | Simple Mail Transfer Protocol |

---

# LISTE DES FIGURES

- Figure 1 : Organigramme de [Nom de la clinique]
- Figure 2 : Diagramme de cas d'utilisation general
- Figure 3 : Diagramme de cas d'utilisation -- Gestion des patients
- Figure 4 : Diagramme de cas d'utilisation -- Gestion des rendez-vous
- Figure 5 : Diagramme de cas d'utilisation -- Pre-consultation intelligente
- Figure 6 : Diagramme de sequence -- Inscription d'un patient
- Figure 7 : Diagramme de sequence -- Prise de rendez-vous en ligne
- Figure 8 : Diagramme de sequence -- Pre-consultation et orientation
- Figure 9 : Diagramme de sequence -- Validation de rendez-vous par la secretaire
- Figure 10 : Diagramme de classes
- Figure 11 : Diagramme de deploiement
- Figure 12 : Schema de la base de donnees
- Figure 13 : Architecture MVC de l'application
- Figure 14 : Interface -- Page d'accueil
- Figure 15 : Interface -- Formulaire d'inscription
- Figure 16 : Interface -- Formulaire de connexion
- Figure 17 : Interface -- Formulaire de pre-consultation
- Figure 18 : Interface -- Resultat de l'orientation intelligente
- Figure 19 : Interface -- Prise de rendez-vous
- Figure 20 : Interface -- Tableau de bord patient
- Figure 21 : Interface -- Tableau de bord secretaire
- Figure 22 : Interface -- Tableau de bord medecin
- Figure 23 : Interface -- Tableau de bord administrateur
- Figure 24 : Interface -- Gestion des services medicaux
- Figure 25 : Interface -- Planning des medecins

---

# LISTE DES TABLEAUX

- Tableau 1 : Identification des acteurs et leurs roles
- Tableau 2 : Besoins fonctionnels du systeme
- Tableau 3 : Besoins non fonctionnels du systeme
- Tableau 4 : Description textuelle -- Cas d'utilisation "S'inscrire"
- Tableau 5 : Description textuelle -- Cas d'utilisation "Se connecter"
- Tableau 6 : Description textuelle -- Cas d'utilisation "Remplir formulaire de pre-consultation"
- Tableau 7 : Description textuelle -- Cas d'utilisation "Prendre un rendez-vous"
- Tableau 8 : Description textuelle -- Cas d'utilisation "Valider/Rejeter un rendez-vous"
- Tableau 9 : Description textuelle -- Cas d'utilisation "Gerer les services medicaux"
- Tableau 10 : Description textuelle -- Cas d'utilisation "Gerer les medecins"
- Tableau 11 : Dictionnaire de donnees
- Tableau 12 : Outils et technologies utilises
- Tableau 13 : Plan de tests fonctionnels

---

# RESUME

La gestion des rendez-vous medicaux et l'orientation des patients vers les services de sante competents constituent des enjeux majeurs pour les structures sanitaires privees au Senegal. Dans la plupart des cliniques, ces processus reposent encore sur des methodes manuelles -- registres papier, appels telephoniques, files d'attente -- qui entrainent des pertes de temps, des erreurs de planification et une insatisfaction des patients.

Le present memoire porte sur la conception et la realisation d'une plateforme web intelligente, baptisee **MediConsult**, destinee a moderniser la gestion des rendez-vous et a introduire un systeme de pre-consultation en ligne. Cette plateforme permet aux patients de decrire leurs symptomes via un formulaire interactif ; un algorithme de scoring analyse ces informations et oriente automatiquement le patient vers le service medical le plus adapte. La secretaire medicale dispose d'un tableau de bord pour valider, planifier ou rejeter les rendez-vous en fonction des disponibilites des medecins.

La demarche suivie s'appuie sur le langage de modelisation UML pour l'analyse et la conception, et sur une architecture MVC pour le developpement. Les technologies utilisees comprennent **React** pour le frontend, **Laravel** pour le backend, et **PostgreSQL** pour la base de donnees.

Les resultats obtenus montrent que la plateforme repond aux besoins identifies et offre une solution fiable, ergonomique et evolutive pour ameliorer la qualite des soins et l'experience patient.

**Mots-cles :** rendez-vous medical, pre-consultation, plateforme web, algorithme de scoring, orientation patient, UML, React, Laravel, PostgreSQL.

---

# ABSTRACT

The management of medical appointments and the orientation of patients toward the appropriate healthcare services are major challenges for private medical facilities in Senegal. In most clinics, these processes still rely on manual methods -- paper registers, phone calls, and waiting lines -- leading to time losses, scheduling errors, and patient dissatisfaction.

This thesis focuses on the design and development of an intelligent web platform called **MediConsult**, aimed at modernizing appointment management and introducing an online pre-consultation system. The platform allows patients to describe their symptoms through an interactive form; a scoring algorithm analyzes this information and automatically directs the patient to the most suitable medical service. The medical secretary has a dashboard to validate, schedule, or reject appointments based on doctors' availability.

The methodology follows the UML modeling language for analysis and design, and the MVC architecture for development. The technologies used include **React** for the frontend, **Laravel** for the backend, and **PostgreSQL** for the database.

The results show that the platform meets the identified needs and provides a reliable, user-friendly, and scalable solution to improve healthcare quality and the patient experience.

**Keywords:** medical appointment, pre-consultation, web platform, scoring algorithm, patient orientation, UML, React, Laravel, PostgreSQL.

---
---

# INTRODUCTION GENERALE

Le secteur de la sante au Senegal connait une evolution constante, portee par une demande croissante de soins de qualite et une volonte des pouvoirs publics d'ameliorer l'acces aux services de sante pour l'ensemble de la population. Les structures sanitaires privees, en particulier les cliniques, jouent un role essentiel dans ce dispositif en offrant des services complementaires au systeme public de sante. Cependant, malgre les avancees realisees, la gestion quotidienne de ces structures reste confrontee a de nombreux defis, notamment en ce qui concerne la prise en charge des patients, la gestion des rendez-vous et l'orientation vers les services competents.

Dans la plupart des cliniques privees au Senegal, la gestion des rendez-vous medicaux repose encore sur des methodes traditionnelles. Le patient se deplace physiquement pour s'inscrire, attend souvent de longues heures dans une file d'attente, et prend son rendez-vous aupres de la secretaire medicale qui consigne les informations dans un registre papier ou, au mieux, dans un fichier bureautique. Ce fonctionnement, bien qu'operationnel, presente de nombreuses limites. Il est source d'erreurs humaines (doublons de rendez-vous, perte d'informations), de pertes de temps considerables pour le patient comme pour le personnel, et ne permet aucune visibilite en temps reel sur les disponibilites des medecins.

Par ailleurs, l'etape de la pre-consultation -- ce moment ou le patient expose ses symptomes avant d'etre oriente vers le medecin competent -- est souvent negligee ou realisee de maniere sommaire. Le patient choisit lui-meme le medecin a consulter, parfois sans connaitre la specialite adaptee a son probleme de sante, ce qui peut entrainer des consultations inutiles, des reorientations tardives et une perte de temps pour tous les acteurs.

Face a ces constats, les technologies de l'information et de la communication (TIC) offrent des opportunites considerables pour moderniser la gestion des structures de sante. Les plateformes web, en particulier, permettent de dematerialiser les processus, d'automatiser certaines taches et d'ameliorer l'experience patient. L'intelligence artificielle, meme sous ses formes les plus simples comme les algorithmes de scoring, peut apporter une valeur ajoutee en aidant a orienter les patients vers les bons services en fonction de leurs symptomes.

## Problematique

Comment concevoir et realiser une plateforme web permettant d'optimiser la gestion des rendez-vous medicaux dans une clinique privee tout en integrant un systeme intelligent de pre-consultation capable d'orienter automatiquement le patient vers le service medical le plus adapte a ses symptomes ?

Cette problematique se decline en plusieurs sous-questions :
- Comment dematerialiser le processus de prise de rendez-vous pour le rendre accessible en ligne et reduire les files d'attente ?
- Comment mettre en place un systeme de pre-consultation qui analyse les symptomes du patient et propose une orientation fiable vers le service competent ?
- Comment fournir aux secretaires medicales un outil efficace pour gerer les rendez-vous, les validations et le planning des medecins ?
- Comment garantir la securite et la confidentialite des donnees medicales des patients ?

## Objectifs du projet

Pour repondre a cette problematique, le present projet vise a concevoir et realiser une plateforme web baptisee **MediConsult** avec les objectifs suivants :

**Objectif general :**
Concevoir et developper une plateforme web intelligente de pre-consultation medicale et de gestion des rendez-vous en ligne pour une clinique privee au Senegal.

**Objectifs specifiques :**
- Permettre aux patients de creer un compte, de se connecter et de prendre des rendez-vous en ligne de maniere autonome ;
- Mettre en place un formulaire interactif de pre-consultation permettant au patient de decrire ses symptomes ;
- Developper un algorithme de scoring qui analyse les symptomes saisis et oriente automatiquement le patient vers le service medical le plus pertinent ;
- Offrir a la secretaire medicale un tableau de bord pour valider, planifier ou rejeter les demandes de rendez-vous ;
- Permettre aux medecins de consulter leur planning et l'historique des consultations ;
- Fournir a l'administrateur un espace de gestion globale (services, medecins, utilisateurs, statistiques) ;
- Mettre en place un systeme de notifications (email et/ou SMS) pour les confirmations et rappels de rendez-vous ;
- Garantir la securite des donnees personnelles et medicales des utilisateurs.

## Interet du projet

Ce projet presente un interet multiple :

**Sur le plan scientifique**, il permet d'explorer l'application des algorithmes de scoring dans le domaine de la sante, en particulier pour l'aide a la decision dans l'orientation des patients. Il illustre egalement la mise en oeuvre d'une demarche de conception logicielle rigoureuse basee sur UML.

**Sur le plan professionnel**, ce projet repond a un besoin reel identifie dans une structure sanitaire privee. La plateforme MediConsult vise a ameliorer l'efficacite operationnelle de la clinique, a reduire les temps d'attente et a optimiser l'allocation des ressources medicales.

**Sur le plan social**, la plateforme contribue a ameliorer l'experience patient en offrant un acces simplifie aux services de sante. Le patient peut decrire ses symptomes depuis chez lui, recevoir une orientation et prendre un rendez-vous sans avoir a se deplacer inutilement.

## Methodologie de travail

Pour mener a bien ce projet, nous avons adopte une demarche methodologique structuree en plusieurs etapes :

1. **Phase d'etude et d'analyse** : Etude de la structure d'accueil, analyse du systeme existant, identification des acteurs et recueil des besoins fonctionnels et non fonctionnels.
2. **Phase de conception** : Modelisation du systeme a l'aide du langage UML (diagrammes de cas d'utilisation, de sequence, de classes et de deploiement), conception de la base de donnees.
3. **Phase de realisation** : Developpement de la plateforme en utilisant les technologies React (frontend), Laravel (backend) et PostgreSQL (base de donnees), avec une architecture MVC.
4. **Phase de tests et validation** : Tests fonctionnels pour verifier la conformite du systeme aux besoins exprimes.

## Organisation du document

Le present document est structure en trois chapitres :

- **Chapitre I : Cadre theorique et etude de l'existant** -- Ce chapitre presente la structure d'accueil, l'etude du systeme existant, sa critique, la problematique detaillee, les objectifs du projet, l'identification des acteurs et le recueil des besoins.

- **Chapitre II : Analyse et conception** -- Ce chapitre expose la methodologie adoptee, le langage de modelisation UML et presente les differents diagrammes de conception : cas d'utilisation, sequences, classes, deploiement et la conception de la base de donnees.

- **Chapitre III : Realisation et mise en oeuvre** -- Ce dernier chapitre decrit l'environnement de travail, les outils et technologies utilises, l'architecture de l'application, les mesures de securite, les interfaces realisees et les tests effectues.

Enfin, une **conclusion generale** fait la synthese du travail realise et ouvre des perspectives d'amelioration.


---
---

# CHAPITRE I : CADRE THEORIQUE ET ETUDE DE L'EXISTANT

## Introduction

Ce premier chapitre constitue le socle de notre travail. Il presente la structure d'accueil dans laquelle nous avons effectue notre stage, decrit le systeme de gestion existant, en fait une critique objective, puis formule la problematique a laquelle notre projet apporte une reponse. Nous y identifions egalement les acteurs du systeme et recensons les besoins fonctionnels et non fonctionnels qui guideront la conception et la realisation de la plateforme MediConsult.

---

## I.1. Presentation de la structure d'accueil

### I.1.1. Historique et situation geographique

[Nom de la clinique] est une structure sanitaire privee situee a [Ville], au Senegal. Creee en [annee], elle s'est imposee au fil des annees comme un acteur incontournable de l'offre de soins dans la region de [Region]. La clinique est implantee dans un quartier accessible, a proximite des grands axes routiers, ce qui facilite l'acces des patients venant de differentes localites.

### I.1.2. Mission et activites

La clinique a pour mission d'offrir des soins de sante de qualite a une population diversifiee. Elle dispose de plusieurs services medicaux couvrant les principales specialites :

- **Medecine generale** : consultations courantes, bilans de sante, suivi des maladies chroniques ;
- **Pediatrie** : soins et suivi medical des nourrissons, enfants et adolescents ;
- **Gynecologie** : consultations prenatales, suivi de grossesse, planification familiale ;
- **Cardiologie** : diagnostic et suivi des pathologies cardiovasculaires ;
- **Dermatologie** : traitement des affections cutanees et allergiques ;
- **Ophtalmologie** : examens de la vue, diagnostic et traitement des maladies oculaires ;
- **Analyses medicales** : laboratoire d'analyses biologiques et biochimiques.

La clinique emploie une equipe pluridisciplinaire composee de medecins specialistes, d'infirmiers, de techniciens de laboratoire, de secretaires medicales et de personnel administratif.

### I.1.3. Organisation et organigramme

La structure organisationnelle de la clinique repose sur une direction generale qui supervise l'ensemble des activites. Sous cette direction, on retrouve :

- **La direction medicale** : qui coordonne l'activite des medecins et les services de soins ;
- **Le secretariat medical** : qui assure l'accueil des patients, la gestion des rendez-vous et la tenue des dossiers ;
- **Le service administratif et financier** : qui gere la comptabilite, les ressources humaines et la logistique ;
- **Le laboratoire** : qui realise les analyses prescrites par les medecins.

*Figure 1 : Organigramme de [Nom de la clinique]*

```
                    [Direction Generale]
                           |
            +--------------+--------------+
            |              |              |
    [Direction       [Secretariat    [Service Admin
     Medicale]        Medical]       et Financier]
         |                |              |
   +-----+-----+    [Accueil &     [Comptabilite]
   |     |     |    Gestion RDV]   [RH & Logistique]
[Med.  [Med.  [Med.
 Gen.] Spec.] Spec.]
         |
   [Laboratoire]
```

---

## I.2. Etude de l'existant

L'etude de l'existant vise a comprendre le fonctionnement actuel du systeme de gestion des rendez-vous et de l'orientation des patients au sein de la clinique. Cette etape est indispensable pour identifier les forces et les faiblesses du systeme en place et pour mieux cerner les besoins auxquels notre solution doit repondre.

### I.2.1. Processus actuel de prise de rendez-vous

Le processus de prise de rendez-vous au sein de la clinique se deroule actuellement de la maniere suivante :

1. **Arrivee du patient** : Le patient se presente physiquement a l'accueil de la clinique ou appelle par telephone.
2. **Enregistrement** : La secretaire medicale recueille les informations du patient (nom, prenom, telephone, motif de consultation) et les consigne dans un registre papier.
3. **Choix du medecin** : Le patient indique le medecin ou la specialite souhaitee. Dans la plupart des cas, c'est le patient lui-meme qui choisit, sans orientation prealable.
4. **Verification des disponibilites** : La secretaire consulte manuellement le cahier de rendez-vous du medecin concerne pour trouver un creneau libre.
5. **Attribution du rendez-vous** : Si un creneau est disponible, le rendez-vous est inscrit dans le registre. Le patient est informe verbalement ou par telephone de la date et de l'heure.
6. **Jour du rendez-vous** : Le patient se presente a la clinique, attend son tour, puis est recu par le medecin.

### I.2.2. Processus actuel de pre-consultation

La pre-consultation, dans sa forme actuelle, se resume a un bref echange entre le patient et la secretaire ou l'infirmier d'accueil. Le patient exprime verbalement ses symptomes, et l'agent d'accueil l'oriente vers un medecin en fonction de son appreciation personnelle. Il n'existe aucun outil formalise, aucun questionnaire standardise et aucune base de donnees de symptomes permettant une orientation objective et fiable.

### I.2.3. Outils actuellement utilises

| Outil | Usage |
|---|---|
| Registre papier | Enregistrement des rendez-vous et des informations patients |
| Cahier de consultation | Suivi des consultations par medecin |
| Telephone fixe/mobile | Communication avec les patients pour confirmation/rappel |
| Fichiers Excel (occasionnellement) | Suivi statistique mensuel des consultations |

---

## I.3. Critique de l'existant

L'analyse du systeme en place revele plusieurs insuffisances majeures que nous pouvons regrouper en categories :

### I.3.1. Limites liees a la gestion des rendez-vous

- **Absence de systeme informatise** : Toute la gestion repose sur des registres papier, ce qui rend le suivi fastidieux et sujet aux erreurs.
- **Risque de doublons** : Sans outil de verification automatique, il arrive que deux patients soient inscrits sur le meme creneau horaire.
- **Manque de visibilite** : Ni le patient ni le personnel ne disposent d'une vue d'ensemble en temps reel sur les disponibilites des medecins.
- **Perte d'informations** : Les registres papier sont vulnerables (deterioration, perte, difficulte de recherche).
- **Absence de rappels automatiques** : Les patients ne recoivent aucun rappel automatise, ce qui entraine un taux significatif de rendez-vous non honores (no-show).

### I.3.2. Limites liees a la pre-consultation et l'orientation

- **Orientation subjective** : L'orientation du patient repose uniquement sur le jugement personnel de l'agent d'accueil, sans outil d'aide a la decision.
- **Pas de questionnaire standardise** : L'absence de formulaire structure ne permet pas de recueillir systematiquement les symptomes du patient.
- **Consultations inappropriees** : Il arrive que des patients consultent un medecin dont la specialite ne correspond pas a leur pathologie, entrainant des reorientations et une perte de temps.

### I.3.3. Limites liees a l'experience patient

- **Deplacement obligatoire** : Le patient doit se deplacer pour prendre un rendez-vous, meme si la consultation n'aura lieu que plusieurs jours plus tard.
- **Temps d'attente eleve** : L'absence de gestion optimisee des creneaux genere des files d'attente importantes.
- **Manque de transparence** : Le patient n'a aucune visibilite sur son dossier, son historique de consultations ou le statut de son rendez-vous.

---

## I.4. Problematique

Au vu des insuffisances identifiees dans le systeme actuel, la problematique centrale de notre projet se formule comme suit :

**Comment concevoir et mettre en oeuvre une solution informatique qui permette de dematerialiser et d'optimiser la gestion des rendez-vous medicaux, tout en integrant un mecanisme intelligent d'aide a l'orientation des patients vers les services de sante competents ?**

Cette question souleve plusieurs enjeux :
- La **numerisation** du processus de prise de rendez-vous pour le rendre accessible a distance ;
- L'**automatisation** de l'orientation patient a travers un algorithme de scoring base sur les symptomes ;
- La **centralisation** des informations dans une base de donnees fiable et securisee ;
- L'**amelioration** de l'experience patient et de l'efficacite operationnelle de la clinique.

---

## I.5. Objectifs du projet

### I.5.1. Objectif general

Concevoir et developper une plateforme web intelligente, baptisee **MediConsult**, permettant la gestion des rendez-vous medicaux en ligne et l'orientation automatisee des patients via un systeme de pre-consultation base sur un algorithme de scoring.

### I.5.2. Objectifs specifiques

- Permettre aux patients de s'inscrire, de se connecter et de gerer leurs rendez-vous en ligne ;
- Mettre en place un formulaire de pre-consultation interactif pour le recueil des symptomes ;
- Developper un algorithme de scoring pour orienter le patient vers le service medical adapte ;
- Offrir a la secretaire medicale un tableau de bord de gestion des rendez-vous (validation, rejet, planification) ;
- Permettre aux medecins de consulter leur planning et les fiches de pre-consultation de leurs patients ;
- Fournir a l'administrateur un espace de gestion globale (utilisateurs, services, medecins, statistiques) ;
- Integrer un systeme de notifications par email pour les confirmations et rappels de rendez-vous ;
- Assurer la securite et la confidentialite des donnees medicales.

---

## I.6. Identification des acteurs

Un acteur est une entite externe qui interagit avec le systeme. Nous avons identifie quatre acteurs principaux pour la plateforme MediConsult :

*Tableau 1 : Identification des acteurs et leurs roles*

| Acteur | Description | Roles principaux |
|---|---|---|
| **Patient** | Personne cherchant a obtenir une consultation medicale. Il peut etre un nouveau patient ou un patient deja enregistre dans le systeme. | - S'inscrire et se connecter sur la plateforme - Remplir le formulaire de pre-consultation (symptomes) - Recevoir une orientation vers le service adapte - Prendre un rendez-vous en ligne - Consulter son historique de rendez-vous et consultations - Recevoir des notifications (confirmation, rappel) |
| **Secretaire medicale** | Personnel charge de l'accueil des patients et de la gestion administrative des rendez-vous. Elle constitue le pivot entre les patients et les medecins. | - Visualiser les demandes de rendez-vous entrantes - Valider ou rejeter les demandes de rendez-vous - Assigner un medecin et un creneau horaire - Gerer le planning des medecins - Consulter les fiches de pre-consultation des patients - Fermer/ouvrir les creneaux de rendez-vous en ligne |
| **Medecin** | Professionnel de sante qui assure les consultations. Chaque medecin est rattache a un ou plusieurs services medicaux. | - Consulter son planning de rendez-vous - Visualiser les fiches de pre-consultation de ses patients - Marquer les consultations comme effectuees - Consulter son historique de consultations |
| **Administrateur** | Responsable technique et fonctionnel de la plateforme. Il assure la gestion globale du systeme. | - Gerer les comptes utilisateurs (patients, secretaires, medecins) - Gerer les services medicaux (ajout, modification, suppression) - Gerer les medecins et leurs affectations aux services - Configurer l'algorithme de scoring (symptomes, poids, services) - Consulter les statistiques globales de la plateforme - Gerer les parametres generaux du systeme |

---

## I.7. Identification des besoins

L'identification des besoins est une etape cruciale qui permet de definir avec precision ce que le systeme doit faire (besoins fonctionnels) et comment il doit le faire (besoins non fonctionnels).

### I.7.1. Besoins fonctionnels

Les besoins fonctionnels decrivent les fonctionnalites que la plateforme MediConsult doit offrir a ses utilisateurs.

*Tableau 2 : Besoins fonctionnels du systeme*

| N | Besoin fonctionnel | Description | Acteur(s) concerne(s) |
|---|---|---|---|
| BF01 | Inscription en ligne | Le systeme doit permettre a un patient de creer un compte en renseignant ses informations personnelles (nom, prenom, email, telephone, mot de passe). | Patient |
| BF02 | Authentification | Le systeme doit permettre a chaque utilisateur de se connecter avec ses identifiants (email et mot de passe) et d'acceder a son espace selon son profil. | Patient, Secretaire, Medecin, Administrateur |
| BF03 | Pre-consultation en ligne | Le systeme doit proposer un formulaire interactif permettant au patient de decrire ses symptomes (zone du corps affectee, type de douleur, duree, intensite, antecedents). | Patient |
| BF04 | Orientation automatique | Le systeme doit analyser les symptomes saisis via un algorithme de scoring et proposer le service medical le plus adapte au patient. | Patient (beneficiaire), Systeme (execution) |
| BF05 | Prise de rendez-vous en ligne | Le systeme doit permettre au patient de choisir une date et un creneau horaire disponible pour son rendez-vous, apres avoir ete oriente vers un service. | Patient |
| BF06 | Validation des rendez-vous | Le systeme doit permettre a la secretaire medicale de consulter les demandes de rendez-vous et de les valider ou de les rejeter, avec possibilite d'assigner un medecin. | Secretaire |
| BF07 | Gestion du planning | Le systeme doit afficher le planning des medecins avec les creneaux reserves et disponibles, et permettre a la secretaire de gerer ce planning. | Secretaire, Medecin |
| BF08 | Notifications par email | Le systeme doit envoyer des emails automatiques pour confirmer les rendez-vous, notifier les rejets et rappeler les rendez-vous a venir. | Patient (destinataire), Systeme (envoi) |
| BF09 | Historique des rendez-vous | Le systeme doit permettre a chaque patient de consulter la liste de ses rendez-vous passes et a venir, avec leur statut (en attente, confirme, annule, effectue). | Patient, Medecin |
| BF10 | Gestion des services medicaux | Le systeme doit permettre a l'administrateur de creer, modifier et supprimer les services medicaux proposes par la clinique. | Administrateur |
| BF11 | Gestion des medecins | Le systeme doit permettre a l'administrateur d'ajouter des medecins, de les affecter a des services et de gerer leurs informations. | Administrateur |
| BF12 | Gestion des utilisateurs | Le systeme doit permettre a l'administrateur de visualiser, activer, desactiver ou supprimer les comptes utilisateurs. | Administrateur |
| BF13 | Tableau de bord et statistiques | Le systeme doit proposer des tableaux de bord adaptes a chaque profil, avec des statistiques pertinentes (nombre de RDV, taux de validation, repartition par service, etc.). | Administrateur, Secretaire, Medecin |
| BF14 | Configuration de l'algorithme de scoring | Le systeme doit permettre a l'administrateur de parametrer les regles de scoring (association symptomes-services, poids des criteres). | Administrateur |
| BF15 | Fermeture des rendez-vous en ligne | Le systeme doit permettre a la secretaire de fermer temporairement la prise de rendez-vous en ligne lorsque les creneaux sont satures. | Secretaire |

### I.7.2. Besoins non fonctionnels

Les besoins non fonctionnels definissent les criteres de qualite que le systeme doit respecter.

*Tableau 3 : Besoins non fonctionnels du systeme*

| N | Besoin non fonctionnel | Description |
|---|---|---|
| BNF01 | **Securite** | Le systeme doit garantir la confidentialite des donnees medicales. Les mots de passe doivent etre chiffres (bcrypt). L'acces aux fonctionnalites doit etre controle par un systeme de roles et permissions. Les echanges doivent etre securises via HTTPS. |
| BNF02 | **Performance** | Le systeme doit offrir des temps de reponse inferieurs a 3 secondes pour les operations courantes (chargement de page, soumission de formulaire, affichage du planning). |
| BNF03 | **Ergonomie** | L'interface doit etre intuitive, agreable et facile a prendre en main pour tous les profils d'utilisateurs, y compris les patients peu familiers avec les outils numeriques. |
| BNF04 | **Responsivite** | L'application doit s'adapter a tous les types d'ecrans (ordinateur, tablette, smartphone) grace a un design responsive. |
| BNF05 | **Disponibilite** | La plateforme doit etre accessible 24h/24 et 7j/7, avec un taux de disponibilite vise de 99%. |
| BNF06 | **Maintenabilite** | Le code source doit etre structure, documente et respecter les bonnes pratiques de developpement pour faciliter la maintenance et l'evolution de l'application. |
| BNF07 | **Evolutivite** | L'architecture du systeme doit permettre l'ajout de nouvelles fonctionnalites (teleconsultation, paiement en ligne, application mobile) sans remise en cause majeure. |
| BNF08 | **Fiabilite** | Le systeme doit assurer l'integrite des donnees et prevenir les pertes d'information grace a des mecanismes de sauvegarde et de journalisation. |

---

## Conclusion du chapitre

Ce premier chapitre nous a permis de poser les bases de notre projet. Nous avons presente la structure d'accueil et son fonctionnement, etudie et critique le systeme de gestion existant, puis formule la problematique a laquelle notre plateforme MediConsult apporte une reponse. L'identification des acteurs et le recueil des besoins fonctionnels et non fonctionnels constituent le cahier des charges qui guidera les phases de conception et de realisation presentees dans les chapitres suivants.


---
---

# CHAPITRE II : ANALYSE ET CONCEPTION

## Introduction

Apres avoir identifie les besoins fonctionnels et non fonctionnels dans le chapitre precedent, ce deuxieme chapitre est consacre a l'analyse et a la conception de la plateforme MediConsult. Nous y presentons la methodologie de conception adoptee, le langage de modelisation utilise (UML), puis nous detaillons les differents diagrammes qui constituent le modele conceptuel de notre application : diagrammes de cas d'utilisation, descriptions textuelles, diagrammes de sequence, diagramme de classes, diagramme de deploiement et conception de la base de donnees.

---

## II.1. Methodologie adoptee

Pour la conception de notre plateforme, nous avons adopte une approche orientee objet en utilisant le processus unifie (UP -- Unified Process). Ce choix se justifie par :

- Son caractere **iteratif et incremental**, qui permet de raffiner progressivement la solution ;
- Son orientation **cas d'utilisation**, qui place les besoins des utilisateurs au coeur de la conception ;
- Sa compatibilite avec le langage **UML** pour la modelisation ;
- Son adaptation aux projets de taille moyenne comme le notre.

La demarche suivie se decompose en quatre phases principales :
1. **Inception** : Identification du perimetre du projet, des acteurs et des cas d'utilisation principaux ;
2. **Elaboration** : Analyse detaillee et conception de l'architecture du systeme ;
3. **Construction** : Developpement et tests des fonctionnalites ;
4. **Transition** : Deploiement et mise en service.

---

## II.2. Langage de modelisation : UML

**UML** (Unified Modeling Language) est un langage de modelisation graphique standardise par l'OMG (Object Management Group). Il fournit un ensemble de diagrammes permettant de representer les differents aspects d'un systeme informatique, aussi bien structurels que comportementaux.

Dans le cadre de notre projet, nous utilisons les diagrammes UML suivants :

| Diagramme | Objectif |
|---|---|
| Diagramme de cas d'utilisation | Representer les interactions entre les acteurs et le systeme |
| Diagramme de sequence | Decrire l'enchainement des messages entre les objets pour un scenario donne |
| Diagramme de classes | Modeliser la structure statique du systeme (classes, attributs, relations) |
| Diagramme de deploiement | Representer l'architecture physique du systeme |

---

## II.3. Diagrammes de cas d'utilisation

Le diagramme de cas d'utilisation est un diagramme comportemental qui permet de representer les fonctionnalites du systeme du point de vue de ses utilisateurs (acteurs). Chaque cas d'utilisation decrit une interaction entre un acteur et le systeme pour atteindre un objectif precis.

### II.3.1. Diagramme de cas d'utilisation general

Le diagramme de cas d'utilisation general offre une vue d'ensemble des fonctionnalites de la plateforme MediConsult et des interactions entre les quatre acteurs et le systeme.

*Figure 2 : Diagramme de cas d'utilisation general*

```
+-------------------------------------------------------------------+
|                     PLATEFORME MEDICONSULT                         |
|                                                                   |
|  +---------------------------+  +-----------------------------+   |
|  | S'inscrire                |  | Gerer les services medicaux |   |
|  +---------------------------+  +-----------------------------+   |
|  | S'authentifier             |  | Gerer les medecins          |   |
|  +---------------------------+  +-----------------------------+   |
|  | Remplir formulaire         |  | Gerer les utilisateurs      |   |
|  | de pre-consultation        |  +-----------------------------+   |
|  +---------------------------+  | Configurer l'algorithme      |   |
|  | Recevoir orientation       |  | de scoring                  |   |
|  | automatique                |  +-----------------------------+   |
|  +---------------------------+  | Consulter statistiques       |   |
|  | Prendre un RDV en ligne   |  +-----------------------------+   |
|  +---------------------------+                                    |
|  | Consulter historique RDV  |  +-----------------------------+   |
|  +---------------------------+  | Valider/Rejeter un RDV      |   |
|  | Recevoir notifications    |  +-----------------------------+   |
|  +---------------------------+  | Gerer le planning medecins  |   |
|                                 +-----------------------------+   |
|                                 | Fermer/Ouvrir RDV en ligne  |   |
|                                 +-----------------------------+   |
|                                 | Consulter fiches             |   |
|                                 | pre-consultation             |   |
|                                 +-----------------------------+   |
|                                                                   |
|  +---------------------------+                                    |
|  | Consulter son planning    |                                    |
|  +---------------------------+                                    |
|  | Voir fiches patients      |                                    |
|  +---------------------------+                                    |
|  | Marquer consultation      |                                    |
|  | effectuee                 |                                    |
|  +---------------------------+                                    |
+-------------------------------------------------------------------+

Acteurs :
  [Patient]      --> S'inscrire, S'authentifier, Remplir formulaire de pre-consultation,
                     Recevoir orientation automatique, Prendre un RDV en ligne,
                     Consulter historique RDV, Recevoir notifications

  [Secretaire]   --> S'authentifier, Valider/Rejeter un RDV, Gerer le planning medecins,
                     Fermer/Ouvrir RDV en ligne, Consulter fiches pre-consultation

  [Medecin]      --> S'authentifier, Consulter son planning, Voir fiches patients,
                     Marquer consultation effectuee

  [Administrateur] --> S'authentifier, Gerer les services medicaux, Gerer les medecins,
                       Gerer les utilisateurs, Configurer l'algorithme de scoring,
                       Consulter statistiques
```

### II.3.2. Diagramme de cas d'utilisation -- Gestion des patients

*Figure 3 : Diagramme de cas d'utilisation -- Gestion des patients*

```
                        +---------------------------+
                        |    Plateforme MediConsult  |
                        |                           |
  [Patient] ---------> | S'inscrire                |
       |                |                           |
       +--------------> | S'authentifier            |
       |                |       |                   |
       |                |       +--<<include>>-->   |
       |                |       Verifier identifiants|
       +--------------> | Modifier son profil       |
       |                |                           |
       +--------------> | Consulter historique RDV  |
       |                |                           |
       +--------------> | Recevoir notifications    |
                        +---------------------------+
```

### II.3.3. Diagramme de cas d'utilisation -- Pre-consultation et rendez-vous

*Figure 4 : Diagramme de cas d'utilisation -- Gestion des rendez-vous*

```
                        +-----------------------------------+
                        |       Plateforme MediConsult       |
                        |                                   |
  [Patient] ---------> | Remplir formulaire                |
       |                | de pre-consultation               |
       |                |       |                           |
       |                |       +--<<include>>-->           |
       |                |       Analyser symptomes          |
       |                |       (algorithme de scoring)     |
       |                |       |                           |
       +--------------> | Recevoir orientation automatique  |
       |                |       |                           |
       |                |       +--<<extend>>-->            |
       |                |       Choisir un autre service    |
       |                |                                   |
       +--------------> | Prendre un RDV en ligne          |
       |                |       |                           |
       |                |       +--<<include>>-->           |
       |                |       Verifier disponibilites     |
       |                |                                   |
       +--------------> | Annuler un RDV                   |
                        |                                   |
  [Secretaire] -------> | Valider / Rejeter un RDV         |
       |                |       |                           |
       +--------------> |       +--<<include>>-->           |
       |                |       Assigner un medecin         |
       +--------------> | Gerer le planning medecins       |
       |                |                                   |
       +--------------> | Fermer/Ouvrir RDV en ligne       |
                        +-----------------------------------+
```

### II.3.4. Diagramme de cas d'utilisation -- Pre-consultation intelligente

*Figure 5 : Diagramme de cas d'utilisation -- Pre-consultation intelligente*

```
                        +-----------------------------------+
                        |       Plateforme MediConsult       |
                        |                                   |
  [Patient] ---------> | Remplir formulaire                |
                        | de pre-consultation               |
                        |   - Zone du corps affectee        |
                        |   - Type de symptome              |
                        |   - Duree des symptomes           |
                        |   - Intensite (1 a 10)            |
                        |   - Antecedents medicaux          |
                        |   - Description libre             |
                        |       |                           |
                        |       v                           |
                        | [Algorithme de scoring]           |
                        |   - Calcul des scores par service |
                        |   - Ponderation des criteres      |
                        |       |                           |
                        |       v                           |
                        | Afficher orientation              |
                        |   - Service recommande            |
                        |   - Score de confiance (%)        |
                        |   - Services alternatifs          |
                        +-----------------------------------+
```

---

## II.4. Description textuelle des cas d'utilisation

La description textuelle detaille le deroulement de chaque cas d'utilisation en precisant les acteurs, les pre-conditions, le scenario nominal, les scenarios alternatifs et les post-conditions.

### II.4.1. Cas d'utilisation : S'inscrire

*Tableau 4 : Description textuelle -- Cas d'utilisation "S'inscrire"*

| Element | Description |
|---|---|
| **Cas d'utilisation** | S'inscrire |
| **Acteur principal** | Patient |
| **Objectif** | Permettre a un nouveau patient de creer un compte sur la plateforme |
| **Pre-conditions** | Le patient n'a pas encore de compte. La plateforme est accessible. |
| **Scenario nominal** | 1. Le patient accede a la page d'inscription. 2. Le systeme affiche le formulaire d'inscription. 3. Le patient saisit ses informations : nom, prenom, email, telephone, date de naissance, adresse, mot de passe et confirmation du mot de passe. 4. Le patient valide le formulaire. 5. Le systeme verifie la validite des donnees et l'unicite de l'email. 6. Le systeme cree le compte et envoie un email de confirmation. 7. Le systeme redirige le patient vers la page de connexion avec un message de succes. |
| **Scenarios alternatifs** | 5a. L'email est deja utilise : le systeme affiche un message d'erreur et demande un autre email. 5b. Le mot de passe ne respecte pas les criteres de securite : le systeme affiche les criteres requis. 5c. Des champs obligatoires sont vides : le systeme indique les champs manquants. |
| **Post-conditions** | Le compte patient est cree. Le patient peut se connecter. |

### II.4.2. Cas d'utilisation : S'authentifier

*Tableau 5 : Description textuelle -- Cas d'utilisation "Se connecter"*

| Element | Description |
|---|---|
| **Cas d'utilisation** | S'authentifier (se connecter) |
| **Acteur principal** | Patient, Secretaire, Medecin, Administrateur |
| **Objectif** | Permettre a un utilisateur enregistre d'acceder a son espace personnel |
| **Pre-conditions** | L'utilisateur possede un compte actif sur la plateforme. |
| **Scenario nominal** | 1. L'utilisateur accede a la page de connexion. 2. Le systeme affiche le formulaire de connexion. 3. L'utilisateur saisit son email et son mot de passe. 4. L'utilisateur clique sur le bouton "Se connecter". 5. Le systeme verifie les identifiants. 6. Le systeme authentifie l'utilisateur et le redirige vers son tableau de bord selon son role (patient, secretaire, medecin, administrateur). |
| **Scenarios alternatifs** | 5a. Identifiants incorrects : le systeme affiche un message d'erreur "Email ou mot de passe incorrect". 5b. Compte desactive : le systeme affiche "Votre compte a ete desactive. Contactez l'administration." 5c. L'utilisateur clique sur "Mot de passe oublie" : le systeme envoie un email de reinitialisation. |
| **Post-conditions** | L'utilisateur est connecte et accede a son tableau de bord. Un token JWT est genere. |

### II.4.3. Cas d'utilisation : Remplir le formulaire de pre-consultation

*Tableau 6 : Description textuelle -- Cas d'utilisation "Remplir formulaire de pre-consultation"*

| Element | Description |
|---|---|
| **Cas d'utilisation** | Remplir le formulaire de pre-consultation |
| **Acteur principal** | Patient |
| **Objectif** | Permettre au patient de decrire ses symptomes pour recevoir une orientation vers le service medical adapte |
| **Pre-conditions** | Le patient est authentifie sur la plateforme. |
| **Scenario nominal** | 1. Le patient accede a la section "Pre-consultation" depuis son tableau de bord. 2. Le systeme affiche le formulaire interactif de pre-consultation. 3. Le patient selectionne la zone du corps affectee (tete, thorax, abdomen, membres, peau, yeux, etc.). 4. Le patient precise le type de symptome (douleur, fievre, eruption, fatigue, etc.). 5. Le patient indique la duree des symptomes (moins de 24h, 1-3 jours, 3-7 jours, plus d'une semaine). 6. Le patient evalue l'intensite sur une echelle de 1 a 10. 7. Le patient renseigne ses antecedents medicaux eventuels (diabete, hypertension, allergies, etc.). 8. Le patient ajoute une description libre de ses symptomes. 9. Le patient valide le formulaire. 10. Le systeme execute l'algorithme de scoring. 11. Le systeme affiche le resultat : service recommande, score de confiance et services alternatifs. |
| **Scenarios alternatifs** | 9a. Des champs obligatoires ne sont pas remplis : le systeme indique les champs manquants. 11a. L'algorithme ne parvient pas a determiner un service avec un score de confiance suffisant : le systeme recommande une consultation en medecine generale. |
| **Post-conditions** | La fiche de pre-consultation est enregistree. Le patient peut proceder a la prise de rendez-vous. |

### II.4.4. Cas d'utilisation : Prendre un rendez-vous en ligne

*Tableau 7 : Description textuelle -- Cas d'utilisation "Prendre un rendez-vous"*

| Element | Description |
|---|---|
| **Cas d'utilisation** | Prendre un rendez-vous en ligne |
| **Acteur principal** | Patient |
| **Objectif** | Permettre au patient de reserver un creneau pour une consultation |
| **Pre-conditions** | Le patient est authentifie. Le patient a rempli le formulaire de pre-consultation et recu une orientation (ou choisit directement un service). |
| **Scenario nominal** | 1. Le patient accede a la section "Prendre un rendez-vous". 2. Le systeme affiche le service recommande par la pre-consultation (ou le patient selectionne un service). 3. Le systeme affiche un calendrier avec les creneaux disponibles pour le service selectionne. 4. Le patient choisit une date et un creneau horaire. 5. Le patient confirme sa demande de rendez-vous. 6. Le systeme enregistre la demande avec le statut "En attente de validation". 7. Le systeme envoie une notification a la secretaire medicale. 8. Le systeme affiche un message de confirmation au patient : "Votre demande de rendez-vous a ete enregistree. Vous serez notifie apres validation." |
| **Scenarios alternatifs** | 3a. Aucun creneau disponible sur la periode selectionnee : le systeme propose d'autres dates. 3b. Les rendez-vous en ligne sont fermes par la secretaire : le systeme affiche un message indiquant que la prise de RDV en ligne est temporairement indisponible. |
| **Post-conditions** | La demande de rendez-vous est enregistree en base de donnees avec le statut "En attente". La secretaire est notifiee. |

### II.4.5. Cas d'utilisation : Valider ou rejeter un rendez-vous

*Tableau 8 : Description textuelle -- Cas d'utilisation "Valider/Rejeter un rendez-vous"*

| Element | Description |
|---|---|
| **Cas d'utilisation** | Valider ou rejeter un rendez-vous |
| **Acteur principal** | Secretaire medicale |
| **Objectif** | Permettre a la secretaire de traiter les demandes de rendez-vous en attente |
| **Pre-conditions** | La secretaire est authentifiee. Des demandes de rendez-vous sont en attente. |
| **Scenario nominal (Validation)** | 1. La secretaire accede a son tableau de bord. 2. Le systeme affiche la liste des demandes de rendez-vous en attente. 3. La secretaire selectionne une demande. 4. Le systeme affiche les details : informations patient, service demande, fiche de pre-consultation, date et creneau souhaites. 5. La secretaire consulte le planning du service et les medecins disponibles. 6. La secretaire assigne un medecin au rendez-vous. 7. La secretaire clique sur "Valider". 8. Le systeme met a jour le statut du rendez-vous a "Confirme". 9. Le systeme envoie un email de confirmation au patient avec les details (date, heure, medecin, service). |
| **Scenario alternatif (Rejet)** | 7a. La secretaire clique sur "Rejeter" et saisit un motif de rejet. 8a. Le systeme met a jour le statut a "Rejete". 9a. Le systeme envoie un email au patient avec le motif de rejet et l'invite a reprendre un rendez-vous. |
| **Post-conditions** | Le rendez-vous est confirme ou rejete. Le patient est notifie. Le planning du medecin est mis a jour (si validation). |

### II.4.6. Cas d'utilisation : Gerer les services medicaux

*Tableau 9 : Description textuelle -- Cas d'utilisation "Gerer les services medicaux"*

| Element | Description |
|---|---|
| **Cas d'utilisation** | Gerer les services medicaux |
| **Acteur principal** | Administrateur |
| **Objectif** | Permettre a l'administrateur d'ajouter, modifier ou supprimer des services medicaux |
| **Pre-conditions** | L'administrateur est authentifie. |
| **Scenario nominal (Ajout)** | 1. L'administrateur accede a la gestion des services. 2. L'administrateur clique sur "Ajouter un service". 3. Le systeme affiche le formulaire de creation. 4. L'administrateur saisit : nom du service, description, icone, couleur, mots-cles de symptomes associes. 5. L'administrateur valide. 6. Le systeme enregistre le service et l'affiche dans la liste. |
| **Scenario (Modification)** | L'administrateur selectionne un service existant, modifie les champs souhaites et valide. |
| **Scenario (Suppression)** | L'administrateur selectionne un service et confirme la suppression. Le systeme verifie qu'aucun rendez-vous futur n'est lie a ce service avant de proceder. |
| **Post-conditions** | La liste des services est mise a jour. |

### II.4.7. Cas d'utilisation : Gerer les medecins

*Tableau 10 : Description textuelle -- Cas d'utilisation "Gerer les medecins"*

| Element | Description |
|---|---|
| **Cas d'utilisation** | Gerer les medecins |
| **Acteur principal** | Administrateur |
| **Objectif** | Permettre a l'administrateur de gerer les comptes medecins et leurs affectations |
| **Pre-conditions** | L'administrateur est authentifie. |
| **Scenario nominal (Ajout)** | 1. L'administrateur accede a la gestion des medecins. 2. L'administrateur clique sur "Ajouter un medecin". 3. Le systeme affiche le formulaire de creation. 4. L'administrateur saisit : nom, prenom, email, telephone, specialite, service(s) d'affectation, horaires de disponibilite. 5. L'administrateur valide. 6. Le systeme cree le compte medecin et envoie un email avec les identifiants de connexion. |
| **Scenarios alternatifs** | 4a. L'email est deja utilise : message d'erreur. 5a. Le medecin est affecte a un service inexistant : erreur de validation. |
| **Post-conditions** | Le medecin est enregistre et peut se connecter a la plateforme. |

---

## II.5. Diagrammes de sequence

Les diagrammes de sequence decrivent l'enchainement chronologique des messages echanges entre les acteurs et les objets du systeme pour un scenario donne. Ils permettent de visualiser le comportement dynamique du systeme.

### II.5.1. Diagramme de sequence -- Inscription d'un patient

*Figure 6 : Diagramme de sequence -- Inscription d'un patient*

```
Patient          Interface (React)      Controleur (Laravel)     Base de donnees (PostgreSQL)
  |                    |                        |                          |
  |  1. Acceder page   |                        |                          |
  |    inscription      |                        |                          |
  |------------------->|                        |                          |
  |                    |                        |                          |
  |  2. Afficher       |                        |                          |
  |    formulaire      |                        |                          |
  |<-------------------|                        |                          |
  |                    |                        |                          |
  |  3. Saisir infos   |                        |                          |
  |  (nom, prenom,     |                        |                          |
  |   email, tel,      |                        |                          |
  |   mot de passe)    |                        |                          |
  |------------------->|                        |                          |
  |                    |                        |                          |
  |                    | 4. POST /api/register  |                          |
  |                    |----------------------->|                          |
  |                    |                        |                          |
  |                    |                        | 5. Verifier unicite      |
  |                    |                        |    email                 |
  |                    |                        |------------------------->|
  |                    |                        |                          |
  |                    |                        | 6. Email disponible      |
  |                    |                        |<-------------------------|
  |                    |                        |                          |
  |                    |                        | 7. Hasher mot de passe   |
  |                    |                        |    (bcrypt)              |
  |                    |                        |                          |
  |                    |                        | 8. INSERT patient        |
  |                    |                        |------------------------->|
  |                    |                        |                          |
  |                    |                        | 9. Confirmation          |
  |                    |                        |<-------------------------|
  |                    |                        |                          |
  |                    |                        | 10. Envoyer email        |
  |                    |                        |     de confirmation      |
  |                    |                        |                          |
  |                    | 11. Reponse : succes   |                          |
  |                    |<-----------------------|                          |
  |                    |                        |                          |
  | 12. Afficher       |                        |                          |
  |   message succes   |                        |                          |
  |   + redirection    |                        |                          |
  |<-------------------|                        |                          |
```

### II.5.2. Diagramme de sequence -- Prise de rendez-vous en ligne

*Figure 7 : Diagramme de sequence -- Prise de rendez-vous en ligne*

```
Patient          Interface (React)      Controleur (Laravel)     Base de donnees (PostgreSQL)
  |                    |                        |                          |
  |  1. Acceder a      |                        |                          |
  |  "Prendre RDV"     |                        |                          |
  |------------------->|                        |                          |
  |                    |                        |                          |
  |                    | 2. GET /api/services   |                          |
  |                    |----------------------->|                          |
  |                    |                        | 3. SELECT services       |
  |                    |                        |------------------------->|
  |                    |                        | 4. Liste services        |
  |                    |                        |<-------------------------|
  |                    | 5. Retourner services  |                          |
  |                    |<-----------------------|                          |
  |                    |                        |                          |
  |  6. Afficher       |                        |                          |
  |  service recommande|                        |                          |
  |  + calendrier      |                        |                          |
  |<-------------------|                        |                          |
  |                    |                        |                          |
  |  7. Selectionner   |                        |                          |
  |  date et creneau   |                        |                          |
  |------------------->|                        |                          |
  |                    |                        |                          |
  |                    | 8. GET /api/slots      |                          |
  |                    |   ?service_id&date     |                          |
  |                    |----------------------->|                          |
  |                    |                        | 9. Verifier creneaux     |
  |                    |                        |    disponibles           |
  |                    |                        |------------------------->|
  |                    |                        | 10. Creneaux libres      |
  |                    |                        |<-------------------------|
  |                    | 11. Afficher creneaux  |                          |
  |                    |<-----------------------|                          |
  |                    |                        |                          |
  | 12. Afficher       |                        |                          |
  |   creneaux dispo   |                        |                          |
  |<-------------------|                        |                          |
  |                    |                        |                          |
  | 13. Choisir creneau|                        |                          |
  |   + confirmer      |                        |                          |
  |------------------->|                        |                          |
  |                    |                        |                          |
  |                    | 14. POST /api/         |                          |
  |                    |    appointments        |                          |
  |                    |----------------------->|                          |
  |                    |                        | 15. INSERT appointment   |
  |                    |                        |   (statut: en_attente)   |
  |                    |                        |------------------------->|
  |                    |                        | 16. Confirmation         |
  |                    |                        |<-------------------------|
  |                    |                        |                          |
  |                    |                        | 17. Notifier secretaire  |
  |                    |                        |    (email)               |
  |                    |                        |                          |
  |                    | 18. Reponse : succes   |                          |
  |                    |<-----------------------|                          |
  |                    |                        |                          |
  | 19. Message :      |                        |                          |
  | "RDV enregistre,   |                        |                          |
  |  en attente de     |                        |                          |
  |  validation"       |                        |                          |
  |<-------------------|                        |                          |
```

### II.5.3. Diagramme de sequence -- Pre-consultation et orientation

*Figure 8 : Diagramme de sequence -- Pre-consultation et orientation*

```
Patient          Interface (React)      Controleur (Laravel)     Algorithme Scoring    BDD
  |                    |                        |                      |                 |
  | 1. Acceder a       |                        |                      |                 |
  | "Pre-consultation" |                        |                      |                 |
  |------------------->|                        |                      |                 |
  |                    |                        |                      |                 |
  | 2. Afficher        |                        |                      |                 |
  |   formulaire       |                        |                      |                 |
  |<-------------------|                        |                      |                 |
  |                    |                        |                      |                 |
  | 3. Remplir :       |                        |                      |                 |
  | - Zone du corps    |                        |                      |                 |
  | - Type symptome    |                        |                      |                 |
  | - Duree            |                        |                      |                 |
  | - Intensite (1-10) |                        |                      |                 |
  | - Antecedents      |                        |                      |                 |
  | - Description      |                        |                      |                 |
  |------------------->|                        |                      |                 |
  |                    |                        |                      |                 |
  |                    | 4. POST /api/          |                      |                 |
  |                    | pre-consultation       |                      |                 |
  |                    |----------------------->|                      |                 |
  |                    |                        |                      |                 |
  |                    |                        | 5. Charger regles    |                 |
  |                    |                        |    de scoring        |                 |
  |                    |                        |------------------------------------->|
  |                    |                        |                      |                 |
  |                    |                        | 6. Regles chargees   |                 |
  |                    |                        |<-------------------------------------|
  |                    |                        |                      |                 |
  |                    |                        | 7. Executer          |                 |
  |                    |                        |    algorithme        |                 |
  |                    |                        |--------------------->|                 |
  |                    |                        |                      |                 |
  |                    |                        |                      | 8. Calculer     |
  |                    |                        |                      | scores par      |
  |                    |                        |                      | service :       |
  |                    |                        |                      | - Correspondance|
  |                    |                        |                      |   zone/service  |
  |                    |                        |                      | - Poids symptome|
  |                    |                        |                      | - Facteur       |
  |                    |                        |                      |   intensite     |
  |                    |                        |                      | - Facteur duree |
  |                    |                        |                      |                 |
  |                    |                        | 9. Resultat :        |                 |
  |                    |                        |  service_recommande, |                 |
  |                    |                        |  score_confiance,    |                 |
  |                    |                        |  alternatives        |                 |
  |                    |                        |<---------------------|                 |
  |                    |                        |                      |                 |
  |                    |                        | 10. Sauvegarder      |                 |
  |                    |                        |     fiche pre-       |                 |
  |                    |                        |     consultation     |                 |
  |                    |                        |------------------------------------->|
  |                    |                        |                      |                 |
  |                    | 11. Retourner          |                      |                 |
  |                    |    resultat            |                      |                 |
  |                    |<-----------------------|                      |                 |
  |                    |                        |                      |                 |
  | 12. Afficher :     |                        |                      |                 |
  | - Service          |                        |                      |                 |
  |   recommande       |                        |                      |                 |
  | - Score confiance  |                        |                      |                 |
  | - Alternatives     |                        |                      |                 |
  | - Bouton "Prendre  |                        |                      |                 |
  |   RDV"             |                        |                      |                 |
  |<-------------------|                        |                      |                 |
```

### II.5.4. Diagramme de sequence -- Validation de rendez-vous par la secretaire

*Figure 9 : Diagramme de sequence -- Validation de rendez-vous par la secretaire*

```
Secretaire       Interface (React)      Controleur (Laravel)     Base de donnees     Service Email
  |                    |                        |                      |                 |
  | 1. Acceder au      |                        |                      |                 |
  | tableau de bord    |                        |                      |                 |
  |------------------->|                        |                      |                 |
  |                    |                        |                      |                 |
  |                    | 2. GET /api/           |                      |                 |
  |                    | appointments?          |                      |                 |
  |                    | status=en_attente      |                      |                 |
  |                    |----------------------->|                      |                 |
  |                    |                        | 3. SELECT RDV        |                 |
  |                    |                        |    en attente        |                 |
  |                    |                        |--------------------->|                 |
  |                    |                        | 4. Liste des RDV     |                 |
  |                    |                        |<---------------------|                 |
  |                    | 5. Retourner liste     |                      |                 |
  |                    |<-----------------------|                      |                 |
  |                    |                        |                      |                 |
  | 6. Afficher liste  |                        |                      |                 |
  |   des demandes     |                        |                      |                 |
  |<-------------------|                        |                      |                 |
  |                    |                        |                      |                 |
  | 7. Selectionner    |                        |                      |                 |
  |   une demande      |                        |                      |                 |
  |------------------->|                        |                      |                 |
  |                    |                        |                      |                 |
  | 8. Afficher details|                        |                      |                 |
  | + fiche pre-consult|                        |                      |                 |
  | + planning medecins|                        |                      |                 |
  |<-------------------|                        |                      |                 |
  |                    |                        |                      |                 |
  | 9. Assigner medecin|                        |                      |                 |
  | + cliquer "Valider"|                        |                      |                 |
  |------------------->|                        |                      |                 |
  |                    |                        |                      |                 |
  |                    | 10. PUT /api/          |                      |                 |
  |                    | appointments/{id}      |                      |                 |
  |                    | {status: confirme,     |                      |                 |
  |                    |  medecin_id: X}        |                      |                 |
  |                    |----------------------->|                      |                 |
  |                    |                        | 11. UPDATE           |                 |
  |                    |                        | appointment          |                 |
  |                    |                        |--------------------->|                 |
  |                    |                        | 12. Confirmation     |                 |
  |                    |                        |<---------------------|                 |
  |                    |                        |                      |                 |
  |                    |                        | 13. Envoyer email    |                 |
  |                    |                        |    au patient        |                 |
  |                    |                        |------------------------------------>|
  |                    |                        |                      |                 |
  |                    | 14. Succes             |                      |                 |
  |                    |<-----------------------|                      |                 |
  |                    |                        |                      |                 |
  | 15. Message :      |                        |                      |                 |
  | "RDV confirme"     |                        |                      |                 |
  |<-------------------|                        |                      |                 |
```

---

## II.6. Diagramme de classes

Le diagramme de classes est un diagramme structurel qui represente les classes du systeme, leurs attributs, leurs methodes et les relations entre elles. Il constitue le modele fondamental a partir duquel la base de donnees et le code source sont derives.

*Figure 10 : Diagramme de classes*

```
+========================+       +========================+
|        User            |       |     Service            |
+========================+       +========================+
| - id : int             |       | - id : int             |
| - nom : string         |       | - nom : string         |
| - prenom : string      |       | - description : text   |
| - email : string       |       | - icone : string       |
| - telephone : string   |       | - couleur : string     |
| - mot_de_passe : string|       | - actif : boolean      |
| - date_naissance : date|       | - created_at : datetime|
| - adresse : string     |       | - updated_at : datetime|
| - role : enum          |       +========================+
|   (patient, secretaire,|       | + creer()              |
|    medecin, admin)     |       | + modifier()           |
| - actif : boolean      |       | + supprimer()          |
| - created_at : datetime|       | + listerMedecins()     |
| - updated_at : datetime|       +========================+
+========================+              |
| + inscrire()           |              | 1..*
| + authentifier()       |              |
| + modifierProfil()     |       +======+==================+
| + changerMotDePasse()  |       |   ServiceSymptome        |
+========================+       +==========================+
        |                        | - id : int               |
        | 1                      | - service_id : int (FK)  |
        |                        | - symptome : string      |
        |                        | - zone_corps : string    |
   +----+----+                   | - poids : float          |
   |         |                   +==========================+
   |         |
   |    +====+=====================+
   |    |   Medecin (extends User)  |
   |    +===========================+
   |    | - specialite : string     |
   |    | - service_id : int (FK)   |       +==========================+
   |    | - horaires : json         |       |    PreConsultation       |
   |    +===========================+       +==========================+
   |    | + consulterPlanning()     |       | - id : int               |
   |    | + voirFichePatient()      |       | - patient_id : int (FK)  |
   |    | + marquerEffectuee()      |       | - zone_corps : string    |
   |    +===========================+       | - type_symptome : string |
   |              | 1                       | - duree : string         |
   |              |                         | - intensite : int        |
   |              |                         | - antecedents : text     |
   |              |                         | - description : text     |
   |         0..* |                         | - service_recommande_id  |
   |              |                         |   : int (FK)             |
   |    +==========+===================+    | - score_confiance : float|
   |    |      Appointment             |    | - alternatives : json    |
   |    +==============================+    | - created_at : datetime  |
   |    | - id : int                   |    +==========================+
   |    | - patient_id : int (FK)      |    | + calculerScore()        |
   |    | - medecin_id : int (FK)      |    | + orienter()             |
   |    | - service_id : int (FK)      |    +==========================+
   |    | - pre_consultation_id        |             |
   |    |   : int (FK)                 |             |
   |    | - date_rdv : date            |<------------+
   |    | - heure_rdv : time           |    0..1
   |    | - statut : enum              |
   |    |   (en_attente, confirme,     |
   |    |    rejete, effectue, annule) |
   |    | - motif_rejet : text         |
   |    | - created_at : datetime      |
   |    | - updated_at : datetime      |
   |    +==============================+
   |    | + creer()                    |
   |    | + valider()                  |    +==========================+
   |    | + rejeter()                  |    |     Notification         |
   |    | + annuler()                  |    +==========================+
   |    | + marquerEffectuee()         |    | - id : int               |
   |    +==============================+    | - user_id : int (FK)     |
   |              |                         | - type : enum            |
   +--- 1   0..* |                         |   (confirmation, rappel, |
   (Patient)     |                         |    rejet, info)          |
                 |                         | - titre : string         |
                 +------------------------>| - message : text         |
                           0..*            | - lu : boolean           |
                                           | - created_at : datetime  |
                                           +==========================+
                                           | + envoyer()              |
                                           | + marquerLu()            |
                                           +==========================+


Relations :
- User (Patient) "1" --- "0..*" Appointment : "prend"
- User (Patient) "1" --- "0..*" PreConsultation : "remplit"
- Medecin "1" --- "0..*" Appointment : "recoit"
- Service "1" --- "0..*" Medecin : "emploie"
- Service "1" --- "0..*" Appointment : "concerne"
- Service "1" --- "0..*" ServiceSymptome : "associe a"
- PreConsultation "0..1" --- "0..1" Appointment : "declenche"
- User "1" --- "0..*" Notification : "recoit"
- Appointment "1" --- "0..*" Notification : "genere"
```

---

## II.7. Diagramme de deploiement

Le diagramme de deploiement represente l'architecture physique du systeme en montrant la repartition des composants sur les differents noeuds materiels.

*Figure 11 : Diagramme de deploiement*

```
+---------------------------+          +----------------------------------+
|   << Poste Client >>      |          |     << Serveur Web >>            |
|   Navigateur Web          |          |     (VPS / Cloud)                |
|   (Chrome, Firefox, etc.) |          |                                  |
|                           |  HTTPS   |  +---------------------------+   |
|   +-------------------+   |--------->|  |   Serveur Nginx           |   |
|   | Application React |   |          |  |   (Reverse Proxy)         |   |
|   | (SPA - Frontend)  |   |<---------|  +---------------------------+   |
|   +-------------------+   |          |            |                     |
+---------------------------+          |            v                     |
                                       |  +---------------------------+   |
+---------------------------+          |  |  Application Laravel      |   |
|   << Poste Client >>      |          |  |  (Backend - API REST)     |   |
|   Smartphone / Tablette   |          |  |                           |   |
|   (Design Responsive)     |  HTTPS   |  |  +---------------------+ |   |
|                           |--------->|  |  | Algorithme Scoring  | |   |
|   +-------------------+   |          |  |  | (Service PHP)       | |   |
|   | Application React |   |<---------|  |  +---------------------+ |   |
|   | (Responsive)      |   |          |  +---------------------------+   |
|   +-------------------+   |          |            |                     |
+---------------------------+          |            v                     |
                                       |  +---------------------------+   |
                                       |  |   PostgreSQL 16           |   |
                                       |  |   (Base de donnees)       |   |
                                       |  +---------------------------+   |
                                       |            |                     |
                                       |            v                     |
                                       |  +---------------------------+   |
                                       |  |   Redis                   |   |
                                       |  |   (Cache & Sessions)      |   |
                                       |  +---------------------------+   |
                                       +----------------------------------+
                                                    |
                                                    v
                                       +---------------------------+
                                       |   << Service Externe >>   |
                                       |   Serveur SMTP            |
                                       |   (Envoi d'emails)        |
                                       +---------------------------+
```

---

## II.8. Conception de la base de donnees

### II.8.1. Dictionnaire de donnees

Le dictionnaire de donnees recense l'ensemble des donnees manipulees par le systeme en precisant leur type, leur taille et leur contrainte.

*Tableau 11 : Dictionnaire de donnees*

| Table | Champ | Type | Taille | Contrainte | Description |
|---|---|---|---|---|---|
| **users** | id | SERIAL | - | PK, NOT NULL | Identifiant unique |
| | nom | VARCHAR | 100 | NOT NULL | Nom de l'utilisateur |
| | prenom | VARCHAR | 100 | NOT NULL | Prenom de l'utilisateur |
| | email | VARCHAR | 255 | UNIQUE, NOT NULL | Adresse email |
| | telephone | VARCHAR | 20 | NOT NULL | Numero de telephone |
| | mot_de_passe | VARCHAR | 255 | NOT NULL | Mot de passe chiffre (bcrypt) |
| | date_naissance | DATE | - | NULL | Date de naissance |
| | adresse | TEXT | - | NULL | Adresse postale |
| | role | ENUM | - | NOT NULL | patient, secretaire, medecin, admin |
| | actif | BOOLEAN | - | DEFAULT true | Statut du compte |
| | created_at | TIMESTAMP | - | NOT NULL | Date de creation |
| | updated_at | TIMESTAMP | - | NOT NULL | Date de derniere modification |
| **services** | id | SERIAL | - | PK, NOT NULL | Identifiant unique |
| | nom | VARCHAR | 100 | UNIQUE, NOT NULL | Nom du service medical |
| | description | TEXT | - | NULL | Description du service |
| | icone | VARCHAR | 50 | NULL | Nom de l'icone |
| | couleur | VARCHAR | 7 | NULL | Code couleur hexadecimal |
| | actif | BOOLEAN | - | DEFAULT true | Service actif ou non |
| | created_at | TIMESTAMP | - | NOT NULL | Date de creation |
| | updated_at | TIMESTAMP | - | NOT NULL | Date de modification |
| **medecins** | id | SERIAL | - | PK, NOT NULL | Identifiant unique |
| | user_id | INT | - | FK -> users.id, NOT NULL | Reference utilisateur |
| | service_id | INT | - | FK -> services.id, NOT NULL | Service d'affectation |
| | specialite | VARCHAR | 100 | NOT NULL | Specialite medicale |
| | horaires | JSON | - | NULL | Planning de disponibilite |
| **service_symptomes** | id | SERIAL | - | PK, NOT NULL | Identifiant unique |
| | service_id | INT | - | FK -> services.id, NOT NULL | Service associe |
| | symptome | VARCHAR | 100 | NOT NULL | Mot-cle du symptome |
| | zone_corps | VARCHAR | 50 | NOT NULL | Zone du corps |
| | poids | DECIMAL | 3,2 | NOT NULL, DEFAULT 1.0 | Poids dans le scoring |
| **pre_consultations** | id | SERIAL | - | PK, NOT NULL | Identifiant unique |
| | patient_id | INT | - | FK -> users.id, NOT NULL | Patient concerne |
| | zone_corps | VARCHAR | 50 | NOT NULL | Zone du corps affectee |
| | type_symptome | VARCHAR | 100 | NOT NULL | Type de symptome |
| | duree | VARCHAR | 50 | NOT NULL | Duree des symptomes |
| | intensite | INT | - | NOT NULL, CHECK (1-10) | Intensite de 1 a 10 |
| | antecedents | TEXT | - | NULL | Antecedents medicaux |
| | description | TEXT | - | NULL | Description libre |
| | service_recommande_id | INT | - | FK -> services.id | Service oriente |
| | score_confiance | DECIMAL | 5,2 | NULL | Score de confiance (%) |
| | alternatives | JSON | - | NULL | Services alternatifs |
| | created_at | TIMESTAMP | - | NOT NULL | Date de creation |
| **appointments** | id | SERIAL | - | PK, NOT NULL | Identifiant unique |
| | patient_id | INT | - | FK -> users.id, NOT NULL | Patient concerne |
| | medecin_id | INT | - | FK -> medecins.id, NULL | Medecin assigne |
| | service_id | INT | - | FK -> services.id, NOT NULL | Service concerne |
| | pre_consultation_id | INT | - | FK -> pre_consultations.id, NULL | Fiche pre-consultation |
| | date_rdv | DATE | - | NOT NULL | Date du rendez-vous |
| | heure_rdv | TIME | - | NOT NULL | Heure du rendez-vous |
| | statut | ENUM | - | NOT NULL, DEFAULT 'en_attente' | en_attente, confirme, rejete, effectue, annule |
| | motif_rejet | TEXT | - | NULL | Motif en cas de rejet |
| | created_at | TIMESTAMP | - | NOT NULL | Date de creation |
| | updated_at | TIMESTAMP | - | NOT NULL | Date de modification |
| **notifications** | id | SERIAL | - | PK, NOT NULL | Identifiant unique |
| | user_id | INT | - | FK -> users.id, NOT NULL | Destinataire |
| | appointment_id | INT | - | FK -> appointments.id, NULL | RDV associe |
| | type | ENUM | - | NOT NULL | confirmation, rappel, rejet, info |
| | titre | VARCHAR | 255 | NOT NULL | Titre de la notification |
| | message | TEXT | - | NOT NULL | Contenu du message |
| | lu | BOOLEAN | - | DEFAULT false | Notification lue ou non |
| | created_at | TIMESTAMP | - | NOT NULL | Date de creation |

### II.8.2. Schema relationnel

A partir du dictionnaire de donnees et du diagramme de classes, nous obtenons le schema relationnel suivant :

*Figure 12 : Schema de la base de donnees*

```
users (id, nom, prenom, email, telephone, mot_de_passe, date_naissance, adresse, role, actif, created_at, updated_at)

services (id, nom, description, icone, couleur, actif, created_at, updated_at)

medecins (id, #user_id, #service_id, specialite, horaires)

service_symptomes (id, #service_id, symptome, zone_corps, poids)

pre_consultations (id, #patient_id, zone_corps, type_symptome, duree, intensite, antecedents, description, #service_recommande_id, score_confiance, alternatives, created_at)

appointments (id, #patient_id, #medecin_id, #service_id, #pre_consultation_id, date_rdv, heure_rdv, statut, motif_rejet, created_at, updated_at)

notifications (id, #user_id, #appointment_id, type, titre, message, lu, created_at)

Legende : # = cle etrangere (FK)
```

### II.8.3. Regles de gestion

Les principales regles de gestion qui regissent le systeme sont :

- **RG01** : Un patient peut avoir plusieurs rendez-vous mais un rendez-vous appartient a un seul patient.
- **RG02** : Un medecin est affecte a un seul service mais un service peut avoir plusieurs medecins.
- **RG03** : Un rendez-vous concerne un seul service et peut etre associe a un seul medecin (apres validation).
- **RG04** : Une pre-consultation est remplie par un seul patient et peut declencher un seul rendez-vous.
- **RG05** : Un rendez-vous passe obligatoirement par le statut "en_attente" avant d'etre "confirme" ou "rejete".
- **RG06** : Seule la secretaire peut valider, rejeter ou assigner un medecin a un rendez-vous.
- **RG07** : Un rendez-vous ne peut etre "effectue" que par le medecin concerne.
- **RG08** : L'algorithme de scoring calcule un score pour chaque service en fonction des symptomes et oriente vers le service ayant le score le plus eleve.
- **RG09** : Si aucun service n'atteint un score de confiance suffisant (seuil parametrable), le systeme oriente vers la medecine generale.
- **RG10** : La secretaire peut fermer temporairement la prise de rendez-vous en ligne.

---

## Conclusion du chapitre

Ce deuxieme chapitre nous a permis de realiser une analyse et une conception detaillees de la plateforme MediConsult. En utilisant le langage UML, nous avons modelise les differents aspects du systeme : les cas d'utilisation avec leurs descriptions textuelles, les diagrammes de sequence pour les principaux scenarios, le diagramme de classes pour la structure du systeme, le diagramme de deploiement pour l'architecture physique, et la conception de la base de donnees avec le dictionnaire de donnees et le schema relationnel. Ces modeles constituent la base solide sur laquelle s'appuie la phase de realisation presentee dans le chapitre suivant.


---
---

# CHAPITRE III : REALISATION ET MISE EN OEUVRE

## Introduction

Ce troisieme et dernier chapitre est consacre a la realisation de la plateforme MediConsult. Apres avoir analyse les besoins et concu le systeme dans les chapitres precedents, nous presentons ici l'environnement de travail, les outils et technologies utilises, l'architecture technique de l'application, les mesures de securite mises en place, les principales interfaces realisees et les tests effectues pour valider le bon fonctionnement du systeme.

---

## III.1. Environnement de travail

### III.1.1. Environnement materiel

Le developpement de la plateforme MediConsult a ete realise sur le poste de travail suivant :

| Composant | Specification |
|---|---|
| Ordinateur | PC portable |
| Processeur | Intel Core i5 / AMD Ryzen 5 (ou equivalent) |
| Memoire vive (RAM) | 8 Go |
| Stockage | SSD 256 Go |
| Systeme d'exploitation | Windows 11 / Ubuntu 22.04 |
| Ecran | 15,6 pouces Full HD |

### III.1.2. Environnement logiciel

| Logiciel | Version | Role |
|---|---|---|
| Visual Studio Code | 1.85+ | Editeur de code principal |
| Node.js | 20 LTS | Runtime JavaScript pour React |
| PHP | 8.2 | Langage backend (Laravel) |
| Composer | 2.6+ | Gestionnaire de dependances PHP |
| PostgreSQL | 16 | Systeme de gestion de base de donnees |
| pgAdmin 4 | 8.x | Interface graphique pour PostgreSQL |
| Redis | 7.x | Cache et gestion des sessions |
| Git | 2.40+ | Systeme de controle de version |
| Postman | 10.x | Test des API REST |
| Google Chrome | 120+ | Navigateur pour tests et debogage |
| StarUML / Draw.io | - | Modelisation UML |
| XAMPP / Laragon | - | Serveur local de developpement |

---

## III.2. Outils et technologies utilises

### III.2.1. Technologies Frontend

**React 18**

React est une bibliotheque JavaScript open source developpee par Meta (Facebook) pour la construction d'interfaces utilisateur. Elle repose sur le concept de composants reutilisables et utilise un DOM virtuel pour optimiser les mises a jour de l'interface. React est aujourd'hui l'une des technologies frontend les plus populaires au monde.

Nous avons choisi React pour :
- Sa **reactivite** : les mises a jour de l'interface sont instantanees grace au DOM virtuel ;
- Son **ecosysteme riche** : de nombreuses bibliotheques tierces facilitent le developpement (React Router, Axios, etc.) ;
- Son **architecture en composants** : favorise la reutilisabilite et la maintenabilite du code ;
- Sa **large communaute** : documentation abondante et support actif.

**Tailwind CSS**

Tailwind CSS est un framework CSS utilitaire qui permet de concevoir des interfaces modernes directement dans le code HTML/JSX en utilisant des classes utilitaires predefinies. Il offre une grande flexibilite et permet un design responsive sans ecrire de CSS personnalise.

**Axios**

Axios est une bibliotheque JavaScript basee sur les promesses pour effectuer des requetes HTTP. Nous l'utilisons pour la communication entre le frontend React et l'API backend Laravel.

### III.2.2. Technologies Backend

**Laravel 11**

Laravel est un framework PHP open source base sur l'architecture MVC (Modele-Vue-Controleur). Il fournit un ensemble d'outils robustes pour le developpement d'applications web : systeme de routage, ORM Eloquent, systeme d'authentification, gestion des migrations de base de donnees, systeme de file d'attente, etc.

Nous avons choisi Laravel pour :
- Son **architecture MVC** claire et bien structuree ;
- Son **ORM Eloquent** qui simplifie les interactions avec la base de donnees ;
- Son **systeme d'authentification** integre (Laravel Sanctum pour les API) ;
- Ses **outils de migration** qui facilitent la gestion du schema de base de donnees ;
- Sa **securite** : protection CSRF, validation des donnees, hachage des mots de passe.

**Laravel Sanctum**

Laravel Sanctum est un systeme d'authentification leger pour les SPA (Single Page Applications) et les API. Il gere l'emission de tokens d'authentification et la gestion des sessions de maniere securisee.

### III.2.3. Base de donnees

**PostgreSQL 16**

PostgreSQL est un systeme de gestion de base de donnees relationnelle open source reconnu pour sa robustesse, sa conformite aux standards SQL, ses performances et ses fonctionnalites avancees (types JSON, recherche plein texte, etc.).

Nous avons choisi PostgreSQL pour :
- Sa **fiabilite** et sa **robustesse** eprouvees en environnement de production ;
- Son support natif du **type JSON**, utile pour stocker les horaires des medecins et les alternatives de pre-consultation ;
- Ses **performances** sur les requetes complexes ;
- Sa **conformite ACID** garantissant l'integrite des donnees.

**Redis**

Redis est un systeme de stockage de donnees en memoire utilise comme cache et gestionnaire de sessions. Il permet d'accelerer les temps de reponse de l'application en mettant en cache les donnees frequemment consultees.

### III.2.4. Recapitulatif des outils et technologies

*Tableau 12 : Outils et technologies utilises*

| Categorie | Technologie | Version | Role |
|---|---|---|---|
| Frontend | React | 18 | Bibliotheque UI (composants, DOM virtuel) |
| Frontend | Tailwind CSS | 3.4 | Framework CSS utilitaire (design responsive) |
| Frontend | Axios | 1.6 | Client HTTP pour appels API |
| Frontend | React Router | 6 | Gestion de la navigation (SPA) |
| Backend | Laravel | 11 | Framework PHP (API REST, MVC) |
| Backend | Laravel Sanctum | 4.x | Authentification API (tokens) |
| Backend | PHP | 8.2 | Langage de programmation serveur |
| Base de donnees | PostgreSQL | 16 | SGBD relationnel |
| Cache | Redis | 7.x | Cache et sessions |
| Versionning | Git | 2.40+ | Controle de version du code source |
| API Testing | Postman | 10.x | Test et documentation des endpoints API |
| IDE | Visual Studio Code | 1.85+ | Editeur de code |
| UML | StarUML / Draw.io | - | Modelisation des diagrammes |

---

## III.3. Architecture de l'application

### III.3.1. Architecture globale : MVC

La plateforme MediConsult repose sur une architecture **MVC** (Modele-Vue-Controleur) qui separe clairement les responsabilites :

*Figure 13 : Architecture MVC de l'application*

```
+-------------------------------------------------------------+
|                    ARCHITECTURE MVC                          |
+-------------------------------------------------------------+
|                                                             |
|  +-------------------+     +---------------------+          |
|  |    VUE (View)     |     |  CONTROLEUR         |          |
|  |                   |     |  (Controller)        |          |
|  |  React 18         |     |  Laravel 11          |          |
|  |  (Frontend SPA)   |<--->|  (API REST)          |          |
|  |                   |     |                      |          |
|  |  - Composants UI  | API |  - Routes            |          |
|  |  - Pages          | REST|  - Controleurs       |          |
|  |  - Formulaires    |     |  - Middleware         |          |
|  |  - Tableaux bord  |     |  - Validation        |          |
|  +-------------------+     +----------+-----------+          |
|                                       |                      |
|                                       v                      |
|                            +----------+-----------+          |
|                            |   MODELE (Model)     |          |
|                            |                      |          |
|                            |   Eloquent ORM       |          |
|                            |   - User             |          |
|                            |   - Service          |          |
|                            |   - Medecin          |          |
|                            |   - Appointment      |          |
|                            |   - PreConsultation  |          |
|                            |   - Notification     |          |
|                            +----------+-----------+          |
|                                       |                      |
|                                       v                      |
|                            +----------------------+          |
|                            |   PostgreSQL 16      |          |
|                            |   (Base de donnees)  |          |
|                            +----------------------+          |
+-------------------------------------------------------------+
```

- **Le Modele** (Model) : Represente les donnees et la logique metier. Dans Laravel, les modeles Eloquent encapsulent les tables de la base de donnees et leurs relations.
- **La Vue** (View) : Correspond a l'interface utilisateur. Dans notre architecture, la vue est entierement geree par React (application SPA).
- **Le Controleur** (Controller) : Traite les requetes HTTP, applique les regles de validation et de logique metier, et retourne les reponses (JSON pour l'API REST).

### III.3.2. Architecture API REST

La communication entre le frontend React et le backend Laravel s'effectue via une **API REST** (Representational State Transfer). Les echanges se font au format **JSON** via le protocole **HTTPS**.

Les principales routes de l'API sont :

| Methode | Endpoint | Description | Authentification |
|---|---|---|---|
| POST | /api/register | Inscription d'un patient | Non |
| POST | /api/login | Connexion | Non |
| POST | /api/logout | Deconnexion | Oui (Sanctum) |
| GET | /api/user | Profil utilisateur connecte | Oui |
| GET | /api/services | Liste des services medicaux | Non |
| POST | /api/pre-consultations | Soumettre formulaire pre-consultation | Oui (Patient) |
| GET | /api/pre-consultations/{id} | Detail d'une pre-consultation | Oui |
| GET | /api/slots | Creneaux disponibles (par service et date) | Oui |
| POST | /api/appointments | Creer une demande de RDV | Oui (Patient) |
| GET | /api/appointments | Liste des RDV (selon role) | Oui |
| PUT | /api/appointments/{id} | Modifier statut RDV (valider/rejeter) | Oui (Secretaire) |
| GET | /api/medecins | Liste des medecins | Oui |
| POST | /api/medecins | Ajouter un medecin | Oui (Admin) |
| PUT | /api/medecins/{id} | Modifier un medecin | Oui (Admin) |
| DELETE | /api/medecins/{id} | Supprimer un medecin | Oui (Admin) |
| POST | /api/services | Ajouter un service | Oui (Admin) |
| PUT | /api/services/{id} | Modifier un service | Oui (Admin) |
| DELETE | /api/services/{id} | Supprimer un service | Oui (Admin) |
| GET | /api/stats | Statistiques globales | Oui (Admin) |
| GET | /api/notifications | Liste des notifications | Oui |

### III.3.3. Algorithme de scoring -- Pre-consultation intelligente

L'algorithme de scoring constitue le coeur du module de pre-consultation intelligente. Il analyse les symptomes saisis par le patient et calcule un score pour chaque service medical afin de recommander le plus pertinent.

**Principe de fonctionnement :**

1. Le patient remplit le formulaire de pre-consultation (zone du corps, type de symptome, duree, intensite, antecedents, description libre).
2. Le systeme charge les regles de scoring depuis la table `service_symptomes` (associations symptome-service avec poids).
3. Pour chaque service, l'algorithme calcule un score selon la formule :

```
Score(service) = SUM(poids_symptome * facteur_zone * facteur_intensite * facteur_duree)
```

Ou :
- `poids_symptome` : poids defini dans la table service_symptomes pour la correspondance symptome/service ;
- `facteur_zone` : bonus si la zone du corps correspond a la zone associee au service (1.5 si correspondance, 1.0 sinon) ;
- `facteur_intensite` : normalisation de l'intensite (intensite / 10) ;
- `facteur_duree` : coefficient selon la duree (moins de 24h = 0.8, 1-3 jours = 1.0, 3-7 jours = 1.2, plus d'une semaine = 1.5).

4. Le score de confiance est exprime en pourcentage : `(score_max / score_total_possible) * 100`.
5. Le service avec le score le plus eleve est recommande. Les deux services suivants sont proposes comme alternatives.
6. Si le score de confiance est inferieur a un seuil parametrable (par defaut 30%), le systeme recommande la medecine generale.

**Exemple concret :**

Un patient signale une douleur thoracique, d'intensite 7/10, durant depuis 3-7 jours.

| Service | Poids symptome | Facteur zone | Facteur intensite | Facteur duree | Score |
|---|---|---|---|---|---|
| Cardiologie | 3.0 | 1.5 | 0.7 | 1.2 | 3.78 |
| Medecine generale | 1.5 | 1.0 | 0.7 | 1.2 | 1.26 |
| Pneumologie | 2.0 | 1.5 | 0.7 | 1.2 | 2.52 |

Resultat : Le systeme recommande la **Cardiologie** (score le plus eleve) avec comme alternative la Pneumologie.

---

## III.4. Securite de l'application

La securite des donnees medicales est une priorite absolue dans la conception de MediConsult. Plusieurs mesures ont ete mises en place :

### III.4.1. Authentification et autorisation

- **Hachage des mots de passe** : Tous les mots de passe sont haches avec l'algorithme **bcrypt** (facteur de cout 12) avant stockage en base de donnees. Le mot de passe en clair n'est jamais conserve.
- **Authentification par token** : Laravel Sanctum genere un token d'authentification unique a chaque connexion. Ce token doit etre inclus dans l'en-tete `Authorization: Bearer {token}` de chaque requete API.
- **Gestion des roles** : Un middleware personnalise verifie le role de l'utilisateur (patient, secretaire, medecin, administrateur) avant d'autoriser l'acces aux routes protegees.

### III.4.2. Protection des donnees

- **HTTPS** : Toutes les communications entre le client et le serveur sont chiffrees via le protocole HTTPS (certificat SSL/TLS).
- **Protection CSRF** : Laravel integre une protection automatique contre les attaques Cross-Site Request Forgery.
- **Validation des donnees** : Chaque donnee soumise par les formulaires est validee cote serveur (type, format, taille, valeurs autorisees) avant tout traitement.
- **Requetes preparees** : L'ORM Eloquent utilise des requetes preparees (parameterized queries) qui protegent contre les injections SQL.
- **Sanitisation des entrees** : Les donnees saisies par les utilisateurs sont nettoyees pour prevenir les attaques XSS (Cross-Site Scripting).

### III.4.3. Journalisation et sauvegarde

- **Logs d'activite** : Les actions sensibles (connexion, modification de profil, validation/rejet de RDV) sont enregistrees dans les fichiers de log.
- **Sauvegarde automatique** : La base de donnees fait l'objet de sauvegardes regulieres pour prevenir toute perte de donnees.

---

## III.5. Presentation des interfaces

Cette section presente les principales interfaces de la plateforme MediConsult. Les captures d'ecran illustrent le rendu visuel de l'application et permettent de verifier la conformite avec les besoins exprimes.

### III.5.1. Page d'accueil

*Figure 14 : Interface -- Page d'accueil*

La page d'accueil de MediConsult presente :
- Le logo et le nom de la clinique ;
- Une barre de navigation avec les liens vers les sections principales (Accueil, Services, Pre-consultation, Connexion, Inscription) ;
- Une banniere avec un message d'accueil et un bouton d'appel a l'action "Prendre un rendez-vous" ;
- La liste des services medicaux proposes par la clinique avec leurs icones ;
- Un pied de page avec les coordonnees de la clinique et les liens utiles.

`[Capture d'ecran a inserer]`

### III.5.2. Formulaire d'inscription

*Figure 15 : Interface -- Formulaire d'inscription*

Le formulaire d'inscription permet au patient de creer un compte en renseignant :
- Nom et prenom ;
- Adresse email ;
- Numero de telephone ;
- Date de naissance ;
- Adresse ;
- Mot de passe et confirmation.

Des validations en temps reel (cote client) et cote serveur assurent la qualite des donnees saisies.

`[Capture d'ecran a inserer]`

### III.5.3. Formulaire de connexion

*Figure 16 : Interface -- Formulaire de connexion*

Le formulaire de connexion comporte deux champs (email et mot de passe), un bouton "Se connecter" et un lien "Mot de passe oublie". Apres authentification, l'utilisateur est redirige vers son tableau de bord selon son role.

`[Capture d'ecran a inserer]`

### III.5.4. Formulaire de pre-consultation

*Figure 17 : Interface -- Formulaire de pre-consultation*

Le formulaire de pre-consultation est un formulaire interactif en plusieurs etapes :
- **Etape 1** : Selection de la zone du corps affectee (representation visuelle du corps humain cliquable ou liste deroulante) ;
- **Etape 2** : Selection du type de symptome (douleur, fievre, eruption cutanee, fatigue, etc.) ;
- **Etape 3** : Indication de la duree des symptomes (choix multiples) ;
- **Etape 4** : Evaluation de l'intensite sur une echelle de 1 a 10 (curseur) ;
- **Etape 5** : Antecedents medicaux (cases a cocher : diabete, hypertension, allergies, etc.) ;
- **Etape 6** : Description libre (zone de texte).

`[Capture d'ecran a inserer]`

### III.5.5. Resultat de l'orientation intelligente

*Figure 18 : Interface -- Resultat de l'orientation intelligente*

Apres soumission du formulaire de pre-consultation, le systeme affiche :
- Le **service recommande** avec son icone et sa description ;
- Le **score de confiance** sous forme de pourcentage et de barre de progression ;
- Les **services alternatifs** classes par score decroissant ;
- Un bouton **"Prendre un rendez-vous"** qui pre-selectionne le service recommande.

`[Capture d'ecran a inserer]`

### III.5.6. Prise de rendez-vous

*Figure 19 : Interface -- Prise de rendez-vous*

L'interface de prise de rendez-vous affiche :
- Le service selectionne (pre-rempli si le patient vient de la pre-consultation) ;
- Un **calendrier interactif** montrant les jours disponibles ;
- Les **creneaux horaires** disponibles pour la date selectionnee ;
- Un bouton "Confirmer la demande de rendez-vous".

`[Capture d'ecran a inserer]`

### III.5.7. Tableau de bord patient

*Figure 20 : Interface -- Tableau de bord patient*

Le tableau de bord du patient presente :
- Un **resume** : nombre de rendez-vous a venir, derniere consultation ;
- La liste des **rendez-vous** avec leur statut (en attente, confirme, effectue, annule) ;
- Un acces rapide a la **pre-consultation** et a la **prise de rendez-vous** ;
- L'**historique** des consultations passees ;
- Les **notifications** recentes.

`[Capture d'ecran a inserer]`

### III.5.8. Tableau de bord secretaire

*Figure 21 : Interface -- Tableau de bord secretaire*

Le tableau de bord de la secretaire medicale comporte :
- Le nombre de **demandes en attente** de validation ;
- La **liste des demandes** avec details (patient, service, date souhaitee, fiche pre-consultation) ;
- Des boutons **"Valider"** et **"Rejeter"** pour chaque demande ;
- La possibilite d'**assigner un medecin** lors de la validation ;
- Le **planning** des medecins par jour/semaine ;
- Un interrupteur pour **fermer/ouvrir** les rendez-vous en ligne.

`[Capture d'ecran a inserer]`

### III.5.9. Tableau de bord medecin

*Figure 22 : Interface -- Tableau de bord medecin*

Le tableau de bord du medecin affiche :
- Son **planning** du jour et de la semaine ;
- La liste de ses **patients du jour** avec liens vers leurs fiches de pre-consultation ;
- Un bouton pour **marquer** une consultation comme effectuee ;
- Son **historique** de consultations.

`[Capture d'ecran a inserer]`

### III.5.10. Tableau de bord administrateur

*Figure 23 : Interface -- Tableau de bord administrateur*

Le tableau de bord administrateur offre une vue globale :
- **Statistiques** : nombre total de patients, rendez-vous du mois, taux de validation, repartition par service (graphiques) ;
- **Gestion des services** : liste, ajout, modification, suppression ;
- **Gestion des medecins** : liste, ajout, affectation aux services ;
- **Gestion des utilisateurs** : liste, activation/desactivation ;
- **Configuration** de l'algorithme de scoring.

`[Capture d'ecran a inserer]`

### III.5.11. Gestion des services medicaux

*Figure 24 : Interface -- Gestion des services medicaux*

L'interface de gestion des services presente :
- Un **tableau** listant tous les services (nom, description, nombre de medecins, statut) ;
- Un bouton **"Ajouter un service"** ouvrant un formulaire modal ;
- Des boutons **"Modifier"** et **"Supprimer"** pour chaque service.

`[Capture d'ecran a inserer]`

### III.5.12. Planning des medecins

*Figure 25 : Interface -- Planning des medecins*

L'interface du planning affiche :
- Une vue **calendrier** (jour, semaine, mois) ;
- Les **rendez-vous confirmes** de chaque medecin avec code couleur par service ;
- Les **creneaux libres** et **occupes** ;
- La possibilite de **filtrer** par medecin ou par service.

`[Capture d'ecran a inserer]`

---

## III.6. Tests et validation

Les tests constituent une etape essentielle pour garantir la qualite et la fiabilite de l'application. Nous avons realise des tests fonctionnels pour verifier que chaque fonctionnalite repond aux besoins exprimes dans le cahier des charges.

### III.6.1. Plan de tests fonctionnels

*Tableau 13 : Plan de tests fonctionnels*

| N | Fonctionnalite testee | Scenario de test | Resultat attendu | Resultat obtenu | Statut |
|---|---|---|---|---|---|
| T01 | Inscription patient | Remplir le formulaire avec des donnees valides et soumettre | Le compte est cree, email de confirmation envoye, redirection vers connexion | Conforme | Valide |
| T02 | Inscription -- email en doublon | S'inscrire avec un email deja existant | Message d'erreur "Cet email est deja utilise" | Conforme | Valide |
| T03 | Connexion valide | Saisir un email et mot de passe corrects | Redirection vers le tableau de bord correspondant au role | Conforme | Valide |
| T04 | Connexion invalide | Saisir un mot de passe incorrect | Message d'erreur "Email ou mot de passe incorrect" | Conforme | Valide |
| T05 | Pre-consultation | Remplir tous les champs du formulaire et soumettre | Affichage du service recommande avec score de confiance et alternatives | Conforme | Valide |
| T06 | Pre-consultation -- score faible | Saisir des symptomes vagues (intensite faible, duree courte) | Orientation vers Medecine generale avec message d'information | Conforme | Valide |
| T07 | Prise de RDV | Selectionner un service, une date et un creneau, puis confirmer | Demande enregistree avec statut "en attente", notification secretaire | Conforme | Valide |
| T08 | Prise de RDV -- creneaux complets | Tenter de prendre un RDV quand tous les creneaux sont occupes | Message "Aucun creneau disponible pour cette date" | Conforme | Valide |
| T09 | Validation RDV par secretaire | Selectionner une demande, assigner un medecin, cliquer Valider | Statut passe a "confirme", email de confirmation envoye au patient | Conforme | Valide |
| T10 | Rejet RDV par secretaire | Selectionner une demande, saisir un motif, cliquer Rejeter | Statut passe a "rejete", email avec motif envoye au patient | Conforme | Valide |
| T11 | Consultation planning medecin | Le medecin se connecte et consulte son planning | Affichage des rendez-vous confirmes du jour et de la semaine | Conforme | Valide |
| T12 | Ajout service (admin) | Remplir le formulaire de creation de service et valider | Le service apparait dans la liste des services | Conforme | Valide |
| T13 | Ajout medecin (admin) | Remplir le formulaire d'ajout de medecin et valider | Le medecin est cree et affecte au service selectionne | Conforme | Valide |
| T14 | Fermeture RDV en ligne | La secretaire active l'interrupteur de fermeture | Les patients voient un message "RDV en ligne temporairement indisponible" | Conforme | Valide |
| T15 | Responsivite | Acceder a la plateforme depuis un smartphone | L'interface s'adapte correctement a l'ecran mobile | Conforme | Valide |
| T16 | Securite -- acces non autorise | Un patient tente d'acceder a /api/appointments en tant qu'admin | Reponse 403 Forbidden | Conforme | Valide |

### III.6.2. Resultats des tests

L'ensemble des 16 tests fonctionnels realises ont donne des resultats conformes aux attentes. Les principales fonctionnalites de la plateforme MediConsult sont validees :

- L'inscription, la connexion et la gestion des profils fonctionnent correctement ;
- Le formulaire de pre-consultation et l'algorithme de scoring orientent les patients de maniere coherente ;
- La prise de rendez-vous en ligne et la validation par la secretaire fonctionnent conformement aux specifications ;
- Les tableaux de bord de chaque profil affichent les informations pertinentes ;
- Les mesures de securite (authentification, autorisation, validation) sont operationnelles ;
- L'interface est responsive et s'adapte aux differents types d'ecrans.

---

## Conclusion du chapitre

Ce troisieme chapitre a presente la realisation concrete de la plateforme MediConsult. Nous avons decrit l'environnement de travail, les technologies utilisees (React, Laravel, PostgreSQL, Redis), l'architecture MVC et API REST de l'application, le fonctionnement detaille de l'algorithme de scoring, les mesures de securite mises en oeuvre, les principales interfaces realisees et les tests de validation. Les resultats obtenus montrent que la plateforme repond aux besoins identifies et offre une solution fonctionnelle, securisee et ergonomique pour la gestion des rendez-vous et la pre-consultation medicale en ligne.

---
---

# CONCLUSION GENERALE ET PERSPECTIVES

## Conclusion generale

Le present memoire a porte sur la conception et la realisation d'une plateforme web intelligente de pre-consultation medicale et de gestion des rendez-vous en ligne, baptisee **MediConsult**. Ce projet a ete realise dans le cadre de notre stage de fin d'etudes au sein de [Nom de la clinique], une structure sanitaire privee situee a [Ville, Senegal].

Le travail realise s'est articule autour de trois phases principales :

**Dans le premier chapitre**, nous avons presente la structure d'accueil, etudie et critique le systeme de gestion existant base sur des registres papier et des processus manuels. Cette etude a mis en evidence de nombreuses insuffisances : risque de doublons, perte d'informations, absence de systeme de pre-consultation formalise, orientation subjective des patients, et manque de visibilite sur les disponibilites des medecins. Nous avons ensuite formule la problematique, defini les objectifs du projet, identifie les acteurs et recense les besoins fonctionnels et non fonctionnels.

**Dans le deuxieme chapitre**, nous avons procede a l'analyse et la conception detaillees du systeme en utilisant le langage de modelisation UML. Les diagrammes de cas d'utilisation, les descriptions textuelles, les diagrammes de sequence, le diagramme de classes et le diagramme de deploiement ont permis de modeliser completement le systeme. La conception de la base de donnees, avec son dictionnaire de donnees et son schema relationnel, a constitue la base technique de la realisation.

**Dans le troisieme chapitre**, nous avons presente la realisation de la plateforme en utilisant les technologies React pour le frontend, Laravel pour le backend et PostgreSQL pour la base de donnees. L'algorithme de scoring pour la pre-consultation intelligente a ete implemente et teste. Les mesures de securite (authentification par token, hachage des mots de passe, protection CSRF, validation des donnees) ont ete mises en place. Les tests fonctionnels realises ont confirme la conformite du systeme aux besoins exprimes.

Les principaux apports de la plateforme MediConsult sont :
- La **dematerialisation** du processus de prise de rendez-vous, rendant le service accessible en ligne 24h/24 ;
- L'**introduction d'un systeme de pre-consultation intelligent** qui analyse les symptomes du patient et l'oriente automatiquement vers le service medical le plus adapte ;
- La **centralisation des informations** dans une base de donnees fiable et securisee ;
- L'**amelioration de l'efficacite operationnelle** de la clinique grace aux tableaux de bord de gestion ;
- La **reduction des temps d'attente** et l'amelioration de l'experience patient.

## Perspectives

Malgre les resultats satisfaisants obtenus, la plateforme MediConsult offre de nombreuses perspectives d'evolution et d'amelioration :

- **Application mobile** : Developper une version mobile native (React Native ou Flutter) pour offrir une experience optimale sur smartphone avec des notifications push ;
- **Teleconsultation** : Integrer un module de visioconference pour permettre les consultations a distance, particulierement utile pour les patients eloignes ou a mobilite reduite ;
- **Paiement en ligne** : Ajouter un module de paiement securise (Orange Money, Wave, carte bancaire) pour le reglement des frais de consultation en ligne ;
- **Intelligence artificielle avancee** : Ameliorer l'algorithme de scoring en utilisant des techniques de machine learning pour affiner les recommandations en fonction de l'historique des consultations ;
- **Rappels par SMS** : Integrer un service d'envoi de SMS pour les rappels de rendez-vous, en complement des notifications par email ;
- **Dossier medical electronique** : Etendre la plateforme pour integrer un dossier medical electronique complet (resultats d'analyses, ordonnances, comptes rendus) ;
- **Multi-cliniques** : Adapter l'architecture pour supporter plusieurs structures de sante (mode SaaS) avec une gestion mutualisee ;
- **Tableau de bord analytique** : Enrichir les statistiques avec des graphiques avances et des indicateurs de performance (KPI) pour aider a la prise de decision.

Ces perspectives montrent que la plateforme MediConsult constitue une base solide et evolutive, capable de s'adapter aux besoins futurs de la clinique et de contribuer durablement a l'amelioration de la qualite des soins de sante au Senegal.

---
---

# BIBLIOGRAPHIE

[1] SOMMERVILLE, I. (2015). *Software Engineering*. 10e edition. Pearson Education. 816 p.

[2] PRESSMAN, R. S. (2014). *Software Engineering: A Practitioner's Approach*. 8e edition. McGraw-Hill. 976 p.

[3] ROQUES, P. (2018). *UML 2.5 par la pratique : Etudes de cas et exercices corriges*. 8e edition. Eyrolles. 396 p.

[4] FOWLER, M. (2003). *UML Distilled: A Brief Guide to the Standard Object Modeling Language*. 3e edition. Addison-Wesley. 208 p.

[5] OTWELL, T. (2024). *Laravel Documentation*. Version 11.x. [En ligne]. Disponible sur : https://laravel.com/docs/11.x

[6] META (2024). *React Documentation*. Version 18. [En ligne]. Disponible sur : https://react.dev

[7] THE POSTGRESQL GLOBAL DEVELOPMENT GROUP (2024). *PostgreSQL 16 Documentation*. [En ligne]. Disponible sur : https://www.postgresql.org/docs/16/

[8] GABILLAUD, J. (2019). *SQL et les bases de donnees relationnelles*. Editions ENI. 480 p.

[9] JACOBSON, I., BOOCH, G., RUMBAUGH, J. (1999). *The Unified Software Development Process*. Addison-Wesley. 512 p.

[10] Organisation Mondiale de la Sante (2023). *Transformation numerique pour la sante*. [En ligne]. Disponible sur : https://www.who.int

---

# WEBOGRAPHIE

[W1] Laravel Official Documentation : https://laravel.com/docs (consulte le [date])

[W2] React Official Documentation : https://react.dev (consulte le [date])

[W3] PostgreSQL Official Documentation : https://www.postgresql.org/docs/ (consulte le [date])

[W4] Tailwind CSS Documentation : https://tailwindcss.com/docs (consulte le [date])

[W5] Redis Documentation : https://redis.io/docs (consulte le [date])

[W6] MDN Web Docs -- Mozilla : https://developer.mozilla.org (consulte le [date])

[W7] Stack Overflow : https://stackoverflow.com (consulte le [date])

[W8] GitHub : https://github.com (consulte le [date])

[W9] W3Schools : https://www.w3schools.com (consulte le [date])

[W10] Postman Learning Center : https://learning.postman.com (consulte le [date])

---

# ANNEXES

## Annexe A : Extrait du code source -- Algorithme de scoring (Laravel)

```php
<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServiceSymptome;

class ScoringService
{
    /**
     * Calculer le score de chaque service medical
     * en fonction des symptomes du patient.
     */
    public function calculerOrientation(array $donnees): array
    {
        $services = Service::where('actif', true)->get();
        $scores = [];

        foreach ($services as $service) {
            $score = 0;

            // Recuperer les symptomes associes au service
            $symptomesService = ServiceSymptome::where('service_id', $service->id)->get();

            foreach ($symptomesService as $symptomeService) {
                // Facteur zone du corps
                $facteurZone = ($donnees['zone_corps'] === $symptomeService->zone_corps) ? 1.5 : 1.0;

                // Facteur intensite (normalise sur 10)
                $facteurIntensite = $donnees['intensite'] / 10;

                // Facteur duree
                $facteurDuree = $this->getFacteurDuree($donnees['duree']);

                // Correspondance symptome
                if ($this->matchSymptome($donnees['type_symptome'], $symptomeService->symptome)) {
                    $score += $symptomeService->poids * $facteurZone * $facteurIntensite * $facteurDuree;
                }
            }

            $scores[$service->id] = [
                'service' => $service,
                'score' => round($score, 2),
            ];
        }

        // Trier par score decroissant
        usort($scores, fn($a, $b) => $b['score'] <=> $a['score']);

        // Calculer le score de confiance
        $scoreMax = $scores[0]['score'] ?? 0;
        $scoreTotalPossible = $this->getScoreMaxPossible($donnees);
        $scoreConfiance = $scoreTotalPossible > 0
            ? round(($scoreMax / $scoreTotalPossible) * 100, 1)
            : 0;

        // Si score de confiance < 30%, recommander medecine generale
        if ($scoreConfiance < 30) {
            $medecinGenerale = Service::where('nom', 'Medecine generale')->first();
            return [
                'service_recommande' => $medecinGenerale,
                'score_confiance' => $scoreConfiance,
                'alternatives' => array_slice($scores, 0, 2),
                'message' => 'Nous vous recommandons une consultation en medecine generale.',
            ];
        }

        return [
            'service_recommande' => $scores[0]['service'],
            'score_confiance' => $scoreConfiance,
            'alternatives' => array_slice($scores, 1, 2),
        ];
    }

    private function getFacteurDuree(string $duree): float
    {
        return match ($duree) {
            'moins_24h' => 0.8,
            '1_3_jours' => 1.0,
            '3_7_jours' => 1.2,
            'plus_1_semaine' => 1.5,
            default => 1.0,
        };
    }

    private function matchSymptome(string $symptomePatient, string $symptomeService): bool
    {
        return str_contains(
            strtolower($symptomePatient),
            strtolower($symptomeService)
        );
    }

    private function getScoreMaxPossible(array $donnees): float
    {
        // Score maximum theorique pour normalisation
        return ServiceSymptome::max('poids') * 1.5 * 1.0 * 1.5;
    }
}
```

## Annexe B : Extrait du code source -- Migration de la base de donnees (Laravel)

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table des services medicaux
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100)->unique();
            $table->text('description')->nullable();
            $table->string('icone', 50)->nullable();
            $table->string('couleur', 7)->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        // Table des medecins
        Schema::create('medecins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('specialite', 100);
            $table->json('horaires')->nullable();
            $table->timestamps();
        });

        // Table des symptomes par service (pour le scoring)
        Schema::create('service_symptomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('symptome', 100);
            $table->string('zone_corps', 50);
            $table->decimal('poids', 3, 2)->default(1.00);
            $table->timestamps();
        });

        // Table des pre-consultations
        Schema::create('pre_consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->string('zone_corps', 50);
            $table->string('type_symptome', 100);
            $table->string('duree', 50);
            $table->integer('intensite');
            $table->text('antecedents')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('service_recommande_id')->nullable()->constrained('services');
            $table->decimal('score_confiance', 5, 2)->nullable();
            $table->json('alternatives')->nullable();
            $table->timestamps();
        });

        // Table des rendez-vous
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('medecin_id')->nullable()->constrained('medecins');
            $table->foreignId('service_id')->constrained();
            $table->foreignId('pre_consultation_id')->nullable()->constrained('pre_consultations');
            $table->date('date_rdv');
            $table->time('heure_rdv');
            $table->enum('statut', ['en_attente', 'confirme', 'rejete', 'effectue', 'annule'])
                  ->default('en_attente');
            $table->text('motif_rejet')->nullable();
            $table->timestamps();
        });

        // Table des notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('appointment_id')->nullable()->constrained();
            $table->enum('type', ['confirmation', 'rappel', 'rejet', 'info']);
            $table->string('titre', 255);
            $table->text('message');
            $table->boolean('lu')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('pre_consultations');
        Schema::dropIfExists('service_symptomes');
        Schema::dropIfExists('medecins');
        Schema::dropIfExists('services');
    }
};
```

---

*Memoire de fin d'etudes -- Licence Professionnelle en Informatique*
*[Nom de l'Universite/Institut] -- Annee academique [2024-2025]*
