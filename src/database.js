import {existsSync, readJsonSync, writeJsonSync, ensureDirSync, ensureFileSync } from "https://deno.land/std/fs/mod.ts";

function pad(string, length = 2, padChar = '0') {
	while (string.length < 2) {
		string += padChar;
	}
	return string;
}

class DatabaseHelper {
	constructor() {

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
		this.database = readJsonSync('./deno-blog/deno-blog-database.json');
	}

	writeDatabase() {
		writeJsonSync('./deno-blog/deno-blog-database.json', this.database);
	}

	lookupPostById(id) { // Shitty algorithm for a shitty project.
		for (let [i, post] of this.database.posts.entries()) {
			if(post.id == id) {
				return i;
			}
		}
		return undefined;
	}

	addPost(title) {
		let id = this.database.highestId + 1;
		this.database.highestId += 1;
		let path = `./deno-blog/posts/${id}.md`;
		let time = new Date();
		let normalisedTitle = title.toLowerCase().replace(/ /gi, "-");
		ensureFileSync(path);
		let post = {
			id: id,
			path: path,
			title: title,
			normalisedTitle: normalisedTitle,
			dateString: (`${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}`)
		}
		this.database.posts.push(post);
	}

	getAllPosts() {
		return this.database.posts;
	}

	deletePost(id) {
		this.database.posts.splice(this.lookupPostById(id), 1);
	}

	inDenoBlogPath() {
		return existsSync("./deno-blog/deno-blog-database.json");	
	}
}

export { DatabaseHelper };
