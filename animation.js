// ── CURSOR ──────────────────────────────────────────────────────
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0;
let my = 0;
let rx = 0;
let ry = 0;
document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
});
(function ac() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(ac);
})();

// ── PROGRESS BAR ────────────────────────────────────────────────
const pb = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const s = document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - innerHeight;
  pb.style.width = (s / h) * 100 + '%';
});

// ── NAV MOBILE ──────────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
function closeNavMenu() {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  document.body.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Ouvrir le menu');
}
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  navMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNavMenu));
  window.addEventListener('resize', () => {
    if (innerWidth > 960) closeNavMenu();
  });
}

// ── NAV SCROLL + ACTIVE ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 40);
  let curSec = '';
  sections.forEach((s) => {
    if (scrollY >= s.offsetTop - 100) curSec = s.id;
  });
  navAs.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + curSec);
  });
});

// ── THREE.JS ────────────────────────────────────────────────────
const cv = document.getElementById('bg-canvas');
const rnd = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
rnd.setPixelRatio(Math.min(devicePixelRatio, 2));
rnd.setSize(innerWidth, innerHeight);
const sc = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 100);
cam.position.z = 4;
const N = 2200;
const bg = new THREE.BufferGeometry();
const p = new Float32Array(N * 3);
const c = new Float32Array(N * 3);
const pal = [
  [0.49, 0.23, 0.93],
  [0.024, 0.714, 0.831],
  [0.925, 0.282, 0.6],
  [0.965, 0.62, 0.043],
];
for (let i = 0; i < N; i++) {
  p[i * 3] = (Math.random() - 0.5) * 16;
  p[i * 3 + 1] = (Math.random() - 0.5) * 16;
  p[i * 3 + 2] = (Math.random() - 0.5) * 10;
  const cl = pal[~~(Math.random() * 4)];
  c[i * 3] = cl[0];
  c[i * 3 + 1] = cl[1];
  c[i * 3 + 2] = cl[2];
}
bg.setAttribute('position', new THREE.BufferAttribute(p, 3));
bg.setAttribute('color', new THREE.BufferAttribute(c, 3));
const pts = new THREE.Points(
  bg,
  new THREE.PointsMaterial({ size: 0.032, vertexColors: true, transparent: true, opacity: 0.78 })
);
sc.add(pts);
[
  [0.65, 0x7c3aed, 3, -0.5, -2],
  [0.45, 0x06b6d4, -2.5, 0.8, -2.5],
  [0.55, 0xec4899, 2.8, 1.2, -3],
  [0.35, 0x8b5cf6, -2, -1.5, -2],
].forEach(([s, col, x, y, z]) => {
  const m = new THREE.Mesh(
    new THREE.IcosahedronGeometry(s, 1),
    new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.14 })
  );
  m.position.set(x, y, z);
  sc.add(m);
});
let mo = { x: 0, y: 0 };
addEventListener('mousemove', (e) => {
  mo.x = (e.clientX / innerWidth - 0.5) * 2;
  mo.y = -(e.clientY / innerHeight - 0.5) * 2;
});
addEventListener('resize', () => {
  cam.aspect = innerWidth / innerHeight;
  cam.updateProjectionMatrix();
  rnd.setSize(innerWidth, innerHeight);
});
const clk = new THREE.Clock();
(function anim() {
  requestAnimationFrame(anim);
  const t = clk.getElapsedTime();
  pts.rotation.y = t * 0.025;
  pts.rotation.x = t * 0.012;
  sc.children.filter((ch) => ch.isMesh).forEach((m, i) => {
    m.rotation.y = t * (0.18 + i * 0.07);
    m.rotation.x = t * (0.09 + i * 0.04);
  });
  cam.position.x += (mo.x * 0.18 - cam.position.x) * 0.04;
  cam.position.y += (mo.y * 0.18 - cam.position.y) * 0.04;
  cam.lookAt(sc.position);
  rnd.render(sc, cam);
})();

