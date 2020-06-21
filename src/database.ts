// Copyright serverhiccups 2020
import { existsSync, readJsonSync, writeJsonSync, ensureDirSync, ensureFileSync } from "https://deno.land/std@v0.56.0/fs/mod.ts";

interface Post {
	id: number;
	path: string;
	title: string;
	normalisedTitle: string;
	dateString: string;
}

interface Database {
	highestId: number;
	config: any;
	posts: Post[];
}

function pad(val: string | number, length: number = 2, padChar: string = '0') {
	if(typeof val === "number") val = val.toString();
	while (val.length < length) {
		val = padChar + val;
	}
	return val;
}

class DatabaseHelper {

	database: Database;

	constructor() {
		this.database = {
			highestId: 0,
			config: {},
			posts: []
		}
	}

	init() {
		this.readDatabase();
	}

	createDatabase() {
		if(!existsSync('./deno-blog/deno-blog-database.json')) {
			ensureFileSync("./deno-blog/deno-blog-database.json");
			writeJsonSync('./deno-blog/deno-blog-database.json', {
				highestId: 0,
				posts: [],
				config: {}
			});
		}
		ensureDirSync('./deno-blog/posts/')
	}

	readDatabase() {
		this.database = readJsonSync('./deno-blog/deno-blog-database.json') as Database;
	}

	writeDatabase() {
		writeJsonSync('./deno-blog/deno-blog-database.json', this.database);
	}

	lookupPostById(id: number) { // Shitty algorithm for a shitty project.
		for (let [i, post] of this.database.posts.entries()) {
			if(post.id == id) {
				return i;
			}
		}
		return undefined;
	}

	addPost(title: string) {
		if(title === undefined) throw new Error("Cannot create post with an undefined title");
		let id = this.database.highestId + 1;
		this.database.highestId += 1;
		let path = `./deno-blog/posts/${id}.md`;
		let time = new Date();
		let normalisedTitle = title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
		ensureFileSync(path);
		let post = {
			id: id,
			path: path,
			title: title,
			normalisedTitle: normalisedTitle,
			dateString: (`${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}`)
		}
		this.database.posts.push(post);
		console.log(`Your new post is located in ${path}.`);
	}

	getAllPosts() {
		return this.database.posts;
	}

	deletePost(id: number) {
		if(this.lookupPostById(id) === undefined) return;
		this.database.posts.splice(this.lookupPostById(id) as number, 1);
	}

	inDenoBlogPath() {
		return existsSync("./deno-blog/deno-blog-database.json");	
	}

	getConfig(option: string): any {
		return this.database.config[option];
	}

	setConfig(option: string, value: any) {
		let configOptions = ["useTemplates"];
		if(!configOptions.includes(option)) console.log(`Invalid option ${option}`);
		if(value == "true") value = true;
		if(value == "false") value = false;
		this.database.config[option] = value;
	}
}

export { Database, Post, DatabaseHelper };
