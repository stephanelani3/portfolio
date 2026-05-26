document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------
    // 1. Custom Cursor Trailer Glow
    // ---------------------------------------------
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
                    if (btn) btn.textContent = "Détails";
                });

                if (!isExpanded) {
                    card.classList.add("expanded");
                    toggleBtn.querySelector("span").textContent = "Réduire";
                } else {
                    card.classList.remove("expanded");
                    toggleBtn.querySelector("span").textContent = "Détails";
                }
            });
        }
    });

    // ---------------------------------------------
    // 7. Interactive Terminal Emulator
    // ---------------------------------------------
    const terminalOutput = document.getElementById("terminal-output");
    const terminalInput = document.getElementById("terminal-input");

    const bootSequence = [
        { text: "ssh roy@sec-arch", type: "command" },
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
            line.innerHTML = `<span class="prompt">roy@sec-arch:~$</span> ${text}`;
        } else {
            line.textContent = text;
        }

        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    // Run Booting Sequence
    let bootIndex = 0;
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

        switch (primaryCmd) {
            case "help":
                appendTerminalLine("Available operations:", "info");
                appendTerminalLine("  help     - Show list of console directives", "success");
                appendTerminalLine("  cv       - Output core profile summary", "success");
                appendTerminalLine("  skills   - List technical competencies", "success");
                appendTerminalLine("  projects - Enumerate key SecOps & Dev implementations", "success");
                appendTerminalLine("  scan     - Run diagnostic scan on simulated target IP", "success");
                appendTerminalLine("  contact  - Display connectivity details", "success");
                appendTerminalLine("  clear    - Flush terminal console buffer", "success");
                break;

            case "cv":
                appendTerminalLine("--- ADJIBOLA ROY STEPHANE LANI-YONOU PROFILE ---", "info");
                appendTerminalLine("Role: IT Exploitation Cyber Engineer & Django Developer", "success");
                appendTerminalLine("Goal: Evolve to CISO / RSSI role in critical infrastructures", "success");
                appendTerminalLine("Summary: Passionné par la cybersécurité et la protection des données, j'ai complété un master en sécurité informatique qui m'a permis d'acquérir une expertise pointue en protection des systèmes et en gestion des risques numériques. Je vise à évoluer vers un poste de Responsable de la Sécurité des Systèmes d'Information (RSSI).", "info");
                break;

            case "skills":
                appendTerminalLine("--- TECHNICAL MATRIX ---", "info");
                appendTerminalLine("Tech & Dev : Django, Python, HTML/CSS, Wordpress, Flutter, Pack Office, GLPI, Moodle", "success");
                appendTerminalLine("Security & Networks : Sensibilisation à la sécurité informatique, Réseau Informatique, Gestion des Bases de Donnée", "success");
                appendTerminalLine("Soft Skills : Gestion de projets, Travail d'équipe, Gestion du temps, Adaptabilité, Polyvalence", "info");
                break;

            case "projects":
                appendTerminalLine("--- ACTIVE PROJECTS REGISTER ---", "info");
                appendTerminalLine("1. Plateforme Écosystémique Cyber, SecOps et GRC (Django, GVM/OpenVAS, RAG AI)", "success");
                appendTerminalLine("2. Système de Contrôle d'Accès Physique pour Zones Critiques (Réseau & Caméras)", "success");
                appendTerminalLine("3. Plateforme HGRC de Habilitations (Compliance & Access auditing)", "success");
                appendTerminalLine("4. Plateforme Collaborative de Transport de Colis (Crowdsourcing)", "success");
                appendTerminalLine("5. Passerelle de Recharge de Monnaie Électronique (Automations)", "success");
                appendTerminalLine("6. Outil de Traduction Automatique pour Fichiers de Localisation (.po)", "success");
                appendTerminalLine("Type 'scan' to run a vulnerability check.", "warn");
                break;

            case "contact":
                appendTerminalLine("--- SECURE CHANNELS ---", "info");
                appendTerminalLine("Email      : laniyonostephane@gmail.com", "success");
                appendTerminalLine("Phone      : +229 96 56 03 30", "success");
                appendTerminalLine("Location   : Cotonou, Bénin", "success");
                appendTerminalLine("LinkedIn   : Stéphane LANI-YONOU", "success");
                break;

            case "scan":
                let targetIp = parts[1] || "192.168.1.1";
                appendTerminalLine(`Launching network scanner target: ${targetIp}...`, "warn");
                appendTerminalLine("Scanning target ports 1-1024...", "info");

                let progress = 0;
                terminalInput.setAttribute("disabled", "true");

                const scanInterval = setInterval(() => {
                    progress += 25;
                    appendTerminalLine(`Scanning... ${progress}%`, "info");

                    if (progress >= 100) {
                        clearInterval(scanInterval);
                        appendTerminalLine("Scan complete.", "success");
                        appendTerminalLine("Host: " + targetIp, "info");
                        appendTerminalLine("Port 22 (SSH)      - OPEN  - OpenSSH 8.9p1", "success");
                        appendTerminalLine("Port 80 (HTTP)     - OPEN  - Nginx 1.21.6 (HSTS Missing!)", "warn");
                        appendTerminalLine("Port 443 (HTTPS)   - OPEN  - Nginx 1.21.6 (TLS 1.3)", "success");
                        appendTerminalLine("Port 8080 (HTTP)   - EXPOSED - Apache Tomcat (Vulnerable)", "error");
                        appendTerminalLine("Recommendation: Terminate port 8080 exposure and enable SSL redirects.", "warn");
                        terminalInput.removeAttribute("disabled");
                        terminalInput.focus();
                    }
                }, 400);
                break;

            case "clear":
                if (terminalOutput) {
                    terminalOutput.innerHTML = "";
                    appendTerminalLine("Console cleared. Terminal ready.", "success");
                }
                break;

            default:
                appendTerminalLine(`Command not found: '${primaryCmd}'. Type 'help' to review directives.`, "error");
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

            if (!name || !email || !message) {
                alert("Veuillez remplir tous les champs requis.");
                return;
            }

            // Secure submission loading effect
            contactSubmitBtn.setAttribute("disabled", "true");
            contactSubmitBtn.innerHTML = `
                <span class="material-symbols-outlined animate-spin" style="font-variation-settings: 'FILL' 0; font-size: 18px; display: inline-block;">sync</span>
                Chiffrement...
            `;

            // 1. Honeypot check (bloquer silencieusement les robots spammeurs)
            if (botcheck) {
                setTimeout(() => {
                    contactSubmitBtn.removeAttribute("disabled");
                    contactSubmitBtn.innerHTML = `
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1; font-size: 18px;">send</span>
                        Envoyer le Message
                    `;

                    const existingFeedback = contactForm.querySelector(".secure-success-msg");
                    if (existingFeedback) existingFeedback.remove();

                    const feedbackBlock = document.createElement("div");
                    feedbackBlock.className = "secure-success-msg";
                    feedbackBlock.innerHTML = `
                        <div>[INFO] Initialisation du tunnel TLS v1.3... SUCCESS</div>
                        <div>[INFO] Connexion sécurisée établie avec l'hôte... SUCCESS</div>
                        <div>[INFO] Transmission du paquet chiffré (AES-GCM-256)... SUCCESS</div>
                        <div>[SUCCESS] Message transmis avec succès !</div>
                    `;

                    contactForm.appendChild(feedbackBlock);
                    contactForm.reset();
                }, 1000);
                return;
            }

            // Web3Forms Key (Get a free key instantly at https://web3forms.com/)
            const web3FormsKey = "24760234-c343-4c55-803a-68716d5d5c65";

            // Fallback warning simulation if key is not configured
            if (web3FormsKey === "24760234-c343-4c55-803a-68716d5d5c65") {
                setTimeout(() => {
                    contactSubmitBtn.removeAttribute("disabled");
                    contactSubmitBtn.innerHTML = `
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1; font-size: 18px;">send</span>
                        Envoyer le Message
                    `;

                    const existingFeedback = contactForm.querySelector(".secure-success-msg");
                    if (existingFeedback) existingFeedback.remove();

                    const feedbackBlock = document.createElement("div");
                    feedbackBlock.className = "secure-success-msg";
                    feedbackBlock.innerHTML = `
                        <div style="color: var(--accent-yellow);">[WARNING] Mode démo actif (Clé Web3Forms non configurée)</div>
                        <div>[INFO] Initialisation du tunnel TLS v1.3... SUCCESS</div>
                        <div>[INFO] Connexion sécurisée établie avec l'hôte... SUCCESS</div>
                        <div>[INFO] Transmission du paquet chiffré (AES-GCM-256)... SUCCESS</div>
                        <div>[SUCCESS] Message transmis avec succès ! (Simulation locale)</div>
                    `;

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
                    feedbackBlock.innerHTML = `
                        <div>[INFO] Initialisation du tunnel TLS v1.3... SUCCESS</div>
                        <div>[INFO] Connexion sécurisée établie avec l'hôte... SUCCESS</div>
                        <div>[INFO] Transmission du paquet chiffré (AES-GCM-256)... SUCCESS</div>
                        <div>[SUCCESS] Message transmis avec succès ! Stéphane vous répondra sous peu.</div>
                    `;
                    contactForm.appendChild(feedbackBlock);
                    contactForm.reset();
                } else {
                    alert("Erreur de transmission : " + (data.message || "Serveur injoignable"));
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Une erreur réseau est survenue lors de l'envoi.");
            })
            .finally(() => {
                contactSubmitBtn.removeAttribute("disabled");
                contactSubmitBtn.innerHTML = `
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1; font-size: 18px;">send</span>
                    Envoyer le Message
                `;
            });
        });
    }
});