// ── TYPEWRITER ──────────────────────────────────────────────────
const phrases = [
  'Développeuse web et mobile',
  'Designer UI/UX',
  'Analyste Programmeur',
  'Web Designer',
  'Designer Graphiste',
];
let pi = 0;
let ci = 0;
let dl = false;
const tw = document.getElementById('tw');
(function type() {
  const ph = phrases[pi];
  if (!dl) {
    tw.textContent = ph.slice(0, ++ci);
    if (ci === ph.length) {
      dl = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    tw.textContent = ph.slice(0, --ci);
    if (ci === 0) {
      dl = false;
      pi = (pi + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
  }
  setTimeout(type, dl ? 40 : 62);
})();

// ── COUNTER ANIMATION ────────────────────────────────────────────
function animateCounters(container) {
  container.querySelectorAll('[data-target]').forEach((el) => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.round(target * ease) + (prog === 1 ? suffix : '');
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ── SCROLL REVEAL + SKILLS + COUNTERS ───────────────────────────
let countersTriggered = false;
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('on');
      e.target.querySelectorAll('.bc-bar-fill').forEach((b) =>
        setTimeout(() => {
          b.style.width = b.dataset.w + '%';
        }, 180)
      );
      e.target.querySelectorAll('.bc-ring-fg').forEach((r) => {
        const pct = +r.dataset.pct;
        const circ = 2 * Math.PI * 30;
        setTimeout(() => {
          r.style.strokeDashoffset = circ * (1 - pct / 100);
        }, 230);
      });
      if (!countersTriggered && e.target.querySelectorAll('[data-target]').length) {
        countersTriggered = true;
        animateCounters(document);
      }
    });
  },
  { threshold: 0.07 }
);
document.querySelectorAll('.rv,.rvl,.rvr,.rv-stagger').forEach((el) => obs.observe(el));

const bentObs = new IntersectionObserver(
  (e) => {
    e.forEach((en) => {
      if (en.isIntersecting) {
        document.querySelectorAll('.bc-bar-fill').forEach((b) =>
          setTimeout(() => {
            b.style.width = b.dataset.w + '%';
          }, 200)
        );
        document.querySelectorAll('.bc-ring-fg').forEach((r) => {
          const pct = +r.dataset.pct;
          const circ = 2 * Math.PI * 30;
          setTimeout(() => {
            r.style.strokeDashoffset = circ * (1 - pct / 100);
          }, 260);
        });
      }
    });
  },
  { threshold: 0.1 }
);
const sk = document.getElementById('skills');
if (sk) bentObs.observe(sk);

setTimeout(() => animateCounters(document), 1000);

// ── MODAL DATA ──────────────────────────────────────────────────
const PROJECTS = {
  dev: {
    title: 'Développement Web & Mobile',
    sub: 'Applications et logiciels sur mesure',
    items: [
      {
        icon: 'monitor',
        bg: 'linear-gradient(135deg,#130828,#071838)',
        tag: 'Projet Scolaire - ISTA_CONNECT',
        title: "RÉSEAU SOCIAL SIMPLIFIÉ POUR ÉTUDIANTS - Lien: https://social-media-32dd0.web.app/",
        desc: "Clone simplifié d'un réseau social centrée sur feed et interactions : création de profil (avatar, bio), posts (texte + image URL), feed avec infinite scroll, likes, commentaires, follow/unfollow, notifications, recherche d’utilisateurs et authentification. Bonus : hashtags cliquables, prévisualisation OpenGraph et messagerie privée basique.",
        stack: ['Angular', 'Firebase', 'OpenGraph'],
        img: 'image/ista_connect.png',
      },
      {
        icon: 'package',
        bg: 'linear-gradient(135deg,#071838,#0d0828)',
        tag: 'CinéScan - Projet Scolaire',
        title: 'Application de recherche de films et séries par texte ou image.',
        desc: 'Une Application de recherche fluide par texte ou image, avec recommandations authentiques par IA, avis partagés et découvertes personnalisées pour centraliser tout l’univers ciné au même endroit.',
        stack: ['Flutter', 'ML KIT', 'Firebase', 'THE MOVIE DB - API'],
        img: 'image/CineSCan.png',
      },
      {
        icon: 'smartphone',
        bg: 'linear-gradient(135deg,#0e0628,#071838)',
        tag: 'Application web de gestion de multisociétés  ',
        title: 'GESTICOM',
        desc: 'Un outil de gestion de multisociétés pour les entreprises de ventes et de logistique, avec une interface utilisateur moderne et intuitive.',
        stack: ['Laravel', 'MySQL', 'Tailwind CSS','Bootstrap','JavaScript','DataTables','CSS'],
        img: 'image/logo.jpg',
      },
      // {
      //   icon: 'shopping-cart',
      //   bg: 'linear-gradient(135deg,#130828,#0a1428)',
      //   tag: 'E-Commerce',
      //   title: 'Boutique en ligne + tableau de bord',
      //   desc: 'Plateforme e-commerce complète avec gestion produits, panier, paiement en ligne et panel d\'administration WordPress.',
      //   stack: ['WordPress', 'WooCommerce', 'MySQL'],
      //   img: null,
      // },
    ],
  },
  design: {
    title: 'Conception Graphique',
    sub: 'Identités visuelles, logos et supports print',
    items: [
      {
        icon: 'pen-line',
        bg: 'linear-gradient(135deg,#200830,#120420)',
        tag: 'Logo & Identité',
        title: 'Branding complet - AvocApp',
        desc: "Création de l'identité visuelle complète d'une Application juridique : logo, charte graphique, business cards, signature email.",
        stack: ['Illustrator', 'Figma'],
        img: 'image/AvocApp.png',
      },
      {
        icon: 'pen-line',
        bg: 'linear-gradient(135deg,#200830,#120420)',
        tag: 'Logo & Identité',
        title: 'Logo - GESTICOM',
        desc: "Création dU logo pour une entreprise de gestion de multisociétés.",
        stack: ['Illustrator', 'Figma'],
        img: 'image/logo.jpg',
      },
      {
        icon: 'sparkles',
        bg: 'linear-gradient(135deg,#1a0530,#220830)',
        tag:'Logo & Identité',
        title: 'Branding complet - Ekalan',
        desc: "Création de l'identité visuelle complète d'une plateforme d'e-learning : logo, charte graphique, business cards, signature email.",
        stack: ['Illustrator', 'Figma'],
        img: 'image/ekalan.png',
      },
      {
        icon: 'sparkles',
        bg: 'linear-gradient(135deg,#1a0530,#220830)',
        tag:'Plaquette d\'entreprise - V1',
        title: 'Flyers & Affiches événementielles',
        desc: "Création d'une plaquette d'entreprise pour une entreprise Tech.",
        stack: ['Illustrator', 'Figma'],
        
        img: 'image/Flyer Final.png',
      },
      {
        icon: 'sparkles',
        bg: 'linear-gradient(135deg,#1a0530,#220830)',
        tag:'Plaquette d\'entreprise - V2',
        title: 'Flyers & Affiches événementielles',
        desc: "Création d'une plaquette d'entreprise pour une entreprise Tech.",
        stack: ['Illustrator', 'Figma'],
        
        img: 'image/Flyer Final-1.png',
      },
      {
        icon: 'store',
        bg: 'linear-gradient(135deg,#120420,#1e0530)',
        tag: 'Site e-commerce',
        title: 'Refonte de site e-commerce',
        desc: "Réfonte du site e-commerce de la boutique en ligne de la marque 'Shopmoi'.",
        stack: ['Illustrator', 'Photoshop'],
        img: 'image/shopmoi.png',
      },
      {
        icon: 'share-2',
        bg: 'linear-gradient(135deg,#200830,#0e0428)',
        tag: 'Social Media',
        title: 'Kit réseaux sociaux  de l\' application ikaFood',
        desc: "Création d'un kit complet de visuels pour réseaux sociaux : templates posts, stories, bannières et avatars.",
        stack: ['Figma', 'Photoshop', 'Illustrator'],
        img:'image/ikafood.png',
      },
      {
        icon: 'share-2',
        bg: 'linear-gradient(135deg,#200830,#0e0428)',
        tag: 'Social Media',
        title: 'Kit réseaux sociaux — MaliTourist',
        desc: "Création d'un kit complet de visuels pour réseaux sociaux : templates posts, stories, bannières et avatars.",
        stack: ['Figma', 'Photoshop'],
        img:'image/MaliTourist.png',
      },
      {
        icon: 'share-2',
        bg: 'linear-gradient(135deg,#200830,#0e0428)',
        tag: 'Social Media',
        title: 'Kit réseaux sociaux — PetPals',
        desc: "Création d'un kit complet de visuels pour réseaux sociaux : templates posts, stories, bannières et avatars.",
        stack: ['Figma', 'Photoshop', 'Canva Pro'],
        img:'image/PetPals.png',
      },
      {
        icon: 'share-2',
        bg: 'linear-gradient(135deg,#200830,#0e0428)',
        tag: 'Logo & Identité',
        title: 'Site vitrine — Enviro 2',
        desc: "Création d'un logo pour un site vitrine pour une entreprise de recyclage et de revalorisation des matériaux.",
        stack: ['Figma', 'Photoshop', 'Canva Pro'],
        img:'image/portfolio-4.png',
      },
      
    ],
  },
  ux: {
    title: 'UI / UX Design',
    sub: 'Maquettes, prototypes et systèmes de design',
    items: [
      {
        icon: 'layout',
        bg: 'linear-gradient(135deg,#061622,#0e0628)',
        tag: 'Site e-commerce',
        title: 'Site e-commerce pour une boutique en ligne',
        desc: "Design complet d'une interface de site e-commerce pour une boutique en ligne.",
        stack: ['Figma'],
        img: 'image/Présentation.jpg',
      },
      {
        icon: 'book-open',
        bg: 'linear-gradient(135deg,#071828,#061422)',
        tag: 'Application Mobile',
        title: 'App sur la religion islamique',
        desc: 'Design UX de A à Z — user flows, wireframes basse fidélité, maquettes haute fidélité et tests utilisateurs.',
        stack: ['Figma'],
        img: 'image/slide Alislam.png',
      },
      {
        icon: 'shopping-bag',
        bg: 'linear-gradient(135deg,#0e0628,#081820)',
        tag: 'Application mobile',
        title: 'Refonte boutique en ligne',
        desc: "Audit UX et redesign complet — amélioration du tunnel d'achat et du taux de conversion.",
        stack: ['Figma', 'Hotjar', 'Notion'],
        img: 'image/slide mobile.png',
      },
      {
        icon: 'graduation-cap',
        bg: 'linear-gradient(135deg,#061622,#0c0522)',
        tag: 'Application mobile',
        title: "Plateforme de vente des produits maraichage en ligne",
        desc: 'Système de design complet pour une LMS — composants réutilisables, tokens design et guide de style.',
        stack: ['Figma', 'Storybook', 'Zeroheight'],
        img: 'image/bisènè.png',
      },
      {
        icon: 'share-2',
        bg: 'linear-gradient(135deg,#200830,#0e0428)',
        tag: 'Application de finance - Projet Personnelle',
        title: 'Application de finance - Projet Personnelle',
        desc: " Création d'une application de finance pour un projet personnelle.",
        stack: ['Figma'],
        img:'image/FinanceApp.png',
      },
      {
        icon: 'share-2',
        bg: 'linear-gradient(135deg,#200830,#0e0428)',
        tag: 'Charte graphique',
        title: 'Charte graphique ',
        desc: "Création d'un charte graphique d'une application mobile pour une entreprise.",
        stack: ['Figma'],
        img:'image/charte.png',
      },
    ],
  },
};

function openModal(cat) {
  const data = PROJECTS[cat];
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-sub').textContent = data.sub;
  const body = document.getElementById('modal-body');
  body.innerHTML = data.items
    .map(
      (it, idx) => `
    <div class="modal-item modal-item-enter" style="transition-delay:${idx * 0.08}s">
      <div class="modal-item-thumb" style="background:${it.bg}" data-preview-cat="${cat}" data-preview-idx="${idx}">
        ${
          it.img
            ? `<img src="${it.img}" alt="${it.title}" class="modal-thumb-img">`
            : `<span class="modal-thumb-icon ico">${icon(it.icon)}</span>`
        }
        <div class="modal-item-thumb-zoom ico" aria-hidden="true">${icon('expand')}</div>
      </div>
      <div class="modal-item-body">
        <div class="modal-item-tag">${it.tag}</div>
        <h4>${it.title}</h4>
        <p>${it.desc}</p>
        <div class="modal-item-stack">${it.stack.map((s) => `<span class="stack-tag">${s}</span>`).join('')}</div>
        <span class="modal-item-link" data-preview-cat="${cat}" data-preview-idx="${idx}">Voir l'aperçu →</span>
      </div>
    </div>
  `
    )
    .join('');
  body.scrollTop = 0;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    body.querySelectorAll('.modal-item').forEach((el) => {
      el.classList.add('modal-item-visible');
    });
  }, 30);
}

