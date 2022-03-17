const renderTitle = () => {
  return `
    <div class="title-page">
      <h1>Ezra Reader<h1>
      <p>Transcripts from the Ezra Klein Show</p>
    </div>
  `;
};

const renderPages = (data) => {
  const allPages = data.collections.all || []
  const interviews = allPages.filter(page => !['', 'README', 'introduction'].includes(page.fileSlug));
  const introduction = allPages.find(page => page.fileSlug === "introduction");
  const pageCotent = [introduction, ...interviews].map(page => {
    console.log(page._templateContent)

    return `
      <div class="page">
        ${page._templateContent}
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
            Bindery.PageBreak({ selector: ".title-page", position: "after" }),
            Bindery.PageBreak({ selector: ".page", position: "before", continue: "left"  }),
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
