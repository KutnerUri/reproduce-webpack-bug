module.exports = function html(title = 'example project') {
	return () => `
	<!DOCTYPE html>
	<html lang="en">
	  <head>
		<meta charset="utf-8">
		<title>${title}</title>
		<!-- minimal css resets -->
		<style> html { height: 100%; } body { margin: 0; height: 100%; } #root { height: 100%; } </style>
	  </head>
	  <body>
		<div id="root"></div>
	  </body>
	</html>  
	`;
};
