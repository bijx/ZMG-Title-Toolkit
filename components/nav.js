document.addEventListener("DOMContentLoaded", function() {
  const navElement = document.getElementById('navigation');
const pages = [
        { name: "Subtitle Builder", link: "index.html", isBeta: false },
        { name: "System Chat Builder", link: "chat.html", isBeta: false },
        { name: "AAN Article Maker", link: "article.html", isBeta: true },
];

  let navHTML = `
      <div class="logo">
          <span class="material-icons" style="padding-right: 4px;">build</span>
          <span>Arma III Title Toolkit</span>
      </div>
      <ul class="nav-links">
  `;

  let currentPath = window.location.pathname.split("/").pop();
  if (!currentPath) currentPath = "index.html";

  pages.forEach(page => {
    let linkHTML = `<a href="${page.link}">${page.name}${page.isBeta ? '<span class="beta-chip">BETA</span>' : ''}</a>`;

    if (currentPath === page.link) {
        navHTML += `<li class="active"><span class="active-span">${page.name}</span>${page.isBeta ? '<span class="beta-chip">BETA</span>' : ''} </li>`;
    } else {
        navHTML += `<li>${linkHTML}</li>`;
    }
});


  navHTML += `
      </ul>
      <div class="nav-footer">
          <button class="back-button" onclick="window.location.href = 'https://zeusmissiongen.com';">Back to ZMG</button>
      </div>
  `;

  navElement.innerHTML = navHTML;
});
