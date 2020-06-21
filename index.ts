// Copyright serverhiccups 2020
import { DatabaseHelper } from "./src/database.ts";
import { generatePost, generateIndex } from "./src/generate.ts";
const { args } = Deno;
let command = args;
let database = new DatabaseHelper();

/* Constants */
const OUTPUT_DIRECTORY = Deno.cwd();
/* Constants */

function checkInPathAndInit() {
	if(!database.inDenoBlogPath()) {
		console.log("We are not currently running in a directory with a deno-blog directory. Have you initialised your database?");
		Deno.exit(1);
	}
	database.init();
}

function newPost(commandArgs: any) {
	database.addPost(commandArgs[1]);
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

function deletePost(commandArgs: any) {
	database.deletePost(commandArgs[1]);
	database.writeDatabase();
}

function generate() {
	for (let post of database.getAllPosts()) {
		if(database.getConfig("useTemplates")) {
			generatePost(post, OUTPUT_DIRECTORY + "/blog/" + post.normalisedTitle + '.html', Deno.cwd() + "/deno-blog/post.ejs");
		} else {
			generatePost(post, OUTPUT_DIRECTORY + "/blog/" + post.normalisedTitle + '.html');
		}
	}
	if(database.getConfig("useTemplates")) {
		generateIndex(database.getAllPosts(), OUTPUT_DIRECTORY + '/index.html', Deno.cwd() + "/deno-blog/index.ejs");
	} else {
		generateIndex(database.getAllPosts(), OUTPUT_DIRECTORY + '/index.html');
	}

}

function config(commandArgs: any) {
	if(commandArgs[2] == undefined) {
		console.log(database.getConfig(commandArgs[1]));
	} else {
		database.setConfig(commandArgs[1], commandArgs[2]);
		database.writeDatabase();
	}
}

switch(command[0]) {
	case 'add':
		checkInPathAndInit();
		newPost(command);
		break;
	case 'list':
		checkInPathAndInit();
		showPosts();
		break;
	case 'delete':
		checkInPathAndInit();
		deletePost(command);
		break;
	case 'generate':
		checkInPathAndInit();
		generate();
		break;
	case 'config':
		checkInPathAndInit();
		config(command);
	case 'init':
		database.createDatabase();
		break;
	default:
		console.log("deno-blog pre-alpha v0.0.1"); // TODO: Add more documentation
}
