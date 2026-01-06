# <p align="center">🤖 LLM Playground🚀✨</p>

<p align="center">Une plateforme expérimentale puissante et interactive pour expérimenter avec de grands modèles de langage, construite sur la base de Next.js 14 et des technologies web modernes.</p>

<p align="center">Ce projet est une œuvre dérivée de <a href="https://github.com/302ai/302_llm_playground" target="_blank">302ai/302_llm_playground</a></p>

<p align="center"><a href="https://302.ai/fr/apis/" target="blank"><img src="https://file.302.ai/gpt/imgs/github/20250102/72a57c4263944b73bf521830878ae39a.png" /></a></p >

<p align="center"><a href="../README.md">中文</a> | <a href="README_en.md">English</a> | <a href="README_ja.md">日本語</a> | <a href="README_ru.md">Русский</a> | <a href="README_fr.md">Français</a> | <a href="README_de.md">Deutsch</a></p>

![Aperçu de l'interface](../images/302-LLM-游乐场.png) 

## Aperçu de l'interface
   Génération de résultats basés sur l'entrée utilisateur avec prise en charge du rendu d'expressions LaTeX.
   ![Exemple de génération de résultats](../images/LLM1.png)     

   Possibilité de télécharger des images comme contexte pour la conversation.
   ![Fonction de téléchargement d'images](../images/LLM2.png)     

   Prise en charge du rendu de graphiques.
   ![Exemple de rendu de graphiques](../images/LLM3.png)

   Dans les modèles OpenAI, il y a une fonction d'affichage de la probabilité des tokens, permettant d'obtenir la probabilité du token actuellement sélectionné, ainsi que plusieurs tokens alternatifs et leurs probabilités.
   ![Affichage de la probabilité des tokens](../images/LLM4.jpg)
   
## ✨ Fonctionnalités principales ✨

1. **Interface de chat interactive**
   - Édition et aperçu Markdown en temps réel
   - Dialogue basé sur les rôles
   - Les utilisateurs peuvent télécharger des images pour le dialogue
   - Dans les modèles OpenAI, on peut afficher la probabilité des tokens
   - Opérations avancées sur les messages : réorganisation, copie, régénération
   - Mode expert : édition améliorée et contrôle des rôles
   - Commentaires et animations pour une expérience utilisateur transparente
   - Configuration du modèle et ajustement des paramètres d'IA
   - Design réactif et accessible


2. **Éditeur de texte enrichi**
   - Markdown avancé de style GitHub
   - Prise en charge des expressions LaTeX via KaTeX
   - Prise en charge du rendu de diagrammes Mermaid
   - Persistance du contenu et rendu en temps réel


3. **Expérience utilisateur moderne**
   - Interface utilisateur personnalisable et réactive
   - Animations, notifications et gestion des erreurs
   - Composants mobiles et accessibles

4. **Fonctionnalités avancées**
   - Persistance IndexedDB, support multilingue
   - Intégration API et gestion de l'historique des messages
   - Journalisation avancée et traitement API optimisé
   - Internationalisation et traduction dynamique

## Stack technique 🛠️

- **Framework**: Next.js 14
- **Langage**: TypeScript
- **Style**: Tailwind CSS, Radix UI
- **Gestion d'état**: Jotai
- **Stockage de données**: IndexedDB avec Dexie.js
- **Internationalisation**: next-intl

## Structure du projet 📁

```plaintext
src/
├── actions/
├── app/
├── components/
│   ├── playground/
│   └── ui/
├── constants/
├── db/
├── hooks/
├── i18n/
├── stores/
├── styles/
└── utils/
```

## Démarrage rapide 🚀

### Prérequis

- Node.js (version LTS)
- pnpm ou npm
- Clé API 302.AI

### Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/xiaomizhoubaobei/LLM-Playground
   cd LLM-Playground
   ```
   
2. Installez les dépendances :
   ```bash
   pnpm install
   ```

3. Configurez les variables d'environnement :
   ```bash
   cp .env.example .env.local
   ```

   - `AI_302_API_KEY`: Votre clé API 302.AI
   - `AI_302_API_URL`: Point de terminaison API

### Développement

Démarrez le serveur de développement :

```bash
pnpm dev
```

Visitez [http://localhost:3000](http://localhost:3000) pour voir l'application.

### Construction de production

```bash
pnpm build
pnpm start
```

## Déploiement Docker 🐳

### Utilisation d'images préconstruites

- **DockerHub**: `qixiaoxin/iflow-cartoonize-api`
- **GitHub Container Registry**: `ghcr.io/xiaomizhoubaobei/llm_playground`
- **Alibaba Cloud**: `crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground`

```bash
# Utilisation de l'image DockerHub
docker pull qixiaoxin/iflow-cartoonize-api:latest
docker run -p 3000:3000 qixiaoxin/iflow-cartoonize-api:latest

# Utilisation de l'image GHCR
docker pull ghcr.io/xiaomizhoubaobei/llm_playground:latest
docker run -p 3000:3000 ghcr.io/xiaomizhoubaobei/llm_playground:latest

# Utilisation de l'image Alibaba Cloud
docker pull crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground:latest
docker run -p 3000:3000 crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground:latest
```

### Construction depuis le code source

```bash
docker build -t llm_playground .
docker run -p 3000:3000 llm_playground
```

### Variables d'environnement d'exécution

⚠️ **Important**: L'image Docker nécessite une vraie clé API 302.AI pour fonctionner.

```bash
docker run -d \
  -e AI_302_API_KEY=your-actual-api-key \
  -e AI_302_API_URL=https://api.302.ai \
  -e NEXT_PUBLIC_AI_302_API_UPLOAD_URL=https://dash-api.302.ai/gpt/api/upload/gpt/image \
  -p 3000:3000 \
  llm_playground:latest
```

**Description des variables d'environnement :**

| Nom de la variable | Description | Requis |
|--------------------|-------------|--------|
| `AI_302_API_KEY` | Clé API 302.AI | ✅ Oui |
| `AI_302_API_URL` | Adresse du service API | ✅ Oui |
| `NEXT_PUBLIC_AI_302_API_UPLOAD_URL` | Adresse de téléchargement de fichiers | ✅ Oui |

Obtenir la clé API : https://302.ai/apis/

## Contribution 🤝

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des problèmes et des demandes de tirage.

## Licence 📜

Ce projet est sous licence GNU Affero General Public License v3.0. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

Construit avec Next.js et 302.AI ❤️