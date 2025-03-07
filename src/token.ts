
import { TokenType } from './tokentype.ts';
export class Token {

    private type : TokenType;
    private lexeme : string;
    private literal : unknown;
    private line: number;

    constructor(type : TokenType, lexeme : string, literal : unknown, line : number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }


    public toString () : string {
        return `${TokenType[this.type]} ${this.lexeme} ${this.literal}`;
    }
}



