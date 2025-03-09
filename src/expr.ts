import { Token } from './token';
export namespace Expr {

	export interface Visitor<R> {
		 visitBinaryExpr(expr : Expr.Binary) : R;
		 visitGroupingExpr(expr : Expr.Grouping) : R;
		 visitLiteralExpr(expr : Expr.Literal) : R;
		 visitUnaryExpr(expr : Expr.Unary) : R;
	}

	export abstract class Expr {
		abstract accept<R> (visitor : Visitor<R>) : R;
	}

	export class Binary extends Expr {
		readonly left : Expr;
		readonly operator : Token;
		readonly right : Expr;

		constructor(left : Expr, operator : Token, right : Expr, ) {
			super();
			this.left = left;
			this.operator = operator;
			this.right = right;
		}

		accept<R> (visitor : Visitor<R>) : R {
			return visitor.visitBinaryExpr(this);
		}

	}

	export class Grouping extends Expr {
		readonly expression : Expr;

		constructor(expression : Expr, ) {
			super();
			this.expression = expression;
		}

		accept<R> (visitor : Visitor<R>) : R {
			return visitor.visitGroupingExpr(this);
		}

	}

	export class Literal extends Expr {
		readonly value : unknown;

		constructor(value : unknown, ) {
			super();
			this.value = value;
		}

		accept<R> (visitor : Visitor<R>) : R {
			return visitor.visitLiteralExpr(this);
		}

	}

	export class Unary extends Expr {
		readonly operator : Token;
		readonly right : Expr;

		constructor(operator : Token, right : Expr, ) {
			super();
			this.operator = operator;
			this.right = right;
		}

		accept<R> (visitor : Visitor<R>) : R {
			return visitor.visitUnaryExpr(this);
		}

	}


}