// Configuración del Estudio Contable Lucero Victoria
// Para recibir correos de contacto reales, regístrate gratis en web3forms.com y pega tu Access Key aquí:
const WEB3FORMS_ACCESS_KEY = "7791c6d3-48c3-401c-a7dd-95f216ea3234";

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const contactForm = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');
    const faqQuestions = document.querySelectorAll('.faq-question');

    // Selectores para Menú Móvil
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('#nav-menu a');

    // 1. Cambiar estilo del Navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Menú Hamburguesa Móvil (Apertura y Auto-cierre al clickear enlace)
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 3. Interactividad de las Preguntas Frecuentes (Accordion)
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.parentElement;
            const answer = currentItem.querySelector('.faq-answer');

            // Cerrar las otras preguntas por si hay alguna abierta
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Alternar el estado de la pregunta actual
            currentItem.classList.toggle('active');

            if (currentItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // 4. Control del envío del Formulario de Contacto (Web3Forms / Fallback Simulación)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitar recarga

            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const tipoCliente = document.getElementById('tipo-cliente').value;
            const mensaje = document.getElementById('mensaje').value;

            // Cambiar estado visual del botón
            const btnSubmit = contactForm.querySelector('.btn-submit');
            const originalBtnText = btnSubmit.textContent;
            btnSubmit.textContent = "Enviando mensaje...";
            btnSubmit.disabled = true;

            // Caso A: Simulación de prueba (si no se ha configurado la clave)
            if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
                setTimeout(() => {
                    btnSubmit.textContent = originalBtnText;
                    btnSubmit.disabled = false;

                    formResponse.innerHTML = `¡Gracias, <strong>${nombre}</strong>! Tu mensaje ha sido recibido con éxito en la simulación. <br><span style="font-size: 13px; font-weight: normal; opacity: 0.85;">(Nota: Configura tu clave de Web3Forms en script.js para recibir correos reales).</span>`;
                    formResponse.className = "form-response-message success";
                    formResponse.classList.remove('hidden');
                    contactForm.reset();
                }, 1000);
                return;
            }

            // Caso B: Envío real a la API de Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name: nombre,
                    email: correo,
                    subject: `Nueva Consulta de Cliente: ${nombre}`,
                    message: `Nombre/Razón Social: ${nombre}\nCorreo: ${correo}\nTipo de Asesoría: ${tipoCliente}\n\nMensaje:\n${mensaje}`
                })
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status === 200) {
                        formResponse.innerHTML = `¡Gracias, <strong>${nombre}</strong>! Hemos recibido tu mensaje. Nos comunicaremos contigo a la brevedad.`;
                        formResponse.className = "form-response-message success";
                        contactForm.reset();
                    } else {
                        console.error("Error API:", json);
                        formResponse.textContent = json.message || "Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.";
                        formResponse.className = "form-response-message error";
                    }
                })
                .catch(error => {
                    console.error("Error de conexión:", error);
                    formResponse.textContent = "Error de red. Por favor, verifica tu conexión a internet e intenta de nuevo.";
                    formResponse.className = "form-response-message error";
                })
                .then(() => {
                    btnSubmit.textContent = originalBtnText;
                    btnSubmit.disabled = false;
                    formResponse.classList.remove('hidden');
                });
        });
    }

    // 5. Diálogo Modal de Políticas de Privacidad
    const abrirPrivacidad = document.getElementById('abrir-privacidad');
    const cerrarPrivacidad = document.getElementById('cerrar-privacidad');
    const modalPrivacidad = document.getElementById('modal-privacidad');

    if (abrirPrivacidad && cerrarPrivacidad && modalPrivacidad) {
        abrirPrivacidad.addEventListener('click', (e) => {
            e.preventDefault();
            modalPrivacidad.showModal();
        });

        cerrarPrivacidad.addEventListener('click', () => {
            modalPrivacidad.close();
        });

        // Cerrar dialog al dar clic fuera de su contenido (en el backdrop blur)
        modalPrivacidad.addEventListener('click', (e) => {
            const rect = modalPrivacidad.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                modalPrivacidad.close();
            }
        });
    }

    // 6. Scrollspy (Resaltar enlace del Navbar activo en el scroll)
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Un desfase de 150px para activar el menú justo antes
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 7. IntersectionObserver para efectos Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Dejar de observar una vez revelado
                }
            });
        }, {
            threshold: 0.15
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    console.log("Estudio Contable Lucero Victoria - Sitio Web Inicializado y Optimizado.");
});



/*
 Test contact form validation (empty submission and filled submission)
 Test mobile responsiveness (resize to 375px, test hamburger menu and drawer links)
 Summarize findings
 */