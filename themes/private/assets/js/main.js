console.log('The archive that records everything');

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    if (codeBlock.className) {
      var highlight = codeBlock.parentElement;

      while (highlight.className !== 'highlight') {
        highlight = highlight.parentElement;
      }

      if (highlight) {
        var codeCopyContainer = document.createElement('div');
        codeCopyContainer.className = 'code-copy-container';

        var codeCopyButton = document.createElement('button');
        codeCopyButton.className = 'code-copy-button';
        codeCopyButton.type = 'button';
        codeCopyButton.innerText = 'Copy';

        codeCopyContainer.appendChild(codeCopyButton);

        highlight.parentNode.insertBefore(codeCopyContainer, highlight);

        codeCopyButton.addEventListener('click', function () {
          var codeContent = highlight.querySelector('td.code');
          var code = codeContent
            ? codeContent.textContent
            : codeBlock.textContent;

          navigator.clipboard.writeText(code).then(
            function () {
              codeCopyButton.innerText = 'Copied!';
              setTimeout(function () {
                codeCopyButton.innerText = 'Copy';
              }, 2000);
            },
            function (error) {
              codeCopyButton.innerText = 'Error';
            },
          );
        });
      }
    }
  });
});
