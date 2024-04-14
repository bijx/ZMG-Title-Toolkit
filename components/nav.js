document.addEventListener("DOMContentLoaded", function() {
  const navElement = document.getElementById('navigation');
  const pages = [
      { name: "Subtitle Builder", link: "index.html" },
      { name: "Intro Title Builder", link: "intro.html" },
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
      if (currentPath === page.link) {
          navHTML += `<li class="active"><span>${page.name}</span></li>`;
      } else {
          navHTML += `<li><a href="${page.link}">${page.name}</a></li>`;
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