function closeModalForce() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function openLightbox(cat, idx) {
  const it = PROJECTS[cat].items[idx];
  const lb = document.getElementById('lightbox');
  const lbc = document.getElementById('lightbox-content');
  if (it.img) {
    lbc.innerHTML = `<img src="${it.img}" alt="${it.title}">`;
  } else {
    lbc.innerHTML = `
      <div class="lightbox-placeholder">
        <div class="lightbox-placeholder-icon ico">${icon(it.icon)}</div>
        <div class="lightbox-placeholder-tag">${it.tag}</div>
        <div class="lightbox-placeholder-title">${it.title}</div>
        <div class="lightbox-placeholder-stack">${it.stack.map((s) => `<span class="stack-tag">${s}</span>`).join('')}</div>
        <div class="lightbox-placeholder-desc">${it.desc}</div>
      </div>`;
  }
  document.getElementById('lightbox-caption').textContent = it.title + ' · ' + it.tag;
  lb.classList.add('open');
}

function closeLightboxForce() {
  document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('click', (e) => {
  const scrollContact = e.target.closest('[data-scroll-to="contact"]');
  if (scrollContact) {
    e.preventDefault();
    closeNavMenu();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const scrollProjects = e.target.closest('[data-scroll-to="projects"]');
  if (scrollProjects) {
    e.preventDefault();
    closeNavMenu();
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const projCard = e.target.closest('.proj-card[data-category]');
  if (projCard) {
    openModal(projCard.dataset.category);
    return;
  }
  const previewThumb = e.target.closest('.modal-item-thumb[data-preview-cat]');
  if (previewThumb) {
    openLightbox(previewThumb.dataset.previewCat, +previewThumb.dataset.previewIdx);
    return;
  }
  const previewLink = e.target.closest('.modal-item-link[data-preview-cat]');
  if (previewLink) {
    e.preventDefault();
    openLightbox(previewLink.dataset.previewCat, +previewLink.dataset.previewIdx);
    return;
  }
});

const modalEl = document.getElementById('modal');
modalEl.addEventListener('click', (e) => {
  if (e.target === modalEl) closeModalForce();
});
modalEl.querySelector('.modal-close').addEventListener('click', closeModalForce);

const lightboxEl = document.getElementById('lightbox');
lightboxEl.addEventListener('click', (e) => {
  if (e.target === lightboxEl) closeLightboxForce();
});
lightboxEl.querySelector('.lightbox-close').addEventListener('click', closeLightboxForce);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightboxForce();
    closeModalForce();
  }
});

document.querySelectorAll('.avatar-fallback-img').forEach((img) => {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    const next = this.nextElementSibling;
    if (next) next.style.display = 'flex';
  });
});
