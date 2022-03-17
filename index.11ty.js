const renderTitle = () => {
  return `
    <div class="title-page">
      <h1>Ezra Reader<h1>
      <p>Transcripts from the Ezra Klein Show</p>
    </div>
  `;
};

const renderPages = (data) => {
  const allPages = data.collections.all || [];
  const interviews = allPages.filter(page => !['', 'README', 'introduction'].includes(page.fileSlug));
  const introduction = allPages.find(page => page.fileSlug === "introduction");
  const pageList = [introduction, ...interviews];
  const pageCotent = pageList.map((page, index) => {
    return `
      <div class="page ${index === pageList.length - 1 ? 'last-page' : ''}">
        ${page.data?.title ? `<h1>${page.data.title}</h1>` : ''}
        ${page.data?.authors ? `<p>${page.data.authors.join(', ')}</p>` : ''}
        ${page.data?.date ? `<p>${page.data.date}</p>` : ''}
        <div class="bar" />
        ${page.templateContent}
      </div>
    `;
  }).join('\n');

  return pageCotent
};

const binderyHTML = (data) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Ezra Reader | romellogoodman.com</title>
      <style>
        h1 {
          color: red;
        }
      </style>
    </head>
    <body>
      <div id="content">
        ${renderTitle()}
        ${renderPages(data)}
      </div>
      <script src="https://unpkg.com/bindery@2.3.0"></script>
      <script>
        Bindery.makeBook({
          content: "#content",
          rules: [
            Bindery.PageBreak({ selector: ".title-page", position: "after",  }),
            Bindery.PageBreak({ selector: ".page", position: "before", continue: "left"  }),
            Bindery.PageBreak({ selector: ".last-page", position: "after",  }),
          ],
          pageSetup: {
            size: { width: '4.25in', height: '6.875in' },
            margin: { top: '12pt', inner: '12pt', outer: '16pt', bottom: '20pt' },
          },
        });
      </script>
    </body>
  </html>
`;

module.exports = function (data) {
  const html = binderyHTML(data);

  // Sometimes you have to kick 11ty
  // collection.introduction;

  return html;
};
