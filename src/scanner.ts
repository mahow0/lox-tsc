import { Token } from "./token";
import { TokenType } from "./tokentype";
import { Lox } from './lox.ts'

// checks whether a single character is alphabetical
function isAlpha(str : string) : boolean {
    return /^[A-Za-z]$/.test(str);
}

// checks whether a single character is numerical
function isDigit(str : string) : boolean {
    return /^[0-9]$/.test(str);
}

function isAlphaNum(str : string) : boolean {
    return (isAlpha(str) || isDigit(str));
}


const keywords : Map<String, TokenType> = new Map(
    [
        ["and", TokenType.AND],
        ["class", TokenType.CLASS],
        ['else', TokenType.ELSE],
        ['false', TokenType.FALSE],
        ['fun', TokenType.FUN],
        ['for', TokenType.FOR],
        ['if', TokenType.IF],
        ['nil', TokenType.NIL],
        ['or', TokenType.OR],
        ['print', TokenType.PRINT],
        ['return', TokenType.RETURN],
        ['super', TokenType.SUPER],
        ['this', TokenType.THIS],
        ['true', TokenType.TRUE],
        ['var', TokenType.VAR],
        ['while', TokenType.WHILE]
    ]
)  


export class Scanner {

    private source : string;
    private readonly tokens : Array<Token> = new Array<Token>();
    private static readonly keywords : Map<String, TokenType> = keywords;
    private start : number = 0;
    private current : number = 0;
    private line : number = 1;

    constructor(source : string) {
        this.source = source;
    }

    private identifier() : void {

        while(isAlphaNum(this.peek())) this.advance();

        const value = this.source.substring(this.start, this.current);
        const keywordLookup = Scanner.keywords.get(value);
        const tokenType = (keywordLookup != undefined) ? keywordLookup : TokenType.IDENTIFIER;  
        this.pushToken(tokenType, value)
    }

    private number() : void { 

        while(isDigit(this.peek())) this.advance();

        if (this.peek() == '.' && isDigit(this.peekNext())) {
            this.advance();

            while(isDigit(this.peek())) this.advance();
        }


        const value = parseFloat(this.source.substring(this.start, this.current));
        this.pushToken(TokenType.NUMBER, value);

    }

    private string() : void { 

        while(this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n') this.line++;
            this.advance();
        }

        if (this.isAtEnd()) {
            Lox.error(this.line, "Unterminated string");
            return;
        }

        this.advance();

        const value = this.source.substring(this.start + 1, this.current - 1);
        this.pushToken(TokenType.STRING, value);
    }

    private peek() : string {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }

    private peekNext() : string {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source.charAt(this.current + 1);
    }

    private isAtEnd() : boolean {
        return this.current >= this.source.length; 
    }

    private advance() : string {
        return this.source.charAt(this.current++);
    }
    
    private pushToken(type : TokenType, literal : unknown) : void {
        const text = this.source.slice(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }
    private addToken(type : TokenType) : void { 
        this.pushToken(type, null);
    }

    private match(expected : string) : boolean {
        if (this.isAtEnd()) return false;
        const currentChar = this.source.charAt(this.current);
        
        if (currentChar != expected) return false;

        this.current++;
        return true;

    }
    private scanToken() : void {
        const c = this.advance();
        switch (c) {
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case '*': this.addToken(TokenType.STAR); break;
            case '!': 
                this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG); 
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '/':
                if (this.match('/')) {
                    while (!this.isAtEnd() && this.peek() != '\n') this.advance();
                }
                else {
                    this.addToken(TokenType.SLASH);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                break;
            
            case '\n':
                this.line++;
                break;
            
            case '"': this.string(); break;
            default:
                if (isDigit(c)) {
                    this.number();
                }
                else if (isAlpha(c)) {
                    this.identifier();
                }
                else {
                    Lox.error(this.line, "Unexpected character.");
                }
                break;
        }

    }

    public scanTokens() : Array<Token> {
        while(!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }




}