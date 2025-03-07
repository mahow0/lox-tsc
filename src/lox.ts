import * as fs from 'fs';
import * as readline from 'readline';
import { Scanner } from './scanner.ts';
import { Token } from './token.ts';


export class Lox {
    static hadError = false;

    private static report(line : number, where : string, msg : string ) {
        console.error(`[line ${line}] Error${where}: ${msg}`);
        Lox.hadError = true; 
    }

    static error(line : number, msg : string) : void {
        Lox.report(line, "", msg);
    }

    public static main() : void {
        const args = process.argv.slice(2);

        if (args.length > 1) {
            console.log("Usage wrong");
            process.exit(64);
        } else if (args.length == 1) {
            Lox.runFile(args[0]);
        } else {
            Lox.runPrompt();
        }


    }


    private static run(source : string) : void {
        const scanner = new Scanner(source);
        const tokens : Array<Token> = scanner.scanTokens();
        
        for (let token of tokens) {
            console.log(token.toString());
        }
    }

    private static runFile(path : string) : void {
        let source = "";
        fs.readFile(path, (err, data) => {
            if (err) throw err;
            source = data.toString();
        })

        Lox.run(source);

        if (Lox.hadError) process.exit(64);
    }

    private static runPrompt() : void {
        const input = process.stdin;
        const output = process.stdout;
        const rl = readline.createInterface({ input , output, prompt: "> "});


        let shouldExit = false;

        rl.prompt();
        rl.on('line', (line) => {
            Lox.run(line);
            Lox.hadError = false;
            rl.prompt();
        }).on('close', () => {
            shouldExit = true;
        });

        if (shouldExit) {
            rl.close();
            return;
        }
    }

}
