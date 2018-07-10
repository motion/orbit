var marky = require('./')

console.log(marky(
  '```js\nvar i = 123;\n```\n<script>alert(1)</script>\n<img src="a.jpg" width="100" height="200"/>'
));
