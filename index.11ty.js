const typeset = require("typeset");

/**
 * noop funcs for syntax highlighting.
 * Taken From: https://github.com/fabiospampinato/noop-tag
 */
const noop = (strings, ...exp) => {
  const lastIndex = strings.length - 1;

  if ( !lastIndex ) return strings[0];

  let acc = '', part;

  for ( let i = 0; i < lastIndex; i++ ) {
    part = strings[i];

    if ( part ) acc += part;

    acc += exp[i];
  }

  part = strings[lastIndex];

  return part ? acc += part : acc;
}
const css = noop;
const html = noop;
const javascript = noop;

/**
 * render funcs
 */

const renderTitle = (data) => {
  return `
    <div class="title-page">
      <h1>Ezra Reader</h1>
      <h3>Transcripts from the Ezra Klein Show</h3>
      ${renderNotch(data)}
    </div>
  `;
};

const renderCover = (data) => {
    return `
    <div class="cover-page">
      <h3>Designed by Romello Goodman</h3>
      ${renderNotch(data)}
      <p>
        This is an open-source artbook.
       </p>
       <p>
        View online at:
        <a href="https://ezra.romellogoodman.com/">
          <span>ezra.romellogoodman.com</span>
        </a>
      </p>
      <p>
        Software available at 
        <a href="https://github.com/romellogoodman/ezra.romellogoodman.com/">
          <span>github.com/romellogoodman/ezra.romellogoodman.com</span>
        </a>
       </p>
    </div>
  `;
}

const renderNotch = (data) => {
  return html`
    <div class="notch" style="background: teal;"></div>
  `
}

const renderInterview = (content, interview) => {
  let processedContent = content.slice();
  
  interview.authors.forEach((author) => {
    const getCueHTML = cue => html`
      <div>
        <em>[${cue}]</em>
      </div>
    `;

    processedContent = processedContent.replace(/.*?\[LAUGHTER].*/g, getCueHTML('LAUGHTER'));
    processedContent = processedContent.replace(/.*?\[MUSIC PLAYING].*/g, getCueHTML('MUSIC PLAYING'));
    processedContent = processedContent.replaceAll(new RegExp(`${author.name}:`, 'g'), html`
      <span style="color: ${author.color};">
        <strong>
          ${author.shortName}:
        </strong>
      </span>
    `);
  });

  return processedContent;
}

const renderPages = (data) => {
  const allPages = data.collections.all || [];
  const interviews = allPages.filter(page => !['', 'README', 'introduction'].includes(page.fileSlug));
  const introduction = allPages.find(page => page.fileSlug === "introduction");
  const pageList = [introduction, ...interviews];
  const pageCotent = pageList.map((page, index) => {
    const isFirstInterview = index === 0 ? 'first-interview' : '';
    const isLastInterview = index === pageList.length - 1 ? 'last-interview' : '';

    return `
      <div class="interview-page ${isFirstInterview} ${isLastInterview}">
        ${page.data?.title ? html`
          <h1>${page.data.title}</h1>
        ` : ''}
        ${page.data?.authors ? html`
          <p>${page.data.authors.map(({name}) => name).join(', ')}</p>
        ` : ''}
        ${page.data?.date ? html`
          <p>${page.data.date}</p>
        ` : ''}
        ${page.data?.authors ? html`
          <svg height="10pt" width="${10 * page.data.authors.length}pt">
            ${page.data.authors.map(({color}, index) => html`
              <circle cx="${50 + 25 * index}%" cy="50%" r="25%" fill="${color}"></circle>
            `).join(', ')}
          </svg>
        ` : ''}
        ${renderNotch(data)}
        ${renderInterview(page.templateContent, page.data)}
      </div>
    `;
  }).join('\n');

  return pageCotent
};

/**
 * the verbs
 */

const js = (data) => javascript`
  Bindery.makeBook({
    content: "#content",
    rules: [
      Bindery.PageBreak({ selector: ".title-page", position: "after"}),
      Bindery.PageBreak({ selector: ".interview-page", position: "before" }),
      Bindery.PageBreak({ selector: ".cover-page", position: "before",  }),
    ],
    pageSetup: {
      size: { width: '4.25in', height: '6.875in' },
      margin: { top: '12pt', inner: '12pt', outer: '16pt', bottom: '20pt' },
    },
  });
`;

/**
 * the adjectives
 */

const styles = (data) => css`
  h1 {
    color: pink;
  }
  
  .notch {
    margin: 24pt 0pt 16pt 0pt;
    height: 8pt;
    width: 32pt;
  }
`;

/**
 * the nouns
 */

const markup = (data) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Ezra Reader | romellogoodman.com</title>
      <style>${styles(data)}</style>
    </head>
    <body>
      <div id="content">
        ${typeset(renderTitle(data))}
        ${typeset(renderPages(data))}
        ${typeset(renderCover(data))}
      </div>
      <script src="https://unpkg.com/bindery@2.3.0"></script>
      <script>${js(data)}</script>
    </body>
  </html>
`;


module.exports = function (data) {
  const html = markup(data);

  return html;
};
