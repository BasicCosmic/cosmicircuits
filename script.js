document.addEventListener('DOMContentLoaded', () => {

	// --- Mobile Menu Toggle ---
	const mobileBtn = document.querySelector('.mobile-menu-btn');
	const navLinks = document.querySelector('.nav-links');

	mobileBtn.addEventListener('click', () => {
		navLinks.classList.toggle('active');
	});

	// --- Intersection Observer for Scroll Animations ---
	const revealElements = document.querySelectorAll('.reveal');
	const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

	const revealOnScroll = new IntersectionObserver(function (entries, observer) {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('active');
			observer.unobserve(entry.target);
		});
	}, revealOptions);

	revealElements.forEach(el => revealOnScroll.observe(el));

	// --- FAQ Accordion ---
	const faqItems = document.querySelectorAll('.faq-item');

	faqItems.forEach(item => {
		const toggle = item.querySelector('.faq-toggle');
		const content = item.querySelector('.faq-content');

		toggle.addEventListener('click', () => {
			const isActive = item.classList.contains('active');

			// Close all others
			faqItems.forEach(otherItem => {
				otherItem.classList.remove('active');
				otherItem.querySelector('.faq-content').style.maxHeight = null;
			});

			// Toggle current
			if (!isActive) {
				item.classList.add('active');
				content.style.maxHeight = content.scrollHeight + "px";
			}
		});
	});

	// --- Interactive Node Network Canvas (Cosmic Circuits) ---
	const canvas = document.getElementById('network-canvas');
	const ctx = canvas.getContext('2d');

	let width, height;
	let particles = [];

	const mouse = { x: null, y: null, radius: 150 };

	window.addEventListener('mousemove', (e) => {
		mouse.x = e.x;
		mouse.y = e.y;
	});

	window.addEventListener('mouseout', () => {
		mouse.x = undefined;
		mouse.y = undefined;
	});

	function resize() {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
	}

	window.addEventListener('resize', () => {
		resize();
		initParticles();
	});

	class Particle {
		constructor(x, y, dx, dy, size) {
			this.x = x;
			this.y = y;
			this.dx = dx;
			this.dy = dy;
			this.size = size;
			this.baseX = this.x;
			this.baseY = this.y;
			this.density = (Math.random() * 30) + 1;
		}
		// In Particle class draw()
		draw() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			// Add a slight "glow" to stars
			ctx.shadowBlur = 5;
			ctx.shadowColor = 'rgba(0, 229, 181, 0.5)';
			ctx.fillStyle = `rgba(0, 229, 181, ${Math.random() * 0.5 + 0.5})`; // Twinkle effect
			ctx.fill();
			ctx.shadowBlur = 0; // Reset for performance
		}


		// Increase the distance but lower the opacity so they look like faint constellations
		

		update() {
			// Connect to mouse interactions
			if (mouse.x != null) {
				let dx = mouse.x - this.x;
				let dy = mouse.y - this.y;
				let distance = Math.sqrt(dx * dx + dy * dy);
				let forceDirectionX = dx / distance;
				let forceDirectionY = dy / distance;
				let maxDistance = mouse.radius;
				let force = (maxDistance - distance) / maxDistance;
				let directionX = forceDirectionX * force * this.density;
				let directionY = forceDirectionY * force * this.density;

				if (distance < mouse.radius) {
					this.x -= directionX;
					this.y -= directionY;
				} else {
					if (this.x !== this.baseX) {
						let dx = this.x - this.baseX;
						this.x -= dx / 10;
					}
					if (this.y !== this.baseY) {
						let dy = this.y - this.baseY;
						this.y -= dy / 10;
					}
				}
			}

			// Drift slowly
			this.baseX += this.dx;
			this.baseY += this.dy;

			// Bounce off edges
			if (this.baseX < 0 || this.baseX > width) this.dx = -this.dx;
			if (this.baseY < 0 || this.baseY > height) this.dy = -this.dy;

			this.x = this.baseX;
			this.y = this.baseY;

			this.draw();
		}
	}

	function initParticles() {
		particles = [];
		let numberOfParticles = (width * height) / 9000;
		for (let i = 0; i < numberOfParticles; i++) {
			let size = (Math.random() * 2) + 0.5;
			let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
			let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
			let dx = (Math.random() - 0.5) * 0.5;
			let dy = (Math.random() - 0.5) * 0.5;
			particles.push(new Particle(x, y, dx, dy, size));
		}
	}

	function connectParticles() {
		let opacityValue = 1;
		for (let a = 0; a < particles.length; a++) {
			for (let b = a; b < particles.length; b++) {
				let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
					+ ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
				if (distance < (width / 5) * (height / 5)) {
					opacityValue = 1 - (distance / 35000);
					ctx.strokeStyle = `rgba(148, 163, 184, ${opacityValue * 0.08})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(particles[a].x, particles[a].y);
					ctx.lineTo(particles[b].x, particles[b].y);
					ctx.stroke();
				}
			}
		}
	}

	function animate() {
		requestAnimationFrame(animate);
		ctx.clearRect(0, 0, innerWidth, innerHeight);
		for (let i = 0; i < particles.length; i++) {
			particles[i].update();
		}
		connectParticles();
	}

	// Init
	resize();
	initParticles();
	animate();
});