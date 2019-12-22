#!/usr/bin/env deno
// Copyright serverhiccups 2020
import { DatabaseHelper } from "./src/database.js";
import { generatePost, generateIndex } from "./src/generate.js";
const { args } = Deno;
let command = args;
let database = new DatabaseHelper();

/* Constants */
const OUTPUT_DIRECTORY = Deno.cwd() + '/blog/';
/* Constants */

function checkInPathAndInit() {
	if(!database.inDenoBlogPath()) {
		console.log("We are not currently running in a directory with a deno-blog directory. Have you initialised your database?");
		Deno.exit(1);
	}
	database.init();
}

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
		if(database.getConfig("useTemplates")) {
			generatePost(post, OUTPUT_DIRECTORY + post.normalisedTitle + '.' + post.id + '.html', "./deno-blog/templates.js");
		} else {

			generatePost(post, OUTPUT_DIRECTORY + post.normalisedTitle + '.' + post.id + '.html');
		}
	}
	if(database.getConfig("useTemplates")) {
		generateIndex(database.getAllPosts(), OUTPUT_DIRECTORY + 'index.html', "./deno-blog/templates.js");
	} else {
		generateIndex(database.getAllPosts(), OUTPUT_DIRECTORY + 'index.html');
	}

}

function config(commandArgs) {
	if(commandArgs[3] == undefined) {
		console.log(database.getConfig(commandArgs[2]));
	} else {
		database.setConfig(commandArgs[2], commandArgs[3]);
		database.writeDatabase();
	}
}

switch(command[1]) {
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
		generate(command);
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
