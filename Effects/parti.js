document.addEventListener('DOMContentLoaded', () => {
    window.createParticles = function(containerId, options) {
        const defaults = {
            particleSize: 8,
            particleSpacingX: 100,
            particleSpacingY: 100,
            attractionStrength: 0.01,
            attractionDistanceThreshold: Infinity,
            maxSpeed: 2,
            wrapAroundEdges: true,
            backgroundColor: 'transparent',
            particleColor: '#3498db',
            particleOpacity: 1,
            mouse: true,
            initialAttractionX: window.innerWidth / 2,
            initialAttractionY: window.innerHeight / 2
        };

        const settings = Object.assign({}, defaults, options);
        const particleContainer = document.getElementById(containerId);
        if (!particleContainer) {
            console.error(`Container element with id "${containerId}" not found`);
            return;
        }

        const particles = [];
        let mouseX = settings.initialAttractionX;
        let mouseY = settings.initialAttractionY;

        // Set container styles
        particleContainer.style.backgroundColor = settings.backgroundColor;

        function createParticle(x, y) {
            const particle = {
                x,
                y,
                vx: 0,
                vy: 0,
                element: document.createElement('div')
            };
            particle.element.classList.add('particle');
            particle.element.style.width = `${settings.particleSize}px`;
            particle.element.style.height = `${settings.particleSize}px`;
            particle.element.style.backgroundColor = settings.particleColor;
            particle.element.style.opacity = settings.particleOpacity;
            particleContainer.appendChild(particle.element);
            return particle;
        }

        // Create particles
        for (let x = 0; x < window.innerWidth + 1; x += settings.particleSpacingX) {
            for (let y = 0; y < window.innerHeight + 1; y += settings.particleSpacingY) {
                particles.push(createParticle(x, y));
            }
        }

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        function updateParticles() {
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];

                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < settings.attractionDistanceThreshold) {
                    const ax = settings.attractionStrength * dx / distance;
                    const ay = settings.attractionStrength * dy / distance;

                    particle.vx += ax;
                    particle.vy += ay;
                }

                const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (speed > settings.maxSpeed) {
                    particle.vx = (particle.vx / speed) * settings.maxSpeed;
                    particle.vy = (particle.vy / speed) * settings.maxSpeed;
                }

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (settings.wrapAroundEdges) {
                    if (particle.x < 0) particle.x = window.innerWidth;
                    if (particle.x > window.innerWidth) particle.x = 0;
                    if (particle.y < 0) particle.y = window.innerHeight;
                    if (particle.y > window.innerHeight) particle.y = 0;
                }

                particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
            }
            // Schedule the next update
            requestAnimationFrame(updateParticles);
        }

        // Start the animation loop
        requestAnimationFrame(updateParticles);
    }

    // Automatically create particles on load (optional)
});
