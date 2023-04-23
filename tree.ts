import {
  join,
  basename,
  posix,
  resolve,
} from "https://deno.land/std@0.100.0/path/mod.ts";
import { emptyDirSync } from "https://deno.land/std@0.184.0/fs/mod.ts";

const topLevelCwdArray = Deno.cwd().split("/").slice(1, -1);

const tree = async (root: string, prefix = " ") => {
  for await (const entry of Deno.readDir(root)) {
    const filePath = Deno.realPathSync(root + "/" + entry.name);
    const entries = filePath
      .split("/")
      .filter((ele) => !topLevelCwdArray.includes(ele));
    entries.shift();

    const lastOne = entries[entries.length - 1];

    // console.log(prefix + lastOne);

    const branch = entry.name === lastOne ? " └── " : "├── ";

    // entry.nameがディレクトリでかつ、配下に何らかのファイル or ディレクトリが存在する場合
    // → prefixにbranchを追加したくない

    if (entry.isDirectory) {
      // const res = Deno.readDir(filePath);
      const res = emptyDir(filePath);
      console.log(entry.name, res);
      // for await (const _entry of res) {
      //   console.log(_entry);
      //   console.log("");
      // }
    }

    // if (entry.isDirectory && entry.name !== lastOne)
    // console.log(prefix + branch + entry.name);

    if (entry.isDirectory && entry.name !== ".git")
      await tree(filePath, prefix + branch);
  }
};

const dir = ".";
const rootDir = resolve(Deno.cwd(), String(dir)).split("/").slice(-1)[0];
console.log("├── ", rootDir);
await tree(resolve(Deno.cwd(), String(dir)));
