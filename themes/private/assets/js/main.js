console.log('The archive that records everything');

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    if (codeBlock.className) {
      var highlight = codeBlock.parentElement;

      while (highlight.tagName !== 'DIV') {
        highlight = highlight.parentElement;
      }

      if (highlight) {
        var button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerText = 'Copy';

        highlight.parentNode.insertBefore(button, highlight);

        button.addEventListener('click', function () {
          var codeContent = highlight.querySelector('td.code');
          var code = codeContent
            ? codeContent.textContent
            : codeBlock.textContent;

          navigator.clipboard.writeText(code).then(
            function () {
              button.innerText = 'Copied!';
              setTimeout(function () {
                button.innerText = 'Copy';
              }, 2000);
            },
            function (error) {
              button.innerText = 'Error';
            },
          );
        });
      }
    }
  });
});
