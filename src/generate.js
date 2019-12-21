import { Remarkable } from 'https://cdn.pika.dev/remarkable/^2.0.0';
import { ensureFileSync, ensureDirSync, readFileStrSync, writeFileStrSync } from "https://deno.land/std/fs/mod.ts";

function splitTemplate(template) {
	return template.split("--");
}

async function generatePost(post, outputPath, templatePath = undefined) {
	let template;
	if(templatePath == undefined) {
		template = (post, markdown) => {
			return markdown;
		}
	} else {
		template = (await import(Deno.cwd() + '/' + templatePath)).postTemplate;
	}
	let md = new Remarkable();
	let postmd = readFileStrSync(post.path);
	let posthtml = md.render(postmd);
	posthtml = template(post, posthtml);
	console.log(`outputPath is ${outputPath}`);
	ensureFileSync(outputPath);
	writeFileStrSync(outputPath, posthtml);
}

async function generateIndex(posts, outputPath, templatePath = undefined) {
	let template;
	if(templatePath == undefined) {
		template = (posts) => {
			return `<div>` +
			posts.map((post) => {
				return `<h1>${post.title}</h1>`;
			}).join("\n") +
				`</div>`;
		}
	} else {
		template = (await import(Deno.cwd() + '/' + templatePath)).indexTemplate;
	}
	let indexhtml = template(posts);
	ensureFileSync(outputPath);
	writeFileStrSync(outputPath, indexhtml);
}

export { generatePost, generateIndex };
