import { Expr } from './expr.ts';
import { Token } from './token.ts';
import { TokenType } from './tokentype.ts';

export class AstPrinter implements Expr.Visitor<string> {

    private parenthesize(name : string, exprs : Array<Expr.Expr>) {
        const builder : Array<string> = [];

        builder.push('(')
        builder.push(name);
        
        for (let expr of exprs) {
            builder.push(" ");
            builder.push(expr.accept(this));
        }

        builder.push(")");

        return builder.reduce((prev, curr) => prev.concat(curr));
    }

    print(expr : Expr.Expr) : string {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: Expr.Binary): string {
        return this.parenthesize(expr.operator.lexeme, [expr.left, expr.right]);
    }

    visitGroupingExpr(expr: Expr.Grouping): string {
        return this.parenthesize("group", [expr.expression]);
    }

    visitLiteralExpr(expr: Expr.Literal): string {
        if (expr.value == null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr(expr: Expr.Unary): string {
        return this.parenthesize(expr.operator.lexeme, [expr.right]);
    }
}