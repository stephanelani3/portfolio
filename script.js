document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------
    // Terminal Initialization (Moved to top to prevent ReferenceError in language initialization)
    // ---------------------------------------------
    const terminalOutput = document.getElementById("terminal-output");
    const terminalInput = document.getElementById("terminal-input");
    let bootIndex = 0;

    const bootSequence = [
        { text: "ssh stephane@sec-arch", type: "command" },
        { text: "Authenticating with public key...", type: "info" },
        { text: "Welcome to Sec-Arch Terminal v2.5.0", type: "success" },
        { text: "Systems online. Encryption: AES-256-GCM. Status: SECURE.", type: "success" },
        { text: "Type 'help' to list available subroutines.", type: "warn" }
    ];

    const appendTerminalLine = (text, type = "info") => {
        if (!terminalOutput) return;

        const line = document.createElement("div");
        line.className = `terminal-line ${type}`;

        if (type === "command") {
            line.innerHTML = `<span class="prompt">stephane@sec-arch:~$</span> ${text}`;
        } else {
            line.textContent = text;
        }

        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    // ---------------------------------------------
    // Translation/Language Switch System
    // ---------------------------------------------
    const translations = {
        fr: {
            "nav.home": "Accueil",
            "nav.profile": "Profil",
            "nav.experience": "Expériences",
            "nav.projects": "Projets",
            "nav.skills": "Compétences",
            "nav.education": "Formations",
            "nav.contact": "Contact",
            "hero.tagline": "SysAdmin & SecOps",
            "hero.title": "STÉPHANE <br><span>LANI-YONOU</span>",
            "hero.subtitle": "Ingénieur Cyber & Développeur Django",
            "hero.desc": "Expertise pointue en protection des infrastructures critiques, en gouvernance des risques numériques (GRC) et en développement d'écosystèmes SecOps sécurisés.",
            "hero.btn_contact": "Contacter",
            "hero.btn_projects": "Découvrir les Projets",

            "profile.title": "Profil <span>Professionnel</span>",
            "profile.subtitle": "Ingénieur Cybersécurité & SecOps",
            "profile.bio": "Passionné par la cybersécurité, le SecOps et le développement sécurisé, j'appuie mon expertise sur un Master en Sécurité Informatique. Fort d'une solide maîtrise de l'architecture backend sous Django, j'intègre l'automatisation SOAR et les technologies d'IA (RAG) au cœur de mes projets de défense. J'évolue en tant que Tech Lead capable de manager des équipes techniques tout en garantissant la sécurité et la résilience des infrastructures.",
            "profile.coordonnees": "Coordonnées",
            "profile.phone": "Téléphone :",
            "profile.location": "Localisation :",
            "profile.goal_title": "Objectif de Carrière",
            "profile.goal_desc": "Visant à évoluer activement vers un poste de <strong>Responsable de la Sécurité des Systèmes d'Information (RSSI)</strong> afin de définir les politiques de sécurité globales.",
            "profile.lang_title": "Langues",
            "profile.lang_fr": "Français",
            "profile.lang_fr_level": "Courant",
            "profile.lang_en": "Anglais",
            "profile.lang_en_level": "Notions",
            "profile.interests_title": "Intérêts",
            "profile.interest_fb": "Football",
            "profile.interest_vg": "Jeux vidéo",
            "profile.interest_bb": "Basketball",

            "exp.title": "Parcours <span>Professionnel</span>",
            "exp.mewan_role": "Ingénieur d'Exploitation Informatique",
            "exp.mewan_date": "Avril 2024 - Présent",
            "exp.mewan_b1": "<strong>Gestion de projet :</strong> Supervision et coordination des développements d'applications web et mobiles, depuis la conception jusqu'au déploiement, en garantissant le respect des délais et des spécifications fonctionnelles.",
            "exp.mewan_b2": "<strong>Management d'équipe :</strong> Manager une équipe de développeurs, allouer les ressources et définir les priorités pour assurer le succès des projets.",
            "exp.mewan_b3": "<strong>Développement Web et Mobile :</strong> Compréhension approfondie de la programmation pour participer activement au développement d'applications web et mobile, en utilisant des langages et des frameworks adaptés aux besoins du projet.",
            "exp.mewan_b4": "<strong>Polyvalence :</strong> Capacité à assumer diverses responsabilités liées à l'exploitation informatique, telles que la gestion des sauvegardes, la surveillance des performances système et la mise en place de mesures de sécurité.",
            "exp.mewan_b5": "<strong>Administration réseau :</strong> Gérer et entretenir les infrastructures de réseau, configurer les équipements et résoudre les problèmes de connectivité pour garantir la disponibilité et la sécurité des systèmes.",
            "exp.mewan_b6": "<strong>Utilisation de plateformes collaboratives :</strong> Expérience avec des outils tels que Trello et Redmine pour la gestion de projets, ainsi que Nextcloud pour le stockage et le partage sécurisés de fichiers.",

            "exp.padme_role": "Stagiaire Professionnel en Sécurité Informatique",
            "exp.padme_date": "Juin 2023 - Septembre 2023",
            "exp.padme_b1": "<strong>Révision de la politique de sécurité des systèmes d'information :</strong> Participation proactive à la révision et à l'amélioration des politiques de sécurité pour garantir la confidentialité, l'intégrité et la disponibilité des données sensibles.",
            "exp.padme_b2": "<strong>Élaboration de plans de contrôle et de continuité informatique :</strong> Contribution à la mise en place de plans de contrôle et de continuité afin d'anticiper et de gérer les incidents et les situations d'urgence liés aux systèmes informatiques.",
            "exp.padme_b3": "<strong>Déploiement de solutions de gestion libre du parc informatiques :</strong> Participation au déploiement et à l'intégration de solutions visant à optimiser la gestion libre du parc informatiques et l'assistance technique.",
            "exp.padme_b4": "<strong>Collaboration à la mise en place d'une plate-forme de formation numérique :</strong> Contribution à la mise en place d'une plate-forme de formation numérique visant à renforcer les compétences en matière de sécurité informatique et de meilleures pratiques au sein de l'organisation.",

            "exp.jcit_role": "Développeur Full-Stack",
            "exp.jcit_date": "Juillet 2021 - Mai 2023",
            "exp.jcit_b1": "<strong>Maintenance & Sécurité :</strong> Analyse de code, correction de bugs et application de patchs de sécurité sur des applications en production.",
            "exp.jcit_b2": "<strong>Optimisation backend :</strong> Refonte de composants web et optimisation de requêtes pour améliorer les temps de réponse de l'application.",
            "exp.jcit_b3": "<strong>Environnement Linux :</strong> Participation au déploiement et à la configuration des applications sur des architectures serveurs locales.",

            "proj.section_title": "Réalisations <span>SecOps &amp; Dev</span>",
            "proj.details": "Détails",
            "proj.reduce": "Réduire",

            "proj.p1_title": "Cybersécurité, GRC & ITAM (NDA)",
            "proj.p1_desc": "Plateforme intégrée de gestion des incidents et des actifs (CMDB) orchestrant des solutions clés et un assistant IA souverain.",
            "proj.p1_b1": "<strong>Rôle Tech Lead & Full-Stack :</strong> Cadrage, management technique de 2 développeurs et architecture de la plateforme.",
            "proj.p1_b2": "<strong>SOAR & IA Backend :</strong> Interconnexion de Wazuh, TheHive, OpenVAS, tâches asynchrones Celery/Redis et assistant RAG local via Ollama.",
            "proj.p1_b3": "<strong>Frontend Interactif :</strong> Tableaux de bord dynamiques (KPIs, matrice des risques 5×5) connectés via APIs AJAX/Fetch.",

            "proj.p2_title": "Contrôle des Habilitations (NDA)",
            "proj.p2_desc": "Solution de gestion centralisée, d'attribution et de révocation des droits d'accès aux applications de l'entreprise.",
            "proj.p2_b1": "<strong>Rôle Tech Lead & Full-Stack :</strong> Supervision technique et développement complet de la plateforme d'habilitation.",
            "proj.p2_b2": "<strong>Audit & Automatisation :</strong> Automatisation des processus d'audit de sécurité réglementaires et conformité du moteur RBAC.",
            "proj.p2_b3": "<strong>Interface UI :</strong> Console d'administration centralisée et épurée pour le suivi précis de la criticité des accès.",

            "proj.p3_title": "Simulation d'Entretiens IA (SaaS)",
            "proj.p3_desc": "Application de simulation d'entretiens personnalisés avec système de matching CV-offre et génération de rapports.",
            "proj.p3_b1": "<strong>Rôle Tech Lead & Full-Stack :</strong> Conception, rédaction du cahier des charges et développement complet.",
            "proj.p3_b2": "<strong>Backend & Architectures IA :</strong> API REST sous Django, matching (CV ↔ Offre) et simulation via API OpenAI / Groq (Llama 3.3).",
            "proj.p3_b3": "<strong>Frontend & Tâches Async :</strong> Interface Next.js réactive, extraction NLP de fichiers (PDF/DOCX) et traitement Celery/Redis.",
            
            "proj.p10_title": "Transport de Colis Collaboratif",
            "proj.p10_desc": "Portail de mise en relation de confiance pour l'expédition internationale de colis via le crowdsourcing de voyageurs.",
            "proj.p10_b1": "<strong>Mise en relation :</strong> Algorithme d'appariement sécurisé entre expéditeurs et voyageurs certifiés.",
            "proj.p10_b2": "<strong>Gestion des expéditions :</strong> Suivi des étapes d'expédition et messagerie intégrée entre utilisateurs.",
            "proj.p10_b3": "<strong>Sécurité :</strong> Systèmes de vérification d'identité des voyageurs pour garantir la fiabilité des envois.",
            
            "proj.p11_title": "Passerelle de Recharge Financière",
            "proj.p11_desc": "Plateforme d'exploitation financière automatisée pour la recharge de soldes de monnaies électroniques.",
            "proj.p11_b1": "<strong>API Integration :</strong> Connecteurs avec multiples opérateurs de paiement tiers.",
            "proj.p11_b2": "<strong>Robustesse :</strong> Gestion asynchrone des files d'attente de transactions pour éviter les doubles recharges.",
            "proj.p11_b3": "<strong>Journalisation :</strong> Système d'audit et de traçabilité des flux financiers et des logs d'erreurs d'API.",
            
            "proj.p12_title": "Automatisation de Localisation PO",
            "proj.p12_desc": "Outil en ligne de commande pour le parsing et la traduction automatique des fichiers de localisation gettext (.po).",
            "proj.p12_b1": "<strong>Polib Parser :</strong> Utilisation de la bibliothèque polib pour charger, analyser et modifier les fichiers gettext.",
            "proj.p12_b2": "<strong>Traduction Automatique :</strong> Intégration d'APIs de traduction pour remplir automatiquement les chaînes non traduites.",
            "proj.p12_b3": "<strong>Sauvegarde Sécurisée :</strong> Écriture propre et respect du formatage originaux des fichiers de traduction.",

            "skills.title": "Matrice de <span>Compétences</span>",
            "skills.c1_title": "Cybersécurité, SecOps & GRC",
            "skills.c1_desc": "Automatisation de la réponse aux incidents, intégration SIEM/SecOps, conformité réglementaire (RBAC) et audits de code.",
            "skills.tag_soar": "Automatisation SOAR",
            "skills.tag_thehive": "Gestion d'incidents (TheHive)",
            "skills.tag_openvas": "Vulnérabilités (OpenVAS)",
            "skills.tag_rbac": "Moteur RBAC",
            "skills.tag_audit": "Audit de code",
            "skills.tag_logging": "Journalisation stricte",
            "skills.tag_network": "Réseau Informatique",
            "skills.c2_title": "Architectures Backend, Web & IA",
            "skills.c2_desc": "Conception d'architectures backend robustes et intégration de technologies d'intelligence artificielle (RAG).",
            "skills.c3_title": "Gestion & Soft Skills",
            "skills.c3_desc": "Rôle de Tech Lead, gestion d'équipes techniques et résilience des infrastructures.",
            "skills.tag_lead": "Tech Lead",
            "skills.tag_mgmt": "Management d'équipe",
            "skills.tag_project": "Gestion de projets",
            "skills.tag_resilience": "Résilience infra",
            "skills.tag_versatility": "Polyvalence",
            "skills.c4_title": "Habilitations & Profil Global",
            "skills.c4_cert": "CSEDP Certification",
            "skills.c4_desc": "Certified Social Engineering Defense Practitioner : validation en ingénierie sociale et contre-mesures humaines.",
            "skills.c4_lang": "Langues",
            "skills.c4_fr_lvl": "(Courant)",
            "skills.c4_en_lvl": "(Notions)",

            "edu.title": "Formations &amp; <span>Certifications</span>",
            "edu.m1_title": "Master en Sécurité Informatique",
            "edu.m1_school": "Ecole Supérieure de Gestion d'Informatique et des Sciences (ESGIS) Bénin",
            "edu.l1_title": "Licence en Réseau informatique et Télécommunication",
            "edu.l1_school": "Ecole Supérieure Sainte félicité (ESSF) Bénin",
            "edu.d1_title": "Diplôme du Technicien en Informatique et Maintenance Industriel",
            "edu.d1_school": "Lycée Technique de Bohicon",
            "edu.b1_title": "BACCALAURÉAT série F2",
            "edu.b1_school": "Lycée Technique de Bohicon",

            "cert.title": "Certification Active",
            "cert.desc": "Validation des compétences en ingénierie sociale, techniques de manipulation, détection d'intrusions physiques/logiques humaines, et mise en place de contre-mesures opérationnelles.",

            "contact.title": "Initialiser la <span>Connexion</span>",
            "contact.subtitle": "Établir un Tunnel",
            "contact.desc": "N'hésitez pas à me contacter pour échanger sur vos projets ou architectures de sécurité.",
            "contact.name_label": "Nom / Organisation *",
            "contact.name_placeholder": "Entrez votre nom",
            "contact.email_label": "Adresse de messagerie *",
            "contact.email_placeholder": "nom@exemple.com",
            "contact.subject_label": "Sujet / Contexte",
            "contact.subject_placeholder": "ex: Recrutement RSSI, Audit de sécurité",
            "contact.message_label": "Spécifications du message *",
            "contact.message_placeholder": "Rédigez votre demande ici...",
            "contact.submit_btn": "Envoyer le Message",
            "contact.email_link": "Email Direct",
            "contact.linkedin_link": "LinkedIn",

            "footer.rights": "&copy; 2026 STÉPHANE LANI-YONOU. TOUS DROITS RÉSERVÉS.",
            "terminal.placeholder": "Entrez une commande (ex: help)..."
        },
        en: {
            "nav.home": "Home",
            "nav.profile": "Profile",
            "nav.experience": "Experience",
            "nav.projects": "Projects",
            "nav.skills": "Skills",
            "nav.education": "Education",
            "nav.contact": "Contact",
            "hero.tagline": "SysAdmin & SecOps",
            "hero.title": "STÉPHANE <br><span>LANI-YONOU</span>",
            "hero.subtitle": "Cyber Engineer & Django Developer",
            "hero.desc": "Sharp expertise in critical infrastructure protection, digital risk governance (GRC), and building secure SecOps ecosystems.",
            "hero.btn_contact": "Contact",
            "hero.btn_projects": "Discover Projects",

            "profile.title": "Professional <span>Profile</span>",
            "profile.subtitle": "Cybersecurity & SecOps Engineer",
            "profile.bio": "Passionate about cybersecurity, SecOps, and secure development, I ground my expertise in a Master's degree in IT Security. Armed with solid Django backend architecture experience, I integrate SOAR automation and AI (RAG) at the core of defense projects. I act as a Tech Lead capable of managing technical teams while ensuring the resilience and security of infrastructures.",
            "profile.coordonnees": "Contact Info",
            "profile.phone": "Phone:",
            "profile.location": "Location:",
            "profile.goal_title": "Career Goal",
            "profile.goal_desc": "Actively aiming to transition into a <strong>Chief Information Security Officer (CISO / RSSI)</strong> role to define global security policies.",
            "profile.lang_title": "Languages",
            "profile.lang_fr": "French",
            "profile.lang_fr_level": "Fluent",
            "profile.lang_en": "English",
            "profile.lang_en_level": "Basics",
            "profile.interests_title": "Interests",
            "profile.interest_fb": "Football",
            "profile.interest_vg": "Video games",
            "profile.interest_bb": "Basketball",

            "exp.title": "Professional <span>Experience</span>",
            "exp.mewan_role": "IT Exploitation Engineer",
            "exp.mewan_date": "April 2024 - Present",
            "exp.mewan_b1": "<strong>Project Management:</strong> Supervision and coordination of web and mobile application developments from conception to deployment, ensuring deadlines and functional specifications are met.",
            "exp.mewan_b2": "<strong>Team Management:</strong> Manage a team of developers, allocate resources and define priorities to ensure project success.",
            "exp.mewan_b3": "<strong>Web & Mobile Development:</strong> Deep programming understanding to actively participate in web and mobile app development using frameworks tailored to project needs.",
            "exp.mewan_b4": "<strong>Versatility:</strong> Ability to take on various IT operations responsibilities, such as backup management, system performance monitoring, and implementing security measures.",
            "exp.mewan_b5": "<strong>Network Administration:</strong> Manage and maintain network infrastructures, configure equipment, and resolve connectivity issues to ensure systems availability and security.",
            "exp.mewan_b6": "<strong>Use of collaborative platforms:</strong> Experience with tools like Trello and Redmine for project management, and Nextcloud for secure file storage and sharing.",

            "exp.padme_role": "Cybersecurity Intern",
            "exp.padme_date": "June 2023 - September 2023",
            "exp.padme_b1": "<strong>Information Security Policy Review:</strong> Proactive participation in reviewing and improving security policies to guarantee confidentiality, integrity, and availability of sensitive data.",
            "exp.padme_b2": "<strong>Control & Continuity Planning:</strong> Contribution to setting up control and business continuity plans to anticipate and manage IT systems emergencies and incidents.",
            "exp.padme_b3": "<strong>IT Asset Management Deployment:</strong> Assisted in deploying open-source solutions to optimize asset management and technical support.",
            "exp.padme_b4": "<strong>E-learning Platform Collaboration:</strong> Contribution to setting up a digital training platform to strengthen IT security skills and best practices within the organization.",

            "exp.jcit_role": "Full-Stack Developer",
            "exp.jcit_date": "July 2021 - May 2023",
            "exp.jcit_b1": "<strong>Maintenance & Security:</strong> Code analysis, bug fixing, and security patching on production systems.",
            "exp.jcit_b2": "<strong>Backend Optimization:</strong> Redesigning web components and optimizing queries to improve application response times.",
            "exp.jcit_b3": "<strong>Linux Environment:</strong> Participated in deploying and configuring applications on local server architectures.",

            "proj.section_title": "SecOps &amp; Dev <span>Projects</span>",
            "proj.details": "Details",
            "proj.reduce": "Collapse",

            "proj.p1_title": "Cybersecurity, GRC & ITAM (NDA)",
            "proj.p1_desc": "Integrated incident and asset management platform (CMDB) orchestrating key solutions and a sovereign AI assistant.",
            "proj.p1_b1": "<strong>Tech Lead & Full-Stack Role:</strong> Scoping, technical management of 2 developers, and platform architecture.",
            "proj.p1_b2": "<strong>SOAR & AI Backend:</strong> Interconnection of Wazuh, TheHive, OpenVAS, Celery/Redis tasks, and local Ollama RAG assistant.",
            "proj.p1_b3": "<strong>Interactive Frontend:</strong> Dynamic dashboards (KPIs, 5x5 risk matrix) connected via AJAX/Fetch APIs.",

            "proj.p2_title": "Access & Privilege Control (NDA)",
            "proj.p2_desc": "Centralized management solution for assigning and revoking access rights across enterprise applications.",
            "proj.p2_b1": "<strong>Tech Lead & Full-Stack Role:</strong> Technical supervision and complete development of the authorization platform.",
            "proj.p2_b2": "<strong>Audit & Automation:</strong> Automation of regulatory security audit processes and RBAC engine compliance.",
            "proj.p2_b3": "<strong>UI Interface:</strong> Centralized and clean admin console for precise tracking of employee access criticality.",

            "proj.p3_title": "AI Interview Simulator (SaaS)",
            "proj.p3_desc": "Personalized interview simulation app featuring CV-to-job matching and detailed evaluation reports.",
            "proj.p3_b1": "<strong>Tech Lead & Full-Stack Role:</strong> Conception, specifications drafting, and complete development.",
            "proj.p3_b2": "<strong>Backend & AI Architectures:</strong> REST API under Django, matching (CV ↔ Job offer), and simulation via OpenAI / Groq API (Llama 3.3).",
            "proj.p3_b3": "<strong>Frontend & Async Tasks:</strong> Responsive Next.js interface, NLP file extraction (PDF/DOCX), and Celery/Redis processing.",
            
            "proj.p10_title": "Collaborative Package Shipping",
            "proj.p10_desc": "Trust-based portal connecting users for international package shipping via traveler crowdsourcing.",
            "proj.p10_b1": "<strong>Matching:</strong> Secure matching algorithm connecting senders and verified travelers.",
            "proj.p10_b2": "<strong>Shipment Tracking:</strong> Shipment status tracking and integrated messaging between users.",
            "proj.p10_b3": "<strong>Security:</strong> Traveler identity verification systems to ensure shipping reliability.",
            
            "proj.p11_title": "Financial Recharge Gateway",
            "proj.p11_desc": "Automated financial operations platform for electronic currency balance recharging.",
            "proj.p11_b1": "<strong>API Integration:</strong> Connectors with multiple third-party payment providers.",
            "proj.p11_b2": "<strong>Robustness:</strong> Asynchronous transaction queue management to prevent double recharges.",
            "proj.p11_b3": "<strong>Logging:</strong> Audit and traceability system for financial flows and API error logs.",
            
            "proj.p12_title": "PO Localization Automation",
            "proj.p12_desc": "Command-line tool for parsing and automatically translating gettext localization files (.po).",
            "proj.p12_b1": "<strong>Polib Parser:</strong> Leveraging the polib library to load, analyze, and modify gettext files.",
            "proj.p12_b2": "<strong>Machine Translation:</strong> Integration of translation APIs to auto-populate untranslated strings.",
            "proj.p12_b3": "<strong>Secure Save:</strong> Clean writing and compliance with the original layout of localization files.",

            "skills.title": "Skill <span>Matrix</span>",
            "skills.c1_title": "Cybersecurity, SecOps & GRC",
            "skills.c1_desc": "Incident response automation, SIEM/SecOps integration, regulatory compliance (RBAC), and code audits.",
            "skills.tag_soar": "SOAR Automation",
            "skills.tag_thehive": "Incident Management (TheHive)",
            "skills.tag_openvas": "Vulnerabilities (OpenVAS)",
            "skills.tag_rbac": "RBAC Engine",
            "skills.tag_audit": "Code Auditing",
            "skills.tag_logging": "Strict Logging",
            "skills.tag_network": "IT Networks",
            "skills.c2_title": "Backend, Web & AI Architectures",
            "skills.c2_desc": "Designing robust backend architectures and integrating artificial intelligence technologies (RAG).",
            "skills.c3_title": "Management & Soft Skills",
            "skills.c3_desc": "Tech Lead role, managing technical teams, and infrastructure resilience.",
            "skills.tag_lead": "Tech Lead",
            "skills.tag_mgmt": "Team Management",
            "skills.tag_project": "Project Management",
            "skills.tag_resilience": "Infrastructure Resilience",
            "skills.tag_versatility": "Versatility",
            "skills.c4_title": "Authorizations & Global Profile",
            "skills.c4_cert": "CSEDP Certification",
            "skills.c4_desc": "Certified Social Engineering Defense Practitioner: validation of skills in social engineering and human countermeasures.",
            "skills.c4_lang": "Languages",
            "skills.c4_fr_lvl": "(Fluent)",
            "skills.c4_en_lvl": "(Basics)",

            "edu.title": "Education &amp; <span>Certifications</span>",
            "edu.m1_title": "Master's Degree in IT Security",
            "edu.m1_school": "Ecole Supérieure de Gestion d'Informatique et des Sciences (ESGIS) Benin",
            "edu.l1_title": "Bachelor's Degree in IT Network & Telecommunications",
            "edu.l1_school": "Ecole Supérieure Sainte félicité (ESSF) Benin",
            "edu.d1_title": "IT Technician & Industrial Maintenance Diploma",
            "edu.d1_school": "Lycée Technique de Bohicon",
            "edu.b1_title": "Bachelor of Technology (F2 Series)",
            "edu.b1_school": "Lycée Technique de Bohicon",

            "cert.title": "Active Certification",
            "cert.desc": "Validation of skills in social engineering, manipulation techniques, human physical/logic intrusion detection, and operational countermeasures.",

            "contact.title": "Initialize the <span>Connection</span>",
            "contact.subtitle": "Establish a Tunnel",
            "contact.desc": "Feel free to contact me to discuss your projects or security architectures.",
            "contact.name_label": "Name / Organization *",
            "contact.name_placeholder": "Enter your name",
            "contact.email_label": "Email Address *",
            "contact.email_placeholder": "name@example.com",
            "contact.subject_label": "Subject / Context",
            "contact.subject_placeholder": "ex: CISO recruitment, Security audit",
            "contact.message_label": "Message Specifications *",
            "contact.message_placeholder": "Write your request here...",
            "contact.submit_btn": "Send Message",
            "contact.email_link": "Direct Email",
            "contact.linkedin_link": "LinkedIn",

            "footer.rights": "&copy; 2026 STÉPHANE LANI-YONOU. ALL RIGHTS RESERVED.",
            "terminal.placeholder": "Enter command (e.g., help)..."
        }
    };

    let currentLang = localStorage.getItem("portfolio_lang") || "fr";

    const updateLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem("portfolio_lang", lang);

        document.querySelectorAll(".lang-btn").forEach(btn => {
            if (btn.getAttribute("data-lang") === lang) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (translations[lang][key]) {
                el.setAttribute("placeholder", translations[lang][key]);
            }
        });

        // Update expand button texts
        document.querySelectorAll(".project-card").forEach(card => {
            const span = card.querySelector(".project-btn-expand span");
            if (span) {
                if (card.classList.contains("expanded")) {
                    span.textContent = lang === "fr" ? "Réduire" : "Collapse";
                } else {
                    span.textContent = lang === "fr" ? "Détails" : "Details";
                }
            }
        });

        // Print system log in terminal if initialized
        if (terminalOutput && bootIndex >= 5) {
            appendTerminalLine(lang === "fr" ? "[SYSTEM] Langue configurée sur Français." : "[SYSTEM] Language set to English.", "warn");
        }
    };

    // Bind event listeners to language buttons
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.getAttribute("data-lang");
            updateLanguage(lang);
        });
    });

    // Initialize language on load
    updateLanguage(currentLang);

    // Custom Cursor Trailer Glow
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // ---------------------------------------------
    // 2. Responsive Mobile Navigation Menu
    // ---------------------------------------------
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            const icon = menuToggle.querySelector(".material-symbols-outlined");
            if (icon) {
                icon.textContent = navMenu.classList.contains("open") ? "close" : "menu";
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                const icon = menuToggle.querySelector(".material-symbols-outlined");
                if (icon) icon.textContent = "menu";
            });
        });
    }

    // ---------------------------------------------
    // 3. Header Scroll Styling & Active Links
    // ---------------------------------------------
    const header = document.getElementById("main-header");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Active link tracking
        let currentSectionId = "";
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    // ---------------------------------------------
    // 4. Particle Background System
    // ---------------------------------------------
    const initParticleSystem = () => {
        const canvas = document.getElementById("particles-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const maxParticles = Math.min(80, Math.floor((width * height) / 18000)); // Responsive count
        let mouse = { x: null, y: null, radius: 120 };

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener("mouseout", () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.2 + 0.15;
                this.color = Math.random() > 0.4 ?
                    `rgba(255, 255, 255, ${this.opacity})` :
                    `rgba(250, 204, 21, ${this.opacity})`; // Gold or white
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off canvas limits
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse repel interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const forceX = (dx / distance) * force * 1.5;
                        const forceY = (dy / distance) * force * 1.5;

                        this.x += forceX;
                        this.y += forceY;
                    }
                }
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update & Draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (110 - dist) / 110 * 0.08;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(250, 204, 21, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        animate();
    };

    initParticleSystem();

    // ---------------------------------------------
    // 5. Scroll Reveal Intersection Observer
    // ---------------------------------------------
    const revealElements = document.querySelectorAll(".fade-in-up");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------------------------------------------
    // 6. Interactive Project Cards Expansion
    // ---------------------------------------------
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach(card => {
        const toggleBtn = card.querySelector(".project-btn-expand");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                // Toggle this card
                const isExpanded = card.classList.contains("expanded");

                // Collapse all first (Optional, but clean)
                projectCards.forEach(c => {
                    c.classList.remove("expanded");
                    const btn = c.querySelector(".project-btn-expand span");
                    if (btn) btn.textContent = currentLang === "fr" ? "Détails" : "Details";
                });

                if (!isExpanded) {
                    card.classList.add("expanded");
                    toggleBtn.querySelector("span").textContent = currentLang === "fr" ? "Réduire" : "Collapse";
                } else {
                    card.classList.remove("expanded");
                    toggleBtn.querySelector("span").textContent = currentLang === "fr" ? "Détails" : "Details";
                }
            });
        }
    });

    // ---------------------------------------------
    // 7. Interactive Terminal Emulator
    // ---------------------------------------------
    const runBoot = () => {
        if (bootIndex < bootSequence.length) {
            const current = bootSequence[bootIndex];
            setTimeout(() => {
                appendTerminalLine(current.text, current.type);
                bootIndex++;
                runBoot();
            }, bootIndex === 0 ? 300 : 600);
        } else {
            // Enable user input after boot
            if (terminalInput) {
                terminalInput.removeAttribute("disabled");
                terminalInput.focus();
            }
        }
    };

    runBoot();

    // Prevent form submission or standard key behaviors inside terminal input
    if (terminalInput) {
        terminalInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const commandText = terminalInput.value.trim();
                terminalInput.value = "";

                if (commandText) {
                    appendTerminalLine(commandText, "command");
                    processCommand(commandText.toLowerCase());
                }
            }
        });

        // Autofocus terminal input when clicking terminal content area
        const terminalWindow = document.querySelector(".terminal-window");
        if (terminalWindow) {
            terminalWindow.addEventListener("click", () => {
                terminalInput.focus();
            });
        }
    }

    const processCommand = (cmd) => {
        const parts = cmd.split(" ");
        const primaryCmd = parts[0];
        const isFr = currentLang === "fr";

        switch (primaryCmd) {
            case "help":
                if (isFr) {
                    appendTerminalLine("Opérations disponibles :", "info");
                    appendTerminalLine("  help     - Afficher la liste des directives de la console", "success");
                    appendTerminalLine("  cv       - Afficher le résumé du profil principal", "success");
                    appendTerminalLine("  skills   - Lister les compétences techniques", "success");
                    appendTerminalLine("  projects - Énumérer les principales réalisations SecOps & Dev", "success");
                    appendTerminalLine("  scan     - Lancer un scan de diagnostic sur une IP cible simulée", "success");
                    appendTerminalLine("  contact  - Afficher les coordonnées de contact", "success");
                    appendTerminalLine("  clear    - Vider le tampon de la console", "success");
                } else {
                    appendTerminalLine("Available operations:", "info");
                    appendTerminalLine("  help     - Show list of console directives", "success");
                    appendTerminalLine("  cv       - Output core profile summary", "success");
                    appendTerminalLine("  skills   - List technical competencies", "success");
                    appendTerminalLine("  projects - Enumerate key SecOps & Dev implementations", "success");
                    appendTerminalLine("  scan     - Run diagnostic scan on simulated target IP", "success");
                    appendTerminalLine("  contact  - Display connectivity details", "success");
                    appendTerminalLine("  clear    - Flush terminal console buffer", "success");
                }
                break;

            case "cv":
                if (isFr) {
                    appendTerminalLine("--- PROFIL DE STÉPHANE LANI-YONOU ---", "info");
                    appendTerminalLine("Rôle : Tech Lead & Ingénieur SecOps", "success");
                    appendTerminalLine("Objectif : Évoluer vers un poste de RSSI dans les infrastructures critiques", "success");
                    appendTerminalLine("Résumé : Passionné par la cybersécurité, le SecOps et le développement sécurisé, j'appuie mon expertise sur un Master en Sécurité Informatique. Fort d'une solide maîtrise de l'architecture backend sous Django, j'intègre l'automatisation SOAR et les technologies d'IA (RAG) au cœur de mes projets de défense. J'évolue en tant que Tech Lead capable de manager des équipes techniques tout en garantissant la sécurité et la résilience des infrastructures.", "info");
                } else {
                    appendTerminalLine("--- STÉPHANE LANI-YONOU PROFILE ---", "info");
                    appendTerminalLine("Role: Tech Lead & SecOps Engineer", "success");
                    appendTerminalLine("Goal: Evolve to CISO / RSSI role in critical infrastructures", "success");
                    appendTerminalLine("Summary: Passionate about cybersecurity, SecOps, and secure development, I ground my expertise in a Master's degree in IT Security. Armed with solid Django backend architecture experience, I integrate SOAR automation and AI (RAG) at the core of defense projects. I act as a Tech Lead capable of managing technical teams while ensuring the resilience and security of infrastructures.", "info");
                }
                break;

            case "skills":
                if (isFr) {
                    appendTerminalLine("--- MATRICE TECHNIQUE ---", "info");
                    appendTerminalLine("Backend & Dev : Python, Django, DRF, Next.js, Celery, Redis, PostgreSQL, Git", "success");
                    appendTerminalLine("SecOps & Cyber : SOAR, SIEM (Wazuh), TheHive, OpenVAS, RBAC, Audit de code", "success");
                    appendTerminalLine("Ingénierie IA : Groq, APIs OpenAI, RAG (Ollama, HuggingFace)", "success");
                    appendTerminalLine("Systèmes & Soft Skills : Linux (Debian), Tech Lead / Management, Gestion de projets", "info");
                } else {
                    appendTerminalLine("--- TECHNICAL MATRIX ---", "info");
                    appendTerminalLine("Backend & Dev: Python, Django, DRF, Next.js, Celery, Redis, PostgreSQL, Git", "success");
                    appendTerminalLine("SecOps & Cyber: SOAR, SIEM (Wazuh), TheHive, OpenVAS, RBAC, Code Auditing", "success");
                    appendTerminalLine("AI Engineering: Groq, OpenAI APIs, RAG (Ollama, HuggingFace)", "success");
                    appendTerminalLine("Systems & Soft Skills: Linux (Debian), Tech Lead / Management, Project Management", "info");
                }
                break;

            case "projects":
                if (isFr) {
                    appendTerminalLine("--- REGISTRE DES PROJETS ACTIFS ---", "info");
                    appendTerminalLine("1. Cybersécurité, GRC & ITAM (NDA) - Stack : Django, GVM/OpenVAS, Celery, RAG Ollama", "success");
                    appendTerminalLine("2. Contrôle des Habilitations (NDA) - Stack : Django, RBAC, Audits", "success");
                    appendTerminalLine("3. Simulation d'Entretiens IA (SaaS) - Stack : Next.js, Django, OpenAI/Groq, Celery", "success");
                    appendTerminalLine("4. Transport de Colis Collaboratif (KoliBox) - Stack : Django, Crowdsourcing, PostgreSQL", "success");
                    appendTerminalLine("5. Passerelle de Recharge Financière - Stack : Django, Celery, APIs", "success");
                    appendTerminalLine("6. Automatisation de Localisation PO - Stack : Python, polib, Translation APIs", "success");
                    appendTerminalLine("Tapez 'scan' pour lancer une vérification de vulnérabilité.", "warn");
                } else {
                    appendTerminalLine("--- ACTIVE PROJECTS REGISTER ---", "info");
                    appendTerminalLine("1. Cybersecurity, GRC & ITAM (NDA) - Stack: Django, GVM/OpenVAS, Celery, RAG Ollama", "success");
                    appendTerminalLine("2. Access & Privilege Control (NDA) - Stack: Django, RBAC, Audits", "success");
                    appendTerminalLine("3. AI Interview Simulator (SaaS) - Stack: Next.js, Django, OpenAI/Groq, Celery", "success");
                    appendTerminalLine("4. Collaborative Package Shipping (KoliBox) - Stack: Django, Crowdsourcing, PostgreSQL", "success");
                    appendTerminalLine("5. Financial Recharge Gateway - Stack: Django, Celery, APIs", "success");
                    appendTerminalLine("6. PO Localization Automation - Stack: Python, polib, Translation APIs", "success");
                    appendTerminalLine("Type 'scan' to run a vulnerability check.", "warn");
                }
                break;

            case "contact":
                if (isFr) {
                    appendTerminalLine("--- CANAUX SÉCURISÉS ---", "info");
                    appendTerminalLine("E-mail     : laniyonostephane@gmail.com", "success");
                    appendTerminalLine("Téléphone  : +229 96 56 03 30", "success");
                    appendTerminalLine("Localisation : Cotonou, Bénin", "success");
                    appendTerminalLine("LinkedIn   : Stéphane LANI-YONOU", "success");
                } else {
                    appendTerminalLine("--- SECURE CHANNELS ---", "info");
                    appendTerminalLine("Email      : laniyonostephane@gmail.com", "success");
                    appendTerminalLine("Phone      : +229 96 56 03 30", "success");
                    appendTerminalLine("Location   : Cotonou, Benin", "success");
                    appendTerminalLine("LinkedIn   : Stéphane LANI-YONOU", "success");
                }
                break;

            case "scan":
                let targetIp = parts[1] || "192.168.1.1";
                if (isFr) {
                    appendTerminalLine(`Lancement du scanner réseau sur la cible : ${targetIp}...`, "warn");
                    appendTerminalLine("Scan des ports cibles 1-1024...", "info");
                } else {
                    appendTerminalLine(`Launching network scanner target: ${targetIp}...`, "warn");
                    appendTerminalLine("Scanning target ports 1-1024...", "info");
                }

                let progress = 0;
                terminalInput.setAttribute("disabled", "true");

                const scanInterval = setInterval(() => {
                    progress += 25;
                    if (isFr) {
                        appendTerminalLine(`Scan en cours... ${progress}%`, "info");
                    } else {
                        appendTerminalLine(`Scanning... ${progress}%`, "info");
                    }

                    if (progress >= 100) {
                        clearInterval(scanInterval);
                        if (isFr) {
                            appendTerminalLine("Scan terminé.", "success");
                            appendTerminalLine("Hôte : " + targetIp, "info");
                            appendTerminalLine("Port 22 (SSH)      - OUVERT - OpenSSH 8.9p1", "success");
                            appendTerminalLine("Port 80 (HTTP)     - OUVERT - Nginx 1.21.6 (HSTS manquant !)", "warn");
                            appendTerminalLine("Port 443 (HTTPS)   - OUVERT - Nginx 1.21.6 (TLS 1.3)", "success");
                            appendTerminalLine("Port 8080 (HTTP)   - EXPOSÉ - Apache Tomcat (Vulnérable)", "error");
                            appendTerminalLine("Recommandation : Fermer l'exposition du port 8080 et activer les redirections SSL.", "warn");
                        } else {
                            appendTerminalLine("Scan complete.", "success");
                            appendTerminalLine("Host: " + targetIp, "info");
                            appendTerminalLine("Port 22 (SSH)      - OPEN  - OpenSSH 8.9p1", "success");
                            appendTerminalLine("Port 80 (HTTP)     - OPEN  - Nginx 1.21.6 (HSTS Missing!)", "warn");
                            appendTerminalLine("Port 443 (HTTPS)   - OPEN  - Nginx 1.21.6 (TLS 1.3)", "success");
                            appendTerminalLine("Port 8080 (HTTP)   - EXPOSED - Apache Tomcat (Vulnerable)", "error");
                            appendTerminalLine("Recommendation: Terminate port 8080 exposure and enable SSL redirects.", "warn");
                        }
                        terminalInput.removeAttribute("disabled");
                        terminalInput.focus();
                    }
                }, 400);
                break;

            case "clear":
                if (terminalOutput) {
                    terminalOutput.innerHTML = "";
                    if (isFr) {
                        appendTerminalLine("Console vidée. Terminal prêt.", "success");
                    } else {
                        appendTerminalLine("Console cleared. Terminal ready.", "success");
                    }
                }
                break;

            default:
                if (isFr) {
                    appendTerminalLine(`Commande introuvable : '${primaryCmd}'. Tapez 'help' pour revoir les directives.`, "error");
                } else {
                    appendTerminalLine(`Command not found: '${primaryCmd}'. Type 'help' to review directives.`, "error");
                }
        }
    };

    // ---------------------------------------------
    // 8. Contact Form simulated logging success
    // ---------------------------------------------
    const contactForm = document.getElementById("portfolio-contact-form");
    const contactSubmitBtn = document.getElementById("contact-submit-btn");

    if (contactForm && contactSubmitBtn) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("form-name").value.trim();
            const email = document.getElementById("form-email").value.trim();
            const subject = document.getElementById("form-subject").value.trim();
            const message = document.getElementById("form-message").value.trim();
            const botcheck = document.getElementById("form-botcheck").checked;
            const isFr = currentLang === "fr";

            if (!name || !email || !message) {
                alert(isFr ? "Veuillez remplir tous les champs requis." : "Please fill in all required fields.");
                return;
            }

            // Secure submission loading effect
            contactSubmitBtn.setAttribute("disabled", "true");
            contactSubmitBtn.innerHTML = `
                <span class="material-symbols-outlined animate-spin" style="font-variation-settings: 'FILL' 0; font-size: 18px; display: inline-block;">sync</span>
                ${isFr ? "Chiffrement..." : "Encrypting..."}
            `;

            // 1. Honeypot check (bloquer silencieusement les robots spammeurs)
            if (botcheck) {
                setTimeout(() => {
                    contactSubmitBtn.removeAttribute("disabled");
                    contactSubmitBtn.innerHTML = `
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1; font-size: 18px;">send</span>
                        ${translations[currentLang]["contact.submit_btn"]}
                    `;

                    const existingFeedback = contactForm.querySelector(".secure-success-msg");
                    if (existingFeedback) existingFeedback.remove();

                    const feedbackBlock = document.createElement("div");
                    feedbackBlock.className = "secure-success-msg";
                    if (isFr) {
                        feedbackBlock.innerHTML = `
                            <div>[INFO] Initialisation du tunnel TLS v1.3... SUCCESS</div>
                            <div>[INFO] Connexion sécurisée établie avec l'hôte... SUCCESS</div>
                            <div>[INFO] Transmission du paquet chiffré (AES-GCM-256)... SUCCESS</div>
                            <div>[SUCCESS] Message transmis avec succès !</div>
                        `;
                    } else {
                        feedbackBlock.innerHTML = `
                            <div>[INFO] Initializing TLS v1.3 tunnel... SUCCESS</div>
                            <div>[INFO] Secure connection established with host... SUCCESS</div>
                            <div>[INFO] Transmitting encrypted packet (AES-GCM-256)... SUCCESS</div>
                            <div>[SUCCESS] Message successfully transmitted!</div>
                        `;
                    }

                    contactForm.appendChild(feedbackBlock);
                    contactForm.reset();
                }, 1000);
                return;
            }

            // Web3Forms Key (Get a free key instantly at https://web3forms.com/)
            const web3FormsKey = "24760234-c343-4c55-803a-68716d5d5c65";

            // Fallback warning simulation if key is not configured
            if (web3FormsKey === "VOTRE_CLE_ACCES_WEB3FORMS") {
                setTimeout(() => {
                    contactSubmitBtn.removeAttribute("disabled");
                    contactSubmitBtn.innerHTML = `
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1; font-size: 18px;">send</span>
                        ${translations[currentLang]["contact.submit_btn"]}
                    `;

                    const existingFeedback = contactForm.querySelector(".secure-success-msg");
                    if (existingFeedback) existingFeedback.remove();

                    const feedbackBlock = document.createElement("div");
                    feedbackBlock.className = "secure-success-msg";
                    if (isFr) {
                        feedbackBlock.innerHTML = `
                            <div style="color: var(--accent-yellow);">[WARNING] Mode démo actif (Clé Web3Forms non configurée)</div>
                            <div>[INFO] Initialisation du tunnel TLS v1.3... SUCCESS</div>
                            <div>[INFO] Connexion sécurisée établie avec l'hôte... SUCCESS</div>
                            <div>[INFO] Transmission du paquet chiffré (AES-GCM-256)... SUCCESS</div>
                            <div>[SUCCESS] Message transmis avec succès ! (Simulation locale)</div>
                        `;
                    } else {
                        feedbackBlock.innerHTML = `
                            <div style="color: var(--accent-yellow);">[WARNING] Demo mode active (Web3Forms Key not configured)</div>
                            <div>[INFO] Initializing TLS v1.3 tunnel... SUCCESS</div>
                            <div>[INFO] Secure connection established with host... SUCCESS</div>
                            <div>[INFO] Transmitting encrypted packet (AES-GCM-256)... SUCCESS</div>
                            <div>[SUCCESS] Message successfully transmitted! (Local simulation)</div>
                        `;
                    }

                    contactForm.appendChild(feedbackBlock);
                    contactForm.reset();
                }, 1200);
                return;
            }

            // Real submission to Web3Forms API
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: web3FormsKey,
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    botcheck: botcheck
                })
            })
                .then(async (response) => {
                    const data = await response.json();
                    if (response.status === 200) {
                        const existingFeedback = contactForm.querySelector(".secure-success-msg");
                        if (existingFeedback) existingFeedback.remove();

                        const feedbackBlock = document.createElement("div");
                        feedbackBlock.className = "secure-success-msg";
                        if (isFr) {
                            feedbackBlock.innerHTML = `
                            <div>[INFO] Initialisation du tunnel TLS v1.3... SUCCESS</div>
                            <div>[INFO] Connexion sécurisée établie avec l'hôte... SUCCESS</div>
                            <div>[INFO] Transmission du paquet chiffré (AES-GCM-256)... SUCCESS</div>
                            <div>[SUCCESS] Message transmis avec succès ! Stéphane vous répondra sous peu.</div>
                        `;
                        } else {
                            feedbackBlock.innerHTML = `
                            <div>[INFO] Initializing TLS v1.3 tunnel... SUCCESS</div>
                            <div>[INFO] Secure connection established with host... SUCCESS</div>
                            <div>[INFO] Transmitting encrypted packet (AES-GCM-256)... SUCCESS</div>
                            <div>[SUCCESS] Message successfully transmitted! Stéphane will get back to you shortly.</div>
                        `;
                        }
                        contactForm.appendChild(feedbackBlock);
                        contactForm.reset();
                    } else {
                        alert(isFr ? ("Erreur de transmission : " + (data.message || "Serveur injoignable")) : ("Transmission error: " + (data.message || "Server unreachable")));
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(isFr ? "Une erreur réseau est survenue lors de l'envoi." : "A network error occurred during submission.");
                })
                .finally(() => {
                    contactSubmitBtn.removeAttribute("disabled");
                    contactSubmitBtn.innerHTML = `
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1; font-size: 18px;">send</span>
                    ${translations[currentLang]["contact.submit_btn"]}
                `;
                });
        });
    }
});
