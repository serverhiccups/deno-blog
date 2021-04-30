// Copyright serverhiccups 2020.
import { Remarkable } from 'https://cdn.skypack.dev/remarkable';
import { ensureFileSync } from "https://deno.land/std@0.95.0/fs/mod.ts";
import { Post } from "./database.ts";
import * as dejs from 'https://deno.land/x/dejs@0.9.3/mod.ts';

async function generatePost(post: Post, outputPath: string, templatePath: string | undefined = undefined) {
	let md = new Remarkable();
	let postmd: string = Deno.readTextFileSync(post.path);
	let posthtml = md.render(postmd);
	let outputhtml: string;
	if(templatePath == undefined) {
		outputhtml = await dejs.renderToString(`<html>
	<head>
		<meta charset="utf-8">
		<title><%= post.title %></title>
	</head>
	<body>
		<%- content %>
	</body>
</html>
		`, {
			post: post,
			content: posthtml
		})
	} else {
		outputhtml = await dejs.renderFileToString(templatePath, {
		post: post,
			content: posthtml
		})
	}
	console.log(`Generated ${outputPath}`);
	ensureFileSync(outputPath);
	Deno.writeTextFileSync(outputPath, outputhtml);
}

async function generateIndex(posts: Post[], outputPath: string, templatePath: string | undefined = undefined) {
	let outputhtml: string;
	if(templatePath == undefined) {
		outputhtml = await dejs.renderToString(`<html>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<% posts.forEach((post) => { %>
			<a href="<%- post.normalisedTitle + "." + post.id + ".html" %>"><%= post.title %></a>
		<% }); %>
	</body>
</html>
		`, {
			posts: posts,
		})
	} else {
		outputhtml = await dejs.renderToString(Deno.readTextFileSync(templatePath), {
			posts: posts,
		})
	}
	console.log(`Generated ${outputPath}`)
	ensureFileSync(outputPath);
	Deno.writeTextFileSync(outputPath, outputhtml);
}

export { generatePost, generateIndex };
