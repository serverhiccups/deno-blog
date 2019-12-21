// Copyright serverhiccups 2020
import { DatabaseHelper } from "./src/database.js";
import { generatePost, generateIndex } from "./src/generate.js";
const { args } = Deno;
let command = args;
let database = new DatabaseHelper();
database.init();

/* Constants */
const OUTPUT_DIRECTORY = Deno.cwd() + '/blog/';
/* Constants */

function newPost(commandArgs) {
	database.addPost(commandArgs[2]);
	database.writeDatabase();
}

function showPosts() {
	let posts = database.getAllPosts();
	for (let post of posts) {
		console.log(`Title: ${post.title}
Id: ${post.id}
Path: ${post.path}
`);
	}
}

function deletePost(commandArgs) {
	database.deletePost(commandArgs[2]);
	database.writeDatabase();
}

function generate(commandArgs) {
	let templatePath = commandArgs[2];
	for (let post of database.getAllPosts()) {
		generatePost(post, OUTPUT_DIRECTORY + post.normalisedTitle + '.' + post.id + '.html', "./deno-blog/templates.js");
	}
	generateIndex(database.getAllPosts(), OUTPUT_DIRECTORY + 'index.html', "./deno-blog/templates.js")

}

switch(command[1]) {
	case 'add':
		newPost(command);
		break;
	case 'list':
		showPosts();
		break;
	case 'delete':
		deletePost(command);
		break;
	case 'generate':
		generate(command);
		break;
	default:
		console.log("deno-blog pre-alpha v0.0.1"); // TODO: Add more documentation
}