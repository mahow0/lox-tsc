import * as fs from 'fs';

const args = process.argv.slice(2);
if (args.length != 1) {
    console.error("Usage: bun run generateAst.ts <output directory>");
    process.exit(64);
}
const outputDir : string = args[0];

function defineAst(outputPath : string, baseName : string, types : Array<string>) : void {

    const path : string = outputPath + '/' + baseName + '.ts';
    const stream = fs.createWriteStream(path);
    stream.write(`export namespace ${baseName} {\n`);
    stream.write('\n');

    defineVisitor(stream, baseName, types);
    stream.write('\n\n');

    stream.write(`\texport abstract class ${baseName} {\n`);
    stream.write(`\t\tabstract accept<R> (visitor : Visitor<R>) : R;`)
    stream.write('\n')
    stream.write('\t}')
    stream.write('\n\n');

    for (let type of types) {
        const split = type.split(':');
        const className = split[0].trim();
        const fields = split[1].trim();
        defineType(stream, baseName, className, fields);
        stream.write('\n\n')
    }
    

    stream.write('\n')
    stream.write('}');
    stream.close();

}

function defineType(stream : fs.WriteStream, baseName : string, className : string, fields : string) {

    stream.write(`\texport class ${className} extends ${baseName} {\n`);
    const fieldSplit = fields.split(', ');
    const fieldList : Array<string[]> = new Array();
    for (let field of fieldSplit) {
        const split = field.split(" ");
        const fieldType = split[0];
        const fieldName = split[1];
        fieldList.push([fieldType, fieldName]); 
    }

    for(let field of fieldList) {
        const fieldType = field[0];
        const fieldName = field[1]; 
        stream.write(`\t\treadonly ${fieldName} : ${fieldType};\n`);
    }

    stream.write('\n');
    stream.write(`\t\tconstructor(`)
    for(let field of fieldList) {
        const fieldType = field[0];
        const fieldName = field[1]; 
        stream.write(`${fieldName} : ${fieldType}, `);
    }
    stream.write(') {\n');
    stream.write('\t\t\tsuper();\n')
    for (let field of fieldList) {
        const fieldName = field[1]; 
        stream.write(`\t\t\tthis.${fieldName} = ${fieldName};\n`);
    }
    stream.write('\t\t}\n\n')
    
    stream.write(`\t\taccept<R> (visitor : Visitor<R>) : R {\n`);
    stream.write(`\t\t\treturn visitor.visit${className}${baseName}(this);\n`)
    stream.write('\t\t}\n\n')

    stream.write(`\t}`)

}

function defineVisitor(stream : fs.WriteStream, baseName : string, types : Array<string>) {
    stream.write('\texport interface Visitor<R> {\n');
    
    for (let type of types) {
        const typeName = type.split(':')[0].trim();
        stream.write(`\t\t visit${typeName}${baseName}(${baseName.toLowerCase()} : ${baseName}.${typeName}) : R;\n`);
    }

    stream.write('\t}');
}

defineAst(outputDir, 'Expr', 
["Binary   : Expr left, Token operator, Expr right",
"Grouping : Expr expression",
"Literal  : unknown value",
"Unary    : Token operator, Expr right"]
);

/*
namespace Expr {

    interface Visitor<R> {
        visitBinExpr(expr : Expr.Bin) : R;
        ...
    }

    export abstract class Expr {
        abstract accept<R> (visitor : Visitor<R>) : R;
    }

    export class Bin extends Expr {
        
        <fields>
        accept<R> (visitor : Visitor<R>) : R {
            return visitor.visitBinExpr(this);
        }
    }

    ...
}
*/

