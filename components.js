class SiteNav extends HTMLElement {
  connectedCallback() {
    const current = this.getAttribute('current') || '';

    const links = [
      { href: 'index.html#about', label: 'About', key: 'about' },
      { href: 'projects.html', label: 'Projects', key: 'projects' },
      { href: 'index.html#testimonials', label: 'References', key: 'references' },
      { href: 'index.html#contact', label: 'Contact', key: 'contact' },
    ];

    const linkMarkup = links
      .map((link) => {
        const active =
          current === link.key ||
          (current === 'home' && link.key === 'about') ||
          (current === 'projects' && link.key === 'projects');

        return `<li><a href="${link.href}"${active ? ' class="active"' : ''}>${link.label}</a></li>`;
      })
      .join('');

    this.innerHTML = `
      <header class="navbar" id="navbar">
        <div class="container nav-container">
          <a href="index.html" class="logo" aria-label="Jacob Britten home">JACOB BRITTEN</a>
          <button type="button" class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle navigation">
            <span></span><span></span><span></span>
          </button>
          <ul class="nav-links" id="nav-links">
            ${linkMarkup}
            <li><a class="resume-btn" href="Resume.pdf" download>Resume</a></li>
          </ul>
        </div>
      </header>
    `;
  }
}

class SectionLabel extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || '';
    this.innerHTML = `
      <div class="section-label">
        <span class="label-line" aria-hidden="true"></span>
        <span>${text}</span>
      </div>
    `;
  }
}

class MetricCard extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const value = this.getAttribute('value') || '';
    const detail = this.getAttribute('detail') || '';

    this.innerHTML = `
      <article class="metric-card" role="listitem">
        <p class="metric-label">${label}</p>
        <p class="metric-value">${value}</p>
        <p class="metric-detail">${detail}</p>
      </article>
    `;
  }
}

class TestimonialCard extends HTMLElement {
  connectedCallback() {
    const quote = this.getAttribute('quote') || '';
    const name = this.getAttribute('name') || '';
    const role = this.getAttribute('role') || '';

    this.innerHTML = `
      <article class="testimonial-card">
        <p class="testimonial-quote">\"${quote}\"</p>
        <p class="testimonial-name">${name}</p>
        <p class="testimonial-role">${role}</p>
      </article>
    `;
  }
}

customElements.define('site-nav', SiteNav);
customElements.define('section-label', SectionLabel);
customElements.define('metric-card', MetricCard);
customElements.define('testimonial-card', TestimonialCard);
